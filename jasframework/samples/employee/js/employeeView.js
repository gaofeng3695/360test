var ViewWindow = "employeeView";
/**
 *关闭窗口 
 */
function closeWindow(){
	top.closeDlg(ViewWindow);
}
/**
 *初始化 
 */
$(function() {
	$("#dlg").panel("open");
	loadData();
});

/**
 * 描述：加载数据
 */
function loadData() {
	var param = this.location.search;
	if (param != null && "" != param) {
		var p = param.substr(1).split("&");
		$.each(p,function(i,item){
			var d = item.split("=");
			 if(d[0]=='eventid'){
				id1=d[1];
			}
			
		});
	}
	if (id1 != null && "" != param) {
		//$("#fileUpload").hide();
		$.getJSON("../../sample/getEmployeeById.do?random=" + new Date().getTime(), {
			"eventid" : id1
		}, function(jso) {
			putValue(jso);
		});
	}
}

/**
 * 描述：显示数据
 * @param obj 数据
 */
function putValue(obj) {
	$("#employeeId").text(obj.eventid);
	$("#sex").text(obj.sex);
	$("#name").text(obj.name);
	$("#post").text(obj.post);
	$("#address").text(obj.address);
	$("#telephone").text(obj.telephone);
	$("#description").text(obj.description);
}