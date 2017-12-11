pragma solidity ^0.4.18;

import "./TomoCoinSidechain.sol";
import "./Lib.sol";

contract CashInSidechain is Ownable {
  TomoCoinSidechain public token;
  address public tomoCommunityDeposit;

  function CashInSidechain(
    TomoCoinSidechain _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoinSidechain(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashIn(address _to, uint256 _value) onlyOwner {
    token.transferFrom(tomoCommunityDeposit, _to, _value);
  }
}

contract CashOutSidechain is Ownable {
  TomoCoinSidechain public token;
  address public tomoCommunityDeposit;

  event CashOut( address _from, uint _value );

  function CashOutSidechain(
    TomoCoinSidechain _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoinSidechain(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashOut(address _from, uint256 _value) onlyOwner {
    token.deposit(_from, _value);
    CashOut(_from, _value);
  }
}
