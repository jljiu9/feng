<template>
    <el-drawer v-model="visible" :show-close="false" size='100%' :modal='false' direction="btt">
        <template #header="{ close, titleId, titleClass }">
            <div aria-label="A complete example of page header">
                <el-page-header @back="closeit" title="返回">
                    <template #content>
                        <div class="flex items-center">
                            <el-avatar class="mr-3" :size="32"
                                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                            <span class="text-large font-600 mr-3"> {{username}} </span>
                            <!-- <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
									操作面板
								</span> -->
                            <el-tag>操作面板</el-tag>
                        </div>
                    </template>
                    <!-- <template #extra>
                        <div class="flex items-center">
                            <el-button>Print</el-button>
                            <el-button type="primary" class="ml-2">Edit</el-button>
                        </div>
                    </template> -->
                    <div class="drawer-draw">
                        <div width="200px" class="sider" ref="clk">
                            <el-tag class="demo-item" style="background-color: white;color: #aabaca;">一叶 | 纳物</el-tag>
                            <div class="div-profile">
                                <div class="xximg"
                                    style="background-image: url(&quot;https://img.aliyundrive.com/avatar/d6b1440e3d7e43cda9eb99d05cbc562f.jpeg&quot;);">
                                </div>
                                <div
                                    style="margin-bottom: 0px;background-color: #ebebeb; padding:5px 15px;border-radius: 10px;color: #a6a6a6;">
                                    {{username}}</div>
                                <div
                                    style="margin-top: 0px;background-color: #ebebeb; padding:5px 20px;border-radius: 10px;color: #a6a6a6;">
                                    {{email}}</div>
                                <div
                                    style="margin-top: 0px;background-color: #ebebeb; padding:5px 20px;border-radius: 10px;color: #a6a6a6;">
                                    无限容量    
                                </div>
                                <div
                                    style="margin-top: 0px;background-color: #ebebeb; padding:5px 20px;border-radius: 10px;color: #a6a6a6;">
                                    已使用<br><b>xx</b>个文件<br><b>xx</b>个文件夹    
                                </div>

                                <!-- <el-tag style="color: rgb(0 106 241);">用一句话来形容你</el-tag> -->
                                <div class="aBtn">
                                    修改个人信息
                                </div>
                                <!-- <div class="div-actions--1uQW9"><button
                                        class="button-button--2Aa4u-secondary--3kCfF-medium--Es9TS-btn--2djJ4">分享我的主页</button>
                                </div> -->
                            </div>

                            <!-- <p v-for="item in 6" :key="item" class="demo-item">{{ item }}</p> -->
                        </div>
                        <div class="clk" @click="toggle()"></div>
                        <el-tabs tab-position="left" style="height: 100%;width: 100%;" class="demo-tabs" v-model="tabs">
                            <el-tab-pane label="上传" name="upload" v-if="!query">
                                <upload></upload>
                            </el-tab-pane>
                            <el-tab-pane label="视频播放器" name="play">
                                <div class="content">
                                    <video id="player" playsinline controls data-poster="" style="max-height: calc(100vh - 80px);">
                                        <source />
                                    </video>

                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="我的喜欢" name="love" v-if="!query">我的喜欢</el-tab-pane>
                            <el-tab-pane label="我的分享" name="share" v-if="!query">我的分享</el-tab-pane>
                            <!-- <el-tab-pane label="编辑资料" name="profile">资料</el-tab-pane> -->
                            
                        </el-tabs>
                        
                    </div>
                </el-page-header>
            </div>
        </template>

    </el-drawer>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import upload from './upload.vue'
import Plyr from 'plyr';

// 返回事件，退到主页面
let closeit = () => window.drawer.value = false

let query = window.query

// tab面板
let tabs = ref('')
tabs.value = 'upload'
window.tabs = tabs

// 不用管
let isclk = ref(false)
function toggle() {
    let sider = document.querySelectorAll('.sider')[1]
    if (!isclk.value) {
        sider.style.minWidth = 0;
        sider.style.width = 0
    } else {
        sider.style.minWidth = '250px'
    }
    isclk.value = !isclk.value
}


let visible = window.drawer
// 用于在template中展示
let username = window.username
let email = window.email

onMounted(() => {
    const player = new Plyr('#player');
    window.aplayer = player
    toggle()
})
</script>
<style lang="scss">

.demo-tabs>.el-tabs__content {
    padding: 0px;
    color: #6b778c;
    font-size: 15px;
    //   font-weight: 600;
}

.div-profile {
    align-items: center;
    background-color: #f5f5f6;
    border-radius: 10px;
    border-style: initial;
    border-width: 0;
    box-sizing: border-box;
    color-scheme: light;
    display: flex;
    flex-direction: column;
    font-size: 100%;
    margin: 0;
    padding: 24px;
    scroll-behavior: smooth;
    vertical-align: baseline;
    width: 100%;

    &>div {
        margin: 10px 0;
    }
}


.xximg {
    background-image: url(https://img.aliyundrive.com/avatar/d6b1440e3d7e43cda9eb99d05cbc562f.jpeg);
    background-position: 50% center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    border-style: initial;
    border-width: 0;
    box-sizing: border-box;
    color-scheme: light;
    font-family: inherit;
    font-size: 100%;
    height: 100px;
    margin: 0;
    opacity: 1;
    padding: 0;
    scroll-behavior: smooth;
    transition: opacity .3s;
    vertical-align: baseline;
    width: 100px;
}

.textEllipsis {
    // width: 160px;
    // height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}

.drawer-draw {
    // position: relative;
    display: flex;
    height: calc(100vh - 68px);

    &>div {
        transition: all .66s cubic-bezier(0.66, 0, 0.01, 1) !important;
    }

    // >div {
    //     // font-size: 2em;
    //     // padding: 0 10px;
    //     // margin: 0 10px;
    // }

    .sider {
        // background-color: #f7f7f7;
        height: 100%;
        overflow: auto;
        overflow-x: hidden;
        min-width: 200px;

        // font-size: 1.4em;

        div>div {
            // margin: 10px 0;
            transition: background-color .3s ease;
            text-align: center;

        }

        // div>div:hover {
        //     background-color: #d7e3d7;
        // }
    }

    .content {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
        margin: 0 10px;
        display: flex;
        align-items: center;
        // div {
        //     padding: 10px 0;
        //     // border-bottom: #2cbc63 1px solid;
        // }
    }

    .clk {
        position: absolute;
        background-color: rgb(92, 204, 141);
        width: 20px;
        height: 30px;
        top: calc(50% - 15px);
        left: -15px;
        z-index: 10;
        margin: 0 10px;
    }

}
</style>