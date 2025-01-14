import { createRouter, createWebHistory } from 'vue-router';
import { fridayRoutes } from './friday';
import { bsiteRoutes } from './bsite';
import { useBsiteStore } from '@/stores/bsiteStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...fridayRoutes, ...bsiteRoutes],
});

router.beforeEach(async (to, from, next) => {
  try {
    const bsiteStore = useBsiteStore();
    //若之前取過不需要再取一次
    if (window.fridayData || bsiteStore.siteData) {
      next();
      return;
    }

    await bsiteStore.getSiteData();
    if (window.fridayData || bsiteStore.siteData) {
      next();
    }
  } catch (e) {
    alert('取得供應商發生錯誤');
  }
});
export default router;
