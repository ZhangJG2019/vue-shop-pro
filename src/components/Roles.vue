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
      <!-- 分配权限弹窗 开始-->
      <el-dialog title="分配权限" :visible.sync="distributeDialogVisible" width="50%">
        <el-form :model="distributeForm" label-width="120px">
          <el-form-item label="当前的角色">{{distributeForm.roleName}}</el-form-item>
          <el-form-item label="分配的权限">
            <el-tree
              :data="rightInfos"
              :props="rightInfosProps"
              node-key="id"
              show-checkbox
              default-expand-all
              :default-checked-keys="defaultCheckedKeys"
              ref="rightsRef"
            >
              <!-- :data设定“树”中数据
                  :props给大树设置数据属性，例如显示的名称、起作用的值得部分
                  node-key给每个树节点设置唯一属性，用户实际应用，后期选取某个节点后，就会把这个id值获得到
                  show-checkbox  显示复选框
                  default-expand-all  展开全部的树节点
                  :default-checked-keys    选中默认叶子节点
                  ref="rightsRef"  设置ref属性，后期可以获得大树对象
              -->
            </el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="distributeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="distributeRights">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限弹窗 结束-->
      <!-- 角色列表显示  开始-->
      <el-table :data="rolesInfos" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="info">
            <!-- 一级权限显示 -->
            <el-row
              v-for="(item,k) in info.row.children"
              :key="item.id"
              :style="k===0?'border-bottom:1px solid #EBEEF5;border-top:1px solid #EBEEF5':'border-bottom:1px solid #EBEEF5;'"
            >
              <el-col :span="5">
                <el-tag closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限显示 -->
                <el-row
                  v-for="(item2,k2) in item.children"
                  :key="item2.id"
                  :style="{'border-top':k2!==0?'1px solid #EBEEF5':''}"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable="true">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限显示 -->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable="true"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
              <!-- tooltip鼠标悬浮文字提示 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showDistrbuteDialog(info.row)"
              >分配权限</el-button>
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
      // 设置树节点默认选中,条件：当前角色拥有的权限要选中
      defaultCheckedKeys: [], // 默认  树节点选中  数据
      // 分配相关 开始
      // 接收被分配的权限列表
      rightInfos: [],
      // 给大树设置属性字段
      rightInfosProps: {
        label: 'authName', // 设置“树节点”名称
        children: 'children' // 设置子节点树的名称
      },
      // 表单数据对象
      distributeForm: {
        id: 0, // 被分配权限角色id信息
        roleName: '' // 被分配权限角色名称信息
      },
      // 关闭对话框
      distributeDialogVisible: false,
      // 分配相关 结束
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
    // 分配相关 开始
    // 展示分配权限的对话框
    // role:被分配权限的一条角色记录信息（包括id/roleName/roleDesc/children）
    async showDistrbuteDialog(role) {
      // 显示对话框
      this.distributeDialogVisible = true
      // 把role赋予给distributeForm表单
      this.distributeForm = role
      // 给大树 获得要展示的数据部分：
      // 把用户分配的权限数据获得出来
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得好权限数据 赋予 给data成员rightsInfo
      this.rightInfos = res.data
      // 设置树节点默认选中
      // n条件：当前角色拥有的权限要选中
      // 从role中 把末级权限id获得出来 并存储到arrIds中
      var arrIds = [] // 末级权限接受变量 用数组
      this.getHaveRights(role, arrIds)
      // arrIds就是当前角色拥有的权限集合的数组【101,107,120,133....】
      this.defaultCheckedKeys = arrIds
    },
    // 通过“递归遍历”的方式，把一个角色对应的“末级权限”的id获得出来
    getHaveRights(node, keys) {
      if (!node.children) {
        return keys.push(node.id)
      }
      node.children.forEach(item => {
        return this.getHaveRights(item, keys)
      })
    },
    // 声明存储好的权限信息
    async distributeRights() {
      // 把”全选“节点的id信息获得到，通过数组返回
      var ids1 = this.$refs.rightsRef.getCheckedKeys()
      // 把”半选“节点的id信息获得到，通过数组返回
      var ids2 = this.$refs.rightsRef.getHalfCheckedKeys()
      // 把”全选和半选“的权限id合并到一起，通过逗号链接变为字符串
      var allids = [...ids1, ...ids2].join(',')
      // 调用axios，把当前角色选取的权限存储到后端
      const { data: res } = await this.$http.post(
        'roles/' + this.distributeForm.id + '/rights',
        { rids: allids }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 添加权限成功，关闭对话框，成功提示，页面重新加载
      this.distributeDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getRoleInfos()
    },
    // 分配相关 结束
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
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
