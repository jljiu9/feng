<template>
    <nav class='kuang' ref='kuang'></nav>
    <div class="left-button" ref="left_button"
        :class="{ 'isActive': clk ? !blankArea : '', 'isActive-plus': clk ? blankArea : '' }">
        <!-- 右键菜单 -->
        <ul class="menu-list">
            <li class="menu-item" v-if="blankArea" v-for="i in itemPlus" :key="i">
                <span>
                    {{ i }}
                </span>
            </li>
            <!-- <li class="menu-item-devider"></li> 
                    :ref="i" @click="rightClk($refs[i][0])"
            -->
            <template v-else v-for="i in item">
                <li class="menu-item" v-if="i == '下载'">
                    <a ref="download" style="width: 100%;">
                        <span style="width: 100%;">
                            {{ i }}
                        </span>
                    </a>
                </li>
                <!-- <li class="menu-item" v-if="i == '标记喜欢😍'">
                    <span  style="text-decoration:line-through;">
                        {{ i }}
                    </span>
                </li> -->
                <li class="menu-item" v-else>
                    <span>
                        {{ i }}
                    </span>
                </li>
            </template>
        </ul>
    </div>
</template>
  
<script setup>
import { ref, onMounted, h } from 'vue'
import { useClipboard } from '@vueuse/core'
const { copy } = useClipboard()

// let rightClk = (x)=>{
//     console.log(x.innerText)
// }

let clk = ref(false)
let left_button = ref()
let download = ref()
let downloadItems = ref()
let shareItem = ref()
window.shareItem = shareItem
let blankArea = ref(false)

let itemPlus = [
    '新建文件夹',
    '上传文件',
    '...',
]
let item = [
    '下载',
    '分享',
    '重命名',
    '用potplayer打开',
    // '标记喜欢😍',
    '切换图片视图'
]
let kuang = ref()
// let nihao = ref('')
let xuan = (e, top, left) => {
    let tp = Math.min(top, e.y)
    let lf = Math.min(left, e.x)
    let x = Math.max(left, e.x)
    let y = Math.max(top, e.y)
    let style = kuang.value.style
    style.top = tp + window.scrollY + 'px'
    style.left = lf + window.scrollX + 'px'
    style.height = y - tp + 'px'
    style.width = x - lf + 'px'
    style.display = 'block'
    return [tp, lf, x, y]
}
let elem_items = (A) => {
    if (A == undefined) A = [1, 2, 3, 4]
    let [tp, lf, x, y] = A
    // let 
    let items = document.querySelectorAll('.imgBox')
    if (window.list.value) {
        items = document.querySelectorAll('tr')
    }
    // console.log(items)
    items.forEach(xx => {
        let tt = xx.getBoundingClientRect()
        if (
            tt.x < x &&
            tt.y < y &&
            tt.right > lf &&
            tt.bottom > tp
        ) {
            // console.log(xx)
            if (window.list.value) {
                xx.classList.add('success-row')
                document.xx.value.data.forEach(x => {
                    if (x.name == xx.querySelector('.table-name').innerText) {
                        console.log()
                        if (!document.xx.value.getSelectionRows().map(row => row = row.name).includes(x.name)) {
                            document.xx.value.toggleRowSelection(x)
                        }
                    }
                })
            } else {
                xx.classList.add('selsct-imgBox')
            }
        }
        else {
            if (window.list.value) {
                document.xx.value.data.forEach(x => {
                    let table = xx.querySelector('.table-name')
                    if (table && x.name == table.innerText) {
                        if (document.xx.value.getSelectionRows().map(row => row = row.name).includes(x.name)) {
                            document.xx.value.toggleRowSelection(x)
                        }
                    }
                })
                if (xx.classList.contains('success-row'))
                    xx.classList.remove('success-row')
            } else {
                if (xx.classList.contains('selsct-imgBox'))
                    xx.classList.remove('selsct-imgBox')
            }

        }
        // console.log(xx)
    })
}
onMounted(() => {

    let top, left, begin, mousemove
    document.onclick = e => {
        clk.value = false
    }
    document.oncopy = e => {
        alert('禁止复制')
        //return false
    }
    document.oncontextmenu = e => {
        e.preventDefault()
        let isbox = ''
        // console.log(e.path)
        e.path.map(x => {
            if (window.list.value) {
                if (x.className == 'el-table__row' || x.className == 'el-table__row success-row') {
                    blankArea.value = false
                    console.log(blankArea.value)
                    isbox = true
                } else {
                    if (!isbox) {
                        blankArea.value = true
                        console.log(blankArea.value)
                    }

                }
            } else {
                if (x.className == 'imgBox selsct-imgBox' || x.className == 'imgBox') {
                    blankArea.value = false

                    isbox = true
                    console.log(x)
                    console.log(downloadItems.value)
                    downloadItems.value = x.getAttribute('href')
                    shareItem.value = x.getAttribute('name')
                    // setTimeout(() => {
                    //     download.value[0].setAttribute('href', x.getAttribute('href'))
                    // }, 100);

                }
                if (x.className == 'blank' && !isbox) {
                    if (!e.path.map(x => x = x.className).includes('imgBox')) {
                        blankArea.value = true
                        // console.log(blankArea.value)
                    }
                }
                if (x.className == 'card-header' && !isbox) {
                    if (!e.path.map(x => x = x.className).includes('imgBox')) {
                        blankArea.value = true
                    }
                }
            }


        })
        // console.log(e.target)

        left_button.value.style.top = e.y + window.scrollY + 'px'
        left_button.value.style.left = e.x + window.scrollX + 'px'
        clk.value = true
    }
    let getCookie = str => document.cookie.split('; ').find((x) => x.split('=')[0] == str)?.split('=')[1]
    let postRtnJson = async (url, body, header) => {
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: header,
        });
        let json = await response.json();
        return json
    }
    document.onmousedown = async e => {
        if (!window.dialogFormVisible.value) window.dialog.value = window.login
        if (clk.value == true) {
            console.log(e.target.innerText)
            if (e.target.innerText == '新建文件夹') {
                window.dialogFormVisible.value = true
                window.dialog.value = window.folder
                setTimeout(() => {
                    console.log(document.querySelector('.el-input__inner'))
                    document.querySelector('.el-input__inner').focus()
                    document.querySelector('.el-input__inner').select()
                }, 200);
            }
            if (e.target.innerText == '上传文件') {
                window.drawer.value = true
                window.tabs.value = 'upload'
            }
            if (e.target.innerText == '切换图片视图') {
                Array.from(document.querySelectorAll('img')).map(x => {
                    x.style.maxHeight == 'fit-content' ? x.style.maxHeight = '100%' : x.style.maxHeight = 'fit-content'
                })

            }
            if (e.target.innerText == '分享') {
                let items = document.querySelectorAll('.selsct-imgBox')
                if (items.length == 0) {
                    let info = window.userFiles.value[decodeURI(window.location.pathname)].find(x => x.name == shareItem.value)
                    console.log(info)
                    let path = decodeURI(window.location.pathname)
                    info['path'] = path
                    info['time'] = (new Date()).toLocaleString()
                    info.user = window.username.value
                    let res = await postRtnJson('/api/setshare', [info])
                    if (res.share) {
                        let href = location.origin + '/?usershare=' + res.uuid + '&ref=' + encodeURI(window.username.value)
                        copy(href)
                        window.notify({
                            title: '分享链接已复制到剪贴板',
                            dangerouslyUseHTMLString: true,
                            // message: h('a', { target: "_blank", href: href }, '手动点击跳转'),
                            message: `<a href="${href}" target="_blank">手动点击跳转</a><br>
                                        <p>请自己记住链接，暂时做没做出分享面板来</p>`,
                            duration: 0
                        })
                    }
                } else {
                    let list = Array.from(items).map((xx, index) => {
                        let info = window.userFiles.value[decodeURI(window.location.pathname)].find(x => x.name == xx.getAttribute('name'))
                        let path = decodeURI(window.location.pathname)
                        info['path'] = path
                        info['time'] = (new Date()).toLocaleString()
                        info.user = window.username.value
                        return info
                    })
                    console.log(JSON.parse(JSON.stringify(list)))
                    let res = await postRtnJson('/api/setshare', list)
                    if (res.share) {
                        let href = location.origin + '/?usershare=' + res.uuid + '&ref=' + encodeURI(window.username.value)
                        copy(href)
                        window.notify({
                            title: '分享链接已复制到剪贴板',
                            dangerouslyUseHTMLString: true,
                            // message: h('a', { target: "_blank", href: href }, '手动点击跳转'),
                            message: `<a href="${href}" target="_blank">手动点击跳转</a><br>
                                        <p>请自己记住链接，暂时做没做出分享面板来</p>`,
                            duration: 0
                        })
                    }
                }

            }
            if (e.target.innerText == '重命名') {
                let items = document.querySelectorAll('.selsct-imgBox')
                if (items.length == 0) {
                    let u = userFiles.value[currentPath.value].find(x => x.name == shareItem.value)
                    console.log(u)
                    if (u.type == 'folder') {
                        window.notify({
                            title: '暂不支持文件夹重命名',
                            duration: 3000
                        })
                        return
                    }
                    window.dialogFormVisible.value = true
                    window.dialog.value = window.rename
                    setTimeout(() => {
                        console.log(document.querySelector('.el-input__inner'))
                        document.querySelector('.el-input__inner').value = shareItem.value
                        document.querySelector('.el-input__inner').focus()
                        document.querySelector('.el-input__inner').select()
                    }, 100);
                }
            }
            if (e.target.innerText == '用potplayer打开') {
                let items = document.querySelectorAll('.selsct-imgBox')
                if (items.length == 0) {
                    let u = userFiles.value[currentPath.value].find(x => x.name == shareItem.value)
                    console.log(u)
                    if (u.type !== 'video') {
                        window.notify({
                            title: '只支持用potplayer播放视频文件',
                            duration: 3000
                        })
                        return
                    } else {
                        let a = document.createElement('a')
                        a.setAttribute('href', 'potplayer://' + location.origin + `/jljiuspeed?md5=${u.md5}&name=xxx.mp4`)
                        a.click()
                    }
                }
            }
            if (e.target.innerText == '下载') {
                let items = document.querySelectorAll('.selsct-imgBox')
                if (items.length == 0) {
                    let a = document.createElement('a')
                    a.setAttribute('href', downloadItems.value)
                    console.log(a)
                    a.click()
                } else {
                    Array.from(items).map((x, index) => {
                        let a = document.createElement('a')
                        a.setAttribute('href', x.getAttribute('href'))
                        setTimeout(() => {
                            console.log(a)
                            a.click()
                        }, index * 700);
                    })
                }
                cl(e.target)
            }
            clk.value = false
        }
        if (e.button == 2) return
        // console.log(document.xx.value.getSelectionRows())
        // console.log(document.xx.value.data)
        // document.xx.value.toggleRowSelection(document.xx.value.data[0])
        // console.log(window.list)
        // console.log(e.path)
        let isEl = ''
        e.path.map(x => {
            if (x.className == 'el-scrollbar content'
                && !e.path.map(x => x = x.className).includes('imgBox')
                && !e.path.map(x => x = x.className).includes('el-table__header')
                && !e.path.map(x => x = x.className).includes('card-header')
            ) {
                isEl = true
            }
        })
        if (!isEl) {
            return
        }
        top = e.y
        left = e.x
        begin = true
        elem_items()
    }
    document.onmousemove = e => {
        // nihao.value = 'x:'+e.x+','+'y:'+e.y
        begin == true ? elem_items(xuan(e, top, left)) : 1
        mousemove = true
    }
    document.onmouseup = e => {
        if (e.button == 2) return
        if (begin == true) kuang.value.style.display = 'none'
        begin = false
        if (mousemove) {
            console.log(document.querySelectorAll('.selsct-imgBox'))
            mousemove = false
        }

    }
})
</script>
  
<style>
:root {
    --menu-height: 38px;
}

* {
    user-select: none;
}

.selsct-imgBox {
    color: #f36767 !important;
    /* border: dashed 5px; */
    background-color: rgb(251 96 96 / 19%) !important;
}

.elem {
    color: #ff8585;
}

.kuang {
    position: absolute;
    background: #637dff3d;
    border: 1px solid #637dff;
    z-index: 9999;
    top: 0px;
    left: 0px;
    display: none;
    width: 0px;
    height: 0px;
}

ul {
    list-style-type: none;
    padding: 0px;
    margin: 0px;
}

/* 右键菜单 */
.left-button {
    z-index: 100;
    position: absolute;
    width: 150px;
    padding: 4px;
    height: 0px;
    box-shadow: 0 1px 4px rgba(28, 28, 32, .04), 0 8px 24px rgba(28, 28, 32, .12);
    border-radius: 10px;
    background: rgb(255, 255, 255);
    opacity: 0;
    visibility: hidden;
    overflow: hidden;
    transition: opacity .2s ease, height .3s, visibility .3s ease;
}

.isActive {
    opacity: 1;
    visibility: visible;
    height: calc(38px*2 + 122px);
    /* height: 240px; */

}

.isActive-plus {
    opacity: 1;
    visibility: visible;
    height: calc(0px + 122px);
    /* height: 240px; */

}

.menu-item {
    margin: 0px;
    display: block;
    line-height: 22px;
    color: #25262b;
    font-size: 14px;
    border-radius: 5px;
    padding: 8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    transition: background .3s ease;
}

.menu-item>span {
    margin-left: 12px;
}

.menu-item>a {
    margin-left: 12px;
}

.menu-item:hover {
    background: rgb(245, 245, 245);
}

.menu-item-devider {
    display: block;
    height: 1px;
    margin: 4px 8px;
    background: #ff8585;
}

.menu-item-danger {
    color: #ff6f66;
}

.menu-item-danger:hover {
    background: #ff6088;
}
</style>