<template>
  <div class="basicInfo py-4 px-5 text-sm">
    <div v-if="data.promotionLabels && data.promotionLabels.length > 0"
      class="product-promotion text-sm text-c_clementine">
      <span class="block" v-for="(v, i) of data.promotionLabels" :key="i">{{ v }}</span>
    </div>
    <!-- 商品名稱 -->
    <div class="product-name">
      <h1 class="text-base text-c_mine_shaft font-bold">{{ data.name }}</h1>
    </div>
    <div class="product-payment mt-1 flex flex-col">
      <!-- 商品代碼、商品廠商連結 -->
      <div class="infoLink flex items-center justify-between mb-5">
        <div class="product-payment__sku w-4/5 inline text-nowrap text-ellipsis text-c_sliver">
          <label class="mr-1">商品代碼</label>
          <span>{{ data.pid }} <i class="inline-block bg-copy-icon w-5 h-5 bg-no-repeat bg-100% bg-center"
              @click="copyNumber(data.pid)"></i></span>
        </div>
        <div v-if="isBsiteBrand" class="product-payment__brand mb-1">
          <a class="text-c_blue_ribbon" v-if="bsiteData" :href="brandUrl">看<strong>{{ bsiteData.siteName
              }}</strong>的所有商品 →</a>
        </div>
      </div>
      <!-- 商品價格 -->
      <div class="price">
        <!-- 有優惠價格 -->
        <div v-if="data.payMethodList[0] === 'CASH' && data.price.promoPrice" class="infoPrice flex items-baseline justify-start">
          <div class="flex items-baseline mr-2">
            <span class="product-payment__list-price block text-c_sliver min-w-10 text-base">網路價</span>
            <span class="product-payment__list-price text-c_sliver min-w-10 text-base line-through">${{
              tools.priceFormat(data.price.memberPrice)
            }}</span>
            <span class="product-payment__currency ml-2 text-c_pomegranate text-sm">$</span>
            <span class="product-payment__red-price text-2xl text-c_pomegranate">{{
              tools.priceFormat(data.price.promoPrice)
            }}</span>
          </div>
          <div v-if="bestDiscount" class="flex items-baseline mr-2">
            <span>(最優再折$<span class="product-payment__more-discount-price text-sm text-c_pomegranate">{{
              tools.priceFormat(bestDiscount) }}</span>)</span>
          </div>
        </div>
        <div v-else class="infoPrice flex items-baseline justify-start">
          <div v-if="!bestDiscount" class="flex items-baseline mr-2">
            <span v-if="data.price.marketPrice"
              class="product-payment__list-price block text-c_sliver min-w-10 text-base">市價</span>
            <span v-if="data.price.marketPrice"
              class="product-payment__list-price block text-c_sliver min-w-10 text-base line-through">${{
                tools.priceFormat(data.price.marketPrice)
              }}</span>
          </div>
          <div class="flex items-baseline mr-2">
            <span>
              <span class="product-payment__net-content text-sm mr-1 text-c_black">網路價</span>
              <span v-if="data.price.memberPrice !== null"
                class="product-payment__currency ml-2 text-c_pomegranate text-sm">$</span>
              <span v-if="data.price.memberPrice !== null"
                class="product-payment__red-price text-2xl text-c_pomegranate">{{
                  tools.priceFormat(data.price.memberPrice)
                }}</span>
              <span v-else class="noPrice text-c_red text-lg ml-2">暫無價格</span>
            </span>
          </div>
          <div v-if="bestDiscount" class="flex items-baseline mr-2">
            <span>(最優再折$<span class="product-payment__more-discount-price text-sm text-c_pomegranate">{{
              tools.priceFormat(bestDiscount) }}</span>)</span>
          </div>
        </div>
      </div>
      <div class="flex">
        <span class="storeIcon bg-c_olivine h-5 text-c_white rounded-md px-2 mt-2 mr-2" v-if="isStoreIconShow">超商取貨</span>
        <span v-if="friendRecommandation" class="product-payment__tags mt-2 flex justify-between">
          <span v-if="friendRecommandation" class="h-5 text-c_SilverChalice mr-1">友商推薦商品</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="basicInfo">
import tools from '@/util/tools';
import api from '@/apis/api';
import type { productInfo } from '@/types/productInfo';
import { computed, ref, toRefs } from 'vue';
import { useBsiteStore } from '@/stores/bsiteStore';
import { storeToRefs } from 'pinia';


const BsiteStore = useBsiteStore()
const { siteData } = storeToRefs(BsiteStore)
const bsiteData = ref<any | null>(null)

const isBsiteBrand = ref(false) //為有曝光的廠商
const bestDiscount = ref<number>(0)

const brandUrl = computed(() => {
  return `/brandPromotion?urlSuffix=${bsiteData.value.urlSuffix}`;
})
const isStoreIconShow = computed(() => { //是否顯示超取icon
  return data.value.tags.some((v) => v === "STORE_DELIVER");
})

const props = defineProps<{ data: productInfo, friendRecommandation: boolean }>()
const { data, friendRecommandation } = toRefs(props)

const copyNumber = (content: number) => {
  const contentStr = String(content)
  navigator.clipboard.writeText(contentStr).then(() => {
    alert(`已複製${content}至剪貼簿`);
  });
}

const isShowLookBrand = async () => {
  if (!siteData.value) {
    let d = await api.web.getSupplierData(data.value.supplierId)
    console.log("$$$$$$", d);
    if (d) {
      if (
        d &&
        d.isUnderCounstruction === "N" &&
        ["B1", "b1"].includes(d.siteType) &&
        d.supplierId &&
        Number(d.skuCount) > 10
      ) {
        bsiteData.value = d;
        isBsiteBrand.value = true;
      }
    }
  }
}
//取得供應商最佳解 + 商品本身最佳解加總
const getBestDiscount = async () => {
  console.log(window.fridayData);
  const supplierBestDiscount =
    await api.product.querySupplierBestDiscount(data.value.pid);
  const bd = data.value?.price?.bestDiscountO || 0;
  bestDiscount.value = bd + supplierBestDiscount;
}

const init = async () => {
  await isShowLookBrand();
  getBestDiscount()
}
init()

</script>