import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/dashboard',
    component: Layout,
    // redirect: '',
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '综合控制台', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/arkOrianism',
    component: Layout,
    meta: {
      title: '生物模块',
      icon: 'chart'
    },
    children: [
      {
        path: 'newOrianism',
        component: () => import('@/views/arkOrganism/newOrganism'),
        name: 'newOrianism',
        meta: { title: '新建生物', icon: 'bug', affix: true }
      },
      {
        path: 'listOrianism',
        component: () => import ('@/views/arkListOrianism/index'),
        name: 'listOrianism',
        meta: { title: '生物列表', icon: 'bug', affix: true }
      },
      {
        path: 'orianismDetail',
        component: () => import('@/views/arkOrianismDetail/index'),
        name: 'orianismDetail',
        meta: { title: '生物详情', icon: 'bug', affix: true },
        hidden: true
      }
    ]
  },
  {
    path: '/arkVary',
    component: Layout,
    meta: {
      title: '变异模块',
      icon: 'lock'
    },
    children: [
      {
        path: 'newVaryGroup',
        component: () => import('@/views/arkVariation/newVaryGroup'),
        name: 'newVaryGroup',
        meta: { title: '新建变异组', icon: 'example', affix: true }
      },
      {
        path: 'listVaryGroup',
        component: () => import('@/views/arkVariation/listVaryGroup'),
        name: 'newVaryGroup',
        meta: { title: '变异组列表', icon: 'example', affix: true }
      },
      {
        path: 'newVaryEvent',
        component: () => import('@/views/arkVariation/newVaryEvent'),
        name: 'newVaryGroup',
        meta: { title: '新建变异事件', icon: 'example', affix: true }
      },
      {
        path: 'listVary',
        component: () => import('@/views/arkVariation/listVary'),
        name: 'newVaryGroup',
        meta: { title: '变异事件列表', icon: 'example', affix: true }
      }
    ]
  },
  {
    path: '/arkSup',
    component: Layout,
    meta: {
      title: '辅助模块',
      icon: 'lock'
    },
    children: [
      {
        path: 'serverSup',
        component: () => import('@/views/arkSup/supServer'),
        name: 'serverSup',
        meta: { title: '9128服务器直连', icon: 'lock', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
