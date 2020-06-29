function initdatagrid(){
	$("#01010104").datagrid({
		loadMsg : '数据装载中......',
		columns:[[{field:'ck',checkbox:true},   
			
				  {field:'eventid',title:"eventid",width:100,hidden:true}, 
				  {field:'username',title:"员工姓名",width:100,sortable:true}, 
				  {field:'userid',title:"员工id",width:100,sortable:true,hidden:true}, 
				  {field:'unitname',title:"部门",width:100,sortable:true},
				  {field:'unitid',title:"部门id",width:100,sortable:true,hidden:true},
				  {field:'statisticsdate',title:"考勤月份",width:100,sortable:true}, 
				  {field:'attendancedays',title:"出勤天数",width:100,sortable:true}, 
				  {field:'overtime',title:"加班时长（小时）",width:100,sortable:true},
				  {field:'annualandrest',title:"年假与倒休（天）",width:100,sortable:true},
				  {field:'thingleave',title:"事假（天）",width:100,sortable:true},
				  {field:'sickleave',title:"病假（天）",width:100,sortable:true},
				  {field:'otherleave',title:'其他假期（婚丧产假）',width:100,sortable:true},
				  {field:'leftearly',title:'早退次数',width:100,sortable:true},
				  {field:'belate',title:'迟到次数',width:100,sortable:true},
				  {field:'absenteeism',title:'全天旷工次数',width:100,sortable:true},
				  {field:'halfdayabsenteeism',title:'半天旷工次数',width:100,sortable:true}
			]],
		 url:"/platform/hrms/AttendanceStatistics/queryAS.do",
		 title:"考勤信息统计",
		onDblClickRow : function(index, row) {
			  $('#01010104').datagrid('selectRow',index);  //指定行选中
		}

	});
}

function queryAS(){
	var unitid=$("#unitid").val();
	var username=$("#username").val();
	var tongjitime=$("#tongjitime").val();
	var query={"filter_EQS_username":username,"filter_EQS_unitid":unitid,"filter_EQS_tongjitime":tongjitime}; 
	$("#01010104").datagrid('options').queryParams=query;
	$("#01010104").datagrid('load');	
	
}

$(document).ready(function(){
	initdatagrid();
});
