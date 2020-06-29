	

	var url="";
	/**
	 * 描述：关闭添加页面
	 */
	function closePanel(){
		top. closeDlg("saveiframe");
	}
	/**
	 * 描述：重新加载数据
	 * @param url 重新加载数据的页面
	 * @param elementId datagridID
	 */
	function reloadData(url, elementId){
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].src.indexOf(url) != -1) {
				fra[i].contentWindow.$(elementId).datagrid("reload");
			}
		}
	}
	
	/**
	 * 描述：新增用户
	 */
	function save(){
			//检查用户名是否重复
			var name=$("#name").val();
		 	$.getJSON("../../emploryTest/checkEmplory.do?username="+name,
			 	function(check) {
					if (check.error=='-1'){
						top.showAlert(getLanguageValue("error"),getLanguageValue("user.userexist"),'error');
					} else{
						//如果不重复则添加用户
						url="../../emploryTest/addEmplorye.do";
						$('#employeeAddForm').form('submit',{
							url: url,
							onSubmit: function(){
								return $(this).form('validate');
							},
							success: function(result){
								
								if (result.success!='-1'){
									top.showAlert(getLanguageValue("success"),getLanguageValue("savesuccess"),'ok',function(){
										reloadData('employee.htm','#showEmplorye');
										//关闭弹出框
										closePanel();
									});
								} else {
									top.showAlert(getLanguageValue("error"),getLanguageValue("user.userexist"),'error');
								}
							}
						});
					}
			});
	}
