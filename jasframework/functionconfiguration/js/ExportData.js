/**
 * 
 * 类描述: 导出数据并以excel文件的形式输出。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-08-30 上午17:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-10-16       修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */
(function($) {
	
	/**
     * 方法描述：定义导出类并定义类中的公有方法和属性
     */
	$.jasfcFactory( "jasfc.ExportData", {
		options: {
			functionName:'',
			divid:''
		},
		/**
		 * 方法描述：导出全部（通过条件查询出的结果）
		 * param target DOM
		 * param functionName 功能编号
		 */
		exportQuery : function (target, functionName,functionConfig,subRelatedFieldName,masterRelatedFieldValue){
			// 定义导出弹出窗
			var iframe = "<iframe id=\"exprotExcelIframe\" style=\"display: none;\"></iframe>";
			$(iframe).insertAfter(target);
			var propertyName = "", propertyDes = "";
			// 获得所有网格显示列
			var fieldNames=$('#'+functionName).datagrid('getColumnFields');
			for(var i=0;i<fieldNames.length;i++){
				var field=fieldNames[i];
				if(field.indexOf(",")!=-1){
					continue;
				}
				var columnInfo =$('#'+functionName).datagrid('getColumnOption',field);	//获取网格列信息
				var hidden = columnInfo.hidden;	//获取列是否为默认显示列
				if (hidden==false) {
					propertyName += field + ",";
					var span = columnInfo.title;
					propertyDes += span + ",";
				}
			}
			if (propertyName != "") {
				propertyName = propertyName.substring(0, propertyName.length - 1);
			}
			if (propertyDes != "") {
				propertyDes = propertyDes.substring(0, propertyDes.length - 1);
			}
			// 查询条件
			var searchFields = $("#" + functionName).datagrid('options').queryParams.searchFields;
			// 查询条件类型
			var searchType = $("#" + functionName).datagrid('options').queryParams.searchType;
			// 查询条件值
			var searchFieldValue = $("#" + functionName).datagrid('options').queryParams.searchFieldValue;
			if(searchFieldValue==null){	//如果没有查询，则导出全部
				this.exportAll(target, functionName, functionConfig);
				return;
			}
			searchFieldValue =searchFieldValue.replace(/\+/g, "~");
			var pkfield =$("#" + functionName).datagrid('options').idField;
			var url ='';
			var mutipleComboxLength = $("#" + functionName).datagrid('options').queryParams.mutipleComboxLength;
			//导出带有查询条件的
				url = '../exportQueryBusinessData.do?searchFields='
					+ searchFields + '&dataSourceName=defaultDataSource&searchType=' + searchType
					+ "&searchFieldValue=" + encodeURI(searchFieldValue) + "&propertyName="
					+ propertyName + "&propertyDes="
					+ encodeURI(encodeURI(propertyDes))+'&fileName='
					+ encodeURI(encodeURI(functionConfig.tableName))+'&functionName='+functionName+"&mutipleComboxLength="+mutipleComboxLength
					+"&subRelatedFieldName="+subRelatedFieldName+"&masterRelatedFieldValue="+encodeURI(encodeURI(masterRelatedFieldValue))
					+"&pkfield="+pkfield;
			$("#exprotExcelIframe").attr("src", url);
		},
		/**
		 * 方法描述：导出选中
		 * param target DOM
		 * param functionName 功能编号
		 */
		exportSelect : function (target, functionName,functionConfig){
			var pkfield =$("#" + functionName).datagrid('options').idField;
			// 找到所有被选中行
			var rows = $('#' + functionName).datagrid('getSelections');
			var businessDataIds = "";
			// 是否已经选中记录
			if (rows.length > 0) {
				
				// 遍历取得所有被选中记录的id
				for ( var i = 0; i < rows.length; i++) {
					var businessDataId=rows[i][pkfield];
					businessDataIds += ";" + businessDataId;
				}
				if (businessDataIds.length > 0)
					businessDataIds = businessDataIds.substring(1);
			}else{
				$.messager.alert(functionConfig.i18related.prompt, functionConfig.i18related.selectrecord, 'info');
				return;
			}
			// 定义导出弹出窗
			var iframe = "<iframe id=\"exprotExcelIframe1\" style=\"display: none;\"></iframe>";
			$(iframe).insertAfter(target);
			var propertyName = "", propertyDes = "";
			// 获得所有网格显示列
			var fieldNames=$('#'+functionName).datagrid('getColumnFields');
			for(var i=0;i<fieldNames.length;i++){
				var field=fieldNames[i];
				if(field.indexOf(",")!=-1){
					continue;
				}
				var columnInfo =$('#'+functionName).datagrid('getColumnOption',field);	//获取网格列信息
				var hidden = columnInfo.hidden;	//获取列是否为默认显示列
				if (hidden==false) {
					propertyName += field + ",";
					var span = columnInfo.title;
					propertyDes += span + ",";
				}
			}

			if (propertyName != "") {
				propertyName = propertyName.substring(0, propertyName.length - 1);
			}
			if (propertyDes != "") {
				propertyDes = propertyDes.substring(0, propertyDes.length - 1);
			}
			var url ='../exportSelectBusinessData.do?propertyName='
					+ propertyName + '&dataSourceName=defaultDataSource&propertyDes='
					+ encodeURI(encodeURI(propertyDes))+'&fileName='
					+ encodeURI(encodeURI(functionConfig.tableName))+'&functionName='+functionName
					+ '&pkfield='+pkfield +'&businessDataIds='+encodeURI(encodeURI(businessDataIds));
			$("#exprotExcelIframe1").attr("src", url);
		},
		
		/**
		 * 方法描述：导出全部数据
		 * param target DOM
		 * param functionName 功能编号
		 */
		exportAll : function (target, functionName,functionConfig,subRelatedFieldName,masterRelatedFieldValue){
			var pkfield =$("#" + functionName).datagrid('options').idField;
			
			// 定义导出弹出窗
			var iframe = "<iframe id=\"exprotExcelIframe1\" style=\"display: none;\"></iframe>";
			$(iframe).insertAfter(target);
			
			var propertyName = "", propertyDes = "";
			// 获得所有网格显示列
			var fieldNames=$('#'+functionName).datagrid('getColumnFields');
			for(var i=0;i<fieldNames.length;i++){
				var field=fieldNames[i];
				if(field.indexOf(",")!=-1){
					continue;
				}
				var columnInfo =$('#'+functionName).datagrid('getColumnOption',field);	//获取网格列信息
				var hidden = columnInfo.hidden;	//获取列是否为默认显示列
				if (hidden==false) {
					propertyName += field + ",";
					var span = columnInfo.title;
					propertyDes += span + ",";
				}
			}
			if (propertyName != "") {
				propertyName = propertyName.substring(0, propertyName.length - 1);
			}
			if (propertyDes != "") {
				propertyDes = propertyDes.substring(0, propertyDes.length - 1);
			}
			
			var url ='../exportSelectBusinessData.do?propertyName='
					+ propertyName + '&dataSourceName=defaultDataSource&propertyDes='
					+ encodeURI(encodeURI(propertyDes))+'&fileName='
					+ encodeURI(encodeURI(functionConfig.tableName))+'&functionName='+functionName
					+"&subRelatedFieldName="+subRelatedFieldName+"&masterRelatedFieldValue="+encodeURI(encodeURI(masterRelatedFieldValue))
					+ '&pkfield='+pkfield;
			$("#exprotExcelIframe1").attr("src", url);
		}
	});
})(jQuery);
	
