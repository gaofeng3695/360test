
var pkfield=getParamter("oid");	// 业务数据ID

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#consdcsreviewlogdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/consDcsReviewLog/getPage.do?dataoid="+pkfield,
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		sortName:'createTime',
		sortOrder:'desc',
		columns: 
		[[
			{	
				field:"operationtypeCodeName",
	    		title:"操作类型",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center'
	    	},
	    	{	
				field:"advice",
	    		title:"审批意见",
	    		width:"200",
	    		resizable:true,
    			//sortable:true,
	    		align:'center'
	    	},
			{	
				field:"createTime",
	    		title:"操作时间",
	    		width:"150",
	    		resizable:true,
	    		align:'center'
	    	},
			{	
				field:"createUserName",
	    		title:"操作人员",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"resultCodeName",
	    		title:"备注",
	    		width:"150",
	    		resizable:true,
    			//sortable:true,
	    		align:'center'
	    	},
		]],
	});
	//页面自适应
	initDatagrigHeight('consdcsreviewlogdatagrid','queryDiv','100');
});