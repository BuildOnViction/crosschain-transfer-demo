<template>
  <div id="app">
    <div class="page-layout">
      <div class="md-display-2">Tomo Wallet</div>
      <div class="container">
        <p>Your address: {{ walletAddress }}</p>
        <p>Your backup key: <code>{{ walletMnemonic }}</code></p>
        <p>Your private key: <code>{{ walletPrivateKey }}</code></p>
      </div>
      <md-card class="main">
        <md-card-header>
        <md-card-header-text>
        <div class="md-title">{{ tmcSidechain + tmcMainchain }}</div>
        <div class="md-subhead">TMC</div>
        </md-card-header-text>
        </md-card-header>
      </md-card>
      <md-card class="second">
        <md-card-header>
        <md-card-header-text>
        <div class="md-title">{{ tmcSidechain }}</div>
        <div class="md-subhead">TMC in sidechain</div>
        </md-card-header-text>
        </md-card-header>
      </md-card>
      <md-card class="second">
        <md-card-header>
        <md-card-header-text>
        <div class="md-title">{{ tmcMainchain }}</div>
        <div class="md-subhead">TMC in mainchain</div>
        </md-card-header-text>
        </md-card-header>
      </md-card>
      <md-card class="steppers">
      <md-steppers md-vertical>
        <md-step id="first" md-label="Reward Engine">
          <div class="button-container">
            <md-button class="md-raised md-primary" @click="rewardMe()">Mine TMC</md-button>
          </div>
        </md-step>

        <md-step id="second" md-label="Cash Out">
          <md-field>
          <label>Cash Out Value</label>
          <md-input type="text" v-model="cashOutValue" ></md-input>
          </md-field>
          <md-button class="md-raised md-primary" @click="cashOut()">Cash Out</md-button>
        </md-step>

        <md-step id="third" md-label="Cash In">
          <md-field>
          <label>Cash In Value</label>
          <md-input type="text" v-model="cashInValue" ></md-input>
          </md-field>
          <md-button class="md-raised md-primary" @click="cashIn()">Cash In</md-button>
        </md-step>
      </md-steppers>
      </md-card>
      <md-card class="steppers">
      <md-card-content>
      <p class="md-body-1" v-for="msg in logs">{{ msg }}</p>
      </md-card-content>
      </md-card>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import axios from 'axios';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import RewardEngineArtifacts from '../build/contracts/RewardEngine.json'

import bip39 from 'bip39'
import hdkey from 'ethereumjs-wallet/hdkey'

const mnemonic = bip39.generateMnemonic()
const key = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
const wallet = key.derivePath("m/44'/60'/0'/0/0").getWallet()

Vue.use(VueMaterial)

export default {
  name: 'app',
  data() {
    return {
      walletAddress: '0x' + wallet.getAddress().toString('hex'),
      walletPrivateKey: wallet.getPrivateKey().toString('hex'),
      walletMnemonic: mnemonic,
      tmcSidechain: 0,
      tmcMainchain: 0,
      cashOutValue: 0,
      cashInValue: 0,
      logs: ['Hello friends, click MINE TMC to receive your first Tomocoins from Tomo Reward Engine']
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
          this.logs.unshift('Tomo rewarded you ' + (parseFloat(res.data.value/10**18) - this.tmcSidechain) + ' TMC');
          this.tmcSidechain = parseFloat(res.data.value/10**18);

        });
    },
    cashOut() {
      axios.post('http://localhost:3000' + '/api/wallets/cashOut', {
        walletAddress: this.walletAddress,
        cashOutValue: this.cashOutValue
      })
        .then(res => {
          this.logs.unshift('You cashed out ' + this.cashOutValue + ' TMC');
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
          this.logs.unshift('You cashed in ' + s.cashInValue + ' TMC');
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
    max-width: 1000px;
  }
  .contaner {
    width: 100%;
  }
  .button-container {
    padding-top: 20px;
  }
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
  .md-card.steppers {
    max-width: 100%;
    width: 983px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>
