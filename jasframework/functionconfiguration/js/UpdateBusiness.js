/**
 * 
 * 类描述: 根据业务数据生成修改页面。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-08-30 上午17:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-10-16       修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */
//表单字段位置
var locationFlag=0;
(function($) {
	
	/**
     * 方法描述：定义修改UI类并初始化类中的属性和方法。
     */
	$.jasfcFactory( "jasfc.UpdateBusiness", {
		options: {
			idField : '',
			functionName : '',
			updatefunctionData : null,
			businessDataId : '',
			divid:'',
			configuration:'',
			data:null
		},
		/**
		 * 方法描述：根据修改配置参数加载页面 
		 * param target DOM
		 * param updateFieldsStr 修改配置信息（带有json格式的字符串数据） 
		 * param comandConfigstr 修改页面的保存和取消按钮配置（带有json格式的字符串数据）
		 * param functionName 功能编号
		 * param businessDataId 选中记录id值
		 * param pkfield 表唯一标示列
		 */
		loadUpdatePage : function(){
			var target = this.options.divid;
			var updateFieldsStr =this.options.updatefunctionData;
			var functionName =this.options.functionName;
			var businessDataId =this.options.businessDataId;
			var pkfield =this.options.idField;
			var updateFields =JSON.parse(updateFieldsStr);
			var configuration =this.options.configuration;
			var hasAttachments =this.options.configuration.hasattachment;
			var hasWorkflow = this.options.configuration.hasworkflow;
			// 字段信息
			var tableColumn = "";
			// 循环加载注册
			var table ="<div id=\"contentArea\">";
			if(hasAttachments ==1){
				table +="<input type=\"hidden\" id=\"exts\" name=\"exts\" value=\"rar,jar,doc,docx,txt,jpg,png\"/>";
			}
			if(configuration.ishasrelated==1){
				var height=document.documentElement.clientHeight-40;
				table += "<div id=\"tt\" class=\"easyui-tabs\" style=\"height:"+height+"px;\"><div title=\""+title+"\">";
			}
			table += "<form id=\""
					+ functionName
					+ "\" method=\"post\" enctype=\"multipart/form-data\"><table class=\"edit-table\">";
			// 循环加载修改页面表单
			for ( var i = 0; i < updateFields.length; i++) {
				//如果字段取值规则为"界面输入"，则显示该字段
				if(updateFields[i].valueRuleType==null||updateFields[i].valueRuleType=="input"){
					tableColumn += updateFields[i].fieldID + ",";
					table+=initUIForm(locationFlag,updateFields[i].formuitype,updateFields[i].fieldID,updateFields[i].fieldName,updateFields[i].fieldlength,updateFields[i].isReaquered,'',language,updateFields[i].validatetype);
					locationFlag++;
				}
			}
			if(configuration.geometrytype!='none'){
				table +="<tr><td width =\"20%\"><span>"+configuration.i18related.spatialdata+"：</span></td><td colspan=\"3\"><textarea id=\"updatefeaure\" name=\"updatefeaure\"  style=\"height:80px\" class=\"easyui-validatebox input_bg\" required=\"true\" validType=\"spatialDataValidate\"></textarea></td></tr>";
			}
			//按钮
			var button = "button" + Math.random() * 100000000000000000;
			//加载修改页面按钮
			table += "</table>" ;
			if(hasAttachments ==1){
				//附件上传
				table +="<div id=\"uploadanddownloadDIV\" align=\"right\"></div>";
			}
			table += "</form>";
			//如果存在关联表加载关联信息
			if(configuration.ishasrelated==1){
				table += "</div>";
				for(var i=0;i<configuration.subAllFields.length;i++){
					table += "<div title=\""+configuration.subAllFields[i].tablename+"\"><iframe id=\"subadd"+i+"\" frameborder=\"0\" style=\"width:100%;height:99%;\"></iframe></div>";
				}
				table += "</div>";
			}
			table +="<div class=\"button-area\"><table style=\"width:100%\;\"><tr><td align=\"center\">";
			for(var i=0;i<configuration.commandsConfig.length;i++){
				if(configuration.commandsConfig[i].privilegeNumber =='saveButton'){
					//保存按钮
					table +="<a href=\"#\" id=\"saveButton\" class=\"easyui-linkbutton\" iconCls='icon-save' plain=\"false\">"+configuration.commandsConfig[i].parentName+"</a>";
				}else if(configuration.commandsConfig[i].privilegeNumber =='saveAndLaunchButton'&&hasWorkflow){
					//保存并发起按钮
					table +="<a href=\"#\" id=\"saveAndLaunchButton\" class=\"easyui-linkbutton\" iconCls='icon-work' plain=\"false\">"+configuration.commandsConfig[i].parentName+"</a>";
				}else if(configuration.commandsConfig[i].privilegeNumber =='closeButton'){
					//取消按钮
					table += "<a href=\"#\" id=\"closeButton\" class=\"easyui-linkbutton\" iconCls='icon-cancel' plain=\"false\">"+configuration.commandsConfig[i].parentName+"</a>";	
				}
			}
			
			table+="</td></tr></table></div></div>";
			$(target).append($(table));
			getDomainData(updateFields,functionName);
			//绑定修改页面值域值
			this._loadUpdateData(target, updateFields, functionName, pkfield,businessDataId,configuration);
			
			if(configuration.ishasrelated==1){
				//点击从表tab页加载从表页面
				$("#tt").tabs({
					onSelect:function(title,index){
						for(var i=0;i<configuration.subAllFields.length;i++){
							if(title==configuration.subAllFields[i].tablename){
								if(configuration.ishasrelated==1){
									$('#'+button).hide();
								}
							}
							if(configuration.subAllFields[i].subeventid!=''){
								var masterFieldName=configuration.subAllFields[i].masterRelatedField;
								var num=0;
								$('select').each(function(i,item) {
									 var pp = item.id;
									 if(pp!='' && pp==masterFieldName){
										 num+=1;
										 
									 }
								});
//								if(num>0){
//									masterFieldValue=$('#'+masterFieldName).combobox("getText");
//								}else{
//									masterFieldValue=eval('$(\'#'+masterFieldName+'\').val()');
//								}
							
								$('#subadd'+i).attr('src','subIndexHtml.htm?functionName='+configuration.subAllFields[i].functionnumber
										+'&subIdField='+configuration.subAllFields[i].subeventid+'&subeventid='+masterFieldValue);
								
							}
							if(title==0){
								if($('#'+button).css('display')=='none')
								$('#'+button).show();
							}
						}
					}
				});
			}
			
			this._addButtonEvents("saveButton",functionName,configuration,businessDataId,pkfield);
			if(hasWorkflow){
				this._addButtonEvents("saveAndLaunchButton",functionName,configuration,businessDataId,pkfield);
			}
			this._addButtonEvents("closeButton");
			if(hasAttachments ==1){
				businessid =businessDataId;
				uploadanddownload(configuration);
			}
		},
		/**
		 * 方法描述：为修改页面绑定字段值
		 * param target DOM
		 * param updateFields JSON格式的修改功能配置信息
		 * param functionName 功能编号 
		 * param businessDataId 修改记录id值
		 * param pkfield 表的唯一标示列
		 */
		_loadUpdateData : function(target, updateFields, functionName,pkfield, businessDataId,configuration) {
			showLoadingMessage("正在处理，请稍候...");	//显示等待提示对话框
			$.ajax({
				url : '../getUpdateBusinessData.do?functionName='+functionName+'&pkfield='+pkfield+'&businessDataId='+businessDataId+'&geometrytype='+configuration.geometrytype,
				dataType : 'json',
				success : function(data) {
					hiddenLoadingMessage();	//显示等待提示对话框
					$('input').each(function(i,item) {
						 var pp = item.id;
						 if(pp!='' && pp.indexOf('MARKERID') < 0){
							 if(eval('('+'data\.'+pp+')') ==null){
								 $('#'+pp).val('');
							 }else{
								 $('#'+pp).val(eval('('+'data\.'+pp+')'));
							 }
						 }
					});
					$('textarea').each(function(i,item) {
						 var pp = item.id;
						 if(eval('('+'data\.'+pp+')') ==null){
							 $('#'+pp).val('');
						 }else{
							 $('#'+pp).val(eval('('+'data\.'+pp+')'));
						 }
					});
					
					$('select').each(function(i,item) {
						 var pp = item.id;
						 if(eval('('+'data\.'+pp+')') ==null){
							 $('#'+pp).combobox('setValue','');
						 }else{
							 var sex=eval('('+'data\.'+pp+')');
							 setTimeout(subSample,100);
							 function subSample(){
								 $('#'+pp).combobox('setValue',sex);
							 }
						 }
					});
					
				},
				error : function() {
					top.showAlert(configuration.i18related.error, configuration.i18related.queryerror, 'error');
				}
			});
			
		},
		
		/**
		 * 根据注册信息加载修改页面 param tableColumn 修改页面注册信息 param functionName 功能id
		 */
		_addButtonEvents : function(buttonid, functionName,configuration,businessDataId,pkfield){
			$('#' + buttonid).bind('click', function() {
				if (buttonid == 'saveButton') {
					submitForm(functionName,configuration,businessDataId,false,pkfield);
				}else if (buttonid == 'closeButton') {
					top.closeDlg("addHtml");
				}else if(buttonid == 'saveAndLaunchButton'){
					submitForm(functionName,configuration,businessDataId,true,pkfield);
				}
			});
		}
	});
	/**
	 * 方法描述：加载修改下拉框的值并搬到修改值
	 * param target DOM
	 * param updateFields JSON格式的修改功能配置信息
	 * param functionName 功能编号 
	 * param businessDataId 修改记录id值
	 * param pkfield 表唯一标示列
	 * param data 指定的修改记录信息
	 */
	function getDomainData(updateFields,functionName) {
		for ( var i = 0; i < updateFields.length; i++) {
			//加载下拉列表框
			if(updateFields[i].formuitype =='combox'){
				combox =updateFields[i].fieldID;
				requestPost(combox,functionName,1,updateFields[i]);
				//联动
				if(updateFields[i].cascadefieldname != null){
					var nextid =updateFields[i].cascadefieldname;
					$('#'+updateFields[i].fieldID).change(function(){
						requestPost(nextid,functionName,$(this).val());
					});
				}
			}
		}
	}
	/**
	 * 方法描述：修改页面表单提交
	 * param target DOM
	 * param formid 新增按钮id
	 * param functionName 功能点id
	 * param tableColumn 修改字段
	 * param businessDataId 记录id值
	 */
	function submitForm(functionName,configuration,businessDataId,isLaunched,pkfield) {
		//form表单验证
		if($('#'+functionName).form('validate')==false)
      		return false;
		var url = '../updateBusinessData.do';
		// 按钮不可用
		$('#saveButton').linkbutton('disable');
		$ ('#saveAndLaunchButton').linkbutton('disable');
		// 表单提交
		$('#'+functionName).form('submit',{
			url : url+'?functionName=' + functionName+ '&businessDataId='+businessDataId+'&isLaunched='+isLaunched+'&pkfield='+pkfield,
			success : function(data) {
				data=JSON.parse(data);
				if(data.result=="true"){
					top.showAlert(configuration.i18related.prompt, configuration.i18related.savesuccess, 'info',function(){
						reloadData("indexHtml.htm",functionName);
						if(configuration.ishasrelated==0){
							top.closeDlg("addHtml");
						}else{
							$ ('#saveButton').linkbutton('enable');
							$ ('#saveAndLaunchButton').linkbutton('enable');
							$('#tt').tabs('enableTab', 1);	
							$('#tt').tabs('select', 1);	
						}
					});
				}else{
					// 如果修改失败按钮可用
					$('#saveButton').linkbutton('enable');
					$ ('#saveAndLaunchButton').linkbutton('enable');
					if(data.message){
						top.showAlert(configuration.i18related.error, data.message, 'error');
					}else{
						top.showAlert(configuration.i18related.error, configuration.i18related.savefail, 'error');
					}
				}
				
			},
			error: function(data){
				// 如果修改失败按钮可用
				$('#saveButton').linkbutton('enable');
				$ ('#saveAndLaunchButton').linkbutton('enable');
				$.messager.alert(configuration.i18related.error, configuration.i18related.savefail, 'error');
			}
		});
		
	}
	
	/**
	 * 
	 * 方法描述：下拉联动值域数据绑定
	 * 
	 * param functionName 功能点id 
	 * param comboxid 下拉框id
	 * param flag 1为第一级下拉框加载，0为次级下拉框加载
	 * param fieldInfo 字段信息
	 * 
	 */
	function requestPost(combox,functionName,flag,fieldInfo){
		var comboboxurl;
		if(flag ==1){
			comboboxurl='../getDomainDataAction.do?random='+new Date()+"&functionName=" + functionName + "&comboxid=" + combox;
			loadComboboxDataByUrl(combox,comboboxurl,'ID','TEXT');
			$('#' + combox).combobox({
				onSelect : function(row){
					//加载联动信息
					comboboxurl='../getNextDomainDataAction.do?functionName='
						+ functionName + '&field=' + fieldInfo.cascadefieldname
						+ '&fieldValue='+ encodeURI(row.ID);
					loadComboboxDataByUrl(fieldInfo.cascadefieldname,comboboxurl,'ID','TEXT');
				}
			});
		}else{
			comboboxurl='../getNextDomainDataAction.do?functionName='+functionName+'&field='+combox+'&fieldValue='+flag;
			loadComboboxDataByUrl(combox,comboboxurl,'ID','TEXT');
		}
	}
})(jQuery);