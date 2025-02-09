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

  dashboard: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],

  bikes: [UserRole.ADMIN, UserRole.FLEET_MANAGER],

  maintenance: [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN],
  'due-maintenances': [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN],

  'spare-parts': [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN],
  'spare-part-orders': [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN],
  'new-spare-part': [UserRole.ADMIN, UserRole.FLEET_MANAGER],
  'edit-spare-part': [UserRole.ADMIN, UserRole.FLEET_MANAGER],

  breakdowns: [UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.TECHNICIAN, UserRole.DRIVER],

  notifications: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],

  profile: [
    UserRole.ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.CLIENT_PARTNER,
    UserRole.TECHNICIAN,
    UserRole.DRIVER,
  ],

  'admin-users': [UserRole.ADMIN],

  'trial-history': [UserRole.ADMIN, UserRole.FLEET_MANAGER],
  'trial-incidents': [UserRole.ADMIN, UserRole.FLEET_MANAGER],

  'drivers': [UserRole.ADMIN, UserRole.FLEET_MANAGER],

  'incidents': [UserRole.ADMIN, UserRole.FLEET_MANAGER],
}

export const hasRoutePermission = (routeName: RouteNames, userRole: UserRole): boolean => {
  const allowedRoles = routePermissions[routeName]
  return userRole === UserRole.ADMIN || (allowedRoles?.includes(userRole) ?? false)
}
