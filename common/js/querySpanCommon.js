//当前登陆用户
var user = JSON.parse(sessionStorage.user);
//起始位置里程
let qbeginStation=0;
//终止位置里程
let qendStation=0;
//起始里程id
let beginStationid='';
//终止里程id
let endStationid='';
//起始位置输入框id
let beginStationNameid1 = '';
//终止位置输入框id
let endStationNameid1 = '';
//管线下拉框id
let lineloopoid1 = '';
//点击的起始位置或终止位置输入框宽度
let inputWidth = 180;

//选中的管线标识
let selectLineid = '';
//选中的管线名称
let selectLineName = '';

/**
 * 初始化点击起始位置终止位置输入框弹出面板
 * @param startStationNameid 起始位置输入框id
 * @param endStationNameid 终止位置输入框id
 * @param startStationNumid 起始位置里程值id
 * @param endStationNumid 终止位置里程值id
 * @returns
 */
function showPan(startStationNameid,endStationNameid,startStationNumid,endStationNumid) {
	/* 起始位置 */
	$('#'+startStationNameid).showPanel(startStationNameid);
	/* 终止位置 */
	$('#'+endStationNameid).showPanel(endStationNameid);
	beginStationNameid1 = startStationNameid;
	endStationNameid1 = endStationNameid;
	beginStationid = startStationNumid;
	endStationid = endStationNumid;
	initPan();
}

function initPan(){
	
	let html = "<from id='calculationMileageForm'>"+
	"<table align=\"center\" class=\"edit-table\" >"+
		"<tr>"+
			"<td width=\"30%\" style=\"text-align:right\"><span>管线：</span></td>"+
			"<td width=\"70%\">"+
					"<span id=\"llinelooponame\"></span>"+
			"</td>"+
		"</tr>"+
	    "<tr>"+
			"<td width=\"30%\" style=\"text-align:right\"><span>桩类型：</span></td>"+
			"<td width=\"70%\">"+
				"<select id=\"lpointtype\"   class=\"easyui-validatebox select\"  ></select>"+
			"</td>"+
		"</tr>"+
		"<tr>"+
			"<td width=\"30%\" style=\"text-align:right\"><span>桩号：</span></td>"+
			"<td width=\"70%\">"+
				"<select id=\"markeroid\" required = \"true\"   class=\"easyui-validatebox select\"  validType=\"comboxExists['markeroid']\" ></select>"+
			"</td>"+
		"</tr>"+
		"<tr>"+
			"<td width=\"30%\" style=\"text-align:right\"><span>偏移：</span></td>"+
			"<td width=\"70%\">"+
				"<input id=\"offset\" value='0' required = \"true\"  class=\"easyui-validatebox input_bg\"  validType=\"isNumber['']\" ></select>"+
			"</td>"+
		"</tr>"+
	"</table>"+
	"<div class=\"button-area\">"+
		"<table width=\"100%\">"+
			"<tr>"+
				"<td align=\"center\">"+
					"<a href=\"#\" id=\"lsaveButton\"  class=\"easyui-linkbutton l-btn l-btn-small save-btn\"><span>确认</span></a>"+
					"<a href=\"#\" id=\"clear\" onclick='clearPanel()' class=\"easyui-linkbutton  l-btn l-btn-small  clear-btn\"><span>清空</span></a>"+
					"<a href=\"#\" class=\"easyui-linkbutton  l-btn l-btn-small  cancel-btn\" onclick=\"closePanelWindow()\"> <span>取消</span></a>"+
				"</td>"+
			"</tr>"+
		"</table>"+
	"</div>"+
	"</from>";
	$('#calculationMileage').html(html);
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
        onSelect:function(node) {
            $('#lineloopoid').combotree("clear");
			$('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+node.id);

            $.post(rootPath+"/gpsinsrange/getGpsInspectorRangeSelect.do?unitId="+node.id+"&inspectorType=02&sign=02",function(result){
                $('#rangeOid').combobox('loadData', result);

            })
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
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTreeNotLineLoop(unitid){
    /* 以下初始化查询面板 */
    /* 部门 */
    $('#'+unitid).combotree({
        panelHeight:150,
        editable:true,
        mode:'remote',
        valueField : "oid",
        textField : "unitName",
        onSelect:function(node) {

        }
    });
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        console.log(result);

        $('#'+unitid).combotree('loadData', result.data);

    })
    setComboObjWidth(unitid,0.172,'combobox');
}

function initLineLoopRangeComboTree(lineloopoid){
    lineloopoid1 = lineloopoid;
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
           // $('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
        }
    });
    $.post(rootPath+'/gpslineloop/getAllLineLoopChildren.do',function(result){
        console.log(result);
        if(result.data.length == 1 && result.data[0].text == null ) {

        }else {
            $('#'+lineloopoid).combotree('loadData', result.data);
        }
    })
    setComboObjWidth(lineloopoid,0.205,'combobox');
}

/**
 * 初始化管线下拉框数据
 * @returns
 */
function initLineLoopCombobox(lineloopoid, unitId){
	lineloopoid1 = lineloopoid;
	/* 管线 */
//	$('#'+lineloopoid).combobox({
//		panelHeight:150,
//		url : rootPath+'/gpslineloop/queryLoopSelectData.do',
//		valueField : "codeid",
//		textField : "codename",
//		onSelect : function(row){
//			if(beginStationNameid1 != ''){
//				$('#'+beginStationNameid1).val('');
//			}
//			if(endStationNameid1 != ''){
//				$('#'+endStationNameid1).val('');
//			}
//			if(beginStationid != ''){
//				$('#'+beginStationid).val('');
//			}
//			if(endStationid != ''){
//				$('#'+endStationid).val('');
//			}
//		}
//	});
//	setComboObjWidth(lineloopoid,0.145,'combobox');
	initLineLoopComboTree(lineloopoid, unitId);
}

function initLineLoopComboTree(lineloopoid, unitId){
    lineloopoid1 = lineloopoid;
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
			// $('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
		}
	});
	$.post(rootPath+'/gpslineloop/getLineLoopChildren.do',function(result){
		console.log(result);
		if(result.data.length == 1 && result.data[0].text == null ) {

		}else {
            $('#'+lineloopoid).combotree('loadData', result.data);
		}

        if( unitId != null && unitId != undefined && unitId != '') {
            $('#'+lineloopoid).combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+unitId);
        }

	})
	setComboObjWidth(lineloopoid,0.215,'combobox');
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
	
	var bool=$("#calculationMileageForm").form('validate');
	if(bool==false){
		return bool;
	}
	
	/* 获取桩的id值 */
	let markerId = $('#markeroid').combobox('getValue');
	let lineId =  $('#'+lineloopoid1).combobox('getValue');
	/* 根据桩的id获取桩的里程值 */
	$.ajaxSetup({async: false});
	// $.get(rootPath+'/gpsmarker/get.do?oid='+markerId,function(result){    PIS中的桩数据OID重复，所以不能使用oid，要用管线ID加上OID查询

	$.get(rootPath+'/gpsmarker/getMarkerListByOidAndLineLoop.do?oid='+markerId+"&lineloopid="+lineId,function(result){
		// let data = result.data;
		let data = result[0];
		let mileage = data.markerstation;
		/* 得到偏移量,如果偏移量是正数，位置描述=桩里程值+偏移量；如果是负数，位置描述=桩里程值-偏移量 */
        let offset = 0;
		if( $('#offset').val() !== '' && $('#offset').val() != undefined )
            offset = parseFloat($('#offset').val().trim());
		/* 给调用者赋值起始位置终止位置 */
		if($('#offset').val().trim().indexOf('-') != -1){
			target.val($('#markeroid').combobox('getText')+offset);
		}else{
			target.val($('#markeroid').combobox('getText')+'+'+offset);
		}
		
		//起始位置里程
		if(target.context.id == beginStationNameid1){
			qbeginStation = mileage + offset;
			$('#'+beginStationid).val(qbeginStation);
		}else if(target.context.id == endStationNameid1){
			qendStation = mileage + offset;
			$('#'+endStationid).val(qendStation);
		}
		//起始里程大于终止里程,并且已经选择终止位置
		if($('#'+endStationid).val() != ''){
			qendStation =  $('#'+endStationid).val();
		}
		if(qbeginStation >= qendStation && $('#'+endStationNameid1).val() != ''){
			$('#'+endStationNameid1).val('');
			$('#'+endStationid).val('');
			top.showAlert('提示', '起始位置必须小于终止位置', 'info');
		}
		
		/* 关闭 */
		closePanelWindow();
        /* 触发input事件 */
        target.trigger("change");
	})
}

/**
 * 点击清空
 */
function clearPanel(){
	/* 清空列表 */
	$('#llineloopoid').combobox('clear');
	$('#lpointtype').combobox('clear');
	$('#markeroid').combobox('clear');
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
		inputWidth = target.context.clientWidth;
		//设置计算面板宽度
		$('#calculationMileage').width(inputWidth);
		
		//判断是否选中管线
		if(selectLineid != ''){
			initMarker();
			initMarkerType(selectLineid);
			$('#llinelooponame').html(selectLineName);
		}else if(lineloopoid1 != '' && $('#'+lineloopoid1).combobox('getValue')){
			$('#llinelooponame').html($('#'+lineloopoid1).combobox('getText'));
			initMarker();
			initMarkerType($('#'+lineloopoid1).combobox('getValue'));
		}else{
			top.showAlert('提示', '请选择管线', 'info');
			return;
		}
		
		$('#calculationMileage').css('display','block');
		/* 获取元素距离top和left的距离 */
		let distance = getCoords(document.getElementById(key));
		console.log('top:'+distance.top+'--'+distance.left);
		/* 设置计算里程的距离 */
		$('#calculationMileage').css('left',distance.left+'px');
		$('#calculationMileage').css('top',distance.top+30+'px');
		
		/* 默认桩号需要通过类型获取 */
		$('#markeroid').combobox("clear");
		
		/* 解除原有点击事件 */
		$('#lsaveButton').unbind('click');
		$('#lsaveButton').on('click',function(event){
			savePanel(event, target);
		});
		
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

/* 初始化桩类型 */
function initMarkerType(line){
	$('#lpointtype').combobox({
		panelHeight:150,
		editable:true,
		url : rootPath+"jasframework/sysdoman/getDoman.do?domainName=markertype",
		valueField : "codeId",
		textField : "codeName",
		onSelect : function(row){
			/* 判断管线是否为null */
			if(line != ''){
				/* 清空 */
				$('#markeroid').combobox("clear");
				/* 发送请求，获取桩号 +"&unitid="+$('#unitid').combotree('getValue') */
				$('#markeroid').combobox("reload",rootPath+'/gpsmarker/querySelectByLineloopAndType.do?markertype='+row.codeId+'&lineloopid='+line);
			}
		},
		onLoadSuccess:function(data){
			if(data.length>0){
				$('#lpointtype').combobox('setText','全部');
				/* 判断管线是否为null */
				if(line != ''){
					/* 清空 */
					$('#markeroid').combobox("clear");
					/* 发送请求，获取桩号 +"&unitid="+$('#unitid').combotree('getValue') */
					$('#markeroid').combobox("reload",rootPath+'/gpsmarker/querySelectByLineloopAndType.do?&lineloopid='+line);
				}
			}
		}
	});
	setBoObjWidth("lpointtype");
}

/* 初始化桩 */
function initMarker(){
	$('#markeroid').combobox({
		panelHeight:150,
		editable:true,
		valueField : "codeid",
		textField : "codename",
		mode:'remote'
	});
	setBoObjWidth("markeroid");
}

/* 初始化人员 */
function initUser( inspectorId ){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#'+inspectorId).combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getAllUnitUserChildrens.do?unitId='+user.unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth(inspectorId,0.145,'combobox');
}

function setBoObjWidth(boxid){
	var boObj = $('#' + boxid);
	boObj.combobox('resize', inputWidth*0.7);
}




