require('babel-register')

module.exports = {
  networks: {
    sidechain: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    mainchain: {
      host: 'localhost',
      port: 8546,
      network_id: '*'
    }
  }
}
