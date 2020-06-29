"use strict";

/* 底部组件 */
var messagebottom = Vue.component('message-bottom', {
    data: function data() {
        return {
            bottomVm: ''
        };
    },
    created: function created() {},
    mounted: function mounted() {
        messagebottom.bottomVm = this;
    },
    methods: {},
    template: "\n            <section>\n                <el-row type=\"flex\" class=\"row-bg\">\n                  <el-col :span=\"12\"><div>\u6CE8: \u7EFC\u5408\u8BC4\u5206\u8BA1\u7B97\u8BF4\u660E\uFF1A</div></el-col>\n                </el-row>\n               \n               <el-row type=\"flex\" class=\"row-bg\">\n                  <el-col :span=\"12\"><div>1\u3001\u5206\u516C\u53F8\u5404\u7AD9\u5E73\u5747\u5206\u6570\uFF0C\u5F97\u5206\u56DB\u820D\u4E94\u5165\u4FDD\u7559\u6574\u6570\uFF1B</div></el-col>\n                </el-row>\n                <el-row type=\"flex\" class=\"row-bg\">\n                  <el-col :span=\"12\"><div>2\u3001\u7EA2\u8272\u8B66\u544A\uFF1A\u5DE1\u68C0\u5B8C\u6210\u7387\u4F4E\u4E8E80%\uFF0C\u9700\u91CD\u70B9\u76D1\u5BDF\uFF1B</div></el-col>\n                </el-row>\n                <el-row type=\"flex\" class=\"row-bg\">\n                  <el-col :span=\"12\"><div>3\u3001\u84DD\u8272\u8B66\u544A\uFF1A\u5DE1\u68C0\u5B8C\u6210\u7387\u4F4E\u4E8E90%\uFF0C\u9700\u52A0\u5F3A\u7BA1\u7406\uFF1B</div></el-col>\n                </el-row>\n                <el-row type=\"flex\" class=\"row-bg\">\n                  <el-col :span=\"12\"><div>4\u3001\u7BA1\u9053\u7EBF\u8DEF\u5DE1\u68C0\u8BA1\u5212\u8986\u76D6\u7387=\uFF08\u5236\u5B9A\u5DE1\u68C0\u8BA1\u5212\u7684\u7BA1\u9053\u91CC\u7A0B/\u7BA1\u9053\u603B\u91CC\u7A0B\uFF09\xD7100%\uFF1B\u4F4E\u4E8E100%\u4EE5\u7EA2\u8272\u5C55\u793A\uFF1B</div></el-col>\n                </el-row>\n                <el-row type=\"flex\" class=\"row-bg\">\n                  <el-col :span=\"12\"><div>5\u3001\u7BA1\u9053\u7EBF\u8DEF\u5DE1\u68C0\u4EFB\u52A1\u8986\u76D6\u7387=\uFF08\u843D\u5B9E\u5DE1\u68C0\u4EFB\u52A1\u7684\u7BA1\u9053\u91CC\u7A0B/\u7BA1\u9053\u603B\u91CC\u7A0B\uFF09\xD7100%\uFF1B\u4F4E\u4E8E100%\u4EE5\u7EA2\u8272\u5C55\u793A\uFF1B</div></el-col>\n                </el-row>\n                <el-row type=\"flex\" class=\"row-bg\">\n                  <el-col :span=\"12\"><div>6\u3001\u7BA1\u9053\u7EBF\u8DEF\u5DE1\u68C0\u5B8C\u6210\u7387=\u5404\u5206\u516C\u53F8\u6240\u8F96\u7AD9\u961F\u603B\u6210\u7EE9/\u5404\u5206\u516C\u53F8\u6240\u8F96\u5DE1\u68C0\u7AD9\u961F\u603B\u6570\uFF1B</div></el-col>\n                </el-row>\n           </section>\n\t\t\t"
});