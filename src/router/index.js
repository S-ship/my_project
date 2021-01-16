import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import '../assets/fonts/iconfont.css'
import '../assets/css/global.css'
import axios from 'axios'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/users/user.vue'
import Rights from '../components/power/right.vue'
import Roles from '../components/power/roles.vue'
import GoodsCate from '../components/goods/good_cate.vue'
import GoodsParams from '../components/goods/params.vue'
import GoodList from '../components/goods/good_list.vue'
import AddGoods from '../components/goods/add.vue'
import Orders from '../components/orders/orders.vue'
import Reports from '../components/reports/reports.vue'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [
    { path: '/welcome', component: Welcome },
    { path: '/users', component: Users },
    { path: '/rights', component: Rights },
    { path: '/roles', component: Roles },
    { path: '/categories', component: GoodsCate },
    { path: '/params', component: GoodsParams },
    { path: '/goods', component: GoodList },
    { path: '/goods/add', component: AddGoods },
    { path: '/orders', component: Orders },
    { path: '/reports', component: Reports }
  ]
},
{
  path: '/welcome',
  component: Welcome
}
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const mytoken = window.sessionStorage.getItem('token')
  if (!mytoken) next('/login')
  next()
})
export default router
