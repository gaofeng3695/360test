
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
//当前登陆用户
var user = JSON.parse(sessionStorage.user);
//获取当前日期
var nowDate = "";
//当前查看的报表级别
var hlevel=1;
//当前部门查看的部门id
var viewunitid=user.unitId;
//记录分公司级部门id
var twoLevelUnitid="";
//记录分公司级部门名称
var twoLevelUnitname="";
//记录是否点击下一级
var nlevel="";
//记录场站级别报表还是人员报表 1场站分公司、3人员
var isinslevel="1";
//巡检人员类型
var inspectortype="01";

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
//	$('#statisticsdate').val(nowDate);
	//设置查询条件
	querySerialize={hlevel:hlevel,statisticsdate:nowDate,inspectortype:inspectortype};
	$('#statisticsUnit').html('<span>'+user.unitName+'</span>');
	//加载一级报表
	initOneDatagrid();
	//页面自适应
	onresize();
	$(window).bind("resize", function () {
		onresize();
     });
	
	/* 以下初始化查询面板 */
	initUnitComboTree('unitid');
});

function initOneDatagrid(){
	$('#gpsofflineinfodatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsdevofflinewarninginfo/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		singleSelect:true,
		pagination:false,
		queryParams:querySerialize,
		frozenColumns:[[
			{	
				field:"unitName",
				title:"部门名称",
				width:"300",
				resizable:true,
				sortable:true,
				align:'center',
				formatter: function(value,row,index){
					//小于3为分公司级别
					if(row.unitLevel < 3){
						var opt = '<p class="table-operate"><a href="#" title = "" onclick="nextLevel(\'' + row.unitid+'\',\'' + row.unitName+'\')">\
						<span>'+value+'</span>\
						</a></p>';
						return opt;
					}else{
						var opt = '<p class="table-operate"><a href="#" title = "" onclick="viewIns(\'' + row.unitid+'\',\'' + row.unitName+'\')">\
						<span>'+value+'</span>\
						</a></p>';
						return opt;
					}
				}
			},{	
				field:"devOfflineNum",
				title:"设备离线预警数量",
				width:"300",
				resizable:true,
				align:'center'
			}
		]],
		onDblClickRow:function(index,indexData){
		},
		onLoadSuccess:function(data){
	    	$('#gpsofflineinfodatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
}

function onresize(){
	var containerWidth = $(window).width();
	var containerHeight = $(window).height();
	
	$('#gpsofflineinfodatagrid').datagrid('resize', {
		width : containerWidth,
		height: containerHeight - 62
	});
	
}
/**
 * 打开一级报表
 */
function nextLevelone(){
	$('#statisticForm').show();
	viewunitid=user.unitId;
	hlevel = 1;
	isinslevel = "1";
	nlevel="";
	querySerialize={hlevel:hlevel,statisticsdate:nowDate,unitid:user.unitId,inspectortype:inspectortype};
	//加载一级报表
	initOneDatagrid();
	$('#statisticsUnit').html('<span>'+user.unitName+'</span>');
}

/**
 * 打开二级报表
 */
function nextLevel(unitid,unitname){
	$('#statisticForm').show();
	isinslevel = "1";
	viewunitid=unitid;
	hlevel = 2;
	//记录分公司级部门id
	twoLevelUnitid=unitid;
	//记录分公司级部门名称
	twoLevelUnitname=unitname;
	nlevel = "1";
	querySerialize={hlevel:hlevel,unitid:unitid,statisticsdate:nowDate,nextLevel:nlevel,inspectortype:inspectortype};
	initOneDatagrid();
	$('#statisticsUnit').html('<a href="#" onclick="nextLevelone()">'+user.unitName+'</a>'+' > <span>'+unitname+'</span>');
}

/**
 * 打开人员统计报表
 */
function viewIns(unitid,unitname){
//	$('#statisticForm').hide();
	isinslevel="2";
	if(twoLevelUnitid != "" && twoLevelUnitname != null){
		$('#statisticsUnit').html('<a href="#" onclick="nextLevelone()">'+user.unitName+'</a>  > <a href="#" onclick="nextLevel(\'' + twoLevelUnitid+'\',\'' + twoLevelUnitname +'\')">'+twoLevelUnitname+'</a> > <span>'+unitname+'</span>');
	}else{
		$('#statisticsUnit').html('<a href="#" onclick="nextLevelone()">'+user.unitName+'</a>  > <span>'+unitname+'</span>');
	}
	//记录分公司级部门id
	viewunitid=unitid;
	querySerialize={unitid:unitid,statisticsdate:nowDate,inspectortype:inspectortype};
	initInsDatagrid();
}

/**
 * 人员统计
 * @returns
 */
function initInsDatagrid(){
	$('#gpsofflineinfodatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsdevofflinewarninginfo/getInsPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		singleSelect:true,
		pagination:false,
		queryParams:querySerialize,
		frozenColumns:[[
			{	
				field:"unitname",
				title:"部门名称",
				width:"100",
				resizable:true,
				align:'center'
			},{	
				field:"inspectorName",
				title:"巡检人员",
				width:"100",
				resizable:true,
				align:'center'
			},
			 {	
				field:"locationdate",
				title:"最后一次坐标传回时间",
				width:"200",
				resizable:true,
				align:'center'
			}
			]],
				onDblClickRow:function(index,indexData){
				},
				onLoadSuccess:function(data){
					$('#gpsofflineinfodatagrid').datagrid('clearSelections'); //clear selected options
				}
	});
	
}

/**
 * 查看任务关键点
 * @returns
 */
function viewTaskNum(inspectorid){
	top.getDlg("view_task_keypoint.html?inspectorid="+inspectorid,"viewTaskNum","漏巡关键点",900,600,false,true,true);
}

/**
 * 查看临时关键点
 * @returns
 */
function viewTemporaryNum(inspectorid){
	top.getDlg("view_temporary_keypoint.html?inspectorid="+inspectorid,"viewTemporaryNum","漏巡临时关键点",900,600,false,true,true);
}


