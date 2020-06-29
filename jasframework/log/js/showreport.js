var pageindex=0;
var reportName="report1";
function showreport(){
	 $.ajax({ 
	    	url: "../../jasframework/report/getjdbcreport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	async:false,
	    	success: function(data){
	    		$("#showreport").html(data);
	    	}
	    });
}
function showreport2(){
	reportName="report5";
	 $.ajax({ 
	    	url: "../../jasframework/report/getbeanreport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	async:false,
	    	success: function(data){
	    		$("#showreport").html(data);
	    	}
	    });
}

jQuery.fn.ready(function (){
	var reporttype=getParamter("reporttype");
	if(reporttype==1){
		showreport();
	}else{
		showreport2();
	}
});

function xiayiye(){
	pageindex++;
	 $.ajax({ 
	    	url:  "../../jasframework/report/getjdbcreport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	async:false,
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
		 $.ajax({ 
		    	url: "../../jasframework/report/getjdbcreport.do?reportname="+reportName+"&pageindex="+pageindex, 
		    	dataType: "html", 
		    	async:false,
		    	success: function(data){
		    		$("#showreport").html(data);
		    	}
		    });
}
 
 function fanhui(){
	 reportName="report1";
	 pageindex=0;
	 showreport();
 }
 
 
 function daochuexcel(){
	 window.location.href="../../jasframework/report/exportreport.do?reportname="+reportName+"&pageindex="+pageindex;
//	 $.ajax({ 
//		 	type:"post",
//	    	url:  "../../jasframework/report/exportreport.do?reportname="+reportName+"&pageindex="+pageindex, 
//	    	dataType: "html", 
//	    	data:{"year":aaa,"userid":bbb},
//	    	async:false,
//	    	success: function(data){
//	    		$("#showreport").html(data);
//	    	}
//	    });
 }
 function ababab(aaa,bbb){
	if(pageindex<0){
		pageindex=0;	
		}
	reportName="report4";
	 $.ajax({ 
		 	type:"post",
	    	url:  "../../jasframework/report/getjdbcreport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	data:{"year":aaa,"userid":bbb},
	    	async:false,
	    	success: function(data){
	    		$("#showreport").html(data);
	    	}
	    });
 }
