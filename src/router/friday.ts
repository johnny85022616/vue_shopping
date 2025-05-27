import HomePage from '../views/Homepage.vue';
import MemberCenter from '../views/MemberCenter.vue';
import category from '../views/category.vue';
import aiSearch from '../views/aiSearch.vue';
import Product from '@/views/Product.vue';
import Order from '@/views/Order.vue';
import ShoppingIntro from '@/views/ShoppingIntro.vue';
import ElectronicTicket from '@/views/ElectronicTicket.vue';
import ConsigneeManagement from '@/views/consigneeManagement.vue';
import CreditCardManagement from '@/views/CreditCardManagement.vue';
import modifyMemberInfo from '@/views/modifyMemberInfo.vue';
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
      param: route.params,
    }),
  },
  {
    path: '/order',
    name: 'order',
    component: Order,
  },
  {
    path: '/shoppingIntro',
    name: 'shoppingIntro',
    component: ShoppingIntro,
  },
  {
    path: '/shoppingIntro',
    name: 'shoppingIntro',
    component: ShoppingIntro,
  },
  {
    path: '/member/tickets',
    name: 'tickets',
    component: ElectronicTicket,
  },
  {
    path: '/member/receiver',
    name: 'receiver',
    component: ConsigneeManagement,
  },
  {
    path: '/member/creditCard',
    name: 'creditCard',
    component: CreditCardManagement,
  },
  {
    path: '/member/edit',
    name: 'editMember',
    component: modifyMemberInfo,
  },
];
