/**
 * 
 * 类描述: 根据业务数据生成查询面板。
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
     * 方法描述：定义查询面板类并初始化类中的属性和方法。
     */
	$.jasfcFactory( "jasfc.QueryConditionPanel", {
		options: {
			functionName:'',
			functionData:null,
			divid:'',
			language:''
		},
		/**
		 * 方法描述：根据新增配置参数加载查询面板 
		 * param target DOM
		 * param param 新增页面的保存和取消按钮配置（带有json格式的字符串数据）
		 * param functionName 功能编号
		 */
		loadQueryPanel:function() {
			var target =this.options.divid;
			var param =this.options.functionData;
			var functionName =this.options.functionName;
			//按钮
			var comandConfig =param.commandsConfig;
			// 查询面板注册信息
			var baseQuery = param.baseQuery;
			// 拼写查询面板
			var formid = Math.random() * 100000000000000000;
			var table = "<div id=\"queryDiv\" class=\"easyui-panel\" collapsible=\"true\" collapsed=\"true\" key=\"ddddd\" title=\""+param.i18related.querycondition+"\"> <form method=\"post\" id=\""
					+ formid + "\"><table align=\"center\" class=\"query-table\">";
			
			// 循环拼接查询面板html
			var comboxid = '';
			var toText=param.i18related.to;	//将“到”字国际化
			for ( var i = 0; i < baseQuery.length; i++) {
				table+=initUIForm(locationFlag,baseQuery[i].queryuitype,baseQuery[i].fieldID,baseQuery[i].fieldName,baseQuery[i].datalength,"",toText,language);
				locationFlag++;
			}
			table += "<tr><td colspan=\"4\" class=\"button_area\">";
			for(var i=0;i<comandConfig.length;i++){			
				if(comandConfig[i].privilegeNumber =='searchButton'){
					table += "<a href=\"#\" id=\"searchButton\" class=\"easyui-linkbutton\" iconCls='icon-search'>"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber =='clearButton'){
					table += "<a href=\"#\" id=\"clearButton\" class=\"easyui-linkbutton\" iconCls='icon-clear'>"+comandConfig[i].parentName+"</a>";
				}
			}
			table += "</table></form></div>";
			// 加载查询面板
			$(table).appendTo($(target));
			//查询条件统一文本框长度
			$(".easyui-combobox").each(function(i,item) {
				$(this).width($("td:first").width()+110);
			});
			// 查询面板下拉菜单绑定数据
			getDomainData(functionName, baseQuery);
			// 查询按钮事件
			this.buildOnClick(target, "searchButton", 1, functionName, baseQuery,formid);
			// 清空按钮事件
			this.buildOnClick(target, "clearButton", 0, functionName, baseQuery,formid);
		},
		/**
		 * 为查询和按钮加载事件
		 * param formid 按钮id
		 * param number 标示按钮1为查询按钮0为清空按钮
		 * param functionName 功能点id
		 * param searchFields 查询条件配置信息
		 */
		 buildOnClick :function(target, button, number, functionName, searchFields,formid) {
			$('#' + button).linkbutton();
			$('#' + button).bind('click', function() {
				if (number == 1) {
					submitForm(target, button, functionName, searchFields,formid);
				};
				if (number == 0) {
					clear(target);
				}
			});
		}
	});
	/**
	 * 方法描述：加载查询下拉框的值
	 * param functionName 功能编号
	 * param baseQuery 功能配置信息的查询信息
	 */
	function getDomainData(functionName, baseQuery) {
		for ( var i = 0; i < baseQuery.length; i++) {
			//加载下拉列表框
			if(baseQuery[i].queryuitype =='combox' || baseQuery[i].queryuitype =='mutiplecombox'){
				if(baseQuery[i].cascadefieldname != null){
					var fieldID=baseQuery[i].fieldID;
					var comboxurl='../getDomainDataAction.do?dataSourceName=defaultDataSource&functionName='
						+ functionName + '&comboxid=' + baseQuery[i].fieldID;
					loadComboboxDataByUrl(baseQuery[i].fieldID,comboxurl,'ID','TEXT');
					$('#' + baseQuery[i].fieldID).combobox(
					{
//						url : '../getDomainDataAction.do?dataSourceName=defaultDataSource&functionName='
//							+ functionName + '&comboxid=' + baseQuery[i].fieldID,
//						valueField : 'ID',
//						textField : 'TEXT',
						onSelect : function(row){
							//加载联动信息
							for ( var j = 0; j < baseQuery.length; j++) {
								if(baseQuery[j].cascadefieldname != null && baseQuery[j].fieldID==fieldID){
									var subcomboxurl='../getNextDomainDataAction.do?dataSourceName=defaultDataSource&functionName='
										+ functionName + '&field=' + baseQuery[j].cascadefieldname
										+ '&fieldValue='+ encodeURI(row.ID);
									loadComboboxDataByUrl(baseQuery[j].cascadefieldname,subcomboxurl,'ID','TEXT');
//									$('#' + baseQuery[j].cascadefieldname).combobox(
//										{
//											url : '../getNextDomainDataAction.do?dataSourceName=defaultDataSource&functionName='
//												+ functionName + '&field=' + baseQuery[j].cascadefieldname
//												+ '&fieldValue='+ encodeURI(row.ID),
//											valueField : 'ID',
//											textField : 'TEXT',
//											panelHeight:"auto"
//									});
//									$('#' + baseQuery[j].cascadefieldname).combobox('setValue','');
//									setComboObjWidth(baseQuery[j].cascadefieldname,0.3,'combobox');
								}
							}
						}
					});
//					$('#' +  baseQuery[i].fieldID).combobox('setValue','');
//					setComboObjWidth(baseQuery[i].fieldID,0.3,'combobox');
				}else{
					subcomboxurl='../getDomainDataAction.do?dataSourceName=defaultDataSource&functionName='
						+ functionName + '&comboxid=' + baseQuery[i].fieldID;
					loadComboboxDataByUrl(baseQuery[i].fieldID,subcomboxurl,'ID','TEXT');
//					$('#' + baseQuery[i].fieldID).combobox(
//					{
//						url : '../getDomainDataAction.do?dataSourceName=defaultDataSource&functionName='
//							+ functionName + '&comboxid=' + baseQuery[i].fieldID,
//						valueField : 'ID',
//						textField : 'TEXT',
//						panelHeight:"auto"
//					});
//					$('#' +  baseQuery[i].fieldID).combobox('setValue','');
//					setComboObjWidth(baseQuery[i].fieldID,0.3,'combobox');
				}
			}
		}
		
		
	};
	/**
	 * 查询条件表单提交并重新加载网格数据
	 * param formid 按钮id
	 * param functionName 功能点id
	 * param searchFields 查询条件配置信息
	 */
	function submitForm(target, formid, functionName, searchFields,form) {
		if($('#'+form).form('validate')==false)
      		return ;
		var url = '../getQueryBusinessDataList.do';
		// 查询字段	
		var searchField = '';
		// 查询字段类型
		var searchTypes = '';
		// 查询字段的值
		var searchFieldValue = '';
		
		var mutipleComboxLength=0;
//		// 是否为结束偏移
//		var flag =false;
		// 拼写查询字段和查询字段的值。
		for ( var i = 0; i < searchFields.length; i++) {
			var queryuitype=searchFields[i].queryuitype;
			 // 过滤未填写的查询字段
			if (queryuitype == 'combox') {
				// 过滤未填写的查询字段（combox）
				if ($('#' + searchFields[i].fieldID).combobox('getValue') != '') {
					searchTypes += searchFields[i].queryuitype + ",";
					searchField += searchFields[i].fieldID + ",";
					searchFieldValue += $('#' + searchFields[i].fieldID).combobox('getValue')+ ",";
				}
			}else if (queryuitype=='mutiplecombox') {
				// 过滤未填写的查询字段（combox）
				if ($('#' + searchFields[i].fieldID).combobox('getValues') != '') {
					searchTypes += searchFields[i].queryuitype + ",";
					searchField += searchFields[i].fieldID + ",";
					var fieldvalue=String($('#' + searchFields[i].fieldID).combobox('getValues'));
//					alert(fieldvalue);
					searchFieldValue += $('#' + searchFields[i].fieldID).combobox('getValues')+ ",";
					var mutipleValues=fieldvalue.split(",");
					mutipleComboxLength=mutipleValues.length;
				}
			}else if(searchFields[i].queryuitype =='daterange' || searchFields[i].queryuitype =='timerange'){
				var type =searchFields[i].fieldID;
				if($("#"+type+"1").val() < $("#"+type).val() && $("#"+type).val()!='' && $("#"+type+"1").val()!=''){
					top.showAlert('提示', '结束日期不得大于开始日期', 'info');
					$("#"+type+"1").val("");
					return;
				}
				if ($('#' + searchFields[i].fieldID).val() != '' || $('#' + searchFields[i].fieldID+'1').val() != '') {
					searchTypes += searchFields[i].queryuitype +",";
					searchField += searchFields[i].fieldID + ",";
					searchFieldValue += $('#' + searchFields[i].fieldID).val()
							+ ","+$('#' + searchFields[i].fieldID+'1').val()+",";
				}
			}else if(searchFields[i].queryuitype =='yearrange'){
				var type =searchFields[i].fieldID;
				if($("#"+type+"1").val() < $("#"+type).val() && $("#"+type).val()!='' && $("#"+type+"1").val()!=''){
					top.showAlert('提示', '结束年不得大于开始年', 'info');
					$("#"+type+"1").val("");
					return;
				}
				if ($('#' + searchFields[i].fieldID).val() != '' || $('#' + searchFields[i].fieldID+'1').val() != '') {
					searchTypes += searchFields[i].queryuitype +",";
					searchField += searchFields[i].fieldID + ",";
					var endYear =eval($('#' + searchFields[i].fieldID+'1').val())+1;
					searchFieldValue += $('#' + searchFields[i].fieldID).val()
							+ ","+endYear+",";
				}
			}else if(searchFields[i].queryuitype =='monthrange'){
				var type =searchFields[i].fieldID;
				if($("#"+type+"1").val() < $("#"+type).val() && $("#"+type).val()!='' && $("#"+type+"1").val()!=''){
					top.showAlert('提示', '结束年月不得大于开始年月', 'info');
					$("#"+type+"1").val("");
					return;
				}
				if ($('#' + searchFields[i].fieldID).val() != '' || $('#' + searchFields[i].fieldID+'1').val() != '') {
					searchTypes += searchFields[i].queryuitype +",";
					searchField += searchFields[i].fieldID + ",";
					searchFieldValue += $('#' + searchFields[i].fieldID).val()
							+ ","+$('#' + searchFields[i].fieldID+'1').val()+1+",";
				}
			}else if(searchFields[i].queryuitype =='numberfromto'){
				var type =searchFields[i].fieldID;
				if(parseFloat($("#"+type+"1").val()) < parseFloat($("#"+type).val()) && $("#"+type).val()!='' && $("#"+type+"1").val()!=''){
					top.showAlert('提示', '后面的值必须大于或等于前面的值', 'info');
					$("#"+type+"1").val("");
					return;
				}
				if ($('#' + searchFields[i].fieldID).val() != '' || $('#' + searchFields[i].fieldID+'1').val() != '') {
					searchTypes += searchFields[i].queryuitype +",";
					searchField += searchFields[i].fieldID + ",";
					searchFieldValue += $('#' + searchFields[i].fieldID).val()
							+ ","+$('#' + searchFields[i].fieldID+'1').val()+",";
				}
			}
			else {
				if ($('#' + searchFields[i].fieldID).val() != '') {
					searchTypes += searchFields[i].queryuitype + ",";
					searchField += searchFields[i].fieldID + ",";
					searchFieldValue += $('#' + searchFields[i].fieldID).val()+ ",";
				}
			}
		}
		searchFieldValue =searchFieldValue.replace(/\+/g, "~");
			// 重新加载datagrid
			var query = {
				'functionName' : functionName,
				'searchFields' : searchField,
				'searchType' : searchTypes,
				'searchFieldValue' :  encodeURI(searchFieldValue),
				'mutipleComboxLength':mutipleComboxLength,
				'subRelatedFieldName':subIdField,
				'masterRelatedFieldValue':encodeURI(subeventid)
			};
			$("#" + functionName).datagrid('options').queryParams = query; // 把查询条件赋值给datagrid内部变量
			$("#" + functionName).datagrid({
				"pageNumber" : 1
			});
			$("#" + functionName).datagrid('options').url = url;
	}
	/**
	 * 清空查询条件表单
	 */
	function clear(target) {
		$(':input', target).each(
			function() {
				var t = this.type, tag = this.tagName.toLowerCase();
				if (t == 'text' || t == 'hidden' || t == 'password'
						|| tag == 'textarea') {
					this.value = '';
				}
		});
		/* 添加对select的清空处理  add by Shenjie 2014-12-12 */
		$(target+ " select").each(function() {
			$(this).combobox("clear");
		});
	}
})(jQuery);

