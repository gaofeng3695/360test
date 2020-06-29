/**
 * 方法描述： 加载左侧角色树形菜单
 */	
var folderUserValues = new Array();	//用户勾选的 文件夹权限数据
var initUserValues = new Array();	//该角色以拥有的文件夹权限数据
var parentValues = new Array();		//文件夹的父节点数据
var markNumber = 0;
var cascadeCheck=true;
var nodeValue=null;
var nodeUser=null;
var userId="";
$(function(){
	/***begin 定位部门树面板的位置***/
	var offset=$("#search").offset();
	var doc=document.getElementById("unitTree");
	doc.style.top=offset.top+$("#search").height()+"px";
	doc.style.left=offset.left-4+"px";
	doc.style.width=$("#search").width()+"px";
	/***end 定位部门树面板的位置***/
	/***begin 获取部门树***/
	var deptUrl = "../../../jasdoc/privilege/privilege/getUnitAndChildrenTree.do?r="+new Date().getTime();
	$('#deptprivilegeEventId').tree( {
		url : deptUrl,
		checkbox:true,
		cascadeCheck:false,
		onSelect:function(node){
			
		},onLoadSuccess:function(node,data){
			if(node==null){
				var root = $('#deptprivilegeEventId').tree('getRoot');
				$('#deptprivilegeEventId').tree('check',root.target);
			}else{
				$('#deptprivilegeEventId').tree('check',node.target);
			}
		},onBeforeCheck:function(node,checked){
			setUnitInfo(node,checked);
		},onCheck:function(node,checked){
			crateUserTree();
		}
	});
	/***end 获取部门树***/
	/***begin 初始化部门树面板***/
	$("#unitTree").panel({
		collapsed:true
	});
	/***end 初始化部门树面板***/
	/***begin 部门树面板折叠与展开***/
	$("#searchUnit").focusin(function(){
		$("#unitTree").panel('expand');
	});
	$("#searchUnit").focusout(function(){
		$(document).bind('mouseup',function(e){
			var p=$(e.target).closest('#unitTree');
			var isExpand=$('#unitTree').is(':visible');
			if(p.length==0 && isExpand){
				$('#unitTree').panel('collapse');
				$(document).unbind('mouseup');
			}
		});
	});
	/***begin 部门树面板折叠与展开***/
	
	$('#searchUnit').bind('keyup', function(event) {
		search(event);
	});
	$('#user').searchbox({ 
		searcher:function(value,name){
			var data=$("#rolePrivilegeEventId").tree("getRoots");
			positionUser(value,data);
		}
	});
});
var flag=false;
/******
 * 用户查询并定位
 * @param value
 */
function positionUser(value,data){
	flag=false;
	for(var j=0;j<data.length;j++){
		if(data[j].text.indexOf(value)!=-1){
			if(nodeUser==null){
				var node=$("#rolePrivilegeEventId").tree('find',data[j].id);
				
				$("#rolePrivilegeEventId").tree('scrollTo',node.target);
				$("#rolePrivilegeEventId").tree('select',node.target);
				nodeUser=node.attributes;
				flag=true;
				break;
			}else{
				nextNodeName=nodeUser.nextName;
				nextNodeId=nodeUser.nextId;
				var node=$("#rolePrivilegeEventId").tree('find',nextNodeId);
				if(nextNodeName.indexOf(value)!=-1){
					$("#rolePrivilegeEventId").tree('scrollTo',node.target);
					$("#rolePrivilegeEventId").tree('select',node.target);
					flag=true;
					if(node.attributes.nextId==null){
						nodeUser=null;
					}else{
						nodeUser=node.attributes;
					}
					break;
				}else{
					j=-1;
					if(node.attributes.nextId==null){
						nodeUser=null;
					}else{
						nodeUser=node.attributes;
					}
					continue;
				}
				
			}
		}
	}
}
function search(event){
	var myevent = event || window.event;
	var mykeyCode = myevent.keyCode;
	if(mykeyCode==13){
		var keyWord=$("#searchUnit").val();
		if(keyWord.indexOf(',')!=-1){
			return ;
		}else if(keyWord!=''){
			var data=$('#deptprivilegeEventId').tree('getRoot');
			positionUnit(keyWord,"deptprivilegeEventId",data);
		}
	}
	
}
/******
 * 部门的查询并定位
 * @param value
 */
function positionUnit(value,elementid,data){
	if(data.text.indexOf(value)==0){
		if(nodeValue!=null ){
			if(data.id!==nodeValue.id){
				var node=$("#"+elementid).tree('find',data.id);
				var parentNode=$("#"+elementid).tree('getParent',node.target);
				$("#"+elementid).tree("expand",parentNode.target);
				$("#"+elementid).tree('scrollTo',node.target);
				$("#"+elementid).tree('select',node.target);
				nodeValue=data;
				return true;
			}else{
				var children=data.children;
				if(children.length!=0){
					for(var i=0;i<children.length;i++){
						var flagUnit=positionUnit(value,elementid,children[i]);
						if(flagUnit==true){
							break ;
						}
					}
				}else{
					return;
				}
			}
		}else{
			var node=$("#"+elementid).tree('find',data.id);
			var parentNode=$("#"+elementid).tree('getParent',node.target);
			$("#"+elementid).tree("expand",parentNode.target);
			$("#"+elementid).tree('scrollTo',node.target);
			$("#"+elementid).tree('select',node.target);
			nodeValue=data;
			return true;
		}
	}else{
		var children=data.children;
		if(children.length!=0){
			for(var i=0;i<children.length;i++){
				var flagUnit=positionUnit(value,elementid,children[i]);
				if(flagUnit==true)
					break ;
			}
		}else{
			return;
		}
	}
	
	
	
}
/***
 * 关闭其他节点
 * @param i
 */
function toggleNode(i,elementid){
	for(var k=0;k<Alldata.length;k++){
		if(i!=k){
			var parentNode=$("#"+elementid).tree("find",Alldata[k].id);
			$("#"+elementid).tree("collapse",parentNode.target);
		}
	}
}
/***
 * 保存或移出选择的部门信息
 * @param node 选择的部门节点
 * @param checked 选中还是取消选中
 */
function setUnitInfo(node,checked){
	if(checked){
		var checkedNode=$('#deptprivilegeEventId').tree('getChecked');
//		alert(checkedNode);
		var unitName="";
		if(checkedNode.length!=0){
			unitName=$("#searchUnit").val();
		}
		if(unitName!=""){
			unitName+=","+node.text;
		}else{
			unitName=node.text;
		}
		$("#searchUnit").attr('value',unitName);
		
		var unitId=$("#unitId").val();
		if(unitId!=""){
			unitId+=","+node.id;
		}else{
			unitId=node.id;
		}
		$("#unitId").attr('value',unitId);
	}else{
		var unitName=$("#searchUnit").val();
		var newNuitName="";
		var unitNames=unitName.split(',');
		for(var i=0;i<unitNames.length;i++){
			if(unitNames[i]!=node.text && i==0){
				newNuitName=unitNames[i];
			}else if(unitNames[i]!=node.text){
				newNuitName+=","+unitNames[i];
			}
		}
		$("#searchUnit").attr('value',newNuitName);
		
		var unitId=$("#unitId").val();
		var newNuitId="";
		var unitIds=unitId.split(',');
		for(var i=0;i<unitIds.length;i++){
			if(unitIds[i]!=node.id && i==0){
				newNuitId=unitIds[i];
			}else if(unitIds[i]!=node.id){
				newNuitId+=","+unitIds[i];
			}
		}
		$("#unitId").attr('value',newNuitId);
	}
//	crateUserTree();
}
/***
 * 初始化用户树
 */
function crateUserTree(){
	var unitId=$("#unitId").val();
	var roleUrl = "getUserListByUnitId.do?unitIds="+unitId;
	$('#rolePrivilegeEventId').tree({
		url : roleUrl,
		onLoadSuccess:function(node,data) {
			var node=$(this).tree('find',data[0].id);
			$(this).tree('select',node.target);
		},onSelect:function(node){
			userId=node.id;
//			createPrivilegeTree();
			init();
		}
		
	});	
}
function init(){
	$.ajax({
		url: "../../../jasdoc/privilege/privilege/queryUserPivilegeForFolder.do?",
		dataType:"json",
		type:'post',
		data:{'userId':userId},
		success:function(result){
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
					addDiyDom: addDiyDom
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
	var left=document.body.scrollWidth*0.2;
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
	var node=treeObj.getNodeByParam('id',folderId);
	var childrenNode=node.children;
	var flag=false;
	if(!node.open){
		treeObj.expandNode(node, true, false, false);
		flag=true;
	}
	var role=1;
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
var folderUserValuesStr = "";

function saveConfig(folderUserValuesStr){
	var privilegeObj=new Array();
	var treeObj = $.fn.zTree.getZTreeObj("folderPrivilegeEventId");
	var checkedNodes = treeObj.getCheckedNodes(true);
	for(var i=0;i<checkedNodes.length;i++){
		var obj={'folderid' : checkedNodes[i].id,'folderprivilegetype':checkedNodes[i].folderprivilegetype};
		privilegeObj.push(obj);
	}
	folderUserValuesStr=JSON.stringify(privilegeObj);
//	alert(folderUserValuesStr);
	$.ajax({
		type: "POST",
	   	url: '../../../jasdoc/privilege/privilege/saveUserFolderPrivilege.do',
   		data: { "userId":userId,"folderUserValuesStr":folderUserValuesStr},
	   	success: function(check){
     		if (check.error=='-1'){
				$.messager.alert('错误',check.msg,'error');
			} else{
				$.messager.alert('提示',check.msg,"info");
			}
     		folderUserValues.splice(0,folderUserValues.length);
//     		loaderGrid();
		},
	   	dataType:"json"
	});
}
function cancel(){
//	loaderGrid();
}
/**
 * 方法描述；重新加载  dataGrid
 */
//function loaderGrid(){
//	var node=$('#rolePrivilegeEventId').tree('find',userId);
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
