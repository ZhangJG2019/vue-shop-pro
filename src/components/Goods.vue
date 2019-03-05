<template>
  <div>
    <!-- 面包屑导航区域 开始-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片区域 开始-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- :gutter  限制col彼此的间隔宽度 -->
        <el-col :span="8">
          <!--  :span    限制每个col占据的宽度 -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryParams.query"
            :clearable="true"
            @clear="getGoodsInfos"
            @keyup.enter.native="getGoodsInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="$router.push('Goodsadd')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示数据列表 开始-->
      <el-table :data="goodsInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="110"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160"></el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delParams(scope.row.attr_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格展示数据列表 结束-->
      <!-- 数据分页开始 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[5,10,15,40]"
        :page-size="queryParams.pagesize"
        layout="total,sizes,prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>
    </el-card>
    <!-- card卡片区域 结束-->
  </div>
</template>

<script>
export default {
  // 在生命周期函数中，调用获取用户列表数据
  created() {
    this.getGoodsInfos()
  },
  data() {
    return {
      // form表单需要的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 制作表单域校验规则
      addFormRules: {
        username: [{ required: true, message: '商品名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }]
      },
      // 用户数据
      goodsInfos: [],
      // 给获取用户数据设置查询条件
      queryParams: {
        // 查询关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页获取记录条数
        pagesize: 5,
        // 记录总条数
        total: 0
      },
      // 搜索关键字
      keywords: ''
    }
  },
  methods: {
    // 删除商品
    // 数据分页相关-----开始
    // 每条记录条数变化的回调处理
    handleSizeChange(arg) {
      // arg:变化后的记录条数
      // console.log(arg)
      this.queryParams.pagesize = arg
      // 重新根据条件获得数据
      this.getGoodsInfos()
    },
    // 当前页码变化的回调处理
    handleCurrentChange(val) {
      // arg:变化后的当前页码值
      // console.log(arg)
      this.queryParams.pagenum = val
      // 重新根据条件获得数据
      this.getGoodsInfos()
    },
    // 获得用于显示的真实用户列表数据---开始
    async getGoodsInfos() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryParams
      })
      // console.log(res)
      // 判断获取数据是否失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 记录总记录条数
      this.queryParams.total = res.data.total
      // 把获得好的用户数据 赋予 给userInfors成员
      this.goodsInfos = res.data.goods
    }
  }
}
</script>

<style lang="less" scoped>
</style>
