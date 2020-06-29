/**
 * 方法描述： 加载左侧角色树形菜单
 */	
var folderId = getParamter("folderId");
$(function(){	
	var roleUrl = "getRoleListByUserId.do?r="+new Date();
	$('#rolePrivilegeEventId').tree({
		url : roleUrl,
		checkbox:false,
		cascadeCheck:false,
		onLoadSuccess:function(node,data) {
			//roledata=data;
		},
		onClick:function(node){
			getPrivilegeByRoleIdAndFolderId(folderId,node.id);
		}
	});	
	viewFolderById(folderId);
});

//选中下面的权限自动选中上面的权限
function clickBox(type){
	if($("#"+type).find(":checkbox").attr('checked')){
		$('#privelegetype div').each(function() {
			if (type >= $(this).attr('id')) {
				$(this).find(":checkbox").attr("checked",true); 
			}
		});
	}else{
		$('#privelegetype div').each(function() {
			if (type <= $(this).attr('id')) {
				$(this).find(":checkbox").attr("checked",false); 
			}
		});
	}
}
	
	
//保存方法
function saveFolderRole(){
	var roleSelect = $('#rolePrivilegeEventId').tree('getSelected');
	if(roleSelect==null){
		$.messager.alert('tip',"请选择角色",'info');
		return;
	}
	var role = "";
	$('#privelegetype div').each(function() {
		if($(this).find(":checkbox").attr("checked")=="checked"){
			if (role <= $(this).attr('id')) {
				role = $(this).attr('id');
			}
		}
		});
	$("#role").val(role);
	if(role==""){
		$.messager.alert('tip',"请选择权限类型",'info');
		return;
	}
	var folderRoleValuesStr = "[{ folderId : '"+folderId+"',roleValue : "+role+"}]";
	$.ajax({
		type: "POST",
	   	url: 'saveRolePrivilege.do',
   		data: {
   			    "rolePrivilegeEventIds":roleSelect.id,
   			 	"saveType":1,
   			    "folderRoleValuesStr":folderRoleValuesStr
   			  },
	   	success: function(check){
     		if (check.error=='-1'){
				$.messager.alert('错误',check.msg,'error');
				
			} else{
				$.messager.alert('提示',check.ok,'ok',function(){
					getPrivilegeByRoleIdAndFolderId(folderId,roleSelect.id);
				});
			}
		},
	   	dataType:"json"
	});
}

function getPrivilegeByRoleIdAndFolderId(folderId,roleId){
	$.ajax({
		type: "POST",
	   	url: 'getPrivilegeByRoleIdAndFolderId.do',
   		data: {
   			    "folderEventId":folderId,
   			    "rolePrivilegeEventId":roleId
		  },
	   	success: function(data){
	   		$('#privelegetype div').each(function() {
				$(this).find(":checkbox").attr("checked",false); 
    		});
   			$("#folderRoleRefId").val("");
	   		if(data!=null&&data.length>0){
	   			var result = data[0];
	   			var type=result.folderprivilegetype;
	     		$('#privelegetype div').each(function() {
	    			if (type >= $(this).attr('id')) {
	    				$(this).find(":checkbox").attr("checked",true); 
	    			}
	    		});
	     		$("#folderRoleRefId").val(result.id);
	   		}
	   		
		},
	   	dataType:"json"
	});
}

function deleteFolderRole(){
	var roleSelect = $('#rolePrivilegeEventId').tree('getSelected');
	if(roleSelect==null){
		$.messager.alert('tip',"请选择角色",'info');
		return;
	}
	var id = $("#folderRoleRefId").val();
	if(id==""){
		return;
	}
	$.ajax({
		type: "POST",
	   	url: 'deleteRolePrivilege.do',
   		data: {
   			    "eventids":id
   			  },
	   	success: function(check){
     		if (check.error=='-1'){
				$.messager.alert('错误',check.msg,'error');
			} else{
				$.messager.alert('提示',check.ok,'ok',function(){
					$('#privelegetype div').each(function() {
	    				$(this).find(":checkbox").attr("checked",false); 
		    		});
				});
			}
     		
		},
	   	dataType:"json"
	});
}
	
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
     			$("#description").html(data.description);
     		}
		},
	   	dataType:"json"
	});
}