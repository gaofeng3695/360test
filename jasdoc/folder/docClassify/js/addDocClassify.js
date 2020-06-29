
$(function(){
	var parentid=getParamter("parentid");
	$("#parentid").val(parentid);
});

function save() {
	var parentId=$("#parentid").val();
	$('#addClassifyFrom').form('submit', {
		url : "../classify/createDocClassify.do?token="+localStorage.getItem("token"),
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(data) {
			var result = eval('(' + data + ')');
			if (result.success=="1") {
				//刷新父页面，参数：返回值，操作类型（1：新增，2：修改）
				parent.reloadDataTree(parentId,'add');
				closeFolder();
			} else {
				top.showAlert('提示',result.message , 'info');	
			}
		}
	});
}
/**
 * 方法描述： 关闭界面
 */	
function closeFolder(){
	parent.closeDlg("addDocClassify");
}