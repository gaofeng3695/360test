/**
 * 方法描述：加载左侧部门树
 */
var treeChecked=false;
var deptid="";
var rootNode=null;
var privilegeObj=new Array();
$(function(){
	var deptUrl = rootPath+"jasdoc/privilege/privilege/getUnitAndChildrenTree.do?r="+new Date().getTime();
	$('#deptprivilegeEventId').tree( {
		url : deptUrl,
		onSelect:function(node){
			deptid=node.id;
			init();
		},onLoadSuccess:function(node,data){
			var node=$('#deptprivilegeEventId').tree('find',data[0].id);
			$('#deptprivilegeEventId').tree('select',node.target);
		}
	});
	
	$('#setlevel').linkbutton({    
	    onClick:function(e){
	    	var e=$('#setlevel').position();
	    	document.getElementById("levelDiv").style.top=e.top+2+"px";
	    	document.getElementById("levelDiv").style.left=e.left+$('#setlevel').width()+8+"px";
	    	$("#levelDiv").fadeIn('normal');
	    }
	}); 
	$('#level').searchbox({
		width:$('#setlevel').width()
	});
	document.getElementById("levelDiv").style.width=$('#setlevel').width();
});
/**
 * 方法描述:加载右侧的文件夹树形表格
 */
function init(){
	$.ajax({
		url: rootPath+"jasdoc/privilege/privilege/queryPrivilegeFolder.do",
		dataType:"json",
		type:'post',
		data:{'deptid':deptid},
		success:function(result){
//			alert(JSON.stringify(result));
			$.fn.zTree.init($("#privilegeFolderEventId"), {
//				async: {
//					enable: true,
//					url: "../../../jasdoc/privilege/privilege/queryRolePivilegeForFolder.do",
//					autoParam: ['deptid',deptid]
//				},
				check: {
					enable: true,
					autoCheckTrigger:true,
				},
				data: {
					simpleData: {
						enable: true,
						idKey: "id",
					}
				},callback: {
					beforeExpand: zTreeBeforeExpand,
					beforeCollapse: zTreeBeforeCollapse,
					onAsyncSuccess: zTreeOnAsyncSuccess,
					onRightClick: zTreeOnRightClick
				}
			}, result);
		}
	});
}
/**
 * 方法描述：异步加载ztree正常结束的事件回调函数
 * @param event event对象
 * @param treeId ztree的id
 * @param treeNode 进行异步加载的父节点 JSON 数据对象
 * @param msg 异步获取的节点数据字符串
 */
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
//    alert(msg);
};
/**
 * 关闭ztree节点之前
 * @param treeId 节点的id
 * @param treeNode 节点对象
 */
function zTreeBeforeCollapse(treeId, treeNode){
	var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
	treeNode.icon = "icon-tree-center-node-close";
	treeObj.updateNode(treeNode);
}
/***
 * 展开ztree节点之前
 * @param treeId 节点id
 * @param treeNode 节点对象
 */
function zTreeBeforeExpand(treeId, treeNode){
	var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
	treeNode.icon = "icon-tree-center-node-open";
	treeObj.updateNode(treeNode);
}

/**
 * 方法描述：点击保存部门权限
 */
function saveConfig() {
	var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
	var checkedNodes=treeObj.getCheckedNodes(true);
	for(var i=0;i<checkedNodes.length;i++){
		var obj={'folderid' : checkedNodes[i].id , 'deptid' : deptid,'folderprivilegetype':10};
		privilegeObj.push(obj);
	}
	var privilegeStr=JSON.stringify(privilegeObj);
	$.ajax({
		type: "POST",
	   	url: '../../../jasdoc/privilege/privilege/saveDeptPrivilege.do',
   		data: {'privilegeStr':privilegeStr,"deptid":deptid},
	   	success: function(result){
	   		if(result.success==1){
	   			$.messager.alert('提示',result.msg,'info');
	   			loaderPrivilege();
	   		}else{
	   			$.messager.alert('错误',result.msg,'error');
	   		}
	   		privilegeObj.splice(0,privilegeObj.length);
	   	}
	});
}
/***
 * 刷新
 * @returns
 */
function cancel(){
	loaderPrivilege();
}
/***
 * 展开所有节点
 * @returns
 */
function expandAll(){
	var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
	treeObj.expandAll(true);
}
/**
 * 折叠所有节点，除根节点外
 * @returns
 */
function collapseAll(){
	var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
	treeObj.expandAll(false);
	var nodes = treeObj.getNodes();
	treeObj.expandNode(nodes[0], true, false, false);
}
/***
 * 展开选中节点的所有子节点
 * @returns
 */
function expand(){
	var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
	var nodes = treeObj.getSelectedNodes();
	if(nodes==null){
		$.messager.alert('提示','请选择要关闭的节点！','info');
	}else{
		treeObj.expandNode(nodes[0], true, false, false);
	}
}
/***
 * 折叠选中节点，包括折叠所有子节点
 * @returns
 */
function collapse(){
	var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
	var nodes = treeObj.getSelectedNodes();
	if(nodes==null){
		$.messager.alert('提示','请选择要关闭的节点！','info');
	}else{
		treeObj.expandNode(nodes[0], false, true, false);
	}
}
/***
 * 展开已授权的节点
 * @returns
 */
function expandPrivilege(){
	var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
	var checkedNodes=treeObj.getCheckedNodes(true);
	for(var i=0;i<checkedNodes.length;i++){
		treeObj.expandNode(checkedNodes[i], true, false, false);
	}
}
/***
 * 设置菜单的显示界别
 */
function setLevel(){
	var number=$("#level").val();
	if(number==""){
		$.messager.alert('提示','请输入级别！','info');
	}else{
		if(number<=0){
			$.messager.alert('提示','输入的级别数错误，级别数应大于0','erro');
		}else{
			collapseAll();
			var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
			var rootNode = treeObj.getNodes()[0];
			setFolderLevel(number,rootNode,treeObj);
			$("#levelDiv").fadeOut("normal");
		}
		$('#level').searchbox("clear");
	}
}
/***
 * 递归展开菜单
 * @param number
 * @param node
 */
function setFolderLevel(number,node,treeObj){
	if(number>0){
		treeObj.expandNode(node, true, false, false);
		var childrenNode=node.children;
		if(childrenNode!=null){
			for(var i=0;i<childrenNode.length;i++){
				setFolderLevel(number-1,childrenNode[i],treeObj);
			}	
		}
	}else{
		return;
	}
	
}
/***
 * ztree右键点击事件
 * @param event event对象
 * @param treeId ztree对象的id
 * @param treeNode 右键点击的节点对象
 */
function zTreeOnRightClick(event, treeId, treeNode) {
	if(treeNode!=null){
		$('#rightMenu').menu('show', {
			left : event.pageX,
			top : event.pageY
		});
		if(treeNode.open){
			$("#expandMenu").attr('disabled', true);
		}else{
			$("#collapseMenu").attr('disabled', true);
		}
		ContentMenu(treeNode);
	}
};
/**
 * 右键单击菜单事件
 */
function ContentMenu(treeNode){
	$('#rightMenu').menu({
		onClick:function(item){
			var disabled = $("#"+item.id).attr("disabled");
			if(disabled=="disabled"){
				return;
			}else{
				if(item.name=="treeexpand"){
					var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
					treeObj.expandNode(treeNode, true, false, false);
					$("#collapseMenu").attr('disabled', false);
				}else if(item.name="treecollapse"){
					var treeObj = $.fn.zTree.getZTreeObj("privilegeFolderEventId");
					treeObj.expandNode(treeNode, false, false, false);
					$("#expandMenu").attr('disabled', false);
				}
			}
		}
	});
}

/**
 * 方法描述:重新加载  ztree
 */
function loaderPrivilege(){
	init();
}