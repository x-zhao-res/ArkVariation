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
            <span style="font-size: 19px;font-family: 'Microsoft YaHei','serif'">虚空飞龙基础信息</span>
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
          <el-descriptions-item label="已记录变异属性">
            <el-tag size="middle">攻击</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-row>
    <el-row>
      <el-card class="group-box">
        <div class="group-box-header">
          <span style="display: flex;align-items: center;">
            <el-link type="default" :underline="true" style="color: black;font-weight: bolder;font-size: 19px;font-family: 'Microsoft YaHei','serif'">
              虚空飞龙 - 氧气
            </el-link>
            <el-tag style="margin-left: 8px" type="danger">贤者时间就绪</el-tag>
          </span>
          <span style="font-size: 26px;font-weight: bolder;font-family: 'Lucida Console','serif'">142/254</span>
        </div>
        <div class="progress-fuck">
          <el-row :gutter="2">
            <el-col :span="4" style="display: flex;align-items: center">
              <div style="font-size: 18px;font-family: 黑体,serif;font-weight: bolder">妊娠进度——</div>
              <div style="font-size: 24px;font-weight: bolder;font-family: 'Lucida Console','serif'">75.25%</div>
            </el-col>
            <el-col :span="24" style="margin-top: 10px">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="70.25" />
            </el-col>
            <el-col :span="6" style="margin-top: 10px">
              <el-button type="primary">重置进度</el-button>
              <el-button type="danger">结束妊娠</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="progress-fuck">
          <el-row :gutter="2">
            <el-col :span="4" style="display: flex">
              <div style="font-size: 18px;font-family: 黑体,serif;font-weight: bolder">成长进度——</div>
              <div style="font-size: 24px;font-weight: bolder;font-family: 'Lucida Console','serif'">75.25%</div>
            </el-col>
            <el-col :span="24" style="margin-top: 10px">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="70.25" />
            </el-col>
            <el-col :span="6" style="margin-top: 10px">
              <el-button type="primary">重置进度</el-button>
              <el-button type="danger">结束成长</el-button>
              <el-button type="success">记录点数</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import echart from 'echarts'
export default {
  name: 'Index',
  data() {
    return {
      data: this.$route.params.data,
      chartSet: null,
      textStyleUse: {
        fontSize: 18,
        fontWeight: 'bolder'
      },
      desLabStyle: {
        fontSize: '20px',
        fontFamily: '黑体'
      }
    }
  },
  mounted() {
    console.log(this.data)
    this.chartinit(this.data.id)
  },
  methods: {
    chartinit(id) {
      this.chartSet = echart.init(document.getElementById('main'))
      var option = {
        color: ['#c89b40', '#f2be45', '#f20c00', '#44cef6', '#ffa631'],
        xAxis: {
          type: 'category',
          data: [
            {
              value: '攻击',
              textStyle: this.textStyleUse
            },
            {
              value: '耐力',
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
              value: '食物',
              textStyle: this.textStyleUse
            }
          ]
        },
        title: {
          show: true,
          text: '虚空飞龙属性柱状图',
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
            data: [120, 200, 150, 80, 70],
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
