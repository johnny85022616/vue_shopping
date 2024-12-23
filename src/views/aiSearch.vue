<template>
  <div class="category">
    <navigation :windowY="200" />
    搜尋頁
  </div>
</template>

<script lang="ts" setup name="category">
import navigation from '@/components/common/navigation.vue';
import api from "@/apis/api";
import { ref, toRef } from "vue";
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const props = defineProps(['query'])
// const {query} = toRef(props)

const init = async () => {
  console.log(props);
}

init()


</script>