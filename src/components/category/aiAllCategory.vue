<template>
  <div class="aiAllCategory">
    <navigation :windowY="200" :directShowSearchInput="true" />
    <breadcrumb v-if="breadCrumbData" :breadCrumbData="breadCrumbData" />
    <categoryMenu v-if="category" :items="category" />
    <productMenu v-if="bCategoryData && bCategoryData.length > 0" :data="bCategoryData" />
  </div>
</template>

<script lang="ts" setup name="aiAllCategory">
import navigation from "@/components/common/navigation.vue";
import breadcrumb from '@/components/aiAllCategory/breadcrumb.vue';
import categoryMenu from '@/components/aiAllCategory/categoryMenu.vue';
import productMenu from '@/components/category/productMenu.vue';
import type { catg, group } from "@/types/category";
import type { anyObject } from "@/types/common";
import type { mixProduct } from "@/types/mixProducts";
import { nextTick, onUpdated, ref, toRefs, watch } from "vue";
import useAtBottom from "@/hooks/useAtBottom";
import tools from "@/util/tools";
import api from "@/apis/api";
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const { isAtBottom, initScrollEvent } = useAtBottom();

const bCategoryData = ref<mixProduct[] | null>(null); //該目錄下所有商品資料
const breadCrumbData = ref<anyObject[] | null>(null); //麵包屑資料
const category = ref<null | anyObject[]>(null); //目錄資料
const isApiOk = ref(true);
const page = ref(0);
const totalPage = ref(0);
const pageSize = ref(1);
const route = useRoute()

const props = defineProps<{ catList: string[] | null, tree: catg | null, }>()
const { catList, tree } = toRefs(props)

const init = async () => {
  await getMenuData();
  getBreadcrumb();
  initScrollEvent()
  if (!siteData.value) {
    await getCategoryData()
  }
}

//組categoryMenu資料
const getMenuData = async () => {
  const data: any = tools.urlSearchToObj();
  const catg = data?.catg;
  const exSearch = catg ? "?catg=" + catg : "";
  let menu;

  if (catList.value && tree.value) {
    let sub = getSub(catList.value, tree.value);
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
    alert("發生錯誤")
  }
  if (!menu) return;
  totalPage.value = Math.ceil(menu.length / pageSize.value)
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
      isApiOk.value = false
      const data = await getPrdApi(cat.id);

      // 取得該目錄曝光連結
      const proLinks = !siteData.value
        ? await api.promotion.getCategoryPromotionLinks(cat.id)
        : [];

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
        tempGroups.proLinks = proLinks;
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

//取得目前目錄下的資料
const getNowCat = (ca: string[], tr: catg) => {
  return ca.reduce((t: catg | group, c: string, idx: number, arr: string[]) => {
    const catgTypeT = t as catg
    if (idx === arr.length - 1) return catgTypeT[c]
    return catgTypeT[c]?.sub || catgTypeT[c];
  }, tr)
}

const getSub = (ca: string[], tr: catg) => {
  return getNowCat(ca, tr).sub;
};

//取得麵包屑資料
const getBreadcrumb = () => {
  const { catg } = tools.urlSearchToObj() as any;
  const { urlSuffix } = siteData.value || {}
  let list: anyObject[] = [];
  let url = "/category";
  //B站
  if (urlSuffix) {
    url = `/${urlSuffix}/category`;
  }
  if (!catList.value || !tree.value) return
  catList.value?.reduce((arr: string[], cat: string) => {
    arr.push(cat)
    url = url + `/${cat}`;
    const treeObj = tree.value as catg
    const nowCat = getNowCat(arr, treeObj);
    const obj = {
      name: nowCat?.name,
      url,
    };
    list.push(obj);
    return arr
  }, []);
  //判斷是否加上cat=uni
  if (catg) {
    list = list.map((bred) => {
      return {
        ...bred,
        url: bred.url + "?catg=uni",
      };
    });
  }
  breadCrumbData.value = list
}

init()

//監視router變化重新執行init方法
watch(() => route.path, (newVal, oldVal) => {
  if (newVal && newVal.length > 0 && oldVal && oldVal.length > 0 && newVal !== oldVal) {
    init()
  }
})
watch(isAtBottom, (val) => {
  if (bCategoryData.value && bCategoryData.value.length > 0 && page.value < totalPage.value && isApiOk.value && val) {
    if (siteData.value && siteData.value.siteType === 'B4') {
      console.log("getThemeData here");
      return
    }
    getCategoryData()
  }
})



</script>
