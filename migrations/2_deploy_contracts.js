var TomoCoin = artifacts.require('./TomoCoin');
var CashInSidechain = artifacts.require('./CashInSidechain');
var CashOutSidechain = artifacts.require('./CashOutSidechain');
var CashInMainchain = artifacts.require('./CashInMainchain');
var CashOutMainchain = artifacts.require('./CashOutMainchain');
var Lib = artifacts.require('./Lib');

module.exports = function(deployer) {
  return deployer.deploy(Lib).then(() => {
    deployer.link(Lib, CashInSidechain);
    deployer.link(Lib, CashOutSidechain);
    deployer.link(Lib, CashInMainchain);
    deployer.link(Lib, CashOutMainchain);
    if (deployer.network === 'sidechain') {
      const tomoCommunityDepositSidechain = '0xd083e864af30216500f74dddfb10e3fb5d1e85f3';
      return deployer.deploy(TomoCoin, tomoCommunityDepositSidechain).then(() => {
        return TomoCoin.deployed().then(function(tc) {
          return deployer.deploy(CashInSidechain, tc.address, tomoCommunityDepositSidechain).then(() => {
            return deployer.deploy(CashOutSidechain, tc.address, tomoCommunityDepositSidechain);
          });
        });
      });
    }
    if (deployer.network === 'mainchain') {
      const tomoCommunityDepositSidechain = '0x5c1752f894038df627fbede3ed602f310d764297';
      return deployer.deploy(TomoCoin, tomoCommunityDepositSidechain).then(() => {
        return TomoCoin.deployed().then(function(tc) {
          return deployer.deploy(CashInMainchain, tc.address, tomoCommunityDepositSidechain).then(() => {
            return deployer.deploy(CashOutMainchain, tc.address, tomoCommunityDepositSidechain);
          });
        });
      });
    }
  });
};
