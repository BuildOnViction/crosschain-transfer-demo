<template>
  <div id="app">
    <div class="page-layout">
      <h1>TomoWallet</h1>
      <div class="container">
        <p>Your address: {{ walletAddress }}</p>
        <p>Your backup key: <code>{{ walletMnemonic }}</code></p>
        <p>Your balance : {{ tmcSidechain + tmcMainchain }} TMC ({{ tmcSidechain }} TMC in Tomochain, {{ tmcMainchain }} TMC in Ethereum Mainchain)</p>
      </div>
      <h2>Reward me</h2>
      <div class="container">
        <div class="button-container">
          <md-button class="md-raised md-primary" @click="rewardMe()">Mine TMC</md-button>
        </div>
      </div>
      <h2>Cash Out</h2>
      <div class="container">
        <div class="button-container">
        <md-input-container>
          <label>Cash Out Value</label>
          <md-input type="text" v-model="cashOutValue" ></md-input>
        </md-input-container>
          <md-button class="md-raised md-primary" @click="cashOut()">Cash Out</md-button>
        </div>
      </div>
      <h2>Cash In</h2>
      <div class="container">
        <div class="button-container">
        <md-input-container>
          <label>Cash In Value</label>
          <md-input type="text" v-model="cashInValue" ></md-input>
        </md-input-container>
          <md-button class="md-raised md-primary" @click="cashIn()">Cash In</md-button>
        </div>
      </div>
    </div>
    <div class="page-layout">
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import axios from 'axios';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import RewardEngineArtifacts from '../build/contracts/RewardEngine.json'

import bip39 from 'bip39'
import hdkey from 'ethereumjs-wallet/hdkey'

const mnemonic = bip39.generateMnemonic()
const key = hdkey.fromMasterSeed(mnemonic)
const wallet = key.getWallet()

Vue.use(VueMaterial)

Vue.material.registerTheme('blue', {
  primary: 'blue',
  accent: 'red',
  warn: 'red'
})

Vue.material.setCurrentTheme('blue')

export default {
  name: 'app',
  data() {
    return {
      walletAddress: '0x' + wallet.getAddress().toString('hex'),
      walletMnemonic: mnemonic,
      tmcSidechain: 0,
      tmcMainchain: 0,
      cashOutValue: 0,
      cashInValue: 0
    };
  },
  watch: {
    '$route'() { }
  },
  created() { },
  mounted() { },
  methods: {
    rewardMe() {
      axios.post('http://localhost:3000' + '/api/wallets/rewardMe', {
        walletAddress: this.walletAddress
      })
        .then(res => {
          this.tmcSidechain = parseFloat(res.data.value/10**18);
        });
    },
    cashOut() {
      axios.post('http://localhost:3000' + '/api/wallets/cashOut', {
        walletAddress: this.walletAddress,
        cashOutValue: this.cashOutValue
      })
        .then(res => {
          this.tmcSidechain = parseFloat(res.data.sidechain/10**18);
          this.tmcMainchain = parseFloat(res.data.mainchain/10**18);
        });
    },
    cashIn() {
      axios.post('http://localhost:3000' + '/api/wallets/cashIn', {
        walletAddress: this.walletAddress,
        cashInValue: this.cashInValue
      })
        .then(res => {
          this.tmcSidechain = parseFloat(res.data.sidechain/10**18);
          this.tmcMainchain = parseFloat(res.data.mainchain/10**18);
        });
    }
  }
};
</script>
<style>
  .page-layout, .footer {
    padding-top: 30px;
    margin: 16px auto;
    display: block;
    max-width: 800px;
  }
  .contaner {
    width: 100%;
  }
  .button-container {
    padding-top: 20px;
  }
</style>
