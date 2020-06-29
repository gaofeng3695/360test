
var currentSelectedTreeObj;//当前选中的树对象（记录当前选中的是文档中心树、文档分类树、还是文档收藏夹树）
var currentSelectedTreeNodeObj;	//当前选中的树节点对象
var oldFolderName = "";		//用于记录文件夹原名称（修改时  若名称不规范需还原回去）
var currentEditNode = null; //记录当前正在编辑的节点对象
$(document).ready(function(){
	init();
	//同步加载文档中心树
	/*$('#docCenterTree').tree({		
		url: rootPath+"jasdoc/folder/doccenter/queryDocCenterFolder.do?isPrivilege="+isPrivilege+"&token="+localStorage.getItem("token"),
		dnd: true,
		onLoadSuccess:function(node,data) {
			if(node==null){
				var root = $('#docCenterTree').tree('getRoot');
				$('#docCenterTree').tree('select',root.target);
			}else{
				$("#docCenterTree").tree("select",node.target);
			}
		},
		onSelect:function(node){
			if(currentEditNode!=null){
				$(this).tree('endEdit',currentEditNode.target);
			}
			
			var url=rootPath+"jasdoc/folder/docCenter/queryDocCenter.htm";
//			url=url+"?folderId="+node.id+"&folderLocationName="+node.attributes.folderLocationName;
			url=url+"?folderId="+node.id;
			folderLocationName=node.attributes.folderLocationName;
			$("#content").attr("src",url);
			$(this).tree("expand",node.target);
		},
		onBeforeExpand:function(node){
			url=rootPath+"jasdoc/folder/doccenter/getChildren.do";
		 	$('#docCenterTree').tree("options").url= url+"?folderId="+node.id+"&isPrivilege="+isPrivilege;
		 	node.iconCls= 'icon-tree-center-node-open';
			$('#docCenterTree').tree('update', node);
		},
		onBeforeCollapse: function(node){
			node.iconCls= 'icon-tree-center-node-close';
			$('#docCenterTree').tree('update', node);
		},
		onDblClick:function(node){//双击进行文件夹重命名
			oldFolderName = node.text;
			if( node.id!=docCenterFolderId){//如果不是文档中心根目录，则允许重命名
				var role = node.attributes.role;
				if( role == folderAllRoleValueAfter[folderAllRoleValueAfter.length - 1] ){
					$(this).tree('beginEdit',node.target);
					currentEditNode = node;
					//setCursorPos(node);
				}
			}
		},
		onAfterEdit:function(node){
			currentEditNode=null;
			var newNodeName = node.text;
			if(newNodeName.length>25){
				$.messager.alert('提示','文件夹名称长度超过25！','info');
				node.text = oldFolderName;
				$(this).tree("update", node);
				return;
			}
			if(!validateFolderName(newNodeName)){
				$.messager.alert('提示','文件夹名称不能包含空格或者非法字符！</br>文件夹名称不能包含以下任何字符:</br><span style="color:red">\\,/,：,*,?,<,>,|</span>','info');
				node.text = oldFolderName;
				$(this).tree("update", node);
				return;
			}
			if( node.text != oldFolderName ){
				var updateResult = updateFolderName(node,$(this));
				if(updateResult){
					var parentNode = $(this).tree("getParent",node.target);
					$(this).tree("reload",parentNode.target);
				}
			}
		},
		onContextMenu: function(e, node){
			var folderid = node.id;
			var toShowContextMenu = false;//是否显示右键菜单
			var contextMenuObject = null ;
			var createuser = "";
			var role = node.attributes.role;
			$.ajax({ 
				url: rootPath+"jasdoc/folder/folder/getFolderBoById.do?folderId="+node.id+"&isPrivilege="+isPrivilege,
				success: function(result){
		        	createuser=result.createuser;
		     	},
		     	async:false
			});
			if( role == folderAllRoleValueAfter[folderAllRoleValueAfter.length - 1] ){
				toShowContextMenu  = true;
				if( folderid!= docCenterFolderId ){
					if(createuser == top.userEventid){
						$('#1000').attr('disabled', false);
					}else{
						$('#1000').attr('disabled', true);
					}
					contextMenuObject =  $('#doccenterdiv');
				}else{
					contextMenuObject =  $('#docparentdiv');
				}
			}
			e.preventDefault();
			if(toShowContextMenu){
				contextMenuObject.menu({
	                onClick:function(item){
	                	if( item.name == '001' ){
	                		currentSelectedTreeNodeObj = node;
	                		currentEditNode = node;
	                		oldFolderName = node.text;
	                		$('#docCenterTree').tree('beginEdit',node.target);
	                	}else if( item.name == '002' ){
	                		addFolder(node ,$('#docCenterTree'));
	                		currentSelectedTreeObj = $('#docCenterTree');
	                		currentSelectedTreeNodeObj = node;
	                	}else if( item.name == '003' ){
	                		currentSelectedTreeNodeObj = node;
	                		deleteFolder(node ,$('#docCenterTree'));
	                	}else if( item.name == '004' ){
	                		updateDefaultFavorite(node);
	                	}else if(item.name == '005'){
	                		downLoadFolder(node);
	                	}else if(item.name == '006'){
	                		var folderId = node.id;
	                		getDlg("../../privilege/privilege/folderAuthorization.htm?folderId="+folderId,'folderAuthorization',"文档授权",
	                				$(window).width()*0.6,$(window).height()*0.6);
	                	}else if(item.name == '009'){
	                		var roleforshare = node.attributes.role;
	                		openPageByTab(node.id+"gx","共享详情","../../jasdoc/folder/file/queryFoderShareDetails.htm?eventid="+node.id+"&createuser="+createuser+"&role="+roleforshare);
	                	}
	                } 
              });
			  contextMenuObject.menu('show', {
	              left: e.pageX,
	              top: e.pageY
			  });
			}
			
		},
		onBeforeDrop:function(target, source, point){
			//拖拽之前，如果源文件夹和目标文件夹具有文件夹维护权限，则运行拖动，否则不允许
			var targetNode = $("#docCenterTree").tree('getNode', target);
			if(targetNode.attributes.role<90){
				return false;
			}
			if(source.attributes.role<90){
				return false;
			}
			alert(point);
			if(point=="append"){
				return false;
			}
			return true;
		
		},
		onDrop : function(targetNode, source, point){
			var targetId = $("#docCenterTree").tree('getNode', targetNode).id;
	        $.ajax({
	            url: rootPath+'jasdoc/folder/doccenter/updateFolderSort.do',
	            type: 'post',
	            dataType: 'json',
	            data: {
	            	folderId: source.id,
	                targetId: targetId,
	                point: point
	            },
	        	success : function(result) {
	        		var data = jQuery.parseJSON( result ); 
					if(data.success=="-1"){
						$.messager.alert('提示', data.message, 'info');
						reloadDocCenterFolder();
					}
				}
	        });
		}
	});*/
	
});
var ztreeObj,folderId,folderLocationName,folderType;
var setting;
function init(){
	$.ajax({
		url: rootPath+"jasdoc/folder/doccenter/queryDocCenterFolderForSync.do?isPrivilege="+isPrivilege,
		dataType:"json",
		type:'post',
		success:function(result){
			setting={
				data: {
					simpleData: {
						enable: false,
						idKey: "id"
					}
				},callback: {
					beforeExpand: zTreeBeforeExpand,
					beforeCollapse: zTreeBeforeCollapse,
					onClick: zTreeOnClick
				},async: {
					enable: true,
					url: rootPath+"jasdoc/folder/doccenter/getChildren.do",
					type:"post",
					dataType:"json",
					autoParam: ['id=folderId','folderType'],
					otherParam: {"isPrivilege":isPrivilege}
				}
			};
			$.fn.zTree.init($("#docCenterTree"), setting, result);
			folderLocationName=result[0].attributes.folderLocationName;
			folderType=result[0].attributes.foldertype;
			folderId = result[0].id;
			var url=rootPath+"jasdoc/folder/docCenter/queryDocCenter.htm";
			$("#content").attr("src",url);
			ztreeObj=$.fn.zTree.getZTreeObj("docCenterTree");
			var rootNode = ztreeObj.getNodeByParam("id",result[0].id,null);
			ztreeObj.selectNode(rootNode);
		}
	});
}
function zTreeBeforeExpand(treeId, treeNode, clickFlag) {
	treeNode.icon = "icon-tree-center-node-open";
	ztreeObj.selectNode(treeNode);
	ztreeObj.updateNode(treeNode);
	folderId = treeNode.id;
	folderLocationName=treeNode.attributes.folderLocationName;
	folderType=treeNode.attributes.foldertype;
	document.getElementById("content").contentWindow.initMessage(null,false);
};
/**
 * 关闭节点之前
 * @param treeId
 * @param treeNode
 */
function zTreeBeforeCollapse(treeId, treeNode){
	treeNode.icon = "icon-tree-center-node-close";
	ztreeObj.updateNode(treeNode);
}
/**
 * 单击节点
 * @param event
 * @param treeId
 * @param treeNode
 * @param clickFlag
 */
function zTreeOnClick(event, treeId, treeNode,clickFlag){
	folderId = treeNode.id;
	folderLocationName=treeNode.attributes.folderLocationName;
	folderType=treeNode.attributes.foldertype;
	ztreeObj.expandNode(treeNode,true,false,true);
	document.getElementById("content").contentWindow.initMessage(null,false);
}

/**
 * 方法描述：修改文件夹信息
 * @param node
 */
function updateFolder(node){
	getDlg("updateFolder.htm?folderId="+node.id,'updateFolder',"修改文件夹",400,180);
}
/**
 * 修改文件夹名称
 * @param node 选中节点
 * @param treeObj 节点所在树
 */
function updateFolderName(node,treeObj){
	var forderId=node.id;
	var newname=node.text;
	var resultBool = false;
	$.ajax({
		type: "POST",
		async:false,
	   	url: rootPath+"jasdoc/folder/doccenter/updateFolderName.do",
   		data: {"folderId":forderId,"folderName":newname},
	   	success: function(data){
	   		var result = eval('(' + data + ')');
	   		if(result.success=="1"){
	   			resultBool= true;
	   		}else{			   	
	   			resultBool= false;
	   			$.messager.alert('提示', result.message, 'info',function (){
					node.text = oldFolderName;
					treeObj.tree("update", node);
					treeObj.tree('beginEdit',node.target);
				});
	   		}
	   		
	   	}
	});
	return resultBool;
}
/**
 * 文件夹打包下载，给出确认框，如果选择是，则下载该文件夹及其子文件夹下的文档，如果选否，则只下载该文件夹下的文档
 * @param node 选中节点
 */
function downLoadFolder(node){
	
	$("<iframe id=\"folderDownload\" style=\"display: none;\"></iframe>").appendTo("body");
	var url=rootPath+"jasdoc/folder/doccenter/downloadDocs.do?folderIds="+node.id+"&folderName="+encodeURI(encodeURI(node.text))+"&token="+ localStorage.getItem("token");
	$("#folderDownload").attr("src",url);
	
	
}

/**
 * 新增文件夹
 * @param node 选中节点
 * @param treeObj 节点所在树
 */
function addFolder(node,treeObj){
	getDlg("addFolder.htm?parentid="+node.id,'addFolder',"新增文件夹",400,160);
}

/**
 * 删除文件夹
 * @param node 选中节点
 * @param treeObj 节点所在树
 */
function deleteFolder(node,treeObj){
	var root =$('#docCenterTree').tree("getRoot");
	var deleteUrl = rootPath+"jasdoc/folder/doccenter/deleteFolder.do";
	var queryurl="queryDocCenter.htm"+"?folderId="+root.id+"&folderLocationName="+root.attributes.folderLocationName;
	$.messager.confirm('提示', '是否确定删除?',function(r){
		if(r){
			$.ajax({
				url : deleteUrl,
				type : 'POST',
				data:{'folderId':node.id},
				success : function(data) {
					reloadDataTree(null,3);
					$("#content").attr("src",queryurl);
				},
				dataType:"json",
				error : function(data) {
					$.messager.alert('提示', '删除失败', 'error');	
				}
			});	
		}
	});
}



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



/*********************************工具栏对应按钮事件 End *********************************************************/

function backDirectory(url, elementId,currentFolderId,directory) {

	var node = null;
	var ztreeObj = $.fn.zTree.getZTreeObj(elementId);
	node = ztreeObj.getNodeByParam("id", currentFolderId, null);
	var parentNode=null;
	for(var i=0;i<directory;i++){
		parentNode=node.getParentNode();
		ztreeObj.expandNode(parentNode, false, false, true);
		node=parentNode;
	}
	folderId = parentNode.id;
	folderLocationName=parentNode.attributes.folderLocationName;
	folderType=parentNode.attributes.foldertype;
	document.getElementById("content").contentWindow.initMessage(null,false);
	ztreeObj.selectNode(parentNode);
}


