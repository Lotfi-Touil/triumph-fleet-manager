<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="p-4 bg-destructive/15 text-destructive rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="pendingNotifications.length === 0" class="text-center text-muted-foreground">
      Aucune notification en attente
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="notification in pendingNotifications"
        :key="notification.id"
        class="p-4 bg-card border rounded-lg shadow-sm"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <h3 class="font-medium text-foreground">{{ notification.maintenance.bike.name }}</h3>
            <p class="text-sm text-muted-foreground">
              Créée le
              {{ new Date(notification.maintenance.lastMaintenanceDate).toLocaleDateString() }}
            </p>
            <p class="text-sm text-foreground">{{ notification.message }}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            @click="handleAcknowledge(notification.id)"
            :disabled="loading"
          >
            Acquitter
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import { Button } from './ui/button'

const notificationStore = useNotificationStore()

const { pendingNotifications, loading, error } = notificationStore

async function handleAcknowledge(id: string) {
  try {
    await notificationStore.acknowledgeNotification(id)
  } catch (error) {
    console.error('Error acknowledging notification:', error)
  }
}

onMounted(() => {
  notificationStore.fetchAllNotifications()
})
</script>
