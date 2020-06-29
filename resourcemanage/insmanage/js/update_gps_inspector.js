/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID

var upunitid=getParamter("unitid");	// 部门id

var initDevComboData=[];

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
	comboxid+='insfreq'+',';
	singleDomainName+='temporarykeypointtime'+",";
	/*comboxid+='instype'+',';
	singleDomainName+='worktype'+","*/
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	initUnitComboTreeLocal('unitid');
	setComboObjWidth('unitid',0.281,'combobox');
	
	/* 设备，根据当前用户所在的部门获取到本部门和下级部门所有的设备（gps_device），支持模糊搜索  */
	$('#deviceoid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/gpsinspector/getAllUnitUserChildrenForDevice.do?type=01&unitId='+upunitid,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		},
		onLoadSuccess:function(comdata){
			initDevComboData = comdata;
		}
	});
	setComboObjWidth("deviceoid",0.281,'combobox');
	
	getGpsInspectorById();
	
});

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
	$.ajax({
		url : rootPath+"/gpsinspector/update.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsInspectorForm').serializeToJson()),
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
	$('#insname').val(jsondata.insname);
	$('#sex').combobox('setValue',jsondata.sex);
	$('#phone').val(jsondata.phone);
//	$('#deviceoid').val(jsondata.deviceoid);
	// $('#instype').combobox('setValue',jsondata.instype);
	$('#adddate').val(jsondata.adddate);
	$('#identitycard').val(jsondata.identitycard);
	$('#homeaddress').val(jsondata.homeaddress);
	$('#description').val(jsondata.description);
	$('#deviceoid').combobox('setValue',jsondata.deviceoid);
	
	/* 如果又设备 */
	if(jsondata.deviceoid!=''&&jsondata.deviceoid!=null){
		/* 设备编号开始加载自己 */
		let json = {};
		json.codeid = jsondata.deviceoid;
		json.codename = jsondata.deviceCode;
		initDevComboData.push(json);
		$('#deviceoid').combobox('loadData',initDevComboData);
		$('#deviceoid').combobox('setValue',jsondata.deviceoid);
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
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.281,'combobox');
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
						$('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.281,'combobox');
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
			/* 加载设备 */
			$('#deviceoid').combobox("clear");
			$('#deviceoid').combobox("reload",rootPath+'/gpsinspector/getAllUnitUserChildrenForDevice.do?type=01&unitId='+row.id);
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){

		$('#'+unitid).combotree('loadData', result.data);
	})
    setComboObjWidth(unitid,0.172,'combobox');
}
