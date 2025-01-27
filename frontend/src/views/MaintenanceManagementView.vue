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
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Moto
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Date d'entretien
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Kilométrage
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-card divide-y divide-border">
          <tr v-for="maintenance in maintenances" :key="maintenance.id" class="hover:bg-muted/50">
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ maintenance.bike.name }} - {{ maintenance.bike.registrationNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ new Date(maintenance.lastMaintenanceDate).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ maintenance.currentKilometers }} km
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
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border">
          <h2 class="text-xl font-bold mb-4 text-foreground">
            {{ showEditModal ? 'Modifier l\'entretien' : 'Enregistrer un entretien' }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground">Moto</label>
              <Select v-model="form.bikeId">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Sélectionnez un modèle" class="text-foreground" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel class="text-foreground">Modèles disponibles</SelectLabel>
                    <SelectItem v-for="bike in bikes" :key="bike.id" :value="bike.id" class="text-foreground">
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
          <h2 class="text-xl font-bold mb-4 text-foreground">
            Détails de l'entretien
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Moto</label>
              <p class="mt-1 text-foreground">
                {{ selectedMaintenance?.bike.name }} - {{ selectedMaintenance?.bike.registrationNumber }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Date d'entretien</label>
              <p class="mt-1 text-foreground">
                {{ selectedMaintenance ? new Date(selectedMaintenance.lastMaintenanceDate).toLocaleDateString() : '' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Kilométrage</label>
              <p class="mt-1 text-foreground">{{ selectedMaintenance?.currentKilometers }} km</p>
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
import type { Bike } from '../services/bike.service'
import type { Maintenance } from '../services/maintenance.service'
import { Button } from '../components/ui/button'
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
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'

const maintenanceStore = useMaintenanceStore()
const bikeStore = useBikeStore()

const loading = ref(false)
const error = ref<string | null>(null)
const bikes = ref<Bike[]>([])
const maintenances = ref<Maintenance[]>([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const selectedMaintenanceId = ref<string>('')
const selectedMaintenance = ref<Maintenance | null>(null)

const form = ref({
  bikeId: '',
  date: '',
  kilometers: 0,
})

async function fetchData() {
  try {
    loading.value = true
    await bikeStore.fetchBikes()
    bikes.value = bikeStore.bikes
    const allMaintenances = await maintenanceStore.getAllMaintenances()
    maintenances.value = allMaintenances
  } catch (err) {
    error.value = 'Erreur lors du chargement des données'
  } finally {
    loading.value = false
  }
}

function editMaintenance(maintenance: Maintenance) {
  selectedMaintenanceId.value = maintenance.id
  form.value = {
    bikeId: maintenance.bike.id,
    date: new Date(maintenance.lastMaintenanceDate).toISOString().split('T')[0],
    kilometers: maintenance.currentKilometers,
  }
  showEditModal.value = true
}

function confirmDelete(maintenance: Maintenance) {
  selectedMaintenanceId.value = maintenance.id
  showDeleteModal.value = true
}

async function handleSubmit() {
  try {
    loading.value = true
    if (showEditModal.value && selectedMaintenanceId.value) {
      await maintenanceStore.updateMaintenance({
        id: selectedMaintenanceId.value,
        ...form.value
      })
    } else {
      await maintenanceStore.createMaintenance(form.value)
    }
    closeModal()
    await fetchData()
  } catch {
    error.value = showEditModal.value
      ? "Erreur lors de la modification de l'entretien"
      : "Erreur lors de la création de l'entretien"
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!selectedMaintenanceId.value) return

  try {
    loading.value = true
    await maintenanceStore.deleteMaintenance(selectedMaintenanceId.value)
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
  selectedMaintenanceId.value = ''
  selectedMaintenance.value = null
  form.value = {
    bikeId: '',
    date: '',
    kilometers: 0,
  }
}

function viewMaintenance(maintenance: Maintenance) {
  selectedMaintenance.value = maintenance
  showViewModal.value = true
}

onMounted(async () => {
  await fetchData()
})
</script> 