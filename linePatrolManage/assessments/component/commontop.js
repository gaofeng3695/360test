/* 创建弹出框组件 */
var commontop = Vue.component('company-top', {
    data: function () {
        return {
            topVm: '',
            /* 输入框的时间 */
            date: '',
            parentList: [{"oid":1, "hierarchy":0, "unitName":"-"}],
            /* 当前部门 */
            department: [],
            departmentOid:'',
            departmentHierarchy:''

        }
    },
    created: function() {

    },
    mounted: function() {
        commontop.topVm = this;

        /* 获取到token */
        commontop.topVm.token = localStorage.getItem("token");
        commontop.topVm.user = JSON.parse(sessionStorage.user);
        commontop.topVm.$options.methods.dateFormat();

        commontop.topVm.date = new Date().format('yyyy-MM-dd');

        commontop.topVm.departmentOid = commontop.topVm.user.unitId;
        commontop.topVm.$options.methods.getParentDeparement( commontop.topVm.departmentOid  );
        /* 接收广播。 */
        commontop.topVm.$root.eventHub.$on('clicktop', ( unitId ) => {
            commontop.topVm.$options.methods.getParentDeparement( unitId, "0"  ); // 不需要自己加载列表。
        } )
    },

    methods: {
        dateFormat() {
            /**
             * @desc JS日期格式化转换方法
             * @param fmt 日期时间的格式
             */
            Date.prototype.format = function(fmt) {
                var o = {
                    "M+" : this.getMonth()+1,                 //月份
                    "d+" : this.getDate(),                    //日
                    "h+" : this.getHours(),                   //小时
                    "m+" : this.getMinutes(),                 //分
                    "s+" : this.getSeconds(),                 //秒
                    "q+" : Math.floor((this.getMonth()+3)/3), //季度
                    "S"  : this.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt)) {
                    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                }
                for(var k in o) {
                    if(new RegExp("("+ k +")").test(fmt)){
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                    }
                }
                return fmt;
            };
        },
        /**
         * 获取到父部门数据
         * @param departmentOid
         */
        getParentDeparement( departmentOid ) {
            Vue.prototype.$http.post('/xnpatrol/realtimemonitor/realtimemonitor/getParentUnitList.do?unitId=' + departmentOid + '&token=' + commontop.topVm.token)
                .then(function (response) {
                    /* 设置列表部门。 */
                    commontop.topVm.parentList = response.data.data;
                    /* 设置当前部门 */
                    commontop.topVm.department =  commontop.topVm.parentList[commontop.topVm.parentList.length - 1];
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
         * 点击导航栏
         */
        showScore( unitId ) {
            /* 首先切换组件到company */
            this.$emit( "childupdatecompanyevent", unitId );
            /* 将部门数据告诉其他组件,发送一个广播。 */
            company.companyVm.$root.eventHub.$emit('clicknav', unitId);
        }
    },

    template: `
                    
                <!-- 头部区域 -->
                <el-row type="flex" align="middle" class="row-bg" justify="space-between">
                    <el-col :span="9">
                       <el-breadcrumb separator="/">
                         <el-breadcrumb-item v-for = "parent in parentList" :key="parent.oid"><a href="#" v-on:click="showScore( parent.oid )">{{ parent.unitName }}</a></el-breadcrumb-item>
                       </el-breadcrumb>
                    </el-col>
                    <el-col :span="8">
                         <el-button>前一天</el-button>
                         <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
                         <el-button>后一天</el-button>
                         <el-button>统计图</el-button>
                         <el-button>导出</el-button>
                    </el-col>
                </el-row>
			`

})

