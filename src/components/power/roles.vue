<template>
  <div>
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRolesVisible=true">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-row v-for="(item1,i1) in props.row.children" :key="item1.id" :class="['bdbottom',i1===0?'bdtop':'','vecenter']" >
                <el-col :span=5>
                  <el-tag type="primary" closable @close="removeRoleTag(props.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span=19>
                  <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0? '':'bdtop','vecenter']">
                    <el-col :span=8>
                      <el-tag type="success" closable @close="removeRoleTag(props.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span=16>
                      <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRoleTag(props.row,item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="userRights(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="addRolesVisible" width="50%"  @close="addRoleClosed">
      <el-form label-width="90px" :model="addRoles" :rules="addRules" ref="addRolesRef" >
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addRoles.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addRoles.roleDesc"></el-input>
              </el-form-item>
          </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesList">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加角色" :visible.sync="editRolesVisible" width="50%">
      <el-form label-width="90px" :model="editRoles" :rules="editRules" ref="addRolesRef">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editRoles.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editRoles.roleDesc"></el-input>
              </el-form-item>
          </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleList">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="divRightaVisible" width="50%" @close="treeListClosed">
      <el-tree :data="rightsList" :props="defaultProps" show-checkbox default-expand-all
  :default-checked-keys="rightLeaf" ref="treeRef" node-key="id"></el-tree>
     <span slot="footer" class="dialog-footer">
        <el-button @click="divRightaVisible = false">取 消</el-button>
        <el-button type="primary" @click="divRightsList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      editRoles: {
        roleName: '',
        roleDesc: ''
      },
      roleId: '',
      rightsList: [],
      rightLeaf: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      addRolesVisible: false,
      editRolesVisible: false,
      divRightaVisible: false,
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.erro('获取角色列表失败')
      this.rolesList = res.data
    },
    async removeRoleTag (role, rightId) {
      const confirmText = await this.$confirm('此操作将永久删除该数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmText !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      role.children = res.data
    },
    addRolesList () {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整信息')
        const { data: res } = await this.$http.post('roles', this.addRoles)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addRolesVisible = false
        this.getRoleList()
      })
    },
    addRoleClosed () {
      this.$refs.addRolesRef.resetFields()
    },
    async editDialog (id) {
      this.editRolesVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editRoles = res.data
      console.log(this.editRoles)
    },
    editRoleList () {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整信息')
        const { data: res } = await this.$http.put('roles/' + this.editRoles.roleId, this.editRoles)
        if (res.meta.status !== 200) return this.$message.error('修改用户角色失败')
        this.$message.success('修改用户角色成功')
        this.getRoleList()
        this.editRolesVisible = false
      })
    },
    async deleteRole (id) {
      const confirmText = await this.$confirm('此操作将永久删除该数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmText !== 'confirm') return this.$message.info('取消删除用户角色')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户角色失败')
      this.$message.success('删除用户角色成功')
      this.getRoleList()
    },
    getKeys (rightKey, arr) {
      if (!rightKey.children) {
        return arr.push(rightKey.id)
      }
      rightKey.children.forEach(element => this.getKeys(element, arr))
    },
    async userRights (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取用户权限数据失败')
      this.$message.success('获取用户权限数据成功')
      this.rightsList = res.data
      this.getKeys(role, this.rightLeaf)
      this.divRightaVisible = true
    },
    async divRightsList () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keystr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keystr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.divRightaVisible = false
    },
    treeListClosed () {
      this.rightLeaf = []
    }
  },
  created: function () {
    this.getRoleList()
  }
}
</script>
<style lang="less">
.el-button {
  margin: 10px 0;
}
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}
.bdtop {
  border-top: 1px solid #eeeeee;
}
.vecenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px;
}
.el-row {
  display: flex;
  justify-content: flex-end;
}
</style>
