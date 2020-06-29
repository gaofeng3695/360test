"use strict";

/* 人员分数 */
var person = Vue.component('person', {
    props: {
        /* 表格的最大高度 */
        maxheightprop: String
    },
    data: function data() {
        return {
            personVm: '',

            /* 输入框的时间 */
            date: '',
            tableData: [],
            stripe: true
        };
    },
    created: function created() {},
    mounted: function mounted() {
        person.personVm = this;
        /* 获取到token */

        person.personVm.token = localStorage.getItem("token");
        person.personVm.$options.methods.getPersonScore();
    },
    methods: {
        /**
         * 得到表格数据
         */
        getPersonScore: function getPersonScore() {
            Vue.prototype.$http.post('/xnpatrol/gpsinsscore/getPage.do?token=' + person.personVm.token + '&inspectortype=01&statisticsdate=2019-04-04&unitid=34129890-6334-11e3-8155-e41f13e34b20').then(function (response) {
                if (response.data.rows != null && response.data.rows.length > 0) {
                    person.personVm.tableData = response.data.rows;
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        }
    },
    template: "\n                <!-- \u5185\u5BB9\u533A\u57DF -->\n                      \n              <el-table :data=\"tableData\" :stripe=\"stripe\" style=\"width: 100%\" v-bind:max-height=\"maxheightprop\">\n                   <el-table-column header-align=\"center\" prop=\"unitname\" label=\"\u90E8\u95E8\u540D\u79F0\"></el-table-column>\n                   <el-table-column header-align=\"center\" prop=\"unitname\" label=\"\u5DE1\u68C0\u4EBA\u5458\"></el-table-column>\n                   <el-table-column header-align=\"center\" label=\"\u5DE1\u7EBF\u8003\u6838\">\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"\u5DE1\u68C0\u5B8C\u6210\u7387\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"assessscore\" label=\"\u8003\u6838\u5206\u6570\"></el-table-column>\n                   </el-table-column>\n                   <el-table-column header-align=\"center\" prop=\"monthscore\" label=\"\u8BBE\u5907\u7F16\u53F7\"></el-table-column>\n                   <el-table-column header-align=\"center\" label=\"\u5DE1\u68C0\u8303\u56F4\">\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"\u8D77\u70B9\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"assessscore\" label=\"\u7EC8\u70B9\"></el-table-column>\n                   </el-table-column>\n                   <el-table-column header-align=\"center\" prop=\"monthscore\" label=\"\u5DE1\u7EBF\u91CC\u7A0B\uFF08KM\uFF09\"></el-table-column>\n                   \n                   <el-table-column header-align=\"center\" label=\"2019\u5E74\u6708\u5EA6\u8BC4\u5206\">\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"1\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"2\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"3\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"4\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"5\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"6\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"7\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"8\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"9\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"10\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"11\u6708\"></el-table-column>\n                       <el-table-column header-align=\"center\" prop=\"completionrate\" label=\"12\u6708\"></el-table-column>\n                   </el-table-column>\n                   \n                   <el-table-column header-align=\"center\" prop=\"monthscore\" label=\"\u73AF\u6BD4\u589E\u957F\"></el-table-column>\n                   <el-table-column header-align=\"center\" prop=\"monthscore\" label=\"2019\u5E74\u5EA6\u8BC4\u5206\"></el-table-column>\n                   </el-table-column header-align=\"center\"></el-table-column>\n              </el-table>\n\t\t\t"
});