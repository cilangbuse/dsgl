<template>
  <div class="users">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            class="input-with-select"
          >
            <el-button
              slot="append"
              @click="getUserList"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addsp">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_number" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit(scope.row.goods_id)"
            >
            </el-button>
            <!-- 删除安钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户页面 -->

    <!-- 修该用户的对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="edit"
      width="50%"
      @close="editDialog"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="商品名" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  props: {},
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      if (value.length !== 0) {
        return true;
      }
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      if (value.length !== 0) {
        return true;
      }
    };
    return {
      input: "",
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏

      // 添加用户的表单数据
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        add_time: "",
      },
      // 添加表单的验证规则的对象
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名",
            trigger: "blur",
          },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      // 控制修改用户对话框的显示与隐藏
      edit: false,
      // 查询到用户信息对象
      editForm: {},
      editFormRules: {
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    addsp() {
      this.$router.push("/home/addsp");
    },
    getUserList() {
      this.axios.get("/api/goods", { params: this.queryInfo }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error("获取商品列表失败");
        }
        this.userlist = res.data.goods;
        this.total = res.data.total;
      });
    },
    // 监听pagesize 改变的事件
    handleSizeChange(v) {
      console.log(v);
      this.queryInfo.pagesize = v;
      this.getUserList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(v) {
      this.queryInfo.pagenum = v;
      this.getUserList();
    },
    // 监听switch开关的状态的改变
    userSc(userinfo) {
      console.log(userinfo);
      this.axios
        .put(`/api/goods/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          if (res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state;
            return this.$message.error("更新数据失败");
          }
          this.$message.success("更新列表成功");
        });
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        console.log(valid);
        if (!valid) return;
        // 可以发起添加用户的网络请求
        this.axios.post("/api/goods", this.addForm).then((res) => {
          console.log(res);
          if (res.meta.status !== 201) {
            this.$message.error("添加商品失败");
          }
          this.$message.success("添加商品成功");
          // 从新获取列表数据
          this.getUserList();
        });
      });
    },
    //  展示编辑用户的对话框
    showEdit(id) {
      console.log(id);
      this.axios.get("/api/goods/" + id).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("查询商品信息失败");
        }
        this.editForm = res.data;
      });
      this.edit = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialog() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.axios
        .put(`/api/goods/${this.editForm.goods_id}`, {
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_number: this.editForm.goods_number,
          goods_weight: this.editForm.goods_weight,
        })
        .then((res) => {
          console.log(res);
          console.log(res.meta.status);
          if (res.meta.status !== 200) {
            return this.$message.error("更新商品信息失败");
          }
          // 关闭对话框
          this.edit = false;
          // 修改数据列表
          this.getUserList();
          // 提示修改成功
          this.$message.success("更新商品信息成功");
        });
    },
    // 根据Id删除对应的用户信息
    removeUserById(id) {
      // console.log(id);
      // 弹框询问是否删除数据
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          console.log(res);
          if (res === "confirm") {
            this.axios.delete("/api/goods/" + id).then((res) => {
              console.log(res);
              if (res.meta.status !== 200) {
                return this.$message.err("删除商品失败");
              } else {
                this.$message.success("删除商品成功");
                this.getUserList();
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
          if (err !== "confirm") {
            return this.$message.info("已取消删除");
          }
        });
    },
  },
  components: {},
};
</script>
  
  <style scoped lang="less">
.users {
  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    margin-top: 15px;

    .el-table {
      margin-top: 15px;
      font-size: 12px;
    }

    .el-pagination {
      margin-top: 15px;
      font-size: 12px;
    }
  }
  .el-breadcrumb {
    font-size: 14px;
    line-height: 1;
  }
}
</style>