<template>
  <div class="upload">
    <title>文件上传示例</title>
    <input type="file" @change="inputChange" id="fileInput" accept="image/*,video/*,.pdf,.doc,.docx,.txt,.xlsx" />
    <!-- 显示上传的文件 -->
    <div id="preview"></div>
    <div class="viewFileBlock flex items-center">
      <div v-for="(item, idx) in uploadList" class="w-[100px] h-[100px]">
        <div v-if="item.type === 'image' && item" class="w-full imageArea">
          <img :src="item.src" class="w-full aspect-square">
        </div>
        <div v-else-if="item.type === 'video'" class="w-full video">
          <div v-if="videoImgUrl" class="relative">
            <img :src="videoImgUrl" alt="">
            <i class="product-images__play-icon w-[25px] h-[25px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-mediaPlay-icon bg-center bg-no-repeat bg-100%"></i>
          </div>
          <!-- 僅供影片首針截取使用 -->
          <video ref="video" controls autoplay width="100%" height="100%" :src="item.src"></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="upload">
import { nextTick, ref } from 'vue';

const uploadList = ref<any[]>([])
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

  const fileInfo:{type?:string, src?: string, isVideoOpen?: boolean, videoKey?: number} = {}

  // 检查文件类型
  const fileType = file.type.split('/')[0]; // 获取文件的类型，如 image 或 video
  // 如果是图片，创建 img 元素
  if (fileType === 'image') {
    fileInfo.type = fileType
    fileInfo.src = URL.createObjectURL(file); // 使用 FileReader 或 ObjectURL 显示图片
  } else if (fileType === 'video') {
    // 如果是视频，创建 video 元素
    fileInfo.type = fileType
    fileInfo.src = URL.createObjectURL(file); // 使用 FileReader 或 ObjectURL 显示图片
    fileInfo.isVideoOpen = false,
    fileInfo.videoKey = new Date().getTime()
    // await nextTick()
    // const videoEle = video.value
    // console.log("videoEle",videoEle);
    // videoEle.onloadeddata = ()=>{
    //   const canvas = document.createElement("canvas");
    //   const context = canvas.getContext("2d");
    //   context?.drawImage(videoEle, 0, 0, canvas.width, canvas.height);
    //   videoImgUrl.value = canvas.toDataURL("image/png");
    // }
  } 
  // else {
  //   // 如果是其他文件，直接显示文件名
  //   const fileName = document.createElement('p');
  //   fileName.textContent = `上传的文件：${file.name}`;
  //   previewDiv.appendChild(fileName);

  //   // 创建下载链接
  //   const downloadLink = document.createElement('a');
  //   downloadLink.href = URL.createObjectURL(file);  // 使用 ObjectURL 来创建临时的下载链接
  //   downloadLink.download = file.name; // 设置下载的文件名
  //   downloadLink.textContent = '点击下载文件';  // 设置下载链接的文本
  //   console.log("downloadLink", downloadLink);
  //   previewDiv.appendChild(downloadLink);
  // }
  uploadList.value.push(fileInfo)
}

</script>
