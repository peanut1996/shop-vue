import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/users/Users.vue'
import Rights from './components/rights/Rights.vue'
import Roles from './components/rights/Roles.vue'
import Categories from './components/products/Categories.vue'
import Goods from './components/products/Goods.vue'

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
        { path: '/rights', component: Rights, name: 'rights' },
        { path: '/roles', component: Roles, name: 'roles' },
        { path: '/categories', component: Categories, name: 'categories' },
        { path: '/goods', component: Goods, name: 'goods' }
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
