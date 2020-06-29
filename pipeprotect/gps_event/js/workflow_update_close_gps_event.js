
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var businessId;    // 附件上传业务ID
var oid=getParamter("oid");// 业务数据ID
//当前登陆用户
var user = JSON.parse(sessionStorage.user);
var eventoid="";

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
	
	getGpsEventCloseById();
	
	
});
function getGpsEventCloseById(){
	$.ajax({
		url : rootPath+"/gpseventclose/get.do",
		data :{"oid" : oid},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				eventoid = data.data.eventoid;
				getGpsEventById();
				var jsondata = data.data;
				$('#oid').val(jsondata.oid);
				$('#closestartperson').val(user.oid);
				$('#closestartpersonname').val(user.userName);
				$('#solvingdate').val(jsondata.solvingdate);
				$('#solvingdescribe').val(jsondata.solvingdescribe);
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
 * @desc 获得数据
 */
function getGpsEventById(){
	$.ajax({
		url : rootPath+"/gpsevent/getInfo.do",
		data :{"oid" : eventoid},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
				getPicListInfo(eventoid, "view");  // 不带描述信息  图片
				getFileListInfo(eventoid, "view"); // 附件信息
				masterTableChildHeight();	// 计算标签内容高度
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
	$("#unitid").html(jsondata.unitidname);
	$("#reportperson").html(jsondata.reportpersonname);
	$("#lineloopoid").html(jsondata.lineloopoidname);
	$("#occurrencetime").html(jsondata.occurrencetime);
	$("#occurrencesite").html(jsondata.occurrencesite);
	$("#eventtypeCodeName").html(jsondata.eventtypeCodeName);
	$("#lon").html(jsondata.lon);
	$("#lat").html(jsondata.lat);
	$("#keypointname").html(jsondata.keypointnamename);
	$("#describe").html(jsondata.describe);
//	$("#solution").html(jsondata.solution);
	$("#guardian").html(jsondata.guardianname);
	if(jsondata.eventtype == '06'){
		var rs = '<th width="15%"><span>第三方施工项目名称</span></th>\
			<td width="35%"><span id="constructionid"></span></td>';
		$('#constructionTr').append(rs);
		$("#constructionid").html(jsondata.constructionidname);
	}else{
		var rs = '<td width="15%"></td><td width="35%"></td>';
		$('#constructionTr').append(rs);
	}
}


/**
 * @desc 保存基本信息获取业务id
 */
//function saveBaseInfo(){
//	var  bID = null;
//	if(isNull(businessId)){
//		bID = saveGpsEventClose();  // sava()保存基本信息函数，返回业务id
//	}else{
//		bID = businessId;
//	}
//	return bID;
//}
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
 * @desc 添加数据-保存
 */
function updateGpsEventClose(){
	disableButtion("saveButton");
	var bool=$("#gpsEventCloseForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpseventclose/update.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsEventCloseForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
				pkfield=data.data;
				updateFileFun(updateFileSuccessFun);  // 先上传附件 后上传图片
			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
	
		return businessId;    // 附件上传业务ID

}
/**
 * @desc 修改成功之后执行的函数
 */
function updateSuccessFun(){
	parent.approve();
}

function saveAndApprove(){
	updateGpsEventClose();
}

/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("updateGpsEventClose");
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
					initConstructionHTML(row.codeId);
					$(".validatebox-readonly").css("background-color","#f3f3ef");
				},
				onLoadSuccess:function(data){
					if(data.length>0){
//						$('#'+id).combobox('setValue',data[0].codeId);
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
//						$('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.270,'combobox');
		}
	}
}


