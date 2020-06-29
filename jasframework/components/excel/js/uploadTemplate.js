/**
 * @file
 * @desc：上传模板文件
 * @author zhangyi
 */

var templateId = getParamter("templateId");
//var uploaderFile ;

$(function(){ 
	$("#templeteFileCellID").attr('style','color:gray;');
	$("#templeteFileCellID").val('请选择excel文件');
	
	uploader = WebUploader.create({
	    auto: false,
	    swf: rootPath+'jasframework/common/lib/webuploader/Uploader.swf',
	    server: addTokenForUrl(rootPath+"jasframework/excel/uploadExcelTemplate.do?templateId="+templateId),
	    
	    // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
	    disableGlobalDnd:true, 
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    
	    pick: {
	        id:'#addFile',
	        multiple :true,
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
		$inputObj = $('#templeteFileCellID');
		$inputObj.val(fileItem.name);
		if($inputObj.val()=="请选择excel文件"){
			return;
		}else if($inputObj.val() == ""){
			top.showAlert("提示","请选择模版文件！",'info');
			// 移除文件
			 uploader.removeFile(fileItem, true);
			return;
		}else if($inputObj.val().indexOf(".xls")==-1 && $inputObj.val().indexOf(".xlsx")==-1){
			top.showAlert("提示","请选择正确的模版文件！",'info');
			// 移除文件
			uploader.removeFile(fileItem, true);
			return;
		}	
	});
});


/**
 * @desc 上传模板
 */
function uploadTemplate(){
	$inputObj = $('#templeteFileCellID');
	if($inputObj.val()=="请选择excel文件"){
		top.showAlert("提示","请选择数据！",'info');
		return;
	}else if($inputObj.val() == ""){
		top.showAlert("提示","请选择数据！",'info');
		return;
	}else if($inputObj.val().indexOf(".xls")==-1 && $inputObj.val().indexOf(".xlsx")==-1){
		top.showAlert("提示","请选择excel数据！",'info');
		return;
	}
	//模板文件单元格取值验证
	uploader.upload();
	uploader.on('uploadSuccess',function(file, result) {
		if(result.success==1){
			$.messager.alert("提示",result.message,"info",function(){
				reloadData('queryExcelTemplate.htm', "excelTemplateTable");
				top.closeDlg('uploadTemplate');
			});
		}else{
			$.messager.alert("提示",result.message,"info",function(){closePanel()});
		}
	});
}

/**
 * 方法描述：关闭窗口
 * 
 */
function closeSave() {
	top.closeDlg('uploadTemplate');
}

/**
 * 方法描述：重新加载数据
 * 
 */
function reloadData(url, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(url) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}