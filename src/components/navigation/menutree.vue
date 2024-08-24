<template>
  <div class="menutree fixed left-0 right-0 z-20  bg-c_white`" :style="[{'height': 'calc(100vh - 50px)'}]">
    <hotKeywords v-if="(!isBsite)||(isBsite && siteData && !['B4', 'b1'].includes(siteData.siteType))" :isBsite="isBsite" />

    <div class="category-shop bg-c_white text-c_mine_shaft overflow-auto pb-[60px]" :style="[{'height': 'calc(100vh - 50px - 101px)'}]">
      <div v-if="bsiteShopItems">
        <label class="inline-block p-4 text-base" for="">{{ bsiteShopItemsTitle }}</label>
        <ul class="text-sm px-4 grid grid-cols-3 gap-2 list-none">
          <li class="mb-2" v-for="(item, idx) in bsiteShopItems" :key="idx" @click="goCategoryPage(item.url, 2)">
            <img class="relative w-3/4 aspect-square mx-auto border border-solid border-c_ghost rounded-md" :src="item.img_url" alt="">
            <p class="text-c_mine_shaft text-center px-3">{{item.name}}</p>
          </li>
        </ul>
      </div>
      <template v-if="shopItems && shopItems.length > 0">
        <label class="inline-block p-4 text-base" for="">{{ shopItemsTitle }}</label>
        <ul class="text-sm px-4 grid grid-cols-3 gap-2 list-none">
          <li class="mb-2" v-for="(item, idx) in shopItems" :key="idx" @click="goCategoryPage(item.url, 1)">
            <img class="relative w-3/4 aspect-square mx-auto border border-solid border-c_ghost rounded-md" :src="item.img_url" alt="">
            <p class="text-c_mine_shaft text-center px-3">{{item.name}}</p>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup name="menutree">
import { ref } from 'vue';
import { useBsiteStore } from '@/stores/bsiteStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import tools from '@/util/tools';
import api from '@/apis/api';
import type { category, catg } from '@/types/category';
import hotKeywords from '@/components/common/hotKeywords.vue';

  const bsiteStore = useBsiteStore()
  const {siteData} = storeToRefs(bsiteStore)
  const router = useRouter()

  const isBsite = ref(false)
  const bsiteShopItems = ref<any>(null)
  const shopItems = ref<any>(null)
  const bsiteShopItemsTitle = ref('全部分類')
  const shopItemsTitle = ref('全部分類')


    const goCategoryPage = (url:string, siteType = 1 /* 1 friDay本站 2 bSite本站 */)=> {
      if (siteData.value && siteType === 1) {
        url += "?catg=uni";
      }
      router.push(url)
    }

    const getBsiteCategorys = async(siteId = "-")=>{
      const findCache1 = tools.getCache(`ai_category_${siteId}_cache1`);
      if (findCache1) {
        parseBsiteCategorys(findCache1, 1);
      }
      const findCache2 = tools.getCache(`ai_category_${siteId}_cache2`);
      if (findCache2) {
        parseBsiteCategorys(findCache2, 2);
      }

      if (findCache1 || findCache2) return false;

      const d = await api.ai.getAiData("getvlist", {
        target: "pseudoid",
        list_fun: "allCategory",
        list_args: "content",
        list_remote: "b01",
        if_bWeb: "1",
        site_id: siteId,
      });
      
      const data = d as category

      const { catg1, catg2, groupings } = data;

      // 有供應商所產生的[本站的樹]
      if (catg1) {
        console.log("有供應商所產生的[本站的樹]", catg1);
        tools.setCache(`ai_category_${siteId}_cache1`, catg1, 300);
        parseBsiteCategorys(catg1, 1);
      }

      // 有供應商所產生的[聯合曝光的樹]
      if (catg2) {
        console.log("有供應商所產生的[聯合曝光的樹]", catg2);
        tools.setCache(`ai_category_${siteId}_cache2`, catg2, 300);
        parseBsiteCategorys(catg2, 2);
      }

      // 沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 (或者是site id 傳入"-")
      if (groupings) {
        console.log(
          "沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 ",
          groupings
        );
        parseBsiteCategorys(groupings);
        tools.setCache(`ai_category_${siteId}_cache`, groupings, 300);
      }
    }
    const parseBsiteCategorys = (data: catg[], block = 1 /* 1=bsiteShopItems, 2=shopItems */)=>{
      const grouping = Object.entries(data[0]).map((cat) => {
        const id = cat[0];
        const val = cat[1];
        const obj = getBottom(id, data[0]);
        const url = siteData.value
          ? `/${siteData.value.urlSuffix}/category/${id}`
          : `/category/${id}`;

        return {
          cid: val.cid,
          name: val.name,
          url: url,
          img_url: obj.img_url,
        };
      });

      if (block === 1) {
        bsiteShopItems.value = grouping.filter((v) => v);
      } else {
        shopItems.value = grouping.filter((v) => v);
      }
    }
    
    //找到該目錄結構最底層(為了取圖片)
    const getBottom = (ca:string, tr:any):any=> {
      if (!tr[ca]?.sub || Object.keys(tr[ca]?.sub).length === 0) {
        return tr[ca];
      }
      const newCa = Object.keys(tr[ca]?.sub)[0];
      const newTr = tr[ca].sub;

      return getBottom(newCa, newTr);
    }

    const init = async()=>{
      window.scrollTo(0, 0);
    if (siteData.value) {
      isBsite.value = true;

      const { siteType, siteId } = siteData.value || {};
      switch (siteType) {
        case "B4":
          getBsiteCategorys(siteId);
          break;
        case "B2":
          getBsiteCategorys();
          break;
        default:
          bsiteShopItemsTitle.value = "本站商品分類";
          shopItemsTitle.value = "友商推薦商品分類";
          getBsiteCategorys(siteId);
      }
    } else {
      getBsiteCategorys();
    }
    }

    init()


</script>