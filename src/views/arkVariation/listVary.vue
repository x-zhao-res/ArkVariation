<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="组名称" style="width: 200px;margin-right: 10px" class="filter-item" />
      <el-select v-model="listQuery.type" placeholder="是否变异" clearable class="filter-item" style="width: 170px;margin-right: 10px">
        <el-option v-for="item in dragonVary" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.baby" placeholder="幼崽成长状态" clearable class="filter-item" style="width: 170px;margin-right: 10px">
        <el-option v-for="item in babyState" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="false"
      :data="VaryList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="日期" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ timeChange(parseInt(row.event.timeStart)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名称" width="160" align="center">
        <template slot-scope="{row}">
          <el-tooltip style="margin-top: 4px" effect="dark" content="Left Center 提示文字" placement="top">
            <span>{{ row.groupItem.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="当前属性值" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span style="font-size: 21px;font-weight: bolder">{{ parseInt(row.groupItem.attribute) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="妊娠进度" class-name="status-col" width="220">
        <template slot-scope="{row}">
          <el-progress :text-inside="true" :stroke-width="20" :percentage="50" status="exception" />
        </template>
      </el-table-column>
      <el-table-column label="幼崽成长进度" class-name="status-col" width="220">
        <template slot-scope="{row}">
          <el-progress :text-inside="true" :stroke-width="20" :percentage="50" status="success" />
        </template>
      </el-table-column>
      <el-table-column label="变异备注" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.event.eventNoForget }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}" style="display: flex;">
          <el-button type="primary" @click="toDetailGroup(row)">
            详情
          </el-button>
          <el-button type="success" :disabled="true">
            录入
          </el-button>
          <el-button type="danger">
            废弃
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getEvent } from '@/api/arkUse/events'
import { timestampToTime } from '@/utils/arkVaryFunction'

const dragonVary = [
  { key: 'bianyi', display_name: '变异' },
  { key: 'weibianyi', display_name: '未变异' }
]
const babyState = [
  { key: 'noten', display_name: '未到10%' },
  { key: 'no', display_name: '已到10%' },
  { key: 'in', display_name: '已长大' }
]
export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      VaryList: null,
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
  created() {
    this.getList()
  },
  mounted() {
    this.getListEvent()
  },
  methods: {
    toDetailGroup(data) {
      console.log(data)
    },
    timeChange(data) {
      return timestampToTime(data)
    },
    getListEvent() {
      getEvent().then(res => {
        this.VaryList = res
        console.log(this.VaryList)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
