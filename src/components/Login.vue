<template>
  <div id="login-containter">
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/logo.png" alt>
      </div>
      <el-form :rules="LoginFormRules" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password">
            <i slot="prefix" class="iconfont icon-Password"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录form表单需要的数据对象
      loginForm: {
        username: '',
        password: ''
      }, // 给各个表单域定义校验规则
      LoginFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 用户登录系统
    login() {
      // 对登录的form表单进行整体校验
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          // 用户信息真实性校验
          // axios带着用户信息去后端数据库进行校验
          const { data: res } = await this.$http.post('/login', this.loginForm)

          // 判断用户名或密码  真实性校验失败
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码不正确')
          }
          // 通过浏览器的sessionStrage记录服务器返回的token信息
          window.sessionStorage.setItem('token', res.data.token)
          // 页面重定向到后台首页（/home）
          this.$router.push('/home')
        }
      })
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-containter {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    height: 50%;
    transform: translate(-50%, 50%);
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
    #logo-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
</style>
