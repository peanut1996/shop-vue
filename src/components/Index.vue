<template>
  <el-container class="index">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="loginout">
        欢迎你
        <el-button type="danger" size="small" @click="loginout">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path.slice(1).split('-')[0]"
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          router
          active-text-color="#ffd04b">
          <el-submenu v-for='menu in menulist' :key='menu.id' :index="menu.path">
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item v-for='item in menu.children' :key='item.id' :index="item.path">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.authName}}</span>
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
  async created () {
    const res = await this.axios.get('menus')
    if (res.meta.status === 200) {
      this.menulist = res.data
    }
  },
  data () {
    return {
      menulist: []
    }
  },
  methods: {
    // 退出登录功能
    loginout () {
      this.$confirm('你确定要退出登录吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '退出取消'
        })
      })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang='scss' scoped>
.index {
  height: 100%;
  .el-header{
    background-color: #b3c1cd;
    display: flex;
    .logo,
    .loginout{
      width: 180px;
    }
    h1{
      color: #fff
    }
    .logo{
      background: url('../assets/logo.png') no-repeat center center/contain;
    }
    .title{
      flex: 1;
      text-align: center;
      line-height: 60px;
    }
    .loginout{
      line-height: 60px;
    }
  }
  .el-aside{
    background-color: #545c64;
    .el-submenu{
      width: 200px;
    }
  }
  .el-main{
    background-color: #eaeef1;
  }
}
</style>
