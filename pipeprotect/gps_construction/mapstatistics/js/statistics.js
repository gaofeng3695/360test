
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件

var unitid=getParamter("unitid");	// 部门id
var unitname=decodeURI(getParamter("unitname"));

var year = new Date().getFullYear();

var jasMapApi;
var frm2d;

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	let fra = top.$("iframe");
	for ( let i = 0; i < fra.length; i++) {
		if (fra[i].id == 'frm2d') {
			frm2d = fra[i].contentWindow;
			jasMapApi = fra[i].contentWindow.jasMapApi;
			break;
		}
	}
	
    query();
});

function query(){
	if($('#year').val() != null && $('#year').val() !=""){
		year = $('#year').val();
	}
	doThreeColors();
	//locationThreeColors(unitid);
}

/**
 * 三色预警图
 * @returns
 */
function doThreeColors(){
	$.ajax({
		url : rootPath+"/gpsConstructionStatistics/getThreeColor.do",
		data :{"unitid" : unitid,"year":year},
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
				
				var option = {
					backgroundColor:'#ffffff',
				    title : {
				        text:unitname+year+'年度施工预警统计图',
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
				    color:['#f12f2a','#ffcb2d','#4c97f3'],
				    legend: {
				        data:['红色预警','黄色预警','蓝色预警'],
				        orient:'vertical',
				        x:'90%',
				        y:'center',
				        /*selectedMode:'multiple',
				        selected:{
				        	'红色预警':true,
				        	'黄色预警':true,
				        	'蓝色预警':false,
				        }*/
				        /*selectedMode:'single',
				        selected:{
				        	'红色预警':false,
				        	'黄色预警':true,
				        	'蓝色预警':false,
				        }*/
				    },
				    toolbox: {
				        show : true,
				        x:'800',
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
				            data:data.data.red
				        },
				        {
				            name:'黄色预警',
				            type:'bar',
				            data:data.data.yellow
				        },
				        {
				            name:'蓝色预警',
				            type:'bar',
				            data:data.data.blue
				        }
				    ]
				};
				window.addEventListener("resize", function () {
					threecolors.resize();
			    });
				threecolors.setOption(option, true);
				/**
				 * 给图表赋予点击事件
				 */
				threecolors.on('click', function (params) {
					var riskrating;
					var month = params.name.substring(0,params.name.indexOf('月'));
					var visible;
					if(params.seriesName == "红色预警"){
						riskrating="01";
						visible=params.seriesName;
					}else if(params.seriesName == "黄色预警"){
						riskrating="02";
						visible=params.seriesName;
					}else if(params.seriesName == "蓝色预警"){
						riskrating="03";
						visible=params.seriesName;
					}
					//打开施工原因分析图
					parent.showDialog2('constructreason','施工原因分析图（'+params.name+params.seriesName+"）", rootPath + 'pipeprotect/gps_construction/mapstatistics/constructreason.html?unitid='+unitid+"&year="+year+"&month="+month+"&riskrating="+riskrating+"&unitname="+encodeURI(unitname), 800, 500,true,'construction');
					
				});
				/*threecolors.on('legendselectchanged', function (params) {
					alert("选中事件");
				});*/
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
//	calculateHeight();
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
				            radius : '55%',
				            center: ['35%', '50%'],
				            data:data.data.rsdata
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
 * @desc 计算tab-content的高度
 *
 */
function calculateHeight() {
    //获取当前窗口的高度
    var win_height = $(window).height();
    var win_width = $(window).width();
    //获取当前窗口的高度
//    var query_height = $("#queryBox").outerHeight();
    if (win_height > 2000) {
        win_height = 500;
    }
//    $('#statisticstable').height(win_height-50);
    $("#threecolors").outerHeight(win_height-15);
    $("#threecolors").outerWidth(win_width-20);
    // 巡检轮次花时统计
//    $("#turnTime").outerHeight(win_height - query_height - 10);
    // 巡检班组统计
//    $("#countEcharts").outerHeight(win_height - query_height - 10);
}
//图例点击事件
function viewConsrean(name,riskrating) {
	parent.showDialog2('constructreason','施工原因分析图（'+name+"）", rootPath + 'pipeprotect/gps_construction/mapstatistics/constructreason.html?unitid='+unitid+"&year="+year+"&riskrating="+riskrating+"&unitname="+encodeURI(unitname), 800, 500,true,'construction');
}