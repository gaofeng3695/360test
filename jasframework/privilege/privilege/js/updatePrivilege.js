/**
 * 描述：重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限树的id
 */
	function reloadData(shortUrl, elementId){
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].src.indexOf(shortUrl) != -1) {
				fra[i].contentWindow.selectappsystem();
			}
		}
	}
	
	$(document).ready(function(){
		getappsystem();
		$.getJSON(rootPath+'jasframework/privilege/privilege/findPrivilegeById.do', {'oid':oid},function(item, i){			
			jso=item;
			var functionType = jso.functionType;
			if(functionType==null || functionType=='null'){
				jso.functionType = "";
			}
			$('#updatePrivilege').form('load',jso);
			$("#appId").combobox("setValue",jso.appId);
			$("#privilegeType").combobox("setValue",jso.privilegeType);
			$("#appId").combobox("disable");
			setComboObjWidth('privilegeType',0.295,'combobox');
			setComboObjWidth('appId',0.295,'combobox');
			setComboObjWidth('openType',0.295,'combobox');
			setComboObjWidth('functionType',0.295,'combobox');
		});
		$("#privilegeType").combobox({
			onChange:function(newValue, oldValue){
				onchangmenu();
			}
		});
	});
	
	/**
	 * 描述：获取应用系统编号
	 */
	function getappsystem(){
		$.ajax({
			url:rootPath+"jasframework/privilege/application/getList.do",
			async:false,
			dataType:"json",
			success:function(data){
				console.log(data);
				$("#appId").combobox({
					data:data,
					valueField:'oid',
					textField:'appName',
					panelHeight:100
				});
			}
			
		});
	}
	
	//初始化
	var jso;
	var oid = getParamter("oid");
	$.ajaxSetup ({
	   		 cache: false 
	});
	
	function reload(){
		$.getJSON(rootPath+'jasframework/privilege/privilege/findPrivilegeById.do' ,
		{'oid':oid},function(item, i){				
			jso=item;	
		
			$('#updatePrivilege').form('load',jso);				
		});		
	}
	
	/**
	 * 描述：修改权限
	 */
	function updatePrivilege(){
		disableButtion("saveButton");
		var appId=$("#appId").combobox("getValue");
		var privilegeCode = $("#privilegeCode").val();
		var flag = false ;
		//校验编号是否合法
		$.ajax({
			type: "POST",
		   	url: rootPath+"jasframework/privilege/privilege/checkPrivilegeCodeExist.do",
	   		data: {"privilegeCode":privilegeCode,"oid":oid,"appId":appId},
		   	success: function(check){
	     		if (check.status != 1){
					top.showAlert(getLanguageValue("error"),check.msg,'error');
					enableButtion("saveButton");
				}else{
					flag = true;
				}
		   	},
		   	dataType:"json",
		   	async:false
		});
		if( flag ){
			var validateResault = $('#updatePrivilege').form("validate");
			var formData = $("#updatePrivilege").serializeToJson();//获取表单中的json,
			formData.appId = appId ;
			var formStringData = JSON.stringify(formData);
			var url = rootPath+'jasframework/privilege/privilege/update.do';
			$.ajax({
				url: url,//调用新增接口
			    method: "post",
			    contentType: "application/json;charset=utf-8",
			    dataType: "json",
			    data: formStringData,
			    success: function(result){
			    	if(result.status == 1){
				    	top.showAlert(getLanguageValue("tip"),getLanguageValue("savesuccess"),'info',function(){
							reloadZtreeNode('queryPrivilege.htm',oid);
							closePrivilege();
						});
			    	}else{
			    		top.showAlert(getLanguageValue("tip"),result.msg,'info');
						enableButtion("saveButton");
			    	}
			    }
			 });
		}
		
	}	
	/**
	 * 描述：关闭页面
	 */
	function closePrivilege(){
		top. closeDlg("saveiframe");
	}
	
	
	
		
	function onchangmenu(){
		var changtype=$("#privilegeType").combobox("getValue");
		if(changtype==1||"1"==changtype){
			$("#openType").combobox("enable");
			$("#openType").parent().parent().show();
			$("#openType").combobox("setValue","1");
			$("#iconName").show();
			$("#iconValue").show();
			$("#functionTypeName").hide();
			$("#functionTypeValue").hide();
		}else{
			$("#openType").combobox("disable");
			$("#openType").parent().parent().hide();
			$("#openType").combobox("setText","");
			$("#openType").combobox("setValue","");
			$("#iconName").hide();
			$("#iconValue").hide();
			$("#functionTypeName").show();
			$("#functionTypeValue").show();
		}
	}
	
	function reloadZtreeNode(shortUrl,nodeId){
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].src.indexOf(shortUrl) != -1) {
				fra[i].contentWindow.reloadZtreeNode(nodeId);
			}
		}
	}