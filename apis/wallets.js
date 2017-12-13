'use strict';
const express = require('express'),
  router = express.Router();
const Web3 = require('web3');
const contract = require('truffle-contract');
const config = require('config');
const RewardEngineArtifacts = require('../build/contracts/RewardEngine.json');
const TomoCoinSidechainArtifacts = require('../build/contracts/TomoCoinSidechain.json');
const TomoCoinMainchainArtifacts = require('../build/contracts/TomoCoinMainchain.json');
const CashOutSidechainArtifacts = require('../build/contracts/CashOutSidechain.json');
const CashOutMainchainArtifacts = require('../build/contracts/CashOutMainchain.json');
const CashInSidechainArtifacts = require('../build/contracts/CashInSidechain.json');
const CashInMainchainArtifacts = require('../build/contracts/CashInMainchain.json');
const RewardEngine = contract(RewardEngineArtifacts);
const TomoCoinSidechain = contract(TomoCoinSidechainArtifacts);
const TomoCoinMainchain = contract(TomoCoinMainchainArtifacts);
const CashOutSidechain = contract(CashOutSidechainArtifacts);
const CashOutMainchain = contract(CashOutMainchainArtifacts);
const CashInSidechain = contract(CashInSidechainArtifacts);
const CashInMainchain = contract(CashInMainchainArtifacts);

const sidechain = (new Web3(new Web3.providers.HttpProvider(config.get('urlSidechain')))).currentProvider;
var mainchain = (new Web3(new Web3.providers.HttpProvider(config.get('urlMainchain')))).currentProvider;
if (config.get('mainchainProvider') === 'ropsten') {
  const HDWalletProvider = require('truffle-hdwallet-provider');
  mainchain = new HDWalletProvider(config.get('ropsten.mnemonic'), config.get('ropsten.url'));
}


RewardEngine.setProvider(sidechain);
TomoCoinSidechain.setProvider(sidechain);
TomoCoinMainchain.setProvider(mainchain);
CashOutSidechain.setProvider(sidechain);
CashOutMainchain.setProvider(mainchain);
CashInSidechain.setProvider(sidechain);
CashInMainchain.setProvider(mainchain);

const rootAddressSidechain = config.get('rootAddressSidechain');
const rootAddressMainchain = config.get('rootAddressMainchain');

// add new user device
router.post('/rewardMe', function(req, res, next) {

  const account = req.body.walletAddress;
  RewardEngine.deployed().then((re) => {
    return re.reward(account, {from: rootAddressSidechain});
  })
    .then((e) => {
      return TomoCoinSidechain.deployed().then((tc) => {
        return tc.balanceOf.call(account, {from: rootAddressSidechain});
      })
        .then((value) => {
          return res.json({value});
        });
    }).catch((e) => {
      return res.status(406).json(e);
    });
});

router.post('/cashOut', function(req, res, next) {

  const account = req.body.walletAddress;
  const cashOutValue = req.body.cashOutValue * 10**18;

  // Get the initial account balance so it can be displayed.
  CashOutSidechain.deployed().then((cos) => {
    return cos.cashOut(account, cashOutValue, {from: rootAddressSidechain});
  })
    .then(() => {
      return CashOutMainchain.deployed().then((com) => {
        return com.cashOut(account, cashOutValue, {from: rootAddressMainchain});
      })
    })
    .then(() => {
      return TomoCoinSidechain.deployed().then((tc) => {
        return tc.balanceOf.call(account, {from: rootAddressSidechain});
      })
        .then((valueSidechain) => {
          return TomoCoinMainchain.deployed().then((tc) => {
            return tc.balanceOf.call(account, {from: rootAddressMainchain}).then(v => ({sidechain: valueSidechain, mainchain: v}));
          })
        })
        .then((ret) => {
          return res.json(ret);
        });
    }).catch((e) => {
      return res.status(406).json(e);
    });
});

router.post('/cashIn', function(req, res, next) {

  const account = req.body.walletAddress;
  const cashInValue = req.body.cashInValue * 10**18;

  // Get the initial account balance so it can be displayed.
  CashInMainchain.deployed().then((cim) => {
    return cim.cashIn(account, cashInValue, {from: rootAddressMainchain});
  })
    .then(() => {
      return CashInSidechain.deployed().then((cis) => {
        return cis.cashIn(account, cashInValue, {from: rootAddressSidechain});
      })
    })
    .then(() => {
      return TomoCoinSidechain.deployed().then((tc) => {
        return tc.balanceOf.call(account, {from: rootAddressSidechain});
      })
        .then((valueSidechain) => {
          return TomoCoinMainchain.deployed().then((tc) => {
            return tc.balanceOf.call(account, {from: rootAddressMainchain}).then(v => ({sidechain: valueSidechain, mainchain: v}));
          })
        })
        .then((ret) => {
          return res.json(ret);
        });
    }).catch((e) => {
      return res.status(406).json(e);
    });
});

module.exports = router;
