/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID
var deviceoid=getParamter("deviceoid");	// 绑定的设备id
var deviceCode=getParamter("deviceCode");	// 绑定的设备编号
var insname=getParamter("insname");	// 管道工对应的用户id

var businessId = "";	// 用于附件判断业务ID

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
	var comboxid='';
	var singleDomainName='';	// 单选值域
    var morecomboxid='';
    var moreDomainName='';	// 多选值域
	comboxid+='sex'+',';
	singleDomainName+='inssex'+","
	comboxid+='instype'+',';
	singleDomainName+='worktype'+","
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);

	/* 设备，根据当前用户所在的部门获取到本部门和下级部门所有的设备（gps_device），支持模糊搜索  */
	$('#deviceoid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/gpsinspector/getAllUnitAndSelfDevice.do?type=02&unitId='+user.unitId+'&selfdeviceoid='+deviceoid+'&selfDeviceCode='+deviceCode,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth("deviceoid",0.275,'combobox');
	
	initUnitComboTreeLocal('unitid');
	setComboObjWidth('unitid',0.275,'combobox');
	getGpsInspectorById();
});

/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTreeLocal(unitid){
	/* 以下初始化查询面板 */
	/* 部门 */
	$('#'+unitid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName",
		onSelect : function(row){
			/* 加载人员 */
			initInspection(row.id);
			
			$('#deviceoid').combobox("clear");
			$('#deviceoid').combobox("reload",rootPath+'/gpsinspector/getAllUnitAndSelfDevice.do?type=02&unitId='+user.unitId+'&selfdeviceoid='+deviceoid+'&selfDeviceCode='+deviceCode);
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		
		$('#'+unitid).combotree('loadData', result.data);
	})
    setComboObjWidth(unitid,0.172,'combobox');
}

/**
 * @desc 修改数据-保存
 */
function updateGpsInspector(){
	disableButtion("saveButton");
	var bool=$('#gpsInspectorForm').form('validate');
	
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}

    var formData = $('#gpsInspectorForm').serializeToJson();
	$.ajax({
		url : rootPath+"/gpsinspector/update.do",
		type: "post",
		contentType: "application/json;charset=utf-8",
		async: false,
		dataType: "json",
		data:JSON.stringify(formData),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
				top.showAlert("提示", "更新成功", 'info', function() {
					reloadData("query_gps_inspector.html","#gpsInspectordatagrid");
					closePanel();
				});
			}else if(data.code == "400") {
				top.showAlert("提示", data.msg, 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
}


/**
 * @desc 获得数据
 */
function getGpsInspectorById(){
	$.ajax({
		url : rootPath+"/gpsinspector/get.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}


/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$('#oid').val(jsondata.oid);
	$('#unitid').combotree('setValue',jsondata.unitid);
	$('#sex').combobox('setValue',jsondata.sex);
	
	$('#phone').val(jsondata.phone);

	$('#instype').combobox('setValue',jsondata.instype);
	$('#adddate').val(jsondata.adddate);
	$('#identitycard').val(jsondata.identitycard);
	$('#homeaddress').val(jsondata.homeaddress);
	$('#description').val(jsondata.description);
	$('#inspectortype').val(jsondata.inspectortype);
    $('#deviceoid').combobox('setValue',jsondata.deviceoid);

	/* 获取到巡检对象，巡检对象有可能是不包含分号，也有可能是包含分号的；不包含分号的表示一个，包含分号的表示多个。 */
	if( jsondata.patrolObject != null ) {
        var patrolObjectList = jsondata.patrolObject.split(';')
        //var temp = [];
        for( var m = 0 ; m < patrolObjectList.length ; m++ ) {
            if( patrolObjectList[m] != '' && patrolObjectList[m] != null && patrolObjectList[m] != undefined ) {
               // temp.push(patrolObjectList[m]);
				if( patrolObjectList[m] == '01')
					$("#patrolObject1").prop("checked",true);
				else
					$("#patrolObject2").prop("checked",true);
            }
        }
       // $('#patrolObject').combobox('setValue',temp);
	}

	
/*	 如果又设备 
	if(jsondata.deviceoid!=''&&jsondata.deviceoid!=null){
		 设备编号开始加载自己 
		let array = [];
		let json = {};
		json.codeid = jsondata.deviceoid;
		json.codename = jsondata.deviceCode;
		array.push(json);
		$('#deviceoid').combobox('loadData',array);
		$('#deviceoid').combobox('setValue',jsondata.deviceoid);
	}*/
	
	/* 人员，根据当前用户所在的部门获取到本部门和下级部门所有的人员（pri_user），支持模糊搜索  */
	initInspection(jsondata.unitid);
	
	$('#insname').combobox('setValue',jsondata.insname);
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
						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.275,'combobox');
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
			if(moreDomainNameArr[i]==''){
				continue;
			}
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
						// $('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.275,'combobox');
		}
	}
}

/**
 * @desc 重新加载数据
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
 * @desc 关闭修改页面
 */
function closePanel() {
	top. closeDlg("updateGpsInspector");
}

/**
 * 扩展验证 number
 */
$.extend($.fn.validatebox.defaults.rules, {
    isNumber: {
		validator: function(value,param){
			console.log('验证是否为数字');
			/* 数字正则表达式 */
			let regex = /^-?\d+\.?\d*$/;
			/* 如果最后一位是点，返回false */
			if(value.charAt(value.length-1) == '.'){
				return false;
			}
			return regex.test(value);
		},
		message: '请输入数字。'
    }
});

/**
 * 判断巡检时间是否都是有效时间
 * @returns
 */
function taskTimeisEffective(){
	/* 如果巡检频次是一天N巡才做判断，否则，不做判断。*/
	let insfreq = $('#insfreq').combobox('getValue');
	let m = insfreq.substring(0,1);
	if(m == 1){
		/* 如果1天N巡，但是taskTime没有值，说明用户取消了。提示用户选择具体巡检时间。*/
		if($('#taskTime').val() == ''){
			top.showAlert("提示", "一天N巡需要设置巡检时间，请设置巡检时间！", 'info');
			return false;
		}
	}
	return true;
}

/**
 * 初始化巡检人员
 * @returns
 */
function initInspection(unitId){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#insname').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getUnitUserChildrenForPriUser.do?userId='+insname+'&unitId='+unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth("insname",0.275,'combobox');
	
	$("#insname").css("background-color","#f3f3ef");
}