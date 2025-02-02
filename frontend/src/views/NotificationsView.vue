<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-foreground">Gérez vos notifications d'entretien et de stock</p>
      </div>
      <Button
        variant="outline"
        @click="fetchNotifications"
        :disabled="isLoading"
        class="text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
      >
        <RefreshCw v-if="isLoading" class="mr-2 h-4 w-4 animate-spin text-blue-500" />
        <RefreshCw v-else class="mr-2 h-4 w-4 text-gray-500" />
        Actualiser
      </Button>
    </div>

    <Tabs defaultValue="all" class="w-full">
      <TabsList>
        <TabsTrigger value="all" class="text-foreground">Toutes</TabsTrigger>
        <TabsTrigger value="maintenance" class="text-foreground">Entretiens</TabsTrigger>
        <TabsTrigger value="stock" class="text-foreground">Stock</TabsTrigger>
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
