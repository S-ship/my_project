<template>
  <div>
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeName-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form label-width="90px" label-position="top" :model="addGoodsInfo" :rules="addGoodsInfoRules" ref="addGoodsInfoRef">
      <el-tabs tab-position="left" v-model="activeName" :before-leave ="nextStep">
        <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addGoodsInfo.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model.number="addGoodsInfo.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model.number="addGoodsInfo.goods_weight"> </el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model.number="addGoodsInfo.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addGoodsInfo.goods_cat"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange"></el-cascader>
              </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form label-position="top">
            <el-form-item :label="item.attr_name" v-for = 'item in manyGoodsTable' :key="item.attr_id">
                    <el-checkbox-group v-model="manyTable">
                        <el-checkbox :label="item1" v-for='(item1,i) in item.attr_vals' :key="i" border size="mini"></el-checkbox>
                    </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" :prop="item.attr_vals" v-for="item in onlyGoodsTable" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            list-type="picture"
            :headers="headerToken">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addGoodsInfo.goods_introduce"></quill-editor>
          <el-button type="primary" class="btns" @click="addGoodsConfirm">添加商品</el-button>
        </el-tab-pane>
  </el-tabs>
  </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="picVisible" width="50%" >
         <img :src="previewPath" class="picsize">
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      cateList: [],
      activeName: '0',
      picVisible: false,
      previewPath: '',
      headerToken: { Authorization: window.sessionStorage.getItem('token') },
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      addGoodsInfo: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      manyGoodsTable: [],
      onlyGoodsTable: [],
      manyTable: [],
      addGoodsInfoRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', message: '商品价格为数字值' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', message: '商品数量为数字值' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { type: 'number', message: '商品重量为数字值' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getGoodsCat () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = res.data
    },
    handleChange () {
      if (this.addGoodsInfo.goods_cat.length !== 3) {
        this.$message.info('商品分类必须是三级分类')
        return false
      }
    },
    nextStep (activeName, oldActiveName) {
      console.log(this.addGoodsInfo.goods_cat)
      if (oldActiveName === '0') {
        if (this.addGoodsInfo.goods_cat.length !== 3) {
          this.$message.info('请选择商品分类')
          return false
        } else if (this.addGoodsInfo.goods_name.trim().length === 0) {
          this.$message.info('请填写商品名称')
          return false
        } else if (this.addGoodsInfo.goods_price <= 0) {
          this.$message.info('商品价格必须是大于0')
          return false
        } else if (this.addGoodsInfo.goods_weight <= 0) {
          this.$message.info('商品重量必须大于0')
          return false
        } else if (this.addGoodsInfo.goods_number <= 0) {
          this.$message.info('商品重量必须大于0的整数')
          return false
        } else {
          this.getManyTable()
          this.getOnlyTable()
        }
      }
    },
    async getManyTable () {
      const { data: res } = await this.$http.get(`categories/${this.addGoodsInfo.goods_cat[2]}/attributes`, {
        params: { sel: 'many' }
      })
      if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
      console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
      this.manyGoodsTable = res.data
    },
    async getOnlyTable () {
      const { data: res } = await this.$http.get(`categories/${this.addGoodsInfo.goods_cat[2]}/attributes`, {
        params: { sel: 'only' }
      })
      if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
      console.log(res.data)
      this.onlyGoodsTable = res.data
    },
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.picVisible = true
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      const filePath = file.response.data.tmp_path
      const index = this.addGoodsInfo.pics.findIndex(item => item.pics === filePath)
      this.addGoodsInfo.pics.splice(index, 1)
    },
    handleAvatarSuccess (response) {
      console.log(response)
      this.addGoodsInfo.pics.push({ pic: response.data.tmp_path })
      console.log(111, this.addGoodsInfo.pics)
    },
    async addGoodsConfirm () {
      this.$refs.addGoodsInfoRef.validate(valid => {
        if (!valid) return this.$message.error('请填写完整信息')
      })
      const form = _.cloneDeep(this.addGoodsInfo)
      form.goods_cat = form.goods_cat.join(',')
      this.manyGoodsTable.forEach(item => {
        form.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') })
      })
      this.onlyGoodsTable.forEach(item => {
        form.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
      })
      const { data: res } = await this.$http.post('goods', form)
      console.log(res.data)
      if (res.meta.status !== 201) return this.$message.error('添加商品失败')
      this.$message.success('添加商品成功')
      this.$router.push('/goods')
    }
  },
  created () {
    this.getGoodsCat()
  }
}
</script>
<style lang="less" scoped>
/deep/.el-card {
  font-size: 12px;
}
.el-steps {
  margin: 20px 0;
}
/deep/.el-step__title {
  font-size: 12px;
}
.el-tabs {
  min-height: 300px;
}
.el-form {
  font-size: 12px;
}
.el-checkbox {
  margin-right: 5px!important;
}
.picsize {
  width: 100%;
}
/deep/.ql-editor {
  min-height: 300px;
}
.btns {
  margin-top: 10px;
}
</style>
