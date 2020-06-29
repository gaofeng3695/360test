/**
 * 方法描述： 加载左侧角色树形菜单
 */	
var folderRoleValues = new Array();	//用户勾选的 文件夹权限数据
var initRoleValues = new Array();	//该角色以拥有的文件夹权限数据
var parentValues = new Array();		//文件夹的父节点数据
var markNumber = 0;
var cascadeCheck=true;
var isFirst=true;
var roleId=getParamter('roleId');
$(function(){	
//	createPrivilegeTree();
	init();
});
function init(){
	$.ajax({
		url: rootPath+"jasdoc/privilege/privilege/queryRolePivilegeForFolder.do?",
		dataType:"json",
		type:'post',
		data:{'selectRoleId':roleId},
		success:function(result){
//			var testResult = result;
//			result.push(testResult);
			console.log(result);
			$.fn.zTree.init($("#folderPrivilegeEventId"), {
				check: {
					enable: true,
					autoCheckTrigger:true,
					display:true
				},data: {
					simpleData: {
						enable: true,
						idKey: "id",
					}
				},callback: {
					beforeExpand: zTreeBeforeExpand,
					beforeCollapse: zTreeBeforeCollapse,
					onAsyncSuccess: zTreeOnAsyncSuccess,
					beforeClick: zTreeBeforeClick
				},view:{
					addDiyDom: addDiyDom,
					
				}
//				,async: {
//					enable: true,
//					url: "../../../jasdoc/privilege/privilege/queryRolePivilegeForFolder.do",
//					autoParam: ['roleId',roleId]
//				}
			}, result);
		}
	});
}
function zTreeBeforeClick(treeId, treeNode, clickFlag) {
	var treeObj=$.fn.zTree.getZTreeObj("folderPrivilegeEventId");
	var selectNodes=treeObj.getSelectedNodes();
	for(var i=0;i<selectNodes.length;i++){
		$('#ztree_'+selectNodes[i].id).removeClass('ztree_background_color');
	}
	$('#ztree_'+treeNode.id).addClass('ztree_background_color');
};
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    alert(msg);
};
function zTreeBeforeCollapse(treeId, treeNode){
	var treeObj = $.fn.zTree.getZTreeObj("folderPrivilegeEventId");
	treeNode.icon = "icon-tree-center-node-close";
	treeObj.updateNode(treeNode);
}
function zTreeBeforeExpand(treeId, treeNode){
	var treeObj = $.fn.zTree.getZTreeObj("folderPrivilegeEventId");
	treeNode.icon = "icon-tree-center-node-open";
	treeObj.updateNode(treeNode);
}
function addDiyDom(treeId, treeNode){
	if (treeNode.parentNode && treeNode.parentNode.id!=2) return;
	var aObj = $("#" + treeNode.tId + "_a");
	var left=document.body.scrollWidth*0.3;
	var value=treeNode.folderprivilegetype;
	var s = "<span style='float: right;margin-right: "+left+"px;' id='ztree_"+treeNode.id+"'>";//返回给列表的值
		for( var y = 0 ; y < folderAllRoleValueAfter.length ; y ++ ){
			var roleValue = folderAllRoleValueAfter[y];
			var roleText = folderAllRoleTextAfter[y];
    			if(roleValue<=treeNode.indeterminate){
    				if(''!= value && roleValue<=value){
    					s += "<input type=\"checkbox\" checked=\"checked\" id=\""+roleValue+"_"+treeNode.id+"\" name=\"check_"+markNumber+"\" value=\""+roleValue+"\" onclick=\"setRoleCheck("+markNumber+","+roleValue+",'"+roleValue+"_"+treeNode.id+"','"+treeNode.id+"') \" >&nbsp;"+roleText+"&nbsp;&nbsp;" ;
        			}else{
        				s += "<input type=\"checkbox\" id=\""+roleValue+"_"+treeNode.id+"\" name=\"check_"+markNumber+"\" value=\""+roleValue+"\" onclick=\"setRoleCheck("+markNumber+","+roleValue+",'"+roleValue+"_"+treeNode.id+"','"+treeNode.id+"') \" >&nbsp;"+roleText+"&nbsp;&nbsp;" ;
        			}
    			}else{
    				s += "<input type=\"checkbox\" disabled=\"true\" title=\"您没有权限，不能分配\" id=\""+roleValue+"_"+treeNode.id+"\" name=\"check_"+markNumber+"\" value=\""+roleValue+"\" onclick=\"setRoleCheck("+markNumber+","+roleValue+",'"+roleValue+"_"+treeNode.id+"','"+treeNode.id+"') \" >&nbsp;"+roleText+"&nbsp;&nbsp;" ;
    			}
			}
    	markNumber ++;
	s+="</span>";
	aObj.after(s);
	var btn = $("#diyBtn_"+treeNode.id);
	if (btn) btn.bind("change", function(){alert("diy Select value="+btn.attr("value")+" for " + treeNode.name);});

}

/**
 * 方法描述：设置选择 的 权限 内容/ 如果选择取消则该权限以后的都需取消、如果选中则该权限以前的都洗选中
 */
function setRoleCheck( markNumber , roleValue , id,folderId ){
	var role = 1 ;
	var roleCheck = true;	//点击事件   是保存还是取消
	if( $("input[type='checkbox'][name='check_"+markNumber+"'][id='"+id+"']").attr("checked") == 'checked' ){
		roleCheck = true;
	}else{
		roleCheck = false;
	}
	$("input[type='checkbox'][name='check_"+markNumber+"']").each(function(){
		if( roleCheck ){
			 if( $(this).val() < roleValue ){
				$(this).attr("checked",true); 
			}else if ( $(this).val() == roleValue ) {
				role = $(this).val();
			}
			
		}else{
			if( $(this).val() >= roleValue ){
				$(this).attr("checked",false ); 
			}else if( $(this).val() < roleValue ){
				role = $(this).val();
			}
		}
	});
	if(cascadeCheck){
		setChildrensCheck(folderId,roleValue,roleCheck);
	}
	updateNodeAndSetPrivilege(folderId,role,roleCheck);
}
function setChildrensCheck(folderId,roleValue,roleCheck){
	var treeObj = $.fn.zTree.getZTreeObj("folderPrivilegeEventId");
	var node = treeObj.getNodeByParam("id", folderId, null);
	var childrenNode=node.children;
	var role=1;
	var flag=false;
	if(!node.open){
		treeObj.expandNode(node, true, false, false);
		flag=true;
	}
	if(childrenNode!=null && childrenNode.length>0){
		for(var i=0;i<childrenNode.length;i++){
			var id=childrenNode[i].id;
			for( var y = 0 ; y < folderAllRoleValueAfter.length ; y ++ ){
    			var roleVal = folderAllRoleValueAfter[y];
    			if(roleCheck){
    				if(roleVal<roleValue){
        				$("#"+roleVal+"_"+id).attr('checked',roleCheck);
        			}else if(roleVal==roleValue){
        				$("#"+roleVal+"_"+id).attr('checked',roleCheck);
        				role=roleVal;
        			}
    			}else{
    				if(roleVal>=roleValue){
        				$("#"+roleVal+"_"+id).attr('checked',roleCheck);
        			}else if(roleVal<roleValue){
        				role=roleVal;
        			}
    			}
    			
			}
			childrenNode[i].folderprivilegetype=role;
			treeObj.updateNode(childrenNode[i]);
			setChildrensCheck(id,roleValue,roleCheck);
			if(flag){
				treeObj.expandNode(node, false, false, false);
			}
		}
	}
}


/**
 * 方法描述：设置 隐藏域 值、将页面用于存储 文件夹选择的权限数据对象  整理成字符串组 传递给后台
 * 
 */
var folderRoleValuesStr = "";


function saveConfig(folderRoleValuesStr){
	var privilegeObj=new Array();
	var treeObj = $.fn.zTree.getZTreeObj("folderPrivilegeEventId");
	var checkedNodes = treeObj.getCheckedNodes(true);
	for(var i=0;i<checkedNodes.length;i++){
		var obj={'folderid' : checkedNodes[i].id,'folderprivilegetype':checkedNodes[i].folderprivilegetype};
		privilegeObj.push(obj);
	}
	folderRoleValuesStr=JSON.stringify(privilegeObj);
	$.ajax({
		type: "POST",
	   	url: rootPath+'jasdoc/privilege/privilege/saveRoleFolderPrivilege.do',
   		data: { "saveRoleId":roleId,"folderRoleValuesStr":folderRoleValuesStr},
	   	success: function(check){
     		if (check.error=='-1'){
				$.messager.alert('错误',check.msg,'error');
			} else{
				$.messager.alert('提示',check.msg,"info");
			}
     		folderRoleValues.splice(0,folderRoleValues.length);
//     		loaderGrid();
		},
	   	dataType:"json"
	});
}
function checkPrivilegeData(){
	var flag=0;
	for(var i=0;i<folderRoleValues.length;i++){
		var roleObj=folderRoleValues[i];
		for(var j=0;j<initRoleValues.length;j++){
			var initObj=initRoleValues[j];
			if(roleObj.folderid==initObj.folderid && roleObj.folderprivilegetype==initObj.folderprivilegetype){
				flag++;
				break;
			}
		}
	}
	if(flag==folderRoleValues.length){
		return false;
	}else{
		return true;
	}
}
function cancel(){
	loaderGrid();
}
///**
// * 方法描述；重新加载  dataGrid
// */
//function loaderGrid(){
//	var node=$('#rolePrivilegeEventId').tree('find',roleId);
//	$('#rolePrivilegeEventId').tree('select',node.target);
//}

/***
 * 方法描述：在勾选或取消勾选时，改变对应节点的勾选状态
 * 同时设置该节点的权限
 * 
 * nodeId Ztree节点id
 * privilegeValue 权限值
 * roleCheck 勾选状态
 */
function updateNodeAndSetPrivilege(nodeId,privilegeValue,roleCheck){
	var treeObj=$.fn.zTree.getZTreeObj("folderPrivilegeEventId");
	var node=treeObj.getNodeByParam('id',nodeId,null);
	node.folderprivilegetype=privilegeValue;
	treeObj.updateNode(node);
	if(!roleCheck) {
		if(privilegeValue<folderAllRoleValueAfter[0]){
			treeObj.checkNode(node, roleCheck, true);
		}
	}else{
		treeObj.checkNode(node, roleCheck, true);
	}
}