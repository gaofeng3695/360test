var unitid = getParamter("unitid");	// 当前层级部门id
var statisticsdate = getParamter("statisticsdate");//当前列表时间
var nextLevel = getParamter("nextLevel");//是否下一级

//当前登陆用户
var user = JSON.parse(sessionStorage.user);
var unitMonthScoreTitle = user.unitName;
$(function() {
	initData();
	initUnitMonthScore();
	onresize();
	$(window).bind("resize", function () {
		onresize();
     });
})

function onresize(){
	var containerWidth = $(window).width() - 20;
	var containerHeight = $(window).height() - 20;
	$('#topDiv').height(containerHeight / 2);
	$('#buttomDiv').height(containerHeight / 2);
	
	var chartH = containerHeight - 8;
	var chartW = containerWidth - 8;
	$('#thirdChart1').height(chartH / 2);
	$('#thirdChart2').height(chartH / 2);
	$('#thirdChart3').height(chartH / 2);
	$('#thirdChart4').height(chartH / 2);
	
	$('#thirdChart1').width(chartW / 2);
	$('#thirdChart2').width(chartW / 2);
	$('#thirdChart3').width(chartW / 2);
	$('#thirdChart4').width(chartW / 2);
}

/**
 * 初始化巡检完成率、年度考核评分、本月巡线评分
 * @returns
 */
function initData(){
	$.ajax({
		url : rootPath+"/gpsunitscore/getPage.do",
		data :{"unitid" : unitid,statisticsdate:statisticsdate,inspectortype:'01',nextLevel:nextLevel},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				var xData = [];
				//完成率
				var completionrate = [];
				//年度评分
				var yearscore = [];
				//本月评分
				var monthscore = [];
				var rows = data.rows;
				for(var i=0;i<rows.length;i++){
					var obj = rows[i];
					xData.push(obj.unitname.substring(0,4));
					completionrate.push(((obj.completionrate)*100).toFixed(2));
					yearscore.push(((obj.yearscore)*100).toFixed(2));
					monthscore.push(((obj.monthscore)*100).toFixed(2));
				}
				initCompletionrateChart(xData,completionrate);
				initYearscoreChart(xData,yearscore)
				initMonthscoreChart(xData,monthscore)
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}

/**
 * 初始化历史评分曲线
 * @returns
 */
function initUnitMonthScore(){
	$.ajax({
		url : rootPath+"/gpsunitscore/getUnitMonthScore.do",
		data :{"unitid" : user.unitid,statisticsdate:statisticsdate,inspectortype:'01'},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				var xData = [];
				//历史评分
				var monthscore = [];
				var rows = data.rows;
				for(var i=0;i<rows.length;i++){
					var obj = rows[i];
					xData.push(obj.statisticsdate);
					monthscore.push(((obj.assessscore)*100).toFixed(2));
					unitMonthScoreTitle = obj.unitName;
				}
				initUnitMonthScoreChart(xData,monthscore)
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}

/**
 * 初始化巡检完成率图表
 * @param xData
 * @param completionrate
 * @returns
 */
function initCompletionrateChart(xData,completionrate){
	var myChart = echarts.init(document.getElementById('thirdChart1'), 'vintage');
	window.eChartInst_thirdChart1 = myChart;
	option = {
		    color: ['#3398DB'],
    		title: {
		        text: '巡检完成率'
		    },
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : xData,
		            axisTick: {
		                alignWithLabel: true
		            },
		            axisLabel: {
                        interval:0,
                        rotate:-60
		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'完成率',
		            type:'bar',
		            barWidth: '10%',
		            data:completionrate
		        }
		    ]
		};

    myChart.setOption(option);
}

/**
 * 初始化年度评分
 * @param xData
 * @param yearscore
 * @returns
 */
function initYearscoreChart(xData,yearscore){
	var myChart = echarts.init(document.getElementById('thirdChart2'), 'vintage');
	window.eChartInst_thirdChart1 = myChart;
	option = {
		    color: ['#3398DB'],
		    title: {
		        text: '年度考核评分'
		    },
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : xData,
		            axisTick: {
		                alignWithLabel: true
		            },
		            axisLabel: {
                        interval:0,
                        rotate:-60
		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'年度评分',
		            type:'bar',
		            barWidth: '10%',
		            data:yearscore
		        }
		    ]
		};

    myChart.setOption(option);
}

/**
 * 本月巡线评分
 * @param xData
 * @param monthscore
 * @returns
 */
function initMonthscoreChart(xData,monthscore){
	var myChart = echarts.init(document.getElementById('thirdChart3'), 'vintage');
	window.eChartInst_thirdChart1 = myChart;
	option = {
		    color: ['#3398DB'],
		    title: {
		        text: '本月考核评分'
		    },
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : xData,
		            axisLabel: {
                        interval:0,
                        rotate:-60
		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'本月评分',
		            type:'bar',
		            barWidth: '10%',
		            data:monthscore
		        }
		    ]
		};

    myChart.setOption(option);
}

/**
 * 历史曲线
 * @param xData
 * @param monthscore
 * @returns
 */
function initUnitMonthScoreChart(xData,monthscore){
	var myChart = echarts.init(document.getElementById('thirdChart4'), 'vintage');
	window.eChartInst_thirdChart1 = myChart;
	option = {
			title: {
		        text: unitMonthScoreTitle + '—评分历史曲线'
		    },
			tooltip : {
		        trigger: 'axis'
		    },
			xAxis: {
		        type: 'category',
		        data: xData,
	            axisLabel: {
                    interval:0,
                    rotate:-60
	            }
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: [{
		        data: monthscore,
		        type: 'line',
		        name:'评分'
		    }]
		};
    myChart.setOption(option);
}





