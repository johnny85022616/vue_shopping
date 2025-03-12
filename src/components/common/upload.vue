<template>
  <div class="basicadv">
    <title>文件上传示例</title>
    <input type="file" @change="inputChange" id="fileInput" accept="image/*,video/*,.pdf,.doc,.docx,.txt" />
    <!-- 显示上传的文件 -->
    <div id="preview"></div>
  </div>
</template>

<script lang="ts" setup name="basicadv">
import { ref, toRefs } from 'vue';


function inputChange(event:any){
  // 获取文件输入和预览div
  const previewDiv: any = document.getElementById('preview');
  const file = event.target.files[0]; // 获取选择的文件

  // 如果没有选择文件，直接返回
  if (!file) return;

  // 清空预览div
  previewDiv.innerHTML = '';

  // 检查文件类型
  const fileType = file.type.split('/')[0]; // 获取文件的类型，如 image 或 video

  if (fileType === 'image') {
    // 如果是图片，创建 img 元素
    const img = document.createElement('img');
    console.log(file);
    console.log(URL.createObjectURL(file));
    img.src = URL.createObjectURL(file); // 使用 FileReader 或 ObjectURL 显示图片
    img.style.maxWidth = '100%';
    previewDiv.appendChild(img);
  } else if (fileType === 'video') {
    // 如果是视频，创建 video 元素
    const video = document.createElement('video');
    console.log(file);
    console.log(URL.createObjectURL(file));
    video.src = URL.createObjectURL(file);
    video.controls = true; // 添加播放控件
    video.style.maxWidth = '100%';
    previewDiv.appendChild(video);
  } else {
    // 如果是其他文件，直接显示文件名
    const fileName = document.createElement('p');
    fileName.textContent = `上传的文件：${file.name}`;
    previewDiv.appendChild(fileName);
  }
}

</script>
