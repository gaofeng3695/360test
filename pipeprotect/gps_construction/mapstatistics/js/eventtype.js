
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
var month=getParamter("month")//月份
var unitname=decodeURI(getParamter("unitname"));
var jasMapApi;
var frm2d;
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	doEventtype();
});


/**
 * 巡检事件类型图
 * @returns
 */
function doEventtype(){
	$.ajax({
		url : rootPath+"/gpseventstatistics/getEventtypeCount.do",
		data :{"unitid" : unitid, "year" : year,"month" : month},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				if(data.data == null || data.data.length == 0){
					$('#eventtype').html('无数据...');
					return;
				}
				var eventtype = echarts.init(document.getElementById('eventtype'),'macarons');
				option = {
					//backgroundColor:'#ffffff',
				    title : {
				        text:unitname+'事件类型分析图',
				        textStyle:{
				        	fontSize : 17
				        },
				        x:'center',
				        subtextStyle:{
				        	fontSize : 15
				        }
				    },
				    tooltip : {
				    	 trigger: 'item',
					     ormatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        data:data.data.rsname,
				        orient:'vertical',
				        x:'75%',
				        y:'center'
				    },
				    toolbox: {
				        show : true,
				        x:'800',
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
				            name:'发生事件个数',
				            type:'pie',
				            radius : '60%',
				            center: ['40%', '50%'],
				            data:data.data.rsdata
				        }
				    ]
				};
				window.addEventListener("resize", function () {
					eventtype.resize();
			    });
				eventtype.setOption(option, true);
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
    $("#happendateChart").outerHeight(win_height-15);
    $("#happendateChart").outerWidth(win_width-20);
}
