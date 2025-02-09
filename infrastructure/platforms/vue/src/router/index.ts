import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LandingView from '../views/LandingView.vue'
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '../stores/auth'
import { UserRole } from '../types/auth'
import { roleGuard } from './guards/roleGuard'
import IncidentHistoryView from '../views/IncidentHistoryView.vue'

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
      beforeEnter: roleGuard,
      children: [
        {
          path: 'bikes',
          name: 'bikes',
          component: () => import('../views/BikeManagementView.vue'),
          beforeEnter: roleGuard,
        },
        {
          path: 'trials',
          children: [
            {
              path: 'history',
              name: 'trial-history',
              component: () => import('../views/TrialTrackingView.vue'),
              beforeEnter: roleGuard,
            },
            {
              path: 'incidents',
              name: 'trial-incidents',
              component: IncidentHistoryView,
              beforeEnter: roleGuard,
            },
            {
              path: 'drivers',
              name: 'drivers',
              component: () => import('../views/DriverManagementView.vue'),
              beforeEnter: roleGuard,
            },
          ],
        },
        {
          path: 'maintenance',
          name: 'maintenance',
          component: () => import('../views/MaintenanceManagementView.vue'),
          beforeEnter: roleGuard,
        },
        {
          path: 'due-maintenances',
          name: 'due-maintenances',
          component: () => import('../views/DueMaintenancesView.vue'),
          beforeEnter: roleGuard,
        },
        {
          path: 'spare-parts',
          children: [
            {
              path: '',
              name: 'spare-parts',
              component: () => import('../views/spare-parts/SparePartsList.vue'),
              beforeEnter: roleGuard,
            },
            {
              path: 'orders',
              name: 'spare-part-orders',
              component: () => import('../views/spare-parts/SparePartOrders.vue'),
              beforeEnter: roleGuard,
            },
            {
              path: 'new',
              name: 'new-spare-part',
              component: () => import('../views/spare-parts/SparePartForm.vue'),
              beforeEnter: roleGuard,
            },
            {
              path: ':id',
              name: 'edit-spare-part',
              component: () => import('../views/spare-parts/SparePartForm.vue'),
              beforeEnter: roleGuard,
            },
          ],
        },
        {
          path: 'breakdowns',
          name: 'breakdowns',
          component: () => import('../views/BreakdownManagementView.vue'),
          beforeEnter: roleGuard,
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: () => import('../views/NotificationsView.vue'),
          beforeEnter: roleGuard,
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
          beforeEnter: roleGuard,
        },
        {
          path: 'admin/users',
          name: 'admin-users',
          component: () => import('../views/AdminUsersView.vue'),
          beforeEnter: roleGuard,
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

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const authStore = useAuthStore()

  // si on a un token mais que l'utilisateur n'est pas initialisé
  if (token && !authStore.isAuthenticated) {
    try {
      // initialise l'utilisateur à partir du token
      await authStore.initializeFromToken(token)
    } catch (error) {
      // si l'initialisation échoue, on supprime le token et on redirige vers login
      localStorage.removeItem('token')
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
  }

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && authStore.user?.role !== UserRole.ADMIN) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
