<template>
  <div class="basicInfo py-4 px-5 text-sm">
    <div v-if="data.promotionLabels && data.promotionLabels.length > 0"
      class="product-promotion text-sm text-c_clementine">
      <span class="block" v-for="(v, i) of data.promotionLabels" :key="i">{{ v }}</span>
    </div>
    <div class="product-name">
      <h1 class="text-base text-c_mine_shaft font-bold">{{ data.name }}</h1>
    </div>
    <div class="product-payment mt-1 flex flex-col">
      <div class="infoLink flex items-center justify-between mb-5">
          <div class="product-payment__sku w-4/5 inline text-nowrap text-ellipsis text-c_sliver">
            <label class="mr-1">商品代碼</label>
            <span>{{ data.pid }} <i class="inline-block bg-copy-icon w-5 h-5 bg-no-repeat bg-100% bg-center" @click="copyNumber(data.pid)"></i></span>
          </div>
          <div v-if="isBsiteBrand" class="product-payment__brand mb-1">
            <a class="text-c_blue_ribbon" v-if="bsiteData" :href="brandUrl">看<strong>{{ bsiteData.siteName }}</strong>的所有商品 →</a>
          </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="basicInfo">
import api from '@/apis/api';
import type { productInfo } from '@/types/productInfo';
import { computed, ref, toRefs } from 'vue';
import { useBsiteStore } from '@/stores/bsiteStore';
import { storeToRefs } from 'pinia';


const BsiteStore = useBsiteStore()
const { siteData } = storeToRefs(BsiteStore)
const bsiteData = ref<any | null>(null)
const isBsiteBrand = ref(false) //為有曝光的廠商
const brandUrl = computed(()=>{
  return `/brandPromotion?urlSuffix=${bsiteData.value.urlSuffix}`;
})
const isStoreIconShow = computed(()=>{ //是否顯示超取icon
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
    console.log("$$$$$$",d);
    if (d) {
      if (
        d &&
        d.isUnderCounstruction === "N" &&
        ["B1", "b1"].includes(d.siteType) &&
        d.supplierId &&
        Number(d.skuCount) > 10
      ) {
        console.log(7777);
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