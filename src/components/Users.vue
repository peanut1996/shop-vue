<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div style="margin-bottom: 10px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select" size style="width:300px">
        <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
      </el-input>
      <el-button type='primary' plain style="margin-left:10px" @click="showDialog">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table
    :data="tableData"
    stripe
    style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template v-slot:default='{ row }'>
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change='changeState(row)'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot:default='{ row }'>
          <el-button type='primary' icon='el-icon-edit' plain circle size="small" @click="showEditDialog(row)"></el-button>
          <el-button type='danger' icon='el-icon-delete' plain circle size="small" @click="deleteUser(row.id)"></el-button>
          <el-button type='success' icon='el-icon-check' plain round size="small">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top:10px"
      >
    </el-pagination>
    <!-- 增加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%">
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="用户名" prop='username'>
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop='mobile'>
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form ref="updateForm" :model="updateForm" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="用户名" prop='username'>
          <el-tag type="info">{{updateForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop='mobile'>
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogVisible: false,
      updateForm: {
        email: '',
        mobile: '',
        id: '',
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度在3-5个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在6-12个字符', trigger: 'change' }
        ],
        email: [
          { type: 'email', message: '请输入有效的邮箱', trigger: 'change' }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        const { meta, data } = res
        if (meta.status === 200) {
          this.tableData = data.users
          this.total = data.total
        }
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    queryUser () {
      this.pagenum = 1
      this.getUserList()
    },
    deleteUser (id) {
      // console.log(id)
      this.$confirm('亲,你确定要删除吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`users/${id}`).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.tableData.length === 1 || this.pagenum > 1) {
              this.pagenum--
            }
            this.getUserList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async changeState ({ id, mg_state: mgState }) {
      const res = await this.axios.put(`users/${id}/state/${mgState}`)
      const { status, msg } = res.meta
      if (status === 200) {
        this.$message.success('修改状态成功')
        this.getUserList()
      } else {
        this.$message.error(msg)
      }
    },
    showDialog () {
      this.addDialogVisible = true
    },
    async addDialog () {
      try {
        await this.$refs.addForm.validate()
        const res = await this.axios.post('users', this.addForm)
        console.log(res)
        const { status, msg } = res.meta
        if (status === 201) {
          this.$message.success('添加用户成功')
          this.$refs.addForm.resetFields()
          this.addDialogVisible = false
          // 重新渲染
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(msg)
        }
      } catch (e) {
        return false
      }
    },
    showEditDialog (user) {
      this.editDialogVisible = true
      this.updateForm = { ...user }
    },
    async updateUser () {
      try {
        await this.$refs.updateForm.validate()
        const { id, email, mobile } = this.updateForm
        const res = await this.axios.put(`users/${id}`, { email, mobile })
        const { status, msg } = res.meta
        if (status === 200) {
          this.$message.success('修改成功')
          this.$refs.updateForm.resetFields()
          this.editDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error(msg)
        }
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
