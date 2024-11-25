<template>
  <div v-if="items.length > 0" class="categoryMenu flex bg-c_background text-center text-sm pb-2 pl-2 leading-4">
    <div class="flex w-full overflow-auto">
      <RouterLink class="relative min-w-[120px] min-h-[50px] mr-1 py-2 px-2 border border-solid border-c_dustygray rounded text-c_dustygray no-underline bg-c_white flex items-center justify-center" v-for="(item, index) of items" :key="index" :to="item.url" :title="item.itemName">
        <p>{{ item.itemName }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup name="categoryMenu">
import { RouterLink } from "vue-router";

const props = defineProps<{items: any[]}>()
  
  const init = async()=>{
  }

  init()

</script>