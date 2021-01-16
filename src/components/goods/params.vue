<template>
  <div>
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" effect="dark" :closable="false"></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
                  v-model="selectedId"
                  :options="cateList"
                  :props="cateListProps"
                   @change="handleChange">
          </el-cascader>
        </el-col>
        <el-col></el-col>
      </el-row>
      <el-tabs type="border-card" v-model="attrIndex" @tab-click="handleClick">
        <el-button type="primary" size="mini" @click="openParamsDialog" :disabled="flag">添加参数</el-button>
        <el-tab-pane label="动态参数" name="many">
          <el-table :data="paramsList" border stripe>
            <el-table-column type="expand" >
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable  @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParamsForm(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-table :data="paramsList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable  @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParamsForm(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="'添加'+activeText+'参数'" :visible.sync="addParamsVisible" @close="addParamsClosed" width="50%" >
      <el-form label-width="90px" :model="addParamsList" :rules="addParamRules" ref="addParamRef">
              <el-form-item :label="activeText+'参数'" prop="attr_name">
                <el-input v-model="addParamsList.attr_name"></el-input>
              </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改分类参数" :visible.sync="editParamsVisible" width="50%">
      <el-form label-width="90px" :rules="editParamRules" ref="editParamRef" :model="editParamsList">
              <el-form-item :label="activeText+'参数'" prop="attr_name">
                <el-input v-model="editParamsList.attr_name"></el-input>
              </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      paramsList: [],
      cateListProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedId: '',
      getParams: {
        cat_id: ''
      },
      attrIndex: 'many',
      addParamsVisible: false,
      flag: true,
      activeText: '',
      editParamsVisible: false,
      addParamsList: {
        attr_name: ''
      },
      editParamsList: {
        attr_vals: '',
        attr_name: ''
      },
      addParamRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      editParamRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error('获取商品数据失败')
      this.cateList = res.data
    },
    async handleChange () {
      this.getParams.cat_id = this.selectedId[this.selectedId.length - 1]
      const { data: res } = await this.$http.get(`categories/${this.getParams.cat_id}/attributes`, {
        params: { sel: this.attrIndex }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      this.paramsList = res.data
      console.log(this.paramsList)
      if (this.selectedId.length !== 3) {
        this.$message.warning('只允许为第三级分类设置相关参数！')
        this.flag = true
      } else {
        this.flag = false
      }
      console.log(this.paramsList)
    },
    handleClick () {
      this.handleChange()
    },
    openParamsDialog () {
      if (this.attrIndex === 'many') {
        this.activeText = '动态'
      } else {
        this.activeText = '静态'
      }
      this.addParamsVisible = true
    },
    async addParamsForm () {
      console.log(this.getParams.cat_id)
      this.$refs.addParamRef.validate(valid => {
        if (!valid) return this.$message.error('请填写完整信息')
      })
      const { data: res } = await this.$http.post(`categories/${this.getParams.cat_id}/attributes`, {
        attr_name: this.addParamsList.attr_name,
        attr_sel: this.attrIndex,
        attr_vals: ''
      })
      if (res.meta.status !== 201) return this.$message.error('添加分类参数失败')
      this.addParamsList = res.data
      this.addParamsVisible = false
      this.handleChange()
    },
    addParamsClosed () {
      this.addParamsList.attr_name = ''
    },
    async editParamsForm (id) {
      if (this.attrIndex === 'many') {
        this.activeText = '动态'
      } else {
        this.activeText = '静态'
      }
      const { data: res } = await this.$http.get(`categories/${this.getParams.cat_id}/attributes/${id}`, {
        params: {
          attr_vals: this.editParamsList.attr_vals,
          attr_sel: this.attrIndex
        }
      })
      console.log(res.data)
      this.editParamsList = res.data
      this.editParamsVisible = true
    },
    async confirmEditList () {
      this.$refs.editParamRef.validate(valid => {
        if (!valid) return this.$message.error('请填写分类参数')
      })
      const { data: res } = await this.$http.put(`categories/${this.getParams.cat_id}/attributes/${this.editParamsList.attr_id}`, {
        attr_name: this.editParamsList.attr_name,
        attr_vals: this.editParamsList.attr_vals,
        attr_sel: this.attrIndex
      })
      this.editParamsVisible = false
      if (res.meta.status !== 200) return this.$message.success('修改参数名称成功')
      this.handleChange()
      console.log(res.data)
    },
    async deleteParams (id) {
      const confirmText = await this.$confirm('此操作将永久删除该数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmText !== 'confirm') return this.$message.info('取消删除商品分类')
      const { data: res } = await this.$http.delete(`categories/${this.getParams.cat_id}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除商品分类失败')
      this.handleChange()
    },
    handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrData(row)
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    handleInputConfirm (row) {
      const inputValue = row.inputValue
      if (inputValue.length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(inputValue)
      row.inputVisible = false
      row.inputValue = ''
      this.saveAttrData(row)
    },
    async saveAttrData (row) {
      const { data: res } = await this.$http.put(`categories/${this.getParams.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('修改参数失败')
      this.$message.success('修改参数成功')
    }
  },
  created: function () {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.el-card {
font-size: 12px;
}
.el-row {
margin: 15px 0;
font-size: 16px;
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: center;
  }
</style>
