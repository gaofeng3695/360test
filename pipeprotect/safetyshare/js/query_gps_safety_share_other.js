
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
	$('#gpsSafetySharedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpssafetyshare/getPageOther.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitname",
	    		title:"部门名称",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"title",
	    		title:"标题",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
			{	
				field:"occurrencetime",
	    		title:"事件发生时间",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"describe",
	    		title:"经过简述",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"cause",
	    		title:"原因分析",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"result",
	    		title:"事件结果",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"experience",
	    		title:"经验及教训",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{
				field:"sharestatusName",
	    		title:"分享状态",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
			}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_safety_share.html?oid="+indexData.oid,"viewGpsSafetyShare","详细",700,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsSafetySharedatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsSafetySharedatagrid','queryDiv','100');
	
	/* 以下初始化查询面板 */
	initUnitComboTree('unitid');
});



/**
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_safety_share.html?oid="+dataId,"viewGpsSafetyShare","详细",700,400,false,true,true);
}

