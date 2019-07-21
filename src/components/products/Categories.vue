<template>
  <div class="categories">
    <el-button type="success" plain @click="showAdd">添加分类</el-button>
    <el-table :data="categoryList" row-key="cat_id" v-loading="loading">
      <el-table-column prop="cat_name" label="分类名称" ></el-table-column>
      <el-table-column  label="是否有效">
        <template v-slot="{ row }">
          {{ row.cat_deleted ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column  label="操作">
        <template>
          <el-button type="primary" plain circle icon='el-icon-edit' size='small'></el-button>
          <el-button type="danger" plain circle icon='el-icon-delete' size='small'></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 分类框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addVisible"
      width="50%" >
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入分类名称" v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop='cat_pid'>
          <el-cascader
            v-model="addForm.cat_pid"
            :options="options"
            :props='props'
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      loading: true,
      addVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: [],
        cat_level: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: ['change', 'blur'] }
        ]
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      const res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(res)
      const { meta, data } = res
      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
        this.loading = false
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    async showAdd () {
      this.addVisible = true
      const res = await this.axios.get('categories?type=2')
      const { meta, data } = res
      if (meta.status === 200) {
        this.options = data
      }
    },
    async addCate () {
      try {
        await this.$refs.addForm.validate()

        const res = await this.axios.post('categories', {
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length,
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0
        })
        console.log(res)
        const { status, msg } = res.meta

        if (status === 201) {
          this.$message.success(msg)
          this.$refs.addForm.resetFields()
          this.getCategoryList()
          this.addVisible = false
        } else {
          this.$message.error(msg)
        }
      } catch {}
    }
  }
}
</script>

<style>

</style>
