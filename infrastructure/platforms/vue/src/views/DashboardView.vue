<template>
  <div class="min-h-screen bg-background">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:w-64 transition-transform duration-300 ease-in-out z-50',
      ]"
      class="border-r"
    >
      <div class="flex items-center h-16 px-6 border-b">
        <div class="flex items-center space-x-2">
          <Bike class="h-6 w-6 text-primary" />
          <span class="font-bold text-foreground">Triumph Fleet</span>
        </div>
      </div>
      <nav class="p-4 space-y-2">
        <router-link
          v-if="checkRoutePermission('dashboard')"
          :to="{ name: 'dashboard' }"
          exact-active-class="bg-primary text-primary-foreground"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LayoutDashboard class="h-5 w-5 mr-2" />
          <span>Tableau de bord</span>
        </router-link>

        <template
          v-if="checkRoutePermission('spare-parts')"
        >
          <router-link
            :to="{ name: 'spare-parts' }"
            active-class="bg-primary text-primary-foreground"
            class="flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <div class="flex items-center">
              <Wrench class="h-5 w-5 mr-2" />
              <span>Pièces détachées</span>
            </div>
          </router-link>
          <div class="pl-6 space-y-1">
            <router-link
              :to="{ name: 'spare-parts' }"
              exact-active-class="bg-primary text-primary-foreground"
              class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span>Inventaire</span>
            </router-link>
            <router-link
              v-if="checkRoutePermission('spare-part-orders')"
              :to="{ name: 'spare-part-orders' }"
              exact-active-class="bg-primary text-primary-foreground"
              class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span>Commandes</span>
            </router-link>
          </div>
        </template>

        <router-link
          v-if="checkRoutePermission('bikes')"
          :to="{ name: 'bikes' }"
          active-class="bg-primary text-primary-foreground"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Bike class="h-5 w-5 mr-2" />
          <span>Gestion du parc moto</span>
        </router-link>

        <router-link
          v-if="checkRoutePermission('maintenance')"
          :to="{ name: 'maintenance' }"
          active-class="bg-primary text-primary-foreground"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Settings2 class="h-5 w-5 mr-2" />
          <span>Gestion des entretiens</span>
        </router-link>

        <router-link
          v-if="checkRoutePermission('due-maintenances')"
          :to="{ name: 'due-maintenances' }"
          active-class="bg-primary text-primary-foreground"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <CalendarClock class="h-5 w-5 mr-2" />
          <span>Entretiens à venir</span>
        </router-link>

        <router-link
          v-if="checkRoutePermission('breakdowns')"
          :to="{ name: 'breakdowns' }"
          active-class="bg-primary text-primary-foreground"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Wrench class="h-5 w-5 mr-2" />
          <span>Pannes & Garanties</span>
        </router-link>

        <template v-if="checkRoutePermission('trial-history')">
          <router-link
            :to="{ name: 'trial-history' }"
            active-class="bg-primary text-primary-foreground"
            class="flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <div class="flex items-center">
              <ClipboardCheck class="h-5 w-5 mr-2" />
              <span>Suivi des essais</span>
            </div>
          </router-link>
          <div class="pl-6 space-y-1">
            <router-link
              :to="{ name: 'trial-history' }"
              exact-active-class="bg-primary text-primary-foreground"
              class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span>Historique des essais</span>
            </router-link>
            <router-link
              v-if="checkRoutePermission('trial-incidents')"
              :to="{ name: 'trial-incidents' }"
              exact-active-class="bg-primary text-primary-foreground"
              class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span>Historique des incidents</span>
            </router-link>
            <router-link
              v-if="checkRoutePermission('drivers')"
              :to="{ name: 'drivers' }"
              exact-active-class="bg-primary text-primary-foreground"
              class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span>Gestion des conducteurs</span>
            </router-link>
          </div>
        </template>

        <router-link
          v-if="checkRoutePermission('notifications')"
          :to="{ name: 'notifications' }"
          active-class="bg-primary text-primary-foreground"
          class="flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <div class="flex items-center">
            <Bell class="h-5 w-5 mr-2" />
            <span>Notifications</span>
          </div>
          <div
            v-if="notificationStore.pendingNotifications.length > 0"
            class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium"
          >
            {{ notificationStore.pendingNotifications.length }}
          </div>
        </router-link>

        <router-link
          v-if="checkRoutePermission('admin-users')"
          :to="{ name: 'admin-users' }"
          active-class="bg-primary text-primary-foreground"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Users class="h-5 w-5 mr-2" />
          <span>Gestion des utilisateurs</span>
        </router-link>
      </nav>
    </aside>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 lg:hidden z-40"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Mobile header -->
    <div
      class="lg:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40"
    >
      <div class="flex items-center justify-between h-full px-4">
        <button
          @click="isSidebarOpen = true"
          class="p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Menu class="h-6 w-6" />
        </button>
        <div class="flex items-center space-x-2">
          <Bike class="h-6 w-6 text-primary" />
          <span class="font-bold text-foreground">Triumph Fleet</span>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div
      :class="['lg:ml-64 transition-all duration-300 ease-in-out', isSidebarOpen ? 'ml-0' : 'ml-0']"
    >
      <!-- Header -->
      <header
        class="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16 lg:mt-0"
      >
        <div class="container flex h-16 items-center justify-between">
          <h1 class="text-2xl font-bold text-foreground">
            {{
              route.name === 'dashboard'
                ? 'Tableau de bord'
                : route.name === 'maintenance'
                  ? 'Historique des entretiens'
                  : route.name === 'spare-parts'
                    ? 'Pièces détachées'
                    : route.name === 'notifications'
                      ? 'Notifications'
                      : route.name === 'profile'
                        ? 'Mon Profil'
                        : route.name === 'bikes'
                          ? 'Gestion du parc moto'
                          : route.name === 'due-maintenances'
                            ? 'Entretiens à venir'
                            : route.name === 'breakdowns'
                              ? 'Pannes & Garanties'
                              : route.name === 'trial-history'
                                ? 'Historique des essais'
                                : route.name === 'trial-incidents'
                                  ? 'Historique des incidents'
                                  : route.name === 'drivers'
                                    ? 'Gestion des conducteurs'
                                    : ''
            }}
          </h1>
          <div class="flex items-center gap-4">
            <div v-if="authStore.user?.role === 'admin'" class="flex items-center px-2 py-0.5 rounded-full bg-amber-100">
              <Shield class="h-3 w-3 text-amber-600" />
              <span class="ml-1 text-xs font-medium text-amber-600">ADMIN</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button class="relative h-8 w-8 text-black rounded-full bg-gray-200 hover:bg-gray-300">
                    <User class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56" align="end">
                <DropdownMenuLabel class="font-normal">
                  <div class="flex flex-col space-y-1">
                    <p class="text-sm font-medium leading-none">{{ authStore.user?.name }}</p>
                    <p class="text-xs leading-none text-muted-foreground">
                      {{ authStore.user?.email }}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <router-link to="/dashboard/profile">
                    <User class="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </router-link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleLogout">
                  <LogOut class="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="container py-8 px-4 sm:px-6 lg:px-8">
        <template v-if="route.name === 'dashboard'">
          <!-- Dashboard default content -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Statistiques -->
            <Card>
              <CardHeader>
                <CardTitle>Entretiens à venir</CardTitle>
                <CardDescription>Nombre total d'entretiens à effectuer</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-bold text-primary">
                  {{ dueMaintenances.length }}
                </div>
              </CardContent>
            </Card>

            <!-- Notifications -->
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Notifications en attente</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-bold text-primary">
                  {{ notificationStore.pendingNotifications.length }}
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Liste des derniers entretiens -->
          <Card class="mt-8">
            <CardHeader>
              <CardTitle>Derniers entretiens planifiés</CardTitle>
              <CardDescription>Les 3 prochains entretiens à effectuer</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="maintenance in dueMaintenances.slice(0, 3)"
                  :key="maintenance.id"
                  class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div>
                    <h4 class="font-medium text-card-foreground">
                      {{ maintenance.bike.name }}
                    </h4>
                    <p class="text-sm text-muted-foreground">
                      Dernier entretien :
                      {{ new Date(maintenance.maintenanceDate).toLocaleDateString() }}
                    </p>
                    <p class="text-sm text-muted-foreground">
                      Kilométrage actuel : {{ maintenance.currentKilometers }} km
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <UpdateKilometersDialog
                      :maintenance="maintenance"
                      @updated="fetchDueMaintenances"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <router-link :to="{ name: 'maintenance' }"> Voir les détails </router-link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Liste des notifications -->
          <Card class="mt-8">
            <CardHeader>
              <CardTitle>Notifications récentes</CardTitle>
              <CardDescription>Les dernières notifications de maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="notification in notificationStore.pendingNotifications.slice(0, 3)"
                  :key="notification.id"
                  class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div class="flex items-start space-x-4">
                    <div class="p-2 rounded-full bg-primary/10">
                      <Bell class="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p class="font-medium text-card-foreground">
                        {{ notification.message }}
                      </p>
                      <p
                        class="text-sm text-muted-foreground"
                        v-if="notification.type === 'MAINTENANCE' && notification.maintenance"
                      >
                        {{
                          new Date(
                            notification.maintenance.maintenanceDate,
                          ).toLocaleDateString()
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <UpdateKilometersDialog
                      v-if="notification.type === 'MAINTENANCE' && notification.maintenance"
                      :maintenance="notification.maintenance"
                      @updated="notificationStore.fetchAllNotifications"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      @click="notificationStore.acknowledgeNotification(notification.id)"
                    >
                      Acquitter
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </template>
        <router-view v-else></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useMaintenanceStore } from '../stores/maintenance'
import { useNotificationStore } from '../stores/notifications'
import { UserRole } from '../types/auth'
import type { Maintenance } from '../services/maintenance.service'
import { hasRoutePermission } from '../config/routePermissions'
import type { RouteNames } from '../config/routePermissions'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import {
  Bike,
  LayoutDashboard,
  Settings2,
  Bell,
  Menu,
  Users,
  CalendarClock,
  Wrench,
  ClipboardCheck,
  User,
  LogOut,
  Shield,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import UpdateKilometersDialog from '../components/maintenance/UpdateKilometersDialog.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const maintenanceStore = useMaintenanceStore()
const notificationStore = useNotificationStore()
const isSidebarOpen = ref(false)
const dueMaintenances = ref<Maintenance[]>([])

const checkRoutePermission = computed(() => {
  return (routeName: string) => {
    const userRole = authStore.user?.role ?? UserRole.DRIVER;
    return hasRoutePermission(routeName as RouteNames, userRole as UserRole);
  }
})

const fetchDueMaintenances = async () => {
  dueMaintenances.value = await maintenanceStore.getDueMaintenances()
}

onMounted(async () => {
  await fetchDueMaintenances()
  await notificationStore.fetchAllNotifications()
  notificationStore.startAutoRefresh()
})

onUnmounted(() => {
  notificationStore.stopAutoRefresh()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
