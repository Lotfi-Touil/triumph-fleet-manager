<template>
  <div class="container mx-auto py-8">
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-foreground">Suivi des Essais</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Démarrer un essai
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-4 rounded-lg bg-destructive/15 text-destructive">
      {{ error }}
    </div>

    <!-- Table -->
    <div v-else class="bg-card rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead class="bg-muted">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Conducteur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Moto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Début</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fin</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-card divide-y divide-border">
            <tr v-for="trial in trials" :key="trial.id" class="hover:bg-muted/50">
              <td class="px-6 py-4 whitespace-nowrap text-foreground">
                <span :title="`${trial.driver.firstName} ${trial.driver.lastName}`">
                  {{ `${trial.driver.firstName} ${trial.driver.lastName}`.length > 20 
                    ? `${trial.driver.firstName} ${trial.driver.lastName}`.slice(0, 20) + '...' 
                    : `${trial.driver.firstName} ${trial.driver.lastName}` }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">
                <span :title="trial.bike.name">
                  {{ trial.bike.name.length > 20 ? trial.bike.name.slice(0, 20) + '...' : trial.bike.name }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">
                {{ formatDateTime(trial.startDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">
                {{ trial.endDate ? formatDateTime(trial.endDate) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': trial.endDate,
                    'bg-yellow-100 text-yellow-800': !trial.endDate
                  }"
                >
                  {{ trial.endDate ? 'Terminé' : 'En cours' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  v-if="!trial.endDate"
                  @click="endTrial(trial)"
                  class="text-primary hover:text-primary/80 transition-colors"
                  title="Terminer l'essai"
                >
                  <CheckCircle class="h-4 w-4" />
                </button>
                <button
                  @click="viewTrial(trial)"
                  class="text-primary hover:text-primary/80 transition-colors"
                  title="Voir les détails"
                >
                  <Eye class="h-4 w-4" />
                </button>
                <button
                  @click="confirmDelete(trial)"
                  class="text-destructive hover:text-destructive/80 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div class="fixed inset-0 flex items-center justify-center overflow-y-auto py-8">
        <div class="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold mb-4 text-foreground">
            Démarrer un nouvel essai
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground">Conducteur</label>
              <select
                v-model="form.driverId"
                required
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              >
                <option value="">Sélectionner un conducteur</option>
                <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
                  {{ driver.firstName }} {{ driver.lastName }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Moto</label>
              <select
                v-model="form.bikeId"
                required
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              >
                <option value="">Sélectionner une moto</option>
                <option v-for="bike in bikes" :key="bike.id" :value="bike.id">
                  {{ bike.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Notes</label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Démarrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- End Trial Modal -->
    <div v-if="showEndModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border">
          <h2 class="text-xl font-bold mb-4 text-foreground">
            Terminer l'essai
          </h2>
          <form @submit.prevent="handleEndTrial" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground">Notes</label>
              <textarea
                v-model="endForm.notes"
                rows="3"
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                @click="showEndModal = false"
                class="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Terminer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border">
          <h2 class="text-xl font-bold mb-4 text-foreground">Confirmer la suppression</h2>
          <p class="text-muted-foreground mb-4">
            Êtes-vous sûr de vouloir supprimer cet essai ? Cette action est irréversible.
          </p>
          <div class="flex justify-end space-x-2">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              Annuler
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border">
          <h2 class="text-xl font-bold mb-4 text-foreground">
            Détails de l'essai
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Conducteur</label>
              <p class="mt-1 text-foreground">
                {{ selectedTrial?.driver.firstName }} {{ selectedTrial?.driver.lastName }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Moto</label>
              <p class="mt-1 text-foreground">{{ selectedTrial?.bike.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Début</label>
              <p class="mt-1 text-foreground">{{ selectedTrial ? formatDateTime(selectedTrial.startDate) : '' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Fin</label>
              <p class="mt-1 text-foreground">
                {{ selectedTrial?.endDate ? formatDateTime(selectedTrial.endDate) : '-' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Notes</label>
              <p class="mt-1 text-foreground">{{ selectedTrial?.notes || '-' }}</p>
            </div>
            <div class="flex justify-end">
              <button
                @click="showViewModal = false"
                class="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTrialStore } from '@/stores/trial'
import { useDriverStore } from '@/stores/driver'
import { useBikeStore } from '@/stores/bike'
import type { Trial } from '@/types/trial'
import { Eye, Trash2, CheckCircle } from 'lucide-vue-next'

const trialStore = useTrialStore()
const driverStore = useDriverStore()
const bikeStore = useBikeStore()

const { trials } = storeToRefs(trialStore)
const { drivers } = storeToRefs(driverStore)
const { bikes } = storeToRefs(bikeStore)

const loading = ref(false)
const error = ref<string | null>(null)

const showCreateModal = ref(false)
const showEndModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const selectedTrialId = ref<string>('')
const selectedTrial = ref<Trial | null>(null)

const form = ref({
  driverId: '',
  bikeId: '',
  notes: ''
})

const endForm = ref({
  notes: ''
})

onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([
      trialStore.fetchTrials(),
      driverStore.fetchDrivers(),
      bikeStore.fetchBikes()
    ])
  } catch {
    error.value = "Erreur lors du chargement des données"
  } finally {
    loading.value = false
  }
})

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}min`
}

function endTrial(trial: Trial) {
  selectedTrialId.value = trial.id
  endForm.value.notes = trial.notes
  showEndModal.value = true
}

function viewTrial(trial: Trial) {
  selectedTrial.value = trial
  showViewModal.value = true
}

function confirmDelete(trial: Trial) {
  selectedTrialId.value = trial.id
  showDeleteModal.value = true
}

async function handleSubmit() {
  try {
    loading.value = true
    await trialStore.createTrial({
      ...form.value,
      startDate: new Date()
    })
    closeModal()
    await trialStore.fetchTrials()
  } catch {
    error.value = "Erreur lors de la création de l'essai"
  } finally {
    loading.value = false
  }
}

async function handleEndTrial() {
  if (!selectedTrialId.value) return

  try {
    loading.value = true
    await trialStore.endTrial(selectedTrialId.value, {
      endDate: new Date(),
      notes: endForm.value.notes
    })
    showEndModal.value = false
    await trialStore.fetchTrials()
  } catch {
    error.value = "Erreur lors de la fin de l'essai"
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!selectedTrialId.value) return

  try {
    loading.value = true
    await trialStore.deleteTrial(selectedTrialId.value)
    showDeleteModal.value = false
    await trialStore.fetchTrials()
  } catch {
    error.value = "Erreur lors de la suppression de l'essai"
  } finally {
    loading.value = false
  }
}

function closeModal() {
  showCreateModal.value = false
  showEndModal.value = false
  selectedTrialId.value = ''
  form.value = {
    driverId: '',
    bikeId: '',
    notes: ''
  }
  endForm.value = {
    notes: ''
  }
  showViewModal.value = false
  selectedTrial.value = null
}
</script>

<style scoped>
.trial-tracking {
  padding: 1rem;
}
</style> 