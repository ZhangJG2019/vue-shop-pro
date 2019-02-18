import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
        path: '/users',
        component: User
      },
      {
        path: '/welcome',
        component: Welcome
      }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

// 给路由设置“导航守卫”
// 在守卫中对token进行监听，有token就让执行，否则就跳转到登录页面
router.beforeEach((to, from, next) => {
  // 请求‘/login’
  if (to.path === '/login') {
    return next()
  }
  // 请求“非login”，就判断“token”
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router
