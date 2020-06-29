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
/*	comboxid+='isGenTask'+',';
	singleDomainName+='subins_isgentask'+",";*/
	loadSelectData(comboxid,singleDomainName);
	//初始化部门下拉框
	initUnitComboTree('unitid');
	setComboObjWidth('unitid',0.281,'combobox');
	//初始化管线下拉框
    initLineLoopLocalComboTree('lineloopoid');
	setComboObjWidth('lineloopoid',0.281,'combobox');
	showPan('beginlocation','endlocation','beginstation','endstation');
	getGpsSubinsById();
});

function initLineLoopLocalComboTree(lineloopoid){
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
            if(beginStationNameid1 != ''){
                $('#'+beginStationNameid1).val('');
            }
            if(endStationNameid1 != ''){
                $('#'+endStationNameid1).val('');
            }
            if(beginStationid != ''){
                $('#'+beginStationid).val('');
            }
            if(endStationid != ''){
                $('#'+endStationid).val('');
            }
        },
        onLoadSuccess:function(node,data){
            $('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
        }
    });
    $.post(rootPath+'/gpslineloop/getAllLineLoopChildren.do',function(result){
        console.log(result);
        $('#'+lineloopoid).combotree('loadData', result.data);
    })
    setComboObjWidth(lineloopoid,0.205,'combobox');
}

/**
 * @desc 修改数据-保存
 */
function updateGpsSubins(){
	disableButtion("saveButton");
	var bool=$('#gpsSubinsForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpssubins/update.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsSubinsForm').serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
				top.showAlert("提示", "更新成功", 'info', function() {
					reloadData("query_gps_subins.html","#gpsSubinsdatagrid");
					closePanel();
				});
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
function getGpsSubinsById(){
	$.ajax({
		url : rootPath+"/gpssubins/get.do",
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
	$('#unitid').combotree('setValue',jsondata.unitid);
	$('#lineloopoid').combotree('setValue',jsondata.lineloopoid);
	$('#beginlocation').val(jsondata.beginlocation);
	$('#endlocation').val(jsondata.endlocation);
	$('#isGenTask').combobox('setValue',jsondata.isGenTask);
	$('#beginstation').val(jsondata.beginstation);
	$('#endstation').val(jsondata.endstation);
	/* 为了不让他提示选择管线 */
    lineloopoid1 = "lineloopoid";
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
	top. closeDlg("updateGpsSubins");
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
