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
var unitid = getParamter("unitid");
/**
 * @desc 初始化
 */
$(document).ready(function(){
    loadInfo();
    $('#tabPanel').tabs({
        border:false,
        onSelect:function(title){
            if ( title == '巡线工信息') {
                loadInfo();
            } else if ( title == '已绑定人员') {
                loadSelected();
            } 
        }
    });

});

/**
 * 巡线工信息
 */
function loadInfo(){
    $("#inspectorInfoFrame").prop('src','select_gps_inspector_info.html?oid='+pkfield+'&unitid='+unitid);
}

/**
 * 已选择人员
 */
function loadSelected(){
    $("#selectedInfoFrame").prop('src','select_gps_inspector_ed.html?oid='+pkfield+'&unitid='+unitid);
}

/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("selectInspector");
}
