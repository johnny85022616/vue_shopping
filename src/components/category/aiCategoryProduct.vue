<template>
  <div class="category">
    這是小目錄
  </div>
</template>

<script lang="ts" setup name="category">


import tools from "@/util/tools";
import api from "@/apis/api";
import { ref } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useBsiteStore } from "@/stores/bsiteStore";
import { storeToRefs } from "pinia";

const bsiteStore = useBsiteStore();
const { siteData } = storeToRefs(bsiteStore);
const route = useRoute()
const catList = ref<string[]|null>(null);
const hasSub = ref(false)



const init = async () => {
}
init()

</script>