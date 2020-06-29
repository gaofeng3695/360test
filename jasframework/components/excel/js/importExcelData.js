/**
 * 
 * 文件描述: 将excel数据导入到数据库中

 * @author LiuDongya
 * @version 1.0
 * 
 */

var callerPageUrl = getParamter('callerPageUrl');
var datagridElementId = getParamter('datagridElementId');
var templateId = getParamter("templateId");
var tableName = getParamter("tableName");
var functionName =getParamter("functionName");
var fileNameWithId = "";	// 下载错误信息文件Id命名
var fileName = "";	// 下载错误信息文件名称

$(function(){
	$("<div id=\"load-mask\" class=\"datagrid-mask\"></div>").css({width:"100%",height:$(window).height()}).appendTo("body");
	$("<div id=\"load-mask-msg\" class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候。。。").appendTo("body").css({left:($(document.body).outerWidth(true) - 240) / 2,top:($(window).height() - 45) / 2});
	handleStyle();
});

function showLoadingMessage(message){
	$('#load-mask-msg').html(message);
	$('#load-mask').css('display','block');
	$('#load-mask-msg').css('display','block');
}
function hiddenLoadingMessage(){
	$('#load-mask').css('display','none');
	$('#load-mask-msg').css('display','none');
}

/**
 * @desc 上传
 */
function uploadDataFile(){
	$inputObj = $('#file');
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
	showLoadingMessage('正在进行文件解析和数据检查，请耐心等待...');
	uploader.upload();
	uploader.on('uploadSuccess',function(file, returnData) {
		hiddenLoadingMessage();
//		var returnData = $.parseJSON(returnData);
		var totalCount = returnData.totalCount;
		var validatedDataCount = returnData.validatedDataCount;
		var checkResutlMessage = returnData.errorMessage;
		var errorCode = returnData.errorCode;
		if(errorCode=='01' || errorCode=='02' || errorCode=='03' || errorCode=='04' ){
			top.showAlert("提示",checkResutlMessage,'');
		}else if(errorCode=='05'){
			var resutlMessage="</br>数据总条数: <span style='font-weight:bold;color:red'>"+totalCount+"</span>"
			+" 有效数据条数: <span style='font-weight:bold;color:red'>"+validatedDataCount+"</span>";
			if(totalCount!=validatedDataCount){
//				resutlMessage = resutlMessage+" 以下为具体检查结果：<br>"+checkResutlMessage;
				resutlMessage = resutlMessage+" 以下为具体检查结果：<br>";
				var arr = checkResutlMessage.split("$");
				$.each(arr, function(i){
					if(arr[i].indexOf("<br>") != -1){
						resutlMessage += arr[i];
					}else{
						resutlMessage += arr[i]+"<br>";
					}
				});
			}
			$('#fileChoose').css('display','none');
			$('#dataCheckResult').css('display','block');
			$('#dataCheckResult').html($('#dataCheckResult').html()+resutlMessage);
			$('#fileChooseButton').css('display','none');
			$('#dataCheckResultButton').css('display','block');
			// 添加错误文件的下载
			if(!isNull(returnData.tempErrorFile)){
				var arr = $inputObj.val().split("\\");
				fileNameWithId = returnData.tempErrorFile;
				fileName = arr[arr.length-1];
			}
						
			if(validatedDataCount=='0'){
				disableButtion('importData-initial');
				disableButtion('importData-update');
			}
		}else{
			var resutlMessage = checkResutlMessage;
			$('#fileChoose').css('display','none');
			$('#dataCheckResult').css('display','block');
			$('#fileChooseButton').css('display','none');
			$('#dataCheckResultButton').css('display','block');
			$('#dataCheckResult').html($('#dataCheckResult').html()+"<span style='font-weight:bold;color:red'>"+resutlMessage);
			$("#download-btn").hide();
			if(validatedDataCount=='0'){
				disableButtion('importData-initial');
				disableButtion('importData-update');
				disableButtion('importData-overwrite');
			}
		}		
	});
}

/**
 * @desc 导入提示
 * @param importType
 */
function importData(importType){
//	if(importType=='overwrite' && fkValue==''){
//		top.showAlert("提示",'覆盖更新只适用于子表数据更新!','');
//		return;
//	}
	if(importType=='update'){
		$.messager.confirm("确认","更新导入比较耗时，确定要更新导入吗？",function(r){
			if (r){
				showLoadingMessage('更新导入较耗时，请耐心等待...');
				importDataRequest(importType);
			}
		});
	}else{
		showLoadingMessage('正在进行数据入库，请耐心等待...');
		importDataRequest(importType);
	}
	
}

/**
 * @desc 不同方式导入excel
 * @param importType
 */
function importDataRequest(importType){
	$.ajax({
		url : rootPath+"jasframework/excel/saveDataToDatabase.do",
		type : 'POST',
		data: 'json',
		data : {importType:importType},
		success : function(returnData) {
			hiddenLoadingMessage();
//			var returnData = $.parseJSON(returnData);
			if(returnData.errorCode == "1"){
				top.showAlert("提示", returnData.errorMess, '');
				return;
			}
			var addSuccessCount = returnData.addSuccessCount;
			var addFailureCount = returnData.addFailureCount;
			var addErrorMessage = returnData.addErrorMessage;
			var updateSuccessCount = returnData.updateSuccessCount;
			var updateFailureCount = returnData.updateFailureCount;
			var updateErrorMessage = returnData.updateErrorMessage;
			if(!addSuccessCount || addSuccessCount==''){
				addSuccessCount = 0;
			}
			if(!addFailureCount || addFailureCount==''){
				addFailureCount = 0;
			}
			if(!updateSuccessCount || updateSuccessCount==''){
				updateSuccessCount = 0;
			}
			if(!updateFailureCount || updateFailureCount==''){
				updateFailureCount = 0;
			}
			var totalSuccessCount = parseInt(addSuccessCount) + parseInt (updateSuccessCount);
			var totalFailureCount = parseInt(addFailureCount) + parseInt (updateFailureCount);
			if(!addErrorMessage){
				addErrorMessage="";
			}
			if(!updateErrorMessage){
				updateErrorMessage="";
			}
			
			var importToDBErrorInfo = "";
			if(importType=='initial'){
				importToDBErrorInfo="成功导入数据条数： <span style='font-weight:bold;color:red'>" + addSuccessCount + "</span> ，未成功导入数据条数 <span style='font-weight:bold;color:red'>" + addFailureCount +"</span>";
				if(addFailureCount!=0){
					importToDBErrorInfo +=", 以下为具体错误信息：<br>";
					var inintArr = addErrorMessage.split("$");
					$.each(inintArr, function(i){
						if(inintArr[i].indexOf("<br>") != -1){
							importToDBErrorInfo += inintArr[i];
						}else{
							importToDBErrorInfo += inintArr[i]+"<br>";
						}
					});
				}
			}
			if(importType=='update'){
				if(totalSuccessCount!=0){
					importToDBErrorInfo="成功导入数据条数：<span style='font-weight:bold;color:red'>" + totalSuccessCount +"</span>" + " ，其中添加条数：<span style='font-weight:bold;color:red'>"+addSuccessCount+"</span>" +" ，更新条数： <span style='font-weight:bold;color:red'>" + updateSuccessCount +"</span>" + " 。 未成功导入数据条数 <span style='font-weight:bold;color:red'>" + totalFailureCount +"</span>";
				}
				if(totalFailureCount!=0){
					importToDBErrorInfo +=" , 以下为具体错误信息：<br>";
					var addArr = addErrorMessage.split("$");
					$.each(addArr, function(i){
						importToDBErrorInfo += addArr[i]+"<br>";
						if(addArr[i].indexOf("<br>") != -1){
							importToDBErrorInfo += addArr[i];
						}else{
							importToDBErrorInfo += addArr[i]+"<br>";
						}
					});
					var updateArr = updateErrorMessage.split("$");
					$.each(updateArr, function(i){
						if(updateArr[i].indexOf("<br>") != -1){
							importToDBErrorInfo += updateArr[i];
						}else{
							importToDBErrorInfo += updateArr[i]+"<br>";
						}
					});
				}	
			}
			
			$('#dataCheckResult').css('display','none');
			$('#dataImportResult').css('display','block');
			$('#dataImportResult').html($('#dataImportResult').html()+importToDBErrorInfo);
			
			$('#dataCheckResultButton').css('display','none');
			$('#dataImportResultButton').css('display','block');
			
			//刷新页面数据列表
			if(totalSuccessCount>0){
				if(callerPageUrl!='' && datagridElementId!=''){
					reloadData(callerPageUrl, datagridElementId);
				}
			}
		},
		error : function(data) {
			hiddenLoadingMessage();
			top.showAlert('提示', '数据导入失败！', 'error');	
		}
	});
}

/**
 * 
 * 方法描述：关闭窗口
 * 
 */
function closeSave() {
	if(!isNull(fileNameWithId)){
		deleteErrorFile();
	}else{
		top.closeDlg('importiframe');
	}
}

function handleStyle(){
	$("#file").attr('style','color:gray;');
	$("#file").val('请选择excel文件');
}


/**
 * @desc 下载服务器错误文件
 */
function downloadError(){
	$("<iframe id=\"downloadIframe\" style=\"display: none;\"></iframe>").appendTo("body");
	var url = addTokenForUrl(rootPath+"jasframework/excel/downloadErrorFile.do?fileNameId="+fileNameWithId+"&fileName="+encodeURI(encodeURI(fileName)));
	$("#downloadIframe").attr('src', url);
}

/**
 * @desc 删除服务器错误文件
 */
function deleteErrorFile(){
	$.ajax({
		url: rootPath+"jasframework/excel/deleteErrorFile.do?fileNameWithId="+fileNameWithId,
		dataType: 'json',
		success: function(result){
			if(result.resultBoolean == true){
				console.log(true);
				top.closeDlg('importiframe');
			}
		}
	});
}
