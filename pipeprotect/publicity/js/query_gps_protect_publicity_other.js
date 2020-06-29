
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsProtectPublicitydatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsprotectpublicity/getPageOther.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitname",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"title",
	    		title:"活动名称",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
		]],
		columns: 
		[[

			{	
				field:"startdate",
	    		title:"开始时间",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"enddate",
	    		title:"结束时间",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"site",
	    		title:"活动地点",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"participant",
	    		title:"参加人员",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"describe",
	    		title:"活动内容简述",
	    		width:"300",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"reportperson",
	    		title:"上报人",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"sharestatusName",
	    		title:"分享状态 ",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_protect_publicity.html?oid="+indexData.oid,"viewGpsProtectPublicity","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsProtectPublicitydatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsProtectPublicitydatagrid','queryDiv','100');
	
	/* 以下初始化查询面板 */
	initUnitComboTree('unitid');
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsProtectPublicitydatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsProtectPublicitydatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
});


/**
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_protect_publicity.html?oid="+dataId,"viewGpsProtectPublicity","详细",800,600,false,true,true);
}





