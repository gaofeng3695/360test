$(function() {
	$("#dlg").panel("open");
	loadData();
});
function closeFile() {
	parent.closeDlg('viewFile');
}
function goBack() {
	//window.location.href='myundotask.htm';
	window.history.go(-1);
}
var hiddens, id1,incidenteventid,versionid;

/**
 * 方法描述：加载数据
 */
function loadData() {
	var eventid = getParamter("eventid");
	var versionid = getParamter("versionid");
	if (eventid != null&&eventid!="") {
		$.ajax({
			type: "POST",
		   	url: rootPath + "jasdoc/folder/doccenter/getFileInfoById.do",
	   		data: {"docId":eventid},
		   	success: function(result){
				putValue(result);
		   	},
		   	error:function(){
		   		$.messager.alert('错误','加载信息失败','error');
		   	}
	   	});
		
	}else if(versionid != null&&versionid!=""){
		$.ajax({
			type: "POST",
		   	url: rootPath + "jasdoc/folder/getDocByVersionid.do",
	   		data: {"versionid":versionid},
		   	success: function(result){
				putValue(result);
		   	},
		   	error:function(){
		   		$.messager.alert('错误','加载信息失败','error');
		   	}
	   	});
	}
}

/**
 * 方法描述：放置数据
 */
function putValue(obj) {
	$("#filename").html(obj.filename);
	$("#fileno").html(obj.fileno);
	$("#filetype").html(obj.filetype);
	$("#filelocation").html(obj.filelocation);
	$("#filesizeStr").html(obj.filesizeStr);
	$("#author").html(obj.author);
	$("#createtime").html(obj.createtime);
	$("#updatetime").html(obj.updatetime);
	$("#uploadtime").html(obj.uploadtime);
	$("#fileclassifyname").html(obj.fileclassifyname);
	$("#createusername").html(obj.createusername);
	$("#keyword").html(obj.keyword);
	$("#summary").html(obj.summary);
	$("#remark").html(obj.remark);
}
