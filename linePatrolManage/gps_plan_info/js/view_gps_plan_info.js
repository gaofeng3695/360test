
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
	getGpsPlanInfoById();
	
	initLineplantable();
});

/**
 * @desc 获得数据
 */
function getGpsPlanInfoById(){
	$.ajax({
		url : rootPath+"/gpsplaninfo/get.do",
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
	$("#planno").html(jsondata.planno);
	$("#instypeCodeName").html(jsondata.instypeCodeName);
	$("#execunitid").html(jsondata.execunitidname);
	$("#inspectortypeCodeName").html(jsondata.inspectortypeCodeName);
	/*$("#insfreq").html(jsondata.insfreq);
	$("#insfrequnitCodeName").html(jsondata.insfrequnitCodeName);
	$("#insfrequnitval").html(jsondata.insfrequnitval);*/
	$("#insvehicleCodeName").html(jsondata.insvehicleCodeName);
	$("#speedmax").html(jsondata.speedmax);
	$("#insbdate").html(jsondata.insbdate);
	$("#insedate").html(jsondata.insedate);
	$("#determinant").html(jsondata.determinant);
	$("#repealdate").html(jsondata.repealdate);
	$("#planflagCodeName").html(jsondata.planflagCodeName);
	$("#unitid").html(jsondata.unitidname);
	$("#syncdate").html(jsondata.syncdate);
	if(jsondata.ispis == '1'){
		$("#ispis").html('是');
	}else{
		$("#ispis").html('否');
	}
	$('#insfreqcont').html(jsondata.insfrequnitval + (jsondata.insfrequnit=='01'?'日':jsondata.insfrequnitCodeName) + jsondata.insfreq + '巡');
	$("#beginWorkTime").html(jsondata.beginWorkTime);
	$("#endWorkTime").html(jsondata.endWorkTime);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsPlanInfo");
}


function initLineplantable(){
	$('#lineplantable').datagrid({
//		idField:'oid',
		url: rootPath+"/gpsplanlinelnfo/getPage.do",
		queryParams:{
			planeventid:pkfield
		},
		collapsible:true,
		autoRowHeight: false,
        fitColumns: false,
		remoteSort:true,
		columns: 
		[[
			{	
				field:"oid",
				hidden:'true'
	    	},
			{	
				field:"planeventid",
				hidden:'true'
	    	},
	    	{	
				field:"lineloopoid",
				hidden:'true'
	    	},
	    	{	
				field:"isPis",
				hidden:'true'
	    	},
	    	{	
				field:"rangeflag",
				hidden:'true'
	    	},
			{	
				field:"lineloopoidname",
	    		title:"管线名称",
	    	//	width:$(this).width() * 200,
	    		width:150,
	    		resizable:true,
//    			sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"beginlocation",
	    		title:"巡检起始位置",
	    		//width:$(this).width() * 0.18,
	    		width:150,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"endlocation",
	    		title:"巡检终止位置",
	    		//width:$(this).width() * 0.18,
	    		width:150,
	    		resizable:true,
	    		align:'center'
	    	},
	    	{
				field:"beginstation",
	    		title:"起始里程",
	    		//width:$(this).width() * 0.16,
	    		width:88,
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"endstation",
	    		title:"终止里程",
	    		//width:$(this).width() * 0.16,
	    		width:88,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"isPisname",
	    		title:"是否PIS同步",
	    		//width:$(this).width() * 0.16,
	    		width:82,
	    		resizable:true,
	    		align:'center',
	    		formatter:function(value,row,index){
	    			if(row.isPis == 1){
	    				return "是";
	    			}else if(row.isPis == 0){
	    				return "否";
	    			}
	    		} 
	    	}
		]],
		onDblClickRow:function(index,indexData){
//			top.getDlg("view_gps_plan_line_info.html?oid="+indexData.oid,"viewGpsPlanLineInfo","详细",700,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#lineplantable').datagrid('clearSelections'); //clear selected options
	    }
	});
	
	//页面自适应
	onresize();
	$(window).bind("resize", function () {
		onresize();
     });
}

function onresize(){
	var containerWidth = $(window).width() - 30;
//	var containerHeight = $(window).height() - $('#plandiv').height() - $('#linetitle').height()  
//		- $('#button-area').height() - 76;
	var containerHeight = $(window).height() - $('#plantable').height() - $('#button-area').height() - 35;
	$('#lineplantable').datagrid('resize', {
		width : containerWidth,
		height : containerHeight
	});
}
