
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
	getGpsConstructionById();
	// 加载图片信息
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
	masterTableChildHeight();	// 计算标签内容高度
	businessId = pkfield;
	/*workflow.getApproveHistory(businessId,function(result){
		$("#dg").datagrid( {
			nowrap : false,
			pagination : false,
			rowStyler: function(index,row){
				if(row.status==1){
					$('#datagrid-row-r1-2-'+index+' .datagrid-cell-c1-taskName').css({"color":"#FF3399","font-weight":"bold"});
					$('#datagrid-row-r1-2-'+index+' .datagrid-cell-c1-approveUserName').css({"color":"#FF3399","font-weight":"bold"});
					$('#datagrid-row-r1-2-'+index+' .datagrid-cell-c1-endTime').css({"color":"#FF3399","font-weight":"bold"});
					$('#datagrid-row-r1-2-'+index+' .datagrid-cell-c1-auditContent').css({"color":"#FF3399","font-weight":"bold"});
					return '';
				}
			},
			columns : [ [ {
				field : 'taskName',
				title : '节点名称',
				width : 100,
				sortable : true
			}, {
				field : 'approveUserName',
				title : '审批人',
				width : 80,
				sortable : true	
			}, {
				field : 'endTime',
				title : '审批时间',
				width : 130,
				sortable : true
			}, {
				field : 'auditContent',
				title : '审批意见',
				width : 240
			} ] ]
		});
		$("#dg").datagrid("loadData",result);
	 });*/
	
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
function getGpsConstructionById(){
	$.ajax({
		url : rootPath+"/gpsconstruction/getInfo.do",
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
	$("#unitidname").html(jsondata.unitidname);
	$("#lineloopoidname").html(jsondata.lineloopoidname);
	$("#location").html(jsondata.location);
	$("#stakenumname").html(jsondata.stakenumname);
	$("#lon").html(jsondata.lon);
	$("#lat").html(jsondata.lat);
	$("#happenbegindate").html(jsondata.happenbegindate);
	$("#constructunit").html(jsondata.constructunit);
	$("#constructunituser").html(jsondata.constructunituser);
	$("#constructdescr").html(jsondata.constructdescr);
	$("#distanceline").html(jsondata.distanceline);
	$("#riskratingCodeName").html(jsondata.riskratingCodeName);
	$("#progressidCodeName").html(jsondata.progressidCodeName);
	$("#riskdescr").html(jsondata.riskdescr);
	$("#stationuser").html(jsondata.stationuser);
	$("#inspectoroidname").html(jsondata.inspectoroidname);
	$("#inspectorphone").html(jsondata.inspectorphone);
	$("#descr").html(jsondata.descr);
	$('#temporarykeypointoidname').html(jsondata.temporarykeypointoidname);
	$('#projectname').html(jsondata.projectname);
	$('#constructreason').html(jsondata.constructreason);
	$('#offset').html(jsondata.offset);
	$('#pointstation').html(jsondata.pointstation);

	$('#ownerUnitName').html(jsondata.ownerUnitName);
	$('#ownerContacts').html(jsondata.ownerContacts);
	$('#ownerContactsPhone').html(jsondata.ownerContactsPhone);
	$('#measures').html(jsondata.measures);
	$('#estimateEndDate').html(jsondata.estimateEndDate);
	$('#companyContacts').html(jsondata.companyContacts);
	$('#companyContactsPhone').html(jsondata.companyContactsPhone);
	$('#stationLeading').html(jsondata.stationLeading);
	$('#stationLeadingPhone').html(jsondata.stationLeadingPhone);
	$('#isProhibitedItems').html(jsondata.isProhibitedItemsName);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsConstruction");
}

