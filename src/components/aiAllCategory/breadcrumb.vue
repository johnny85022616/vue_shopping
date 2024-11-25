<template>
  <div class="topnav block px-5 py-2 min-h-5 bg-c_background">
    <ul>
      <li class="group inline list-none text-c_sliver" v-for="(item, index) of breadCrumbData" :key="index">
        <RouterLink :class="'text-sm text-c_sliver no-underline group-last:text-c_mine_shaft'" :to="{path: item.url}">{{ item.name }}</RouterLink>
        <span class="px-1 text-center align-middle" v-if="index < breadCrumbData.length - 1">
          <i class="inline-block w-3 h-3"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup name="breadcrumb">
import { ref } from 'vue';
import { RouterLink } from "vue-router";

  const props = defineProps<{breadCrumbData: any[]}>()
  const init = async()=>{
  }

  init()

</script>

