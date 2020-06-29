/**
 * 方法描述： 加载左侧角色树形菜单
 */	
var folderRoleValues = new Array();	//用户勾选的 文件夹权限数据
var initRoleValues = new Array();	//该角色以拥有的文件夹权限数据
var parentValues = new Array();		//文件夹的父节点数据
var markNumber = 0;
var cascadeCheck=true;
var roleId="";
var isFirst=true;
$(function(){	
	var roleUrl = rootPath+"jasdoc/privilege/privilege/getRoleListByUserId.do";
	$('#rolePrivilegeEventId').tree({
		url : roleUrl,
		onLoadSuccess:function(node,data) {
			if(data.length>0){
				var node=$(this).tree('find',data[0].id);
				$(this).tree('select',node.target);
			}else{
				$("#noData").show();
			}
		},onSelect:function(node){
			roleId=node.id;
//			createPrivilegeTree();
			var url=rootPath+"/jasdoc/privilege/privilege/layoutRoleCenter.htm";
			url=url+"?roleId="+roleId;
			$("#content").attr("src",url);
		}
		
	});	
});