/**
 * 
 * 类描述: 流程模型功能js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2013-4-1 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */
var workflowModelPageRootPath = workflow.page.model;  //流程模型页面根路径
var workflowModelUrlRootPath = workflow.URL.model; //流程模型后台请求根路径

/**
 * 描述：初始化数据列表
 */
var datagridID = "workflowModelDatagrid";
var datagridObj;
function initDatagrid(){
	datagridObj = $('#'+datagridID);
	datagridObj.datagrid( {
		nowrap : true,
		striped : true,
		collapsible : false,
		url : workflowModelUrlRootPath.allList,
		idField:'modelId',
		pagination : true,
		rownumbers : true,
		singleSelect:true,
		fitColumns: true,
		//contentType:application/json,page rows->pageNo pageSize,sort order->orderBy,data->dataJSONString
		loader : function(param, success, error) { 
			datagridBeforeSend(param, success, error,$(this).datagrid("options"));
		 }, 
		columns : [ [ {
			field : 'ck',
		 	title : getLanguageValue('ck'),
			checkbox : true
		}, {
			field : 'modelId',
			title : getLanguageValue('workflow.modelId'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			hidden : false,
			sortable : true
		},  {
			field : 'modelKey',
			title : getLanguageValue('workflow.modelKey'),
			width:$(this).width() * 0.14,
        	resizable:true,
			hidden : false,
			align:"center",
			sortable : true
		},  {
			field : 'modelName',
			title : getLanguageValue('workflow.modelName'),
			width:$(this).width() * 0.14,
        	resizable:true,
			sortable : false,
			align:"center",
			sortable : true
		}, {
			field : 'modelVersion',
			title : getLanguageValue('workflow.modelVersion'),
			width : 150,
			hidden : true,
			sortable : true
		},{
			field : 'createTime',
			title : getLanguageValue('workflow.createTime'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			sortable : true
		}, {
			field : 'lastUpdateTime',
			title : getLanguageValue('workflow.lastUpdateTime'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			sortable : true
		}, {
			field : 'appName',
			title : getLanguageValue('workflow.appName'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center"
		}, {
			field : 'deploymentId',
			title : getLanguageValue('workflow.deploymentId'),
			width:$(this).width() * 0.14,
        	resizable:true,
			hidden : false,
			sortable : true,
			align:"center"
		}] ]
	});	
	initDatagrigHeight(datagridID,'',0);
}

/**
 * 查看流程图，弹出流程图显示页面窗口
 */
 function showWorkFlowChart() {
	var rows = datagridObj.datagrid("getSelections");
	if (rows.length == 1) {
		workflow.openWorkflowChart('deploymentId='+rows[0].deploymentId);
	} else {
		workflow.tipChooseRecored();
	}
}
 /**
  * 弹出新增流程模型信息页面窗口
  */
 var addModelPath = workflowModelPageRootPath.add;
 function showAddPage(){
	top.getDlg(addModelPath.url,
			addModelPath.id,getLanguageValue(addModelPath.key),
			addModelPath.w,addModelPath.h);
 }

/**
 * 方法描述：保存模型信息，保存成功后进入模型编辑页面
 **/
function saveModel(){
	var saveBtnId = "savebutton";
	disableButtion(saveBtnId);
	var validateForm = $("#modelForm");
	var validateResault = validateForm.form("validate");
	if(validateResault == false){
		enableButtion(saveBtnId);
		return validateResault;
	}
	var params = validateForm.serializeToJson();
	workflow.addModel(params,function(result){
		if(result.status==1){
			$.messager.confirm(getLanguageValue("tip"), getLanguageValue("workflow.saveModelSuccess"),function(r){
				reloadData('model.htm',datagridID);
				closePanel(addModelPath.id);
			});
		} else {
			top.showAlert(getLanguageValue("tip"), result.msg, 'error');
			enableButtion(saveBtnId);
		}
	})
	
	
	/*$('#modelForm').form('submit', {
		url : urlPath+"/model/createModel.do",
		onSubmit : function() {
			var bool=$(this).form('validate');
			if(bool==false){
				enableButtion(saveBtnId);
			}
			return bool;
		},
		success : function(result) {
			result = JSON.parse(result);
			//返回模型ID，如果返回null，则保存模型失败
			if(result!=null){
				parent.getDlg('modeler.html?modelId='+result, 'updateModel', getLanguageValue("editModel"), 900, 600,false,true,true);
				parent.closeDlg('addModel');
			}else{
				enableButtion(saveBtnId);
				showAlert(getLanguageValue("error"), getLanguageValue("model.create.error"), 'error');
			}
		}
	});*/
}
/**
 * 弹出修改流程模型信息页面窗口
 */
var updateModelPath = workflowModelPageRootPath.update;
function showUpdatePage(){
	var rows = datagridObj.datagrid('getSelections');
	if (rows.length == 1){
		top.getDlg(updateModelPath.url+"?modelId="+rows[0].modelId,
				updateModelPath.id,getLanguageValue(updateModelPath.key),
				updateModelPath.w,updateModelPath.h);
	}else{
		workflow.tipChooseRecored();
	}
}
/**
 * 初始化修改页面委托信息
 */
function loadInfoForUpdatePage(pkfield) {
	workflow.getModel(pkfield,function(result){
		if(result.status==-1){
			top.showAlert(getLanguageValue("tip"), result.msg, 'error');
		} else {
			loadData(result.data);
		}
	});
	function loadData(jsondata){
		$('#modelForm').form('load',jsondata);
	}
}
function updateModel(){
	var saveBtnId = "savebutton";
	disableButtion(saveBtnId);
	var validateForm = $("#modelForm");
	var validateResault = validateForm.form("validate");
	if(validateResault == false){
		enableButtion(saveBtnId);
		return validateResault;
	}
	var params = validateForm.serializeToJson();
	workflow.updateModel(params,function(result){
		if(result.status==1){
			$.messager.confirm(getLanguageValue("tip"), getLanguageValue("workflow.updateModelSuccess"),function(r){
				reloadData('model.htm',datagridID);
				closePanel(updateModelPath.id);
			});
		} else {
			top.showAlert(getLanguageValue("tip"), result.msg, 'error');
			enableButtion(saveBtnId);
		}
	})
}

/**
 * 弹出流程配置信息页面窗口
 */
var configModelPath = workflowModelPageRootPath.config;
function showConfigPage(){
	var rows = datagridObj.datagrid('getSelections');
	if (rows.length == 1){
		top.getDlg(configModelPath.url+"?modelId="+rows[0].modelId,
				configModelPath.id,getLanguageValue(configModelPath.key),
				configModelPath.w,configModelPath.h,false,true,true);
	}else{
		workflow.tipChooseRecored();
	}
}


/**
 * 弹出编辑模型信息页面
 * create by Shenjie 2015-5-13 15:16
 **/
function editModel(){
	var modelId = getParamter("modelId");
	//window.open(getRootPath()+"/service/editor?id="+rows[0].id);
	parent.getDlg('modeler.html?modelId='+modelId, 'editModel', getLanguageValue("editModel"), 900, 500,false,true,true);
	parent.closeDlg('updateModel');
}


/**
 * 方法描述：删除流程模型
 **/
function deleteModel(){
	var rows = datagridObj.datagrid('getSelections');
	if (rows.length == 1){
		$.messager.confirm(getLanguageValue("delete"),getLanguageValue("deleteconfirm"),function(r){
			if (r){
				var modelId = rows[0].modelId;
				workflow.deleteModel([modelId],function(result){
					if(result.status==1){
						$.messager.confirm(getLanguageValue("tip"), getLanguageValue("workflow.deleteModelSuccess"),function(r){
							reloadData('model.htm',datagridID);
						});
					} else {
						top.showAlert(getLanguageValue("tip"), result.msg, 'error');
					}
				})
			}
		});
		
	}else{
		workflow.tipChooseRecored();
	}
}

/**
 * 部署流程模型
 **/
function deployModel(){
	var rows = datagridObj.datagrid('getSelections');
	if (rows.length == 1){
		$.messager.confirm(getLanguageValue("deploy"),getLanguageValue("deployConfirm"),function(r){
			if (r){
				var modelId = rows[0].modelId;
				workflow.deployModel([modelId],function(result){
					if(result.status==1){
						$.messager.confirm(getLanguageValue("tip"), getLanguageValue("workflow.deployModelSuccess"),function(r){
							reloadData('model.htm',datagridID);
						});
					} else {
						top.showAlert(getLanguageValue("tip"), result.msg, 'error');
					}
				})
			}
		});
		
	}else{
		workflow.tipChooseRecored();
	}
}
/**
 * 部署流程导出
 **/
function exportModel(){
	var rows = datagridObj.datagrid('getSelections');
	if (rows.length == 1){
		var url = workflowModelUrlRootPath._export+"?modelId="+rows[0].modelId;
		$("#exprotPlanframe").attr("src", addTokenForUrl(url));
	}else{
		workflow.tipChooseRecored();
	}
}



/**
 * 导入流程模型
 * @param callback 成功回调函数
 **/
function importModel(){
	closePanel('importModel');
	getDlg('importModel.htm', 'importModel', getLanguageValue("workflow.importModel"), 600, 180);
}

/**
 * 描述：获得应用系统
 */
function getAppSystem(){
	$.ajax({
		url:rootPath+"/jasframework/workflow/app/getList.do",
		type:"get",
		success:function(result){
			$('#appId').combobox({ 
				data:result.rows, 
				valueField:'appId', 
				textField:'appName', 
				width:"100%"
			}); 
		},
		dataType:"json",
		error:function(){
		}
	});
}


/**
 * 描述：添加文件输入框
 */
function addFileInput(){
	index++;
	//输入框html
	var inputHtml = "<tr>"
						+"<td colspan='1'></td>" 
						+"<td colspan='1'>"
							+"<input id='file"+ index +"' class='input_bg' type='file' name='file" + index + "' style='' onChange='chkType(this," + index + ")' onKeyDown='return false'/>"
						+"</td>"
						+"<td colspan='1' align='center'>"
							+"<a href='#' class='easyui-linkbutton' onclick='deleteTR(this);'>"
							+"<span key='cancael' class='paltform-i18n'>删除</span>"
							+"</a>"
						+"</td>"
					+"<tr>";
	//获取table的tr
	var trObj = $(".edit-table");
	$.parser.parse($(".edit-table"));
	var trSize = trObj.size();
	$(trObj).append(inputHtml);
	$('.edit-table').each(function(i, item) {
		$.parser.parse($(item));
	});
}
function deleteTR(obj) {
	$(obj).parents("tr").remove();
}
/**
 * 描述：检查文件上传类型是否正确
 * @param obj 上传文件扩展名html元素
 * @param index 文件输入框排序值
 */
function chkType (obj,index) {
	var ext = $(obj).val();
	var ss = ext.split('.');
	var exts= $("#exts").val();
	if (exts.indexOf(ss[ss.length - 1].toLowerCase()) == -1) {
		showAlert(getLanguageValue("tip"), getLanguageValue("uploadFileTypeUnexpected"), 'info');
		var inputHtml= "<input id='file" + index + "' class='input_bg' type='file' name='file" + index + "' style='' onChange='chkType(this," + index + ")' onKeyDown='return false'/>";
		$(obj).parent().html(inputHtml);
	}
}

/**
 * 描述：上传文件
 */
function uploadfile(){
	var inputObj = $("input[name^='file']");
	if(inputObj.size()==1 ){
		if( inputObj.val() == ""){
			showAlert(getLanguageValue("tip"), getLanguageValue("selectFile"), "info");
			return;
		}
	}else{
		var flag = false;
		inputObj.each(function(){
			if($(this).val()!=""){
				flag = true;
			};
		});
		if( !flag ){
			showAlert(getLanguageValue("tip"), getLanguageValue("selectFile"), "info");
			return;
		}
	}
	$('#uploadForm').form('submit',{
		url: urlPath+"model/importModel.do",
		success: function(result){
			result = eval('('+result+')');
			if (result.error){
				showAlert(getLanguageValue("error"), result.errorMessage, result.alertType);
			}else{
				$(".edit-table").hide("fast",function(){
					$("#uploadFileSize").text(result.uploadFileSize);
					if(result.deployFile.length>0){
						//部署html
						var deployHtml = "<table class='detail-table'>";
						//未部署html
						var unDeployHtml = "<table class='detail-table'>";
						for(var i=0;i<result.deployFile.length;i++){
							var deployFile = result.deployFile[i];
							if(deployFile.isDeploy=="1"){
								deployHtml+="<tr>"
									+"<td style='width:25%'><span key=\"\" >"+deployFile.fileName+"</span></td>"
									+"<td style='width:75%'><span id=\"\">"+deployFile.filePath+"</span></td>"
									+"</tr>";
							}else{
								unDeployHtml+="<tr>"
									+"<td style='width:25%'><span key=\"\" class=\"paltform-i18n\">"+deployFile.fileName+"</span></td>"
									+"<td style='width:75%'><span id=\"\">"+deployFile.remarks+"</span></td>"
									+"</tr>";
							}
						}
						deployHtml+="</table>";
						unDeployHtml+="</table>";
						if(result.deploySize>0){
							$("#deploySize").html(deployHtml);
						}
						if(result.unDeploySize>0){
							$("#unDeploySize").html(unDeployHtml);;
						}
					}
					$(".detail-table").fadeIn("slow",function(){
						$("#upbutton").hide();
						$(".buttontable").show();
						$("#filebutton").show();
						reloadData('model.htm','1011100201');
					});
				});
			}
		}
	});
}

 
/**
 * 描述：回调函数
 * @param result 返回值
 */
function refreshPage(result){
	if (result.error){
		showAlert(getLanguageValue("error"), result.errorMessage, result.alertType);
	} else {
		showAlert(getLanguageValue("workflow.deploy"),result.successMessage,'ok',function(){
			datagridObj.datagrid('reload'); //重新加载
		});
	}
	
}