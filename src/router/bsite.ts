import HomePage from '../views/Homepage.vue';

const bsitePrefixReg = '([\\w,-_]+[\\/]?)';

export const bsiteRoutes =  [
  {
    path:`/:urlSuffix${bsitePrefixReg}`,
    name: 'bsiteHome',
    component: HomePage
  },
]