
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
	getGpsInstaskDayById();
});

/**
 * @desc 获得数据
 */
function getGpsInstaskDayById(){
	$.ajax({
		url : rootPath+"/gpsinstaskday/get.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
				loadgpslinedatagrid();
				loadgpslinetimedatagrid(data.data.insfreq);
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
 * 加载巡检任务线路子表
 * @returns
 */
function loadgpslinedatagrid(){
	$('#gpslinedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinstaskday/getInstaskLine.do",
		queryParams :{"planoid" : pkfield},
		collapsible:true,
		autoRowHeight: false,
		fitColumns: true,
		pagination:false,
		columns: 
		[[
			{
				field:"lineloopoidname",
	    		title:"管线",
	    		width:"150",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"beginlocation",
	    		title:"巡检起始位置",
	    		width:"140",
	    		resizable:true,
	    		align:'center'
	    	},

	    	{	
				field:"endlocation",
	    		title:"巡检终止位置",
	    		width:"140",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"beginstation",
	    		title:"起始里程(m)",
	    		width:"120",
	    		resizable:true,
	    		align:'center'
	    	},
			{	
				field:"endstation",
	    		title:"终止里程(m)",
	    		width:"120",
	    		resizable:true,
//    			sortable:true,
	    		align:'center'
	    	}
		]]
	});
}


/**
 * 加载巡检任务线路工作时间子表
 * @returns
 */
function loadgpslinetimedatagrid(insfreq){
	$.ajax({
		url : rootPath+"/gpsinstaskday/getInstaskLineTime.do",
		data :{"planoid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data){
				for(var i=0; i<data.length; i++){
					var boarddiv = "<div><h6>开始时间点: "+data[i].bdatetime+"&nbsp;&nbsp;&nbsp;结束时间点: "+data[i].edatetime+"</h6></div>";
					var datagrid = "<table id='gpslineTimedatagrid"+i+"' class='easyui-datagrid'></table>";
					if(i != data.length-1){
						datagrid += "<br/>";
					}
					$("#gpslineTime").append(boarddiv);
					var rs = $(datagrid).appendTo("#gpslineTime");
					$.parser.parse(rs);
					loadgpskeypointdatagrid(insfreq, "gpslineTimedatagrid"+i, data[i].oid,data[i].bdatetime, data[i].edatetime);
				}
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
 * 加载巡检任务关键点子表
 * @returns
 */
function loadgpskeypointdatagrid(insfreq, dgname,instasktimeoid, bdatetime, edatetime){
	$('#'+dgname).datagrid({
		idField:'oid',
		url: rootPath+"/gpsinstaskday/getInstaskkeypoint.do",
		queryParams :{
			"planoid" : pkfield, 
			"insfreq" : insfreq, 
			"instasktimeoid" : instasktimeoid,
			"bdatetime" : bdatetime,
			"edatetime" : edatetime
		},
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
		fitColumns: true,
		frozenColumns:[[
			{
				field:"lineloopoidname",
	    		title:"管线",
	    		width:"150",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{
				field:"pointidname",
	    		title:"关键点",
	    		width:"180",
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
	    	{	
				field:"arrivaltime",
	    		title:"到达时间",
	    		width:"150",
	    		resizable:true,
	    		align:'center'
	    	},
			{	
				field:"pointstatusname",
	    		title:"状态",
	    		width:"150",
	    		resizable:true,
	    		align:'center'
	    	}
		]]
	});
}

/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$("#instypeCodeName").html(jsondata.instypeCodeName);
	$("#inspectortypeCodeName").html(jsondata.inspectortypeCodeName);
//	$("#insfreq").html(jsondata.insfreq);
//	$("#insfrequnitCodeName").html(jsondata.insfrequnitCodeName);
//	$("#insfrequnitval").html(jsondata.insfrequnitval);
	$("#insvehicleCodeName").html(jsondata.insvehicleCodeName);
	$("#inspectoridname").html(jsondata.inspectoridname);
	$("#insbdate").html(jsondata.insbdate);
	$("#insedate").html(jsondata.insedate);
	$("#execunitidname").html(jsondata.execunitidname);
	$("#planno").html(jsondata.planno);
	$('#insfreqcont').html(jsondata.insfrequnitval + (jsondata.insfrequnit=='01'?'日':jsondata.insfrequnitCodeName) + jsondata.insfreq + '巡');
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsInstaskDay");
}

