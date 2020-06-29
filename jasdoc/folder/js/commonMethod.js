/**
 *	文件描述：提取的此文件夹下js中公共方法
 */

/*****	获取数据列表中字段对应按钮Start	*****/

/**
 *	方法描述：获取【操作】字段对应按钮
 *	@param rowData	操作字段对应按钮所在行的数据
 *	@param isDocCenter	是否有【版本更新】和【文件关联】两个按钮
 *	@param isShare	是否有【共享详情】按钮
 */
function getManagerField(rowData,isDocCenter,isShare){
	var eventid=rowData.eventid;
	var role=rowData.hierarchyRole;
	var typeFlag = rowData.typeFlag;   //文件夹标识1，文件标识0
	var managerField = "";
	if(typeFlag==1){
		managerField="<img src='../../common/images/tip.png' title='查看'  style='cursor:hand' onclick='viewDetailInfo(\""
			+eventid + "\",1)'>	"; 
		if(role>=30){
			var fileName = rowData.filename;
			managerField+="<img src='../../common/images/download.png' title='下载'style='cursor:hand'  onclick='downloadFolder(\""
				+ eventid
				+ "\",\""+fileName+"\")'>	";
		}
		if(role>=90){
			managerField+="<img src='../../common/images/pencil.png' title='修改'style='cursor:hand'  onclick='updateFolder(\""
				+ eventid
				+ "\")'>	";
			var hierarchy=rowData.ext_field1;
			managerField+="<img src='../../common/images/recycle.png' title='删除'style='cursor:hand'  onclick='deleteFolder(\""
				+ hierarchy
				+ "\")'>	";
		}
	}else{
		managerField="<img src='../../common/images/tip.png' title='查看'  style='cursor:hand' onclick='showInfo(\""
			+eventid + "\")'>	"; 
		var fileType = rowData.filetype;
		if(fileType!=null&&fileType!=""){
			if(previewFileType.indexOf(fileType.toLocaleLowerCase())>-1){
				managerField+="<img src='../../common/images/preview.png' title='预览'style='cursor:hand' onclick='Preview(\""
					+ eventid
					+ "\")'>	";
			}else{
				managerField+="<img src='../../common/images/preview.png' title='预览'style='cursor:hand' onclick='previewFileTypeInfo()'>	";
			}
		}
		if(role>=30){
			managerField+="<img src='../../common/images/download.png' title='下载'style='cursor:hand'  onclick='downloadDoc(\""
				+ eventid
				+ "\")'>	";
		}
		if(role>=60){
			managerField+="<img src='../../common/images/pencil.png' title='修改'style='cursor:hand'  onclick='updateInfo(\""
				+ eventid
				+ "\")'>	";
			managerField+="<img src='../../common/images/recycle.png' title='删除'style='cursor:hand'  onclick='deleteDoc(\""
				+ eventid
				+ "\")'>	";
		}
//		if(top.loginUser.eventid==rowData.createuser){
//			if(isShare){
//				managerField+="<img src='../../common/images/share.png' title='共享详情'style='cursor:hand' onclick='shareFileDetailsTab(\""
//					+ eventid+"\",\""+"共享详情"+"\",\""
//					+"../../jasdoc/folder/file/queryFileShareDetails.htm?role="+role+"&createuser="+rowData.createuser+"&eventid="+eventid
//					+ "\")'>	"
//			}
//			
//			if(isDocCenter){
//				managerField+="<img src='../../common/images/version.png' title='版本更新'style='cursor:hand' onclick='version(\""
//					+ eventid+"\",\""+rowData.versionnumber+"\",\""+rowData.filename
//					+ "\")'>	"
//				managerField+="<img src='../../common/images/share.png' title='文件关联'style='cursor:hand' onclick='shareFileDetailsTab(\"associatedtab"
//					+ eventid+"\",\""+"文件关联"+"\",\""
//					+"../../jasdoc/folder/file/queryAssociatedFiles.htm?role="+role+"&createuser="+rowData.createuser+"&eventid="+eventid
//					+ "\")'>	"
//			}
//				
//		}
	}
	
	return managerField;
}

/**
 *	方法描述：获取【收藏夹】字段对应按钮
 *	@param rowData	操作字段对应按钮所在行的数据
 */
function getFavoriteField(rowData){
	var favoriteField="";
	var eventid=rowData.eventid;
	if(rowData.favoritefileid){
		favoriteField="<img  id=\""+ eventid
		+ "\" onclick='addfavorite(\""+ eventid+ "\",\"1\")' "
		+"src='../../common/images/favorite_2.png' title='从收藏夹中删除'style='cursor:hand'  /></div>";
	}else{
		favoriteField="<img id=\""+ eventid
		+ "\" onclick='addfavorite(\""+ eventid+ "\",\"2\")' "
		+"src='../../common/images/favorite_1.png'  title='添加到默认收藏夹'style='cursor:hand'/></div>";
	}
	return favoriteField;
}
/*****	获取数据列表中字段对应按钮End	*****/

/*****	【操作】字段对应按钮（查看、预览、下载、修改、共享详情）事件Start	*****/
/**
 *	方法描述：查看
 *	@param sid	选中记录的sid
 */		
function showInfo(eventid){
	top.getDlg("viewFile.htm?eventid="+eventid+"&r="+new Date().getTime(),'viewfile',"文档详细",700,400);
}


/** 
 *	方法描述：历来版本中文件预览
 *	@param versionid	选中记录的versionid
 */
function previewHistory(versionid){
	var url = rootPath+ "/jasdoc/folder/preview/FlexPaper_2.0.3/index.html?versionid="+versionid+ "&r=" + new Date().getTime();
	top.getDlg(url, "viewiframe" + versionid, "预览", 800, 550);
}

/**
 * 方法描述：下载
 * @param eventid	选中记录的eventid
 */
function downloadDoc(eventid){
//	$.ajax({
//		url:"../doccenter/downloadDocBefore.do?",
//		data:{"downloaddocid":eventid},
//		type:"POST",
//		dataType:'json',
//		success:function(data){
//			$("<iframe id=\"fileDownload\" style=\"display: none;\"></iframe>").appendTo("body");
//			var url="../doccenter/downloadDoc.do?downloaddocid="+eventid+"&usereventid="+top.loginUser.eventid;
//			$("#fileDownload").attr("src",url);
//		}
//	});
}

/**
 * 方法描述：修改
 * @param sid	选中记录的sid
 */
function updateInfo(eventid){
	top.getDlg("updateFile.htm?eventid="+eventid+"&r="+new Date().getTime(),'update',"文档修改",700,350);
}

/**
 * 方法描述：共享详情
 * @param eventid	选中记录的eventid
 * @param title tab标题 
 * @param url 页面路径
 */
function shareFileDetailsTab(eventid,title,url){
	top.functionMenu.openPage(eventid+"share",title,url,true,true);
}

/**
 * 方法描述：版本
 * @param eventid	文档id
 * @param versionnumber 版本号
 * @param filename 文档名称
 */
function version(eventid,versionnumber,filename){
	top.getDlg("../uploadify/version.html?fileid="+eventid+"&versionnumber="+versionnumber+"&filename="+filename+"&r="+new Date().getTime(),'uploadify',"版本更新",520,370);
}

/*****	【操作】字段对应按钮（查看、预览、下载、修改、共享详情）事件End	*****/

/*****	工具条对应按钮事件Start	*****/

/**
 * 方法描述：文档打包下载
 */
function zipDownloadDoc(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length > 0){
		var ids="";
		for(var i=0;i<rows.length;i++){
			ids += "'"+rows[i].eventid+"',";
		}
		ids=ids.substring(0, ids.lastIndexOf(","));
		var lastIndes = folderLocationName.lastIndexOf("/")+1;
		var folderName=folderLocationName.substring(lastIndes);
		$("<iframe id=\"zipDownloadDoc\" style=\"display: none;\"></iframe>").appendTo("body");
		var url="../doccenter/zipDownloadDoc.do?zipDownloadDoceventid="+ids+"&folderName="+encodeURI(encodeURI(folderName))+"&token="+ localStorage.getItem("token");
		$("#zipDownloadDoc").attr("src",url);
	}else{
		$.messager.alert('提示','请选择记录！','info');
	}
	
}

/**
 * 不支持文档格式，弹出提示
 */
function previewFileTypeInfo(){
	$.messager.alert('提示', "暂时不支持这种类型文档的预览功能！", "info");
}


/** 
 *	方法描述：预览
 *	@param eventid	选中记录的eventid
 */
function Preview(eventid,versionid){
	$.ajax({
		url:rootPath+ '/jasdoc/folder/doccenter/isExistPdfFile.do?docId='+eventid,
//		url:rootPath+ '/jasdoc/folder/doccenter/isExistSwfFile.do?docId='+eventid,
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
/*****	工具条对应按钮事件End	*****/





/**********************新增方法 Start  update by Shenjie 2015-6-1 13:11**************************/


/**
 *	方法描述：获取【收藏夹】字段对应按钮
 *	@param rowData	操作字段对应按钮所在行的数据
 */
function getFileNameField(rowData){
	var fileName = rowData.filename;
	var fileNameField="";
	var typeFlag = rowData.typeFlag;
	if(typeFlag==1){
		fileNameField="<img src='../../common/images/folder.png'/> "+fileName;
	}else{
		fileNameField=fileName;
	}
	return fileNameField;
}

/*********************************工具栏对应按钮事件 End *********************************************************/
