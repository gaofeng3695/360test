
var currentSelectedTreeObj;//当前选中的树对象（记录当前选中的是文档中心树、文档分类树、还是文档收藏夹树）
var currentSelectedTreeNodeObj;	//当前选中的树节点对象
var oldFolderName = "";		//用于记录文件夹原名称（修改时  若名称不规范需还原回去）
var currentEditNode = null; //记录当前正在编辑的节点对象
var businessId = getParamter("businessId");
var folderId;
$(document).ready(function(){ 
	//同步加载文档中心树
	$('#docCenterTree').tree({		
		url: rootPath+"jasdoc/folder/doccenter/queryDocCenterFolder.do?isPrivilege="+isPrivilege+"&token="+localStorage.getItem("token"),
		onLoadSuccess:function(node,data) {
			if(node==null){
				var root = $('#docCenterTree').tree('getRoot');
				folderLocationName=root.attributes.folderLocationName;
				folderId = root.id;
				var url=rootPath+"jasdoc/attachmentAssociation/attachmentAssociationCenter.htm";
				$("#content").attr("src",url);
				$('#docCenterTree').tree('select', root.target);
			}else{
				folderId = node.id;
				folderLocationName=node.attributes.folderLocationName;
				document.getElementById("content").contentWindow.initMessage(null,false);
			}
		},onClick:function(node){
			folderId = node.id;
			folderLocationName=node.attributes.folderLocationName;
			document.getElementById("content").contentWindow.initMessage(null,false);
			$(this).tree("expand",node.target);
		},onBeforeExpand:function(node){
			url=rootPath+"jasdoc/folder/doccenter/getChildren.do";
		 	$('#docCenterTree').tree("options").url= url+"?folderId="+node.id+"&isPrivilege="+isPrivilege;
		 	node.iconCls= 'icon-tree-center-node-open';
			$('#docCenterTree').tree('update', node);
			$('#docCenterTree').tree('select', node.target);
		},onBeforeCollapse: function(node){
			node.iconCls= 'icon-tree-center-node-close';
			$('#docCenterTree').tree('update', node);
		},onSelect:function(node){
			folderId = node.id;
		}
	});
	
});


function validateFolderName(value) {
    var regbegin = new RegExp('^[\\\\^/:*?"<>|]');
	var regend = new RegExp('[\\\\^/:*?"<>|]$');
	return !regbegin.test(value) && !regend.test(value);
}

function reloadDataTree(data,operation){
	if(operation==1){
		//新增操作
		$('#docCenterTree').tree("expand",currentSelectedTreeNodeObj.target);
		var nodeChildren=currentSelectedTreeObj.tree('getChildren', currentSelectedTreeNodeObj.target);
		if(nodeChildren==""){
			$('#docCenterTree').tree("append",{
				parent: currentSelectedTreeNodeObj.target,
		        data:[data]
			});
		}
		$('#docCenterTree').tree("reload",currentSelectedTreeNodeObj.target);
	}else if(operation==2){
		//修改操作
		var nodeParent=$('#docCenterTree').tree('getParent', currentSelectedTreeNodeObj.target);
		$('#docCenterTree').tree("reload",nodeParent.target);
	}else if(operation==3){
		//删除操作
		var nodeParent=$('#docCenterTree').tree('getParent', currentSelectedTreeNodeObj.target);
		$('#docCenterTree').tree("reload",nodeParent.target);
	}
}


/**
 * 刷新文档中心树
 */
function reloadDocCenterFolder(){
	var url =rootPath+"jasdoc/folder/folder/getMenu.do?id=80001151";
	$.getJSON(url, function(data){
		var tree=$('#docCenterTree');
		tree.tree("loadData",data);
	});
}

function selectDocTreeNode(id){
	var node = $('#docCenterTree').tree("find",id)
	$('#docCenterTree').tree("select",node.target);
}


/*********************************工具栏对应按钮事件 End *********************************************************/

function backDirectory(url, elementId,folderId,directory) {
	console.log(directory);
	var treeObj=$("#" + elementId);
	var node=treeObj.tree("find",folderId);
	var parentNode=null;
	for(var i=0;i<directory;i++){
		parentNode=treeObj.tree("getParent",node.target);
		treeObj.tree("collapse",node.target);
		node=parentNode;
	}
	treeObj.tree("select",parentNode.target);
	document.getElementById("content").contentWindow.initMessage(null,false);
}


