<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
      <Dialog v-if="availableRolesForCreation.length > 0" v-model:open="isOpen">
        <DialogTrigger asChild>
          <Button variant="default" size="default">
            <UserPlus class="mr-2 h-4 w-4" />
            Créer un compte
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle class="text-foreground">Créer un compte</DialogTitle>
            <DialogDescription class="text-foreground">
              Créez un nouveau compte utilisateur avec un rôle spécifique.
            </DialogDescription>
          </DialogHeader>
          <form @submit.prevent="handleCreateUser" class="space-y-4">
            <div class="space-y-2">
              <Label for="name" class="text-foreground">Nom</Label>
              <Input id="name" v-model="newUser.name" required class="text-foreground" />
            </div>
            <div class="space-y-2">
              <Label for="email" class="text-foreground">Email</Label>
              <Input id="email" type="email" v-model="newUser.email" required class="text-foreground" />
            </div>
            <div class="space-y-2">
              <Label for="password" class="text-foreground">Mot de passe</Label>
              <Input id="password" type="password" v-model="newUser.password" required class="text-foreground" />
            </div>
            <div class="space-y-2">
              <Label for="role" class="text-foreground">Rôle</Label>
              <Select v-model="newUser.role" required>
                <SelectTrigger class="text-foreground">
                  <SelectValue placeholder="Sélectionnez un rôle" class="text-foreground" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="role in availableRolesForCreation" :key="role" :value="role" class="text-foreground">
                    {{ formatRole(role) }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" :disabled="creatingUser">
                <Loader2 v-if="creatingUser" class="mr-2 h-4 w-4 animate-spin" />
                Créer le compte
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
import { Loader2, UserPlus } from 'lucide-vue-next'
import { Button } from '../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { showSuccess, showError } from '../components/ui/toast'
import { UserRole } from '../types/auth'
import axios from '../services/axios'
import { useAuthStore } from '../stores/auth'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface NewUser {
  name: string
  email: string
  password: string
  role: UserRole
}

const users = ref<User[]>([])
const loading = ref(true)
const creatingUser = ref(false)
const authStore = useAuthStore()
const isOpen = ref(false)

const newUser = ref<NewUser>({
  name: '',
  email: '',
  password: '',
  role: UserRole.DRIVER
})

const availableRoles = computed(() => {
  if (authStore.user?.role === UserRole.ADMIN) {
    return Object.values(UserRole)
  }
  return Object.values(UserRole).filter(role => role !== UserRole.ADMIN)
})

const availableRolesForCreation = computed(() => {
  if (authStore.user?.role === UserRole.ADMIN) {
    return Object.values(UserRole)
  }
  if (authStore.user?.role !== UserRole.ADMIN) {
    return [UserRole.TECHNICIAN, UserRole.DRIVER, UserRole.CLIENT_PARTNER, UserRole.FLEET_MANAGER]
  }
  return []
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

const handleCreateUser = async () => {
  if (creatingUser.value) return

  creatingUser.value = true
  try {
    await axios.post('/auth/signup', newUser.value)
    showSuccess('Compte créé avec succès')
    await loadUsers()
    newUser.value = {
      name: '',
      email: '',
      password: '',
      role: UserRole.DRIVER
    }
    isOpen.value = false
  } catch (error) {
    showError('Erreur lors de la création du compte')
  } finally {
    creatingUser.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>
