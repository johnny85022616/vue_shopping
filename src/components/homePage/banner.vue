<template>
  <div class="banners-wrap relative">
    <Carousel class="custom-carousel" :autoplay="3000" :loop="true" :autoplayTimeout="3000" :perPage="1"
      :paginationEnabled="false" :navigateTo="navigateTo" @pageChange="pageChange">
      <slide class="wrap-item" v-for="(item, index) of items" :key="index">
        <a :href="item.url" :title="item.description" class="ga-event" data-ga-category="首頁A1"
          :data-ga-label="item.title">
          <img class="rounded-none" :src="item.img" :alt="item.description" />
        </a>
      </slide>
    </Carousel>
    <span class="banners-wrap__counter absolute right-1 bottom-1 box-border py-1 px-2 rounded-lg text-c_white text-xs font-semibold flex justify-center items-center bg-c_black_transparent">{{ nowItemPage }}/{{ items.length }}</span>
  </div>
</template>

<script setup lang="ts" name="banner">
import { computed, reactive, ref } from 'vue';
import api from '@/apis/api';
import 'vue3-carousel/dist/carousel.css'
import {Carousel , Slide} from 'vue3-carousel'

  let items = ref<any[]>([]);
  const nowItemPage = ref(1);

  const pageChange = (val:number)=>{
      nowItemPage.value = val+1
    }

  const navigateTo = computed(()=>{
    return Math.floor(Math.random() * items.value.length)
  })

  const init = async()=>{
    const data = await api.web.getHomePageFridayBanner()
    items.value = data
  }
  init()
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import '../../style/color';
</style>
