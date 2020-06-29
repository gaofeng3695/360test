/* 人员分数 */
var person = Vue.component('person', {
    props: {
        /* 表格的最大高度 */
        maxheightprop: String,
        unitidprop:String
    },
    data: function () {
        return {
            personVm: '',
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
        person.personVm = this;
        /* 获取到token */
        person.personVm.token = localStorage.getItem("token");
        person.personVm.user = JSON.parse(sessionStorage.user);
        person.personVm.$options.methods.getPersonScore();

        if(person.personVm.unitidprop != null && person.personVm.unitidprop != undefined && person.personVm.unitidprop != '') {
            person.personVm.$options.methods.getPersonScore(person.personVm.unitidprop);
        }else {
            person.personVm.$options.methods.getPersonScore(person.personVm.user.unitId);
        }

    },

    methods: {
        /**
         * 得到表格数据
         */
        getPersonScore( unitId ) {
            Vue.prototype.$http.post('/xnpatrol/gpsinsscore/getPage.do?token='+person.personVm.token+'&inspectortype=01&statisticsdate=2019-04-04&unitid='+unitId)
                .then(function (response) {
                    if( response.data.rows != null && response.data.rows.length > 0 ) {
                        person.personVm.tableData = response.data.rows;
                        /* 将部门数据告诉其他组件,发送一个广播。 */
                        person.personVm.$root.eventHub.$emit('clicktop', unitId);
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }
    },

    template: `
                <!-- 内容区域 -->
                      
              <el-table :data="tableData" :stripe="stripe" style="width: 100%" v-bind:height="maxheightprop">
                   <el-table-column type="index" fixed ></el-table-column>
                   <el-table-column header-align="center" fixed prop="unitname" label="部门名称"></el-table-column>
                   <el-table-column header-align="center" fixed prop="inspectorName" label="巡检人员"></el-table-column>
                   <el-table-column header-align="center"  label="巡线考核">
                       <el-table-column header-align="center"  prop="completionrate" label="巡检完成率"></el-table-column>
                       <el-table-column header-align="center"  prop="assessscore" label="考核分数"></el-table-column>
                   </el-table-column>
                   <el-table-column header-align="center"  prop="devCode" label="设备编号"></el-table-column>
                   <el-table-column header-align="center"  label="巡检范围">
                       <el-table-column header-align="center" prop="beginlocation" label="起点"></el-table-column>
                       <el-table-column header-align="center" prop="endlocation" label="终点"></el-table-column>
                   </el-table-column>
                   <el-table-column header-align="center"  prop="linelength" label="巡线里程（KM）"></el-table-column>
                   
                   <el-table-column header-align="center" label="2019年月度评分">
                       <el-table-column header-align="center" prop="janscore" label="1月"></el-table-column>
                       <el-table-column header-align="center" prop="febscore" label="2月"></el-table-column>
                       <el-table-column header-align="center" prop="marscore" label="3月"></el-table-column>
                       <el-table-column header-align="center" prop="aprscore" label="4月"></el-table-column>
                       <el-table-column header-align="center" prop="mayscore" label="5月"></el-table-column>
                       <el-table-column header-align="center" prop="junscore" label="6月"></el-table-column>
                       <el-table-column header-align="center" prop="julscore" label="7月"></el-table-column>
                       <el-table-column header-align="center" prop="augscore" label="8月"></el-table-column>
                       <el-table-column header-align="center" prop="sepscore" label="9月"></el-table-column>
                       <el-table-column header-align="center" prop="octscore" label="10月"></el-table-column>
                       <el-table-column header-align="center" prop="novscore" label="11月"></el-table-column>
                       <el-table-column header-align="center" prop="decscore" label="12月"></el-table-column>
                   </el-table-column>
                   
                   <el-table-column header-align="center" prop="increaserate" label="环比增长"></el-table-column>
                   <el-table-column header-align="center" prop="yearscore" label="2019年度评分"></el-table-column>
                   </el-table-column header-align="center"></el-table-column>
              </el-table>
			`

})

