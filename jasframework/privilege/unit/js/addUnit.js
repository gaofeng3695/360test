//取到父部门id
var eventID =getParamter("parentid");;
//初始化
	$(function(){
		//初始化部门树
		$("#parentId").combotree({
			url: addTokenForUrl(rootPath+'jasframework/privilege/unit/getLeftTree.do')
		});
		$("#pisUserId").combobox({
			url: addTokenForUrl(rootPath+'jasframework/privilege/syncDeptUser/getUserByUnitId.do'),
			valueField:'oid',
		    textField:'userName'
		});
		$("#throughCounties").combotree({
			url: rootPath+'gpsprovincialcity/getLeftTree.do',
			multiple: true,
			onlyLeafCheck: true
		});
		//设置部门初始值
		$('#parentId').combotree('setValue', eventID);
		setComboObjWidth("parentId", 0.3, "combotree");
		setComboObjWidth("unitType", 0.3, "combobox");
		setComboObjWidth("isPatrol", 0.3, "combobox");
		setComboObjWidth("pisUserId", 0.3, "combobox");
		setComboObjWidth("throughCounties", 0.77, "combotree");

		var comboxid='';
		var singleDomainName='';	// 单选值域
		var morecomboxid='';
		var moreDomainName='';	// 多选值域
		comboxid+='isPipeOffice'+',';
		singleDomainName+='isPipeOffice'+","
		loadSelectData(comboxid,singleDomainName);
		loadMoreSelectData(morecomboxid,moreDomainName);
	});
	
	/**
	 * 描述：重新加载数据
	 * @param shortUrl 重新加载数据的页面
	 * @param elementId 权限树的id
	 */
	function reloadData(shortUrl, elementId){
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].src.indexOf(shortUrl) != -1) {
				fra[i].contentWindow.$(elementId).tree("reload");
			}
		}
		closeUnit();
	}
	/**
	 * 描述：保存部门的方法
	 */
	function saveUnit() {
		disableButtion("saveButton");
		var validateResault = $('#addunit').form("validate");
		if(validateResault == false){
//			top.showAlert(getLanguageValue("tip"), getLanguageValue("formVailidateFailed"), 'info');
			top.showAlert(getLanguageValue("tip"), "字段输入有误，不能保存！请重新输入。", 'info');
			enableButtion("saveButton");
			return validateResault;
		}
		//所辖管线途经县市 拆成字符串保存
		var value = $('#throughCounties').combotree('getValues'); //会返回id值的数组,逗号连接
		var param = $('#addunit').serializeToJson();
		if(value != undefined & value.length >0){
			var throughCountiesValues = "";
			for(j = 0,len=value.length; j < len; j++) {
				if ( value[j] != ""){
					throughCountiesValues += value[j];
					throughCountiesValues += ",";
				}
			}
			param.throughCounties = throughCountiesValues;
		}
		 $.ajax({
             type: "POST",
            // url: rootPath + 'jdbc/commonData/unit/save.do',
			 url: rootPath+'jasframework/privilege/unit/save.do',
             contentType: "application/json;charset=utf-8",
             data: JSON.stringify(param),
             success: function (data) {
            	if(data.status==1){
            		 top.showAlert("提示", "保存成功", 'info', function () {
                         reloadData('queryUnit.htm', '#tt');
                     });
     			}else if(data.code == "400") {
     				top.showAlert("提示", "保存失败", 'error');
     				
     			}else{
     				top.showAlert("提示", data.msg, 'info');
     				
     			}
             }
         })
	}
		
	/**
	 * 描述：关闭添加窗口
	 */
	function closeUnit(){
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
			 this.message =getLanguageValue("unit.namecannotspaces");
			 return false;
		}
		if(b.success==5){
			 return true;
		} else{
			 this.message =getLanguageValue('unit.namerepeated');
			 return false;
		}
		},
		message : null
		}
	});
	
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
							$('#'+id).combobox('setValue',data[0].codeId);
						}
					}
				});
				setComboObjWidth(id,0.3,'combobox');
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