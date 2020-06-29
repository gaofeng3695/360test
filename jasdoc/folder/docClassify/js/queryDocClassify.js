var url;
var folderId = "";
//var datagridTitle="";
var deleteDocUrl = "";		//删除的url
var folderLocationName="";

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
			initDataGrid(node.attributes.folderLocationName);
		},onContextMenu:function(e,node){
			e.preventDefault();
			var DocClassifyHierarchy=node.attributes.hierarchy;
			var createMenu=null;
			if(DocClassifyHierarchy.length>8){
				createMenu=$("#DocClassify");
			}else{
				createMenu=$("#DocClassify1");
			}
			createMenu.menu('show',{
				left:e.pageX,
				top:e.pageY
			});
			createMenu.menu({
				onClick:function(item){
					if(item.name=="create"){
						createDocClassify(node.id,DocClassifyHierarchy);
					}else if(item.name=="update"){
						updateDocClassify(node.id);
					}else if(item.name=="delete"){
						deleteClassify(node.id);
						folderId=node.id;
					}
				}
			});
			
		},onBeforeExpand:function(node){
			url=rootPath+"/jasdoc/folder/classify/getChildrenClassify.do";
		 	$('#docClassifyEventId').tree("options").url= url+"?folderId="+node.id;
		 	node.iconCls= 'icon-tree-classify-node-open';
			$('#docClassifyEventId').tree('update', node);
		},onLoadSuccess:function(node,data){
			if(node==null){
				folderId=data[0].id;
				initDataGrid(data[0].attributes.folderLocationName);
			}
		}
	});
}

/**
 * 方法描述：加载文档列表
 */
var selectionsNum = 0;
function initDataGrid(folderLocation){
	var datagridTitle = "当前位置："+folderLocation.substr(1,folderLocation.length-1);
	var width=$('body').width()-$("#docClassifyEventId").width();
	$('#dg').datagrid({
		width:'100%',
		nowrap: false,
		striped: true,
		collapsible:false,
		url:"../classify/getAllClassifyAndFiles.do?folderId="+folderId,
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
					{field : 'eventid',title:"eventid",hidden:true},
					{field : 'folderid',title:"folderid",hidden:true}] ],
		onDblClickRow:function(index,indexData){
			if(indexData.typeFlag==1){
				openFolder(indexData.eventid,indexData.filelocation);
			}else{
				Preview(indexData.eventid);
			}
		},
		onCheck:function(index, row){
			if(row.typeFlag==0 && selectionsNum==0){
				$("#50").linkbutton("enable");
			}else if(row.typeFlag==1){
				$("#50").linkbutton("disable");
			}
			selectionsNum++;
		},onUncheck:function(index, row){
			selectionsNum--;
			setRemoveButton(null,row.eventid);
		},onUncheckAll:function(rows){
			$("#50").linkbutton("disable");
			selectionsNum = 0;
		},onCheckAll:function(rows){
			setRemoveButton(rows);
			selectionsNum = rows.length;
		},onRowContextMenu:function(e, rowIndex, rowData){
			e.preventDefault();
			if(!rowData){
				return;
			}
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
				$('#38').attr('disabled', true);
				$('#47').attr('disabled', true);
				$('#46').attr('disabled', true);
				$('#45').attr('disabled', true);
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
			if(data.msg){
				$.messager.alert('错误', data.msg, data.error);
			}else{
				$('#dg').datagrid('clearSelections'); //clear selected options
			}
	    }
	});
	initDatagrigHeight('dg','docquery',100,'center');
}
/***
 * 创建文档分类文件夹
 */
function createDocClassify(parentid){
	if(arguments.length==0){
		getDlg("addDocClassify.htm?parentid="+folderId,'addDocClassify',"新增文档分类",400,150);
	}else{
		getDlg("addDocClassify.htm?parentid="+parentid,'addDocClassify',"新增文档分类",400,150);
	}
}

/***
 * 修改文档分类文件夹
 * @param folderId
 */
function updateDocClassify(folderId){
	getDlg("updateDocClassify.htm?id="+folderId,'updateDocClassify',"修改文档分类",400,150);
}

function openDocClassify(nodeId,folderlocation){
	var node=$('#docClassifyEventId').tree('find',nodeId);
	if(node!=null){
		var children=$('#docClassifyEventId').tree('getChildren',node.target);
		if(children!=""){
			$('#docClassifyEventId').tree('expand',node.target);
		}
		$('#docClassifyEventId').tree('select',node.target);
	}else{
		folderId=nodeId;
		initDataGrid(folderlocation);
	}
}
function deleteClassify(folderId){
	$.messager.confirm('提示','删除文档分类后，文档分类将放入回收站，您可以通过回收站功能中的还原按钮进行还原，您确定要删除吗？',function(f){
		if(f){
			$.ajax({
				url : rootPath+"jasdoc/folder/classify/deleteDocClassify.do",
				type : 'POST',
				data:{'folderId':folderId},
				dataType:'json',
				success:function(result){
					top.showAlert('提示',result.message , 'info');
					if(result.success==1){
						reloadDataTree(folderId,'delete');
					}
				}
			});
		}
	});
	
}
function shiftDeleteDocClassify(folderId,hierarchy){
	$.messager.confirm('提示','该操作将彻底删除该文档分类，确定继续吗？',function(f){
		if(f){
			$.ajax({
				url : rootPath+"jasdoc/folder/classify/shiftDeleteDocClassify.do",
				type : 'POST',
				data:{'folderId':folderId,'hierarchy':hierarchy},
				dataType:'json',
				success:function(result){
					top.showAlert('提示',result.msg , 'info');
					if(result.success==1){
						reloadDataTree(folderId,'delete');
					}
				}
			});
		}
	});
}
/***
 * 刷新文档分类树
 */
function reloadDataTree(nodeId,operation,nodeObj){
	var node=$("#docClassifyEventId").tree('find',nodeId);
	var parentNode;
	if(node!=null){
		parentNode=$('#docClassifyEventId').tree('getParent',node.target);
	}
	if(operation=='delete'){
		$('#docClassifyEventId').tree('reload',parentNode.target);
		$('#docClassifyEventId').tree('select',parentNode.target);
	}else if(operation=="add"){
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
		$('#docClassifyEventId').tree('select',node.target);
	}else if(operation=='update'){
		var attributes={'folderLocationName':nodeObj.folderlocation};
		$('#docClassifyEventId').tree('update',{'target':node.target,'text':nodeObj.foldername,'attributes':attributes});
		$('#docClassifyEventId').tree('select',node.target);
	}else{
		$('#dg').datagrid('reload');
	}
}

/**
 * 关闭弹出页面
 * @param id
 */
function closeThisDlg(id){
	closeDlg(id);
}
/**
 * 方法描述：添加到文档分类
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
			
			getDlg("../favorite/addToFavorite.htm?docIds="+eventids+"&fileNames="+filenames+"&folderId="+folderId,'favorite','添加收藏',580,162);
			
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
				$.post(deleteDocUrl,{"docIds":ids,"hierarchys":hierarchys,"folderId":folderId,"rd":Math.random()},function(result){
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
		if(row[0].typeFlag==1){
			$.messager.alert('提示','只能对文档进行设置分类！','info');
		}else{
			var fileId=row[0].eventid;
			getDlg("updateFileClassifyInfo.htm?fileId="+fileId,'updateFileClassifyInfo',"修改文档的分类信息",400,150);
		}
	}else{
		$.messager.alert('提示','请选择一条记录！','info');
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
	var url= "../classify/getAllClassifyAndFiles.do?folderId=" + folderId;
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
			if (item.name == '002') {
				openDocClassify(rowData.eventid,rowData.filelocation);
			} else if (item.name == '003') {
				updateDocClassify(rowData.eventid);
			} else if (item.name == '004') {
				deleteClassify(rowData.eventid);  
			}else if (item.name == '005') {
				shiftDeleteDocClassify(rowData.eventid);  
			} else if (item.name == '001') {
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
		getDlg("viewDocClassify.htm?folderId="+eventId,'viewClassify',"文档分类详情",520,370);
	}else{
		//如果是文件，则打开文件详情页面
		getDlg("../file/viewFile.htm?eventid="+eventId,'viewFile',"文档详细",700,400);
	}
}
/**
 * 方法描述：修改文档信息
 * @param sid	选中记录的sid
 */
function updateInfo(eventid){
	getDlg("../file/updateFile.htm?eventid="+eventid,'updateFile',"文档修改",700,350);
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
 *	方法描述：预览
 *	@param eventid	选中记录的eventid
 */
function Preview(eventid,versionid){
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
/**
 * 方法描述：删除文档
 * 
 */
function deleteDoc(eventid,typeFlag){
	if(arguments.length==2){
		if(typeFlag==1){
			//删除文件夹
			$.messager.confirm("删除文档","您确定要删除该文档分类吗？\n\t",function(r){
				if (r){
					$.post('../classify/deletefilereffromclassify.do',
							{"docIds":eventid,"hierarchys":hierarchy},function(result){
						if (result.success=="1"){
							reloadDataTree(eventid,'delete');
						} else {
							$.messager.alert('错误',result.message,"error");
						}
					},'json');
				}
			});
			return;
		}else{
			$.messager.confirm("删除文档","您确定要删除该文档分类中的文档吗？\n\t",function(r){
				if (r){
					$.post('../classify/deletefilereffromclassify.do',
							{"docIds":eventid,"folderId":folderId},function(result){
						if (result.success=="1"){
							reloadDataTree(eventid);
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
			var hierarchys="";
			for(var i=0;i<rows.length;i++){
				var type = rows[i].typeFlag;
				if(type==1){
					$.messager.alert('提示','只支持文档删除操作！','info');
					return;
				}
				docIds += rows[i].eventid+",";
				hierarchys+=rows[i].folderidHierarchy+",";
			}
			docIds = docIds.substring(0,docIds.length-1);
			hierarchys=hierarchys.substring(0,hierarchys.length-1);
			$.messager.confirm("删除文档","您确定要删除该文档分类中的文档吗？\n\t",function(r){
				if (r){
					$.post('../classify/deletefilereffromclassify.do',
							{"docIds":eventid,"folderId":folderId},function(result){
						if (result.success=="1"){
							reloadDataTree(eventid,'delete');
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
 * 方法描述：修改文件夹基本信息
 */
function updateDocClassify(folderid){
	var folderEventId = folderid;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length == 1){
			folderEventId =  rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	getDlg("updateDocClassify.htm?folderId="+folderEventId,'updateDocClassify',"文档修改",450,160);
}

function openFolder(eventid,folderLocation){
	var folderEventId = eventid;
	var location = folderLocation;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length == 1){
			folderEventId=rows[0].eventid;
			location = rows[0].docactualLocation;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	var url= "../classify/getAllClassifyAndFiles.do?folderId=" + folderEventId;
	folderLocationName = location;
	folderId = folderEventId;
	try{
		var tree = parent.$("#docCenterTree");
		var selectedNode = tree.tree("find",folderId);
		tree.tree("select",selectedNode.target);
	}catch(e){
	}
	datagridTitle = "当前位置：" + folderLocationName;
	$("#dg").datagrid("options").url = url;
	$("#dg").datagrid({title:datagridTitle});
	$("#dg").datagrid('load');	
	$("#operation").attr('disabled', true);
}
function setRemoveButton(rows,eventId){
	$("#50").linkbutton("enable");
	if(rows==null || typeof rows =="undefined"){
		rows = $('#dg').datagrid('getSelections');
	}
	if(selectionsNum==0){
		$("#50").linkbutton("disable");
		return;
	}
	for(var i=0;i<rows.length;i++){
		if(rows[i].eventid == eventId){
			continue;
		}
		if(rows[i].typeFlag==1){
			$("#50").linkbutton("disable");
			break;
		}
	}
}