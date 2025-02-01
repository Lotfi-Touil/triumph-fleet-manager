<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Notifications</h2>
        <p class="text-muted-foreground">Gérez vos notifications d'entretien et de stock</p>
      </div>
      <Button variant="outline" @click="fetchNotifications" :disabled="isLoading">
        <RefreshCw v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        <RefreshCw v-else class="mr-2 h-4 w-4" />
        Actualiser
      </Button>
    </div>

    <Tabs defaultValue="all" class="w-full">
      <TabsList>
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="maintenance">Entretiens</TabsTrigger>
        <TabsTrigger value="stock">Stock</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <NotificationsList :notifications="notifications" @updated="fetchNotifications" />
      </TabsContent>
      <TabsContent value="maintenance">
        <NotificationsList
          :notifications="maintenanceNotifications"
          @updated="fetchNotifications"
        />
      </TabsContent>
      <TabsContent value="stock">
        <NotificationsList :notifications="stockNotifications" @updated="fetchNotifications" />
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { RefreshCw } from 'lucide-vue-next'
import type { MaintenanceNotification } from '@/services/maintenance.service'
import { maintenanceService } from '@/services/maintenance.service'
import NotificationsList from '@/components/maintenance/NotificationsList.vue'

const notifications = ref<MaintenanceNotification[]>([])
const isLoading = ref(false)

const maintenanceNotifications = computed(() =>
  notifications.value.filter((n) => n.type === 'MAINTENANCE'),
)

const stockNotifications = computed(() => notifications.value.filter((n) => n.type === 'LOW_STOCK'))

const fetchNotifications = async () => {
  try {
    isLoading.value = true
    const [maintenanceNotifs, stockNotifs] = await Promise.all([
      maintenanceService.getPendingNotifications(),
      maintenanceService.getLowStockNotifications(),
    ])
    notifications.value = [...maintenanceNotifs, ...stockNotifs]
  } catch (error) {
    console.error('Error fetching notifications:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>
