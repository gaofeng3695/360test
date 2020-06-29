var url = "";
$(function() {
	loadbusiness();
	loadData();
});
function loadbusiness() {
	$.getJSON(rootPath+"jasframework/businessTable/findAllBusinessList.do", function(data) {
		$("#businessTableName").combobox({
			data : data,
			width : 140,
			multiple:false,
			valueField : 'BUSINESSTABLENAME',
			textField : 'BUSINESSTABLENAME',
			panelHeight : 100
		});
   });
}
/**
 * 描述：关闭添加页面
 */
function closePanel() {
	top.closeDlg("saveiframe");
}
/**
 * 描述：判断是进行新增还是进行更新
 */
function loadData() {
	var id1 = getParamter("eventid");
	if (id1 != null && "" != id1) {
		$.getJSON(rootPath+"jasframework/businessTable/getBusinessById.do", {"eventid" : id1}, function(jso) {
			$("#businessForm").form('load', jso);
			$("#id").val(id1);
			});
	  
		url =rootPath+"jasframework/businessTable/updateBusiness.do";
	} else {
		url = rootPath+"jasframework/businessTable/addBusiness.do";
	}
}
/**
 * 描述：保存按钮执行的操作
 */
function save() {
    disableButtion("savebutton");
	$('#businessForm').form('submit',{
						url : url,
						onSubmit : function() {
							var bool = $(this).form('validate');
							if (bool == false) {
								enableButtion("savebutton");
							}
							return bool;
						},
						success : function(result) {
							var result = eval('(' + result + ')');
							if (result.success) {
								top.showAlert(getLanguageValue("tip"),getLanguageValue("addsuccess"),'info', function() {
											reloadData('businessConfig.htm','#dg');
											closePanel();
										});
							} else if(result.error){
								top.showAlert(getLanguageValue("tip"),getLanguageValue("businessnamerepetition"),'error');
								$("#businessName").val('');
								enableButtion("savebutton");
							}else if(result.errorBusinessTableName){
								top.showAlert(getLanguageValue("tip"),getLanguageValue("businesstablenamenotexist"),'error');
								 $("#businessTableName").combobox("setValue","");
								 enableButtion("savebutton");
							}
							else{
								
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
