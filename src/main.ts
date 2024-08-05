import { createApp, inject } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'
import {useBsiteStore} from './stores/bsiteStore';
import tools from '@/util/tools';
import App from './App.vue'
import router from './router'
import './index.css'
import vueCarousel from 'vue-carousel';

const app = createApp(App)
app.provide('tools',tools)
app.use(createPinia())
app.use(router)
app.use(VueCookies);
app.use(vueCarousel);
const bsiteStore = useBsiteStore()
bsiteStore.getSiteData().then(()=>{
  app.mount('#app')
})


