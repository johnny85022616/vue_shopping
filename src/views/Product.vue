<template>
  <div class="product"></div>
</template>

<script lang="ts" setup name="product">
import { ref } from 'vue';
import {useBsiteStore} from '@/stores/bsiteStore';
import { storeToRefs } from 'pinia';

const bsiteStore = useBsiteStore()
const {siteData} = storeToRefs(bsiteStore)

const isBsite = ref(false); //是否為B網
const bsiteLogin = ref(false);
const pInfo = ref(false); // 商品資料
const isApiRequested = ref<any>(false); //取得商品資料api是否已完成
const giftItems = ref<any>(null); //㽪品
const accItems = ref<any>(null); //加購品資料
const isSimpleProductCnt = ref(false); // 是否顯示簡單版商品畫面
const myFCoin = ref(0); //使用者遠傳幣數量
const directToCheckout = ref(0); //是否直接進入結帳頁
const promotionId = ref<any | null>(null); // 活動ID
const friendRecommandation = ref(false); // 是否顯示友商推薦連結
const comboInfo = ref<any | null>(null); //組合商品資料
const showCartDialog = ref(false); // 是否顯示選規格POPUP
const wishActive = ref(false); // 我的最愛狀態
const cartComboData = ref<any | null>(null); // 組合商品購物車內容s
const keywords = ref<string[]|null>(null) // 商品相關關鍵字
const isTopic = ref(false) // 主題網的商品，不出現商品AI關鍵字
const emailVal = ref("") // 貨到通知EMAIL
const isEmailErrorMsgShow = ref(false) // 貨到通知EMAIL Error
const nowSpecInfo = ref<any| null>(null)  // 貨到通知，當前的商品規格
const isEmploySite = ref(false) // 是否為員購網
const nvSiteData = ref<any| null>(null) // 判斷專櫃頁進入商品頁的專櫃資料
const isNoticeApiLoaded = ref(false) // 是否貨到通知API觸法
const isCampaignDataLoaded = ref(false) //是否已取得到活動資料
const cartType = ref(1) // 購物車類型 1=宅配 2=超取

const init = async()=>{
  if(siteData.value){
    isBsite.value = true
    if(siteData.value.siteType === 'B4'){
      isTopic.value = true
    }
    if(siteData.value.siteType === 'B2'){
      isEmploySite.value = true
    }
  }
}

init()
</script>
