<template>
  <div class="space-y-8">
    <!-- En-tête -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-muted-foreground">Gérez vos notifications</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="notificationStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="notificationStore.error"
      class="p-4 rounded-lg bg-destructive/15 text-destructive"
    >
      {{ notificationStore.error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="notificationStore.pendingNotifications.length === 0" class="text-center py-8">
      <Bell class="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <h3 class="mt-4 text-lg font-semibold text-muted-foreground">Aucune notification</h3>
      <p class="text-muted-foreground">
        Vous n'avez aucune notification en attente pour le moment.
      </p>
    </div>

    <!-- Notifications list -->
    <div v-else class="space-y-4">
      <div
        v-for="notification in notificationStore.pendingNotifications"
        :key="notification.id"
        class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
      >
        <div class="flex items-start space-x-4">
          <div class="p-2 rounded-full" :class="notification.type === 'LOW_STOCK' ? 'bg-warning/10' : 'bg-primary/10'">
            <component
              :is="notification.type === 'LOW_STOCK' ? Package : Bell"
              class="h-4 w-4 text-muted-foreground"
              :class="notification.type === 'LOW_STOCK' ? 'text-warning' : 'text-primary'"
            />
          </div>
          <div>
            <p class="font-medium text-card-foreground">
              {{ notification.message }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <p class="text-sm text-muted-foreground">
                {{ formatDate(notification.createdAt) }}
              </p>
              <span class="text-sm text-muted-foreground">•</span>
              <p class="text-sm font-medium text-muted-foreground" :class="notification.type === 'LOW_STOCK' ? 'text-warning' : 'text-primary'">
                {{ notification.type === 'LOW_STOCK' ? notification.sparePart?.name : notification.maintenanceSchedule?.bikeModel.name }}
              </p>
            </div>
          </div>
        </div>
        <Button
          class="text-muted-foreground"
          variant="outline"
          size="sm"
          @click="notificationStore.acknowledgeNotification(notification.id, notification.type)"
          :disabled="notificationStore.loading"
        >
          Acquitter
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import { Button } from '@/components/ui/button'
import { Bell, Package } from 'lucide-vue-next'

const notificationStore = useNotificationStore()

function formatDate(date: Date | string | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString()
}

onMounted(() => {
  notificationStore.fetchAllNotifications()
  notificationStore.startPolling()
})

onUnmounted(() => {
  notificationStore.stopPolling()
})
</script>
