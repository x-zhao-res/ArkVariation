<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.oriName" placeholder="生物名称" style="width: 200px;margin-right: 10px" class="filter-item" />
      <el-select v-model="search.varyAllNum" placeholder="变异筛选" clearable class="filter-item" style="width: 170px;margin-right: 10px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getListSearch">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="varyListUse"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="生物名称" width="130" align="center">
        <template slot-scope="{row}">
          <span>{{ row.oriName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变异次数" align="center" width="145">
        <template slot-scope="{row}">
          <span style="font-size: 17px;font-family: 黑体,serif">{{ row.varyAllNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注&龙房地址" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.noForget }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button style="width: 130px" type="primary" @click="toDetailVaty(row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getOrianism } from '@/api/arkUse/orianism'
const calendarTypeOptions = [
  { key: 254, display_name: '已完成' },
  { key: 0, display_name: '未完成' }
]
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      search: {},
      calendarTypeOptions,
      listLoading: false,
      varyListUse: [],
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
    }
  },
  mounted() {
    this.getListOrianism()
  },
  created() {
  },
  methods: {
    sortChange(data) {
      console.log(data)
    },
    toDetailVaty(data) {
      this.$router.push({
        name: 'orianismDetail',
        params: {
          data
        }
      })
    },
    getListOrianism() {
      this.listLoading = true
      getOrianism({ belongTribe: this.$store.state.arkuser.belongTribe }).then(res => {
        this.varyListUse = res.data
        setTimeout(() => {
          this.listLoading = false
        }, 500) // 调整用户体验感
      }).catch(error => {
        console.log(error)
      })
    },
    getListSearch() {
      this.listLoading = true
      if (this.search.oriName === '') {
        delete this.search.oriName
      }
      if (this.search.varyAllNum === '') {
        delete this.search.varyAllNum
      }
      getOrianism({
        belongTribe: this.$store.state.arkuser.belongTribe,
        ...this.search
      }).then(res => {
        if (res.message === '查询成功') {
          this.varyListUse = []
          this.varyListUse = res.data
          this.$message({
            type: 'success',
            message: '查询成功'
          })
          setTimeout(() => {
            this.listLoading = false
          }, 700)
        } else {
          this.$message({ type: 'success', message: '查询失败,请联系管理员' })
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
