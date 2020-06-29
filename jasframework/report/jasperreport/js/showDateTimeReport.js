var pageindex=0;
var reportName=encodeURIComponent(encodeURIComponent("月统计图"));
var chargecatagory="";
function searchIReport(){
	pageindex=0;
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var dateType=$("#dateType").combobox("getValue");
	if(dateType=='0'){
		reportName=encodeURIComponent(encodeURIComponent("月统计图"));
	}else if(dateType=='1'){
		reportName=encodeURIComponent(encodeURIComponent("年统计图"));
	}
	chargecatagory="";
	var chargecatagorys=$("#chargecatagory").combobox("getValues");
	for(var i=0;i<chargecatagorys.length;i++){
		if(i==chargecatagorys.length-1){
			chargecatagory+=chargecatagorys[i];
		}else{
			chargecatagory+=chargecatagorys[i]+",";
		}
	}
	 $.ajax({ 
	    	url: "../../../jasframework/report/showTimeReport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	data:{"startDate":startDate,"endDate":endDate,"chargecatagory":chargecatagory},
	    	async:false,
	    	success: function(data){
	    		$("#showreport").html(data);
	    	}
	});
}
var ComboboxValueNum=0;
jQuery.fn.ready(function (){
	$('#chargecatagory').combobox({
		valueField : 'id',
		textField : 'text',
		multiple : true,
		panelHeight : 'auto',
//		disabled:true,
		onLoadSuccess : function() {
			$(this).combobox('setValue', '');
		},
		onSelect : function(object) // 单击一个选项时
		{	
			var value=object.id;
			$('#chargecatagory').combobox('unselect', '');// 取消默认选项
			var selectValue=$('#chargecatagory').combobox('getValues');
			var selectValueNum=selectValue.length;
			if(value=="" || selectValueNum==ComboboxValueNum){
				$(this).combobox('setValue', '');
			}
		},
		onUnselect : function(object) { // 取消选项时
			var value = $('#chargecatagory').combobox('getValues');
			if (value == "") {
				$(this).combobox('setValue', '');
			}
		}
	});
	var data=[{"id":"","text":"======全部======"},
	          {"id":"管理费用","text":"管理费用"},
	          {"id":"项目成本","text":"项目成本"},
	          {"id":"销售费用","text":"销售费用"},
	          {"id":"研发支出","text":"研发支出"}];
	ComboboxValueNum=data.length-1;
	$('#chargecatagory').combobox('loadData',data);
	initDate();
	searchIReport();
});

function xiayiye(){
	pageindex++;
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	 $.ajax({ 
	    	url:  "../../../jasframework/report/showTimeReport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	async:false,
	    	data:{"startDate":startDate,"endDate":endDate,"chargecatagory":chargecatagory},
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
		    	url: "../../../jasframework/report/showTimeReport.do?reportname="+reportName+"&pageindex="+pageindex, 
		    	dataType: "html", 
		    	async:false,
		    	data:{"startDate":startDate,"endDate":endDate,"chargecatagory":chargecatagory},
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
	window.location.href="../../../jasframework/report/exportTimeReportExcel.do?reportname="+reportName+"&startDate="+startDate+"&endDate="+endDate+"&chargecatagory="+chargecatagory;
 }
 function daochuword(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	window.location.href="../../../jasframework/report/exportTimeReportWord.do?reportname="+reportName+"&startDate="+startDate+"&endDate="+endDate+"&chargecatagory="+chargecatagory;
 }
 function daochupdf(){
	 var startDate=$("#startDate").val();
	 var endDate=$("#endDate").val();
	 window.location.href="../../../jasframework/report/exportTimeReportPdf.do?reportname="+reportName+"&startDate="+startDate+"&endDate="+endDate+"&chargecatagory="+chargecatagory;
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
