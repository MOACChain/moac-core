pragma solidity ^0.4.11;
//David Chen
//Moac System Contract
//

contract MoacSysContract  {

    struct delayedSendTask {
        uint block; // block# task executed on
		address from; //from address
        address to; // target address
        uint256 value;   // value
        bytes data; //data associated
    }
    
    struct delayedQueryTask {
        uint block; // block# task executed on
        address to; // target address
		bytes data; //data associated
    } 

    struct voteProposal {
        uint expireblk;
        uint256 totalvotepower;
        address[] voters;
		bool isValue;
    }
    
    mapping(uint => delayedSendTask[]) sendQueue;
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
    
    //constructor
    function MoacSysContract() public {
		curVersion = 0;
		curCodeHash = 0;
		upgradeHash = 0;
		upgradeWaitingBlock = 0;
		chkpt = 5;
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
			if( blkarrysize >= 4 )
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
        
    	uint j=0;
    	task.data = new bytes(32);

		//address
		for(  j=0; j< 12; j++ )
			task.data[j] = 0;

		for(  j=0; j<20; j++ )
			task.data[12+j] = byte(uint8(uint(msg.sender) / (2**(8*(19 - j)))));
								        
		
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

				bool result = task.to.call.gas(100000).value(task.value)(task.data);
				if(result)
				{
					LogStep("task executed properly");
				    uint k=0;
				}else{
					LogStep("task execuated falied");
				
				}
			}
            
        }else{
			LogStep("nothing to send");
		}

		
    }
        
    // send task
    function queryTask( ) public {
		//test
		
    }

    function() public {
        revert();
    }

}



//b81fa3f5: checkUpgradable()
//def0412f: delayedSend(uint256,address,uint256)
//def0412f: delayedSend(uint256,address,uint256)
//6111ca21: enroll(address,uint256)
//4ad7595b: joinSCS(address,uint256)
//aea722e8: queryTask()
//650aed4f: sendTask()








