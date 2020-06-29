/**
 * 
 * 文件描述: 添加模版信息

 * @author LiuDongya
 * @version 1.0
 * 
 */

/**
 * 
 * 方法描述：加载页面信息
 * 
 */
$(function(){
	$("#isspatialdata").combobox({
		onSelect:function(){
			IfShowSpatialdatatype();
		}
	});
});

/**
 * 
 * 功能描述：覆盖common.js中的setSelectObjWidth方法，解决select下拉选对不起问题。
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

$(document).ready(function() {
	$("#tableNameCellID").combobox({
		url:rootPath+"jasframework/importtempletemanage/getAllTableInfoOfCurrentDbUser.do",
		valueField:"TABLE_NAME",
		textField:"TABLE_NAME",
		onSelect:function(){
			 getfeild();
		}
	});
	
	var param = this.location.search;
	if (param != null && "" != param) {
		var url =rootPath+"jasframework/importtempletemanage/getTempleteInfo.do"+ param;
		$.getJSON(url, function(jso) {
			$("#businessNameCellID").val(jso.businessname);
			$("#tableNameCellID").combobox("setValue",jso.tablename);
			$("#isspatialdata").combobox("setValue",jso.isspatialdata);
			$("#spatialdatatype").combobox("setValue",jso.spatialdatatype);
			IfShowSpatialdatatype();   //判断是否显示空间数据类型选项
			
			getfeild();
			$("#filename").text(jso.filename);
			//为form赋值时 如果值为null 则会报异常信息,必须处理一下
			try{
				$("#fileTempleteUpdateForm").form("load",jso);
			}catch(e){
				//alert(e);
			}
			var uniquenessvalidatefield = jso.uniquenessvalidatefield;
			if(uniquenessvalidatefield==null || uniquenessvalidatefield==''){
				$("#uniquenessvalidatefield").combobox('clear');
			}else{
				if(uniquenessvalidatefield.indexOf(',')>0){
					var array = uniquenessvalidatefield.split(',');
					$("#uniquenessvalidatefield").combobox("setValues",array);
				}else{
					$("#uniquenessvalidatefield").combobox("setValue",uniquenessvalidatefield);
				}
			}
		});
	}
	
	var inputwidth=$("#businessNameCellID").width()+3;
	$(".easyui-combobox").combobox("resize",inputwidth);
	$("#tableNameCellID").combobox("resize",inputwidth);
});


function getfeild(){
	var tablename=$("#tableNameCellID").combobox("getValue");
    $.ajax({ 
    	url:rootPath+"jasframework/importtempletemanage/getAllColumnInfoByTableName.do", 
    	data:{"tablename":tablename},
    	dataType: "json", 
    	async:false,
    	success: function(data){
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


/**
 * 
 * 方法描述：关闭窗口
 * 
 */
function closeSave() {
	top.closeDlg('updateiframe');
}

/**
 * 
 * 方法描述：删除模版文件
 * @param obj
 * 
 */
function deleteTempleteFile(obj) {
	var rowIndex = $(obj).parent().parent();
	if (rowIndex){
		rowIndex.remove();
	}
	
	//添加模版信息table
	var addTempleteInfoTable;
	//如果添加模版信息table为空，则从页面上获取该table
	if(addTempleteInfoTable==null){
		addTempleteInfoTable=$("#updateTempleteInfo");
	}
	
	var row =$("<tr></tr>");
	var addButtonText=$("<td width='20%' class=\"td_element\"></td>");
	var addButtonTextHtml="<span>模版文件：</span>";
	$(addButtonText).append($(addButtonTextHtml));
	row.append(addButtonText);
	//添加按钮单元格
	var addbutton=$("<td class=\"td_element\"></td>");
	//设置添加按钮单元格格式
	var addbuttonhtml="<input id='templeteFileCellID' name='file' type='file'  class='file input_bg' required='true'/>";
	$(addbutton).append($(addbuttonhtml));
	//添加按钮单元格添加到行中
	row.append(addbutton);
	//将行添加到table中
	addTempleteInfoTable.append(row);
}

/**
 * 
 * 方法描述：更新模版信息
 * 
 */
function updateTempleteInfo(){
	//数据表名单元格取值验证
	var tablename =$("#tableNameCellID").combobox("getText");
	//模板文件单元格取值验证
	var filename = $("#templeteFileCellID").val();
	if(filename==""){
		top.showAlert("提示","请选择模版文件！",'info');
		return;
	}else if(filename!=null && filename!= "" && filename.indexOf(".xls")==-1){
		top.showAlert("提示","请选择正确的模版文件！",'info');
		return;
	}
	var param = this.location.search;
	$('#fileTempleteUpdateForm').form('submit', {
		url :rootPath+"jasframework/importtempletemanage/updateTempleteInfo.do"+param+"&tablename="+tablename,
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
					top.closeDlg('updateiframe');
				});
			}else{
				$.messager.alert("提示",result.msg,"info",function(){
					closePanel();
				});
			}
		}
	});
}

/* 重新加载数据 */
function reloadData(url, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(url) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}

