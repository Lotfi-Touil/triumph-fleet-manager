<template>
  <div class="space-y-4">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
    >
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <Bell
            v-if="notification.type === 'MAINTENANCE'"
            class="h-4 w-4 text-yellow-500"
            color="currentColor"
          />
          <Package v-else class="h-4 w-4 text-yellow-500" color="currentColor" />
          <h4 class="font-medium text-foreground">{{ notification.message }}</h4>
        </div>
        <p class="text-sm text-muted-foreground">
          {{ new Date(notification.createdAt).toLocaleDateString() }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <UpdateKilometersDialog
          v-if="notification.type === 'MAINTENANCE' && notification.maintenance"
          :maintenance="notification.maintenance"
          @updated="$emit('updated')"
        />
        <Button
          variant="secondary"
          size="sm"
          @click="handleAcknowledge(notification)"
          :disabled="isLoading"
          class="bg-gray-500 hover:bg-gray-600 text-white"
        >
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Marquer comme lu
        </Button>
      </div>
    </div>
    <div v-if="notifications.length === 0" class="text-center text-muted-foreground py-8">
      Aucune notification
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Bell, Package, Loader2 } from 'lucide-vue-next'
import type { MaintenanceNotification } from '@/services/maintenance.service'
import { maintenanceService } from '@/services/maintenance.service'
import { useToast } from '@/components/ui/toast/use-toast'
import UpdateKilometersDialog from './UpdateKilometersDialog.vue'

const props = defineProps<{
  notifications: MaintenanceNotification[]
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

const { toast } = useToast()
const isLoading = ref(false)

const handleAcknowledge = async (notification: MaintenanceNotification) => {
  try {
    isLoading.value = true
    await maintenanceService.acknowledgeNotification(notification.id, notification.type)
    toast({
      title: 'Notification marquée comme lue',
      description: 'La notification a été marquée comme lue avec succès.',
    })
    emit('updated')
  } catch (error) {
    toast({
      title: 'Erreur',
      description: 'Une erreur est survenue lors du marquage de la notification.',
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
