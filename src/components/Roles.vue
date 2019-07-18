<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
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
          <el-button type='primary' icon='el-icon-edit' plain circle size="small"></el-button>
          <el-button type='danger' icon='el-icon-delete' plain circle size="small"></el-button>
          <el-button type='success' icon='el-icon-check' plain round size="small" @click="showAssignDialog(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <el-dialog
      title="角色授权"
      :visible.sync="dialogVisible"
      width="50%" >
      <!-- 树形控件 -->
      <el-tree ref='tree' :data="rightList" :props="props" show-checkbox default-expand-all node-key="id"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">分配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      dialogVisible: false,
      rightList: '',
      // 指定树形菜单如何显示
      props: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
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
      this.dialogVisible = true
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
        this.getRoleList()
      } else {
        this.$message.error(msg)
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
