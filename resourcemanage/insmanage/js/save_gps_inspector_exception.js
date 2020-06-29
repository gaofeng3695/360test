
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
/* 获取所有需要例外巡检的巡线工*/
var idArray=getParamter("idArray");
var idList = [];

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	var now = getNowDate();
	/* 例外的最大日期应该是昨天。 */
	$('#beginDate').unbind("click");
	$('#beginDate').bind("click",function(){
		WdatePicker({
			readOnly:true,
			dateFmt:'yyyy-MM-dd ',
			maxDate:now
		});
	});

	var temp = idArray.split(",");
	for( var i = 0 ; i < temp.length ; i++ ) {
		idList.push(temp[i]);
	}
});

/**
 * 人员例外巡检
 */
function exception() {
	if(!isNull(idArray)){
		$.messager.confirm('例外巡检', '确定人员例外巡检吗？\n\t',function(r){
			if (r){
				saveGpsInspectorException();
			}
		});
	}
}

/*
 * @desc 添加数据-保存
 */
function saveGpsInspectorException(){
	disableButtion("saveButton");
	$('.local-notice').css('display','block');
	var bool=$("#gpsInspectorExceptionForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpsinspector/exception/saveException.do?date="+$('#beginDate').val()+"&reason="+$('#reason').val()+"&remarks="+$('#remarks').val(),
		type: "post",
		async: true,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify({"idList" : idList}),
		success: function(data){
			$("#icon").removeClass("fa fa-circle-o-notch fa-spin");
			if(data.status==1){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("query_gps_inspector.html","#gpsInspectordatagrid");
					closePanel();
				});
			}else if(data.code == "400") {
				top.showAlert("提示", data.msg, 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
}

/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("saveGpsInspectorException");
}

/**
 * @desc 重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}

function getNowDate(){
	var today=new Date();
	var t=today.getTime()-1000*60*60*24;
	var yesterday=new Date(t);
	return yesterday.format("yyyy-MM-dd");
}