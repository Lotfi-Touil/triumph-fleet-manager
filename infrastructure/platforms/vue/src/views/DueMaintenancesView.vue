<template>
  <div class="container mx-auto py-8">
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-foreground">Entretiens à effectuer</h1>
    </div>

    <!-- Loading state -->
    <div v-if="maintenanceStore.loading" class="flex justify-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"
      ></div>
      <p class="mt-2 text-muted-foreground">Chargement...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="maintenanceStore.error"
      class="p-4 rounded-lg bg-destructive/10 text-destructive"
    >
      {{ maintenanceStore.error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="dueMaintenances.length === 0" class="text-center py-8 text-muted-foreground">
      Aucun entretien à effectuer pour le moment.
    </div>

    <!-- Table -->
    <div v-else class="bg-card rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead class="bg-muted">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Moto
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Dernier entretien
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Prochain entretien
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-card divide-y divide-border">
            <tr
              v-for="maintenance in dueMaintenances"
              :key="maintenance.id"
              class="hover:bg-muted/50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-foreground">
                {{ maintenance.bike.name }} - {{ maintenance.bike.registrationNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">
                {{ new Date(maintenance.maintenanceDate).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">
                {{ calculateNextMaintenanceDate(maintenance).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <UpdateKilometersDialog :maintenance="maintenance" @updated="fetchDueMaintenances" />
                <button
                  @click="viewMaintenanceDetails(maintenance)"
                  class="text-primary hover:text-primary/80 transition-colors"
                  title="Voir les détails"
                >
                  <Eye class="h-4 w-4" />
                </button>
                <button
                  @click="goToMaintenance(maintenance)"
                  class="text-primary hover:text-primary/80 transition-colors"
                  title="Enregistrer un entretien"
                >
                  <Settings2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50">
      <div
        class="fixed inset-0 bg-background/80 backdrop-blur-sm"
        @click="showDetailsModal = false"
      />
      <div class="fixed inset-0 flex items-center justify-center overflow-y-auto py-8">
        <div class="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold mb-4 text-foreground">Détails de l'entretien à effectuer</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Moto</label>
              <p class="mt-1 text-foreground">
                {{ selectedMaintenance?.bike.name }} -
                {{ selectedMaintenance?.bike.registrationNumber }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground"
                >Dernier entretien</label
              >
              <p class="mt-1 text-foreground">
                {{
                  selectedMaintenance
                    ? new Date(selectedMaintenance.maintenanceDate).toLocaleDateString()
                    : ''
                }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground"
                >Prochain entretien prévu</label
              >
              <p class="mt-1 text-foreground">
                {{
                  selectedMaintenance
                    ? calculateNextMaintenanceDate(selectedMaintenance).toLocaleDateString()
                    : ''
                }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Raison</label>
              <p class="mt-1 text-foreground">
                {{ selectedMaintenance ? getMaintenanceReason(selectedMaintenance) : '' }}
              </p>
            </div>
            <div class="flex justify-end space-x-2">
              <button
                @click="showDetailsModal = false"
                class="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                Fermer
              </button>
              <button
                @click="goToMaintenance(selectedMaintenance)"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Enregistrer un nouvel entretien
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenanceStore } from '../stores/maintenance'
import type { Maintenance } from '../services/maintenance.service'
import { Settings2, Eye } from 'lucide-vue-next'
import UpdateKilometersDialog from '@/components/maintenance/UpdateKilometersDialog.vue'

const router = useRouter()
const maintenanceStore = useMaintenanceStore()
const dueMaintenances = ref<Maintenance[]>([])
const showDetailsModal = ref(false)
const selectedMaintenance = ref<Maintenance | null>(null)

function calculateNextMaintenanceDate(maintenance: Maintenance): Date {
  const lastDate = new Date(maintenance.maintenanceDate)
  const monthsToAdd = maintenance.bike.maintenanceInterval.monthInterval
  return new Date(lastDate.setMonth(lastDate.getMonth() + monthsToAdd))
}

function getMaintenanceReason(maintenance: Maintenance): string {
  const nextDate = calculateNextMaintenanceDate(maintenance)
  const today = new Date()

  if (nextDate < today) {
    return `L'entretien est en retard de ${Math.floor((today.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24))} jours`
  }

  return "L'entretien approche de sa date limite"
}

function viewMaintenanceDetails(maintenance: Maintenance) {
  selectedMaintenance.value = maintenance
  showDetailsModal.value = true
}

function goToMaintenance(maintenance: Maintenance | null) {
  if (maintenance) {
    showDetailsModal.value = false
    router.push({
      name: 'maintenance',
      query: {
        bikeId: maintenance.bike.id,
        action: 'create',
      },
    })
  }
}

const fetchDueMaintenances = async () => {
  dueMaintenances.value = await maintenanceStore.getDueMaintenances()
}

onMounted(async () => {
  await fetchDueMaintenances()
})
</script>
