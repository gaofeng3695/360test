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

var loadPlanFlag = false;
var loadTaskFlag = false;
var loadPathFlag = false;
var loadDevicesFlag = false;
var loadRangeFlag = false;
/* 人员基础数据 */
var personBaseData = {};
/**
 * @desc 初始化
 */
$(document).ready(function(){
    getGpsInspectorById();
    /* 加载人员详情 */
    loadDetail();

    $('#tabPanel').tabs({
        border:false,
        onSelect:function(title){
            if ( title == '巡线计划' && !loadPlanFlag ) {
                loadPlan();
                loadPlanFlag = true;
            } else if ( title == '临时任务' && !loadTaskFlag ) {
                loadTask();
                loadTaskFlag = true;
            } else if ( title == '轨迹线' && !loadPathFlag ) {
                loadPath();
                loadPathFlag = true;
            } else if ( title == '设备信息' && !loadDevicesFlag ) {
                loadDevices();
                loadDevicesFlag = true;
            } else if ( title == '区段信息' && !loadRangeFlag ) {
                loadRange(personBaseData);
                loadRangeFlag = true;
            }
        }
    });

});

/**
 * 页面详情加载后执行
 */
function loadDetail(){
    $("#businessInfoFrame").prop('src','view_gps_inspector_detail.html?oid='+pkfield);
}

/**
 * 加载巡检计划
 */
function loadPlan(){
    $("#planInfoFrame").prop('src','view_gps_inspector_plan.html?oid='+pkfield+'&inspectorType='+personBaseData.inspectortype);
}

/**
 * 加载临时任务
 */
function loadTask(){
    $("#taskInfoFrame").prop('src','view_gps_inspector_task.html?oid='+pkfield);
}

/**
 * 加载轨迹线
 */
function loadPath(){
    $("#pathInfoFrame").prop('src','view_gps_inspector_path.html?oid='+pkfield);
}

/**
 * 加载设备
 */
function loadDevices(){
    $("#devicesInfoFrame").prop('src','view_gps_device.html?oid='+pkfield+'&deviceOid='+personBaseData.deviceoid);
}

/**
 * 加载区段
 */
function loadRange(personBaseData){
    $("#rangeInfoFrame").prop('src','view_gps_insrange_section.html?oid='+pkfield+'&inspectorType='+personBaseData.inspectortype+'&sign='+personBaseData.patrolObject);
}

/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewAll");
}

/**
 * @desc 获取人员基础数据
 */
function getGpsInspectorById(){
    $.ajax({
        url : rootPath+"/gpsinspector/get.do",
        data :{"oid" : pkfield},
        type : 'POST',
        dataType:"json",
        async:false,
        success : function(data) {
            if(data.status==1){
                personBaseData = data.data;
            }else{
                top.showAlert('错误', '查询出错', 'info');
            }
        },
        error : function(result) {
            top.showAlert('错误', '查询出错', 'info');
        }
    });
}


