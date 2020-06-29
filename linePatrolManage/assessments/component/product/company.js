"use strict";

/* 创建弹出框组件 */
var company = Vue.component('company', {
    data: function data() {
        return {
            companyVm: '',

            /* 输入框的时间 */
            date: '',
            tableData: [],
            stripe: true
        };
    },
    created: function created() {},
    mounted: function mounted() {
        company.companyVm = this;
        /* 获取到token */

        company.companyVm.token = localStorage.getItem("token");
        company.companyVm.$options.methods.getCompanyScore();
    },
    methods: {
        /**
         * 得到表格数据
         */
        getCompanyScore: function getCompanyScore() {
            Vue.prototype.$http.post('/xnpatrol/gpsunitscore/getPage.do?token=' + company.companyVm.token + '&inspectortype=01&statisticsdate=2019-04-04').then(function (response) {
                if (response.data.rows != null && response.data.rows.length > 0) {
                    company.companyVm.tableData = response.data.rows;
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        }
    },
    template: "\n                <!-- \u5185\u5BB9\u533A\u57DF -->\n                      \n              <el-table :data=\"tableData\" :stripe=\"stripe\" style=\"width: 100%\">\n                 <el-table-column header-align=\"center\" prop=\"unitname\" label=\"\u90E8\u95E8\u540D\u79F0\"></el-table-column>\n                   <el-table-column header-align=\"center\" label=\"\u5DE1\u7EBF\u8003\u6838\">\n                       <el-table-column header-align=\"center\" prop=\"linelength\" label=\"\u6240\u8F96\u7BA1\u9053\u957F\u5EA6\uFF08KM\uFF09\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"plancoveragerate\" label=\"\u5DE1\u68C0\u8BA1\u5212\u8986\u76D6\u7387\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"taskcoveragerate\" label=\"\u5DE1\u68C0\u4EFB\u52A1\u8986\u76D6\u7387\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"\u5DE1\u68C0\u5B8C\u6210\u7387\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"loginscore\" label=\"\u6BCF\u5468\u767B\u9646\u5206\u6570\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"assessscore\" label=\"\u8003\u6838\u5206\u6570\"></el-table-column>\n                   </el-table-column>\n                   <el-table-column header-align=\"center\" prop=\"monthscore\" label=\"\u672C\u6708\u8BC4\u5206\"></el-table-column>\n                   <el-table-column header-align=\"center\" prop=\"increaserate\" label=\"\u73AF\u6BD4\u589E\u957F\"></el-table-column>\n                   <el-table-column header-align=\"center\" prop=\"yearscore\" label=\"\u5E74\u5EA6\u8BC4\u5206\"></el-table-column>\n                   </el-table-column header-align=\"center\"></el-table-column>\n              </el-table>\n\t\t\t"
});