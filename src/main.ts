import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {useBsiteStore} from './stores/bsiteStore';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
const bsiteStore = useBsiteStore()
bsiteStore.getSiteData().then(()=>{
  app.mount('#app')
})


