
/**
 * @file
 * @author 作者
 * @desc 查看页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID
var businessId = "";
/**
 * @desc 初始化
 */
$(document).ready(function(){
	getGpsEventById();
	// 加载图片信息
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
	masterTableChildHeight();	// 计算标签内容高度
	businessId = pkfield;
	
	workflow.getWorkflowComments(pkfield,null,function(result){
		if(result.status==-1){
			top.showAlert('警告', '加载审批记录出错，请联系系统管理员！', 'error');
			return;
		}
		var data = result.rows;
		$("#dg").datagrid({
			rownumbers : true,
			pagination : false,
			nowrap:false,
			height : $("#businessInfo").height(),
			columns : [ [ {
				field : 'taskName',
				title : '节点名称',
				width : 120
			}, {
				field : 'approveUserName',
				title : '审批人',
				width : 80,
				align:"center"
			}, {
				field : 'approveTime',
				title : '审批时间',
				width : 200,
				align:"center"
			}, {
				field : 'auditContent',
				title : '审批意见',
				width : 250
			} ] ]
		});
		$("#dg").datagrid("loadData",data);
 	});
});

/**
 * @desc 获得数据
 */
function getGpsEventById(){
	$.ajax({
		url : rootPath+"/gpsevent/getInfo.do",
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
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsEvent");
}

