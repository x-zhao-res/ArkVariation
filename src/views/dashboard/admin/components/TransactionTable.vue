<template>
  <div>
    <el-card>
      <span style="font-size: 20px;font-family: 微软雅黑,serif;font-weight: bolder;position: relative;z-index: 15">部落日志</span>
      <el-table stripe height="380" :data="list" style="width: 100%;margin-top: -20px;position: relative;z-index: 10">
        <el-table-column min-width="200">
          <template slot-scope="scope">
            <div style="font-size: 15px">{{ scope.row.usecode }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      list: [
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        },
        {
          usecode: '#太平别院 部落成员 ALEX 创建了变异事件 abse'
        }
      ]
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
