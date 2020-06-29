
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
var topsixIdcards = getQueryVariable("topsixIdcards");
/**
 * @desc 页面初始化
 */
$(document).ready(function() {
	$('#precipitationDetails').datagrid({
		idField: 'oid',
		url: rootPath + "precipitationdetails/getFourHoursPrecipitationDetail.do?topsixIdcards=" + topsixIdcards,
		collapsible: true,
		autoRowHeight: false,
		remoteSort: true,
		rownumbers:false,
		pagination:false,
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
				width: "100",
				resizable: true,
				align: 'center',
				formatter: function(value,row,index){
					var opt = value.substring(value.length-9,value.length);
					return opt;
				}
			},
			{
				field: "hourlyTemperature",
				title: "平均气温(℃)",
				width: "100",
				resizable: true,
				align: 'center'
			},
			{
				field: "hourlyPrecipitation",
				title: "降水量(毫米)",
				width: "100",
				resizable: true,
				align: 'center'
			},
			{
				field: "precipitationIntensity",
				title: "强度",
				width: "100",
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