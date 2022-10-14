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
      <el-table-column label="日期" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ timeChange(parseInt(row.event.timeStart)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附属组" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.groupItem.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件状态" min-width="30px" align="center">
        <template slot-scope="{row}">
          <el-tag effect="dark" :type="(row.event.eventState===0)?'primary':((row.event.eventState === 1)?'success':'danger')"> {{ (row.event.eventState===0)?'未录入':((row.event.eventState === 1)?'已录入':'已废弃') }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当前点数" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span style="font-size: 21px;font-weight: bolder">{{ parseInt(row.groupItem.attributeNum) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="妊娠进度" class-name="status-col" width="220">
        <template slot-scope="{row}">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="row.babyProgress"
            :status="(row.babyProgress > 80) ? 'success':(row.babyProgress<30 ? 'exception' : 'format')"
          />
        </template>
      </el-table-column>
      <el-table-column label="幼崽成长进度" class-name="status-col" width="220">
        <template slot-scope="{row}">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="row.upProgress"
            :status="(row.upProgress > 80) ? 'success':(row.upProgress<30 ? 'exception' : 'format')"
          />
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
          <el-button type="success" :disabled="row.event.eventState===1?true:(row.event.eventState===2?true:(row.babyProgress!==100))" @click="thatShow(row)">
            录入
          </el-button>
          <el-button type="danger" :disabled="row.event.eventState===1?true:(row.event.eventState === 2)" @click="judgeEvent(row)">
            废弃
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="录入变异点数" :visible.sync="disShow">
      <el-form>
        <el-form-item label="上升点数(1-5)" label-width="120px">
          <el-input v-model="upNum" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="disShow = false">取 消</el-button>
        <el-button type="primary" @click="upNumEventAndEndRefrsh">确 定</el-button>
      </div>
    </el-dialog>
    <!--    <pagination :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->

  </div>
</template>

<script>
import { getEvent, abandonEvent } from '@/api/arkUse/events'
import { timestampToTime, fotBabyTime, fotUpTime } from '@/utils/arkVaryFunction'
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
  data() {
    return {
      tableKey: false,
      VaryList: null,
      chooseList: {},
      upNum: null,
      disShow: false,
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
    // this.getList()
  },
  mounted() {
    this.getListEvent()
    this.intervalUse()
  },
  methods: {
    thatShow(data) {
      this.disShow = true
      this.chooseList = data
    },
    upNumEventAndEndRefrsh() {
      if ((parseInt(this.upNum) < 1 || parseInt(this.upNum) > 5)) {
        this.$message({ message: '数字超出范围,请重新输入', type: 'error' })
      } else {
        this.disShow = false
        console.log(this.upNum, this.chooseList)
        const transUp = { // 都变成数字了就行
          groupId: this.chooseList.groupItem.id,
          orianismId: this.chooseList.orianismItem.id,
          id: this.chooseList.event.id,
          varyNum: parseInt(this.upNum)
        }
        console.log(transUp)
        this.upNum = null
      }
    },
    judgeEvent(data) {
      this.$confirm('此操作将永久废弃该事件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.abandonEvent(data)
      }).catch(err => {
        console.log(err)
      })
    },
    abandonEvent(data) {
      abandonEvent({ id: data.event.id, eventState: 2, upNum: 0 }).then(res => { // 状态改为2，晋升点数改为0
        if (res.message === '修改成功') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.getListEvent()
          this.intervalUse()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    randomMath() {
      return (Math.random()).toString()
    },
    getListEvent() {
      const that = this
      getEvent().then(res => {
        this.VaryList = res
        for (let listNum = 0; listNum < res.length; listNum++) {
          if (res[listNum].event.eventState !== 2) {
            that.VaryList[listNum].upProgress = fotUpTime(parseInt(res[listNum].event.timeStart), parseInt(res[listNum].orianismItem.upTime), parseInt(res[listNum].orianismItem.babyTime))
            that.VaryList[listNum].babyProgress = fotBabyTime(parseInt(res[listNum].event.timeStart), parseInt(res[listNum].orianismItem.upTime), parseInt(res[listNum].orianismItem.babyTime))
          } else {
            that.VaryList[listNum].upProgress = 0
            that.VaryList[listNum].babyProgress = 0
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    intervalUse() {
      const that = this
      setInterval(() => {
        for (let arrNum = 0; arrNum < this.VaryList.length; arrNum++) {
          if (that.VaryList[arrNum].event.eventState !== 2) {
            this.VaryList[arrNum].upProgress = fotUpTime(parseInt(that.VaryList[arrNum].event.timeStart), parseInt(that.VaryList[arrNum].orianismItem.upTime), parseInt(that.VaryList[arrNum].orianismItem.babyTime))
            this.VaryList[arrNum].babyProgress = fotBabyTime(parseInt(that.VaryList[arrNum].event.timeStart), parseInt(that.VaryList[arrNum].orianismItem.upTime), parseInt(that.VaryList[arrNum].orianismItem.babyTime))
          }
        }
        this.tableKey = !this.tableKey
      }, 2000)
    },
    toDetailGroup(data) {
      this.$router.push({
        name: 'orianismDetail',
        params: {
          data: data.orianismItem
        }
      })
    },
    timeChange(data) {
      return timestampToTime(data)
    }
  }
}
</script>
