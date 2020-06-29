
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

/* 获取用户信息 */
var user = JSON.parse(sessionStorage.user);

/* 当前巡检频次的值 */
var insfreqValue = '';
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
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
	
	/* 人员，根据当前用户所在的部门获取到本部门和下级部门所有的人员（pri_user），支持模糊搜索  */
	initInspection(user.unitId);
	
	/* 设备，根据当前用户所在的部门获取到本部门和下级部门所有的设备（gps_device），支持模糊搜索  */
	$('#deviceoid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/gpsinspector/getAllUnitUserChildrenForDevice.do?type=02&unitId='+user.unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth("deviceoid",0.275,'combobox');
	
	initUnitComboTreeLocal('unitid');
	setComboObjWidth('unitid',0.275,'combobox');
	
	/* 初始化部门 */
	$('#unitid').combotree('setValue',user.unitId);


});


/**
 * @desc 添加数据-保存
 */
function saveGpsInspector(){
	console.log("按钮禁用前"+new Date().getMilliseconds());
	disableButtion("saveButton");
	console.log("按钮禁用"+new Date().getMilliseconds());
	var bool=$("#gpsInspectorForm").form('validate');
	
	/* 判断巡检时间是否在有效起始时间和有效终止日期之间 */
	/*if(!taskTimeisEffective()){
		enableButtion("saveButton");
		return false;
	}*/
	
	if(bool==false){
		enableButtion("saveButton");
		console.log("按钮禁用后"+new Date().getMilliseconds());
		return bool;
	}
	/* 最后判断是否是一天N巡，不是就给taskTime赋值 */
	/*let insfreq = $('#insfreq').combobox('getValue');
	let m = insfreq.substring(0,1);
	 日巡 01 ，夜巡 02
	let instype = $('#instype').combobox('getValue');
	if(m != 1){
		if( instype == '01' )
			$('#taskTime').val('[{\"startTime\" : \"06:00:00\",\"endTime\": \"20:00:00\"}]');
		else
			$('#taskTime').val('[{\"startTime\" : \"20:00:00\",\"endTime\": \"06:00:00\"}]');
	}*/

    var formData = $('#gpsInspectorForm').serializeToJson();
    if($('#gpsInspectorForm').serializeToJson().patrolObject == undefined) {
		enableButtion("saveButton");
		top.showAlert("提示", "巡检对象不能为空", 'info');
		return false;
	}
    /* 判断多选框中是选中的一个还是多个。 */
    if( typeof $('#gpsInspectorForm').serializeToJson().patrolObject == 'string' ) {
		formData.patrolObject = $('#gpsInspectorForm').serializeToJson().patrolObject + ';';
    } else if (typeof $('#gpsInspectorForm').serializeToJson().patrolObject == 'object') {
        var temp = "";
        for( var k = 0 ; k < formData.patrolObject.length ; k++ ) {
            if( formData.patrolObject[k] != '' && formData.patrolObject[k] != null && formData.patrolObject[k] != undefined ) {
                temp += formData.patrolObject[k] + ";";
            }
        }
        formData.patrolObject = temp;
    }

	$.ajax({
		url : rootPath+"/gpsinspector/save.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify(formData),
		success: function(data){
			if(data.status==1){
				top.showAlert("提示", "保存成功", 'info', function() {
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
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsInspector");
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
					$(".validatebox-readonly").css("background-color","#f3f3ef");
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						if(data[0].domainName == 'inssex'){
							$('#sex').combobox('setValue','01');
						}
						if(data[0].domainName == 'worktype'){
							$('#instype').combobox('setValue','01');
						}

						//$('#'+id).combobox('setValue',data[0].codeId);
						
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
			setComboObjWidth(id,0.275,'combobox');
		}
	}
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
			$('#deviceoid').combobox("reload",rootPath+'/gpsinspector/getAllUnitUserChildrenForDevice.do?type=02&unitId='+row.id);
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		
		$('#'+unitid).combotree('loadData', result.data);
	})
    setComboObjWidth(unitid,0.172,'combobox');
}

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
		url : rootPath+'/xncommon/getUnitUserChildrenForPriUser.do?unitId='+unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth("insname",0.275,'combobox');
}