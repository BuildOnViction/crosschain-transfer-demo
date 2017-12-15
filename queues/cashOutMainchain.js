'use strict';
const consumer = {};
const {RewardEngine,
  rootAddressMainchain,
  CashOutMainchain
} = require('../models/blockchain');

consumer.name = 'cashOutMainchain';

consumer.task = function(job, done) {
  const {account, cashOutValue} = job.data;
  console.info('cashOutMainchain', account, cashOutValue);
  CashOutMainchain.deployed().then((com) => {
    return com.cashOut(account, cashOutValue, {from: rootAddressMainchain});
  }).then(() => {
    return done();
  }).catch(e => done(e));
};

module.exports = consumer;
