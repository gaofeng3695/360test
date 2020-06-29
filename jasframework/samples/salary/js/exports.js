function personExports(){
	var eventid= getParamter("eventid");
	var url="/platform/hrms/SalaryStatistics/exportexcel.do?eventid="+eventid
	$('#exports').attr('src',url);
	/*$.ajax({
		url:"/platform/hrms/SalaryStatistics/exportexcel.do?eventid="+eventid,
		success:function(result){
		
					if(result.chenggong==1){
						$.messager.alert("提示",result.ok,"info",function(){closeUser();});						
					}else{
						$.messager.alert("提示",result.ok,"info",function(){closeUser();});
					}
		},
		async:false,
		dataType:"json"
	});	*/
}

function closeUser(){
	parent.$('#dlg').dialog('close');
}
	
	