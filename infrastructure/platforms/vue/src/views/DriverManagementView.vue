<template>
  <div class="container mx-auto py-8">
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-foreground">Gestion des Conducteurs</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Ajouter un conducteur
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
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead class="bg-muted">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Prénom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">N° Permis</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type Permis</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Expiration</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Expérience</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-card divide-y divide-border">
            <tr v-for="driver in drivers" :key="driver.id" class="hover:bg-muted/50">
              <td class="px-6 py-4 whitespace-nowrap text-foreground">{{ driver.lastName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">{{ driver.firstName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">{{ driver.licenseNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">{{ driver.licenseType }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">{{ formatDate(driver.licenseExpiryDate) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-foreground">{{ driver.experienceYears }} ans</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  @click="viewDriver(driver)"
                  class="text-primary hover:text-primary/80 transition-colors"
                  title="Voir les détails"
                >
                  <Eye class="h-4 w-4" />
                </button>
                <button
                  @click="editDriver(driver)"
                  class="text-primary hover:text-primary/80 transition-colors"
                  title="Modifier"
                >
                  <Pencil class="h-4 w-4" />
                </button>
                <button
                  @click="confirmDelete(driver)"
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

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div class="fixed inset-0 flex items-center justify-center overflow-y-auto py-8">
        <div class="bg-card rounded-lg p-6 w-full max-w-md shadow-lg border max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold mb-4 text-foreground">
            {{ showEditModal ? 'Modifier le conducteur' : 'Ajouter un conducteur' }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground">Nom</label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Prénom</label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Téléphone</label>
              <input
                v-model="form.phoneNumber"
                type="tel"
                required
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Numéro de permis</label>
              <input
                v-model="form.licenseNumber"
                type="text"
                required
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Type de permis</label>
              <select
                v-model="form.licenseType"
                required
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              >
                <option value="A">A</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Date d'expiration du permis</label>
              <input
                v-model="form.licenseExpiryDate"
                type="date"
                required
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Années d'expérience</label>
              <input
                v-model.number="form.experienceYears"
                type="number"
                required
                min="0"
                class="mt-1 block w-full rounded-md border border-black bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground">Historique de conduite</label>
              <textarea
                v-model="form.drivingHistory"
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
            Êtes-vous sûr de vouloir supprimer ce conducteur ? Cette action est irréversible.
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
            Détails du conducteur
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Nom</label>
              <p class="mt-1 text-foreground">{{ selectedDriver?.lastName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Prénom</label>
              <p class="mt-1 text-foreground">{{ selectedDriver?.firstName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Email</label>
              <p class="mt-1 text-foreground">{{ selectedDriver?.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Téléphone</label>
              <p class="mt-1 text-foreground">{{ selectedDriver?.phoneNumber }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Numéro de permis</label>
              <p class="mt-1 text-foreground">{{ selectedDriver?.licenseNumber }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Type de permis</label>
              <p class="mt-1 text-foreground">{{ selectedDriver?.licenseType }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Date d'expiration</label>
              <p class="mt-1 text-foreground">{{ selectedDriver ? formatDate(selectedDriver.licenseExpiryDate) : '' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Années d'expérience</label>
              <p class="mt-1 text-foreground">{{ selectedDriver?.experienceYears }} ans</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-foreground">Historique de conduite</label>
              <p class="mt-1 text-foreground">{{ selectedDriver?.drivingHistory }}</p>
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
import { ref, onMounted } from 'vue';
import { useDriverStore } from '@/stores/driver';
import { storeToRefs } from 'pinia';
import type { Driver } from '@/types/driver';
import { Eye, Pencil, Trash2 } from 'lucide-vue-next';

const driverStore = useDriverStore();
const { drivers } = storeToRefs(driverStore);
const loading = ref(false);
const error = ref<string | null>(null);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showViewModal = ref(false);
const selectedDriverId = ref<string>('');
const selectedDriver = ref<Driver | null>(null);

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  licenseNumber: '',
  licenseType: 'A',
  licenseExpiryDate: '',
  experienceYears: 0,
  drivingHistory: ''
});

onMounted(async () => {
  try {
    loading.value = true;
    await driverStore.fetchDrivers();
  } catch {
    error.value = "Erreur lors du chargement des conducteurs";
  } finally {
    loading.value = false;
  }
});

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString();
}

function editDriver(driver: Driver) {
  selectedDriverId.value = driver.id;
  form.value = {
    firstName: driver.firstName,
    lastName: driver.lastName,
    email: driver.email,
    phoneNumber: driver.phoneNumber,
    licenseNumber: driver.licenseNumber,
    licenseType: driver.licenseType,
    licenseExpiryDate: new Date(driver.licenseExpiryDate).toISOString().split('T')[0],
    experienceYears: driver.experienceYears,
    drivingHistory: driver.drivingHistory
  };
  showEditModal.value = true;
}

function confirmDelete(driver: Driver) {
  selectedDriverId.value = driver.id;
  showDeleteModal.value = true;
}

async function handleSubmit() {
  try {
    loading.value = true;
    const formData = {
      ...form.value,
      licenseExpiryDate: new Date(form.value.licenseExpiryDate)
    };
    if (showEditModal.value && selectedDriverId.value) {
      await driverStore.updateDriver(selectedDriverId.value, formData);
    } else {
      await driverStore.createDriver(formData);
    }
    closeModal();
    await driverStore.fetchDrivers();
  } catch {
    error.value = showEditModal.value
      ? "Erreur lors de la modification du conducteur"
      : "Erreur lors de la création du conducteur";
  } finally {
    loading.value = false;
  }
}

async function handleDelete() {
  if (!selectedDriverId.value) return;

  try {
    loading.value = true;
    await driverStore.deleteDriver(selectedDriverId.value);
    showDeleteModal.value = false;
    await driverStore.fetchDrivers();
  } catch {
    error.value = "Erreur lors de la suppression du conducteur";
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  showCreateModal.value = false;
  showEditModal.value = false;
  selectedDriverId.value = '';
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    licenseNumber: '',
    licenseType: 'A',
    licenseExpiryDate: '',
    experienceYears: 0,
    drivingHistory: ''
  };
  showViewModal.value = false;
  selectedDriver.value = null;
}

function viewDriver(driver: Driver) {
  selectedDriver.value = driver;
  showViewModal.value = true;
}
</script> 