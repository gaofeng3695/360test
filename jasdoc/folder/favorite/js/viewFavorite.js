$(function() {
	$("#dlg").panel("open");
	var folderId=getParamter("folderId");
	viewFolderById(folderId);
});
function closeFavorite() {
	parent.closeDlg('viewFavorite');
}

/**
 * 方法描述：加载数据
 */
function viewFolderById(folderId){
	$.ajax({
		type: "POST",
	   	url: rootPath+'jasdoc/folder/favorite/getFavoriteFolderById.do',
   		data: {
   			    "folderId":folderId
   			  },
	   	success: function(data){
     		if(data!=null){
     			$("#foldername").html(data.foldername);
     			$("#folderlocation").html(data.folderlocation);
     			$("#createtime").html(data.createtime);
     			$("#updatetime").html(data.updatetime);
     			$("#description").html(data.description);
     		}
		},
	   	dataType:"json"
	});
}
