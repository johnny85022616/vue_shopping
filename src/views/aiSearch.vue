<template>
  <div class="category">
    <navigation :windowY="200" />
    搜尋頁
  </div>
  <RouterLink :to="{name:'aisearch' , query: {keyword: 'iphone'}}">iphone</RouterLink>
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

//傳入set
const apiParams = reactive({
        target_value: tools.aiUserId(),
        remote: "m",
        sorting: "RELEVANT",
        keyword: "",
        kws: "",
        and_brand: "",
        page: 1,
        size: 9,
      })
const isShowNoData = ref(false);
const isCategoryRelated = ref(false)

//解決props: query若本頁面互轉組件不會更新所以取得不到新的queryString問題
watch(()=> query?.value.keyword, (val)=>{
  keyWord.value = val
})


const init = async () => {
  console.log(query?.value);
}

init()


</script>