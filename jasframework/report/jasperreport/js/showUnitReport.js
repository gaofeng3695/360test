var pageindex=0;
var reportName=encodeURIComponent(encodeURIComponent("部门统计"));
function searchIReport(){
	pageindex=0;
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	 $.ajax({ 
	    	url: "../../../jasframework/report/showUnitReport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	data:{"startDate":startDate,"endDate":endDate},
	    	async:false,
	    	success: function(data){
	    		$("#showreport").html(data);
	    	}
	});
}

jQuery.fn.ready(function (){
	initDate();
	searchIReport();
});

function xiayiye(){
	pageindex++;
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	 $.ajax({ 
	    	url:  "../../../jasframework/report/showUnitReport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	async:false,
	    	data:{"startDate":startDate,"endDate":endDate},
	    	success: function(data){
	    		$("#showreport").html(data);
	    	}
	    });
}
	 
 function shangyiye(){
		pageindex--;
		if(pageindex<0){
		pageindex=0;	
		}
		var startDate=$("#startDate").val();
		var endDate=$("#endDate").val();
		 $.ajax({ 
		    	url: "../../../jasframework/report/showUnitReport.do?reportname="+reportName+"&pageindex="+pageindex, 
		    	dataType: "html", 
		    	async:false,
		    	data:{"startDate":startDate,"endDate":endDate},
		    	success: function(data){
		    		$("#showreport").html(data);
		    	}
		    });
}
 
 function fanhui(){
//	 reportName="report1";
	 $("#xiayiye").show();
	 $("#shangyiye").show();
	 pageindex=0;
	 searchIReport();
 }
 
 
 function daochuexcel(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	window.location.href="../../../jasframework/report/exportUnitReportExcel.do?reportname="+reportName+"&startDate="+startDate+"&endDate="+endDate;
 }
 function daochuword(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	window.location.href="../../../jasframework/report/exportUnitReportWord.do?reportname="+reportName+"&startDate="+startDate+"&endDate="+endDate;
 }
 function daochupdf(){
	 var startDate=$("#startDate").val();
	 var endDate=$("#endDate").val();
	 window.location.href="../../../jasframework/report/exportUnitReportPdf.do?reportname="+reportName+"&startDate="+startDate+"&endDate="+endDate;
 }
 /**
  * 开始时间日期选择框
  * 
  * @param id
  */
 function showDateStart(id) {
 	WdatePicker({
 		maxDate : "#F{$dp.$D(\'" + id + "\')||\'" + getDate(new Date()) + "\'}"
 	});
 }

 /**
  * 结束时间日期选择框
  * 
  * @param id
  */
 function showDateEnd(id) {
 	WdatePicker({
 		minDate : "#F{$dp.$D(\'" + id + "\')}",
 		maxDate : getDate(new Date())
 	});
 }
 /**
  * 格式化日格为2014-09-04格式
  * 
  * @param myDate
  * @returns {String} 类型为：yyyy-mm-dd
  */
 function getDate(myDate) {
 	var year = myDate.getFullYear();
 	var month = myDate.getMonth() + 1;
 	var date = myDate.getDate();
 	if (month < 10)
 		month = "0" + month;
 	if (date < 10)
 		date = "0" + date;
 	return year + "-" + month + "-" + date;
 }
 /**
  * 格式化日格为2014-09-04格式
  * 
  * @param myDate
  * @returns {String} 类型为：yyyy-mm-dd
  */
 function initDate() {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	var date = myDate.getDate();
	if (month < 10)
		month = "0" + month;
	if (date < 10)
		date = "0" + date;
	var startDate = (year-1) + "-" + month + "-" + date;
	var endDate = year + "-" + month + "-" + date;
	$("#startDate").val(startDate);
	$("#endDate").val(endDate);
 }
