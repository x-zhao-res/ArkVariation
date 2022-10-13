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
            <el-button v-show="$store.state.arkuser.isAdmin" :disabled="eventInf.event.eventState === 2" type="primary">重置进度</el-button>
            <el-button type="success" :disabled="eventInf.event.eventState===2?true:(babyProgress!==100)">记录点数</el-button>
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
            <el-button v-show="$store.state.arkuser.isAdmin" :disabled="eventInf.event.eventState === 2" type="primary">重置进度</el-button>
            <el-button v-show="$store.state.arkuser.isAdmin" :disabled="eventInf.event.eventState === 2" type="danger" @click="abandonEvent">废弃</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { fotBabyTime, fotUpTime } from '@/utils/arkVaryFunction'
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
    this.showData()
    this.getTimeUse()
    this.changeInterval()
  },
  methods: {
    abandonEvent() {
      console.log(this.eventInf.event.id)
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
