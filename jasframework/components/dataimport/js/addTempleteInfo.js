/**
 * 
 * 文件描述: 添加模版信息

 * @author LiuDongya
 * @version 1.0
 * 
 */

/**
 * 
 * 方法描述：初始化页面元素
 * 
 */
$(function(){
	$("#tableNameCellID").combobox({
		url:rootPath+"jasframework/importtempletemanage/getAllTableInfoOfCurrentDbUser.do",
		valueField:"TABLE_NAME",
		textField:"TABLE_NAME",
		onSelect:function(){
			var tablename=$("#tableNameCellID").combobox("getValue");
		    $.ajax({
		    	url:rootPath+"jasframework/importtempletemanage/getAllColumnInfoByTableName.do", 
		    	data:{"tablename":tablename},
		    	dataType: "json", 
		    	async:false,
		    	success: function(data){
		    		console.log(data);
		    		$("#createdbyfield").combobox("clear");
		    		$("#createddatefield").combobox("clear");
		    		$("#modifiedbyfield").combobox("clear");
		    		$("#lastmodifiedfield").combobox("clear");
		    		$("#fkfield").combobox("clear");
		    		$("#pkfield").combobox("clear");
		    		$("#isspatialdata").combobox("clear");
		    		$("#spatialdatatype").combobox("clear");
		    		$("#uniquenessvalidatefield").combobox("clear");
		    		
		    		$("#createdbyfield").combobox("loadData",data);
		    		$("#createddatefield").combobox("loadData",data);
		    		$("#modifiedbyfield").combobox("loadData",data);
		    		$("#lastmodifiedfield").combobox("loadData",data);
		    		$("#fkfield").combobox("loadData",data);
		    		$("#pkfield").combobox("loadData",data);
		    		$("#uniquenessvalidatefield").combobox("loadData",data);
		    	}
		    });
		}
	});
	
	$('#uniquenessvalidatefield').combobox({
		multiple:true
	});
	
	$("#isspatialdata").combobox({
		onSelect:function(){
			IfShowSpatialdatatype();
		}
	});
	
	var inputwidth=$("#businessNameCellID").width()+3;
	$(".easyui-combobox").combobox("resize",inputwidth);
	$("#tableNameCellID").combobox("resize",inputwidth);
});

/**
 * 
 * 方法描述：覆盖common.js中的setSelectObjWidth方法，解决select下拉选对不起问题。
 *
 */
function setSelectObjWidth(){
	$("select").each(function() {
		$(this).parent().css('padding-right','10px');
	});
}

/**
 * 是否显示空间数据类型选项
 */
function IfShowSpatialdatatype(){
	var isspatialdata = $("#isspatialdata").combobox('getValue');
	if(isspatialdata=="1"){
		$("#shape").css("display","block");
	}
	else{
		$("#shape").css("display","none");
	}
}
/**
 * 
 * 方法描述：删除table中的行
 * @param obj
 * 
 */
function deleteRow(obj) {
	var rowIndex = $(obj).parent().parent();
	if (rowIndex){
		rowIndex.remove();
	}
}

/**
 * 
 * 方法描述：将模版信息导入到数据库中
 * 
 */
function importTempleteInfoToDB(){
	//模板文件单元格取值验证
	var filename = $("#templeteFileCellID").val();
	if(filename==""){
		top.showAlert("提示","请选择模版文件！",'info');
		return;
	}else if(filename!= "" && filename.indexOf(".xls")==-1){
		top.showAlert("提示","请选择正确的模版文件！",'info');
		return;
	}
	$('#fileTempleteAddForm').form('submit', {
		url :rootPath+"jasframework/importtempletemanage/addTempleteInfo.do",
		dataType:"json",
		onSubmit: function(){
			return $(this).form('validate');
		},
		success : function(result) {
			var result=	eval('('+result+')');
			if(result.success){
				$.messager.alert("提示",result.msg,"info",function(){
					reloadData('dataImportTempleteManage.htm', '#datatableid');
					reloadData('dataImportTempleteDownload.htm', '#datatableid');
					top.closeDlg('addiframe');
				});
			}else{
				$.messager.alert("提示",result.msg,"info",function(){closePanel()});
			}
		}
	});
	
}

/**
 * 方法描述：关闭窗口
 * 
 */
function closeSave() {
	top.closeDlg('addiframe');
}

/**
 * 方法描述：重新加载数据
 * 
 */
function reloadData(url, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(url) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}
