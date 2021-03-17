<template>
  <div class="homebox">
    <div class="home_top">
      <div class="box1">
        <span>电商后台管理系统</span>
        <button @click="logout" type="info">退出</button>
      </div>
    </div>
    <div class="home_center">
      <!-- 导航 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="home_left_top" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu :index="item.id+''" v-for="item in list" :key="item.id">
            <template slot="title">
              <i :class="icon[item.id+'']"></i> 
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item 
            :index="'/home/'+ite.path" 
            v-for="ite in item.children" 
            :key="ite.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ite.authName}}</span>
              </template></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <div class="home_right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: "",
      icon: {
        "125": "el-icon-s-custom",
        "103": "el-icon-s-tools",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "145": "el-icon-data-line",
      },
      iscollapse: false,
      uniqueopened: true,
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
    },
  },
  created() {
    this.axios.get("/api/menus").then((res) => {
      console.log(res.data);
      this.list = res.data;
    });
  },
};
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}
html,
body {
  padding: 0;
  margin: 0;
}
.homebox{
  height: 100%;
  display: flex;
  flex-direction: column;
}

.home_top {
  width: 100%;
  height: 60px;
  background: #373d41;
  line-height: 60px;
  .box1 {
    width: 100%;
    font-size: 20px;
    margin-left: 10px;
    color: #ccc;
    button {
      float: right;
      padding: 10px 20px;
      margin-top: 10px;
      margin-right: 50px;
    }
  }
}
.home_center {
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: space-between;
  .home_left_top {
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    font-size: 14px;
  }
  .back {
    width: 199px;
  }
  .home_right {
    flex: 1;
    background: #eaedf1;
    padding-top: 15px;
    padding-left: 15px;
  }
}
.el-menu-vertical-demo {
  width: 99.9999%;
}
.el-menu {
  border: none;
}
.el-aside {
  background-color: #333744;
}
</style>