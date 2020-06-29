	var url = "";
	
	/**
	 * 描述：初始化数据
	 */
	function loadData() {
		var oid=getParamter("oid");
		$.getJSON(rootPath+"jasframework/privilege/application/getById.do?oid="+oid+"&r="+new Date().getTime(),function(data){
			$("#updateappForm").form("load",data);
		});
	}
	/**
	 * 描述：重新加载数据
	 * @param shortUrl 重新加载数据的页面
	 * @param elementId 权限列表的id
	 */
	function reloadData(shortUrl, elementId) {
		var fra = parent.$("iframe");
		for ( var i = 0; i < fra.length; i++) {
			if (fra[i].src.indexOf(shortUrl) != -1) {
				fra[i].contentWindow.$(elementId).datagrid("reload");
			}
		}
	}
	/**
	 * 描述：关闭添加页面
	 */
	function closePanel() {
		top. closeDlg("updateiframe"); 
	}

	function updatecheck(){
		var bool= $('#updateappForm').form('validate');
		if(bool){
			jQuery.getJSON(rootPath+"/jasframework/privilege/application/checkAppName.do?r="+new Date().getTime(),{"oid":$("#oid").val(),"appName":$("#appName").val()},function (data){
				if(data){
					updatedata();
				}else{
					top.showAlert(getLanguageValue("error"), getLanguageValue("applicationnameexists"), 'error');
				}
			});
		}else{
			return bool;
		}
	}
	
	/**
	 * 描述：修改应用系统
	 */
	function updatedata() {
		disableButtion("savebutton");
		var url =rootPath+"jasframework/privilege/application/update.do";
		var validateResault = $('#updateappForm').form("validate");
		var fromData = JSON.stringify($("#updateappForm").serializeToJson());//获取表单中的json,
		if(validateResault == false){
			top.showAlert(getLanguageValue("tip"), getLanguageValue("formVailidateFailed"), 'info');
			enableButtion("savebutton");
			return validateResault;
		}else{
			$.ajax({
				url: url,//调用新增接口
			    method: "post",
			    contentType: "application/json;charset=utf-8",
			    dataType: "json",
			    data:fromData,
			    success: function(data){
					if(data.success==1){
						top.showAlert(getLanguageValue("tip"), getLanguageValue("updatesuccess"), 'info', function() {
							//重新加载表格数据
							reloadData('queryapplication.htm', '#dg');
							//关闭弹出框
						    closePanel();
						});
					} else {
						top.showAlert(getLanguageValue("tip"), getLanguageValue("updateFailed"), 'error');
						enableButtion("saveButton");
					}
			    }
			 });
		}
	}
	function loadrole(){
		$.getJSON(rootPath+"jasframework/privilege/role/getList.do",function(data){
			$("#roleselect").combobox({
				data:data,
				valueField:'oid',
				textField:'roleName',
				panelHeight:100
			});
			loadData();
		});
		setComboObjWidth('roleselect',0.3,'combobox');
	}
	//初始化
	$(function() {
		loadrole();
	});
	
