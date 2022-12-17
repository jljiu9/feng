<template>
	<el-dialog v-model="dialogFormVisible" title="新建文件夹" align-center>
		<el-form :model="form" style="display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">
			<el-form-item>
				<el-input v-model="form.folder" name="username" autocomplete="on" clearable />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false" class="btn">
					新建
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>
  
<script setup>
import { reactive, ref } from 'vue'

const dialogFormVisible = ref(false)
window.dialogFormVisible = dialogFormVisible

const form = reactive({
	name: '',
	sex: '男',
	psw: '',
	email: '',
	folder:''
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
const current = ref()
current.value = login
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
  