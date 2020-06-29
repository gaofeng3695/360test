/** 
 * @file
 * @author  xxx
 * @version 1.0 
 * @desc  修改管理员信息js
 * @date  2012-08-30 上午17:46:07 
 * @last modified by lizz
 * @last modified time  2017-08-17
 */
	var url = "";
	
	/**
	 * @desc  加载数据初始数据
	 */
	function loadData() {
		var loginName;
		var param = this.location.search;
		if (param != null && "" != param) {
			loginName = getParamter("id");
		}
		if (loginName != null && "" != param) {
			$.getJSON(rootPath+"jasframework/privilege/user/getUserById.do?random=" + new Date().getTime(), {
				"id" : loginName
			}, function(jso) {
				$("#savePcUser").form('load', jso);
				$("#id").val(loginName);
				url = rootPath+"jasframework/privilege/user/updateUser.do";
			$.getJSON(rootPath+"jasframework/privilege/unit/findUnitById.do?random=" + new Date().getTime(), {
				"oid" : jso.unitEventid
			}, function(data) {
		        $('#unit').val(data.name);
		         $('#unitEventid').val(jso.unitEventid);
			});
			});
			
			
		} else {
			url = rootPath+"jasframework/privilege/user/createUser.do";
		}
		
	}

	/**
	 * @desc  关闭修改页面
	 */
	function cancelUser() {
		top. closeDlg("updateiframe");	
	}
	
	/**
	 * @desc  重新加载数据
	 * @param url 重新加载数据的页面
	 * @param elementId datagridID
	 */
	function reloadData(url, elementId) {
		var fra = parent.$("iframe");
		for ( var i = 0; i < fra.length; i++) {
			if (fra[i].src.indexOf(url) != -1) {
				fra[i].contentWindow.$(elementId).datagrid("reload");
			}
		}
	}

	/**
	 * @desc  修改用户
	 */
	function updateUser() {
		var loginname = $("#loginname").val();
		var eventid = $("#eventid").val();
		$.getJSON(rootPath+"jasframework/privilege/user/checkUserLoginNameForUpdate.do?loginname="+loginname+"&eventid="+eventid,function(check) {
			if (check.error=='-1'){
				top.showAlert('错误',check.msg,'error');
			} else{
				url=rootPath+"jasframework/privilege/user/updateUser.do";
				$('#savePcUser').form('submit',{
					url: url,//"createPcUser.do",
					onSubmit: function(){
						return $(this).form('validate');
					},
					success: function(result){
					var result = eval('('+result+')');
					if (result.success){
						top.showAlert('正确',getLanguageValue("updatesuccess"),'ok',function(){
							reloadData('queryUser.htm','#10060201');
							closePanel();
						});
					} else {
						top.showAlert('错误',result.msg,'error');
					}
				}
			});
		}
	   });
   	}
	
	
	/**
	 * @desc  关闭修改页面
	 */
	function closeUser(){
		top. closeDlg("updateiframe");
	}
		
	$(document).ready(function(){
		setComboObjWidth("uniteventid","0.34","combotree");
		loadData();
	});