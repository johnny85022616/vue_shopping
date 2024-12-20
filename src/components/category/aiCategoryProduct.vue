<template>
  <div class="category">
    這是小目錄
  </div>
</template>

<script lang="ts" setup name="category">

import aiProductItem from '@/components/common/aiProductItem.vue';
import tools from "@/util/tools";
import api from "@/apis/api";
import { onMounted, ref, toRefs } from "vue";
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";
import { useRoute } from 'vue-router';
import type { mixProduct } from '@/types/mixProducts';


const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const route = useRoute()
const catList = route.params.catg
const catg = route.query.catg
const productList = ref<mixProduct[] | null>(null)

const getCategoryProduct = async () => {
  if (!catList || (catList && catList.length === 0)) return
  const catId = catList[catList.length - 1]
  const { siteType, isOthersExposeToMe } = siteData.value || {}
  let postData: any = {
    type: "3",
    q1_x: 0.5,
    supplier_y:
      (siteData.value && !catg) ||
        ((siteType === "B1" || siteType === "b1") &&
          isOthersExposeToMe === "N")
        ? 1
        : 0, // 若為bSite 且沒有帶 catg=uni 就設定為 1
    list_num: 500,
  };
  let apiEndpoint = "getalist";
  if (siteData.value && siteData.value.supplierId && !catg) {
    postData.filter = {
      k: "1010",
      v: [siteData.value.supplierId, "", catId, ""],
    };
  } else {
    postData.filter = api.ai.composeBListFilter("", "", catId, "");
  }

  // 改用帶CACHE機制的 getwlist. only for siteId 帶空
  if (!siteData.value || (siteData.value && !siteData.value.siteId)) {
        apiEndpoint = "getwlist";
      }

      let data = await api.ai.getAiData(apiEndpoint, postData);
    
      if (data) {
        data = data as mixProduct[]
        // productList.value = data.map((ele) => {
        //   return {
        //     ...ele,
        //     img: ele.image_url && ele.image_url.replace("-uat2", ""),
        //     name: ele.name,
        //     pid: ele.pid,
        //     new_date: ele.new_date,
        //     brand: ele.brand,
        //     kids: ele.kids_show,
        //     wishActive: false,
        //     price: ele.promoPrice || ele.price,
        //     priceSuffix: ele.promoPrice && "(折扣後)",
        //   };
        // });
      }


}

const init = async () => {
  getCategoryProduct()
}
init()
</script>