<template>
  <div>
    <!-- 面包屑导航区域 开始-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 结束-->
    <!-- card卡片区域 开始-->
    <el-card class="box-card">
      <el-button type="primary">添加分类</el-button>
      <!-- table-tree 展示区 开始-->
	  <zk-table :data="catInfos" :columns="catInfosColumns"></zk-table>
      <!-- table-tree 展示区 结束-->
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
</style>
