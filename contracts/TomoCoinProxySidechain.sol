pragma solidity ^0.4.18;

import "./TomoCoin.sol";
import "./Lib.sol";

contract CashInSidechain is Ownable {
  TomoCoin public token;
  address public tomoCommunityDeposit;

  function CashInSidechain(
    TomoCoin _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoin(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashIn(address _to, uint256 _value) onlyOwner {
    token.transferFrom(tomoCommunityDeposit, _to, _value);
  }
}

contract CashOutSidechain is Ownable {
  TomoCoin public token;
  address public tomoCommunityDeposit;

  event CashOut( address _from, uint _value );

  function CashOutSidechain(
    TomoCoin _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoin(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashOut(address _from, uint256 _value) onlyOwner {
    token.transferFrom(_from, tomoCommunityDeposit, _value);
    CashOut(_from, _value);
  }
}
