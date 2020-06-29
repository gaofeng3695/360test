
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
	getGpsSubinsById();
});


function initDataGrid(unitid,lineloopoid){
	$('#gpsInsrangedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinsrange/getGpsInsrangeList.do?inspectorType=01&unitid="+unitid+"&lineloopoid="+lineloopoid,
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
		pageList: [10],
        fitColumns: true,
		frozenColumns:[[
		]],
		columns: 
		[[
			{	
				field:"unitname",
	    		title:"部门名称",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"lineloopoName",
	    		title:"管线名称",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"beginlocation",
	    		title:"起始位置",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"endlocation",
	    		title:"终止位置",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	},

			{
				field:"inspectorName",
	    		title:"巡检人员",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
		},
		onLoadSuccess:function(data){
	    	$('#gpsInsrangedatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	
	$('#ggpsInsrangedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinsrange/getGpsInsrangeList.do?inspectorType=02&unitid="+unitid+"&lineloopoid="+lineloopoid,
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
        fitColumns: true,
		pageList: [10],
		frozenColumns:[[
		]],
		columns: 
		[[
			{	
				field:"unitname",
	    		title:"部门名称",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"lineloopoName",
	    		title:"管线名称",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"beginlocation",
	    		title:"起始位置",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"endlocation",
	    		title:"终止位置",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	},

			{
				field:"ginspectorName",
	    		title:"巡检人员",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
		},
		onLoadSuccess:function(data){
	    	$('#ggpsInsrangedatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	onresize();
	$(window).bind("resize", function () {
		onresize();
     });
}

function onresize(){
	var containerWidth = $("#gpsInsrangeForm").width();
	$('#gpsInsrangedatagrid').datagrid('resize', {
		width : containerWidth
	});
	
	$('#ggpsInsrangedatagrid').datagrid('resize', {
		width : containerWidth
	});
}

/**
 * @desc 获得数据
 */
function getGpsSubinsById(){
	$.ajax({
		url : rootPath+"/gpssubins/get.do",
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
	$("#unitname").html(jsondata.unitname);
	$("#lineloopname").html(jsondata.lineloopoName);
	$("#beginlocation").html(jsondata.beginlocation);
	$("#endlocation").html(jsondata.endlocation);
	$("#syncdate").html(jsondata.syncdate);
	
	$("#beginstation").html(jsondata.beginstation);
	$("#endstation").html(jsondata.endstation);
	$("#rangeNum").html(jsondata.rangeNum);
	$("#grangeNum").html(jsondata.grangeNum);
	$("#lineLength").html(jsondata.lineLength);
	$("#isGenTaskCodeName").html(jsondata.isGenTaskCodeName);
	
	initDataGrid(jsondata.unitid,jsondata.lineloopoid);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsSubins");
}

