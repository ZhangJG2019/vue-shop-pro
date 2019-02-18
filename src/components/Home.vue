<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menushow ? '65px' : '200px'">
        <div id="three-line" @click="menushow=!menushow">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="menushow"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            :index="item.id+''"
            :style="menushow ? 'width:65px;' : 'width:200px;'"
            v-for="(item,k) in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="'iconfont icon-'+menuicon[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  data() {
    return {
      // 设置左侧权限的图标
      menuicon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao'],
      // 左侧导航按钮是否显示
      menushow: false,
      // 接收后端返回的 左侧导航权限的数据
      menuList: []
    }
  },
  methods: {
    async getMenuList() {
      // 获得用于显示的左侧导航权限信息
      const { data: res } = await this.$http.get('/menus')
      console.log(res)
      // 获取失败处理
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把权限数据赋给menuList
      this.menuList = res.data
    },
    logout() {
      this.$confirm('确认退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: rgb(55, 61, 65);
    padding: 0;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    #logo-box {
      color: #fff;
      font-size: 22px;
      display: flex;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    #three-line {
      background-color: rgb(74, 80, 100);
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      letter-spacing: 0.1em;
      user-select: none;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
