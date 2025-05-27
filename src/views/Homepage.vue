<template>
  <navigation></navigation>
  <template v-if="!isB4">
    <template v-if="siteData && Number(siteData.skuCount) < 50 && isNotExposeToMeTag">
      <template v-if="isShowSimpleHomePage">
        <bsiteBanner />
        <div class="homepage-bottom">
        </div>
      </template>
      <template v-else-if="isShowListHomePage">
      </template>
    </template>
    <template v-else>
      <div class="homepage-top w-[95%] mx-auto mt-3">
        <template v-if="!siteData">
          <banner v-if="A1Data && A1Data.length>0" :items="A1Data"/>
          <shortcutSlider />
        </template>
        <template v-else>
          <bsiteBanner />
        </template>
      </div>
      <div class="text-sm w-[95%] mx-auto py-2">
        <a href="https://shopping.friday.tw/ec2/anti_grift" target="_blank"
          style="color: red; text-decoration: none;">【慎防詐騙】
          本公司不會主動聯繫要求您提供個人金融資料，也不會要求您操作ATM轉帳或網銀</a>
      </div>
      <discountAndHot v-if="!siteData" />
      <hotKeywords :isBsite="isBsite" />
      <div class="homepage-bottom">
        <aiRecProducts :windowY="windowY" />
      </div>
    </template>
  </template>
</template>

<script setup lang="ts" name="Homepage">
import api from "@/apis/api";
import { computed, ref } from "vue";
import navigation from "../components/common/navigation.vue";
import bsiteBanner from "@/components/homePage/bsiteBanner.vue";
import banner from "@/components/homePage/banner.vue";
import shortcutSlider from "@/components/homePage/shortcutSlider.vue";
import discountAndHot from "@/components/homePage/discountAndHot.vue";
import aiRecProducts from "@/components/homePage/aiRecProducts.vue";
import hotKeywords from "@/components/common/hotKeywords.vue";
import topic from "../components/topic/topic.vue";
import { useBsiteStore } from "../stores/bsiteStore";
import { storeToRefs } from "pinia";
import type { siteData } from "@/types/apiWeb";
import type { mixProduct } from "@/types/mixProducts";
import type { OrNull } from "@/types/util";

const BsiteStore = useBsiteStore();
const { siteData } = storeToRefs(BsiteStore); //siteData
const isBsite = ref(false);
const isysdt = ref(false); //是否為ysdt
const isB4 = ref(false); //是否為主題頁面
const isShowSimpleHomePage = ref(false); //是否為簡化版本首頁
const isShowListHomePage = ref(false); //是否為只有list的首頁
const isNotExposeToMeTag = ref(false);
const windowY = ref(0);
const currentY = ref(0);
const promoData = ref(null);
const notIsOthersExposeToMeData = ref<mixProduct[] | null>(null);
const cmsData = ref<OrNull<any>>(null);
const A1Data = computed(()=> (cmsData.value?.A1 || []))
const A2Data = computed(()=> (cmsData.value?.A2?.[0] || null))
const ICData = computed(()=> (cmsData.value?.IC || []))

//取得CMS入稿資料
async function getCmsData() {
  const data = await api.campaign.getCmsBanners();
  if (data) {
    cmsData.value = data;
  }
}

async function getNotIsOthersExposeToMeData() {
  let postData: any = {
    type: "3",
    q1_x: 0.5,
    supplier_y: 1,
    list_num: 100,
  };
  let sid = "";
  if (siteData.value) {
    const s = siteData.value.supplierId;
    if (s) {
      sid = s;
    }
  }
  postData.filter = {
    k: "1000",
    v: [sid, "", "", ""],
  };

  const data = await api.ai.getAiData("getalist", postData);
  return data;
}

const init = async () => {
  getCmsData()
  window.addEventListener(
    "scroll",
    () => {
      const wy = window.scrollY;
      windowY.value = wy;
      currentY.value = wy !== 70 && wy !== 0 ? wy : currentY.value;
    },
    {
      passive: true,
    }
  );

  if (siteData.value) {
    isBsite.value = true;
    if (siteData.value.urlSuffix === "ysdt") {
      isysdt.value = true;
    }
    if (siteData.value.siteType === "B4") {
      isB4.value = true;
    }

    if (
      siteData.value.siteType &&
      ["B1", "b1"].includes(siteData.value.siteType) &&
      siteData.value.isOthersExposeToMe === "N"
    ) {
      isNotExposeToMeTag.value = true;
      const d = await getNotIsOthersExposeToMeData();
      const data = d as mixProduct[];
      if (data) {
        if (data.length >= 50) {
          isShowSimpleHomePage.value = true;
          return;
        }
        isShowListHomePage.value = true;
        notIsOthersExposeToMeData.value = data;
      }
    }
  }
};

init();
</script>

<style lang='scss' scoped></style>
