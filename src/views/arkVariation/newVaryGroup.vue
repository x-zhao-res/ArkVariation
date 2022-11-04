<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div class="inputBoxUse">
          <span class="inputBoxTitle">组名称:</span>
          <el-input v-model="Origanism.groupName" :disabled="true" style="width: 400px" placeholder="组名称" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">创建日期:</span>
          <el-input v-model="Origanism.creatTime" :disabled="true" style="width: 400px" placeholder="请输入生物名称" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">绑定生物:</span>
          <!--          -->
          <el-select v-model="Origanism.varyOrianismId" style="width: 400px" placeholder="请选择" @change="orianismName">
            <el-option
              v-for="item in orianismId"
              :key="item.id"
              :label="item.oriName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">变异属性:</span>
          <el-select v-model="Origanism.varyAttribute" no-data-text="请选择" style="width: 400px" placeholder="请选择" @change="changeVary">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">龙房名称(可选):</span>
          <el-input v-model="longHouse" style="width: 400px" placeholder="龙房名称" @input="houseInput" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">属性初值:</span>
          <el-input-number v-model="Origanism.attributeNum" :min="1" :max="254" style="width: 400px" label="描述文字" />
        </div>
        <div class="inputBoxUse">
          <span class="inputBoxTitle">备注:</span>
          <el-input
            v-model="Origanism.groupNoForget"
            style="width: 400px"
            placeholder="请输入生物备注"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
          />
        </div>
        <div class="inputBoxUse">
          <el-button style="width: 130px;font-size: 14px;font-family: 黑体,serif" type="primary" @click="groupCreate">创建</el-button>
          <el-button style="width: 130px;font-size: 14px;font-family: 黑体,serif" type="danger" @click="allClear">清空</el-button>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import waves from '@/directive/waves/index.js' // 水波纹指令
import { getOrianismName, createGroup, getOrianism } from '@/api/arkUse/orianism'

export default {
  name: 'NewOrganism',
  components: {
  },
  directives: {
    waves
  },
  data() {
    return {
      orianismId: [],
      setName: '',
      setAtt: '',
      longHouse: '',
      setValue: '',
      Origanism: {
        groupName: ' - ',
        creatTime: this.toGetTime(), // 这里用时间戳的格式写
        varyOrianismName: '',
        varyAttribute: null,
        varyOrianismId: null, // ID放到后端查表做
        attributeNum: 0,
        belongTribe: this.$store.state.arkuser.belongTribe,
        lastFuckTime: new Date().getTime().toString(),
        groupNoForget: '',
        fuckState: 1,
        fuckInterval: ''// 交配间隔，方便写进度条
      },
      OriganismOld: {
        groupName: ' - ',
        creatTime: this.toGetTime(), // 这里用时间戳的格式写
        varyOrianismName: '',
        varyAttribute: null,
        varyOrianismId: null, // ID放到后端查表做
        attributeNum: 0,
        belongTribe: this.$store.state.arkuser.belongTribe,
        lastFuckTime: new Date().getTime().toString(),
        groupNoForget: '',
        fuckState: 1
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
    this.getName()
  },
  methods: {
    houseInput(value) {
      this.setValue = value
      if (this.setName !== '') {
        if (this.setAtt === '') {
          this.Origanism.groupName = this.setName + ' - ' + this.setValue
        } else {
          this.Origanism.groupName = this.setName + ' - ' + this.setAtt + ' - ' + this.setValue
        }
      }
    },
    toGetTime() {
      var time = new Date()
      return time.toLocaleDateString()
    },
    allClear() {
      this.Origanism = this.OriganismOld
    },
    groupCreate() {
      // fuckInterval这个属性从生物信息给，然后还要做查询校验
      getOrianism({ oriName: this.Origanism.varyOrianismName, belongTribe: this.Origanism.belongTribe }).then(res => {
        this.Origanism.fuckInterval = res.data[0].fuckInterval
        createGroup(this.Origanism).then(res => {
          // console.log(res)
          if (res.message === '创建成功') {
            this.$notify({
              title: '创建成功',
              type: 'success',
              message: '组 ' + this.Origanism.varyOrianismName + ' 创建成功'
            })
          } else {
            this.$notify({
              title: res.message,
              type: 'primary',
              message: res.message
            })
          }
          setTimeout(() => {
            this.allClear()
          }, 2000)
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    },
    getName() {
      getOrianismName({ belongTribe: this.$store.state.arkuser.belongTribe }).then(res => {
        this.orianismId = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    orianismName(data) {
      for (let arrNum = 0; arrNum < this.orianismId.length; arrNum++) {
        if (this.orianismId[arrNum].id === data) {
          this.setName = this.orianismId[arrNum].oriName
        }
      }
      console.log(this.setName)
      this.Origanism.groupName = this.setName + ' - ' + this.setAtt
      this.Origanism.varyOrianismName = this.setName
    },
    changeVary(data) {
      console.log(data)
      for (let attNum = 0; attNum < this.option.length; attNum++) {
        if (this.option[attNum].value === data) {
          this.setAtt = this.option[attNum].label
        }
      }
      this.Origanism.groupName = this.setName + ' - ' + this.setAtt
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
