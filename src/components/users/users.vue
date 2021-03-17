<template>
  <div class="users">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userSc(scope.row)"
              active-color="#13ce66"
              inactive-color="#ccc"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit(scope.row.id)"
            >
            </el-button>
            <!-- 删除安钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="light"
              content="分配角色"
              placement="top-start"
              :enterable="true"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区------------------------------------------------------------------------------ -->
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
    <!-- 添加用户的对话框 -------------------------------------------------------------------------->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role_id">
          <el-input v-model="addForm.role_id"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修该用户的对话框 ------------------------------------------------------------------->
    <el-dialog title="修改用户" :visible.sync="edit" width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分配角色的对话框 ------------------------------------------------------------------->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <br />
        <p>当前的用户：{{ userInfo.role_name }}</p>
        <br />
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
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
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[3-9]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的手机号"));
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
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        role_id: "",
        email: "",
        mobile: "",
        role_name: "",
      },
      // 添加表单的验证规则的对象
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        role_id: [
          {
            required: true,
            message: "请输入用户角色",
            trigger: "blur",
          },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
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
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: "",
      rolesList: [],
      selectedRoleId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.axios.get("/api/users", { params: this.queryInfo }).then((res) => {
        // console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error("获取用户列表失败");
        }
        this.userlist = res.data.users;
        this.total = res.data.total;
      });
    },
    // 监听pagesize 改变的事件
    handleSizeChange(v) {
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
        .put(`/api/users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          if (res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state;
            return this.$message.error("更新数据失败");
          }
          this.$message.success("更新用户成功");
        });
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        this.axios.post("/api/users", this.addForm).then((res) => {
          console.log(res);
          if (res.meta.status !== 201) {
            this.$message.error("添加用户失败");
          }
          this.$message.success("添加用户成功");
          // 隐藏添加用户的对话框
          this.addDialogVisible = false;
          // 从新获取列表数据
          this.getUserList();
        });
      });
    },
    //  展示编辑用户的对话框
    showEdit(id) {
      console.log(id);
      this.axios.get("/api/users/" + id).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户信息失败");
        }
        this.editForm = res.data;
      });
      this.edit = true;
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        // console.log(valid);
        if (!valid) return;
        // 发起修改用户信息的数据请求
        this.axios
          .put("/api/users/" + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          })
          .then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error("更新用户信息失败");
            }
            // 关闭对话框
            this.edit = false;
            // 修改数据列表
            this.getUserList();
            // 提示修改成功
            this.$message.success("更新用户信息成功");
          });
      });
    },
    // 根据Id删除对应的用户信息
    removeUserById(id) {
      // console.log(id);
      // 弹框询问是否删除数据
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          console.log(res);
          if (res === "confirm") {
            this.axios.delete("/api/users/" + id).then((res) => {
              console.log(res);
              if (res.meta.status !== 200) {
                return this.$message.err("删除用户失败");
              } else {
                this.$message.success("删除用户成功");
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
    // 点击按钮展示分配角色权限的对话框
    setRole(userInfo) {
      this.userInfo = userInfo;
      this.axios.get("/api/roles").then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户信息失败");
        }
        this.rolesList = res.data;
        this.setRoleDialogVisible = true;
      });
    },
    // 修改用户角色
    saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      this.axios
        .put(`/api/users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId,
        })
        .then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("更新角色失败");
            } else {
              this.$message.success("更新角色成功");
              this.getUserList();
            }
        });
      
      this.setRoleDialogVisible = false;
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