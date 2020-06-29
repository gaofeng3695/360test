/**
 * 方法描述:
 */
$(document).ready(function(){
	getNoticeById();
});

/**
 * 描述：获得数据
 */
function getNoticeById(){
	var eventId=getParamter("eventId");
	$.getJSON(rootPath+"/notice/getNoticeById.do?random=" + new Date().getTime(), {
		"eventId" : eventId
	}, function(data) {
		loadData(data);
	});
}
/**
 * 描述：数据加载到页面
 */
function loadData(jsondata){
		$("#title").html(jsondata.title);
		$("#datetime").html(jsondata.publishTime);
		$("#content").html(jsondata.content);
}
/**
 * 描述：关闭添加页面
 */
function closePanel() {
	top. closeDlg("viewiframe");
}

