<template>
  <div id="app">
    <div v-if="state=='getStart'" class="page-layout getStartScreen">
      <video src="http://static-p.iuqo.com/media/home/home/video/cloud2.mp4" autoplay="" loop="" muted=""></video>
      <div class="logo">
        <img src="https://tomocoin-ico.herokuapp.com/img/logo.svg">
      </div>
      <md-card class="md-primary" md-with-hover>
        <md-ripple>
          <md-card-header>
            <div class="md-title">Welcome to TomoWallet</div>
            <div class="md-subhead">Testnet mode</div>
          </md-card-header>

          <md-card-content>
            The Tomowallet on a new blockchain with <b>Zero fee</b> and <b>Instant confirmation</b>.
            <br/>
            Create a new wallet and let's experience!
          </md-card-content>

          <md-card-actions>
            <md-button class="md-raised" :md-ripple="true" @click="createWallet">
              <md-icon>add</md-icon> Create New Wallet
            </md-button>
          </md-card-actions>
        </md-ripple>
      </md-card>
    </div>
    <div v-if="state == 'mainScreen'" class="page-layout mainScreen">
      <md-toolbar class="md-large md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <h3 class="md-title" style="flex: 1">Your TomoWallet</h3>
          </div>

          <div class="md-toolbar-section-end">
            <md-button v-if="hasCoin" class="md-raised" @click="reward()">Mine more TomoCoins</md-button>

            <md-menu md-direction="bottom-start" md-align-trigger>
              <md-button md-menu-trigger>
                <md-icon>more_vert</md-icon>
              </md-button>

              <md-menu-content>
                <md-menu-item><md-button class="md-primary" @click="showPrivateKey = true">Show Your Private Key</md-button></md-menu-item>
                <md-menu-item><md-button class="md-primary" @click="showBackupKey = true">Show Your Backup Key</md-button></md-menu-item>
                <md-menu-item><md-button class="md-accent" @click="deleteWallet">Delete My Wallet</md-button></md-menu-item>
              </md-menu-content>
            </md-menu>
            <md-dialog-alert
              :md-active.sync="showPrivateKey"
              md-title="Your private key"
              :md-content="`Make it safe: <br/><strong>${walletPrivateKey}</strong>`" />
            <md-dialog-alert
              :md-active.sync="showBackupKey"
              md-title="Your backup key"
              :md-content="`Make it safe: <br/><strong>${walletMnemonic}</strong>`" />
          </div>
        </div>

        <div class="sumaryCoin">
          <h3>You have total:</h3>
          <h1>
            <strong>{{(tmcSidechain + tmcMainchain).toFixed(2)}}</strong>
            <small>TMC</small>
            <span v-if="expandSumaryCoin">
              = {{tmcSidechain.toFixed(2)}} <small>TMC in Tomochain</small> + {{tmcMainchain.toFixed(2)}} <small>TMC in Ethereum</small>
            </span>
            <md-button class="md-icon-button" @click="toggleExpandSumaryCoin">
              <md-icon v-if="expandSumaryCoin">keyboard_arrow_left</md-icon>
              <md-icon v-else>info_outline</md-icon>
            </md-button>
          </h1>
          <h4>{{walletAddress}}</h4>
        </div>
      </md-toolbar>


      <md-empty-state v-if="!hasCoin"
        md-icon="devices_other"
        md-label="Get your first Tomocoins"
        md-description="Hello friends, click MINE TomoCoin to receive your first Tomocoins from Tomo Reward Engine">
        <md-button class="md-raised md-primary" @click="reward()">Mine TomoCoin</md-button>
      </md-empty-state>
      <div v-else>
        <div class="cash-in-out">
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-10">
            </div>
            <div class="md-layout-item md-size-33">
              <md-card class="second">
                <md-card-header>
                  <md-card-header-text>
                    <div class="md-title side-chain">
                      {{ tmcSidechain.toFixed(2) }}
                    </div>
                    <div class="md-subhead color-side-chain">TMC in <a href="https://stats.tomocoin.io" target="blank">Tomochain</a></div>
                  </md-card-header-text>
                </md-card-header>
                <md-card-content>
                The coins you have in <strong class="side-chain">tomochain</strong>. You can transfer the coins to <strong class="main-chain">ethereum</strong> by clicking <strong>cash out</strong> button.
                </md-card-content>
              </md-card>
            </div>
            <div class="md-layout-item md-size-15">
              <div class="cash-action">
                <md-button class="md-primary md-raised" @click="showCashOut">
                  Cash Out
                  <md-icon>arrow_forward</md-icon>
                </md-button>
              </div>
              <div class="cash-action">
                <md-button class="md-accent md-raised" @click="showCashIn">
                  <md-icon>arrow_back</md-icon>
                  Cash In
                </md-button>
              </div>
            </div>
            <div class="md-layout-item md-size-33">
              <md-card class="second">
                <md-card-header>
                  <md-card-header-text>
                    <div class="md-title main-chain">
                      {{ tmcMainchain.toFixed(2) }}
                    </div>
                    <div class="md-subhead color-main-chain">TMC in Ethereum</div>
                  </md-card-header-text>
                </md-card-header>
                <md-card-content>
                The coins you have in <strong class="main-chain">ethereum</strong>. You can transfer the coins to <strong class="side-chain">tomochain</strong> by clicking <strong>cash in</strong> button.
                </md-card-content>
              </md-card>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <md-progress-bar v-if="isProcessing" md-mode="indeterminate"></md-progress-bar>
        </div>
        <div class="log-table">
          <md-table md-card>
            <md-table-row>
              <md-table-head style="width: 230px">Time</md-table-head>
              <md-table-head style="width: 160px">Type</md-table-head>
              <md-table-head>Detail</md-table-head>
              <md-table-head md-numeric>TMC in Tomochain</md-table-head>
              <md-table-head md-numeric>TMC in Ethereum</md-table-head>
              <md-table-head md-numeric>Total TMC</md-table-head>
            </md-table-row>

            <md-table-row v-for="(e, i) in logs" :key="i">
              <md-table-cell>{{new Date(e.time).toLocaleString()}}</md-table-cell>
              <md-table-cell>
                <span class="type" :class="`type-${e.type}`">
                  {{e.type}}
                  <md-icon v-if="e.type == 'message'">chat_bubble_outline</md-icon>
                  <md-icon v-if="e.type == 'reward'">attach_money</md-icon>
                  <md-icon v-if="e.type == 'cashOut'">arrow_forward</md-icon>
                  <md-icon v-if="e.type == 'cashIn'">arrow_back</md-icon>
                </span>
              </md-table-cell>
              <md-table-cell>{{e.msg}}</md-table-cell>
              <md-table-cell md-numeric>
                <span class="color-side-chain">
                  {{(e.tmcSidechain || tmcSidechain) .toFixed(2)}}
                </span>
              </md-table-cell>
              <md-table-cell md-numeric>
                <span class="color-main-chain">
                  {{(e.tmcMainchain || tmcMainchain).toFixed(2)}}
                </span>
              </md-table-cell>
              <md-table-cell md-numeric>{{(e.total || (tmcSidechain + tmcMainchain)).toFixed(2)}}</md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </div>
    </div>
    <md-dialog-confirm
      :md-active.sync="showDialogConfirmDeleteWallet"
      md-title="Do you want delete this wallet?"
      md-content="When wallet was deleted, you cannot recover your wallet. But don't worry, this is testnet only :)"
      md-confirm-text="Delete"
      md-cancel-text="Cancel"
      @md-confirm="onConfirm" />
    <md-dialog-prompt
      :md-active.sync="showPromptCashIn"
      v-model="cashInValue"
      md-title="How many coins do you want to transfer (cash in)?"
      md-input-placeholder="Amount"
      md-confirm-text="Done"
      @md-confirm="cashIn" />
    <md-dialog-prompt
      :md-active.sync="showPromptCashOut"
      v-model="cashOutValue"
      md-title="How many coins do you want to transfer (cash out)?"
      md-input-placeholder="Amount"
      md-confirm-text="Done"
      @md-confirm="cashOut" />

    <md-snackbar md-position="left"
      :md-duration="4000"
      :md-active.sync="showAlert" md-persistent>
      <span>{{msgAlert}}</span>
      <md-button class="md-primary" @click="showAlert = false">Got it!</md-button>
    </md-snackbar>
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
    var walletAddress = '0x' + wallet.getAddress().toString('hex');
    var walletPrivateKey = wallet.getPrivateKey().toString('hex');
    var walletMnemonic = mnemonic;
    if (localStorage.wallet) {
      var localWallet = JSON.parse(localStorage.wallet);
      walletAddress = localWallet.walletAddress
      walletPrivateKey = localWallet.walletPrivateKey;
      walletMnemonic = localWallet.walletMnemonic;
    }
    return {
      showDialogConfirmDeleteWallet: false,
      showPromptCashOut: false,
      showPromptCashIn: false,
      showAlert: false,
      showPrivateKey: false,
      showBackupKey: false,
      msgAlert: '',
      expandSumaryCoin: false,
      state: localStorage.wallet ? 'mainScreen' : 'getStart',
      walletAddress: walletAddress,
      walletPrivateKey: walletPrivateKey,
      walletMnemonic: walletMnemonic,
      tmcSidechain: 0,
      tmcMainchain: 0,
      cashOutValue: '',
      cashInValue: '',
      isProcessing: false,
      logs: [{
        time: new Date(),
        msg: 'Your TomoWallet created',
        tmcMainchain: 0,
        tmcSidechain: 0,
        total: 0,
        type: 'message'
      }]
    };
  },
  computed: {
    hasCoin() {
      return this.tmcSidechain + this.tmcMainchain > 0
    },
    cashOutValidation () {
      var isCashOutValidated = isNaN(parseFloat(this.cashOutValue)) ||
        parseFloat(this.cashOutValue) <= 0 ||
        parseFloat(this.cashOutValue) > parseFloat(this.tmcSidechain)
      return isCashOutValidated ? `Cash out value must be less than ${this.tmcSidechain} and greater than zero` : ''
    },
    cashInValidation () {
      var isCashInValidated = isNaN(parseFloat(this.cashInValue)) ||
        parseFloat(this.cashInValue) <= 0 ||
        parseFloat(this.cashInValue) > parseFloat(this.tmcMainchain)
      return isCashInValidated ? `Cash in value must be less than ${this.tmcMainchain} and greater than zero` : ''
    }
  },
  sockets:{
    connect: function(){
      this.$socket.emit('user', {address: this.walletAddress})
    },
    user: function(user){
      this.logs = user.logs;
      this.tmcSidechain = parseFloat(user.tmcSidechain);
      this.tmcMainchain = parseFloat(user.tmcMainchain);
      localStorage.logs = JSON.stringify(this.logs);
    },
    reward: function(val){
      this.logs.unshift({
        time: new Date(),
        msg: 'Tomo rewarded you ' + (parseFloat(val/10**18) - this.tmcSidechain) + ' TMC',
        tmcSidechain: (parseFloat(val/10**18) - this.tmcSidechain),
        tmcMainchain: this.tmcMainchain,
        total: parseFloat(val/10**18),
        type: 'reward'
      });
      localStorage.logs = JSON.stringify(this.logs);
      this.isProcessing = false;
      this.tmcSidechain = parseFloat(val/10**18);
    },
    cashOut: function(res){
      this.isProcessing = false;
      this.tmcSidechain = parseFloat(res.sidechain/10**18);
      this.tmcMainchain = parseFloat(res.mainchain/10**18);

      this.logs.unshift({
        time: new Date(),
        msg: 'You cashed out ' + this.cashOutValue + ' TMC',
        tmcSidechain: this.tmcSidechain,
        tmcMainchain: this.tmcMainchain,
        total: this.tmcSidechain + this.tmcMainchain,
        type: 'cashOut'
      });
      localStorage.logs = JSON.stringify(this.logs);
      this.cashOutValue = '';
    },
    cashIn: function(res){
      this.isProcessing = false;
      this.tmcSidechain = parseFloat(res.sidechain/10**18);
      this.tmcMainchain = parseFloat(res.mainchain/10**18);

      this.logs.unshift({
        time: new Date(),
        msg: 'You cashed in ' + this.cashInValue + ' TMC',
        tmcSidechain: this.tmcSidechain,
        tmcMainchain: this.tmcMainchain,
        total: this.tmcSidechain + this.tmcMainchain,
        type: 'cashIn'
      });
      localStorage.logs = JSON.stringify(this.logs);
      this.cashInValue = '';
    }
  },
  watch: {
    '$route'() { }
  },
  created() { },
  mounted() { },
  methods: {
    createWallet() {
      localStorage.wallet = JSON.stringify({
        walletAddress: this.walletAddress,
        walletPrivateKey: this.walletPrivateKey,
        walletMnemonic: this.walletMnemonic
      });

      this.state = 'mainScreen';
    },
    deleteWallet() {
      this.showDialogConfirmDeleteWallet = true;
    },
    onConfirm() {
      delete localStorage.wallet;
      delete localStorage.logs;
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    toggleExpandSumaryCoin() {
      this.expandSumaryCoin = !this.expandSumaryCoin;
    },
    showCashOut() {
      this.showPromptCashOut = true;
    },
    showCashIn() {
      this.showPromptCashIn = true;
    },
    reward() {
      if (this.isProcessing) return;
      this.isProcessing = true;
      axios.post('/api/wallets/reward', {
        walletAddress: this.walletAddress
      });
    },
    cashOut() {
      if (this.cashOutValidation) {
        this.msgAlert = this.cashOutValidation;
        this.showAlert = true;
        return;
      }
      if (this.isProcessing) return;
      this.isProcessing = true;
      axios.post('/api/wallets/cashOut', {
        walletAddress: this.walletAddress,
        cashOutValue: this.cashOutValue
      });
    },
    cashIn() {
      if (this.cashInValidation) {
        this.msgAlert = this.cashInValidation;
        this.showAlert = true;
        return;
      }
      if (this.isProcessing) return;
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

  .color-side-chain {
    color: #448aff;
  }

  .color-main-chain {
    color: #ff5252;
  }

  .getStartScreen {
    padding-top: 100px;
    width: 100vw;
    height: 100vh;
    position: relative;
  }

  .getStartScreen .logo {
    text-align: center;
    position: relative;
    margin-bottom: 20px;
  }

  .getStartScreen .logo image {
    width: 60px;
  }

  .getStartScreen video {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
  }
  .getStartScreen .md-primary {
    width: 400px;
    max-width: 90%;
    margin: auto;
  }

  .getStartScreen .md-primary .md-ripple .md-button-content {
    color: #333333;
  }

  .mainScreen .md-toolbar .md-button.md-accent {
    color: #333333 !important;
  }

  .sumaryCoin {
    padding: 0 8px;
    width: 100%;
  }

  .sumaryCoin h3 {
    margin-bottom: 40px;
  }
  .sumaryCoin h1 {
    font-size: 40px;
    line-height: 0px;
  }

  .sumaryCoin h1 strong {
    font-size: 70px;
  }

  .sumaryCoin h1 small {
    font-size: 16px;
    font-weight: 400;
    opacity: 0.8;
  }

  .sumaryCoin h1 .md-icon-button {
    height: 35px;
    min-width: 35px;
    width: 35px;
    opacity: 0.8;
  }
  .sumaryCoin h1 .md-icon-button .md-icon {
    font-size: 18px !important;
  }

  .sumaryCoin h4 {
    line-height: 0px;
  }

  .cash-in-out {
    margin: 20px;
  }

  .cash-in-out .md-title {
    font-size: 70px;
    line-height: 90px;
    color: #448aff;
  }

  .cash-in-out .md-card .side-chain {
    color: #448aff;
  }

  .cash-in-out .md-card .main-chain {
    color: #ff5252;
  }

  .cash-in-out .md-title small{
    font-size: 20px;
    opacity: 0.8;
  }

  .cash-in-out .md-subhead {
    font-size: 18px;
    opacity: 0.8;
  }

  .cash-action {
    text-align: center;
  }

  .cash-action .md-button {
    width: 100%;
  }

  .cash-action:first-child {
    margin-top: 30px;
  }

  .log-table {
    padding: 20px;
  }

  .log-table .type {
    padding: 2px 3px 0 10px;
    display: inline-block;
    color: #ffffff;
    border-radius: 100px;
    font-weight: bold;
  }

  .log-table .type-message {
    background: gray;
  }

  .log-table .type-reward {
    background: #009688;
  }

  .log-table .type-cashOut {
    background: #448aff;
  }

  .log-table .type-cashIn {
    background: #ff5252;
  }

  .log-table .type .md-icon {
    font-size: 15px !important;
    color: inherit;
  }
</style>
