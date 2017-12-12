var TomoCoinSidechain = artifacts.require('./TomoCoinSidechain');
var TomoCoinMainchain = artifacts.require('./TomoCoinMainchain');
var CashInSidechain = artifacts.require('./CashInSidechain');
var CashOutSidechain = artifacts.require('./CashOutSidechain');
var CashInMainchain = artifacts.require('./CashInMainchain');
var CashOutMainchain = artifacts.require('./CashOutMainchain');
var TokenAdmin = artifacts.require('./TokenAdmin');
var RewardEngine = artifacts.require('./RewardEngine');

module.exports = function(deployer) {
  if (deployer.network === 'sidechain') {
    const tomoCommunityDepositSidechain = '0xbd9a8e9135d51f9cc2fcf96a42464aeeb3263bef';
    return deployer.deploy(TomoCoinSidechain, tomoCommunityDepositSidechain).then(() => {
      return TomoCoinSidechain.deployed().then(function(tc) {
        return deployer.deploy(CashInSidechain, tc.address, tomoCommunityDepositSidechain).then(() => {
          return CashInSidechain.deployed().then(cis => {
            return tc.approve(cis.address, '40000000000000000000000000');
          });
        })
          .then(() => {
            return deployer.deploy(CashOutSidechain, tc.address, tomoCommunityDepositSidechain);
          })
          .then(()  => {
            return CashOutSidechain.deployed().then(cos => {
              return tc.approve(cos.address, '40000000000000000000000000').then(() => {
                return tc.add(cos.address);
              });
            });
          })
          .then(()  => {
            return deployer.deploy(RewardEngine, tc.address, tomoCommunityDepositSidechain);
          })
          .then(()  => {
            return RewardEngine.deployed().then(re => {
              return tc.approve(re.address, '40000000000000000000000000');
            });
          });
      });
    });
  }
  if (deployer.network === 'mainchain') {
    const tomoCommunityDepositMainchain = '0x005d86246b4ade22cdf3334858254cc918803087';
    return deployer.deploy(TomoCoinMainchain, tomoCommunityDepositMainchain).then(() => {
      return TomoCoinMainchain.deployed().then(function(tc) {
        return deployer.deploy(CashInMainchain, tc.address, tomoCommunityDepositMainchain).then(() => {
          return CashInMainchain.deployed().then(cim => {
            return tc.approve(cim.address, '40000000000000000000000000').then(() => {
              return tc.add(cim.address);
            });
          });
        })
          .then(() => {
            return deployer.deploy(CashOutMainchain, tc.address, tomoCommunityDepositMainchain);
          })
          .then(() => {
            return CashOutMainchain.deployed().then(com => {
              return tc.approve(com.address, '40000000000000000000000000');
            });
          });
      });
    });
  }
};
