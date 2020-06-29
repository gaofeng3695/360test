var docIds = "";
var	fileNames = "";
var oldFolderId = "";

//加载树
	$(function() {
		docIds = getParamter("docIds");
		fileNames = getParamter("fileNames");
		oldFolderId = getParamter("folderId");
//		alert(oldFolderId);
		$("#fileNames").text(fileNames);
		queryFavoriteTree();
	}); 
/**	
 * 方法描述：加载初始化树
 */
function queryFavoriteTree(){
	$('#foldreeventid').combotree({
		url:rootPath+"jasdoc/folder/favorite/queryFavoriteFolder.do",  
		onBeforeExpand:function(node){
			url=rootPath+"jasdoc/folder/favorite/getChildren.do";
		 	$('#foldreeventid').combotree("tree").tree("options").url= url+"?folderId="+node.id;
		 	node.iconCls= 'icon-tree-favorite-node-open';
		 	$('#foldreeventid').combotree("tree").tree('update', node);
		},onBeforeCollapse: function(node){
			node.iconCls="icon-tree-favorite-node-close";
			$('#foldreeventid').combotree("tree").tree('update', node);
		},onLoadSuccess:function(node, data){
		},onBeforeSelect:function(node,data){
			if(oldFolderId==node.id){
				$.messager.alert('提示',"文档不能移动到同一个收藏夹下，请选择其他收藏夹！",'info');
				return false;
			}
		}
	}); 
}
		
		
/**
 * 方法描述：保存移动后的关系
 */
function save(){
	url = "../favorite/moveDocsInFavorite.do";
	var folderId = $("#foldreeventid").combotree('getValue');
	if(folderId==""||folderId==null){
		$.messager.alert('提示',"请选择文件夹",'info');
	}else{
		$.ajax({
			type: "POST",
		   	url: url,
	   		data: {"docIds":docIds,
	   				"folderId":folderId,
	   				"oldFolderId":oldFolderId
	   				},
		   	success: function(re){
		   		if (re.success=="1"){
		   			parent.reloadDataTree(null,0);
		   			if(re.nameRepeat){
		   				$.messager.alert('提示',"目标文件夹已存在以下文档："+re.nameRepeat,'info',function(){
		   					closeMoveDlg();
		   				});
		   			}else{
		   				$.messager.alert('提示',re.message,'info',function(){
		   					closeMoveDlg();
		   				});
		   			}
		   			
				} else {
					$.messager.alert('错误',re.message,"error");
				}
			}
		});
	}
	
}

	
	/**
	 * 方法描述： 关闭界面
	 */
	function closeMoveDlg(){
		parent.closeDlg('move');
	}	
		