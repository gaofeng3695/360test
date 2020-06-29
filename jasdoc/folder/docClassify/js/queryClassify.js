var url;
var folderId = "";
var hierarchy = "";
var foldertype = "1";
//var datagridTitle="";
var deleteDocUrl = "";		//删除的url

var parentObj = self.parent;
$(function(){
	initDocClassifyTree();
});

/***
 * 初始化文档分类树
 */
function initDocClassifyTree(){
	$('#docClassifyEventId').tree({
		url:rootPath+"/jasdoc/folder/classify/getDocClassifyTreeAsync.do",
		onSelect:function(node){
			folderId=node.id;
			hierarchy=node.attributes.hierarchy;
			initDataGrid(node.attributes.folderLocationName);
		},onLoadSuccess:function(node,data){
			if(node==null){
				folderId=data[0].id;
				hierarchy=data[0].attributes.hierarchy;
				initDataGrid(data[0].attributes.folderLocationName);
			}
		},onBeforeExpand:function(node){
			url=rootPath+"/jasdoc/folder/classify/getChildrenClassify.do";
		 	$('#docClassifyEventId').tree("options").url= url+"?folderId="+node.id;
		 	node.iconCls= 'icon-tree-center-node-open';
			$('#docClassifyEventId').tree('update', node);
		},onLoadSuccess:function(node,data){
			if(node==null){
				folderId=data[0].id;
				hierarchy=data[0].attributes.hierarchy;
				initDataGrid(data[0].attributes.folderLocationName);
			}
		}
//		,onContextMenu:function(e,node){
//			e.preventDefault();
//			var DocClassifyHierarchy=node.attributes.hierarchy;
//			var createMenu=null;
//			if(DocClassifyHierarchy.length>8){
//				createMenu=$("#DocClassify");
//			}else{
//				createMenu=$("#DocClassify1");
//			}
//			createMenu.menu('show',{
//				left:e.pageX,
//				top:e.pageY
//			});
//			createMenu.menu({
//				onClick:function(item){
//					if(item.name=="create"){
//						createDocClassify(node.id,DocClassifyHierarchy);
//					}else if(item.name=="update"){
//						updateDocClassify(node.id);
//					}else if(item.name=="delete"){
//						deleteDocClassif(node.id,DocClassifyHierarchy);
//					}
//				}
//			});
//		}
	});
}

/**
 * 方法描述：加载文档列表
 */

function initDataGrid(folderLocation){
	var datagridTitle = "当前位置："+folderLocation.substr(1,folderLocation.length-1);
	var width=$('body').width()-$("#docClassifyEventId").width();
	$('#dg').datagrid({
		width:'100%',
		nowrap: false,
		striped: true,
		collapsible:false,
		url:"../classify/getAllClassifyAndFiles.do?folderId="+folderId+"&hierarchy="+hierarchy,
		remoteSort: true,
		idField:'eventid',
		pagination:true,
		rownumbers:true,
		toolbar:'#toolbar',
		title:datagridTitle,
	 	columns:[[
	           {field:'ck',title:'全选',checkbox:true}, 
	           {field : 'favorite',title:'文档名称',width : 0.18 * width,formatter:function(value,rowData,rowIndex){
	        	   return getFileNameField(rowData);
	           }}, 
//	           {field:'filename',title:'文档名称',width:0.2*width}, 
	           {field : 'filetype',title : '格式',width : 0.07 * width,formatter:function(value,rowData,rowIndex){
					 var typeFlag = rowData.typeFlag;
					 if(typeFlag==1){
						 return "文件夹";
					 }else{
						 return rowData.filetype;
					 }
				 }},
				 {field : 'createusername',title : '创建人',width : 0.07 * width},  
				 {field : 'uploadtime',title : '创建时间',width : 0.1 * width},  
				 {field : 'updateuser',title : '修改人',width : 0.07 * width},  
				 {field : 'updatetime',title : '修改时间',width : 0.1 * width},  
				 {field : 'filesizeStr',title : '大小(kb)',width : 0.07 * width},
	            {field : 'filelocation',title : '文档位置',width : 0.18 * width,formatter:function(value,rowData,rowIndex){
	            	 var typeFlag = rowData.typeFlag;
	            	 if(typeFlag==1){
	            		 return "";
	            	 }else{
	            		 return rowData.filelocation;
	            	 }
	            }}, 
	           {field:'privilege',title:'我的权限',width:0.09*width,formatter:function(value,rowData,rowIndex){
	        	   return getPrivilegeFieldClassfiy(rowData);
				  }},
				  {field : 'eventid',title:"eventid",hidden:true},
					{field : 'folderid',title:"folderid",hidden:true}] ],
		    
		onDblClickRow:function(index,indexData){
			if(indexData.typeFlag==1){
				onExpandNode(indexData.eventid);
			}else{
				previewDoc(indexData.eventid);
			}
		},
		onClickCell:function(rowIndex, field, value){
		},
		onLoadSuccess:function(data){
			if(data.msg){
				$.messager.alert('错误', data.msg, data.error);
			}else{
				if( foldertype == 1  ){
					var role = data.role;
					$('#toolbar a').each(function(){
						if( role >= $(this).attr('name') ){
							$(this).css("display", "");
						}
					});
					
					if( hierarchy == docCenterRootFolderHierarchy ){
						$("#40").css("display", "none");
					}
				}else if( foldertype == 4  || foldertype == 5 ){ //搜索出的数据只具有移动的权限
					$.each(data.role, function(i, item) {
						if( item==7 ){
							//控制移动 
							$("#"+item).css("display", "");
						}
					});
				}
			}
	    	$('#dg').datagrid('clearSelections'); //clear selected options
	    }
	});
	initDatagrigHeight('dg','docquery',100,'center');
}
function onExpandNode(nodeId){
	var node=$('#docClassifyEventId').tree('find',nodeId);
	var children=$('#docClassifyEventId').tree('getChildren',node.target);
	if(children!=""){
		$('#docClassifyEventId').tree('expand',node.target);
	}
	$('#docClassifyEventId').tree('select',node.target);
}
/***
 * 创建文档分类文件夹
 */
function createDocClassify(folderId,hierarchy){
	getDlg("../docClassify/addDocClassify.htm?parentId="+folderId+"&hierarchy="+hierarchy,'addDocClassify',"新增文档分类",400,150);
}
/***
 * 修改文档分类文件夹
 * @param folderId
 */
function updateDocClassify(folderId){
	getDlg("../docClassify/updateDocClassify.htm?id="+folderId,'updateDocClassify',"修改文档分类",400,150);
}
/***
 * 删除文档分类文件夹
 * @param folderId
 * @param hierarchy
 */
function deleteDocClassif(folderId,hierarchy){
	$.ajax({
		url : rootPath+"jasdoc/folder/classify/deleteDocClassify.do",
		type : 'POST',
		data:{'folderId':folderId,'hierarchy':hierarchy},
		dataType:'json',
		success:function(result){
			top.showAlert('提示',result.msg , 'info');
			if(result.success==1){
				reloadDataTree(folderId);
			}
		}
	});
}
/***
 * 刷新文档分类树
 */
function reloadDataTree(nodeId){
	var node=$("#docClassifyEventId").tree('find',nodeId);
	var childrenNode=$('#docClassifyEventId').tree('getChildren',node.target);
	if(childrenNode=="" || childrenNode==null){
		$("#docClassifyEventId").tree('append',{
			parent:node.target,
			data:[{
				id:'1',
				text:'1'
			}]
		});
	}
	$('#docClassifyEventId').tree('reload',node.target);
}
/**
 * 关闭弹出页面
 * @param id
 */
function closeThisDlg(id){
	closeDlg(id);
}
/**
 * 方法描述：添加到收藏夹
 */
function addToFavorite(){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length > 0){
			var eventids= "" ;
			var filenames = "";
			for(var i=0;i<rows.length-1;i++){
				eventids += rows[i].eventid+",";
				filenames += rows[i].filename+",";
			}
			eventids += rows[rows.length-1].eventid;
			filenames += rows[rows.length-1].filename;
			
			getDlg("../favorite/addToFavorite.htm?eventids="+eventids+"&filenames="+filenames+"&foldertype="+foldertype+"&folderid="+folderId+"&r="+new Date().getTime(),'favorite','添加收藏',580,162);
			
		}else{
			$.messager.alert('提示','请选择记录','info');
		}
}


/**
 * 方法描述：删除文档的分类信息
 * 
 */
function deleteDocFromClassify(){
		deleteDocUrl = '../classify/deletefilereffromclassify.do';
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length > 0){
		var ids="";
		var hierarchys="";
		for(var i=0;i<rows.length-1;i++){
			ids += rows[i].eventid+",";
			hierarchys+=rows[i].folderidHierarchy+",";
		}
		ids += rows[rows.length-1].eventid;
		hierarchys+=rows[rows.length-1].folderidHierarchy;
		$.messager.confirm("删除文档","您确定要删除选择的文档吗？\n\t",function(r){
			if (r){
				$.post(deleteDocUrl,{"ids":ids,"hierarchys":hierarchys,"folderId":folderId,"rd":Math.random()},function(result){
					if (result.success){
							$('#dg').datagrid('reload');	// reload the user data
							$('#dg').datagrid('clearSelections'); 	//clear selected options
					} else {
						$.messager.alert('错误',result.msg,result.error);
					}
				},'json');
			}
		});
	}else{
		$.messager.alert('提示','请选择记录','info');
	}
}
/***
 * 重置文档的分类
 */
function updateFileClassifyInfo(){
	var row=$('#dg').datagrid('getSelections');
	if(row.length==1){
		var fileId=row[0].eventid;
		var hierarchy=row[0].folderidHierarchy;
		getDlg("../docClassify/updateFileClassifyInfo.htm?fileId="+fileId+"&hierarchy="+hierarchy,'updateFileClassifyInfo',"修改文档的分类信息",400,150);
	}else{
		$.messager.alert('提示','请选择一条记录！','info');
	}
}
/**
 * 方法描述：添加到默认收藏夹
 * 
 * @param eventid
 * @param state
 */
function addfavorite(eventid,state){
	if(state=="2"){
		$.ajax({
			url : '../favorite/addDocToFavorite.do',
			type : 'POST',
			data:"docids="+eventid,
			success : function(data) {
 				$("#"+eventid).attr("src","../../common/images/favorite_2.png");
 				$('#dg').datagrid('reload');
			},
			dataType:"json",
			error : function(data) {
				$.messager.alert('提示', '添加默认收藏夹失败', 'error');	
			}
		});	
	}else{
		$.ajax({
				url : '../favorite/deleteFilerefFromFavorite.do',
 				type : 'POST',
 				data:"ids="+eventid,
 				success : function(data) {
	 				$("#"+eventid).attr("src","../../common/images/favorite_1.png");
	 				$('#dg').datagrid('reload');
				},
 				dataType:"json",
 				error : function(data) {
 					$.messager.alert('提示', '从默认收藏夹删除失败', 'error');	
 				}
 			});	
	}
	
}


/**
 * 描述：根据查询条件，查询文档信息
 */
function queryDocByConditions(){
	$("#dg").datagrid('clearSelections'); // clear
	var filename = $("#filename").val();	
	var filetype = $("#filetype").val();
	var uploadtime_start = $("#uploadtime_start").val();
	var uploadtime_end = $("#uploadtime_end").val();
	var fileno = $("#fileno").val();
	var keyword = $("#keyword").val();
	var query = null;
	query={"filename":filename,"filetype":filetype,"uploadtimeStart":uploadtime_start,"uploadtimeEnd":uploadtime_end,"fileno":fileno,"keyword":keyword,"allOrOnlyDocFile":true};
	var url= "../classify/getAllClassify.do?folderid=" + folderId + "&hierarchy=" + hierarchy;
	$("#dg").datagrid("options").url = url;
	$("#dg").datagrid('options').queryParams=query;
	$("#dg").datagrid('load');	
	$("#dg").datagrid('options').queryParams=null;
}
/**
 * 描述：清空查询条件
 */
function clearQueryConditions(){
	$("#filename").val("");
	$("#filetype").val("");
	$("#uploadtime_start").val("");
	$("#uploadtime_end").val("");
	$("#fileno").val("");
	$("#keyword").val("");
}


function previewDoc(eventid){
//	alert(eventid);
	var docId = eventid;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if(rows.length==1){
			var typeFlag = rows[0].typeFlag;
			if(typeFlag==1){
				return;
			}
			var fileType=rows[0].filetype;
			if(previewFileType.indexOf(fileType.toLocaleLowerCase())>-1){

			}else{
				$.messager.alert('提示', "暂时不支持这种类型文档的预览功能！", "info");
				return;
			}
			docId = rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	$.ajax({
//		url:rootPath+ '/jasdoc/folder/doccenter/isExistSwfFile.do?docId='+docId,
		url:rootPath+ '/jasdoc/folder/doccenter/isExistPdfFile.do?docId='+docId,
		dataType:"json",
		success:function(result){
			console.log(result);
			if(result.success==1){
//				var totalPages=result.totalPages;
//				var url = rootPath+ "/jasdoc/folder/preview/FlexPaper_2.0.3/index.html?eventid="+ docId +"&versionid="+versionid+"&totalPages="+totalPages;
				var url = rootPath + "jasdoc/folder/preview/pdfjs_1.10.88/web/viewer.html?eventid="+ docId;
				top.getDlg(url, "viewiframe", "预览", 800, 550, false, true, true);
			}else if(result.success==0){
				parent.showAlert('提示',"正在生成转换文档，可能需要花费一段时间，请稍后重试！" , 'info');
			}else if(result.success==-1){
				parent.showAlert("提示",result.msg,"info");
			}
		 }
	});

}