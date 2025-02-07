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
}

const formData = ref<FormData>({
  email: '',
  password: ''
})

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const handleSubmit = async () => {
  if (loading.value) return

  loading.value = true
  errorMessage.value = null

  try {
    const result = await authStore.login({
      email: formData.value.email,
      password: formData.value.password,
    })

    if (result.success) {
      router.push('/dashboard')
    } else {
      errorMessage.value = result.message || 'Une erreur est survenue'
    }
  } catch {
    errorMessage.value = 'Une erreur est survenue lors de la connexion'
  } finally {
    loading.value = false
  }
}

const goToSignup = () => {
  router.push('/signup')
}
</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Connexion</CardTitle>
      <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-4">
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
            placeholder="••••••••"
            required
          />
        </div>
        <p v-if="errorMessage" class="text-sm text-destructive mt-2">
          {{ errorMessage }}
        </p>
        <Button
          type="submit"
          class="w-full"
          :disabled="loading"
        >
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </Button>
      </form>
    </CardContent>
    <CardFooter class="flex flex-col gap-4">
      <p class="text-sm text-center text-muted-foreground">
        Vous n'avez pas de compte ?
        <button
          @click="goToSignup"
          type="button"
          class="text-primary hover:underline cursor-pointer ml-1"
        >
          S'inscrire
        </button>
      </p>
    </CardFooter>
  </Card>
</template>
