/**
 * @file
 * @desc excel模板修改
 * @author zhangyi
 * @date 2018-08-16
 * @last modified by
 * @last modified time
 */

var oid = getParamter('oid');

$(function () {
	$('#oid').val(oid);
	getInfo();
	$("#file").attr('style', 'color:gray;');
	$("#file").val('请选择excel文件');
	uploader = WebUploader.create({
		auto : false,
		swf : rootPath + 'jasframework/common/lib/webuploader/Uploader.swf',

		// 禁掉整个页面的拖拽功能 如果不禁用，图片拖进来的时候会默认被浏览器打开。
		disableGlobalDnd : true,
		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.

		pick : {
			id : '#addFile',
			multiple : false,
		},
		accept : {
			title : 'Files',
			extensions : 'xlsx,xls',
		},

		// 不压缩，文件上传前会压缩一把再上传！
		resize : false,
		// 验证文件总数量, 超出则不允许加入队列
		fileNumLimit : 1,
		method : 'POST',
	});

	uploader.on('fileQueued', function(fileItem) {
		$inputObj = $('#file');
		$inputObj.val(fileItem.name);
		if ($inputObj.val() == "请选择excel文件") {
			return;
		} else if ($inputObj.val() == "") {
			top.showAlert("提示", "请选择数据！", 'info');
			// 移除文件
			uploader.removeFile(fileItem, true);
			return;
		} else if ($inputObj.val().indexOf(".xls") == -1
				&& $inputObj.val().indexOf(".xlsx") == -1) {
			top.showAlert("提示", "请选择excel文件！", 'info');
			// 移除文件
			uploader.removeFile(fileItem, true);
			return;
		}
	});
})

/**
 * @desc 修改初始值展示
 */
function getInfo(){
	$.ajax({
		url: rootPath + '/jasframework/excelTemplate/get.do',
		dataType:'json',
		type:'get',
		data:{
			"oid": oid
		},
		success:function(result){
			if(result.status == "1"){
				var data = result.data;
				$('#excelTemplateCode').val(data.excelTemplateCode);
			    $('#excelTemplateName').val(data.excelTemplateName);
			    $('#excelTemplateType').attr('value', data.excelTemplateType);
			    $('#excelTemplatePath').val(data.excelTemplatePath);
			    $('#remark').val(data.remark);
			}else{
				top.showAlert("提示", "详情获取失败", 'info');
			}
		}
	});
}

 /**
 * @desc 检查模板名称和模板编号是否存在
 */
function checkNameOrCode() {
    var bool = false;
    $.ajax({
        url: rootPath + '/jasframework/excelTemplate/checkNameOrCodeExist.do',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
        	"oid": oid,
            "excelTemplateName": $('#excelTemplateName').val(),
            "excelTemplateCode": $('#excelTemplateCode').val()
        },
        success: function (result) {
            if (result.status == -1) {
                top.showAlert("提示", result.msg, 'info');
                enableButtion("saveButton01");
            } else {
                bool = true;
            }
        }
    });
    return bool
}

/**
 *	@desc 保存成功操作 
 */
function updateSuccessFun(){
	top.showAlert("提示", "保存成功", 'info');
    reloadData("query_excel_template.htm", "#queryDatagrid");
    top.closeDlg('updateExcelTemplate');
}

/**
 * @desc 保存文件
 * @param businessId	业务id
 * @returns
 */
function saveFileInfo(businessId){
	$inputObj = $('#file');
	if ($inputObj.val() == "请选择excel文件") {
		top.showAlert("提示", "请选择数据！", 'info');
		return;
	} else if ($inputObj.val() == "") {
		top.showAlert("提示", "请选择数据！", 'info');
		return;
	} else if ($inputObj.val().indexOf(".xls") == -1
			&& $inputObj.val().indexOf(".xlsx") == -1) {
		top.showAlert("提示", "请选择excel数据！", 'info');
		return;
	}
	uploader.option('server',addTokenForUrl(rootPath
			+ "/jasframework/excelTemplate/upload.do?excelTemplateType=" + $('#excelTemplateType').val() +"&oid=" + businessId));
	// 模板文件单元格取值验证
	uploader.upload();
	uploader.on('uploadSuccess', function(file, result) {
		if (result.status == 1 && !isNull(result.data)) {
			$.messager.alert("提示", "保存成功！", "info", function() {
				reloadData('query_excel_template.htm', "#queryDatagrid");
				closePanel();
			});
		} else {
			$.messager.alert("提示", result.msg, "info", function() {
				closePanel();
			});
		}
	});
}

/**
 * @desc 保存
 */
function save() {
    disableButtion("saveButton");
	var bool = $("#tableForm").form('validate');
    if (bool == false) {
        return bool;
    }
    bool = checkNameOrCode();
    if(bool){
        $.ajax({
            url: rootPath + '/jasframework/excelTemplate/update.do',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify($("#tableForm").serializeToJson()),
            success: function (result) {
                if (result.status == -1) {
                    top.showAlert("提示", "保存失败", 'error');
                }else{
                	/*if($('.upload-file').is(":hidden")){
                		updateSuccessFun();
                	}else{
                		saveFileInfo(oid);
                	}*/
                	if ($('#file').val().indexOf(".xls") > -1
                			|| $('#file').val().indexOf(".xlsx") > -1){
                		saveFileInfo(oid);
                	}else{
                		updateSuccessFun();
                	}
                }
            }
        });
    }
    enableButtion("saveButton");
}

/**
 * @desc 关闭
 */
function closePanel(){
	top.closeDlg('updateExcelTemplate');
}

/**
 * @desc 重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}