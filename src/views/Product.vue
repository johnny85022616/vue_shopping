<template>
  <div class="product">
    <navigation></navigation>
    <mainImage v-if="pInfo" :images="pInfo.images" :videos="pInfo.videos"></mainImage>
    <basicInfo v-if="pInfo" :data="pInfo" :friendRecommandation="friendRecommandation"></basicInfo>
    <template v-if="isApiRequested">
      <campaign v-if="isCampaignDataLoaded" :pInfo="pInfo" :bsiteLogin="bsiteLogin"></campaign>
    </template>
  </div>
</template>

<script lang="ts" setup name="product">
import navigation from '@/components/common/navigation.vue';
import mainImage from '@/components/product/mainImage.vue';
import basicInfo from '@/components/product/basicInfo.vue';
import campaign from '@/components/product/campaign.vue';
import { ref, toRefs } from 'vue';
import api from '@/apis/api';
import tools from '@/util/tools';
import { useBsiteStore } from '@/stores/bsiteStore';
import { storeToRefs } from 'pinia';
import type { productInfo } from '@/types/productInfo';
import type { comboProduct } from '@/types/comboProduct';

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const props = defineProps(['param'])
const { param } = props

const pid = ref<number | null>(null)
const isBsite = ref(false); //是否為B網
const bsiteLogin = ref(false);
const pInfo = ref<any | null>(null); // 商品資料
const productSupplierId = ref<number | null>(null)
const isApiRequested = ref<any>(false); //取得商品資料api是否已完成
const giftItems = ref<any>(null); //㽪品
const accItems = ref<any>(null); //加購品資料
const isSimpleProductCnt = ref(false); // 是否顯示簡單版商品畫面
const myFCoin = ref(0); //使用者遠傳幣數量
const directToCheckout = ref(0); //是否直接進入結帳頁
const promotionId = ref<any | null>(null); // 活動ID
const friendRecommandation = ref(false); // 是否顯示友商推薦連結
const comboInfo = ref<comboProduct[] | null>(null); //組合商品資料
const showCartDialog = ref(false); // 是否顯示選規格POPUP
const wishActive = ref(false); // 我的最愛狀態
const cartComboData = ref<any | null>(null); // 組合商品購物車內容s
const keywords = ref<string[] | null>(null); // 商品相關關鍵字
const isTopic = ref(false); // 主題網的商品，不出現商品AI關鍵字
const emailVal = ref(''); // 貨到通知EMAIL
const isEmailErrorMsgShow = ref(false); // 貨到通知EMAIL Error
const nowSpecInfo = ref<any | null>(null); // 貨到通知，當前的商品規格
const isEmploySite = ref(false); // 是否為員購網
const nvSiteData = ref<any | null>(null); // 判斷專櫃頁進入商品頁的專櫃資料
const isNoticeApiLoaded = ref(false); // 是否貨到通知API觸法
const isCampaignDataLoaded = ref(false); //是否已取得到活動資料
const cartType = ref(1); // 購物車類型 1=宅配 2=超取
const prePageUrl = ref(''); //上一頁的url 


// 解析前頁為專櫃的尾碼
const getBrandPromotionData = async (url: string) => {
  if (/^http/.test(url)) {
    const matchData = url.match(/shop\/(\w+)/);
    const urlSuffix = matchData?.[1];
    if (urlSuffix) {
      let bd = await api.web.getBwebApiData("GET",
        `/config?urlSuffix=${urlSuffix}`, null)
      if (bd) {
        nvSiteData.value = bd?.[0];
      }
    }
  }
}

//取得單品資料
const getProductDetail = async () => {
  if (!pid.value) return
  const data = await api.product.getProduct(pid.value)
  if (data) {
    parseProductDetail(data)
  } else {
    isApiRequested.value = true
    alert("抱歉，該商品已下架，請試試其他商品");
  }
}

const parseProductDetail = async (productInfo: productInfo) => {
  console.log(productInfo);
  //初始化付款方式
  productInfo["payMethodList"] = ["CASH"];
  //初始化配送方式
  productInfo["deliveryInfos"] = [
    {
      deliveryType: "HOME",
      cartTypeId: 1,
      deliveryName: "宅配/電子票劵",
    },
  ];
  // 是否為超取商品
  if (productInfo.tags.some((v: string) => v === "STORE_DELIVER")) {
    productInfo["deliveryInfos"].push({
      deliveryType: "STORE",
      cartTypeId: 2,
      deliveryName: "超商取貨",
    });
  }
  // 有組合商品才取得資料
  if (productInfo.tags.some((v) => v === "COMBO")) {
    getComboData();
  }

  pInfo.value = productInfo;
  productSupplierId.value = productInfo.supplierId;

  if (
    siteData.value &&
    productSupplierId.value.toString() !== siteData.value.supplierId &&
    !siteData.value.isOneSite
  ) {
    friendRecommandation.value = true;
  }

  isApiRequested.value = true
  await getCampaignData() //TODO
  const buyItemData = tools.getCache("buyItemData");
  if (buyItemData && api.member.isLogin) {
    autoAddCart(buyItemData)
  }
}

//取得組合商品資料
const getComboData = async () => {
  if (!pid.value) return
  api.product.getComboProduct(pid.value).then((res: any) => {
    if (res.cartComboData.length > 0) {
      comboInfo.value = res;
    } else {
      pInfo.value.isSoldOut = true;
    }
  });
}

//自動加入購物車
const autoAddCart = (buyItemData: any) => {

}

const getCampaignData = async () => {
  const myCampaignIds = await api.campaign.getMyCampaigns();
  const newPinfo = await api.product.getProductCampaign(
    pInfo.value,
    myCampaignIds
  );
  if (newPinfo) {
    pInfo.value = newPinfo;
    isCampaignDataLoaded.value = true;
  }
}

const init = async () => {
  pid.value = param.productId;
  if (siteData.value) {
    isBsite.value = true;
    if (siteData.value.siteType === 'B4') {
      isTopic.value = true;
    }
    if (siteData.value.siteType === 'B2') {
      isEmploySite.value = true;
    }
  }

  // 延續逛專櫃的廠商資料 在商品頁組一樣的版頭
  if (/(brandPromotion|shop)/.test(document.referrer)) {
    getBrandPromotionData(document.referrer);
  }

  getProductDetail()
};



init();
</script>
