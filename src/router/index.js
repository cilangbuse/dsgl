import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children:[
      { path: '/',redirect: "welcome"},
      { path: 'welcome', component: ()=>import('./../components/welcome.vue')},
      { path: 'users', component: ()=>import('./../components/users/users.vue')},
      { path: 'rights', component: ()=>import('./../components/rights/rights.vue')},
      { path: 'roles', component: ()=>import('./../components/rights/roles.vue')},
      { path: 'reports', component: ()=>import('./../components/reports/reports.vue')},
      { path: 'orders', component: ()=>import('./../components/orders/orders.vue')},
      { path: 'goods', component: ()=>import('./../components/goods/goods.vue')},
      { path: 'categories', component: ()=>import('./../components/goods/categories.vue')},
      { path: 'addsp', component: ()=>import('./../components/goods/addsp.vue')},
      { path: 'params', component: ()=>import('./../components/goods/params.vue')},
    ]
  },
  {
    path: '/',

    component:()=>import('./../views/login.vue')
  },
  {
    path: '/login',

    component:()=>import('./../views/login.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
 if(to.path === '/login') return next();
 // 获取token
 const tokenStr = window.sessionStorage.getItem('token')
 if(!tokenStr) return next('/login');
 next();
  
})

export default router
