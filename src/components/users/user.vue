<template>
<div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
            <el-col :span="15">
                <el-input placeholder="请输入内容" v-model="dataList.query" clearable :clear="getList">
                    <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
            <el-col></el-col>
        </el-row>
        <el-table :data="userList" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" prop="mg_state">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" active-color="#13ce66" @change="changeState(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="190px">
            <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSingleUser(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="userRole(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="dataList.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
    </el-card>
    <!-- 增加用户弹出框 -->
    <el-dialog title="增加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form label-width="70px" :model="addForm" :rules="addFormRules" ref="addFormRef">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
          </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息弹出框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%">
      <el-form label-width="70px" :model="editForm" ref="editFormRef" :rules="editRules">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
          </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配用户角色" :visible.sync="roleDialogVisible" @close="userRoleList">
      <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的角色: {{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRole">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
export default {
  created: function () {
    this.getList()
  },
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      dataList: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      userInfo: {},
      roleList: {},
      value: '',
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]
      },
      editRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getList () {
      const { data: res } = await this.$http.get('users', {
        params: this.dataList
      })
      if (res.meta.status !== 200) return this.$message.error('更新数据失败')
      this.userList = res.data.users
      this.total = res.data.total
      this.userInfo = res.data
    },
    handleSizeChange (newSize) {
      this.dataList.pagesize = newSize
      this.getList()
    },
    handleCurrentChange (newPage) {
      this.dataList.pagenum = newPage
      this.getList()
    },
    async changeState (row) {
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) return this.$message.error('更新用户状态失败')
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addUsers () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整信息')
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getList()
      })
    },
    async editDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      this.editForm = res.data
      console.log(res)
    },
    editUsers () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入正确的修改信息')
        const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改用户信息成功')
        this.editDialogVisible = false
        this.getList()
      })
    },
    async deleteSingleUser (id) {
      const confirmText = await this.$confirm('此操作将永久删除该数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmText !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getList()
    },
    async userRole (userInfo) {
      this.userInfo = userInfo
      // console.log(this.userInfo)
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleList = res.data
      // console.log(this.roleList)
      this.roleDialogVisible = true
    },
    async confirmRole () {
      if (!this.value) this.$message.error('请选择用户角色')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.value })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.getList()
      this.roleDialogVisible = false
    },
    userRoleList () {
      this.value = ''
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin: 15px 0;
}
.el-table {
  margin: 15px 0;
}
</style>
