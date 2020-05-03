pragma solidity ^0.4.0;
/*
 * A test contract to run on MOAC platform
 * BaseChain or AppChain with solidity 0.4.x support
*/
contract addab {
  uint public count;

  function add(uint a, uint b) returns(uint) {
    count++;
    return a + b;
  }

  function getCount() returns(uint){
    return count;
  }
}
