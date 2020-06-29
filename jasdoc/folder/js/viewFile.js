$(function() {
	$("#dlg").panel("open");
	loadData();
});
function closeRole() {
	parent.closeDlg('viewfile');
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
	var param = this.location.search;
	if (param != null && "" != param) {
		var p = param.substr(1).split("&");
		$.each(p,function(i,item){
			var d = item.split("=");
			 if(d[0]=='eventid'){
				id1=d[1];
			}else if(d[0]=='versionid'){
				versionid=d[1];
			}
			
		});
	}
	
	if (id1 != null && "" != param) {
		$.ajax({
			type: "POST",
		   	url: "../doccenter/getDocBySid.do?random=" + new Date().getTime(),
	   		data: {"eventid":id1},
		   	success: function(jso){
		   		var result = eval('(' + jso + ')');
				putValue(result);
		   	},
		   	error:function(){
		   		$.messager.alert('错误','加载信息失败','error');
		   	}
	   	});
		
	}else if(versionid != null && "" != param){
		$.ajax({
			type: "POST",
		   	url: "../doccenter/getDocByVersionid.do?random=" + new Date().getTime(),
	   		data: {"versionid":versionid},
		   	success: function(jso){
		   		var result = eval('(' + jso + ')');
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
	if(obj.filename!=null){
		$("#filename").text(obj.filename);
	}
	if(obj.fileno!=null){
		$("#fileno").text(obj.fileno);
	}
	if(obj.filetype!=null){
		$("#filetype").text(obj.filetype);
	}
	if(obj.docactualLocation!=null){
		$("#filelocation").text(obj.docactualLocation);
	}
	if(obj.filesizeStr!=null){
		$("#filesizeStr").text(obj.filesizeStr);
	}
	if(obj.author!=null){
		$("#author").text(obj.author);
	}
	if(obj.createtime!=null){
		$("#createtime").text(obj.createtime);
	}
	if(obj.updatetime!=null){
		$("#updatetime").text(obj.updatetime);
	}
	if(obj.uploadtime!=null){
		$("#uploadtime").text(obj.uploadtime);
	}
	if(obj.fileclassifyname!=null){
		$("#fileclassifyname").text(obj.fileclassifyname);
	}
	if(obj.createusername!=null){
		$("#createusername").text(obj.createusername);
	}
	if(obj.keyword!=null){
		$("#keyword").text(obj.keyword);
	}
	if(obj.summary!=null){
		$("#summary").text(obj.summary);
	}
	if(obj.remark!=null){
		$("#remark").text(obj.remark);
	}
	
}
