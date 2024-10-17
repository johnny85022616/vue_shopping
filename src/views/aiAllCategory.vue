<template>
  <div class="aiAllCategory">
    <navigation :windowY="200" :directShowSearchInput="true" />
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
    <productMenu v-if="bCategoryData && bCategoryData.length>0" :data="bCategoryData" />
  </div>
</template>

<script lang="ts" setup name="aiAllCategory">
import { nextTick, ref } from "vue";
import useAtBottom from "@/hooks/useAtBottom";
import tools from "@/util/tools";
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";
import type { catg } from "@/types/category";
import type { anyObject } from "@/types/common";
import api from "@/apis/api";
import type { mixProduct } from "@/types/mixProducts";

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);

const KVBannerFolder = "https://event.shopping.friday.tw/event/20231212/";
const KVBannerJson =
  "https://event.shopping.friday.tw/event/20231212/KVBanner.json";
const { isAtBottom, initScrollEvent } = useAtBottom();

const bCategoryData = ref<mixProduct[] | null>(null); //該目錄下所有商品資料
const breadCrumbData = ref(null); //麵包屑資料
const category = ref<null | anyObject>(null); //目錄資料
const tree = ref<catg | null>(null);
const hotRankingData = ref(null);
const KVBanners = ref(null);
const isApiOk = ref(true);
const page = ref(0);
const totalPage = ref(0);
const pageSize = ref(1);
const isShowBanner = ref(false);
const isFetnetEstore = ref(false);
const catList = ref(false);
const nowItemPage = ref(false);
const showFetLogoBoldLogo = ref(false);

//組categoryMenu資料
const getMenuData = async () => {
  const data: any = tools.urlSearchToObj();
  const catg = data?.catg;
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
          url: `${location.pathname}/${v.cid}${exSearch ? `${exSearch}` : ""}`,
          hasSub: vsub ? true : false,
        };
      });
    }
  }
  if (!menu || (menu && menu.length === 0)) {
    history.go(-1);
  }
  if (!menu) return;
  totalPage.value =
    menu.length % pageSize.value !== 0
      ? Math.floor(menu.length / pageSize.value + 1)
      : Math.floor(menu.length / pageSize.value);

  category.value = menu;
};

//取得下方商品目錄資料
const getCategoryData = async () => {
  let arr = [];
  if (category.value) {
    const nowPageArr = category.value.slice(
      page.value * pageSize.value,
      (page.value + 1) * pageSize.value
    );
    for (let cat of nowPageArr) {
      let tempGroups: any = {};
      const data = await getPrdApi(cat.id);

      if (data) {
        const d = data as mixProduct[];
        let productItemData = d.map((ele) => {
          return {
            ...ele,
            img: ele.image_url,
            name: ele.name,
            pid: ele.pid,
          };
        });
        tempGroups.category = cat;
        tempGroups.products = productItemData;
        arr.push(tempGroups);
      }
    }
    if (bCategoryData.value) {
      bCategoryData.value = bCategoryData.value.concat(arr);
    } else {
      bCategoryData.value = arr;
    }

    await nextTick();
    if (page.value < totalPage.value) {
      page.value += 1;
      isApiOk.value = true;
      isAtBottom.value = false;
    }
  }
};

//主題頁
// const getMThemeData=()=> {
//       let arr = [];
//       if (category.value) {
//         const nowPageArr = category.value.slice(
//           page.value * pageSize.value,
//           (page.value + 1) * pageSize.value
//         );
//         for (let cat of nowPageArr) {
//           let tempGroups = {};
//           const data = await tools.getYstdThemeData(
//             20,
//             cat.id,
//             null,
//             "category"
//           );

//           if (data && data.length > 0) {
//             let productItemData = data.map((ele) => {
//               return {
//                 ...ele,
//                 img: ele.image_url,
//                 name: ele.name,
//                 pid: ele.pid,
//               };
//             });
//             tempGroups.category = cat;
//             tempGroups.products = productItemData;
//             arr.push(tempGroups);
//           }
//         }
//         this.bCategoryData = this.bCategoryData.concat(arr);
//         this.$nextTick(() => {
//           if (this.page < this.totalPage) {
//             this.page += 1;
//             this.isApiOk = true;
//             this.isAtBottom = false;
//           }
//         });
//       }
//     }

//主站、B站(B1)取商品列表
const getPrdApi = async (apiCatg: string) => {
  const data: any = tools.urlSearchToObj();
  const catg = data?.catg;

  const { siteType, isOthersExposeToMe } = siteData.value || {};
  let postData: any = {
    type: 2,
    q1_x: 0.5,
    supplier_y:
      (siteData && !catg) ||
      ((siteType === "B1" || siteType === "b1") && isOthersExposeToMe === "N")
        ? 1
        : 0, // 若為bSite 且沒有帶 catg=uni 就設定為 1
    list_num: 20,
  };
  let keywords = "";

  if (siteData.value && siteData.value.supplierId && !catg) {
    postData.filter = {
      k: "1010",
      v: [siteData.value.supplierId, "", apiCatg, ""],
    };
  } else {
    postData.filter = tools.composeaiApiFilter("", "", apiCatg, keywords);
  }

  return await api.ai.getAiData("getalist", postData);
};

// 取得category快取
const getCatCache = (id: string): catg[] => {
  let siteId = "-";
  if (siteData.value && siteData.value.siteId) {
    siteId = siteData.value.siteId;
  }
  return tools.getCache(`ai_category_${siteId}_cache${id}`);
};

//取得傳入categor的最後一層物件
const getNowCat = (ca: string[], tr: catg) => {
  let c = ca.shift();
  const catId = c as string;
  if (ca.length === 0) {
    return tr[catId];
  }
  tr = tr[catId]?.sub as catg;
  return getNowCat(ca, tr);
};

const getSub = (ca: string[], tr: catg) => {
  return getNowCat(ca, tr).sub;
};
</script>
