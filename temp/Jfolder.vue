<script setup>
import gragVue from '../components/grag.vue';
import { ref, computed } from 'vue';
let clk = ref()
let isclk = ref(false)
function toggle() {
    console.log(clk.value.style.width)
    !isclk.value ? clk.value.style.width = 0 : clk.value.style.width = '250px'
    isclk.value = !isclk.value
}
let tree = ref({
    folder: []
})
let mainPath = ref(['/'])
let fileTree = (x) => {
    tree.value = x
    tree.value.folder.map(x => mainPath.value.push(Object.keys(x)[0]))
}
const isFolder = computed((x) => {
    return x.children && x.children.length
})
// let xxxx = ref([])
// const mainPath = computed(() => {
//     // let small = []

//     // small.find((x,index,arr)=>x.length>)
//     return small
// })

</script>
<template>
    <gragVue @fileTree="fileTree">

    </gragVue>
    <div class="card">
        <div class="folder">
            <div class="main">
                <div class="mainPath">
                    <ruby>
                        主路径<rt>Main path</rt>
                        <div></div>
                    </ruby>

                    <!-- <template>
                        
                    </template> -->


                </div>
                <p>
                    <p v-for="i in mainPath.sort()[0].split('/')">
                        <a href="" class="a">dfdfdgdfg{{i}}</a>
                    </p>
                    <!-- {{ mainPath.sort()[0] }} -->
                </p>
            </div>
            <div class="finf">
                一级文件夹
                {{}}
            </div>

        </div>

        <div class="line"></div>
        <div class="finfinf">
            <div class="main " ref="clk">
                <div style="width: 184.25px;">
                    <div>二级文件夹的内容</div>
                    <div>二级文件夹的内容</div>
                    <div>二级文件夹的内容</div>
                    <div>二级文件夹的内容</div>
                    <div>二级文件夹的内容</div>
                    <div>二级文件夹的内容</div>
                    <div>二级文件夹的内容</div>
                    <div>二级文件夹的内容</div>
                    <div>二级文件夹的内容</div>
                    <div>二级文件夹的内容</div>
                </div>
            </div>
            <!-- <div class="line"></div> -->
            <div class="clk" @click="toggle"></div>
            <div class="info ">
                <div>文件</div>
                <div>文件</div>
                <div>文件</div>
                <div>文件</div>
                <div>文件</div>
                <div>文件</div>
            </div>
        </div>
    </div>

</template>
<style lang="scss">
// body {
//     background: #eee;
// }

// a{
//     background-color: #333;
// }
a:after {
    background-color:rgb(2, 2, 2);
    // position: absolute;
    content: "";
    display: block;
    flex-shrink: 0;
    height: 12px;
    margin-right: .5rem;
    -webkit-mask-image: url(../assets/chevron.05a124d379047e16d746.svg);
    mask-image: url(../assets/chevron.05a124d379047e16d746.svg);
    -webkit-mask-size: 12px;
    mask-size: 12px;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
    width: 12px;
}
/* 滚动条 */
*::-webkit-scrollbar {
    width: 5px;
    // height: 8px;
}

// *::-webkit-scrollbar-track{
//   background-color: transparent;
// }
*::-webkit-scrollbar-thumb {
    // background: var(--bg-dark);
    // border-radius: 25px;
    background: #a3cdb1f8;
}

// *::-webkit-scrollbar-thumb:hover {
//     background: #a3cdb1f8;
// }

// *::-webkit-scrollbar,
// *::-webkit-scrollbar-thumb {
//     width: 6px;
//     border-radius: 13px;
//     background-clip: padding-box;
//     border: 0px solid transparent;
// }

// *::-webkit-scrollbar-thumb {
//     box-shadow: inset 0 0 0 10px #a3cdb1f8;
// }

.folder {
    display: flex;

    div {
        transition: all 320ms ease 0s !important;
    }

    >div {
        color: rgb(156, 156, 156);
        font-size: 2em;
        display: inline-block;
        margin: 0 10px;
        padding: 0 10px;
        // background-color: #eee;
        text-align: center;

        &:hover {
            background-color: #eee;
            color: rgb(113, 113, 113);
        }
    }

    .main {
        min-width: 200px;
        border-right: rgb(96, 189, 103) solid 2px;
        margin-right: 0;

        >.mainPath {
            position: relative;

            &:hover {
                padding-right: 140px;
            }
        }
    }

    .finf {
        display: flex;
        width: 100%;
        font-size: 1.7em;
        align-items: center;
        justify-content: center;
    }

}

.scroolbar {
    color: rgb(255, 255, 255);
    -webkit-text-fill-color: black;
    // transition: all .6s ease 1.6s !important;

    &:hover {
        color: rgba(0, 0, 0, 0.3);
    }
}

.finfinf {
    position: relative;
    display: flex;
    color: #688268;
    height: 300px;

    &>div {
        transition: all .66s cubic-bezier(0.66, 0, 0.01, 1) !important;
    }

    >div {
        // font-size: 2em;
        // padding: 0 10px;
        margin: 0 10px;
    }

    .main {
        background-color: #eff2ef;
        height: 100%;
        overflow: auto;
        overflow-x: hidden;
        width: 250px;
        font-size: 1.4em;

        div>div {
            padding: 10px 0;
            transition: background-color .3s ease;
            text-align: center;

        }

        div>div:hover {
            background-color: #d7e3d7;
        }
    }

    .info {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
        margin-right: 0;

        div {
            padding: 10px 0;
            border-bottom: #2cbc63 1px solid;
        }
    }

    .clk {
        position: absolute;
        background-color: rgb(92, 204, 141);
        width: 20px;
        height: 30px;
        top: calc(50% - 15px);
        left: -20px;
        z-index: 10;
    }

}

.line {
    width: 100%;
    height: 3px;
    background-color: #c4d8cc;
}

:root {
    font-size: 62.5%;
}

.card {
    min-width: 200px;
    background-color: #fff !important;
    border-radius: 7px !important;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 2px 0 !important;
    box-sizing: border-box !important;
    color: #333 !important;
    font-family: CerebriSans-Regular, -apple-system, BlinkMacSystemFont, Roboto,
        sans-serif !important;
    font-size: 100% !important;
    margin: 2em 0 0 !important;
    padding: 30px !important;
    text-align: initial !important;
    transition: all 350ms ease 0s !important;
}

@media screen and (min-width: 1024px) {
    .card {
        margin-left: 10% !important;
        margin-right: 10% !important;
    }
}

.card:hover {
    box-shadow: rgba(56, 60, 67, 0.07) 0 0 0 1px,
        rgba(56, 60, 67, 0.15) 0 8px 14px 1px !important;
}
</style>