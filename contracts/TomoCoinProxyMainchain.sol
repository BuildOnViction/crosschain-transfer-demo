pragma solidity ^0.4.18;
import "./TomoCoin.sol";
import "./Lib.sol";

contract CashInMainchain is Ownable {
  TomoCoin public token;
  address public tomoCommunityDeposit;

  event CashIn( address _from, uint _value );

  function CashInMainchain(
    TomoCoin _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoin(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashIn(address _from, uint256 _value) onlyOwner {
    token.transferFrom(_from, tomoCommunityDeposit, _value);
    CashIn(_from, _value);
  }
}

contract CashOutMainchain is Ownable {
  TomoCoin public token;
  address public tomoCommunityDeposit;


  function CashOutMainchain(
    TomoCoin _tomoCoinAddress,
    address _tomoCommunityDeposit
  )
  {
    token = TomoCoin(_tomoCoinAddress);
    tomoCommunityDeposit = _tomoCommunityDeposit;
  }

  function cashOut(address _to, uint256 _value) onlyOwner {
    token.transferFrom(tomoCommunityDeposit, _to, _value);
  }
}
