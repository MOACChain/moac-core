pragma solidity ^0.4.11;
pragma experimental ABIEncoderV2;

import "./SCSProtocolBase.sol";

/**
 * @title RanddropChainBaseASM.sol
 * @author David Chen
 * @dev 
 * Main AppChain contract with Atomic Swap of MOAC(ASM) function.
 * This is the contract to deploy on the BaseChain to form a RandDrop AppChain.
 * 
 * Requires : SCSProtocolBase.sol
 * Required by: N/A
 */

/*
======= RanddropChainBaseASM.sol:SCSRelay =======
Function signatures:
219dc4a0: notifySCS(address,uint256)

======= RanddropChainBaseASM.sol:SubChainBase =======
Function signatures:
7a813833: AUTO_RETIRE()
d4f79bd5: AUTO_RETIRE_COUNT()
15e9977e: BALANCE()
312e014b: BackupUpToDate(uint256)
f21df012: DEFLATOR_VALUE()
bff92d70: MAX_DELETE_NUM()
e3bbb4f1: MAX_GAS_PRICE()
950f7879: MONITOR_JOIN_FEE()
f2faa2a6: MONITOR_MIN_FEE()
dc393c09: NODE_INIT_PERFORMANCE()
dcd338ca: UploadRedeemData(address[],uint256[])
dc82c54f: VnodeProtocolBaseAddr()
a2f09dfa: addFund()
6f7e15da: addSyncNode(address,string)
0ac168a1: blockReward()
6bbded70: buyMintToken()
c66da997: checkProposalStatus(bytes32)
43d726d6: close()
30e7f8ef: consensusFlag()
a7fc1161: contractNeedFund()
1463ef07: createProposal(uint256,bytes32[],uint256[],uint256[],uint256[],address,uint256)
76164fb6: curFlushIndex()
6b35d367: currentRefundGas(address)
e9e150d0: dappRedeemPos()
fcac00bc: flushInRound()
2da03719: funcCode()
42cbb15c: getBlockNumber()
b19932c0: getEnteringAmount(address,uint256)
c20b1246: getEstFlushBlock(uint256)
c067247c: getFlushInfo()
ab3c7d87: getFlushStatus()
21a1b495: getMonitorInfo()
c7f758a8: getProposal(uint256)
b74c3eff: getRedeemRecords(address)
50859fd9: getSCSRole(address)
3c1f16aa: getVnodeInfo()
5f5ffef0: getVssBase()
8640c8b1: getholdingPool()
d736b382: initialFlushInRound()
d0fab885: isMemberValid(address)
e5df8425: joinCntMax()
d12ff2eb: joinCntNow()
9d3979a1: lastFlushBlk()
b8598896: matchSelTarget(address,uint8,uint8)
07289245: maxFlushInRound()
03e3c9ac: maxMember()
5fd652db: max_redeemdata_num()
2b114a7c: minMember()
44a58781: monitors(uint256)
6da49b83: nodeCount()
208f2a31: nodeList(uint256)
a9555e6c: nodePerformance(address)
26009deb: nodeToReleaseCount()
3b082706: nodesToDispel(uint256)
a94f7a70: nodesToJoin(uint256)
cae56d58: nodesToRelease(uint256)
57365df2: nodesWatching(address)
83d6f697: penaltyBond()
0d314546: pendingFlushIndex()
793ebd89: per_recharge_num()
a53dae59: per_redeemdata_num()
0be6075a: per_upload_redeemdata_num()
b8697fe2: priceOneGInMOAC()
eba308f8: proposalExpiration()
db22ccad: proposalHashApprovedLast()
ca3b852f: proposalHashInProgress()
32ed5b12: proposals(bytes32)
8ce74426: protocol()
cbe5b2a4: randIndex(uint256)
634eaea6: rebuildFromLastFlushPoint()
9eb34e43: recharge_cycle()
be93f1b3: registerAdd(uint256)
6f8c54b5: registerAsBackup(address,uint8,bytes32,bytes32,bytes32)
4d13deae: registerAsMonitor(address,string)
89873927: registerAsSCS(address,uint8,bytes32,bytes32,bytes32)
69f3576f: registerClose()
5defc56c: registerOpen()
df4b780d: removeMonitorInfo(address)
110afc0f: removeSyncNode(uint256)
ca5e56aa: requestEnterAndRedeemAction(bytes32)
cc819ad0: requestProposalAction(uint256,bytes32)
30be5944: requestRelease(uint256,uint256)
301b4887: requestReleaseImmediate(uint256,uint256)
d826f88f: reset()
2ad0f79b: scsBeneficiary(address)
d7c3dc5f: selTarget()
40caae06: setOwner()
03d05923: setVssBase(address)
c063d987: syncNodes(uint256)
c4474a59: syncReward()
9b09723e: totalBond()
b55845e7: totalExchange()
fae67d40: totalOperation()
f9326cf5: txNumInFlush()
46d63676: txReward()
aa7e2986: updatePerRechargeNum(uint256)
689b00ed: updatePerRedeemNum(uint256)
3a46492a: updatePerUploadRedeemNum(uint256)
6d9817eb: updateRechargeCycle(uint256)
b062a927: viaReward()
517549a0: voteOnProposal(uint256,bytes32,bool)
11f79f7c: vssSlash(address)
a5824de1: vssbase()
f3fef3a3: withdraw(address,uint256)

======= RanddropChainBaseASM.sol:VssBase =======
Function signatures:
e4c1de98: activateVSS(address)
de79b856: deactivateVSS(address)
eefb4227: registerVSS(address,bytes32)
f06dc92d: unregisterVSS(address)

======= SCSProtocolBase.sol:SCSProtocolBase =======
Function signatures:
99f874d8: PENDING_BLOCK_DELAY()
f9eae020: WITHDRAW_BLOCK_DELAY()
1aa887ca: approvalAddresses(address)
41205305: approvalAmounts(address)
6220fb1d: approveBond(address,uint256,uint8,bytes32,bytes32)
cb7f8266: bondMin()
64f3ef46: forfeitBond(address,uint256)
de42f13c: getSelectionTarget(uint256,uint256)
e17095a4: getSelectionTargetByCount(uint256)
ce9d9bd7: isPerforming(address)
bd8d4bd8: protocolType()
4420e486: register(address)
202cc5e1: releaseFromSubchain(address,uint256)
9adea807: releaseRequest(address,address)
76a95e88: scsApprovalList(address)
aab31933: scsArray(uint256)
6e62adcb: scsCount()
c9a856a3: scsList(address)
365bfb9e: setSubchainActiveBlock()
b8a167e6: setSubchainExpireBlock(uint256)
c3a919d0: subChainExpireBlock(address)
67bd927e: subChainLastActiveBlock(address)
f21e6f7a: subChainProtocol()
3ccfd60b: withdraw()
380e687a: withdrawRequest()

======= SCSProtocolBase.sol:SysContract =======
Function signatures:
c8d0d29a: delayedSend(uint256,address,uint256,bool)
*/

contract SCSRelay {
    // 0-registeropen
    // 1-registerclose
    // 2-createproposal
    // 3-disputeproposal
    // 4-approveproposal
    // 5-registeradd
    function notifySCS(address cnt, uint msgtype) public returns (bool success);
}

contract VssBase {
    function registerVSS(address sender, bytes32 publickey) public;
    function unregisterVSS(address sender) public;
    function activateVSS(address sender) public;
    function deactivateVSS(address sender) public;
}

contract SubChainBase {
    enum ProposalFlag {noState, pending, disputed, approved, rejected, expired, pendingAccept}
    enum ProposalCheckStatus {undecided, approval, expired}
    enum ConsensusStatus {initStage, workingStage, failure}
    enum SCSRelayStatus {
      registerOpen,
      registerClose,
      createProposal,
      disputeProposal,
      approveProposal,
      registerAdd,
      regAsMonitor,
      regAsBackup,
      updateLastFlushBlk,
      distributeProposal,
      reset,
      uploadRedeemData,
      requestEnterAndRedeem,
      requestReleaseImmediateAndVSSGroupConfig,
      vssEnabled,
      vssGroupConfig,
      distributeProposalAndVSSGroupConfig
    }
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
        address viaNodeAddress;
        uint preRedeemNum;
        address[] redeemAddr;
        uint[] redeemAmt;
        address[] minerAddr;
        uint distributeFlag;
        address[] redeemAgreeList;
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

    struct RedeemRecords {
        uint[] redeemAmount;
        uint[] redeemtime;
    }

    struct VnodeInfo {
        address protocol;
        uint[] members;
        uint[] rewards;    //0:blockReward; 1:txReward; 2:viaReward
        uint proposalExpiration;
        address VnodeProtocolBaseAddr;
        uint penaltyBond;
        uint subchainstatus;
        address owner;
        uint256 BALANCE;
        uint[] redeems;

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
    uint public initialFlushInRound;

    bytes32 public proposalHashInProgress;
    bytes32 public proposalHashApprovedLast;  //index: 7

    uint public curFlushIndex;
    uint public  pendingFlushIndex;

    bytes public funcCode;
    bytes internal state;

    uint public lastFlushBlk;

    address internal owner;

    //nodes list is updated at each successful flush
    uint public nodeCount;
    address[] public nodeList;    //index: 0f

    uint8[2] public randIndex;
    mapping(address => uint ) public nodePerformance;
    mapping(bytes32 => Proposal) public proposals;  //index: 12
    mapping(address => uint) public currentRefundGas;

    uint internal registerFlag;

    uint public proposalExpiration = 24;
    uint public penaltyBond = 10 ** 18; // 1 Moac penalty
    mapping(address=>address) public scsBeneficiary;
    uint public blockReward = 5 * 10 ** 14;    //index: 18
    uint public txReward  = 1 * 10 ** 11;
    uint public viaReward = 1 * 10 ** 16;

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

    //temp holdingplace whenentering microchain
    holdings internal holdingPool;
    uint public per_recharge_num = 250;
    uint public recharge_cycle = 6;

    // inidicator of fund needed
    uint public contractNeedFund;

    mapping(address=>RedeemRecords) internal records;
    MonitorInfo[] public monitors;

    uint public MAX_DELETE_NUM = 5;
    uint public dappRedeemPos = 0;
    uint public per_upload_redeemdata_num = 160;//167
    uint public per_redeemdata_num = 130;//140
    uint public max_redeemdata_num = 500;

    uint public maxFlushInRound = 500;
    uint public txNumInFlush = 100;

    uint256 public priceOneGInMOAC;
    uint public totalExchange;
    uint public totalOperation;
    uint public totalBond;

    address public vssbase;

    //events
    event ReportStatus(string message);
    event TransferAmount(address addr, uint amount);

    //constructor
    function SubChainBase(address proto, address vnodeProtocolBaseAddr, uint min, uint max, uint thousandth, uint flushRound, uint256 tokensupply, uint256 exchangerate, address vssbaseAddr) public {
        require(min == 1 || min == 3 || min == 5 || min == 7);
        require(max == 11 || max == 21 || max == 31 || max == 51 || max == 99);
        require(flushRound >= 40  && flushRound <= 500);

        flushInRound = flushRound;
        initialFlushInRound = flushRound;
        VnodeProtocolBaseAddr = vnodeProtocolBaseAddr;
        SCSProtocolBase protocnt = SCSProtocolBase(proto);
        selTarget = protocnt.getSelectionTarget(thousandth, min);
        protocnt.setSubchainActiveBlock();

        minMember = min;
        maxMember = max;
        protocol = proto; //address
        consensusFlag = uint(ConsensusStatus.initStage);
        owner = msg.sender;

        protocnt.setSubchainExpireBlock(flushInRound*5);
        lastFlushBlk = 2 ** 256 - 1;

        BALANCE = tokensupply * 10 ** 18;
        priceOneGInMOAC = exchangerate;

        randIndex[0] = uint8(0);
        randIndex[1] = uint8(1);
        indexAutoRetire = 0;
        subchainstatus = uint(SubChainStatus.open);

        vssbase = vssbaseAddr;
    }

    function() public payable {
        //only allow protocol send
        require(protocol == msg.sender);
    }

    function setOwner() public {
        if (owner == address(0)) {
            owner = msg.sender;
        }
    }

    function setVssBase(address newVssBase) public {
        require(owner == msg.sender);
        vssbase = newVssBase;
    }

    function getVssBase() public view returns (address) {
      return vssbase;
    }

    function getFlushStatus() public view returns (bool) {
        uint blk = lastFlushBlk + flushInRound + nodeCount * 2 * proposalExpiration;
        return (block.number <= blk);
    }

    function updatePerRechargeNum(uint num) public {
        require(owner == msg.sender);

        per_recharge_num = num;
    }

    function updateRechargeCycle(uint num) public {
        require(owner == msg.sender);

        recharge_cycle = num;
    }

    function updatePerUploadRedeemNum(uint num) public {
        require(owner == msg.sender);

        per_upload_redeemdata_num = num;
    }

    function updatePerRedeemNum(uint num) public {
        require(owner == msg.sender);

        per_redeemdata_num = num;
    }

    function isMemberValid(address addr) public view returns (bool) {
        return nodePerformance[addr] > 0;
    }

    function vssSlash(address addr) public {
        require(msg.sender == vssbase);
        if (nodePerformance[addr] > 0) {
            nodePerformance[addr] = 0;
        }

        // if it is not valid, deactivate in vss
        if (!isMemberValid(addr)) {
            VssBase vssbaseContract = VssBase(vssbase);
            vssbaseContract.deactivateVSS(addr);
        }
    }

    function getVnodeInfo() public view returns (VnodeInfo) {
        VnodeInfo vnodeinfo;

        vnodeinfo.protocol = protocol;
        uint[] memory members = new uint[](2);
        members[0] = minMember;
        members[1] = maxMember;
        vnodeinfo.members = members;
        uint[] memory rewards = new uint[](3);
        rewards[0] = blockReward;    //index: 18
        rewards[1] = txReward;
        rewards[2] = viaReward;
        vnodeinfo.rewards = rewards;
        vnodeinfo.proposalExpiration = proposalExpiration;
        vnodeinfo.VnodeProtocolBaseAddr = VnodeProtocolBaseAddr;
        vnodeinfo.penaltyBond = penaltyBond;
        vnodeinfo.subchainstatus = subchainstatus;
        vnodeinfo.owner = owner;
        vnodeinfo.BALANCE = BALANCE;
        uint[] memory redeems = new uint[](4);
        redeems[0] = dappRedeemPos;
        redeems[1] = per_upload_redeemdata_num;
        redeems[2] = per_redeemdata_num;
        redeems[3] = max_redeemdata_num;
        vnodeinfo.redeems = redeems;

        vnodeinfo.nodeList = nodeList;
        vnodeinfo.nodesToJoin = nodesToJoin;

        return vnodeinfo;
    }

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

        SCSProtocolBase protocnt = SCSProtocolBase(protocol);
        if (protocnt.isPerforming(scs)) {
            if (matchSelTarget(scs, randIndex[0], randIndex[1])) {
                return 4;
            }
        }

        return 0;
    }

    function registerAsMonitor(address monitor, string link) public payable {
        require(subchainstatus == uint(SubChainStatus.open));
        require(msg.value >= MONITOR_MIN_FEE);
        require(nodesWatching[monitor] == 0);
        require(monitor != address(0));
        require(getSCSRole(monitor) == 4 || getSCSRole(monitor) == 0);
        nodesWatching[monitor] = msg.value;
        totalBond += msg.value;

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
        for (i = cnt; i > 0; i--) {
            if (monitors[i-1].from == monitor) {
                // withdraw
                monitor.transfer(monitors[i-1].bond);
                totalBond -= monitors[i-1].bond;

                // delete
                monitors[i-1] = monitors[cnt-1];
                delete monitors[cnt-1];
                monitors.length--;
                nodesWatching[monitor] = 0;
                delete nodesWatching[monitor];
            }
        }
    }

    //v,r,s are the signature of msg hash(scsaddress+subchainAddr)
    function registerAsSCS(address beneficiary, uint8 v, bytes32 r, bytes32 s, bytes32 publickey) public returns (bool) {
        require(subchainstatus == uint(SubChainStatus.open));
        require(getSCSRole(msg.sender) == 4);
        if (registerFlag != 1) {
            return false;
        }
        //check if valid registered in protocol pool
        SCSProtocolBase protocnt = SCSProtocolBase(protocol);
        if (!protocnt.isPerforming(msg.sender)) {
            return false;
        }

        if (!matchSelTarget(msg.sender, randIndex[0], randIndex[1])) {
            return false;
        }

        // if reach max, reject
        if (nodeCount > maxMember) {
            return false;
        }

        //check if node already registered
        for (uint i=0; i < nodeCount; i++) {
            if (nodeList[i] == msg.sender) {
                return false;
            }
        }

        //make sure msg.sender approve bond deduction
        if (!protocnt.approveBond(msg.sender, penaltyBond, v, r, s)) {
            return false;
        }

        nodeList.push(msg.sender);
        nodeCount++;
        nodePerformance[msg.sender] = NODE_INIT_PERFORMANCE;

        // put the scs in vss group and activate
        VssBase vssbaseContract = VssBase(vssbase);
        vssbaseContract.registerVSS(msg.sender, publickey);
        vssbaseContract.activateVSS(msg.sender);

        if (beneficiary == address(0)) {
            scsBeneficiary[msg.sender] = msg.sender;
        }
        else {
            scsBeneficiary[msg.sender] = beneficiary;
        }

        return true;
    }

    //v,r,s are the signature of msg hash(scsaddress+subchainAddr)
    function registerAsBackup(address beneficiary, uint8 v, bytes32 r, bytes32 s, bytes32 publickey) public returns (bool) {
        require(subchainstatus == uint(SubChainStatus.open));
        require(getSCSRole(msg.sender) == 4);
        if (registerFlag != 2) {
            return false;
        }

        //check if valid registered in protocol pool
        SCSProtocolBase protocnt = SCSProtocolBase(protocol);
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
        nodePerformance[msg.sender] = 0; //NODE_INIT_PERFORMANCE;

        // put the scs in vss group but not yet activate it
        VssBase vssbaseContract = VssBase(vssbase);
        vssbaseContract.registerVSS(msg.sender, publickey);

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
    function requestRelease(uint senderType, uint index) public returns (bool) {
        //only in nodeList and scsBeneficiary can call this function
        if (senderType == 1) {
            if (nodeList[index] != msg.sender) {
                return false;
            }
        } else if (senderType == 2) {
            if (scsBeneficiary[nodeList[index]] != msg.sender) {
                return false;
            }
        } else {
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

    //user can explicitly release
    function requestReleaseImmediate(uint senderType, uint index) public returns (bool) {
        //only in nodeList and scsBeneficiary can call this function
        if (senderType == 1) {
            if (nodeList[index] != msg.sender) {
                return false;
            }
        } else if (senderType == 2) {
            if (scsBeneficiary[nodeList[index]] != msg.sender) {
                return false;
            }
        } else {
            return false;
        }

        if (block.number <= lastFlushBlk + flushInRound + nodeCount * 2 * proposalExpiration) {
            return false;
        }

        address cur = nodeList[index];
        SCSProtocolBase protocnt = SCSProtocolBase(protocol);
        protocnt.releaseFromSubchain(
            cur,
            penaltyBond
        );

        // remove from vssbase
        VssBase vssbaseContract = VssBase(vssbase);
        vssbaseContract.unregisterVSS(cur);

        nodeCount--;
        nodeList[index] = nodeList[nodeCount];
        delete nodeList[nodeCount];
        nodeList.length--;
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.requestReleaseImmediateAndVSSGroupConfig));

        return true;
    }

    function registerOpen() public {
        require(subchainstatus == uint(SubChainStatus.open));
        require(msg.sender == owner);
        registerFlag = 1;

        //call precompiled code to invoke action on v-node
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.registerOpen));
    }

    function registerClose() public returns (bool) {
        require(subchainstatus == uint(SubChainStatus.open));
        require(msg.sender == owner);
        registerFlag = 0;
        VssBase vssbaseContract = VssBase(vssbase);

        if (nodeCount < minMember) {
            SCSProtocolBase protocnt = SCSProtocolBase(protocol);
            //release already enrolled scs
            for (uint i = nodeCount; i > 0; i--) {
                //release fund
                address cur = nodeList[i - 1];
                protocnt.releaseFromSubchain(
                    cur,
                    penaltyBond
                );
                vssbaseContract.unregisterVSS(cur);
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
        require(subchainstatus == uint(SubChainStatus.open));
        require(msg.sender == owner);
        require(joinCntNow + nodeCount < maxMember);

        registerFlag = 2;
        joinCntMax = maxMember - joinCntNow - nodeCount;
        joinCntNow = nodesToJoin.length;
        SCSProtocolBase protocnt = SCSProtocolBase(protocol);
        selTarget = protocnt.getSelectionTargetByCount(nodeToAdd);

        //call precompiled code to invoke action on v-node
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.registerAdd));
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

    function getholdingPool() public constant returns (address[]) {
        return holdingPool.userAddr;
    }

    function getEnteringAmount(address userAddr, uint holdingPoolPos) public constant returns (address[] enteringAddr, uint[] enteringAmt, uint[] enteringtime, uint[] rechargeParam) {
        uint i;
        uint j = 0;

        if (userAddr != address(0)) {
            for (i = holdingPoolPos; i < holdingPool.userAddr.length; i++) {
                if (holdingPool.userAddr[i] == userAddr) {
                    j++;
                }
            }
        } else {
            j = holdingPool.userAddr.length - holdingPoolPos;
        }

        address[] memory addrs = new address[](j);
        uint[] memory amounts = new uint[](j);
        uint[] memory times = new uint[](j);
        uint[] memory params = new uint[](2);
        j = 0;
        for (i = holdingPoolPos; i < holdingPool.userAddr.length; i++) {
            if (userAddr != address(0)) {
                if (holdingPool.userAddr[i] == userAddr) {
                    amounts[j] = holdingPool.amount[i];
                    times[j] = holdingPool.time[i];
                    j++;
                }
            } else {
                addrs[j] = holdingPool.userAddr[i];
                amounts[j] = holdingPool.amount[i];
                times[j] = holdingPool.time[i];
                j++;
            }
        }
        params[0] = per_recharge_num;
        params[1] = recharge_cycle;
        return (addrs, amounts, times, params);
    }

    function getRedeemRecords(address userAddr) public view returns (RedeemRecords) {
        return records[userAddr];
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

        return blk;
    }

    // create proposal
    // bytes32 hash;
    // bytes newState;
    function createProposal(
        uint indexInlist,
        bytes32[] hashlist,
        uint[] blocknum,
        uint[] distAmount,
        uint[] badactors,
        address viaNodeAddress,
        uint preRedeemNum
    )
        public
        returns (bool)
    {
        uint gasinit = msg.gas;
        require(indexInlist < nodeCount && msg.sender == nodeList[indexInlist]);
        require(block.number >= getEstFlushBlock(indexInlist) &&
                block.number < (getEstFlushBlock(indexInlist)+ 2*proposalExpiration));
        require( distAmount.length == nodeCount);
        require( badactors.length < nodeCount/2);
        require( tx.gasprice <= MAX_GAS_PRICE );
        require( contractNeedFund < totalOperation );

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
            return false;
        }

        //check if sender is part of SCS list
        if (!isSCSValid(msg.sender)) {
            return false;
        }

        bytes32 curhash = hashlist[1];
        //check if proposal is already in
        if (proposals[curhash].flag > uint(ProposalFlag.noState)) {
            return false;
        }

        //store it into storage.
        proposals[curhash].proposedBy = msg.sender;
        proposals[curhash].lastApproved = proposalHashApprovedLast;
        proposals[curhash].hash = curhash;
        proposals[curhash].start = blocknum[0];
        proposals[curhash].end = blocknum[1];
        uint i=0;
        for (i=0; i < nodeCount; i++) {
            proposals[curhash].distributionAmount.push(distAmount[i]);
            proposals[curhash].minerAddr.push(nodeList[i]);
        }
        proposals[curhash].flag = uint(ProposalFlag.pending);
        proposals[curhash].startingBlock = getEstFlushBlock(indexInlist);
        //add into voter list
        proposals[curhash].voters.push(indexInlist);
        proposals[curhash].votecount++;

        proposals[curhash].redeemAgreeList.push(msg.sender);

        for (i=0; i < badactors.length; i++) {
            proposals[curhash].badActors.push(badactors[i]);
        }

        //set via nodeelse
        proposals[curhash].viaNodeAddress = viaNodeAddress;

        // ErcMapping ss;
        proposals[curhash].preRedeemNum = preRedeemNum;
        proposals[curhash].distributeFlag = 0;

        //notify v-node
        if (preRedeemNum == 0) {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.createProposal));
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.uploadRedeemData));
        }

        proposalHashInProgress = curhash;
        pendingFlushIndex = indexInlist;
        currentRefundGas[msg.sender] += (gasinit - msg.gas + 21486 ) * tx.gasprice;

        return true;
    }

    function UploadRedeemData(
        address[] redeemAddr,
        uint[] redeemAmt
    )
        public
        returns (bool)
    {
        Proposal storage prop = proposals[proposalHashInProgress];
        uint gasinit = msg.gas;
        require(msg.sender == prop.proposedBy);
        require( redeemAddr.length + prop.redeemAddr.length <= prop.preRedeemNum);
        require( tx.gasprice <= MAX_GAS_PRICE );

        for (uint i=0; i < redeemAddr.length; i++) {
            prop.redeemAddr.push(redeemAddr[i]);
            prop.redeemAmt.push(redeemAmt[i]);
        }

        //notify v-node
        if (prop.redeemAddr.length == prop.preRedeemNum) {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.createProposal));
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.uploadRedeemData));
        }

        currentRefundGas[msg.sender] += (gasinit - msg.gas + 21486 ) * tx.gasprice;
        return true;
    }

    //vote on proposal
    function voteOnProposal(uint indexInlist, bytes32 hash, bool redeem) public returns (bool) {
        uint gasinit = msg.gas;
        Proposal storage prop = proposals[hash];

        require(indexInlist < nodeCount && msg.sender == nodeList[indexInlist]);
        require( tx.gasprice <= MAX_GAS_PRICE );
        //check if sender is part of SCS list
        if (!isSCSValid(msg.sender)) {
            return false;
        }

        //check if proposal is in proper flag state
        if (prop.flag != uint(ProposalFlag.pending)) {
            return false;
        }
        //check if dispute proposal in proper range [0, expire]
        if ((prop.startingBlock + 2*proposalExpiration) < block.number) {
            return false;
        }

        //traverse back to make sure not double vote
        for (uint i=0; i < prop.votecount; i++) {
            if (prop.voters[i] == indexInlist) {
                return false;
            }
        }

        if (redeem) {
            prop.redeemAgreeList.push(msg.sender);
        }

        //add into voter list
        prop.voters.push(indexInlist);
        prop.votecount++;

        currentRefundGas[msg.sender] += (gasinit - msg.gas + 21486) * tx.gasprice;

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

    function revenueDistribution(bytes32 hash ) private {
        Proposal storage prop = proposals[hash];
        address cur;
         //check if contract has enough fund
        uint totalamount = 0;

        totalamount += viaReward;

        for (uint i = 0; i < prop.minerAddr.length; i++) {
            cur = prop.minerAddr[i];
            totalamount += currentRefundGas[cur];
            totalamount += prop.distributionAmount[i];
        }
         //if not enough amount, halt proposal
        if( totalamount > totalOperation ) {
            //set global flag
            contractNeedFund += totalamount;
            return ;
        }

         //doing actual distribution
        prop.viaNodeAddress.transfer(viaReward);
        totalOperation -= viaReward;
        TransferAmount(prop.viaNodeAddress, viaReward);

        uint amts;
        for ( i = 0; i < prop.minerAddr.length; i++) {
            cur = prop.minerAddr[i];
            uint targetGas = currentRefundGas[cur];
            currentRefundGas[cur] = 0;
            cur.transfer(targetGas);
            totalOperation -= targetGas;
            TransferAmount(cur, targetGas);
            targetGas = prop.distributionAmount[i];
            scsBeneficiary[cur].transfer(targetGas);
            amts += targetGas;
            totalOperation -= targetGas;
            TransferAmount(scsBeneficiary[cur], targetGas);
        }

        uint txNum = (amts - blockReward * (prop.end - prop.start + 1)) / txReward;
        if (txNum <= txNumInFlush) {
            flushInRound += 40;
            if (flushInRound > maxFlushInRound) {
                flushInRound = maxFlushInRound;
            }
        } else {
            flushInRound = flushInRound / 2;
            if (flushInRound < initialFlushInRound) {
                flushInRound = initialFlushInRound;
            }
        }
    }

    //request proposal approval
    function requestProposalAction(uint indexInlist, bytes32 hash) public returns (bool) {
        uint gasinit = msg.gas;
        Proposal storage prop = proposals[hash];

        require(indexInlist < nodeCount && msg.sender == nodeList[indexInlist]);
        require(prop.flag == uint(ProposalFlag.pending));
        require( tx.gasprice <= MAX_GAS_PRICE );

        //check if sender is part of SCS list
        if (!isSCSValid(msg.sender)) {
            return false;
        }

        //make sure the proposal to be approved is the correct proposal in progress
        if (proposalHashInProgress != hash) {
             return false;
        }

        //check if ready to accept
        uint chk = checkProposalStatus(hash);
        if (chk == uint(ProposalCheckStatus.undecided)) {
            return false;
        }
        else if (chk == uint(ProposalCheckStatus.expired)) {
            prop.flag = uint(ProposalFlag.expired);  //expired.
            //reduce proposer's performance
            address by = prop.proposedBy;
            if (nodePerformance[by] > 0) {
                nodePerformance[by]--;
            }

            return false;
        }

        //punish bad actors
        SCSProtocolBase protocnt = SCSProtocolBase(protocol);
        uint i = 0;
        for (i=0; i<prop.badActors.length; i++) {
            uint badguy = prop.badActors[i];
            nodePerformance[nodeList[badguy]] = 0;
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
                    totalOperation += penaltyBond;
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

        bool nodesChanged = false;
        //remove bad nodes
        nodesChanged = applyRemoveNodes(0);

        //remove node to release
        nodesChanged = nodesChanged || applyRemoveNodes(1);

        //update randIndex
        bytes32 randseed = sha256(hash, block.number);
        randIndex[0] = uint8(randseed[0]) / 8;
        randIndex[1] = uint8(randseed[1]) / 8;

        //if some nodes want to join in
        if (registerFlag == 2) {
            nodesChanged = nodesChanged || applyJoinNodes();
        }

        //if need toauto retire nodes
        if (AUTO_RETIRE) {
            for (i=0; i<AUTO_RETIRE_COUNT; i++) {
                if (indexAutoRetire >= nodeCount) {
                    indexAutoRetire = 0;
                }
                requestRelease(1, indexAutoRetire);
                indexAutoRetire ++ ;
            }
        }

        //notify v-node
        if (prop.redeemAddr.length == 0) {
            revenueDistribution(hash);
            flushEnd(hash, nodesChanged);
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.approveProposal));
        }

        //make protocol pool to know subchain is active
        protocnt.setSubchainActiveBlock();

        //adjust reward
        adjustReward();

        //update flag
        prop.distributeFlag = 1;
        //refund current caller
        totalOperation -= (gasinit - msg.gas + 15000) * tx.gasprice;
        msg.sender.transfer((gasinit - msg.gas + 15000) * tx.gasprice);

        //refund all to owner
        if (subchainstatus == uint(SubChainStatus.close)) {
            owner.transfer(this.balance - totalExchange/priceOneGInMOAC - totalBond);
            totalOperation = 0;
        }
        return true;
    }

    function flushEnd(bytes32 hash, bool nodesChanged) private {
        Proposal storage prop = proposals[hash];

        //setflag
        prop.distributeFlag = 2;
        //mark as approved
        prop.flag = uint(ProposalFlag.approved);
        //reset flag
        proposalHashInProgress = 0x0;
        proposalHashApprovedLast = hash;
        lastFlushBlk = block.number;

        curFlushIndex = pendingFlushIndex + 1;
        if (curFlushIndex > nodeCount) {
            curFlushIndex = 0;
        }

        if (subchainstatus == uint(SubChainStatus.pending)) {
            withdrawal();
        }

        if (nodesChanged == true) {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.distributeProposalAndVSSGroupConfig));
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.distributeProposal));
        }
    }

    function requestEnterAndRedeemAction(bytes32 hash) public returns (bool) {
        uint gasinit = msg.gas;
        //any one can request
        Proposal storage prop = proposals[hash];
        require(BALANCE != 0);
        require(prop.distributeFlag == 1);
        require(prop.flag == uint(ProposalFlag.pending));

        uint chk = checkProposalStatus(hash);
        if (chk == uint(ProposalCheckStatus.undecided)) {
            return false;
        }
        else if (chk == uint(ProposalCheckStatus.expired)) {
            prop.flag = uint(ProposalFlag.expired);  //expired.
            //reduce proposer's performance
            address by = prop.proposedBy;
            if (nodePerformance[by] > 0) {
                nodePerformance[by]--;
            }

            return false;
        }

        //redeem tokens
        uint i;
        bool res = true;
        if (prop.redeemAgreeList.length > nodeCount/2 && prop.preRedeemNum != 0) {
            uint len = prop.preRedeemNum;
            if (len > per_redeemdata_num) {
                len = per_redeemdata_num;
            }

            uint pos = prop.redeemAddr.length - prop.preRedeemNum;
            address addr;
            uint amt;
            for (i = pos; i < pos + len; i++) {
                addr =  prop.redeemAddr[i];
                amt = prop.redeemAmt[i];
                totalExchange -= amt;
                addr.transfer(amt / priceOneGInMOAC);
                records[addr].redeemAmount.push(amt);
                records[addr].redeemtime.push(now);
            }
            prop.preRedeemNum -= len;
            dappRedeemPos += len;
            res = false;
        }
        if (res) {
            revenueDistribution(hash);
            flushEnd(hash, false);
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.requestEnterAndRedeem));
        }

        totalOperation -= (gasinit - msg.gas + 15000) * tx.gasprice;
        msg.sender.transfer((gasinit - msg.gas + 15000) * tx.gasprice);

        if (subchainstatus == uint(SubChainStatus.close)) {
            owner.transfer(this.balance - totalExchange/priceOneGInMOAC - totalBond);
            totalOperation = 0;
        }
        return true;
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
        require(owner == msg.sender);
        totalOperation += msg.value;
        if( totalOperation > contractNeedFund ) {
            contractNeedFund = 0;
            uint blk = lastFlushBlk + flushInRound + nodeCount * 2 * proposalExpiration;

            if (block.number >= blk) {
                lastFlushBlk = block.number;
                SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.updateLastFlushBlk));
            }
        }
    }

    function withdraw(address recv, uint amount) public {
        require(owner == msg.sender);
        //withdraw to address
        recv.transfer(amount);
        totalOperation -= amount;
    }

    function withdrawal() private {
        subchainstatus = uint(SubChainStatus.close);
        registerFlag = 0;
        VssBase vssbaseContract = VssBase(vssbase);

        //release fund
        SCSProtocolBase protocnt = SCSProtocolBase(protocol);
        //release already enrolled scs
        for (uint i = nodeCount; i > 0; i--) {
            //release fund
            address cur = nodeList[i-1];
            protocnt.releaseFromSubchain(
                cur,
                penaltyBond
            );
            vssbaseContract.unregisterVSS(cur);
            delete nodeList[i-1];
        }
        nodeCount = 0;

        for (i = joinCntNow; i > 0; i--) {
            cur = nodesToJoin[i-1];
            protocnt.releaseFromSubchain(
                cur,
                penaltyBond
            );
            vssbaseContract.unregisterVSS(cur);
            delete nodesToJoin[i-1];
            nodesToJoin.length --;
        }
        joinCntNow = 0;
        joinCntMax = 0;
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
        lastFlushBlk = block.number;
        flushInRound = 60;
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.reset));
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
        SCSProtocolBase protocnt = SCSProtocolBase(protocol);
        if (!protocnt.isPerforming(addr)) {
            return false;
        }
        return true;
    }

    function applyJoinNodes() private returns (bool) {
        uint i = 0;
        bool nodesChanged = false;
        VssBase vssbaseContract = VssBase(vssbase);
        for (i = joinCntNow; i > 0; i--) {
            if( nodePerformance[nodesToJoin[i-1]] == NODE_INIT_PERFORMANCE) {
                nodeList.push(nodesToJoin[i-1]);
                nodeCount++;
                nodesChanged = true;

                // activate the node with vss
                vssbaseContract.activateVSS(nodesToJoin[i-1]);

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

        return nodesChanged;
    }

    // reuse this code for remove bad node or other volunteerly leaving node
    // nodetype 0: bad node, 1: volunteer leaving node
    function applyRemoveNodes(uint nodetype) private returns (bool) {
        SCSProtocolBase protocnt = SCSProtocolBase(protocol);
        VssBase vssbaseContract = VssBase(vssbase);
        bool nodesChanged = false;

        uint count = nodesToDispel.length;
        if (nodetype == 1) {
            count = nodeToReleaseCount;
        }

        if (count == 0) {
            return nodesChanged;
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
                vssbaseContract.unregisterVSS(nodeList[i-1]);
                nodeList[i-1] = nodeList[nodeCount];
                delete nodeList[nodeCount];
                nodeList.length--;
                nodesChanged = true;
            }
        }

        //clear nodesToDispel and nodesToRelease array
        if (nodetype == 0) {
            //clear bad ones
            nodesToDispel.length = 0 ;
        } else {
            //clear release count
            nodeToReleaseCount = 0;
        }

        return nodesChanged;
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

    function buyMintToken() public payable returns (bool){
        uint256 token = msg.value * priceOneGInMOAC;
        uint256 balance = BALANCE - totalExchange;
        uint256 refund = 0;
        if(token > balance){
            refund = ( token - balance) / priceOneGInMOAC;
            msg.sender.transfer( refund );
            token = balance;
        }
        totalExchange += token;
        holdingPool.userAddr.push(msg.sender);
        holdingPool.amount.push(token);
        holdingPool.time.push(now);
        return true;
    }

    function getBlockNumber() public view returns (int) {
        return int(block.number);
    }
}
