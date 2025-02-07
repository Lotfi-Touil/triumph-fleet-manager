import { UserRole } from '../types/auth'

export type RouteNames =
  | 'dashboard'
  | 'bikes'
  | 'maintenance'
  | 'due-maintenances'
  | 'spare-parts'
  | 'spare-part-orders'
  | 'new-spare-part'
  | 'edit-spare-part'
  | 'breakdowns'
  | 'notifications'
  | 'profile'
  | 'admin-users'
  | 'landing'
  | 'home'
  | 'login'
  | 'signup'
  | 'trial-history'
  | 'trial-incidents'
  | 'drivers'
  | 'incidents'

export const routePermissions: Record<RouteNames, UserRole[]> = {
  // Routes publiques
  landing: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],
  home: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],
  login: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],
  signup: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],

  // Dashboard accessible à tous les utilisateurs authentifiés
  dashboard: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],

  // Gestion des motos
  bikes: [UserRole.ADMIN, UserRole.FLEET_MANAGER],

  // Maintenance
  maintenance: [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN],
  'due-maintenances': [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN],

  // Pièces détachées
  'spare-parts': [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN],
  'spare-part-orders': [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN],
  'new-spare-part': [UserRole.ADMIN, UserRole.FLEET_MANAGER],
  'edit-spare-part': [UserRole.ADMIN, UserRole.FLEET_MANAGER],

  // Pannes
  breakdowns: [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN, UserRole.DRIVER],

  // Notifications
  notifications: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],

  // Profil
  profile: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],

  // Administration
  'admin-users': [UserRole.ADMIN],

  // Suivi des essais
  'trial-history': [UserRole.ADMIN, UserRole.FLEET_MANAGER],
  'trial-incidents': [UserRole.ADMIN, UserRole.FLEET_MANAGER],

  // Gestion des conducteurs
  'drivers': [UserRole.ADMIN, UserRole.FLEET_MANAGER],

  // Incidents
  'incidents': [UserRole.ADMIN, UserRole.FLEET_MANAGER],
}

export const hasRoutePermission = (routeName: RouteNames, userRole: UserRole): boolean => {
  const allowedRoles = routePermissions[routeName]
  return userRole === UserRole.ADMIN || (allowedRoles?.includes(userRole) ?? false)
}
