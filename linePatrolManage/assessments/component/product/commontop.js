"use strict";

/**
 * 关闭
 */

/* 创建弹出框组件 */
var commontop = Vue.component('company-top', {
    data: function data() {
        return {
            topVm: '',

            /* 输入框的时间 */
            date: ''
        };
    },
    created: function created() {},
    mounted: function mounted() {
        top.topVm = this;
        top.topVm.$options.methods.dateFormat();
        top.topVm.date = new Date().format('yyyy-MM-dd');
    },
    methods: {
        dateFormat: function dateFormat() {
            /**
             * @desc JS日期格式化转换方法
             * @param fmt 日期时间的格式
             */
            Date.prototype.format = function (fmt) {
                var o = {
                    "M+": this.getMonth() + 1,
                    //月份
                    "d+": this.getDate(),
                    //日
                    "h+": this.getHours(),
                    //小时
                    "m+": this.getMinutes(),
                    //分
                    "s+": this.getSeconds(),
                    //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3),
                    //季度
                    "S": this.getMilliseconds() //毫秒

                };

                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                }

                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }

                return fmt;
            };
        }
    },
    template: "\n                    \n                <!-- \u5934\u90E8\u533A\u57DF -->\n                <el-row type=\"flex\" align=\"middle\" class=\"row-bg\" justify=\"space-between\">\n                    <el-col :span=\"9\">\n                       <el-breadcrumb separator=\"/\">\n                         <el-breadcrumb-item :to=\"{ path: '/' }\">\u9996\u9875</el-breadcrumb-item>\n                         <el-breadcrumb-item><a href=\"/\">\u6D3B\u52A8\u7BA1\u7406</a></el-breadcrumb-item>\n                         <el-breadcrumb-item>\u6D3B\u52A8\u5217\u8868</el-breadcrumb-item>\n                         <el-breadcrumb-item>\u6D3B\u52A8\u8BE6\u60C5</el-breadcrumb-item>\n                       </el-breadcrumb>\n                    </el-col>\n                    <el-col :span=\"8\">\n                         <el-button>\u524D\u4E00\u5929</el-button>\n                         <el-date-picker v-model=\"date\" type=\"date\" placeholder=\"\u9009\u62E9\u65E5\u671F\"></el-date-picker>\n                         <el-button>\u540E\u4E00\u5929</el-button>\n                         <el-button>\u7EDF\u8BA1\u56FE</el-button>\n                         <el-button>\u5BFC\u51FA</el-button>\n                    </el-col>\n                </el-row>\n\t\t\t"
});