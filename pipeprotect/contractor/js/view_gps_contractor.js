
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
    getGpsContractorById();
    // 加载图片信息
    getPicListInfo(pkfield, "view");  // 不带描述信息  图片
    getFileListInfo(pkfield, "view"); // 附件信息
    masterTableChildHeight();	// 计算标签内容高度
    businessId = pkfield;
});

/**
 * @desc 获得数据
 */
function getGpsContractorById(){
    $.ajax({
        url : rootPath+"/contractor/get.do",
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
    $("#unitidname").html(jsondata.unitidname);
    $("#lineloopoidname").html(jsondata.lineloopoidname);
    $("#location").html(jsondata.location);
    $("#stakenumname").html(jsondata.stakenumname);
    $("#lon").html(jsondata.lon);
    $("#lat").html(jsondata.lat);
    $("#happenbegindate").html(jsondata.happenbegindate);
    $("#constructunit").html(jsondata.constructunit);
    $("#constructunituser").html(jsondata.constructunituser);
    $("#constructdescr").html(jsondata.constructdescr);
    $("#distanceline").html(jsondata.distanceline);
    $("#riskratingCodeName").html(jsondata.riskratingCodeName);
    $("#progressidCodeName").html(jsondata.progressidCodeName);
    $("#riskdescr").html(jsondata.riskdescr);
    $("#stationuser").html(jsondata.stationuser);
    $("#inspectoroidname").html(jsondata.inspectoroidname);
    $("#inspectorphone").html(jsondata.inspectorphone);
    $("#descr").html(jsondata.descr);
    $('#temporarykeypointoidname').html(jsondata.temporarykeypointoidname);
    $('#projectname').html(jsondata.projectname);
    $('#constructreason').html(jsondata.constructreasonname);
    $('#offset').html(jsondata.offset);
    $('#pointstation').html(jsondata.pointstation);

    $('#ownerUnitName').html(jsondata.ownerUnitName);
    $('#ownerContacts').html(jsondata.ownerContacts);
    $('#ownerContactsPhone').html(jsondata.ownerContactsPhone);
    $('#measures').html(jsondata.measures);
    $('#estimateEndDate').html(jsondata.estimateEndDate);
    $('#companyContacts').html(jsondata.companyContacts);
    $('#companyContactsPhone').html(jsondata.companyContactsPhone);
    $('#stationLeading').html(jsondata.stationLeading);
    $('#stationLeadingPhone').html(jsondata.stationLeadingPhone);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
    top. closeDlg("viewGpsContractor");
}

