import { createRouter, createWebHistory } from 'vue-router'
import {fridayRoutes} from './friday';
import {bsiteRoutes} from './bsite';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...fridayRoutes,
    ...bsiteRoutes
  ]
})

export default router
