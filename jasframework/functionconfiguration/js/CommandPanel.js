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
     * 方法描述：定义按钮工具类并初始化类中的属性和方法。
     */
	$.jasfcFactory( "jasfc.CommandPanel", {
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
			var comandConfig =functionConfig.commandsConfig;
			
			//导出按钮下拉菜单
			var exportMenuButton ="<div id=\"exportMenu\" style=\"width:90px\">";
			//定位按钮下拉菜单
			var locateMenuButton ="<div id=\"locateMenu\" style=\"width:90px\">";	
			for(var i=0;i<comandConfig.length;i++){
				if(comandConfig[i].privilegeNumber ==1){	//新增
					numberbox += "<a href=\"#\" id=\"add\" class=\"easyui-linkbutton\" iconCls=\"icon-add\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==2){	//修改
					numberbox += "<a href=\"#\" id=\"update\" class=\"easyui-linkbutton\" iconCls=\"icon-edit\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==3){	//删除
					numberbox += "<a href=\"#\" id=\"delete\" class=\"easyui-linkbutton\" iconCls=\"icon-remove\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==4){	//查看
					numberbox += "<a href=\"#\" id=\"detail\" class=\"easyui-linkbutton\" iconCls=\"icon-view\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==5){	//导出
					exportflag =true;
					numberbox += "<a href=\"#\" id=\"export\" iconCls=\"icon-excel\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==6){	//定位
					locationflag =true;
					numberbox += "<a href=\"#\" id=\"location\" iconCls=\"icon-location\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==7){	//导入
					numberbox += "<a href=\"#\" id=\"import\" class=\"easyui-linkbutton\" iconCls=\"icon-import\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==8 && functionConfig.hasworkflow==1){	//发起流程
					numberbox += "<a href=\"#\" id=\"stateWorkFlow\" iconCls=\"icon-work\" class=\"easyui-linkbutton\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}else if(comandConfig[i].privilegeNumber ==9){	//数据版本
					numberbox += "<a href=\"#\" id=\"version\" iconCls=\"icon-history\" class=\"easyui-linkbutton\" plain=\"true\">"+comandConfig[i].parentName+"</a>";
				}				
				else if(comandConfig[i].privilegeNumber =='exportAll'){	//导出全部
					exportMenuButton+="<div iconCls=\"icon-excel\"><a href=\"#\" id=\"exportAll\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}else if(comandConfig[i].privilegeNumber =='exportSelect'){	//导出选中
					exportMenuButton+="<div iconCls=\"icon-excel\"><a href=\"#\" id=\"exportSelect\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}else if(comandConfig[i].privilegeNumber =='exportQuery'){	//导出查询
					exportMenuButton+="<div iconCls=\"icon-excel\"><a href=\"#\" id=\"exportQuery\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}
				else if(comandConfig[i].privilegeNumber =='locationselect'){	//定位选中
					locateMenuButton+="<div iconCls=\"icon-location\"><a href=\"#\" id=\"locationselect\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}else if(comandConfig[i].privilegeNumber =='locationquery'){	//定位查询
					locateMenuButton+="<div iconCls=\"icon-location\"><a href=\"#\" id=\"locationquery\" class=\"easyui-linkbutton\"  plain=\"true\">"+comandConfig[i].parentName+"</a></div>";
				}
			}
			numberbox += "</div>";
			$(target).append($(numberbox));
			
			exportMenuButton+="</div>";
			locateMenuButton+="</div>";
			
			    
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
						if (item.id == 'add') {	//新增
							openAddDialog(target, functionConfig, functionName);
						}else if (item.id == 'update') {	//修改
							openUpdateDialog(target, functionConfig, functionName);
						}else if (item.id == 'delete') {	//删除
							deleteHandler(target, functionName,functionConfig);
						}else if (item.id == 'detail') {	//查看
							openDetailDialog(target, functionConfig, functionName);
						}else if (item.id == 'exportAll') {	//导出全部
							exportAll(target, functionName,functionConfig);
						}else if (item.id == 'exportSelect') {	//导出选中
							exportSelect(target, functionName,functionConfig);
						}else if (item.id == 'exportQuery') {	//导出查询
							exportQuery(target, functionName,functionConfig);
						}else if (item.id == 'locationselect') {	 //定位选中
							locationMap(target, functionName,functionConfig,0);
						}else if (item.id == 'locationquery') {	//定位查询
							locationMap(target, functionName,functionConfig,1);
						}else if (item.id == 'import') {	//导入
							importHandler(functionName);
						}else if(item.id=='stateWorkFlow'){	//发起流程
							stateWorkFlow(target, functionConfig, functionName);
						}else if (item.id == 'version') {	//数据版本
							openVersionDialog(target, functionConfig, functionName);
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
			var id =row.EVENTID;
			//调用工作流接口发起工作流
			startWorkflow(id, functionConfig.workflowname, "","","true",callback);
		} else {
			$.messager.alert(functionConfig.i18related.prompt, functionConfig.i18related.selectonerecord, 'info');
		}
	}
	/**
	 * 方法描述：工作流回调
	 */
	function callback(result){
		if (result.success) {
			$.messager.alert('正确', result.successMessage, 'ok', function() {
				//$('#update').attr('disabled','disabled');
				//$('#delete').attr('disabled','disabled');
				$('#stateWorkFlow').attr('disabled','disabled');
				$('#update').linkbutton('disable');
				$('#delete').linkbutton('disable');
				$('#stateWorkFlow').linkbutton('disable');
			});
		} else {
			$.messager.alert('错误', result.msg, 'error');
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
		//拼写新增页面按钮的JSON数据格式
		for(var i=0;i<comandConfig.length;i++){
			if(comandConfig[i].privilegeNumber ==1){
				addtitle =comandConfig[i].parentName;
			}
		}
		// 新增页面配置参数
		var addFields = functionConfig.addFields;
		var pkfield = $('#' + functionName).datagrid("options").idField;
		var url ='addHtml.htm?functionName=' + functionName+'&title='+addtitle+'&pkfield=' + pkfield;
		//计算弹出窗口大小
		var addsize =Math.ceil(addFields.length/2+1)*40;
		for(var i=0;i<addFields.length;i++){
			if(addFields[i].queryuitype =='textarea'){
				addsize +=10;
			}
		}
		if(functionConfig.hasattachment ==1){
			addsize +=80;
		}
		if(functionConfig.geometrytype!='none'){
			addsize +=100;
		}
		if(functionConfig.ishasrelated==1){
			addsize +=65;
		}
		if(addsize > 500)
			addsize==500;
		top.getDlg(url,"addHtml",addtitle,600,addsize+10);
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
		//拼写新增页面按钮的JSON数据格式
		for(var i=0;i<comandConfig.length;i++){
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
			var masterFieldValue=eval('row\.'+functionConfig.masterRelatedField);  //主表关联字段值
			var url ="updateHtml.htm?functionName=" + functionName+"&pkfield=" + pkfield+"&businessDataId="+encodeURI(encodeURI(businessDataId))+"&masterFieldValue="+masterFieldValue+"&title="+updatetitle;
			//计算弹出窗口大小
			var updatesize =Math.ceil(updateFields.length/2+1)*40;
			for(var i=0;i<updateFields.length;i++){
				if(updateFields[i].queryuitype =='textarea'){
					updatesize +=10;
				}
			}
			if(functionConfig.hasattachment ==1){
				updatesize +=80;
			}
			if(functionConfig.geometrytype!='none'){
				updatesize +=100;
			}
			if(functionConfig.ishasrelated==1){
				updatesize +=65;
			}
			if(updatesize > 500)
				updatesize==500;
			top.getDlg(url,"addHtml",updatetitle,600,updatesize+10);
		} else {
			$.messager.alert(functionConfig.i18related.prompt, functionConfig.i18related.selectonerecord, 'info');
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
		//拼写详情页面按钮的JSON数据格式
		for(var i=0;i<comandConfig.length;i++){
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
			var pkfield = $('#' + functionName).datagrid('options').idField;
			var businessDataId=row[pkfield];
			var masterFieldValue=eval('row\.'+functionConfig.masterRelatedField);
			var url ="detailHtml.htm?functionName="+functionName + "&pkfield=" + pkfield+"&businessDataId="+encodeURI(encodeURI(businessDataId))+"&masterFieldValue="+masterFieldValue+"&title="+detailtitle;
			var detailsize =Math.ceil(detailFields.length/2+1)*40;
			//上传附件
			if(functionConfig.hasattachment ==1){
				detailsize +=60;
			}
			//支持空间要素
			if(functionConfig.geometrytype!='none'){
				detailsize +=100;
			}
			if(functionConfig.ishasrelated==1){
				detailsize +=65;
			}
			if(detailsize > 500)
				detailsize==500;
			top.getDlg(url,"view",detailtitle,600,detailsize+10,false);
		} else {
			$.messager.alert(functionConfig.i18related.prompt, functionConfig.i18related.selectonerecord,'info');
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
		var rows = $('#'+ functionName).datagrid('getSelections');
		var pkfield = $('#'+ functionName).datagrid("options").idField;
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
						url : '../deleteAction.do',
						data : 'functionName=' + functionName+"&businessDataIds=" + encodeURI(encodeURI(businessDataIds))+"&pkfield="+pkfield,
						type : 'POST',
						success : function(data) {
							if (data) {
								top.showAlert('提示', '删除成功！', 'info');
								$('#' + functionName).datagrid('reload'); // reload
								$('#' + functionName).datagrid(
										'clearSelections'); // clear selected
															// options
							} else {
								$.messager.alert('提示', '删除失败！', 'error');
							}
						}
					});
				}
			});

		} else {
			$.messager.alert(functionConfig.i18related.prompt, functionConfig.i18related.selectrecord, 'info');
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
			//定位查询
			location.LocationMap('locateQuery',target,functionName,loactionxy);
		}
	}
	
	/**
	 * 方法描述: 导出操作 (导出查询)
	 * param target DOM
	 * param functionName 功能编号
	 */
	function exportQuery(target, functionName,functionConfig) {
		//实例化导出类
		var exportdata = new $(target).ExportData();
		exportdata.ExportData('exportQuery',target,functionName,functionConfig);
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
		exportdata.ExportData('exportAll',target,functionName,functionConfig);
	}
	
	/**
	 * 方法描述：导入数据
	 * param functionName 功能编号
	 */
	function importHandler(functionName) {
	//	var url="../../jasframework/components/dataimport/importExcelData.htm?callerPageUrl=indexHtml.htm&datagridElementId="+functionName;
		top.getDlg("importExcelData.htm?callerPageUrl=indexHtml.htm&datagridElementId="+functionName,"importiframe","导入excel数据",650,450,false);
	}
})(jQuery);
