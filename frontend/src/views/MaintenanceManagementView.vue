<template>
  <div class="container mx-auto py-8 space-y-8">
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
                    <SelectItem v-for="bike in bikes" :key="bike.id" :value="bike.id">
                      {{ bike.name }}
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMaintenanceStore } from '../stores/maintenance'
import type { Bike } from '../services/maintenance.service'
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
import { v4 as uuidv4 } from 'uuid'

const maintenanceStore = useMaintenanceStore()
const bikes = ref<Bike[]>([])

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

onMounted(async () => {
  await fetchBikes()
})
</script> 