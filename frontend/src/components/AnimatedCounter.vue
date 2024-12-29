<script setup lang="ts">
import CountUp from 'vue-countup-v3'
import type { CountUpOptions } from 'vue-countup-v3'

defineProps<{
  endValue: number
  options?: CountUpOptions
}>()
</script>

<template>
  <CountUp :endVal="endValue" :options="options" />
</template>
