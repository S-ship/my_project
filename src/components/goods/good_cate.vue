<template>
  <div>
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addCate">添加分类</el-button>
        <tree-table :data="goodList" :columns="columns" show-index index-text="#" :selection-type="false" border>
          <template slot="isOk" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_delete === 'false'" style="color:'green'"></i>
            <i class="el-icon-success" v-else style="color:red"></i>
          </template>
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag size="mini" v-else type="warning">三级</el-tag>
          </template>
          <template slot="option" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCateLlist(scope.row.cat_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCateLlist(scope.row.cat_id)">删除</el-button>
          </template>
        </tree-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="addCateVisible" width="50%"  @close="addCateClosed">
      <el-form label-width="90px" :model="addCateForm" :rules="cateNameRules" ref="addCateRef" >
              <el-form-item label="分类名称" prop="cat_name" >
                <el-input v-model="addCateForm.cat_name"></el-input>
              </el-form-item>
              <el-form-item label="父级分类" >
                <el-cascader
                  v-model="selectedId"
                  :options="parentCateList"
                  :props="parentProp"
                   @change="handleChange">
                </el-cascader>
              </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分类名称" :visible.sync="editCateVisible" width="50%" >
      <el-form label-width="90px" :model="editCateForm" :rules="editCateRules" ref="editCateRef" >
              <el-form-item label="分类名称" prop="cat_name" >
                <el-input v-model="editCateForm.cat_name"></el-input>
              </el-form-item>
          </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCatSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created: function () {
    this.getGoodList()
  },
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodList: [],
      addCateVisible: false,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: '',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          prop: '',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          prop: '',
          type: 'template',
          template: 'option'
        }
      ],
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      cateNameRules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      },
      parentCateList: {},
      selectedId: [],
      parentProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      editCateVisible: false,
      editCateForm: {
        cat_id: 0,
        cat_name: ''
      },
      editCateRules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getGoodList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.total = res.data.total
      this.goodList = res.data.result
      console.log(this.goodList)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodList()
    },
    handleChange () {
      console.log(this.selectedId)
      if (this.selectedId.length > 0) {
        this.addCateForm.cat_pid = this.selectedId[this.selectedId.length - 1]
        this.addCateForm.cat_level = this.selectedId.length
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    async addCate () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      this.parentCateList = res.data
      console.log(this.parentCateList)
      this.addCateVisible = true
    },
    async addCatSubmit () {
      this.$refs.addCateRef.validate(valid => {
        if (!valid) return this.$message.error('请输入分类信息')
      })
      const { data: res } = await this.$http.post('categories', this.addCateForm)
      if (res.meta.status !== 201) return this.$message.error('添加分类失败')
      this.getGoodList()
      this.addCateVisible = false
    },
    addCateClosed () {
      this.$refs.addCateRef.resetFields()
      this.parentProp.value = ''
      this.selectedId = ''
    },
    async editCateLlist (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      this.editCateForm = res.data
      this.editCateVisible = true
    },
    async editCatSubmit () {
      this.$refs.editCateRef.validate(valid => {
        if (!valid) return this.$message.error('修改分类名称失败')
      })
      const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, this.editCateForm)
      if (res.meta.status !== 200) return this.$message.error('修改分类失败')
      this.editCateVisible = false
      this.$message.success('更新商品分类成功')
      this.getGoodList()
    },
    async deleteCateLlist (id) {
      const confirmText = await this.$confirm('此操作将永久删除该数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmText !== 'confirm') return this.$message.info('取消删除商品分类')
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除商品分类失败')
      this.getGoodList()
    }
  }
}
</script>
<style lang="less">
.zk-table {
  margin: 15px 0;
  font-size: 12px;
}
</style>
