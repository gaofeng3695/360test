function initdatagrid(){
				var da=new Date();
	$("#01020101").datagrid({
		loadMsg : '数据装载中......',
		rownumbers:true,
		columns:[[
				  {field:'ck',checkbox:true},   
				   {field:'shiyongqi',title:"试用期",width:100,hidden:true},
				  {field:'eventid',title:"eventid",width:100,hidden:true}, 
				  {field:'username',title:"员工姓名",width:100,sortable:true}, 
				  {field:'userid',title:"员工id",width:100,sortable:true,hidden:true}, 
				  {field:'htss',title:"公司",width:200,sortable:true},
				  {field:'unitname',title:"部门",width:100,sortable:true},
				  {field:'unitid',title:"部门id",width:100,sortable:true,hidden:true},
				  {field:'tjyf',title:"工资月份",width:100,sortable:true}, 
				  {field:'nbgz',title:"工资总额",width:100,sortable:true},
				  {field:'cqts',title:"出勤天数",width:100,sortable:true}, 
			      {field:'qqts',title:"缺勤天数",width:100,sortable:true}, 
			      {field:'gztz',title:"工资调整",width:100,sortable:true}, 
			      {field:'nqqkk',title:"缺勤扣款",width:100,sortable:true}, 
				  {field:'cb',title:"饭补",width:100,sortable:true},
				  {field:'ccts',title:"出差天数",width:100,sortable:true},
				  {field:'ccbz',title:"出差补助",width:100,sortable:true},
				  {field:'nyfgz',title:"应发工资",width:100,sortable:true},
				  {field:'gjj',title:"公积金",width:100,sortable:true},
				  {field:'yanglaobx',title:"养老保险",width:100,sortable:true},
				  {field:'sybx',title:"失业保险",width:100,sortable:true},
				  {field:'yiliaobx',title:"医疗保险",width:100,sortable:true},
				  {field:'sds',title:"个人所得税",width:100,sortable:true},
				  {field:'nbsjffgz',title:"实发工资",width:100,sortable:true}
				  
			]],
		 url:rootPath+"/hrms/SalaryStatistics/getsalsrystatistics.do",
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
			  	top.getDlg("viewsalay.htm?eventid="+row.eventid,"saveiframe","修改工资",610,620);
		}
	});
}
function addMsg(){
	$.ajax({
		url:rootPath+"/hrms/userinfo/getUnitId.do",
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
	$("#01020101").datagrid('options').queryParams=query;
	$("#01020101").datagrid('load');
}



function getMsg(eventID){
	$.ajax({
		url:rootPath+"/hrms/SalaryStatistics/getsalsrystatisticsByEventid.do?eventid="+eventID,
		success:function(result){
		
		var username=result[0].username;
		var unitname=result[0].unitname;
		var company=result[0].htss;
		var tjyf=result[0].tjyf;
		var cqts=result[0].cqts;
		var qqts=result[0].qqts;
		var ccts=result[0].ccts;
		var wbgz=result[0].wbgz;
		var nbgz=result[0].nbgz;
		var gztz=result[0].gztz;
		var cb=result[0].cb;
		var dhbz=result[0].dhbz;
		var ccbz=result[0].ccbz;
		var bzzj=cb+dhbz+ccbz;
		var gjj=result[0].gjj;
		var yanglaobx=result[0].yanglaobx;
		var yiliaobx=result[0].yiliaobx;
		var sybx=result[0].sybx;
		var sds=result[0].sds;
		var wqqkk=result[0].wqqkk;
		var nqqkk=result[0].nqqkk;
		var wkouzj=(gjj+yanglaobx+yiliaobx+sybx+sds+wqqkk).toFixed(2);
		var nkouzj=(gjj+yanglaobx+yiliaobx+sybx+sds+nqqkk).toFixed(2);
		var wbsjffgz=result[0].wbsjffgz;
		var nbsjffgz=result[0].nbsjffgz;
		var wyfgz=result[0].wyfgz;
		var nyfgz=result[0].nyfgz;
		
		var chae=(nbsjffgz-wbsjffgz).toFixed(2);
		
		$(".username").html(username);
		$(".unitname").html(unitname);
		$(".company").html(company);
		$(".tjyf").html(tjyf);
		$(".cqts").html(cqts);
		$(".qqts").html(qqts);
		$(".ccts").html(ccts);
		$("#wbgz").html(wbgz);
		$("#nbgz").html(nbgz);
		$(".gztz").html(gztz);
		$(".cb").html(cb);
		$(".dhbz").html(dhbz);
		$(".ccbz").html(ccbz);
		$(".bzzj").html(bzzj);
		$(".gjj").html(gjj);
		$(".yanglaobx").html(yanglaobx);
		$(".yiliaobx").html(yiliaobx);
		$(".sybx").html(sybx);
		$(".sds").html(sds);
		$("#wqqkk").html(wqqkk);
		$("#nqqkk").html(nqqkk);
		$("#wkouzj").html(wkouzj);
		$("#nkouzj").html(nkouzj);
		$("#wbsjffgz").html(wbsjffgz);
		$("#nbsjffgz").html(nbsjffgz);
		$("#wyfgz").html(wyfgz);
		$("#nyfgz").html(nyfgz);
		$("#chae").html(chae);
		$("#").html();
		
		},
		async:false,
		dataType:"json"
		});	
}

$(document).ready(function(){
	initdatagrid();
//	addMsg()
});