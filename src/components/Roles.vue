<template>
  <div>
    <!-- 面包屑导航区域 开始-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 结束-->
    <el-card class="box-card">
      <!-- 添加角色按钮 开始-->
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <!-- 添加角色按钮 结束-->
      <!-- 添加角色弹窗 开始-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        :before-close="addDialogCloseBefore"
        @close="addDialogClose"
      >
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加角色弹窗 结束-->
      <!-- 修改角色弹窗 开始-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        :before-close="editDialogCloseBefore"
        @close="editDialogClose"
      >
        <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改角色弹窗 结束-->
      <!-- 角色列表显示  开始-->
      <el-table :data="rolesInfos" border style="width: 100%">
        <el-table-column width="60"></el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="310"></el-table-column>
        <el-table-column label="操作" width="330">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            >删除</el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 角色列表显示  结束-->
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getRoleInfos()
  },
  data() {
    return {
      // 角色列表
      rolesInfos: [],
      // 添加角色弹窗，默认不显示
      addDialogVisible: false,
      // 添加角色表单数据初始化
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色，表单数据验证
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述信息', trigger: 'blur' }
        ]
      },
      // 修改角色表单数据初始化
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色弹窗，默认不显示
      editDialogVisible: false,
      // 编辑角色，表单数据验证
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述信息', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 创建修改需要的事件方法
    async showEditDialog(id) {
      // 展示弹窗
      this.editDialogVisible = true
      // 获得被修改角色的信息
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '',
          type: 'error',
          duration: 1000
        })
      }
      // 请求成功将获得到的数据，放到editForm修改角色编辑弹窗内
      this.editForm = res.data
    },
    // 添加角色 到服务端处理
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('roles', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message({
              message: '添加角色失败',
              type: 'error',
              duration: 1000
            })
          }
          // 关闭弹窗
          this.addDialogVisible = false
          // 页面刷新,并提示添加成功
          this.getRoleInfos()
          this.$message({
            message: '添加角色成功',
            type: 'success',
            duration: 1000
          })
        }
      })
    },
    // 点击弹框外的地方，弹框关闭
    addDialogCloseBefore(done) {
      this.$refs.addFormRef.resetFields()
      done()
    },
    // 添加弹窗 点击取消 关闭
    addDialogClose() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    // 添加弹窗 点击其他位置 关闭
    editDialogCloseBefore(done) {
      this.$refs.editFormRef.resetFields()
      done()
    },
    // 编辑弹窗 点击取消 关闭
    editDialogClose() {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定，提交修改后的数据到服务器上
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'roles/' + this.editForm.roleId,
            this.editForm
          )
          if (res.meta.status !== 200) {
            this.$message({
              message: '修改失败',
              type: 'error',
              duration: 1000
            })
          }
          // 关闭弹窗
          this.editDialogClose()
          // 页面刷新
          this.getRoleInfos()
          // 修改成功，弹窗提示
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        }
      })
    },
    // 删除角色
    async delUser(id) {
      // 弹窗确认是否删除
      const cfm = await this.$confirm('确定要删除该用户吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (cfm === 'confirm') {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message({
            message: '删除角色失败',
            type: 'error',
            duration: 1000
          })
        } else {
          // 删除成功：消息提示、刷新数据
          this.getRoleInfos()
          return this.$message({
            message: '角色已删除',
            type: 'success',
            duration: 1000
          })
        }
      }
    },
    // 获得角色列表信息
    async getRoleInfos() {
      const { data: res } = await this.$http.get('roles')
      // 如果获取数据失败，显示错误提示信息
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 获取数据成功，就将获取到的数据放到rolesList数组中
      this.rolesInfos = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
