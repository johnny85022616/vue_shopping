<template>
  <div class="category">
    <navigation :windowY="200" />
    搜尋頁
  </div>
  <RouterLink :to="{ name: 'aisearch', query: { keyword: 'iphone' } }">iphone</RouterLink>
</template>

<script lang="ts" setup name="category">
import navigation from '@/components/common/navigation.vue';
import tools from '@/util/tools';
import api from "@/apis/api";
import { reactive, ref, toRef, toRefs, watch } from "vue";
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";
import type { mixProduct } from '@/types/mixProducts';
import { RouterLink } from 'vue-router';

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const props = defineProps(['query'])
const { query } = toRefs(props)  //將queryString轉為ref方便做watch

const keyWord = ref(query?.value.keyword)
const bwData = ref<mixProduct[] | null>() //搜尋頁的productList
const isShowBwData = ref(true)
const nextPage = ref(true)
const apiLoaded = ref(false)
const type = ref("") //途徑: 空字串為default，若途徑為單品頁導轉過來則為categoryRelated

//傳入set
const apiParams = reactive({
  target_value: tools.aiUserId(),
  remote: "m",
  sorting: "RELEVANT",
  kws64: "",
  kws: "",
  and_brand: "",
  page: 1,
  size: 9,
  and_supplier_id: "",
})
const isShowNoData = ref(false);
const isCategoryRelated = ref(false)

//解決props: query若本頁面互轉組件不會更新所以取得不到新的queryString問題
watch(() => query?.value.keyword, (val) => {
  keyWord.value = val
  // init()
})

const init = async () => {
  console.log(query?.value);
  apiParams.kws = keyWord.value
  apiParams.kws64 = tools.base64Encode(keyWord.value)

  // B SITE 供應商不允許其他廠商商品出現在我這 isOthersExposeToMe
  if (siteData.value) {
    const { isOthersExposeToMe, supplierId, b4Info } = siteData.value;
    if (isOthersExposeToMe === "N" && supplierId) {
      apiParams.and_supplier_id = supplierId;
    }
    if (b4Info) {
      const b4SupplierId = b4Info.supplierIds;
      if (b4SupplierId) {
        apiParams.and_supplier_id = b4SupplierId.toString();
      }
    }
  }

  // friDay主站
  if (window.fridaySiteData) {
      const { unShowSupplierIds } = window.fridaySiteData;
      let filterUnShowSupplierIds = "";

      if (unShowSupplierIds)
        filterUnShowSupplierIds = unShowSupplierIds.toString();
      //   apiParams.filter = api.ai.composeBListFilter(
      //   "",
      //   filterUnShowSupplierIds
      // );
    }

}

init()


</script>