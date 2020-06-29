$(document).ready(function(){
//	settime
//	setInterval(getUploadStatic,500);
	

	$($.messager.progress("bar")).progressbar('setValue', 1000);
//	setInterval(aaa,100);
//	setTimeout(aaa,1001);

});


function aaa(){
	var a=$.messager.progress("bar");
	
	if($(a).progressbar('getValue')!=100){
//		alert($(a).progressbar('getValue'))
		$(a).progressbar('setValue',$(a).progressbar('getValue')+1);
		setTimeout(aaa,1001);
	}else{
		alert("1111")
		$.messager.progress("close");
	}
	
}

function getUploadStatic(){
	   $.ajax({ 
	    	url: rootPath+"/upload/getuploadStatic.do", 
	    	dataType: "json", 
	    	async:true,
	    	success: function(data){
	    		var uploadstatic=data.uploadstatic;
	    		$("#uploadprogressbar").progressbar('setValue', uploadstatic.percentage);   
	    	}
	    });
}