
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	//初始化部门
	initUnitComboTree('unitid');
	//初始化管线
	initLineLoopCombobox('lineloopoid');
	showPan('beginlocation','endlocation','beginstation','endstation');
});


/**
 * @desc 添加数据-保存
 */
function saveGpsUnsubinspection(){
	disableButtion("saveButton");
	var bool=$("#gpsUnsubinspectionForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpsunsubinspection/add.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsUnsubinspectionForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("query_gps_unsubinspection.html","#gpsUnsubinspectiondatagrid");
					closePanel();
				});
			}else{
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
	return businessId;
}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsUnsubinspection");
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
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				url : rootPath+"/jasframework/sysdoman/getsysdoman.do?domainname="+singleDomainNameArr[i],
				valueField : 'codeid',
				textField : 'codename',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeid);
					$('#'+id+'ID').val(row.codename);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						$('#'+id).combobox('setValue',data[0].codeid);
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
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				multiple:true,
				url : rootPath+"/jasframework/sysdoman/getsysdoman.do?domainname="+moreDomainNameArr[i],
				valueField : 'codeid',
				textField : 'codename',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeid);
					$('#'+id+'ID').val(row.codename);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						$('#' + id).combobox('setValue',data[0].codeid);
					}
				}
			});
			setComboObjWidth(id,0.281,'combobox');
		}
	}
}

