<template>
  <div v-if="isShow" class="topnav">
    <ul>
      <li v-for="(item, index) of breadCrumbData" :key="index">
        <a
          href=""
          @click.prevent="goPage(item.url)"
          :class="{ last: index === breadCrumbData.length-1}"
          >{{ item.name }}</a
        >
        <span v-if="index < breadCrumbData.length - 1">
          <i class="arrow"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup name="aiAllCategory">
import { ref } from 'vue';

  const init = async()=>{

  }

  const isShow = ref(true)
  const props = defineProps<{breadCrumbData: any[]}>()

  const goPage = (url:string)=>{
      location.href = url
  }

  init()

</script>

