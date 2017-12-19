'use strict';
const contracts = require('../models/blockchain');
const cache = require('../models/redis');
const db = require('../models/mongodb');
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

const q = require('../queues');

const sockets = (io) => {
  RewardEngine.deployed().then(function(instance) {
    cache.get('blockNumberRewardEngine', (err, blockNumber) => {
      const allEvents = instance.allEvents({
        fromBlock: parseInt(blockNumber || 0) + 1,
        toBlock: 'latest'
      });
      allEvents.watch((err, res) => {
        const account = res.args['_to'];
        cache.set('blockNumberRewardEngine', res.blockNumber);
        console.info('blockNumberRewardEngine', res.blockNumber);

        TomoCoinSidechain.deployed().then((tc) => {
          return tc.balanceOf.call(account, {from: rootAddressSidechain});
        })
          .then((value) => {
            const rewardValue = value.toNumber();
            db.Wallet.reward({walletAddress: account, tmcSidechain: rewardValue});
            io.to(account).emit('reward', value.toNumber());
          });
      });
    });
  }).catch(e => console.error(e));

  CashOutSidechain.deployed().then(function(instance) {
    cache.get('blockNumberCashOutSidechain', (err, blockNumber) => {
      const allEvents = instance.allEvents({
        fromBlock: parseInt(blockNumber || 0) + 1,
        toBlock: 'latest'
      });
      allEvents.watch((err, res) => {
        cache.set('blockNumberCashOutSidechain', res.blockNumber);
        console.info('blockNumberCashOutSidechain', res.blockNumber)

        const account = res.args['_user'];
        const cashOutValue = res.args['_value'];
        const job = q.create('cashOutMainchain', {
          account, cashOutValue
        }).priority('high').removeOnComplete(true).save();

        job.on('complete', () => {
          return TomoCoinSidechain.deployed().then((tc) => {
            return tc.balanceOf.call(account, {from: rootAddressSidechain});
          })
            .then((valueSidechain) => {
              return TomoCoinMainchain.deployed().then((tc) => {
                return tc.balanceOf.call(account, {from: rootAddressMainchain}).then(v => ({sidechain: valueSidechain.toNumber(), mainchain: v.toNumber()}));
              })
            })
            .then((ret) => {
              db.Wallet.cashOut({
                walletAddress: account,
                tmcSidechain: ret.sidechain,
                tmcMainchain: ret.mainchain
              });
              io.to(account).emit('cashOut', ret);;
            });
        });

      });
    });
  }).catch(e => console.error(e));

  CashInSidechain.deployed().then(function(instance) {
    cache.get('blockNumberCashInSidechain', (err, blockNumber) => {
      const allEvents = instance.allEvents({
        fromBlock: parseInt(blockNumber || 0) + 1,
        toBlock: 'latest'
      });
      allEvents.watch((err, res) => {
        cache.set('blockNumberCashInSidechain', res.blockNumber);
        console.info('blockNumberCashInSidechain', res.blockNumber)

        const account = res.args['_user'];
        const cashInValue = res.args['_value'];

        const job = q.create('cashInMainchain', {
          account, cashInValue
        }).priority('high').removeOnComplete(true).save();

        job.on('complete', () => {
          return TomoCoinSidechain.deployed().then((tc) => {
            return tc.balanceOf.call(account, {from: rootAddressSidechain});
          })
            .then((valueSidechain) => {
              return TomoCoinMainchain.deployed().then((tc) => {
                return tc.balanceOf.call(account, {from: rootAddressMainchain}).then(v => ({sidechain: valueSidechain.toNumber(), mainchain: v.toNumber()}));
              })
            })
            .then((ret) => {
              db.Wallet.cashIn({
                walletAddress: account,
                tmcSidechain: ret.sidechain,
                tmcMainchain: ret.mainchain
              });
              io.to(account).emit('cashIn', ret);;
            });
        });
      });
    });
  }).catch(e => console.error(e));

  io.on('connection', function (socket) {
    socket.on('user', function (data) {
      db.Wallet.findOne({
        walletAddress: data.address
      }).then(w => {
        if (!w) return false;
        socket.emit('user', {
          tmcSidechain: parseFloat(w.tmcSidechain || 0),
          tmcMainchain: parseFloat(w.tmcMainchain || 0),
          logs: w.logs.map(l => {
            return {
              msg: l.message,
              type: l.type,
              change: l.change,
              time: l.time,
              tmcSidechain: parseFloat(l.tmcSidechain),
              tmcMainchain: parseFloat(l.tmcMainchain),
              total: parseFloat(l.tmcSidechain) + parseFloat(l.tmcMainchain)
            } 
          })
        });
      });
      socket.join(data.address);
    });
  });
};

module.exports = sockets;
