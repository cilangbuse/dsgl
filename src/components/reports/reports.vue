<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据来源</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="width: 900px; height: 400px" id="main"></div>
  </div>
</template>

<script>
//通过this.$echarts来使用
import lod from "lodash";
export default {
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },

      list: {},
    };
  },

  mounted() {
    this.getdata();
  },
  methods: {
    async getdata() {
      const { data: res } = await this.axios.get("/api/reports/type/1");
      console.log(res);
      this.list = res;
      var echarts = require("echarts");
      var myChart = echarts.init(document.getElementById("main"));
      const newli = lod.merge(res, this.options);
      myChart.setOption(newli);
    },
  },
};
</script>

<style scoped lang="less">
#main {
  background-color: #fff;
  padding: 10px;
}
.bread{
  margin-bottom: 15px;
}
</style>
