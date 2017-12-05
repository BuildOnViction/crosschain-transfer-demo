<template>
  <div id="app">
    <div class="page-layout">
      <h1>Tomocoin</h1>
      <div class="container">
        <p>Your address: {{ walletAddress }}</p>
        <p>Your backup key: <code>{{ walletMnemonic }}</code></p>
        <p>You have: 10 TMC</p>
      </div>
      <h2>Reward me</h2>
      <div class="container">
        <div class="button-container">
          <md-button class="md-raised md-primary">Mine TMC</md-button>
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
      walletMnemonic: mnemonic
    };
  },
  watch: {
    '$route'() {
      this.$nextTick(() => {
      });
    }
  },
  created() { },
  mounted() { },
  methods: { }
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
