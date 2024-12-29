<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  Shield,
  Gauge,
  Settings2,
  Users,
  Bike,
  ChevronRight,
  Star,
  Clock,
  Zap,
  BarChart,
} from 'lucide-vue-next'
import dashboardPreview from '@/assets/dashboard-preview.svg'
import { ref, onMounted } from 'vue'
import AnimatedCounter from '@/components/AnimatedCounter.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
})

const features = [
  {
    id: '01',
    title: 'Gestion Intelligente',
    description:
      "Optimisez la maintenance de votre flotte avec notre système de gestion prédictive basé sur l'IA. Anticipez les besoins et réduisez les temps d'arrêt.",
    icon: Settings2,
  },
  {
    id: '02',
    title: 'Suivi en Temps Réel',
    description:
      "Surveillez l'état de vos motos et gérez vos stocks de pièces en temps réel. Recevez des alertes instantanées et prenez des décisions éclairées.",
    icon: Gauge,
  },
  {
    id: '03',
    title: 'Analyses Avancées',
    description:
      'Accédez à des tableaux de bord détaillés et des rapports personnalisés sur les performances. Optimisez vos opérations grâce aux données.',
    icon: Shield,
  },
]

const benefits = [
  {
    title: '2000+',
    description: 'Motos gérées',
    icon: Bike,
  },
  {
    title: '150+',
    description: 'Clients satisfaits',
    icon: Users,
  },
  {
    title: '40%',
    description: "d'amélioration de l'efficacité",
    icon: ArrowRight,
  },
]

const testimonials = [
  {
    name: 'Jean Dupont',
    role: 'Directeur de Flotte',
    company: 'Moto Express',
    content:
      'Cette plateforme a révolutionné notre gestion de flotte. Nous avons réduit nos coûts de maintenance de 30%.',
  },
  {
    name: 'Marie Martin',
    role: 'Responsable Opérations',
    company: 'Triumph Paris',
    content:
      'Interface intuitive et fonctionnalités puissantes. Un vrai game-changer pour notre entreprise.',
  },
]

const advantages = [
  {
    title: 'Maintenance Prédictive',
    icon: Clock,
    description:
      'Anticipez les besoins de maintenance et réduisez jusqu’à 40% les temps d’arrêt imprévus grâce à notre IA.',
  },
  {
    title: 'Performance Optimisée',
    icon: Zap,
    description:
      "Maximisez l'efficacité de votre flotte avec des analyses en temps réel et des recommandations personnalisées.",
  },
  {
    title: 'Analyses en Temps Réel',
    icon: BarChart,
    description:
      'Accédez à des tableaux de bord détaillés et prenez des décisions éclairées basées sur des données précises.',
  },
]

const faqs = [
  {
    question: 'Comment commencer avec Triumph Fleet ?',
    answer:
      'Créez simplement un compte gratuit et suivez notre guide de démarrage rapide. Notre équipe vous accompagnera dans la configuration initiale.',
  },
  {
    question: 'Quelles fonctionnalités sont incluses ?',
    answer:
      'Notre plateforme inclut la gestion de maintenance prédictive, le suivi en temps réel, les analyses avancées et bien plus encore.',
  },
  {
    question: 'Comment fonctionne la tarification ?',
    answer:
      'Nous proposons différents forfaits adaptés à la taille de votre flotte. Contactez-nous pour obtenir un devis personnalisé.',
  },
]

const expandedFaqs = ref<number[]>([])

const toggleFaq = (index: number) => {
  const currentIndex = expandedFaqs.value.indexOf(index)
  if (currentIndex === -1) {
    expandedFaqs.value.push(index)
  } else {
    expandedFaqs.value.splice(currentIndex, 1)
  }
}

const handleLogout = () => {
  authStore.logout(router)
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation -->
    <nav
      class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="container flex h-16 items-center">
        <div class="mr-8 flex items-center space-x-2">
          <Bike class="h-6 w-6 text-primary" />
          <span class="font-bold text-foreground">Triumph Fleet</span>
        </div>
        <div class="flex flex-1 items-center justify-end space-x-4">
          <template v-if="!authStore.token">
            <Button
              variant="ghost"
              @click="router.push('/about')"
              class="text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              À propos
            </Button>
            <Button
              variant="ghost"
              @click="router.push('/login')"
              class="text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Se connecter
            </Button>
            <Button
              @click="router.push('/signup')"
              class="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Essai gratuit
            </Button>
          </template>
          <template v-else>
            <span class="text-muted-foreground">Bienvenue, {{ authStore.user?.name }}</span>
            <Button
              variant="outline"
              @click="handleLogout"
              class="text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Se déconnecter
            </Button>
          </template>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-b from-background to-accent/20">
      <div class="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
      <div
        class="container relative pt-20 pb-32"
        :class="{ 'opacity-0': !isVisible, 'animate-fade-in': isVisible }"
      >
        <div class="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8 items-center">
          <div class="max-w-2xl">
            <div class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm mb-4">
              <span class="font-medium text-primary">Nouveau</span>
              <div class="mx-2 h-4 w-px bg-primary/20" />
              <span class="text-primary/80">Gestion prédictive de flotte</span>
            </div>
            <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              Gérez votre flotte Triumph comme jamais auparavant
            </h1>
            <p class="text-xl text-muted-foreground mb-8">
              Optimisez vos opérations, réduisez vos coûts et maximisez la performance de votre
              flotte avec notre solution complète de gestion.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                class="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                @click="router.push('/signup')"
              >
                Commencer maintenant
                <ArrowRight class="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                class="w-full sm:w-auto border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Voir la démo
              </Button>
            </div>
          </div>
          <div class="relative lg:ml-auto animate-fade-in">
            <div class="relative">
              <div class="absolute -inset-4">
                <div
                  class="w-full h-full mx-auto opacity-30 blur-lg filter bg-gradient-to-r from-primary via-secondary to-primary"
                />
              </div>
              <div class="relative bg-card rounded-xl border shadow-2xl overflow-hidden group">
                <img
                  :src="dashboardPreview"
                  alt="Dashboard Preview"
                  class="rounded-lg transform transition-all duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="border-y bg-gradient-to-r from-accent via-background to-accent">
      <div class="container py-12">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div
            v-for="(stat, index) in benefits"
            :key="stat.title"
            v-intersection-observer="'animate-fade-up'"
            class="group p-6 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300"
            :style="{ animationDelay: `${index * 200}ms` }"
          >
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                <component :is="stat.icon" class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-foreground">
                  <AnimatedCounter
                    :end-value="parseInt(stat.title)"
                    :suffix="stat.title.includes('+') ? '+' : ''"
                  />
                </h3>
                <p class="text-muted-foreground">{{ stat.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-20 sm:py-32 bg-gradient-to-b from-background via-accent/5 to-background">
      <div class="container px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center mb-12 sm:mb-20">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Une suite complète d'outils pour votre flotte
          </h2>
          <p class="text-base sm:text-lg text-muted-foreground">
            Découvrez comment notre plateforme révolutionne la gestion de flotte Triumph avec des
            fonctionnalités innovantes
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="group relative overflow-hidden rounded-xl border bg-card hover:shadow-xl transition-all duration-300"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div class="relative p-6 sm:p-8">
              <div class="flex items-center gap-4 mb-6">
                <div
                  class="rounded-lg bg-primary/10 p-3 sm:p-4 group-hover:bg-primary/20 transition-colors"
                >
                  <component :is="feature.icon" class="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span class="text-sm font-medium text-muted-foreground">{{ feature.id }}</span>
              </div>

              <h3 class="text-xl sm:text-2xl font-semibold text-card-foreground mb-3">
                {{ feature.title }}
              </h3>
              <p class="text-base text-muted-foreground leading-relaxed">
                {{ feature.description }}
              </p>
            </div>

            <div
              class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-primary opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Avantages Section -->
    <div class="py-16 sm:py-24 bg-gradient-to-b from-background to-accent/10">
      <div class="container px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos Avantages
          </h2>
          <p class="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Découvrez comment notre solution peut transformer votre gestion de flotte
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          <div
            v-for="(advantage, index) in advantages"
            :key="advantage.title"
            class="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-300"
            :class="{ 'animate-fade-up': isVisible }"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div class="relative p-6 sm:p-8">
              <div class="flex items-start space-y-2">
                <div
                  class="rounded-lg bg-primary/10 p-3 sm:p-4 w-fit mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors"
                >
                  <component :is="advantage.icon" class="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
              </div>

              <div>
                <h3 class="text-lg sm:text-xl font-semibold text-card-foreground mb-2 sm:mb-3">
                  {{ advantage.title }}
                </h3>
                <p class="text-sm sm:text-base text-muted-foreground">
                  {{ advantage.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="py-24 bg-background border-y">
      <div class="container">
        <h2 class="text-3xl font-bold text-center mb-16 text-foreground animate-fade-up">
          Ce que nos clients disent
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="testimonial.name"
            class="p-8 rounded-xl border bg-card hover:bg-accent/5 transition-colors"
            :class="{ 'animate-slide-in-right': isVisible }"
            :style="{ animationDelay: `${index * 200}ms` }"
          >
            <div class="flex gap-2 mb-4">
              <Star class="h-5 w-5 text-primary" fill="currentColor" v-for="_ in 5" :key="_" />
            </div>
            <p class="text-muted-foreground mb-4">{{ testimonial.content }}</p>
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users class="h-6 w-6 text-primary" />
              </div>
              <div>
                <p class="font-semibold text-card-foreground">{{ testimonial.name }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ testimonial.role }} - {{ testimonial.company }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="py-24 bg-background border-y">
      <div class="container">
        <h2 class="text-3xl font-bold text-center mb-16 text-foreground animate-fade-up">
          Questions Fréquentes
        </h2>
        <div class="max-w-3xl mx-auto space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="p-6 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300 animate-fade-up"
            :style="{ animationDelay: `${index * 200}ms` }"
          >
            <div @click="toggleFaq(index)" class="flex justify-between items-center cursor-pointer">
              <h3 class="font-semibold text-card-foreground">
                {{ faq.question }}
              </h3>
              <ChevronRight
                class="h-5 w-5 text-primary transition-transform duration-200"
                :class="{ 'rotate-90': expandedFaqs.includes(index) }"
              />
            </div>
            <div v-if="expandedFaqs.includes(index)" class="mt-4 text-muted-foreground">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="border-t">
      <div class="container py-24">
        <div class="relative rounded-2xl bg-primary px-6 py-16 sm:py-24 sm:px-12">
          <div class="relative mx-auto max-w-2xl text-center">
            <h2
              class="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl animate-fade-up whitespace-nowrap"
            >
              Prêt à transformer votre gestion de flotte ?
            </h2>
            <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
              Rejoignez les entreprises qui font confiance à notre solution
            </p>
            <div class="mt-10 flex justify-center gap-x-6">
              <Button
                size="lg"
                variant="secondary"
                class="bg-background text-foreground hover:bg-background/90"
              >
                Commencer gratuitement
              </Button>
              <Button
                size="lg"
                variant="outline"
                class="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t bg-background">
      <div class="container py-12 md:py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo and Description -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <Bike class="h-6 w-6 text-primary" />
              <span class="font-bold text-foreground">Triumph Fleet</span>
            </div>
            <p class="text-sm text-muted-foreground">
              Solution innovante de gestion de flotte pour les motos Triumph. Optimisez vos
              opérations et maximisez votre efficacité.
            </p>
          </div>

          <!-- Resources -->
          <div>
            <h3 class="font-semibold mb-4 text-foreground">Ressources</h3>
            <ul class="space-y-3">
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Documentation</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Guide d'utilisation</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Blog</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Actualités</a
                >
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h3 class="font-semibold mb-4 text-foreground">Entreprise</h3>
            <ul class="space-y-3">
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >À propos</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Carrières</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Contact</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Partenaires</a
                >
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="font-semibold mb-4 text-foreground">Légal</h3>
            <ul class="space-y-3">
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Confidentialité</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Conditions d'utilisation</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >Mentions légales</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t mt-8 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-sm text-muted-foreground">
              © {{ new Date().getFullYear() }} Triumph Fleet. Tous droits réservés.
            </p>
            <div class="flex items-center space-x-4">
              <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
                <span class="sr-only">Twitter</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                  />
                </svg>
              </a>
              <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
                <span class="sr-only">LinkedIn</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
                <span class="sr-only">GitHub</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
