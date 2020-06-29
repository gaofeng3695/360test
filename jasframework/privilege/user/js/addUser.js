

$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='userPost'+',';
	singleDomainName+='userpost'+","
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
});

	/**
	 * @desc 新增用户
	 */
	function save(){
		//获取部门ID
		disableButtion("saveButton");
		var validateResault = $('#userForm').form("validate");
		if(validateResault == false){
//			top.showAlert(getLanguageValue("tip"), getLanguageValue("formVailidateFailed"), 'info');
			top.showAlert(getLanguageValue("tip"), "字段输入有误，不能保存！请重新输入。", 'info');
			enableButtion("saveButton");
			return validateResault;
		}
		var unitId =getParamter("unitId");
		var formData = $("#userForm").serializeToJson();
		formData.unitId=unitId;
		$.ajax({
			url: rootPath+"jdbc/commonData/user/save.do",//调用新增接口
		    method: "post",
		    contentType: "application/json;charset=utf-8",
		    dataType: "json",
		    data:JSON.stringify(formData),//获取表单中的json,
		    success: function(data){
				if(data.status==1){
					top.showAlert(getLanguageValue("tip"), getLanguageValue("savesuccess"), 'info', function() {
						//关闭弹出框
						reloadData('queryUser.htm','#10060201');
					    closePanel();
					});
				} else {
					//alert(JSON.stringify(data));
					top.showAlert(getLanguageValue("tip"), data.msg, 'error');
					enableButtion("saveButton");
				}
		    }
		 });
	}
	
	/**
	 * @desc 关闭添加页面
	 */
	function closePanel(){
		top.closeDlg("addUserIframe");
	}
	
	
	/**
	 * @desc 加载新增，修改单选下拉列表框
	 * @param comboxid 下拉列表框的id，以逗号隔开
	 * @param singleDomainName 值域名称，以逗号隔开
	 */
	function loadSelectData(comboxid,singleDomainName){
		if(comboxid!='' && comboxid !=undefined){
			var select = comboxid.split(",");
			var singleDomainNameArr = singleDomainName.split(",");
			for(var i=0;i<select.length-1;i++){
				if(singleDomainNameArr[i]==''){
					continue;
				}
				var id=select[i];
				$('#' + id).combobox({
					panelHeight:100,
					url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
					valueField : 'codeId',
					textField : 'codeName',
					onSelect : function(row){
						//保存个性表单的值域value值
						$('#'+id).val(row.codeId);
						$('#'+id+'ID').val(row.codeName);
					},
					onLoadSuccess:function(data){
						if(data.length>0){
//							$('#'+id).combobox('setValue',data[0].codeId);
						}
					}
				});
				setComboObjWidth(id,0.29,'combobox');
			}
		}
	}

	/**
	 * @desc 加载新增，修改多选选下拉列表框
	 * @param comboxid 下拉列表框的id，以逗号隔开
	 * @param moreDomainName 值域名称，以逗号隔开
	 */
	function loadMoreSelectData(comboxid,moreDomainName){
		if(comboxid!='' && comboxid !=undefined){
			var select = comboxid.split(",");
			var moreDomainNameArr = moreDomainName.split(",");
			for(var i=0;i<select.length-1;i++){
				var id=select[i];
				$('#' + id).combobox({
					panelHeight:100,
					multiple:true,
					url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
					valueField : 'codeId',
					textField : 'codeName',
					onSelect : function(row){
						//保存个性表单的值域value值
						$('#'+id).val(row.codeId);
						$('#'+id+'ID').val(row.codeName);
					},
					onLoadSuccess:function(data){
						if(data.length>0){
							$('#' + id).combobox('setValue',data[0].codeId);
						}
					}
				});
				setComboObjWidth(id,0.29,'combobox');
			}
		}
	}

