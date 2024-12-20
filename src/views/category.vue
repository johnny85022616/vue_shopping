<template>
  <div class="category">
    <navigation :windowY="200" />
    <template v-if="isInit">   
      <aiAllCategory :catList="catList" :tree="tree" v-if="hasSub" :key="route.path"/>
      <aiCategoryProduct v-else :key="'noSub'+route.path" ></aiCategoryProduct>
    </template>
  </div>
</template>

<script lang="ts" setup name="category">
import navigation from '@/components/common/navigation.vue';
import aiAllCategory from "@/components/category/aiAllCategory.vue";
import aiCategoryProduct from '@/components/category/aiCategoryProduct.vue';
import type { catg, group } from "@/types/category";
import tools from "@/util/tools";
import api from "@/apis/api";
import { ref } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const route = useRoute()
const tree = ref<catg | null>(null);
const catList = ref<string[]|null>(null);
const hasSub = ref(false)
const isInit = ref(false)

//取得category後方路淨切成array(若catList原本就有表示同為非底層目錄戶轉的結果，catList直接取onBeforeRouteUpdate設定的catList)
const getCatList=()=>{
  catList.value = catList.value && catList.value.length>0 ? catList.value : route.params.catg as string[]
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
  else hasSub.value = false
}

//避免非底層目錄戶轉時組件沒有重新載入問題(此時可以取得舊的路由和新的路由但路由本身還未改變成新的)
onBeforeRouteUpdate((to, from)=>{
  if(to.params.catg !== from.params.catg){
    catList.value = to.params.catg as string[]
    init()
  }
})

const init = async () => {
  getCatList()
  await api.ai.getCategorys();
  getCategoryTree()
  componentTypeFactory()
  isInit.value = true
}

init()


</script>