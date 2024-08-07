<template>
  <div class="shortcutSlider">
    <div class="flex-wrapper">
      <div class="flex-item" v-for="(icon, ii) in items" :key="ii">
        <a @click="goPage($event, icon.url, icon.targetBlank)">
          <img :src="'https://event.shopping.friday.tw/event/homepage/mobile_icon/' +
            icon.img + '?ver=' + version
            " :alt="icon.description" />
          <h3>{{ icon.itemName }}</h3>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="shortcutSlider">
  import api from '@/apis/api';
  import { ref } from 'vue';

  const items = ref<any>(null)
  const version = ref<string>('')

  const goPage = (evt: Event, url: string, target: any) => {
    evt.preventDefault();
    if (evt) {
      evt.preventDefault();
      if (target) {
        window.open(url, "_blank");
      } else {
        location.href = url;
      }
    }
  }
  //friday卡禮拜二五用不同url
  const changeFridayCardUrl = () => {
    let d = new Date().getDay();
    if (d === 2 || d === 5) {
      items.value[3].url =
        "https://shopping.friday.tw/aipromotion/A23000735?WT.mc_id=&utm_source=friday&utm_medium=icon&utm_campaign=20230701_card";
    }
  }

  const getVersion = (): string => {
    const MONTH = new Date().getMonth() + 1;
    const DAY = new Date().getDate();
    const HOURS = new Date().getHours();
    return MONTH < 10 ? "0" + MONTH + DAY + HOURS : String(MONTH + DAY + HOURS);
  }

  const init = async () => {
    version.value = getVersion()
    items.value = await api.web.getSliderData(version.value)
    changeFridayCardUrl()
  }

  init()

</script>