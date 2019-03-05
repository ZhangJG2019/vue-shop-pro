<template>
  <div>
    <!-- 面包屑导航区域 开始-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 结束-->
    <!-- card卡片区域 开始-->
    <el-card class="box-card">
      <!-- 警告区 开始-->
      <el-alert title="注意,只允许为第三级别分类设置参数!" type="warning" show-icon :closeable="false"></el-alert>
      <!-- 警告区 结束-->
      <!-- 级联选择器 开始 -->
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            expand-trigger="hover"
            :options="catInfos"
            :props="catInfosProps"
            v-model="selectedCat"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签切换区 开始-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="showButton">动态添加参数</el-button>
          <!-- 动态表格展示数据列表 开始-->
          <el-table :data="manyParamInfos" border style="width: 100%">
            <el-table-column type="expand">
              <!-- 获取每个参数记录信息  开始-->
              <template slot-scope="info">
                <!-- 展示每个参数的可选值列表 -->
                <el-tag
                  v-for="(item,k) in info.row.attr_vals_arr"
                  :key="k"
                  closable
                  disable-transitions
                >{{item}}</el-tag>
                <!-- 添加可选值 的按钮和输入框 开始-->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(info.row)"
                  @blur="handleInputConfirm(info.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                <!-- 添加可选值 的按钮和输入框 结束-->
              </template>
              <!-- 获取每个参数记录信息  结束-->
            </el-table-column>
            <el-table-column prop="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="动态参数名称"></el-table-column>
            <el-table-column label="操作" width="350">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
          <!-- 动态表格展示数据列表 结束-->
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="showButton">静态添加参数</el-button>
          <!-- 静态表格展示数据列表 开始-->
          <el-table :data="onlyParamInfos" border style="width: 100%" @expand-change="fn">
            <el-table-column type="expand">
              <!-- 获取每个参数记录信息  开始-->
              <template slot-scope="info">
                <!-- 展示每个参数的可选值列表 -->
                <el-tag
                  v-for="(item,k) in info.row.attr_vals_arr"
                  :key="k"
                  disable-transitions
                  closable
                >{{item}}</el-tag>
                <!-- 添加可选值 的按钮和输入框 开始-->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(info.row)"
                  @blur="handleInputConfirm(info.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                <!-- 添加可选值 的按钮和输入框 结束-->
              </template>
              <!-- 获取每个参数记录信息  结束-->
            </el-table-column>
            <el-table-column prop="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="动态参数名称"></el-table-column>
            <el-table-column label="操作" width="350">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
          <!-- 静态表格展示数据列表 结束-->
        </el-tab-pane>
      </el-tabs>
      <!-- 标签切换区 结束-->
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
  data() {
    return {
      // 标签切换相关 开始
      inputValue: '', // 接收输入框信息
      inputVisible: false, // 输入框/按钮 切换显示开关
      // 接收分类参数列表信息
      manyParamInfos: [],
      onlyParamInfos: [],
      // 接收选取的第三级别分类id
      catThreeId: 0,
      // 添加按钮是否激活
      showButton: true,
      // 设置默认显示标签 / 获取选中标签
      activeName: 'many',
      // 标签切换相关 结束
      // 初始化商品分类-级联选择器 开始
      // 定义 级联选择器 数据
      catInfos: [],
      // 给 级联选择器节点 设置内容属性
      catInfosProps: {
        /*
         * 与服务器端返回数据字段名一致，
         * 用于在浏览器端接收服务器传回的数据
         */
        label: 'cat_name', // 名称
        value: 'cat_id', // 具体值
        children: 'children' // 子级
      },
      // 设置 或 接收 选择器中选中的项目
      selectedCat: []
      // 初始化商品分类-级联选择器 结束
    }
  },
  methods: {
    // 只允许点开一个table行
    fn(row, expandRows) {
      if (expandRows.length > 1) {
        expandRows.shift()
      }
    },
    // 输入框敲回车键 或
    // 失去焦点的回调函数
    async handleInputConfirm(newParam) {
      // 通过el-tag显示可以被添加的可选值（本质：给newParam.attr_vals_arr增加元素而已）
      if (this.inputValue.trim() !== '') {
        const { data: res } = await this.$http.post(
          'categories/' + this.cat_id + '/attributes'
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        newParam.attr_vals_arr.push(this.inputValue.trim())
      }
      // input隐藏 button显示
      this.inputVisible = false
      // 清除输入框输入的旧信息
      this.inputValue = ''
    },
    // button按钮被点击回调
    showInput() {
      this.inputVisible = true // input显示  button隐藏
      // 给输入框获得焦点
      // $nextTick作用：全部内容从“Vue内存”已经渲染到“html容器”了
      // 与window.onload相似
      this.$nextTick(_ => {
        // 如下，有连贯两次$refs，主要作用：获得原始底层的input元素
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 统一获取参数列表实现逻辑
    async getParamsInfos() {
      /*
      两个必要条件：
      1）第三级别分类id catThreeId
      2）参数类型（动态/静态） activeName
       */
      const { data: res } = await this.$http.get(
        'categories/' + this.catThreeId + '/attributes',
        { params: { sel: this.activeName } } // cel:文档中区分静态参数还是动态参数
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 通过data成员接收获取回来的“参数”信息
      if (this.activeName === 'many') {
        this.manyParamInfos = res.data
        console.log(this.manyParamInfos)
      } else {
        this.onlyParamInfos = res.data
        console.log(this.onlyParamInfos)
      }
      // 遍历，把 各个参数信息的 可选值内容 由字符串变为数组、
      res.data.forEach(item => {
        // 给参数信息添加attr_vals_arr成员，用以接收 数组格式可选值 信息
        item.attr_vals_arr = item.attr_vals.split(' ') // split把一个字符串分割成字符串数组
      })
    },
    // 切换标签被点击后的回调函数
    handleClick() {
      // 如果没有选择第三级别分类，就不要获取参数了，代码停止
      if (this.catThreeId === 0) {
        return null
      }
      // 如果获取了就获取对应的参数
      this.getParamsInfos()
    },
    // 获取级联选择器的内容
    async getCatInfos() {
      // 获得“第1/2/3级别”分类信息
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 通过catInfos接收全部的分类信息
      this.catInfos = res.data
    },
    // 级联选择器 内容变化的回调
    handleChange() {
      // 如果选取设置的“非第3级别”，请重新分类
      if (this.selectedCat.length !== 3) {
        // 重置分类
        this.selectedCat = []
        // 禁用添加按钮
        this.showButton = true
        // 如果没选就重置id
        this.catThreeId = 0
        // 参数列表清空
        this.manyParamInfos = []
        this.onlyParamInfos = []
      } else {
        // 如果选取了第三级别分类
        // 激活添加按钮
        this.showButton = false
        // 把第三级别分类id 赋给catThreeId
        this.catThreeId = this.selectedCat[2]
        // 获取对应的参数信息
        this.getParamsInfos()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
.el-row {
  margin-top: 15px;
}
.input-new-tag {
  width: 100px;
}
</style>
