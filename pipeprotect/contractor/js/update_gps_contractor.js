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

//当前登陆用户
var user = JSON.parse(sessionStorage.user);

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
    var comboxid='';
    var singleDomainName='';	// 单选值域
    var morecomboxid='';
    var moreDomainName='';	// 多选值域
    comboxid+='riskrating'+',';
    singleDomainName+='construnctionRiskLevel'+","
    comboxid+='constructreason'+',';
    singleDomainName+='construnctionReason'+","
    comboxid+='progressid'+',';
    singleDomainName+='construnctionProgress'+","
    loadSelectData(comboxid,singleDomainName);
    loadMoreSelectData(morecomboxid,moreDomainName);

    showMap();
    initMarker();
    initInspector();
    //初始化部门
    initUnitComboTree('unitid');
    setComboObjWidth('unitid',0.270,'combobox');

    getFileListInfo(pkfield, "update", {
        moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
        fileNumLimit:20,  // 上传文件的个数 不传默认值为200
    },"1"); // 获取文件信息
    getPicListInfo(pkfield, "update", "", {
        //url : rootPath+"/attachment/upload.do",
        moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
        fileNumLimit:20,  // 上传文件的个数 不传默认值为200
//		extensions:"png", // 默认"gif,jpg,jpeg,bmp,png"
    },"2");
});

/* 初始化桩 */
function initMarker(){
    $('#stakenum').combobox({
        panelHeight:150,
        editable:true,
        valueField : "codeid",
        textField : "codename"
    });
    setComboObjWidth('stakenum',0.270,'combobox');
}

function getMarker(lineloopid, stakenum){
    $('#stakenum').combobox({
        panelHeight:150,
        editable:true,
        url : rootPath+'/gpsmarker/querySelectByLineloopAndType.do?lineloopid='+lineloopid+'&unitid='+$('#unitid').combotree('getValue')+'&markerOid='+$('#stakenum').combobox('getValue'),
        valueField : "codeid",
        textField : "codename",
        onLoadSuccess:function(node,data){
            $('#stakenum').combobox("clear");
            $('#stakenum').combobox('setValue',stakenum);
        }
    });
    setComboObjWidth('stakenum',0.270,'combobox');
}

function initInspector(){
    $('#inspectoroid').combobox({
        panelHeight:150,
        editable:true,
        valueField : "codeid",
        textField : "codename"
    });
    setComboObjWidth('inspectoroid',0.270,'combobox');
}

function getInspector(unitid,inspectoroid){
    $('#inspectoroid').combobox({
        panelHeight:100,
        url : rootPath+"gpsconstruction/getInspectorByUnit.do?unitid="+unitid+"&inspectortype=01",
        valueField : 'oid',
        textField : 'insname',
        onLoadSuccess:function(node,data){
            $('#inspectoroid').combobox('setValue',inspectoroid);
        }
    });
    setComboObjWidth('inspectoroid',0.270,'combobox');
}

function initLineLoopComboTree(lineloopoid){
    /* 以下初始化查询面板 */
    $('#'+lineloopoid).combotree({
        panelHeight:150,
        editable:true,
        mode:'remote',
        valueField : "id",
        textField : "text",
        onBeforeSelect: function (node) {
            if(node.children == null || node.children.length > 0){
                return false;
            }
        },
        onSelect:function(node){
            /* 发送请求，获取桩号 */
            getMarker(node.id);
        },
        onLoadSuccess:function(data){
            $('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
            getGpsContractorById();
        }
    });
    $.post(rootPath+'/gpslineloop/getLineLoopChildren.do',function(result){
        console.log(result);
        $('#'+lineloopoid).combotree('loadData', result.data);
    })
}



/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTree(unitid){
    /* 以下初始化查询面板 */
    /* 部门 */
    $('#'+unitid).combotree({
        panelHeight:150,
        editable:true,
        mode:'remote',
        valueField : "oid",
        textField : "unitName",
        onSelect:function(node){
            getInspector(node.id);
        },
        onLoadSuccess:function(data){
//			$('#'+unitid).combotree('setValue', user.unitId);
//			getInspector(user.unitId);
            //初始化管线
            initLineLoopComboTree('lineloopoid');
            setComboObjWidth('lineloopoid',0.270,'combobox');
        }
    });
    $.ajaxSettings.async = false;
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        console.log(result);
        $('#'+unitid).combotree('loadData', result.data);
    })
    setComboObjWidth(unitid,0.270,'combobox');
}

function distancelinechange(){
    if($.trim($('#distanceline').val()) == ""){
        $('#riskrating').combobox('setValue', null);
        $('#riskratingreal').val();
        return;
    }
    var value = Number($('#distanceline').val());
    if(isNaN(value)){
        $('#riskrating').combobox('setValue', null);
        $('#riskratingreal').val();
        return;
    }

    if(value <= 5){
        $('#riskrating').combobox('setValue', '01');
        $('#riskratingreal').val('01');
    }else if(value > 5 && value <=50){
        $('#riskrating').combobox('setValue', '02');
        $('#riskratingreal').val('02');
    }else if(value > 50){
        $('#riskrating').combobox('setValue', '03');
        $('#riskratingreal').val('03');
    }
}

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
 * @desc 修改成功之后执行的函数
 */
function updateSuccessFun(){
    top.showAlert("提示", "更新成功", 'info', function() {
        //关闭弹出框
        reloadData("query_gps_contractor.html","#gpsContractordatagrid");
        closePanel();
    });
}

function temporarykeypoint(){
    if($('#unitid').combotree('getValue') == null || $('#unitid').combotree('getValue') == ''){
        top.showAlert("提示", "请先选择部门！", 'info');
        return;
    }
    if($('#inspectoroid').combobox('getValue') == null || $('#inspectoroid').combobox('getValue') == ''){
        top.showAlert("提示", "请先选择现场监护人员！", 'info');
        return;
    }
    if($('#lon').val() == null || $('#lon').val() == '' || $('#lat').val() == null || $('#lat').val() == ''){
        top.showAlert("提示", "请先选择坐标！", 'info');
        return;
    }
    if($('#temporarykeypointoid').val() == null || $('#temporarykeypointoid').val() == ''){
        top.getDlg("../../linePatrolManage/insTask/temporaryKeypoint/save_gps_temporary_keypoint_construct.html?lon="+$('#lon').val()+"&lat="+$('#lat').val()
            +"&inspectoroid="+$('#inspectoroid').combobox('getValue')+"&unitid="+$('#unitid').combotree('getValue')+"&consDialogname=updateGpsConstruction"
            +"&temporarykeypointtype=03",
            "addGpsTemporaryKeypointconstruct","添加临时关键点",800,600,false,true,true);
    }else{
        top.getDlg("../../linePatrolManage/insTask/temporaryKeypoint/update_gps_temporary_keypoint_construct.html?oid="+$('#temporarykeypointoid').val()
            +"&consDialogname=updateGpsConstruction&temporarykeypointtype=03","updateGpsTemporaryKeypointconstruct","修改临时关键点",800,600,false,true,true);
    }
}

function temporarykeypointcallback(temporarykeypointoid, temporarykeypointoidname){
    $('#temporarykeypointoid').val(temporarykeypointoid);
    $('#temporarykeypointoidname').val(temporarykeypointoidname);
}

/**
 * @desc 修改数据-保存
 */
function updateGpsContractor(){
    disableButtion("saveButton");
    var bool=$('#gpsContractorForm').form('validate');
    if(bool==false){
        enableButtion("saveButton");
        return bool;
    }
    $.ajax({
        url : rootPath+"/contractor/update.do",
        type: "post",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data:JSON.stringify($('#gpsContractorForm').serializeToJson()),
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
 * @desc 获得数据
 */
function getGpsContractorById(){
    $.ajax({
        url : rootPath+"/contractor/get.do",
        data :{"oid" : pkfield},
        type : 'POST',
        dataType:"json",
        async:false,
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
    $('#oid').val(jsondata.oid);
    $('#unitid').combotree('setValue',jsondata.unitid);
    setComboObjWidth('unitid',0.270,'combobox');
    $('#lineloopoid').combotree('setValue',jsondata.lineloopoid);
    setComboObjWidth('lineloopoid',0.270,'combobox');
    $('#location').val(jsondata.location);
    getMarker(jsondata.lineloopoid, jsondata.stakenum);
    $('#lon').val(jsondata.lon);
    $('#lat').val(jsondata.lat);
    $('#happenbegindate').val(jsondata.happenbegindate);
    $('#constructunit').val(jsondata.constructunit);
    $('#constructunituser').val(jsondata.constructunituser);
    $('#constructdescr').val(jsondata.constructdescr);
    $('#distanceline').val(jsondata.distanceline);
    $('#riskrating').combobox('setValue',jsondata.riskrating);
    $('#progressid').combobox('setValue',jsondata.progressid);
    $('#constructreason').combobox('setValue',jsondata.constructreason);
    $('#projectname').val(jsondata.projectname);
    $('#riskdescr').val(jsondata.riskdescr);
    $('#stationuser').val(jsondata.stationuser);
    getInspector(jsondata.unitid,jsondata.inspectoroid);
    $('#inspectorphone').val(jsondata.inspectorphone);
    $('#descr').val(jsondata.descr);
    $('#temporarykeypointoidname').val(jsondata.temporarykeypointoidname);
    $('#temporarykeypointoid').val(jsondata.temporarykeypointoid);
    $('#offset').val(jsondata.offset);
    $('#pointstation').val(jsondata.pointstation);

    $('#ownerUnitName').val(jsondata.ownerUnitName);
    $('#ownerContacts').val(jsondata.ownerContacts);
    $('#ownerContactsPhone').val(jsondata.ownerContactsPhone);
    $('#measures').val(jsondata.measures);
    $('#estimateEndDate').val(jsondata.estimateEndDate);
    $('#companyContacts').val(jsondata.companyContacts);
    $('#companyContactsPhone').val(jsondata.companyContactsPhone);
    $('#stationLeading').val(jsondata.stationLeading);
    $('#stationLeadingPhone').val(jsondata.stationLeadingPhone);
}

/**
 * @desc 加载新增，修改单选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param singleDomainName 值域名称，以逗号隔开
 */
function loadSelectData(comboxid,singleDomainName){
    if(comboxid!='' && comboxid !=undefined){
        var select = comboxid.split(",");
        var singleDomainNameArr = singleDomainName.split(",");
        for(var i=0;i<select.length-1;i++){
            if(singleDomainNameArr[i]==''){
                continue;
            }
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
                        $('#'+id).combobox('setValue',data[0].codeId);
                    }
                }
            });
            setComboObjWidth(id,0.270,'combobox');
        }
    }
}

/**
 * @desc 加载新增，修改多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
    if(comboxid!='' && comboxid !=undefined){
        var select = comboxid.split(",");
        var moreDomainNameArr = moreDomainName.split(",");
        for(var i=0;i<select.length-1;i++){
            if(moreDomainNameArr[i]==''){
                continue;
            }
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
            setComboObjWidth(id,0.270,'combobox');
        }
    }
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
    top. closeDlg("updateGpsContractor");
}

function showMap(){
    $('#locationXY').on('click',function(){
        addLocation();
    })
}

//弹出加载层
function load(message) {
    $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
    $("<div class=\"datagrid-mask-msg\"></div>").html(message).appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });
}
//取消加载层
function disLoad() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}

function showCursor(){
    disLoad();
    top.hideDlg('updateGpsContractor');

    let fra = parent.$("iframe");
    for ( let i = 0; i < fra.length; i++) {
        if (fra[i].id == 'frm2d') {
            fra[i].contentWindow.getXY(getLocationCallBack);
        }
    }


}

/* 添加位置坐标 */
function addLocation(){
    /* 打开地图 */
    if(!top.toShow2d){
        /* 显示二维地图 */
        if(typeof showmap2d != 'undefined'){
            showmap2d();
        }else{
            top.showmap2d();
        }

        load("正在加载地图，请稍后...");
        setTimeout('showCursor()',4000);
    }else{
        showCursor();
    }

}

function getLocationCallBack(obj){
    console.log('坐标是'+obj)
    let xy = obj.split(',');
    let x = xy[0];
    let y = xy[1];
    /* 给input赋值 */
    $('#lon').val(x);
    $('#lat').val(y);
    top.showDlg("updateGpsContractor");

    top.tab.delMapTab('2d');
}



function check() {
    /* 获取桩的id值 */
    let lineloopoid = $('#lineloopoid').combobox('getValue');
    if (lineloopoid == undefined | lineloopoid =="" ){
        top.showAlert('提示', '请选择管线', 'info');
        return;
    }
    let stakenum = $('#stakenum').combobox('getValue');
    if (stakenum == undefined | stakenum == ""){
        top.showAlert('提示', '请选择桩', 'info');
        return;
    }
    $.get(rootPath+'/gpsmarker/getMarkerListByOidAndLineLoop.do?oid='+stakenum+"&lineloopid="+lineloopoid,function(result){
        // let data = result.data;
        let data = result[0];
        let mileage = data.markerstation;
        let markername = data.markername;
        /* 得到偏移量,如果偏移量是正数，位置描述=桩里程值+偏移量；如果是负数，位置描述=桩里程值-偏移量 */
        let offset = 0;
        if( $('#offset').val() !== '' && $('#offset').val() != undefined ){
            offset = parseFloat($('#offset').val().trim());
        }
        /* 给关键点赋值里程值 */
        $('#pointstation').val(mileage + offset);
    })
}