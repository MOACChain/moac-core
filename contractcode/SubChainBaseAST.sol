pragma solidity ^0.4.11;
pragma experimental ABIEncoderV2;

import "./SubChainProtocolBase.sol";

/**
 * @title SubChainBaseAST.sol
 * @author David Chen
 * @dev 
 * Subchain protocol definition with Atomic Swap of ERC20 Tokens.
 * It also contains the logic to allow user to join this
 * pool with bond
 * Requires : SubChainProtocolBase
 * Required by: none
 */

contract SCSRelay {
    // 0-registeropen, 1-registerclose, 2-createproposal, 3-disputeproposal, 4-approveproposal, 5-registeradd
    function notifySCS(address cnt, uint msgtype) public returns (bool success);
}

//ATO new
contract TestCoin {
    function allowance(address _owner, address _spender) public view returns (uint256);
    function approve(address _spender, uint256 _value) public returns (bool);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool);
    function transfer(address _to, uint256 _value) public returns (bool);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function totalSupply() public view returns (uint256);
}


contract SubChainBaseAST {
    enum ProposalFlag {noState, pending, disputed, approved, rejected, expired, pendingAccept}
    enum ProposalCheckStatus {undecided, approval, expired}
    enum ConsensusStatus {initStage, workingStage, failure}
    enum SCSRelayStatus {registerOpen, registerClose, createProposal, disputeProposal, approveProposal, registerAdd, regAsMonitor, regAsBackup, updateLastFlushBlk, distributeProposal, reset, approveProposalBat}
    enum SubChainStatus {open, pending, close}

    struct Proposal {
        address proposedBy;
        bytes32 lastApproved;
        bytes32 hash;
        uint start;
        uint end;
        //bytes newState;
        uint[] distributionAmount;
        uint flag; // one of ProposalFlag
        uint startingBlock;
        uint[] voters; //voters index
        uint votecount;
        uint[] badActors;
        address[] viaNodeAddress;
        uint[] viaNodeAmount;
        address[] ercAddress;
        uint[] ercAmount;
        address[] userAddr;
        uint[] amount;
        address[] minerAddr;
        uint distributeFlag;
    }
    
    struct ErcMapping {
        bytes32 hash;
        address[] ercAddress;
        uint[] ercAmount;
    }

    struct VRS {
        bytes32 r;
        bytes32 s;
        uint8 v;
    }

    struct SyncNode {
        address nodeId;
        string link;
    }
    
    struct holdings {
        address[] userAddr;
        uint[] amount;
        uint[] time;
    }

    struct TransRecords {
        uint[] enterAmount;
        uint[] entertime;
        uint[] redeemAmount;
        uint[] redeemtime;
    }
    
    struct VnodeInfo {
        address protocol;
        uint minMember;
        uint maxMember;
        uint curFlushIndex;
        uint lastFlushBlk;
        bytes32 proposalHashApprovedLast;  //index: 7
        uint blockReward;    //index: 18
        uint txReward;
        uint viaReward;
        uint proposalExpiration;
        address VnodeProtocolBaseAddr;
        uint penaltyBond;
        uint subchainstatus;
        address owner;
        uint256 BALANCE;

        address[] nodeList; 
        address[] nodesToJoin;
    }

     struct MonitorInfo {
        address from; // address as id
        uint256 bond; // value
        string link;  // ip:prort
    } 

    address public protocol;
    uint public minMember;
    uint public maxMember;
    uint public selTarget;
    uint public consensusFlag; // 0: init stage 1: working stage 2: failure
    uint public flushInRound;
    bytes32 public proposalHashInProgress;
    bytes32 public proposalHashApprovedLast;  //index: 7
    uint internal curFlushIndex;
    uint internal pendingFlushIndex;

    bytes public funcCode;
    bytes internal state;

    uint internal lastFlushBlk;

    address internal owner;

    //nodes list is updated at each successful flush
    uint public nodeCount;
    address[] public nodeList;    //index: 0f

    uint8[2] public randIndex;
    mapping(address => uint ) public nodePerformance;
    mapping(bytes32 => Proposal) public proposals;  //index: 12
    mapping(address => uint) public currentRefundGas;

    uint internal registerFlag;

    uint public proposalExpiration = 12;
    uint public penaltyBond = 10 ** 18; // 1 Moac penalty
    mapping(address=>address) public scsBeneficiary;
    uint public blockReward = 5 * 10 ** 14;    //index: 18
    uint public txReward  = 1 * 10 ** 11;
    uint public viaReward = 1 * 10 ** 13;

    uint public nodeToReleaseCount;
    uint[5] public nodesToRelease;  //nodes wish to withdraw, only allow 5 to release at a time
    mapping(address=>VRS) internal nodesToReleaseVRS;
    uint[] public nodesToDispel;

    address[] public nodesToJoin;  //nodes to be joined
    uint public joinCntMax;
    uint public joinCntNow;
    uint public MONITOR_JOIN_FEE = 1 * 10 ** 16;
    mapping(address=>uint) public nodesWatching;  //nodes watching

    SyncNode[] public syncNodes;
    uint indexAutoRetire;

    uint constant VIANODECNT = 100;
    SCSRelay internal constant SCS_RELAY = SCSRelay(0x000000000000000000000000000000000000000d);
    uint public constant NODE_INIT_PERFORMANCE = 5;
    uint public constant AUTO_RETIRE_COUNT = 2;
    bool public constant AUTO_RETIRE = false;
    address public VnodeProtocolBaseAddr;
    uint public MONITOR_MIN_FEE = 1 * 10 ** 12;
    uint public syncReward = 1 * 10 ** 11;
    uint public MAX_GAS_PRICE = 20 * 10 ** 9;

    uint public DEFLATOR_VALUE = 80; // in 1/millionth: in a year, exp appreciation is 12x

    uint internal subchainstatus;
    uint256 public BALANCE = 0;    //index: 30
    address public ERCAddr;
    // ErcMapping internal erc;
    // mapping(bytes32 => ErcMapping) internal erc;
    // ErcMapping[] public erc;
    
    // ATO new
    address public tokenAddress;
    //temp holdingplace whenentering microchain
    holdings internal holdingPool;
    uint public holdingPoolPos = 0;
    uint public MAX_USERADDR_TO_SUBCHAIN = 100;
    
    // inidicator of fund needed
    uint public contractNeedFund;

    mapping(address=>TransRecords) internal records;
    MonitorInfo[] public monitors;
    
    uint public MAX_DELETE_NUM = 5;
    uint public ERCRate = 1;

    //events
    event ReportStatus(string message);
    event TransferAmount(address addr, uint amount);



    //constructor
    function SubChainBaseAST(address proto, address vnodeProtocolBaseAddr, address ercAddr,  uint ercRate, uint min, uint max, uint thousandth, uint flushRound) public {
        VnodeProtocolBaseAddr = vnodeProtocolBaseAddr;
        SubChainProtocolBase protocnt = SubChainProtocolBase(proto);
        selTarget = protocnt.getSelectionTarget(thousandth, min);
        protocnt.setSubchainExpireBlock(flushInRound*5);
        protocnt.setSubchainActiveBlock();

        ERCAddr = ercAddr;
        TestCoin erc20 = TestCoin(ERCAddr);
	    ERCRate = ercRate;
        BALANCE = erc20.totalSupply() * ERCRate * (10 ** 18);


        minMember = min;
        maxMember = max;
        protocol = proto; //address
        consensusFlag = uint(ConsensusStatus.initStage);
        owner = msg.sender;

        flushInRound = flushRound;
        if (flushInRound <= 40) {
            flushInRound = 40;
        }
        lastFlushBlk = 2 ** 256 - 1;

        randIndex[0] = uint8(0);
        randIndex[1] = uint8(1);
        indexAutoRetire = 0;
        subchainstatus = uint(SubChainStatus.open);
    }

    function() public payable {
        //only allow protocol send
        require(protocol == msg.sender);
    }

    function setOwner() public {
        // todo david, how can owner be 0
        if (owner == address(0)) {
            owner = msg.sender;
        }
    }

    function isMemberValid(address addr) public view returns (bool) {
        return nodePerformance[addr] > 0;
    }
    
    function getVnodeInfo() public view returns (VnodeInfo) {
        VnodeInfo vnodeinfo;
        
        vnodeinfo.protocol = protocol;
        vnodeinfo.minMember = minMember;
        vnodeinfo.maxMember = maxMember;
        vnodeinfo.curFlushIndex = curFlushIndex;
        vnodeinfo.lastFlushBlk = lastFlushBlk;
        vnodeinfo.proposalHashApprovedLast = proposalHashApprovedLast;  //index: 7
        vnodeinfo.blockReward = blockReward;    //index: 18
        vnodeinfo.txReward = txReward;
        vnodeinfo.viaReward = viaReward;
        vnodeinfo.proposalExpiration = proposalExpiration;
        vnodeinfo.VnodeProtocolBaseAddr = VnodeProtocolBaseAddr;
        vnodeinfo.penaltyBond = penaltyBond;
        vnodeinfo.subchainstatus = subchainstatus;
        vnodeinfo.owner = owner;
        vnodeinfo.BALANCE = BALANCE;

        vnodeinfo.nodeList = nodeList;
        vnodeinfo.nodesToJoin = nodesToJoin;

        return vnodeinfo;
    }
    
    //function getVnodeArrInfo() public view returns (address[], address[]) {
    //    return (nodeList, nodesToJoin);
    //}
    
    function getProposal(uint types) public view returns (Proposal) {
        if (types == 1) {
            return proposals[proposalHashInProgress];
        } else if (types == 2) {
            return proposals[proposalHashApprovedLast];
        }
    }

    function getSCSRole(address scs) public view returns (uint) {
        uint i = 0;

        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i] == scs) {
                return 1;
            }
        }
        
        if (nodesWatching[scs] >= 10**9) {
            return 2;
        }
        
        for (i = 0; i < nodesToJoin.length; i++) {
            if (nodesToJoin[i] == scs) {
                return 3;
            }
        }
        
        if (matchSelTarget(scs, randIndex[0], randIndex[1])) {
            //ReportStatus("SCS not selected");
            SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
            if (!protocnt.isPerforming(scs)) {
                return 0;
            }
            return 4;
        }
        
        return 0;
    }

    function registerAsMonitor(address monitor, string link) public payable { 
        require(msg.value >= MONITOR_MIN_FEE);
        require(nodesWatching[monitor] == 0); 
        require(monitor != address(0));
        nodesWatching[monitor] = msg.value;

        // Add MonitorInfo        
        monitors.push(MonitorInfo(monitor, msg.value, link));
               
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.regAsMonitor));
    }

    function getMonitorInfo() public view returns (address[], string[]) {
        uint cnt = monitors.length;
        address[] memory addrlist = new address[](cnt);
        string[] memory strlist = new string[](cnt);
        uint i = 0;
        for (i = 0; i < cnt; i++) {
            addrlist[i] = monitors[i].from;
            strlist[i] = monitors[i].link;
        }

        return (addrlist, strlist);
    }

    function removeMonitorInfo(address monitor) public {
        uint i = 0;
        uint cnt = monitors.length;
        for (i = cnt-1; i >= 0; i--) {
            if (monitors[i].from == monitor) {
                // withdraw                
                monitor.transfer(monitors[i].bond);

                // delete
                monitors[i] = monitors[cnt-1];
                delete monitors[cnt-1];
                monitors.length--;
                nodesWatching[monitor] = 0;
                delete nodesWatching[monitor];
            }
        }
    }

    //v,r,s are the signature of msg hash(scsaddress+subchainAddr)
    // function registerOwnerSCS(address scs, address beneficiary) public returns (bool) {
    //     require(msg.sender == owner);
    //     require(scs != address(0));
    //     require(beneficiary != address(0));

    //     nodeList.push(scs);
    //     nodeCount++;
    //     nodePerformance[scs] = NODE_INIT_PERFORMANCE;
    //     scsBeneficiary[scs] = beneficiary;
    // }


    //v,r,s are the signature of msg hash(scsaddress+subchainAddr)
    function registerAsSCS(address beneficiary, uint8 v, bytes32 r, bytes32 s) public returns (bool) {
        if (registerFlag != 1) {
            //ReportStatus("Register not open");
            return false;
        }
        //check if valid registered in protocol pool
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        if (!protocnt.isPerforming(msg.sender)) {
            //ReportStatus("SCS not performing");
            return false;
        }

        if (!matchSelTarget(msg.sender, randIndex[0], randIndex[1])) {
            //ReportStatus("SCS not selected");            
            return false;
        }

        // if reach max, reject
        if (nodeCount > maxMember) {
            //ReportStatus("max nodes reached");            
            return false;
        }

        //check if node already registered
        for (uint i=0; i < nodeCount; i++) {
            if (nodeList[i] == msg.sender) {
                //ReportStatus("Node already registered");
                return false;
            }
        }

        //make sure msg.sender approve bond deduction
        if (!protocnt.approveBond(msg.sender, penaltyBond, v, r, s)) {
            //ReportStatus("Bond approval failed.");            
            return false;
        }

        nodeList.push(msg.sender);
        nodeCount++;
        nodePerformance[msg.sender] = NODE_INIT_PERFORMANCE;

        //todo: refund gas
        //msg.sender.send(gasleft() * tx.gasprice);

        if (beneficiary == address(0)) {
            scsBeneficiary[msg.sender] = msg.sender;
        }
        else {
            scsBeneficiary[msg.sender] = beneficiary;
        }

        //ReportStatus("Reg successful");

        return true;
    }

    //v,r,s are the signature of msg hash(scsaddress+subchainAddr)
    function registerAsBackup(address beneficiary, uint8 v, bytes32 r, bytes32 s) public returns (bool) {
        if (registerFlag != 2) {
            return false;
        }

        //check if valid registered in protocol pool
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        if (!protocnt.isPerforming(msg.sender)) {
            return false;
        }

        if (!matchSelTarget(msg.sender, randIndex[0], randIndex[1])) {
            return false;
        }

        //if reach max, reject
        if (joinCntNow >= joinCntMax) {
            return false;
        }

        uint i = 0;
        //check if node already registered
        for (i = 0; i < nodeCount; i++) {
            if (nodeList[i] == msg.sender) {
                return false;
            }
        }

        for (i = 0; i < nodesToJoin.length; i++) {
            if (nodesToJoin[i] == msg.sender) {
                return false;
            }
        }

        //make sure msg.sender approve bond deduction
        if (!protocnt.approveBond(msg.sender, penaltyBond, v, r, s)) {
            return false;
        }

        nodesToJoin.push(msg.sender);
        joinCntNow++;
        //set to performance to 0 since backup node has no block synced yet. 
        nodePerformance[msg.sender] = 0;//NODE_INIT_PERFORMANCE;

        //todo: refund gas
        //msg.sender.send(gasleft() * tx.gasprice);

        if (beneficiary == address(0)) {
            scsBeneficiary[msg.sender] = msg.sender;
        }
        else {
            scsBeneficiary[msg.sender] = beneficiary;
        }

        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.regAsBackup));
        return true;
    }

    function BackupUpToDate(uint index) public {
        require( registerFlag == 2 );
        require( nodesToJoin[index] == msg.sender);
        nodePerformance[msg.sender] = NODE_INIT_PERFORMANCE;
    }

    //user can explicitly release
    function requestRelease(uint index) public returns (bool) {
        //only in nodeList can call this function
        require(nodeList[index] == msg.sender);
        //check if full already
        if (nodeToReleaseCount >= 5) {
            return false;
        }

        //check if already requested
        for (uint i = 0; i < nodeToReleaseCount; i++) {
            if (nodesToRelease[i] == index) {
                return false;
            }
        }

        nodesToRelease[nodeToReleaseCount] = index;
        nodeToReleaseCount++;

        return true;
    }

    function registerOpen() public {
        require(msg.sender == owner);
        registerFlag = 1;

        //call precompiled code to invoke action on v-node
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.registerOpen));
    }

    function registerClose() public returns (bool) {
        require(msg.sender == owner);
        registerFlag = 0;

        if (nodeCount < minMember) {
            SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
            //release already enrolled scs
            //release already enrolled scs
            for (uint i = nodeCount; i > 0; i--) {
                //release fund
                address cur = nodeList[i - 1];
                protocnt.releaseFromSubchain(
                    cur,
                    penaltyBond
                );

                delete nodeList[i - 1];
            }

            nodeCount = 0;

            return false;
        }

        //now we can start to work now
        lastFlushBlk = block.number;
        curFlushIndex = 0;

        //call precompiled code to invoke action on v-node
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.registerClose));
        return true;
    }

    function registerAdd(uint nodeToAdd) public {
        require(msg.sender == owner);
        registerFlag = 2;
        joinCntMax = nodeToAdd;
        joinCntNow = nodesToJoin.length;
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        selTarget = protocnt.getSelectionTargetByCount(nodeToAdd);

        //call precompiled code to invoke action on v-node
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.registerAdd)); // todo David
    }
    
    function getFlushInfo() public view returns (uint) {
        
        for (uint i=1; i <= nodeCount; i++) {
            uint blk = lastFlushBlk + flushInRound + i * 2 * proposalExpiration;
            
            if (blk > block.number) {
                return blk - block.number;
            }
        }
        
        return 0;
    }

    function getEnteringAmount(address userAddr) public constant returns (uint[] enteringAmt, uint[] enteringtime) {
        uint i;
        uint j = 0;
        
        for (i = holdingPoolPos; i < holdingPool.userAddr.length; i++) {
            if (holdingPool.userAddr[i] == userAddr) {
                j++;
            }
        }
        
        uint[] memory amounts = new uint[](j);
        uint[] memory times = new uint[](j);
        j = 0;
        for (i = holdingPoolPos; i < holdingPool.userAddr.length; i++) {
            if (holdingPool.userAddr[i] == userAddr) {
                amounts[j] = holdingPool.amount[i];
                times[j] = holdingPool.time[i];
                j++;
            }
        }
        return (amounts, times);
    }

    //|----------|---------|---------|xxx|yyy|zzz|
    function getEstFlushBlock(uint index) public view returns (uint) {
        uint blk = lastFlushBlk + flushInRound;
        //each flusher has [0, 2*expire] to finish
        if (index >= curFlushIndex) {
            blk += (index - curFlushIndex) * 2 * proposalExpiration;
        }
        else {
            blk += (index + nodeCount - curFlushIndex) * 2 * proposalExpiration;
        }

        // if (curblk > (blk+2 * proposalExpiration)) {
        //     uint jump = (curblk-blk)/(2 * proposalExpiration * nodeCount);
        //     if ((curblk-blk) > (2 * proposalExpiration * nodeCount * jump + proposalExpiration)) {
        //         blk = blk + (jump + 1) * (2 * proposalExpiration * nodeCount);
        //     } else {
        //         blk = blk + jump * (2 * proposalExpiration * nodeCount);
        //     }
        // }
        return blk;
    }


    // create proposal
    // bytes32 hash;
    // bytes newState;
    function createProposal(
        uint indexInlist,
        // bytes32 lastFlushedHash,
        // bytes32 hash,
        // uint start, 
        // uint end,
        bytes32[] hashlist,
        uint[] blocknum,
        uint[] distAmount,
        uint[] badactors,
        address[] viaNodeAddress,
        uint[] viaNodeAmount,
        address[] ercAddress,
        uint[] ercAmount
    )
        public
        returns (bool)
    {
        uint gasinit = msg.gas; //gasleft();
        require(indexInlist < nodeCount && msg.sender == nodeList[indexInlist]);
        require(block.number >= getEstFlushBlock(indexInlist) && 
                block.number < (getEstFlushBlock(indexInlist)+ 2*proposalExpiration));
        require( viaNodeAddress.length <= VIANODECNT);
        require( viaNodeAddress.length == viaNodeAmount.length);
        require( distAmount.length == nodeCount);
        require( badactors.length < nodeCount/2);
        require( tx.gasprice <= MAX_GAS_PRICE );
        require( contractNeedFund < this.balance );

        //if already a hash proposal in progress, check if it is set to expire
        if (
            proposals[proposalHashInProgress].flag == uint(ProposalFlag.pending)
        ) {
            //for some reason, lastone is not updated
            //set to expire
            proposals[proposalHashInProgress].flag = uint(ProposalFlag.expired);  //expired.
            //reduce proposer's performance
            if (nodePerformance[proposals[proposalHashInProgress].proposedBy] > 0) {
                nodePerformance[proposals[proposalHashInProgress].proposedBy]--;
            }
        }

        //proposal must based on last approved hash
        if (hashlist[0] != proposalHashApprovedLast) {
            //ReportStatus("Proposal base bad");

            return false;
        }

        //check if sender is part of SCS list
        if (!isSCSValid(msg.sender)) {
            //ReportStatus("Proposal requester invalid");
            return false;
        }

        bytes32 curhash = hashlist[1];
        //check if proposal is already in
        if (proposals[curhash].flag > uint(ProposalFlag.noState)) {
            //ReportStatus("Proposal in progress");
            return false;
        }

        //store it into storage.
        proposals[curhash].proposedBy = msg.sender;
        proposals[curhash].lastApproved = proposalHashApprovedLast;
        proposals[curhash].hash = curhash;
        proposals[curhash].start = blocknum[0];
        proposals[curhash].end = blocknum[1];
        //proposals[hash].newState = newState;
        uint i=0;
        for (i=0; i < nodeCount; i++) {
            proposals[curhash].distributionAmount.push(distAmount[i]);
            proposals[curhash].minerAddr.push(nodeList[i]);
        }
        proposals[curhash].flag = uint(ProposalFlag.pending);
        proposals[curhash].startingBlock = block.number;
        //add into voter list
        proposals[curhash].voters.push(indexInlist);
        proposals[curhash].votecount++;

        for (i=0; i < badactors.length; i++) {
            proposals[curhash].badActors.push(badactors[i]);
        }

        //set via node
        for (i=0; i < viaNodeAddress.length; i++) {
            proposals[curhash].viaNodeAddress.push(viaNodeAddress[i]);
            proposals[curhash].viaNodeAmount.push(viaNodeAmount[i]);
        }
        
        // ErcMapping ss;
        for (i=0; i < ercAddress.length; i++) {
            proposals[curhash].ercAddress.push(ercAddress[i]);
            proposals[curhash].ercAmount.push(ercAmount[i]);
            
            // ss.ercAddress.push(ercAddress[i]);
            // ss.ercAmount.push(ercAmount[i]);
            // ss.hash = curhash;
            // erc.push(ss);
        }
        
        proposals[curhash].distributeFlag = 0;
        
        //notify v-node
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.createProposal));

        proposalHashInProgress = curhash;
        pendingFlushIndex = indexInlist;
        currentRefundGas[msg.sender] += (gasinit - msg.gas + 21486 ) * tx.gasprice;
        //ReportStatus("Proposal creates ok");
        
        return true;
    }


    //vote on proposal
    function voteOnProposal(uint indexInlist, bytes32 hash) public returns (bool) {
        uint gasinit = msg.gas;
        Proposal storage prop = proposals[hash];
        
        require(indexInlist < nodeCount && msg.sender == nodeList[indexInlist]);
        require( tx.gasprice <= MAX_GAS_PRICE );
        //check if sender is part of SCS list
        if (!isSCSValid(msg.sender)) {
            //ReportStatus("Voter invalid");
            
            return false;
        }

        //check if proposal is in proper flag state
        if (prop.flag != uint(ProposalFlag.pending)) {
            //ReportStatus("Voting not ready");
            return false;
        }
        //check if dispute proposal in proper range [0, expire]
        if ((prop.startingBlock + 2*proposalExpiration) < block.number) {
            //ReportStatus("Proposal expired");
            return false;
        }

        //traverse back to make sure not double vote
        for (uint i=0; i < prop.votecount; i++) {
            if (prop.voters[i] == indexInlist) {
                //ReportStatus("Voter already voted");
                return false;
            }
        }

        //add into voter list
        prop.voters.push(indexInlist);
        prop.votecount++;

        currentRefundGas[msg.sender] += (gasinit - msg.gas + 21486) * tx.gasprice;
        //ReportStatus("Voter votes ok");
        
        return true;
    }

    function checkProposalStatus(bytes32 hash ) public view returns (uint) {
        if ((proposals[hash].startingBlock + 2*proposalExpiration) < block.number) {
            //expired
            return uint(ProposalCheckStatus.expired);
        }

        //if reaches 50% more agreement
        if ((proposals[hash].votecount * 2) > nodeCount) {
            //more than 50% approval
            return uint(ProposalCheckStatus.approval);
        }

        //undecided
        return uint(ProposalCheckStatus.undecided);
    }
    
    // function ercTransfer(bytes32 hash ) public  {
    //     TestCoin erccnt = TestCoin(ERCAddr);
    //     uint i;
    //     for (i = 0; i < proposals[hash].ercAddress.length; i++) {
            
    //         erccnt.transfer(proposals[hash].ercAddress[i], proposals[hash].ercAmount[i]);
    //     }
    // }

    //request proposal approval
    function requestProposalAction(uint indexInlist, bytes32 hash) public payable returns (bool) {
        uint gasinit = msg.gas;
        Proposal storage prop = proposals[hash];
        
        require(indexInlist < nodeCount && msg.sender == nodeList[indexInlist]);
        require(prop.flag == uint(ProposalFlag.pending));
        require( tx.gasprice <= MAX_GAS_PRICE );

        uint scsRelayStatus = uint(SCSRelayStatus.approveProposal);
        //check if sender is part of SCS list
        if (!isSCSValid(msg.sender)) {
            //ReportStatus("Requester not permitted");
            return false;
        }

        //make sure the proposal to be approved is the correct proposal in progress
        if (proposalHashInProgress != hash) {
            //ReportStatus("Request incorrect.");
             return false;
        }

        //check if ready to accept
        uint chk = checkProposalStatus(hash);
        if (chk == uint(ProposalCheckStatus.undecided)) {
            //ReportStatus("No agreement");
            return false;
        } 
        else if (chk == uint(ProposalCheckStatus.expired)) {
            prop.flag = uint(ProposalFlag.expired);  //expired.
            //reduce proposer's performance
            address by = prop.proposedBy;
            if (nodePerformance[by] > 0) {
                nodePerformance[by]--;
            }
            //ReportStatus("Proposal expired");
            
            return false;
        }


        //mark as approved
        prop.flag = uint(ProposalFlag.approved);
        //reset flag
        proposalHashInProgress = 0x0;
        proposalHashApprovedLast = hash;
        lastFlushBlk = block.number;

        //punish bad actors
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        uint i = 0;
        for (i=0; i<prop.badActors.length; i++) {
            uint badguy = prop.badActors[i];
            protocnt.forfeitBond(nodeList[badguy], penaltyBond);
            nodePerformance[nodeList[badguy]] = 0;
            nodesToDispel.push(badguy);
            scsRelayStatus = uint(SCSRelayStatus.approveProposalBat);
        }
        
        //punish nodePerformance is 0
        if (nodesToDispel.length < MAX_DELETE_NUM) {
            uint num = MAX_DELETE_NUM - nodesToDispel.length;
            for (i=0; i<nodeCount; i++) {
                if (num == 0) {
                    break;
                }
                if (nodePerformance[nodeList[i]] == 0) {
                    nodesToDispel.push(i);
                    protocnt.forfeitBond(nodeList[i], penaltyBond);
                    num--;
                }
            }
        }

        //for correct voter, increase performance
        for (i = 0; i < prop.votecount; i++) {
            address vt = nodeList[prop.voters[i]];
            if (nodePerformance[vt] < NODE_INIT_PERFORMANCE) {
                nodePerformance[vt]++;
            }
        }

        //award to distribution list
        //in following request action

        //award via nodes
        //in following request action
         //token redeem
        //token redeem is done in following request action
        

        //remove bad nodes
        applyRemoveNodes(0);

        //remove node to release
        applyRemoveNodes(1);

        //update randIndex
        bytes32 randseed = sha256(hash, block.number);
        randIndex[0] = uint8(randseed[0]) / 8;
        randIndex[1] = uint8(randseed[1]) / 8;

        //if some nodes want to join in
        if (registerFlag == 2) {
            applyJoinNodes();
        }

        curFlushIndex = pendingFlushIndex + 1;
        if (curFlushIndex > nodeCount) {
            curFlushIndex = 0;
        }

        //if need toauto retire nodes
        if (AUTO_RETIRE) {
            for (i=0; i<AUTO_RETIRE_COUNT; i++) {
                if (indexAutoRetire >= nodeCount) {
                    indexAutoRetire = 0;
                }
                requestRelease(indexAutoRetire);
                indexAutoRetire ++ ;
            }
        }
        

        //notify v-node
        SCS_RELAY.notifySCS(address(this), scsRelayStatus);

        //make protocol pool to know subchain is active
        protocnt.setSubchainActiveBlock();

        //adjust reward
        adjustReward();
        
        //refund current caller
        msg.sender.transfer((gasinit - msg.gas + 15000) * tx.gasprice);
        //ReportStatus("Request ok");
        
        //update flag
        prop.distributeFlag = 1;

        return true;
    }
    
    function requestDistributeAction(bytes32 hash) public payable returns (bool) {
        uint gasinit = msg.gas;
        //any one can request
        Proposal storage prop = proposals[hash];
        require(prop.distributeFlag == 1);
        uint i;
        address cur;
         //check if contract has enough fund
        uint totalamount = 0;
        for (i = 0; i < prop.viaNodeAddress.length; i++) {
            totalamount += prop.viaNodeAmount[i];
        }        
         for (i = 0; i < prop.minerAddr.length; i++) {
            cur = prop.minerAddr[i];
            totalamount += currentRefundGas[cur];
            totalamount += prop.distributionAmount[i];
        }
         //if not enough amount, halt proposal
        if( totalamount > this.balance ) {
            //set global flag
            contractNeedFund += totalamount;
            return false;
        }
         //setflag
        prop.distributeFlag = 2;
         //doing actual distribution
        for ( i = 0; i < prop.viaNodeAddress.length; i++) {
            prop.viaNodeAddress[i].transfer(prop.viaNodeAmount[i]);
            TransferAmount(prop.viaNodeAddress[i], prop.viaNodeAmount[i]);
        }
         for ( i = 0; i < prop.minerAddr.length; i++) {
            cur = prop.minerAddr[i];
            uint targetGas = currentRefundGas[cur];
            currentRefundGas[cur] = 0;
            cur.transfer(targetGas);
            TransferAmount(cur, targetGas);
            targetGas = prop.distributionAmount[i];
            scsBeneficiary[cur].transfer(targetGas);
            TransferAmount(scsBeneficiary[cur], targetGas);
            
        }
        //redeem tokens
        if (BALANCE != 0 ) {
            removeholdingPool(hash);
            if (prop.ercAddress.length != 0) {
                redeemFromMicroChain(prop.ercAddress, prop.ercAmount);
                //sellMintTokenPri(prop.ercAddress, prop.ercAmount);
                for (i = 0; i < prop.ercAddress.length; i++) {
                    records[prop.ercAddress[i]].redeemAmount.push(prop.ercAmount[i]);
                    records[prop.ercAddress[i]].redeemtime.push(now);
                }
            }
        }
        
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.distributeProposal));
        
        //refund current caller
        msg.sender.transfer((gasinit - msg.gas + 15000) * tx.gasprice);
        if (subchainstatus == uint(SubChainStatus.pending)) {
            withdrawal();
        }
        return true;
    }
    
    function removeholdingPool(bytes32 hash) private {
        if (proposals[hash].lastApproved != 0x0) {
            uint i;
            bool val = false;
            for (i = holdingPoolPos; i < holdingPool.userAddr.length; i++) {
                if (proposals[hash].userAddr.length == MAX_USERADDR_TO_SUBCHAIN) {
                    holdingPoolPos = i;
                    val = true;
                    break;
                }
                proposals[hash].userAddr.push(holdingPool.userAddr[i]);
                proposals[hash].amount.push(holdingPool.amount[i]);
                records[holdingPool.userAddr[i]].enterAmount.push(holdingPool.amount[i]);
                records[holdingPool.userAddr[i]].entertime.push(now);
            }
            
            if (val != true) {
                holdingPoolPos = i;
            }
        }
    }

    function adjustReward() private {
        blockReward = blockReward - blockReward * DEFLATOR_VALUE / 10 ** 6;    
        txReward = txReward - txReward * DEFLATOR_VALUE / 10 ** 6;    
        viaReward = viaReward - viaReward * DEFLATOR_VALUE / 10 ** 6;    
        syncReward = syncReward - syncReward * DEFLATOR_VALUE / 10 ** 6;    
    }

    //to increase reward if deflator is too much
    function increaseReward(uint percent) private {
        require(owner == msg.sender);
        blockReward = blockReward + blockReward * percent / 100;    
        txReward = txReward - txReward * percent / 100;    
        viaReward = viaReward - viaReward * percent / 100;    
        syncReward = syncReward - syncReward * percent / 100;    
    }

    function addFund() public payable {
        // do nothing
        //ReportStatus("fund added" );
        require(owner == msg.sender);
        if( (this.balance + msg.value )  > contractNeedFund ) {
            contractNeedFund = 0;
            uint blk = lastFlushBlk + flushInRound + (nodeCount - 1) * 2 * proposalExpiration;
            
            if (block.number >= blk) {
                lastFlushBlk = block.number;
                SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.updateLastFlushBlk));
            }
        }
    }

    function withdraw(address recv, uint amount) public payable {
        require(owner == msg.sender);

        //withdraw to address
        recv.transfer(amount);
    }

    /*function withdrawTokenMoac(address recv, uint256 amount) public {
        require(owner == msg.sender);

        DirectExchangeToken token = DirectExchangeToken(tokenAddress);
        token.withdrawTokenMoac(recv, amount);
    }*/
    
    function withdrawal() private {
        subchainstatus = uint(SubChainStatus.close);
        //release fund
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        //release already enrolled scs
        for (uint i = nodeCount; i > 0; i--) {
            //release fund
            address cur = nodeList[i-1];
            protocnt.releaseFromSubchain(
                cur,
                penaltyBond
            );

            delete nodeList[i-1];
        }

        nodeCount = 0;

        //refund all to owner
        owner.transfer(this.balance);
        
        //kill self
    }

    function close() public {
        require(owner == msg.sender);

        subchainstatus = uint(SubChainStatus.pending);
        
        if (proposalHashInProgress == 0x0) {
            lastFlushBlk = block.number - flushInRound;
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.updateLastFlushBlk));
        }
    }

    function reset() public {
        require(owner == msg.sender);
        uint blk = lastFlushBlk + flushInRound + nodeCount * 2 * proposalExpiration;
        if (block.number >= blk) {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.reset));
        }
    }

    function addSyncNode(address id, string link) public {
        require(owner == msg.sender);
        syncNodes.push(SyncNode(id, link));
    }

    function removeSyncNode(uint index) public {
        require(owner == msg.sender && syncNodes.length > index);
        syncNodes[index] = syncNodes[syncNodes.length - 1];
        delete syncNodes[syncNodes.length - 1];
        syncNodes.length--;
    }

    function isSCSValid(address addr) private view returns (bool) {
        if (!isMemberValid(addr)) {
            return false;
        }

        //check if valid registered in protocol pool
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        if (!protocnt.isPerforming(addr)) {
            return false;
        }
        return true;
    }

    function applyJoinNodes() private {
        uint i = 0;
        for (i = joinCntNow; i > 0; i--) {
            if( nodePerformance[nodesToJoin[i-1]] == NODE_INIT_PERFORMANCE) {
                nodeList.push(nodesToJoin[i-1]);
                nodeCount++;

                //delete node
                nodesToJoin[i-1] = nodesToJoin[nodesToJoin.length-1];
                delete nodesToJoin[nodesToJoin.length-1];
                nodesToJoin.length --;
            }
        }

        joinCntNow = nodesToJoin.length;
        if( joinCntNow == 0 ) {
            joinCntMax = 0;
            registerFlag = 0;
        }
    }

    // reuse this code for remove bad node or other volunteerly leaving node
    // nodetype 0: bad node, 1: volunteer leaving node
    function applyRemoveNodes(uint nodetype) private {
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);

        uint count = nodesToDispel.length;
        if (nodetype == 1) {
            count = nodeToReleaseCount;
        }

        if (count == 0) {
            return;
        }

        // all nodes set 0 at initial, set node to be removed as 1.
        uint[] memory nodeMark = new uint[](nodeCount);
        uint idx = 0;
        uint i = 0;
        for (i = 0; i < count; i++) {
            if (nodetype == 0) {
                //bad ones
                nodeMark[nodesToDispel[i]] = 1;
            }
            else {
                idx = nodesToRelease[i];
                //volunteer leaving, only were not marked as bad ones
                if (nodeMark[idx] == 0) {
                    nodeMark[idx] = 1;
                    //release fund
                    address cur = nodeList[idx];
                    protocnt.releaseFromSubchain(
                        cur,
                        penaltyBond
                    );
                }
            }
        }

        //adjust to update nodeList
        for (i = nodeCount; i > 0; i--) {
            if (nodeMark[i-1] == 1) {
                //swap with last element
                // remove node from list
                nodeCount--;
                nodeList[i-1] = nodeList[nodeCount];
                delete nodeList[nodeCount];
                nodeList.length--;
                //nodesToDispel.length--;
            }

            // if (i == 0) {
            //     break;
            // }
            // else {
            //     i--;
            // }
        }

        //clear nodesToDispel and nodesToRelease array
        if (nodetype == 0) {
            //clear bad ones
            nodesToDispel.length = 0 ;
        } else {
            //clear release count
            nodeToReleaseCount = 0;
        }
    }
    
    // ATO new
    function rebuildFromLastFlushPoint() public {
        require(msg.sender == owner);
        //notifyscs
        //set flushindex
        curFlushIndex = 0;
    }


    function getindexByte(address a, uint8 randIndex1, uint8 randIndex2) private  pure returns (uint b) {
        uint8 first = uint8(uint(a) / (2 ** (4 * (39 - uint(randIndex1)))) * 2 ** 4);
        uint8 second = uint8(uint8(uint(a) / (2 ** (4 * (39 - uint(randIndex2)))) * 2 ** 4) / 2 ** 4);    // &15
        return uint(byte(first + second));
    }
    
    function matchSelTarget(address addr, uint8 index1, uint8 index2) public view returns (bool) {
        // check if selTargetdist matches.
        uint addr0 = getindexByte(addr, index1, index2);
        uint cont0 = getindexByte(address(this), index1, index2);

        if (selTarget == 255) {
            return true;
        }

        if (addr0 >= cont0) {
            if ((addr0 - cont0) <= selTarget) {
                return true;
            }
            else {
                if (cont0 - selTarget < 0) {
                    if ((addr0 - cont0) >= 256 - selTarget) {
                        //lower half round to top,  addr0 -256 >= cont0 -selTarget
                        return true;
                    }
                    return false;
                }
                return false;
            }
        }
        else {
            //addr0 < cont0
            if ((cont0 - addr0) <= selTarget) {
                return true;
            }
            else {
                if (cont0 + selTarget >= 256) {
                    if ((cont0 - addr0) >= 256 - selTarget) {
                        //top half round to bottom,   addr0 +256  <= (selTarget+cont0)
                        return true;
                    }
                    return false;
                }
                return false;
            }
        }

        return true;
    }
    
    function buyMintToken(address _to, uint256 _value) public returns (bool) {
        if (ERCAddr != address(0) && _to == address(this)) {
            TestCoin erc20 = TestCoin(ERCAddr);
            uint256 allowedamt = erc20.allowance(msg.sender, address(this));
            if (_value < allowedamt) {
                if (erc20.transferFrom(msg.sender, _to, _value)) {
                    return requestEnterMicrochain(_value*ERCRate*(10**18));
                }
            }
        }
        return false;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool) {
        TestCoin erc20 = TestCoin(ERCAddr);        
        return erc20.approve(_spender, _value);
    }
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        TestCoin erc20 = TestCoin(ERCAddr);        
        return erc20.transferFrom(_from, _to, _value);
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        TestCoin erc20 = TestCoin(ERCAddr);        
        return erc20.balanceOf(_owner);
    }

    function requestEnterMicrochain(uint256 amount) public returns (bool){
        if( ERCAddr != address(0)) {
            holdingPool.userAddr.push(msg.sender);
            holdingPool.amount.push(amount);
            holdingPool.time.push(now);

            return true;
        }               
        return false;
    }

    function redeemFromMicroChain(address[] useraddr,uint256[] amount) private returns (bool) {
        if( ERCAddr != address(0)) {
            TestCoin erc20 = TestCoin(ERCAddr); 
            uint256 balance = erc20.balanceOf(address(this));
            for (uint i = 0; i < useraddr.length; i++) {                
                balance = balance - amount[i];
                if( balance > 0 ) {
                    if (!erc20.transfer(useraddr[i], amount[i]/ERCRate/(10**18))) {
                        return false;
                    }
                } else if( balance < 0 )  {
                    return false;
                }
            }
        }

        return true;             
    }
}