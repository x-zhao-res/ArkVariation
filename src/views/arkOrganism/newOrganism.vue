<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div class="inputBoxUse">
          <span class="inputBoxTitle">生物名称:</span>
          <el-input v-model="Origanism.oriName" style="width: 400px" placeholder="请输入生物名称" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">创建日期:</span>
          <el-input v-model="Origanism.createTime" :disabled="true" style="width: 400px" placeholder="请输入生物名称" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">成长周期:</span>
          <el-input-number v-model="Origanism.upTime" style="width: 400px" label="描述文字" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">妊娠周期:</span>
          <el-input-number v-model="Origanism.babyTime" style="width: 400px" label="描述文字" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">贤者时间:</span>
          <el-input-number v-model="Origanism.fuckInterval" style="width: 400px" label="描述文字" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">备注:</span>
          <el-input
            v-model="Origanism.noForget"
            style="width: 400px"
            placeholder="请输入生物备注"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
          />
        </div>
        <div class="inputBoxUse">
          <el-button style="width: 130px;font-size: 14px;font-family: 黑体,serif" type="primary" @click="OrianismCreate">创建</el-button>
          <el-button style="width: 130px;font-size: 14px;font-family: 黑体,serif" type="danger" @click="ClearAll">清空</el-button>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import waves from '@/directive/waves/index.js' // 水波纹指令
import { createOrianism } from '@/api/arkUse/orianism'
export default {
  name: 'NewOrganism',
  components: {
  },
  directives: {
    waves
  },
  data() {
    return {
      Origanism: {
        oriName: null,
        createTime: this.toGetTime(), // 这里用时间戳的格式写
        upTime: 0,
        varyAllNum: 0,
        babyTime: '',
        fuckInterval: 0,
        belongTribe: this.$store.state.arkuser.belongTribe,
        noForget: ''
      }
    }
  },
  mounted() {

  },
  methods: {
    toGetTime() {
      var time = new Date()
      return time.toLocaleDateString()
    },
    OrianismCreate() {
      console.log(this.Origanism)
      createOrianism(this.Origanism).then(res => {
        if (res.message === '创建成功') {
          this.$notify({
            title: '创建成功',
            type: 'success',
            message: this.Origanism.oriName + ' -创建成功！'
          })
          setTimeout(() => {
            this.ClearAll() // 延迟清除，帮助创建下一个
          }, 500)
        } else {
          this.$message({
            message: '创建失败，请联系管理员',
            type: 'error'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    ClearAll() {
      this.Origanism.oriName = ''
      this.Origanism.notForget = ''
      this.Origanism.toBigTime = 0
      this.Origanism.upTime = 0
      this.Origanism.fuckInterval = 0
      this.Origanism.createTime = this.toGetTime()
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
