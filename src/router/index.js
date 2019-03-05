import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'
import Rights from '@/components/Rights'
import Roles from '@/components/Roles'
import Cat from '@/components/Cat'
import Param from '@/components/Param'
import Goods from '@/components/Goods'
import Goodsadd from '@/components/Goodsadd'
import Reports from '@/components/Reports'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Welcome,
      redirect: '/welcome'
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: User
        },
        {
          path: '/categories',
          component: Cat
        },
        {
          path: '/params',
          component: Param
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goodsadd',
          component: Goodsadd
        },
        {
          path: '/reports',
          component: Reports
        }
      ]
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
