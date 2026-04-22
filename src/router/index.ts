import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/home/product',
        name: 'Product',
        component: () => import('../views/Product.vue')
      },
      {
        path: '/home/bill',
        name: 'Bill',
        component: () => import('../views/Bill.vue')
      },
      {
        path: '/home/supplier',
        name: 'Supplier',
        component: () => import('../views/Supplier.vue')
      },
      {
        path: '/home/user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: '/home/user/add',
        name: 'AddUser',
        component: () => import('../views/AddUser.vue')
      },
      {
        path: '/home/user/detail',
        name: 'UserDetail',
        component: () => import('../views/UserDetail.vue')
      },
      {
        path: '/home/user/edit',
        name: 'UserEdit',
        component: () => import('../views/UserEdit.vue')
      },
      {
        path: '/home/password',
        name: 'Password',
        component: () => import('../views/Password.vue')
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router