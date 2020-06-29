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
	var comboxid='';
	var singleDomainName='';	// 单选值域
	comboxid+='brandType,intackCondition'+',';
	singleDomainName+='markerbrand,intack'+",";
	loadSelectData(comboxid,singleDomainName);

    showMap();
    /* 部门 */
    initUnitComboTreeLocal('unitId');
    setComboObjWidth('unitId',0.281,'combobox');

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

	setComboObjWidth("lineloopoid",0.281,'combobox');
	
	 /* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
    $('#inspectorid').combobox({
        panelHeight:150,
        editable:true,
        mode:'remote',
      //  url : rootPath+'/xncommon/getUnitUserChildren.do?unitId='+unitId+'&inspectortype=01',
        valueField : "codeid",
        textField : "codename",
        onBeforeLoad:function(param){
			var inspectorid = $("#inspectorid").combobox("getValue");
		},
        onLoadSuccess:function(data){

        },
        onSelect : function(row){
        }
    });
    setComboObjWidth("inspectorid",0.281,'combobox');
    
    /* 初始化信息编号（桩号）*/
    $('#markerOid').combobox({
        panelHeight:100,
      //  url : rootPath+"gpsmarker/querySelectByLineloopAndName.do",
        valueField : 'codeid',
        textField : 'codename',
        mode:'remote',
        onBeforeLoad:function(param){
			var markerOid = $("#markerOid").combobox("getValue");
		},
        onSelect : function(row){
            /* 桩号选择完成后，把桩里程值自动赋值，赋值后，可以修改 */
            let lineId = $('#lineloopoid').combobox('getValue');
            $.get(rootPath+'gpsmarker/getMarkerListByOidAndLineLoop.do?oid='+row.codeid+"&lineloopid="+lineId,function(result) {
                $('#markerStation').val(result[0].markerstation);
            })
        },
        onLoadSuccess:function(){
        	
		},
    });
    setComboObjWidth('markerOid',0.281,'combobox');

	
    getGpsMarkerById();
    getFileListInfo(pkfield, "update", {
        moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
        fileNumLimit:20,  // 上传文件的个数 不传默认值为200
    },"1"); // 获取文件信息
    getPicListInfo(pkfield, "update", "", {
        //url : rootPath+"/attachment/upload.do",
        moduleCode:"pathLine", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
        fileNumLimit:20,  // 上传文件的个数 不传默认值为200
        extensions:"gif,jpg,jpeg,bmp,png", // 默认"gif,jpg,jpeg,bmp,png"
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
        reloadData("query_gps_marker_brand.html","#gpsMarkerBranddatagrid");
        closePanel();
    });
}

/**
 * @desc 修改数据-保存
 */
function updateGpsMarker(){
	disableButtion("saveButton");
	var bool=$('#gpsMarkerForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpsmarkerbrand/update.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsMarkerForm').serializeToJson()),
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
						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.281,'combobox');
		}
	}
}

/**
 * @desc 获得数据
 */
function getGpsMarkerById(){
	$.ajax({
		url : rootPath+"/gpsmarkerbrand/get.do",
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
	$('#oid').val(jsondata.oid);
    $('#unitId').combotree('setValue', jsondata.unitId);
    if(jsondata.unitId!=null){
    	  $('#inspectorid').combobox('reload', rootPath+'/xncommon/getUnitUserChildren.do?unitId='+jsondata.unitId+'&inspectortype=01');
    }
    $('#inspectorid').combobox('setValue',jsondata.inspectorid);
    $('#lineloopoid').combotree('setValue', jsondata.lineloopoid);
   
	$.post(rootPath+'/gpslineloop/getLineLoopChildren.do',function(result){
		$('#lineloopoid').combotree('loadData', result.data);
		
		/* 通过管件id获取所有的桩号 */
		$('#markerOid').combobox("reload",rootPath+'gpsmarker/querySelectByLineloopAndName.do?lineloopid='+jsondata.lineloopoid);
		//$('#inspectorid').combobox("reload",rootPath+'/xncommon/getUnitUserChildren.do?unitId='+unitId+'&inspectortype=01');

        if(result.data.length == 1 && result.data[0].text == null ) {

        }else {
            $('#lineloopoid').combotree('setValue', jsondata.lineloopoid);
        }
		
	})
    $('#brandType').combobox('setValue',jsondata.brandType);
    $('#coordinateInfo').val(jsondata.coordinateInfo);
    $('#markerOid').combobox('setValue',jsondata.markerOid);
    //$('#inspectorid').combobox('setValue',jsondata.inspectorid);
    $('#markerStation').val(jsondata.markerStation);
    $('#intackCondition').combobox('setValue',jsondata.intackCondition);
    $('#statisticsDate').val(jsondata.statisticsDate);
    $('#geographicalPosition').val(jsondata.geographicalPosition);
  //  $('#inspectorid').combobox('setValue',jsondata.inspectorid);
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
	top. closeDlg("updateGpsMarkerBrand");
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
    top.hideDlg('updateGpsMarkerBrand');
    top.getXY(getLocationCallBack);

}

function getLocationCallBack(obj){
    console.log('坐标是'+obj)
    $('#coordinateInfo').val(obj);
    top.showDlg("updateGpsMarkerBrand");

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
       /* onLoadSuccess:function(node,data){
             初始化部门 
            $('#unitid').combotree('setValue',user.unitId);
            
             加载人员 
            $('#inspectorid').combotree('reload', rootPath+'/xncommon/getUnitUserChildren.do?unitId='+node.id+'&inspectortype=01');
            $('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+node.id);
        },*/
        onSelect : function(row){
            /* 加载人员 */
        	$('#inspectorid').combobox("clear");
        	$('#lineloopoid').combotree("clear");
            $('#inspectorid').combobox('reload', rootPath+'/xncommon/getUnitUserChildren.do?unitId='+row.id+'&inspectortype=01');

            $('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+row.id);
        }
    });
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        
        $('#'+unitid).combotree('loadData', result.data);
    })
    setComboObjWidth(unitid,0.172,'combobox');
}


