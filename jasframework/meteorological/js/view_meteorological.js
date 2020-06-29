
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
/**
 * @desc 页面初始化
 */
$(document).ready(function() {
	$('#meteorologicalDetails').datagrid({
		idField: 'oid',
		url: rootPath + "meteorologicalinformation/getmeteorologicalinformationDetail.do",
		collapsible: true,
		autoRowHeight: true,
		remoteSort: true,
		rownumbers:false,
		pagination:true,
		fitColumns:true,
		frozenColumns: [[
			{
				field: "siteCity",
				title: "县市",
				width: "160",
				resizable: true,
				align: 'center'
			},
			{
				field: "dataTime",
				title: "时间",
				width: "160",
				resizable: true,
				align: 'center',
				// formatter: function(value,row,index){
				// 	var opt = value.substring(value.length-9,value.length);
				// 	return opt;
				// }
			},
			{
				field: "weatherCondition",
				title: "天气情况",
				width: "100",
				resizable: true,
				align: 'center'
			},
			{
				field: "temperatureSituation",
				title: "温度情况",
				width: "160",
				resizable: true,
				align: 'center'
			}
		]]
	});
})

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}

//页面自适应
initDatagrigHeight('precipitationDetails','queryDiv','100');