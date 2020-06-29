var pageindex=0;
var reportName="report12";
function showreport(){
	 $.ajax({ 
	    	url: "../../../jasframework/report/getjdbcreport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	async:false,
	    	success: function(data){
	    		$("#showreport").html(data);
	    	}
	    });
}
function showreport2(){
	$("#xiayiye").hide();
	$("#fanhui").hide();
	$("#shangyiye").hide();
	reportName="report5";
	 $.ajax({ 
	    	url: "../../../jasframework/report/getbeanreport.do?reportname="+reportName+"&pageindex="+pageindex, 
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
		showreport();
	}
});

function xiayiye(){
	pageindex++;
	 $.ajax({ 
	    	url:  "../../../jasframework/report/getjdbcreport.do?reportname="+reportName+"&pageindex="+pageindex, 
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
		    	url: "../../../jasframework/report/getjdbcreport.do?reportname="+reportName+"&pageindex="+pageindex, 
		    	dataType: "html", 
		    	async:false,
		    	success: function(data){
		    		$("#showreport").html(data);
		    	}
		    });
}
 
 function fanhui(){
	 reportName="report1";
	 $("#xiayiye").show();
		$("#shangyiye").show();
	 pageindex=0;
	 showreport();
 }
 
 
 function daochuexcel(){
	 window.location.href="../../../jasframework/report/exportjdbcreportexcel.do?reportname="+reportName+"&pageindex="+pageindex+"&exportname="+encodeURIComponent(encodeURIComponent("报表"));
 }
 function daochuword(){
	 window.location.href="../../../jasframework/report/exportjdbcreportword.do?reportname="+reportName+"&pageindex="+pageindex+"&exportname="+encodeURIComponent(encodeURIComponent("报表"));
 }
 function daochupdf(){
	 window.location.href="../../../jasframework/report/exportjdbcreportpdf.do?reportname="+reportName+"&pageindex="+pageindex+"&exportname="+encodeURIComponent(encodeURIComponent("报表"));
 }
 function ababab(aaa,bbb){
	if(pageindex<0){
		pageindex=0;	
		}
	reportName="report4";
	$("#xiayiye").hide();
	$("#shangyiye").hide();
	 $.ajax({ 
		 	type:"post",
	    	url:  "../../../jasframework/report/getjdbcreport.do?reportname="+reportName+"&pageindex="+pageindex, 
	    	dataType: "html", 
	    	data:{"year":aaa,"userid":bbb},
	    	async:false,
	    	success: function(data){
	    		$("#showreport").html(data);
	    	}
	    });
	 
	 
	 function zibaobiao(){
		 
	 }
 }
