<template>
  <div id="banners-wrap" class="banners-wrap">
    <Carousel class="custom-carousel" :autoplay="1" :loop="true" :autoplayTimeout="3000" :perPage="1"
      :paginationEnabled="false" :navigateTo="navigateTo" @pageChange="pageChange">
      <slide class="wrap-item" v-for="(item, index) of items" :key="index">
        <a :href="item.url" :title="item.description" class="ga-event" data-ga-category="首頁A1"
          :data-ga-label="item.title">
          <img :src="item.img" :alt="item.description" />
        </a>
      </slide>
    </Carousel>
    <span class="banners-wrap__counter">{{ nowItemPage }}/{{ items.length }}</span>
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

.banners-wrap {
  position: relative;
  border-radius: 10px;

  .banners-wrap__counter {
    position: absolute;
    right: 5px;
    bottom: 10px;
    box-sizing: border-box;
    padding: 1px 5px;
    border-radius: 10px;
    color: $white;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 19px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    margin-bottom: 5px;
    border-radius: 10px;
  }
}
</style>
