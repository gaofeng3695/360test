/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID

var businessId = "";	// 用于附件判断业务ID

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
	var comboxid='status,condition,devtype,';
	var singleDomainName='devicestatus,devicecondition,devicetype,';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	getGpsDeviceById();
	
	var user = JSON.parse(sessionStorage.user);
	var userArray = [];
	userArray.push(user);
	/* 部门 */
	$('#unitid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "unitId",
		textField : "unitName",
	});
	setComboObjWidth("unitid",0.270,'combobox');
	/* 初始化combobox */
	$('#unitid').combobox('loadData', userArray);
	/* 初始化值 */
	$('#unitid').combobox('setValue', user.unitId);
	
	getFileListInfo(pkfield, "update", {
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:2,  // 上传文件的个数 不传默认值为200
	},"1"); // 获取文件信息
	getPicListInfo(pkfield, "update", "", {
		//url : rootPath+"/attachment/upload.do",
		moduleCode:"devicemanage", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:2,  // 上传文件的个数 不传默认值为200
		extensions:"png", // 默认"gif,jpg,jpeg,bmp,png"
	},"2");
});


/**
 * @desc 上传图片执行成功之后上传附件
 */
function updatePicSuccessFun(){
	updateFileFun(updateSuccessFun);
}

/**
 * @desc 上传附件执行成功之后上传图片
 */
function  updateFileSuccessFun(){
	updatePicFun(updateSuccessFun);
}

/**
 * @desc 修改成功之后执行的函数
 */
function updateSuccessFun(){
	top.showAlert("提示", "更新成功", 'info', function() {
		//关闭弹出框
		reloadData("query_gps_device.html","#gpsDevicedatagrid");
	    closePanel();
	});
}

/**
 * @desc 修改数据-保存
 */
function updateGpsDevice(){
	disableButtion("saveButton");
	var bool=$('#gpsDeviceForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpsdevice/update.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsDeviceForm').serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
	    		updateFileFun(updateFileSuccessFun);  // 先上传附件 后上传图片
			}else if(data.code == "400") {
				top.showAlert("提示", "更新失败", 'error');
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
function getGpsDeviceById(){
	$.ajax({
		url : rootPath+"/gpsdevice/get.do",
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
	$('#unitid').val(jsondata.unitid);
	$('#status').combobox('setValue', jsondata.status);
	$('#condition').combobox('setValue', jsondata.condition);
	$('#devname').val(jsondata.devname);
	$('#devcode').val(jsondata.devcode);
	$('#devtype').combobox('setValue', jsondata.devtype);
	$('#sim').val(jsondata.sim);
	$('#releasedate').val(jsondata.releasedate);
	$('#ewarrantydate').val(jsondata.ewarrantydate);
	$('#manufacturer').val(jsondata.manufacturer);
	$('#description').val(jsondata.description);
	$('#approvalStatus').val(jsondata.approvalStatus);
	
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
			setComboObjWidth(id,0.270,'combobox');
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
			setComboObjWidth(id,0.29,'combobox');
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
	top. closeDlg("updateGpsDevice");
}


