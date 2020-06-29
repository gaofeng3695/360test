/**
 *  创建站或者分公司组件
 */
var company = Vue.component('company', {
    props: {
        /* 表格的最大高度 */
        maxheightprop: String,
        unitidprop:String,
        /* 是否需要加载列表 */
        flag:String
    },
    data: function () {
        return {
            companyVm: '',
            /* 输入框的时间 */
            date: '',
            tableData: [],
            stripe:true,
            user:{}

        }
    },
    created: function() {

    },
    mounted: function() {
        company.companyVm = this;
        /* 获取到token */
        company.companyVm.token = localStorage.getItem("token");
        company.companyVm.user = JSON.parse(sessionStorage.user);

        /* 如果需要加载默认列表 */
        if( company.companyVm.flag == "1" ) {
            if(company.companyVm.unitidprop != null && company.companyVm.unitidprop != undefined && company.companyVm.unitidprop != '') {
                company.companyVm.$options.methods.getCompanyScore(company.companyVm.unitidprop,"");
            } else {
                company.companyVm.$options.methods.getCompanyScore(company.companyVm.user.unitId,"");
            }
        }

        /* 接收广播。 */
        commontop.topVm.$root.eventHub.$on('clicknav', ( unitId ) => {
            /*  切换组件到 */
            company.companyVm.$options.methods.getCompanyScore(unitId, "1" );
        } )
    },

    methods: {
        /**
         * 得到表格数据
         */
        getCompanyScore(oid, nextLevel) {
            Vue.prototype.$http.post('/xnpatrol/gpsunitscore/getPage.do?token='+company.companyVm.token+'&inspectortype=01&statisticsdate=2019-04-04&unitid='+oid+"&nextLevel="+nextLevel)
                .then(function (response) {
                    if( response.data.rows != null && response.data.rows.length > 0 ) {
                        company.companyVm.tableData = response.data.rows;

                        /* 将部门数据告诉其他组件,发送一个广播。 */
                        company.companyVm.$root.eventHub.$emit('clicktop', oid);
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        },
        /**
         * 跳到下一个页面，获取部门名称或者人员ID加上层级编号
         */
        getNextPageForStation(oid, unitName) {
            /* 参考之前逻辑，这边只做样式调整。*/
            company.companyVm.$options.methods.getCompanyScore(oid, "1" );
        },
        /**
         * 跳到下一个人员页面
         */
        getNextPageForInspector(oid, unitName) {
            /* 切换到人员组件。*/
            this.$emit( "childupdatepersonevent", oid );
        }
    },

    template: `
                <!-- 内容区域 -->
                      
              <el-table :data="tableData" :stripe="stripe" style="width: 100%" v-bind:height="maxheightprop" :border="stripe">
                 <el-table-column type="index" ></el-table-column>
                 <el-table-column header-align="center" label="部门名称" >
                 <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>{{ scope.row.unitname }}</p>
                      <div slot="reference" class="name-wrapper">
                        <!-- 参照之前代码，具体逻辑没深究。 -->
                        <el-tag v-if="scope.row.nowUserUnitLevel < scope.row.unitLevel && scope.row.unitLevel == 3" size="medium" class="level-name" v-on:click="getNextPageForInspector(scope.row.unitid, scope.row.unitname)">{{ scope.row.unitname }}</el-tag>
                        <el-tag v-if="scope.row.nowUserUnitLevel < scope.row.unitLevel && scope.row.unitLevel != 3" size="medium" class="level-name" v-on:click="getNextPageForStation(scope.row.unitid, scope.row.unitname)">{{ scope.row.unitname }}</el-tag>
                        <el-tag v-else-if="scope.row.nowUserUnitLevel == scope.row.unitLevel && scope.row.unitid == user.unitId" size="medium" class="level-name" v-on:click="getNextPageForInspector(scope.row.unitid, scope.row.unitname)">{{ scope.row.unitname }}</el-tag>
                        <el-tag v-else-if="scope.row.nowUserUnitLevel == scope.row.unitLevel && scope.row.isPipeOffice == '1' && scope.row.nowUserUnitPid == scope.row.unitid" size="medium" class="level-name" v-on:click="getNextPageForStation(scope.row.unitid, scope.row.unitname)">{{ scope.row.unitname }}</el-tag>
                      </div>
                    </el-popover>
                  </template>
                  
                  </el-table-column>
                   <el-table-column header-align="center" label="巡线考核">
                       <el-table-column header-align="center" prop="linelength" label="所辖管道长度（KM）"></el-table-column>
                       <el-table-column header-align="center" prop="plancoveragerate" label="巡检计划覆盖率"></el-table-column>
                       <el-table-column header-align="center" prop="taskcoveragerate" label="巡检任务覆盖率"></el-table-column>
                       <el-table-column header-align="center" prop="completionrate" label="巡检完成率"></el-table-column>
                       <el-table-column header-align="center" prop="loginscore" label="每周登陆分数"></el-table-column>
                       <el-table-column header-align="center" prop="assessscore" label="考核分数"></el-table-column>
                   </el-table-column>
                   <el-table-column header-align="center" prop="monthscore" label="本月评分"></el-table-column>
                   <el-table-column header-align="center" prop="increaserate" label="环比增长"></el-table-column>
                   <el-table-column header-align="center" prop="yearscore" label="年度评分"></el-table-column>
                   </el-table-column header-align="center"></el-table-column>
              </el-table>
			`

})

