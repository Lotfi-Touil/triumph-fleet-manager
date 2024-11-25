<template>
  <div class="min-h-screen bg-background">

    <header class="border-b">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Mon App</h1>
          <Button variant="outline">Menu</Button>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <Card class="w-full">
        <CardHeader>
          <CardTitle>Bienvenue</CardTitle>
          <CardDescription>
            Ceci est la page d'accueil de votre application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground">
            Votre contenu ici...
          </p>
        </CardContent>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
</script>

<style>
@import '@/assets/base.css';
</style>
