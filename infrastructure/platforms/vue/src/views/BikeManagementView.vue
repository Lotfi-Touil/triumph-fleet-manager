<template>
  <div class="container mx-auto py-8">
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-foreground">Gestion du parc moto</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Ajouter une moto
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
              Nom
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Immatriculation
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Intervalle kilométrique
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Intervalle mensuel
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-card divide-y divide-border">
          <tr v-for="bike in bikes" :key="bike.id" class="hover:bg-muted/50">
            <td class="px-6 py-4 whitespace-nowrap text-foreground">{{ bike.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">{{ bike.registrationNumber }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ bike.maintenanceInterval.kilometers }} km
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-foreground">
              {{ bike.maintenanceInterval.monthInterval }} mois
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="viewBike(bike)"
                class="text-primary hover:text-primary/80 transition-colors"
                title="Voir les détails"
              >
                <Eye class="h-4 w-4" />
              </button>
              <button
                @click="editBike(bike)"
                class="text-primary hover:text-primary/80 transition-colors"
                title="Modifier"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <button
                @click="confirmDelete(bike)"
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
            {{ showEditModal ? 'Modifier la moto' : 'Ajouter une moto' }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground">Nom</label>
              <input
                v-model="form.name"
                type="text"
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Immatriculation</label>
              <input
                v-model="form.registrationNumber"
                type="text"
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Intervalle kilométrique</label>
              <input
                v-model.number="form.maintenanceInterval.kilometers"
                type="number"
                min="0"
                step="1000"
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Intervalle mensuel</label>
              <input
                v-model.number="form.maintenanceInterval.monthInterval"
                type="number"
                min="0"
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
                required
              />
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
                {{ showEditModal ? 'Modifier' : 'Ajouter' }}
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
            Êtes-vous sûr de vouloir supprimer cette moto ? Cette action est irréversible.
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
            Détails de la moto
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Nom</label>
              <p class="mt-1 text-foreground">{{ selectedBike?.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Immatriculation</label>
              <p class="mt-1 text-foreground">{{ selectedBike?.registrationNumber }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Intervalle kilométrique</label>
              <p class="mt-1 text-foreground">{{ selectedBike?.maintenanceInterval.kilometers }} km</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Intervalle mensuel</label>
              <p class="mt-1 text-foreground">{{ selectedBike?.maintenanceInterval.monthInterval }} mois</p>
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
import { ref, onMounted, computed } from 'vue'
import { useBikeStore } from '../stores/bike'
import type { Bike } from '../services/bike.service'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'

const bikeStore = useBikeStore()
const selectedBikeId = ref<string>('')
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const bikes = computed(() => bikeStore.bikes)

const loading = ref(false)
const error = ref<string | null>(null)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const selectedBike = ref<Bike | null>(null)

const form = ref<Omit<Bike, 'id'>>({
  name: '',
  registrationNumber: '',
  maintenanceInterval: {
    kilometers: 0,
    monthInterval: 0,
  },
})

onMounted(async () => {
  try {
    loading.value = true
    await bikeStore.fetchBikes()
  } catch {
    error.value = "Erreur lors du chargement des motos"
  } finally {
    loading.value = false
  }
})

const editBike = (bike: Bike) => {
  selectedBikeId.value = bike.id
  form.value = {
    name: bike.name,
    registrationNumber: bike.registrationNumber,
    maintenanceInterval: {
      kilometers: bike.maintenanceInterval.kilometers,
      monthInterval: bike.maintenanceInterval.monthInterval
    }
  }
  showEditModal.value = true
}

const confirmDelete = (bike: Bike) => {
  selectedBikeId.value = bike.id
  showDeleteModal.value = true
}

const handleSubmit = async () => {
  try {
    loading.value = true
    if (showEditModal.value && selectedBikeId.value) {
      await bikeStore.updateBike({
        id: selectedBikeId.value,
        ...form.value
      })
    } else {
      await bikeStore.createBike(form.value)
    }
    closeModal()
    await bikeStore.fetchBikes()
  } catch {
    error.value = showEditModal.value
      ? "Erreur lors de la modification de la moto"
      : "Erreur lors de la création de la moto"
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedBikeId.value) return

  try {
    loading.value = true
    await bikeStore.deleteBike(selectedBikeId.value)
    showDeleteModal.value = false
    await bikeStore.fetchBikes()
  } catch {
    error.value = "Erreur lors de la suppression de la moto"
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedBikeId.value = ''
  form.value = {
    name: '',
    registrationNumber: '',
    maintenanceInterval: {
      kilometers: 0,
      monthInterval: 0
    }
  }
  showViewModal.value = false
  selectedBike.value = null
}

function viewBike(bike: Bike) {
  selectedBike.value = bike
  showViewModal.value = true
}
</script> 