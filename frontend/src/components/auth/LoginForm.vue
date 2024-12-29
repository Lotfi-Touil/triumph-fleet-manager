<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/components/ui/toast/use-toast'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()
const { toast } = useToast()
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    const result = await authStore.login(
      {
        email: email.value,
        password: password.value,
      },
      router,
    )

    if (!result.success) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription> Enter your credentials to access your account </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium">Email</label>
          <Input id="email" v-model="email" type="email" placeholder="name@example.com" required />
        </div>
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">Password</label>
          <Input id="password" v-model="password" type="password" required />
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex flex-col gap-4">
      <Button @click="handleSubmit" class="w-full" :disabled="loading">Sign In</Button>
      <p class="text-sm text-center text-muted-foreground">
        Don't have an account?
        <a @click="router.push('/signup')" class="text-primary hover:underline cursor-pointer">
          Sign up
        </a>
      </p>
    </CardFooter>
  </Card>
</template>
