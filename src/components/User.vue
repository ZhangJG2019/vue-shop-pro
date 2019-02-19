<template>
  <div>
    <!-- 面包屑导航区域 开始-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 结束-->
    <!-- card卡片区域 开始-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- :gutter  限制col彼此的间隔宽度 -->
        <el-col :span="8">
          <!--  :span    限制每个col占据的宽度 -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示数据列表 开始-->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="110"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <!--
            插槽填充
            此位置要获得“每个”用户的信息，具体是用户的状态信息
            用户信息已经被子组件（el-table-column）的插槽传递过来了
            <slot row=“每个用户的数据对象”></slot>
            因此可以通过以下方式获得当前遍历好的每个用户的具体信息
            <span slot-scope="info">{{info.row.username}}</span>
          -->
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="changeState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格展示数据列表 结束-->
      <!-- 数据分页开始 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3,5,10,15]"
        :page-size="querycdt.pagesize"
        layout="total,sizes,prev, pager, next, jumper"
        :total="querycdt.tot"
      ></el-pagination>
      <!-- 数据分页结束 -->
      <!-- 添加用户对话框 开始 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加用户对话框 结束-->
      <!-- 修改用户对话框开始 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框结束 -->
      <!-- card卡片区域 结束-->
    </el-card>
  </div>
</template>

<script>
export default {
  // 在生命周期函数中，调用获取用户列表数据
  created() {
    this.getUserInfos()
  },
  data() {
    // 为校验手机号生成一个函数
    // var checkMobile = （rule，value被校验数据，callback回调方法）->{}
    var checkMobile = (rule, value, callback) => {
      // 手机号正则表达式：/^1[3|5|7|8]\d{9}$/gi
      if (!/^1[3|5|7|8]\d{9}$/gi.test(value)) {
        // 校验失败（页面显示错误信息）
        return callback(new Error('手机号码错误'))
      }
      // 校验成功，继续执行
      callback()
    }
    return {
      // 修改用户相关
      // 控制修改用户对话框是否显示（true：显示，false：隐藏）
      editDialogVisible: false,
      // form表单需要的数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 制作表单域校验规则
      editFormRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 自定义校验手机号规则
          // {validator: 校验函数，triggle:'blur'}
          { validator: checkMobile, triggle: 'blur' }
        ]
      },
      // 添加用户相关
      // 控制添加用户对话框是否显示（true：显示，false：隐藏）
      addDialogVisible: false,
      // 制作表单域校验规则
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 自定义校验手机号规则
          // {validator: 校验函数，triggle:'blur'}
          { validator: checkMobile, triggle: 'blur' }
        ]
      },
      // form表单需要的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用户数据
      userInfos: [],
      // 搜索关键字
      keywords: '',
      // 给获取用户数据设置查询条件
      querycdt: {
        // 查询关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页获取记录条数
        pagesize: 3,
        // 记录总条数
        total: 0
      }
    }
  },
  methods: {
    // 修改用户相关开始
    // 修改用户，收集修改信息并进行存储
    editUser() {
      // 校验表单是否为空
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          // 校验成功处理
          // 收集数据存储入库
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          // 校验失败处理
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 修改成功：关闭对话框，成功提示，页面数据更新
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 弹出框中取消按钮,清空数据
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 让修改用户信息的对话框显示
    // param id： 被修改用户的id
    async showEditDialog(id) {
      // 显示对话框
      this.editDialogVisible = true
      // 根据id获得被修改用户的信息
      const { data: res } = await this.$http.get('users/' + id)
      // 修改失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得到的用户信息 赋予给editForm表单数据对象
      this.editForm = res.data
      // 现在editForm的样子为：
      // editForm：{username：xxx，email：xxx，mobile：ssss，id：sss，role_id：ddd}
      // id：当前被修改用户的id，后期可以根据“this.editForm.id”的方式获得当前被修改用户的id
    },
    // 修改用户相关结束
    // 删除用户---开始
    // param id:被删除用户的id
    delUser(id) {
      // 弹窗确认是否删除
      this.$confirm('确定要删除该用户吗？', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // axios调用api删除数据
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功：消息提示、刷新数据
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        })
        .catch(() => {})
    },
    // 删除用户--结束
    // 收集数据存储入库（执行后端api数据接口）
    // 添加用户--开始
    addUser() {
      // 添加数据时，通过validate必须先校验form表单是否为空，
      this.$refs.addFormRef.validate(async valid => {
        // 表单验证成功
        const { data: res } = await this.$http.post('users', this.addForm)
        // 表单验证失败
        if (res.meta.status !== 201) {
          return this.$message.Error(res.meta.msg)
        }
        // 添加成功：关闭对话框，成功提示，显示新添加数据
        this.addDialogVisible = false
        this.$message.error(res.meta.msg)
        /**
          this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'success'
        })
         */
        this.getUserInfos()
      })
    },
    // 对话框关闭回调
    addDialogClose() {
      // 重置form表单
      this.$refs.addFormRef.resetFields()
    },
    // 修改用户状态的方法
    // uid：被修改状态用户的id值
    // state：被修改后的状态信息true/false
    async changeState(uid, state) {
      // console.log(uid, state)      500    false
      const { data: res } = await this.$http.put(
        'users/' + uid + 'state' + state
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 提示修改状态成功的信息
      this.$message.success(res.meta.msg)
    },
    // 添加用户--开始
    // 数据分页相关-----开始
    // 每条记录条数变化的回调处理
    handleSizeChange(arg) {
      // arg:变化后的记录条数
      // console.log(arg)
      this.querycdt.pagesize = arg
      // 重新根据条件获得数据
      this.getUserInfos()
    },
    // 当前页码变化的回调处理
    handleCurrentChange(arg) {
      // arg:变化后的当前页码值
      // console.log(arg)
      this.querycdt.pagenum = arg
      // 重新根据条件获得数据
      this.getUserInfos()
    },
    // 数据分页相关-----开始
    // 获得用于显示的真实用户列表数据---开始
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.querycdt
      })
      // console.log(res)
      // 判断获取数据是否失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得好的用户数据 赋予 给userInfors成员
      this.userInfos = res.data.users
      // 记录总记录条数
      this.querycdt.tot = res.data.total
    }
    // 获得用于显示的真实用户列表数据---结束
  }
}
</script>

<style lang="less" scoped>
</style>
