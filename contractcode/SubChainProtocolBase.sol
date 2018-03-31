pragma solidity ^0.4.11;
//David Chen
//Subchain definition for application.

contract SysContract {
  function delayedSend(uint _blk, address _to,  uint256 _value, bool bonded) public returns (bool success);
}

contract SubChainProtocolBase {

/*
 * Basic SCS structure
*/
    struct SCS {
        address from; //address as id
        uint256 bond;   // value

		uint state; //0:not-registered 1:performing 2:withdraw pending 3:initial pending 4. withdraw done 5. inactive
		uint256 registerblock;
		uint256 withdrawblock;
    }

	
	struct SCSApproval {
		uint bondApproved;
		uint bondedCount;
		address[] subchainaddr;
		uint[] amount;
	}

    mapping(address => SCS) public SCSList;
    mapping(address => SCSApproval) public SCSApprovalList;

    uint public SCSCount;
	string public SubChainProtocol;
	uint public bondMin;
	uint public PEDNINGBLOCK = 50;
	uint public WITHDRAWBLOCK = 8640;
	SysContract constant sysContract = SysContract(0x0000000000000000000000000000000000000065); 

    //events
	event Register(address scs);
	event UnRegister(address sender);

    
    //constructor
	//bmin - minimum deposit requirement in unit of Sha, 1 mc = 
	//
    function SubChainProtocolBase(string protocol, uint bmin) public {
		SCSCount = 0;
		SubChainProtocol = protocol;
		bondMin = bmin;
    }

	// register for SCS
	// SCS will be notified through 3rd party communication method. SCS will need to register here manually.
	// One protocol base can have several different subchains.
    function register(address scs) public payable returns (bool) {
        //already registered or not enough bond
		require ((SCSList[scs].state == 0 || SCSList[scs].state == 5) && msg.value >= bondMin );

		SCSList[scs].from = scs;
		SCSList[scs].bond = msg.value;
		SCSList[scs].state = 1;
		SCSList[scs].registerblock = block.number + PEDNINGBLOCK;
		SCSList[scs].withdrawblock = 2**256-1;
		SCSCount ++;
		return true;
    }
	
	// withdrawRequest for SCS
    function withdrawRequest() public returns (bool success) {
        //only can withdraw when active
		require (SCSList[msg.sender].state == 1 );
		
		SCSList[msg.sender].withdrawblock = block.number;
		SCSList[msg.sender].state = 2;

		SCSCount--;
		
		UnRegister(msg.sender);
		return true;
    }
	
	function withdraw() public {
		if(SCSList[msg.sender].state == 2 && block.number > (SCSList[msg.sender].withdrawblock + WITHDRAWBLOCK))
		{
			SCSList[msg.sender].state == 4;
			SCSList[msg.sender].from.transfer(SCSList[msg.sender].bond);
		}
	}

	function isPerforming(address _addr) view public returns (bool res){
		return (SCSList[_addr].state == 1 && SCSList[_addr].registerblock < block.number);
	}

	function getSelectionTarget(uint thousandth, uint minnum) view public returns (uint target) {   
		// find a target to choose thousandth/1000 of total scs
		if(minnum < 50 ) {
			minnum = 50;
		}
		
	    if ( SCSCount < minnum)             // or use SCSCount* thousandth / 1000 + 1 < minnum
		    return 255;

       uint m = thousandth * SCSCount / 1000 ;
	   
	   if ( m < minnum )
	        m = minnum;

		target = (m * 256 / SCSCount+1) / 2 ;     

		return target;
	}

	//display approved scs list
    function approvalAddresses(address addr) public view returns (address[]) {
        address[] memory res = new address[](SCSApprovalList[addr].bondedCount);
		for( uint i=0; i<SCSApprovalList[addr].bondedCount; i++ ){
		    res[i] = (SCSApprovalList[addr].subchainaddr[i]);
		}
		return res;
    }
    
	//display approved amount array
    function approvalAmounts(address addr) public view returns (uint[]) {
        uint[] memory res = new uint[](SCSApprovalList[addr].bondedCount);
		for( uint i=0; i<SCSApprovalList[addr].bondedCount; i++ ){
		    res[i] = (SCSApprovalList[addr].amount[i]);
		}
		return res;    
        
    }    

	//approve the bond to be deduced if act maliciously
	function approveBond(address scs, uint amount, uint8 v, bytes32 r, bytes32 s) public returns (bool){
		//make sure SCS is performing
		if( !isPerforming(scs) )
			return false;

		//verify signature
		//combine scs and subchain address
		bytes32 hash = sha256(scs, msg.sender);
		
		//verify signature matches. 
		if( ecrecover(hash, v, r, s) != scs){
			return false;
		}

		//check if bond still available for SCSApproval
		if( SCSList[scs].bond < (SCSApprovalList[scs].bondApproved + amount))
			return false;

		//add subchain info			
		SCSApprovalList[scs].bondApproved += amount;
		SCSApprovalList[scs].subchainaddr.push(msg.sender);
		SCSApprovalList[scs].amount.push(amount);
		SCSApprovalList[scs].bondedCount ++;
		
		return true;
	}

	//must called from SubChainBase
	function forfeitBond(address scs, uint amount) public payable returns (bool) {
		//check if subchain is approved
		for( uint i=0; i<SCSApprovalList[scs].bondedCount; i++ ){
			if( SCSApprovalList[scs].subchainaddr[i] == msg.sender && SCSApprovalList[scs].amount[i] == amount){

				//delete array item by moving the last item in current postion and delete the last one
				SCSApprovalList[scs].bondApproved -= amount;
				SCSApprovalList[scs].bondedCount --;
				SCSApprovalList[scs].subchainaddr[i] = SCSApprovalList[scs].subchainaddr[SCSApprovalList[scs].bondedCount];
				SCSApprovalList[scs].amount[i] = SCSApprovalList[scs].amount[SCSApprovalList[scs].bondedCount];

				delete SCSApprovalList[scs].subchainaddr[SCSApprovalList[scs].bondedCount];
				delete SCSApprovalList[scs].amount[SCSApprovalList[scs].bondedCount];
				SCSApprovalList[scs].subchainaddr.length --;
				SCSApprovalList[scs].amount.length --;
				
				//doing the deduction
				SCSList[scs].bond -= amount;
				msg.sender.transfer(amount);

				return true;
			}
		}

		return false;
	}

	//user to request to release from a subchain
	function releaseBond(address scs, uint amount, uint8 v, bytes32 r, bytes32 s) public returns (bool){
		//verify signature
		//combine scs and subchain address
		bytes32 hash = sha256(scs, msg.sender);
		
		//verify signature matches. 
		if( ecrecover(hash, v, r, s) != scs){
			return false;
		}

		//add subchain info			
		for( uint i=0; i<SCSApprovalList[scs].bondedCount; i++ ){

			if( SCSApprovalList[scs].subchainaddr[i] == msg.sender && SCSApprovalList[scs].amount[i] == amount){

				SCSApprovalList[scs].bondApproved -= amount;
				SCSApprovalList[scs].bondedCount --;
				SCSApprovalList[scs].subchainaddr[i] = SCSApprovalList[scs].subchainaddr[SCSApprovalList[scs].bondedCount];
				SCSApprovalList[scs].amount[i] = SCSApprovalList[scs].amount[SCSApprovalList[scs].bondedCount];

				//clear
				delete SCSApprovalList[scs].subchainaddr[SCSApprovalList[scs].bondedCount];
				delete SCSApprovalList[scs].amount[SCSApprovalList[scs].bondedCount];
				SCSApprovalList[scs].subchainaddr.length --;
				SCSApprovalList[scs].amount.length --;

				break;
			}
			
		}
		
		return true;
	}

    function() public {
        revert();
    }

}
