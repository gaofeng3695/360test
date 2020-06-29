/**
 * 
 * 类描述: 根据从表业务数据生成新增页面。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-01-05 上午17:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-10-16       修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */
//表单字段位置
var locationFlag=0;
(function($) {
	/**
     * 方法描述：定义子表新增UI类并初始化类中的属性和方法。
     */
	$.jasfcFactory( "jasfc.SubAddBusiness", {
		options: {
			idField:'',
			functionName:'',
			addfunctionData:null,
			comandConfig:'',
			divid:'',
			configuration:''
		},
		/**
		 * 方法描述：根据新增配置参数加载页面 
		 * param target DOM
		 * param addFieldsStr 新增配置信息（带有json格式的字符串数据） 
		 * param comandConfigstr 新增页面的保存和取消按钮配置（带有json格式的字符串数据）
		 * param functionName 功能编号
		 * param idField 表唯一标示列
		 */
		initPageUI: function() {
			var target = this.options.divid;
			var addFieldsStr =this.options.addfunctionData;
			var functionName =this.options.functionName;
			var idField =this.options.idField;
			var configuration =this.options.configuration;
			//将新增配置参数转化为json对象
			var addFields =JSON.parse(addFieldsStr);
			var hasAttachments =this.options.configuration.hasattachment;
			var geometrytype =this.options.configuration.geometrytype;
			// 字段信息
			var tableColumn = "";
			//下拉框id
			var comboxid ='';
			var table ="<div id=\"contentArea\">";
			if(hasAttachments ==1){
				table +="<input type=\"hidden\" id=\"exts\" name=\"exts\" value=\"rar,jar,doc,docx,txt,jpg,png\"/>";
			}
			table += "<form id=\""
					+ functionName
					+ "\" method=\"post\" enctype=\"multipart/form-data\"><table class=\"edit-table\">";
			table+="<input type=\"hidden\" id=\""+subIdField+"\" name=\""+subIdField+"\" value=\""+subeventid+"\"/>";
			
			// 循环加载新增页面表单
			for ( var i = 0; i < addFields.length; i++) {
				//如果字段取值规则为"界面输入"，则显示该字段，默认为界面输入
				if(addFields[i].valueRuleType==null||addFields[i].valueRuleType=="input"){
					tableColumn += addFields[i].fieldID + ",";
					//根据不同UI类型加载不同表单填写框
					table+=initUIForm(locationFlag,addFields[i].formuitype,addFields[i].fieldID,addFields[i].fieldName,addFields[i].fieldlength,addFields[i].isReaquered,'',language,addFields[i].validatetype);
					locationFlag++;
				}
			}
			if(geometrytype!='none'){
				table +="<tr><td width =\"20%\"><span>"+configuration.i18related.spatialdata+"：</span></td><td colspan=\"3\"><textarea id=\"addfeaure\" name=\"addfeaure\" style=\"height:80px\" class=\"easyui-validatebox input_bg\" required=\"true\" validType=\"spatialDataValidate\"></textarea></td></tr>";
			}
			table += "</table>" ;
			if(hasAttachments ==1){
				//附件上传
				table +="<div id=\"uploadanddownloadDIV\" align=\"right\"></div>";
			}
			table +="<div class=\"button-area\"><table style=\"width:100%\;\"><tr><td colspan=\"4\" align=\"center\">";
			for(var i=0;i<configuration.commandsConfig.length;i++){
				if(configuration.commandsConfig[i].privilegeNumber =='saveButton'){
					table +="<a href=\"#\" id=\"saveButton\" class=\"easyui-linkbutton\" iconCls='icon-save' plain=\"false\">"+configuration.commandsConfig[i].parentName+"</a>";
				}else if(configuration.commandsConfig[i].privilegeNumber =='closeButton'){
					table += "<a href=\"#\" id=\"closeButton\" class=\"easyui-linkbutton\" iconCls='icon-cancel' plain=\"false\">"+configuration.commandsConfig[i].parentName+"</a>";	
				}
			}
			table += "</td></tr></table></div></div>";
			$(target).append($(table));
			//绑定下拉框数据
			this._getDomainData(functionName, comboxid,addFields,configuration);
			//为按钮绑定事件
			this._addButtonEvents("saveButton",functionName,configuration,idField);
			this._addButtonEvents("closeButton");
			if(hasAttachments ==1){
				uploadanddownload(configuration);
			}
		},
		/**
		 * 方法描述：加载新增下拉框的值
		 * 
		 * param functionName 功能编号 
		 * param comboxid 下拉框id
		 * param addFields JSON格式的功能配置信息
		 */
		_getDomainData : function(functionName, comboxid,addFields,configuration) {
			var combox ='';
			for ( var i = 0; i < addFields.length; i++) {
				//加载下拉列表框
				if(addFields[i].formuitype =='combox'){
					combox =addFields[i].fieldID;
					//加载下拉框数据
					requestPost(combox,functionName,1,configuration);
					//联动
					if(addFields[i].cascadefieldname != null){
						var nextid =addFields[i].cascadefieldname;
						$('#'+addFields[i].fieldID).change(function(){
							//加载下拉框数据
							requestPost(nextid,functionName,$(this).val(),configuration);
						});
					}
				}
			}
		}
		,
		/**
		 * 方法描述：按钮加载事件1为查询按钮0为取消按钮 
		 * param formid 按钮id 
		 * param number 按钮标示 
		 * param functionName 功能编号
		 * param tableColumn 新增字段信息 
		 * param idField 表唯一标示列
		 */
		_addButtonEvents : function(buttonid,functionName,configuration,idField) {
			$('#' + buttonid).bind('click', function() {
				if (buttonid == 'saveButton') {
					submitForm(functionName,configuration,idField);
				}else if (buttonid == 'closeButton') {
					top.closeDlg("subsave");
				}
			});
		}
	});
	/**
	 * 新增表单提交 
	 * param formid 按钮id 
	 * param functionName 功能id 
	 * param tableColumn 新增字段信息
	 * param idField 表唯一标示列
	 */
	function submitForm(functionName,configuration,idField) {
		if($('#'+functionName).form('validate')==false)
      		return false;
		var url = '../addBusinessData.do';
		// 按钮不可用
		$('#saveButton').linkbutton('disable');
		// 表单提交
		$('#'+functionName).form('submit',{
			url : url+'?functionName=' + functionName+'&pkfield='+idField,
			success : function(data) {
				data=JSON.parse(data);
				if(data.result=="true"){
					$.messager.alert(configuration.i18related.prompt, configuration.i18related.savesuccess, 'info',function(){
						var iframe=top.document.getElementById('iframe_addHtml');
						iframe.contentWindow.document.getElementById('subadd0').contentWindow.$("#"+functionName).datagrid('reload');
						top.closeDlg("subsave");
					});
				}else{
					$ ('#saveButton').linkbutton('enable');
					if(data.message){
						top.showAlert(configuration.i18related.error, data.message, 'error');
					}else{
						top.showAlert(configuration.i18related.error, configuration.i18related.savefail, 'error');
					}
				}
				
			},
			error: function(data){
				// 如果新增失败按钮可用
				$('#saveButton').linkbutton('enable');
				top.showAlert(configuration.i18related.error, configuration.i18related.savefail, 'error');
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
			var comboxurl='../getDomainDataAction.do?random='+new Date()+"&functionName=" + functionName + "&comboxid=" + combox;
			loadComboboxDataByUrl(combox,comboxurl,'ID','TEXT');
			$('#' + combox).combobox({
				onSelect : function(row){
					var subcomboxurl='../getNextDomainDataAction.do?functionName='
						+ functionName + '&field=' + fieldInfo.cascadefieldname
						+ '&fieldValue='+ encodeURI(row.ID);
					//加载联动信息
					loadComboboxDataByUrl(fieldInfo.cascadefieldname,subcomboxurl,'ID','TEXT');
				}
			});
		}else{
			var comboxurl='../getNextDomainDataAction.do?random='+new Date()+'&functionName='+ functionName + '&field=' + combox+ '&fieldValue='+flag;
			//加载联动信息
			loadComboboxDataByUrl(combox,comboxurl,'ID','TEXT');
		}
	}
})(jQuery);
