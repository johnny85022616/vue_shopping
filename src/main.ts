import { createApp, inject } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'
import {useBsiteStore} from './stores/bsiteStore';
import api from './apis/api';
import tools from '@/util/tools';
import App from './App.vue'
import router from './router'
import './index.css'

const app = createApp(App)
app.provide('tools',tools)
app.use(createPinia())
app.use(router)
app.use(VueCookies);
const bsiteStore = useBsiteStore()
bsiteStore.getSiteData().then(()=>{
  app.mount('#app')
})


