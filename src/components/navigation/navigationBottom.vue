<template>
  <div :class="[`navigation-bottom-bar flex items-center justify-evenly fixed z-[2] left-0 right-0 bottom-0 w-full h-[50px] py-1 px-0`,  `${siteData?`border-t border-solid border-t-c_alto bg-c_white`:'bg-c_dune'}`]">
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative', `${siteData? 'text-c_dune':'text-c_white'}`]" :href="setHomepageUrl">首頁
      <i :class="[`w-[30px] h-[30px] bg-contain bg-no-repeat bg-center ${siteData ? 'bg-bsite-homepage':'bg-friday-homepage' }`]"></i>
    </a>
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative',`${siteData? 'text-c_dune':'text-c_white'}`]" href="#" @click="openMenu($event)">全分類
      <i :class="[`w-[30px] h-[30px] bg-no-repeat bg-center bg-75% ${siteData ? 'bg-bsite-catalog' : 'bg-firday-catalog'}`]"></i>
    </a>
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative',`${siteData? 'text-c_dune':'text-c_white'}`]" :href="setCartUrl">購物車
      <i :class="[`w-[30px] h-[30px] bg-85% bg-no-repeat bg-center ${siteData ? 'bg-bsite-shoppingcart' : 'bg-firday-shoppingcart'}`]"></i>
      <span class="redCount">{{ cartCount }}</span>
    </a>
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative',`${siteData? 'text-c_dune':'text-c_white'}`]" :href="viewedUrl">我的最愛
      <i :class="[`w-[30px] h-[30px] bg-85% bg-no-repeat bg-center ${siteData ? 'bg-bsite-favorite' : 'bg-firday-favorite'}`]"></i>
    </a>
    <a :class="['text-[10px] w-[50px] h-fit no-underline inline-flex flex-col-reverse items-center relative',`${siteData? 'text-c_dune':'text-c_white'}`]" href="#" @click="(e)=>openMyProfile(e)">我的
      <i :class="[`w-[30px] h-[30px] bg-65% bg-no-repeat bg-center ${siteData ? 'bg-bsite-mine' : 'bg-firday-mine'}`]"></i>
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

  //打開我的(peopleLinks)
  function openMyProfile(evt: Event) {
    const b2cUid = $cookies.get('FEEC-B2C-UID');
    const b2cTicket = $cookies.get('FEEC-B2C-TICKET');
    const faToken = $cookies.get('FEEC-FA-TOKEN');
    if (b2cUid && b2cTicket && faToken) {
      //登入狀態轉會員中心頁
      location.href = '/memberCenter';
      return;
    }
    //未登入觸發peoplelinks
    emit('showPeopleLinks', evt);
  }
</script>

<style lang="scss" scoped>
</style>
