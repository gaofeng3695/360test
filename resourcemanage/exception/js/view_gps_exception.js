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
    getGpsKeypointById();
    // 加载图片信息
   /* getPicListInfo(pkfield, "view");  // 不带描述信息  图片
    getFileListInfo(pkfield, "view"); // 附件信息*/
});

/**
 * @desc 获得数据
 */
function getGpsKeypointById(){
    $.ajax({
        url : rootPath+"/gpsinspector/exception/get.do",
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
    $("#unitid").html(jsondata.unitName);
    $("#inspectorid").html(jsondata.inspectorName);
    $("#beginDate").html(jsondata.beginDate);
    $("#endDate").html(jsondata.endDate);
    $("#safe").html(jsondata.safeName);
    $("#reason").html(jsondata.reason);
    $("#remarks").html(jsondata.remarks);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
    top. closeDlg("viewGpsException");
}