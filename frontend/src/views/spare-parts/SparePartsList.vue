<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock total</CardTitle>
          <CardDescription>Nombre total de pièces en stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-primary">
            {{ totalStock }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock faible</CardTitle>
          <CardDescription>Pièces en dessous du stock minimum</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-destructive">
            {{ lowStockCount }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valeur du stock</CardTitle>
          <CardDescription>Valeur totale des pièces en stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-primary">{{ totalValue.toFixed(2) }}€</div>
        </CardContent>
      </Card>
    </div>

    <!-- Low Stock Alerts -->
    <div v-if="lowStockParts.length > 0" class="mb-6">
      <Alert variant="destructive">
        <Bell class="h-4 w-4" />
        <AlertTitle>Alerte Stock Bas</AlertTitle>
        <AlertDescription>
          {{ lowStockParts.length }} pièces nécessitent votre attention
        </AlertDescription>
      </Alert>

      <div class="mt-4 space-y-4">
        <Card v-for="part in lowStockParts" :key="part.id" class="bg-muted/50">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>{{ part.name }}</CardTitle>
                <CardDescription>
                  Stock actuel: {{ part.quantity }} / Minimum requis: {{ part.minQuantity }}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                @click="router.push(`/dashboard/spare-parts/${part.id}/edit`)"
              >
                Réapprovisionner
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>

    <!-- Main Content -->
    <Card>
      <CardHeader className="space-y-1">
        <div class="flex items-center justify-between space-x-2">
          <CardTitle>Inventaire des pièces</CardTitle>
          <Button @click="router.push('/dashboard/spare-parts/new')">
            <Plus class="mr-2 h-4 w-4" />
            Nouvelle pièce
          </Button>
        </div>
        <CardDescription>Gérez votre inventaire de pièces détachées</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <!-- Filters -->
          <div class="flex gap-4">
            <div class="max-w-sm flex-1">
              <Input v-model="search" placeholder="Rechercher une pièce..." />
            </div>
            <div class="w-[180px]">
              <select
                v-model="categoryFilter"
                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Toutes les catégories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>

          <!-- Table -->
          <div class="rounded-md border">
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom text-sm">
                <thead class="[&_tr]:border-b">
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Nom
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Catégorie
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Stock
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Emplacement
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Prix
                    </th>
                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0">
                  <tr
                    v-for="part in filteredParts"
                    :key="part.id"
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    :class="{ 'bg-destructive/10': part.quantity < part.minQuantity }"
                  >
                    <td class="p-4 align-middle">{{ part.name }}</td>
                    <td class="p-4 align-middle">{{ part.category }}</td>
                    <td class="p-4 align-middle">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        :class="{
                          'bg-destructive/10 text-destructive': part.quantity < part.minQuantity,
                          'bg-secondary text-secondary-foreground':
                            part.quantity >= part.minQuantity,
                        }"
                      >
                        {{ part.quantity }}
                      </span>
                    </td>
                    <td class="p-4 align-middle">{{ part.location }}</td>
                    <td class="p-4 align-middle">{{ part.price }}€</td>
                    <td class="p-4 align-middle text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        @click="router.push('/dashboard/spare-parts/' + part.id)"
                      >
                        <Pencil class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" @click="deletePart(part.id)">
                        <Trash class="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash, Bell } from 'lucide-vue-next'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

interface SparePart {
  id: string
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

const router = useRouter()
const parts = ref<SparePart[]>([])
const search = ref('')
const categoryFilter = ref('')
const categories = ref<string[]>([])
const lowStockParts = ref<SparePart[]>([])

// Computed statistics
const totalStock = computed(() => {
  return parts.value.reduce((sum, part) => sum + part.quantity, 0)
})

const lowStockCount = ref(0)

const totalValue = computed(() => {
  return parts.value.reduce((sum, part) => sum + part.quantity * part.price, 0)
})

const filteredParts = computed(() => {
  return parts.value.filter((part) => {
    const matchesSearch = part.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || part.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

const fetchParts = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/spare-parts')
    parts.value = response.data
    categories.value = Array.from(new Set(response.data.map((part: SparePart) => part.category)))
  } catch (error) {
    console.error('Error fetching spare parts:', error)
  }
}

const fetchLowStockAlerts = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/spare-parts/low-stock')
    lowStockParts.value = response.data
    lowStockCount.value = lowStockParts.value.length
  } catch (error) {
    console.error('Error fetching low stock alerts:', error)
  }
}

const deletePart = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) return

  try {
    await axios.delete(`http://localhost:3001/api/spare-parts/${id}`)
    await fetchParts()
  } catch (error) {
    console.error('Error deleting spare part:', error)
  }
}

onMounted(() => {
  fetchParts()
  fetchLowStockAlerts()
})
</script>

<style scoped>
.low-stock {
  @apply text-destructive font-medium;
}
</style>
