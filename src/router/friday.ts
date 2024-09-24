import HomePage from '../views/Homepage.vue';
import MemberCenter from '../views/MemberCenter.vue';
import aiAllCategory from '../views/aiAllCategory.vue';

export const fridayRoutes =  [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/memberCenter',
    name: 'memberCenter',
    component: MemberCenter
  },
  {
    path: '/category/:catg([LMB]{1}\\d{4})+',
    name: 'aiAllCategory',
    component: aiAllCategory,
  },
]