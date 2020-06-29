/**
 *	文件描述：提取的文档分类下js中公共方法
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
function getPrivilegeFieldClassfiy(rowData){
	var role = rowData.hierarchyRole;
	var typeFlag = rowData.typeFlag;   //文件夹标识1，文件标识0
	if(typeFlag==1){
		return "查看";
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
 *	方法描述：获取【文档分类】字段对应图标
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

