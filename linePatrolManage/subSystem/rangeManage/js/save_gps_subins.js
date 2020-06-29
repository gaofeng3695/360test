
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	/*comboxid+='isGenTask'+',';
	singleDomainName+='subins_isgentask'+",";*/
	loadSelectData(comboxid,singleDomainName);
	//初始化部门下拉框
    initLocalUnitComboTree('unitid');
	setComboObjWidth('unitid',0.281,'combobox');
	//初始化管线下拉框
    initLineLoopRangeComboTree('lineloopoid');
	setComboObjWidth('lineloopoid',0.281,'combobox');
	showPan('beginlocation','endlocation','beginstation','endstation');
});

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
            // $('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+node.id);

            //setComboObjWidth(lineloopoid,0.145,'combobox');
        }
    });
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        console.log(result);

        $('#'+unitid).combotree('loadData', result.data);

    })
    setComboObjWidth(unitid,0.172,'combobox');
}



/**
 * @desc 添加数据-保存
 */
function saveGpsSubins(){
	disableButtion("saveButton");
	var bool=$("#gpsSubinsForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpssubins/save.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsSubinsForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("query_gps_subins.html","#gpsSubinsdatagrid");
					closePanel();
				});
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
}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsSubins");
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
					//	$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.281,'combobox');
		}
	}
}