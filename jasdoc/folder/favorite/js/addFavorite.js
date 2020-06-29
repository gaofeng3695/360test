	/**
	 * 修改与新增
	 * 
	 */


$(function(){
	var parentid=getParamter("parentid");
	$("#parentid").val(parentid);
});

function save() {
	$('#addFavoriteFrom').form('submit', {
		url : "../favorite/createFavoriteFolder.do?token="+localStorage.getItem("token"),
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(data) {
			var result = eval('(' + data + ')');
			if (result.success=="1") {
				//刷新父页面，参数：返回值，操作类型（1：新增，2：修改）
				parent.reloadDataTree(result.data,1);
				closeFavorite();
			} else {
				top.showAlert('提示',result.message , 'info');	
			}
		}
	});
}
/**
 * 方法描述： 关闭界面
 */	
function closeFavorite(){
	parent.closeDlg('addFavorite');
}	