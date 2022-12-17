<script setup>
import kuang from './components/kuang.vue'
import login from './components/login.vue'
import drawer from './components/drawer.vue'

// import list from './components/list.vue'

import { ref, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification as notify } from 'element-plus'

// import Lightgallery from 'lightgallery/vue';
// import lgZoom from 'lightgallery/plugins/zoom';
// let lightGallery = null;
window.notify = notify
let route = useRoute()
let router = useRouter()

// let plugins = [lgZoom]
// let onInit = (detail) => {
// 	lightGallery = detail.instance;
// }
// let items = [
// 	{
// 		id: '1',
// 		size: '1400-933',
// 		src:
// 			'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
// 		thumb:
// 			'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
// 		subHtml: `<div class="lightGallery-captions">
//                 <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
//                 <p>Published on November 13, 2018</p>
//             </div>`,
// 	}
// ]


let getCookie = str => document.cookie.split('; ').find((x) => x.split('=')[0] == str)?.split('=')[1]
let username = ref()
username.value = decodeURI(getCookie('uname'))
if (username.value == 'undefined') {
	username.value = '未登入'
}
window.username = username
let email = decodeURI(getCookie('uemail'))
window.email = email

let lunchVideo = (e) => {
	window.drawer.value = true
	console.log(window.player)
	window.aplayer.media.src = e.file
	try {
		if (e.preview) window.aplayer.media.poster = e.preview
	} catch (error) {
		
	}
	window.aplayer.play()
	window.tabs.value = 'play'
	notify({
		title: '请稍等！视频数据获取中...',
		duration: 4000
	})
}

let dialogFormVisible = () => {
	window.dialogFormVisible.value = true
}

let rename = (e) => {
	let u = userFiles.value[currentPath.value].find(x => x.name == e.target.innerText)
	console.log(u)
	shareItem.value = e.target.innerText
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
		document.querySelector('.el-input__inner').value = e.target.innerText
		document.querySelector('.el-input__inner').focus()
		document.querySelector('.el-input__inner').select()
	}, 100);

}

window.sortIt = (x) => {
	x.sort((a, b) => {
		const nameA = a.name.toUpperCase(); // ignore upper and lowercase
		const nameB = b.name.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	return '成功排序！'
}

let postRtnJson = async (url, body, header) => {
	const response = await fetch(url, {
		method: 'post',
		body: JSON.stringify(body),
		headers: header,
	});
	let json = await response.json();
	return json
}
let userFiles = ref({})

let query = ref(null)
// query.value = { usershare : null, ref: encodeURI(username) }
window.query = query

router.afterEach(async (to, from) => {
	console.log(decodeURI(to.path))
	console.log(decodeURI(from.path))

	if (to.query.usershare && to.query.ref) query.value = to.query

	if (!userFiles.value[decodeURI(to.path)] || userFiles.value[decodeURI(to.path)].wrong == 0) {
		if (!query.value) {
			notify({
				title: '当前文件夹：' + decodeURI(to.path),
				message: h('i', { style: 'color: teal' }, '请稍等！获取数据中...'),
				duration: 1800
			})
		} else {
			notify({
				title: '请稍等！获取数据中...',
				duration: 1800
			})
		}

		if (query.value) {
			userFiles.value[decodeURI(to.path)] = await postRtnJson('/api/getUserFiles' + location.search, {
				path: decodeURI(window.location.pathname)
			})
		} else {
			if (username.value !== '未登入') {
				userFiles.value[decodeURI(to.path)] = await postRtnJson('/api/getUserFiles', {
					path: decodeURI(window.location.pathname)
				})
			}
		}
		if (userFiles.value[decodeURI(to.path)].wrong !== 0) {
			window.sortIt(userFiles.value[decodeURI(to.path)])
		}
	}
	window.paths.value = window.rtnPaths(decodeURI(to.path))
	window.currentPath.value = decodeURI(to.path)
})



let intoFolder = (bbb) => {
	let str = window.location.pathname
	cl(decodeURI(window.location.href))
	cl(decodeURI(str))
	if (window.location.pathname == '/') {
		let path = str.substring(0, str.length - 1) + '/' + bbb
		router.addRoute({
			name: path,
			path: path,
			component: { template: '' }
		})
		router.push({ path: path, query: query.value })
	} else {
		let path = str + '/' + bbb
		router.addRoute({
			name: path,
			path: path,
			component: { template: '' }
		})
		router.push({ path: path, query: query.value })
	}
}


window.userFiles = userFiles
let isList = ref(false)

const visible = ref(false)
window.drawer = visible
window.list = isList

let paths = ref('')
window.paths = paths

let currentPath = ref()
// currentPath.value = '/'
window.currentPath = currentPath


const onBack = () => {
	notify('Back')
}
let input = ref('')

let clk = ref()

let isclk = ref(false)
function toggle() {
	let sider = document.querySelector('.sider')
	!isclk.value ? sider.style.width = 0 : sider.style.width = '250px'
	isclk.value = !isclk.value
}
onMounted(() => {
	toggle()
	// setTimeout(() => toggle(), 400);
	window.rtnPaths = (path) => {
		let rtnPath = () => {
			path = path.split('/')
			// path.pop()
			path.shift()
			return path
		}
		let t = ''
		return rtnPath().map(x => {
			t = t + '/' + x
			router.addRoute({
				name: t,
				path: t,
				query: { usershare: 'xxx' },
				component: { template: '' }
				// component: list
				// component: () => import('./components/list.vue')
			})
			return {
				name: decodeURI(x),
				url: decodeURI(t)
			}
		})

	}
	cl(router.getRoutes())
	window.paths.value = window.rtnPaths(window.location.pathname)

})
</script>

<template>
	<div class="draw">
		<el-scrollbar width="200px" class="sider" ref="clk">
			<el-tag class="demo-item" style="background-color: white;color: #aabaca;">一叶 | 纳物</el-tag>
			<p v-for="item in 20" :key="item" class="demo-item">
				<el-tag class="demo-item" style="background-color: white;color: #aabaca;">尽情期待</el-tag>
				<!-- <el-tag>尽情期待</el-tag> -->
			</p>
		</el-scrollbar>
		<div class="clk" @click="toggle()"></div>
		<el-scrollbar class="content">
			<div>
				<div class="card-header"
					style=" padding: 10px 0;user-select: none;position: sticky;top: 0;background-color: white;z-index: 100;">
					<el-breadcrumb separator="/">

						<el-breadcrumb-item :to="{ path: '/', query: query }">{{ username }}</el-breadcrumb-item>
						<template v-for="(path, index) in paths" :key="index">
							<el-breadcrumb-item :to="{ path: path.url, query: query }">{{ path.name
							}}</el-breadcrumb-item>
						</template>
					</el-breadcrumb>
					<!-- <el-button @click="(isList = !isList)">
						切换视图
					</el-button> -->
					<!-- Form -->
					<el-button text @click="dialogFormVisible">
						注册&登入
					</el-button>
					<el-button @click="(visible = true)">
						操作面板
					</el-button>
				</div>

				<div v-if="!isList" class="blank">
					<!-- <lightgallery :settings="{ speed: 300, plugins: plugins }" :onInit="onInit">
							<a v-for="item in items" :key="item.id" data-lg-size="1400-932" className="gallery-item"
								:data-src="item.src">
								<img className="img-responsive" :src="item.thumb" />
							</a>
						</lightgallery> -->
					<template v-for="file in userFiles[currentPath]" :key="file">

						<div class="imgBox" v-if="(file.type == 'image')" :href="file.file" :name="file.name">
							<div class="preview">
								<template v-if="file.preview">
									<img :src="file.preview" alt="" fit="contain">
								</template>
								<template v-else>
									<img :src="file.file" alt="" fit="contain">
								</template>
							</div>
							<div>
								<p @dblclick="rename">{{ file.name }}</p>
								<p>{{ file.time ? file.time.split(' ')[0] : (new Date).toLocaleDateString() }} | {{
										file.size
								}}</p>
							</div>
						</div>
						<div class="imgBox" v-if="file.type == 'video'" :href="file.file" :name="file.name">
							<div style="position: relative;">
								<div class="preview" @click="lunchVideo(file)">
									<template v-if="file.preview">
										<img :src="file.preview" alt="" fit="contain">
									</template>
									<template v-else>
										<img :src="file.file" alt="" fit="contain">
									</template>
								</div>
								<i class="gg-play-button-r" @click="lunchVideo(file)"
									style="cursor: pointer;position: absolute; top: 50%;left: 50%;transform: translate(-50%, -46%);color: white;"></i>
							</div>
							<div>
								<p @dblclick="rename">{{ file.name }}</p>
								<p>{{ file.time ? file.time.split(' ')[0] : (new Date).toLocaleDateString() }} | {{
										file.size
								}}</p>
							</div>
						</div>
						<div class="imgBox" v-if="(file.type == 'another')" :href="file.file" :name="file.name">
							<div style="position: relative;">
								<div class="preview">
									<img src="/src/assets/files.png" alt="" fit="contain" style="height: 86%;">
								</div>
								<span
									style="cursor: pointer;position: absolute; top: 50%;left: 50%;transform: translate(-50%, -46%);">
									{{ file.name.split('.')[file.name.split('.').length - 1] }}
								</span>
							</div>
							<div>
								<p @dblclick="rename">{{ file.name }}</p>
								<p>{{ file.time ? file.time.split(' ')[0] : (new Date).toLocaleDateString() }} | {{
										file.size
								}}</p>
							</div>
						</div>
						<div class="imgBox" v-if="file.type == 'folder'" :name="file.name">
							<div class="preview" @click="intoFolder(file.name)">
								<div class="ffolder small cyan">
									<span>{{ file.number }}个文件</span>
								</div>
							</div>
							<div>
								<p @dblclick="rename">{{ file.name }}</p>
								<p>{{ file.time ? file.time.split(' ')[0] : (new Date).toLocaleDateString() }} | {{
										file.number == 0 ? '0 MB' : file.size
								}}</p>
							</div>
						</div>
					</template>

				</div>
				<template v-else>
					<router-view>
					</router-view>
				</template>
			</div>
		</el-scrollbar>
		<kuang></kuang>
		<drawer></drawer>
		<login></login>
	</div>



</template>

<style scoped lang="scss">
// @import url('https://cdn.jsdelivr.net/npm/lightgallery@2.1.0-beta.1/css/lightgallery.css');
// @import url('https://cdn.jsdelivr.net/npm/lightgallery@2.1.0-beta.1/css/lg-zoom.css');

body {
	margin: 0;
}

.gallery-item {
	margin: 5px
}

.blank {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	height: calc(100vh - 74px);
	width: 100%;
}





// .imgCard {
// 	width: 100%;
// 	height: 100%;
// 	// margin: 20px;
// 	border-radius: 18px;
// 	// max-width: 90%;
// 	// max-height: 90%;
// 	position: relative;
// 	// box-shadow: 0px 0px 10px fade(#fff, 80%);
// 	//backgrounds defined below
// 	background-size: contain !important;
// background-repeat: no-repeat !important;
// 	// background: url('https://assets.codepen.io/48941/photo-1560015534-cee980ba7e13.avif');
// 	// &::after {
// 	// 	width: 100%;
// 	// 	height: 100%;
// 	// 	border-radius: 25px;
// 	// 	position: absolute;
// 	// 	top: 0;
// 	// 	left: 0;
// 	// 	z-index: -1;
// 	// 	content: '';
// 	// 	background: inherit;
// 	// 	filter: blur(9px);
// 	// 	transform: scale(1.05);
// 	// 	opacity: 0.8;
// 	// 	transition: 500ms all ease-in-out 0ms;
// 	// }

// 	&:hover::after {
// 		transform: scale(0.8);
// 		opacity: 0;
// 	}
// }


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

.draw {
	position: relative;
	display: flex;
	height: 100vh;

	&>div {
		transition: all .66s cubic-bezier(0.66, 0, 0.01, 1) !important;
	}

	>div {
		// font-size: 2em;
		// padding: 0 10px;
		margin: 0 10px;
	}

	.sider {
		// background-color: #f7f7f7;
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

	.content {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: auto;
		margin-right: 0px;
		padding-right: 15px;

		>div {
			padding: 10px 0;
			// border-bottom: #2cbc63 1px solid;
		}
	}

	.clk {
		position: absolute;
		background-color: rgb(92, 204, 141);
		width: 20px;
		height: 30px;
		top: calc(50% - 15px);
		left: -15px;
		z-index: 10;
	}

}
</style>
