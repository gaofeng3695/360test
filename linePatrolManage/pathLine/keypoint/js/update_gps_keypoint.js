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

var user = JSON.parse(sessionStorage.user);

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
	var comboxid='pointtype,';
	var singleDomainName='keypointtype,';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	var user = JSON.parse(sessionStorage.user);
	var userArray = [];
	userArray.push(user);

	initUnitComboTreeLocal('unitid');
	setComboObjWidth("unitid",0.280,'combobox');
	/* 初始化combobox */
	/*$('#unitid').combobox('loadData', userArray);*/
	showMap();

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
			/* 判断桩号类型是否为null */
			let pointtype = $('#lpointtype').combobox('getValue');
			/* 设置管线名称 */
			let line = row.text; // $('#lineloopoid').combobox('getText');
			$('#llineloopoid').val(line);
			if(pointtype != ''){
				/* 清空 */
				$('#lmarkeroid').combobox("clear");
				/* 发送请求，获取桩号 */
				$('#lmarkeroid').combobox("reload",rootPath+'/gpsmarker/querySelectByLineloopAndType.do?markertype='+pointtype+'&lineloopid='+row.id);
			}else{
				$('#lpointtype').combobox('setText','全部');
				/* 清空 */
				$('#lmarkeroid').combobox("clear");
				/* 发送请求，获取桩号 */
				$('#lmarkeroid').combobox("reload",rootPath+'/gpsmarker/querySelectByLineloopAndType.do?&lineloopid='+row.id);
			}
		},
		onLoadSuccess:function(node,data){
			// $('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
		}
	});
	
	setComboObjWidth("lineloopoid",0.280,'combobox');
	
	getGpsKeypointById();
	
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
			let t = $('#lineloopoid').combotree('tree');
			let line = t.tree('getSelected').id;// $('#lineloopoid').combotree('getValue');
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
	
	/* 修改样式 */
	updateComboboxStyle();
	$('#pointposition').showPanel('pointposition');
	
	getFileListInfo(pkfield, "update", {
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:20,  // 上传文件的个数 不传默认值为200
	},"1"); // 获取文件信息
	getPicListInfo(pkfield, "update", "", {
		//url : rootPath+"/attachment/upload.do",
		moduleCode:"pathLine", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:20,  // 上传文件的个数 不传默认值为200
		// extensions:"png", // 默认"gif,jpg,jpeg,bmp,png"
	},"2");

    $('.content-area').css("height",($('.content-area').height() - 30)+'px');
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
		reloadData("query_gps_keypoint.html","#gpsKeypointdatagrid");
	    closePanel();
	});
}
/**
 * @desc 修改数据-保存
 */
function updateGpsKeypoint(){
	disableButtion("saveButton");
	var bool=$('#gpsKeypointForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpskeypoint/update.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsKeypointForm').serializeToJson()),
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
			setComboObjWidth(id,0.29,'combobox');
		}
	}
}

/**
 * @desc 获得数据
 */
function getGpsKeypointById(){
	$.ajax({
		url : rootPath+"/gpskeypoint/get.do",
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
 * @desc 加载新增，修改多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select =comboxid.split(",");
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
			setComboObjWidth(id,0.29,'combobox');
		}
	}
}

/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$('#oid').val(jsondata.oid);
	$('#pointname').val(jsondata.pointname);
	$('#pointstation').val(jsondata.pointstation);
	$('#pointposition').val(jsondata.pointposition);
	$('#unitid').combotree('setValue', jsondata.unitid);
	$('#lon').val(jsondata.lon);
	$('#lat').val(jsondata.lat);
	$('#effectivebegindate').val(jsondata.effectivebegindate);
	$('#effectiveenddate').val(jsondata.effectiveenddate);
	$('#buffer').val(jsondata.buffer);
	$('#pointtype').combobox('setValue',jsondata.pointtype);
	$('#description').val(jsondata.description);
	$('#markeroid').val(jsondata.markeroid);
	$('#residentTime').val(jsondata.residentTime);
	/*$('#markeroid').combobox('setValue', jsondata.markeroid);*/
	$('#lineloopoid').combotree('setValue', jsondata.lineloopoid);
	$.post(rootPath+'/gpslineloop/getLineLoopChildren.do?unitid='+jsondata.unitid,function(result){
		$('#lineloopoid').combotree('loadData', result.data);
		
		/* 通过管件id获取所有的桩号 */
		$('#lmarkeroid').combobox("reload",rootPath+'/gpsmarker/querySelectByLineloopAndType.do?&lineloopid='+jsondata.lineloopoid);

        if(result.data.length == 1 && result.data[0].text == null ) {

        }else {
            $('#lineloopoid').combotree('setValue', jsondata.lineloopoid);
        }
		
	})
	
	$('#unitid').combotree('setValue', jsondata.unitid);
	
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
	top. closeDlg("updateGpsKeypoint");
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
	$('.textbox.combo').css('width',parseInt(width)-5);
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
	
	/* 给桩id赋值 */
	$('#markeroid').val(lmarkerId);

    let lineId =  $('#lineloopoid').combobox('getValue');
    /* 根据桩的id获取桩的里程值 */
    $.ajaxSetup({async: false});
    // $.get(rootPath+'/gpsmarker/get.do?oid='+markerId,function(result){    PIS中的桩数据OID重复，所以不能使用oid，要用管线ID加上OID查询

    $.get(rootPath+'/gpsmarker/getMarkerListByOidAndLineLoop.do?oid='+lmarkerId+"&lineloopid="+lineId,function(result){
        // let data = result.data;
        let data = result[0];
		let mileage = data.markerstation;
		let markername = data.markername;
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
			target.val(markername +''+ offset);
		}else{
			target.val(markername +'+'+ offset);
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
		/* 调用清除 */
		clearPanel();
		/* 判断管线是否为null ,如果管线选取为null，提示请先选择管线。*/
		let line =$('#lineloopoid').combobox('getText');
		if(line == ''||line == null){
			top.showAlert("提示", '请先选择管线', 'info');
			return false;
		}
		/* 将管线赋值，并且设置为只读 */
		$('#llineloopoid').val(line);
		$('#llineloopoid').attr('readonly','readonly');
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
		
		$('#lpointtype').combobox('setText','全部');
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
        onSelect:function(node) {
        	$('#lineloopoid').combotree("clear");
            $('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+node.id);

            //setComboObjWidth(lineloopoid,0.145,'combobox');
        }
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		
		$('#'+unitid).combotree('loadData', result.data);
	
	})
    setComboObjWidth(unitid,0.172,'combobox');
}


function showMap(){
	$('#location').on('click',function(){
		addLocation();
	})
}

/* 添加位置坐标 */
function addLocation(){
	/* 打开地图 */
    top.hideDlg('updateGpsKeypoint');
    top.map.show = true;
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
	    top.showDlg("updateGpsKeypoint");
	    
	  // top.tab.delMapTab('2d');
}


