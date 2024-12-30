import HomePage from '../views/Homepage.vue';
import MemberCenter from '../views/MemberCenter.vue';
import category from '../views/category.vue';
import aiSearch from '../views/aiSearch.vue';
import Product from '@/views/Product.vue';

export const fridayRoutes = [
  //首頁路由
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  //會員中心路由
  {
    path: '/memberCenter',
    name: 'memberCenter',
    component: MemberCenter,
  },
  //大中小目錄路由
  {
    path: '/category/:catg([LMB]{1}\\d{4})+',
    name: 'aiAllCategory',
    component: category,
  },
  //搜尋頁路由(queryString: keyword關鍵字)
  {
    path: '/aisearch',
    name: 'aisearch',
    component: aiSearch,
    props: (route: any) => ({
      query: route.query,
    }),
  },
  //單品頁連結
  {
    path: '/product/:productId([\\d]+)',
    name: 'product',
    component: Product,
    props: (route: any) => ({
      query: route.params,
    }),
  },
];
