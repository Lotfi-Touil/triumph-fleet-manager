<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'
import { BarChart, Users, Bike, Settings2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout(router)
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-primary">Dashboard</h1>
      <div class="flex items-center gap-4">
        <span class="text-muted-foreground">Welcome, {{ authStore.user?.name }}</span>
        <Button variant="outline" @click="handleLogout">Logout</Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Vehicles</CardTitle>
          <Bike class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">12</div>
          <p class="text-xs text-muted-foreground">Active in fleet</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Users</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">24</div>
          <p class="text-xs text-muted-foreground">+10% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Maintenance Due</CardTitle>
          <Settings2 class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">3</div>
          <p class="text-xs text-muted-foreground">Vehicles need attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Usage Analytics</CardTitle>
          <BarChart class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">85%</div>
          <p class="text-xs text-muted-foreground">Fleet utilization rate</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium">Vehicle #123 maintenance completed</p>
                <p class="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium">New user assigned to Vehicle #456</p>
                <p class="text-sm text-muted-foreground">5 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium">Vehicle #789 - Oil Change</p>
                <p class="text-sm text-muted-foreground">Due in 3 days</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium">Vehicle #234 - Annual Inspection</p>
                <p class="text-sm text-muted-foreground">Due in 1 week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
