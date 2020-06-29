	
var folderId = getParamter("folderId");
$(function(){
	$('#id').val(folderId);
	getFolderById(folderId);
});

 
function save(){
	$('#updateFolderfrom').form('submit', {
		url : "../favorite/updateFavoriteFolder.do?token="+localStorage.getItem("token"),
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(data) {
			var result = eval('(' + data + ')');
			if (result.success=="1") {
				top.showAlert('提示',result.message, 'info',function(){
					parent.reloadDataTree(null,2);
					closeFolder();
				});	
			}else{
				top.showAlert('提示',result.message, 'info');
			}
			
		}
  });
}

/**
 * 方法描述：根据文件夹ID查询文件夹信息
 * @param folderId
 */
function getFolderById(folderId){
	$.ajax({
		url:"../favorite/getFavoriteFolderById.do?folderId="+folderId,
		type:"POST",
		success:function(result){
			if(result!=null){
				result=eval('(' + result + ')');
				$("#foldername").val(result.foldername);
				$("#description").val(result.description);
				$("#parentid").val(result.parentid);
			}
		}
	});
}
	
/**
 * 方法描述： 关闭界面
 */	
function closeFolder(){
	parent.closeDlg('updateFolder');
}