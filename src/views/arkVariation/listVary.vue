<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchName" placeholder="组名称" style="width: 200px;margin-right: 10px" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchNameGet">
        搜索
      </el-button>
      <download-excel
        :data="excelUse"
        :fields="json_feild"
        name="varyExcel"
      >
        <el-button class="filter-item" type="success">
          Excel下载
        </el-button>
      </download-excel>
    </div>

    <el-table
      :key="tableKey"
      ref="table"
      v-loading="controlLoading"
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
      <el-table-column label="附属组" width="290" align="center">
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
      controlLoading: false,
      searchName: null,
      babyState,
      dragonVary,
      excelUse: [{
        name: null,
        time: null,
        point: null,
        forget: null
      }],
      json_feild: {
        时间: 'time',
        名称: 'name',
        点数: 'point',
        备忘: 'forget'
      }
    }
  },
  created() {
    // this.getList()
  },
  mounted() {
    this.getListEvent()
    this.$nextTick(() => {
      this.$refs.table.bodyWrapper.scrollTop = 0
    })
  },
  methods: {
    excelJsonUse(data) {
      this.excelUse = [{
        name: null,
        time: null,
        point: null,
        forget: null
      }]
      for (let xslNum = 0; xslNum < data.length; xslNum++) {
        this.excelUse[xslNum] = {
          time: this.timeChange(parseInt(data[xslNum].event.timeStart)),
          name: data[xslNum].groupItem.name,
          point: data[xslNum].groupItem.attributeNum,
          forget: data[xslNum].event.eventNoForget
        }
      }
    },
    searchNameGet() {
      let num
      this.controlLoading = true
      if (this.searchName) {
        for (let searchNum = 0; searchNum < this.VaryList.length; searchNum++) {
          if (this.searchName === this.VaryList[searchNum].groupItem.name) {
            num = this.VaryList[searchNum].groupItem.id
          }
        }
        console.log(num)
        if (num) {
          const that = this
          getEvent({ belongTribe: this.$store.state.arkuser.belongTribe, belongGroupId: num }).then(res => {
            this.VaryList = []
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
            this.$message({ message: '查询成功', type: 'success' })
            this.excelJsonUse(res)
            this.controlLoading = false
          }).finally(res => {
            this.controlLoading = false
          })
        }
      } else {
        this.getListEvent()
        this.controlLoading = false
      }
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
      this.controlLoading = true
      const that = this
      getEvent({ belongTribe: this.$store.state.arkuser.belongTribe }).then(res => {
        console.log(res)
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
        this.controlLoading = false
        this.excelJsonUse(res)
      }).catch(err => {
        console.log(err)
        this.controlLoading = false
      })
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
