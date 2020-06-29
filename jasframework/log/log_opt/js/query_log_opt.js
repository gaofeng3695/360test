
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
 * @desc 查询
 */
function queryOptLog(){
	var businessName = ($("#businessName").val()||"")!=""?"%"+$("#businessName").val()+"%":"";
	var optType = ($("#optType").val()||"")!=""?"%"+$("#optType").val()+"%":"";
	var optUserName = ($("#optUserName").val()||"")!=""?"%"+$("#optUserName").val()+"%":"";
	var beginDate = ($("#beginDate").val()||"")!=""?new Date($("#beginDate").val().replace(new RegExp(/-/gm) ,"/")).getTime():null;
	var endDate = ($("#endDate").val()||"")!=""?new Date($("#endDate").val().replace(new RegExp(/-/gm) ,"/")).getTime():null;
	
	var requestQueryParams = {
			businessName:businessName,
			optType:optType,
			optUserName:optUserName,
			beginDate:beginDate,
			endDate:endDate
	};
	$('#logOptDatagrid').datagrid('options').queryParams=requestQueryParams;
	$('#logOptDatagrid').datagrid('load');
}

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#logOptDatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/log/opt/getList.do?orderBy=create_time desc",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		columns: 
		[[
			{	
				field:"createTime",
	    		title:"操作时间",
	    		width:"150",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{	
				field:"createUserName",
	    		title:"操作者",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

            {
                field:"optType",
                title:"操作类型",
                width:"80",
                resizable:true,
                align:'center'
            },

            {
                field:"businessName",
                title:"对象类型",
                width:"11%",
                resizable:true,
                sortable:true,
                align:'center'
            },

			{	
				field:"businessId",
	    		title:"对象ID",
	    		width:"20%",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"detail",
	    		title:"对象名称",
	    		width:"20%",
	    		resizable:true,
	    		align:'left'
	    	},
			{
				field:"remark",
	    		title:"备注",
	    		width:"20%",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{
				field:"appId",
	    		title:"应用ID",
	    		width:"10%",
	    		resizable:true,
	    		align:'center',
	    		hidden:true
	    	},
	    	{
				field:"appName",
	    		title:"应用名称",
	    		width:"10%",
	    		resizable:true,
	    		align:'center',
	    		hidden:true
	    	}
		]]
	});
	//页面自适应
	initDatagrigHeight('logOptDatagrid','queryDiv','100');
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('hseInspectdatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('hseInspectdatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
});
