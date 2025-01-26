<template>
  <div class="container mx-auto py-8 space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Formulaire pour ajouter un modèle de moto -->
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un modèle de moto</CardTitle>
          <CardDescription
            >Créez un nouveau modèle de moto avec ses intervalles d'entretien</CardDescription
          >
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleBikeSubmit" class="space-y-4">
            <div class="grid gap-4">
              <div class="space-y-2">
                <Label for="bike-name">Nom du modèle</Label>
                <Input
                  id="bike-name"
                  v-model="bike.name"
                  type="text"
                  placeholder="Ex: Street Triple RS"
                  required
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="bike-km">Intervalle kilométrique</Label>
                  <div class="flex items-center space-x-2">
                    <Input
                      id="bike-km"
                      v-model.number="bike.maintenanceKilometers"
                      type="number"
                      min="0"
                      step="1000"
                      required
                    />
                    <span class="text-muted-foreground">km</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <Label for="bike-months">Intervalle en mois</Label>
                  <div class="flex items-center space-x-2">
                    <Input
                      id="bike-months"
                      v-model.number="bike.maintenanceMonths"
                      type="number"
                      min="0"
                      required
                    />
                    <span class="text-muted-foreground">mois</span>
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit" class="w-full">Ajouter le modèle</Button>
          </form>
        </CardContent>
      </Card>

      <!-- Formulaire pour planifier un entretien -->
      <Card>
        <CardHeader>
          <CardTitle>Planifier un entretien</CardTitle>
          <CardDescription>Enregistrez un nouvel entretien pour un modèle de moto</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleMaintenanceSubmit" class="space-y-4">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="maintenance-bike-model">Modèle de moto</Label>
                <Select v-model="maintenance.bikeId">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Sélectionnez un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Modèles disponibles</SelectLabel>
                      <SelectItem v-for="model in bikes" :key="model.id" :value="model.id">
                        {{ model.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="maintenance-date">Date du dernier entretien</Label>
                <Input
                  id="maintenance-date"
                  v-model="maintenance.lastMaintenanceDate"
                  type="date"
                  required
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="maintenance-last-km">Kilométrage au dernier entretien</Label>
                  <div class="flex items-center space-x-2">
                    <Input
                      id="maintenance-last-km"
                      v-model.number="maintenance.lastMaintenanceKilometers"
                      type="number"
                      min="0"
                      required
                    />
                    <span class="text-muted-foreground">km</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <Label for="maintenance-current-km">Kilométrage actuel</Label>
                  <div class="flex items-center space-x-2">
                    <Input
                      id="maintenance-current-km"
                      v-model.number="maintenance.currentKilometers"
                      type="number"
                      min="0"
                      required
                    />
                    <span class="text-muted-foreground">km</span>
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit" class="w-full">Planifier l'entretien</Button>
          </form>
        </CardContent>
      </Card>
    </div>

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
            class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div>
              <h4 class="font-medium text-card-foreground">
                {{ maintenance.bike.name }}
              </h4>
              <div class="mt-1 space-y-1">
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
                  {{ calculateNextMaintenanceDate(maintenance).toLocaleDateString() }}
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Settings2 class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMaintenanceStore } from '../stores/maintenance'
import type { Bike, Maintenance } from '../services/maintenance.service'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Settings2 } from 'lucide-vue-next'
import { v4 as uuidv4 } from 'uuid'

const maintenanceStore = useMaintenanceStore()
const bikes = ref<Bike[]>([])

const bike = ref<Bike>({
  id: '',
  name: '',
  maintenanceKilometers: 0,
  maintenanceMonths: 0,
})

const maintenance = ref({
  id: '',
  bikeId: '',
  lastMaintenanceDate: '',
  lastMaintenanceKilometers: 0,
  currentKilometers: 0,
})

async function fetchBikes() {
  try {
    bikes.value = await maintenanceStore.fetchBikes()
  } catch (error) {
    console.error('Erreur lors de la récupération des motos:', error)
  }
}

async function handleBikeSubmit() {
  try {
    bike.value.id = uuidv4()
    await maintenanceStore.createBike(bike.value)
    await fetchBikes()
    bike.value = {
      id: '',
      name: '',
      maintenanceKilometers: 0,
      maintenanceMonths: 0,
    }
  } catch (error) {
    console.error('Erreur lors de la création de la moto:', error)
  }
}

async function handleMaintenanceSubmit() {
  try {
    maintenance.value.id = uuidv4()
    await maintenanceStore.createMaintenance(maintenance.value)
    maintenance.value = {
      id: '',
      bikeId: '',
      lastMaintenanceDate: '',
      lastMaintenanceKilometers: 0,
      currentKilometers: 0,
    }
  } catch (error) {
    console.error('Erreur lors de la création de la maintenance:', error)
  }
}

function calculateNextMaintenanceDate(maintenance: Maintenance): Date {
  const lastDate = new Date(maintenance.lastMaintenanceDate)
  const monthsToAdd = maintenance.bike.maintenanceMonths
  return new Date(lastDate.setMonth(lastDate.getMonth() + monthsToAdd))
}

onMounted(async () => {
  await fetchBikes()
  await maintenanceStore.fetchDueMaintenances()
})
</script>
