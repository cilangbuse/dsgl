import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// 发送
axios.interceptors.request.use((res) => {
  let token = sessionStorage.getItem('token');
  if (token) {
    res.headers['token'] = token;
  }
  return res
}, (err) => {
  return Promise.reject(err)
})

// 响应
axios.interceptors.response.use((response) => {
  if (response.data.status == 200) {
    router.replace('/about')
  }
  return response.data;
}, (err) => {
  return Promise.reject(err)
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')