
var currentSelectedTreeObj;//当前选中的树对象（记录当前选中的是文档中心树、文档分类树、还是文档收藏夹树）
var currentSelectedTreeNodeObj;	//当前选中的树节点对象
var oldFolderName = "";		//用于记录文件夹原名称（修改时  若名称不规范需还原回去）
var currentEditNode = null; //记录当前正在编辑的节点对象
//文档中心根目录层次编号
var docCenterRootFolderHierarchy = top.docCenterRootFolderHierarchy;
$(document).ready(function(){ 
	$('#favoriteTree').tree({		
		url: rootPath+"jasdoc/folder/favorite/queryFavoriteFolderAsync.do",
		onLoadSuccess:function(node,data) {
			if(node==null){
				var root = $('#favoriteTree').tree('getRoot');
				$('#favoriteTree').tree("expand",root.target);
				var url=rootPath+"jasdoc/folder/favorite/queryFavorite.htm";
				url=url+"?folderId="+root.id+"&folderLocationName="+encodeURIComponent(encodeURIComponent(root.attributes.folderLocationName));
				$("#content").attr("src",url);
			}else{
				$("#favoriteTree").tree("select",node.target);
				var url=rootPath+"jasdoc/folder/favorite/queryFavorite.htm";
				url=url+"?folderId="+node.id+"&folderLocationName="+encodeURIComponent(encodeURIComponent(node.attributes.folderLocationName));
				$("#content").attr("src",url);
			}
			
		},
		onClick:function(node){
			if(currentEditNode!=null){
				$(this).tree('endEdit',currentEditNode.target);
			}
			var url=rootPath+"jasdoc/folder/favorite/queryFavorite.htm";
			url=url+"?folderId="+node.id+"&folderLocationName="+encodeURIComponent(encodeURIComponent(node.attributes.folderLocationName));
			$("#content").attr("src",url);
		},
		onBeforeExpand:function(node){
			url=rootPath+"jasdoc/folder/favorite/getChildren.do";
		 	$('#favoriteTree').tree("options").url= url+"?folderId="+node.id;
		 	node.iconCls= 'icon-tree-favorite-node-open';
			$('#favoriteTree').tree('update', node);
		},
		onBeforeCollapse: function(node){
			node.iconCls= 'icon-tree-favorite-node-close';
			$('#favoriteTree').tree('update', node);
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
				$.messager.alert('提示','文件夹名称不能包含空格或者非法字符！','info');
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
			var folderHierarchy = node.attributes.hierarchy;
			var toShowContextMenu = true;//是否显示右键菜单
			e.preventDefault();
			var contextMenuObject = null ;
			if( folderHierarchy.length>8 ){
				contextMenuObject =  $('#favoriteDiv');
			}else{
				contextMenuObject =  $('#favoriteParentDiv');
			}
			
			if(toShowContextMenu){
				contextMenuObject.menu({
	                onClick:function(item){
	                	if( item.name == '001' ){
	                		oldFolderName = node.text;
	                		$('#favoriteTree').tree('beginEdit',node.target);
	                		currentEditNode = node;
	                	}else if( item.name == '002' ){
	                		addFolder(node ,$('#favoriteTree'));
	                		currentSelectedTreeObj = $('#favoriteTree');
	                		currentSelectedTreeNodeObj = node;
	                	}else if( item.name == '003' ){
	                		deleteFolder(node ,$('#favoriteTree'));
	                	}else if( item.name == '004' ){
	                		updateDefaultFavorite(node);
	                	}else if(item.name == '005'){
	                		downLoadFolder(node);
	                	}
	                } 
              });
			  contextMenuObject.menu('show', {
	              left: e.pageX,
	              top: e.pageY
			  });
			}
			
		}
	});
	
});

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
	   	url: rootPath+"jasdoc/folder/favorite/updateFolderName.do",
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
 * 新增文件夹
 * @param node 选中节点
 * @param treeObj 节点所在树
 */
function addFolder(node,treeObj){
	var folderLocationName	= node.attributes.folderLocationName;
	getDlg("addFavorite.htm?parentid="+node.id+"&folderLocationName="+folderLocationName,'addFavorite',"新增收藏夹",400,160);
}

/**
 * 删除文件夹
 * @param node 选中节点
 * @param treeObj 节点所在树
 */
function deleteFolder(node,treeObj){
	var root =$('#favoriteTree').tree("getParent",node.target);
	var deleteUrl = rootPath+"jasdoc/folder/favorite/deleteFavoriteFolder.do";
	var queryurl="queryFavorite.htm"+"?folderId="+root.id+"&folderLocationName="+encodeURIComponent(encodeURIComponent(root.attributes.folderLocationName));
	$.messager.confirm('提示', '删除收藏夹后，收藏夹将放入回收站，您可以通过回收站功能中的还原按钮进行还原，您确定要删除吗？',function(r){
		if(r){
			$.ajax({
				url : deleteUrl,
				type : 'POST',
				data:{'folderId':node.id},
				success : function(data) {
					var parentNode=$('#favoriteTree').tree("getParent",node.target);
					treeObj.tree('remove',node.target);
					var childrenNode=$('#favoriteTree').tree('getChildren', parentNode.target);
					if(childrenNode==""){
						parentNode.iconCls="icon-tree-favorite-node-close";
						$('#favoriteTree').tree('update',parentNode); 
					}
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
    return /^[\u4e00-\u9fa5_a-zA-Z0-9\-\:\：]+$/i.test(value);
}

function reloadDataTree(data,operation){
	if(operation==1){
		//新增
		currentSelectedTreeObj.tree("expand",currentSelectedTreeNodeObj.target);
		var nodeChildren=currentSelectedTreeObj.tree('getChildren', currentSelectedTreeNodeObj.target);
		if(nodeChildren==""){
			currentSelectedTreeObj.tree("append",{
				parent: currentSelectedTreeNodeObj.target,
		        data:[data]
			});
		}
		currentSelectedTreeObj.tree("reload",currentSelectedTreeNodeObj.target);
	}
	
}

//新增文件夹时 动态添加节点
function appendNode(treeData) {
	currentSelectedTreeObj.tree("expand",currentSelectedTreeNodeObj.target);
	var nodeChildren=currentSelectedTreeObj.tree('getChildren', currentSelectedTreeNodeObj.target);
	if(nodeChildren!=""){
		currentSelectedTreeObj.tree("reload",currentSelectedTreeNodeObj.target);
	}else{
		currentSelectedTreeObj.tree("append",{
			parent: currentSelectedTreeNodeObj.target,
	        data:[treeData]
		});
	}
	//展开父节点
	currentSelectedTreeNodeObj.iconCls="icon-tree-favorite-node-open";
	
	currentSelectedTreeObj.tree('update', currentSelectedTreeNodeObj);
	currentSelectedTreeObj.tree("expand",currentSelectedTreeNodeObj.target);
}

/**
 * 刷新收藏夹树
 */
function reloadFavoriteFolder(){
	var url =rootPath+"jasdoc/folder/favorite/queryFavoriteFolder.do";
	$.getJSON(url, function(data){
		var tree=$('#favoriteTree');
		tree.tree("loadData",data);
	});
}

/*********************************工具栏对应按钮事件 End *********************************************************/




