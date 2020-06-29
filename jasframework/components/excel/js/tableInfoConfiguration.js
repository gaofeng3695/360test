var templateId = getParamter('templateId');
//网格数据字段列表
var columns = [[
                 {field:'eventid',title:'主键字段',width:70,hidden:true},
                 {field:'tableName',title:'表名称',width:150},
                 {field:'tableAlias',title:'表别名',width:100},
                 {field:'formType',title:'表单类型',width:70,
                	 formatter: function(value,row,index){
          				if (row.formType){
          					if(row.formType=="1"){
          						return "表格";
          					}else{
          						return "列表";
          					}
          				} else {
          					return "表格";
          				}
          			}
                 },
                 {field:'geometryType',title:'表类型',width:60,
                	 formatter: function(value,row,index){
          				if (row.geometryType){
          					if(row.geometryType=="Point"){
          						return "点空间表";
          					}else if(row.geometryType=="Polyline"){
          						return "线空间表";
          					}else if(row.geometryType=="Polygon"){
          						return "面空间表";
          					}else{
          						return "属性表";
          					}
          				} else {
          					return "属性表";
          				}
          			}
                },
                 {field:'isMainTable',title:'是否主表',width:70,
                	 formatter: function(value,row,index){
         				if (row.isMainTable){
         					if(row.isMainTable=="1"){
         						return "是";
         					}else{
         						return "否";
         					}
         				} else {
         					return "否";
         				}
         			}
                 },
                 {field:'fieldNames',title:'唯一性校验字段名称',width:120},
                 {field:'sheetIndex',title:'sheet索引',width:75},
                 {field:'remark',title:'备注',width:100}
              ]];

/**
 * 
 * 方法描述：新增表配置信息
 * 
 */

function addTable(){
	getDlg("addTable.htm?templateId=" + templateId,"addtable","新增表配置信息",850,400);
}

/**
 * 
 * 方法描述：修改配置
 * 
 */
function updateTable(){
	var rows = $('#tableInfoData').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#tableInfoData').datagrid('getSelected');
		getDlg("updateTable.htm?eventid="+row.eventid+"&templateId="+templateId,"updatetable","修改表配置信息",850,400);
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
}


/**
 * 
 * 方法描述：删除
 * 
 */
function deleteTable(){
	//选择查看记录
	var rows = $('#tableInfoData').datagrid('getSelections');
	if (rows.length > 0) {
		var ids = "";
		//遍历取得所有被选中记录的id
		for ( var i = 0; i < rows.length; i++) {
			ids += ","+rows[i].eventid;
		}
		if (ids.length > 0) {
			ids = ids.substring(1);
			$.messager.confirm('提示框', '您确定要删除该表吗？',function(r){
				if (r) {
					$.ajax({
						url : rootPath + 'jasframework/excel/deleteTableInfo.do',
						type: 'POST',
						data: "tableIds="+ids,
						success: function(data){
							if (data == true) {
								$.messager.alert('提示', '删除成功！' , 'info', function(){
									$('#tableInfoData').datagrid('reload');
									$('#tableInfoData').datagrid('clearSelections');
								});
							}else {
								$.messager.alert('提示', '删除失败！', 'error');
							}
						},
						dataType:"json",
						error: function(data){
							$.messager.alert('提示', '删除失败！', 'error');
						} 
					});
				}
			});
		}
	} else {
		$.messager.alert('提示', '删除失败！', 'error');
	}
}

/**
 * 
 * 方法描述：字段信息配置
 * 
 */
function fieldInfoConfig(){
	var rows = $('#tableInfoData').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#tableInfoData').datagrid('getSelected');
		top.getDlg("fieldInfoConfiguration.htm?eventid="+row.eventid+"&templateId="+templateId+"&formType="+row.formType,"fieldInfoConfig","字段信息配置",880,500);
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
	
}
/**
 * 
 * 方法描述：初始化页面数据
 * 
 */
$(document).ready(function() {	
	$("#tableInfoData").datagrid({
		idField:'eventid',
		url: rootPath + "jasframework/excel/getTableInfoByTemplateId.do?templateId=" + templateId,
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		singleSelect:true,
		fitColumns:true,
		columns:columns,
		toolbar:"#toolbars",
		pagination:true,
		rownumbers:true,
		striped: true,
		autoRowHeight: false,
		onLoadSuccess:function(data){
	    	$('#tableInfoData').datagrid('clearSelections'); //clear selected options
	    }
	});
	initDatagrigHeight('tableInfoData', "toolbars", $("#toolbars").height());
});

/**
 * 重新加载datagrid数据
 */
function reloadDataGrid(){
	$('#tableInfoData').datagrid('reload');
	$('#tableInfoData').datagrid('clearSelections');
}
/**
 * 关闭弹出窗口
 * @param id 弹出窗id
 */
function closeWind(id){
	closeDlg(id);
}