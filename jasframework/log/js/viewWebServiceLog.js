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
	   	url: "../webServiceLog/getWebServiceLogInfo.do",
   		data: {
   			    "eventid":eventid
   			  },
	   	success: function(data){
     		if(data!=null){
     			$("#serviceModule").html(data.serviceModule);
     			$("#serviceName").html(data.serviceName);
     			$("#serviceDesc").html(data.serviceDesc);
     			$("#operateTime").html(data.operateTime);
     			$("#detailInfo").html(data.detailInfo);
     			$("#userName").html(data.userName);
     			$("#systemName").html(data.systemName);
     		}
		},
	   	dataType:"json"
	});
}
