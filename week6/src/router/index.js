import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/FrontView.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/HomeView.vue')
      },
      {
        path: 'about',
        component: () => import('../views/AboutView.vue')
      },
      {
        path: 'products',
        component: () => import('../views/ProductsView.vue')
      },
      {
        path: 'product/:id',
        component: () => import('../views/ProductView.vue')
      },
      {
        path: 'cart',
        component: () => import('../views/CartView.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('../views/AdminView.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/AdminDashboardView.vue')
      },
      {
        path: 'products',
        component: () => import('../views/AdminProductsView.vue')
      },
      {
        path: 'orders',
        component: () => import('../views/AdminOrdersView.vue')
      },
      {
        path: 'coupon',
        component: () => import('../views/AdminCouponView.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active',
  scrollBehavior (to, from, savePosition) {
    console.log(to, from, savePosition)
    if (to.fullPath.match('')) {
      return {
        top: 0
      }
    }
    return {}
  }
})

export default router
