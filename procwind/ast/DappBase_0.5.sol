pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

/**
 * @title DappBase.sol
 * @author David Chen, 
 *         Qing Xu
 * @dev 
 * Dapp control contract.
 * AppChain need to deploy this contract first to run
 * the Dapps compiled with solidity 0.5.x compiler.
 * 
 * Requires : N/A
 * Required by: N/A
 */
contract DappBase {
    enum DappState {disable, enable, haveCoin, noCoin}

    struct DappInfo {
        address dappAddr;
        address owner;
        string  dappABI;
        uint256    state;
    }

	struct RedeemMapping {
        address[] userAddr;
        uint256[] userAmount;
        uint256[] time;
    }
    
    struct Task{
        bytes32 hash;
        address[] voters;
        bool distDone;
    }
    
    struct EnterRecords {
        address[] userAddr;
        uint256[] amount;
        uint256[] time;
        uint256[] buyTime;
    }
    
    string public coinName;
    RedeemMapping internal redeem;
    address[] public curNodeList;//
    mapping(bytes32=>Task) task;
    mapping(bytes32=>address[]) nodeVoters;
    address internal owner;
    EnterRecords internal enterRecords;
    uint256 public enterPos;
    DappInfo[] public dappList;
    mapping(address => uint256) public dappRecord;
    bool public allDeploySwitch = false;//false-only owner can deploy; true-anyone can deploy
    
	constructor(string memory _name, bool _switch) public payable {
		owner = msg.sender;
		coinName = _name;
		allDeploySwitch = _switch;
	}
	
	function getCurNodeList() public view returns (address[] memory nodeList) {
        
        return curNodeList;
    }
    
    function getEnterRecords(address userAddr) public view returns (uint256[] memory enterAmt, uint256[] memory entertime) {
        uint256 i;
        uint256 j = 0;
        
        for (i = 0; i < enterPos; i++) {
            if (enterRecords.userAddr[i] == userAddr) {
                j++;
            }
        }
        
        uint256[] memory amounts = new uint256[](j);
        uint256[] memory times = new uint256[](j);
        j = 0;
        for (i = 0; i < enterPos; i++) {
            if (enterRecords.userAddr[i] == userAddr) {
                amounts[j] = enterRecords.amount[i];
                times[j] = enterRecords.time[i];
                j++;
            }
        }
        return (amounts, times);
    }
	
	function getRedeemMapping(address userAddr, uint256 pos) public view returns (address[] memory redeemingAddr, uint256[] memory redeemingAmt, uint256[] memory redeemingtime) {
        uint256 j = 0;
        uint256 k = 0;
        
        if (userAddr != address(0)) {
            for (k = pos; k < redeem.userAddr.length; k++) {
                if (redeem.userAddr[k] == userAddr) {
                    j++;
                }
            }
        } else {
            j += redeem.userAddr.length - pos;
        }
        address[] memory addrs = new address[](j);
        uint256[] memory amounts = new uint256[](j);
        uint256[] memory times = new uint256[](j);
        j = 0;
        for (k = pos; k < redeem.userAddr.length; k++) {
            if (userAddr != address(0)) {
                if (redeem.userAddr[k] == userAddr) {
                    amounts[j] = redeem.userAmount[k];
                    times[j] = redeem.time[k];
                    j++;
                }
            } else {
                addrs[j] = redeem.userAddr[k];
                amounts[j] = redeem.userAmount[k];
                times[j] = redeem.time[k];
                j++;
            }
        }
        return (addrs, amounts, times);
    }
	
	function redeemFromMicroChain() public payable {
        redeem.userAddr.push(msg.sender);
        redeem.userAmount.push(msg.value);
        redeem.time.push(now);
    }
    
    function have(address[] memory addrs, address addr) public view returns (bool) {
        uint256 i;
        for (i = 0; i < addrs.length; i++) {
            if(addrs[i] == addr) {
                return true;
            }
        }
        return false;
    }
    
    function updateNodeList(address[] memory newlist) public {
        //if owner, can directly update
        if(msg.sender==owner) {
            curNodeList = newlist;
        }
        //count votes
        bytes32 hash = sha256(abi.encodePacked(newlist));
        bytes32 oldhash = sha256(abi.encodePacked(curNodeList));
        if( hash == oldhash) return;
        
        bool res = have(nodeVoters[hash], msg.sender);
        if (!res) {
            nodeVoters[hash].push(msg.sender);
            if(nodeVoters[hash].length > newlist.length/2) {
                curNodeList = newlist;
            }
        }
        
        return;
    }
    
    function postFlush(uint256 pos, address payable[] memory tosend, uint256[] memory amount, uint256[] memory times) public {
        require(have(curNodeList, msg.sender));
        require(tosend.length == amount.length);
        require(pos == enterPos);
        
        bytes32 hash = sha256(abi.encodePacked(pos, tosend, amount, times));
        if( task[hash].distDone) return;
        if(!have(task[hash].voters, msg.sender)) {
            task[hash].voters.push(msg.sender);
            if(task[hash].voters.length > curNodeList.length/2 ) {
                //distribute
                task[hash].distDone = true;
                for(uint256 i=0; i<tosend.length; i++ ) {
                    enterRecords.userAddr.push(tosend[i]);
                    enterRecords.amount.push(amount[i]);
                    enterRecords.time.push(now);
                    enterRecords.buyTime.push(times[i]);
                    tosend[i].transfer(amount[i]);
                }
                enterPos += tosend.length;
            }
        }
    }

    function registerDapp(address dappAddr, address dappOwner, string memory dappABI) public {
        require(owner == msg.sender);
        require(dappRecord[dappAddr] == 0);
        dappList.push(DappInfo(dappAddr, dappOwner, dappABI, uint256(DappState.enable)));
        dappRecord[dappAddr] = dappList.length;
    }

    function removeDapp(address dappAddr) public {
        require(owner == msg.sender);
        uint256 count = dappList.length;
        for (uint256 i=0; i<count; i++) {
            if (dappList[i].dappAddr ==  dappAddr) {
                dappList[i] = dappList[count - 1];
                uint256 index = dappRecord[dappAddr];
                dappRecord[dappList[count - 1].dappAddr] = index;
                delete dappList[count - 1];
                dappList.length--;
                delete dappRecord[dappAddr];
                break;
            }    
         }
    }

    function updateDapp(address dappAddr, address dappOwner, string memory dappABI, uint256 state) public {
        require(owner == msg.sender);
        require(dappRecord[dappAddr] > 0);
        uint256 count = dappList.length;
        uint256 index = dappRecord[dappAddr] - 1;
        if (index < count) {
            if (dappList[index].dappAddr ==  dappAddr) {
                dappList[index].owner = dappOwner;
                dappList[index].dappABI = dappABI;
                dappList[index].state = state;
            }
        }
    }

    function getDappList() public view returns (DappInfo[] memory) {
		return dappList;
	}
	
	function getDappAddr(uint256 index) public view returns (address) {
		return dappList[index].dappAddr;
	}

    function getDappABI(address dappAddr) public view returns (string memory) {
        for (uint256 i = 0; i<dappList.length; i++) {
            if (dappList[i].dappAddr ==  dappAddr) {
                return dappList[i].dappABI;
            }
        }
		return "";
	}

    function getDappState(address dappAddr) public view returns (uint256) {
		for (uint256 i = 0; i<dappList.length; i++) {
            if (dappList[i].dappAddr ==  dappAddr) {
                return dappList[i].state;
            }
        }
		return 0;
	}
}