<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Commandes en cours</CardTitle>
          <CardDescription>Nombre de commandes en attente</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-primary">
            {{ pendingOrders.length }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commandes en retard</CardTitle>
          <CardDescription>Commandes dépassant la date de livraison prévue</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-destructive">
            {{ lateOrders.length }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coût total</CardTitle>
          <CardDescription>Valeur totale des commandes en cours</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-primary">{{ totalOrderValue.toFixed(2) }}€</div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content -->
    <Card>
      <CardHeader className="space-y-1">
        <div class="flex items-center justify-between space-x-2">
          <CardTitle>Historique des commandes</CardTitle>
          <Button @click="openNewOrderDialog">
            <Plus class="mr-2 h-4 w-4" />
            Nouvelle commande
          </Button>
        </div>
        <CardDescription>Gérez vos commandes de pièces détachées</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <!-- Filters -->
          <div class="flex gap-4">
            <div class="max-w-sm flex-1">
              <Input v-model="search" placeholder="Rechercher une commande..." />
            </div>
            <div class="w-[180px]">
              <select
                v-model="statusFilter"
                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Tous les statuts</option>
                <option v-for="status in orderStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
          </div>

          <!-- Table -->
          <div class="rounded-md border">
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom text-sm">
                <thead class="[&_tr]:border-b">
                  <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Pièce
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Quantité
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Prix unitaire
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Total
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Statut
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Date de commande
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Livraison prévue
                    </th>
                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0">
                  <tr
                    v-for="order in filteredOrders"
                    :key="order.id"
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    :class="{ 'bg-destructive/10': order.isLate }"
                  >
                    <td class="p-4 align-middle">{{ order.sparePart.name }}</td>
                    <td class="p-4 align-middle">{{ order.quantity }}</td>
                    <td class="p-4 align-middle">{{ order.unitPrice }}€</td>
                    <td class="p-4 align-middle">{{ (order.quantity * order.unitPrice).toFixed(2) }}€</td>
                    <td class="p-4 align-middle">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        :class="{
                          'bg-warning/10 text-warning': order.status === 'PENDING',
                          'bg-info/10 text-info': order.status === 'ORDERED',
                          'bg-success/10 text-success': order.status === 'DELIVERED',
                          'bg-destructive/10 text-destructive': order.status === 'CANCELLED'
                        }"
                      >
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="p-4 align-middle">{{ formatDate(order.orderDate) }}</td>
                    <td class="p-4 align-middle">
                      {{ order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : '-' }}
                    </td>
                    <td class="p-4 align-middle text-right">
                      <Button variant="ghost" size="icon" @click="editOrder(order)">
                        <Pencil class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" @click="deleteOrder(order.id)">
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

    <!-- New/Edit Order Dialog -->
    <Dialog v-model:open="showNewOrderDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle
          class="text-2xl font-bold text-primary"
          >{{ editingOrder ? 'Modifier la commande' : 'Nouvelle commande' }}</DialogTitle>
          <DialogDescription>
            {{ editingOrder ? 'Modifiez les détails de la commande' : 'Créez une nouvelle commande de pièces' }}
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 py-4">
            <div v-if="!editingOrder" class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useExistingPart"
                v-model="useExistingPart"
                class="h-4 w-4 rounded border-input"
              />
              <Label for="useExistingPart" class="text-muted-foreground">Sélectionner une pièce existante</Label>
            </div>

            <div v-if="useExistingPart" class="grid gap-2">
              <Label for="sparePart" class="text-muted-foreground">Pièce existante</Label>
              <select
                id="sparePart"
                v-model="orderForm.sparePartId"
                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                @change="updateSparePartInfo"
              >
                <option value="">Sélectionnez une pièce</option>
                <option v-for="part in spareParts" :key="part.id" :value="part.id">
                  {{ part.name }} - Stock: {{ part.quantity }} - Prix: {{ part.price }}€
                </option>
              </select>
            </div>

            <div v-if="!useExistingPart" class="grid gap-4">
              <div class="grid gap-2">
                <Label for="partName" class="text-muted-foreground">Nom de la pièce</Label>
                <Input
                  id="partName"
                  v-model="orderForm.partName"
                  required
                  class="text-muted-foreground"
                  placeholder="Nom de la nouvelle pièce"
                />
              </div>

              <div class="grid gap-2">
                <Label for="category" class="text-muted-foreground">Catégorie</Label>
                <Input
                  id="category"
                  v-model="orderForm.category"
                  required
                  class="text-muted-foreground"
                  placeholder="Catégorie de la pièce"
                />
              </div>

              <div class="grid gap-2">
                <Label for="location" class="text-muted-foreground">Emplacement</Label>
                <Input
                  id="location"
                  v-model="orderForm.location"
                  required
                  class="text-muted-foreground"
                  placeholder="Emplacement de stockage"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="minQuantity" class="text-muted-foreground">Stock minimum</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    v-model.number="orderForm.minQuantity"
                    required
                    min="0"
                    class="text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            <div v-if="selectedPart" class="rounded-lg border p-4 bg-muted/50">
              <div class="text-sm space-y-2">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Catégorie:</span>
                  <span class="font-medium text-muted-foreground">{{ selectedPart.category }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Stock actuel:</span>
                  <span class="font-medium text-muted-foreground" :class="{ 'text-destructive': selectedPart.quantity < selectedPart.minQuantity }">
                    {{ selectedPart.quantity }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Stock minimum:</span>
                  <span class="font-medium text-muted-foreground">{{ selectedPart.minQuantity }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Emplacement:</span>
                  <span class="font-medium text-muted-foreground">{{ selectedPart.location }}</span>
                </div>
              </div>
            </div>

            <div class="grid gap-2">
              <Label for="quantity" class="text-muted-foreground">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                v-model.number="orderForm.quantity"
                required
                min="1"
                class="text-muted-foreground"
              />
            </div>

            <div class="grid gap-2">
              <Label for="unitPrice" class="text-muted-foreground">Prix unitaire (€)</Label>
              <Input
                id="unitPrice"
                type="number"
                v-model.number="orderForm.unitPrice"
                required
                min="0"
                step="0.01"
                :disabled="useExistingPart"
                class="text-muted-foreground"
              />
            </div>

            <div class="grid gap-2">
              <Label for="totalPrice" class="text-muted-foreground">Prix total (€)</Label>
              <div class="text-lg font-semibold text-primary">
                {{ (orderForm.quantity * orderForm.unitPrice).toFixed(2) }}€
              </div>
            </div>

            <div class="grid gap-2">
              <Label for="supplier" class="text-muted-foreground">Fournisseur</Label>
              <Input id="supplier" v-model="orderForm.supplier" required class="text-muted-foreground" />
            </div>

            <div v-if="editingOrder" class="grid gap-2">
              <Label for="status" class="text-muted-foreground">Statut</Label>
              <select
                id="status"
                v-model="orderForm.status"
                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option v-for="status in orderStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>

            <div class="grid gap-2">
              <Label for="expectedDeliveryDate" class="text-muted-foreground">Date de livraison prévue</Label>
              <Input
                id="expectedDeliveryDate"
                type="date"
                v-model="orderForm.expectedDeliveryDate"
                class="text-muted-foreground"
              />
            </div>

            <div class="grid gap-2">
              <Label for="orderReference" class="text-muted-foreground">Référence commande</Label>
              <Input id="orderReference" v-model="orderForm.orderReference" class="text-muted-foreground" />
            </div>

            <div class="grid gap-2">
              <Label for="notes" class="text-muted-foreground">Notes</Label>
              <textarea
                id="notes"
                v-model="orderForm.notes"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" :disabled="useExistingPart && !orderForm.sparePartId">
              {{ editingOrder ? 'Mettre à jour' : 'Créer' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash } from 'lucide-vue-next'
import { OrderStatus, type SparePart, type SparePartOrder } from '@/types/SparePartOrder'

const orders = ref<SparePartOrder[]>([])
const spareParts = ref<SparePart[]>([])
const search = ref('')
const statusFilter = ref('')
const showNewOrderDialog = ref(false)
const editingOrder = ref<SparePartOrder | null>(null)

const useExistingPart = ref(true)

const orderForm = ref({
  sparePartId: '',
  partName: '',
  category: '',
  location: '',
  minQuantity: 0,
  quantity: 1,
  unitPrice: 0,
  supplier: '',
  expectedDeliveryDate: '',
  orderReference: '',
  notes: '',
  status: OrderStatus.PENDING,
  orderDate: new Date().toISOString().split('T')[0]
})

const orderStatuses = Object.values(OrderStatus)

const pendingOrders = computed(() =>
  orders.value.filter(order =>
    order.status === OrderStatus.PENDING || order.status === OrderStatus.ORDERED
  )
)

const lateOrders = computed(() =>
  orders.value.filter(order =>
    order.status === OrderStatus.ORDERED &&
    order.expectedDeliveryDate &&
    new Date() > new Date(order.expectedDeliveryDate)
  )
)

const totalOrderValue = computed(() =>
  pendingOrders.value.reduce((sum, order) => sum + (order.quantity * order.unitPrice), 0)
)

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch =
      order.sparePart.name.toLowerCase().includes(search.value.toLowerCase()) ||
      order.supplier.toLowerCase().includes(search.value.toLowerCase()) ||
      (order.orderReference?.toLowerCase().includes(search.value.toLowerCase()) ?? false)
    const matchesStatus = !statusFilter.value || order.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const fetchOrders = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/spare-part-orders')
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

const fetchSpareParts = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/spare-parts')
    spareParts.value = response.data
  } catch (error) {
    console.error('Error fetching spare parts:', error)
  }
}

const editOrder = (order: SparePartOrder) => {
  editingOrder.value = order
  orderForm.value = {
    sparePartId: order.sparePart.id,
    partName: order.sparePart.name,
    category: order.sparePart.category,
    location: order.sparePart.location,
    minQuantity: order.sparePart.minQuantity,
    quantity: order.quantity,
    unitPrice: order.unitPrice,
    supplier: order.supplier,
    expectedDeliveryDate: order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().split('T')[0] : '',
    orderReference: order.orderReference || '',
    notes: order.notes || '',
    status: order.status,
    orderDate: new Date(order.orderDate).toISOString().split('T')[0]
  }
  showNewOrderDialog.value = true
}

const deleteOrder = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return

  try {
    await axios.delete(`http://localhost:3001/api/spare-part-orders/${id}`)
    await fetchOrders()
  } catch (error) {
    console.error('Error deleting order:', error)
  }
}

const handleSubmit = async () => {
  try {
    let sparePartId = orderForm.value.sparePartId

    // Si c'est une nouvelle pièce (pas de sparePartId), on la crée d'abord
    if (!useExistingPart.value && !editingOrder.value) {
      const newPart = await axios.post('http://localhost:3001/api/spare-parts', {
        name: orderForm.value.partName,
        category: orderForm.value.category,
        location: orderForm.value.location,
        quantity: 0,
        minQuantity: orderForm.value.minQuantity,
        price: orderForm.value.unitPrice
      })
      sparePartId = newPart.data.id
    }

    const orderData = {
      ...orderForm.value,
      sparePartId: sparePartId,
      status: editingOrder.value ? orderForm.value.status : OrderStatus.PENDING,
      orderDate: editingOrder.value ? new Date(editingOrder.value.orderDate) : new Date()
    }

    if (editingOrder.value) {
      const previousStatus = editingOrder.value.status
      await axios.put(`http://localhost:3001/api/spare-part-orders/${editingOrder.value.id}`, {
        ...orderData,
        orderDate: editingOrder.value.orderDate // Garder la date originale
      })

      if (orderData.status === OrderStatus.ORDERED && previousStatus !== OrderStatus.ORDERED && !editingOrder.value.sparePart.id) {
        await axios.post('http://localhost:3001/api/spare-parts', {
          name: orderForm.value.partName,
          category: orderForm.value.category,
          location: orderForm.value.location,
          quantity: 0,
          minQuantity: orderForm.value.minQuantity,
          price: orderForm.value.unitPrice
        })
      }

      if (orderData.status === OrderStatus.DELIVERED && previousStatus !== OrderStatus.DELIVERED) {
        const sparePartId = editingOrder.value.sparePart.id || (await getSparePartByName(orderForm.value.partName))?.id
        if (sparePartId) {
          const currentPart = await axios.get(`http://localhost:3001/api/spare-parts/${sparePartId}`)
          await axios.put(`http://localhost:3001/api/spare-parts/${sparePartId}`, {
            ...currentPart.data,
            quantity: currentPart.data.quantity + orderForm.value.quantity
          })
        }
      }
    } else {
      await axios.post('http://localhost:3001/api/spare-part-orders', orderData)
    }

    await fetchOrders()
    await fetchSpareParts()
    showNewOrderDialog.value = false
    editingOrder.value = null
    orderForm.value = {
      sparePartId: '',
      partName: '',
      category: '',
      location: '',
      minQuantity: 0,
      quantity: 1,
      unitPrice: 0,
      supplier: '',
      expectedDeliveryDate: '',
      orderReference: '',
      notes: '',
      status: OrderStatus.PENDING,
      orderDate: new Date().toISOString().split('T')[0]
    }
  } catch (error) {
    console.error('Error saving order:', error)
  }
}

const selectedPart = ref<SparePart | null>(null)

const updateSparePartInfo = () => {
  const part = spareParts.value.find(p => p.id === orderForm.value.sparePartId)
  if (part) {
    selectedPart.value = part
    orderForm.value.unitPrice = part.price
  } else {
    selectedPart.value = null
    orderForm.value.unitPrice = 0
  }
}

const getSparePartByName = async (name: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/spare-parts?name=${name}`)
    return response.data[0]
  } catch (error) {
    console.error('Error fetching spare part:', error)
    return null
  }
}

const openNewOrderDialog = () => {
  editingOrder.value = null
  orderForm.value = {
    sparePartId: '',
    partName: '',
    category: '',
    location: '',
    minQuantity: 0,
    quantity: 1,
    unitPrice: 0,
    supplier: '',
    expectedDeliveryDate: '',
    orderReference: '',
    notes: '',
    status: OrderStatus.PENDING,
    orderDate: new Date().toISOString().split('T')[0]
  }
  useExistingPart.value = true
  selectedPart.value = null
  showNewOrderDialog.value = true
}

onMounted(() => {
  fetchOrders()
  fetchSpareParts()
})
</script>
