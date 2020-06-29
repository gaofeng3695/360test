/**
 * @file
 * @desc excel导入
 * @author zhangyi
 * @date 2018-08-16
 * @last modified by
 * @last modified time
 */
var callerPageUrl = getParamter('callerPageUrl');
var datagridElementId = getParamter('datagridElementId');
var templateCode = getParamter("templateCode"); // 传入的模板编码需要编码
var importType = "";

$(function () {
	$("<div id=\"load-mask\" class=\"datagrid-mask\"></div>").css({
		width: "100%",
		height: $(window).height()
	}).appendTo("body");
	$("<div id=\"load-mask-msg\" class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候。。。").appendTo("body").css({
		left: ($(document.body).outerWidth(true) - 240) / 2,
		top: ($(window).height() - 45) / 2
	});
	handleStyle();
});

function showLoadingMessage(message) {
	$('#load-mask-msg').html(message);
	$('#load-mask').css('display', 'block');
	$('#load-mask-msg').css('display', 'block');
}

function hiddenLoadingMessage() {
	$('#load-mask').css('display', 'none');
	$('#load-mask-msg').css('display', 'none');
}

/**
 * @desc 文件导入
 */
function uploadDataFile() {
	$inputObj = $('#file');
	if ($inputObj.val() == "请选择excel文件") {
		top.showAlert("提示", "请选择数据！", 'info');
		return;
	} else if ($inputObj.val() == "") {
		top.showAlert("提示", "请选择数据！", 'info');
		return;
	} else if ($inputObj.val().indexOf(".xls") == -1 && $inputObj.val().indexOf(".xlsx") == -1) {
		top.showAlert("提示", "请选择excel数据！", 'info');
		return;
	}
	showLoadingMessage('正在进行文件解析和数据检查，请耐心等待...');
	uploader.upload();
	uploader.on('uploadSuccess', function (file, returnData) {
		hiddenLoadingMessage();
		var resutlMessage = "";
		if (returnData.status == 1) {
			//刷新页面数据列表
			if (callerPageUrl != '' && datagridElementId != '') {
				reloadData(callerPageUrl, datagridElementId);
				closeSave();
			}
		} else {
			if (!isNull(returnData.data)) {
				var list = returnData.data;
				$.each(list, function (i) {
					resutlMessage = list[i] + "<br>";
				});
			} else {
				resutlMessage = returnData.msg;
			}
			$('#fileChoose').css('display', 'none');
			$('#fileChooseButton').css('display', 'none');
			$('#dataImportResult').css('display', 'block');
			$('#dataImportResult').html($('#dataImportResult').html() + resutlMessage);
			$('#dataImportResultButton').css('display', 'block');
		}
	});
}

/**
 * @desc 导入提示
 * @param param	initial 初始导入	update 更新导入
 */
function importData(param) {
	uploader.option('server', addTokenForUrl(rootPath + "/importExcelController/importExcelData.do?templateCode=" + templateCode +
	"&importType=" + param));
	if (importType == 'update') {
		$.messager.confirm("确认", "更新导入比较耗时，确定要更新导入吗？", function (r) {
			if (r) {
				uploadDataFile();
			}
		});
	} else {
		uploadDataFile();
	}

}

/**
 * 
 * @desc 关闭窗口
 * 
 */
function closeSave() {
	top.closeDlg('importExcel');
}

/**
 * @desc
 */
function handleStyle() {
	$("#file").attr('style', 'color:gray;');
	$("#file").val('请选择excel文件');
}
