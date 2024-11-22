<template>
  <div class="aiAllCategory">
    <navigation :windowY="200" :directShowSearchInput="true" />
    <breadcrumb v-if="breadCrumbData" :breadCrumbData="breadCrumbData" />
    <!-- <categoryMenu v-if="category" :items="category" /> -->
    <!-- <productMenu v-if="bCategoryData && bCategoryData.length>0" :data="bCategoryData" /> -->
  </div>
</template>

<script lang="ts" setup name="aiAllCategory">
import { computed, nextTick, ref } from "vue";
import useAtBottom from "@/hooks/useAtBottom";
import tools from "@/util/tools";
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";
import type { catg, group } from "@/types/category";
import type { anyObject } from "@/types/common";
import api from "@/apis/api";
import type { mixProduct } from "@/types/mixProducts";
import navigation from "../components/common/navigation.vue";
import breadcrumb from '../components/category/breadcrumb.vue';
const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);

const { isAtBottom, initScrollEvent } = useAtBottom();

const bCategoryData = ref<mixProduct[] | null>(null); //該目錄下所有商品資料
const breadCrumbData = ref(null); //麵包屑資料
const category = ref<null | anyObject>(null); //目錄資料
const tree = ref<catg | null>(null);
const isApiOk = ref(true);
const page = ref(0);
const totalPage = ref(0);
const pageSize = ref(1);
const catList = ref<any[]|null>(null);


const init = async()=>{
  await api.ai.getCategorys();
  getMenuData();
}

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
  catList.value = JSON.parse(JSON.stringify(catArr))

  if (catArr) {
    let sub = getSub(catArr, catTree);
    console.log(222222 , sub, catTree);
    if (sub) {
      menu = Object.values(sub).map((v: group) => {
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

//取得目前目錄下的資料
const getNowCat = (ca: string[], tr: catg)=>{
  return ca.reduce((t: catg|group, c: string , idx: number, arr: string[])=>{
    const catgTypeT = t as catg
    if(idx === arr.length-1) return catgTypeT[c]
    if(catgTypeT[c]?.sub){
      return catgTypeT[c]?.sub
    }
    return catgTypeT[c]
  } , tr)
}

const getSub = (ca: string[], tr: catg) => {
  return getNowCat(ca, tr).sub;
};

// const getBreadcrumb = ()=>{
//   const { catg } = tools.urlSearchToObj() as any;
//   const { urlSuffix } = siteData.value || {} 
//   let list : anyObject[] = [];
//   let url = "/category";
//   if (urlSuffix) {
//     url = `/${urlSuffix}/category`;
//   }
//   catList.value.forEach((cat) => {
//         url = url + `/${cat}`;
//         let catArr = this.tools.getUrlCategoryConstruction(url);
//         const nowCat = this.getNowCat(catArr, this.tree);
//         console.log(nowCat);
//         const obj = {
//           name: nowCat.name,
//           url,
//         };
//         list.push(obj);
//       });
//       //判斷是否加上cat=uni
//       if (catg) {
//         list = list.map((bred) => {
//           return {
//             ...bred,
//             url: bred.url + "?catg=uni",
//           };
//         });
//       }
// }

init()

</script>
