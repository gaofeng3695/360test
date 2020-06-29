
/**
 * @file
 * @author 作者
 * @desc 查看页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID
var businessId = "";
/**
 * @desc 初始化
 */
$(document).ready(function(){
	getGpsInspectorById();
});

/**
 * @desc 获得数据
 */
function getGpsInspectorById(){
	$.ajax({
		url : rootPath+"/gpsinspector/get.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}
/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$("#unitname").html(jsondata.unitname);
	$("#insnamePlumber").html(jsondata.insnamePlumber);
	$("#sexName").html(jsondata.sexName);
	$("#phone").html(jsondata.phone);
	$("#deviceCode").html(jsondata.deviceCode);
	/*$("#insfreqName").html(jsondata.insfreqName);*/
	$("#instypeCodeName").html(jsondata.instypeCodeName);
	$("#adddate").html(jsondata.adddate);
	$("#identitycard").html(jsondata.identitycard);
	$("#homeaddress").html(jsondata.homeaddress);
	$("#description").html(jsondata.description);

	$('#taskTime').val(jsondata.taskTime);
	/* 如果taskTime不为空，加载具体巡检时间  */
	if(jsondata.taskTime!= null&& jsondata.taskTime!= ''){
		showTaskTime();
	}
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsInspector");
}


/**
 * 展示巡检时间
 * @returns
 */
function showTaskTime(){
	/* 取taskTime的值 */
	let taskTime = $('#taskTime').val();
	if(taskTime != ''){
		let taskTimeArray = JSON.parse(taskTime);
		for(let i = taskTimeArray.length-1; i>= 0; i--){
			createTaskTimeNode(taskTimeArray[i].startTime, taskTimeArray[i].endTime, i);
		}
	}
}

/**
 * 创建展示节点
 * @param startTime
 * @param endTime
 * @returns
 */
function createTaskTimeNode(startTime, endTime,i){
	let node = '<tr class=\"show-node\">';
	node += '<th width="15%"><span>第'+(i+1)+'次巡检开始时间：</span></th>';
	node += '<td width="35%"><span>'+startTime+'</span></td>';
	node += '<th width="15%"><span>第'+(i+1)+'次巡检结束时间：</span></th>';
	node += '<td width="35%"><span>'+endTime+'</span></td>';
	node += '</tr>';
	$('#taskTimeNode').after(node);
}
