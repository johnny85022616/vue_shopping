<template>
  <div :class="['navigation-bottom-bar', { 'is-bsite': siteData }]">
    <a :href="setHomepageUrl">首頁
      <i :class="`${siteData ? 'homepage_bk' : 'homepage'}`"></i>
    </a>
    <a href="#" @click="openMenu($event)">全分類
      <i :class="`${siteData ? 'catalog_bk' : 'catalog'}`"></i>
    </a>
    <a :href="setCartUrl">購物車
      <i :class="`${siteData ? 'shoppingcart_bk' : 'shoppingcart'}`"></i>
      <span class="countShoppingBag">{{ cartCount }}</span>
    </a>
    <a :href="viewedUrl">我的最愛
      <i :class="`${siteData ? 'viewed_bk' : 'viewed'}`"></i>
    </a>
    <a href="#">我的
      <i :class="`${siteData ? 'mine_bk' : 'mine'}`"></i>
    </a>
  </div>
</template>

<script setup lang="ts" name="navigationBottom">
  import api from '@/apis/api';
  import { computed, onMounted, ref } from 'vue';
  import { useBsiteStore } from '../../stores/bsiteStore';
  import { storeToRefs } from 'pinia';
  import type { siteData } from '@/types/apiWeb';

  const cartCount = ref(0)
  const cartType = ref(1)
  const cartTypeNum = ref(0)

  const BsiteStore = useBsiteStore()
  const { siteData } = storeToRefs(BsiteStore)
  const emit = defineEmits(['openShowMenu'])
  
  
  onMounted(async()=>{
    //init 購物車
    if(!siteData){
      const cartData = await api.cart.getEcCart()
      if(cartData){
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
  const viewedUrl = computed<string>(()=>{
    return siteData.value ? `/${siteData.value.urlSuffix}/favorite` : '/favorite';
  })

  function openMenu(evt: Event) {
    console.log(evt);
    emit('openShowMenu')
  }

  function setCartUrl() {
    if (siteData) {
      return `/${siteData.value?.urlSuffix}/shoppingcart`;
    } else {
      return cartTypeNum.value === 1 ? `/mobileweb/checkout/step1?cartType=${cartType.value}` : '/shoppingcart';
    }
  }

  // function openMyProfile(evt:event) {
  //       const b2cUid = this.$cookies.get('FEEC-B2C-UID');
  //       const b2cTicket = this.$cookies.get('FEEC-B2C-TICKET');
  //       if (b2cUid && b2cTicket) {
  //         //登入狀態轉會員中心頁
  //         location.href = '/memberCenter';
  //         return;
  //       }
  //       //未登入觸發peoplelinks
  //       this.$emit('showPeopleLinks', evt);
  //     }
</script>

<style lang="scss" scoped>
  @import '../../style/color';
  @import '../../style/mixin';
  @import '../../style/icons.module.scss';

  .navigation-bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: $dune;
    padding: 5px 0;

    &.is-bsite {
      background-color: $white;
      border-top: 1px solid #ddd;

      a {
        color: $dune;
      }
    }

    a {
      font-size: 10px;
      color: $white;
      width: 50px;
      height: fit-content;
      text-decoration: none;
      display: inline-flex;
      flex-direction: column-reverse;
      align-items: center;
      position: relative;
    }

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
    }
  }
</style>
