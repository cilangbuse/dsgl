import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import TreeTable from 'vue-table-with-tree-grid'
import echarts from 'echarts'

Vue.use(VueAxios, axios)
Vue.use(ElementUI);
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
// 配置请求的根路径
// axios.defaults.baseURL = 'http://192.168.1.30:8888/api/private/v1/'
// Vue.prototype.$http = axios;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  let token = sessionStorage.getItem('token')
  console.log(token)
  if(token){
    config.headers.Authorization = token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
// token过期 会执行的操作，返回到页面的登录页面
if(response.data.status === 400){
  router.replace('/')
}
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
