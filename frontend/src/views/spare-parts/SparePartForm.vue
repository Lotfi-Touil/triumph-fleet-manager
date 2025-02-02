<template>
  <div>
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between space-x-4">
          <div class="space-y-1">
            <CardTitle>{{ isEditing ? 'Modifier' : 'Ajouter' }} une pièce</CardTitle>
            <CardDescription>
              {{
                isEditing
                  ? 'Modifiez les informations de la pièce'
                  : "Ajoutez une nouvelle pièce à l'inventaire"
              }}
            </CardDescription>
          </div>
          <Button variant="outline" @click="router.push('/dashboard/spare-parts')">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </CardHeader>
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid gap-6">
            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="name"
              >
                Nom
              </label>
              <Input id="name" v-model="form.name" required placeholder="Nom de la pièce" />
            </div>

            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="category"
              >
                Catégorie
              </label>
              <Input id="category" v-model="form.category" required placeholder="Catégorie" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for="quantity"
                >
                  Stock actuel
                </label>
                <Input
                  id="quantity"
                  type="number"
                  v-model.number="form.quantity"
                  required
                  min="0"
                  placeholder="0"
                />
              </div>

              <div class="grid gap-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for="minQuantity"
                >
                  Stock minimum
                </label>
                <Input
                  id="minQuantity"
                  type="number"
                  v-model.number="form.minQuantity"
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="location"
              >
                Emplacement
              </label>
              <Input id="location" v-model="form.location" required placeholder="Emplacement" />
            </div>

            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="price"
              >
                Prix (€)
              </label>
              <Input
                id="price"
                type="number"
                v-model.number="form.price"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="supplier"
              >
                Fournisseur
              </label>
              <Input id="supplier" v-model="form.supplier" placeholder="Fournisseur (optionnel)" />
            </div>

            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="notes"
              >
                Notes
              </label>
              <textarea
                id="notes"
                v-model="form.notes"
                placeholder="Notes additionnelles (optionnel)"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <Button type="submit" class="flex-1">
              <Save class="mr-2 h-4 w-4" />
              {{ isEditing ? 'Mettre à jour' : 'Créer' }}
            </Button>
            <Button
              type="button"
              variant="destructive"
              @click="router.push('/dashboard/spare-parts')"
            >
              <X class="mr-2 h-4 w-4" />
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, X } from 'lucide-vue-next'

interface SparePart {
  id?: string
  name: string
  category: string
  quantity: number
  minQuantity: number
  location: string
  lastRestockDate: Date
  price: number
  supplier?: string
  notes?: string
}

const route = useRoute()
const router = useRouter()
const isEditing = computed(() => !!route.params.id)

const form = ref<SparePart>({
  name: '',
  category: '',
  quantity: 0,
  minQuantity: 0,
  location: '',
  lastRestockDate: new Date(),
  price: 0,
  supplier: '',
  notes: '',
})

onMounted(async () => {
  if (isEditing.value) {
    try {
      const response = await axios.get(`http://localhost:3001/api/spare-parts/${route.params.id}`)
      form.value = response.data
    } catch (error) {
      console.error('Error fetching spare part:', error)
      router.push('/dashboard/spare-parts')
    }
  }
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`http://localhost:3001/api/spare-parts/${route.params.id}`, form.value)
    } else {
      await axios.post('http://localhost:3001/api/spare-parts', form.value)
    }
    router.push('/dashboard/spare-parts')
  } catch (error) {
    console.error('Error saving spare part:', error)
  }
}
</script>
