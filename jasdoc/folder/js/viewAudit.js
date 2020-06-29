var eventid,versionid;
$(function() {
//	$("#dlg").panel("open");
	loadData();
});
/**
 * 预览
 */
function preview(){
	$.ajax({
		url:rootPath+ '/jasdoc/folder/doccenter/isExistPdfFile.do?docId='+eventid,
		dataType:"json",
		success:function(result){
			
			if(result.success==1){
//				var totalPages=result.totalPages;
//				var url = rootPath+ "/jasdoc/folder/preview/FlexPaper_2.0.3/index.html?eventid="+ eventid +"&versionid="+versionid+ "&totalPages=" + totalPages;
				var url = rootPath + "jasdoc/folder/preview/pdfjs_1.10.88/web/viewer.html?eventid="+ eventid +"&versionid="+versionid;
				top.getDlg(url, "viewiframe", "预览", 800, 550, false, true, true);
			}else if(result.success==0){
				parent.showAlert('提示',"正在生成转换文档，可能需要花费一段时间，请稍后重试！" , 'info');	
			}else if(result.success==-1){
				parent.showAlert("提示",result.msg,"info");
			}
		}
	});
	
}
/**
 * 下载
 */
function downloadDoc(){
	$("<iframe id=\"fileDownload\" style=\"display: none;\"></iframe>").appendTo("body");
	var url="../doccenter/downloadDoc.do?docId="+eventid+"&token="+ localStorage.getItem("token");
	$("#fileDownload").attr("src",url);
}

/**
 * 文档审核
 */
function documentAudit(auditstate){
	var url = '../docaudit/documentAudit.do?eventid='+eventid+"&auditstate="+auditstate+"&token="+localStorage.getItem("token");
	$('#viewAuditForm').form('submit', {
	   	url: url,
   		dataType:"json",
	   	success: function(result){
	   		var result = eval('(' + result + ')');
			if (result.success=="1"){
				$.messager.alert("提示", result.message, "info",function(){
					reloadData("documentList.htm","dg");
	   				top.closeDlg('viewAudit');
				});
			} else {
				$.messager.alert('错误',result.message,"error");
			}
		}
	});
}

/**
 * 关闭
 */
function closeAudit() {
	top.closeDlg('viewAudit');
}


function goBack() {
	//window.location.href='myundotask.htm';
	window.history.go(-1);
}


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
				eventid=d[1];
			}else if(d[0]=='versionid'){
				versionid=d[1];
			}
			
		});
	}
	
	if (eventid != null && "" != param) {
		$.ajax({
			type: "POST",
		   	url: "../doccenter/getFileInfoById.do?random=" + new Date().getTime(),
	   		data: {"docId":eventid},
		   	success: function(result){
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
	$("#filelocation").html(obj.docactualLocation);
	$("#filesizeStr").html(obj.filesizeStr);
	$("#author").html(obj.author);
	$("#createtime").html(obj.createtime);
	$("#updatetime").html(obj.updatetime);
	$("#uploadtime").html(obj.uploadtime);
	$("#createusername").html(obj.createusername);
	$("#keyword").html(obj.keyword);
	$("#summary").html(obj.summary);
	$("#remark").html(obj.remark);

}
