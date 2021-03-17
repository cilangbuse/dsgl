<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 视图区 -->
    <!-- 地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="xgdl"
      width="50%"
      @close="closeadd"
    >
      <el-form
        :model="addfor"
        :rules="addforRules"
        ref="addforRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="addfor1">
          <el-cascader :options="city" v-model="addfor.addfor1"> </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addfor2">
          <el-input v-model="addfor.addfor2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="xgdl = false">取 消</el-button>
        <el-button type="primary" @click="xgdl = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 表格 -->
    <el-card>
      <el-row style="margin-bottom: 40px">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="dd.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="tableData" border stripe>
        <el-table-column id="shid" type="index"></el-table-column>
        <el-table-column
          id="shbh"
          label="订单编号"
          prop="order_number"
          width="300"
        ></el-table-column>
        <el-table-column
          id="ddjg"
          label="订单价格"
          prop="order_price"
          width="100"
        ></el-table-column>
        <el-table-column id="sf" label="是否付款" prop="pay_status" width="100">
          <template slot-scope="scope">
            {{ scope.row.pay_status == 0 ? "未付款" : "已付款" }}
          </template>
        </el-table-column>
        <el-table-column
          id="fh"
          label="是否发货"
          prop="is_send"
          width="100"
        ></el-table-column>
        <el-table-column id="sh" width="100" label="下单时间" prop="creat_time">
          <template slot-scope="scope">
            {{ scope.row.create_time|dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  size="mini" id="cz" @click="showwz(scope.row.order_id)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button size="mini" id="cz2" @click="showbox">
              <i class="el-icon-location"></i>
            </el-button>
            <el-button size="mini" @click="getdd(scope.row.order_id)" id="cz3">
              订单详情
            </el-button>
            <el-button size="mini" id="cz4">订单管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="dd.pagenum"
      :page-sizes="[5, 10]"
      :page-size="dd.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 订单详情 -->
    <el-dialog
      title="订单详情"
      :visible.sync="ddva"
      width="50%"
      :before-close="clo"
    >
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>

<script>
import city from "../../assets/provinces-china-master/city_data2017_element";
export default {
  props: {},
  data() {
    return {
      ddva: false,
      addfor: {
        addfor1: [],
        addfor2: "",
      },
      addforRules: {
        addfor1: [{ required: true, message: "请选择地址", trigger: "blur" }],
        addfor2: [
          { required: true, message: "请填写详细地址地址", trigger: "blur" },
        ],
      },
      city,
      xgdl: false,
      orderid: null,
      wlbea: false,
      wl: [],
      ddid: "",
      input: "",
      //   查询参数
      dd: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //   获取到的数据
      tableData: [],
      total: null,
    };
  },
  mounted() {
    this.aa();
  },
  methods: {
    // 展示修改地址
    closeadd() {
      this.$refs.addforRef.resetFields();
    },
    showbox() {
      this.xgdl = true;
    },
    async aa() {
      const { data: res } = await this.axios.get("/api/orders", {
        params: this.dd,
      });
      console.log(res);
      this.total = res.total;
      this.tableData = res.goods;
      return res;
    },
    // 订单详情
    async getdd(e) {
      console.log(e);
      this.ddva = true;
      const { data: res } = await this.axios.get(`/api/orders/${e}`);
      console.log(res);
    },
    showwz(e) {
      console.log(e);
      this.wlbea = true;
    },
    handleSizeChange(val) {
      this.aa();
      this.dd.pagesize = val;
    },
    handleCurrentChange(val) {
      this.aa();
      this.dd.pagenum = val;
    },
    clo() {
      this.ddva = false;
      console.log(111);
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
#cz {
  background-color: rgb(57, 194, 57);
}
#cz2 {
  background-color: rgb(74, 145, 211);
}
#cz3 {
  background-color: rgb(211, 129, 74);
}
#cz4 {
  background-color: rgb(211, 74, 177);
}
// button {
//   width: 80px;
//   height: 40px;
//   border-radius: 5px;
//   border: none;
// }
tr {
  height: 60px;
}
.bread{
  margin-bottom: 15px;
}
</style>
