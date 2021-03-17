<template>
  <div>
    <div style="width: 900px; height: 400px" id="main"></div>
    <div style="width: 900px; height: 400px" id="max"></div>
  </div>
</template>

<script>
//通过this.$echarts来使用
import lod from "lodash";
export default {
  data() {
    return {
      option2: {
        title: {
          text: "Step Line",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["东部", "南部", "北部"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "东部",
            type: "line",
            step: "start",
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "南部",
            type: "line",
            step: "middle",
            data: [220, 282, 201, 234, 290, 430, 410],
          },
          {
            name: "北部",
            type: "line",
            step: "end",
            data: [450, 432, 401, 454, 590, 530, 510],
          },
        ],
      },
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
      var myChart2 = echarts.init(document.getElementById("max"));
      const newli = lod.merge(res, this.options);
      const newli2 = lod.merge(res, this.option2);
      myChart.setOption(newli);
      myChart2.setOption(newli2);
    },
  },
};
</script>
    
    <style scoped lang="less">
#main {
  background-color: #fff;
  padding: 10px;
}
</style>