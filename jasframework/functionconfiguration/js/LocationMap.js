/**
 * 
 * 类描述: 根据业务数据定位。
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
     * 方法描述：定义定位类并定义类中的公有方法和属性
     */
	$.jasfcFactory( "jasfc.LocationMap", {
		options: {
			functionName:'',
			loactionxy:'',
			divid:''
		},
		/**
		 * 方法描述：定位全部（查询条件查询过后的数据） 
		 * param target DOM
		 * param functionName 功能编号
		 * param loactionxy 定位级别
		 */
		locateQuery : function (target, functionName,loactionxy,subRelatedFieldName,masterRelatedFieldValue){
			// 查询条件
			var searchFields = $("#" + functionName).datagrid('options').queryParams.searchFields;
			// 查询条件类型
			var searchType = $("#" + functionName).datagrid('options').queryParams.searchType;
			// 查询条件值
			var searchFieldValue = $("#" + functionName).datagrid('options').queryParams.searchFieldValue;
			var mutipleComboxLength = $("#" + functionName).datagrid('options').queryParams.mutipleComboxLength;
			if(searchFieldValue==null){
				$.messager.alert('提示', '请查询！', 'info');
				return;
			}
				searchFieldValue =searchFieldValue.replace(/\+/g, "~");
				$.ajax({
					url : '../locateQueryBusinessData.do',
					data :'searchFields='
						+ searchFields +'&dataSourceName=defaultDataSource&searchType=' + searchType
						+ "&searchFieldValue=" + encodeURI(searchFieldValue)+'&functionName='+functionName
						+"&random="+new Date+"&mutipleComboxLength="+mutipleComboxLength
						+'&subRelatedFieldName='+subIdField
						+'&masterRelatedFieldValue='+encodeURI(subeventid),
					type : 'POST',
					success : function(obj) {
						if(obj==null){
							$.messager.alert('提示', '查询结果为空！', 'info');
							return;
						}
						if(obj.length>0){
							var xx =[];
							var id1=[];
							//拼写定位JSON数据格式
							for(var i=0;i<obj.length;i++){
								if(obj[i]!=null){
									id1.push("point"+i);
									xx.push(obj[i]);
								}
							}
							//地图定位接口
							top.addGraphics(id1,xx);
						}else{
							$.messager.alert('错误', '未返回数据！', 'info');
						}
					},
					dataType : "json",
					error : function(data) {
						$.messager.alert('错误', '查询出错！', 'info');
					}
				});
		},

		/**
		 * 方法描述：定位选中
		 * param target DOM
		 * param functionName 功能编号
		 * param loactionxy 定位级别
		 */
		locateSelect : function (target, functionName,loactionxy){
			var pkfield =$("#" + functionName).datagrid('options').idField;
			// 找到所有被选中行
			var rows = $('#' + functionName).datagrid('getSelections');
			// 是否已经选中记录
			if (rows.length >0) {
				var businessDataIds ='';
				//拼写定位JSON数据格式
				for ( var i = 0; i < rows.length; i++) {
					var businessDataId=rows[i][pkfield];
					businessDataIds += ";" + businessDataId;
			    }
				if (businessDataIds.length > 0)
					businessDataIds = businessDataIds.substring(1);
				showLoadingMessage("正在处理，请稍候...");	//显示等待提示对话框
				$.ajax({
					url : '../locateSelectBusinessData.do',
					data :'businessDataIds='+ encodeURI(encodeURI(businessDataIds))+'&functionNumber='+functionName+"&pkfield="+pkfield,
					type : 'POST',
					success : function(data) {
						hiddenLoadingMessage();	//隐藏等待提示对话框
						var obj =JSON.parse(data);
						if(obj.length>0){
								var xx =[];
								var id1=[];
								//拼写定位JSON数据格式
								for(var i=0;i<obj.length;i++){
									if(obj[i]!=null){
										id1.push("point"+i);
										xx.push(obj[i]);
									}
								}
								//地图定位接口
								top.addGraphics(id1,xx);
//							}
						}else{
							top.showAlert('错误', '未返回数据', 'info');
						}
					},
					error : function(data) {
						top.showAlert('错误', '查询出错', 'info');
					}
				});
			}else{
				top.showAlert('提示', '未选中记录', 'info');
				return;
			}
		}
	});
})(jQuery);
	
