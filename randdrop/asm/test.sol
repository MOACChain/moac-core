pragma solidity ^0.4.8;
/*
 * A test contract to run on RandDrop AppChain
 * It can use the internal precompileBLS() 
 * method to get a randcom number.
 * The address of the method is 0x20.
*/

// Internal function header
contract precompileBLS {
    function f() public returns(bytes32);
}

// Contract of a simple lottery program
contract Lottery {
  mapping (uint8 => address[]) playersByNumber ;
  address owner;
  enum LotteryState { Accepting, Finished }
  LotteryState state;

  function Lottery() public {
      owner = msg.sender;
      state = LotteryState.Accepting;
  }

  function enter(uint8 number) public payable {
      require(number<=255);
      require(state == LotteryState.Accepting);
      playersByNumber[number].push(msg.sender);
  }

  function determineWinner() public {
      require(msg.sender == owner);
      state = LotteryState.Finished;
      uint8 winningNumber = random();
      distributeFunds(winningNumber);
  }

  function resetLotteryState() public {
      require(msg.sender == owner);
      state = LotteryState.Accepting;
  }

  function distributeFunds(uint8 winningNumber) private returns(uint256) {
      uint256 winnerCount = playersByNumber[winningNumber].length;
      uint256 balanceToDistribute = this.balance/(2*winnerCount);
      for (uint i = 0; i<winnerCount; i++) {
          playersByNumber[winningNumber][i].transfer(balanceToDistribute);
      }

      return this.balance;
  }

  // Call the internal BLS function to the 
  function random() private view returns (uint8) {
      precompileBLS bls = precompileBLS(0x20);
      // get the 256-bit random number
      bytes32 r = bls.f();
      // return its first 8 bits, range from 0-255
      return uint8(r[0]);
  }
} 
