<template>
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" class="text-primary hidden">
        Mettre à jour le kilométrage
        <Gauge class="ml-2 h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-primary">Mise à jour du kilométrage</DialogTitle>
        <DialogDescription class="text-foreground">
          Renseignez le kilométrage actuel de votre véhicule
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="kilometers" class="text-foreground">Kilométrage actuel</Label>
          <Input
            id="kilometers"
            type="number"
            v-model="kilometers"
            :min="maintenance.lastMaintenanceKilometers"
            class="text-foreground"
            required
          />
          <p class="text-sm text-foreground">
            Dernier kilométrage enregistré : {{ maintenance.lastMaintenanceKilometers }} km
          </p>
        </div>
        <DialogFooter>
          <Button type="submit" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Mettre à jour
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Gauge, Loader2 } from 'lucide-vue-next'
import type { Maintenance } from '@/services/maintenance.service'
import { maintenanceService } from '@/services/maintenance.service'
import { useToast } from '@/components/ui/toast/use-toast'

const props = defineProps<{
  maintenance: Maintenance
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

const { toast } = useToast()
const kilometers = ref(props.maintenance.currentKilometers)
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    await maintenanceService.updateMaintenanceKilometers({
      maintenanceId: props.maintenance.id,
      newKilometers: kilometers.value
    })
    toast({
      title: 'Kilométrage mis à jour',
      description: 'Le kilométrage de votre véhicule a été mis à jour avec succès.',
    })
    emit('updated')
  } catch (error) {
    toast({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la mise à jour du kilométrage.',
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
