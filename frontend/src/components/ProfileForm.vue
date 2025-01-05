<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-6">
      <!-- Informations de base -->
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <Label for="name">Nom</Label>
                <Input id="name" v-model="form.name" type="text" placeholder="Votre nom" />
              </div>

              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input id="email" v-model="form.email" type="email" placeholder="votre@email.com" />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Changement de mot de passe -->
      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>Mettez à jour votre mot de passe</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <Label for="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  v-model="form.currentPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div class="space-y-2">
                <Label for="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  v-model="form.newPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Bouton de soumission -->
      <div class="flex justify-end">
        <Button type="submit" :disabled="loading" @click="handleSubmit">
          <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          {{ loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { profileService, type UpdateProfileDTO } from '@/services/profile.service'
import { showSuccess, showError } from '@/components/ui/toast'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-vue-next'

const authStore = useAuthStore()
const loading = ref(false)

const form = ref<UpdateProfileDTO>({
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
})

const loadProfile = async () => {
  try {
    // Utiliser d'abord les informations du store d'authentification
    if (authStore.user) {
      form.value.name = authStore.user.name
      form.value.email = authStore.user.email
    }

    // Puis charger les informations complètes depuis l'API
    const profile = await profileService.getProfile()
    form.value.name = profile.name
    form.value.email = profile.email
  } catch (error) {
    showError('Erreur lors du chargement du profil')
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const updateData: UpdateProfileDTO = {}
    if (form.value.name) updateData.name = form.value.name
    if (form.value.email) updateData.email = form.value.email
    if (form.value.currentPassword && form.value.newPassword) {
      updateData.currentPassword = form.value.currentPassword
      updateData.newPassword = form.value.newPassword
    }

    const updatedProfile = await profileService.updateProfile(updateData)
    // Mettre à jour le store d'authentification avec les nouvelles informations
    if (authStore.user) {
      authStore.user.name = updatedProfile.name
      authStore.user.email = updatedProfile.email
    }

    showSuccess('Profil mis à jour avec succès')
    form.value.currentPassword = ''
    form.value.newPassword = ''
  } catch (error) {
    showError('Erreur lors de la mise à jour du profil')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>
