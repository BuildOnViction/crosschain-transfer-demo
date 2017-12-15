pragma solidity ^0.4.18;
import "./TomoCoinMainchain.sol";

contract CashInMainchain is Ownable {
  TomoCoinMainchain public token;

  event CashIn( address _user, uint _value );

  function CashInMainchain(
    TomoCoinMainchain _tomoCoinAddress
  )
  {
    token = TomoCoinMainchain(_tomoCoinAddress);
  }

  function cashIn(address _user, uint256 _value) onlyOwner {
    token.deposit(_user, _value);
    CashIn(_user, _value);
  }
}

contract CashOutMainchain is Ownable {
  TomoCoinMainchain public token;
  address public tomoCommunityDeposit;

  event CashOut( address _from, uint _value );

  function CashOutMainchain(
    TomoCoinMainchain _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoinMainchain(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashOut(address _user, uint256 _value) onlyOwner {
    token.transferFrom(tomoCommunityDeposit, _user, _value);
    CashOut(_user, _value);
  }
}
