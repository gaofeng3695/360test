	
var folderId = getParamter("folderId");
$(function(){
	$('#eventid').val(folderId);
	getFolderById(folderId);
});

var parentid="";
var foldertype="";
 
function save(){
	var foldername = $('#foldername').val();
	var folderId = $("#id").val();
//	if(foldername!=oldFoldername){
		$.ajax({
		    url : "../folder/isExistUpdatefolder.do",
		    type : 'POST',
		    data:{"newname":foldername,
		    "parentid":parentid,
		    "folderId":folderId,
		    "foldertype":foldertype
		    },
		    async: false,
		    success : function(result){
		    	if(result=="true"){
		    		$('#updateFolderfrom').form('submit', {
		    			url : "../folder/updateFolder.do?r="+new Date().getTime()+"&token="+localStorage.getItem("token"),
		    			onSubmit : function() {
		    				return $(this).form('validate');
		    			},
		    			success : function(data) {
		    				var result = eval('(' + data + ')');
		    				if (result.success==1) {
		    					top.showAlert('提示',result.msg, 'info',function(){
			    					parent.reloadDataTree(null,2);
			    					closeFolder();
			    				});	
		    				}else{
		    					top.showAlert('提示',result.msg, 'info');
		    				}
		    				
		    		}
		    	});
		    	
		    	}else{
		    		top.showAlert('提示', '文件夹名称已存在', 'info');	
		    	}
		    }
		});
//	}else{
//		top.showAlert('提示',"文件夹名没有改变！" , 'info');	
//	}
}

/**
 * 方法描述：根据文件夹ID查询文件夹信息
 * @param folderId
 */
function getFolderById(folderId){
	$.ajax({
		url:"../folder/getFolderBoById.do?folderId="+folderId,
		type:"POST",
		success:function(result){
			if(result!=null){
				result=eval('(' + result + ')');
				$("#foldername").val(result.foldername);
				$("#description").val(result.description);
				$("#hierarchy").val(result.hierarchy);
				$("#description").val(result.description);
				$("#id").val(result.id);
				parentid=result.parentid;
				foldertype=result.foldertype;
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