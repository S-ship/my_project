<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form label-width="0px" class="login_form" ref="loginFormRef" :model="loginform" :rules="loginRules">
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-users" v-model="loginform.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginform.password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginform: {
        username: 'admin',
        password: '123456'
      },
      // 用户名验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // 密码验证规则
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 给登录按钮添加校验
    submitForm () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginform)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败' + '' + res.meta.msg)
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    // 给重置按钮添加重置功能，这两个功能都要用到Vue提供的ref属性
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
  .login_container{
    width: 100%;
    height: 100%;
    background-color: #2b5b6b;
    .login_box{
      width: 450px;
      height: 300px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 3px;
      transform: translate(-50%, -50%);
      .avater_box{
        height: 130px;
        width: 130px;
        padding: 10px;
        border: 1px solid #eee;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px #dddddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
      .login_form{
        padding: 0 20px;
        position: absolute;
        width: 100%;
        bottom: 0;
        box-sizing: border-box;
        .btns{
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
