<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-foreground">Historique des incidents</h1>
      <button
        @click="openCreateDialog"
        class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Ajouter un incident
      </button>
    </div>

    <!-- Table des incidents -->
    <div class="bg-card shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-muted">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Conducteur</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sévérité</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-card divide-y divide-border">
          <tr v-for="incident in incidents" :key="incident.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
              {{ new Date(incident.date).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
              {{ incident.driver?.firstName }} {{ incident.driver?.lastName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
              {{ incident.type }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 text-xs font-semibold rounded-full': true,
                  'bg-destructive/20 text-destructive': incident.severity === 'Critique',
                  'bg-warning/20 text-warning': incident.severity === 'Élevé',
                  'bg-yellow-100 text-yellow-800': incident.severity === 'Moyen',
                  'bg-success/20 text-success': incident.severity === 'Faible'
                }"
              >
                {{ incident.severity }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 text-xs font-semibold rounded-full': true,
                  'bg-success/20 text-success': incident.status === 'Résolu',
                  'bg-primary/20 text-primary': incident.status === 'En cours',
                  'bg-warning/20 text-warning': incident.status === 'En attente',
                  'bg-muted text-muted-foreground': incident.status === 'Archivé'
                }"
              >
                {{ incident.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
              <button
                @click="openViewDialog(incident)"
                class="p-2 hover:bg-primary/10 rounded-md text-primary hover:text-primary"
                title="Voir les détails"
              >
                <Eye class="h-4 w-4" />
              </button>
              <button
                @click="openEditDialog(incident)"
                class="p-2 hover:bg-primary/10 rounded-md text-primary hover:text-primary"
                title="Modifier"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <button
                @click="deleteIncident(incident.id)"
                class="p-2 hover:bg-destructive/10 rounded-md text-destructive hover:text-destructive"
                title="Supprimer"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de création/modification/visualisation -->
    <div v-if="isDialogOpen" class="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-card w-full max-w-md rounded-lg shadow-lg p-6">
          <h3 class="text-lg font-medium leading-6 text-card-foreground mb-4">
            {{ viewingIncident ? 'Détails de l\'incident' : editingIncident ? 'Modifier l\'incident' : 'Créer un incident' }}
          </h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-card-foreground">Conducteur</label>
              <select
                v-model="form.driverId"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                :disabled="!!viewingIncident"
              >
                <option value="" class="text-foreground">Sélectionner un conducteur</option>
                <option v-for="driver in drivers" :key="driver.id" :value="driver.id" class="text-foreground">
                  {{ driver.firstName }} {{ driver.lastName }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-card-foreground">Type d'incident</label>
              <select
                v-model="form.type"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                :disabled="!!viewingIncident"
              >
                <option value="" class="text-foreground">Sélectionner un type</option>
                <option v-for="type in INCIDENT_TYPES" :key="type" class="text-foreground">{{ type }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-card-foreground">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Description de l'incident"
                required
                :disabled="!!viewingIncident"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-card-foreground">Date</label>
              <input
                type="date"
                v-model="form.date"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                :disabled="!!viewingIncident"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-card-foreground">Lieu</label>
              <input
                type="text"
                v-model="form.location"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Lieu de l'incident"
                required
                :disabled="!!viewingIncident"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-card-foreground">Sévérité</label>
              <select
                v-model="form.severity"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                :disabled="!!viewingIncident"
              >
                <option value="" class="text-foreground">Sélectionner une sévérité</option>
                <option v-for="severity in INCIDENT_SEVERITIES" :key="severity" class="text-foreground">{{ severity }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-card-foreground">Statut</label>
              <select
                v-model="form.status"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                :disabled="!!viewingIncident"
              >
                <option value="" class="text-foreground">Sélectionner un statut</option>
                <option v-for="status in INCIDENT_STATUSES" :key="status" class="text-foreground">{{ status }}</option>
              </select>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeDialog"
                class="px-4 py-2 text-sm font-medium text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {{ viewingIncident ? 'Fermer' : 'Annuler' }}
              </button>
              <button
                v-if="!viewingIncident"
                type="submit"
                class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {{ editingIncident ? 'Mettre à jour' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Eye, Pencil, Trash2 } from 'lucide-vue-next';
import { incidentService } from '../services/incident.service';
import { driverService } from '../services/driver.service';
import type { Incident } from '../types/incident';
import type { Driver } from '../types/driver';
import { INCIDENT_TYPES, INCIDENT_SEVERITIES, INCIDENT_STATUSES } from '../types/incident';
import { useNotificationStore } from '../stores/notifications';

const notifications = useNotificationStore();
const incidents = ref<Incident[]>([]);
const drivers = ref<Driver[]>([]);
const isDialogOpen = ref(false);
const editingIncident = ref<Incident | null>(null);
const viewingIncident = ref<Incident | null>(null);

const form = ref({
  driverId: '',
  type: '',
  description: '',
  date: '',
  location: '',
  severity: '',
  status: ''
});

onMounted(async () => {
  try {
    const [incidentsData, driversData] = await Promise.all([
      incidentService.getAllIncidents(),
      driverService.getAllDrivers()
    ]);
    incidents.value = incidentsData;
    drivers.value = driversData;
  } catch {
    notifications.showError('Erreur lors du chargement des données');
  }
});

const openCreateDialog = () => {
  editingIncident.value = null;
  form.value = {
    driverId: '',
    type: '',
    description: '',
    date: '',
    location: '',
    severity: '',
    status: ''
  };
  isDialogOpen.value = true;
};

const openEditDialog = (incident: Incident) => {
  editingIncident.value = incident;
  form.value = {
    driverId: incident.driverId,
    type: incident.type,
    description: incident.description,
    date: new Date(incident.date).toISOString().split('T')[0],
    location: incident.location,
    severity: incident.severity,
    status: incident.status
  };
  isDialogOpen.value = true;
};

const openViewDialog = (incident: Incident) => {
  viewingIncident.value = incident;
  form.value = {
    driverId: incident.driverId,
    type: incident.type,
    description: incident.description,
    date: new Date(incident.date).toISOString().split('T')[0],
    location: incident.location,
    severity: incident.severity,
    status: incident.status
  };
  isDialogOpen.value = true;
};

const closeDialog = () => {
  isDialogOpen.value = false;
  editingIncident.value = null;
  viewingIncident.value = null;
};

const handleSubmit = async () => {
  try {
    if (editingIncident.value) {
      const updated = await incidentService.updateIncident(editingIncident.value.id, {
        ...form.value,
        date: new Date(form.value.date)
      });
      const index = incidents.value.findIndex(i => i.id === updated.id);
      if (index !== -1) {
        incidents.value[index] = updated;
      }
      notifications.showSuccess('Incident mis à jour avec succès');
    } else {
      const created = await incidentService.createIncident({
        ...form.value,
        date: new Date(form.value.date)
      });
      incidents.value.push(created);
      notifications.showSuccess('Incident créé avec succès');
    }
    closeDialog();
  } catch {
    notifications.showError('Une erreur est survenue');
  }
};

const deleteIncident = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
    return;
  }

  try {
    await incidentService.deleteIncident(id);
    incidents.value = incidents.value.filter(i => i.id !== id);
    notifications.showSuccess('Incident supprimé avec succès');
  } catch {
    notifications.showError('Erreur lors de la suppression');
  }
};
</script> 