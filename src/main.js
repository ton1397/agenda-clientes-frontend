import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";

Vue.config.productionTip = false;
Vue.prototype.$api = "http://localhost:3000";

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
