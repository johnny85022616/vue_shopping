<template>
  <div class="menutree">
  </div>
</template>

<script lang="ts" setup name="menutree">
import { ref } from 'vue';
import { useBsiteStore } from '@/stores/bsiteStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

  const bsiteStore = useBsiteStore()
  const {siteData} = storeToRefs(bsiteStore)
  const router = useRouter()

  const isBsite = ref(false)
  const bsiteShopItems = ref(null)
  const shopItems = ref(null)
  const bsiteShopItemsTitle = ref('全部分類')
  const shopItemsTitle = ref('全部分類')

  window.scrollTo(0, 0);
    if (siteData.value) {
      isBsite.value = true;

      const { siteType, siteId } = siteData.value || {};
      switch (siteType) {
        // case "B4":
        //   this.getBsiteCategorys(siteId);
        //   break;
        // case "B2":
        //   this.getBsiteCategorys();
        //   break;
        // default:
        //   this.bsiteShopItemsTitle = "本站商品分類";
        //   this.shopItemsTitle = "友商推薦商品分類";
        //   this.getBsiteCategorys(siteId);
      }
    } else {
      // this.getBsiteCategorys();
    }

    const goCategoryPage = (url:string, siteType = 1 /* 1 friDay本站 2 bSite本站 */)=> {
      if (siteData.value && siteType === 1) {
        url += "?catg=uni";
      }
      router.push(url)
    }


</script>