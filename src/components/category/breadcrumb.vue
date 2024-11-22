<template>
  <div class="topnav">
    <ul>
      <li v-for="(item, index) of breadCrumbData" :key="index">
        <RouterLink :class="{ last: index === breadCrumbData.length-1}" :to="{path: '/category/L0006'}">{{ item.name }}</RouterLink>
        <span v-if="index < breadCrumbData.length - 1">
          <i class="arrow"></i>
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

