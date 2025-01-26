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
              <Label for="maintenance-date">Date de l'entretien</Label>
              <Input
                id="maintenance-date"
                v-model="maintenance.date"
                type="date"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="maintenance-current-km">Kilométrage actuel</Label>
              <div class="flex items-center space-x-2">
                <Input
                  id="maintenance-current-km"
                  v-model.number="maintenance.kilometers"
                  type="number"
                  min="0"
                  required
                />
                <span class="text-muted-foreground">km</span>
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
import { useBikeStore } from '../stores/bike'
import type { Bike } from '../services/bike.service'
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

const maintenanceStore = useMaintenanceStore()
const bikeStore = useBikeStore()
const bikes = ref<Bike[]>([])

const maintenance = ref({
  bikeId: '',
  date: '',
  kilometers: 0,
})

async function fetchBikes() {
  try {
    await bikeStore.fetchBikes()
    bikes.value = bikeStore.bikes
  } catch (error) {
    console.error('Erreur lors de la récupération des motos:', error)
  }
}

async function handleMaintenanceSubmit() {
  try {
    await maintenanceStore.createMaintenance(maintenance.value)
    maintenance.value = {
      bikeId: '',
      date: '',
      kilometers: 0,
    }
  } catch (error) {
    console.error('Erreur lors de la création de la maintenance:', error)
  }
}

onMounted(async () => {
  await fetchBikes()
})
</script> 