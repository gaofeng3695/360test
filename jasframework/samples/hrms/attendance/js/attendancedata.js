
function leading(){
	top.getDlg("upload/upload.html","saveiframe","导入考勤数据",600,220);
}


function loadUsername(){
	$.ajax({
		url:"/platform/hrms/attendance/getUsernamebyUnit.do",
		success:function(result){
		var options="<option value=\"\">--请选择--</option>";
			for(var i=0;i<result.length;i++){
				options+="<option value=\""+result[i].attendanceid+"\">"+result[i].username+"</option>";
			}
			$("#attendanceboname").html(options);		
		},
		async:false,
		dataType:"json"
		});
	
}

function leaddata(){
	var userName = top.Request('userName');
	var query={"filter_EQS_userloginname":userName}; 
	if( getParamter("unitid")!= null &&  getParamter("unitid") != "" ){
		query={"filter_EQS_unitid":getParamter("unitid")};
	}
	
	$("#01010101").datagrid('options').queryParams=query;
	$("#01010101").datagrid({
		loadMsg : '数据装载中......',
		columns:[[{field:'ck',checkbox:true},   
				  {field:'username',title:"打卡人",width:100,sortable:true},  
				  {field:'unitname',title:"部门",width:200,sortable:true},
				  {field:'attendancedate',title:"打卡日期",width:100,sortable:true}, 
				  {field:'starttime',title:"上班时间",width:100,sortable:true}, 
				  {field:'endtime',title:"下班时间",width:100,sortable:true},
				  {field:'explain',title:"说明",width:300,sortable:true},
				  {field:'eventid',title:'eventid',width:100,sortable:true,hidden:true},
				  {field:'usereventid',title:'usereventid',width:100,sortable:true,hidden:true},
				  {field:'uniteventid',title:'uniteventid',width:100,sortable:true,hidden:true}
			]],
		 url:"/platform/hrms/attendance/getAttend.do",
		 title:"考勤数据列表",
		 
		 rowStyler:function(index,row){
			var starttime= row.starttime.split(":");
			var endtime=row.endtime.split(":");
			var timebool=false;
			if(starttime[0]>8){
				timebool=true;
			}else if(starttime[0]==8&&starttime[1]>30){
				timebool=true;
			}else if(endtime[0]<17){
				timebool=true;
			}else if(endtime[0]==17&&endtime[1]<30){
				timebool=true;
			}
			
		        if (timebool){    
		            return 'color:red';    
		        }    
		    },
		onDblClickRow : function(index, row) {
			  $('#01010101').datagrid('selectRow',index);  //指定行选中
		}

	});
}

function queryattend(){
	
	var unitid=$("#unitid").val();
	var username=$("#username").val();
	var stattime=$("#starttime").val();
	var endtime=$("#endtime").val();
	var query={"filter_EQS_username":username,"filter_EQS_unitid":unitid,"filter_EQS_starttime":stattime,"filter_EQS_endtime":endtime}; 
		$("#01010101").datagrid('options').queryParams=query;
				$("#01010101").datagrid('load');	
//	$.ajax({
//		url:"/platform/hrms/attendance/queryAttend.do",
//		data:{"unitid":unitid,"username":username,"starttime":stattime,"endtime":endtime},
//		success:function(result){
//			 $("#01010101").datagrid("loadData",result);
//			},
//			 error:function(){
//			 },
//			dataType:"json"
//	});
	
}

function updateattend(){
	var rows = $('#01010101').datagrid('getSelections');
			if(rows.length == 1){
				var eventid = rows[0].eventid;
					top.getDlg("updateattend.htm?eventid="+eventid,"saveiframe","考勤数据修改",600,220);
			}else{
				$.messager.alert('提示','请选中一条记录','info');
				return;
			}

}

function addattend(){
	top.getDlg("addattend.htm","saveiframe","考勤数据补录",600,220);
}

function saveattend(){
		$('#saveattend').form('submit',{
				url: "/platform/hrms/attendance/saveAttend.do",
				onSubmit: function(){
					return $(this).form('validate');
				},
				success: function(result){
				}
			});
}

