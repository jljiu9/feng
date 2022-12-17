<template>
    <div class="dropbox">
        <div class="div-el-upload__text">点击上传 或 拖拽文件到此区域</div>
    </div>
    <div style="display:none">
        <canvas id="canvas" display="none"></canvas>
        <!-- <video :src="currentUploadFile.file"></video> -->
    </div>
    <form id="uploadArea">
        <div class="flex"
            style="flex-wrap: wrap;;align-items: center;justify-content: center; width: 190px;flex-direction: column;">
            <el-progress type="dashboard" :percentage="percentage" :color="colors" />
            <div class="imgBox" v-if="currentUploadFile">
                <div class="preview" v-if="currentUploadFile.type == 'image'">
                    <img style="display: none;" :src="currentUploadFile.file"
                        @load="load_img($refs.img, currentUploadFile.name)" ref="img" fit="contain">
                </div>
                <div class="preview" v-if="currentUploadFile.type == 'video'">
                    <video id="video1" controls autoplay style="display: none;"
                        @play="play_video($refs.video, currentUploadFile.name)" :src="currentUploadFile.file"
                        ref="video">
                        <source>
                    </video>
                </div>
                <div style="position: relative;" v-if="currentUploadFile.type !== 'image' && currentUploadFile.type !== 'video'">
                    <div class="preview">
                        <img src="/src/img/files.png" alt="" fit="contain" style="height: 86%;">
                    </div>
                    <span
                        style="cursor: pointer;position: absolute; top: 50%;left: 50%;transform: translate(-50%, -46%);">
                        {{ currentUploadFile.name.split('.')[currentUploadFile.name.split('.').length - 1] }}
                    </span>
                </div>
                <div>
                    <p>{{ currentUploadFile.name }}</p>
                    <p>{{currentUploadFile.time}} | {{ currentUploadFile.size }}</p>
                </div>
            </div>
            <div style="width: 100%; display: flex;align-items: center;justify-content: center;">
                <el-button id="stop">取消当前</el-button><br>
                <el-button id="continue">重新开始
                </el-button>
            </div>
            <!-- <h6 id="status"></h6> -->
        </div>
        <input type="file" name="file1" id="upload" multiple style="display: none;"><br>
        <p id="loaded_n_total"></p>
        <div id="uploaded" style="min-width: 40%;height: 100%;padding: 20px;">
            <template v-for="item in uploaded">
                <div style="padding: 5px 0;">
                    <template v-if="item.upload == '秒'">
                        <el-tag>秒传</el-tag>{{ item.name }}
                    </template>
                    <template v-else>
                        {{ item.name }}
                    </template>
                </div>
            </template>
        </div>
    </form>
</template>
  
<script setup >
import {  ref, watch, reactive } from 'vue'

// let md5List = ref({})
// window.md5List = md5List

let postRtnJson = async (url, body, header) => {
    const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: header,
    });
    let json = await response.json();
    return json
}

// 存储已上传的文件
let uploaded = reactive([])
window.uploaded = uploaded


// 这个说不清楚
let aname = ref('')
let bb = ref()
let preview_url = ref()
let time = 0
watch(uploaded, async (xx, old) => {
    if (time == 1) {
        time--
        return
    }
    time++
    console.log(xx)
    xx[0].preview = preview_url.value
    cl(xx[0].type == 'another')
    if (xx[0].type == 'another') return
    let u = xx.find(x => x.name == aname.value && x.path == window.location.pathname)
    console.log(u)
    console.log({
        name: aname.value + '.jpg',
        size: bb.value.size,
        type: bb.value.type
    })
    console.log(aname.value)
    console.log(bb)
    let upload = await postRtnJson('/api/upload', {
        name: aname.value + '.jpg',
        size: bb.value.size,
        type: bb.value.type
    })
    console.log(upload)
    console.log(bb.value)
    let res = await fetch(upload.put, {
        method: 'put',
        body: bb.value,
        headers: upload.header
    })
    if (res.status == 200) {
        await postRtnJson('/api/setpreview', {
            md5: u.md5,
            path: decodeURI(u.path.replaceAll('/', `\\`)),
            name: u.name,
            preview: upload.url,
            id: upload.url.match(/(?<=secure.notion-static.com\/)[A-Za-z0-9-]+(?!\/)/)[0]
        })
    }
})

let wait = ms => new Promise((s) => setTimeout(s, ms))
// 生成视频预览图
let play_video =async (x, name) => {
    // console.log(name)
    aname.value = name
    x.muted = true
    x.currentTime= x.duration/2
    cl(x.currentTime)
    await wait(200)
    let canvas = document.querySelector('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = 0
    canvas.height = 0
    canvas.width = x.videoWidth/2
    canvas.height = x.videoHeight/2
    ctx.drawImage(x, 0, 0, x.videoWidth/2, x.videoHeight/2)
    canvas.toBlob(async blob => {

        let img_x = new Image()
        let url = URL.createObjectURL(blob)
        img_x.src = url
        preview_url.value = url
        // console.log(x.parentNode.querySelector('img'))
        if (x.parentNode.querySelector('img')) {
            x.parentNode.removeChild(x.parentNode.querySelector('img'))
        }
        x.parentNode.appendChild(img_x)
        x.pause()
        // blob

        let preview = new File([blob], name, { type: blob.type })
        bb.value = preview

        console.log(preview)
    }, 'image/jpeg', 0.7)
    // document.querySelector('.video-preview').src = 
}

// 进度条
const percentage = ref(0)
window.percentage = percentage
// 当前上传的文件
const currentUploadFile = ref()
window.currentUploadFile = currentUploadFile

// 上传进度条颜色变换
const colors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f7ad3', percentage: 100 },
]
// 生成图片预览图
let load_img = (x, name) => {
    aname.value = name
    let canvas = document.querySelector('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = 0
    canvas.height = 0
    canvas.width = x.width/2
    canvas.height = x.height/2
    ctx.drawImage(x, 0, 0, x.width/2, x.height/2)
    canvas.toBlob(blob => {
        let img_x = new Image()
        let url = URL.createObjectURL(blob)
        img_x.src = url
        preview_url.value = url
        if (x.parentNode.querySelector('img:nth-child(2)')) {
            x.parentNode.removeChild(x.parentNode.querySelector('img:nth-child(2)'))
        }
        x.parentNode.appendChild(img_x)

        let preview = new File([blob], name, { type: blob.type })
        bb.value = preview
    }, 'image/jpeg', 0.7)
}

</script>
<style lang="scss">
#uploadArea {
    width: 100%;
    height: 80%;
    display: flex;
    // align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}

.el-progress-circle {
    height: 150px !important;
    width: 150px !important;
}

.dropbox {
    background-color: #fff;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    box-sizing: border-box;
    cursor: pointer;
    overflow: hidden;
    padding: 40px 10px;
    position: relative;
    text-align: center;
    user-select: none;

    &:hover {
        border-color: var(--el-color-primary);
    }
}

.div-el-upload__text {
    color: #606266;
    font-size: 14px;
    text-align: center;
    user-select: none;
}
</style>