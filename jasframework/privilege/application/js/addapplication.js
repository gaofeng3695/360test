	var url = "";
	
	/**
	 * 描述：初始化数据
	 */
	function loadData() {
		var id1;
		var param = this.location.search;
		if (param != null && "" != param) {
			var d = param.substr(1).split("&");
			$.each(d, function(i, item) {
				var p = item.split("=");
				if (p[0] == 'eventid') {
					id1 = p[1];
				}
			});
		}
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
	function reloadDataTree(shortUrl, elementId){
		var fra = parent.$("iframe");
		for ( var i = 0; i < fra.length; i++) {
			if (fra[i].src.indexOf(shortUrl) != -1) {
//				var node=fra[i].contentWindow.$(elementId).tree('getRoot');
				fra[i].contentWindow.$(elementId).combobox("reload",rootPath+"jasframework/privilege/application/getUserAppsystem.do?random=" + new Date().getTime());
			}
		}
	}
	/**
	 * 描述：关闭添加页面
	 */
	function closePanel() {
		top.closeDlg("saveiframe");
	}

	/**
	 * 描述：添加系统
	 */
	function save() {
		disableButtion("saveButton");
		 var url = rootPath+"jasframework/privilege/application/saveApp.do";
		var validateResault = $('#saveappForm').form("validate");
		var fromData = JSON.stringify($("#saveappForm").serializeToJson());//获取表单中的json,
		if(validateResault == false){
			top.showAlert(getLanguageValue("tip"), getLanguageValue("formVailidateFailed"), 'info');
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
					if(data != null){
						top.showAlert(getLanguageValue("tip"), getLanguageValue("savesuccess"), 'info', function() {
							//重新加载表格数据
							reloadData('queryapplication.htm', '#dg');
							//关闭弹出框
						    closePanel();
						});
					} else {
						top.showAlert(getLanguageValue("tip"), getLanguageValue("saveFailed"), 'error');
						enableButtion("saveButton");
					}
			    }
			 });
		}
	}
	function savecheck(){
		var bool= $('#saveappForm').form('validate');
		if(bool){
			jQuery.getJSON(rootPath+"/jasframework/privilege/application/checkAppName.do?r="+new Date().getTime(),{"oid":$("#oid").val(),"appName":$("#appName").val()},function (data){
				if(data){
					save();
				}else{
					top.showAlert(getLanguageValue("error"), getLanguageValue("app.appNameExists"), 'error');
				}
			});
		}else{
			return bool;
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
			$("#roleselect").combobox("setValue",data[0].oid);
			
		});
	}
	//初始化
	$(function() {
		loadData();
		loadrole();
		$("#roleselect").combobox({
			width : document.documentElement.clientWidth * 0.30
		});
	});
	//初始化datagrid
	$('#dg').datagrid({
		width : '100%',
		height : 390,
		nowrap : false,
		striped : true,
		collapsible : false,
		url : './....do',
		sortName : 'id',
		sortOrder : 'asc',
		remoteSort : false,
		idField : 'id',
		pagination : true,
		rownumbers : true,
		onHeaderContextMenu : function(e, field) {
			e.preventDefault();
			$('#tmenu').menu('show', {
				left : e.pageX,
				top : e.pageY
			});
		}
	});
