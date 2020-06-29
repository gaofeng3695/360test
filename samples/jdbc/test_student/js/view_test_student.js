
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
	getTestStudentById();
	// 加载图片信息
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
});

/**
 * @desc 获得数据
 */
function getTestStudentById(){
	$.ajax({
		url : rootPath+"/teststudent/get.do",
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
	$("#studentName").html(jsondata.studentName);
	$("#studentCode").html(jsondata.studentCode);
	$("#sexCodeName").html(jsondata.sexCodeName);
	$("#birthday").html(jsondata.birthday);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewTestStudent");
}

