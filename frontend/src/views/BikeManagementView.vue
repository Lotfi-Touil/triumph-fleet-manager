<template>
  <div class="container mx-auto py-8 space-y-8">
    <!-- Formulaire pour ajouter un modèle de moto -->
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un modèle de moto</CardTitle>
        <CardDescription>Créez un nouveau modèle de moto avec ses intervalles d'entretien</CardDescription>
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
                    v-model.number="bike.maintenanceInterval.kilometerInterval"
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
                    v-model.number="bike.maintenanceInterval.monthInterval"
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

    <!-- Liste des motos -->
    <Card>
      <CardHeader>
        <CardTitle>Parc moto</CardTitle>
        <CardDescription>Liste des modèles de moto enregistrés</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="maintenanceStore.loading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p class="mt-2 text-muted-foreground">Chargement...</p>
        </div>
        <div v-else-if="maintenanceStore.error" class="p-4 rounded-lg bg-destructive/10 text-destructive">
          {{ maintenanceStore.error }}
        </div>
        <div v-else-if="bikes.length === 0" class="text-center py-8 text-muted-foreground">
          Aucune moto enregistrée.
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="bike in bikes"
            :key="bike.id"
            class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div>
              <h4 class="font-medium text-card-foreground">{{ bike.name }}</h4>
              <div class="mt-1 space-y-1">
                <p class="text-sm text-muted-foreground">
                  Intervalle : {{ bike.maintenanceInterval.kilometerInterval }} km / 
                  {{ bike.maintenanceInterval.monthInterval }} mois
                </p>
              </div>
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
import type { Bike } from '../services/maintenance.service'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { v4 as uuidv4 } from 'uuid'

const maintenanceStore = useMaintenanceStore()
const bikes = ref<Bike[]>([])

const bike = ref<Bike>({
  id: '',
  name: '',
  maintenanceInterval: {
    kilometerInterval: 0,
    monthInterval: 0
  }
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
      maintenanceInterval: {
        kilometerInterval: 0,
        monthInterval: 0
      }
    }
  } catch (error) {
    console.error('Erreur lors de la création de la moto:', error)
  }
}

onMounted(async () => {
  await fetchBikes()
})
</script> 