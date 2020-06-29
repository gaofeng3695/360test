/**
 * 描述：重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限书的id
 */
function reloadData(shortUrl, elementId){
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].src.indexOf(shortUrl) != -1) {
				
				fra[i].contentWindow.selectappsystem();
			}
		}
	}
function reloadtree(shortUrl,parentEventid){
	var fra= parent.$("iframe");
	for(var i=0; i<fra.length;i++) {
		if(fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.reloadchildren(parentEventid);
		}
	}
//	callback();
}

//页面初始化
	$(document).ready(function(){
		getappsystem();
		$("#privilegeType").combobox({"onChange":function(){
			onchangmenu();
		}});
		$('#privilegeType').combobox("setValue","1");
	});
	
	/**
	 * 描述：获得应用系统
	 */
	function getappsystem(){
		$.ajax({
			url:rootPath+"jasframework/privilege/application/getList.do",
			type:"post",
			success:function(result){
				$('#appId').combobox({ 
					data:result, 
					valueField:'oid', 
					textField:'appName' 
					}); 
				$('#appId').combobox("setValue",getParamter("appId"));
				$('#appsystemnumber').val(getParamter("appId"));
				setComboObjWidth('privilegeType',0.295,'combobox');
				setComboObjWidth('appId',0.295,'combobox');
				setComboObjWidth('childrenPrivilege',0.295,'combobox');
				setComboObjWidth('functionType',0.295,'combobox');
				$("#functionType").combobox("setValue","bt_add");
				setComboObjWidth('openType',0.295,'combobox');
				$('#appId').combobox("disable");
			},
			dataType:"json",
			 	error:function(){
			}
		});
	}
	/**
	 * 描述：保存权限
	 */
	function savePrivilege(){
		disableButtion("saveButton");
		var appId=$("#appId").combobox("getValue");
		//获取父权限编号
		var parentId = getParamter("parentId");
		var privilegeCode = $("#privilegeCode").val();
		var flag = false ;
		//校验编号是否合法
		$.ajax({
			type: "POST",
		   	url: rootPath+"jasframework/privilege/privilege/checkPrivilegeCodeExist.do",
	   		data: {"privilegeCode":privilegeCode,"appId":appId},
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
			var validateResault = $('#addPrivilege').form("validate");
			var formData = $("#addPrivilege").serializeToJson();//获取表单中的json,
			formData.appId = appId ;
			formData.parentId = parentId;
			var formStringData = JSON.stringify(formData);
			var url = rootPath+'jasframework/privilege/privilege/save.do';
			$.ajax({
				url: url,//调用新增接口
			    method: "post",
			    contentType: "application/json;charset=utf-8",
			    dataType: "json",
			    data: formStringData,
			    success: function(result){
					if(result.status==1){
						top.showAlert(getLanguageValue("tip"),getLanguageValue("savesuccess"),'info',function(){
							if(parentId){
								reloadchildren('queryPrivilege.htm',parentId,appId,"#tt");
							}else{
								reloadZtree('queryPrivilege.htm');
							}						
							//关闭弹出框
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
		
	function reloadchildren(shortUrl,parentId,appnumber,elementid){
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].src.indexOf(shortUrl) != -1) {
				fra[i].contentWindow.reloadchildren(parentId);
//				var treeObj=fra[i].contentWindow.$(elementid);
//				var node=treeObj.tree("find",nodeid);
//				/***begin tree 当叶子节点变为非叶子节点时，该节点不刷新的问题***/
//				var childrenNode=treeObj.tree("getChildren",node.target);
//				if(childrenNode.length==0){
//					treeObj.tree("append",{parent:node.target,data:[{id:"1",text:"dd"}]});
//				}
//				/***end***/
//				treeObj.tree("options").url=rootPath+'/jasframework/privilege/privilege/getAllChildrenPrivilege.do?eventid='+nodeid+"&appnumber="+appnumber;
//				treeObj.tree("reload",node.target);
			}
		}
		closePrivilege();
	}
	function reloadZtree(shortUrl){
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].src.indexOf(shortUrl) != -1) {
				fra[i].contentWindow.reloadZtree();
			}
		}
		closePrivilege();
	}
	/**
	 * 描述：关闭添加页面
	 */
	function closePrivilege(){
		top.closeDlg("saveiframe");
	}
		
		/**
		 * 描述：扩展校验方法的规则
		 */
	$.extend($.fn.validatebox.defaults.rules, {
		verifyName : {//判断分段逻辑号 是否重复
		validator : function(value) {
		var response = $.ajax({
		url :  "../groupmanagement.do?method=verifyName",
		dataType : "json",
		data : {
		groupname : value
		},
		async : false,
		cache : false,
		type : 'POST'
		}).responseText;
		var b = $.parseJSON(response);
		if(b.space== 9){
			 this.message = getLanguageValue("pri.nameCannotInertSpace");
			 return false;
		}
		if(b.success==5){
			 return true;
		} else{
			 this.message = getLanguageValue("pri.nameIsUsed");
			 return false;
		}
		//return b.success;
		},
		message : null
		}
		});
	
	function onchangmenu(){
		var changtype=$("#privilegeType").combobox("getValue");
		if(changtype==1||"1"==changtype){
			$("#childrenPrivilege").combobox("enable");
			$("#childrenPrivilege").parent().parent().show();
			$("#openType").combobox("enable");
			$("#openType").parent().parent().show();
			$("#openType").combobox("setValue","1");
			$("#iconName").show();
			$("#iconValue").show();
			$("#functionTypeName").hide();
			$("#functionTypeValue").hide();
		}else{
			$("#childrenPrivilege").combobox("disable");
			$("#childrenPrivilege").parent().parent().hide();
			$("#openType").combobox("setText","");
			$("#openType").combobox("setValue","");
			$("#iconName").hide();
			$("#iconValue").hide();
			$("#functionTypeName").show();
			$("#functionTypeValue").show();
		}
	}
	
	