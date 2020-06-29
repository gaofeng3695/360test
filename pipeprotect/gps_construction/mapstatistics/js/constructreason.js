
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
var year=getParamter("year");	// 年份
var riskrating=getParamter("riskrating");	// 风险等级
var month=getParamter("month")//月份
var unitname=decodeURI(getParamter("unitname"));
var jasMapApi;
var frm2d;

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	doConstructreason();
});


/**
 * 第三方施工原因分析图
 * @returns
 */
function doConstructreason(){
	$.ajax({
		url : rootPath+"/gpsConstructionStatistics/getConstructreasonmap.do",
		data :{"unitid" : unitid,"year":year,"month":month,"riskrating":riskrating},
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
				
				option = {
					title : {
				        text:unitname+year+'年度施工原因分析图',
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
				        x:'70%',
				        y:'center'
				    },
				    toolbox: {
				        show : true,
				        x:'600',
				        feature : {
				            mark : {show: true},
				            magicType : {
				                show: true, 
				                type: ['pie', 'funnel'],
				                option: {
				                    funnel: {
				                        x: '15%',
				                        width: '65%',
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
				            radius : '60%',
				            center: ['40%', '50%'],
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
