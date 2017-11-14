pragma solidity ^0.4.11;
//David Chen
//Moac System Contract
//

contract Precompiled9 {
  function localShardCheckAndEnroll (address , address, uint256, uint) returns (uint);
}
contract Precompiled10 {
  function checkShardValid(address, address, uint256) returns(uint);
}


contract Precompiled11 {
  function queryContract (uint num, address[]) returns (uint);
}

contract Precompiled12 {
  function delegateSend (address, address, uint256) returns (uint);
}

contract MoacSysContract  {

    struct delayedSendTask {
        uint block; // block# task executed on
		address from; //from address
        address to; // target address
        uint256 value;   // value
        //bytes data; //data associated
    }
    

    struct voteProposal {
        uint expireblk;
        uint256 totalvotepower;
        address[] voters;
		bool isValue;
    }
    
	uint constant QueueSize  = 4;
	Precompiled9 prec9  ; 
	Precompiled10 prec10; 
	Precompiled11 prec11; 
	Precompiled12 prec12; 
	
    mapping(uint => delayedSendTask[]) sendQueue;
    mapping(uint => address[]) queryQueue;
    mapping(uint => uint) sendQueueSize;

    //version
    uint curVersion;
    bytes32 curCodeHash;
	bytes32 upgradeHash;
	uint upgradeWaitingBlock;
	uint chkpt;
    
    //events
    event DelayedSend(uint _blk, address _to,  uint256 _value);
    event UpgradeProposal(bytes32 hash, uint expireblk);
	event Enroll(address _from, uint256 _value);
	event JoinSCS(address _to, uint256 _value) ;
	event DelayArrayFull(uint _blk);
	event DelayArrayRegistered(uint _blk, address from);
	event LogStep(string info);
	event AddQueryTask(uint[] blks, address[] addrs );
	event QueryContract(uint blk, address[] memaddr);
    
    //init
    function init() public {
		curVersion = 0;
		curCodeHash = 0;
		upgradeHash = 0;
		upgradeWaitingBlock = 0;
		chkpt = 5;
		
		prec9  = Precompiled9 (0x0000000000000000000000000000000000000009);
		prec10 = Precompiled10(0x000000000000000000000000000000000000000a);
		prec11 = Precompiled11(0x000000000000000000000000000000000000000b);
		prec12 = Precompiled12(0x000000000000000000000000000000000000000c);

	}

    //used for SCS to enroll to processing contract in a sharding setup
    function enroll(address _from, uint256 _value) public returns (bool success) {
        //
		Enroll(_from, _value);
		return true;
    }

    function joinSCS(address _to, uint256 _value) public returns (bool success) {
        //todo
		JoinSCS(_to, _value);
		return true;
    }


	//called by internal to check if need upgrade
    function checkUpgradable () public returns (bool success) {
		if( upgradeWaitingBlock == 0 ){
			return false;
		}
		
		if( upgradeWaitingBlock > 1 ){
			upgradeWaitingBlock--;
			return false;
		}
		
		if( upgradeWaitingBlock == 1 ) {
			curCodeHash = upgradeHash;
			curVersion ++;
			upgradeWaitingBlock = 0;
		}
		return true;
    }
	
    
    // used for queue user request and send it later
    function  delayedSend( uint _blk, address _to,  uint256 _value) public payable returns (bool success)   {
		chkpt = _blk * 1000;
		uint i =0;
		uint step =0;
        //if already scheduled at that block
		uint blkarrysize = sendQueueSize[_blk] ;
		if( blkarrysize > 0 )
		{
			chkpt += 100;
			if( blkarrysize >= QueueSize )
			{
				//array full
				DelayArrayFull(_blk);
				LogStep("task array full");
				return false;
			}			
			
			for(  i=0; i< blkarrysize; i++ )
			{
				if( sendQueue[_blk][i].from == msg.sender){
					//only one sender per block
					DelayArrayRegistered(_blk, msg.sender);
					LogStep("previous task already scheduled for this sender");
					return false;
				}
			}
			sendQueueSize[_blk] ++;
			
        }
		else
		{	
			chkpt += 200;
			//allocate array
			delayedSendTask[4] storage taskarry ;
			sendQueue[_blk] = taskarry;
			blkarrysize = 0;
			sendQueueSize[_blk] = 1;
			
			LogStep("created new array for block");
		}
		
        delayedSendTask storage task ;
        task.from = msg.sender;
        task.block = _blk;
        task.to = _to;
        task.value = _value;
        							        
		
		//update
		sendQueue[_blk][blkarrysize] = task;

		LogStep("task added to array");
        DelayedSend( _blk, _to,  _value);
		
		return true;
    }
    
    // send task
    function sendTask( ) public {

		//this can only be called by system call addr
		if( msg.sender != 100 )
			revert();
			
		//check each task and send out
		uint blk = block.number;
	
        if(sendQueueSize[blk] > 0 ){
			uint blkarrysize = sendQueueSize[block.number] ;

			for( uint i=0; i< blkarrysize; i++ )
			{

				delayedSendTask  storage  task =  sendQueue[block.number][i];
				LogStep("task ready to execute for the block");

				prec12.delegateSend(task.from, task.to, task.value);
				LogStep("task executed properly");
			}
            
        }else{
			LogStep("nothing to send");
		}

		
    }
        
    // add query task
    function addQueryTask(uint[] blks, address[] addrs ) public {
		//this can only be called by system call addr
		if( msg.sender != 100 )
			revert();

		//
		if( blks.length != addrs.length )
		{
			LogStep("parameter incorrect");
			revert();
		}
			
		uint curblk = block.number;
		
		for( uint i=0; i< blks.length; i++ ){
			//only add future blk query
			if( blks[i] > curblk )
			{
				queryQueue[blks[i]].push(addrs[i]);

			}
		}
		
		AddQueryTask(blks, addrs );
    }

    // send task
    function queryTask( ) public {
		//this can only be called by system call addr
		if( msg.sender != 100 )
			revert();

		uint curblk = block.number;
		if( queryQueue[curblk].length > 0 ) {
			//get address intomemory
			address[] memory memaddr = new address[](queryQueue[curblk].length);
			
			for( uint i=0; i<queryQueue[curblk].length; i++ )
			{
				memaddr[i] = queryQueue[curblk][i];
			}
		
			prec11.queryContract(queryQueue[curblk].length, memaddr);
			QueryContract(queryQueue[curblk].length, memaddr);
			
		}
		
    }	
	
    // send task
    function exec( ) public {
		if( msg.sender != 100 )
			revert();
		
		queryTask();
		sendTask();
	}
	
    function() public {
        revert();
    }

}



//726bbce8: addQueryTask(uint256[],address[])
//b81fa3f5: checkUpgradable()
//def0412f: delayedSend(uint256,address,uint256)
//6111ca21: enroll(address,uint256)
//4ad7595b: joinSCS(address,uint256)
//aea722e8: queryTask()
//650aed4f: sendTask()
//c1c0e9c4: exec()
//e1c7392a: init()




