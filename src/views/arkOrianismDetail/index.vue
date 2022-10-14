<template>
  <div class="mix-pages">
    <el-row>
      <el-card class="chart-box-card">
        <div id="main" style="height: 400px;width: 100%" />
      </el-card>
    </el-row>
    <el-row>
      <el-card class="descript-box">
        <el-descriptions direction="vertical" :column="4" border>
          <template slot="title">
            <span style="font-size: 19px;font-family: 'Microsoft YaHei','serif'">{{ data.oriName }}基础信息</span>
          </template>
          <template slot="extra">
            <el-button type="primary" size="middle">编辑</el-button>
          </template>
          <el-descriptions-item label="生物名称">{{ data.oriName }}</el-descriptions-item>
          <el-descriptions-item label="创建日期">{{ data.createTime }}</el-descriptions-item>
          <el-descriptions-item label="变异总次数">{{ data.varyAllNum }}</el-descriptions-item>
          <el-descriptions-item label="成长周期">{{ data.upTime + 'min' }}</el-descriptions-item>
          <el-descriptions-item label="贤者时间">{{ data.fuckInterval + 'min' }}</el-descriptions-item>
          <el-descriptions-item label="妊娠周期">{{ data.babyTime + 'min' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ data.noForget }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-row>
    <el-row>
      <cardsComponent v-for="(item,key) in eventSimple" :key="key" :optionget="option" :eventforce="item" @regresh="refreshon" />
    </el-row>
  </div>
</template>

<script>
import echart from 'echarts'
import cardsComponent from '@/views/arkOrianismDetail/cardsComponent'
import { getGroup } from '@/api/arkUse/orianism'
import { getEvent } from '@/api/arkUse/events'

export default {
  name: 'Index',
  components: {
    cardsComponent
  },
  data() {
    return {
      data: this.$route.params.data,
      chartSet: null,
      orianismArray: [],
      eventSimple: [],
      tabChooseUse: null,
      chartAttrbute: [0, 0, 0, 0, 0],
      textStyleUse: {
        fontSize: 18,
        fontWeight: 'bolder'
      },
      desLabStyle: {
        fontSize: '20px',
        fontFamily: '黑体'
      },
      option: [
        { value: 1, label: '攻击' },
        { value: 2, label: '生命' },
        { value: 3, label: '氧气' },
        { value: 4, label: '耐力' },
        { value: 5, label: '移速' }
      ]
    }
  },
  mounted() {
    console.log(this.data.id)
    this.getInformation()
    this.geteventSimple()
  },
  methods: {
    refreshon() {
      this.getInformation()
      this.geteventSimple()
    },
    handleClick(data) {
      console.log(data)
    },
    geteventSimple() {
      this.eventSimple = []
      getEvent({
        belongTribe: this.$store.state.arkuser.belongTribe,
        belongOrianismId: this.data.id
      }).then(res => {
        this.eventSimple = res
      }).catch(err => {
        console.log(err)
      })
    },
    getInformation() {
      this.orianismArray = []
      getGroup({
        varyOrianismId: this.data.id,
        belongTribe: this.$store.state.arkuser.belongTribe
      }).then(res => {
        this.orianismArray = res
        for (let charNum = 0; charNum < this.orianismArray.length; charNum++) {
          this.chartAttrbute[(this.orianismArray[charNum].varyAttribute - 1)] = this.orianismArray[charNum].attributeNum
        }
        this.chartinit(this.chartAttrbute)
      }).catch(err => {
        console.log(err)
      })
    },
    chartinit(data) {
      this.chartSet = echart.init(document.getElementById('main'))
      var option = {
        color: ['#c89b40', '#44cef6', '#f2be45', '#f20c00', '#ffa631'],
        xAxis: {
          type: 'category',
          data: [
            {
              value: '攻击',
              textStyle: this.textStyleUse
            },
            {
              value: '生命',
              textStyle: this.textStyleUse
            },
            {
              value: '氧气',
              textStyle: this.textStyleUse
            },
            {
              value: '耐力',
              textStyle: this.textStyleUse
            },
            {
              value: '移速',
              textStyle: this.textStyleUse
            }
          ]
        },
        title: {
          show: true,
          text: this.data.oriName + '属性柱状图',
          textStyle: {
            fontSize: 19,
            fontFamily: 'Microsoft YaHei'
          }
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          enable: true
        },
        series: [
          {
            data: data,
            type: 'bar',
            showBackground: true,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorist = ['#4c221b', '#f2be45', '#f20c00', '#44cef6', '#ffa631']
                  return colorist[params.dataIndex]
                }
              }
            },
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }
      this.chartSet.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
    .mix-pages{
      background-color: #f0f2f5;
      padding: 20px;
      min-height: calc(100vh - 84px);
    }
    .chart-box-card{
      width: 100%;
      max-width: 100%;
      height: auto;
      .charts-use{
        width: 100%;
        height: 300px;
      }
    }
    .descript-box{
      margin-top: 20px;
      height: auto;
      width: 100%;
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
