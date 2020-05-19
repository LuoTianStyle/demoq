import Login from './../pages/login/login'
import Index from './../pages/index/index'
import System from './../pages/system/system'
import Search from './../pages/search/index'
import Download from './../pages/download/index'
const routes = [{
    path: '/login',
    component: Login,
    name: '登录'
  },
  {
    path: '/',
    component: Index,
    name: '首页'
  },
  {
    path: '/system',
    component: System,
    name: '设置'
  },
  {
    path: '/search/:params',
    component: Search,
    name: '搜索'
  },
  {
    path: '/download/:shortId',
    component: Download,
    name: '下载'
  },
]
export default routes