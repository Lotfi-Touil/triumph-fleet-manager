<template>
  <div class="container mx-auto py-8">
    <!-- Formulaire pour ajouter un modèle de moto -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Ajouter un modèle de moto</CardTitle>
        <CardDescription
          >Créez un nouveau modèle de moto avec ses intervalles d'entretien</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleBikeModelSubmit" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="bike-id">Identifiant</Label>
              <Input id="bike-id" v-model="bikeModel.id" type="text" required />
            </div>
            <div class="space-y-2">
              <Label for="bike-name">Nom du modèle</Label>
              <Input id="bike-name" v-model="bikeModel.name" type="text" required />
            </div>
            <div class="space-y-2">
              <Label for="bike-km">Intervalle kilométrique</Label>
              <Input
                id="bike-km"
                v-model.number="bikeModel.maintenanceKilometers"
                type="number"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="bike-months">Intervalle en mois</Label>
              <Input
                id="bike-months"
                v-model.number="bikeModel.maintenanceMonths"
                type="number"
                required
              />
            </div>
          </div>
          <Button type="submit" class="w-full sm:w-auto"> Ajouter le modèle </Button>
        </form>
      </CardContent>
    </Card>

    <!-- Formulaire pour planifier un entretien -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Planifier un entretien</CardTitle>
        <CardDescription>Enregistrez un nouvel entretien pour un modèle de moto</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleMaintenanceScheduleSubmit" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="maintenance-id">Identifiant</Label>
              <Input id="maintenance-id" v-model="maintenanceSchedule.id" type="text" required />
            </div>
            <div class="space-y-2">
              <Label for="maintenance-bike-model">Modèle de moto</Label>
              <Input
                id="maintenance-bike-model"
                v-model="maintenanceSchedule.bikeModelId"
                type="text"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="maintenance-date">Date du dernier entretien</Label>
              <Input
                id="maintenance-date"
                v-model="maintenanceSchedule.lastMaintenanceDate"
                type="date"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="maintenance-last-km">Kilométrage au dernier entretien</Label>
              <Input
                id="maintenance-last-km"
                v-model.number="maintenanceSchedule.lastMaintenanceKilometers"
                type="number"
                required
              />
            </div>
            <div class="space-y-2 sm:col-span-2">
              <Label for="maintenance-current-km">Kilométrage actuel</Label>
              <Input
                id="maintenance-current-km"
                v-model.number="maintenanceSchedule.currentKilometers"
                type="number"
                required
              />
            </div>
          </div>
          <Button type="submit" class="w-full sm:w-auto"> Planifier l'entretien </Button>
        </form>
      </CardContent>
    </Card>

    <!-- Liste des entretiens à effectuer -->
    <Card>
      <CardHeader>
        <CardTitle>Entretiens à effectuer</CardTitle>
        <CardDescription>Liste des entretiens à venir pour vos motos</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="maintenanceStore.loading" class="text-center py-4">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"
          ></div>
          <p class="mt-2 text-muted-foreground">Chargement...</p>
        </div>
        <div
          v-else-if="maintenanceStore.error"
          class="p-4 rounded-lg bg-destructive/10 text-destructive"
        >
          {{ maintenanceStore.error }}
        </div>
        <div
          v-else-if="maintenanceStore.dueMaintenances.length === 0"
          class="text-center py-8 text-muted-foreground"
        >
          Aucun entretien à effectuer pour le moment.
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="maintenance in maintenanceStore.dueMaintenances"
            :key="maintenance.id"
            class="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-card-foreground">
                  {{ maintenance.bikeModel.name }}
                </h3>
                <div class="mt-2 space-y-1">
                  <p class="text-sm text-muted-foreground">
                    Dernier entretien :
                    {{ new Date(maintenance.lastMaintenanceDate).toLocaleDateString() }}
                  </p>
                  <p class="text-sm text-muted-foreground">
                    Kilométrage actuel :
                    <span class="text-primary font-medium"
                      >{{ maintenance.currentKilometers }} km</span
                    >
                  </p>
                  <p class="text-sm text-muted-foreground">
                    Prochain entretien prévu :
                    {{ new Date(maintenance.getNextMaintenanceDate).toLocaleDateString() }}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="icon">
                <Settings2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMaintenanceStore } from '../stores/maintenance'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings2 } from 'lucide-vue-next'

const maintenanceStore = useMaintenanceStore()

const bikeModel = ref({
  id: '',
  name: '',
  maintenanceKilometers: 0,
  maintenanceMonths: 0,
})

const maintenanceSchedule = ref({
  id: '',
  bikeModelId: '',
  lastMaintenanceDate: '',
  lastMaintenanceKilometers: 0,
  currentKilometers: 0,
})

async function handleBikeModelSubmit() {
  try {
    await maintenanceStore.createBikeModel(bikeModel.value)
    bikeModel.value = {
      id: '',
      name: '',
      maintenanceKilometers: 0,
      maintenanceMonths: 0,
    }
  } catch (error) {
    console.error('Erreur lors de la création du modèle:', error)
  }
}

async function handleMaintenanceScheduleSubmit() {
  try {
    await maintenanceStore.createMaintenanceSchedule(maintenanceSchedule.value)
    maintenanceSchedule.value = {
      id: '',
      bikeModelId: '',
      lastMaintenanceDate: '',
      lastMaintenanceKilometers: 0,
      currentKilometers: 0,
    }
  } catch (error) {
    console.error('Erreur lors de la création de la planification:', error)
  }
}

onMounted(() => {
  maintenanceStore.fetchDueMaintenances()
})
</script>
