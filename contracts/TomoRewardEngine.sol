pragma solidity ^0.4.18;
import "./TomoCoinSidechain.sol";


// This is a simple example for rewardengine algorithm. It is only used for Proof of Coding

contract RewardEngine {
  TomoCoinSidechain public token;
  address public tomoCommunityDeposit;
  uint256 public constant decimals = 18;

  uint256 public constant totalRewardCap = 40000000 * 10**decimals; // 40% tomocoin
  uint256 public rewardCap;

  event Reward( address _to, uint _value );

  function RewardEngine(
    TomoCoinSidechain _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoinSidechain(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
    rewardCap = totalRewardCap;
  }

  function reward(
    address userWallet
  )
  {
    uint256 bonus = rewardCap * 1 / 10000000;
    rewardCap = rewardCap - bonus;
    token.transferFrom(tomoCommunityDeposit, userWallet, bonus);
    Reward(userWallet, bonus);
  }
}
