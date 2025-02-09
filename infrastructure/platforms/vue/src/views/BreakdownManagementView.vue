<template>
  <div class="container mx-auto py-8">
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-foreground">Gestion des pannes et garanties</h1>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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
    <div v-else class="bg-card rounded-lg shadow overflow-hidden">
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
              Type
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Statut
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Date de signalement
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Coût total
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Garantie
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-background divide-y divide-border">
          <tr v-for="breakdown in breakdowns" :key="breakdown.id" class="hover:bg-muted/50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
              {{ breakdown.bike.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
              {{ formatType(breakdown.type) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full inline-flex items-center justify-center': true,
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                    breakdown.status === 'REPORTED',
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                    breakdown.status === 'IN_PROGRESS',
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                    breakdown.status === 'RESOLVED',
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200':
                    breakdown.status === 'CANCELLED',
                }"
              >
                {{ formatStatus(breakdown.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
              {{ formatDate(breakdown.reportDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
              {{ breakdown.totalCost.toFixed(2) }} €
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full inline-flex items-center justify-center': true,
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                    breakdown.warrantyApplied,
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200':
                    !breakdown.warrantyApplied,
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

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" @click="closeModal" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="relative bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4 text-foreground">
              {{ showCreateModal ? 'Signaler une panne' : 'Modifier la panne' }}
            </h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground">Moto</label>
                <select
                  v-model="form.bikeId"
                  class="mt-1 block w-full px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
                  required
                >
                  <option v-for="bike in bikes" :key="bike.id" :value="bike.id">
                    {{ bike.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground">Type de panne</label>
                <select
                  v-model="form.type"
                  class="mt-1 block w-full px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
                  required
                >
                  <option v-for="type in breakdownTypes" :key="type" :value="type">
                    {{ formatType(type) }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors resize-none"
                  required
                ></textarea>
              </div>
              <div v-if="showEditModal">
                <label class="block text-sm font-medium text-foreground">Statut</label>
                <select
                  v-model="form.status"
                  class="mt-1 block w-full px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
                >
                  <option v-for="status in breakdownStatuses" :key="status" :value="status">
                    {{ formatStatus(status) }}
                  </option>
                </select>
              </div>
              <div v-if="showEditModal">
                <label class="block text-sm font-medium text-foreground"
                  >Actions de réparation</label
                >
                <textarea
                  v-model="form.repairActions"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors resize-none"
                ></textarea>
              </div>
              <div v-if="showEditModal">
                <label class="block text-sm font-medium text-foreground"
                  >Recommandations techniques</label
                >
                <textarea
                  v-model="form.technicalRecommendations"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors resize-none"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground">Pièces détachées</label>
                <div class="space-y-2">
                  <div
                    v-for="(part, index) in form.spareParts"
                    :key="index"
                    class="flex items-center space-x-2 p-3 rounded-lg border border-input bg-card"
                  >
                    <select
                      v-model="part.sparePartId"
                      class="flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
                      @change="updatePartDetails(index)"
                    >
                      <option value="" disabled selected>Sélectionner une pièce</option>
                      <option
                        v-for="sparePart in availableSpareParts"
                        :key="sparePart.id"
                        :value="sparePart.id"
                      >
                        {{ sparePart.name }} (Stock: {{ sparePart.quantity }})
                      </option>
                    </select>
                    <input
                      v-model="part.quantity"
                      type="number"
                      min="1"
                      class="w-24 px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary transition-colors"
                      placeholder="Qté"
                      @input="updatePartDetails(index)"
                    />
                    <div class="w-24 text-right text-sm text-foreground" v-if="getPartPrice(index)">
                      {{ formatPrice(getPartPrice(index)) }}
                    </div>
                    <button
                      type="button"
                      @click="removeSparePart(index)"
                      class="p-2 text-destructive hover:text-destructive/80 transition-colors"
                      title="Retirer"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addSparePart"
                    class="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus class="h-4 w-4" />
                    <span>Ajouter une pièce</span>
                  </button>
                  <div
                    v-if="totalPrice > 0"
                    class="flex justify-end mt-4 p-3 rounded-lg bg-primary/5"
                  >
                    <div class="text-right">
                      <span class="text-sm text-muted-foreground">Total:</span>
                      <span class="ml-2 text-lg font-semibold text-primary">{{
                        formatPrice(totalPrice)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="warrantyApplied"
                  v-model="form.warrantyApplied"
                  class="rounded border-input bg-background text-primary focus:ring-primary"
                />
                <label for="warrantyApplied" class="ml-2 text-sm text-muted-foreground">
                  Sous garantie
                </label>
              </div>
              <div class="flex gap-4">
                <Button
                  type="button"
                  variant="destructive"
                  @click="closeModal"
                  :disabled="isSubmitting"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Enregistrement...' : (showCreateModal ? 'Créer' : 'Enregistrer') }}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-50">
      <div
        class="fixed inset-0 bg-background/80 backdrop-blur-sm"
        @click="showViewModal = false"
      ></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-card rounded-lg p-6 w-full max-w-2xl shadow-lg">
          <h2 class="text-xl font-bold mb-4 text-foreground">Détails de la panne</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Moto</label>
              <p class="mt-1 text-foreground">{{ selectedBreakdown?.bike.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Type</label>
              <p class="mt-1 text-foreground">
                {{ selectedBreakdown ? formatType(selectedBreakdown.type) : '' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Description</label>
              <p class="mt-1 text-foreground">{{ selectedBreakdown?.description }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Statut</label>
              <p class="mt-1">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full inline-flex items-center justify-center': true,
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                      selectedBreakdown?.status === 'REPORTED',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                      selectedBreakdown?.status === 'IN_PROGRESS',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                      selectedBreakdown?.status === 'RESOLVED',
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200':
                      selectedBreakdown?.status === 'CANCELLED',
                  }"
                >
                  {{ selectedBreakdown ? formatStatus(selectedBreakdown.status) : '' }}
                </span>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground"
                >Date de signalement</label
              >
              <p class="mt-1 text-foreground">
                {{ selectedBreakdown ? formatDate(selectedBreakdown.reportDate) : '' }}
              </p>
            </div>
            <div v-if="selectedBreakdown?.resolutionDate">
              <label class="block text-sm font-medium text-muted-foreground"
                >Date de résolution</label
              >
              <p class="mt-1 text-foreground">
                {{ formatDate(selectedBreakdown.resolutionDate) }}
              </p>
            </div>
            <div v-if="selectedBreakdown?.repairActions">
              <label class="block text-sm font-medium text-muted-foreground"
                >Actions de réparation</label
              >
              <p class="mt-1 text-foreground">{{ selectedBreakdown.repairActions }}</p>
            </div>
            <div v-if="selectedBreakdown?.technicalRecommendations">
              <label class="block text-sm font-medium text-muted-foreground"
                >Recommandations techniques</label
              >
              <p class="mt-1 text-foreground">{{ selectedBreakdown.technicalRecommendations }}</p>
            </div>
            <div v-if="selectedBreakdown?.spareParts.length">
              <label class="block text-sm font-medium text-muted-foreground"
                >Pièces détachées utilisées</label
              >
              <div class="mt-2 space-y-2">
                <div
                  v-for="part in selectedBreakdown.spareParts"
                  :key="part.id"
                  class="flex justify-between items-center p-2 bg-muted/50 rounded"
                >
                  <div>
                    <p class="font-medium text-foreground">{{ part.details.name }}</p>
                    <p class="text-sm text-muted-foreground">Quantité: {{ part.quantity }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-foreground">
                      {{ (Number(part.quantity) * Number(part.unitPrice)).toFixed(2) }} €
                    </p>
                    <p class="text-sm text-muted-foreground">
                      {{ Number(part.unitPrice).toFixed(2) }} € / unité
                    </p>
                  </div>
                </div>
                <div
                  class="flex justify-between items-center p-2 bg-primary/10 rounded font-medium"
                >
                  <span class="text-primary">Total</span>
                  <span class="text-primary">{{ selectedBreakdown.totalCost.toFixed(2) }} €</span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Garantie</label>
              <p class="mt-1">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full inline-flex items-center justify-center': true,
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                      selectedBreakdown?.warrantyApplied,
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200':
                      !selectedBreakdown?.warrantyApplied,
                  }"
                >
                  {{ selectedBreakdown?.warrantyApplied ? 'Sous garantie' : 'Hors garantie' }}
                </span>
              </p>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button
              @click="showViewModal = false"
              class="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50">
      <div
        class="fixed inset-0 bg-background/80 backdrop-blur-sm"
        @click="showDeleteModal = false"
      ></div>
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-card rounded-lg border border-border shadow-lg p-6 max-w-md mx-auto">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <h3 class="text-lg font-semibold text-foreground">Confirmer la suppression</h3>
              <p class="text-sm text-muted-foreground">
                Êtes-vous sûr de vouloir supprimer cette panne ? Cette action est irréversible.
              </p>
            </div>
            <div class="flex justify-end gap-2">
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBreakdownStore } from '../stores/breakdown'
import { useBikeStore } from '../stores/bike'
import type { Bike } from '../services/bike.service'
import type { Breakdown, SparePartRequest, SparePart } from '../services/breakdown.service'
import { BreakdownType, BreakdownStatus } from '../services/breakdown.service'
import { Eye, Pencil, Trash2, Plus, X } from 'lucide-vue-next'
import { useSparePartsStore } from '../stores/spareParts'
import { Button } from '../components/ui/button'

const breakdownStore = useBreakdownStore()
const bikeStore = useBikeStore()
const sparePartsStore = useSparePartsStore()

const loading = ref(false)
const error = ref<string | null>(null)
const bikes = ref<Bike[]>([])
const breakdowns = ref<Breakdown[]>([])
const availableSpareParts = ref<SparePart[]>([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const selectedBreakdownId = ref<string>('')
const selectedBreakdown = ref<Breakdown | null>(null)
const isSubmitting = ref(false)

const breakdownTypes = Object.values(BreakdownType)
const breakdownStatuses = Object.values(BreakdownStatus)

const form = ref({
  bikeId: '',
  type: BreakdownType.MECHANICAL,
  description: '',
  status: BreakdownStatus.REPORTED,
  repairActions: '',
  technicalRecommendations: '',
  spareParts: [] as SparePartRequest[],
  warrantyApplied: false,
})

const partPrices = ref<{ [key: number]: number }>({})
const totalPrice = ref(0)

function formatType(type: string): string {
  const typeMap: Record<string, string> = {
    MECHANICAL: 'Mécanique',
    ELECTRICAL: 'Électrique',
    ELECTRONIC: 'Électronique',
    BODYWORK: 'Carrosserie',
    OTHER: 'Autre',
  }
  return typeMap[type] || type
}

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('fr-FR')
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    REPORTED: 'Signalée',
    IN_PROGRESS: 'En cours',
    RESOLVED: 'Résolue',
    CANCELLED: 'Annulée',
  }
  return statusMap[status] || status
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function getPartPrice(index: number): number {
  return partPrices.value[index] || 0
}

function updatePartDetails(index: number) {
  const part = form.value.spareParts[index]
  const sparePart = availableSpareParts.value.find((sp) => sp.id === part.sparePartId)

  if (sparePart && part.quantity) {
    partPrices.value[index] = sparePart.price * part.quantity
    totalPrice.value = Object.values(partPrices.value).reduce((sum, price) => sum + price, 0)
  } else {
    partPrices.value[index] = 0
    totalPrice.value = Object.values(partPrices.value).reduce((sum, price) => sum + price, 0)
  }
}

function removeSparePart(index: number) {
  form.value.spareParts.splice(index, 1)
  delete partPrices.value[index]
  totalPrice.value = Object.values(partPrices.value).reduce((sum, price) => sum + price, 0)
}

function addSparePart() {
  form.value.spareParts.push({
    sparePartId: '',
    quantity: 1,
  })
  const index = form.value.spareParts.length - 1
  updatePartDetails(index)
}

async function fetchData() {
  try {
    loading.value = true
    await bikeStore.fetchBikes()
    bikes.value = bikeStore.bikes
    await breakdownStore.fetchBreakdowns()
    breakdowns.value = breakdownStore.breakdowns
    await sparePartsStore.fetchSpareParts()
    availableSpareParts.value = sparePartsStore.spareParts
  } catch {
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
    spareParts: breakdown.spareParts.map((sp) => ({
      sparePartId: sp.sparePartId,
      quantity: sp.quantity,
    })),
    warrantyApplied: breakdown.warrantyApplied,
  }

  partPrices.value = {}
  totalPrice.value = 0

  form.value.spareParts.forEach((part, index) => {
    const sparePart = availableSpareParts.value.find((sp) => sp.id === part.sparePartId)
    if (sparePart && part.quantity) {
      partPrices.value[index] = sparePart.price * part.quantity
      totalPrice.value += partPrices.value[index]
    }
  })

  showEditModal.value = true
}

function confirmDelete(breakdown: Breakdown) {
  selectedBreakdownId.value = breakdown.id
  showDeleteModal.value = true
}

async function handleSubmit() {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    const validSpareParts = form.value.spareParts.filter(part => part.sparePartId && part.quantity > 0);
    
    if (showCreateModal.value) {
      await breakdownStore.createBreakdown({
        bikeId: form.value.bikeId,
        description: form.value.description,
        type: form.value.type,
        warrantyApplied: form.value.warrantyApplied,
        ...(validSpareParts.length > 0 && { spareParts: validSpareParts }),
      })
    } else {
      await breakdownStore.updateBreakdown(selectedBreakdownId.value, {
        status: form.value.status,
        repairActions: form.value.repairActions,
        technicalRecommendations: form.value.technicalRecommendations,
        ...(validSpareParts.length > 0 && { spareParts: validSpareParts }),
        warrantyApplied: form.value.warrantyApplied,
      })
    }
    await fetchData()
    closeModal()
  } catch (err: any) {
    console.error('Error submitting breakdown:', err)
    error.value = "Erreur lors de l'enregistrement"
    closeModal()
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete() {
  try {
    await breakdownStore.deleteBreakdown(selectedBreakdownId.value)
    await fetchData()
    showDeleteModal.value = false
  } catch {
    error.value = 'Erreur lors de la suppression'
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  form.value = {
    bikeId: '',
    type: BreakdownType.MECHANICAL,
    description: '',
    status: BreakdownStatus.REPORTED,
    repairActions: '',
    technicalRecommendations: '',
    spareParts: [],
    warrantyApplied: false,
  }
  partPrices.value = {}
  totalPrice.value = 0
}

function openCreateModal() {
  partPrices.value = {}
  totalPrice.value = 0
  showCreateModal.value = true
}

onMounted(fetchData)
</script>
