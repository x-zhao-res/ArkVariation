<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col v-for="(index,key) in mapInformation" :key="key" :xs="24" :sm="24" :lg="6">
        <el-card shadow="hover" class="useCard">
          <div class="text-top" @click="toUrls(index.urls)">{{ index.name }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SupServer',
  data() {
    return {
      mapInformation: [
        {
          name: '孤岛',
          urls: 'steam://connect/150.138.72.39:11191'
        },
        {
          name: '仙境',
          urls: 'steam://connect/150.138.72.39:11201'
        },
        {
          name: '灭绝',
          urls: 'steam://connect/150.138.72.39:11231'
        },
        {
          name: '水晶岛',
          urls: 'steam://connect/150.138.72.39:11196'
        },
        {
          name: '创世1',
          urls: 'steam://connect/150.138.72.39:11216'
        },
        {
          name: '创世2',
          urls: 'steam://connect/150.138.72.39:11221'
        },
        {
          name: '瓦尔',
          urls: 'steam://connect/150.138.72.39:11256'
        },
        {
          name: '迷失岛',
          urls: 'steam://connect/150.138.72.39:11226'
        },
        {
          name: '维京',
          urls: 'steam://connect/150.138.72.39:11261'
        },
        {
          name: '焦土',
          urls: 'steam://connect/150.138.72.39:17943'
        },
        {
          name: '马服',
          urls: 'steam://connect/150.138.72.39:17965'
        }
      ]
    }
  },
  methods: {
    toUrls(urls) {
      location.href = urls
    }
  }
}
</script>

<style scoped lang="scss">
.useCard{
  margin-left: 10px;
  margin-top: 10px;
  height: auto;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .text-top{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
    width: 100%;
    user-select: none;
    font-size: 40px;
    font-family: 黑体,serif;
    caret-color: transparent;
  }
}
</style>
