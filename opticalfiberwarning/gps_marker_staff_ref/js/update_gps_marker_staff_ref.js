/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID
//当前登陆用户
var user = JSON.parse(sessionStorage.user);
var businessId = "";	// 用于附件判断业务ID
var stationMasterComboData =[];
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

	$('#stationMaster').combobox({
		onChange:function () {
			var oid = $('#stationMaster').combobox('getValue');
			var data = {};
			data.oid=oid;
			$.ajax({
				url : rootPath+"/gpsinspector/get.do",
				type: "post",
				data: data,
				async: false,
				success: function (data) {
					$('#stationMasterTel').val(data.data.phone);
				}
			})
		},
	});

	$('#sectionLeader').combobox({
		onChange:function () {
			var oid = $('#stationMaster').combobox('getValue');
			var data = {};
			data.oid=oid;
			$.ajax({
				url : rootPath+"/gpsinspector/get.do",
				type: "post",
				data: data,
				async: false,
				success: function (data) {
					$('#sectionLeaderTel').val(data.data.phone);
				}
			})
		},
	});

	$('#segment').combobox({
		onChange:function () {
			var oid = $('#stationMaster').combobox('getValue');
			var data = {};
			data.oid=oid;
			$.ajax({
				url : rootPath+"/gpsinspector/get.do",
				type: "post",
				data: data,
				async: false,
				success: function (data) {
					$('#segmentTel').val(data.data.phone);
				}
			})
		},
	});

	$('#inspector').combobox({
		// onChange:function () {
		// 	var insname = $('#inspector').combobox('getText');
		// 	var data = {};
		// 	data.insname=insname;
		// 	$.ajax({
		// 		url : rootPath+"/gpsinspector/getPhoneByInsname.do",
		// 		type: "post",
		// 		data: data,
		// 		async: false,
		// 		success: function (data) {
		// 			$('#inspectorTel').val(data.phone);
		// 		}
		// 	})
		// },
		onChange:function () {
			var oid = $('#inspector').combobox('getValue');
			var data = {};
			data.oid=oid;
			$.ajax({
				url : rootPath+"/gpsinspector/get.do",
				type: "post",
				data: data,
				async: false,
				success: function (data) {
					$('#inspectorTel').val(data.data.phone);
				}
			})
		},

	});
	setComboObjWidth('stationMaster',0.270,'combobox');
	setComboObjWidth('sectionLeader',0.270,'combobox');
	setComboObjWidth('segment',0.270,'combobox');
	setComboObjWidth('inspector',0.270,'combobox');

	//初始化部门
	initUnit('unitid');
	setComboObjWidth('unitid',0.270,'combobox');
	//初始化管线
	initLineLoopComboTree('lineloopoid');

	//    站长/区长
	initLocaUser('stationMaster',user.unitId,'01');
	//   区间技术负责人
	initPatrolTechnician('sectionLeader',user.unitId);
	//    段长
	initLocaUser('segment',user.unitId,'02');
	//    巡线工
	initInspector('inspector',user.unitId);

	setComboObjWidth('lineloopoid',0.270,'combobox');
	getGpsMarkerStaffRefById();
});

/**
 * @desc 修改数据-保存
 */
function updateGpsMarkerStaffRef(){
	disableButtion("saveButton");
	var bool=$('#gpsMarkerStaffRefForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpsmarkerstaffref/update.do",
		type: "post",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsMarkerStaffRefForm').serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
				top.showAlert("提示", "更新成功", 'info', function() {
					reloadData("query_gps_marker_staff_ref.html","#gpsMarkerStaffRefdatagrid");
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
function getGpsMarkerStaffRefById(){
	$.ajax({
		url : rootPath+"/gpsmarkerstaffref/get.do",
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
	$('#remarks').val(jsondata.remarks);
	$('#fiberSystemId').val(jsondata.fiberSystemId);
	$('#opticalFiberLineloop').val(jsondata.opticalFiberLineloop);
	$('#opticalFiberStation').val(jsondata.opticalFiberStation);
	$('#startMarkeroid').val(jsondata.startMarkeroid);
	$('#endMarkeroid').val(jsondata.endMarkeroid);
	$('#startMileage').val(jsondata.startMileage);
	$('#endMileage').val(jsondata.endMileage);


	$('#unitid').combotree("setValue",jsondata.unitid);
	$('#lineloopoid').combotree("setValue",jsondata.lineloopoid);

	if(jsondata.stationMaster!=''&&jsondata.stationMaster!=null){
		$('#stationMaster').combobox('setValue',jsondata.stationMaster);
		$('#stationMasterTel').val(jsondata.stationMasterTel);
	}
	if(jsondata.segment!=''&&jsondata.segment!=null){
		$('#segment').combobox("setValue",jsondata.segment);
		$('#segmentTel').val(jsondata.segmentTel);
	}
	if(jsondata.sectionLeader!=''&&jsondata.sectionLeader!=null){
		$('#sectionLeader').combobox("setValue",jsondata.sectionLeader);
		$('#sectionLeaderTel').val(jsondata.sectionLeaderTel);
	}
	if(jsondata.inspector!=''&&jsondata.inspector!=null){
		$('#inspector').combobox('setValue',jsondata.inspector);
		$('#inspectorTel').val(jsondata.inspectorTel);
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
			setComboObjWidth(id,0.29,'combobox');
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
			setComboObjWidth(id,0.29,'combobox');
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
	top. closeDlg("updateGpsMarkerStaffRef");
}


/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnit(unitid){
	/* 以下初始化查询面板 */
	/* 部门 */
	$('#'+unitid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName",
		onSelect:function(node) {
			$('#lineloopoid').combotree("clear");
			$('#stationMasterTel').val("");
			$('#sectionLeaderTel').val("");
			$('#segmentTel').val("");
			$('#inspectorTel').val("");

			$('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+node.id);
			//    站长/区长
			initLocaUser('stationMaster',node.id,'01');
			//   区间技术负责人
			initPatrolTechnician('sectionLeader',node.id);
			//    段长
			initLocaUser('segment',node.id,'02');
			//    巡线工
			initInspector('inspector',node.id,);
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		$('#'+unitid).combotree('loadData', result.data);
	})
	setComboObjWidth(unitid,0.172,'combobox');
}


/* 初始化人员 段长  区长 */
function initLocaUser( inspectorId , unitId, sign){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#'+inspectorId).combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getInspectorIdSelect.do?unitId='+unitId+'&sign='+sign,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth(inspectorId,0.270,'combobox');
}

/* 初始化人员 */
function initInspector( inspectorId , unitId){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#'+inspectorId).combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getAllUnitUserChildrens.do?unitId='+unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth(inspectorId,0.270,'combobox');
}



/* 巡检技术员    区间技术负责人  */
function initPatrolTechnician( inspectorId , unitId){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#'+inspectorId).combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getAllPatrolTechnicianChildrens.do?unitId='+unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth(inspectorId,0.270,'combobox');
}