<template>
  <div class="container mx-auto py-8">
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-foreground">Historique des entretiens</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Enregistrer un entretien
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
              Date d'entretien
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Kilométrage
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
              Coût
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-card divide-y divide-border">
          <tr v-for="maintenance in maintenances" :key="maintenance.id" class="hover:bg-muted/50">
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ maintenance.bike?.name }}
              {{
                maintenance.bike?.registrationNumber
                  ? `- ${maintenance.bike.registrationNumber}`
                  : ''
              }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ new Date(maintenance.maintenanceDate).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ maintenance.currentKilometers }} km
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ getTypeTranslation(maintenance.type) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              <span :class="{
                'px-2 py-1 rounded-full text-xs font-medium': true,
                'bg-yellow-100 text-yellow-800': maintenance.status === 'SCHEDULED',
                'bg-blue-100 text-blue-800': maintenance.status === 'IN_PROGRESS',
                'bg-green-100 text-green-800': maintenance.status === 'COMPLETED',
                'bg-red-100 text-red-800': maintenance.status === 'CANCELLED'
              }">
                {{ getStatusTranslation(maintenance.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ maintenance.cost }} €
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="viewMaintenance(maintenance)"
                class="text-primary hover:text-primary/80 transition-colors"
                title="Voir les détails"
              >
                <Eye class="h-4 w-4" />
              </button>
              <button
                @click="editMaintenance(maintenance)"
                class="text-primary hover:text-primary/80 transition-colors"
                title="Modifier"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <button
                @click="confirmDelete(maintenance)"
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
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div class="fixed inset-0 flex items-center justify-center overflow-y-auto py-8">
        <div class="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold mb-4 text-foreground">
            {{ showEditModal ? "Modifier l'entretien" : 'Enregistrer un entretien' }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground">Moto</label>
              <Select v-model="form.bikeId">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Sélectionnez un modèle" class="text-foreground placeholder:text-foreground" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel class="text-foreground">Modèles disponibles</SelectLabel>
                    <SelectItem
                      v-for="bike in bikes"
                      :key="bike.id"
                      :value="bike.id"
                      class="text-foreground"
                    >
                      {{ bike.name }} - {{ bike.registrationNumber }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Date de l'entretien</label>
              <Input
                v-model="form.date"
                type="date"
                class="mt-1 block w-full text-foreground"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Kilométrage actuel</label>
              <div class="flex items-center space-x-2">
                <Input
                  v-model.number="form.kilometers"
                  type="number"
                  min="0"
                  class="mt-1 block w-full text-foreground"
                  required
                />
                <span class="text-muted-foreground">km</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Type d'entretien</label>
              <Select v-model="form.type" required>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Sélectionnez le type d'entretien" class="text-foreground placeholder:text-foreground" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel class="text-foreground">Types d'entretien</SelectLabel>
                    <SelectItem value="PREVENTIVE" class="text-foreground">{{ getTypeTranslation(MaintenanceType.PREVENTIVE) }}</SelectItem>
                    <SelectItem value="REGULAR" class="text-foreground">{{ getTypeTranslation(MaintenanceType.REGULAR) }}</SelectItem>
                    <SelectItem value="INSPECTION" class="text-foreground">{{ getTypeTranslation(MaintenanceType.INSPECTION) }}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Statut</label>
              <Select v-model="form.status" required>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Sélectionnez le statut" class="text-foreground placeholder:text-foreground" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel class="text-foreground">Statuts disponibles</SelectLabel>
                    <SelectItem value="SCHEDULED" class="text-foreground">{{ getStatusTranslation(MaintenanceStatus.SCHEDULED) }}</SelectItem>
                    <SelectItem value="IN_PROGRESS" class="text-foreground">{{ getStatusTranslation(MaintenanceStatus.IN_PROGRESS) }}</SelectItem>
                    <SelectItem value="COMPLETED" class="text-foreground">{{ getStatusTranslation(MaintenanceStatus.COMPLETED) }}</SelectItem>
                    <SelectItem value="CANCELLED" class="text-foreground">{{ getStatusTranslation(MaintenanceStatus.CANCELLED) }}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Pièces remplacées</label>
              <div class="space-y-2">
                <div v-for="(part, index) in form.replacedParts" :key="index" class="flex items-center space-x-2">
                  <Input v-model="form.replacedParts[index]" class="flex-1 text-foreground placeholder:text-foreground" placeholder="Nom de la pièce" />
                  <button type="button" @click="removePart(index)" class="text-destructive hover:text-destructive/80">
                    <XCircle class="h-5 w-5" />
                  </button>
                </div>
                <button type="button" @click="addPart" class="text-primary hover:text-primary/80 text-sm flex items-center space-x-1">
                  <PlusCircle class="h-4 w-4" />
                  <span>Ajouter une pièce</span>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Coût (€)</label>
              <Input v-model.number="form.cost" type="number" min="0" step="0.01" class="mt-1 block w-full text-foreground" />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Recommandations techniques</label>
              <Textarea v-model="form.technicalRecommendations" rows="3" class="mt-1 block w-full text-foreground" />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Description des travaux</label>
              <Textarea v-model="form.workDescription" rows="3" class="mt-1 block w-full text-foreground" />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Date recommandée prochain entretien</label>
              <Input v-model="form.nextRecommendedMaintenanceDate" type="date" class="mt-1 block w-full text-foreground" />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Technicien</label>
              <Select v-model="form.technicianId">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Sélectionnez un technicien (optionnel)" class="text-foreground placeholder:text-foreground" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel class="text-foreground">Techniciens disponibles</SelectLabel>
                    <SelectItem
                      v-for="technician in technicians"
                      :key="technician.id"
                      :value="technician.id"
                      class="text-foreground"
                    >
                      {{ technician.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                {{ showEditModal ? 'Modifier' : 'Enregistrer' }}
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
            Êtes-vous sûr de vouloir supprimer cet entretien ? Cette action est irréversible.
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
          <h2 class="text-xl font-bold mb-4 text-foreground">Détails de l'entretien</h2>
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
                >Date d'entretien</label
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
              <label class="block text-sm font-medium text-muted-foreground">Kilométrage</label>
              <p class="mt-1 text-foreground">{{ selectedMaintenance?.currentKilometers }} km</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Type d'entretien</label>
              <p class="mt-1 text-foreground">{{ getTypeTranslation(selectedMaintenance?.type) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Statut</label>
              <p class="mt-1">
                <span :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-yellow-100 text-yellow-800': selectedMaintenance?.status === 'SCHEDULED',
                  'bg-blue-100 text-blue-800': selectedMaintenance?.status === 'IN_PROGRESS',
                  'bg-green-100 text-green-800': selectedMaintenance?.status === 'COMPLETED',
                  'bg-red-100 text-red-800': selectedMaintenance?.status === 'CANCELLED'
                }">
                  {{ getStatusTranslation(selectedMaintenance?.status) }}
                </span>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Pièces remplacées</label>
              <div class="mt-1 space-y-1">
                <p v-for="(part, index) in selectedMaintenance?.replacedParts" :key="index" class="text-foreground">
                  - {{ part }}
                </p>
                <p v-if="!selectedMaintenance?.replacedParts?.length" class="text-muted-foreground italic">
                  Aucune pièce remplacée
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Coût</label>
              <p class="mt-1 text-foreground">{{ selectedMaintenance?.cost }} €</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Recommandations techniques</label>
              <p class="mt-1 text-foreground whitespace-pre-line">{{ selectedMaintenance?.technicalRecommendations || 'Aucune recommandation' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Description des travaux</label>
              <p class="mt-1 text-foreground whitespace-pre-line">{{ selectedMaintenance?.workDescription || 'Aucune description' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Prochain entretien recommandé</label>
              <p class="mt-1 text-foreground">
                {{ selectedMaintenance?.nextRecommendedMaintenanceDate ? new Date(selectedMaintenance.nextRecommendedMaintenanceDate).toLocaleDateString() : 'Non spécifié' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Technicien</label>
              <p class="mt-1 text-foreground">
                {{ selectedMaintenance?.technician?.name || 'Non assigné' }}
              </p>
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
import { useMaintenanceStore } from '../stores/maintenance'
import { useBikeStore } from '../stores/bike'
import { useUserStore } from '../stores/user'
import type { Maintenance } from '../services/maintenance.service'
import { MaintenanceStatus, MaintenanceType } from '../services/maintenance.service'
import type { Bike } from '../services/bike.service'
import type { User } from '../services/user.service'
import { Input } from '../components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Eye, Pencil, Trash2, XCircle, PlusCircle } from 'lucide-vue-next'
import { Textarea } from '../components/ui/textarea'

const maintenanceStore = useMaintenanceStore()
const bikeStore = useBikeStore()
const userStore = useUserStore()

const maintenances = ref<Maintenance[]>([])
const bikes = ref<Bike[]>([])
const technicians = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const selectedMaintenance = ref<Maintenance | null>(null)

const maintenanceTypeTranslations = {
  [MaintenanceType.PREVENTIVE]: 'Préventif',
  [MaintenanceType.REGULAR]: 'Régulier',
  [MaintenanceType.INSPECTION]: 'Inspection',
} as const

const maintenanceStatusTranslations = {
  [MaintenanceStatus.SCHEDULED]: 'Planifié',
  [MaintenanceStatus.IN_PROGRESS]: 'En cours',
  [MaintenanceStatus.COMPLETED]: 'Terminé',
  [MaintenanceStatus.CANCELLED]: 'Annulé',
} as const

const getTypeTranslation = (type: MaintenanceType | undefined): string => {
  if (!type) return ''
  return maintenanceTypeTranslations[type]
}

const getStatusTranslation = (status: MaintenanceStatus | undefined): string => {
  if (!status) return ''
  return maintenanceStatusTranslations[status]
}

const form = ref({
  bikeId: '',
  date: '',
  kilometers: 0,
  technicianId: '',
  type: MaintenanceType.REGULAR,
  status: MaintenanceStatus.SCHEDULED,
  replacedParts: [] as string[],
  cost: 0,
  technicalRecommendations: '',
  workDescription: '',
  nextRecommendedMaintenanceDate: '',
})

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null
    const [maintenanceData, bikeData, technicianData] = await Promise.all([
      maintenanceStore.fetchMaintenances(),
      bikeStore.fetchBikes(),
      userStore.getTechnicians(),
    ])
    maintenances.value = maintenanceStore.maintenances
    bikes.value = bikeStore.bikes
    technicians.value = technicianData
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

function editMaintenance(maintenance: Maintenance) {
  selectedMaintenance.value = maintenance
  showEditModal.value = true
}

function confirmDelete(maintenance: Maintenance) {
  selectedMaintenance.value = maintenance
  showDeleteModal.value = true
}

const handleSubmit = async () => {
  try {
    if (showEditModal && selectedMaintenance.value) {
      await maintenanceStore.updateMaintenance(selectedMaintenance.value.id, {
        technicianId: form.value.technicianId || undefined,
        status: form.value.status,
        type: form.value.type,
      })
    } else {
      await maintenanceStore.createMaintenance({
        bikeId: form.value.bikeId,
        maintenanceDate: form.value.date,
        lastMaintenanceKilometers: 0,
        currentKilometers: form.value.kilometers,
        technicianId: form.value.technicianId || undefined,
        type: form.value.type,
      })
    }
    closeModal()
    await fetchData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
  }
}

async function handleDelete() {
  if (!selectedMaintenance.value) return

  try {
    loading.value = true
    await maintenanceStore.deleteMaintenance(selectedMaintenance.value.id)
    showDeleteModal.value = false
    await fetchData()
  } catch {
    error.value = "Erreur lors de la suppression de l'entretien"
  } finally {
    loading.value = false
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  showViewModal.value = false
  selectedMaintenance.value = null
  form.value = {
    bikeId: '',
    date: '',
    kilometers: 0,
    technicianId: '',
    type: MaintenanceType.REGULAR,
    status: MaintenanceStatus.SCHEDULED,
    replacedParts: [],
    cost: 0,
    technicalRecommendations: '',
    workDescription: '',
    nextRecommendedMaintenanceDate: '',
  }
}

function viewMaintenance(maintenance: Maintenance) {
  selectedMaintenance.value = maintenance
  showViewModal.value = true
}

function addPart() {
  form.value.replacedParts.push('')
}

function removePart(index: number) {
  form.value.replacedParts.splice(index, 1)
}

onMounted(async () => {
  await fetchData()
})
</script>
