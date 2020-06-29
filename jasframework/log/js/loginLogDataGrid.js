$(function(){
	initDatagrigHeight('loginLogTable', 'searchpanel', 90);
	
	
	setComboObjWidth('depart',0.35,'combotree');
	setComboObjWidth('beginDate',0.35,'datetimebox');
	setComboObjWidth('endDate',0.35,'datetimebox');
});

//验证用户名是否超长以及用户名是否合法。
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

//校验用户名：不能包含字符'
function isValidUserName(s){
	if (s.indexOf('\'') >= 0) return false;
	return true;
}
//执行登录日志的查询方法
function loginLogExecuteQuery(){
	var username = $("#username").val();
	var depart = $("#depart").combotree('getText');
	var beginDate = $("#beginDate").datetimebox('getText');
	var endDate = $("#endDate").datetimebox('getText');

//alert(typeof beginDate);
	if( ! isValidUserName(username)){
		alert("用户名不合法");
		return false;
	}
	if("" != beginDate && "" != endDate){
		if(!comptime(beginDate,endDate)){
			alert('开始时间大于结束时间,请重新选择！');
			return false;
		}
	}
	$('#loginLogTable').datagrid('load',{
		isSearch: true,
		username: username,
		depart: depart,
		beginDate:beginDate,
		endDate:endDate
	});
}
//清空查询框中的值
function loginLogClearAll(){
	$("#username").val("");
	$("#depart").combotree('setText',"");
	$("#beginDate").datetimebox('setText','');
	$("#endDate").datetimebox('setText','');
}
//比较2012-01-01类型的日期大小
function compareDate(begin,end){
	//将字符串转换为日期 
    var begin=new Date(begin.replace(/-/g,"/")); //将2012-01-01转换为Date
    var end=new Date(end.replace(/-/g,"/"));
    if(begin-end>0){
       alert("开始日期不能大于结束日期");
       return false;
    }
    return true;
}
//比较datetimebox中得到的日期时间的大小，begin<end返回true，否则为false
function comptime(beginTime,endTime) {
    var beginTimes = beginTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');

    beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);

    var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
    if (a < 0) {
        //alert("endTime小!");
    	return false;
    } else if (a > 0) {
        //alert("endTime大!");
    	return true;
    } else if (a == 0) {
        //alert("时间相等!");
    	return true;
    } else {
    	alert("exception");
        return false;
    }
}



