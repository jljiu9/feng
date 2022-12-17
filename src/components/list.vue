<template>
    <div class="table-responsive">
        <el-table ref="multipleTableRef" :data="tableData" style="width: 100%;" 
            :default-sort="{ prop: 'name', order: 'descending' }"
            table-layout="fixed">
            <el-table-column type="selection" width="55" height="100">
            </el-table-column>
            <el-table-column prop="name" label="名称" min-width="160" sortable class-name="table-name textEllipsis"
                :sort-orders="['ascending', 'descending']"
                :show-overflow-tooltip="true">
            </el-table-column>
            
            <el-table-column prop="date" label="日期" width="200" sortable :sort-orders="['ascending', 'descending']" >
            </el-table-column>
            <el-table-column prop="address" label="地址" sortable class-name="textEllipsis" style="height: 20px;"
                :sort-orders="['ascending', 'descending']" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const multipleTableRef = ref()

onMounted(() => {
    multipleTableRef.value.toggleAllSelection()
    document['xx'] = multipleTableRef
    // console.log(window.location.href)
})
const tableData = ref([
    {
        date: '2016-05-03',
        name: 'asmr',
        address: 'No. 172, Grove St, Los Angeles',
    },
    {
        date: '2016-08-02',
        name: 'cccc',
        address: 'No. 111, Grove St, Los Angeles',
    },
    {
        date: '2016-03-04',
        name: 'css',
        address: 'No. 115, Grove St, Los Angeles',
    },
    {
        date: '2016-03-04',
        name: 'jljiu',
        address: 'No. 115, Grove St, Los Angeles',
    }
    ,
    {
        date: '2016-03-04',
        name: 'google相册fdfdfdfsdfsdfsdfsdfsdfsdf',
        address: 'No. 115, Grove St, Los Angeles',
    }
])
</script>
<style lang="scss">

.el-table__row {
    transition: background-color .3s ease;

    &.success-row {
        background-color: var(--el-table-row-hover-bg-color) !important;
    }
}
</style>