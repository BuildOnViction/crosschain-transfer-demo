pragma solidity ^0.4.18;

import "./TomoCoinSidechain.sol";

contract CashInSidechain is Ownable {
  TomoCoinSidechain public token;
  address public tomoCommunityDeposit;

  event CashIn( address _user, uint _value );

  function CashInSidechain(
    TomoCoinSidechain _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoinSidechain(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashIn(address _user, uint256 _value) onlyOwner {
    token.transferFrom(tomoCommunityDeposit, _user, _value);
    CashIn(_user, _value);
  }
}

contract CashOutSidechain is Ownable {
  TomoCoinSidechain public token;

  event CashOut( address _user, uint _value );

  function CashOutSidechain(
    TomoCoinSidechain _tomoCoinAddress
  )
  {
    token = TomoCoinSidechain(_tomoCoinAddress);
  }

  function cashOut(address _user, uint256 _value) onlyOwner {
    token.deposit(_user, _value);
    CashOut(_user, _value);
  }
}
