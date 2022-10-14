<template>
  <div style="margin-top: 10px;margin-bottom: 10px;width: auto;height: auto">
    <el-card class="group-box">
      <div class="group-box-header">
        <span style="display: flex;align-items: center;">
          <el-link type="default" :underline="false" :style="{ color:(eventInf.event.eventState===1 ? '#13CE66' : (eventInf.event.eventState===2)?'#FF4949':'#1890FF') }" class="link-color">
            {{ eventInf.groupItem.name }}
          </el-link>
          <el-tag style="margin-left: 10px" effect="plain" :type="(eventInf.event.eventState===0)?'primary':((eventInf.event.eventState === 1)?'success':'danger')"> {{ (eventInf.event.eventState===0)?'未录入':((eventInf.event.eventState === 1)?'已录入':'已废弃') }} </el-tag>
        </span>
        <span style="font-size: 26px;font-weight: bolder;font-family: 'Lucida Console','serif'">{{ eventInf.groupItem.attributeNum }}/254</span>
      </div>
      <div class="progress-fuck">
        <el-row :gutter="2">
          <el-col :span="8" style="display: flex;align-items: center">
            <div style="font-size: 18px;font-family: 黑体,serif;font-weight: bolder;">妊娠进度——</div>
            <div style="font-size: 24px;font-weight: bolder;font-family: 'Lucida Console','serif'">{{ babyProgress }}%</div>
          </el-col>
          <el-col :span="24" style="margin-top: 10px">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="babyProgress"
              :status="(babyProgress > 80) ? 'success':(babyProgress<30 ? 'exception' : 'format')"
            />
          </el-col>
          <el-col :span="12" style="margin-top: 10px">
            <el-button v-show="$store.state.arkuser.isAdmin" :disabled="eventInf.event.eventState === 2 || eventInf.event.eventState === 1 || babyProgress === 100" type="primary" @click="rebabyTime">重置进度</el-button>
            <el-button type="success" :disabled="eventInf.event.eventState===1?'true':eventInf.event.eventState===2?true:(babyProgress!==100)" @click="accordNumVary">记录点数</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="progress-fuck">
        <el-row :gutter="2">
          <el-col :span="8" style="display: flex">
            <div style="font-size: 18px;font-family:  黑体,serif;font-weight: bolder">成长进度——</div>
            <div style="font-size: 24px;font-weight: bolder;font-family: 'Lucida Console','serif'">{{ upProgress }}%</div>
          </el-col>
          <el-col :span="24" style="margin-top: 10px">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="upProgress"
              :status="(upProgress > 80) ? 'success':(upProgress<30 ? 'exception' : 'format')"
            />
          </el-col>
          <el-col :span="12" style="margin-top: 10px">
            <el-button v-show="$store.state.arkuser.isAdmin" :disabled="eventInf.event.eventState === 2 || eventInf.event.eventState=== 1 || upProgress === 100 || upProgress === 0" type="primary" @click="reupTime">重置进度</el-button>
            <el-button v-show="$store.state.arkuser.isAdmin" :disabled="eventInf.event.eventState === 2 || eventInf.event.eventState===1" type="danger" @click="accessAbondon">废弃</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { fotBabyTime, fotUpTime, reTime } from '@/utils/arkVaryFunction'
import { abandonEvent, recordEvent, changeTime } from '@/api/arkUse/events'
export default {
  name: 'CardsComponent',
  // eslint-disable-next-line vue/require-prop-types
  props: ['optionget', 'eventforce'],
  data() {
    return {
      option: this.optionget,
      eventInf: this.eventforce,
      upProgress: 0,
      babyProgress: 0
    }
  },
  mounted() {
    this.getTimeUse()
    this.changeInterval()
  },
  methods: {
    changeTimeInterface(time) {
      changeTime({ id: this.eventInf.event.id, timeStart: time.toString() }).then(res => {
        if (res.message === '修改成功') {
          this.$notify({
            title: '修改成功',
            message: '时间修改成功'
          })
          this.$emit('regresh')
          this.eventInf.event.timeStart = null
          this.eventInf.event.timeStart = time.toString()
          this.getTimeUse()
          this.changeInterval()
        } else {
          this.$notify({
            title: '修改失败',
            message: '请检查网络或联系管理员'
          })
        }
      })
    },
    reupTime() {
      this.$prompt('请输入成长进度', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (!(value < 0 || value > 100)) {
          // 总时间是开始+妊娠的毫秒数,value本身是string
          console.log(value)
          let retimeUse
          console.log('成长测试', (parseInt(this.eventInf.event.timeStart) + (this.eventInf.orianismItem.babyTime * 60000)))
          console.log(parseInt(this.eventInf.event.timeStart), this.eventInf.orianismItem.babyTime * 60000)
          if (parseInt(value) > this.upProgress) {
            // 这是希望调高的
            retimeUse = reTime(parseInt(this.eventInf.event.timeStart), (this.eventInf.orianismItem.upTime) * 60000, (parseInt(value) - this.upProgress) * 0.02, 1)
          } else if (parseInt(value) < this.upProgress) {
            // 这是希望调低的
            retimeUse = reTime(parseInt(this.eventInf.event.timeStart), (this.eventInf.orianismItem.upTime) * 60000, (this.upProgress - parseInt(value)) * 0.02, 0)
          }
          this.changeTimeInterface(retimeUse)
        } else {
          this.$message('输入的数据不合法')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    rebabyTime() {
      this.$prompt('请输入妊娠进度', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (!(value < 0 || value > 100)) {
          let retimeUse
          console.log(value)
          if (parseInt(value) > this.babyProgress) {
            // 这是希望调高的
            retimeUse = reTime(parseInt(this.eventInf.event.timeStart), (this.eventInf.orianismItem.upTime + this.eventInf.orianismItem.babyTime) * 60000, (parseInt(value) - this.babyProgress) * 0.01, 1)
          } else if (parseInt(value) < this.babyProgress) {
            // 这是希望调低的
            retimeUse = reTime(parseInt(this.eventInf.event.timeStart), (this.eventInf.orianismItem.upTime + this.eventInf.orianismItem.babyTime) * 60000, (this.babyProgress - parseInt(value)) * 0.01, 0)
          }
          this.changeTimeInterface(retimeUse)
        } else {
          this.$message('输入的数据不合法')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    accordNumVary() {
      this.$prompt('请输入变异点数(1-5)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (!(value < 1 || value > 5)) {
          // console.log(value)
          // console.log(this.eventInf)
          // console.log(parseInt(value))
          // console.log(this.eventInf.event.id)
          // console.log(this.eventInf.groupItem.id)
          // console.log(this.eventInf.orianismItem.id)
          recordEvent({
            id: this.eventInf.event.id, // 事件ID
            orianismId: this.eventInf.orianismItem.id, // 生物ID
            varyNum: parseInt(value), // 变异点数
            groupId: this.eventInf.groupItem.id // 组ID
          }).then(res => {
            if (res.message === '录入成功') {
              this.$notify({
                title: res.message,
                message: '组录入成功',
                type: 'success'
              })
              this.$emit('regresh')
              this.eventInf.event.eventState = null
              this.eventInf.event.eventState = 1
            } else {
              this.$notify({
                title: '录入失败',
                message: '请检查网络或联系管理员',
                type: 'error'
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    accessAbondon() {
      this.$confirm('是否废除此次变异？请注意不可恢复', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.abandonEvent()
      })
    },
    abandonEvent() {
      abandonEvent({ id: this.eventInf.event.id, eventState: 2, upNum: 0 }).then(res => {
        if (res.message === '修改成功') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.$emit('regresh')
          this.eventInf.event.eventState = null
          this.eventInf.event.eventState = 2
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getTimeUse() {
      if (this.eventInf.event.eventState !== 2) {
        this.upProgress = fotUpTime(parseInt(this.eventInf.event.timeStart), this.eventInf.orianismItem.upTime, this.eventInf.orianismItem.babyTime)
        this.babyProgress = fotBabyTime(parseInt(this.eventInf.event.timeStart), this.eventInf.orianismItem.upTime, this.eventInf.orianismItem.babyTime)
      } else {
        this.upProgress = 0
        this.babyProgress = 0
      }
    },
    showData() {
      console.log(this.eventInf)
    },
    changeInterval() {
      setInterval(() => {
        if (this.eventInf.event.eventState !== 2) {
          this.upProgress = fotUpTime(parseInt(this.eventInf.event.timeStart), this.eventInf.orianismItem.upTime, this.eventInf.orianismItem.babyTime)
          this.babyProgress = fotBabyTime(parseInt(this.eventInf.event.timeStart), this.eventInf.orianismItem.upTime, this.eventInf.orianismItem.babyTime)
        }
      }, 2000)
    }
  }
}
</script>

<style scoped lang="scss">
.link-color{
  font-weight: bolder;font-size: 19px;font-family: 'Microsoft YaHei','serif'
}
.group-box{
  margin-top: 20px;
.group-box-header{
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: auto;
}
.progress-fuck{
  width: 100%;
  height: auto;
  margin-top: 20px;
}
}
</style>
