<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="组名称" style="width: 200px;margin-right: 10px" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :v-loading="listLoading"
      :data="VaryList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名称" width="160" align="center">
        <template slot-scope="{row}">
          <el-tooltip style="margin-top: 4px" effect="dark" content="Left Center 提示文字" placement="top">
            <span>{{ row.groupName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="当前属性值" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span style="font-size: 21px;font-weight: bolder">{{ parseInt(row.attributeNum) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="贤者时间" class-name="status-col" width="220">
        <template slot-scope="{row}">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="row.progressUse"
            :status="(row.progressUse > 80) ? 'success':(row.progressUse<30 ? 'exception' : 'format')"
          />
        </template>
      </el-table-column>
      <el-table-column label="贤者状态" min-width="30px" align="center">
        <template slot-scope="{row}">
          <el-tag effect="dark" :type="(row.progressUse===100)?'success':'danger'"> {{ (row.progressUse===100)?'已就绪':'未就绪' }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="变异备注" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.groupNoForget }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button style="width: 100px" type="danger" @click="showConfirm(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getGroup, delGroup } from '@/api/arkUse/orianism'
import { ProgressUse } from '@/utils/arkVaryFunction'
const dragonVary = [
  { key: 'bianyi', display_name: '变异' },
  { key: 'weibianyi', display_name: '未变异' }
]
const babyState = [
  { key: 'noten', display_name: '未到10%' },
  { key: 'no', display_name: '已到10%' },
  { key: 'in', display_name: '长成' }
]
export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      VaryList: [],
      listQuery: {
        page: 1,
        baby: '',
        limit: 20,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      babyState,
      dragonVary
    }
  },
  mounted() {
    this.listLoading = true
    this.getListUse()
  },
  methods: {
    showConfirm(data) {
      this.$confirm('是否删除组 ' + data.groupName + ' ?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteGroup(data.id)
      })
    },
    deleteGroup(data) {
      delGroup({ id: data }).then(res => {
        if (res.message === '删除成功') {
          this.$notify({
            title: '删除成功',
            message: ' 删除成功',
            type: 'success'
          })
          this.VaryList = []
          this.getListUse()
        } else {
          this.$notify({
            title: '删除失败',
            message: '请联系管理员',
            type: 'error'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getListUse() {
      this.listLoading = true
      getGroup().then(res => {
        for (let arrNum = 0; arrNum < res.length; arrNum++) {
          if (res[arrNum].fuckState === 1) {
            res[arrNum].progressUse = 100
          } else {
            res[arrNum].progressUse = ProgressUse(res[arrNum])
          }
        }
        this.VaryList = res
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        console.log(error)
      })
    },
    listProgressIn(data) {
      console.log(ProgressUse(data))
      return ProgressUse(data)
    }
  }
}
</script>
