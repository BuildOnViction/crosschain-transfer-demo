var TomoCoin = artifacts.require('./TomoCoin');
var CashInSidechain = artifacts.require('./CashInSidechain');
var CashOutSidechain = artifacts.require('./CashOutSidechain');
var CashInMainchain = artifacts.require('./CashInMainchain');
var CashOutMainchain = artifacts.require('./CashOutMainchain');
var TokenAdmin = artifacts.require('./TokenAdmin');
var RewardEngine = artifacts.require('./RewardEngine');
var Lib = artifacts.require('./Lib');

module.exports = function(deployer) {
  return deployer.deploy(Lib).then(() => {
    deployer.link(Lib, CashInSidechain);
    deployer.link(Lib, CashOutSidechain);
    deployer.link(Lib, CashInMainchain);
    deployer.link(Lib, CashOutMainchain);
    if (deployer.network === 'sidechain') {
      const tomoCommunityDepositSidechain = '0xbd9a8e9135d51f9cc2fcf96a42464aeeb3263bef';
      return deployer.deploy(TomoCoin, tomoCommunityDepositSidechain).then(() => {
        return TomoCoin.deployed().then(function(tc) {
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
      return deployer.deploy(TomoCoin, tomoCommunityDepositMainchain).then(() => {
        return TomoCoin.deployed().then(function(tc) {
          return deployer.deploy(CashInMainchain, tc.address, tomoCommunityDepositMainchain).then(() => {
            return deployer.deploy(CashOutMainchain, tc.address, tomoCommunityDepositMainchain);
          });
        });
      });
    }
  });
};
