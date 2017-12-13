pragma solidity ^0.4.18;
import "./TomoCoinMainchain.sol";

contract CashInMainchain is Ownable {
  TomoCoinMainchain public token;
  address public tomoCommunityDeposit;

  event CashIn( address _from, uint _value );

  function CashInMainchain(
    TomoCoinMainchain _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoinMainchain(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashIn(address _from, uint256 _value) onlyOwner {
    token.deposit(_from, _value);
    CashIn(_from, _value);
  }
}

contract CashOutMainchain is Ownable {
  TomoCoinMainchain public token;
  address public tomoCommunityDeposit;


  function CashOutMainchain(
    TomoCoinMainchain _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoinMainchain(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashOut(address _to, uint256 _value) onlyOwner {
    token.transferFrom(tomoCommunityDeposit, _to, _value);
  }
}
