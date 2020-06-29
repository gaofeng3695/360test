var url = "";
var id1;
$(function() {
	loadfielaname();//页面上的字段名
	loadData();
	loadquery();//页面上的查询条件类型
	$("#fieldType").combobox({"onChange":function(){
     onchangurl();
     }});
});
function loadfielaname() {
	businesstablename = getParamter("businesstablename");
	$.getJSON(rootPath+"jasframework/queryConfig/findAllQueryList.do",{"businesstablename" :businesstablename}, function(data) {
			$("#fieldName").combobox({
			data : data,
			width : 185,
			multiple:false,
			valueField : 'FIELDNAME',
			textField : 'FIELDNAME',
			panelHeight : 100
		});
	});
}
function onchangurl(){
	var changtype=$("#fieldType").combobox("getValue");
	
	if(changtype==5||"5"==changtype){//下拉选
		$("#fie_tr").show();
		$("#dataUrl_tr").show();
		$("#dataUrl").attr("disabled",false); 
		$("#valueField").attr("disabled",false); 
	    $("#textField").attr("disabled",false); 
	}
	else if(changtype==13||"13"==changtype){//下拉树
		$("#fie_tr").hide();
		$("#dataUrl_tr").show();
		$("#dataUrl").attr("disabled",false); 
		$("#valueField").attr("disabled",true); 
	    $("#textField").attr("disabled",true); 
	}
	else{
		$("#fie_tr").hide();
	    $("#dataUrl_tr").hide();
	    $("#dataUrl").attr("disabled",true); 
	    $("#valueField").attr("disabled",true); 
	    $("#textField").attr("disabled",true); 
		/*document.getElementById("dataUrl1").value="";
		$('#valueField').val('');
		$('#textField').val('');*/
		
	}
}
function loadquery() {
	$("#fieldType").combobox({
		url :rootPath+"jasframework/sysdoman/getsysdoman.do?domainname=queryuitype",
		valueField : "codeid",
		textField : "codename",
		width : 185,
		multiple:false,
        panelHeight : 150
	});
}
/**
 * 描述：关闭添加页面
 */
function closePanel() {
	top.closeDlg("saveiframe");
}
function loadData() {
	id1 = getParamter("eventid");
	var id11 = getParamter("eventid1");
	if (id11 != null && "" != id11) {
		$.getJSON(rootPath+"jasframework/queryConfig/getQueryById.do?random="+new Date(), {"eventid" : id11}, function(jso) {			
			$("#queryForm").form('load', jso);
			onchangurl();
//			$("#fieldType").combobox('setValue', jso.fieldtype);
//			$("#businessid").val(id11);
	       
			
		});
		$("#fieldName").combobox({
			disabled:true
       	});
		url = rootPath+"jasframework/queryConfig/updateQuery.do";
	} else {
		url =rootPath+"jasframework/queryConfig/addQuery.do?businessid=" + id1;
	}
	
}

/**
 * 描述：保存按钮执行的操作
 */
function save() {
	//id1 = getParamter("eventid");
	disableButtion("savebutton");
	$('#queryForm')
			.form('submit',{url : url,onSubmit : function() {
							var bool = $(this).form('validate');
							if (bool == false) {
								enableButtion("savebutton");
							}
							return bool;
						},
						success : function(result) {
							var result = eval('(' + result + ')');
							if (result.success) {
								top.showAlert(getLanguageValue("tip"),getLanguageValue("savesuccess"),'info', function() {
								//	self.location.reload();
											reloadData('businessConfig.htm','#dg1');
											closePanel();
										});
							} else {
								top.showAlert(getLanguageValue("tip"),getLanguageValue("字段名重复"),'error');
								$("#fieldName").combobox('setValue', "");
								enableButtion("savebutton");
							}
						}
					});
}
/**
 * 描述：保存按钮执行完重新加载页面
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}
