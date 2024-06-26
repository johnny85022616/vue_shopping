import HomePage from '../views/Homepage.vue';

const bsitePrefixReg = '([\\w,-_]+[\\/]?)';

export const bsiteRoutes =  [
  {
    path:`/:urlSuffix${bsitePrefixReg}`,
    name: 'home',
    component: HomePage
  },
]