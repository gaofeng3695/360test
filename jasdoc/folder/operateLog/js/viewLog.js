$(function() {
	var eventid=getParamter("eventid");
	viewLogById(eventid);
});
function closeLog() {
	parent.closeDlg('viewLog');
}

/**
 * 方法描述：加载数据
 */
function viewLogById(eventid){
	$.ajax({
		type: "POST",
	   	url: rootPath+"jasdoc/operateLogSon/viewJasdocLog.do",
   		data: {
   			    "oid":eventid
   			  },
	   	success: function(data){
     		if(data!=null){
     			$("#businessname").html(data.businessName);
     			$("#userName").html(data.createUserName);
     			$("#operatetypeStr").html(data.optType);
     			$("#operatedate").html(data.createTime);
     			$("#detail").html(data.detail);
     		}
		},
	   	dataType:"json"
	});
}
