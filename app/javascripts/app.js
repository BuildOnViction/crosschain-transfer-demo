// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import rewardengine_artifacts from '../../build/contracts/RewardEngine.json';
import tomocoin_artifacts from '../../build/contracts/TomoCoin.json';

var RewardEngine = contract(rewardengine_artifacts);
var Tomocoin = contract(tomocoin_artifacts);

var accounts;
var account;
var decimals = 18;

window.App = {
  start: function() {
    var self = this;

    RewardEngine.setProvider(web3.currentProvider);
    Tomocoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var coin;
    Tomocoin.deployed().then(function(instance) {
      coin = instance;
      return coin.balanceOf.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf()/(10**decimals);
    }).catch(function(e) {
      self.setStatus("Error getting balance; see log.");
    });
  },

  rewardMe: function() {
    var self = this;
    RewardEngine.deployed().then(function(re) {
      re.reward(account, {from: account}).then(e => {
        self.refreshBalance();
      });

    });
  },
  cashOut: function() {
    var self = this;
    CashOutSidechain.deployed().then(function(re) {
      re.reward(account, {from: account}).then(e => {
        self.refreshBalance();
      });

    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
