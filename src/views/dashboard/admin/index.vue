<template>
  <div class="dashboard-editor-container">

    <panel-group :card="card" />
    <el-row align="middle" :gutter="32">

      <el-col v-for="(item,key) in groupCard" :key="key" :xs="24" :sm="24" :lg="6">
        <el-card style="cursor: pointer" shadow="hover" class="oranism-card" @click="toDetails">
          <div slot="header" style="display: flex;justify-content: space-between;align-items: center">
            <span style="font-size: 19px;font-weight: bolder">{{ item.groupName }}</span>
            <el-tag :type="item.fuckState === 1?'success':'danger'">{{ item.fuckState === 1?'已就绪':'未就绪' }}</el-tag>
          </div>
          <div class="num-in-now">
            {{ item.attributeNum }} / 254
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import { getGroup } from '@/api/arkUse/orianism'
import { allIndex } from '@/api/arkUse/user'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup
  },
  data() {
    return {
      lineChartData: lineChartData.shoppings,
      groupCard: [],
      card: null
    }
  },
  mounted() {
    this.getGroups()
    this.indexGet()
  },
  methods: {
    toDetails() {
      console.log(111)
    },
    getGroups() {
      getGroup({ belongTribe: this.$store.state.arkuser.belongTribe }).then(res => {
        this.groupCard = res
        console.log(this.groupCard)
      })
    },
    indexGet() {
      allIndex({ tribe: this.$store.state.arkuser.belongTribe }).then(res => {
        this.card = res
        console.log(this.card)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.num-in-now{
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}
.oranism-card{
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
.dashboard-editor-container {
  padding: 32px 32px 16px;
  background-color: rgb(240, 242, 245);
  position: absolute;
  width: 100%;
  overflow: auto;
  height: 100%;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
