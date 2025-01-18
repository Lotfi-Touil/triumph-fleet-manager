<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

interface FormData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

const formData = ref<FormData>({
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
})

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const handleSubmit = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  errorMessage.value = null

  const result = await authStore.signup({
    email: formData.value.email,
    password: formData.value.password,
    name: formData.value.name,
  })

  if (result.success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = result.message || 'Une erreur est survenue'
  }
  loading.value = false
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Inscription</CardTitle>
      <CardDescription>Créez votre compte pour accéder à l'application</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Nom complet</label>
          <Input 
            id="name" 
            v-model="formData.name"
            type="text"
            required 
          />
        </div>
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium">Email</label>
          <Input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="nom@exemple.com"
            required
          />
        </div>
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">Mot de passe</label>
          <Input
            id="password"
            v-model="formData.password"
            type="password"
            required
          />
        </div>
        <div class="space-y-2">
          <label for="confirm-password" class="text-sm font-medium">Confirmer le mot de passe</label>
          <Input
            id="confirm-password"
            v-model="formData.confirmPassword"
            type="password"
            required
          />
        </div>
        <p v-if="errorMessage" class="text-sm text-destructive mt-2">
          {{ errorMessage }}
        </p>
      </form>
    </CardContent>
    <CardFooter class="flex flex-col gap-4">
      <Button
        @click="handleSubmit"
        class="w-full"
        :disabled="loading"
      >
        {{ loading ? 'Inscription en cours...' : 'S\'inscrire' }}
      </Button>
      <p class="text-sm text-center text-muted-foreground">
        Vous avez déjà un compte ?
        <button
          @click="goToLogin"
          type="button"
          class="text-primary hover:underline cursor-pointer ml-1"
        >
          Se connecter
        </button>
      </p>
    </CardFooter>
  </Card>
</template>
