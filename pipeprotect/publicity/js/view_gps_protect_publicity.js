
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
	$('.highCode').hide();
	getGpsProtectPublicityById();
	// 加载图片信息
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
});

/**
 * @desc 获得数据
 */
function getGpsProtectPublicityById(){
	$.ajax({
		url : rootPath+"/gpsprotectpublicity/get.do",
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
	$("#unitid").html(jsondata.unitname);
	$("#title").html(jsondata.title);
	$("#startdate").html(jsondata.startdate);
	$("#enddate").html(jsondata.enddate);
	$("#site").html(jsondata.site);
	$("#participant").html(jsondata.participant);
	$("#describe").html(jsondata.describe);
	$("#reportperson").html(jsondata.reportperson);
	$("#sharestatus").html(jsondata.sharestatusName);
	$("#sharespeople").html(jsondata.sharespeopleName);
	$("#sharestime").html(jsondata.sharestime);
	$("#publicityType").html(jsondata.publicityTypeName);
	$("#rangeCode").html(jsondata.rangeCode);

    /* 判断类型是否是高后果区类型 */
    if( jsondata.publicityType == '03' ) {
        $('.highCode').show();
    }
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsProtectPublicity");
}

