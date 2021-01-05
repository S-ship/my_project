<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form label-width="0px" class="login_form" :model="loginform">
          <el-form-item>
            <el-input prefix-icon="iconfont icon-users" v-model="loginform.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginform.password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary">登录</el-button>
            <el-button>重置</el-button>
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
        password: '123455'
      }
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
