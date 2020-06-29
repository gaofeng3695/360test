/** 
 * @file
 * @author  xxx
 * @version 1.0 
 * @desc  新增修改角色js
 * @date  2012-08-30 上午17:46:07 
 * @last modified by lizz
 * @last modified time  2017-08-17
 */

var oid = "";

/**
 * @desc 初始化页面
 */
$(function() {
	oid = getParamter("oid");
	$('#roleType').combobox({   
	  valueField:'id',   
	  textField:'text'  
	}); 
     
    loadData();
	if (!isNull(oid)) {
		
	}else{
		loadSelect();
	}
	setComboObjWidth('unitId',0.33,'combotree');
	setComboObjWidth('roleType',0.34,'combobox');
});


/**
 * #desc 描述：初始化数据
 */
function loadData() {
	//初始化部门树
	$.getJSON(rootPath+"jasframework/privilege/unit/getLeftTree.do", function(jso) {
		$("#unitId").combotree({
			panelHeight:150,
			data : jso
		});
		$("#unitId").combotree('setValue', jso[0].id);
		setComboObjWidth('unitId',0.33,'combotree');
		setComboObjWidth('roleType',0.34,'combobox');
		//执行修改时数据回填
		if (oid != null && oid != "" ) {
			$.ajax({
				url : rootPath+"jasframework/privilege/role/getRoleById.do",
				data :{"oid" : oid},
				type : 'POST',
				dataType:"json",
				success : function(data) {
					var jsonData = data.data;
					$('#unitId').combotree('setValue', jsonData.unitId);
					$("#roleForm").form('load', jsonData);
					loadSelect(jsonData);
				},
				error : function(result) {
					top.showAlert(getLanguageValue("tip"), getLanguageValue("queryError"), 'info');
				}
			});
		} 
	});
}

function loadSelect(jsonData){
	$('#dataFilterRegulationCode').combobox({
	    url:rootPath+'jasframework/sysdoman/getDoman.do?domainName=dataFilterRegulation',
	    valueField:'codeId',
	    textField:'codeName',
	    onLoadSuccess:function(data){
	    	if (!isNull(oid)) {
	    		$('#dataFilterRegulationCode').combobox('setValue', jsonData.dataFilterRegulationCode);
	    	}else{
	    		$('#dataFilterRegulationCode').combobox('setValue', data[0].codeId);
	    	}
	    }
	});
}
/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("saveiframe");
}

/**
 * @desc 添加角色
 */
function save() {
	disableButtion("saveButton");
	var url = "";
	var validateResault = $('#roleForm').form("validate");
	var formData = $("#roleForm").serializeToJson();
	if(oid != "" && oid != null){
		formData.oid=oid;
		url = rootPath+"jasframework/privilege/role/updateRole.do";
	}else{
		url = rootPath+"jasframework/privilege/role/addRole.do";
	}
	var fromData = JSON.stringify(formData);//获取表单中的json,
	
	if(validateResault == false){
		top.showAlert(getLanguageValue("tip"), getLanguageValue("必填项不能为空"), 'info');
		enableButtion("saveButton");
		return validateResault;
	}else{
		$.ajax({
			url: url,//调用新增接口
		    method: "post",
		    contentType: "application/json;charset=utf-8",
		    dataType: "json",
		    data:fromData,
		    success: function(data){
				if(data.status==1){
					top.showAlert(getLanguageValue("tip"), getLanguageValue("savesuccess"), 'info', function() {
						//重新加载表格数据
						reloadData('queryRole.htm', '#dg');
						//关闭弹出框
					    closePanel();
					});
				} else {
					top.showAlert(getLanguageValue("tip"), data.msg, 'error');
					enableButtion("saveButton");
				}
		    }
		 });
	}
}
