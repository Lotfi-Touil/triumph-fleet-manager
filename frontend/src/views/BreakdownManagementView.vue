<template>
  <div class="container mx-auto py-8">
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-foreground">Gestion des pannes et garanties</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Signaler une panne
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
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de signalement</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Garantie</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="breakdown in breakdowns" :key="breakdown.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ breakdown.bike.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatType(breakdown.type) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full': true,
                  'bg-yellow-100 text-yellow-800': breakdown.status === 'REPORTED',
                  'bg-blue-100 text-blue-800': breakdown.status === 'IN_PROGRESS',
                  'bg-green-100 text-green-800': breakdown.status === 'RESOLVED',
                  'bg-gray-100 text-gray-800': breakdown.status === 'CANCELLED'
                }"
              >
                {{ formatStatus(breakdown.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Date(breakdown.reportDate).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full': true,
                  'bg-green-100 text-green-800': breakdown.warrantyApplied,
                  'bg-gray-100 text-gray-800': !breakdown.warrantyApplied
                }"
              >
                {{ breakdown.warrantyApplied ? 'Sous garantie' : 'Hors garantie' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="viewBreakdown(breakdown)"
                class="text-primary hover:text-primary/80 transition-colors"
                title="Voir les détails"
              >
                <Eye class="h-4 w-4" />
              </button>
              <button
                @click="editBreakdown(breakdown)"
                class="text-primary hover:text-primary/80 transition-colors"
                title="Modifier"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <button
                @click="confirmDelete(breakdown)"
                class="text-red-600 hover:text-red-800 transition-colors"
                title="Supprimer"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 class="text-xl font-bold mb-4 text-foreground">
            {{ showEditModal ? 'Modifier la panne' : 'Signaler une panne' }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground">Moto</label>
              <select
                v-model="form.bikeId"
                class="mt-1 block w-full px-3 py-2 rounded-md border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
                required
              >
                <option value="" disabled class="text-muted-foreground">Sélectionnez un modèle</option>
                <option v-for="bike in bikes" :key="bike.id" :value="bike.id" class="text-foreground py-1">
                  {{ bike.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Type de panne</label>
              <select
                v-model="form.type"
                class="mt-1 block w-full px-3 py-2 rounded-md border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
                required
              >
                <option v-for="type in breakdownTypes" :key="type" :value="type" class="text-foreground py-1">
                  {{ formatType(type) }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="mt-1 block w-full px-3 py-2 rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors resize-none"
                required
              ></textarea>
            </div>
            <div v-if="showEditModal">
              <label class="block text-sm font-medium text-foreground">Statut</label>
              <select
                v-model="form.status"
                class="mt-1 block w-full px-3 py-2 rounded-md border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
              >
                <option v-for="status in breakdownStatuses" :key="status" :value="status" class="text-foreground py-1">
                  {{ formatStatus(status) }}
                </option>
              </select>
            </div>
            <div v-if="showEditModal">
              <label class="block text-sm font-medium text-foreground">Actions de réparation</label>
              <textarea
                v-model="form.repairActions"
                rows="3"
                class="mt-1 block w-full px-3 py-2 rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors resize-none"
              ></textarea>
            </div>
            <div v-if="showEditModal">
              <label class="block text-sm font-medium text-foreground">Recommandations techniques</label>
              <textarea
                v-model="form.technicalRecommendations"
                rows="3"
                class="mt-1 block w-full px-3 py-2 rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors resize-none"
              ></textarea>
            </div>
            <div v-if="showEditModal">
              <label class="block text-sm font-medium text-foreground">Pièces remplacées</label>
              <div class="space-y-2">
                <div v-for="(part, index) in form.replacedParts" :key="index" class="flex gap-2">
                  <input
                    v-model="form.replacedParts[index]"
                    type="text"
                    class="flex-1 px-3 py-2 rounded-md border-input bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
                    placeholder="Nom de la pièce"
                  />
                  <button
                    type="button"
                    @click="form.replacedParts.splice(index, 1)"
                    class="p-2 text-destructive hover:text-destructive/80 transition-colors rounded-md hover:bg-destructive/10"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  @click="form.replacedParts.push('')"
                  class="text-sm text-primary hover:text-primary/80 transition-colors px-3 py-1 rounded-md hover:bg-primary/10"
                >
                  + Ajouter une pièce
                </button>
              </div>
            </div>
            <div v-if="showEditModal">
              <label class="block text-sm font-medium text-foreground">Coût</label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="form.cost"
                  type="number"
                  min="0"
                  step="0.01"
                  class="mt-1 block w-full px-3 py-2 rounded-md border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
                />
                <span class="text-muted-foreground">€</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="form.warrantyApplied"
                id="warranty"
                class="rounded border-input bg-background text-primary focus:ring-primary w-4 h-4 transition-colors"
              />
              <label
                for="warranty"
                class="text-sm font-medium text-foreground"
              >
                Sous garantie
              </label>
            </div>
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {{ showEditModal ? 'Modifier' : 'Signaler' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showViewModal = false"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 class="text-xl font-bold mb-4 text-gray-900">
            Détails de la panne
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">Moto</label>
              <p class="mt-1 text-gray-900">{{ selectedBreakdown?.bike.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Type</label>
              <p class="mt-1 text-gray-900">{{ selectedBreakdown ? formatType(selectedBreakdown.type) : '' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Description</label>
              <p class="mt-1 text-gray-900">{{ selectedBreakdown?.description }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Statut</label>
              <p class="mt-1">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-yellow-100 text-yellow-800': selectedBreakdown?.status === 'REPORTED',
                    'bg-blue-100 text-blue-800': selectedBreakdown?.status === 'IN_PROGRESS',
                    'bg-green-100 text-green-800': selectedBreakdown?.status === 'RESOLVED',
                    'bg-gray-100 text-gray-800': selectedBreakdown?.status === 'CANCELLED'
                  }"
                >
                  {{ selectedBreakdown ? formatStatus(selectedBreakdown.status) : '' }}
                </span>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Date de signalement</label>
              <p class="mt-1 text-gray-900">
                {{ selectedBreakdown ? new Date(selectedBreakdown.reportDate).toLocaleDateString() : '' }}
              </p>
            </div>
            <div v-if="selectedBreakdown?.resolutionDate">
              <label class="block text-sm font-medium text-gray-500">Date de résolution</label>
              <p class="mt-1 text-gray-900">
                {{ new Date(selectedBreakdown.resolutionDate).toLocaleDateString() }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Actions de réparation</label>
              <p class="mt-1 text-gray-900">{{ selectedBreakdown?.repairActions || 'Aucune action enregistrée' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Recommandations techniques</label>
              <p class="mt-1 text-gray-900">{{ selectedBreakdown?.technicalRecommendations || 'Aucune recommandation' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Pièces remplacées</label>
              <div class="mt-1">
                <ul v-if="selectedBreakdown?.replacedParts.length" class="list-disc list-inside text-gray-900">
                  <li v-for="part in selectedBreakdown.replacedParts" :key="part">{{ part }}</li>
                </ul>
                <p v-else class="text-gray-900">Aucune pièce remplacée</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Coût</label>
              <p class="mt-1 text-gray-900">
                {{ selectedBreakdown?.cost }} €
                <span v-if="selectedBreakdown?.warrantyApplied" class="text-green-600 ml-2">(Sous garantie)</span>
              </p>
            </div>
            <div class="flex justify-end">
              <button
                @click="showViewModal = false"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showDeleteModal = false"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 class="text-xl font-bold mb-4 text-gray-900">Confirmer la suppression</h2>
          <p class="text-gray-500 mb-4">
            Êtes-vous sûr de vouloir supprimer cette panne ? Cette action est irréversible.
          </p>
          <div class="flex justify-end space-x-2">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              Annuler
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBreakdownStore } from '../stores/breakdown'
import { useBikeStore } from '../stores/bike'
import type { Bike } from '../services/bike.service'
import type { Breakdown } from '../services/breakdown.service'
import { BreakdownType, BreakdownStatus } from '../services/breakdown.service'
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'

const breakdownStore = useBreakdownStore()
const bikeStore = useBikeStore()

const loading = ref(false)
const error = ref<string | null>(null)
const bikes = ref<Bike[]>([])
const breakdowns = ref<Breakdown[]>([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const selectedBreakdownId = ref<string>('')
const selectedBreakdown = ref<Breakdown | null>(null)

const breakdownTypes = Object.values(BreakdownType)
const breakdownStatuses = Object.values(BreakdownStatus)

const form = ref({
  bikeId: '',
  type: BreakdownType.MECHANICAL,
  description: '',
  status: BreakdownStatus.REPORTED,
  repairActions: '',
  technicalRecommendations: '',
  replacedParts: [] as string[],
  cost: 0,
  warrantyApplied: false
})

function formatType(type: string): string {
  const typeMap: Record<string, string> = {
    MECHANICAL: 'Mécanique',
    ELECTRICAL: 'Électrique',
    ELECTRONIC: 'Électronique',
    BODYWORK: 'Carrosserie',
    OTHER: 'Autre'
  }
  return typeMap[type] || type
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    REPORTED: 'Signalée',
    IN_PROGRESS: 'En cours',
    RESOLVED: 'Résolue',
    CANCELLED: 'Annulée'
  }
  return statusMap[status] || status
}

async function fetchData() {
  try {
    loading.value = true
    await bikeStore.fetchBikes()
    bikes.value = bikeStore.bikes
    await breakdownStore.fetchBreakdowns()
    breakdowns.value = breakdownStore.breakdowns
  } catch (err) {
    error.value = 'Erreur lors du chargement des données'
  } finally {
    loading.value = false
  }
}

function viewBreakdown(breakdown: Breakdown) {
  selectedBreakdown.value = breakdown
  showViewModal.value = true
}

function editBreakdown(breakdown: Breakdown) {
  selectedBreakdownId.value = breakdown.id
  form.value = {
    bikeId: breakdown.bike.id,
    type: breakdown.type,
    description: breakdown.description,
    status: breakdown.status,
    repairActions: breakdown.repairActions,
    technicalRecommendations: breakdown.technicalRecommendations,
    replacedParts: [...breakdown.replacedParts],
    cost: breakdown.cost,
    warrantyApplied: breakdown.warrantyApplied
  }
  showEditModal.value = true
}

function confirmDelete(breakdown: Breakdown) {
  selectedBreakdownId.value = breakdown.id
  showDeleteModal.value = true
}

async function handleSubmit() {
  try {
    loading.value = true
    if (showEditModal.value && selectedBreakdownId.value) {
      await breakdownStore.updateBreakdown(selectedBreakdownId.value, {
        status: form.value.status as BreakdownStatus,
        repairActions: form.value.repairActions,
        technicalRecommendations: form.value.technicalRecommendations,
        replacedParts: form.value.replacedParts,
        cost: form.value.cost,
        warrantyApplied: form.value.warrantyApplied
      })
    } else {
      await breakdownStore.createBreakdown({
        bikeId: form.value.bikeId,
        description: form.value.description,
        type: form.value.type as BreakdownType,
        warrantyApplied: form.value.warrantyApplied
      })
    }
    closeModal()
    await fetchData()
  } catch {
    error.value = showEditModal.value
      ? "Erreur lors de la modification de la panne"
      : "Erreur lors de la création de la panne"
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!selectedBreakdownId.value) return

  try {
    loading.value = true
    await breakdownStore.deleteBreakdown(selectedBreakdownId.value)
    showDeleteModal.value = false
    await fetchData()
  } catch {
    error.value = "Erreur lors de la suppression de la panne"
  } finally {
    loading.value = false
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  showViewModal.value = false
  selectedBreakdownId.value = ''
  selectedBreakdown.value = null
  form.value = {
    bikeId: '',
    type: BreakdownType.MECHANICAL,
    description: '',
    status: BreakdownStatus.REPORTED,
    repairActions: '',
    technicalRecommendations: '',
    replacedParts: [],
    cost: 0,
    warrantyApplied: false
  }
}

onMounted(async () => {
  await fetchData()
})
</script> 