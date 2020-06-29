
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
	dohappendateChart();
}


/**
 * 事件发生时间分析
 * @returns
 */
function dohappendateChart(){
	$.ajax({
		url : rootPath+"/gpseventstatistics/getHappendateChart.do",
		data :{"year" : year,"unitid":unitid},
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
				
				var option = { 
						backgroundColor:'#ffffff',
						title : {
					        text: unitname+year+'年度巡检事件发生时间统计图',
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
					    	trigger: 'axis',
					    },
					    color:['#FFB5C5'],
					   
					    toolbox: {
					    	 show : true,
					    	 x:'800',
						     feature : {
//						            mark : {show: true},
//						            magicType : {show: true, type: ['line', 'bar']},
//						            restore : {show: true},
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
					            name:'巡检事件发生数量',
					            type:'bar',
					            data:data.data.rsdata
					        }
					    ]
					};
					window.addEventListener("resize", function () {
						happendateChart.resize();
				    });
					happendateChart.setOption(option, true);
					
					
					happendateChart.on('click', function (params) {
						var month = params.name.substring(0,params.name.indexOf('月'));
						//打开巡检事件事件类型统计图
						parent.showDialog2('eventtype','事件类型统计图（'+year+"-"+params.name+"）", rootPath + 'pipeprotect/gps_construction/mapstatistics/eventtype.html?unitid='+unitid+"&year="+year+"&month="+month+"&unitname="+encodeURI(unitname), 800, 500,true,'event');
						
					});
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
    $('#happendateChart').height(win_height-15);

    $("#happendateChart").outerHeight(win_height - 20);
 
}
