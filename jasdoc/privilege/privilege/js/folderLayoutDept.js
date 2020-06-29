/**
 * 方法描述： 加载左侧角色树形菜单
 */	
var folderId = getParamter("folderId");
$(function(){	
	var deptUrl = "../../../jasdoc/privilege/privilege/getUnitAndChildrenTree.do?folderId="+folderId;
	$('#deptprivilegeEventId').tree( {
		url : deptUrl,
		checkbox:true,
		cascadeCheck:false,
		onCheck : function(node, checked){
		var nodeDept = $('#deptprivilegeEventId').tree('getChecked');
			var deptIds = "";
			for(var i = 0;i<nodeDept.length;i++){
				if(i==0){
					deptIds +="'" + nodeDept[i].id + "'";
				}else{
					deptIds += "," + "'" + nodeDept[i].id + "'";
				}
			}
		}
	});
	viewFolderById(folderId);
});


	
	
//保存方法
function saveFolderDept(){
	//获取选中的部门
	var nodeDept = $('#deptprivilegeEventId').tree('getChecked');
	var deptprivilegeEventIds = '';
	for(var i=0; i<nodeDept.length; i++){
		if (deptprivilegeEventIds != '') deptprivilegeEventIds += ',';
		deptprivilegeEventIds += nodeDept[i].id;
	}
	$.ajax({
		type: "POST",
	   	url: 'saveDeptFolderPrivilege.do',
   		data: {
   				"deptprivilegeEventIds":deptprivilegeEventIds,
   				"privilegeFolderEventIds":folderId
   				},
	   	success: function(check){
     		if (check.error=='-1'){
				$.messager.alert('错误',check.message,'error');
				
			} else{
				$.messager.alert('提示',check.message,'ok',function(){
				});
			}
		},
	   	dataType:"json"
	});
}

function viewFolderById(folderId){
	$.ajax({
		type: "POST",
	   	url: rootPath+'jasdoc/folder/doccenter/viewFolderById.do',
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