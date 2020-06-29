/**
 * 
 * 文件描述: 我的收藏夹
 * create by Shenjie 2015-6-10 15:13
 */

var url;
var folderId = "";
var folderLocationName = "";


/**
 * 页面初始化
 */
$(function(){
	folderLocationName = getParamter("folderLocationName");
	folderLocationName = decodeURIComponent(decodeURIComponent(folderLocationName));
	folderId = getParamter("folderId");
	datagridTitle = "当前位置："+folderLocationName;
	var width=$('body').width();
	$('#dg').datagrid({
		width:'100%',
		nowrap: false,
		striped: true,
		collapsible:false,
		url:"../favorite/getAllFavorite.do?folderId="+folderId,
		remoteSort: true,
		idField:'eventid',
		pagination:true,
		rownumbers:true,
		toolbar:'#toolbar',
		title:datagridTitle,
		columns : [[{field : 'ck',title : '全选',checkbox : true}, 		        					
		            {field : 'filename',title : '名称',width : 0.18 * width,formatter:function(value,rowData,rowIndex){
						return getFileNameField(rowData);
					 }}, 
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
					{field : 'privilege',title : '我的权限',width : 0.09 * width,formatter:function(value,rowData,rowIndex){
						return getPrivilegeField(rowData);
					  }},
				{field : 'eventid',title:"eventid",hidden:true} ] ],
		    
		onDblClickRow:function(index,indexData){
			var typeFlag = indexData.typeFlag;
			if(typeFlag==1){
				//文件夹双击打开
				openFolder(indexData.eventid,indexData.filelocation);
			}else{
				//文件双击预览
				var eventid=indexData.eventid;
				if( indexData.preview == 1 ){
					Preview(eventid);
				}else{
					$.messager.alert('提示','对不起，您没有预览权限！','info');
				}
			}
		},
		onClickCell:function(rowIndex, field, value){
		},
		onRowContextMenu:function(e, rowIndex, rowData){
			e.preventDefault();
			var typeFlag = rowData.typeFlag;
			if(typeFlag==1){
				//如果是文件夹，则打开文件夹右键菜单
				$('#folderManager').menu('show', {
					left : e.pageX,
					top : e.pageY
				});
				operationFolderContextMenu(rowData);
			}else{
				//如果是文件，则打开文件右键菜单
				$('#fileManager').menu('show', {
					left : e.pageX,
					top : e.pageY
				});
				$('#18').attr('disabled', false);
				$('#17').attr('disabled', false);
				$('#28').attr('disabled', true);
				$('#39').attr('disabled', true);
				var role = rowData.hierarchyRole;
				$('#fileManager div').each(function() {
					
					if (role >= $(this).attr('id')) {
						$(this).attr('disabled', false);
					}
				});
				operationFileContentMenu(rowData);
			}
		},
		onLoadSuccess:function(data){
			//debugger
			if(data.msg){
				$.messager.alert('错误', data.msg, data.error);
			}else{
				var role = data.role;
				$('#toolbar a').each(function(){
					//alert($(this).attr('name'));
					if( role >= $(this).attr('name') ){
						$(this).css("display", "");
					}
				});
			}
	    	$('#dg').datagrid('clearSelections'); //clear selected options
	    }
	});	
	initDatagrigHeight('dg','',0);

	
});


/**
 * 方法描述：移动文档
 * 
 */
function moveFile(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length > 0){
		var eventids= "" ;
		var filenames = "";
		for(var i=0;i<rows.length;i++){
			var typeFlag = rows[i].typeFlag;
			if(typeFlag==1){
				$.messager.alert('提示','只能移动文档！','info');
				return;
			}
			eventids += rows[i].eventid+",";
			filenames += rows[i].filename+",";
		}
		eventids = eventids.substring(0, eventids.length-1);;
		filenames = filenames.substring(0, filenames.length-1);;
		if( eventids != "" ){
			getDlg("moveFile.htm?docIds="+eventids+"&fileNames="+filenames+"&folderId="+folderId,'move','移动文档',580,162);
		}else{
			$.messager.alert('提示','请选择有移动权限的记录','info');
		}
	}else{
		$.messager.alert('提示','请选择记录','info');
	}
}		
		
/**
 * 方法描述：删除文档
 * 
 */
function deleteDoc(eventid,typeFlag){
	if(arguments.length==2){
		if(typeFlag==1){
			//删除文件夹
			$.messager.confirm("删除文档","您确定要删除该收藏夹吗？\n\t",function(r){
				if (r){
					$.post("../favorite/deleteFavoriteFolder.do",
							{"folderId":eventid},function(result){
						if (result.success=="1"){
							reloadDataTree(null,3);
						} else {
							$.messager.alert('错误',result.message,"error");
						}
					},'json');
				}
			});
			return;
		}else{
			$.messager.confirm("删除文档","您确定要删除该收藏夹中的文档吗？\n\t",function(r){
				if (r){
					$.post("../favorite/deleteFileFromFavorite.do",
							{"docIds":eventid,"folderId":folderId},function(result){
						if (result.success=="1"){
							reloadDataTree(null,0);
						} else {
							$.messager.alert('错误',result.message,"error");
						}
					},'json');
				}
			});
		}
	}else{
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length > 0){
			var docIds="";
			for(var i=0;i<rows.length;i++){
				var type = rows[i].typeFlag;
				if(type==1){
					$.messager.alert('提示','只支持文档删除操作！','info');
					return;
				}
				docIds += rows[i].eventid+",";
			}
			docIds = docIds.substring(0,docIds.length-1);
			$.messager.confirm("删除文档","您确定要删除该收藏夹中的文档吗？\n\t",function(r){
				if (r){
					$.post("../favorite/deleteFileFromFavorite.do",
							{"docIds":docIds,"folderId":folderId},function(result){
						if (result.success=="1"){
							reloadDataTree(null,0);
						} else {
							$.messager.alert('错误',result.message,"error");
						}
					},'json');
				}
			});
		}else{
			$.messager.alert('提示','请选择记录','info');
		}
	}
	
}
/**
 * 方法描述：打开文件夹
 */
function openFolder(eventid,folderLocation){
	var folderEventId = eventid;
	var location = folderLocation;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length == 1){
			folderEventId=rows[0].eventid;
			location = rows[0].filelocation;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	var url= "../favorite/getAllFavorite.do?folderId="+folderEventId;
	folderLocationName = location;
	folderId = folderEventId;
	datagridTitle = "当前位置："+folderLocationName;
	$("#dg").datagrid("options").url = url;
	$("#dg").datagrid({title:datagridTitle});
	$("#dg").datagrid('load');	
}
/**
 * 方法描述：为文件夹右键菜单添加响应事件
 */
function operationFolderContextMenu(rowData){
	$('#folderManager').menu({
		onClick : function(item) {
			var disabled = $("#"+item.id).attr("disabled");
			if(disabled=="disabled"){
				return;
			}
			if (item.name == 'openSingleFolder') {
				openFolder(rowData.eventid,rowData.filelocation);
			} else if (item.name == 'updateSingleFolder') {
				updateFolder(rowData.eventid);
			} else if (item.name == 'deleteSingleFolder') {
				deleteFolder(rowData.eventid);  
			}else if (item.name == 'shiftDeleteSingleFolder') {
				shiftDeleteFolder(rowData.eventid);  
			} else if (item.name == 'viewSingleFolder') {
				viewDetailInfo(rowData.eventid,1);
			}
		}
	});
}
/**
 * 方法描述：为文件右键菜单添加响应事件
 */
function operationFileContentMenu(rowData){
	$('#fileManager').menu({
		onClick : function(item) {
			var disabled = $("#"+item.id).attr("disabled");
			if(disabled=="disabled"){
				return;
			}
			if (item.name == '001') {
				viewDetailInfo(rowData.eventid,0);
			} else if (item.name == '004') {
				updateInfo(rowData.eventid);
			} else if (item.name == '003') {
				downloadDoc(rowData.eventid);
			} else if (item.name == '002') {
				var fileType = rowData.filetype;
				if(fileType!=null&&fileType!=""){
					if(previewFileType.indexOf(fileType.toLocaleLowerCase())>-1){
						Preview(rowData.eventid);
					}else{
						$.messager.alert('提示', "暂时不支持这种类型文档的预览功能！", "info");
					}
				}
			}else if (item.name == '005') {
				deleteDoc(rowData.eventid,0);
			}
		}
	});
}
/**
 * 方法描述：创建收藏夹
 */
function createFolder(){
	getDlg("addFavorite.htm?parentid="+folderId+"&folderLocationName="+folderLocationName,'addFavorite',"新增收藏夹",400,160);
}

/**
 * 方法描述：下载
 * @param eventid	选中记录的eventid
 */
function downloadDoc(eventid){
	$("<iframe id=\"fileDownload\" style=\"display: none;\"></iframe>").appendTo("body");
	var url="../doccenter/downloadDoc.do?docId="+eventid+"&token="+ localStorage.getItem("token");
	$("#fileDownload").attr("src",url);
}

/**
 * 方法描述：修改文件夹基本信息
 */
function updateFolder(folderId){
	var folderEventId = folderId;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length == 1){
			folderEventId =  rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	getDlg("updateFavorite.htm?folderId="+folderEventId,'updateFolder',"收藏夹修改",450,180);
}	
/**
 * 方法描述：删除文件夹
 */
function deleteFolder(folderId){
	var folderEventid = folderId;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length == 1){
			folderEventid = rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	$.messager.confirm('提示', '删除收藏夹后，收藏夹将放入回收站，您可以通过回收站功能中的还原按钮进行还原，您确定要删除吗？',function(r){
		if(r){
			$.ajax({
				url : rootPath+"jasdoc/folder/favorite/deleteFavoriteFolder.do",
				type : 'POST',
				data:{'folderId':folderEventid},
				success : function(data) {
					reloadDataTree(folderEventid,3);
				}
			});	
		}
	});
}
/**
 * 方法描述：彻底删除文件夹
 */
function shiftDeleteFolder(folderId){
	var folderEventid = folderId;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length == 1){
			folderEventid = rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	$.messager.confirm('提示', '该收藏夹将被彻底删除，不可还原，您确定要删除吗?',function(r){
		if(r){
			$.ajax({
				url : rootPath+"jasdoc/folder/favorite/shiftDeleteFavoriteFolder.do",
				type : 'POST',
				data:{'folderId':folderEventid},
				success : function(data) {
					reloadDataTree(folderEventid,3);
				}
			});	
		}
	});
}
/**
 * 方法描述：查看文件或文件夹详情
 */	
function viewDetailInfo(eventid,typeFlag){
	var eventId = eventid;
	var flag = typeFlag;
	if(arguments.length == 0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length == 1){
			eventId = rows[0].eventid;
			flag = rows[0].typeFlag;
		}else{
			$.messager.alert('提示','请选择一条记录！','info');
			return;
		}
	}
	if(flag==1){
		//如果是文件夹，则打开文件夹详情页面
		getDlg("viewFavorite.htm?folderId="+eventId,'viewFavorite',"收藏夹详情",520,370);
	}else{
		//如果是文件，则打开文件详情页面
		getDlg("../file/viewFile.htm?eventid="+eventId,'viewFile',"文档详细",700,400);
	}
}

/**
 * 方法描述：修改
 * @param sid	选中记录的sid
 */
function updateInfo(eventid){
	getDlg("../file/updateFile.htm?eventid="+eventid,'updateFile',"文档修改",700,350);
}

/** 
 *	方法描述：预览
 *	@param eventid	选中记录的eventid
 */
function Preview(eventid,versionid){
	$.ajax({
//		url:rootPath+ '/jasdoc/folder/doccenter/isExistSwfFile.do?docId='+eventid,
		url:rootPath+ '/jasdoc/folder/doccenter/isExistPdfFile.do?docId='+eventid,
		dataType:"json",
		success:function(result){
			if(result.success==1){
//				var totalPages=result.totalPages;
//				var url = rootPath+ "/jasdoc/folder/preview/FlexPaper_2.0.3/index.html?eventid="+ eventid +"&versionid="+versionid+ "&totalPages="+totalPages;
				var url = rootPath + "jasdoc/folder/preview/pdfjs_1.10.88/web/viewer.html?eventid="+ docId +"&versionid="+versionid;
				top.getDlg(url, "viewiframe", "预览", 800, 550, false, true, true);
			}else if(result.success==0){
				parent.showAlert('提示',"正在生成转换文档，可能需要花费一段时间，请稍后重试！" , 'info');	
			}else if(result.success==-1){
				parent.showAlert("提示",result.msg,"info");
			}
		}
	});
	
}
function reloadDataTree(data,operation){
	if(operation==0){
		//文档移动页面
		$("#dg").datagrid('reload');
		$('#dg').datagrid('clearSelections'); 
	}else if(operation==1){
		//新增页面刷新父页面
		try{
			//刷新收藏夹树
			var tree = parent.$("#favoriteTree");
			var nodeParent=tree.tree('find', folderId);
			tree.tree("expand",nodeParent.target);
			var nodeChildren=tree.tree('getChildren', nodeParent.target);
			if(nodeChildren==""){
				tree.tree("append",{
					parent: nodeParent.target,
			        data:[data]
				});
			}
			tree.tree("reload",nodeParent.target);
		}catch(e){
			$("#dg").datagrid('reload');
		}
	}else if(operation==2){
		//修改页面刷新父页面
		try{
			//刷新收藏夹树
			var tree = parent.$("#favoriteTree");
			var nodeParent=tree.tree('find', folderId);
			tree.tree("reload",nodeParent.target);
		}catch(e){
			$("#dg").datagrid('reload');
		}
		
	}else if(operation==3){
		//删除操作刷新父页面
		try{
			//刷新收藏夹树
			var tree = parent.$("#favoriteTree");
			var node = tree.tree("find",data);
			var nodeParent=tree.tree('find', folderId);
			tree.tree('remove',node.target);
			var childrenNode=tree.tree('getChildren', nodeParent.target);
			if(childrenNode==""){
				nodeParent.iconCls="icon-tree-favorite-node-close";
				tree.tree('update',nodeParent); 
			}
			$("#dg").datagrid('reload');
			
		}catch(e){
			$("#dg").datagrid('reload');
		}
	}
}