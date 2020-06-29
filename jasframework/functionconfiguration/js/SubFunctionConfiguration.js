/**
 * 
 * 类描述: 获得功能配置信息并加载主界面信息。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-08-30 上午17:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-10-16       修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */
(function($){
	/**
  * 方法描述：定义从表功能配置信息类并初始化类中的属性和方法(带_为私有)。
  */
	$.jasfcFactory( "jasfc.SubFunctionConfiguration", {
		options: {
			functionName:'',
			functionData:null,
			detailFlag:false,
			divid:'',
			app_number:'',
			language:''
		},
		/**
		 * 方法描述：根据功能配置参数加载网格列表 
		 * param target DOM
		 * param functionName 功能编号
		 */
		getFunctionConfig: function(functionName) {
			var obj;
			$.ajax({
				url : '../getFunctionConfigurationAction.do?dataSourceName=defaultDataSource',
				data :'functionName='+functionName+"&app_number="+this.options.app_number+"&language="+this.options.language,
				type : 'POST',
				success : function(data) {
					obj =JSON.parse(data); 
				},
				async: false,
				error : function(data) {
					top.showAlert('错误', '查询出错', 'info');
				}
			});
			return obj;
		},
		/**
		 * 方法描述： 根据信息加载界面
		 * param target DOM
		 * param data 配置信息（JSON）
		 * param functionName 功能编号
		 */
		loadFunctionConfigByData :function(target,data,functionName){
			var target =this.options.divid;
			var functionName=this.options.functionName;
			var data =this.getFunctionConfig(this.options.functionName);
			if(data.baseQuery.length>0){
				this.loadQueryPanel(target,data,functionName);
			}else{
				$("<div id=\"queryDiv\"</div>").appendTo($(target));
			}
			var detailFlag =this.options.detailFlag;
			this.loadCommandPanel(target,data,functionName,detailFlag);
			this.loadDataGridPanel(target,data,functionName);
		},
		/**
		 * 方法描述：根据功能配置参数调用加载查询面板类
		 * param target DOM
		 * param data 功能配置信息
		 * param functionName 功能编号
		 */
		loadQueryPanel: function(target,data,functionName){
			var queryCondition =$(target).QueryConditionPanel({divid:target,functionName:functionName,functionData:data});
			queryCondition.QueryConditionPanel("loadQueryPanel");
		},
		
		/**
		 * 方法描述：根据功能配置参数调用按钮工具类 
		 * param target DOM
		 * param data 功能配置信息
		 * param functionName 功能编号
		 */
		loadCommandPanel : function(target,data,functionName,detailFlag){
			var commandPanel =$(target).SubCommandPanel({divid:target,functionName:functionName,functionData:data,detailFlag:detailFlag});
			commandPanel.SubCommandPanel('createButton');
		},
		/**
		 * 方法描述：根据功能配置参数调用网格列表类
		 * param target DOM
		 * param data 功能配置信息
		 * param functionName 功能编号
		 */
		loadDataGridPanel : function(target,data,functionName){
			var datagrid =$(target).SubDatagrid({divid:target,functionName:functionName,functionData:data});
			datagrid.SubDatagrid('loadGridfield');
		}
	});
})(jQuery);






