import { createApp, inject } from 'vue';
import { createPinia } from 'pinia';
import VueCookies from 'vue-cookies';
// import { useBsiteStore } from './stores/bsiteStore';
import App from './App.vue';
import router from './router';
import './index.scss';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(VueCookies);
// const bsiteStore = useBsiteStore();
// bsiteStore.getSiteData().then(() => {
//   app.mount('#app');
// });
app.mount('#app');
