
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var businessId;    // 附件上传业务ID
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	comboxid+='brandType,intackCondition'+',';
	singleDomainName+='markerbrand,intack'+",";
	loadSelectData(comboxid,singleDomainName);

	/* 给统计日期默认赋值为当天 */
	let currentDate = new Date().format("yyyy-MM-dd");
	$('#statisticsDate').val( currentDate );
    var userArray = [];
    userArray.push(user);

    /* 部门 */
    initUnitComboTreeLocal('unitId');
    setComboObjWidth('unitId',0.281,'combobox');
	/* 初始化部门 */
	$('#unitid').combotree('setValue',user.unitId);
    /* 管线 */
	$('#lineloopoid').combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		//url : rootPath+'/gpslineloop/queryLoopSelectData.do',
		valueField : "codeid",
		textField : "codename",
		onBeforeSelect: function (node) {
			if(node.children == null || node.children.length > 0){
					return false;
			}
		},
		onSelect : function(row){
				/* 清空 */
			$('#markerOid').combobox("clear");
			/* 发送请求，获取桩号 */
			$('#markerOid').combobox("reload",rootPath+'gpsmarker/querySelectByLineloopAndName.do?lineloopid='+row.id);
		
		},
		onLoadSuccess:function(node,data){
			$('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
		}
	});
	
	$.post(rootPath+'/gpslineloop/getLineLoopChildren.do',function(result){
		console.log(result);
		if(result.data.length == 1 && result.data[0].text == null ) {

        }else {
            $('#lineloopoid').combotree('loadData', result.data);
        }
	})
	setComboObjWidth("lineloopoid",0.281,'combobox');
	
    showMap();

    /* 初始化部门 */
    $('#unitId').combotree('setValue',user.unitId);

    /* 初始化信息编号（桩号）*/
    $('#markerOid').combobox({
        panelHeight:100,
        //url : rootPath+"gpsmarker/querySelectByLineloopAndName.do",
        valueField : 'codeid',
        textField : 'codename',
        mode:'remote',
        onSelect : function(row){
        	/* 桩号选择完成后，把桩里程值自动赋值，赋值后，可以修改 */
        	let lineId = $('#lineloopoid').combobox('getValue');
        	$.get(rootPath+'gpsmarker/getMarkerListByOidAndLineLoop.do?oid='+row.codeid+"&lineloopid="+lineId,function(result) {
        	    $('#markerStation').val(result[0].markerstation);
			})
        },
        onLoadSuccess:function(data){
        }
    });
    setComboObjWidth('markerOid',0.281,'combobox');


    // 不带描述信息的图片上传    // 先执行的没有执行成功事件
    $("#picUpload").initializeWebUploader({
        fileType:"pic",
        addDesc:"false",
        uploadBtn:"#saveButton",
        url : rootPath+"/attachment/upload.do",
        moduleCode:"samples",

		fileNumLimit:20,  // 上传文件的个数不传有默认值200
//		extensions:"png", // 上传文件的后缀 不传有默认值

        picAndFile:"all", // 图片和附件同时存在     标识

        uploadBeforeFun:function(){
            var bsId = saveBaseInfo();
            return bsId;
        }
        // 这里没有执行成功事件
    });

    // 带描述信息的文件上传    // 后执行的没有上传按钮
    $("#fileUpload").initializeWebUploader({
        fileType:"file",
        addDesc:"true",
        // 这里没有开始上传事件的触发按钮
        url : rootPath+"/attachment/upload.do",
        moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default

		fileNumLimit:20,  // 上传文件的个数 不传默认值为200
//		extensions:"doc,docx", // 上传文件的后缀 不传默认值为'doc,docx,xlsx,xls,pdf,zip,ppt,pptx'

        picAndFile:"all", // 图片和附件同时存在     标识

        uploadBeforeFun:function(){
            var bsId = saveBaseInfo();
            return bsId;
        },
        uploadSuccessFun:function(){
            top.showAlert("提示", "保存成功", 'info', function() {
                reloadData("query_gps_marker_brand.html","#gpsMarkerBranddatagrid");
                closePanel();
            });
        }
    });
});


/**
 * @desc 保存基本信息获取业务id
 */
function saveBaseInfo(){
    var  bID = null;
    if(isNull(businessId)){
        bID = saveGpsMarker();  // sava()保存基本信息函数，返回业务id
    }else{
        bID = businessId;
    }
    return bID;
}

/**
 * @desc 添加数据-保存
 */
function saveGpsMarker(){
	disableButtion("saveButton");
	var bool=$("#gpsMarkerForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpsmarkerbrand/save.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsMarkerForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
                businessId=data.data;

			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
    return businessId;
}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsMarkerBrand");
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
			setComboObjWidth(id,0.281,'combobox');
		}
	}
}



function showMap(){
    $('#location').on('click',function(){
        addLocation();
    })
}

/* 添加位置坐标 */
function addLocation(){
    /* 打开地图 */
    top.map.show = true;
    top.hideDlg('addGpsMarkerBrand');
    top.getXY(getLocationCallBack);

}

function getLocationCallBack(obj){
    console.log('坐标是'+obj)
    $('#coordinateInfo').val(obj);
    top.showDlg("addGpsMarkerBrand");

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
        onLoadSuccess:function(node,data){
            /* 初始化部门 */
            $('#unitid').combotree('setValue',user.unitId);
            initInspection(user.unitId);
        },
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
    setComboObjWidth(unitid,0.172,'combobox');
}


/**
 * 初始化巡检人员
 * @returns
 */
function initInspection(unitId){
    /* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
    $('#inspectorid').combobox({
        panelHeight:150,
        editable:true,
        mode:'remote',
        url : rootPath+'/xncommon/getUnitUserChildren.do?unitId='+unitId+'&inspectortype=01',
        valueField : "codeid",
        textField : "codename",
        onLoadSuccess:function(data){

        },
        onSelect : function(row){
        }
    });
    setComboObjWidth("inspectorid",0.281,'combobox');
}