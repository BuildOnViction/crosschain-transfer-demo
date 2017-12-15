'use strict';

const Web3 = require('web3');
const contract = require('truffle-contract');
const config = require('config');
const RewardEngineArtifacts = require('../../build/contracts/RewardEngine.json');
const TomoCoinSidechainArtifacts = require('../../build/contracts/TomoCoinSidechain.json');
const TomoCoinMainchainArtifacts = require('../../build/contracts/TomoCoinMainchain.json');
const CashOutSidechainArtifacts = require('../../build/contracts/CashOutSidechain.json');
const CashOutMainchainArtifacts = require('../../build/contracts/CashOutMainchain.json');
const CashInSidechainArtifacts = require('../../build/contracts/CashInSidechain.json');
const CashInMainchainArtifacts = require('../../build/contracts/CashInMainchain.json');
const RewardEngine = contract(RewardEngineArtifacts);
const TomoCoinSidechain = contract(TomoCoinSidechainArtifacts);
const TomoCoinMainchain = contract(TomoCoinMainchainArtifacts);
const CashOutSidechain = contract(CashOutSidechainArtifacts);
const CashOutMainchain = contract(CashOutMainchainArtifacts);
const CashInSidechain = contract(CashInSidechainArtifacts);
const CashInMainchain = contract(CashInMainchainArtifacts);

const sidechain = (new Web3(new Web3.providers.HttpProvider(config.get('urlSidechain')))).currentProvider;
var mainchain = (new Web3(new Web3.providers.HttpProvider(config.get('urlMainchain')))).currentProvider;

if (config.get('mainchainProvider') === 'ropsten'
  || config.get('mainchainProvider') === 'rinkeby') {
  const HDWalletProvider = require('truffle-hdwallet-provider');
  mainchain = new HDWalletProvider(config.get('mnemonic'), config.get(config.get('mainchainProvider')));
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

module.exports = {
  RewardEngine,
  TomoCoinSidechain,
  TomoCoinMainchain,
  CashOutSidechain,
  CashOutMainchain,
  CashInSidechain,
  CashInMainchain,
  rootAddressSidechain,
  rootAddressMainchain
};
