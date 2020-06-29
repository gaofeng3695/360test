
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var pkfield;	// 业务数据ID
var businessId;    // 附件上传业务ID
var marker = "1";
//当前登陆用户
var user = JSON.parse(sessionStorage.user);

var markerMileage = 0;
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='riskrating'+',';
	singleDomainName+='construnctionRiskLevel'+","
	/*comboxid+='constructreason'+',';
	singleDomainName+='construnctionReason'+","*/
	comboxid+='progressid'+',';
	singleDomainName+='construnctionProgress'+","
	comboxid+='isProhibitedItems'+',';
	singleDomainName+='isProhibitedItemsName'+","

	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	$('#inspectoroid').combobox({
        onChange:function () {
        	var insname = $('#inspectoroid').combobox('getText');
        	var data = {};
        	data.insname=insname;
        	$.ajax({
        		url : rootPath+"/gpsinspector/getPhoneByInsname.do",
        		type: "post",
        		data: data,
        		async: false,
        		success: function (data) {
        			$('#inspectorphone').val(data.phone);
                }
        	})
        },
	});



	$('#isProhibitedItems').combobox({
		onChange:function () {
			if ($('#isProhibitedItems').combobox('getText') == '是'){
				$('#riskrating').combobox('setValue', '01');
				$('#riskratingreal').val('01');
			}
			setComboObjWidth('isProhibitedItems',0.270,'combobox');
		},
	});






	showMap();
	
	initMarker();
	initInspector();

	/* 在桩偏移量修改的时候，计算里程。 */
	$('#offset').on('change',function() {
		$('#pointstation').val(parseFloat(markerMileage) + parseFloat($('#offset').val()) );
	})
	//初始化部门
	initUnitComboTree('unitid');
	setComboObjWidth('unitid',0.270,'combobox');
	//初始化管线
	initLineLoopComboTree('lineloopoid');
	setComboObjWidth('lineloopoid',0.270,'combobox');
	

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
		// 文件上传成功之后执行的
		if(pkfield != ""){
			if(marker != "1"){
				submit();
			}else{
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("query_gps_construction.html","#gpsConstructiondatagrid");
					closePanel();
				});
			}
		}
		}
	});
	
});

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
				+"&inspectoroid="+$('#inspectoroid').combobox('getValue')+"&unitid="+$('#unitid').combotree('getValue')+"&consDialogname=addGpsConstruction"
				+"&temporarykeypointtype=03",
				"addGpsTemporaryKeypointconstruct","添加临时关键点",800,600,false,true,true);
	}else{
		top.getDlg("../../linePatrolManage/insTask/temporaryKeypoint/update_gps_temporary_keypoint_construct.html?oid="+$('#temporarykeypointoid').val()
				+"&consDialogname=addGpsConstruction&temporarykeypointtype=03","updateGpsTemporaryKeypointconstruct","修改临时关键点",800,600,false,true,true);
	}
}

function temporarykeypointcallback(temporarykeypointoid, temporarykeypointoidname){
	$('#temporarykeypointoid').val(temporarykeypointoid);
	$('#temporarykeypointoidname').val(temporarykeypointoidname);
}

/* 初始化桩 */
function initMarker(){
	$('#stakenum').combobox({
		panelHeight:150,
		editable:true,
        mode:'remote',
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
			/* 设置施工地点里程值为桩里程+偏移量 */
			/* 得到桩的里程 */
			$.get(rootPath+'/gpsmarker/getMarkerListByOidAndLineLoop.do?oid='+row.codeid+"&lineloopid="+$('#lineloopoid').combobox('getValue'),function(result){
				let data = result[0];
				markerMileage = data.markerstation;
				let mileage = data.markerstation;
				let markername = data.markername;
				/* 得到偏移量,如果偏移量是正数，位置描述=桩里程值+偏移量；如果是负数，位置描述=桩里程值-偏移量 */
				let offset = 0;
				if( $('#offset').val() !== '' && $('#offset').val() != undefined )
					offset = parseFloat($('#offset').val().trim());
				/* 给关键点赋值里程值 */
				$('#pointstation').val(mileage + offset);
			})
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

function getInspector(unitid){
	$('#inspectoroid').combobox({
		panelHeight:100,
		url : rootPath+'/gpsconstruction/getInspectorByUnit.do?unitid='+unitid+'&inspectortype=01',
		valueField : "oid",
		textField : "insname",
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
			$('#stakenum').combobox("clear");
			/* 发送请求，获取桩号 */
			$('#stakenum').combobox("reload",rootPath+'/gpsmarker/querySelectByLineloopAndType.do?lineloopid='+node.id+'&unitid='+$('#unitid').combotree('getValue'));
		},
		onLoadSuccess:function(node,data){
			$('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
		}
	});
	$.post(rootPath+'/gpslineloop/getLineLoopChildren.do',function(result){
		console.log(result);
		$('#'+lineloopoid).combotree('loadData', result.data);
	})
    setComboObjWidth(lineloopoid,0.205,'combobox');
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
			$('#'+unitid).combotree('setValue', user.unitId);
			getInspector(user.unitId);
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		$('#'+unitid).combotree('loadData', result.data);
	})
    setComboObjWidth(unitid,0.172,'combobox');
}

/**
 * 初始化默认设置当前用户所在部门
 * @returns
 */
function setCurrentUserUnit(){
	$.ajax({
		url : rootPath+"/gpsconstruction/save.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsConstructionForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
				pkfield=data.data;
			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
}

function distancelinechange(){
	if ($('#isProhibitedItems').combobox('getText') == '是'){
		$('#riskrating').combobox('setValue', '01');
		$('#riskratingreal').val('01');
		return;
	}

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

function showMap(){
	$('#locationXY').on('click',function(){
		addLocation();
	})
}

function showCursor(){
	disLoad();
	top.hideDlg('addGpsConstruction');
	
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
    top.map.show = true;
    top.hideDlg('addGpsConstruction');
    top.getXY(getLocationCallBack);
	
}

function getLocationCallBack(obj){
		console.log('坐标是'+obj)
		let xy = obj.split(',');
		let x = xy[0];
		let y = xy[1];
		/* 给input赋值 */
		$('#lon').val(x);
		$('#lat').val(y);
	    top.showDlg("addGpsConstruction");
	    
	   top.tab.delMapTab('2d');
}

/**
 * @desc 保存基本信息获取业务id
 */
function saveBaseInfo(){
	var  bID = null;
	if(isNull(businessId)){
		bID = saveGpsConstruction();  // sava()保存基本信息函数，返回业务id
	}else{
		bID = businessId;
	}
	return bID;
}

/**
 * @desc 添加数据-保存
 */
function saveGpsConstruction(){
	disableButtion("saveButton");
	disableButtion("saveAndSubmit");
	var bool=$("#gpsConstructionForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		enableButtion("saveAndSubmit");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpsconstruction/save.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsConstructionForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
				pkfield=data.data;
			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
				enableButtion("saveAndSubmit");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
				enableButtion("saveAndSubmit");
			}
		}
	});
	enableButtion("saveButton");
	return businessId;    // 附件上传业务ID

}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsConstruction");
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
						$('#'+id).combobox('setValue',data[1].codeId);
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
//						$('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.270,'combobox');
		}
	}
}

/**
 * @desc 保存并提交
 */
function saveAndSubmit(){
	/*disableButtion("saveAndSubmit");
	var bool=$("#gpsConstructionForm").form('validate');
	if(bool==false){
		enableButtion("saveAndSubmit");
		return bool;
	}
	$("#saveButton").trigger('click');
	if(!isNull(pkfield)){
		submit();
		enableButtion("saveAndSubmit");
	}*/
	$("#saveButton").trigger('click');
	if(businessId){
	    marker = "2";
		}
}

/**
 * @desc 工作流-提交
 */
function submit() {
	//设置工作流参数
	var paraArr={
			"unitid": $('#unitid').combotree('getValue'),
			"entityClassName": "cn.jasgroup.jasframework.pipeprotect.construction.entity.GpsConstruction"
	};
	var comment = "请求审批";

	var workflowName = "gpsconstruction";
	var subject = "第三方施工:"+$('#projectname').val()+",风险等级:"+$('#riskrating').combobox('getText');
	var businessEventId=pkfield;
	//开启工作流
	workflow.startWorkflow(businessEventId, workflowName,subject,true,comment,startWorkflowCallback,paraArr);
}

//流程回调函数
function startWorkflowCallback(result){
	if(result.status==-1){
		top.showAlert('error', "发起流程失败:"+result.msg, 'error');
		return;
	}
	top.showAlert("提示", "发起流程成功!", 'info');
	reloadData("query_gps_construction.html","#gpsConstructiondatagrid");
	closePanel();
}

/**
 * @desc 回调函数：设置该条记录的状态为2【审核中】
 * @param result
 */
function callbackFun(result){
	if (result.success){
		$.messager.alert('正确',result.successMessage,'ok',function(){
			$.ajax({
				url:rootPath+"/gpsconstruction/submitGpsConstruction.do",
				data: {"oid" : pkfield},
				async:false,
				type:"POST",
				dataType:"json",
				success:function(result){
					closePanel();
				},
				error:function(){
					alert('提示',"提交出错",'error');
				}
			});
		});
	} else {
		$.messager.alert('提示',"已提交审核，不能重复提交",'info');
	}
}
