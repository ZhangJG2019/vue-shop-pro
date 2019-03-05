<template>
  <div>
    <!-- 面包屑导航区域 开始-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 结束-->
    <!-- card卡片区域 开始-->
    <el-card class="box-card">
      <!-- 提示信息 1 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 提示信息 2 -->
      <!-- 步骤条 1 -->
      <!-- active：设置激活的项目el-step，接收的值必须为number整型的（即项目的下标信息），例如（0/1/2） -->
      <el-steps :active="active-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 步骤条 2 -->
      <!-- 左侧标签栏 1 -->
      <!-- v-model="activeName" 设置 默认激活 或 获取到选中的标签项目的name属性值 -->
      <!-- “activeName”接收信息格式必须为string字符串 -->
      <!-- 标签切换 与 步骤条联动  -->
      <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="100px">
        <el-tabs tab-position="left" v-model="active">
          <el-tab-pane label="基本信息" name="0">
            <!--添加商品基本信息 表单域制作-->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="catInfos"
                :props="catInfosProps"
                v-model="selectedCat"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="headers"
              list-type="picture"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
            <el-button type="primary" style="margin-top:15px" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 左侧标签栏 1 -->
    </el-card>
    <!-- card卡片区域 结束-->
  </div>
</template>

<script>
// 引入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入富文本编辑器的样式
import { quillEditor } from 'vue-quill-editor'

export default {
  // 私有化注册富文本编辑器
  components: {
    quillEditor
  },
  // 生命周期函数
  created() {
    this.getCatInfos()
  },
  data() {
    return {
      // 设置请求头请求信息
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 上传图片路径
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 接收选取的第三级别分类id
      catThreeId: 0,
      // 设置 或 接收 选择器中选中的项目
      selectedCat: [],
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
      // 定义 级联选择器 数据
      catInfos: [],
      // 设置默认“步骤条”激活单元（标签切换也用，达到联动效果）
      active: '0',
      // 制作表单域校验规则
      addFormRules: {
        goods_name: {
          required: true,
          message: '商品名称必填',
          trigger: 'blur'
        },
        goods_price: {
          required: true,
          message: '商品价格必填',
          trigger: 'blur'
        },
        goods_weight: {
          required: true,
          message: '商品重量必填',
          trigger: 'blur'
        },
        goods_number: {
          required: true,
          message: '商品数量必填',
          trigger: 'blur'
        }
      },
      addForm: {
        goods_name: '',
        goods_cat: '', // 给必填项目设置假数据
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        pics: [], // 收集上传图片
        goods_introduce: ''
      }
    }
  },
  methods: {
    // 添加商品，收集数据存储
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 校验成功
          // console.log(this.addForm.goods_cat)
          // console.log(this.addForm)
          const { data: res } = await this.$http.post('goods', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 添加商品成功，成功提示、页面
          this.$message.success(res.meta.msg)
          this.$router.push('/Goods')
        }
      })
    },
    // 级联选择器 内容变化的回调
    handleChange() {
      if (this.selectedCat.length !== 3) {
        console.log(11111111111)
        // 重置分类
        this.selectedCat = []
      } else {
        // 如果选取了第三级别分类
        // 把第三级别分类id 赋给catThreeId
        this.catThreeId = this.selectedCat[2]
        this.addForm.goods_cat = this.selectedCat.join(',')
        // this.goods_cat = this.selectedCat
        // console.log(this.goods_cat)
        // console.log(this.addForm)
        // this.goods_cat = this.selectedCat
        // 获取对应的参数信息
        this.getCatInfos()
      }
    },
    async getCatInfos() {
      // 获得“第1/2/3级别”分类信息
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 通过catInfos接收全部的分类信息
      // this.goods_cat = this.selectedCat
      this.catInfos = res.data
    },
    // 图片上传成功之后的回调处理
    uploadSuccess(result) {
      // result会把上传图片后的响应信息都接收到(data/meta)
      // console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      // 上传成功，把图片“临时”路径名汇总到addForm.pics中
      var obj = { pic: result.data.tmp_path }
      this.addForm.pics.push(obj)
    }
  }
}
</script>

<style lang="less" scoped>
// 给步骤条添加样式
.el-steps,
.el-tabs {
  margin-top: 20px;
}
</style>
