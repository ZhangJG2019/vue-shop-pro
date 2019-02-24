<template>
  <div>
    <!-- 面包屑导航区域 开始-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 结束-->
    <!-- card卡片区域 开始-->
    <el-card class="box-card">
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      <!-- table-tree 展示区 开始 -->
      <zk-table
        :data="catInfos"
        :columns="catInfosColumns"
        :selection-type="false"
        :expand-type="false"
        show-index
      >
        <template slot="order" slot-scope="info">
          <el-tag v-if="info.row.cat_level==0">一级</el-tag>
          <el-tag v-else-if="info.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
      <!-- table-tree 展示区 结束 -->
      <!-- 分页 开始 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-size="querycdt.pagesize"
        layout="total,prev, pager, next, jumper"
        :total="querycdt.tot"
      ></el-pagination>
      <!--
        size-change : pageSize 改变时会触发，每页条数
        current-change：handleCurrentChange 改变时会触发当前页
        current-page：当前页数
        page-sizes：每页显示个数选择器的选项设置， 10
        layout：组件布局，子组件名用逗号分隔
        total：总条目数
      -->
      <!-- 分页 结束 -->
      <!-- 添加用户---【对话框】 开始 -->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类上级">
            <!-- 级联选择器 开始 -->
            <el-cascader
              expand-trigger="hover"
              :options="catInfosTwo"
              :props="catInfosTwoProps"
              v-model="selectedCat"
              @change="handleChange"
              change-on-select
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCat">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加用户---【对话框】 结束-->
      <!-- 级联选择器 结束 -->
    </el-card>
    <!-- card卡片区域 结束-->
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getCatInfos()
  },
  methods: {
    // 添加分类相关 开始
    // 上级分类 更换 后的回调
    handleChange() {
      if (this.selectedCat.length === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        var len = this.selectedCat.length
        this.addForm.cat_pid = this.selectedCat[len - 1]
        this.addForm.cat_level = len
      }
    },
    // 收集数据存储到服务器
    addCat() {
      // 表单验证
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'categories',
            this.addForm
          )
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 关闭对话框、成功提示、数据重新加载
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getCatInfos()
        }
      })
    },
    // 关闭对话框回调
    addDialogClose() {
      // 重置form表单
      this.$refs.addFormRef.resetFields()
      // 重置级联选择器
      this.selectedCat = []
    },
    async showAddDialog() {
      // 展开添加分类的对话框
      this.addDialogVisible = true
      // 获取“级联选择器”（第1/2级别分类）需要的数据
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 通过catInfosTwo接受获得前两个接别的分类信息
      this.catInfosTwo = res.data
    },
    // 添加分类相关 结束
    // 获得首屏显示的分类列表信息：
    async getCatInfos() {
      // 发送get请求，获取数据
      const { data: res } = await this.$http.get('categories/', {
        params: this.querycdt
      })
      // 判断请求响应码，看是否请求成功
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 请求成功,把获得好的3个级别的分类信息赋予给catInfos成员
      this.catInfos = res.data.result
      // 请求成功，显示数据总条数
      this.querycdt.tot = res.data.total
    },
    // 页码切换
    handleCurrentChange(newPage) {
      this.querycdt.pagenum = newPage
      this.getCatInfos()
    },
    // 每页显示条目个数
    handleSizeChange(val) {
      this.querycdt.pagesize = val
      this.getCatInfos()
    }
  },
  data() {
    return {
      // 添加分类相关 开始
      // 给“级联选择器”节点设置内容属性
      catInfosTwoProps: {
        label: 'cat_name', // 名称
        value: 'cat_id', // 值
        children: 'children' // 子级
      },
      // 分类上级显示的数据
      catInfosTwo: [],
      // 设置或接受选中的上级分类
      selectedCat: [],
      // 对话框显示开关
      addDialogVisible: false,
      // 表单数据对象
      addForm: {
        cat_name: '', // 分类名称
        cat_pid: 0, // 分类直接父级id
        cat_level: 0 // 分类等级
      },
      // 定义addFormRules规则校验
      addFormRules: {
        cat_name: [
          {
            required: true,
            message: '分类名称必填',
            trigger: 'blur'
          }
        ]
      },
      // 添加分类相关 结束
      // 创建catInfos分类列表数据
      catInfos: [],
      // 给table-tree定义列属性
      catInfosColumns: [
        // {lable:表格各列头部名称，prop：列内容字段名称}
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 定义获取分类数据的条件
      querycdt: {
        type: 3, // 默认获取3个级别全部分类信息
        pagenum: 1, // 默认页码
        pagesize: 5, // 默认条数
        tot: 0 // 总条数
      }
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>
