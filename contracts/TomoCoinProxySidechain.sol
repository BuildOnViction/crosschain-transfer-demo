pragma solidity ^0.4.18;
import "./TomoCoinSidechain.sol";
import "./Lib.sol";

contract CashInSidechain {
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

  function () payable {    
    importTokens(Lib.bytesToAddress(msg.data), msg.value);
  }

  function importTokens(address _to, uint256 _value) internal {
    token.transferFrom(tomoCommunityDeposit, _to, _value);
  }
}

contract CashOutSidechain {
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

  function () payable {    
    exportTokens(msg.sender, msg.value);
  }

  function exportTokens(address _from, uint256 _value) internal {
    token.transferFrom(_from, tomoCommunityDeposit, _value);
    CashOut(_from, _value);
  }
}
