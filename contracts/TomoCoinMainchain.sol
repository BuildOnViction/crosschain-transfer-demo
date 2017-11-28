pragma solidity ^0.4.18;

// ================= Ownable Contract start =============================
/*
 * Ownable
 *
 * Base contract with an owner.
 * Provides onlyOwner modifier, which prevents function from running if it is called by anyone other than the owner.
 */
contract Ownable {
  address public owner;

  function Ownable() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(address newOwner) onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }
}
// ================= Ownable Contract end ===============================

// ================= Safemath Contract start ============================
/* taking ideas from FirstBlood token */
contract SafeMath {

  function safeAdd(uint256 x, uint256 y) internal returns(uint256) {
    uint256 z = x + y;
    assert((z >= x) && (z >= y));
    return z;
  }

  function safeSubtract(uint256 x, uint256 y) internal returns(uint256) {
    assert(x >= y);
    uint256 z = x - y;
    return z;
  }

  function safeMult(uint256 x, uint256 y) internal returns(uint256) {
    uint256 z = x * y;
    assert((x == 0)||(z/x == y));
    return z;
  }
}
// ================= Safemath Contract end ==============================

// ================= ERC20 Token Contract start =========================
/*
 * ERC20 interface
 * see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 {
  uint public totalSupply;
  function balanceOf(address who) constant returns (uint);
  function allowance(address owner, address spender) constant returns (uint);

  function transfer(address to, uint value) returns (bool ok);
  function transferFrom(address from, address to, uint value) returns (bool ok);
  function approve(address spender, uint value) returns (bool ok);
  event Transfer(address indexed from, address indexed to, uint value);
  event Approval(address indexed owner, address indexed spender, uint value);
}
// ================= ERC20 Token Contract end ===========================

// ================= Standard Token Contract start ======================
contract StandardToken is ERC20, SafeMath {

  /**
  * @dev Fix for the ERC20 short address attack.
   */
  modifier onlyPayloadSize(uint size) {
    require(msg.data.length >= size + 4) ;
    _;
  }

  mapping(address => uint) balances;
  mapping (address => mapping (address => uint)) allowed;

  function transfer(address _to, uint _value) onlyPayloadSize(2 * 32)  returns (bool success){
    balances[msg.sender] = safeSubtract(balances[msg.sender], _value);
    balances[_to] = safeAdd(balances[_to], _value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint _value) onlyPayloadSize(3 * 32) returns (bool success) {
    var _allowance = allowed[_from][msg.sender];

    balances[_to] = safeAdd(balances[_to], _value);
    balances[_from] = safeSubtract(balances[_from], _value);
    allowed[_from][msg.sender] = safeSubtract(_allowance, _value);
    Transfer(_from, _to, _value);
    return true;
  }

  function balanceOf(address _owner) constant returns (uint balance) {
    return balances[_owner];
  }

  function approve(address _spender, uint _value) returns (bool success) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) constant returns (uint remaining) {
    return allowed[_owner][_spender];
  }
}
// ================= Standard Token Contract end ========================

// ================= Pausable Token Contract start ======================
/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
  * @dev modifier to allow actions only when the contract IS paused
  */
  modifier whenNotPaused() {
    require (!paused);
    _;
  }

  /**
  * @dev modifier to allow actions only when the contract IS NOT paused
  */
  modifier whenPaused {
    require (paused) ;
    _;
  }

  /**
  * @dev called by the owner to pause, triggers stopped state
  */
  function pause() onlyOwner whenNotPaused returns (bool) {
    paused = true;
    Pause();
    return true;
  }

  /**
  * @dev called by the owner to unpause, returns to normal state
  */
  function unpause() onlyOwner whenPaused returns (bool) {
    paused = false;
    Unpause();
    return true;
  }
}
// ================= Pausable Token Contract end ========================

// ================= Tomocoin  start =======================
contract TomoCoin is SafeMath, StandardToken, Pausable {
  string public constant name = 'Tomo Coin';
  string public constant symbol = 'TMC';
  uint256 public constant decimals = 18;
  address public icoSaleDeposit;
  address public tokenSaleAddress;

  uint256 public constant tomoSeed = 10000000 * 10**decimals;
  uint256 public constant tomoPreSale = 10000000 * 10**decimals;
  uint256 public constant tomoSale = 20000000 * 10**decimals;
  uint256 public constant tomoCommunity = 40000000 * 10**decimals;
  uint256 public constant tomoCompany = 20000000 * 10**decimals;

  address public tomoSeedDeposit        = 0x216e05BD4AA93E93Cd95422dA8615a3D15AEcCc3;
  address public tomoPreSaleDeposit     = 0x2D5628021B1F73247C25ED129D12a8DDEaDCC3E3;
  address public tomoSaleDeposit        = 0x8D34a59A18D1A7B2A8A6A3dd1f5c46eB2311852b;
  address public tomoCommunityDeposit   = 0x3E3Ae28fA4A2F400781Fb5D77a88AD451D99cF4d;
  address public tomoCompanyDeposit   = 0x57C883DeE48334c8201aF1bB7296639Ab1806D96;

  function TomoCoin() { 
    balances[tomoSeedDeposit] = tomoSeed;
    balances[tomoPreSaleDeposit] = tomoPreSale;
    balances[tomoSaleDeposit] = tomoSale;
    balances[tomoCommunityDeposit] = tomoCommunity;
    balances[tomoCompanyDeposit] = tomoCompany;

    totalSupply = tomoSeed + tomoPreSale + tomoSale + tomoCommunity + tomoCompany;
  }

  function transfer(address _to, uint _value) whenNotPaused returns (bool success) {
    return super.transfer(_to,_value);
  }

  function approve(address _spender, uint _value) whenNotPaused returns (bool success) {
    return super.approve(_spender,_value);
  }

  function balanceOf(address _owner) constant returns (uint balance) {
    return super.balanceOf(_owner);
  }

  function setTokenSaleAddress(address _tokenSaleAddress) onlyOwner {
    if (_tokenSaleAddress != address(0)) {
      tokenSaleAddress = _tokenSaleAddress;
    }
  }

  function mint(address _recipient, uint _value) whenNotPaused returns (bool success) {
      assert(_value > 0);
      require(msg.sender == tokenSaleAddress);

      balances[tomoSaleDeposit] = safeSubtract(balances[tomoSaleDeposit], _value);
      balances[ _recipient ] = safeAdd(balances[_recipient], _value);

      Transfer(tomoSaleDeposit, _recipient, _value);
      return true;
  }
}
// ================= Ico Token Contract end =======================


// ================= Whitelist start ====================
contract TomoContributorWhitelist is Ownable {
    mapping(address=>uint) public whitelist;

    function TomoContributorWhitelist() {}

    event ListAddress( address _user, uint _time );

    function listAddress( address _user ) onlyOwner {
        whitelist[_user] = 1;
        ListAddress( _user, now );
    }

    function listAddresses( address[] _users ) onlyOwner {
        for( uint i = 0 ; i < _users.length ; i++ ) {
            listAddress( _users[i] );
        }
    }

    function check( address _user ) constant returns(bool) {
        uint cap = whitelist[_user];
        return cap > 0;
    }
}
// ================= Whitelist end ====================

// ================= Actual Sale Contract Start ====================
contract TomoTokenSale is SafeMath, Pausable {
  TomoCoin public token;
  TomoContributorWhitelist whitelist;

  address public ethFundDeposit = 0x334eE502e8bB4E2e5af547310F7B793A742f99A3;
  address public tomoFundDeposit   = 0x8D34a59A18D1A7B2A8A6A3dd1f5c46eB2311852b;

  uint256 public tokenCreationCap;
  uint256 public totalSupply;
  uint256 public fundingStartTime = 1504051200; // 2017-08-30
  uint256 public fundingEndTime = 1514592000; // 2017-12-30
  uint256 public minContribution = 0.05 ether;

  bool public isFinalized;

  event MintTomo(address from, address to, uint256 val);

  function TomoTokenSale(
    TomoCoin _tomoCoinAddress,
    TomoContributorWhitelist _tomoContributorWhitelistAddress
  )
  {
    token = TomoCoin(_tomoCoinAddress);
    whitelist = TomoContributorWhitelist(_tomoContributorWhitelistAddress);

    tokenCreationCap = token.balanceOf(tomoFundDeposit);
    isFinalized = false;
  }

  function buy(address to, uint256 val) internal returns (bool success) {
    MintTomo(tomoFundDeposit, to, val);
    return token.mint(to, val);
  }

  function () payable {    
    createTokens(msg.sender, msg.value);
  }

  function createTokens(address _beneficiary, uint256 _value) internal whenNotPaused {
    require (now >= fundingStartTime);
    require (now <= fundingEndTime);
    require (_value >= minContribution);
    require (!isFinalized);

    uint256 tokenExchangeRate = getExchangeRate(totalSupply);
    uint256 tokens = safeMult(_value, tokenExchangeRate);

    require (whitelist.check(msg.sender));

    uint256 checkedSupply = safeAdd(totalSupply, tokens);

    if (tokenCreationCap < checkedSupply) {        
      uint256 tokensToAllocate = safeSubtract(tokenCreationCap, totalSupply);
      uint256 tokensToRefund   = safeSubtract(tokens, tokensToAllocate);
      totalSupply = tokenCreationCap;
      uint256 etherToRefund = tokensToRefund / tokenExchangeRate;

      require(buy(_beneficiary, tokensToAllocate));
      msg.sender.transfer(etherToRefund);
      ethFundDeposit.transfer(this.balance);
      return;
    }

    totalSupply = checkedSupply;

    require(buy(_beneficiary, tokens)); 
    ethFundDeposit.transfer(this.balance);
  }

  function getExchangeRate(uint256 _checkedSupply) returns(uint) {
    uint256 firstLevel = tokenCreationCap *  25 / 100;
    uint256 secondLevel = tokenCreationCap *  50 / 100;
    uint256 thirdLevel = tokenCreationCap *  75 / 100;

    if (_checkedSupply >= firstLevel && _checkedSupply < secondLevel) {
      return 4000;
    }
    if (_checkedSupply >= secondLevel && _checkedSupply < thirdLevel) {
      return 3000;
    }
    if (_checkedSupply >= thirdLevel) {
      return 2000;
    }
    return 6000;
  }

  /// @dev Ends the funding period and sends the ETH home
  function finalize() external onlyOwner {
    require (!isFinalized);
    // move to operational
    isFinalized = true;
    ethFundDeposit.transfer(this.balance);
  }
}
