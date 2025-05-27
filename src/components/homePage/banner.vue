<template>
  <div class="banners-wrap relative">
    <Carousel class="custom-carousel" :autoplay="3000" :loop="true" :autoplayTimeout="3000">
      <slide class="wrap-item" v-for="(item, index) of items" :key="index">
        <a
          :href="item.hyperlink"
          :title="item.description"
          class="ga-event"
          data-ga-category="首頁A1"
          :data-ga-label="item.title"
        >
          <img class="rounded-xl" :src="item.url" :alt="item.description" />
        </a>
      </slide>
    </Carousel>
  </div>
</template>

<script setup lang="ts" name="banner">
import { computed, reactive, ref, toRefs } from 'vue';
import api from '@/apis/api';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';

const props = defineProps<{items: any[]}>();
const {items} = toRefs(props);

const emit = defineEmits(['update:items']);

const init = async () => {
};
init();
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped></style>
