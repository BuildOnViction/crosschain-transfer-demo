require('babel-register')
var HDWalletProvider = require('truffle-hdwallet-provider');
var config = require('config');
const Web3 = require('web3');

module.exports = {
  networks: {
    sidechain: {
      host: config.get('sidechain.host'),
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
        return new HDWalletProvider(config.get('mnemonic'), config.get('ropsten'));
      },
      gas: 2900000,
      network_id: 3
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(config.get('mnemonic'), config.get('rinkeby'));
      },
      gas: 2900000,
      network_id: 4
    }   
  }
}
