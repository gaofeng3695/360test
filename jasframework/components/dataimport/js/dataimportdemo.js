/**
 * 
 * 文件描述: 导入Excel数据
 * @author LiuDongya
 * @version 1.0 
 * 
 */

//页面按钮
var toolbars=[{
	id:"1",
	text:"导入",
	iconCls:"icon-import",
	handler:function(){
			top.getDlg("importExcelData.htm?callerPageUrl=dataimportdemo.htm&datagridElementId=datatableid","importiframe","导入excel数据",650,450,false);
	}
}];

/**
 * 初始化执行代码
 */
$(document).ready(function() {
	$('#datatableid').datagrid({
		title:"Excel列表",
		idField:'eventid',
		frozenColumns:[[
		                {field:'ck',checkbox:true}
		    		]],
		toolbar:toolbars,
		fitColumns:false,
		pagination:true,
		rownumbers:true,
		striped: true,
		autoRowHeight: false,
		onLoadSuccess:function(data){
			$(".datagrid-header-check input").attr("checked",false);
	    	$('#datatableid').datagrid('clearSelections'); 
	    }
	});
	initDatagrigHeight('datatableid', '', 0);
});