<template>
  <div class="upload">
    <title>文件上传示例</title>
    <input type="file" @change="inputChange" id="fileInput" accept="image/*,video/*,.pdf,.doc,.docx,.txt,.xlsx" />
    <!-- 显示上传的文件 -->
    <div id="preview"></div>
    <div class="viewFileBlock w-1/2">
      <div class="w-2/3">
        <div v-if="type === 'image' && fileInfo" class="w-full">
          <img :src="fileInfo.src" alt="">
        </div>
        <div v-else-if="type === 'video'" class="w-full">
          <div v-if="videoImgUrl" class="relative">
            <img :src="videoImgUrl" alt="">
            <i class="product-images__play-icon w-[25px] h-[25px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-mediaPlay-icon bg-center bg-no-repeat bg-100%"></i>
          </div>
          <!-- 僅供影片首針截取使用 -->
          <video v-show="false" ref="video" controls autoplay width="100%" height="100%" :src="fileInfo.src"></video>
        </div>
        <div v-else-if="type !== ''">
          <img src="" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="upload">
import { nextTick, ref } from 'vue';

const type = ref<string>("") //file的
const fileInfo = ref<any | null>({}) //file資訊
const video = ref<any>(null)
const videoImgUrl = ref<string>("")

async function inputChange(event: any) {
  // 获取文件输入和预览div
  const previewDiv: any = document.getElementById('preview');
  const file = event.target.files[0]; // 获取选择的文件

  // 如果没有选择文件，直接返回
  if (!file) return;

  // 清空预览div
  previewDiv.innerHTML = '';

  // 检查文件类型
  const fileType = file.type.split('/')[0]; // 获取文件的类型，如 image 或 video
  // 如果是图片，创建 img 元素
  if (fileType === 'image') {
    type.value = fileType
    fileInfo.value.src = URL.createObjectURL(file); // 使用 FileReader 或 ObjectURL 显示图片
  } else if (fileType === 'video') {
    // 如果是视频，创建 video 元素
    type.value = fileType
    fileInfo.value.src = URL.createObjectURL(file); // 使用 FileReader 或 ObjectURL 显示图片
    
    await nextTick()
    const videoEle = video.value
    console.log("videoEle",videoEle);
    videoEle.onloadeddata = ()=>{
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context?.drawImage(videoEle, 0, 0, canvas.width, canvas.height);
      videoImgUrl.value = canvas.toDataURL("image/png");
    }
    
    // video.controls = true; // 添加播放控件
  } else {
    // 如果是其他文件，直接显示文件名
    const fileName = document.createElement('p');
    fileName.textContent = `上传的文件：${file.name}`;
    previewDiv.appendChild(fileName);

    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(file);  // 使用 ObjectURL 来创建临时的下载链接
    downloadLink.download = file.name; // 设置下载的文件名
    downloadLink.textContent = '点击下载文件';  // 设置下载链接的文本
    console.log("downloadLink", downloadLink);
    previewDiv.appendChild(downloadLink);
  }
}

</script>
