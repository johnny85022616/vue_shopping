<template>
  <div>
    <!-- <div :class="['product-component-container', { 'no-padding': isSimpleProductCnt }]">
      <div class="product-detail">
        <div :class="['product-detail__title', 'tab-section', { 'no-padding': isSimpleProductCnt }]" data-tab="詳情">
          －商品詳情－
        </div>
        <div class="product-detail__content">
          <div class="product-detail__sku">
            <label></label>
            <span></span>
            <span class="url" @click="copyNumber(nowBrowserUrl)">&nbsp;</span>
          </div>
          <div v-html="productDescriptionFilters" ref="productDescriptionFilters" class="html-content"></div>
        </div>
      </div>
    </div>
    <div class="gap-line"></div> -->
  </div>
</template>

<script lang="ts" setup name="basicadv">
import { ref, toRefs } from 'vue';

const props = defineProps<{ pid: number }>()
const { pid } = toRefs(props)
const productDescription = ref<string | null>(null)


const copyNumber = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {
    alert(`已複製${content}至剪貼簿`);
  });
}


</script>