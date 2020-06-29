
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var businessId;    // 附件上传业务ID
var user = JSON.parse(sessionStorage.user);

//第三方施工调用
var backid;//第三方施工调用页面时回传id
var backname;
var lon = getParamter("lon");
var lat = getParamter("lat");
var inspectoroid = getParamter("inspectoroid");
var sdunitid = getParamter("unitid");
var consDialogname = getParamter("consDialogname");
var temporarykeypointtype = getParamter("temporarykeypointtype");

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	var comboxid='pointtype,';
	var singleDomainName='temporarykeypointtype,';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);

    $("#residentTime").val("00:30");

	var userArray = [];
	userArray.push(user);
	
	/* 首先将数据清空  */
	sessionStorage.removeItem('timeArray');
	sessionStorage.removeItem('mn');
	
	/* 部门 */
	initUnitComboTreeLocal('unitid');
	setComboObjWidth('unitid',0.278,'combobox');
	
	if(lon && lat){
		$('#lon').val(lon);
		$('#lat').val(lat);
	}

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
        },
        onLoadSuccess:function(node,data){
            // $('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
        }
    });

	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	/*$('#inspectorid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getAllUnitUserChildren.do?unitId='+user.unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth("inspectorid",0.281,'combobox');*/
	
	showMap();
	
	/* 巡检频次，此为值域，但是有其他操作，因此单独设置为一列。  */
    $('#insfreq').combobox({
        panelHeight:150,
        editable:true,
        mode:'remote',
        url : rootPath+"jasframework/sysdoman/getDoman.do?domainName=temporarykeypointtime",
        valueField : "codeId",
        textField : "codeName",
        onClick : function(row){
            /* 获取MN值 */
            let mn = row.codeId;

            /* 获取M天N次中的N值 和M值*/
            let m = row.codeId.substring(0,1);
            let n = row.codeId.substring(1,2);
            /* 如果m为1，则弹出选择时间界面，否则就不弹出 */
            if(m == 1){
                /* 如果是巡检频次，弹出选择开始巡检时间和结束巡检时间 */
                // top.getDlg(rootPath+"/linePatrolManage/insTask/temporaryKeypoint/select_temporary_point_time.html?original=save&&times="+n+"&type=single"+"&mn="+mn,"selectTemporaryPointTime","选择关键点执行时间",800,300,false,true,true);
                top.getDlg(rootPath+"/linePatrolManage/insTask/temporaryKeypoint/select_temporary_point_time_construct.html?original=save&&count="+n+"&type=single"+"&mn="+mn,"selectTemporaryPointTimeconstruct","选择关键点执行时间",800,300,false,true,true);
            }else{
                /* 如果不是一天N巡，就设置字段值为'' */
                /*$('#taskTime').val('');
                sessionStorage.removeItem('timeArray');*/
                /* 删除巡检时间节点 */
                /*deleteTaskTimeNode();*/
                /* 需求变更；如果不是一天N巡，默认设置时间。*/
                // top.getDlg("select_temporary_point_time.html?original=save&times="+n+"&type=multiple"+"&mn="+mn,"selectTemporaryPointTime","选择关键点执行时间",800,300,false,true,true);
                top.getDlg("select_temporary_point_time_construct.html?original=save&count="+n+"&type=multiple"+"&mn="+mn,"selectTemporaryPointTimeconstruct","选择关键点执行时间",800,300,false,true,true);
            }

        }
    });
	setComboObjWidth("insfreq",0.278,'combobox');
	
	/* 制定人 */
	$('#confirmorid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "userName",
		onSelect : function(row){
		}
	});
	setComboObjWidth("confirmorid",0.278,'combobox');
	
	/* 初始化combobox */
	$('#confirmorid').combobox('loadData', userArray);
	/* 初始化值 */
	$('#confirmorid').combobox('setValue', user.oid);
	
	/* 管线 */
	$('#llineloopoid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/gpslineloop/queryLoopSelectData.do',
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
			/* 判断桩号类型是否为null */
			let type = $('#lpointtype').combobox('getValue');
			if(type != ''){
				/* 清空 */
				$('#lmarkeroid').combobox("clear");
				/* 发送请求，获取桩号 */
				$('#lmarkeroid').combobox("reload",rootPath+'/gpsmarker/querySelectByLineloopAndType.do?markertype='+type+'&lineloopid='+row.codeid);
			}
		}
	});
	setComboObjWidth("llineloopoid",0.145,'combobox');
	
	/* 桩号类型 */
	$('#lpointtype').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+"jasframework/sysdoman/getDoman.do?domainName=markertype",
		valueField : "codeId",
		textField : "codeName",
		onSelect : function(row){
			/* 判断管线是否为null */
			let line = $('#lpointtype').combobox('getValue');
			if(line != ''){
				/* 清空 */
				$('#lmarkeroid').combobox("clear");
				/* 发送请求，获取桩号 */
				$('#lmarkeroid').combobox("reload",rootPath+'/gpsmarker/querySelectByLineloopAndType.do?markertype='+row.codeId+'&lineloopid='+line);
			}
		}
	});
	setComboObjWidth("lpointtype",0.145,'combobox');
	
	/* 桩 */
	$('#lmarkeroid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		//url : rootPath+'/gpsmarker/queryMarkerSelectData.do',
		valueField : "codeid",
		textField : "codename"
	});
	setComboObjWidth("lmarkeroid",0.145,'combobox');
	
	/* 修改combobox 样式  */
	updateComboboxStyle();
	
	
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
			backid = bsId;
			backname = $('#pointname').val();
			return bsId;
		},
		uploadSuccessFun:function(){
			top.showAlert("提示", "保存成功", 'info', function() {
//				reloadData("query_gps_temporary_keypoint.html","#gpsTemporaryKeypointdatagrid");
				//回传关键点至第三方施工父页面
				let fra = parent.$("iframe");
				for ( let i = 0; i < fra.length; i++) {
					if (fra[i].id == 'iframe_updateGpsConstruction' || fra[i].id == 'iframe_addGpsConstruction'
						|| fra[i].id == 'iframe_updateGpsEvent' || fra[i].id == 'iframe_addGpsEvent'
						|| fra[i].id == 'iframe_updateGpsContractor' || fra[i].id == 'iframe_addGpsContractor') {
						fra[i].contentWindow.temporarykeypointcallback(backid, backname);
						break;
					}
				}
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
		bID = saveGpsKeypoint();  // sava()保存基本信息函数，返回业务id
	}else{
		bID = businessId;
	}
	return bID;
}

/**
 * @desc 添加数据-保存
 */
function saveGpsKeypoint(){
	disableButtion("saveButton");
	var bool=$("#gpsTemporaryKeypointForm").form('validate');
	/* 判断巡检时间是否在有效起始时间和有效终止日期之间 */
	if(!taskTimeisEffective()){
		enableButtion("saveButton");
		return false;
	}
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	/* 判断结束时间是否大于开始时间 */
	if(!compareDate()){
		top.showAlert("提示", "结束时间必须大于或者等于开始时间", 'info');
		enableButtion("saveButton");
		return false;
	}

	/* 判断开始时间与结束时间的时间差与N值是否完美符合，不符合则提示。 */
	if(!judgmentDate()){
		$.messager.confirm('提示', '开始时间与结束时间的时间差会导致最后一天巡检时间不足，确认保存吗？', function(r) {
			if (r) {
				$.ajax({
					url : rootPath+"/gpstemporarykeypoint/save.do",
					type: "post",
					async: false,
					contentType: "application/json;charset=utf-8",
					dataType: "json",
					data:JSON.stringify($("#gpsTemporaryKeypointForm").serializeToJson()),
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
				/* 触发点击事件 */
				$('#saveButton').trigger('click');
				return businessId;
			}else{
				enableButtion("saveButton");
				return false;
			}
		});
	}else{
		/* 符合规则，直接保存 */
		$.ajax({
			url : rootPath+"/gpstemporarykeypoint/save.do",
			type: "post",
			async: false,
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data:JSON.stringify($("#gpsTemporaryKeypointForm").serializeToJson()),
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
	
	
}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsTemporaryKeypointconstruct");
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
					/*if(data.length>0){
						$('#'+id).combobox('setValue',data[0].codeId);
					}*/
					/* 关键点类型默认设置为临时关键点 */
					$('#pointtype').combobox('setValue', temporarykeypointtype);
					$("#pointtype").combobox('readonly',true); 
				}
			});
			setComboObjWidth(id,0.281,'combobox');
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
						$('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.281,'combobox');
		}
	}
}

/**
 * 扩展验证 number
 */
$.extend($.fn.validatebox.defaults.rules, {
    isNumber: {
		validator: function(value,param){
			console.log('验证是否为数字');
			/* 数字正则表达式 */
			let regex = /^-?\d+\.?\d*$/;
			/* 如果最后一位是点，返回false */
			if(value.charAt(value.length-1) == '.'){
				return false;
			}
			return regex.test(value);
		},
		message: '请输入数字。'
    }
});

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
 * 点击取消
 */
function closePanelWindow(){
	/* 设置计算里程弹出框的display为none */
	$('#calculationMileage').css('display','none');
}

/**
 * 点击保存
 * @description 计算起始里程和终止里程 
 */
function savePanel(event, target){
	event.preventDefault();
	
	disableButtion("lsaveButton");
	var bool=$("#calculationMileageForm").form('validate');
	if(bool==false){
		enableButtion("lsaveButton");
		return bool;
	}
	
	/* 获取桩的id值 */
	let lmarkerId = $('#lmarkeroid').combobox('getValue');
    let lineId =  $('#lineloopoid').combobox('getValue');
    /* 根据桩的id获取桩的里程值 */
    $.ajaxSetup({async: false});
    // $.get(rootPath+'/gpsmarker/get.do?oid='+markerId,function(result){    PIS中的桩数据OID重复，所以不能使用oid，要用管线ID加上OID查询

    $.get(rootPath+'/gpsmarker/getMarkerListByOidAndLineLoop.do?oid='+lmarkerId+"&lineloopid="+lineId,function(result){
        // let data = result.data;
        let data = result[0];
		let mileage = data.markerstation;
		/* 得到偏移量,如果偏移量是正数，位置描述=桩里程值+偏移量；如果是负数，位置描述=桩里程值-偏移量 */
        let offset = 0;
        if( $('#offset').val() !== '' && $('#offset').val() != undefined )
            offset = parseFloat($('#offset').val().trim());
		/* 给关键点赋值里程值 */
		$('#pointstation').val(mileage + offset);
		
		/* 获取第一个字符，判断是否为正或者负 */
		let firstChar = $('#offset').val().charAt(0);
		if(firstChar == '-'){
			/* 给关键点赋值位置描述 */
			target.val(mileage +''+ offset);
		}else{
			target.val(mileage +'+'+ offset);
		}
		
		
		/* 关闭 */
		closePanelWindow();
	})
}

/**
 * 点击清空
 */
function clearPanel(){
	/* 清空列表 */
	$('#llineloopoid').combobox('clear');
	$('#lpointtype').combobox('clear');
	$('#lmarkeroid').combobox('clear');
	$('#offset').val('0');
	
}

/**
 * 通用点击事件
 * 显示计算里程弹窗
 */
$.fn.showPanel = function(key){
	this.on('click',function(){
		/* 获取当前点击对象 */
		let target = $(this);
		$('#calculationMileage').css('display','block');
		
		/* 获取元素距离top和left的距离 */
		let distance = getCoords(document.getElementById(key));
		console.log('top:'+distance.top+'--'+distance.left);
		/* 设置计算里程的距离 */
		$('#calculationMileage').css('left',distance.left+'px');
		$('#calculationMileage').css('top',distance.top+30+'px');
		
		/* 默认桩号需要通过类型获取 */
		$('#lmarkeroid').combobox("clear");
		
		/* 解除原有点击事件 */
		$('#lsaveButton').unbind('click');
		$('#lsaveButton').on('click',function(event){
			savePanel(event, target);
		});
		
		/* 宽度加97px */
		let width = $('#calculationMileage .textbox-prompt').css('width');
		width = width.substring(0,width.lastIndexOf('px'));
		$('#calculationMileage .textbox-prompt').css('width',parseInt(width)+97+'px');
	})
	
	
    
}


/**
 * 获取元素相对body的距离
 * @param elem
 * @returns
 */
function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

/**
 * 比较时间
 */
function compareDate(){
	console.log('验证时间要大于或者等于当前时间');
	/* 获取起始时间 */
	let effectivebegindate = $('#effectivebegindate').val();
	/* 获取结束时间 */
	let effectiveenddate = $('#effectiveenddate').val();
	if(effectiveenddate >= effectivebegindate)
		return true;
	else
		return false;
}

/**
 * 重新加载任务时间数据
 * @returns
 */
function reloadTaskTimeData(){
	/*console.log('加载任务时间数据');*/
	/* 获取sessionStorage的数据 */
	let taskTime = sessionStorage.getItem('timeArray');
	let mn = sessionStorage.getItem('mn');
	$('#taskTime').val(taskTime);
	top.showAlert("提示", "巡检时间设置成功。", 'info');
	/* 删除之前的节点 */
	deleteTaskTimeNode();
	showTaskTime();
}

/**
 * 判断巡检时间是否都是有效时间
 * @returns
 */
function taskTimeisEffective(){
	/* 如果巡检频次是一天N巡才做判断，否则，不做判断。*/
	let insfreq = $('#insfreq').combobox('getValue');
	let m = insfreq.substring(0,1);
	if(m == 1){
		/* 如果1天N巡，但是taskTime没有值，说明用户取消了。提示用户选择具体巡检时间。*/
		if($('#taskTime').val() == ''){
			top.showAlert("提示", "一天N巡需要设置巡检时间，请设置巡检时间！", 'info');
			return false;
		}
		let taskTime = JSON.parse($('#taskTime').val());
		/* 有效起始日期 */
		let effectivebegindate = $('#effectivebegindate').val();
		/* 有效终止日期 */
		let effectiveenddate = $('#effectiveenddate').val();
		/* 遍历所有巡检时间，不能超过有效时间的范围 */
		/*for( let i = 0; i< taskTime.length ; i++){
			if(taskTime[i].startTime.substring(0,10) < effectivebegindate || taskTime[i].endTime.substring(0,10) > effectiveenddate){
				top.showAlert("提示", "第"+(i+1)+"次巡检时间不在有效时间范围内，请重新设置！", 'info');
				return false;
			}
		}*/
	}
	return true;
}

/**
 * 展示巡检时间
 * @returns
 */
function showTaskTime(){
	/* 取taskTime的值 */
	let taskTime = $('#taskTime').val();
	if(taskTime != ''){
		let taskTimeArray = JSON.parse(taskTime);
		for(let i = taskTimeArray.length-1; i>= 0; i--){
			createTaskTimeNode(taskTimeArray[i].startTime, taskTimeArray[i].endTime, i);
		}
	}
}

/**
 * 创建展示节点
 * @param startTime
 * @param endTime
 * @returns
 */
function createTaskTimeNode(startTime, endTime,i){
	let node = '<tr class=\"show-node\"><td width=\"20%\">';
	node += '<span style=\"color:red;vertical-align: bottom;margin-right:5px\">*</span>';
	node += '<span>第'+(i+1)+'次巡检开始时间：</span>';
	node += '</td>';
	node += '<td width=\"30%\">';
	node += '<input class=\"easyui-validatebox Wdate input_bg\" disabled=\"disabled\" value=\''+startTime+'\'  />';
	node += '</td>';
	node += '<td width=\"20%\">';
	node += '<span style=\"color:red;vertical-align: bottom;margin-right:5px\">*</span>';
	node += '<span>第'+(i+1)+'次巡检结束时间：</span>';
	node += '</td>';
	node += '<td width=\"30%\">';
	node += '<input class=\"easyui-validatebox Wdate input_bg\" disabled=\"disabled\" value=\''+endTime+'\'  />';
	node += '</td>';
	node += '</tr>';
	$('#taskTimeNode').after(node);
}

/**
 * 删除展示节点
 */
function deleteTaskTimeNode(){
	$('.show-node').remove();
}

/**
 * 判断开始时间与结束时间的时间差与N值是否完美符合，不符合则提示。
 * @returns
 */
function judgmentDate(){
	/* 有效时间 */
	let startStartDate = $('#effectivebegindate').val();
	let startEndDate = $('#effectiveenddate').val();
	/* 巡检频次 */
	let insfreq = $('#insfreq').combobox('getValue');
	let N = insfreq.substring(0,1);
	
	let startDate = new Date(startStartDate.replace(/-/g, "/"));
	let endDate = new Date(startEndDate.replace(/-/g, "/"));
	
	let dateDiff = endDate.getTime() - startDate.getTime();
	
	/* 计算出相差天数 */
	var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) + 1;
	let diff = dayDiff%parseInt(N);
	if(diff == 0)
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
        onLoadSuccess:function(node,data){
            /* 初始化部门 */
            $('#unitid').combotree('setValue',user.unitId);
            initInspection(user.unitId);
            $('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+user.unitId);
        },
        onSelect : function(row){
            $('#lineloopoid').combotree('clear');
            /* 加载人员 */
            initInspection(row.id);
            $('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+row.id);
        }
    });
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        console.log(result);

        $('#'+unitid).combotree('loadData', result.data);
    })
    setComboObjWidth(unitid,0.280,'combobox');
}

/**
 * 初始化巡检人员
 * @returns
 */
function initInspection(unitId){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	/*$('#inspectorid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/gpsconstruction/getInspectorByUnit.do?unitid='+unitId+'&inspectortype=01',
		valueField : "oid",
		textField : "insname",
		onLoadSuccess:function(data){
			if(data.length>0 && unitId== sdunitid && inspectoroid){
				$('#inspectorid').combobox('setValue',inspectoroid);
			}
		},
		onSelect : function(row){
		}
	});
	setComboObjWidth("inspectorid",0.281,'combobox');*/
	
	$('#inspectorid').combobox({
		panelHeight:150,
		url : rootPath+'/gpsconstruction/getInspectorByUnit.do?unitid='+unitId+'&inspectortype=01',
		valueField : "oid",
		textField : "insname",
	});

	setComboObjWidth('inspectorid',0.274,'combobox');
}

function showMap(){
	$('#location').on('click',function(){
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
	top.hideDlg('addGpsTemporaryKeypointconstruct');
	top.hideDlg(consDialogname);
	
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
		top.showDlg(consDialogname);
	    top.showDlg("addGpsTemporaryKeypointconstruct");
	    
	   top.tab.delMapTab('2d');
}

