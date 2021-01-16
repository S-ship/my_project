<template>
  <el-container>
  <el-header>
    <div>
      <img src="../assets/heima.png" alt="">
      <span>后台管理控制系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width = "isCollapse ? '64px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu  class="el-menu-demo" background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened = "true" :collapse="isCollapse" :collapse-transition="false" router :default-active="index">
        <el-submenu :index="item.id + ''"  v-for = 'item in menuList' :key = "item.id">
        <template slot="title">
          <i :class="iconList[item.id]"></i>
          <span class="authText">{{item.authName}}</span>
        </template>
        <el-menu-item :index="'/'+ subItem.path" v-for = 'subItem in item.children' :key = "subItem.id" @click="saveCurrentPath('/'+subItem.path)">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
</el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
  created: function () {
    this.getMenuList()
    this.currentPath = window.sessionStorage.getItem('currentPath')
  },
  data: function () {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      currentPath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveCurrentPath (path) {
      Window.sessionStorage.setItem('currentPath', path)
      this.currentPath = path
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header{
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    span{
      padding-left: 20px;
    }
  }
}
.authText {
  margin-left: 10px;
}
.toggle-button {
  width: 100%;
  height: 24px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  background-color:#4a5064;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-aside{
  background-color: #373D41;
  .el-menu{
    border-right: 0;
  }
}
.el-main{
  background-color: #eaedf1;
}
</style>
