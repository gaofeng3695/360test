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
var selectType = "1";
var deleteDocUrl = "";		//删除的url
var folderLocationName = "文档中心";
var back = " &nbsp;&nbsp;<img id='back' style='cursor:pointer;' src='../../common/images/undo.png' height='14px;' alt='上一级'/>";
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
var folderType;

$(document).ready(function(){
	$("#operation").menubutton({menu:"#multFileAndFolderMenu"});
//	folderId = getParamter("folderId");
	initMessage(null,false);
	operationSingleFileAndFolder();  //为工具栏按钮添加响应事件
});



/**
	* 方法描述：加载文档列表
	*/
function initMessage(menuUrl,allOrOnlyDocFile) {
	showAllFileFlag=1;
	var datagridTitle = '文档列表';
//	folderLocationName=getParamter("folderLocationName");
	folderId = parent.folderId;
	folderLocationName=parent.folderLocationName;
	folderType = parent.folderType;
	backFolderLocationName = folderLocationName;
	backFolderId = folderId;
	datagridTitle = "<div style='float:left;'>当前位置：</div>" + getTitle(folderLocationName);
	var queryDocUrl = "../doccenter/getAllDoc.do?folderId=" + folderId;
	if (menuUrl != null && "" != menuUrl) {
		var p = menuUrl.substr(0).split("&");
		$.each(p, function(i, item) {
			var d = item.split("=");
			if (d[0] == 'selectType') {
				selectType = d[1];
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
	}else{
		selectType = null;
	}
	var queryParams=null;
	if (selectType == 1) { //allOrOnlyDocFile
		if(allOrOnlyDocFile){
			queryDocUrl = "../doccenter/getAllDoc.do?folderId=" + folderId+"&allOrOnlyDocFile="+allOrOnlyDocFile+"&isPrivilege="+isPrivilege;
		}else{
			queryDocUrl = "../doccenter/getAllDoc.do?folderId=" + folderId+"&isPrivilege="+isPrivilege;
		}
	} else if (selectType == 4) {
		queryDocUrl = "../../search/queryFolderByAttribute.do?";
		queryParams={"filename":decodeURI(decodeURI(filename)),"fileno":decodeURI(decodeURI(fileno)),
				"keyword":decodeURI(decodeURI(keyword)),"summary":decodeURI(decodeURI(summary)),"remark":decodeURI(decodeURI(remark)),
				"fileclassifs":fileclassifys,"uploadtimeStart":uploadtimeStart,"uploadtimeEnd":uploadtimeEnd,
				"filepath":decodeURI(decodeURI(filepath)),"folderId":folderId,"isPrivilege":isPrivilege};
	} else if (selectType == 5) {
		queryDocUrl = "../../search/querySearchByIndex.do?searchstring="+ encodeURI(encodeURI(searchstring))+"&folderId="+folderId;
	}else{
		queryDocUrl = "../doccenter/getAllDoc.do?folderId=" + folderId +"&allOrOnlyDocFile="+allOrOnlyDocFile;
	}
	var width = $('body').width();
	if(queryParams!=null){
		queryParams.folderType = folderType;
	}else{
		queryParams = {"folderType":folderType};
	};
	$('#dg').datagrid({
		width : '100%',
		nowrap : false,
		collapsible : false,
		url : queryDocUrl,
		remoteSort : true,
		idField : 'eventid',
		title : datagridTitle,
		toolbar : "#toolbar",
		queryParams:queryParams,
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
					{field : 'privilege',title : '我的权限',width : 0.09 * width,formatter:function(value,rowData,rowIndex){
						return getPrivilegeField(rowData);
					  }},
				{field : 'eventid',title:"eventid",hidden:true}
		]],
		onDblClickRow : function(index, rowData) {
			var typeFlag = rowData.typeFlag;
			if(typeFlag==1){
				//如果是文件夹，则打开文件夹
				openFolder(rowData.eventid,rowData.docactualLocation,rowData.foldertype);
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
		onRowContextMenu : function(e, rowIndex, rowData) {
			e.preventDefault();
			if(!rowData){
				return;
			}
			var typeFlag = rowData.typeFlag;
			if(typeFlag==1){
				//如果是文件夹，则打开文件夹右键菜单
				$('#folderContentMenuManager').menu('show', {
					left : e.pageX,
					top : e.pageY
				});
				var role = rowData.hierarchyRole;
//				$('#folderContentMenuManager #16').attr('disabled', false);
//				$('#folderContentMenuManager #17').attr('disabled', false);
				$('#folderContentMenuManager div').each(function() {
					if ($(this).attr('id')>folderAllRoleValueAfter[0]) {
//						$(this).attr('disabled', true);
						$('#folderContentMenuManager').menu('disableItem',$(this)[0]);
					}
				});
				$('#folderContentMenuManager div').each(function() {
					if (role >= $(this).attr('id')) {
//						$(this).attr('disabled', false);
						$('#folderContentMenuManager').menu('enableItem',$(this)[0]);
					}
				});
				operationFolderContextMenu(rowData);
			}else{
				//如果是文件，则打开文件右键菜单
				$('#fileContentMenuManager').menu('show', {
					left : e.pageX,
					top : e.pageY
				});
//				$('#fileContentMenuManager #18').attr('disabled', false);
//				$('#fileContentMenuManager #20').attr('disabled', false);

				$('#fileContentMenuManager div').each(function() {
					if ($(this).attr('id')>folderAllRoleValueAfter[0]) {
//						$(this).attr('disabled', true);
						$('#fileContentMenuManager').menu('disableItem',$(this)[0]);
					}
				});

				var role = rowData.hierarchyRole;
				$('#fileContentMenuManager div').each(function() {
					if (role >= $(this).attr('id')) {
//						$(this).attr('disabled', false);
						$('#fileContentMenuManager').menu('enableItem',$(this)[0]);
					}
				});
				operationFileContentMenu(rowData);
			}

		},
		onLoadSuccess : function(data) {
			//debugger
			if (data.msg) {
				$.messager.alert('错误', data.msg, data.error);
			} else {
				var role = data.role;
				//加载工具栏按钮
				$('#toolbar a').each(function() {
					var tempRole = parseInt($(this).attr('name'));
					if (role >= tempRole) {
						$(this).show();
					}else if(role < tempRole){
						$(this).hide();
					}
				});
				if (folderId == docCenterFolderId)  {
					//文档中心下只能创建文件夹
					$("#44").hide();
				}
			}
			$('#dg').datagrid('clearSelections'); //clear selected options
		},onSelect : function(index, row){
			dddd();
		},onUnselect:function(index,row){
			dddd();
		}
	});

	initDatagrigHeight('dg', '', 100);
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
		getDlg("viewFolder.htm?folderId="+eventId,'viewFolder',"文件夹详情",520,370);
	}else{
		//如果是文件，则打开文件详情页面
		getDlg("../file/viewFile.htm?eventid="+eventId,'viewFile',"文档详细",700,400);
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
	 var query={"filename":filename,"filetype":filetype,"uploadtimeStart":uploadtime_start,
			 "uploadtimeEnd":uploadtime_end,"fileno":fileno,"keyword":keyword,"allOrOnlyDocFile":true};
	var url= "../doccenter/getAllDoc.do?folderId=" + folderId;
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


/**********************工具栏对应按钮事件 Start  update by Shenjie 2015-6-1 13:11**************************/


/**
 * 方法描述：上传
 */
function uploadDoc(){
	getDlg("../uploadify/index.html?folderId="+folderId,'uploadify',"文档上传",800,370);
}

/**
 * 文档导入
 */
function documentImport(){
	getDlg("../file/documentImport.htm?folderId="+folderId,'documentImport',"文档导入",700,400);
}

/**
 * 创建文档中心下的文件夹
 */
function createFolder(){
	getDlg("addFolder.htm?parentid="+folderId+"&folderType="+folderType,'addFolder',"新增文件夹",450,160);
}

/**
 * 方法描述：下载单个文档
 */
function downloadDoc(eventid){
	var docId = eventid;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if(rows.length==1){
			var typeFlag = rows[0].typeFlag;
			if(typeFlag==1){
				return;
			}
			docId = rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	if($('#folderDownload').length==0){
		$("<iframe id=\"folderDownload\" style=\"display: none;\"></iframe>").appendTo("body");
	}
	var url=rootPath+"jasdoc/folder/doccenter/downloadDoc.do?docId="+docId+"&token="+ localStorage.getItem("token");
	$("#folderDownload").attr("src",url);
}
/**
 * 方法描述：单个文件夹下载
 * @param eventid 文件夹ID
 * @param folderName 文件夹名称
 */
function downloadFolder(eventid,folderName){
	var url=rootPath+"jasdoc/folder/doccenter/compressionDocs.do?folderIds="+eventid+"&folderName="+encodeURIComponent(encodeURIComponent(folderName));
	createProcessBar();
	$.ajax({
		url:url,
		type:"POST",
		dataType:"json",
		success:function(result){
			closeProcessBar();
			if(result.success=="1"){
				var filename=result.fileName;
				var downloadUrl=rootPath+"jasdoc/folder/doccenter/downloadDocs.do?fileName="+encodeURI(encodeURI(filename))+"&token="+ localStorage.getItem("token");
				if($('#folderDownload').length==0){
					$("<iframe id=\"folderDownload\" style=\"display: none;\"></iframe>").appendTo("body");
				}
				$("#folderDownload").attr("src",downloadUrl);
			}else{
				$.messager.alert("提示",result.error,"info");
			}
		}
	});
}
/**
 * 方法描述：下载多个文档
 * 说明：支持多文档、多文件夹、文档+文件夹下载
 */
function downloadDocs(folderEventid){
	var rows = $('#dg').datagrid('getSelections');
	var folderIds = "";
	var docIds = "";
	var folderName="";
	if(rows.length>0){
		if(rows.length==1){
			//如果是单个文档或文件夹下载
			var role = rows[0].hierarchyRole;
			if(role<30){
				var filename=rows[0].filename;
				$.messager.alert('提示','对'+filename+'无下载权限','info');
				return;
			}
			var eventid=rows[0].eventid;
			var typeFlag = rows[0].typeFlag;
			if(typeFlag==1){
				//如果是文件夹下载
				folderName = rows[0].filename;
				folderIds=eventid;
			}else{
				//如果是文档下载
				downloadDoc(eventid);
				return;
			}
		}else{
			for(var i=0;i<rows.length;i++){
				var role = rows[i].hierarchyRole;
				var filename = rows[i].filename;
				var typeFlag = rows[i].typeFlag;
				if(role<30){
					$.messager.alert('提示','对'+filename+'无下载权限','info');
					return;
				}
				if(typeFlag==1){
					folderIds += rows[i].eventid+",";
				}else{
					docIds += rows[i].eventid+",";
				}
			}
			folderIds=folderIds.substring(0, folderIds.lastIndexOf(","));
			docIds=docIds.substring(0, docIds.lastIndexOf(","));
			var lastIndes = folderLocationName.lastIndexOf("/")+1;
		    folderName=folderLocationName.substring(lastIndes);
		}
		var url=rootPath+"jasdoc/folder/doccenter/compressionDocs.do?folderIds="+folderIds+"&folderName="+encodeURIComponent(encodeURIComponent(folderName))+"&docIds="+docIds;
		createProcessBar();
		$.ajax({
			url:url,
			type:"POST",
			dataType:"json",
			success:function(result){
				closeProcessBar();
				if(result.success=="1"){
					var filename=result.fileName;
					var downloadUrl=rootPath+"jasdoc/folder/doccenter/downloadDocs.do?fileName="+encodeURI(encodeURI(filename))+"&token="+ localStorage.getItem("token");
					if($('#folderDownload').length==0){
						$("<iframe id=\"folderDownload\" style=\"display: none;\"></iframe>").appendTo("body");
					}
					$("#folderDownload").attr("src",downloadUrl);
				}else{
					$.messager.alert("提示",result.error,"info");
				}
			}
		});
	}else{
		$.messager.alert('提示','请选择一条记录','info');
	}
}


/************文件操作工具栏按钮事件  开始*************************/

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
 * 方法描述：修改
 * @param sid	选中记录的sid
 */
function updateFile(eventid){
	var docId = eventid;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if(rows.length==1){
			var typeFlag = rows[0].typeFlag;
			if(typeFlag==1){
				return;
			}
			docId = rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	getDlg("../file/updateFile.htm?eventid="+docId,'updateFile',"文档修改",700,350);
}


/**
 * 方法描述：删除单个文档(右键菜单)
 * @param eventid 文档ID
 * @param shiftDeleteFlag 是否彻底删除标识
 */
function deleteDoc(shiftDeleteFlag,eventid){
	var deleteUrl =  '../doccenter/deleteFile.do';
	var deleteTip = "文档将放入回收站，您可以通过回收站功能中的还原按钮进行还原，您确定要删除吗？\n\t";
	if(shiftDeleteFlag){
		deleteUrl='../doccenter/shiftDeleteFile.do';
		deleteTip="将会彻底删除所选择的文档，不可还原，是否确定删除?\n\t";
	}
	var docId = eventid;
	if(arguments.length==1){
		var rows = $('#dg').datagrid('getSelections');
		if(rows.length==1){
			var role = rows[0].hierarchyRole;
			//判断是否有文档维护权限
			if(role<60){
				var filename = rows[i].filename;
				$.messager.alert('提示','对文件'+filename+"无删除权限",'info');
				return;
			}
			docId = rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	$.messager.confirm("删除文档",deleteTip,function(r){
		if (r){
			$.post(deleteUrl,{"docIds":docId},function(result){
				if (result.success=="1"){
					reloadDataTree(null,0);
				} else {
					$.messager.alert('错误',result.message,"error");
				}
			},'json');
		}
	});
}

/**
 * 方法描述：批量删除文档和文件夹
 * @param shiftDeleteFlag 是否彻底删除标识
 */
function deleteFolderAndDocs(shiftDeleteFlag){
	var deleteUrl =  '../doccenter/deleteFolderAndFile.do';
	var deleteTip = "所选的文档和文件夹将放入回收站，您可以通过回收站功能中的还原按钮进行还原，您确定要删除吗？\n\t";
	if(shiftDeleteFlag){
		deleteUrl='../doccenter/shiftDeleteFolderAndFile.do';
		deleteTip="将会彻底删除所选择的文档和文件夹，不可还原，是否确定删除?\n\t";
	}
	var rows = $('#dg').datagrid('getSelections');
	var deleteFoldersNum = 0;
	if (rows.length > 0){
		var folderIds=""; //文件夹ID集合
		var docIds="";  //文件ID集合

		for(var i=0;i<rows.length;i++){
			var typeFlag = rows[i].typeFlag;
			var role = rows[i].hierarchyRole;
			if(typeFlag==1){
				//判断是否有文件夹维护权限
				if(role<90){
					var filename = rows[i].filename;
					$.messager.alert('提示','对文件夹'+filename+"无删除权限",'info');
					return;
				}
				folderIds += rows[i].eventid+",";
				deleteFoldersNum++;
			}else{
				//判断是否有文档维护权限
				if(role<60){
					var filename = rows[i].filename;
					$.messager.alert('提示','对文件'+filename+"无删除权限",'info');
					return;
				}
				docIds += rows[i].eventid+",";
			}
		}
		folderIds = folderIds.substring(0,folderIds.length-1);
		docIds = docIds.substring(0,docIds.length-1);
		$.messager.confirm("删除文档",deleteTip,function(r){
			if (r){
				$.post( deleteUrl,{"folderIds":folderIds,"docIds":docIds},function(result){
					if (result.success=="1"){
						reloadDataTree({"deleteFoldersNum":deleteFoldersNum},4);
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


/**
 * 方法描述：移动文档
 *
 */
function moveFile(eventid,fileName){
	if(arguments.length==2){
		//移动单个文档（右键）
		getDlg("../file/moveFile.htm?docIds="+eventid+"&fileNames="+fileName,'moveFile','移动文档',580,350);
	}else{
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length > 0){
			var eventids= "" ;
			var filenames = "";
			for(var i=0;i<rows.length;i++){
				var typeFlag = rows[i].typeFlag;
				if(typeFlag==1){
					$.messager.alert('提示','目前只支持文档移动操作','info');
					return;
				}
				//判断是否有文档维护权限
				var docManager = rows[i].docManager;
				if(docManager!=1){
					var filename = rows[i].filename;
					$.messager.alert('提示','对文件'+filename+"无移动权限",'info');
					return;
				}
				eventids += rows[i].eventid+",";
				filenames += rows[i].filename+",";
			}
			eventids = eventids.substring(0, eventids.length-1);;
			filenames = filenames.substring(0, filenames.length-1);;

			if( eventids != "" ){
				getDlg("../file/moveFile.htm?docIds="+eventids+"&fileNames="+filenames,'moveFile','移动文档',580,350);
			}else{
				$.messager.alert('提示','请选择有移动权限的记录','info');
			}
		}else{
			$.messager.alert('提示','请选择记录','info');
			return;
		}
	}
}
/**
 * 方法描述：共享文件
 */
function shareFile(fileId,role,createuser){
	var eventid = fileId;
	var hierarchyRole = role;
	var createUser = createuser;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length > 0){
			eventid=rows[0].eventid;
			hierarchyRole = rows[0].hierarchyRole;
			createUser = rows[0].createuser;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	shareFileDetailsTab("sharetab"+eventid,"共享详情","../../jasdoc/folder/file/queryFileShareDetails.htm?role="+hierarchyRole+"&createuser="+createUser+"&eventid="+eventid);


}


/**
 * 方法描述：版本更新
 */
function versionSingleFile(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length > 0){
		var eventid=rows[0].eventid;
		var versionnumber = rows[0].versionnumber;
		var filename = rows[0].filename;
		version(eventid,versionnumber,filename);
	}else{
		$.messager.alert('提示','请选择一条记录','info');
		return;
	}

}

/**
 * 方法描述：文档分类
 */
function addtoDocClassify(){
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
		top.getDlg("../docClassify/addtoDocClassify.htm?eventids="+eventids+"&filenames="+filenames+"&foldertype="+foldertype+"&folderid="+folderId,'classify','设置文档分类',580,165);
	}else{
		$.messager.alert('提示','请选择记录','info');
	}
}

/**
 * 方法描述：文档关联
 */

/**
 * 方法描述：共享文件
 */
function associateFile(fileId,role,createuser){
	var eventid = fileId;
	var hierarchyRole = role;
	var createUser = createuser;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length > 0){
			eventid=rows[0].eventid;
			hierarchyRole = rows[0].hierarchyRole;
			createUser = rows[0].createuser;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	shareFileDetailsTab("associatedtab"+eventid,"文件关联","../../jasdoc/folder/file/queryAssociatedFiles.htm?role="+hierarchyRole+"&createuser="+createUser+"&eventid="+eventid);
}

/**
 * 方法描述：添加到收藏夹
 */
function addToFavorite(eventid,filename){
	fileName = encodeURIComponent(encodeURIComponent(filename));
	if(arguments.length==2){
		getDlg("../favorite/addToFavorite.htm?docIds="+eventid+"&fileNames="+filename+"&folderId="+folderId,'favorite','添加收藏',600,350);
	}else{
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length > 0){
			var eventids= "" ;
			var filenames = "";
			for(var i=0;i<rows.length;i++){
				var typeFlag = rows[i].typeFlag;
				if(typeFlag==1){
					$.messager.alert('提示','目前只支持文档收藏操作','info');
					return;
				}
				eventids += rows[i].eventid+",";
				filenames += rows[i].filename+",";
			}
			eventids = eventids.substring(0,eventids.length-1);
			filenames = filenames.substring(0,filenames.length-1);
			getDlg("../favorite/addToFavorite.htm?docIds="+eventids+"&fileNames="+filenames+"&folderId="+folderId,'favorite','添加收藏',580,350);

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
			location = rows[0].docactualLocation;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	var url= "../doccenter/getAllDoc.do?folderId=" + folderEventId;
	folderLocationName = location;
	folderId = folderEventId;
	folderType = folderType;
	try{
		var ztree = parent.$.fn.zTree.getZTreeObj("docCenterTree");
		var selectNode = ztree.getNodeByParam("id", folderId, null);
		ztree.selectNode(selectNode);
		ztree.expandNode(selectNode,true,false,true);
	}catch(e){
	}
	datagridTitle = "<div style='float:left;'>当前位置：</div>" + getTitle(folderLocationName);
	$("#dg").datagrid("options").url = url;
	$("#dg").datagrid({title:datagridTitle});
	$("#dg").datagrid('load');
	$("#operation").attr('disabled', true);
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
			var role = rows[0].hierarchyRole;
			if(role<90){
				var filename = rows[0].filename;
				$.messager.alert('提示','对文件夹'+filename+"无修改权限",'info');
				return;
			}

		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	getDlg("updateFolder.htm?folderId="+folderEventId,'updateFolder',"文件夹修改",450,180);
}
/**
 * 方法描述：删除文件夹
 * @param shiftDeleteFlag 是否彻底删除标识
 * @param folderId 文件夹ID
 */
function deleteFolder(shiftDeleteFlag,eventid){
	var deleteUrl =  '../doccenter/deleteFolder.do';
	var deleteTip = "删除文件夹后，文件夹将放入回收站，您可以通过回收站功能中的还原按钮进行还原，您确定要删除吗？\n\t";
	if(shiftDeleteFlag){
		deleteUrl='../doccenter/shiftDeleteFolder.do';
		deleteTip="将会彻底删除该文件夹及所有的子文件夹、文档，不可还原，是否确定删除?\n\t";
	}
	var folderEventid = eventid;
	if(arguments.length==1){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length == 1){
			var role = rows[0].hierarchyRole;
			if(role<90){
				var filename = rows[0].filename;
				$.messager.alert('提示','对文件夹'+filename+"无删除权限",'info');
				return;
			}
			folderEventid = rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	$.messager.confirm("提示",deleteTip,function(r){
		if (r){
			$.post(deleteUrl,{"folderId":folderEventid},function(result){
				if (result.success=="1"){
					reloadDataTree({"id":folderEventid},3);
				} else {
					$.messager.alert('错误',result.message,"error");
				}
			},'json');
		}
	});
}

function reloadDataTree(data,operation){
	switch(operation){
		case 1:
			var ztree = parent.$.fn.zTree.getZTreeObj("docCenterTree");
			var nodeParent = ztree.getNodeByParam("id", folderId, null);
			nodeParent.isParent = true;
			ztree.reAsyncChildNodes(nodeParent, "refresh");
			break;
		case 2:
			var ztree = parent.$.fn.zTree.getZTreeObj("docCenterTree");
			var thisNode = ztree.getNodeByParam("id", data.id, null);
			thisNode.name = data.name;
			ztree.updateNode(thisNode);
			break;
		case 3:
			var ztree = parent.$.fn.zTree.getZTreeObj("docCenterTree");
			var thisNode = ztree.getNodeByParam("id", data.id, null);
			ztree.removeNode(thisNode);
			break;
		case 4:
			var ztree = parent.$.fn.zTree.getZTreeObj("docCenterTree");
			var nodeParent = ztree.getNodeByParam("id", folderId, null);
			var childrenNodes = nodeParent.children;
			var childNodeNum = childrenNodes==null?0:childrenNodes.length;
			nodeParent.isParent = true;
			ztree.reAsyncChildNodes(nodeParent, "refresh");
			if(childNodeNum-data.deleteFoldersNum<1){
				nodeParent.isParent = false;
				nodeParent.open = false;
				nodeParent.icon = "icon-tree-center-node-close";
				ztree.updateNode(nodeParent);
			}
			break;
	}
	$("#dg").datagrid('reload');
	/*if(operation==0){
		//文档上传页面
		$("#dg").datagrid('reload');
	}else if(operation==1){
		//刷新文档中心树
		var ztree = parent.$.fn.zTree.getZTreeObj("docCenterTree");
		var nodeParent = ztree.getNodeByParam("id", folderId, null);
		nodeParent.isParent = true;
		ztree.reAsyncChildNodes(nodeParent, "refresh");
		$("#dg").datagrid('reload');
	}else if(operation==2){
		//刷新文档中心树
		var ztree = parent.$.fn.zTree.getZTreeObj("docCenterTree");
		var thisNode = ztree.getNodeByParam("id", data.id, null);
		thisNode.name = data.name;
		ztree.updateNode(thisNode);
		$("#dg").datagrid('reload');
	}else if(operation == 3){
		var ztree = parent.$.fn.zTree.getZTreeObj("docCenterTree");
		var thisNode = ztree.getNodeByParam("id", data.id, null);
		ztree.removeNode(thisNode);
		$("#dg").datagrid('reload');
	}*/
}

/**
 * 方法描述：文档授权
 * @param folderId
 */
function authorizeFolder(folderId){
	var folderEventid = folderId;
	if(arguments.length==0){
		var rows = $('#dg').datagrid('getSelections');
		if (rows.length == 1){
			var role = rows[0].hierarchyRole;
			if(role<90){
				var filename = rows[0].filename;
				$.messager.alert('提示','对文件夹'+filename+"无授权权限",'info');
				return;
			}
			folderEventid =  rows[0].eventid;
		}else{
			$.messager.alert('提示','请选择一条记录','info');
			return;
		}
	}
	getDlg("../../privilege/privilege/folderAuthorization.htm?folderId="+folderEventid,'folderAuthorization',"文档授权",
			$(window).width()*0.7,$(window).height()*0.6);
}


/**
 * 为文件及文件夹操作工具栏按钮响应事件
 */
function operationSingleFileAndFolder(){
	//为单个文件工具栏绑定事件
	$("#fileManager").menu({
		onClick:function(item){
			//根据ID获取对应功能栏按钮的状态，如果可用，则执行相应操作
			var disabled = $("#"+item.id).attr("disabled");
			if(disabled=="disabled"){
				return;
			}
			var name = item.name;
			if(name=="001"){
				viewDetailInfo();
			}else if(name=="002"){
				previewDoc();
			}else if(name=="003"){
				downloadDoc();
			}else if(name=="004"){
				updateFile();
			}else if(name=="005"){
				deleteDoc(false);
			}else if(name=="006"){
				deleteDoc(true);
			}else if(name=="007"){
				moveFile();
			}else if(name=="008"){
				addToFavorite();
			}
		}
	});

	//为单个文件夹工具栏按钮绑定事件
	$("#folderManager").menu({
		onClick:function(item){
			//根据ID获取对应功能栏按钮的状态，如果可用，则执行相应操作
			var disabled = $("#"+item.id).attr("disabled");
			if(disabled=="disabled"){
				return;
			}
			var name = item.name;
			if(name=="001"){
				openFolder();
			}else if(name=="002"){
				viewDetailInfo();
			}else if(name=="003"){
				downloadDocs();
			}else if(name=="004"){
				updateFolder();
			}else if(name=="005"){
				deleteFolder(false);
			}else if(name=="006"){
				deleteFolder(true);
			}else if(name=="007"){
				authorizeFolder();
			}
		}
	});

	//为多个文件、文件夹绑定工具栏按钮事件
	$("#multFileAndFolderMenu").menu({
		onClick:function(item){
			//根据ID获取对应功能栏按钮的状态，如果可用，则执行相应操作
			var disabled = $("#"+item.id).attr("disabled");
			if(disabled=="disabled"){
				return;
			}
			var name = item.name;
			if(name=="001"){
				downloadDocs();
			}else if(name=="002"){
				deleteFolderAndDocs(false);
			}else if(name=="003"){
				deleteFolderAndDocs(true);
			}else if(name=="004"){
				moveFile();
			}else if(name=="005"){
				addToFavorite();
			}
		}
	});
}

/**
 * 方法描述：为文件夹右键菜单添加响应事件
 */
function operationFolderContextMenu(rowData){
	var role=rowData.hierarchyRole;
	$('#folderContentMenuManager').menu({
		onClick : function(item) {
			if(role<item.id){
				return;
			}
			if (item.name == '001') {
				openFolder(rowData.eventid,rowData.docactualLocation,rowData.folderType);
			}else if (item.name == '002') {
				viewDetailInfo(rowData.eventid,1);
			} else if (item.name == '003') {
				downloadFolder(rowData.eventid, rowData.filename);
			} else if (item.name == '004') {
				updateFolder(rowData.eventid);
			} else if (item.name == '005') {
				deleteFolder(false,rowData.eventid);
			} else if (item.name == '006') {
				deleteFolder(true,rowData.eventid);  //彻底删除文件夹
			} else if(item.name == '007'){
				//文档授权
				authorizeFolder(rowData.eventid);
			}
		}
	});
}
/**
 * 方法描述：为文件右键菜单添加响应事件
 */
function operationFileContentMenu(rowData){
	var role=rowData.hierarchyRole;
	$('#fileContentMenuManager').menu({
		onClick : function(item) {
			if(role<item.id){
				return;
			}
			if (item.name == '001') {
				viewDetailInfo(rowData.eventid,0);
			}  else if (item.name == '002') {
				var fileType = rowData.filetype;
				if(fileType!=null&&fileType!=""){
					if(previewFileType.indexOf(fileType.toLocaleLowerCase())>-1){
						previewDoc(rowData.eventid);
					}else{
						$.messager.alert('提示', "暂时不支持这种类型文档的预览功能！", "info");
					}
				}
			}else if (item.name == '003') {
				downloadDoc(rowData.eventid);
			}else if (item.name == '004') {
				updateFile(rowData.eventid);
			}else if (item.name == '005') {
				deleteDoc(false,rowData.eventid);
			}else if (item.name == '006') {
				deleteDoc(true,rowData.eventid);
			}else if (item.name == '007') {
				moveFile(rowData.eventid,rowData.filename);
			}else if (item.name == '008') {
				addToFavorite(rowData.eventid,rowData.filename);
			}
		}
	});
}

function goHistory(eventid,folderLocation){
	openFolder(eventid,folderLocation);
}
/*********************************工具栏对应按钮事件 End *********************************************************/

function saveHistryDoc(){
	top.getDlg("saveHistryDoc.htm",'viewfile',"原历史数据迁移",700,400);
}
/**
 * 方法描述：查看历史版本
 *
 */
function queryHistory(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length == 1){
		var typeFlag = rows[0].typeFlag;
		if(typeFlag==1){
			return;
		}
		var fileid= rows[0].eventid;
		var versionid= rows[0].versionid;
		var name = rows[0].filename;
		top.functionMenu.openPage(fileid+"history","历史版本","../../jasdoc/folder/file/queryFileHistory.htm?fileid="+fileid+"&folderId="+folderId,true,true);
	}else{
		$.messager.alert('提示','请选择一条记录！','info');
	}
}

/**
 * 生成索引遮罩层
 */
function createProcessBar() {
	$("<div id=\"index_processBar_mask_Id\"  class=\"datagrid-mask\"></div>").css({
		display : "block",
		width : "100%",
		height : $(window).height()
	}).appendTo("body");
	$("<div id=\"index_processBar_mag_Id\" class=\"datagrid-mask-msg\"></div>").html("正在打包下载文档，请稍候。。。").appendTo("body").css({
		display : "block",
		left : ($(document.body).outerWidth(true) - 190) / 2,
		top : ($(window).height() - 45) / 2
	});
}
/***
 * 清除遮罩层
 */
function closeProcessBar() {
	$('#index_processBar_mask_Id').remove();
	$('#index_processBar_mag_Id').remove();
}
function getTitle(folderLocationName){
	$("#10185201").linkbutton('enable');
	var arrayFolderName=folderLocationName.split("/");
	var newLocation="";
	var length=arrayFolderName.length-1;
	for(var i=1;i<arrayFolderName.length;i++){
		if(i==arrayFolderName.length-1){
			newLocation+="<div style='float:left;' title='"+arrayFolderName[i]+"'>"+arrayFolderName[i]+"</div>";
		}else{
//			newLocation+="<a href='#' style='text-decoration: none;' onclick='backThisNode("+(length-i)+")'>"+arrayFolderName[i]+"</a>-";
			newLocation += "<div style='float:left;cursor:pointer;' title='"+arrayFolderName[i]+"' onclick='backThisNode("+(length-i)+")'>"+arrayFolderName[i]+"-</div>";
		}
	}
	if(length==1){
		// $("#10185201").linkbutton('disable');
	}
	return newLocation;
}
function backThisNode(flag){
	parent.backDirectory("queryTreeDocCenter.htm","docCenterTree",folderId,flag);
}
function dddd(){
	var rows = $("#dg").datagrid('getSelections');
	console.log(rows);
	if(rows.length==1){
		var typeFlag = rows[0].typeFlag;
		if(typeFlag==1){
			//文件夹操作
			$('#16').attr('disabled', false);
			$('#17').attr('disabled', false);

			$('#folderManager div').each(function() {
				if ($(this).attr('id')>folderAllRoleValueAfter[0]) {
					$(this).attr('disabled', true);
				}
			});

			$("#operation").menubutton({
				menu:"#folderManager"
			});

			var role = rows[0].hierarchyRole;
			$('#folderManager div').each(function() {
				if (role >= $(this).attr('id')) {
					$(this).attr('disabled', false);
				}
			});
			$('#toolbar a').each(function() {
				if (role >= $(this).attr('id')) {
//					alert();
					$(this).attr('disabled', false);
				}
			});
		}else{
			//文件操作
			$('#18').attr('disabled', false);
			$('#20').attr('disabled', false);

			$('#fileManager div').each(function() {
				if ($(this).attr('id')>folderAllRoleValueAfter[0]) {
					$(this).attr('disabled', true);
				}
			});
			$("#operation").menubutton({
				menu:"#fileManager"
			});
			var role = rows[0].hierarchyRole;
			$('#fileManager div').each(function() {
				if (role >= $(this).attr('id')) {
					$(this).attr('disabled', false);
				}
			});
			$('#toolbar div').each(function() {
				if (role >= $(this).attr('id')) {
					$(this).attr('disabled', false);
				}
			});
		}
		$("#operation").attr('disabled', false);
	}else{
		$("#operation").menubutton({menu:"#multFileAndFolderMenu"});
		$("#operation").attr('disabled', false);
	}
}