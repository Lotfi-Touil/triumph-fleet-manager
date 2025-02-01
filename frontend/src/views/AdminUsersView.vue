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
                    <SelectItem v-for="role in roles" :key="role" :value="role">
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
import { ref, onMounted } from 'vue'
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

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

const users = ref<User[]>([])
const loading = ref(true)

const roles = Object.values(UserRole)

const formatRole = (role: string) => {
  const formattedRole = role.toLowerCase().replace(/_/g, ' ')
  return formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1)
}

const loadUsers = async () => {
  try {
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
  } catch (error) {
    showError('Erreur lors de la mise à jour du rôle')
  }
}

onMounted(() => {
  loadUsers()
})
</script>
