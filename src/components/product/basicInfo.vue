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
        <div  v-if="data.payMethodList[0] === 'CASH' && data.price.promoPrice" class="infoPrice">
          <div>
            <span class="product-payment__list-price block text-c_sliver min-w-10 text-base">網路價</span>
            <span class="product-payment__list-price text-c_sliver min-w-10 text-base line-through">${{
              tools.priceFormat(data.price.memberPrice)
            }}</span>
            <span class="product-payment__currency ml-2 text-c_pomegranate text-sm">$</span>
            <span class="product-payment__red-price text-2xl text-c_pomegranate">{{
              tools.priceFormat(data.price.promoPrice)
            }}</span>
          </div>
          <div v-if="data.price.bestDiscountO">
            <span>(最優再折$<p class="product-payment__more-discount-price text-sm text-c_pomegranate">{{
              tools.priceFormat(data.price.bestDiscountO) }}</p>)</span>
          </div>
        </div>
        <div class="infoPrice flex items-baseline justify-start">
                <div v-if="!data.price.bestDiscountO" class="flex items-baseline mr-2">
                  <span v-if="data.price.marketPrice" class="product-payment__list-price block text-c_sliver min-w-10 text-base">市價</span>
                  <span v-if="data.price.marketPrice" class="product-payment__list-price block text-c_sliver min-w-10 text-base line-through">${{
                    tools.priceFormat(data.price.marketPrice)
                  }}</span>
                </div>
                <div>
                  <span>
                    <span class="product-payment__net-content text-sm mr-1 text-c_black">網路價</span>
                    <span v-if="data.price.memberPrice !== null" class="product-payment__currency ml-2 text-c_pomegranate text-sm">$</span>
                    <span v-if="data.price.memberPrice !== null" class="product-payment__red-price text-2xl text-c_pomegranate">{{
                      tools.priceFormat(data.price.memberPrice)
                    }}</span>
                    <span v-else class="noPrice text-c_red text-lg ml-2">暫無價格</span>
                  </span>
                </div>
                <div>
                  <span v-if="data.price.bestDiscountO">(最優再折$<p class="product-payment__more-discount-price text-sm text-c_pomegranate">{{ tools.priceFormat(data.price.bestDiscountO) }}</p>)</span>
                </div>
              </div>
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

const init = async () => {
  await isShowLookBrand();
}
init()

</script>