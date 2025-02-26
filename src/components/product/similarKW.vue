<template>
  <div class="similarKW text-c_mine_shaft text-sm pt-4 pb-4 pl-5">
    <span class="flex w-full overflow-auto noScrollBar">
      <a v-for="kw in keywords" :key="kw"
        class="bg-c_gallery w-fit border border-solid border-c_alto rounded-2xl no-underline py-1 px-2 whitespace-nowrap mr-1 last-of-type:mr-0"
        :href="`/aisearch?keyword=${encodeURIComponent(kw)}`">#{{ kw }}</a>
    </span>
  </div>
</template>

<script lang="ts" setup name="similarKW">
import { toRefs } from 'vue';

const props = defineProps<{ keywords: string[] }>()
const { keywords } = toRefs(props)
</script>
