<template>
  <div :class="[`navigation-bottom-bar flex items-center justify-evenly fixed z-[2] left-0 right-0 bottom-0 w-full h-[50px] py-1 px-0`,  `${siteData?`border-t border-solid border-t-c_alto bg-c_white`:'bg-c_dune'}`]">
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative', `${siteData? 'text-c_dune':'text-c_white'}`]" :href="setHomepageUrl">首頁
      <i :class="`${siteData ? 'homepage_bk' : 'homepage'}`"></i>
    </a>
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative',`${siteData? 'text-c_dune':'text-c_white'}`]" href="#" @click="openMenu($event)">全分類
      <i :class="`${siteData ? 'catalog_bk' : 'catalog'}`"></i>
    </a>
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative',`${siteData? 'text-c_dune':'text-c_white'}`]" :href="setCartUrl">購物車
      <i :class="`${siteData ? 'shoppingcart_bk' : 'shoppingcart'}`"></i>
      <span class="countShoppingBag">{{ cartCount }}</span>
    </a>
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative',`${siteData? 'text-c_dune':'text-c_white'}`]" :href="viewedUrl">我的最愛
      <i :class="`${siteData ? 'viewed_bk' : 'viewed'}`"></i>
    </a>
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative',`${siteData? 'text-c_dune':'text-c_white'}`]" href="#" @click="openMyProfile">我的
      <i :class="`${siteData ? 'mine_bk' : 'mine'}`"></i>
    </a>
  </div>
</template>

<script setup lang="ts" name="navigationBottom">
  import api from '@/apis/api';
  import { computed, inject, onMounted, ref } from 'vue';
  import { useBsiteStore } from '../../stores/bsiteStore';
  import { storeToRefs } from 'pinia';
  import type { siteData } from '@/types/apiWeb';


  const $cookies = inject<any>('$cookies');

  const cartCount = ref(0)
  const cartType = ref(1)
  const cartTypeNum = ref(0)

  const BsiteStore = useBsiteStore()
  const { siteData } = storeToRefs(BsiteStore)
  const emit = defineEmits(['openShowMenu', "showPeopleLinks"])

  onMounted(async () => {
    //init 購物車
    if (!siteData) {
      const cartData = await api.cart.getEcCart()
      if (cartData) {
        cartCount.value = cartData.cartCount
        cartType.value = cartData.cartType
        cartTypeNum.value = cartData.cartTypeNum
      }
    }
  })

  //首頁按鈕連結
  const setHomepageUrl = computed<string>(() => {
    const url = '/'
    if (siteData.value) {
      siteData.value ? "/" + siteData.value?.urlSuffix : '/'
    }
    return url
  })

  //我的最愛按鈕連結
  const viewedUrl = computed<string>(() => {
    return siteData.value ? `/${siteData.value.urlSuffix}/favorite` : '/favorite';
  })

  //購物車按鈕連結
  function setCartUrl() {
    if (siteData) {
      return `/${siteData.value?.urlSuffix}/shoppingcart`;
    } else {
      return cartTypeNum.value === 1 ? `/mobileweb/checkout/step1?cartType=${cartType.value}` : '/shoppingcart';
    }
  }

  //打開全分類
  function openMenu(evt: Event) {
    console.log(evt);
    emit('openShowMenu')
  }


  function openMyProfile(evt: Event) {
    const b2cUid = $cookies.get('FEEC-B2C-UID');
    const b2cTicket = $cookies.get('FEEC-B2C-TICKET');
    if (b2cUid && b2cTicket) {
      //登入狀態轉會員中心頁
      location.href = '/memberCenter';
      return;
    }
    //未登入觸發peoplelinks
    emit('showPeopleLinks', evt);
  }
</script>

<style lang="scss" scoped>
  @import '../../style/color';
  @import '../../style/mixin';
  @import '../../style/icons.module.scss';

  // .icon{
  //   @apply w-[30px] h-[30px] bg-contain bg-no-repeat bg-center
  // }

  .navigation-bottom-bar {
    // display: flex;
    // align-items: center;
    // justify-content: space-evenly;
    // position: fixed;
    // z-index: 2;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // width: 100%;
    // height: 50px;
    // background-color: $dune;
    // padding: 5px 0;

    &.is-bsite {
      // background-color: $white;
      // border-top: 1px solid #ddd;

      // a {
      //   color: $dune;
      // }
    }

    // a {
    //   font-size: 10px;
    //   // color: $white;
    //   width: 50px;
    //   height: fit-content;
    //   text-decoration: none;
    //   display: inline-flex;
    //   flex-direction: column-reverse;
    //   align-items: center;
    //   position: relative;
    // }

    .countShoppingBag,
    .notice,
    .fcoin {
      @include tag;
    }

    i {
      width: 30px;
      height: 30px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;

      &.homepage {
        background-image: url('../../assets/icons/01_homepage.png');
      }

      &.catalog {
        background-size: 75%;
        background-image: url('../../assets/icons/02_catalog.png');
      }

      &.shoppingcart {
        background-size: 85%;
        background-image: url('../../assets/icons/03_shoppingcart.png');
      }

      &.viewed {
        background-size: 85%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/favorite.png');
      }

      &.notification {
        background-size: 65%;
        background-image: url('../../assets/icons/05_notification.png');
      }

      &.mine {
        background-size: 65%;
        background-image: url('../../assets/icons/06_mine.png');
      }
      &.homepage_bk {
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/01_homepage_bk.png');
      }

      &.catalog_bk {
        background-size: 75%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/02_catalog_bk.png');
      }

      &.shoppingcart_bk {
        background-size: 85%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/03_shoppingcart_bk.png');
      }

      &.viewed_bk {
        background-size: 85%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/ai4Favorite.png');
      }

      &.notification_bk {
        background-size: 65%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/05_notification_bk.png');
      }

      &.mine_bk {
        background-size: 65%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/06_mine_bk.png');
      }
    }
  }
</style>
