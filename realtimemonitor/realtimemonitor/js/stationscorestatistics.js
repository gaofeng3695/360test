
/**
 * @file
 * @author 作者
 * @desc 统计周成绩
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
/* 获取部门ID */
var unitid=getParamter("unitid");

/* 人员ID */
var inspectorid=getParamter("inspectorid");

/* 部门还是人员 */
var type=getParamter("type");

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	doeventtypeChart();
});

/**
 * 事件类型分析
 * @returns
 */
function doeventtypeChart(){
	$.ajax({
		url : rootPath+"/realtimemonitor/realtimemonitor/getStationScore.do",
		data :{"unitid" : unitid, "inspectorid" : inspectorid, "type" : type},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				if(data.data == null || data.data.length == 0){
					$('#eventtypeChart').html('无数据...');
					return;
				}

				var scoreList = [];
				for( var i = 0 ; i < data.data.rsdata.length ; i++ ) {
                    var score = Math.round(data.data.rsdata[i]*10000)/100;
                    scoreList.push(score);
				}

				var eventtypeChart = echarts.init(document.getElementById('eventtypeChart'),'macarons');
				var option = {
					backgroundColor:'rgba(0,0,0,0)',
					grid: {
				        left: '4%',   //距离左边的距离
				        right: '3%', //距离右边的距离
				        bottom: '12%',//距离下边的距离
				        top: '6%' //距离上边的距离
			        },
				    tooltip : {
				        trigger: 'axis'
				    },
				    /*color:['red','yellow','blue'],*/
				    /*legend: {
//				        data:['红色预警'],
				        orient:'vertical',
				        x:'91%',
				        y:'center'
				    },*/
				    toolbox: {
				        show : false,
				        feature : {
//				            mark : {show: true},
//				            magicType : {show: true, type: ['line', 'bar']},
//				            restore : {show: true},
				            saveAsImage : {show: true}
				        }
				    },
				    calculable : true,
				    xAxis : [
				        {
				            type : 'category',
				            data : data.data.rsname,
				            axisLabel: {
//			                    interval: 0,
//			                    rotate: 20,
			                }
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            splitNumber:1
				        }
				    ],
				    series : [
				        {
				            name:'分数',
				            type:'line',
				            barWidth:40,
				            data: scoreList,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true, 			//开启显示
                                        position: 'top', 		//在上方显示
                                        textStyle: { 			//数值样式
                                            color: 'black',
                                            fontSize: 16
                                        }
                                    }
                                }
                            }
				        }
				    ]
				};
				window.addEventListener("resize", function () {
					eventtypeChart.resize();
			    });
				eventtypeChart.setOption(option, true);
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
 * @desc 计算tab-content的高度
 *
 */
function calculateHeight() {
    //获取当前窗口的高度
    var win_height = $(window).height();
    //获取当前窗口的高度
    if (win_height > 2000) {
        win_height = 500;
    }
    $('#statisticstable').height(win_height-100);
    $("#threecolors").outerHeight(win_height - 50);

}
