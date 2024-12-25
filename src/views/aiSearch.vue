<template>
  <div class="aiSearch">
    <navigation :windowY="200"/>
    搜尋頁
  </div>
  <div class="p-2">
    <aiProductItem v-if="bwData" :itemList="bwData" :showCampaignQtyIcon="true"></aiProductItem>
  </div>
  <div id="aiPromotionBottomLine"></div>
  <!-- <RouterLink :to="{ name: 'aisearch', query: { keyword: 'iphone' } }">iphone</RouterLink> -->
</template>

<script lang="ts" setup name="aiSearch">
import navigation from '@/components/common/navigation.vue';
import aiProductItem from '@/components/common/aiProductItem.vue';
import tools from '@/util/tools';
import api from "@/apis/api";
import { nextTick, reactive, ref, toRef, toRefs, watch } from "vue";
import useAtBottom from '@/hooks/useAtBottom';
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";
import type { mixProduct } from '@/types/mixProducts';
import { RouterLink } from 'vue-router';

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const props = defineProps(['query'])
const { query } = toRefs(props)  //將queryString轉為ref方便做watch
const { isAtBottom, initScrollEvent } = useAtBottom()

const keyWord = ref(query?.value.keyword)
const bwData = ref<mixProduct[] | null>(null) //搜尋頁的productList
const isShowBwData = ref(true)
const isMaxPage = ref(false)
const apiLoaded = ref(false) // api是否還在loaded
const type = ref("") //途徑: 空字串為default，若途徑為單品頁導轉過來則為categoryRelated

//傳入set
const apiParams: any = reactive({
  target_value: tools.aiUserId(),
  remote: "m",
  sorting: "RELEVANT",
  kws64: "",
  kws: "",
  and_brand: "",
  page: 1,
  size: 12,
  and_supplier_id: "",
})
const isShowNoData = ref(false);

//取得搜尋商品
const getSearchAPI = async () => {
  if (apiLoaded.value || isMaxPage.value) return
  apiLoaded.value = true
  apiParams["limit_cnts"] = Math.ceil((apiParams.page * apiParams.size) / 100) * 100;
  const searchData = await api.ai.getSearchData(apiParams)
  //查不到資料
  if (!searchData || (searchData && !searchData.results)) {
    isMaxPage.value = true
    // 僅第一頁且查不到資料
    if (apiParams.page === 1) {
      isShowNoData.value = true;
    }
    return
  }
  const data = searchData.results
  if (!bwData.value) {
    bwData.value = data
  } else {
    bwData.value = bwData.value.concat(data)
  }
  await nextTick();
  apiLoaded.value = false
  apiParams.page +=1
  isAtBottom.value = false;
}

//解決props: query若本頁面互轉組件不會更新所以取得不到新的queryString問題
watch(() => query?.value.keyword, (val) => {
  keyWord.value = val
  // init()
})
watch(isAtBottom, (val) => {
  console.log(77777);
  if (val) getSearchAPI()
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
    apiParams.filter = api.ai.composeBListFilter(
      "",
      filterUnShowSupplierIds
    );
  }
  getSearchAPI()
  initScrollEvent()
}

init()


</script>