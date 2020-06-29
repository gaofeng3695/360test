/**
 * 
 * 类描述: 根据配置信息加载数据版本页面。
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
     * 方法描述：定义修改UI类并初始化类中的属性和方法。
     */
	$.jasfcFactory( "jasfc.DataVersion", {
		options: {
			idField:'',
			functionName:'',
			defaultfunctionData:null,
			detailfunctionData:null,
			comandConfig:'',
			eventid:'',
			divid:''
		},
		/**
		 * 方法描述：根据功能配置参数加载网格列表 
		 * param target DOM
		 * param functionConfig 网格默认列表字段配置信息（带有json格式的字符串数据）
		 * param comandConfig 按钮配置信息（带有json格式的字符串数据） 
		 * param detailFields 详细信息配置信息（带有json格式的字符串数据）
		 * param functionName 功能编号
		 * param eventid 选中记录id值
		 * param idField 表唯一标示列
		 */
		initPageUI : function (target, functionConfig,comandConfig,detailFields, functionName, eventid, idField) {
			var target =this.options.divid;
			var functionConfig = this.options.defaultfunctionData;
			var comandConfig =this.options.comandConfig;
			var functionData =this.options.detailfunctionData;
			var detailFields =this.options.detailfunctionData.detailFields;
			var functionName =this.options.functionName;
			var eventid =this.options.eventid;
			var idField = this.options.idField;
			// 列表字段配置信息
			var defaultDisplayFields = JSON.parse(functionConfig);
			var table = "<table id=\"" + idField
					+ "\" class=\"easyui-datagrid\" title=\"\" width=\"98%\""
					+ " idField =\"" + idField + "\" singleSelect=\"false\">";
			table += "<thead><tr align=\"center\"><th field=\"ck\" checkbox=\"true\"></th>";

			for ( var i = 0; i < defaultDisplayFields.length; i++) {
				table += "<th field =\"" + defaultDisplayFields[i].fieldID
						+ "\" width=\""+Number(defaultDisplayFields[i].columnWidth)+"\" resizable=\"true\">"
						+ defaultDisplayFields[i].fieldName.substr(0,defaultDisplayFields[i].fieldName.length-1) + "</th>";
			}
			table += "</tr></thead></table>";
			$(table).appendTo($(target));
			var url = "../getVersionAction.do?dataSourceName=defaultDataSource";
			var queryParam = {
				"functionName" : functionName,
				'eventid' : eventid,
				'subIdField':subIdField,
				'subeventid':subeventid
			};
			this.getRelatedDocuments(functionName, url, queryParam, idField,comandConfig,detailFields);
		},

		/**
		 * 方法描述：初始化网格数据 
		 * param functionName 功能编号 
		 * param url 网格数据加载请求 
		 * param queryParam 网格数据加载默认查询条件
		 * param eventid 选中记录id值
		 * * param comandConfig 按钮配置信息（带有json格式的字符串数据） 
		 * param detailFields 详细信息配置信息（带有json格式的字符串数据）
		 */
		getRelatedDocuments : function (functionName, url, queryParam, eventid,comandConfig,detailFields) {
			$("#" + eventid).datagrid(
			{
				url : url,
				title : '',
				pageSize : 10,
				pageList : [ 10, 15, 20, 50 ],
				nowrap : false,
				striped : true,
				height:500,
				collapsible : true,
				remoteSort : true,
				fitColumns : true,
				queryParams : queryParam,
				rownumbers : true,
				onLoadSuccess : function(data) {
					$('#' + eventid).datagrid('clearSelections'); // clear
				},
				// 双击数据查看
				onDblClickRow : function(index, row) {
					var idFields =$("#" + eventid).datagrid('options').idField;
					var id =eval('('+'row\.'+idFields+')');
					var url ='detailHtml.htm?functionName='
							+ functionName + "&eventid=" + id+ "&idField="
							+ idFields;
					var detailsize =(detailFields.length/2+1)*30+100;
					top.getDlg(url,"view","查看",600,detailsize,false);
				}
			});
		}
	});
	
	
})(jQuery);
