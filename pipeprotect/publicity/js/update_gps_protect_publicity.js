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

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
    $('#highCode').hide();
    var comboxid='publicityType,';
    var singleDomainName='publicityType,';	// 单选值域
    loadSelectData(comboxid,singleDomainName);

	//初始化部门下拉框
	initLocalUnitComboTree('unitid');
	setComboObjWidth('unitid',0.273,'combobox');
	
	getGpsProtectPublicityById();
	getFileListInfo(pkfield, "update", {
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:20,  // 上传文件的个数 不传默认值为200
	},"1"); // 获取文件信息
	getPicListInfo(pkfield, "update", "", {
		//url : rootPath+"/attachment/upload.do",
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:20,  // 上传文件的个数 不传默认值为200
		extensions:"png", // 默认"gif,jpg,jpeg,bmp,png"
	},"2");


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
 * @desc 修改成功之后执行的函数
 */
function updateSuccessFun(){
	top.showAlert("提示", "更新成功", 'info', function() {
		//关闭弹出框
		reloadData("query_gps_protect_publicity.html","#gpsProtectPublicitydatagrid");
	    closePanel();
	});
}
/**
 * @desc 修改数据-保存
 */
function updateGpsProtectPublicity(){
	disableButtion("saveButton");
	var bool=$('#gpsProtectPublicityForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpsprotectpublicity/update.do",
		type: "post",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsProtectPublicityForm').serializeToJson()),
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
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initLocalUnitComboTree(unitid){
	/* 以下初始化查询面板 */
	/* 部门 */
	$('#'+unitid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName",
		onSelect:function(node) {
			loadSegment(node.id);
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		$('#'+unitid).combotree('loadData', result.data);

	})
	setComboObjWidth(unitid,0.172,'combobox');
}
/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$('#oid').val(jsondata.oid);
	$('#unitid').combotree('setValue',jsondata.unitid);
	$('#title').val(jsondata.title);
	$('#startdate').val(jsondata.startdate);
	$('#enddate').val(jsondata.enddate);
	$('#site').val(jsondata.site);
	$('#participant').val(jsondata.participant);
	$('#describe').val(jsondata.describe);
	$('#reportperson').val(jsondata.reportperson);
    $('#publicityType').combobox('setValue',jsondata.publicityType);

    /* 判断类型是否是高后果区类型 */
    if( jsondata.publicityType == '03' ) {
        $('#highCode').show();
    }

    /* 初始化高后果区编号下拉框 */
	loadSegment(jsondata.unitid);

    $('#rangeOid').combobox('setValue',jsondata.rangeOid);
}

/**
 * 重置部门后，重新加载
 */
function loadSegment(unitId) {
	/* 初始化高后果区编号下拉框 */
	$('#rangeOid').combobox({
		panelHeight:100,
		mode:'remote',
		url : rootPath+"/gpsinsrange/getGpsInspectorRangeSelect.do?unitId="+unitId+"&inspectorType=02&sign=02",
		valueField : 'oid',
		textField : 'segmentcode',
		onSelect : function(row){
		},
		onLoadSuccess:function(data){
			if(data.length>0){
			}
		}
	});
	$.post(rootPath+"/gpsinsrange/getGpsInspectorRangeSelect.do?unitId="+unitId+"&inspectorType=02&sign=02",function(result){
		console.log(result);
		$('#rangeOid').combotree('loadData', result.data);

	})
	setComboObjWidth('rangeOid',0.279,'combobox');
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
	top. closeDlg("updateGpsProtectPublicity");
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
            var id=select[i];
            $('#' + id).combobox({
                panelHeight:100,
                url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
                valueField : 'codeId',
                textField : 'codeName',
                onSelect : function(row){
					if( row.codeId == '03' ) {
						/* 如果选择是高后果区宣传，就要显示 */
						$('#highCode').show();
						$("#rangeOid").combobox({
							required: true,
						});
						setComboObjWidth('rangeOid',0.279,'combobox');
					} else {
						$('#highCode').hide();
						$("#rangeOid").combobox({
							required: false,
						});
					}
                },
                onLoadSuccess:function(data){
                    if(data.length>0){
                        // $('#'+id).combobox('setValue',data[0].codeId);
                    }
                }
            });
            setComboObjWidth(id,0.279,'combobox');
        }
    }
}
