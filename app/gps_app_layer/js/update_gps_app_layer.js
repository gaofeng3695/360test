/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID

/**
 * @desc 修改数据-保存
 */
function updateGpsAppLayer(){
	disableButtion("saveButton");
	var bool=$('#gpsAppLayerForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpsAppLayer/update.do",
		type: "post",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsAppLayerForm').serializeToJson()),
		success: function(data){
			if(data.status==1){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("query_gps_app_layer.html","#gpsAppLayerdatagrid");
					closePanel();
				});
			}else if(data.code == "1") {
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}		
		}
	});
}

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	initUnitComboTree('unitid');
	setComboObjWidth('unitid',0.29,'combobox');
	getGpsAppLayerById();
	
});

/**
 * @desc 加载新增，修改下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param singeleDomainName 值域名称，以逗号隔开
 */
function loadSelectData(comboxid,singleDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select =comboxid.split(",");
		var singleDomainNameArr = singleDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				url : rootPath+"/jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
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
 * 加载非值域设计的下拉框数据
 * @param comboxid 下拉框ID
 * @param url 请求后台的URL
 * @returns
 */
function loadSelectDataNotDomain(comboxid,url,valueField,textField){
	$('#' + comboxid).combobox({
		panelHeight:100,
		editable:true,
		url : url,
		valueField : valueField,
		textField : textField,
		onSelect : function(row){
		},
		onLoadSuccess : function(){
			$('#'+comboxid).combobox("validate");
		},
		mode:'remote'
	});
	setComboObjWidth(comboxid,0.275,'combobox');
}

/**
 * @desc 获得数据
 */
function getGpsAppLayerById(){
	$.ajax({
		url : rootPath+"/gpsAppLayer/get.do",
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
 * @desc 加载新增，修改多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select =comboxid.split(",");
		var moreDomainNameArr = moreDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				multiple:true,
				url : rootPath+"/jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
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
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$('#oid').val(jsondata.oid);
	$("#layerName").val(jsondata.layerName);
	$("#layerAddress").val(jsondata.layerAddress);
	$("#layerSize").val(jsondata.layerSize);
	$("#unitid").combotree("setValue",jsondata.unitid);
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
	top. closeDlg("updateGpsAppLayer");
}


