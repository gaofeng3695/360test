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
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	//初始化部门下拉框
	initUnitComboTree('unitid');
	setComboObjWidth('unitid',0.281,'combobox');
	//初始化管线下拉框
	initLineLoopCombobox('lineloopoid');
	setComboObjWidth('lineloopoid',0.281,'combobox');
	showPan('beginlocation','endlocation','beginstation','endstation');
	getGpsUnsubinspectionById();

    /**
     * @desc 修改数据-保存
     */
    $("#saveButton").on("click", function(event){
        event.preventDefault();
        disableButtion("saveButton");
        var bool=$('#gpsUnsubinspectionForm').form('validate');
        if(bool==false){
            enableButtion("saveButton");
            return bool;
        }
        if(compareDate() < 0){
            enableButtion("saveButton");
            top.showAlert("提示", "有效期结束时间不能小于有效期起始时间，不能保存！", 'info');
            return false;
        }
        $.ajax({
            url : rootPath+"/gpsunsubinspection/update.do",
            type: "post",
            async: false,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data:JSON.stringify($('#gpsUnsubinspectionForm').serializeToJson()),
            success: function(data){
                if(data.status==1){
                    businessId=data.data;
                    top.showAlert("提示", "更新成功", 'info', function() {
                        reloadData("query_gps_unsubinspection.html","#gpsUnsubinspectiondatagrid");
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
    })

});




/**
 * @desc 获得数据
 */
function getGpsUnsubinspectionById(){
	$.ajax({
		url : rootPath+"/gpsunsubinspection/get.do",
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
	$('#beginstation').val(jsondata.beginstation);
	$('#endstation').val(jsondata.endstation);
	$('#beginlocation').val(jsondata.beginlocation);
	$('#endlocation').val(jsondata.endlocation);
	$('#begindate').val(jsondata.begindate);
	$('#enddate').val(jsondata.enddate);
	$('#description').val(jsondata.description);
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
			setComboObjWidth(id,0.281,'combobox');
		}
	}
}

function compareDate(){
	var startdate = $("#begindate").val();
	var enddate =   $("#enddate").val();
	startdate=Date.parse(new Date(startdate.replace(/-/g, "/")));
	enddate=Date.parse(new Date(enddate.replace(/-/g, "/")));
	var millTime=enddate-startdate;  //时间差的毫秒数
	return millTime;
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
			setComboObjWidth(id,0.281,'combobox');
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
	top. closeDlg("updateGpsUnsubinspection");
}


