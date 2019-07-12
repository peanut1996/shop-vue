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
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select" size>
        <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
      </el-input>
      <el-button type='primary' plain style="margin-left:10px">添加用户</el-button>
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
        <template v-slot:default='scope'>
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot:default='{ row }'>
          <el-button type='primary' icon='el-icon-edit' plain circle size="small"></el-button>
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
      total: 0
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
    }
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb{
  margin-bottom: 10px;
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
  background-color: #d4dae0;
}
.el-input{
  width: 300px;
}
</style>
