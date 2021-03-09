<template>
  <div class="all">
    <el-form
      :label-position="labelPosition"
      :model="logininfo"
      class="str"
      :rules="rules"
      ref="logininfo"
    >
      <el-form-item class="user" prop="name">
        <el-input
          v-model="logininfo.name"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
          class="user"
        ></el-input>
      </el-form-item>
      <el-form-item class="pass" prop="password">
        <el-input
          v-model="logininfo.password"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          class="pass"
          show-password
        ></el-input>
      </el-form-item>

      <el-button type="primary" plain @click="submitForm('logininfo')"
        >登录</el-button
      >
    </el-form>
  </div>
</template>
  
  <script>
export default {
  props: {},
  data() {
    return {
      drawer: false,
      direction: "rtl",
      labelPosition: "right",
      logininfo: {
        name: "admin",
        password: "123456",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid);
        if (valid) {
          //axios
          this.axios
            .post("/api/login", {
              username: this.logininfo.name,
              password: this.logininfo.password,
            })
            .then((res) => {
              console.log(res);
              this.$message({
                message: "登录成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  window.sessionStorage.setItem("token", res.token);
                },
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  components: {},
};
</script>
  
  <style lang="less">
* {
  margin: 0;
  padding: 0;
}
.el-button + .el-button {
  margin: 0;
  margin-top: 20px;
}
.all {
  height: 100%;
  background-color: #504e4e;
  display: flex;
  justify-content: center;
  align-items: center;
  .str {
    width: 30%;
    padding: 20px;
    border-radius: 5px;
    background-color: #ccc;
  }
}
img {
  width: 450px;
}
.pi {
  position: relative;
  left: -15px;
}
button {
  width: 100%;
  margin-top: 30px;
  display: block;
}
</style>
  