<template>
  <div class="container mx-auto py-8 space-y-8">
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
          v-else-if="dueMaintenances.length === 0"
          class="text-center py-8 text-muted-foreground"
        >
          Aucun entretien à effectuer pour le moment.
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="maintenance in dueMaintenances"
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
import { onMounted, ref } from 'vue'
import { useMaintenanceStore } from '../stores/maintenance'
import type { Maintenance } from '../services/maintenance.service'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Settings2 } from 'lucide-vue-next'

const maintenanceStore = useMaintenanceStore()
const dueMaintenances = ref<Maintenance[]>([])

function calculateNextMaintenanceDate(maintenance: Maintenance): Date {
  const lastDate = new Date(maintenance.lastMaintenanceDate)
  const monthsToAdd = maintenance.bike.maintenanceInterval.monthInterval
  return new Date(lastDate.setMonth(lastDate.getMonth() + monthsToAdd))
}

onMounted(async () => {
  dueMaintenances.value = await maintenanceStore.getDueMaintenances()
})
</script> 