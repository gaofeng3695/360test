$(document).ready(function(){
	var raqname = getParamter("raqname");
	var rurl="./reportJsp/showReport.jsp?raq="+raqname;
	rurl= encodeURI(rurl); 
	$('#showrunqianreport').attr('src',rurl);
});
