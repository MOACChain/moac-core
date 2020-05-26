pragma solidity ^0.4.11;
pragma experimental ABIEncoderV2;

/**
 * @title VssBase.sol
 * @author Yifan Wang
 * @dev 
 * System smart contract for verifiable secret sharing
 * 05/20/2020 Added setGeneralAttributes function
 * 
 */

/*
======= VssBase.sol:SCSRelay =======
Function signatures:
219dc4a0: notifySCS(address,uint256)

======= VssBase.sol:SubChainBase =======
Function signatures:
50859fd9: getSCSRole(address)
11f79f7c: vssSlash(address)

======= VssBase.sol:VssBase =======
Function signatures:
d89da49c: GetCaller()
9f1e5f0e: GetLastSender()
e4c1de98: activateVSS(address)
fc9c8d39: caller()
de79b856: deactivateVSS(address)
029471e0: getActiveVSSMemberCount()
ed0c88ef: getActiveVSSMemberList()
7e2a1ed3: getLastSlashVoted(address)
9496db22: getPrivateShares(address)
80c3fe62: getPublicShares(address)
8b051563: getRevealedShare(int256)
50859fd9: getSCSRole(address)
fc054aa8: getVSSNodeIndex(address)
2a292dc7: getVSSNodesIndexs(address[])
2512b947: getVSSNodesPubkey(address[])
91e4d7f7: isConfigReady(int256)
9d6e8c6c: isSlashed(int256)
2a56ce43: lastConfigUpload(address)
b5ef046e: lastConfigUploadByBlock(address)
7d0f6c77: lastNodeChangeBlock()
514cac35: lastNodeChangeConfigVersion()
256fec88: lastSender()
7457b355: lastSlashingVoted(address)
8da5cb5b: owner()
eefb4227: registerVSS(address,bytes32)
7ce54cc8: reportSlowNode(address)
1a1efdaf: resetVSSGroup()
282c0b8f: reveal(address,bytes,bytes,bytes,bytes,bytes)
99ba5a92: revealIndex()
0b927b32: revealed(bytes32)
307f201a: revealedReporter(int256)
59495523: revealedSigMapping(bytes32)
51ed07e4: revealedViolator(int256)
778ada10: reveals(int256)
beb92f55: setCaller(address)
13af4035: setOwner(address)
ef0fb558: setThreshold(int256)
1c2c6b4d: slashed(int256)
56a09939: slashing(int256,bool)
5e296853: slashingRejects(int256)
3430cadd: slashingVoters(int256,address)
94a629be: slashingVotes(int256)
3ed4f116: slowNodeThreshold()
dbccad54: slowNodeVoted(address,int256,address)
6911af65: slowNodeVotes(address,int256)
f06dc92d: unregisterVSS(address)
ca6c8a31: uploadVSSConfig(bytes,bytes)
3891c320: vote(int256)
9c081852: voters(int256,address)
d0bef4ae: votes(int256)
bbc3d237: vssConfigVersion()
cc30a60f: vssNodeCount()
98b72f98: vssNodeMemberships(address)
984624ba: vssThreshold()
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

contract SubChainBase {
    function getSCSRole(address scs) public view returns (uint);
    function vssSlash(address addr) public;
}

contract VssBase{
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

    // system contract
    SCSRelay internal constant SCS_RELAY = SCSRelay(0x000000000000000000000000000000000000000d);

    struct RevealedShare {
        bytes PubShare;
        bytes PubSig;
        bytes PriShare;
        bytes PriSig;
        bytes Revealed;
        address Violator;
        address Whistleblower;
    }

    mapping(address => bytes32) private vssPublicKeys;
    mapping(address => int) private vssNodeIndexs;  // value start from 0
    mapping(int => address) private reverseVSSNodeIndexs; // key start from 0, reverse of vssNodeIndexs
    mapping(address => uint) public vssNodeMemberships; // Indicates if the node is still in the vss group
    mapping(address => bytes) private vssPublicShares; // nodeID => list of public shares in json
    mapping(address => bytes) private vssPrivateShares; // nodeID => list of private shares in json

    // vote and slashing related data
    mapping(int => int) public votes; // config version => # of votes
    // config nested mapping config_version => (voter address => if voted or not for the config version)
    mapping(int => mapping(address => bool)) public voters;
    // slash index => number of slashing votes
    mapping(int => int) public slashingVotes;
    // slash index => number of reject votes
    mapping(int => int) public slashingRejects;
    // slash index => violator address  => voter => if voted
    mapping(int => mapping(address => bool)) public slashingVoters;
    // config version => number of total slashing votes
    mapping(int => int) public slashed;
    // check if share is revealed already
    mapping(bytes32 => bool) public revealed;
    // record the violator address of the revealed share
    mapping(int => address) public revealedViolator;
    // record the reporter address of the revealed share
    mapping(int => address) public revealedReporter;
    // record the actual revealed share
    mapping(int => RevealedShare) public reveals;
    // record index of last slashing voted
    mapping(address => int) public lastSlashingVoted;
    // mapping from sig sha to slash index
    mapping(bytes32 => int) public revealedSigMapping;
    // mapping from scs to the version number of its last config upload
    mapping(address => int) public lastConfigUpload;
    // mapping from scs to the block number of its last config upload
    mapping(address => int) public lastConfigUploadByBlock;
    // mapping from violator address to (inccident id => number of votes)
    mapping(address => mapping(int => uint)) public slowNodeVotes;
    // mapping from violator address to (inccident id => whether voted or not)
    mapping(address => mapping(int => mapping(address => bool))) public slowNodeVoted;

    address public owner;
    address public caller; // this should set to the related subchainbase address
    address public lastSender;
    int public vssThreshold = 0;
    int public vssNodeCount = 0;
    int public vssConfigVersion = 0;
    int public revealIndex = 0;
    int public lastNodeChangeConfigVersion = 0;
    int public lastNodeChangeBlock = 0;
    int public slowNodeThreshold = 50; // number of blocks

    // reserve for future usage
    mapping(bytes32 => mapping(int => byte[])) public generalAttributes;

    enum VssMembership {noreg, active, inactive} // noreg: node never seen before

    function VssBase(int threshold) public {
        vssThreshold = threshold;
        owner = msg.sender;
    }

    function setGeneralAttributes(bytes32 namespace, int key, byte[] value) {
        require(owner == msg.sender);
        generalAttributes[namespace][key] = value;
    }

    function setThreshold(int newThreshold) public {
        require(owner == msg.sender);
        vssThreshold = newThreshold;
        vssConfigVersion++;
    }

    function setCaller(address callerAddr) public {
        require(owner == msg.sender);
        caller = callerAddr;
    }

    function setOwner(address newOwner) public {
        require(owner == msg.sender);
        owner = newOwner;
    }

    function setSlowNodeThreshold(int newThreshold) public {
        require(owner == msg.sender);
        slowNodeThreshold = newThreshold;
    }

    function registerVSS(address sender, bytes32 publickey) public {
        require(caller == msg.sender || owner == msg.sender);

        lastSender = msg.sender;
        vssPublicKeys[sender] = publickey;
    }

    function unregisterVSS(address sender) public {
        require(caller == msg.sender || owner == msg.sender) ;
        lastSender = msg.sender;

        if (vssNodeMemberships[sender] == uint(VssMembership.active)) {
            vssNodeMemberships[sender] = uint(VssMembership.inactive);
            lastNodeChangeConfigVersion = vssConfigVersion;
            lastNodeChangeBlock = int(block.number);
        }
    }

    function deactivateVSS(address sender) public {
        require(caller == msg.sender || owner == msg.sender) ;

        if (vssNodeMemberships[sender] == uint(VssMembership.active)) {
            vssNodeMemberships[sender] = uint(VssMembership.inactive);
            vssConfigVersion++;
        }
    }

    function activateVSS(address sender) public {
        require(caller == msg.sender || owner == msg.sender);
        lastSender = msg.sender;

        // if it is a node we never seen before which is noreg
        if (vssNodeMemberships[sender] == uint(VssMembership.noreg)) {
            vssNodeIndexs[sender] = vssNodeCount;
            reverseVSSNodeIndexs[vssNodeCount] = sender;
            vssNodeCount++;
            vssNodeMemberships[sender] = uint(VssMembership.active);
            lastNodeChangeConfigVersion = vssConfigVersion;
            lastNodeChangeBlock = int(block.number);
        }

        // if it is a node we know before, just re-active it
        if (vssNodeMemberships[sender] == uint(VssMembership.inactive)) {
            vssNodeMemberships[sender] = uint(VssMembership.active);
            lastNodeChangeConfigVersion = vssConfigVersion;
            lastNodeChangeBlock = int(block.number);
        }
    }

    function uploadVSSConfig(bytes publicShares, bytes privateShares) public {
        // only active member can upload vss config
        if (vssNodeMemberships[msg.sender] != uint(VssMembership.active)) {
            return;
        }

        vssPublicShares[msg.sender] = publicShares;
        vssPrivateShares[msg.sender] = privateShares;
        vssConfigVersion++;
        lastConfigUpload[msg.sender] = vssConfigVersion;
        lastConfigUploadByBlock[msg.sender] = int(block.number);
    }

    // vote the vss config to be ready
    function vote(int configVersion) public {
        // must be active member and can not vote twice
        require(vssNodeMemberships[msg.sender] == uint(VssMembership.active));
        require(voters[configVersion][msg.sender] == false);

        votes[configVersion] += 1;
        voters[configVersion][msg.sender] = true;
    }

    // use reportSlowNode to report node that's slow in uploading new config after node change
    function reportSlowNode(address violator) public {
        // must be active member to report
        require(vssNodeMemberships[msg.sender] == uint(VssMembership.active));

        int currentBlockNumber = int(block.number);
        int nodeUploadBlockNumber = lastConfigUploadByBlock[violator];
        // if it's behind node change config version and is too far ( > slowNodeThreshold) away
        if (lastConfigUpload[violator] < lastNodeChangeConfigVersion && (currentBlockNumber - lastNodeChangeBlock) > slowNodeThreshold) {
            // one node can only report once for one inccident
            if (slowNodeVoted[violator][nodeUploadBlockNumber][msg.sender] == false) {
                slowNodeVotes[violator][nodeUploadBlockNumber] += 1;
                slowNodeVoted[violator][nodeUploadBlockNumber][msg.sender] = true;
            }

            // if more than threshold nodes report, then slash the violator
            if (slowNodeVotes[violator][nodeUploadBlockNumber] >= uint(vssThreshold)) {
                SubChainBase subchainbaseContract = SubChainBase(caller);
                subchainbaseContract.vssSlash(violator);
            }
        }
    }

    // use reveal to upload bad shares sent by other member nodes
    function reveal(address violator, bytes pubShare, bytes pubSig, bytes priShare, bytes priSig, bytes revealedPri) public {
        // must be active member to call reveal
        require(vssNodeMemberships[msg.sender] == uint(VssMembership.active));
        bytes32 sigSha = keccak256(pubSig, priSig);
        require(revealed[sigSha] == false);

        revealedViolator[revealIndex] = violator;
        revealedReporter[revealIndex] = msg.sender;
        reveals[revealIndex] = RevealedShare({
            PubShare: pubShare,
            PubSig: pubSig,
            PriShare: priShare,
            PriSig: priSig,
            Revealed: revealedPri,
            Violator:violator,
            Whistleblower: msg.sender
        });
        revealed[sigSha] = true;
        revealedSigMapping[sigSha] = revealIndex;
        revealIndex += 1;

        // after reveal, at least one of the private keys is public.
        // we need to notify the whole group to run vss protocol again
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.vssGroupConfig));
    }

    function getRevealedShare(int index) public returns(RevealedShare){
        return reveals[index];
    }

    // index is the id for the slashing round
    function slashing(int index, bool slash) public {
        // must be active member to call slashing
        require(vssNodeMemberships[msg.sender] == uint(VssMembership.active));
        // can not slash twice
        require(slashingVoters[index][msg.sender] == false);

        // mark we slashed
        slashingVoters[index][msg.sender] = true;
        address toBeSlashed;
        SubChainBase subchainbaseContract = SubChainBase(caller);

        // slash in the subchainbase contract
        if (slash == true) {
            slashingVotes[index] += 1;
            if (slashingVotes[index] >= vssThreshold) {
                toBeSlashed = revealedViolator[index];
                subchainbaseContract.vssSlash(toBeSlashed);
            }
        } else {
            slashingRejects[index] += 1;
            if (slashingRejects[index] >= vssThreshold) {
                toBeSlashed = revealedReporter[index];
                subchainbaseContract.vssSlash(toBeSlashed);
            }
        }

        // update last slash index only if current one is higher
        if (index > lastSlashingVoted[msg.sender]) {
            lastSlashingVoted[msg.sender] = index;
        }
    }

    function getLastSlashVoted(address addr) public view returns(int) {
        return  lastSlashingVoted[addr];
    }

    function isConfigReady(int configVersion) public view returns(bool) {
        if (votes[configVersion] >= vssThreshold) {
            return true;
        }

        return false;
    }

    function isSlashed(int configVersion) public view returns(bool) {
        return slashed[configVersion] > 0;
    }

    function GetLastSender() public view returns(address) {
        return lastSender;
    }

    function GetCaller() public view returns(address) {
        return caller;
    }

    function getPublicShares(address node) public view returns(bytes) {
        return vssPublicShares[node];
    }

    function getPrivateShares(address node) public view returns(bytes) {
        return vssPrivateShares[node];
    }

    function getVSSNodesPubkey(address[] nodes) public view returns (bytes32[]) {
        uint n = nodes.length;
        bytes32[] memory publickeys = new bytes32[](n);
        for(uint i = 0; i < nodes.length; i++) {
            publickeys[i] = vssPublicKeys[nodes[i]];
        }
        return publickeys;
    }

    function getActiveVSSMemberCount() public view returns (int) {
        int result = 0;
        for(int i=0;i<vssNodeCount;i++) {
            if (vssNodeMemberships[reverseVSSNodeIndexs[i]] == uint(VssMembership.active)) {
                result++;
            }
        }

        return result;
    }

    function getActiveVSSMemberList() public view returns (address[]) {
        int n = getActiveVSSMemberCount();
        address[] memory addressList = new address[](uint(n));
        uint index = 0;
        for(int i = 0;i < vssNodeCount; i++) {
            if (vssNodeMemberships[reverseVSSNodeIndexs[i]] == uint(VssMembership.active)) {
                addressList[index] = reverseVSSNodeIndexs[i];
                index++;
            }
        }

        return addressList;
    }

    function getVSSNodesIndexs(address[] nodes) public view returns (int[]) {
        uint n = nodes.length;
        int[] memory indexs = new int[](n);
        for(uint i = 0; i < nodes.length; i++) {
            indexs[i] = vssNodeIndexs[nodes[i]];
        }
        return indexs;
    }

    function getVSSNodeIndex(address scs) public view returns (int) {
        return vssNodeIndexs[scs];
    }

    // vnode call this function to determine the role
    function getSCSRole(address scs) public view returns (uint) {
        SubChainBase subchainbaseContract = SubChainBase(caller);
        return subchainbaseContract.getSCSRole(scs);
    }

    function resetVSSGroup() public {
        require(owner == msg.sender);
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.vssGroupConfig));
    }
}
