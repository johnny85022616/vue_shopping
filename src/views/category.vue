<template>
  <div class="category">
    <aiAllCategory v-if="hasSub"/>
    <div v-else>底層目錄</div>
  </div>
</template>

<script lang="ts" setup name="category">
import aiAllCategory from "@/components/category/aiAllCategory.vue";
import type { catg, group } from "@/types/category";
import tools from "@/util/tools";
import api from "@/apis/api";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const route = useRoute()
const tree = ref<catg | null>(null);
const catList = ref<string[]|null>(null);
const hasSub = ref(false)

//取得category後方路淨切成array
const getCatList=()=>{
  catList.value = route.params.catg as string[]
}
//取得分類樹
const getCategoryTree = () => {
  const { catg } = route.query;
  let catTree;
  if (!siteData.value) {
    //本站
    catTree = getCatCache("")?.[0];
  } else {
    //b站
    if (!catg) {
      if (siteData.value.siteType !== "B2") {
        catTree = getCatCache("1")?.[0];
      } else {
        catTree = getCatCache("")?.[0];
      }
    } else {
      catTree = getCatCache("2")?.[0];
    }
  }
  tree.value = catTree
}
// 取得category快取
const getCatCache = (id: string): catg[] => {
  let siteId = "-";
  if (siteData.value && siteData.value.siteId) {
    siteId = siteData.value.siteId;
  }
  return tools.getCache(`ai_category_${siteId}_cache${id}`);
};

//取得目前目錄下的資料
const getNowCat = (ca: string[], tr: catg)=>{
  return ca.reduce((t: catg|group, c: string , idx: number, arr: string[])=>{
    const catgTypeT = t as catg
    if(idx === arr.length-1) return catgTypeT[c]
    return catgTypeT[c]?.sub || catgTypeT[c];
  } , tr)
}

//取得當前目錄下的所有子目錄資料
const getSub = (ca: string[], tr: catg) => {
  return getNowCat(ca, tr).sub;
};

//判斷該目錄是否為底層目錄(若有sub表示非底層目錄)
const componentTypeFactory = ()=>{
  if(!catList.value || !tree.value) return 
  const cat = catList.value as string[]
  const tr =  tree.value as catg 
  const sub = getSub(cat, tr)
  if(sub) hasSub.value = true
}

const init = async () => {
  getCatList()
  await api.ai.getCategorys();
  getCategoryTree()
  componentTypeFactory()
}
init()

</script>