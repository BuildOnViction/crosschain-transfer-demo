<template>
  <div id="app">
    <div class="page-layout">
      <h1>Tomocoin</h1>
      <div class="container">
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
    max-width: 600px;
  }
  .contaner {
    width: 100%;
  }
  .button-container {
    padding-top: 20px;
  }
</style>
