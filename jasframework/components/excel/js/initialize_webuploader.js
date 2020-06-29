/**
 * @file
 * @desc excel模板上传
 * @author zhangyi
 * @date 2017年11月6日16:10:52
 */
var fkOid = getParamter("fkOid");	// 关联Id
var fkName = getParamter("fkName");    // 关联字段名称

$(function(){ 
	uploader = WebUploader.create({
	    auto: false,
	    swf: rootPath+'jasframework/common/lib/webuploader/Uploader.swf',
	    server: addTokenForUrl(rootPath+"jasframework/excel/importExcelData.do?templateId="+templateId+"&tableName="+tableName+"&functionName="+functionName+"&fkName="+fkName+"&fkOid="+fkOid),
	    
	    // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
	    disableGlobalDnd:true, 
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    
	    pick: {
	        id:'#addFile',
	        multiple :true,
//	        innerHTML: '选择excel文件：'
	    },
	    accept: {
	        title: 'Files',
	        extensions: 'doc,docx,xlsx,xls,pdf,zip,ppt,pptx',
	    },
	    
	    // 不压缩，文件上传前会压缩一把再上传！
	    resize: false,
	    // 验证文件总数量, 超出则不允许加入队列
	    fileNumLimit : 1,
	    method:'POST',
	});

	uploader.on('fileQueued', function(fileItem){
		$inputObj = $('#file');
		$inputObj.val(fileItem.name);
		if($inputObj.val()=="请选择excel文件"){
			return;
		}else if($inputObj.val() == ""){
			top.showAlert("提示","请选择数据！",'info');
			// 移除文件
			 uploader.removeFile(fileItem, true);
			return;
		}else if($inputObj.val().indexOf(".xls")==-1 && $inputObj.val().indexOf(".xlsx")==-1){
			top.showAlert("提示","请选择excel数据！",'info');
			// 移除文件
			uploader.removeFile(fileItem, true);
			return;
		}	
	});
});
