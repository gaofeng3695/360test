
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

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
    query();
    $('#year').val(nowDate);
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

function query(){
	doThreeColors();
	// doConstructreason();
	doThreeColorsPie();
	doThreeColorsPieRuntime();
	doConstructhappendate();
}

/**
 * 三色预警图
 * @returns
 */
function doThreeColors(){
	$.ajax({
		url : rootPath+"/gpsConstructionStatistics/getThreeColor.do",
		data :{"year" : $('#year').val()},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				if(data.data == null || data.data.length == 0){
					$('#threecolors').html('无数据...');
					return;
				}
				var threecolors = echarts.init(document.getElementById('threecolors'),'macarons');
				var year = new Date().getFullYear();
				if($('#year').val()){
					year = $('#year').val();
				}
				var option = {
					backgroundColor:'rgba(0,0,0,0)',
				    title : {
						top:10,
				        text: year+'年度第三方施工柱状图',
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
				    color:['red','orange','blue'],
				    legend: {
				        data:['红色预警','黄色预警','蓝色预警'],
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
				            name:'红色预警',
				            type:'bar',
				            data:data.data.red,
							itemStyle: {        //上方显示数值
								normal: {
									label: {
										show: true, //开启显示
										position: 'top', //在上方显示
										textStyle: { //数值样式
											color: 'black',
											fontSize: 10
										}
									}
								}
							}
				        },
				        {
				            name:'黄色预警',
				            type:'bar',
				            data:data.data.yellow,
							itemStyle: {        //上方显示数值
								normal: {
									label: {
										show: true, //开启显示
										position: 'top', //在上方显示
										textStyle: { //数值样式
											color: 'black',
											fontSize: 10
										}
									}
								}
							}
				        },
				        {
				            name:'蓝色预警',
				            type:'bar',
				            data:data.data.blue,
							itemStyle: {        //上方显示数值
								normal: {
									label: {
										show: true, //开启显示
										position: 'top', //在上方显示
										textStyle: { //数值样式
											color: 'black',
											fontSize: 10
										}
									}
								}
							}
				        }
				    ]
				};
				window.addEventListener("resize", function () {
					threecolors.resize();
			    });
				threecolors.setOption(option, true);
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
 * 第三方施工原因分析图
 * @returns
 */
function doConstructreason(){
	$.ajax({
		url : rootPath+"/gpsConstructionStatistics/getConstructreason.do",
		data :{"year" : $('#year').val()},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				if(data.data.rsdata == null || data.data.rsdata == 0){
					$('#constructreason').html('无数据...');
					return;
				}
				var constructreason = echarts.init(document.getElementById('constructreason'),'macarons');
				var year = new Date().getFullYear();
				if($('#year').val()){
					year = $('#year').val();
				}
				option = {
					title : {
						top:10,
				        text: year+'年度施工原因分析图',
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
				            name:'第三方施工原因',
				            type:'pie',
				            radius : '45%',
				            center: ['40%', '60%'],
				            data:data.data.rsdata,
							itemStyle:{
								normal:{
									label:{
										show: true,
										formatter: '{b} : {c} ({d}%)',
										textStyle: {
											color:'black',
											fontSize: 10
										}
									},
									labelLine :{show:true}
								}
							}
				        }
				    ]
				};
				window.addEventListener("resize", function () {
					constructreason.resize();
			    });
				constructreason.setOption(option, true);
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
 * 第三方施工发生时间统计图
 * @returns
 */
function doConstructhappendate(){
	$.ajax({
		url : rootPath+"/gpsConstructionStatistics/getConstructhappendate.do",
		data :{"year" : $('#year').val()},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				if(data.data.rsdata == null || data.data.rsdata == 0){
					$('#constructhappendate').html('无数据...');
					return;
				}
				var constructhappendate = echarts.init(document.getElementById('constructhappendate'),'macarons');
				var year = new Date().getFullYear();
				if($('#year').val()){
					year = $('#year').val();
				}
				option = {
					title : {
						top:10,
				        text: year+'年度第三方施工月度占比图',
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
				            name:'第三方施工发生时间',
				            type:'pie',
				            radius : '45%',
				            center: ['40%', '60%'],
				            data:data.data.rsdata,
							itemStyle:{
								normal:{
									label:{
										show: true,
										formatter: '{b} : {c} ({d}%)',
										textStyle: {
											color:'black',
											fontSize: 10
										}
									},
									labelLine :{show:true}
								}
							}
				        }
				    ]
				};
				window.addEventListener("resize", function () {
					constructhappendate.resize();
			    });
				constructhappendate.setOption(option, true);
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



/**
 * 三色预警图
 * @returns
 */
function doThreeColorsPie(){
	$.ajax({
		url : rootPath+"/gpsConstructionStatistics/getConstructhappendatePie.do",
		data :{"year" : $('#year').val()},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				if(data.data.rsdata == null || data.data.rsdata == 0){
					$('#constructreason').html('<div style="text-align: center;">无数据...<div>');
					return;
				}
				var constructreason = echarts.init(document.getElementById('constructreason'),'macarons');
				var year = new Date().getFullYear();
				if($('#year').val()){
					year = $('#year').val();
				}
				option = {
					title : {
						top:10,
						text: year+'年度所有第三方施工三色分布图',
						textStyle:{
							fontSize : 17
						},
//				        subtext: year+'年度',
						x:'center',
						subtextStyle:{
							fontSize : 15
						}
					},
					color:['red','blue','orange'],
					tooltip : {
						trigger: 'item',
						formatter: "第三方施工预警 <br/>{b} : {c} ({d}%)"
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
							name:'第三方施工发生时间',
							type:'pie',
							radius : '45%',
							center: ['40%', '60%'],
							data:data.data.rsdata,
							itemStyle:{
								normal:{
									label:{
										show: true,
										formatter: '{b} : {c} ({d}%)',
										textStyle: {
											color:'black',
											fontSize: 10
										}
									},
									labelLine :{
										show:true,
									}
								}
							}
						}
					]
				};
				window.addEventListener("resize", function () {
					constructreason.resize();
				});
				constructreason.setOption(option, true);
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
 * 三色预警图(只统计运行中的第三方施工，关闭的第三方施工不统计。) 参考禅道BUG 12711 ，反复确认过，修改前请仔细阅读禅道需求。
 * @returns
 */
function doThreeColorsPieRuntime(){
	$.ajax({
		url : rootPath+"/gpsConstructionStatistics/getConstructRuntimePie.do",
		data :{"year" : $('#year').val()},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				if(data.data.rsdata == null || data.data.rsdata == 0){
					$('#construct-runtime').html('<div style="text-align: center;">无数据...<div>');
					return;
				}
				var constructRuntime = echarts.init(document.getElementById('construct-runtime'),'macarons');
				var year = new Date().getFullYear();
				if($('#year').val()){
					year = $('#year').val();
				}
				option = {
					title : {
						top:10,
						text: year+'年度未关闭第三方施工三色分布图',
						textStyle:{
							fontSize : 17
						},
//				        subtext: year+'年度',
						x:'center',
						subtextStyle:{
							fontSize : 15
						}
					},
					color:['red','blue','orange'],
					tooltip : {
						trigger: 'item',
						formatter: "第三方施工预警 <br/>{b} : {c} ({d}%)"
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
							name:'第三方施工发生时间',
							type:'pie',
							radius : '45%',
							center: ['40%', '60%'],
							data:data.data.rsdata,
							itemStyle:{
								normal:{
									label:{
										show: true,
										formatter: '{b} : {c} ({d}%)',
										textStyle: {
											color:'black',
											fontSize: 10
										}
									},
									labelLine :{show:true}
								}
							}
						}
					]
				};
				window.addEventListener("resize", function () {
					constructRuntime.resize();
				});
				constructRuntime.setOption(option, true);
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});

}