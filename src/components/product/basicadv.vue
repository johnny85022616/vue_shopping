<template>
  <div>
    <div :class="['product-component-container']">
      <div class="product-detail">
        <div :class="['product-detail__title', 'tab-section']" data-tab="詳情">
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
    <div class="gap-line"></div>
  </div>
</template>

<script lang="ts" setup name="basicadv">
import { computed, ref, toRefs } from 'vue';
import api from '@/apis/api';
import tools from '@/util/tools';

const props = defineProps<{ pid: number }>()
const { pid } = toRefs(props)
const productDescription = ref<string | null>(null)


const copyNumber = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {
    alert(`已複製${content}至剪貼簿`);
  });
}

const productDescriptionFilters = computed(() => {
  let content = productDescription.value;
  if (content) {
    content = tools.replaceTplImagePath(content);
    content = tools.replaceWidthAndHeight(content);
    content = tools.figureToIframe(content);
  }
  return content;
})

const nowBrowserUrl = computed(() => {
  const isSuperApp = /super-app/i.test(document.cookie);
  return '【' + window.location.href + '】【' + navigator.userAgent + '】【isSuperApp:' + isSuperApp + '】';
})

// 取得簡介
const getProductDescription = async () => {
  productDescription.value = await api.product.getProductDescription(pid.value)
}

const init = async()=>{
  getProductDescription();
}

init()

</script>