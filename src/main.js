import Vue from 'vue'
import App from './App'
import router from './router'

// 引入global.css全局样式控制文件
import './assets/css/global.css'
// 引入“图标”CSS
import './assets/fonts/iconfont.css'
// 引入element-ui组件模块
// import ElementUI from 'element-ui'
// 引入table-tree
import ZkTable from 'vue-table-with-tree-grid'
// 引入nprogress模块
import NProgress from 'nprogress'
// 引入nprogress css模块
// import 'nprogress/nprogress.css'

// 引入axios并做相关配置
import axios from 'axios'
// 按需引入
// http://element-cn.eleme.io/#/zh-CN/component/quickstart

import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Steps,
  Step,
  Cascader,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message
} from 'element-ui'

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

// axios请求根地址
axios.defaults.baseURL = 'http://127.0.0.1:8765/api/private/v1/'
// 给axios配置给Vue的$http成员
Vue.prototype.$http = axios

// axios的请求拦截器（在其中配置token）
axios.interceptors.request.use(
  function(config) {
    // config:代表axios的子级配置对象
    // 设置加载进度条
    NProgress.start()
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
// axios响应拦截器
axios.interceptors.request.use(function(response) {
  // 设置加载进度条（结束）
  NProgress.done()
  return response
},
function(error) {
  return Promise.reject(error)
})

// 把element-ui注册Vue
// Vue.use  (ElementUI)
// 注册table-tree
Vue.use(ZkTable)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
