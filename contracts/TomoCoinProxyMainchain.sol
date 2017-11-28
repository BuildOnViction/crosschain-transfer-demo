pragma solidity ^0.4.18;
import "./TomoCoinMainchain.sol";
import "./Lib.sol";

contract CashInMainchain {
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

  function () payable {    
    importTokens(msg.sender, msg.value);
  }

  function importTokens(address _from, uint256 _value) internal {
    token.transferFrom(_from, tomoCommunityDeposit, _value);
    CashIn(_from, _value);
  }
}

contract CashOutMainchain {
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

  function () payable {    
    exportTokens(Lib.bytesToAddress(msg.data), msg.value);
  }

  function exportTokens(address _to, uint256 _value) internal {
    token.transferFrom(tomoCommunityDeposit, _to, _value);
  }
}
