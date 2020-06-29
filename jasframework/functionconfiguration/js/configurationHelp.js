//网格数据字段列表
var columns =[[
               	{field:'businessname',title:'功能名称',width:100},	
               	{field:'databasetype',title:'数据库类型',width:150},	
               	{field:'datasourcename',title:'数据源',width:150},	
				{field:'viewname',title:'视图表',width:100},	
				{field:'tablename',title:'数据表',width:150},	
				{field:'geometerytype',title:'表类型',width:100},	
				{field:'functionnumber',title:'菜单编号',width:80},
				{field:'hasworkflow',title:'是否含有工作流',width:100},	
				{field:'workflowname',title:'工作流名称',width:150},	
				{field:'hasattachment',title:'是否含有附件',width:100},
				{field:'defaultwherefilter',title:'默认过滤条件',width:150},
				{field:'orderby',title:'默认排序子句',width:150}	
			]];

//网格按钮
var toolbars =[{
			id:"createTableInfo",
			text:"创建表",
			iconCls:'icon-add',
			handler:function(){
				top.getDlg("createTable.html","tableadd","自定义表单",700,500);
			}
		},{
		id:"addSysTableInfo",
		text:"新增",
		iconCls:'icon-add',
		handler:function(){
			top.getDlg("addSysTableinfoConfiguration.htm","tableinfoadd","新增基本信息",700,350);
		}
	},{
		id:"10120302",
		text:"修改",
		iconCls:'icon-edit',
		handler:function(){
			var rows = $('#configurationTable').datagrid('getSelections');
			if (rows.length == 1) {
				var row = $('#configurationTable').datagrid('getSelected');
				top.getDlg("updateSysTableinfoConfiguration.htm?eventid="+row.eventid+"&databasetype="+row.databasetype+"&datasourcename="+row.datasourcename,"tableinfoupdate","修改基本信息",700,250);
			}else{
				$.messager.alert('提示', '请选中一条记录！', 'info');
			}
		}
	},{
		id:"10120303",
		text:"删除",
		iconCls:'icon-remove',
		handler:function(){
			// 选择查看的记录
			var rows = $('#configurationTable').datagrid('getSelections');
			if (rows.length > 0) {
				var ids = "";
				// 遍历取得所有被选中记录的id
				for ( var i = 0; i < rows.length; i++) {
					ids += "," + rows[i].eventid;
				}
				if (ids.length > 0)
					ids = ids.substring(1);
				$.messager.confirm('提示框', '如果该配置信息正在使用，请谨慎删除，以防导致配置的功能失效，是否删除?',function(r){
					if(r){
						$.ajax({
							url :rootPath+"jasframework/deleteSystableinfoAction.do?dataSourceName=defaultDataSource",
							type : 'POST',
							data:"eventids="+ids,
							success : function(data) {
								if(data==true){
									$.messager.alert('提示', '删除成功！', 'info',function(){
										$('#configurationTable').datagrid('reload'); // reload
										$('#configurationTable').datagrid('clearSelections'); // clear selected
									});	
								}else{
									$.messager.alert('提示', '删除失败！', 'error');	
								}
								
							},
							dataType:"json",
							error : function(data) {
								$.messager.alert('提示', '删除失败！', 'error');	
							}
						});
					}
				});
			} else {
				$.messager.alert('提示', '请选中记录！', 'info');
			}
		}
	},{
		id:"10120304",
		text:"字段信息配置",
		iconCls:'icon-analysis',
		handler:function(){
			var rows = $('#configurationTable').datagrid('getSelections');
			if (rows.length == 1) {
				var row = $('#configurationTable').datagrid('getSelected');
				var viewname = row.viewname;
				if(viewname==null){
					viewname="";
				}
				top.getDlg("addColumnConfigurationIndex.htm?eventid="+row.eventid+"&viewname="+viewname+"&datasourcename="+row.datasourcename+"&tablename="+row.tablename+"&databasetype="+row.databasetype,"tablecolumnadd","字段信息配置",1100,385,true);
			} else {
				$.messager.alert('提示', '请选中一条记录！', 'info');
			}
		},
		
	},
	{
		id:"10120305",
		text:"下载模板",
		iconCls:'icon-analysis',
		handler:function(){
			var rows = $('#configurationTable').datagrid('getSelections');
			if (rows.length == 1) {
				var row = $('#configurationTable').datagrid('getSelected');
				var eventid = row.eventid;
				$("<iframe id=\"fileDownload\" style=\"display: none;\"></iframe>").appendTo("body");
				var url="../downloadExcel.do?functionId="+eventid;
				$("#fileDownload").attr("src",url);
			} else {
				$.messager.alert('提示', '请选中一条记录！', 'info');
			}
		},
		
	}];

/**
 * 
 * 方法描述：初始化页面数据
 * 
 */
$(document).ready(function() {	
	$("#configurationTable").datagrid({
//		title:"基本信息列表",
		idField:'eventid',
		url:rootPath+"jasframework/getBasicConfigurationAction.do",
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		fitColumns:false,
		columns:columns,
		toolbar:"#toolbars",
		pagination:true,
		rownumbers:true,
		striped: true,
		autoRowHeight: false,
		onLoadSuccess:function(data){
	    	$('#configurationTable').datagrid('clearSelections'); //clear selected options
	    },
		onHeaderContextMenu : function(e, field) {
			e.preventDefault();
			if (!$('#tmenu').length) {
				createColumnMenu($('#configurationTable'));
			}
			$('#tmenu').menu('show', { 
				left : e.pageX,
				top : e.pageY
			});
		}
	});
	initDatagrigHeight('configurationTable', 'queryDiv', $('#queryDiv').height());
});

function queryConfig(){
	// 重新加载datagrid
	var query = {
		'functionNumber' : $('#functionNumber').val()
	};
	$("#configurationTable").datagrid('options').queryParams = query; // 把查询条件赋值给datagrid内部变量
	$("#configurationTable").datagrid({
		"pageNumber" : 1
	});
	$("#configurationTable").datagrid('reload');
}

/**
 * @desc 创建表
 */
function createTableInfo(){
	top.getDlg("createTable.html","tableadd","自定义表单",700,500);
}

/**
 * @desc 新增
 */
function addSysTableInfo(){
	top.getDlg("addSysTableinfoConfiguration.htm","tableinfoadd","新增基本信息",700,350);
}

/**
 * 
 * @desc 修改
 */
function editTableInfo(){
	var rows = $('#configurationTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#configurationTable').datagrid('getSelected');
		top.getDlg("updateSysTableinfoConfiguration.htm?eventid="+row.eventid+"&databasetype="+row.databasetype+"&datasourcename="+row.datasourcename,"tableinfoupdate","修改基本信息",700,350);
	}else{
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}	
}

/**
 * @desc 删除
 */
function removeTableInfo(){
	// 选择查看的记录
	var rows = $('#configurationTable').datagrid('getSelections');
	if (rows.length > 0) {
		var ids = "";
		// 遍历取得所有被选中记录的id
		for ( var i = 0; i < rows.length; i++) {
			ids += "," + rows[i].eventid;
		}
		if (ids.length > 0)
			ids = ids.substring(1);
		$.messager.confirm('提示框', '如果该配置信息正在使用，请谨慎删除，以防导致配置的功能失效，是否删除?',function(r){
			if(r){
				$.ajax({
					url :rootPath+"jasframework/deleteSystableinfoAction.do?dataSourceName=defaultDataSource",
					type : 'POST',
					data:"eventids="+ids,
					success : function(data) {
						if(data==true){
							$.messager.alert('提示', '删除成功！', 'info',function(){
								$('#configurationTable').datagrid('reload'); // reload
								$('#configurationTable').datagrid('clearSelections'); // clear selected
							});	
						}else{
							$.messager.alert('提示', '删除失败！', 'error');	
						}
						
					},
					dataType:"json",
					error : function(data) {
						$.messager.alert('提示', '删除失败！', 'error');	
					}
				});
			}
		});
	} else {
		$.messager.alert('提示', '请选中记录！', 'info');
	}
}

/**
 * @dsec 字段配置
 */
function fieldMatch(){
	var rows = $('#configurationTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#configurationTable').datagrid('getSelected');
		var viewname = row.viewname;
		if(viewname==null){
			viewname="";
		}
		top.getDlg("addColumnConfigurationIndex.htm?eventid="+row.eventid+"&viewname="+viewname+"&datasourcename="+row.datasourcename+"&tablename="+row.tablename+"&databasetype="+row.databasetype,"tablecolumnadd","字段信息配置",1100,390,true);
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
}

/**
 * @desc 下载模板
 */
function downloadModel(){
	var rows = $('#configurationTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#configurationTable').datagrid('getSelected');
		var eventid = row.eventid;
		$("<iframe id=\"fileDownload\" style=\"display: none;\"></iframe>").appendTo("body");
		var url="../downloadExcel.do?functionId="+eventid;
		$("#fileDownload").attr("src", addTokenForUrl(url));
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
}