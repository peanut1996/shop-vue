<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type='success' plain @click="showAddDialog">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList" stripe style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <span v-show="row.children.length === 0">该角色没有更多的权限信息</span>
          <!-- 存放一级权限 -->
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delRight(row, l1.id)" closable>{{l1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 存放二级权限 -->
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag  @close="delRight(row, l2.id)" closable type="success">{{l2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 存放三级权限 -->
                  <el-tag @close="delRight(row, l3.id)" class="l3" closable type="warning" v-for="l3 in l2.children" :key="l3.id">
                    {{l3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default='{ row }'>
          <el-button type='primary' @click='showEditDialog(row)' icon='el-icon-edit' plain circle size="small"></el-button>
          <el-button type='danger' @click='delRole(row)' icon='el-icon-delete' plain circle size="small"></el-button>
          <el-button type='success' icon='el-icon-check' plain round size="small" @click="showAssignDialog(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <el-dialog
      title="角色授权"
      :visible.sync="assignVisible"
      width="50%" >
      <!-- 树形控件 -->
      <el-tree ref='tree' :data="rightList" :props="props" show-checkbox default-expand-all node-key="id"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">分配</el-button>
      </span>
    </el-dialog>
    <!-- 修改和添加共用的框 -->
    <el-dialog
      :title="title"
      :visible.sync="editVisible"
      width="50%" >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      assignVisible: false,
      editVisible: false,
      rightList: '',
      // 指定树形菜单如何显示
      props: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['change', 'blur'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  computed: {
    title () {
      return this.form.id ? '修改角色' : '添加角色'
    }
  },
  methods: {
    async getRolesList () {
      const { meta, data } = await this.axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
      }
    },
    async delRight (row, rightId) {
      const res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      const { status, msg } = res.meta
      if (status === 200) {
        this.$message.success(msg)
        row.children = res.data
      } else {
        this.$message.error(msg)
      }
    },
    async showAssignDialog (row) {
      this.assignVisible = true
      this.roleId = row.id
      const { meta, data } = await this.axios.get('rights/tree')
      if (meta.status === 200) {
        this.rightList = data
      }
      let ids = []
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    async assignRight () {
      let ids = this.$refs.tree.getCheckedKeys()
      let halfIds = this.$refs.tree.getHalfCheckedKeys()
      let rids = [...ids, ...halfIds].join()
      const res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      const { status, msg } = res.meta
      if (status === 200) {
        this.$message.success(msg)
        this.assignVisible = false
        this.getRolesList()
      } else {
        this.$message.error(msg)
      }
    },
    async delRole (row) {
      try {
        await this.$confirm('你确认要删除该角色吗?', '温馨提示', { type: 'warning' })
        const res = await this.axios.delete(`roles/${row.id}`)
        const { status, msg } = res.meta
        if (status === 200) {
          this.$message.success(msg)
          this.getRolesList()
        } else {
          this.$message.error(msg)
        }
      } catch {
        this.$message('取消删除')
      }
    },
    showAddDialog () {
      this.editVisible = true
      this.form.id = ''
      this.form.roleName = ''
      this.form.roleDesc = ''

      // 保证校验结果显示后才能清空
      this.$nextTick(() => {
        // 重置表单的校验规则
        this.$refs.form.clearValidate()
      }, 100)
    },
    showEditDialog (row) {
      this.editVisible = true
      this.form.id = row.id
      this.form.roleName = row.roleName
      this.form.roleDesc = row.roleDesc

      // 保证校验结果显示后才能清空
      this.$nextTick(() => {
        // 重置表单的校验规则
        this.$refs.form.clearValidate()
      }, 100)
    },
    async editRole () {
      try {
        await this.$refs.form.validate()
        const { id } = this.form
        let method = id ? 'put' : 'post'
        let url = id ? `roles/${id}` : `roles`
        let code = id ? 200 : 201

        const res = await this.axios[method](url, this.form)
        const { status, msg } = res.meta
        if (status === code) {
          this.$message.success(msg)
          // 关闭模态框
          this.editVisible = false
          // 重置表单
          this.$refs.form.resetFields()
          // 重新渲染
          this.getRolesList()
        } else {
          this.$message.error(msg)
        }
      } catch {
        return false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.roles {
  .l1 {
    padding: 5px 0;
    border-bottom: 1px dotted #ccc;
  }
  .l2 {
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
