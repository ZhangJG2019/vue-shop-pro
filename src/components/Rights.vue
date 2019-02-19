<template>
  <div>
    <!-- 面包屑导航区域 开始-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 结束-->
    <!-- card卡片区域 开始-->
    <el-card class="box-card">
      <!-- 表格展示数据列表 开始-->
      <el-table :data="rightsInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="220"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径" width="220"></el-table-column>
        <el-table-column prop="level" label="等级" width="220">
          <template slot-scope="info">
            <el-tag v-if="info.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="info.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格展示数据列表 结束-->
    </el-card>
    <!-- card卡片区域 结束-->
  </div>
</template>

<script>
export default {
  // 在生命周期中调用
  created() {
    this.getRightInfos()
  },
  methods: {
    // 获得权限列表数据
    async getRightInfos() {
      const { data: res } = await this.$http.get('rights/list')
      // 数据获取失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 数据获取成功，将获得的数据赋予给rightsInfos成员
      this.rightsInfos = res.data
    }
  },
  data() {
    return {
      // 接收权限列表
      rightsInfos: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
