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
        <banner v-if="!siteData"/>
        <shortcutSlider></shortcutSlider>
      </div>
    </template>
  </template>
</template>

<script setup lang="ts" name="Homepage">
  import api from '@/apis/api';
  import { ref } from 'vue';
  import navigation from '../components/common/navigation.vue';
  import bsiteBanner from '@/components/homePage/bsiteBanner.vue';
  import banner from '@/components/homePage/banner.vue';
  import shortcutSlider from '@/components/homePage/shortcutSlider.vue';
  import topic from '../components/topic/topic.vue';
  import { useBsiteStore } from '../stores/bsiteStore';
  import { storeToRefs } from 'pinia';
  import type { siteData } from '@/types/apiWeb';
  import type { mixProduct } from '@/types/mixProducts';
  import type { aiProduct } from '@/types/aiProducts';

  const BsiteStore = useBsiteStore()
  const { siteData } = storeToRefs(BsiteStore) //siteData
  const isysdt = ref(false) //是否為ysdt
  const isB4 = ref(false) //是否為主題頁面
  const isShowSimpleHomePage = ref(false) //是否為簡化版本首頁
  const isShowListHomePage = ref(false) //是否為只有list的首頁
  const isNotExposeToMeTag = ref(false)
  const notIsOthersExposeToMeData = ref<mixProduct[] | aiProduct[] | null>(null)

  async function getNotIsOthersExposeToMeData() {
    let postData: any = {
      type: "3",
      q1_x: 0.5,
      supplier_y: 1,
      list_num: 100,
    };
    let sid = ""
    if (siteData.value) {
      const s = siteData.value.supplierId;
      if (s) {
        sid = s
      }
    }
    postData.filter = {
      k: "1000",
      v: [sid, "", "", ""],
    };

    const data = await api.ai.getAiData("getalist", postData);
    return data
  }

  const init = async () => {
    if (siteData.value) {
      if (siteData.value.urlSuffix === "ysdt") {
        isysdt.value = true
      }
      if (siteData.value.siteType === 'B4') {
        isB4.value = true
      }

      if (
        siteData.value.siteType && ["B1", "b1"].includes(siteData.value.siteType) &&
        siteData.value.isOthersExposeToMe === "N"
      ) {
        isNotExposeToMeTag.value = true
        const data = await getNotIsOthersExposeToMeData();
        console.log(data);
        if (data) {
          if (data.length >= 50) {
            isShowSimpleHomePage.value = true
            return
          }
          isShowListHomePage.value = true;
          notIsOthersExposeToMeData.value = data
        }
      }
    }
  }

  init()

</script>

<style lang='scss' scoped></style>
