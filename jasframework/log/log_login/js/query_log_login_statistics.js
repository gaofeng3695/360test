$(function(){
	$('#logLoginDatagrid').datagrid({
		idField:'oid',
		url: rootPath+"jasframework/log/login/getStatisticsInfo.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		columns: 
		[[
			{field:"userName",title:"用户姓名",width:"100",resizable:true,sortable:true,align:'center'},
			{field:"loginName",title:"登录名",width:"100",resizable:true,align:'center'},
            {field:"unitNameFullpath",title:"所在部门",width:"200",resizable:true,align:'center'},
            {field:"loginCount",title:"登录次数",width:"130",resizable:true,align:'center'},
			{field:"totalLoginDate",title:"登录时长",width:"130",resizable:true,align:'center'},
			{field:"lastLoginDate",title:"最后登录时间",width:"130",resizable:true,align:'center'}
		]]
	});
	initDatagrigHeight('logLoginDatagrid', 'queryDiv', 90);
});

function queryLog(){
	var userName = ($("#userName").val()||"")!=""?"%"+$("#userName").val()+"%":"";
	var loginName = ($("#loginName").val()||"")!=""?"%"+$("#loginName").val()+"%":"";
	
	var requestQueryParams = {
			userName:userName,
			loginName:loginName
	};
	$('#logLoginDatagrid').datagrid('options').queryParams=requestQueryParams;
	$('#logLoginDatagrid').datagrid('load');
}
