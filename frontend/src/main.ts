import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vIntersectionObserver } from './directives/intersectionObserver'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.directive('intersection-observer', vIntersectionObserver)
app.use(createPinia())
app.use(router)

app.mount('#app')
