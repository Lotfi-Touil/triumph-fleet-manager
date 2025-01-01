<template>
  <div class="min-h-screen bg-background">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="flex items-center h-16 px-6 border-b">
        <div class="flex items-center space-x-2">
          <Bike class="h-6 w-6 text-primary" />
          <span class="font-bold text-foreground">Triumph Fleet</span>
        </div>
      </div>
      <nav class="p-4 space-y-2">
        <router-link
          :to="{ name: 'dashboard' }"
          exact-active-class="bg-primary text-primary-foreground"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LayoutDashboard class="h-5 w-5 mr-2" />
          <span>Tableau de bord</span>
        </router-link>
        <router-link
          :to="{ name: 'maintenance' }"
          active-class="bg-primary text-primary-foreground"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Settings2 class="h-5 w-5 mr-2" />
          <span>Gestion des entretiens</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="ml-64">
      <!-- Header -->
      <header
        class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div class="container flex h-16 items-center justify-between">
          <h1 class="text-2xl font-bold text-foreground">
            {{ route.name === 'dashboard' ? 'Tableau de bord' : 'Gestion des entretiens' }}
          </h1>
          <div class="flex items-center gap-4">
            <span class="text-muted-foreground">{{ authStore.user?.name }}</span>
            <Button variant="destructive" @click="handleLogout"> Déconnexion </Button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="container py-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component">
              <template v-if="route.name === 'dashboard'">
                <!-- Dashboard default content -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Statistiques -->
                  <Card>
                    <CardHeader>
                      <CardTitle>Entretiens à venir</CardTitle>
                      <CardDescription>Nombre total d'entretiens à effectuer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div class="text-3xl font-bold text-primary">
                        {{ maintenanceStore.dueMaintenances.length }}
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
                        v-for="maintenance in maintenanceStore.dueMaintenances.slice(0, 3)"
                        :key="maintenance.id"
                        class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div>
                          <h4 class="font-medium text-card-foreground">
                            {{ maintenance.bikeModel.name }}
                          </h4>
                          <p class="text-sm text-muted-foreground">
                            Dernier entretien :
                            {{ new Date(maintenance.lastMaintenanceDate).toLocaleDateString() }}
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-sm font-medium text-primary">
                            {{ maintenance.currentKilometers }} km
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </template>
            </component>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useMaintenanceStore } from '../stores/maintenance'
import { onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bike, LayoutDashboard, Settings2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const maintenanceStore = useMaintenanceStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  maintenanceStore.fetchDueMaintenances()
})
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
