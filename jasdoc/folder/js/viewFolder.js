$(function() {
	$("#dlg").panel("open");
	var folderId=getParamter("folderId");
	viewFolderById(folderId);
});
function closeFolder() {
	top.closeDlg('viewFolder');
}

/**
 * 方法描述：加载数据
 */
function viewFolderById(folderId){
	$.ajax({
		type: "POST",
	   	url: rootPath+'jasdoc/folder/folder/viewFolderById.do',
   		data: {
   			    "folderId":folderId
   			  },
	   	success: function(data){
     		if(data!=null){
     			$("#foldername").html(data.foldername);
     			$("#folderlocation").html(data.folderlocation);
     			$("#createuser").html(data.createuser);
     			$("#createtime").html(data.createtime);
     			$("#updateuser").html(data.updateuser);
     			$("#updatetime").html(data.updatetime);
     			$("#description").html(data.description);
     		}
		},
	   	dataType:"json"
	});
}
