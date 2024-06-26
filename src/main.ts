import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {useBsiteStore} from './stores/bsiteStore';
import tools from '@/util/tools';
import App from './App.vue'
import router from './router'
import './index.css'

const app = createApp(App)
app.provide('tools',tools)
app.use(createPinia())
app.use(router)
const bsiteStore = useBsiteStore()
bsiteStore.getSiteData().then(()=>{
  app.mount('#app')
})


