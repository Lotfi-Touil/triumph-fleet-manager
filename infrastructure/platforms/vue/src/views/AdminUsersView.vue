<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else>
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user.id">
              <TableCell class="text-foreground">{{ user.name }}</TableCell>
              <TableCell class="text-foreground">{{ user.email }}</TableCell>
              <TableCell class="text-foreground">
                <Select
                  v-model="user.role"
                  @update:modelValue="(value) => handleRoleChange(user.id, value as UserRole)"
                >
                  <SelectTrigger>
                    <SelectValue :placeholder="user.role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="role in availableRoles" :key="role" :value="role">
                      {{ formatRole(role) }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="default"
                  size="sm"
                  class="text-primary-foreground"
                  @click="handleRoleChange(user.id, user.role)"
                >
                  Enregistrer
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { showSuccess, showError } from '@/components/ui/toast'
import { UserRole } from '@/types/auth'
import axios from '@/services/axios'
import { useAuthStore } from '@/stores/auth'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

const users = ref<User[]>([])
const loading = ref(true)
const authStore = useAuthStore()

const availableRoles = computed(() => {
  if (authStore.user?.role === UserRole.ADMIN) {
    return Object.values(UserRole)
  }
  return Object.values(UserRole).filter(role => role !== UserRole.ADMIN)
})

const translateRole = (role: string): string => {
  const translations: Record<string, string> = {
    'admin': 'Administrateur',
    'fleet_manager': 'Gestionnaire de flotte',
    'client_partner': 'Partenaire client',
    'technician': 'Technicien',
    'driver': 'Conducteur'
  }
  return translations[role] || role
}

const formatRole = (role: string) => {
  return translateRole(role)
}

const loadUsers = async () => {
  try {
    loading.value = true
    const { data } = await axios.get<User[]>('/admin/users')
    users.value = data
  } catch (error) {
    showError('Erreur lors du chargement des utilisateurs')
  } finally {
    loading.value = false
  }
}

const handleRoleChange = async (userId: string, newRole: UserRole) => {
  try {
    await axios.post(`/admin/users/${userId}/role`, { role: newRole })
    showSuccess('Rôle mis à jour avec succès')
    await loadUsers()
  } catch (error) {
    showError('Erreur lors de la mise à jour du rôle')
  }
}

onMounted(() => {
  loadUsers()
})
</script>
