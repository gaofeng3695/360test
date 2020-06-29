/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID

var businessId = "";	// 用于附件判断业务ID
var user = JSON.parse(sessionStorage.user);
/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
    var comboxid='';
    var singleDomainName='';	// 单选值域
    var morecomboxid='';
    var moreDomainName='';	// 多选值域
    loadSelectData(comboxid,singleDomainName);
    loadMoreSelectData(morecomboxid,moreDomainName);
    var user = JSON.parse(sessionStorage.user);
    var userArray = [];
    userArray.push(user);
    /* 部门 */
    initUnitComboTreeLocal('unitid');
    setComboObjWidth('unitid',0.275,'combobox');
    /* 初始化部门 */
    $('#unitid').combotree('setValue',user.unitId);

    getGpsKeypointById();

    getFileListInfo(pkfield, "update", {
        moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
        fileNumLimit:20,  // 上传文件的个数 不传默认值为200
    },"1"); // 获取文件信息
    getPicListInfo(pkfield, "update", "", {
        //url : rootPath+"/attachment/upload.do",
        moduleCode:"pathLine", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
        fileNumLimit:20,  // 上传文件的个数 不传默认值为200
        // extensions:"png", // 默认"gif,jpg,jpeg,bmp,png"
    },"2");

  //  $('.content-area').css("height",($('.content-area').height() - 30)+'px');
});

/**
 * @desc 上传图片执行成功之后上传附件
 */
function updatePicSuccessFun(){
    updateFileFun(updateSuccessFun);
}

/**
 * @desc 上传附件执行成功之后上传图片
 */
function  updateFileSuccessFun(){
    updatePicFun(updateSuccessFun);
}

/**
 * 修改combobox样式
 * @returns
 */
function updateComboboxStyle(){
    let width = $('.textbox.combo').css('width');
    width = width.substring(0,width.lastIndexOf('px'));
    $('.textbox.combo').css('width',parseInt(width)-6);
}

/**
 * @desc 修改成功之后执行的函数
 */
function updateSuccessFun(){
    top.showAlert("提示", "更新成功", 'info', function() {
        //关闭弹出框
        reloadData("query_gps_vacation.html","#gpsVacationdatagrid");
        closePanel();
    });
}
/**
 * @desc 修改数据-保存
 */
function updateGpsKeypoint(){
    disableButtion("saveButton");
    var bool=$('#gpsVacationForm').form('validate');

    if(bool==false){
        enableButtion("saveButton");
        return bool;
    }

    /* 判断结束时间是否大于开始时间 */
    if(compareDate()){
        alert('结束时间必须大于或者等于开始时间');
        enableButtion("saveButton");
        return false;
    }

    $.ajax({
        url : rootPath+"/inspector/vacation/update.do",
        type: "post",
        async: false,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data:JSON.stringify($('#gpsVacationForm').serializeToJson()),
        success: function(data){
            if(data.status==1){
                businessId=data.data;
                updateFileFun(updateFileSuccessFun);  // 先上传附件 后上传图片
            }else if(data.code == "400") {
                top.showAlert("提示", "更新失败", 'error');
                enableButtion("saveButton");
            }else{
                top.showAlert("提示", data.msg, 'info');
                enableButtion("saveButton");
            }
        }
    });
    enableButtion("saveButton");
}


/**
 * @desc 加载新增，修改下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param singeleDomainName 值域名称，以逗号隔开
 */
function loadSelectData(comboxid,singleDomainName){
    if(comboxid!='' && comboxid !=undefined){
        var select =comboxid.split(",");
        var singleDomainNameArr = singleDomainName.split(",");
        for(var i=0;i<select.length-1;i++){
            var id=select[i];
            $('#' + id).combobox({
                panelHeight:100,
                url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
                valueField : 'codeId',
                textField : 'codeName',
                onSelect : function(row){
                    //保存个性表单的值域value值
                    $('#'+id).val(row.codeId);
                    $('#'+id+'ID').val(row.codeName);
                },
                onLoadSuccess:function(data){
                    if(data.length>0){
                        // $('#'+id).combobox('setValue',data[0].codeId);
                    }
                }
            });
            setComboObjWidth(id,0.275,'combobox');
        }
    }
}

/**
 * @desc 获得数据
 */
function getGpsKeypointById(){
    $.ajax({
        url : rootPath+"/inspector/vacation/get.do",
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
 * @desc 加载新增，修改多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
    if(comboxid!='' && comboxid !=undefined){
        var select =comboxid.split(",");
        var moreDomainNameArr = moreDomainName.split(",");
        for(var i=0;i<select.length-1;i++){
            var id=select[i];
            $('#' + id).combobox({
                panelHeight:100,
                multiple:true,
                url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
                valueField : 'codeId',
                textField : 'codeName',
                onSelect : function(row){
                    //保存个性表单的值域value值
                    $('#'+id).val(row.codeId);
                    $('#'+id+'ID').val(row.codeName);
                },
                onLoadSuccess:function(data){
                    if(data.length>0){
                        $('#' + id).combobox('setValue',data[0].codeId);
                    }
                }
            });
            setComboObjWidth(id,0.29,'combobox');
        }
    }
}

/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
    $('#oid').val(jsondata.oid);
    $('#beginDate').val(jsondata.beginDate);
    $('#endDate').val(jsondata.endDate);
    $('#reason').val(jsondata.reason);
    $('#remarks').val(jsondata.remarks);
    $('#unitid').combotree('setValue', jsondata.unitId);
    $('#safe').combobox('setValue', jsondata.safe);


    /* 人员，根据当前用户所在的部门获取到本部门和下级部门所有的人员（巡检人员），支持模糊搜索  */
    initInspection(jsondata.unitId, jsondata.inspectorid);

    /* 默认只取了10条人员数据，所以有可能出现人员并不在下拉框的情况；可以获取当前选中的人员，将其也集成到下拉框中，避免出现只显示oid的情况 。  */
    let inspectorArray = [];
    let inspectorObject = {};
    inspectorObject.codeid = jsondata.inspectorid;
    inspectorObject.codename = jsondata.inspectorName;
    inspectorArray.push(inspectorObject);

    $('#inspectorid').combobox('loadData', inspectorArray);
    $('#inspectorid').combobox('setValue', jsondata.inspectorid);

}

/**
 * @desc 重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl, elementId) {
    var fra = parent.$("iframe");
    for ( var i = 0; i < fra.length; i++) {
        if (fra[i].src.indexOf(shortUrl) != -1) {
            fra[i].contentWindow.$(elementId).datagrid("reload");
        }
    }
}
/**
 * @desc 关闭修改页面
 */
function closePanel() {
    top. closeDlg("updateGpsVacation");
}

/**
 * 比较时间
 */
function compareDate(){
    console.log('验证时间要大于或者等于当前时间');
    /* 获取起始时间 */
    let beginDate = $('#beginDate').val();
    /* 获取结束时间 */
    let endDate = $('#endDate').val();
    if(beginDate > endDate)
        return true;
    else
        return false;
}

/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTreeLocal(unitid){
    /* 以下初始化查询面板 */
    /* 部门 */
    $('#'+unitid).combotree({
        panelHeight:150,
        editable:true,
        mode:'remote',
        valueField : "oid",
        textField : "unitName",
        onSelect : function(row){

            /* 加载人员 */
            initInspection(row.id);
            $('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+row.id);
        }
    });
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        console.log(result);

        $('#'+unitid).combotree('loadData', result.data);
    })
    setComboObjWidth(unitid,0.275,'combobox');
}

/**
 * 初始化巡检人员
 * @returns
 */
function initInspection(unitId, inspectorId){
    $('#inspectorid').combobox({
        panelHeight:150,
        url : rootPath+'/gpsconstruction/getInspectorByUnit.do?unitid='+unitId+'&inspectortype=01',
        valueField : "oid",
        textField : "insname",
    });
    setComboObjWidth('inspectorid',0.275,'combobox');
}
