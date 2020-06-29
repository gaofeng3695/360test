
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
    initPlanInfoData();
	getGpsInsrangeById();
	initKeyPoingData();

	
});
//初始化计划列表
function initPlanInfoData(){
	$('#gpsPlanInfodatagrid').datagrid({
		idField:'oid',
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
        fitColumns: true,
		frozenColumns:[[
		]],
		columns: 
		[[
			{	
				field:"code",
	    		title:"巡检计划编号",
	    		width:$(this).width() * 0.33,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"startTime",
	    		title:"计划开始时间",
	    		width:$(this).width() * 0.33,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"insedate",
	    		title:"计划结束时间",
	    		width:$(this).width() * 0.33,
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("../../gps_plan_info/view_gps_plan_info.html?oid="+indexData.pid,"viewGpsPlanInfo","计划详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsPlanInfodatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
}

//初始化关键点列表
function initKeyPoingData(){
	$('#gpsKeypointdatagrid').datagrid({
		idField:'oid',
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
        fitColumns: true,
		frozenColumns:[[
		]],
		columns: 
		[[
			{	
				field:"pointname",
	    		title:"关键点名称",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	},
			{	
				field:"pointstation",
	    		title:"关键点里程（m）",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"pointposition",
	    		title:"位置描述",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"effectivebegindate",
	    		title:"有效起始日期",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"effectiveenddate",
	    		title:"有效终止日期",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"buffer",
	    		title:"缓冲范围",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("../../pathLine/keypoint/view_gps_keypoint.html?oid="+indexData.oid,"viewGpsKeypoint","关键点详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsKeypointdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
}

/**
 * @desc 获得数据
 */
function getGpsInsrangeById(){
	$.ajax({
		url : rootPath+"/gpsinsrange/get.do",
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
	$("#beginstation").html(jsondata.beginstation);
	$("#endstation").html(jsondata.endstation);
	$("#lineloopoid").html(jsondata.lineloopoName);
	$("#beginlocation").html(jsondata.beginlocation);
	$("#endlocation").html(jsondata.endlocation);
	$("#unitid").html(jsondata.unitname);
	$("#inspectorid").html(jsondata.inspectorName);
	$("#instypeCodeName").html(jsondata.instypeCodeName);
	
	$("#beginkeypoint").html(jsondata.beginkeypointName);
	$("#endkeypoint").html(jsondata.endkeypointName);
	$("#beginkeypointStation").html(jsondata.beginkeypointStation);
	$("#endkeypointStation").html(jsondata.endkeypointStation);
	
	queryKeyPoint(jsondata.unitid,jsondata.lineloopoid,jsondata.beginstation,jsondata.endstation,jsondata.inspectorid,jsondata.oid);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsInsrange");
}


function queryKeyPoint(unitId,lineloopoId,qbeginstation,qendstation,inspectorId,insrangeOid){
	$.ajax({
		url : rootPath+'/gpskeypoint/getInsRangeKeypoint.do'+"?rangeOid="+pkfield,
		data :{
			"unitId" : unitId,
			"lineloopoId":lineloopoId,
			"beginstation":qbeginstation,
			"endstation":qendstation,
			"date":new Date()
		},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			$('#gpsKeypointdatagrid').datagrid('loadData',{ 'total':data.length,'rows':data });
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
	
	$.get(rootPath+"/gpspatroltimemanage/getGpsPlanInfoByInspectionOid.do?inspectionOid="+inspectorId+"&insrangeOid="+insrangeOid ,function( result ){
		$('#gpsPlanInfodatagrid').datagrid('loadData',{ 'total':result.length,'rows':result });
	});
}

