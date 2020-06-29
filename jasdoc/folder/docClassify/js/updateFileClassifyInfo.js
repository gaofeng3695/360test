	var fileId = getParamter("fileId");
//	var folderid=getParamter("folderid");
	$(document).ready(function(){
		$('#folderClassifyId').combotree({
			url:rootPath+"/jasdoc/folder/classify/getDocClassifyTreeSync.do",
			cascadeCheck:false,
			multiple:true,
			onLoadSuccess:function(node,data){
				init(fileId);
			}
		});
		setComboObjWidth('folderClassifyId',0.77,'combotree');
	});
	/***
	 * 初始化页面
	 * @param fileId 文件id
	 */
	function init(fileId){
		$.ajax({
			url: rootPath+"jasdoc/folder/classify/queryFileClassifyInfo.do",
			type : 'POST',
		    data:{"fileId":fileId},
		    dataType:'json',
		    success : function(result){
				$('#fileId').attr('value',result.eventid);
				$('#filename').attr('value',result.filename);
				var fileclassify=result.fileclassify;
				var fileclassifys=fileclassify.split(',');
				var treeObj=$('#folderClassifyId').combotree('tree');
				for(var i=0;i<fileclassifys.length;i++){
					var node=treeObj.tree('find',fileclassifys[i]);
					if(node!=null){
						treeObj.tree('check',node.target);
					}
				}
			}
		});
	}
	/**
	 * 展开节点
	 * @param treeObj 文档分类的树对象
	 * @param id 节点id
	 */
	function  expandNode(treeObj,id){
		var node=treeObj.tree('find',id);
		var parentNode=treeObj.tree('getParent',node.target);
		if(parentNode!=null){
			treeObj.tree('expand',parentNode.target);
			expandNode(treeObj,parentNode.id);
		}
	}
	/**
	 * 保存修改结果
	 */
	function save(){
//		alert(rootPath+"jasdoc/folder/classify/updateFileClassifyInfo.do");
		$('#updateClassifyfrom').form('submit', {
			url : rootPath+"jasdoc/folder/classify/updateFileClassifyInfo.do?token="+localStorage.getItem("token"),
			onSubmit : function() {
				return $(this).form('validate');
			},
			success : function(data) {
				var result = eval('(' + data + ')');
				top.showAlert('提示',result.msg , 'info');
				if(result.success==1){
					parent.reloadDataTree();
					closeFolder();
				}
			}
		});
//		$.ajax({
//			url:rootPath+"jasdoc/folder/classify/updateFileClassifyInfo.do",
//			type:'POST',
//			data:{},
//			
//		});
	}
	/**
	 * 关闭页面
	 */
	function closeFolder(){
		parent.closeThisDlg("updateFileClassifyInfo");
	}