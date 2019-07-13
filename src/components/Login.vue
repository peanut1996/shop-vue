<template>
  <div class="login">
    <el-form ref="form" status-icon :model="form" label-width="80px" :rules="rules">
      <img src="../assets/head.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" @keydown.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
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
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度在3-5个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在6-12个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async login () {
      try {
        await this.$refs.form.validate()
        // 校验成功发送ajax
        const res = await this.axios.post('login', this.form)
        // 解构
        const { meta: { status, msg }, data: { token } } = res
        if (status === 200) {
          this.$message({
            message: '登录成功',
            type: 'success',
            center: true
          })
          // 存储token
          localStorage.setItem('token', token)

          this.$router.push({ name: 'index' })
        } else {
          this.$message({
            message: '登录失败,' + msg,
            type: 'error',
            center: true
          })
        }
      } catch (e) {
        return false
      }
    },
    resetForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang='scss' scoped>
.login{
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  padding: 75px 20px 20px 20px;
  border-radius: 20px;
  position: relative;
  img{
    position: absolute;
    width: 100px;
    height: 100px;
    left: 50%;
    transform: translateX(-50%);
    top:-60px;
    border-radius: 50%;
    border: 10px solid #fff;
  }
  .el-button:last-child{
    margin-left: 80px;
  }
}
</style>
