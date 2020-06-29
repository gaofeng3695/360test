function initdatagrid(){
		var da=new Date();
	$("#01020102").datagrid({
		loadMsg : '数据装载中......',
		rownumbers:true,
		columns:[[
				  {field:'ck',checkbox:true},   
				  {field:'eventid',title:"eventid",width:100,hidden:true}, 
				  {field:'username',title:"员工姓名",width:100,sortable:true}, 
				  {field:'userid',title:"员工id",width:100,sortable:true,hidden:true}, 
				  {field:'htss',title:"公司",width:200,sortable:true},
				  {field:'unitname',title:"部门",width:100,sortable:true},
				  {field:'unitid',title:"部门id",width:100,sortable:true,hidden:true},
				  {field:'tjyf',title:"工资月份",width:100,sortable:true}, 
				  {field:'wbgz',title:"工资总额",width:100,sortable:true},
				  {field:'cqts',title:"出勤天数",width:100,sortable:true}, 
			      {field:'qqts',title:"缺勤天数",width:100,sortable:true}, 
			      {field:'gztz',title:"工资调整",width:100,sortable:true}, 
			      {field:'wqqkk',title:"缺勤扣款",width:100,sortable:true}, 
				  {field:'cb',title:"饭补",width:100,sortable:true},
				  {field:'ccts',title:"出差天数",width:100,sortable:true},
				  {field:'ccbz',title:"出差补助",width:100,sortable:true},
				  {field:'wyfgz',title:"应发工资",width:100,sortable:true},
				  {field:'gjj',title:"公积金",width:100,sortable:true},
				  {field:'yanglaobx',title:"养老保险",width:100,sortable:true},
				  {field:'sybx',title:"失业保险",width:100,sortable:true},
				  {field:'yiliaobx',title:"医疗保险",width:100,sortable:true},
				  {field:'sds',title:"个人所得税",width:100,sortable:true},
				  {field:'wbsjffgz',title:"实发工资",width:100,sortable:true}
				  
			]],
		 url:"/platform/hrms/SalaryStatistics/getsalsrystatistics.do",
		 title:"薪酬信息统计",
		 rowStyler:function(index,row){

			var flag=false;
			var nowMonth=da.getMonth()+1;
			var shiyongqi= row.shiyongqi;
			var nian=shiyongqi.substring(0,4);
			var yue=shiyongqi.substring(5,7);
			
				if(nian>da.getYear()){
					flag=true;
				}else if((nowMonth-yue)<=1){
					flag=true;
				}else{
					flag=false;
				}
				if(flag){
			            return 'color:red';    
				}
		        
		    },
		onDblClickRow : function(index, row) {
			  	top.getDlg("viewsalay.htm?eventid="+row.eventid,"saveiframe","修改工资",610,650);
		}
	});
}
function addMsg(){
	$.ajax({
		url:"/platform/hrms/userinfo/getUnitId.do",
		success:function(result){
		//	alert(result[1].parentid);
		var options="<option value=\"\">--请选择--</option>";
		var company="<option value=\"\">--请选择--</option>";
			for(var i=0;i<result.length;i++){
				if(result[i].parentid==null){
					company+="<option value=\""+result[i].eventid+"\">"+result[i].name+"</option>";
				}else{
					options+="<option value=\""+result[i].eventid+"\">"+result[i].name+"</option>";
				}
			}
			$("#unit").html(options);	
			$("#company").html(company);
		},
		async:false,
		dataType:"json"
		});	
	}

function querysalarystatistics(){
	var company=$("#company").val();
	var unitid=$("#unit").val();
	var tjyf=$("#tjyf").val();
	
	var username=$("#username").val();
	
	var query={"filter_EQS_company":company,"filter_EQS_unitid":unitid,"filter_EQS_tjyf":tjyf,"filter_EQS_username":username}; 
	$("#01020102").datagrid('options').queryParams=query;
	$("#01020102").datagrid('load');
}

function exports() {
		top.getDlg("export.html", "saveiframe", "导出报表",400, 200);
}


$(document).ready(function(){
	initdatagrid();
	addMsg()
});