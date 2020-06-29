/** * create by Shenjie 2015-6-4
 * 
 * 权限控制说明：
 *    1、四级权限控制：查看、下载、文档维护、完全控制，各级权限说明如下：
 *    		查看（20）：查看文档（）、查看文件夹、预览文档、打开文件夹	--------默认具有查看权限(只要该部门具有查看某个文件夹的权限，则默认部门下的用户具有该文件夹及子文件夹的查看权限)
 * 			下载(30)：下载文档、下载文件夹
 * 			文档维护(60)：文档上传、文档修改、文档删除
 * 			完全控制(90):创建文件夹、文件夹修改、文件夹删除、文件夹授权、文档分类、文档移动等
 * 	  2、页面中各操作权限ID号说明如下：
 * 		
 * 		查看：1--20(已使用13-20)
 * 		下载：21--30(已使用25-30)
 * 		文档维护：31--60(已使用44-60)
 * 		文件夹维护：61-90(已使用79-90)
 * 
 * 			文档操作：
 * 				工具栏按钮：
 * 					查看级别权限：查看(20)、预览(19)、查看历史版本、收藏
 * 					下载级别权限：下载(30)、批量下载(29)
 * 					文档维护级别权限：修改(60)、删除(59)、彻底删除(58)、移动(57)、分类(56)、批量删除(55)、批量彻底删除(54)、批量移动(53)、批量分类(52)、共享(51)、版本(50)、关联(49)
 * 					//无文档维护级别权限时，文件创建者和登录用户为同一人：共享、版本更新、关联
 * 					
 * 				右键菜单：
 * 					查看级别权限：查看(18)、预览(17)
 * 					下载级别权限：下载(28)
 * 					文档维护级别权限：修改(48)、共享(47)、版本(46)、关联(45)
 * 					//无文档维护级别权限时，文件创建者和登录用户为同一人：共享、版本、关联
 * 				
 * 			文件夹操作：
 * 				工具栏按钮：
 * 					查看级别权限：查看(16)、打开(15)
 * 					下载级别权限：下载(27)
 * 					文档维护级别权限：
 * 					文件夹维护权限：修改(90)、删除(89)、角色授权(88)、部门授权(87)、共享文件夹(86)
 * 
 *					//无文件夹维护权限时，文件创建者和登录用户为同一人： 共享文件夹
 * 
 * 
 * 				右键菜单：
 * 					查看级别权限：查看(14)、打开(13)
 * 					下载级别权限：下载(26)
					文件夹维护权限：修改(85)、删除(84)、角色授权(83)、部门授权(82)、共享文件夹(81)
					无文件夹维护权限时，文件创建者和登录用户为同一人： 共享文件夹
 * 
 * 			datagrid工具栏按钮：
 * 					下载级别权限：下载(25)
 * 					文档维护级别权限：上传(44)
 * 					文件夹维护权限：创建文件夹(80)
 * 					文档导入（只有管理员可用）
 * 				
 */


//var url;
var folderId = "";
var foldertype = "1";
var deleteDocUrl = "";		//删除的url
var folderLocationName = "文档中心";
var back = " &nbsp;&nbsp;<img id='back' style='cursor:pointer;' src='../common/images/undo.png' height='14px;' alt='上一级'/>";
var backFolderId = "";
var backFolderLocationName = "文档中心";

var searchstring="";
var filename="";
var fileno="";
var keyword="";
var summary="";
var remark="";
var fileclassifys="";
var uploadtimeStart="";
var uploadtimeEnd="";
var filepath="";
var addFileAssociation = new Array();
var removeFileAsscoiation = new Array();

$(document).ready(function(){ 
	initMessage(null,false);
	getSelectDoc();
	document.body.onresize = function(){
		$('#docDataGrid').datagrid('resize', {
			width : $(window).width()-4,
			height : $(window).height()*0.6-$("#southId").height()-3
		});
	}
});



/**
	* 方法描述：加载文档列表
	*/	
function initMessage(menuUrl,allOrOnlyDocFile) {
	folderId = parent.folderId;
	var datagridTitle = '文档列表';
	folderLocationName=parent.folderLocationName;
	backFolderLocationName = folderLocationName;
	backFolderId = folderId;
	datagridTitle = "当前位置：" + getTitle(folderLocationName);
	var queryDocUrl = "";
	if (menuUrl != null && "" != menuUrl) {
		var p = menuUrl.substr(0).split("&");
		$.each(p, function(i, item) {
			var d = item.split("=");
			if (d[0] == 'foldertype') {
				foldertype = d[1];
			}
			if (d[0] == 'filename') {
				filename = d[1];
			}
			if (d[0] == 'fileno') {
				fileno = d[1];
			}
			if (d[0] == 'keyword') {
				keyword = d[1];
			}
			if (d[0] == 'summary') {
				summary = d[1];
			}
			if (d[0] == 'remark') {
				remark = d[1];
			}
			if (d[0] == 'fileclassifys') {
				fileclassifys = d[1];
			}
			if (d[0] == 'uploadtimeStart') {
				uploadtimeStart = d[1];
			}
			if (d[0] == 'uploadtimeEnd') {
				uploadtimeEnd = d[1];
			}
			if (d[0] == 'searchstring') {
				searchstring = d[1];
			}
			if (d[0] == 'filepath') {
				filepath = d[1];
			}
		});
	}
	var queryParams=null;
	if (foldertype == 1) { //allOrOnlyDocFile
		if(allOrOnlyDocFile){
			queryDocUrl =rootPath+"jasdoc/folder/doccenter/getAllDoc.do?folderId=" + folderId+"&allOrOnlyDocFile="+allOrOnlyDocFile+"&isPrivilege="+isPrivilege;
		}else{
			queryDocUrl = rootPath+"jasdoc/folder/doccenter/getAllDoc.do?folderId=" + folderId+"&isPrivilege="+isPrivilege;
		}
	} else if (foldertype == 4) {
		queryDocUrl = rootPath+"jasdoc/search/queryFolderByAttribute.do?";
		queryParams={"filename":decodeURI(decodeURI(filename)),"fileno":decodeURI(decodeURI(fileno)),
				"keyword":decodeURI(decodeURI(keyword)),"summary":decodeURI(decodeURI(summary)),"remark":decodeURI(decodeURI(remark)),
				"fileclassifs":fileclassifys,"uploadtimeStart":uploadtimeStart,"uploadtimeEnd":uploadtimeEnd,
				"filepath":decodeURI(decodeURI(filepath)),"folderId":folderId,"isPrivilege":isPrivilege};
	} else if (foldertype == 5) {
		queryDocUrl = rootPath +"jasdoc/search/querySearchByIndex.do?searchstring="+ encodeURI(encodeURI(searchstring))+"&folderId="+folderId;
	}else{
		queryDocUrl = rootPath + "jasdoc/folder/doccenter/getAllDoc.do?folderId=" + folderId +"&allOrOnlyDocFile="+allOrOnlyDocFile;
	}
	var width = $('body').width();
	$('#docDataGrid').datagrid({
		width : '100%',
		nowrap : false,
		collapsible : false,
		url : queryDocUrl,
		remoteSort : true,
		idField : 'eventid',
		title : datagridTitle,
		toolbar : "#docDataGridToolbar",
		queryParams:queryParams,
		checkOnSelect:false,
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
					 {field : 'uploadtime',title : '创建时间',width : 0.11 * width},  
					 {field : 'updateuser',title : '修改人',width : 0.07 * width},  
					 {field : 'updatetime',title : '修改时间',width : 0.11 * width},  
		         
					 {field : 'filesizeStr',title : '大小(kb)',width : 0.07 * width},
					 {field : 'docactualLocation',title : '文档位置',width : 0.18 * width,formatter:function(value,rowData,rowIndex){
		            	 var typeFlag = rowData.typeFlag;
		            	 if(typeFlag==1){
		            		 return "";
		            	 }else{
		            		 return rowData.docactualLocation;
		            	 }
		            }},
				{field : 'eventid',title:"eventid",hidden:true} 
		]],
		onDblClickRow : function(index, rowData) {
			var typeFlag = rowData.typeFlag;
			if(typeFlag==1){
				//如果是文件夹，则打开文件夹
				openFolder(rowData.eventid,rowData.docactualLocation);
			}else{
				//如果是文件，则进行预览
				var eventid = rowData.eventid;
				var fileType = rowData.filetype;
				if(fileType!=null&&fileType!=""){
					if(previewFileType.indexOf(fileType.toLocaleLowerCase())>-1){
						previewDoc(eventid);
					}else{
						$.messager.alert('提示', "暂时不支持这种类型文档的预览功能！", "info");
					}
				}
			}
		},
		onLoadSuccess : function(data) {
			//debugger
			if (data.msg) {
				$.messager.alert('错误', data.msg, data.error);
			}
//			$('#docDataGrid').datagrid('clearSelections'); //clear selected options
		},onCheck:function(index,row){
			var typeFlag = row.typeFlag;
    		if(typeFlag==1){
    			//文件夹操作
    			$(this).datagrid("uncheckRow",index);
    			$.messager.alert('提示', "暂时不支持关联文件夹！", "info");
    		}else{
    			//文件操作
    			$('#selectDocDataGrid').datagrid("appendRow",{
    				fileName:row.filename,
    				fileType:row.filetype,
					createUserName:row.createusername,
					createTime:row.uploadtime,
					modifyUserName:row.updateuser,
					modifyTime:row.updatetime,
					fileSize:row.filesizeStr,
					fileUrl:row.docactualLocation,
					eventid:row.eventid
    			});
    			addFileAssociation.push(row.eventid);
    		}
		},onUncheck:function(index, row){
			var indexof = addFileAssociation.indexOf(row.eventid);
			if(indexof>-1){
				addFileAssociation.splice(indexof,1);
			}
			var removeIndex = $('#selectDocDataGrid').datagrid("getRowIndex",row.eventid);
			$('#selectDocDataGrid').datagrid("deleteRow",removeIndex);
		}
	});
	$("#back").click(function(){
		goHistory(backFolderId,backFolderLocationName);
	});
	initDatagrigHeight('docDataGrid', '',100,"unSelectDoc");
}
function getSelectDoc(){
	var width = $('body').width();
	var url = rootPath+"jasdoc/association/getPageInfo.do";
	$('#selectDocDataGrid').datagrid({
		width : '100%',
		nowrap : false,
		collapsible : false,
		url : url,
		remoteSort : true,
		idField : 'eventid',
		title : "已关联文件",
		toolbar : "#selectToolbar",
		pageSize: 50,
		queryParams:{"businessId":parent.businessId,"businessType":"file"},
		checkOnSelect:false,
		columns : [[{field : 'ck',title : '全选',checkbox : true},
		            {field : 'fileName',title : '名称',width : 0.18 * width,formatter:function(value,rowData,rowIndex){
		            	rowData.typeFlag=0;
		            	rowData.filename=rowData.fileName;
						return getFileNameField(rowData);
					 }}, 
					 {field : 'fileType',title : '格式',width : 0.07 * width},
					 {field : 'createUserName',title : '创建人',width : 0.07 * width},
					 {field : 'createTime',title : '创建时间',width : 0.11 * width},  
					 {field : 'modifyUserName',title : '修改人',width : 0.07 * width},  
					 {field : 'modifyTime',title : '修改时间',width : 0.11 * width},
		         
					 {field : 'fileSize',title : '大小(kb)',width : 0.07 * width,formatter:function(value,rowData,rowIndex){
						 if(typeof value != 'undefined'){
							 return (value/1024).toFixed(2);
						 }
					 }},
					 {field : 'fileUrl',title : '文档位置',width : 0.18 * width},
					 {field : 'eventid',title:"eventid",hidden:true} 
		]],
		onLoadSuccess : function(data) {
			//debugger
			if (data.msg) {
				$.messager.alert('错误', data.msg, data.error);
			}
			$('#selectDocDataGrid').datagrid('clearSelections'); //clear selected options
		},onBeforeUncheck:function(index,row){
			return false;
		}
	});

	initDatagrigHeight('selectDocDataGrid', '',100,"selectDoc");
}

function getFileNameField(rowData){
	var fileName = rowData.filename;
	var fileNameField="";
	var typeFlag = rowData.typeFlag;
	if(typeFlag==1){
		fileNameField="<img src='../common/images/folder.png'/> "+fileName;
	}else{
		fileNameField=fileName;
	}
	return fileNameField;
}


var showAllFileFlag=1;
function showAllFile(){
	if(showAllFileFlag==1){
		initMessage(null,true);
		showAllFileFlag=2;
	}else if(showAllFileFlag==2){
		initMessage(null,false);
		showAllFileFlag=1;
	}
}


/**
 * 方法描述：打开文件夹
 */
function openFolder(eventid,folderLocation){
	folderLocationName = folderLocation;
	folderId = eventid;
	try{
		var tree = parent.$("#docCenterTree");
		var selectedNode = tree.tree("find",folderId);
		console.log(selectedNode);
		var isLeaf = tree.tree("isLeaf",selectedNode.target);
		if(isLeaf){
			tree.tree('select', selectedNode.target);
			initMessage(null,false);
		}else{
			tree.tree("expand",selectedNode.target);
		}
	}catch(e){
	}
}




function goHistory(eventid,folderLocation){
	openFolder(eventid,folderLocation);
}
function getTitle(folderLocationName){
	var arrayFolderName=folderLocationName.split("/");
	var newLocation="";
	var length=arrayFolderName.length-1;
	for(var i=1;i<arrayFolderName.length;i++){
		if(i==arrayFolderName.length-1){
			newLocation+=arrayFolderName[i];
		}else{
			newLocation+="<a href='#' style='text-decoration: none;' onclick='backThisNode("+(length-i)+")'>"+arrayFolderName[i]+"</a>-";
		}
	}
	return newLocation;
}
function backThisNode(flag){
	parent.backDirectory("attachmentAssociation.htm","docCenterTree",folderId,flag);
}
function unSelectAssociation(){
	var rows = $('#selectDocDataGrid').datagrid("getSelections");
	var length = rows.length;
	if(length>0){
		for(var i=0; i<length; i++){
			var index = addFileAssociation.indexOf(rows[i].eventid);
			if(index>-1){
				addFileAssociation.splice(index,1);
			}else{
				removeFileAsscoiation.push(rows[i].eventid);
			}
			var removeIndex = $('#selectDocDataGrid').datagrid("getRowIndex",rows[i].eventid);
			$('#selectDocDataGrid').datagrid("deleteRow",removeIndex);
		}
	}else{
		$.messager.alert("提示","请选择至少一条数据进行删除!","info");
	}
}
function saveAssociation(){
	console.log({"businessType":"file",'businessId':parent.businessId,"addAssociationFileIds":addFileAssociation,"removeAssociationFileIds":removeFileAsscoiation});
	if(addFileAssociation.length==0 && removeFileAsscoiation.length==0){
		$.messager.alert("提示","关联附件没有更改，不需要保存!","info");
		return;
	}else if(addFileAssociation.length==0 && removeFileAsscoiation.length!=0){
		addFileAssociation = null;
	}else if(addFileAssociation.length!=0 && removeFileAsscoiation.length==0){
		removeFileAsscoiation = null;
	}
	$("#savebutton").linkbutton('disable');
	$.ajax({
		url: rootPath+"jasdoc/association/save.do",
		dataType:"json",
		type:'post',
		data:{"businessType":"file",'businessId':parent.businessId,"addAssociationFileIds":addFileAssociation,"removeAssociationFileIds":removeFileAsscoiation},
		traditional:true,
		success:function(result){
			$("#savebutton").linkbutton('enable');
			if(result.success==1){
				$.messager.alert("提示","附件关联成功!","info");
			}else{
				if(addFileAssociation==null){
					addFileAssociation = new Array();
				}
				if(removeFileAsscoiation==null){
					removeFileAsscoiation = new Array();
				}
			}
		}
	})
}

/**
 * 方法描述：文档预览
 */
function previewDoc(eventid,versionid){
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
function refresh(){
	window.location.reload();
}