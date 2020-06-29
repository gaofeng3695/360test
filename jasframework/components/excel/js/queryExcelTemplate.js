//网格数据字段列表
var columns = [[
                 {field:'eventid',title:'主键字段',width:100,hidden:true},
                 {field:'templateName',title:'模板名称',width:200},
                 {field:'templateType',title:'模板类型',width:100,
                	 formatter: function(value,row,index){
	     				if (row.templateType){
	    					if(row.templateType=="1"){
	    						return "单表";
	    					}else if(row.templateType=="2"){
	    						return "多表/单sheet";
	    					}else{
	    						return "多表/多sheet";
	    					}
	    				} else {
	    					return "";
	    				}
	    			}
                 },
                 {field:'datasourceName',title:'数据源',width:150},
                 {field:'createdDate',title:'创建时间',width:150},
                 {field:'createdBy',title:'创建人',width:80},
                 {field:'lastModified',title:'修改时间',width:150},
                 {field:'modifiedBy',title:'修改人',width:80},
                 {field:'remark',title:'备注',width:240}
              ]];

function lookupExcel(){
	var rows = $('#excelTemplateTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#excelTemplateTable').datagrid('getSelected');
		top.getDlg("lookupExcelTemplate.htm?eventid="+row.eventid,"templatelookup","查看模板信息",700,510);
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
}

/**
 * 方法描述：新增Excel
 * 
 */
function addExcel(){
	 top.getDlg("addExcelTemplate.htm","templateadd","新增Excel模板信息",800,550);
}

/**
 * 方法描述：修改Excel
 * 
 */
function updateExcel(){
	var rows = $('#excelTemplateTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#excelTemplateTable').datagrid('getSelected');
		top.getDlg("updateExcelTemplate.htm?eventid="+row.eventid,"templateupdate","修改Excel模板信息",800,550);
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
}


/**
 * 方法描述：删除Excel
 * 
 */
function deleteExcel(){
	//选择记录
	var rows = $('#excelTemplateTable').datagrid('getSelections');
	if (rows.length > 0) {
		var ids = "";
		//遍历取得所有被选中记录的id
		for ( var i = 0; i < rows.length; i++) {
			ids += ","+rows[i].eventid;
		}
		if (ids.length > 0) {
			ids = ids.substring(1);
			$.messager.confirm('提示框', '您确定要删除该模板吗？',function(r){
				if (r) {
					$.ajax({
						url : rootPath + 'jasframework/excel/deleteTemplateInfo.do',
						type: 'POST',
						data: "templateIds=" + ids,
						success: function(data){
							if (data == true) {
								$.messager.alert('提示', '删除成功！' , 'info', function(){
									$('#excelTemplateTable').datagrid('reload');
									$('#excelTemplateTable').datagrid('clearSelections');
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
 * 方法描述：生成Excel模板
 * 
 */
function createNative(){
	var rows = $('#excelTemplateTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#excelTemplateTable').datagrid('getSelected');
		var templateId = row.eventid;
		$.ajax({
			url:rootPath + 'jasframework/excel/createExcelTemplate.do?templateId='+templateId,
			type:"POST",
			success:function(result){
				if (result.success == "1") {
					$.messager.alert('提示',result.message,"info");
				} else {
					$.messager.alert('提示',result.message,"info");
				}
			},
			dataType:"json",
			async:false,
			error:function(result){
				$.messager.alert('提示',result.message,"info");
			}
		});
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
}

/**
 * 方法描述：下载Excel模板
 * 
 */
function downloadNative(){
	var rows = $('#excelTemplateTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#excelTemplateTable').datagrid('getSelected');
		var templateId = row.eventid;
		$("<iframe id=\"fileDownload\" style=\"display: none;\"></iframe>").appendTo("body");
		var url= rootPath + "jasframework/excel/downloadTemplate.do?templateId=" + templateId;
		$("#fileDownload").attr("src", addTokenForUrl(url));
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
}

/**
 * @desc 上传模板
 */
function uploadTemplate(){
	var rows = $('#excelTemplateTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#excelTemplateTable').datagrid('getSelected');
		var templateId = row.eventid;
		top.getDlg("uploadTemplate.html?callerPageUrl=queryExcelTemplate.htm&datagridElementId=excelTemplateTable&templateId="+templateId,"uploadTemplate","上传excel模板",450,350,false);
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
}

/**
 * 方法描述：导入Excel数据
 * 
 */
function importData(){
	var rows = $('#excelTemplateTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#excelTemplateTable').datagrid('getSelected');
		var templateId = row.eventid;
		top.getDlg("importExcelData.htm?callerPageUrl=queryExcelTemplate.htm&datagridElementId=excelTemplateTable&templateId="+templateId+"&tableName=&functionName=","importiframe","导入excel数据",650,450,false);
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
	$("#excelTemplateTable").datagrid({
		/*title:"模板信息列表",*/
		idField:'eventid',
		url:rootPath+"jasframework/excel/getAllTemplateInfo.do",
		fitColumns:true,
		frozenColumns:[[
		                {field:'ck',checkbox:true}
		    		]],
		columns:columns,
		toolbar:"#toolbars",
		pagination:true,
		rownumbers:true,
		striped: true,
		autoRowHeight: false,
		onLoadSuccess:function(data){
	    	$('#excelTemplateTable').datagrid('clearSelections'); //clear selected options
	    }
	});
	initDatagrigHeight('excelTemplateTable', 'queryDiv', $('#queryDiv').height());
});

/**
 * @desc 查询符合条件的模版信息
 */
function queryConfig(){
	var templateName = $("#templateName").val();
	var query={"templateName":templateName}; //把查询条件拼接成JSON
//	var query={"templateName":encodeURI(encodeURI(templateName))}; //把查询条件拼接成JSON
	$("#excelTemplateTable").datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
	$("#excelTemplateTable").datagrid('reload')

}