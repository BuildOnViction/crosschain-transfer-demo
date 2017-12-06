'use strict';
const express = require('express'),
  router = express.Router();
const Web3 = require('web3');
const contract = require('truffle-contract');
const RewardEngineArtifacts = require('../build/contracts/RewardEngine.json');
const TomoCoinArtifacts = require('../build/contracts/TomoCoin.json');

// add new user device
router.post('/rewardme', function(req, res, next) {

  const account = req.body.walletAddress;
  var RewardEngine = contract(RewardEngineArtifacts);
  var TomoCoin = contract(TomoCoinArtifacts);
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

  RewardEngine.setProvider(web3.currentProvider);
  TomoCoin.setProvider(web3.currentProvider);

  // Get the initial account balance so it can be displayed.
  RewardEngine.deployed().then((re) => {
    return re.reward(account, {from: '0xbd9a8e9135d51f9cc2fcf96a42464aeeb3263bef'});
  })
    .then(() => {
      return TomoCoin.deployed().then((tc) => {
        return tc.balanceOf.call(account, {from: '0xbd9a8e9135d51f9cc2fcf96a42464aeeb3263bef'});
      })
        .then((value) => {
          return res.json({value});
        });
    }).catch((e) => {
      return res.status(406).json(e);
    });
});

module.exports = router;
