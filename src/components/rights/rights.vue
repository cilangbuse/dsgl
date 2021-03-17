<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <div class="guding">
      <el-card>
        <el-table :data="rightsList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="index" label="#"></el-table-column>
          <!-- 索引列 -->
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'"
                >二级</el-tag
              >
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 权限列表
      rightsList: [],
    };
  },
  mounted() {
    // 来获取所有的列表权限
    this.getRightsList();
  },
  methods: {
    // 获取用户列表
    getRightsList() {
      this.axios.get("/api/rights/list").then((res) => {
        console.log(res.data);
        if (res.meta.status !== 200) {
          return this.$message.error("获取权限列表失败");
        }
        this.rightsList = res.data;
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-breadcrumb {
  font-size: 14px;
  line-height: 1;
}
.guding {
  height: 500px;
  overflow: auto;
}
.bread{
  margin-bottom: 15px;
}
</style>
