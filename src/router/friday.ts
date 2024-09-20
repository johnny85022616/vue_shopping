import HomePage from '../views/Homepage.vue';
import MemberCenter from '../views/MemberCenter.vue';
import aiAllCategory from '../views/aiAllCategory.vue';
import routerFunc from './routerFunc';

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
  // {
  //   path: '/category/:lid',
  //   name: 'aiAllCategory',
  //   component: aiAllCategory,
  //   beforeEnter: (to:any, from:any, next:any) => {
  //     const lid = to.params.lid
  //     if(/L[\d]+/.test(lid)){
  //       next()
  //     }else{
  //       next({name:'home'})
  //     }
  //   }
  // },
  
  {
    path: '/category/:catg1/:catg2/:catg3',
    name: 'aiAllCategory',
    component: (route:any)=>{routerFunc.categoryDirector(route.params)}
   
  },
  {
    path: '/category/:catg1/:catg2',
    name: 'aiAllCategory',
    component: (route:any)=>{routerFunc.categoryDirector(route.params)}
   
  },
  {
    path: '/category/:catg1',
    name: 'aiAllCategory',
    component: aiAllCategory,
    beforeEnter: (to:any, from:any, next:any) => {
      const params = to.params
      const type = routerFunc.categoryDirector(params)
      console.log(type); 
    }
  },
]