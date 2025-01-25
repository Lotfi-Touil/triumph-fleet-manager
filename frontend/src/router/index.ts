import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LandingView from '../views/LandingView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'maintenance',
          name: 'maintenance',
          component: () => import('../views/MaintenanceView.vue'),
        },
        {
          path: 'spare-parts',
          children: [
            {
              path: '',
              name: 'spare-parts',
              component: () => import('../views/spare-parts/SparePartsList.vue'),
            },
            {
              path: 'orders',
              name: 'spare-part-orders',
              component: () => import('../views/spare-parts/SparePartOrders.vue'),
            },
            {
              path: 'new',
              name: 'new-spare-part',
              component: () => import('../views/spare-parts/SparePartForm.vue'),
            },
            {
              path: ':id',
              name: 'edit-spare-part',
              component: () => import('../views/spare-parts/SparePartForm.vue'),
            },
          ],
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: () => import('../views/NotificationsView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
