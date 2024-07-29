<template>
  <navigation></navigation>
  <template>
  </template>
</template>

<script setup lang="ts" name="Homepage">
  import { ref } from 'vue';
  import navigation from '../components/common/navigation.vue';
  import topic from '../components/topic/topic.vue';
  import { useBsiteStore } from '../stores/bsiteStore';
  import { storeToRefs } from 'pinia';
import type { siteData } from '@/types/apiWeb';

  const BsiteStore = useBsiteStore()
  const { siteData } = storeToRefs(BsiteStore) //siteData
  const isysdt = ref(false) //是否為ysdt
  const isB4 = ref(false) //是否為主題頁面
  const isNotExposeToMeTag = ref(false)

  if (siteData.value) {
    if (siteData.value.urlSuffix === "ysdt") {
      isysdt.value = true
    }
    if(siteData.value.siteType === 'B4'){
      isB4.value = true
    }

    if (
      siteData.value.siteType && ["B1", "b1"].includes(siteData.value.siteType) &&
      siteData.value.isOthersExposeToMe === "N"
      ) {
        isNotExposeToMeTag.value = true
      }
  }

</script>

<style lang='scss' scoped></style>
