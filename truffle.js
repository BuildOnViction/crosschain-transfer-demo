require('babel-register')
var HDWalletProvider = require('truffle-hdwallet-provider');
var config = require('config');
const Web3 = require('web3');

module.exports = {
  networks: {
    sidechain: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 4712388
    },
    mainchain: {
      host: 'localhost',
      port: 8546,
      network_id: '*',
      gas: 4712388
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(config.get('ropsten.mnemonic'), config.get('ropsten.url'));
      },
      gas: 2900000,
      network_id: 3
    }   
  }
}
