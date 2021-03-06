import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入nprogress
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 这个样式必须引入
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueQuillEditor)

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

Vue.prototype.axios = axios
// 设置axios的全局默认baseUrl
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 配置axios的请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 设置响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 定义一个全局的时间过滤器
Vue.filter('dateFilter', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
