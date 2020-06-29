/**
 * 
 * 类描述: 根据业务数据生成新增页面。
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
     * 方法描述：定义新增UI类并初始化类中的属性和方法。
     */
	$.jasfcFactory( "jasfc.AddBusiness", {
		options: {
			idField:'',
			functionName:'',
			addfunctionData:null,
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
			var hasWorkflow = this.options.configuration.hasworkflow;
			// 字段信息
			var tableColumn = "";
			//下拉框id
			var comboxid ='';
			//选桩控件
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
				table +="<tr><td width =\"20%\"><span>"+configuration.i18related.spatialdata
				+"：</span></td><td colspan=\"3\"><textarea id=\"addfeaure\" name=\"addfeaure\" style=\"height:80px\" class=\"easyui-validatebox input_bg\" required=\"true\" validType=\"spatialDataValidate\"></textarea></td></tr>";
			}
			table += "</table>" ;
			if(hasAttachments ==1){
				//附件上传
				table +="<div id=\"uploadanddownloadDIV\" align=\"right\"></div>";
			}
			table+="</form>";
			//如果存在关联表加载关联信息
			if(configuration.ishasrelated==1){
				table += "</div>";
				for(var i=0;i<configuration.subAllFields.length;i++){
					table += "<div title=\""+configuration.subAllFields[i].tablename+"\"><iframe id=\"subadd"+i+"\" frameborder=\"0\" style=\"width:100%;height:99%;\"></iframe></div>";
				}
				table += "</div>";
			}
			table +="<div class=\"button-area\"><table style=\"width:100%\;\"><tr><td colspan=\"4\" align=\"center\">";
			
			var commandsConfig = configuration.commandsConfig;
			for(var i=0;i<commandsConfig.length;i++){
				if(commandsConfig[i].privilegeNumber =='saveButton'){
					//保存按钮
					table +="<a href=\"#\" id=\"saveButton\" class=\"easyui-linkbutton\" iconCls='icon-save' plain=\"false\">"+commandsConfig[i].parentName+"</a>";
				}else if(commandsConfig[i].privilegeNumber =='saveAndLaunchButton'&&hasWorkflow){
					//保存并发起按钮
					table +="<a href=\"#\" id=\"saveAndLaunchButton\" class=\"easyui-linkbutton\" iconCls='icon-work' plain=\"false\">"+commandsConfig[i].parentName+"</a>";
				}else if(commandsConfig[i].privilegeNumber =='closeButton'){
					//取消按钮
					table += "<a href=\"#\" id=\"closeButton\"  class=\"easyui-linkbutton\" iconCls='icon-cancel' plain=\"false\">"+commandsConfig[i].parentName+"</a>";	
				}
			}
			table += "</td></tr></table></div></div>";
			$(target).append($(table));
			//绑定下拉框数据
			this._getDomainData(functionName, comboxid,addFields,configuration);
			if(configuration.ishasrelated==1){
				//点击从表tab页加载从表页面
				$("#tt").tabs({
					onSelect:function(title,index){
						for(var i=0;i<configuration.subAllFields.length;i++){
							if(title==configuration.subAllFields[i].tablename){
								if(configuration.ishasrelated==1){
									$('#saveButton').hide();
									if(hasWorkflow){
										$('#saveAndLaunchButton').hide();
									}
								}
							}
							if(configuration.subAllFields[i].subeventid!=''){
								var masterFieldName=configuration.subAllFields[i].masterRelatedField; //主表关联字段
								$('select').each(function(i,item) {
									 var pp = item.id;
									 if(pp!='' && pp==masterFieldName){
										 masterFieldValue=$('#'+masterFieldName).combobox("getText");
									 }
								});
//								if(masterFieldValue==''){
//									masterFieldValue=eval('$(\'#'+masterFieldName+'\').val()');
//								}
								$('#subadd'+i).attr('src','subIndexHtml.htm?functionName='+configuration.subAllFields[i].functionnumber
										+'&subIdField='+configuration.subAllFields[i].subeventid+'&subeventid='+subeventid);
							}
						}
						if(index==0){
							if($('#saveButton').css('display')=='none'){
								$('#saveButton').show();
							}
							if(hasWorkflow&&$('#saveAndLaunchButton').css('display')=='none'){
								$('#saveAndLaunchButton').show();
							}
						}
					}
				});
				$('#tt').tabs('disableTab', 1);	// disable the second tab panel.
			}
			
			//为按钮绑定事件
			this._addButtonEvents("saveButton",functionName,configuration,idField);
			if(hasWorkflow){
				this._addButtonEvents("saveAndLaunchButton",functionName,configuration,idField);
			}
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
					requestPost(combox,functionName,1,addFields[i]);
					//联动
					if(addFields[i].cascadefieldname != null){
						var nextid =addFields[i].cascadefieldname;
						$('#'+addFields[i].fieldID).change(function(){
							//加载下拉框数据
							requestPost(nextid,functionName,$(this).val());
						});
					}
				}
			}
		},
		
		/**
		 * 根据注册信息加载修改页面 param tableColumn 修改页面注册信息 param functionName 功能id
		 */
		_addButtonEvents : function(buttonid,functionName, configuration,idField){
			$('#' + buttonid).bind('click', function() {
				if (buttonid == 'saveButton') {
					submitForm(functionName,configuration,false,idField);
				}else if (buttonid == 'closeButton') {
					top.closeDlg("addHtml");
				}else if(buttonid == 'saveAndLaunchButton'){
					submitForm(functionName,configuration,true,idField);
				}
			});
		}
	});
	
	/**
	 * 
	 * 方法描述：保存表单信息
	 * 
	 * param functionName 权限编号 
	 * param configuration 配置信息
	 * param isLaunched 是否发起流程
	 * 
	 */
	function submitForm(functionName,configuration,isLaunched,idField) {
		if($('#'+functionName).form('validate')==false)
			return false;
		var url = '../addBusinessData.do?isLaunched='+isLaunched;
		// 按钮不可用
		$ ('#saveButton').linkbutton('disable');
		$ ('#saveAndLaunchButton').linkbutton('disable');
		// 表单提交
		$('#'+functionName).form('submit',{
			url : url+'&functionName=' + functionName+'&pkfield='+idField,
			success : function(data) {
				data=JSON.parse(data);
				if(data.result=="true"){
					subeventid =data[idField];  //主表的ID
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
					$ ('#saveButton').linkbutton('enable');
					$ ('#saveAndLaunchButton').linkbutton('enable');
					if(data.message){
						top.showAlert(configuration.i18related.error, data.message, 'error');
					}else{
						top.showAlert(configuration.i18related.error, configuration.i18related.savefail, 'error');
					}
				}
				
				
			},
			error: function(data){
				// 如果新增失败按钮可用
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
			var comboxurl='../getDomainDataAction.do?dataSourceName=defaultDataSource&random='+new Date()+"&functionName=" + functionName + "&comboxid=" + combox;
			loadComboboxDataByUrl(combox,comboxurl,'ID','TEXT');
			$('#'+combox).combobox('setValue','');
			$('#' + combox).combobox({
				onSelect : function(row){
					var subcomboxurl='../getNextDomainDataAction.do?dataSourceName=defaultDataSource&functionName='
						+ functionName + '&field=' + fieldInfo.cascadefieldname
						+ '&fieldValue='+ encodeURI(row.ID);
					//加载联动信息
					loadComboboxDataByUrl(fieldInfo.cascadefieldname,subcomboxurl,'ID','TEXT');
					$('#'+fieldInfo.cascadefieldname).combobox('setValue','');
				}
			});
			
			
		}else{
			var comboxurl='../getNextDomainDataAction.do?dataSourceName=defaultDataSource&random='+new Date()+'&functionName='+ functionName + '&field=' + combox+ '&fieldValue='+flag;
			//加载联动信息
			loadComboboxDataByUrl(combox,comboxurl,'ID','TEXT');
			$('#'+combox).combobox('setValue','');
		}
	}
})(jQuery);
