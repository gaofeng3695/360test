var docIds = "";
var	fileNames = "";

//加载树
$(function() {
	docIds = getParamter("docIds");
	fileNames = getParamter("fileNames");
	$("#fileNames").val(fileNames);
	queryTree();
}); 
/**	
 * 方法描述：加载初始化树
 */
function queryTree(){
	$('#foldreeventid').combotree({
		url:"../doccenter/queryFavoriteFolderTree.do?token="+localStorage.getItem("token"),
		onBeforeExpand:function(node){
			url="../doccenter/getChildrenTree.do";
		 	$('#foldreeventid').combotree("tree").tree("options").url= url+"?folderId="+node.id+"&folderType=1";
			node.iconCls= 'icon-tree-center-node-open';
		 	$('#foldreeventid').combotree("tree").tree('update', node);
		},
		onClick:function(node){
			if( node.id == docCenterFolderId ){
				$.messager.alert('提示',"文档中心下不允许存放文档",'info');
				$('#foldreeventid').combotree("clear",node);
				return;
			}
			var role = node.attributes.role;
			if(role < folderAllRoleValueAfter[folderAllRoleValueAfter.length - 2]){
				//判断移动的目标文件夹是否有文档维护权限
				$.messager.alert('提示',"对文件夹【"+node.text+"】无维护权限，不能移动到该文件夹下",'info');
				$('#foldreeventid').combotree("clear",node);
				return;
			}
		},
		onBeforeCollapse: function(node){
			node.iconCls= 'icon-tree-center-node-close';
			$('#foldreeventid').combotree("tree").tree('update', node);
		},
		onLoadSuccess:function(node, data){
			console.log(data);
		}
	}); 
}

		
/**
 * 方法描述：保存移动后的关系
 */
function save(){
	var folderId = $("#foldreeventid").combotree('getValue');
	if(folderId==""||folderId==null){
		$.messager.alert('提示',"请选择文件夹",'info');
	}else{
		$.ajax({
			type: "POST",
		   	url: "../doccenter/moveFiles.do",
	   		data: {"docIds":docIds,
	   				"targetFolderId":folderId
	   				},
		   	success: function(re){
		   		if (re.success=="1"){
		   			parent.reloadDataTree(null,0);
		   			if(re.nameRepeat){
		   				$.messager.alert('提示',re.nameRepeat+"移动至文件夹已存在该文档！",'info',function(){
		   					closeMoveFileDlg();
		   				});
		   			}else{
		   				$.messager.alert('提示',re.message,'info',function(){
		   					closeMoveFileDlg();
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
function closeMoveFileDlg(){
	parent.closeDlg('moveFile');
}	
		