function Export(){
	var eventid=$("#company").val();
	if(eventid==""){
		$.messager.alert("提示","请选择公司名","info");
 			 return false;
	}
	var url="/platform/hrms/SalaryStatistics/export.do?eventid="+eventid
	$('#exports').attr('src',url);
	
	
}
function addCompany(){
	$.ajax({
		url:"/platform/hrms/userinfo/getUnitId.do",
		success:function(result){
		var company="<option value=\"\">--请选择--</option>";
			for(var i=0;i<result.length;i++){
				if(result[i].parentid==null){
					company+="<option value=\""+result[i].eventid+"\">"+result[i].name+"</option>";
				}
			}
			$("#company").html(company);
		},
		async:false,
		dataType:"json"
		});	
	}

function closeUser(){
	parent.$('#dlg').dialog('close');
}
$(document).ready(function(){
	addCompany();
	});
	