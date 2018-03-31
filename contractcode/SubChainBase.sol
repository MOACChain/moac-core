pragma solidity ^0.4.11;
//David Chen
//Subchain protocol definition for consenus.
//It also contains the logic to allow user to join this 
//pool with bond
import './SubChainProtocolBase.sol';

contract SCSRelay {
	// 0-registeropen, 1-registerclose, 2-createproposal, 3-disputeproposal, 4-approveproposal
	function notifySCS(address cnt, uint msgtype) public returns (bool success) ;
}

contract SubChainBase {

	struct proposal {
		address proposedBy;
		bytes32 lastApproved;
		bytes32 hash;
		//bytes newState;
		uint[] distributionAmount;
		uint flag; // 1-pending, 2-disputed 3-approved, 4-rejected, 5-expired  6-pendingAccept
		uint startingBlock;
		uint[] voters; //voters index
		uint votecount;
		bytes32 nextDisputeHash;
		bytes32 disputeOnHash;
	}

	struct VRS {
		bytes32 r;
		bytes32 s;
		uint8 v;
	}

	struct SyncNode {
		address nodeid;
		string link;
	}

	address public Protocol;
    uint public MinMember;
	uint public MaxMember;
	uint public SelTarget;
	uint public ConsensusFlag; // 0: init stage 1: working stage 2: failure
	uint public FlushInRound;
	bytes32 public ProposalHashInProgress;
	bytes32 public ProposalHashApprovedLast;  //index: 8
	uint curFlushIndex;
	uint pendingFlushIndex;
	
	bytes public FuncCode;
	bytes State;

	uint lastFlushBlk;

	address owner;

	//nodes list is updated at each successful flush
    uint public NodeCount;
    address[] public NodeList;

	uint8[2] public RandIndex;
	mapping(address => uint ) public NodePerformance;
	mapping(bytes32 => proposal) public Proposals;
	mapping(address => uint ) public CurrentRefundGas;

	bool registerFlag;

	SCSRelay constant scsrelay = SCSRelay(0x000000000000000000000000000000000000000d); 
	uint public constant NodeInitPerformance = 5;
	uint public ProposalExpiration = 12;
	uint public PenaltyBond = 10**18;
	mapping(address=>address) public ScsBeneficiary;
	uint public BlockReward = 5*10**13;
	uint public TXReward = 1 * 10**11;

	uint public NodeToReleaseCount;
	uint[5] public NodesToRelease;  //nodes wish to withdraw, only allow 5 to release at a time
	mapping(address=>VRS) NodesToReleaseVRS;
	uint[] public NodesToDispel;

	address[] public NodesToJoin;  //nodes to be joined
	uint public JoinCntMax;
	uint public JoinCntNow;
	uint public MonitorFee = 1 * 10**15;
	mapping(address=>uint) public NodesWatching;  //nodes watching	

	SyncNode[] public SyncNodes;

    //constructor
    function SubChainBase(address proto, uint min, uint max, uint thousandth, uint flushRound) public {
		SubChainProtocolBase protocnt = SubChainProtocolBase(proto);
		SelTarget = protocnt.getSelectionTarget(thousandth, min);

		MinMember = min;
		MaxMember = max;
		Protocol = proto;
		ConsensusFlag = 0;
		//DirectCallGas = 100;
		owner = msg.sender;

		FlushInRound = flushRound;
		if ( FlushInRound <= 2 )
			FlushInRound = 2;
		lastFlushBlk = 2**256-1;

		RandIndex[0] = uint8(0);
		RandIndex[1] = uint8(1);
    }

	function SetOwner() public {
		if ( owner == address(0) ) {
			owner = msg.sender;
		}
	}

    function DeployCode(bytes code) public {
		require(msg.sender == owner);
		FuncCode = code;
    }
	

	function IsMemberValid( address addr ) public view returns (bool) {
		return NodePerformance[addr] > 0;
	}

	function MatchSelTarget(address addr, uint8 index1, uint8 index2) private view returns (bool){
		// check if seltargetdist matches.
		uint addr0 = getindexByte(addr, index1, index2);         
		uint cont0 = getindexByte(address(this), index1, index2);

        if ( SelTarget == 255 ) 
		    return true;

        if( addr0 >= cont0 ){ 
		   if( ( addr0 - cont0 ) <= SelTarget){
		       return true;
		   }else{
		      if (cont0 - SelTarget < 0  ) {
			     if((addr0 - cont0 ) >= 256 - SelTarget   )  //lower half round to top,  addr0 -256 >= cont0 -SelTarget
				     return true;
			     return false;
			  }  
			  return false;
		   }		    		   
		}else{   //addr0 < cont0
		
		   if( (cont0 - addr0) <= SelTarget){
		       return true;
		   }else{
		      if (cont0 + SelTarget >= 256  ) {
			     if((cont0- addr0) >= 256- SelTarget)  //top half round to bottom,   addr0 +256  <= (SelTarget+cont0)
				     return true;
			     return false;
			  }  
			  return false;
		   }	
		}


		return true;
	}

	function IsSCSValid(address addr) private view returns (bool) {

		if( !IsMemberValid(addr))
			return false;

		//no need to check this again if nodes already in list 
		//if( !MatchSelTarget(addr, RandIndex[0], RandIndex[1])) 
		//	return false;

		//check if valid registered in protocol pool
		SubChainProtocolBase protocnt = SubChainProtocolBase(Protocol);
		if( !protocnt.isPerforming(addr) )
			return false;

		return true;
	}

	function IsMonitor(address monitor) public view returns(bool) {
		return NodesWatching[monitor] == 1;
	}

	function RegisterAsMonitor(address monitor) public payable {
		require(msg.value >= MonitorFee );
		require(NodesWatching[monitor] == 0 );
		require(monitor != address(0));
		NodesWatching[monitor] = 1;
	}

	//v,r,s are the signature of msg hash(scsaddress+subchainaddr)
	function RegisterAsSCS(address beneficiary, uint8 v, bytes32 r, bytes32 s) public returns (bool) {
		
		//uint gas = msg.gas;
		if( !registerFlag )
			return false;

		//check if valid registered in protocol pool
		SubChainProtocolBase protocnt = SubChainProtocolBase(Protocol);
		if( !protocnt.isPerforming(msg.sender) )
			return false;

		if( !MatchSelTarget(msg.sender, RandIndex[0], RandIndex[1])) 
			return false;

		//if reach max, reject
		if( NodeCount > MaxMember )
			return false;

		//check if node already registered
		for( uint i=0; i<NodeCount; i++){
			if(	NodeList[i]  == msg.sender )
				return false;
		}

		//make sure msg.sender approve bond deduction
		if( !protocnt.approveBond( msg.sender, PenaltyBond, v, r, s))
			return false;

		NodeList.push(msg.sender);
		NodeCount ++;
		NodePerformance[msg.sender] = NodeInitPerformance;

		//todo: refund gas
		//msg.sender.send(msg.gas * tx.gasprice);
		
		if( beneficiary == address(0) ){
			ScsBeneficiary[msg.sender] = msg.sender;
		}else{
			ScsBeneficiary[msg.sender] = beneficiary;
		}

		return true;
	}

	//v,r,s are the signature of msg hash(scsaddress+subchainaddr)
	function RegisterAsBackup(address beneficiary, uint8 v, bytes32 r, bytes32 s) public returns (bool) {
		
		//uint gas = msg.gas;
		if( !registerFlag )
			return false;

		//check if valid registered in protocol pool
		SubChainProtocolBase protocnt = SubChainProtocolBase(Protocol);
		if( !protocnt.isPerforming(msg.sender) )
			return false;

		if( !MatchSelTarget(msg.sender, RandIndex[0], RandIndex[1])) 
			return false;

		//if reach max, reject
		if( JoinCntNow >= JoinCntMax )
			return false;

		//check if node already registered
		for( uint i=0; i<NodeCount; i++){
			if(	NodeList[i]  == msg.sender )
				return false;
		}

		for( i=0; i<NodesToJoin.length; i++){
			if(	NodesToJoin[i]  == msg.sender )
				return false;
		}

		//make sure msg.sender approve bond deduction
		if( !protocnt.approveBond( msg.sender, PenaltyBond, v, r, s))
			return false;

		NodesToJoin.push(msg.sender);
		JoinCntNow ++;
		NodePerformance[msg.sender] = NodeInitPerformance;

		//todo: refund gas
		//msg.sender.send(msg.gas * tx.gasprice);
		
		if( beneficiary == address(0) ){
			ScsBeneficiary[msg.sender] = msg.sender;
		}else{
			ScsBeneficiary[msg.sender] = beneficiary;
		}

		return true;
	}


	//user can explicitly release
	function requestRelease(uint index, uint8 v, bytes32 r, bytes32 s) public returns (bool) {
		//only in nodelist can call this function
		require( NodeList[index] == msg.sender);
		//check if full already
		if(NodeToReleaseCount >= 5 )
			return false;

		//check if already requested
		for( uint ii=0; ii<NodeToReleaseCount; ii++){
			if(	NodesToRelease[ii]  == index ){
				return false;
			}
		}	

		//
		NodesToRelease[NodeToReleaseCount-1] = index;
		NodeToReleaseCount ++;

		//save v r s
		NodesToReleaseVRS[msg.sender].v = v;
		NodesToReleaseVRS[msg.sender].r = r;
		NodesToReleaseVRS[msg.sender].s = s;
		

		return true;
		
	}

	
	function applyJoinNodes() private {

		for( uint i=0; i<JoinCntNow; i++){
			NodeList.push(NodesToJoin[i]);
			NodeCount ++;
		}

		//clear join info
		for( i=0; i<JoinCntNow; i++){
			delete NodesToJoin[i];
		}

		JoinCntNow = 0;
		NodesToJoin.length = 0;
		JoinCntMax = 0;

	}


	// reuse this code for remove bad one or other volunteerleaving
	// nodetype 0: bad ones, 1: volunteer leaving
	function applyRemoveNodes(uint nodetype) private {
		SubChainProtocolBase protocnt = SubChainProtocolBase(Protocol);

		uint count = NodesToDispel.length;
		if( nodetype == 1){
			count = NodeToReleaseCount;
		}

		if( count == 0 )
			return;
			
		// all nodes set 0 at initial, set node to be removed as 1. 
		uint[] memory nodeMark = new uint[](NodeCount);
		uint idx = 0;
		for( uint i=0; i<count;i++){
			if( nodetype == 0 ){
				//bad ones
				nodeMark[NodesToDispel[i]] = 1;
			}else{
				idx = NodesToRelease[i];
				//volunteer leaving, only were not marked as bad ones
				if( nodeMark[idx] == 0){
					nodeMark[idx] = 1;
					//release fund
					address cur = NodeList[idx];
					protocnt.releaseBond(cur, PenaltyBond,NodesToReleaseVRS[cur].v,NodesToReleaseVRS[cur].r,NodesToReleaseVRS[cur].s);
				}
			}
		}

		//adjust to update NodeList
		for( i=NodeCount-1; i>=0; ){
			if( nodeMark[i] == 1 ){
				//swap with last element
				// remove node from list
				NodeCount --;
				NodeList[i] = NodeList[NodeCount];
				delete NodeList[NodeCount];
				NodeList.length --;
			}
			if( i==0 )
				break;
			else
			 	i--;
		}
	}


	//	uint[2] private randindex =[1,4]; 
	function getindexByte(address a, uint8 randindex1, uint8 randindex2) private  pure returns (uint b){
	    uint8 first=uint8(uint(a) / (2**(4*(39 - uint(randindex1))))* 2**4  );       
		uint8 second=uint8(uint8(uint(a) / (2**(4*(39 - uint(randindex2)))) * 2**4)/2**4);    // &15
		return uint(byte(first+second));
	}		


	function RegisterOpen() public {
		require(msg.sender == owner);
		registerFlag = true;

		//call precompiled code to invoke action on v-node
		scsrelay.notifySCS(address(this), 0);
	}

	function RegisterClose() public returns (bool) {
		require(msg.sender == owner);
		registerFlag = false;

		if( NodeCount < MinMember )
			return false;

		//now we can start to work now
		lastFlushBlk = block.number;
		curFlushIndex = 0;

		//call precompiled code to invoke action on v-node
		scsrelay.notifySCS(address(this), 1);
		return true;
	}

	function RegisterAdd(uint nodetoadd) public {
		require(msg.sender == owner);
		registerFlag = true;
		JoinCntMax = nodetoadd;
		JoinCntNow = 0;

		//call precompiled code to invoke action on v-node
		scsrelay.notifySCS(address(this), 5);
	}

	function GetEstFlushBlock(uint index) public view returns (uint){
		uint blk = lastFlushBlk + NodeCount*FlushInRound ;
		//each flusher has [0, 2*expire] to finish
		if( index >= curFlushIndex ){
			blk += ( index - curFlushIndex)* 2*ProposalExpiration;
		}else {
			blk += ( index + NodeCount - curFlushIndex)* 2*ProposalExpiration;
		}

		if( block.number < blk){
			return blk - block.number;
		}else if( block.number < (blk+ProposalExpiration)){
			return 0;
		}

		//overdue, wait for next one expires
		return ProposalExpiration;
	}

	function IsValidFlusher(uint index) public view returns (bool){
		return  GetEstFlushBlock(index) == 0 ;
	}
	

	//create proposal
	//	bytes32 hash;
	//	bytes newState;
	function CreateProposal(uint indexinlist, bytes32 lastFlushedHash, bytes32 hash, uint[] distAmount ) public returns (bool) {
		require(indexinlist < NodeCount && msg.sender == NodeList[indexinlist]);
		require(IsValidFlusher(indexinlist));

		//if already a hash proposal in progress, check if it is set to expire
		uint gasinit = msg.gas;//gasleft();
		if( Proposals[ProposalHashInProgress].flag == 1 || Proposals[ProposalHashInProgress].flag == 2)
		{
			//for some reason, lastone is not updated
			//set to expire
			Proposals[ProposalHashInProgress].flag = 5;  //expired.
			//reduce proposer's performance
			if( NodePerformance[Proposals[ProposalHashInProgress].proposedBy] > 0 ){
				NodePerformance[Proposals[ProposalHashInProgress].proposedBy] --;
			}
			
		}	

		//proposal must based on last approved hash	
		if( lastFlushedHash != ProposalHashApprovedLast)
			return false;

		//check if sender is part of SCS list
		if( !IsSCSValid(msg.sender)) 
			return false;

		//check if proposal is already in 
		if( Proposals[hash].flag > 0 )
			return false;

		//store it into storage.
		Proposals[hash].proposedBy = msg.sender;
		Proposals[hash].lastApproved = ProposalHashApprovedLast;
		Proposals[hash].hash = hash;
		//Proposals[hash].newState = newState;
		for( uint i=0; i<NodeCount; i++ ){
			Proposals[hash].distributionAmount.push(distAmount[i]);
		}
		Proposals[hash].flag = 1;
		Proposals[hash].startingBlock = block.number;
		//add into voter list
		Proposals[hash].voters.push(indexinlist);
		Proposals[hash].votecount ++;
		
		//notify v-node
		scsrelay.notifySCS(address(this), 2);

		ProposalHashInProgress = hash;
		pendingFlushIndex = indexinlist;
		CurrentRefundGas[msg.sender] += (gasinit - msg.gas)* tx.gasprice; 
		return true;
	}

	//dispute proposal
	function DisputeProposal(uint indexinlist, bytes32 disputehash, bytes32 newhash, uint[] distAmount) public returns (bool) {
		require(indexinlist < NodeCount && msg.sender == NodeList[indexinlist]);
		uint gasinit = msg.gas;

		//check if sender is part of SCS list
		if( !IsSCSValid(msg.sender)) 
			return false;

		//check if proposal is already in 
		if( Proposals[newhash].flag > 0 )
			return false;

		//check if dispute proposal is there or decision has been made
		if( Proposals[disputehash].flag == 0 || Proposals[disputehash].flag >2 )
			return false;

		//check if out of  2*expire
		if( (Proposals[disputehash].startingBlock + 2*ProposalExpiration) < block.number ){
			Proposals[disputehash].flag = 5;  //expired.				
			//reduce proposer's performance
			if( NodePerformance[Proposals[disputehash].proposedBy] > 0 ){
				NodePerformance[Proposals[disputehash].proposedBy] --;
			}
			return false;
		}else if ((Proposals[disputehash].startingBlock + ProposalExpiration) < block.number ){
			//in [expire, 2*expire] 
			//won't chanllenge any more
			return false;
		}

		//check if another dispute is there 
		if( Proposals[disputehash].nextDisputeHash > 0 )
			return false;
		

		//store it into storage.
		Proposals[newhash].proposedBy = msg.sender;
		Proposals[newhash].lastApproved = ProposalHashApprovedLast;
		Proposals[newhash].hash = newhash;
		//Proposals[newhash].newState = newState;
		for( uint i=0; i<NodeCount; i++ ){
			Proposals[newhash].distributionAmount.push(distAmount[i]);
		}
		Proposals[newhash].flag = 2; //disputed
		Proposals[newhash].startingBlock = block.number;
		Proposals[newhash].disputeOnHash = disputehash;

		//update last
		Proposals[disputehash].flag = 2; //disputed
		Proposals[disputehash].nextDisputeHash = newhash;
		//add into voter list
		Proposals[newhash].voters.push(indexinlist);
		Proposals[newhash].votecount ++;
		
		//notify v-node
		scsrelay.notifySCS(address(this), 3);
		
		CurrentRefundGas[msg.sender] += (gasinit - msg.gas)* tx.gasprice; 
		return true;
	}

	//vote on proposal
	function VoteOnProposal(uint indexinlist, bytes32 hash) public returns (bool) {
		require(indexinlist < NodeCount && msg.sender == NodeList[indexinlist]);
		uint gasinit = msg.gas;
		//check if sender is part of SCS list
		if( !IsSCSValid( msg.sender)) 
			return false;

		//check if proposal is in proper flag state
		if( Proposals[hash].flag != 2 )
			return false;

		//check if dispute proposal in proper range [0, expire]
		if( (Proposals[hash].startingBlock + ProposalExpiration) < block.number ){
			return false;
		}

		//traverse back to make sure not double vote
		bytes32 curhash = hash;
		while( Proposals[curhash].flag > 0 ){
			for(uint i=0; i<Proposals[curhash].votecount; i++){
				if( Proposals[curhash].voters[i] == indexinlist)
					return false;
			}
			curhash = Proposals[curhash].disputeOnHash;
		}

		//add into voter list
		Proposals[hash].voters.push(indexinlist);
		Proposals[hash].votecount ++;
		
		CurrentRefundGas[msg.sender] += (gasinit - msg.gas)* tx.gasprice; 
		return true;
	}

	function CheckProposalStatus(bytes32 hash ) public view returns (uint) {
		//if reaches 50% more agreement
		if( (Proposals[hash].votecount *2) > NodeCount ){
			//more than 50% approval
			return 1;
		}

		//if pass expiration checkpoint [expire, 2*expire]
		if ((Proposals[hash].startingBlock + ProposalExpiration) < block.number) {
			//if only exact one vote make it as yes and not disputed
			if( Proposals[hash].flag == 1 && Proposals[hash].votecount == 1)
				return 1;

			//expired
			return 2;
		} 

		//undecided
		return 0;
	}

	//request proposal approval 
	function RequestProposalAction(uint indexinlist, bytes32 hash) public payable returns (bool) {		
		require(indexinlist < NodeCount && msg.sender == NodeList[indexinlist]);
		require(Proposals[hash].flag >0 && Proposals[hash].flag <= 2);
		
		uint gasinit = msg.gas;
		//check if sender is part of SCS list
		if( !IsSCSValid( msg.sender)) 
			return false;

		//check if ready to accept
		uint chk =   CheckProposalStatus(hash);
		if( chk == 0 ){
			return false;
		}else if (chk == 2 ){
			Proposals[hash].flag = 5;  //expired.
			//reduce proposer's performance
			address by = Proposals[hash].proposedBy;
			if( NodePerformance[by] > 0 ){
				NodePerformance[by] --;
			}			
			return false;

		}

		//make sure the proposal to be approved is the correct proposal in progress
		//or is the dispute proposal of correct proposal
		if( ProposalHashInProgress != hash )
		{
			bytes32 roothash = hash;
			while( Proposals[roothash].disputeOnHash != 0 && ProposalHashInProgress != hash){
				roothash = Proposals[roothash].disputeOnHash;
			}

			if(ProposalHashInProgress != roothash )
				return false;
		}

		//mark as approved
		Proposals[hash].flag = 3;
		//reset flag
		ProposalHashInProgress = 0x0;
		ProposalHashApprovedLast = hash;
		lastFlushBlk = block.number;

		//mark any previous one as rejected
		bytes32 curhash = hash;
		uint i =0;
		while( Proposals[curhash].disputeOnHash != 0 ){
			curhash = Proposals[curhash].disputeOnHash;
			if( Proposals[curhash].flag == 2)
				Proposals[curhash].flag = 4; //rejected

			
			SubChainProtocolBase protocnt = SubChainProtocolBase(Protocol);
			//take away voters' bond, proposer is also a voter to itself.
			for( i=0; i<Proposals[curhash].votecount; i++ ){
				uint vtindex = Proposals[hash].voters[i];

				protocnt.forfeitBond(NodeList[vtindex], PenaltyBond);
				NodePerformance[NodeList[vtindex]] = 0;
				NodesToDispel.push(vtindex);
			}
		}

		//for correct voter, increase performance
		for( i=0; i<Proposals[hash].votecount; i++ ){
			address vt = NodeList[Proposals[hash].voters[i]];
			if( NodePerformance[vt] < NodeInitPerformance )
				NodePerformance[vt] ++ ;
		}
		

		//award to distribution list
		for( i=0; i<NodeCount; i++ ){
			CurrentRefundGas[NodeList[i]] = 0;
			uint targetgas = Proposals[hash].distributionAmount[i] + CurrentRefundGas[NodeList[i]];
			ScsBeneficiary[ NodeList[i] ].transfer(targetgas);
		}

		//remove bad nodes
		applyRemoveNodes(0);

		//remove node to release 
		applyRemoveNodes(1);

		//update randindex
		bytes32 randseed = sha256(hash, block.number);
		RandIndex[0] = uint8(randseed[0])/8;
		RandIndex[1] = uint8(randseed[1])/8;

		//if some nodes want to join in
		if( registerFlag){
			registerFlag = false;
			applyJoinNodes();
		}

		curFlushIndex = pendingFlushIndex+1;
		if( curFlushIndex > NodeCount) {
			curFlushIndex = 0;
		}
		//notify v-node
		scsrelay.notifySCS(address(this), 4);		

		//refund current caller
		msg.sender.transfer( (gasinit - msg.gas)* tx.gasprice ); 

		return true;
	}

	function AddSyncNode(address id, string link) public {
		require( owner == msg.sender);		
		SyncNodes.push(SyncNode(id,link));
	}

	function RemoveSyncNode(uint index) public {
		require( owner == msg.sender && SyncNodes.length > index );		
		SyncNodes[index] = SyncNodes[SyncNodes.length-1];
		delete SyncNodes[SyncNodes.length-1];
		SyncNodes.length --;
	}

	function AddFund() payable public {
		// do nothing
	}

	function Withdraw(address recv, uint amount) payable public {
		require( owner == msg.sender);		

		//withdraw to address
		recv.transfer(amount);
	}


	function Close() public {
		require( owner == msg.sender);		

		//refund all to owner
		msg.sender.transfer(this.balance);
	}

	function() public payable{
		//only allow protocol send
		require(Protocol == msg.sender);
	}

}
