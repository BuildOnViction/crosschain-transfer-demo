<template>
  <div id="app">
    <div v-if="state=='getStart'" class="page-layout getStartScreen">
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
            <md-button class="md-icon-button">
              <md-icon>refresh</md-icon>
            </md-button>

            <md-menu md-direction="bottom-start" md-align-trigger>
              <md-button md-menu-trigger>
                <md-icon>more_vert</md-icon>
              </md-button>

              <md-menu-content>
                <md-menu-item><md-button class="md-primary">Show Your Private Key</md-button></md-menu-item>
                <md-menu-item><md-button class="md-primary">Show Your Backup Key</md-button></md-menu-item>
                <md-menu-item><md-button class="md-accent" @click="deleteWallet">Delete My Wallet</md-button></md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </div>

        <div class="sumaryCoin">
          <h3>You have total:</h3>
          <h1>
            <strong>{{Math.floor((tmcSidechain + tmcMainchain) * 100)/100}}</strong>
            <small>TMC</small>
            <span v-if="expandSumaryCoin">
              = {{Math.floor(tmcSidechain * 100)/100}} <small>TMC in Sidechian</small> + {{Math.floor(tmcSidechain * 100)/100}} <small>TMC in Mainchain</small>
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
        md-description="Hello friends, click MINE TMC to receive your first Tomocoins from Tomo Reward Engine">
        <md-button class="md-raised md-primary" @click="reward()">Mine TMC</md-button>
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
                      {{ Math.floor(tmcSidechain * 100)/100 }}
                      <small>TMC in Sidechain</small>
                    </div>
                  </md-card-header-text>
                </md-card-header>
                <md-card-content>
                  The coins in <strong class="side-chain">sidechain</strong>. You can cashout to <strong class="main-chain">mainchain</strong> and bal bla bal bal bal bla bla bla bla bla bla
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
                      {{ Math.floor(tmcMainchain * 100)/100 }}
                      <small>TMC in Mainchain</small>
                    </div>
                  </md-card-header-text>
                </md-card-header>
                <md-card-content>
                  The coins in <strong class="main-chain">mainchain</strong>. You can cashin to <strong class="side-chain">sidechain</strong> and bal bal bal bal bal bla bla bla bla bla bla bla
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
        <div>
          <p class="md-body-1" v-for="msg in logs" :key="msg">
            {{ msg }}
          </p>
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
      md-title="How many coins to cash in?"
      md-input-placeholder="Amount"
      md-confirm-text="Done"
      @md-confirm="cashIn" />
    <md-dialog-prompt
      :md-active.sync="showPromptCashOut"
      v-model="cashOutValue"
      md-title="How many coins to cash out?"
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
      logs: []
    };
  },
  computed: {
    hasCoin() {
      return Math.floor((this.tmcSidechain + this.tmcMainchain) * 100)/100 > 0
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
      this.cashOutValue = '';
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
      this.cashInValue = '';
    }
  }
};
</script>

<style>
  .getStartScreen {
    padding-top: 100px;
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
    margin-left: 8px
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

  .cash-action {
    text-align: center;
  }

  .cash-action .md-button {
    width: 100%;
  }

  .cash-action:first-child {
    margin-top: 30px;
  }
</style>
