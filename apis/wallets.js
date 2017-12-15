'use strict';
const express = require('express'),
  router = express.Router();
const Web3 = require('web3');

const {RewardEngine,
  rootAddressSidechain,
  rootAddressMainchain,
  CashOutSidechain,
  CashOutMainchain,
  CashInSidechain,
  CashInMainchain,
  TomoCoinSidechain,
  TomoCoinMainchain
} = require('../models/blockchain');

// add new user device
router.post('/reward', function(req, res, next) {

  const account = req.body.walletAddress;
  RewardEngine.deployed().then((re) => {
    re.reward(account, {from: rootAddressSidechain});
    return res.json({});
  }).catch((e) => {
    return next(e);
  });
});

router.post('/cashOut', function(req, res, next) {

  const account = req.body.walletAddress;
  const cashOutValue = req.body.cashOutValue * 10**18;

  CashOutSidechain.deployed().then((cos) => {
    cos.cashOut(account, cashOutValue, {from: rootAddressSidechain});
    return res.json({});
  })
    .catch((e) => {
      return next(e);
    });
});

router.post('/cashIn', function(req, res, next) {

  const account = req.body.walletAddress;
  const cashInValue = req.body.cashInValue * 10**18;

  CashInSidechain.deployed().then((cim) => {
    cim.cashIn(account, cashInValue, {from: rootAddressSidechain});
    return res.json({});
  }).catch((e) => {
    return next(e);
  });
});

module.exports = router;
