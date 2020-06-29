var _public = '/xnpatrol/statisticsform/projectionscreen/';
var getUnit = "/xnpatrol//xncommon/getUnitChildren.do";

var urls = {
	coverstatistics: "coverstatistics.do", //任务覆盖率-计划覆盖率
	getlengthcount: "getlengthcount.do", //部门巡检-长度
	getInspectorCountByUnitid: "getInspectorCountByUnitid.do", //统计部门人数
	getTaskStatisticsByUnitid: "getTaskStatisticsByUnitid.do", //统计任务完成情况
	getdevicestatistics: "getdevicestatistics.do", //部门设备统计
	getinspectordevicestatistics: "getinspectordevicestatistics.do", //部门巡线工设备总数
	scoredistribution: "scoredistribution.do", //部门巡线工分数分布
	weektotalscore: "weektotalscore.do", //巡线工本周总分前五
	pipeprojection: "pipeprojection.do", //管道保护
	getStationScore: "getStationScore.do", //部门周巡检成绩
	getTaskCompletion: "getTaskCompletion.do", //巡线工巡检情况
	toCloseConstruction: "toCloseConstruction.do", //
	todayInsertConstruction: "todayInsertConstruction.do", //
	todayUpdateConstruction: "todayUpdateConstruction.do", //
	todayCloseConstruction: "todayCloseConstruction.do", //
	toCloseEvent: "toCloseEvent.do", //
	todayInsertEvent: "todayInsertEvent.do", //
};

function format(fmt,date) {
	var o = {
		"M+": date.getMonth() + 1, //月份 
		"d+": date.getDate(), //日 
		"h+": date.getHours(), //小时 
		"m+": date.getMinutes(), //分 
		"s+": date.getSeconds(), //秒 
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
		"S": date.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

function saveTwo(value) { //四舍五入取两位小数
	var val = parseFloat(Number(value).toFixed(2));
	return val;
}
