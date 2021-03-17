<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 视图 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeindex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 内容 -->
      <el-form
        :model="addform"
        :rules="addformrules"
        ref="addformref"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeindex"
          :tab-position="'left'"
          :before-leave="befortab"
          @tab-click="tabtab"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addform.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addform.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addform.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addform.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat" type="number">
              <el-cascader
                expand-trigger="hover"
                :options="list"
                :props="catep"
                v-model="addform.goods_cat"
                @change="setcate"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyvaa"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="ab"
                  v-for="(ab, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyvaa"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://192.168.1.30:8888/api/private/v1/upload"
              :on-preview="upload"
              :on-remove="photono"
              :on-success="upgood"
              list-type="picture"
              :headers="header"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addform.goods_introduce"></quill-editor>
            <el-button type="primary" class="upspp" @click="ad"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="phshow" width="50%">
      <img :src="phpath" alt="" class="showimg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  cate: {
    label: "cat_name",
    value: "cat_id",
    children: "children",
  },
  props: {},
  data() {
    return {
      phshow: false,
      phpath: "",
      header: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      manyvaa: [],
      onlyvaa: [],
      catep: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      list: [],
      activeindex: "0",
      addform: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 级联选择框
        goods_cat: [],
        pics: [],
        // 商品详情描述
        goods_introduce: "",
        attrs: [],
      },
      addformrules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称！",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格！",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量！",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量！",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类！",
          },
        ],
      },
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    // 表单预验证
    ad() {
      this.$refs.addformref.validate((valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项目！");
        }
        const newadd = _.cloneDeep(this.addform);
        newadd.goods_cat = newadd.goods_cat.join(",");
        // 处理动静态
        this.manyvaa.forEach((item) => {
          const newmany = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };

          this.addform.attrs.push(newmany);
        });

        this.onlyvaa.forEach((item) => {
          const newonly = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          console.log(newonly);
          this.addform.attrs.push(newonly);
        });
        newadd.attrs = this.addform.attrs;
        this.axios.post(`/api/goods`, newadd).then((res) => {
          console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error("添加商品失败！");
          }
          this.$message.success("添加商品成功！");
          this.$router.push("/home/permission");
        });
      });
    },
    //   图片预览
    upload(res) {
      this.phpath = res.response.data.url;
      this.phshow = true;
    },
    // 移除图片
    photono(rem) {
      const remi = rem.response.data.tmp_path;
      const i = this.addform.pics.findIndex((x) => {
        x.pic === remi;
      });
      this.addform.pics.splice(i, 1);
    },
    // 上传成功触发
    upgood(res) {
      const pic = { pic: res.data.tmp_path };
      this.addform.pics.push(pic);
    },
    tabtab() {
      if (this.activeindex === "1") {
        this.axios
          .get(`/api/categories/${this.cateid}/attributes`, {
            params: { sel: "many" },
          })
          .then((res) => {
            console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("获取动态参数列表失败！");
            }
            res.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.manyvaa = res.data;
            console.log(this.manyvaa);
          });
      } else if (this.activeindex === "2") {
        this.axios
          .get(`/api/categories/${this.cateid}/attributes`, {
            params: { sel: "only" },
          })
          .then((res) => {
            console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("获取静态属性列表失败！");
            }
            res.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
            });
            this.onlyvaa = res.data;
          });
      }
    },
    //   阻止切换
    befortab(n, o) {
      if (o === "0" && this.addform.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类！");
        return false;
      }
    },
    //   获取商品分类数据
    getlist() {
      this.axios.get("/api/categories").then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品分类数据失败！");
        }
        this.list = res.data;
      });
    },
    // 级联选择器选择触发
    setcate() {
      if (this.addform.goods_cat.length !== 3) {
        this.addform.goods_cat = [];
        return;
      }
    },
  },
  components: {},
  computed: {
    cateid() {
      if (this.addform.goods_cat.length === 3) {
        return this.addform.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style scoped lang="less">
.el-steps {
  margin: 15px 0;
}
.el-steps_title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.showimg {
  width: 100%;
}
.upspp {
  margin-top: 20px;
}
.bread{
  margin-bottom: 15px;
}
</style>
