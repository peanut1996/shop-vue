<template>
  <div class="login">

    <el-form ref="form" :model="form" label-width="80px">
      <h2>后台管理系统</h2>
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  }
}
</script>

<style lang='scss'>
body,html{
  background-image: url(../assets/bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
h2{
  text-align: center;
}
.el-form{
  width: 400px;
  margin: 200px auto;
  background-color: #fff;
  padding: 20px 20px 20px 20px;
  border-radius: 20px;
}
</style>
