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
                 {field:'remark',title:'备注',width:240},
                 {field:'downloadbutton',title:'文件下载',width:100,formatter:function(value,rowData,rowIndex){
         			return "<img src='image/download.png' id='"+ rowData.eventid+ "' onclick='downloadOneTemplete(this)' />";
         		  }}                 
              ]];

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
		var url= rootPath + "jasframework/excel/downloadExcelTemplate.do?templateId=" + templateId;
		$("#fileDownload").attr("src",url);
	} else {
		$.messager.alert('提示', '请选中一条记录！', 'info');
	}
}

/**
 * @desc 操作栏下载模板
 * @param obj	行数据对象
 */
function downloadOneTemplete(obj){
	var templateId = obj.id;
	$("<iframe id=\"fileDownload\" style=\"display: none;\"></iframe>").appendTo("body");
	var url= rootPath + "jasframework/excel/downloadExcelTemplate.do?templateId=" + templateId;
	$("#fileDownload").attr("src",url);
}

/**
 * @desc 导入Excel数据
 * 
 */
function importData(){
	var rows = $('#excelTemplateTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#excelTemplateTable').datagrid('getSelected');
		var templateId = row.eventid;
		top.getDlg("importExcelData.htm?callerPageUrl=queryExcelTemplate.htm&datagridElementId=excelTemplateTable&templateId="+templateId+"&tableName=","importiframe","导入excel数据",650,450,false);
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
 * 
 * @desc 查询符合条件的模版信息
 * 
 */
function queryConfig(){
	var templateName = $("#templateName").val();
	var query={"templateName":templateName}; //把查询条件拼接成JSON
	$("#excelTemplateTable").datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
	$("#excelTemplateTable").datagrid('reload')

}	