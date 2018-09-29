pragma solidity ^0.4.11;

/**
 * @title VnodeProtocolBase.sol
 * @author David Chen
 * @dev 
 * Subchain definition for application.
 * All the operations are done using the smallest and indivisible token unit,
 * just as on Ethereum all the operations are done in wei.
 */
contract SysContract {
    function delayedSend(uint _blk, address _to, uint256 _value, bool bonded) public returns (bool success);
}


contract VnodeProtocolBase {
    enum VnodeStatus { notRegistered, performing, withdrawPending, initialPending, withdrawDone, inactive }

    struct Vnode {
        address from; //address as id
        uint256 bond;   // value
        uint state; // one of VnodeStatus
        uint256 registerBlock;
        uint256 withdrawBlock;
        string link;
    }

    mapping(address => uint) public vnodeList;
    Vnode[] public vnodeStore;

    uint public vnodeCount;
    uint public bondMin;
    uint public constant PEDNING_BLOCK_DELAY = 50; // 8 minutes
    uint public constant WITHDRAW_BLOCK_DELAY = 8640; // one day, given 10s block rate
 
    //events
    //event Registered(address vnode);
    // event UnRegistered(address sender);

    //constructor
    function VnodeProtocolBase(uint bmin) public {
        vnodeCount = 0;
        bondMin = bmin;
        //register a dummy one
        Vnode memory nd;
        nd.from = address(0);
        nd.bond = 0;
        nd.state = uint(VnodeStatus.performing);
        nd.registerBlock = block.number + PEDNING_BLOCK_DELAY;
        nd.withdrawBlock = 2 ** 256 - 1;
        nd.link = "";
        
        vnodeStore.push(nd);
        vnodeCount++;
    }

    function() public payable {  
        revert();
    }

    // register for vnode
    function register(address vnode, string link) public payable returns (bool) {
        //already registered or not enough bond
        require( vnodeList[vnode] == 0 && msg.value >= bondMin*10**18 );

        Vnode memory nd;
        nd.from = vnode;
        nd.bond = msg.value;
        nd.state = uint(VnodeStatus.performing);
        nd.registerBlock = block.number + PEDNING_BLOCK_DELAY;
        nd.withdrawBlock = 2 ** 256 - 1;
        nd.link = link;
        
        vnodeStore.push(nd);
        vnodeList[vnode] = vnodeCount;
        vnodeCount++;
        return true;
    }

    // withdrawRequest for vnode
    function withdrawRequest() public returns (bool success) {
        //only can withdraw when active
        require(vnodeList[msg.sender] > 0 );
        uint index = vnodeList[msg.sender];
        require(vnodeStore[index].from == msg.sender);
        require(vnodeStore[index].state == uint(VnodeStatus.performing));

        vnodeStore[index].withdrawBlock = block.number;
        vnodeStore[index].state = uint(VnodeStatus.withdrawPending);

        //UnRegistered(msg.sender);
        return true;
    }

    function withdraw() public {
        require( vnodeList[msg.sender] > 0 );
        uint index = vnodeList[msg.sender];
        require( vnodeStore[index].from == msg.sender);

        if (
            vnodeStore[index].state == uint(VnodeStatus.withdrawPending)
            && block.number > (vnodeStore[index].withdrawBlock + WITHDRAW_BLOCK_DELAY)
        ) {
            uint value = vnodeStore[index].bond;
            //replace with last one
            vnodeCount--;
            vnodeStore[index].from = vnodeStore[vnodeCount].from;
            vnodeStore[index].bond = vnodeStore[vnodeCount].bond;
            vnodeStore[index].registerBlock = vnodeStore[vnodeCount].registerBlock;
            vnodeStore[index].withdrawBlock = vnodeStore[vnodeCount].withdrawBlock;
            vnodeStore[index].link = vnodeStore[vnodeCount].link;
            delete vnodeStore[vnodeCount];

            //update index
            vnodeList[vnodeStore[index].from] = index;

            //refund to sender
            msg.sender.transfer(value);
        }
    }

    function isPerforming(address _addr) public view returns (bool res) {
        if(vnodeList[_addr] == 0 ) {
            return false;
        }
        return (vnodeStore[vnodeList[_addr]].state == uint(VnodeStatus.performing) && 
        vnodeStore[vnodeList[_addr]].registerBlock < block.number);
    }

    function pickRandomVnode(uint randness) public view returns (string target) {
        //com        
        if (vnodeCount < 2 ) {
            return "";
        } 

        uint index = randness%vnodeCount;
        //skip dummy
        if(index ==0 ){
            index++;
        }
        if( isPerforming(vnodeStore[index].from) ) {
            return vnodeStore[index].link; 
        }

        return  "";
    }

 
}
