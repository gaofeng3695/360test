$(function(){
	initDatagrigHeight('loginLogTable', 'searchpanel', 70);
	
	$("#depart").combo({
		width : document.documentElement.clientWidth * 0.35
	});
	
	setComboObjWidth('depart',0.35,'combotree');
	
});
//校验用户名是否超长或用户名是否合法
function checkName(){
	var username = $("#username").val();
	if("" != username){
		if(getByteLen(username) > 50 ){
			alert("用户名超长");
			return false;
		}
		if( ! isValidUserName(username)){
			alert("用户名不合法");
			return false;
		}
	}
}

//得到字符串字节数（长度）
function getByteLen(val) {    //传入一个字符串
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角 
            len += 2; //如果是全角，占用两个字节
        else
            len += 1; //半角占用一个字节
    }
    return len;
 }

//校验用户名：不能输入'
function isValidUserName(s){
	if (s.indexOf('\'') >= 0) return false;
	return true;
}
//执行用户日志统计信息的查询方法
function executeQuery(){
	var username = $("#username").val();
	var depart = $("#depart").combotree('getText');
	
	$('#loginLogTable').datagrid('load',{
			isSearch: true,
			username: username,
			depart: depart
	});
}
//清空查询框
function clearAll(){
	$("#username").val("");
	$("#depart").combotree('setText',"");
}

function showrunqianreport(){
	var raqname = "demo/loginTimeReport.raq";
	top.getDlg("../report/runqianreport/showrunqianreport.htm?raqname="+raqname+"&random="+new Date().getTime(),"viewiframe","润乾报表",730,500);
}
function showrunqianreport1(){
	var raqname = "demo/zhuziReport.raq";
	top.getDlg("../report/runqianreport/showrunqianreport.htm?raqname="+raqname+"&random="+new Date().getTime(),"viewiframe","润乾报表",730,500);
}
function showcharts(){
	top.getDlg("showcharts.htm?random="+new Date().getTime(),"viewiframe","报表",710,355);
}
function showreport(i){
	top.getDlg("../report/showreport.htm?reporttype="+i,"viewiframe","报表",710,355);
}
