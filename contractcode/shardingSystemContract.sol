pragma solidity ^0.4.11;
//David Chen
//Sharding System Contract
//
contract Precompiled9 {
  function localShardCheckAndEnroll (address , address, uint256, uint) returns (uint);
}
contract Precompiled10 {
  function checkShardValid(address, address, uint256) returns(uint);
}



contract ShardingSysContract  {

    struct SCS {
        address from; //address as id
        uint256 bond;   // value
        uint cap; //capacity of the node
		uint state; //0:inactive 1:performing 2:withdraw pending 3:initial pending
    }
    
	struct ShardingContract {
		address owner;
		address self;
		uint minMember;
		uint256 createAt;
		address[] members;
	}
	
    mapping(address => SCS) SCSList;
	mapping(uint => SCS) initialPendingQueue;
	mapping(uint => SCS) withdrawPendingQueue;
	mapping(address => ShardingContract) ShardingList;
	
	Precompiled9 prec9 = Precompiled9(0x0000000000000000000000000000000000000009);
	Precompiled10 prec10 = Precompiled10(0x000000000000000000000000000000000000000a);


    //version
    uint curVersion;
	uint totalRegisterCnt;
    uint intitialPending = 8640*3;
	uint withdrawPedning = 8640*14;
	
    //events
	event Register(uint cap);
	event UnRegister(address sender, uint256 bond);

	event JoinShard(address sender, address shardingaddress, string info);
	event LogStep(string info);
    
    //constructor
    function ShardingSysContract() public {
		curVersion = 0;
		totalRegisterCnt =0;
    }

	// register for SCS
    function register(uint cap) public payable returns (bool success) {
		LogStep("register called.");
        //already registered
		if (SCSList[msg.sender].state > 0 ){
			revert();
		}

		SCS storage scs;
		scs.from = msg.sender;
		scs.bond = msg.value;
		scs.cap = cap;
		scs.state = 1;  //for testing only
		SCSList[msg.sender] = scs;
		Register(cap);
		LogStep("register ok.");
		totalRegisterCnt ++;

		return true;
    }
	
	// unregister for SCS
    function unRegister() public returns (bool success) {
		LogStep("register called.");
       //only can unregister when active
		if (SCSList[msg.sender].state != 1 ){
			revert();
		}
		
		uint256 bond = SCSList[msg.sender].bond;
		SCSList[msg.sender].state = 0;
		SCSList[msg.sender].bond = 0;
		SCSList[msg.sender].from.transfer(bond);
		LogStep("unregister ok.");
		totalRegisterCnt--;
		
		UnRegister(msg.sender, bond);
		return true;
    }
	
	//create
    function createSharding(address shardingaddress, uint minMember) public payable returns (bool success) {
		LogStep("createSharding called.");

		//check if already created sharding
		if(ShardingList[shardingaddress].minMember > 0 )
		{
			// for test only
			LogStep("createSharding already set for this address.");
			//return false;
			//revert();
		}
		
		//check if shardingaddress already exists
		
		//create entry
		ShardingContract storage cnt ;
		cnt.self = shardingaddress;
		cnt.owner = msg.sender;
		cnt.minMember = minMember;
		cnt.createAt = block.number;
		
		ShardingList[shardingaddress] = cnt;
		
		//add check
		LogStep("sharding datastructure added.");
		
		//get current multiplier
		uint multi = uint(totalRegisterCnt/minMember);
		
        //call lib to dertermine if current is selected. 
		prec9.localShardCheckAndEnroll(msg.sender, shardingaddress, block.number, multi);
		
		LogStep("additional check and enrollment initiated.");
		return true;
    }

	
	//create
    function joinShard(address shardingaddress) public returns (bool success) {
		LogStep("joinShard called.");
		//check if already created sharding
		if(ShardingList[shardingaddress].minMember == 0 )
		{
			LogStep("createSharding note called.");
			//return false;
			//revert();
		}

	
		bool res = prec10.checkShardValid(msg.sender, shardingaddress, ShardingList[shardingaddress].createAt);
		
		if( res )
		{
			LogStep("verified ok.");
			ShardingList[shardingaddress].members.push(msg.sender);
			JoinShard(msg.sender, shardingaddress, "ok");
		
			return true;
		}else{
			LogStep("verified failed.");
			JoinShard(msg.sender, shardingaddress, "failed");
			return false;
		}
    }
	
		


    function() public {
		LogStep("default fallback called.");
	
        revert();
    }

}



//376329ec: createSharding(address,uint256)
//4f69190d: joinShard(address)
//f207564e: register(uint256)
//26d7b3b4: unRegister()
//51163670: testEcrecover()
//2e9a6539: testSha()





