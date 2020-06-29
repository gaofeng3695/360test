/**
 * 
 * 类描述: 根据配置信息生成工具栏按钮
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
     * 方法描述：定义从表按钮工具类并初始化类中的属性和方法。
     */
	$.jasfcFactory( "jasfc.SubCommandPanel", {
		options: {
			functionName:'',
			functionData:null,
			divid:''
		},
		/**
		 * 方法描述：加载工具栏按钮面板 
		 * param target DOM
		 * param functionConfig 按钮配置信息（JSON格式）
		 * param functionName 功能编号
		 */
		createButton : function(){
			var target =this.options.divid;
			var functionConfig =this.options.functionData;
			var functionName =this.options.functionName;
			var exportflag=false;
			var locationflag =false;
			var numberbox = "<div id=\"toobar\">";
			//导出按钮下拉菜单
			var exportMenuButton ="<div id=\"exportMenu\" style=\"width:90px\">";
			//定位按钮下拉菜单
			var locateMenuButton ="<div id=\"locateMenu\" style=\"width:90px\">";	
			var comandConfig =functionConfig.commandsConfig;
			for(var i=0;i<comandConfig.length;i++){
				if(comandConfig[i].privilegeNumber ==4){
					numberbox += "<a href=\"#\" id=\"detail\" class=\"easyui-linkbutton\" iconCls=\"icon-view\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==1){
					if(!detailFlag)
					numberbox += "<a href=\"#\" id=\"add\" class=\"easyui-linkbutton\" iconCls=\"icon-add\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==2){
					if(!detailFlag)
					numberbox += "<a href=\"#\" id=\"update\" class=\"easyui-linkbutton\" iconCls=\"icon-edit\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==3){
					if(!detailFlag)
					numberbox += "<a href=\"#\" id=\"delete\" class=\"easyui-linkbutton\" iconCls=\"icon-remove\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==6){
					locationflag =true;
					numberbox += "<a href=\"#\" id=\"location\" iconCls=\"icon-location\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==5){
					exportflag =true;
					numberbox += "<a href=\"#\" id=\"export\" iconCls=\"icon-excel\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}
				else if(comandConfig[i].privilegeNumber ==9){
					numberbox += "<a href=\"#\" id=\"version\" iconCls=\"icon-history\" class=\"easyui-linkbutton\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}
				else if(comandConfig[i].privilegeNumber ==8 && functionConfig.hasworkflow==1){
					numberbox += "<a href=\"#\" id=\"stateWorkFlow\" iconCls=\"icon-work\" class=\"easyui-linkbutton\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}
				else if(comandConfig[i].privilegeNumber ==7){	//导入按钮
					numberbox += "<a href=\"#\" id=\"import\" class=\"easyui-linkbutton\" iconCls=\"icon-import\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}
				else if(comandConfig[i].privilegeNumber =='exportAll'){	//导出全部按钮
					exportMenuButton+="<div iconCls=\"icon-excel\"><a href=\"#\" id=\"exportAll\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}else if(comandConfig[i].privilegeNumber =='exportSelect'){	//导出选中按钮
					exportMenuButton+="<div iconCls=\"icon-excel\"><a href=\"#\" id=\"exportSelect\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}else if(comandConfig[i].privilegeNumber =='exportQuery'){	//导出全部按钮
					exportMenuButton+="<div iconCls=\"icon-excel\"><a href=\"#\" id=\"exportQuery\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}
				else if(comandConfig[i].privilegeNumber =='locationselect'){	//导出全部按钮
					locateMenuButton+="<div iconCls=\"icon-location\"><a href=\"#\" id=\"locationselect\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}else if(comandConfig[i].privilegeNumber =='locationquery'){	//导出全部按钮
					locateMenuButton+="<div iconCls=\"icon-location\"><a href=\"#\" id=\"locationquery\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}
			}
			numberbox += "</div>";
			$(target).append($(numberbox));
			exportMenuButton+="</div>";
			locateMenuButton+="</div>";
//			//导出按钮下拉菜单
//			var exportMenuButton ="<div id=\"exportMenu\" style=\"width:90px\">"
//			 	+"<div iconCls=\"icon-excel\"><a href=\"#\" id=\"exportAll\" class=\"easyui-linkbutton\"  plain=\"true\">导出全部</a></div>"
//			 	+"<div iconCls=\"icon-excel\"><a href=\"#\" id=\"exportSelect\" class=\"easyui-linkbutton\"  plain=\"true\">导出选中</a></div>"
//			 	+"<div iconCls=\"icon-excel\"><a href=\"#\" id=\"exportQuery\" class=\"easyui-linkbutton\"  plain=\"true\">导出查询</a></div>"
//				+ "</div>";
//			//定位按钮下拉菜单
//			var locateMenuButton ="<div id=\"locateMenu\" style=\"width:90px\">"
//			 	+"<div iconCls=\"icon-location\"><a href=\"#\" id=\"locationselect\" class=\"easyui-linkbutton\"  plain=\"true\">定位选中</a></div>"
//			 	+"<div iconCls=\"icon-location\"><a href=\"#\" id=\"locationquery\" class=\"easyui-linkbutton\"  plain=\"true\">定位查询</a></div>"
//			    + "</div>";
			
			//加载导出按钮下拉按钮菜单
			if(exportflag){
				//导出面板
				$(target).after($(exportMenuButton));
				//导出按钮
				$('#export').menubutton({   
					iconCls: 'icon-excel',   
					menu: '#exportMenu'
				});  
			}
			//加载定位按钮下拉按钮菜单
			if(locationflag){
				//定位面板
				$(target).after($(locateMenuButton));
				//定位按钮
				$('#location').menubutton({   
					iconCls: 'icon-location',   
					menu: '#locateMenu'
				});  
			}
			$('#export').bind('click', function(){  
				exportAll(target, functionName,functionConfig);
		    }); 
			
			$('#location').bind('click', function(){  
				locationMap(target, functionName,functionConfig,0);
		    }); 
			// 活动页面所有加载按钮
			var buttons = $('.easyui-linkbutton');
			//为每个按钮绑定特定事件
			$.each(buttons, function(i, item) {
				if (item.id != null) {
					// 调用easy ui js初始化按钮
					$("#" + item.id).linkbutton({
						plain : item.plain,
						iconCls : item.iconCls,
						text : item.text
					});
					// 按钮创建事件
					$('#' + item.id).bind('click', function() {
						//新增
						if (item.id == 'add') {
							openAddDialog(target, functionConfig, functionName);
						}
						//详细信息
						if (item.id == 'detail') {
							openDetailDialog(target, functionConfig, functionName);
						}
						//修改
						if (item.id == 'update') {
							openUpdateDialog(target, functionConfig, functionName);
						}
						//删除
						if (item.id == 'delete') {
							deleteHandler(target, functionName,functionConfig);
						}
						//定位全部
						if (item.id == 'locationquery') {
							locationMap(target, functionName,functionConfig,1);
						}
						//定位选中
						if (item.id == 'locationselect') {
							locationMap(target, functionName,functionConfig,0);
						}
						//导出全部
						if (item.id == 'exportAll') {
							exportAll(target, functionName,functionConfig);
						}
						//导出选中
						if (item.id == 'exportSelect') {
							exportSelect(target, functionName,functionConfig);
						}
						//导出查询
						if (item.id == 'exportQuery') {
							exportQuery(target, functionName,functionConfig);
						}
						//关联文档
						if (item.id == 'related') {
							openRelatedDialog(target, functionConfig, functionName);
						}
						//数据版本
						if (item.id == 'version') {
							openVersionDialog(target, functionConfig, functionName);
						}
						if(item.id=='stateWorkFlow'){
							stateWorkFlow(target, functionConfig, functionName);
						}
						if (item.id == 'import') {	//导入按钮
							importHandler(functionName);
						}
					});
				}
			});
		}
	});
	/**
	 * 方法描述：发起工作流
	 * param target DOM
	 * param  functionConfig 功能配置
	 * param functionName 功能编号
	 */
	function stateWorkFlow(target, functionConfig, functionName) {
		// 选择发起工作流的记录
		var rows = $('#' + functionName).datagrid('getSelections');
		if (rows.length == 1) {
			var row = $('#' + functionName).datagrid('getSelected');
			var id =eval('('+'row\.'+functionConfig.theOnlySign.fieldID+')');
			//调用工作流接口发起工作流
			startWorkflow(id, functionConfig.workflowname, "","","",callback);
		} else {
			top.showAlert('提示', '请选中一条记录', 'info');
		}
	}
	/**
	 * 方法描述：工作流回调
	 */
	function callback(result){
		if (result.success) {
			top.showAlert('正确', result.ok, 'ok', function() {
				//$('#update').attr('disabled','disabled');
				//$('#delete').attr('disabled','disabled');
				//$('#stateWorkFlow').attr('disabled','disabled');
				$('#update').linkbutton('disable');
				$('#delete').linkbutton('disable');
				$('#stateWorkFlow').linkbutton('disable');
			});
		} else {
			top.showAlert('错误', result.msg, 'error');
		}
	}
	/**
	 * 方法描述：弹出关联文档信息页面
	 * param target DOM
	 * param  functionConfig 功能配置权限
	 * param functionName 功能编号
	 */
	function openRelatedDialog(target, functionConfig, functionName){
		//按钮权限
		var comandConfig =functionConfig.commandsConfig;
		var relatedtitle ='';
		for(var i=0;i<comandConfig.length;i++){
			if(comandConfig[i].privilegeNumber ==9){
				relatedtitle =comandConfig[i].parentName;
			}
		}
		var rows = $('#' + functionName).datagrid('getSelections');
		if (rows.length >= 1) {
			var ids = "";
			// 遍历取得所有被选中记录的id
			for ( var i = 0; i < rows.length; i++) {
				ids += ",'" + eval('('+'rows[i]\.'+functionConfig.theOnlySign.fieldID+')')+"'";
			}
			if (ids.length > 0)
				ids = ids.substring(1);
			var url ="relatedHtml.htm?functionName=" + functionName+'&eventid='+ids+"&idField="
				+ functionConfig.theOnlySign.fieldID;
			top.getDlg(url,"related",relatedtitle,700,500);
		} else{
			var id='';
			var url ="relatedHtml.htm?functionName=" + functionName+'&eventid='+id+"&idField="
			+ functionConfig.theOnlySign.fieldID;
			top.getDlg(url,"related",relatedtitle,700,500);
		}
	}
	
	/**
	 * 方法描述：弹出数据版本信息页面
	 * param target DOM
	 * param  functionConfig 功能配置权限
	 * param functionName 功能编号
	 */
	function openVersionDialog(target, functionConfig, functionName){
		//按钮权限
		var comandConfig =functionConfig.commandsConfig;
		var versiontitle ='';
		var xx =[];
		for(var i=0;i<comandConfig.length;i++){
			if(comandConfig[i].privilegeNumber ==18){
				var yy ={
					'privilegeNumber' : comandConfig[i].privilegeNumber,
					'parentName' : comandConfig[i].parentName
				};
				xx.push(yy);		
			}
			if(comandConfig[i].privilegeNumber ==10){
				versiontitle =comandConfig[i].parentName;
			}
		}
		var rows = $('#' + functionName).datagrid('getSelections');
		if (rows.length >= 1) {
			var ids = "";
			// 遍历取得所有被选中记录的id
			for ( var i = 0; i < rows.length; i++) {
				ids += ",'" + eval('('+'rows[i]\.'+functionConfig.theOnlySign.fieldID+')')+"'";
			}
			if (ids.length > 0)
				ids = ids.substring(1);
			var url ="VersionHtml.htm?functionName=" + functionName+'&eventid='+ids+"&idField="
			+ functionConfig.theOnlySign.fieldID+"&comandConfig=" + JSON.stringify(xx);
			top.getDlg(url,"version",versiontitle,700,500);
		} else{
			var id = '';
			var url ="VersionHtml.htm?functionName=" + functionName+'&eventid='+id+"&idField="
			+ functionConfig.theOnlySign.fieldID+"&comandConfig=" + JSON.stringify(xx);
			top.getDlg(url,"version",versiontitle,700,500);
		}
	}
	
	/**
	 * 方法描述：弹出业务新增页面
	 * param target DOM
	 * param  functionConfig 功能配置权限
	 * param functionName 功能编号
	 */
	function openAddDialog(target, functionConfig, functionName) {
		//按钮权限
		var comandConfig =functionConfig.commandsConfig;
		var addtitle ='';
		var xx =[];
		//拼写新增页面按钮的JSON数据格式
		for(var i=0;i<comandConfig.length;i++){
			if(comandConfig[i].privilegeNumber ==12){
				var yy ={
					'privilegeNumber' : comandConfig[i].privilegeNumber,
					'parentName' : comandConfig[i].parentName
				};
				xx.push(yy);		
			}
			if(comandConfig[i].privilegeNumber ==13){
				var yy ={
					'privilegeNumber' : comandConfig[i].privilegeNumber,
					'parentName' : comandConfig[i].parentName
				};
				xx.push(yy);		
			}
			if(comandConfig[i].privilegeNumber ==1){
				addtitle =comandConfig[i].parentName;
			}
		}
		// 新增页面配置参数
		var addFields = functionConfig.addFields;
		var pkfield = $('#' + functionName).datagrid("options").idField;
		var url ="subAdd.htm?functionName=" + functionName +"&pkfield="+pkfield+'&subIdField='+subIdField+'&subeventid='+subeventid;
		//计算弹出窗口大小
		var addsize =Math.ceil(addFields.length/2+1)*40;
		for(var i=0;i<addFields.length;i++){
			if(addFields[i].formuitype =='textarea'){
				addsize +=4;
			}
		}
		if(functionConfig.hasattachment ==1){
			addsize +=40;
		}
		if(functionConfig.geometrytype!='none'){
			addsize +=100;
		}
		if(functionConfig.ishasrelated==1){
			addsize +=65;
		}
		top.getDlg(url,"subsave",addtitle,600,addsize);
	}
	/**
	 * 方法描述：弹出业务修改页面
	 * param target DOM
	 * param  functionConfig 功能配置权限
	 * param functionName 功能编号
	 */
	function openUpdateDialog(target, functionConfig, functionName) {
		//按钮权限
		var comandConfig =functionConfig.commandsConfig;
		var updatetitle ='';
		var xx =[];
		//拼写新增页面按钮的JSON数据格式
		for(var i=0;i<comandConfig.length;i++){
			if(comandConfig[i].privilegeNumber ==12){
				var yy ={
					'privilegeNumber' : comandConfig[i].privilegeNumber,
					'parentName' : comandConfig[i].parentName
				};
				xx.push(yy);		
			}
			if(comandConfig[i].privilegeNumber ==13){
				var yy ={
					'privilegeNumber' : comandConfig[i].privilegeNumber,
					'parentName' : comandConfig[i].parentName
				};
				xx.push(yy);		
			}
			if(comandConfig[i].privilegeNumber ==2){
				updatetitle =comandConfig[i].parentName;
			}
		}
		// 修改页面配置参数
		var updateFields = functionConfig.updateFields;
		var rows = $('#' + functionName).datagrid('getSelections');
		if (rows.length == 1) {
			var row = $('#' + functionName).datagrid('getSelected');
			var pkfield = $('#' + functionName).datagrid("options").idField;
			var businessDataId=row[pkfield];
			var url ="subUpdate.htm?functionName=" + functionName+'&businessDataId='+encodeURI(encodeURI(businessDataId))+"&pkfield="
				+ pkfield+'&subIdField='+subIdField+'&subeventid='+subeventid;
			//计算弹出窗口大小
			var updatesize =Math.ceil(updateFields.length/2+1)*40;
			for(var i=0;i<updateFields.length;i++){
				if(updateFields[i].formuitype =='textarea'){
					updatesize +=4;
				}
			}
			if(functionConfig.hasattachment ==1){
				updatesize +=40;
			}
			if(functionConfig.geometrytype!='none'){
				updatesize +=100;
			}
			if(functionConfig.ishasrelated==1){
				updatesize +=65;
			}
			top.getDlg(url,"subupdate",updatetitle,600,updatesize);
		} else {
			top.showAlert('提示', '请选中一条记录', 'info');
		}
	}
	/**
	 * 方法描述：弹出详细信息页面
	 * param target DOM
	 * param  functionConfig 功能配置权限
	 * param functionName 功能编号
	 */
	function openDetailDialog(target, functionConfig, functionName) {
		//按钮权限
		var comandConfig =functionConfig.commandsConfig;
		var detailtitle ='';
		var xx =[];
		//拼写新增页面按钮的JSON数据格式
		for(var i=0;i<comandConfig.length;i++){
			//查看页面查看按钮国际化
			if(comandConfig[i].privilegeNumber ==18){
				var yy ={
					'privilegeNumber' : comandConfig[i].privilegeNumber,
					'parentName' : comandConfig[i].parentName
				};
				xx.push(yy);		
			}
			//查看按钮国际化
			if(comandConfig[i].privilegeNumber ==4){
				detailtitle = comandConfig[i].parentName;
			}
		}
		// 详情页面配置参数
		var detailFields = functionConfig.detailFields;
		// 选择查看的记录
		var rows = $('#' + functionName).datagrid('getSelections');
		if (rows.length == 1) {
			var row = $('#' + functionName).datagrid('getSelected');
			var pkfield = $('#' + functionName).datagrid("options").idField;
			var businessDataId=row[pkfield];
			var url ="subDetail.htm?functionName="
				+ functionName + "&businessDataId=" + encodeURI(encodeURI(businessDataId)) + "&pkfield="+ pkfield;
			var detailsize =Math.ceil(detailFields.length/2+1)*40;
			//上传附件
			if(functionConfig.hasattachment ==1){
				detailsize +=20;
			}
			//支持空间要素
			if(functionConfig.geometrytype!='none'){
				detailsize +=100;
			}
			if(functionConfig.ishasrelated==1){
				detailsize +=65;
			}
			top.getDlg(url,"subview",detailtitle,600,detailsize,false);
		} else {
			top.showAlert('提示', '请选中一条记录', 'info');
		}
	}
	/**
	 * 方法描述：弹出业务修改页面
	 * param target DOM
	 * param functionName 功能编号
	 * param  functionConfig 功能配置权限
	 */
	function deleteHandler(target, functionName,functionConfig) {
		// 找到所有被选中行
		var rows = $('#' + functionName).datagrid('getSelections');
		var pkfield = $('#' + functionName).datagrid("options").idField;
		// 是否已经选中记录
		if (rows.length > 0) {
			var businessDataIds = "";
			// 遍历取得所有被选中记录的id
			for ( var i = 0; i < rows.length; i++) {
				var businessDataId=rows[i][pkfield];
				businessDataIds += ";" + businessDataId;
			}
			if (businessDataIds.length > 0)
				businessDataIds = businessDataIds.substring(1);
			$.messager.confirm('删除', '您确定要删除这些信息吗？\n\t', function(r) {
				if (r) {
					$.ajax({
						url : '../deleteAction.do?dataSourceName=defaultDataSource',
						data : 'functionName=' + functionName+ "&businessDataIds=" + encodeURI(encodeURI(businessDataIds))+"&pkfield="+pkfield,
						type : 'POST',
						success : function(data) {
							if (data) {
								$.messager.alert('提示', '删除成功！', 'info',function(){
									$('#' + functionName).datagrid('reload'); // reload
									$('#' + functionName).datagrid('clearSelections');
								});
								 // clear selected
															// options
							} else {
								$.messager.alert('提示', '删除失败！', 'error');
							}
						}
					});
				}
			});

		} else {
			$.messager.alert('提示', '未选择记录！', 'info');
		}
	}
	
	/**
	 * 方法描述：定位
	 * param target DOM
	 * param functionName 功能编号
	 * param  loactionxy 定位级别
	 * param flag 1表示定位选中，0表示定位全部
	 */
	function locationMap(target, functionName,loactionxy,flag){
		var location =$(target).LocationMap();
		if(flag == 0){
			//定位选中
			location.LocationMap('locateSelect',target,functionName,loactionxy);
		}else{
			//定位全部
			location.LocationMap('locateQuery',target,functionName,loactionxy,subIdField,subeventid);
		}
	}
	
	/**
	 * 方法描述: 导出操作 (导出全部)
	 * param target DOM
	 * param functionName 功能编号
	 */
	function exportQuery(target, functionName,functionConfig) {
		//实例化导出类
		var exportdata = new $(target).ExportData();
		exportdata.ExportData('exportQuery',target,functionName,functionConfig,subIdField,subeventid);
	}
	
	/**
	 * 方法描述: 导出操作 (导出选中)
	 * param functionName 功能点id
	 */
	function exportSelect(target, functionName,functionConfig) {
		//实例化导出类
		var exportdata = $(target).ExportData();
		exportdata.ExportData('exportSelect',target,functionName,functionConfig);
	}
	
	/**
	 * 方法描述: 导出操作 (导出全部)
	 * param functionName 功能点id
	 */
	function exportAll(target, functionName,functionConfig) {
		//实例化导出类
		var exportdata = $(target).ExportData();
		exportdata.ExportData('exportAll',target,functionName,functionConfig,subIdField,subeventid);
	}
	
	/**
	 * 方法描述：导入数据
	 * param functionName 功能编号
	 */
	function importHandler(functionName) {
		top.getDlg("importExcelData.htm?callerPageUrl=indexHtml.htm&datagridElementId="+functionName,"importiframe","导入excel数据",650,450,false);
	}
})(jQuery);
