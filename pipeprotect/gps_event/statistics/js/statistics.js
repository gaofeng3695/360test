
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
var nowDate = getNowDate();
var nowYears = getNowYears();
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	
	
	/*var containerHeight = $(window).height();
	var containerWidth = $(window).width();
	$(window).resize(function() { 
		$('#threecolors').width(containerWidth);
		$('#threecolors').height(containerHeight-50);
	});*/
	//页面自适应
//	initDatagrigHeight('statisticstable','queryDiv','100');
	
	/*setTimeout(function(){
		calculateHeight();
	},2000);
    $(window).on('resize', function () {
        calculateHeight();
    });*/
	
//	dohappendateChart();
//	doeventtypeChart();
	query();
	queryYears();
	$('#year').val(nowDate);
	$('#ymend').val(nowYears);
});

/**
 * 获取当前年份
 * @returns
 */
function getNowDate(){
    var today=new Date();
    var t=today.getTime()-1000*60*60*24;
    var yesterday=new Date(t);
    return yesterday.format("yyyy");
}

/**
 * 获取当前年月
 * @returns
 */
function getNowYears(){
    var today=new Date();
    var t=today.getTime()-1000*60*60*24;
    var yesterday=new Date(t);
    return yesterday.format("yyyy-MM");
}

function query(){
	dohappendateChart();
}

function queryYears(){
	doeventtypeChart();
}

function eventtypepicked(){
	var ymbegin = $('#ymbegin').val();
	var ymend = $('#ymend').val();
	
	if(ymbegin && ymend){
		if(ymbegin > ymend){
			top.showAlert("提示","起始年月不能大于截止年月！",'info');
		}else{
			doeventtypeChart(ymbegin, ymend);
		}
	}
}

/**
 * 事件类型分析
 * @returns
 */
function doeventtypeChart(ymbegin, ymend){
	$.ajax({
		url : rootPath+"/gpseventstatistics/getEventtypeChart.do",
		data :{"ymbegin" : $('#ymbegin').val(), "ymend" : $('#ymend').val()},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				if(data.data == null || data.data.length == 0){
					$('#eventtypeChart').html('无数据...');
					return;
				}
				var eventtypeChart = echarts.init(document.getElementById('eventtypeChart'),'macarons');
				var option = {
					backgroundColor:'rgba(0,0,0,0)',
				    title : {
				        text: '事件类型分析图',
				        textStyle:{
				        	fontSize : 17
				        },
//				        subtext: year+'年度',
				        x:'center',
				        subtextStyle:{
				        	fontSize : 15
				        }
				    },
				    tooltip : {
				        trigger: 'axis'
				    },
				    /*color:['red','yellow','blue'],*/
				    legend: {
//				        data:['红色预警'],
				        orient:'vertical',
				        x:'91%',
				        y:'center'
				    },
				    toolbox: {
				        show : true,
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
				            data : data.data.rsname
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
				            name:'发生事件个数',
				            type:'bar',
				            barWidth:40,
				            data:data.data.rsdata,
				            itemStyle: {
								normal: {
									label: {
										show: true, //开启显示
										position: 'top', //在上方显示
										textStyle: { //数值样式
											color: 'black',
											fontSize: 16
										}
									}
								}
							},
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
 * 事件发生时间分析
 * @returns
 */
function dohappendateChart(){
	$.ajax({
		url : rootPath+"/gpseventstatistics/getHappendateChart.do",
		data :{"year" : $('#year').val()},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				if(data.data.rsdata == null || data.data.rsdata == 0){
					$('#happendateChart').html('无数据...');
					return;
				}
				var happendateChart = echarts.init(document.getElementById('happendateChart'),'macarons');
				var year = new Date().getFullYear();
				if($('#year').val()){
					year = $('#year').val();
				}
				option = {
						backgroundColor:'rgba(0,0,0,0)',
					    title : {
					        text: year+'年度事件发生时间分析图',
					        textStyle:{
					        	fontSize : 17
					        },
//					        subtext: year+'年度',
					        x:'center',
					        subtextStyle:{
					        	fontSize : 15
					        }
					    },
					    tooltip : {
					        trigger: 'axis'
					    },
					    /*color:['red','yellow','blue'],*/
					    legend: {
//					        data:['红色预警'],
					        orient:'vertical',
					        x:'91%',
					        y:'center'
					    },
					    toolbox: {
					        show : true,
					        feature : {
//					            mark : {show: true},
//					            magicType : {show: true, type: ['line', 'bar']},
//					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    calculable : true,
					    xAxis : [
					        {
					            type : 'category',
					            data : data.data.rsname
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
					            name:'发生事件个数',
					            type:'bar',
					            barWidth:40,
					            data:data.data.rsdata,
					            itemStyle: {
									normal: {
										label: {
											show: true, //开启显示
											position: 'top', //在上方显示
											textStyle: { //数值样式
												color: 'black',
												fontSize: 16
											}
										}
									}
								},
					        }
					    ]
					
					/*title : {
				        text: year+'年度事件发生时间分析图',
				        textStyle:{
				        	fontSize : 17
				        },
//				        subtext: year+'年度',
				        x:'center',
				        subtextStyle:{
				        	fontSize : 15
				        }
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				    	data:data.data.rsname,
				        orient:'vertical',
				        x:'75%',
				        y:'center'
				    },
				    toolbox: {
				        show : true,
				        x:'right',
				        feature : {
				            mark : {show: true},
				            magicType : {
				                show: true, 
				                type: ['pie', 'funnel'],
				                option: {
				                    funnel: {
				                        x: '25%',
				                        width: '50%',
				                        funnelAlign: 'left',
				                        max: 1548
				                    }
				                }
				            },
//				            restore : {show: true},
				            saveAsImage : {show: true}
				        }
				    },
				    calculable : true,
				    series : [
				        {
				            name:'发生事件个数占比',
				            type:'pie',
				            radius : '55%',
				            center: ['35%', '60%'],
				            data:data.data.rsdata
				        }
				    ]
				*/};
				window.addEventListener("resize", function () {
					happendateChart.resize();
			    });
				happendateChart.setOption(option, true);
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
//    var query_height = $("#queryBox").outerHeight();
    if (win_height > 2000) {
        win_height = 500;
    }
    $('#statisticstable').height(win_height-100);
//    $("#threecolors").outerHeight(win_height - query_height - 10);
    $("#threecolors").outerHeight(win_height - 50);
    // 巡检轮次花时统计
//    $("#turnTime").outerHeight(win_height - query_height - 10);
    // 巡检班组统计
//    $("#countEcharts").outerHeight(win_height - query_height - 10);
}

function clearQueryForm(){
	$('#year').val('');
}

function clearQuery(){
	$('#ymend').val('');
	$('#ymbegin').val('');
}
