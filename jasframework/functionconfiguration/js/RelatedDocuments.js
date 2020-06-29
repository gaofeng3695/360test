/**
 * 
 * 类描述: 根据业务数据加载管理文档页面。
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
	$.jasfcFactory( "jasfc.RelatedDocuments", {
		options: {
			functionName:'',
			eventid:'',
			divid:'',
			functionData:''
		},
		/**
		 * 方法描述：生成关联文档网格 
		 * param target DOM
		 * param functionName 功能编号
		 * param eventid 选中记录id值 
		 */
		initPageUI : function (target, functionName, eventid) {
			var target =this.options.divid;
			var functionName = this.options.functionName;
			var eventid =this.options.eventid;
			var functionData =this.options.functionData;
			var datagridId = functionName + "01";
			var table = "<table id=\"" + datagridId
					+ "\" class=\"easyui-datagrid\" title=\"\" width=\"98%\""
					+ " idField =\"EVENTID\" singleSelect=\"false\">";
			table += "<thead><tr align=\"center\"><th field=\"ck\" checkbox=\"true\"></th>";
			table += "<th field =\"FILENAME\" width=\"150\" resizable=\"true\">文件名</th>";
			table += "<th field =\"FILETYPE\" width=\"150\" resizable=\"true\">文件类型</th>";
			table += "<th field =\"FILEDESCRIPTION\" width=\"200\" resizable=\"true\">文件描述</th>";
			table += "<th field =\"CREATEDDATE\" width=\"150\" resizable=\"true\">入库日期</th>";
			table += "</tr></thead></table>";
			$(table).appendTo($(target));
			var button = "<div id=\"download\"><a href=\"#\" id=\"version\" iconCls=\"icon-download\" class=\"easyui-linkbutton\" plain=\"true\"><span id=\"id28\">下载</span></a><div>";
			$(button).appendTo($(target));
			//初始化下载按钮
			$('#download').linkbutton({
				plain : item.plain,
				iconCls : item.iconCls,
				text : item.text
			});
			//为下载按钮绑定事件
			$('#download').bind('click', function() {
				download(datagridId);
			});
			var url = "../getDocumentAttachment.do?dataSourceName=defaultDataSource";
			//网格默认查询条件
			var queryParam = {
				"functionName" : functionName,
				'eventid' : eventid,
				'subIdField':subIdField,
				'subeventid':subeventid,
				'documentTable':'SYS_ATTACHMENT'
			};
			this.getRelatedDocuments(functionName, url, queryParam, datagridId);
		},

		/**
		 * 方法描述：初始化关联文档网格数据 
		 * param functionName 功能编号 
		 * param url 网格数据加载请求
		 *  param queryParam 网格数据加载默认查询条件
		 *  param datagridId 网格id
		 */
		getRelatedDocuments : function (functionName, url, queryParam, datagridId) {
			$("#" + datagridId).datagrid({
				url : url,
				title : '',
				pageSize : 10,
				idField:'EVENTID',
				pageList : [ 10, 15, 20, 50 ],
				nowrap : false,
				striped : true,
				collapsible : true,
				remoteSort : true,
				fitColumns : true,
				queryParams : queryParam,
				pagination : true,
				rownumbers : true,
				toolbar : "#download",
				onLoadSuccess : function(data) {
					$('#' + datagridId).datagrid('clearSelections'); // clear
																		// selected
																		// options
				},
				// 双击数据查看
				onDblClickRow : function(index, row) {
				},
				onHeaderContextMenu : function(e, field) {
					e.preventDefault();
					if (!$('#tmenu').length) {
						createColumnMenu($('#' + datagridId));
					}
					$('#tmenu').menu('show', {
						left : e.pageX,
						top : e.pageY
					});
				}
			});
		}
	});

	/**
	 * 方法描述：下载文档
	 * param datagridId 网格id
	 */
	function download(datagridId) {
		// 字段名称
		var idField = $("#" + datagridId).datagrid('options').idField;
		var rows = $('#' + datagridId).datagrid('getSelections');
		if (rows.length == 1) {
			var row = $('#' + datagridId).datagrid('getSelected');
			var id = eval('(' + 'row\.' + idField + ')');
			window.location.href=rootPath+"/upload/download.do?eventid="+id;
		} else {
			top.showAlert('提示', '请选中一条记录', 'info');
		}
	}
})(jQuery);
