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
        <div class="md-title">{{ Math.floor((tmcSidechain + tmcMainchain) * 100)/100 }}</div>
        <div class="md-subhead">TMC</div>
        </md-card-header-text>
        </md-card-header>
      </md-card>
      <md-card class="second">
        <md-card-header>
        <md-card-header-text>
        <div class="md-title">{{ Math.floor(tmcSidechain * 100)/100 }}</div>
        <div class="md-subhead">TMC in sidechain</div>
        </md-card-header-text>
        </md-card-header>
      </md-card>
      <md-card class="second">
        <md-card-header>
        <md-card-header-text>
        <div class="md-title">{{ Math.floor(tmcMainchain * 100)/100 }}</div>
        <div class="md-subhead">TMC in mainchain</div>
        </md-card-header-text>
        </md-card-header>
      </md-card>
      <md-card class="steppers">
      <md-steppers md-vertical>
        <md-step id="first" md-label="Reward Engine">
          <div class="button-container">
            <md-button class="md-raised md-primary" @click="reward()">Mine TMC</md-button>
          </div>
        </md-step>

        <md-step id="second" md-label="Cash Out">
          <md-field :class="cashOutValidation">
          <label>Cash Out Value</label>
          <md-input type="text" v-model="cashOutValue" ></md-input>
          <span class="md-error">Cash out value must be less than {{ tmcSidechain }} and greater than zero</span>
          </md-field>
          <md-button class="md-raised md-primary" @click="cashOut()">Cash Out</md-button>
        </md-step>

        <md-step id="third" md-label="Cash In">
          <md-field :class="cashInValidation">
          <label>Cash In Value</label>
          <md-input type="text" v-model="cashInValue" ></md-input>
          <span class="md-error">Cash in value must be less than {{ tmcMainchain }} and greater than zero</span>
          </md-field>
          <md-button class="md-raised md-primary" @click="cashIn()">Cash In</md-button>
        </md-step>
      </md-steppers>
      </md-card>
      <md-card class="steppers">
      <div>
        <md-progress-bar v-if="isProcessing" md-mode="indeterminate"></md-progress-bar>
      </div>
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

import VueSocketio from 'vue-socket.io';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import RewardEngineArtifacts from '../build/contracts/RewardEngine.json'

import bip39 from 'bip39'
import hdkey from 'ethereumjs-wallet/hdkey'

const mnemonic = bip39.generateMnemonic()
const key = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
const wallet = key.derivePath("m/44'/60'/0'/0/0").getWallet()

Vue.use(VueMaterial)
Vue.use(VueSocketio, '/')

export default {
  name: 'app',
  data() {
    return {
      walletAddress: '0x' + wallet.getAddress().toString('hex'),
      walletPrivateKey: wallet.getPrivateKey().toString('hex'),
      walletMnemonic: mnemonic,
      tmcSidechain: 0,
      tmcMainchain: 0,
      cashOutValue: '',
      cashInValue: '',
      isProcessing: false,
      isCashInValidated: false,
      isCashOutValidated: false,
      logs: ['Hello friends, click MINE TMC to receive your first Tomocoins from Tomo Reward Engine']
    };
  },
  computed: {
    cashOutValidation () {
      this.isCashOutValidated = this.cashOutValue && (parseFloat(this.cashOutValue) <= 0 || parseFloat(this.cashOutValue) > parseFloat(this.tmcSidechain))
      return {
        'md-invalid': this.isCashOutValidated
      }
    },
    cashInValidation () {
      this.isCashInValidated = this.cashInValue && (parseFloat(this.cashInValue) <= 0 || parseFloat(this.cashInValue) > parseFloat(this.tmcMainchain))
      return {
        'md-invalid': this.isCashInValidated
      }
    }
  },
  sockets:{
    connect: function(){
      this.$socket.emit('user', {address: this.walletAddress})
    },
    reward: function(val){
      this.logs.unshift('Tomo rewarded you ' + (parseFloat(val/10**18) - this.tmcSidechain) + ' TMC')
      this.isProcessing = false;
      this.tmcSidechain = parseFloat(val/10**18);
    },
    cashOut: function(res){
      this.logs.unshift('You cashed out ' + this.cashOutValue + ' TMC');
      this.isProcessing = false;
      this.tmcSidechain = parseFloat(res.sidechain/10**18);
      this.tmcMainchain = parseFloat(res.mainchain/10**18);
    },
    cashIn: function(res){
      this.logs.unshift('You cashed in ' + this.cashInValue + ' TMC');
      this.isProcessing = false;
      this.tmcSidechain = parseFloat(res.sidechain/10**18);
      this.tmcMainchain = parseFloat(res.mainchain/10**18);
    }
  },
  watch: {
    '$route'() { }
  },
  created() { },
  mounted() { },
  methods: {
    reward() {
      if (this.isProcessing) return;
      this.isProcessing = true;
      axios.post('/api/wallets/reward', {
        walletAddress: this.walletAddress
      });
    },
    cashOut() {
      if (!this.isCashOutValidated || this.isProcessing) return;
      this.isProcessing = true;
      axios.post('/api/wallets/cashOut', {
        walletAddress: this.walletAddress,
        cashOutValue: this.cashOutValue
      });
    },
    cashIn() {
      if (!this.isCashInValidated || this.isProcessing) return;
      this.isProcessing = true;
      axios.post('/api/wallets/cashIn', {
        walletAddress: this.walletAddress,
        cashInValue: this.cashInValue
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
