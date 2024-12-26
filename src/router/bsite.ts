import AiSearch from '@/views/aiSearch.vue';
import HomePage from '../views/Homepage.vue';

const bsitePrefixReg = '([\\w,-_]+[\\/]?)';

export const bsiteRoutes = [
  {
    path: `/:urlSuffix${bsitePrefixReg}`,
    name: 'bsiteHome',
    component: HomePage,
  },
  {
    path: `/aiSearch/:urlSuffix${bsitePrefixReg}`,
    name: 'bsiteAiSearch',
    component: AiSearch,
    props: (route: any) => ({ query: route.query }),
  },
];
