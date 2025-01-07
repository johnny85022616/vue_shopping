<template>
  <div class="dialog fixed left-0 right-0 z-20 bottom-0 top-0 bg-c_white">
    <div v-if="!isFullscreen" class="opacity-50 bg-c_dune w-full"></div>
    <div class="box w-full h-full">
      <div class="header relative flex items-center justify-center text-lg border-b border-c_alto border-solid h-[45px]">
        <slot name="header"></slot>
        <i v-if="useClose" @click="close" class="absolute right-0 top-0 block w-11 h-11 bg-close-icon bg-center bg-no-repeat bg-100%"></i>
      </div>

      <div class="body relative pt-[10px] pr-[10px] pl-[10px] text-sm overflow-auto" :style="{backgroundColor: backgroundColor, 'height': 'calc(100vh - 45px)'}">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="product">
import { ref, toRefs } from 'vue';

const props = withDefaults(defineProps<{
  isFullscreen?: boolean,
  useClose?: boolean
  backgroundColor?: string
}>(), {
  isFullscreen: true,
  useClose: true
})

const emit = defineEmits(['closeDialog'])
const { isFullscreen } = toRefs(props)

const dialogready = ref(false)
const dialogHeight = ref(window.innerHeight + "px")
const bgHeight = ref("0px")
const boxHeight = ref(window.innerHeight + "px")
const bodyHeight = ref(window.innerHeight - 46 + "px")
const iframeHeight = ref(window.innerHeight - 46 + "px")
const bodyRef = ref<any>(null)

const calcuCntHeight = () => {
  dialogHeight.value = "0px"
  if (isFullscreen.value) {
    bgHeight.value = "0px";
    boxHeight.value = "100%";
  } else {
    bgHeight.value = window.innerHeight * 0.2 + "px";
    const boxH = window.innerHeight - window.innerHeight * 0.2;
    boxHeight.value = boxH + "px";
    bodyHeight.value = boxH - 56 + "px";
  }
  dialogready.value = true

  //check iframe ele and set iframe height
  const ifm: any = bodyRef.value?.querySelector(".body > iframe");
  if (ifm) {
    ifm.style.height = iframeHeight.value;
  }
}

const close = () => {
  emit('closeDialog')
}

const init = () => { }
init()
</script>