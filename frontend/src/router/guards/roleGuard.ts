import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { hasRoutePermission } from '../../config/routePermissions'
import type { UserRole } from '@/types/auth'
import type { RouteNames } from '../../config/routePermissions'

export const roleGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore()

  // Si la route n'a pas de nom, on laisse passer
  if (!to.name) {
    next()
    return
  }

  // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
  if (!authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Vérifie si l'utilisateur a la permission d'accéder à la route
  if (hasRoutePermission(to.name as RouteNames, authStore.user?.role as UserRole)) {
    next()
  } else {
    // Redirige vers le dashboard si l'accès est refusé
    next({ name: 'dashboard' })
  }
}
