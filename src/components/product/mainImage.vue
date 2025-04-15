<template>
  <div class="productImg relative">
    <template v-if="imagesData.length > 0">
      <carousel class="custom-carousel w-full" :loop="false" :autoplayTimeout="5000" :perPage="1"
        :paginationEnabled="false">
        <slide v-for="(item, index) of imagesData" :key="index" class="carousel-slide">
          <img :src="item.image_url" :style="imgStyle"/>
          <i v-if="item.isVideo" @click="openVideo" class="product-images__play-icon w-[80px] h-[80px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-mediaPlay-icon bg-center bg-no-repeat bg-100%"></i>
        </slide>
      </carousel>
    </template>
    <transition name="slide">
      <fullscreenDialog v-if="isShowVideo">
        <template v-slot:header>商品影片</template>
        <template v-slot:body>
          <div class="product-images__youtube-iframe flex items-center h-full bg-c_black">
            <iframe v-if="isYoutubeVideo" type="text/html" id="youtubeIframe"
              :src="`https://www.youtube.com/embed/${videoId}?enablejsapi=1&amp;version=3&amp;playerapiid=ytplayer`"
              frameborder="0" :style="youtubeIframeStyle"></iframe>
            <video v-else controls autoplay width="100%" height="100%">
              <source :src="videos?.[0]||''" type="video/mp4">
            </video>
          </div>
        </template>
      </fullscreenDialog>
    </transition>
  </div>
</template>

<script lang="ts" setup name="maiaImg">
import tools from '@/util/tools';
import fullscreenDialog from '@/components/common/fullscreenDialog.vue';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import { computed, provide, ref, toRefs } from 'vue';

const isShowVideo = ref(false)
const isYoutubeVideo = ref(true)
const videoId = computed(() => {
  return videos.value?.[0] && tools.getYoutubeId(videos.value[0]) || ""
})
//圖片data整理
const imagesData = computed(() => {
  if (!images.value) return []
  let imageObj = images.value.map((v, i) => {
    return {
      image_url: v,
      isVideo:
        i === 0 && videos.value?.[0] && videos.value[0].match(/v=([\d\w]+)/i)
          ? true
          : false,
    };
  });
  // 判斷是否商品帶影片
  if (videos.value?.[0]) {
    // 是否為Youtube連結。解析iframe
    if (videoId.value) {
      imageObj = [
        {
          image_url: `https://i.ytimg.com/vi/${videoId.value}/hqdefault.jpg`,
          isVideo: true,
        },
        ...imageObj,
      ];
    }

    // 是否為mp4檔案連結。解析video tag
    if (/\.mp4$/i.test(videos.value[0])) {
      const firstImg = imageObj[0];
      imageObj[0] = {
        image_url: firstImg.image_url,
        isVideo: true,
      };
    }
  }

  return imageObj;
})

const imgStyle = computed(() => {
  const ww = window.innerWidth;
  return {
    width: "100%",
    height: ww + "px",
  };
})
const youtubeIframeStyle = computed(() => {
  return {
    width: "100%",
    height: Math.floor(window.innerWidth / 1.77) + "px",
    left: "0px",
  };
})

const props = defineProps<{ images?: string[], videos?: string[] }>()
const { images, videos } = toRefs(props)

// 關閉影片
const closeVideo = () => {
  isShowVideo.value = false
}
const openVideo = () => {
  isShowVideo.value = true
}

provide('closeDialog',closeVideo)

const init = () => {

  if (videos.value && /\.mp4/i.test(videos.value[0])) {
    isYoutubeVideo.value = false;
  }

}

init()
</script>