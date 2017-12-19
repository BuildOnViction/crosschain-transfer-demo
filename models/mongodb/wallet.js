'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

// Define User Schema
var Wallet = new Schema({
  walletAddress: {
    type: String,
    index: true
  },
  tmcSidechain: String,
  tmcMainchain: String,
  logs: [{
    time: Date,
    type: {type: String},
    change: String,
    message: String,
    tmcSidechain: String,
    tmcMainchain: String,
    total: String
  }]
}, {timestamps: true});

Wallet.statics = {
  reward: function({walletAddress, tmcSidechain}) {
    this.findOne({
      walletAddress: walletAddress
    }).then(w =>{
      if (!w) {
        return this.create({
          tmcSidechain: parseFloat(tmcSidechain/10**18),
          walletAddress: walletAddress,
          logs: [{
            type: 'reward',
            change: (parseFloat(tmcSidechain/10**18)),
            message: `Tomo rewarded you ${parseFloat(tmcSidechain/10**18)} TMC`,
            tmcSidechain: parseFloat(tmcSidechain/10**18),
            tmcMainchain: "0",
            time: new Date()
          }]
        }).then(wallet => wallet);
      }
      const preTmcSidechain = parseFloat(w.tmcSidechain);
      const change = (parseFloat(tmcSidechain/10**18) - preTmcSidechain);
      w.logs.unshift({
        type: 'reward',
        change: change,
        message: `Tomo rewarded you ${change} TMC`,
        tmcSidechain: parseFloat(tmcSidechain/10**18),
        tmcMainchain: w.tmcMainchain,
        time: new Date()
      });
      w.tmcSidechain = (String(tmcSidechain/10**18));
      return w.save().then(() => w);
    });
  },
  cashOut: function({walletAddress, tmcSidechain, tmcMainchain}) {
    this.findOne({
      walletAddress: walletAddress
    }).then(w =>{
      if (!w) return false;
      const change = (parseFloat(tmcMainchain/10**18) - parseFloat(w.tmcMainchain));
      w.logs.unshift({
        type: 'cashOut',
        change: change,
        message: `You cashed out ${change} TMC`,
        tmcSidechain: parseFloat(tmcSidechain/10**18),
        tmcMainchain: parseFloat(tmcMainchain/10**18),
        time: new Date()
      });
      w.tmcSidechain = (String(tmcSidechain/10**18));
      w.tmcMainchain = (String(tmcMainchain/10**18));
      return w.save().then(() => w);
    });
  },
  cashIn: function({walletAddress, tmcSidechain, tmcMainchain}) {
    this.findOne({
      walletAddress: walletAddress
    }).then(w =>{
      if (!w) return false;
      const change = (parseFloat(tmcSidechain/10**18) - parseFloat(w.tmcSidechain));
      w.logs.unshift({
        type: 'cashIn',
        change: change,
        message: `You cashed in ${change} TMC`,
        tmcSidechain: parseFloat(tmcSidechain/10**18),
        tmcMainchain: parseFloat(tmcMainchain/10**18),
        time: new Date()
      });
      w.tmcSidechain = (String(tmcSidechain/10**18));
      w.tmcMainchain = (String(tmcMainchain/10**18));
      return w.save().then(() => w);
    });
  }
};

module.exports = mongoose.model('Wallet', Wallet);
