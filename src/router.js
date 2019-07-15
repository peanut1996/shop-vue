import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/Users.vue'
import Rights from './components/Rights.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/index' },
    {
      path: '/index',
      component: Index,
      name: 'index',
      children: [
        { path: '/users', component: Users, name: 'users' },
        { path: '/rights', component: Rights, name: 'rights' }
      ]
    },
    { path: '/login', component: Login, name: 'login' }
  ]
})

// 设置导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
