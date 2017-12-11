'use strict';
const express = require('express'),
  router = express.Router();
const Web3 = require('web3');
const contract = require('truffle-contract');
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

const sidechain = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const mainchain = new Web3(new Web3.providers.HttpProvider("http://localhost:8546"));

RewardEngine.setProvider(sidechain.currentProvider);
TomoCoinSidechain.setProvider(sidechain.currentProvider);
TomoCoinMainchain.setProvider(mainchain.currentProvider);
CashOutSidechain.setProvider(sidechain.currentProvider);
CashOutMainchain.setProvider(mainchain.currentProvider);
CashInSidechain.setProvider(sidechain.currentProvider);
CashInMainchain.setProvider(mainchain.currentProvider);

const rootAddressSidechain = '0xbd9a8e9135d51f9cc2fcf96a42464aeeb3263bef';
const rootAddressMainchain = '0x005d86246b4ade22cdf3334858254cc918803087';

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
