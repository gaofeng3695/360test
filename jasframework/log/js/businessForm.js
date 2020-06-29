var addOrUpdateFlag='businessAdd';
var filesum=4;

$(document).ready(function(){
	$("#sex").combobox({
		width : document.documentElement.clientWidth * 0.35
	});
});


function loadData() {
	$("#unitEventid").combotree({
		url: rootPath+'/jasframework/privilege/unit/getLeftTree.do'
	});
	var eventid = getParamter('eventid');
	if(eventid!='' && typeof(eventid)!=undefined) {
		addOrUpdateFlag ='businessUpdate';
		$("#eventid").val(eventid);
		businessid=eventid;
		var url = "../logsample/queryInfo.do?eventid="+eventid;
		$.getJSON(url,function(jso) {
			$("#usernameID").val(jso.username);
			$('#sex').combobox('setValue', jso.sex);
			$('#unitEventid').combotree('setValue', jso.unitEventid);
			uploadanddownload();
		});
	}
}

function save() {
	$('#savePcUser').form('submit', {
		url : "../logsample/addBusiness.do",
		onSubmit : function() {
			if($(this).form('validate')){
				disableButtion("10060106");
				return true;
			}else{
				return false;
			}
		},
		success : function(result) {
			if(result!=null){
				businessid=result;
				uploadfile(closeWindow);
				reloadData('businessDataGrid.htm', '#loginLogTable');
			}
			else{
				enableButtion('10060106');
			}
			
		}
	});
}
function saveForWorkflow() {
	$('#savePcUser').form('submit', {
		url : "../logsample/addBusiness.do",
		onSubmit : function() {
			if($(this).form('validate')){
				disableButtion("butForWorkflow");
				return true;
			}else{
				return false;
			}
		},
		success : function(result) {
			if(result!=null){
				businessid=result;
				uploadfile();
				startWorkflow(businessid, "business", "业务流程主题","业务流程测试",true,callbackFun);
			}
			else{
				enableButtion('butForWorkflow');
			}
			
		}
	});
}
//回调函数
function callbackFun(result){
	if (result.success){
		$.messager.alert('正确',result.ok,'ok',function(){
			reloadData('businessDataGrid.htm', '#loginLogTable');
			uploadfile(closeWindow);
		});
	} else {
		top.showAlert('错误',result.msg,'error');
	}
	
}
function updateForWorkflow() {
	$('#savePcUser').form('submit', {
		url : "../logsample/addBusiness.do",
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			businessid=result;
			uploadfile();
			return true;
		}
	});
}
function closeWindow(){
	top.closeDlg(addOrUpdateFlag);
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

