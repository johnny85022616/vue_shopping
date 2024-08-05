<template>
  <div class="bsiteBanner">
    <carousel class="custom-carousel" :autoplay="true" :loop="true" :autoplayTimeout="8000" :perPage="1" :paginationEnabled="false" :navigationEnabled="false" :paginationPadding="5" :paginationSize="6" @page-change="getImgOneByOne">
      <!-- <slide :class="['wrap-item',{noPadding: item.img}]" v-for="(item, index) of items" :style="[{ 'background-image': item.bgurl ? `url(${item.bgurl})` : '' }]" :key="index">
        <div v-if="item.img" :class="['a1-mode']">
          <a v-if="item.link" :href="item.link">
            <img :src="item.img" />
          </a>
          <img v-else :src="item.img" />
        </div>
        <div v-else class="banner-item">
          <a v-for="(v, i) in item.data" :key="i" :href="v.link">
            <img :src="v.image_url" />
            <div>
              <span>{{ v.name }}</span>
              <span>{{ tools.priceFormat(v.price) }}</span>
            </div>
          </a>
        </div>
      </slide> -->
    </carousel>
  </div>
</template>

<script setup lang="ts" name="bsiteBanner">
import { reactive, ref, toRefs } from 'vue';
import {useBsiteStore} from '@/stores/bsiteStore';
import { storeToRefs } from 'pinia';
const bsiteStore = useBsiteStore();
const {siteData} = storeToRefs(bsiteStore)


  const items = reactive([])
  const hasBgImg = reactive([])

  const getData = async()=>{
    if(!siteData.value) return 
    const { siteType, isOthersExposeToMe } = toRefs(siteData.value)
    console.log(99 , siteType , isOthersExposeToMe);
    // let postData = {
    //   type: "3",
    //   q1_x: 0.5,
    //   supplier_y:
    //     (siteType === "B1" || siteType === "b1") && isOthersExposeToMe === "N"
    //       ? 1
    //       : 0.5, // 若為bSite 且沒有帶 catg=uni 就設定為 1,
    //   list_num: 100,
    // };
  }

  // get slide's current page
  const getImgOneByOne = (n:any) =>{}

  const init = async () => {
    await getData ()
  }

  init()

</script>

<style lang='scss' scoped></style>
