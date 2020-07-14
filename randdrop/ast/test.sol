pragma solidity ^0.4.8;

/**
 * @title test.sol
 * @author Yifan Wang
 * @dev 
 * Example smart contract to use the random number function
 * in a lottrery program.
 * 
 */

contract SCSRandom {
    function random(uint256 blockNumber) public view returns(bytes32 r);
}

contract Lottery {
  mapping (uint8 => address[]) playersByNumber ;
  address owner;
  enum LotteryState { Accepting, Finished }
  LotteryState state;
  SCSRandom internal constant SCS_RANDOM = SCSRandom(0x0000000000000000000000000000000000000020);

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

  // Use internal AppChain function to get a random number
  function random() private view returns (uint8) {
      bytes32 r = SCS_RANDOM.random(block.number);
      // return its first 8 bits, range from 0-255
      return uint8(r[0]);
  }
}
