<template>
	<el-dialog v-model="dialogFormVisible" :title="current.title" align-center>
		<template v-if="['signup', 'login'].includes(current.action)">
			<el-form :model="form" style="display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">
				<el-form-item label="昵称👻">
					<el-input v-model="form.name" name="username" autocomplete="on" clearable @input="tijiao = '提交'" />
				</el-form-item>
				<el-form-item v-if="current.rule.includes('email')" prop="email" label="邮箱📪" :rules="[{
					type: 'email',
					message: '邮箱格式不正确',
					trigger: ['blur', 'change'],
				}]">
					<el-input v-model="form.email" name="email" autocomplete="on" clearable />
				</el-form-item>
				<el-form-item label="密码😶‍🌫️">
					<el-input v-model="form.psw" type="password" show-password @input="tijiao = '提交'" />
				</el-form-item>
				<el-form-item label="♂ or ♀" v-if="current.rule.includes('sex')">
					<el-select v-model="form.sex" placeholder="性别">
						<el-option label="♂" value="男" />
						<el-option label="♀" value="女" />
					</el-select>
				</el-form-item>
			</el-form>
			<div style="display: flex;flex-wrap: wrap;align-items: center;justify-content: center;"
				v-if="current.action !== 'newFolder'">
				<p class="mt-3" v-if="current.action == 'login'">
					还没账号？ <a href="javascript:void(0)" class="text-primary" @click="(current = signup)">注册</a>
				</p>
				<p class="mt-3" v-if="current.action == 'signup'">
					已有账号？ <a href="javascript:void(0)" class="text-primary" @click="(current = login)">登入</a>
				</p>
			</div>
			<div class="el-dialog__footer">
				<span class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button type="primary" @click="tologin" class="btn btn_login" v-if="current.action == 'login'">
						{{ tijiao }}
					</el-button>
					<el-button type="primary" @click="toresign" class="btn btn_resign"
						v-if="current.action == 'signup'">
						{{ tijiao }}
					</el-button>
				</span>
			</div>
		</template>
		<template v-if="current.action == 'newFolder'">
			<el-form :model="form" style="display: flex;flex-wrap: wrap;align-items: center;justify-content: center;"
				@submit.prevent="anewfolder">
				<el-form-item>
					<el-input v-model="form.folder" autocomplete="on" clearable />
				</el-form-item>
			</el-form>
			<div class="el-dialog__footer">
				<span class="dialog-footer">
					<!-- <el-button @click="dialogFormVisible = false">取消</el-button> -->
					<el-button type="primary" class="btn" @click="anewfolder">
						新建
					</el-button>
				</span>
			</div>
		</template>
		<template v-if="current.action == 'newbt'">
			<el-form :model="form" style="display: flex;flex-wrap: wrap;align-items: center;justify-content: center;"
				@submit.prevent="anewbt">
				<el-form-item>
					<el-input v-model="form.bt" autocomplete="on" clearable />
				</el-form-item>
			</el-form>
			<div class="el-dialog__footer">
				<span class="dialog-footer">
					<!-- <el-button @click="dialogFormVisible = false">取消</el-button> -->
					<el-button type="primary" class="btn" @click="anewbt">
						添加
					</el-button>
				</span>
			</div>
		</template>
		<template v-if="current.action == 'rename'">
			<el-form :model="form" style="display: flex;flex-wrap: wrap;align-items: center;justify-content: center;"
				@submit.prevent="torename">
				<el-form-item>
					<el-input v-model="form.rename" autocomplete="on" clearable />
				</el-form-item>
			</el-form>
			<div class="el-dialog__footer">
				<span class="dialog-footer">
					<!-- <el-button @click="dialogFormVisible = false">取消</el-button> -->
					<el-button type="primary" class="btn" @click="torename">
						确认
					</el-button>
				</span>
			</div>
		</template>
	</el-dialog>
</template>
  
<script setup>
// import { ElMessageBox } from 'element-plus';
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 这个是用来当做弹出面板的，用于登入注册、重命名等等


let route = useRoute()
let router = useRouter()

const dialogFormVisible = ref(false)
window.dialogFormVisible = dialogFormVisible

// 控制面板的关闭事件
// const handleClose = (done) => {
//   ElMessageBox.confirm('Are you sure to close this dialog?')
//     .then(() => {
//       done()
//     })
//     .catch(() => {
//       // catch error
//     })
// }

onMounted(() => {
	setTimeout(() => {
		if (query.value) {
			dialogFormVisible.value = false
		} else {
			if (username.value == '未登入') dialogFormVisible.value = true
		}
	}, 100);

})
// 新建文件夹进行路由跳转的事件
let anewfolder = (e) => {
	console.log(document.querySelector('.el-input__inner').value)
	let str = window.location.pathname
	cl(decodeURI(window.location.href))
	cl(decodeURI(str))

	if (window.location.pathname == '/') {
		let path = str.substring(0, str.length - 1) + '/' + document.querySelector('.el-input__inner').value
		router.addRoute({
			name: path,
			path: path,
			component: { template: '' }
		})
		router.push(path)
	} else {
		let path = str + '/' + document.querySelector('.el-input__inner').value
		router.addRoute({
			name: path,
			path: path,
			component: { template: '' }
		})
		router.push(path)
	}
	dialogFormVisible.value = false
}

const form = reactive({
	name: '',
	sex: '男',
	psw: '',
	email: '',
	folder: '',
	renmae: '',
	bt: ''
})
const signup = {
	action: 'signup',
	title: '创建一个账号🥳',
	rule: ['name', 'sex', 'psw', 'email']
}
const login = {
	action: 'login',
	title: '欢迎回来🥳',
	rule: ['name', 'psw']
}
const folder = {
	action: 'newFolder',
	title: '新建文件夹',
	rule: ['name', 'psw']
}
const bt = {
	action: 'newbt',
	title: '添加磁力链接',
	rule: ['name', 'psw']
}
const rename = {
	action: 'rename',
	title: '重命名',
	rule: ['name', 'psw']
}


const current = ref()
window.dialog = current
window.folder = folder
window.rename = rename
window.login = login
window.bt = bt
current.value = login

// 重命名事件
let torename = async (e) => {
	let u = userFiles.value[currentPath.value].find(x => x.name == shareItem.value)
	console.log(u)
	console.log(document.querySelector('.el-input__inner').value)
	let res = await postRtnJson('/api/rename', {
		name: document.querySelector('.el-input__inner').value,
		md5: u.md5,
		path: currentPath.value,
		time: (new Date()).toLocaleString()
	})
	if (res.rename) {
		window.notify({
			title: '重命名成功！',
			duration: 1500
		})
		dialogFormVisible.value = false
		u.name = document.querySelector('.el-input__inner').value
	} else {
		window.notify({
			title: '重命名失败！',
			duration: 1500
		})
	}
}
let anewbt = async (e) => {
	console.log(document.querySelector('.el-input__inner').value)
	let res = await postRtnJson('/api/setbthash', {
		bthash: document.querySelector('.el-input__inner').value,
		path: currentPath.value,
		time: (new Date()).toLocaleString()
	})
	window.notify({
		title: '磁力添加中...',
		duration: 4000
	})
	if (res.setbt) {
		// window.notify({
		// 	title: '磁力成功！',
		// 	duration: 1500
		// })
		dialogFormVisible.value = false
		window.location.reload()
	} else {
		window.notify({
			title: '磁力失败！',
			duration: 1500
		})
	}
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

let tijiao = ref()
tijiao.value = '提交'

// 登入事件
let tologin = async (e) => {
	e.preventDefault()
	let res
	try {
		res = await postRtnJson('/api/login', {
			passward: form.psw,
			name: form.name
		}, {
			'Content-Type': 'application/json'
		})
	} catch (error) {
		console.log(error)
	}
	if (res) {
		document.cookie = 'uname=' + encodeURI(res.name) + ';path=/'
		document.cookie = 'uemail=' + encodeURI(res.email) + ';path=/'
		window.location = '/'
	} else {
		tijiao.value = '密码错误！'
	}
}
// 注册事件
let toresign = async (e) => {
	e.preventDefault()
	let res = await fetch('/api/resign', {
		method: 'post',
		body: JSON.stringify({
			name: form.name,
			passward: form.psw,
			email: form.email,
			sex: form.sex
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	if (res.status == 200) {
		document.cookie = 'uname=' + encodeURI(form.name) + ';path=/'
		document.cookie = 'uemail=' + encodeURI(form.email) + ';path=/'
		window.location = '/'
	} else {
		tijiao.value = '密码错误！'
	}
}
// window.tologin = tologin
// window.toresign = toresign
// window.form = form
</script>
<style scoped>
.el-button--text {
	margin-right: 15px;
}

.el-select {
	width: 300px;
}

.el-input {
	width: 300px;
}

.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>
  