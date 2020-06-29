/* 底部组件 */
var messagebottom = Vue.component('message-bottom', {
    data: function () {
        return {
            bottomVm: ''

        }
    },
    created: function() {

    },
    mounted: function() {
        messagebottom.bottomVm = this;

    },

    methods: {
    },

    template: `
            <section>
                <el-row type="flex" class="row-bg">
                  <el-col :span="12"><div>注: 综合评分计算说明：</div></el-col>
                </el-row>
               
               <el-row type="flex" class="row-bg">
                  <el-col :span="12"><div>1、分公司各站平均分数，得分四舍五入保留整数；</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                  <el-col :span="12"><div>2、红色警告：巡检完成率低于80%，需重点监察；</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                  <el-col :span="12"><div>3、蓝色警告：巡检完成率低于90%，需加强管理；</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                  <el-col :span="12"><div>4、管道线路巡检计划覆盖率=（制定巡检计划的管道里程/管道总里程）×100%；低于100%以红色展示；</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                  <el-col :span="12"><div>5、管道线路巡检任务覆盖率=（落实巡检任务的管道里程/管道总里程）×100%；低于100%以红色展示；</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                  <el-col :span="12"><div>6、管道线路巡检完成率=各分公司所辖站队总成绩/各分公司所辖巡检站队总数；</div></el-col>
                </el-row>
           </section>
			`

})

