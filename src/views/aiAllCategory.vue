<template>
  <div class="aiAllCategory">
    <!-- <navigation :windowY="200" :directShowSearchInput="true" />
    <breadcrumb v-if="breadCrumbData" :breadCrumbData="breadCrumbData" />
    <div v-if="showFetLogoBoldLogo" class="fetLogoBold">
      <img src="./images/icons/fetLogo_bold.svg">
    </div>
    <categoryMenu v-if="category" :items="category" />
 
    <div class="aiLCategory-banner">
      <carousel v-if="isShowBanner" :autoplay="true" :loop="true" :perPage="1" :navigateTo="0" :scrollPerPage="false" :paginationEnabled="false" :navigationEnabled="false" @pageChange="pageChange">
        <slide v-for="(e, i) of validBanner" :key="i">
          <a :href="e.link" :title="e.title">
            <img :src="e.imgSrc" :alt="e.title" />
          </a>
        </slide>
      </carousel>
      <span v-if="validBanner && validBanner.length>0" class="counter">{{ nowItemPage }}/{{ validBanner.length }}</span>
    </div>
    
    <div v-if="hotRankingData.length > 0" class="hotranking-products">
      <div>
        <img class="hotranking-products__head" src="./images/ai_L_category_fetnetestore_hot_title.png" />
      </div>
      <aiProductItem :itemList="hotRankingData" :noWrap="true" />
    </div>
    <productMenu v-if="bCategoryData && bCategoryData.length>0" :data="bCategoryData" /> -->
  </div>
</template>

<script lang="ts" setup name="aiAllCategory">
  import { ref } from 'vue';
  import useAtBottom from '@/hooks/useAtBottom';
  import tools from '@/util/tools';
  import {useBsiteStore} from '@/stores/bsiteStore';
import { storeToRefs } from 'pinia';
import type { catg } from '@/types/category';
import type { anyObject } from '@/types/common';

  const bsiteStore = useBsiteStore()
  const {siteData} = storeToRefs(bsiteStore)
  
  const KVBannerFolder = "https://event.shopping.friday.tw/event/20231212/"
  const KVBannerJson = "https://event.shopping.friday.tw/event/20231212/KVBanner.json"
  const {isAtBottom, initScrollEvent} = useAtBottom()

  const bCategoryData = ref(null) //該目錄下所有商品資料
  const breadCrumbData = ref(null) //麵包屑資料
  const category = ref<null|anyObject>(null) //目錄資料
  const tree = ref<catg|null>(null)
  const hotRankingData = ref(null)
  const KVBanners = ref(null)
  const isApiOk = ref(true)
  const page = ref(0)
  const totalPage = ref(0)
  const pageSize = ref(1)
  const isShowBanner = ref(false)
  const isFetnetEstore = ref(false)
  const catList = ref(false)
  const nowItemPage = ref(false)
  const showFetLogoBoldLogo = ref(false)

  //組categoryMenu資料
    const getMenuData = async()=>{
      const data:any = tools.urlSearchToObj();
      const catg = data?.catg
      const exSearch = catg ? "?catg=" + catg : "";
      let menu;
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

      tree.value = catTree;
      let catArr = tools.getUrlCategoryConstruction(location.pathname);
      catList.value = catArr;

      if (catArr) {
        let sub = getSub(catArr, catTree);

        if (sub) {
          menu = Object.values(sub).map((v) => {
            const vsub = v.sub;
            return {
              id: v.cid,
              itemName: v.name,
              url: `${location.pathname}/${v.cid}${
                exSearch ? `${exSearch}` : ""
              }`,
              hasSub: vsub ? true : false,
            };
          });
        }
      }
      if (!menu || (menu && menu.length === 0)) {
        history.go(-1);
      }
      if(!menu) return 
      totalPage.value =
        menu.length % pageSize.value !== 0
          ? Math.floor(menu.length / pageSize.value + 1)
          : Math.floor(menu.length / pageSize.value);

      category.value = menu;
    }

    // 取得category快取
    const getCatCache = (id:string): catg[]=>{
      let siteId = "-";
      if (siteData.value && siteData.value.siteId) {
        siteId = siteData.value.siteId;
      }
      return tools.getCache(`ai_category_${siteId}_cache${id}`);
    }

    //取得傳入categor的最後一層物件
    const getNowCat = (ca:string[], tr:catg)=>{
      let c = ca.shift();
      const catId = c as string
      if (ca.length === 0) {
        return tr[catId];
      }
      tr = (tr[catId]?.sub) as catg;
      return getNowCat(ca, tr);
    }

    const getSub = (ca:string[] , tr: catg)=>{
      return getNowCat(ca,tr).sub
    }


</script>
