import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import '../assets/fonts/iconfont.css'
import '../assets/css/global.css'
import axios from 'axios'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/users/user.vue'
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
    { path: '/users', component: Users }
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
