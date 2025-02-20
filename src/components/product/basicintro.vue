<template>
  <div class="basicintro">
    <div class="gap-line"></div>
    <div class="py-4 px-5" data-tab="簡介">
      <div class="product-intro text-c_mine_shaft text-sm break-words" v-html="introFilters"></div>
    </div>
    <div class="gap-line"></div>
  </div>
</template>

<script lang="ts" setup name="basicintro">
import { computed, toRefs } from 'vue';
import tools from '@/util/tools';


const props = defineProps<{ intro: string }>()
const { intro } = toRefs(props)

const introFilters = computed(() => {
  let content = intro.value;
  content = content.replace(/\\r\\n/g, "");
  content = tools.figureToIframe(content);
  return content;
})

</script>
<style lang="scss" scoped>
  product-intro{
    ::v-deep(p){
      strong{
        @apply font-[700] 
      }
    }
  }
</style>