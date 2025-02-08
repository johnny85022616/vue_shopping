<template>
  <div class="dialog fixed left-0 right-0 z-20 top-0 bottom-0 bg-[rgba(0,0,0,.6)]">
    <div class="w-full h-full relative">
      <transition name="slide">
        <div v-if="whiteBoxClose" class="box w-full absolute bottom-0 bg-c_white rounded-t-xl">
          <div class="header relative flex items-center justify-center text-lg border-b border-c_alto border-solid h-[45px]">
            <slot name="header"></slot>
            <i @click="close" class="absolute right-0 top-0 block w-11 h-11 bg-close-icon bg-center bg-no-repeat bg-100%"></i>
          </div>
    
          <div class="body relative pt-[10px] pr-[10px] pl-[10px] text-sm overflow-auto max-h-[80vh]">
            <slot name="body"></slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup name="product">
import { ref } from 'vue'

const whiteBoxClose = ref(false)
const emit = defineEmits(['closeDialog'])

const close = () => {
  emit('closeDialog')
}

const init = () => { 
  setTimeout(()=>{
    whiteBoxClose.value = true
  },50)
}
init()
</script>