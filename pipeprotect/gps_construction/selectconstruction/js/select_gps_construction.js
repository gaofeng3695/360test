
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
var unitid=getParamter("unitid");
var constructionid=getParamter("constructionid");

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsConstructiondatagrid').datagrid({
		idField:'coid',
		url: rootPath+"/gpsconstructionselect/getPage.do?unitid="+unitid+"&constructionid="+constructionid,
		collapsible:true,
		autoRowHeight: false,
		singleSelect:false,
		remoteSort:true,
		frozenColumns:[[
            {	
				field:"infoapprovestatusname",
	    		title:"审核状态",
	    		width:"125",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
            {	
				field:"unitidname",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{	
				field:"lineloopoidname",
	    		title:"管线名称",
	    		width:"100",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	}
		]], 
		columns: 
		[[
			{	
				field:"projectname",
	    		title:"项目名称",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"distanceline",
	    		title:"距离管线长度(m)",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"riskratingCodeName",
	    		title:"风险等级",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"changedistanceline",
	    		title:"距离管线长度(变更)",
	    		width:"120",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"changeriskratingCodeName",
	    		title:"风险等级(变更)",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"constructreasonname",
	    		title:"施工原因",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},
			/*{	
				field:"location",
	    		title:"施工地点",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"stakenumname",
	    		title:"桩号",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"lon",
	    		title:"位置经度",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"lat",
	    		title:"位置纬度",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/

			{	
				field:"happenbegindate",
	    		title:"施工开始日期",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"closedate",
	    		title:"施工关闭日期",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			/*{	
				field:"constructunit",
	    		title:"建设（施工）单位名称",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"constructunituser",
	    		title:"建设（施工）单位联系人及联系方式",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

	    	{	
				field:"temporarykeypointoidname",
	    		title:"临时关键点",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},
	    	
			{	
				field:"progressidCodeName",
	    		title:"工程进展",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/

			{	
				field:"stationuser",
	    		title:"输油站现场负责人及其电话",
	    		width:"160",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"inspectoroidname",
	    		title:"现场监护人员",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{
				field:"inspectorphone",
	    		title:"巡检人员联系方式",
	    		width:"120",
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			confirm(indexData.coid, indexData.projectname, indexData.happenbegindate);
		},
		onClickRow:function(index,indexData){
			var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
			if(rows.length > 1){
				disableButtion("confirm");
			}else{
				enableButtion("confirm");
			}
		},
		onLoadSuccess:function(data){
	    	$('#gpsConstructiondatagrid').datagrid('clearSelections'); //clear selected options
	    	if(constructionid != null && constructionid != ""){
	    		$('#gpsConstructiondatagrid').datagrid('selectRow', 0);
	    	}
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsConstructiondatagrid','','0');
});

function confirm(coid, projectname, happenbegindate){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(coid)){
		dataId = coid;
	}else if (rows.length == 1){
		dataId = rows[0].coid;
		projectname = rows[0].projectname;
		happenbegindate = rows[0].happenbegindate;
	}else if (rows.length == 0){
		dataId = '';
		projectname = '';
		happenbegindate = '';
	}else if (rows.length > 1){
		top.showAlert("提示", "最多只能选择一条第三方施工信息！", 'info');
		return;
	}
	//回传第三方施工信息至事件上报父页面
	let fra = parent.$("iframe");
	for ( let i = 0; i < fra.length; i++) {
		if (fra[i].id == 'iframe_addGpsEvent' || fra[i].id == 'iframe_updateGpsEvent') {
			fra[i].contentWindow.selectconstructcallback(dataId, projectname, happenbegindate);
			break;
		}
	}
	closePanel();
}


/**
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].coid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_close_gps_construction.html?oid="+dataId,"viewCloseGpsConstruction","详细",900,650,false,true,true);
}

/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("selectGpsConstruction");
}

/**
 * @desc 初始化datagrid的高度，datagrid高度自适应处理
 * 
 * @param datagridObjId datagrid的id
 * @param queryPanelObjId 查群面板的id 如果没有查询面板 则改id赋值为''
 * @param queryPanelH 查询区域的高度，如果没有查询区域，则改值赋值为'0'
 * @param containerDivId table的父html标签id
 */
function initDatagrigHeight(datagridObjId, queryPanelObjId, queryPanelH, containerDivId) {
	datagridId = datagridObjId;
	queryPanelId = queryPanelObjId;
	queryPanelHeight = parseInt(queryPanelH);
	containerId = containerDivId;
	try {
		var containerHeight = $(window).height()-$('.button-area').height();
		var containerWidth = $(window).width();
		
		if (containerId && containerId != '') {
			containerHeight = $("#" + containerId).height();
			containerWidth = $("#" + containerId).width();
		}
		
		if (queryPanelId && queryPanelId != '') {
			$('#' + queryPanelId).panel({
				onOpen:changeDatagrigHeight,
				onExpand : function() {
					changeDatagrigHeight();
				},
				onCollapse : function() {
					changeDatagrigHeight();
				}
			});
		} else {
			setTimeout(function(){
				$('#' + datagridId).datagrid('resize', {
					width : containerWidth,
					height : containerHeight
				});
			},500)
		}
	
		document.body.onresize = changeDatagrigHeight;// 只能用js原生的方法，不能使用jquery的resize方法：$('body').bind('resize',function(){})
	} catch (e) {
	}
}
