<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="组名称" style="width: 200px;margin-right: 10px" class="filter-item" />
      <el-select v-model="listQuery.type" placeholder="贤者状态" clearable class="filter-item" style="width: 170px;margin-right: 10px">
        <el-option v-for="item in dragonVary" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
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
          <el-button style="width: 100px" type="danger">
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
import { getGroup } from '@/api/arkUse/orianism'
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
    this.getListUse()
    this.changeIntervalGroupProgress()
  },
  methods: {
    getListUse() {
      getGroup().then(res => {
        for (let arrNum = 0; arrNum < res.length; arrNum++) {
          res[arrNum].progressUse = ProgressUse(res[arrNum])
        }
        this.VaryList = res
      }).catch(error => {
        console.log(error)
      })
    },
    listProgressIn(data) {
      console.log(ProgressUse(data))
      return ProgressUse(data)
    },
    changeIntervalGroupProgress() {
      setInterval(() => {
        for (let listNum = 0; listNum < this.VaryList.length; listNum++) {
          if (this.VaryList[listNum].progressUse !== 100) {
            this.VaryList[listNum].progressUse = ProgressUse(this.VaryList[listNum])
          }
        }
      }, 2000) // 2S读一次现场时间
    }
  }
}
</script>
