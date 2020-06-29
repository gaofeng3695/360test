$(function(){
	$('#logLoginDatagrid').datagrid({
		idField:'oid',
		url: rootPath+"jasframework/log/login/getList.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		columns: 
		[[
			{field:"userName",title:"用户姓名",width:"100",resizable:true,sortable:true,align:'center'},
			{field:"loginName",title:"登录名",width:"100",resizable:true,align:'center'},
            {field:"unitNameFullpath",title:"所在部门",width:"200",resizable:true,align:'center'},
            {field:"loginDatetime",title:"登录时间",width:"130",resizable:true,align:'center'},
			{field:"exitDatetime",title:"退出时间",width:"130",resizable:true,align:'center'},
			{field:"clientIp",title:"登录客户端IP",width:"130",resizable:true,align:'center'},
			{field:"serverIp",title:"服务器IP",width:"130",resizable:true,align:'center'},
	    	{field:"appId",title:"所属应用",width:"130",resizable:true,align:'center',hidden:true},
	    	{field:"appName",title:"应用名称",width:"130",resizable:true,align:'center'},
	    	{field:"token",title:"token",width:"300",resizable:true,align:'center'}
		]]
	});
	initDatagrigHeight('logLoginDatagrid', 'queryDiv', 90);
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

function queryLog(){
	var userName = ($("#userName").val()||"")!=""?"%"+$("#userName").val()+"%":"";
	var loginName = ($("#loginName").val()||"")!=""?"%"+$("#loginName").val()+"%":"";
	var loginDateBegin = ($("#loginDateBegin").val()||"")!=""?new Date($("#loginDateBegin").val().replace(new RegExp(/-/gm) ,"/")).getTime():null;
	var loginDateEnd = ($("#loginDateEnd").val()||"")!=""?new Date($("#loginDateEnd").val().replace(new RegExp(/-/gm) ,"/")).getTime():null;
	
	var requestQueryParams = {
			userName:userName,
			loginName:loginName,
			loginDateBegin:loginDateBegin,
			loginDateEnd:loginDateEnd
	};
	$('#logLoginDatagrid').datagrid('options').queryParams=requestQueryParams;
	$('#logLoginDatagrid').datagrid('load');
}



