<template>
  <div class="home">
    <div class="login">
      <div class="logo">
        <img src="../assets/16.jpg" alt="" />
      </div>

      <div class="box">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="formLabelAlign"
          status-icon
          :rules="rules"
          ref="formLabelAlign"
        >
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="formLabelAlign.name"
              prefix-icon="el-icon-user-solid"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="region">
            <el-input
              v-model="formLabelAlign.region"
              prefix-icon="el-icon-unlock"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            class="btn"
            icon="el-icon-thumb"
            @click="submitForm('formLabelAlign')"
            @keyup.enter="submitForm('formLabelAlign')"
            >登录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "admin",
        region: "123456",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [{ required: true, message: "请输入密码", trigger: "change" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios
            .post("/api/login", {
              username: this.formLabelAlign.name,
              password: this.formLabelAlign.region,
            })
            .then((res) => {
              console.log(res);
              console.log(res.meta.status);
              if (res.meta.status === 200) {
                this.$message({
                  showClose: true,
                  message: "恭喜你，登录成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    window.sessionStorage.setItem("token", res.data.token);
                    this.$router.push("/home");
                  },
                });
              } else {
                this.$message({
                  showClose: true,
                  message: res.meta.msg,
                  type: "error",
                  duration: 1000,
                  // alert(res.meta.msg)
                });
              }
            });
        }
      });
    },
    login(){
      console.log("7777");
    },
    keyDown(e) {
      if (e.keyCode == 13) {
        alert("6666")
        this.login(); // 定义的登录方法
      }
    },
  },
  mounted() {
    // 绑定监听事件
    window.addEventListener("keydown", this.keyDown);
  },
  destroyed() {
    // 销毁事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
};
</script>
<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
  .home {
    width: 100%;
    height: 100vh;
    background: #2b4b6b;
    display: flex;
    align-items: center;
    justify-content: center;

    .login {
      width: 450px;
      height: 300px;
      padding: 20px 34px 20px 0px;
      width: 25%;
      background: white;
      border-radius: 10px 0px;
      .logo {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        // overflow: hidden;
        padding: 10px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;

        img {
          width: 100%;
          border-radius: 80%;
          background: #eee;
        }
      }

      .box {
        margin-top: 100px;
        .el-form-item {
          margin-bottom: 20px;
        }
        .btn {
          width: 100%;
          padding: 20px;
          margin-left: 16px;
        }
      }
    }
  }
}
</style>