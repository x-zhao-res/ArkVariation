<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div class="inputBoxUse">
          <span class="inputBoxTitle">变异所属组:</span>
          <el-select v-model="groupName" no-data-text="请选择" style="width: 400px" placeholder="请选择" @change="changeGroup">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.varyOrianismId"
            />
          </el-select>
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">创建时间:</span>
          <el-input v-model="data" :disabled="true" style="width: 400px" placeholder="请输入生物名称" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">备注:</span>
          <el-input
            v-model="event.eventNoForget"
            style="width: 400px"
            placeholder="请输入备注"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
          />
        </div>
        <div class="inputBoxUse">
          <el-button style="width: 130px;font-size: 14px;font-family: 黑体,serif" type="primary" @click="creatEvent">创建</el-button>
          <el-button style="width: 130px;font-size: 14px;font-family: 黑体,serif" type="danger" @click="deleteAll">清空</el-button>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import waves from '@/directive/waves/index.js' // 水波纹指令
import { getGroup, getOrianism } from '@/api/arkUse/orianism'
import { createEventUse } from '@/api/arkUse/events'

export default {
  name: 'NewOrganism',
  components: {
  },
  directives: {
    waves
  },
  data() {
    return {
      groupList: [],
      data: this.toAllGetTime(),
      groupName: '',
      event: {
        eventNoForget: '',
        timeStart: null,
        belongGroupId: 0,
        belongOrianismId: 0,
        eventState: 0,
        upNum: -1
      }
    }
  },
  mounted() {
    setInterval(() => { this.data = this.toAllGetTime() }, 1000)
    this.groupSelectList()
  },
  methods: {
    changeGroup(data) {
      for (let groupNum = 0; groupNum < this.groupList.length; groupNum++) {
        if (this.groupList[groupNum].varyOrianismId === data) {
          this.event.belongGroupId = this.groupList[groupNum].id
          this.event.belongOrianismId = this.groupList[groupNum].varyOrianismId
        }
      }
    },
    groupSelectList() {
      getGroup({ belongTribe: this.$store.state.arkuser.belongTribe }).then(res => {
        this.groupList = res
      }).catch(err => {
        console.log(err)
      })
    },
    toAllGetTime() {
      var time = new Date()
      var ymd = time.toLocaleDateString()
      var hms = time.toLocaleTimeString('chinese', { hour12: false })
      return ymd + ' ' + hms
    },
    creatEvent() {
      getOrianism({ id: this.event.belongOrianismId }).then(res => {
        this.event.timeStart = new Date().getTime()
        this.event.planStart = ((res.data[0].upTime + res.data[0].babyTime) * 60000 + this.event.timeStart).toString() // 计算预完成时间
        this.event.timeStart = this.event.timeStart.toString()
        createEventUse({ ...this.event }).then(res => {
          if (res.message === '创建成功') {
            this.$notify({
              title: res.message,
              message: '事件创建成功,开始计时',
              type: 'success'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    deleteAll() {
      this.event = {
        eventNoForget: '',
        timeStart: null,
        belongGroupId: 0,
        belongOrianismId: 0
      }
      this.groupName = ''
      this.$message({
        message: '清除成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.inputBoxUse{
  padding-bottom: 5px;
  padding-top: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  width: auto;
  height: auto;
  justify-content: center;
  .inputBoxTitle{
    margin-right: 9px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-family: 黑体,serif;
    font-weight: 500;
  }
}
</style>
