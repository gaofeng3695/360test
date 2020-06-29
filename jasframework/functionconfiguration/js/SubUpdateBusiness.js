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
     * 方法描述：定义从表修改UI类并初始化类中的属性和方法。
     */
	$.jasfcFactory( "jasfc.SubUpdateBusiness", {
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
		 * param eventid 选中记录id值
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
			// 字段信息
			var tableColumn = "";
			// 循环加载注册
			var table ="<div id=\"contentArea\">";
			if(hasAttachments ==1){
				table +="<input type=\"hidden\" id=\"exts\" name=\"exts\" value=\"rar,jar,doc,docx,txt,jpg,png\"/>";
			}
			if(configuration.ishasrelated==1){
				table += "<div id=\"tt\" class=\"easyui-tabs\"><div title=\"修改\">";
			}
			table += "<form id=\""
					+ functionName
					+ "\" method=\"post\" enctype=\"multipart/form-data\"><table class=\"edit-table\">";
			
			// 循环加载修改页面表单
			for ( var i = 0; i < updateFields.length; i++) {
				tableColumn += updateFields[i].fieldID + ",";
				table+=initUIForm(locationFlag,updateFields[i].formuitype,updateFields[i].fieldID,updateFields[i].fieldName,updateFields[i].fieldlength,updateFields[i].isReaquered,'',language,updateFields[i].validatetype);
				locationFlag++;
			}
			if(configuration.geometrytype!='none'){
				table +="<tr><td width =\"20%\"><span>"+configuration.i18related.spatialdata
				+"：</span></td><td colspan=\"3\"><textarea id=\"updatefeaure\" name=\"updatefeaure\" style=\"height:80px\" class=\"easyui-validatebox input_bg\" required=\"true\" validType=\"spatialDataValidate\"></textarea></td></tr>";
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
				table += "</div><div title=\""+configuration.i18related.subTableName+"\"><iframe id=\"subupdate\" frameborder=\"0\" style=\"width:100%;height:99%;\"></iframe>";
				table += "</div></div>";
			}
			table +="<div class=\"button-area\"><table style=\"width:100%\;\"><tr><td align=\"center\">";
				for(var i=0;i<configuration.commandsConfig.length;i++){
					if(configuration.commandsConfig[i].privilegeNumber =='saveButton'){
						table +="<a href=\"#\" id=\"saveButton\" class=\"easyui-linkbutton\" iconCls='icon-save' plain=\"false\">"+configuration.commandsConfig[i].parentName+"</a>";
					}else if(configuration.commandsConfig[i].privilegeNumber =='closeButton'){
						table += "<a href=\"#\" id=\"closeButton\" class=\"easyui-linkbutton\" iconCls='icon-cancel' plain=\"false\">"+configuration.commandsConfig[i].parentName+"</a>";	
					}
				}
				
				table+="</td></tr></table></div></div>";
			$(target).append($(table));
			if(configuration.ishasrelated==1){
				//点击从表tab页加载从表页面
				$("#tt").tabs({
					onSelect:function(title,index){
						if(title==configuration.i18related.subTableName){
							if(configuration.ishasrelated==1){
								$('#'+button).hide();
							}
							$('#subupdate').attr('src','subUpdateList.htm?functionName='+functionName+"&businessDataId="+businessDataId+"&pkfield="+pkfield);
						}
						if(title==0){
							if($('#'+button).css('display')=='none')
							$('#'+button).show();
						}
					}
				});
			}
			//绑定修改页面值域值
			this._loadUpdateData(target, updateFields, functionName, businessDataId,pkfield,configuration);
			//为按钮绑定事件
			this._addButtonEvents("saveButton",functionName, configuration,businessDataId,pkfield);
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
		_loadUpdateData : function(target, updateFields, functionName, businessDataId,pkfield,configuration) {
			$.ajax({
				url : '../getUpdateBusinessData.do?functionName='+functionName+'&pkfield='+pkfield+'&businessDataId='+businessDataId+'&geometrytype='+configuration.geometrytype,
				// id : param.id,
				dataType : 'json',
				success : function(data) {
					$('input').each(function(i,item) {
						 var pp = item.id;
						 if(eval('('+'data\.'+pp+')') ==null){
							 $('#'+pp).val('');
						 }else{
							 $('#'+pp).val(eval('('+'data\.'+pp+')'));
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
					getDomainData(target,updateFields,functionName,businessDataId,pkfield,data,configuration);
				},
				error : function() {
					top.showAlert(configuration.i18related.error, configuration.i18related.queryerror, 'error');
				}
			});
			
		},
		
		/**
		 * 根据注册信息加载修改页面 param tableColumn 修改页面注册信息 param functionName 功能id
		 */
		_addButtonEvents : function(buttonid,functionName,configuration,businessDataId,pkfield){
			$('#' + buttonid).bind('click', function() {
				if (buttonid == 'saveButton') {
					submitForm(functionName,configuration,businessDataId,pkfield);
				}else if (buttonid == 'closeButton') {
					top.closeDlg("subupdate");
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
	function getDomainData(target,updateFields,functionName,businessDataId,pkfield,data,configuration) {
		for ( var i = 0; i < updateFields.length; i++) {
			//加载下拉列表框
			if(updateFields[i].formuitype =='combox'){
				combox =updateFields[i].fieldID;
				requestPost(combox,functionName,1,configuration,data);
				//联动
				if(updateFields[i].cascadefieldname != null){
					var nextid =updateFields[i].cascadefieldname;
					$('#'+updateFields[i].fieldID).change(function(){
						requestPost(nextid,functionName,$(this).val(),configuration,data);
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
	function submitForm(functionName,configuration,businessDataId,pkfield) {
		//form表单验证
		if($('#'+functionName).form('validate')==false)
      		return false;
		var url = '../updateBusinessData.do';
		// 按钮不可用
		$('#saveButton').linkbutton('disable');
		// 表单提交
		$('#'+functionName).form('submit',{
			url : url+'?functionName='+ functionName +'&businessDataId='+businessDataId+"&pkfield="+pkfield,
			success : function(data) {
				data=JSON.parse(data);
				if(data.result=="true"){
					$.messager.alert(configuration.i18related.prompt, configuration.i18related.savesuccess,'info',function(){
						var iframe=top.document.getElementById('iframe_addHtml');
						iframe.contentWindow.document.getElementById('subadd0').contentWindow.$("#"+functionName).datagrid('reload');
						top.closeDlg("subupdate");
					});
				}else{
					// 如果修改失败按钮可用
					$('#saveButton').linkbutton('enable');
					if(data.message){
						top.showAlert(configuration.i18related.error, data.message, 'error');
					}else{
						top.showAlert(configuration.i18related.error, configuration.i18related.savefail, 'error');
					}
				}
				
			},
			error: function(data){
				
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
		if(flag ==1){
			$('#' + combox).combobox({
				url : '../getDomainDataAction.do?dataSourceName=defaultDataSource&random='+new Date()+"&functionName=" + functionName + "&comboxid=" + combox,
				valueField : 'ID',
				textField : 'TEXT',
				panelHeight:"auto",
				onSelect : function(row){
					//加载联动信息
					$('#' + fieldInfo.cascadefieldname).combobox({
						url : '../getNextDomainDataAction.do?dataSourceName=defaultDataSource&functionName='
								+ functionName + '&field=' + fieldInfo.cascadefieldname
								+ '&fieldValue='+ encodeURI(row.ID),
						valueField : 'ID',
						textField : 'TEXT',
						panelHeight:"auto"
					});
					$('#' + fieldInfo.cascadefieldname).combobox('setValue','');
					setComboObjWidth(fieldInfo.cascadefieldname,0.3,'combobox');
				}
			});
			$('#' + combox).combobox('setValue','');
			setComboObjWidth(combox,0.3,'combobox');
		}else{
			$('#' + combox).combobox({
				url : '../getNextDomainDataAction.do?dataSourceName=defaultDataSource&random='+new Date()+'&functionName='+ functionName + '&field=' + combox+ '&fieldValue='+flag,
				valueField : 'ID',
				textField : 'TEXT',
				panelHeight:"auto"
			});
			$('#' + combox).combobox('setValue','');
			setComboObjWidth(combox,0.3,'combobox');
		}
	}
})(jQuery);