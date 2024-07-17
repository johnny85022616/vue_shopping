import HomePage from '../views/Homepage.vue';
import MemberCenter from '../views/MemberCenter.vue';

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
  }
]