<script setup lang="ts">
  import CountUp from 'vue-countup-v3'
  import type { CountUpOptions } from 'vue-countup-v3'

  defineProps<{
    endValue: number
    suffix?: string
    options?: CountUpOptions
  }>()
</script>

<template>
  <div class="inline-flex items-center">
    <CountUp :endVal="endValue" :options="options" />
    <span v-if="suffix">{{ suffix }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AnimatedCounter'
}
</script>
