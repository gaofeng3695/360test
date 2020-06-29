/**
 *	文件描述：提取的收藏夹下js中公共方法
 */

/*****	获取数据列表中字段对应按钮Start	*****/
function getPrivilegeField(rowData){
	var role = rowData.hierarchyRole;
	var typeFlag = rowData.typeFlag;   //文件夹标识1，文件标识0
	if(typeFlag==1){
		return "完全控制";
	}
	if(role>60){
		return "完全控制";	
	}
	if(role>30){
		return "文档维护";
	}
	if(role>20){
		return "下载";
	}
	return "查看";
	
}
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


/**
 *	方法描述：获取【操作】字段对应按钮
 *	@param rowData	操作字段对应按钮所在行的数据
 */
function getFavoriteFolderField(rowData){
	var eventid=rowData.eventid;
	var role=rowData.hierarchyRole;
	var typeFlag = rowData.typeFlag;   //文件夹标识1，文件标识0
	var managerField = "";
	if(typeFlag==1){
		managerField="<img src='../../common/images/tip.png' title='查看'  style='cursor:hand' onclick='viewDetailInfo(\""
			+eventid + "\",1)'>	"; 
		managerField+="<img src='../../common/images/pencil.png' title='修改'style='cursor:hand'  onclick='updateFolder(\""
			+ eventid
			+ "\")'>	";
		managerField+="<img src='../../common/images/recycle.png' title='删除'style='cursor:hand'  onclick='deleteFolder(\""
			+ eventid
			+ "\")'>	";
		
	}else{
		managerField="<img src='../../common/images/tip.png' title='查看'  style='cursor:hand' onclick='viewDetailInfo(\""
			+eventid + "\",0)'>	"; 
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
				+ "\",0)'>	";
		}

	}
	
	return managerField;
}



/*****	【操作】字段对应按钮（查看、预览、下载、修改、共享详情）事件Start	*****/





/*****	【操作】字段对应按钮（查看、预览、下载、修改、共享详情）事件End	*****/

/*****	工具条对应按钮事件Start	*****/



/**
 * 不支持文档格式，弹出提示
 */
function previewFileTypeInfo(){
	$.messager.alert('提示', "暂时不支持这种类型文档的预览功能！", "info");
}




/*****	工具条对应按钮事件End	*****/





/**********************新增方法 Start  update by Shenjie 2015-6-1 13:11**************************/




/*********************************工具栏对应按钮事件 End *********************************************************/
