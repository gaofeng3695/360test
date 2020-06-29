
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var unitLinebeginstation = 0;//部门管线起始里程
var unitLineendstation = 0;//部门管线终止里程
/**
 * @desc 页面初始化
 */
$(document).ready(function(){

	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='instype'+',';
	singleDomainName+='worktype'+","
	loadSelectData(comboxid,singleDomainName);

    //初始化部门下拉框
	initUnitRangeComboTree('unitid');
	setComboObjWidth('unitid',0.272,'combobox');

    /* 初始化部门 */
    $('#unitid').combotree('setValue',user.ext_field2);
	initComboboxTree();
    initLineLoopRangeComboTree('lineloopoid',user.ext_field2);

	showPan('beginlocation','endlocation','beginstation','endstation');

    /* 监听起始位置和终止位置的变化，变化后需要更新关键点。 */
	$('#beginlocation, #endlocation').on('change',function() {
        updatePoint();
	})

	var totalInput = document.getElementById("description").getElementsByTagName("input");
	for( var u = 0 ; u < totalInput.length ; u++ ) {
        totalInput[u].addEventListener('input',function() {
            this.style.width = (this.value.length*13)+ 'px';
        },false)
	}

    /* 首先将数据清空  */
    sessionStorage.removeItem('timeArray');
    sessionStorage.removeItem('mn');
    /* 巡检频次，此为值域，但是有其他操作，因此单独设置为一列。  */
    $('#insfreq').combobox({
        panelHeight:150,
        editable:true,
        mode:'remote',
        url : rootPath+"jasframework/sysdoman/getDoman.do?domainName=daytime",
        valueField : "codeId",
        textField : "codeName",
        onClick : function(row){
            let insfreq = $('#insfreq').combobox('getValue');
            /* 获取MN值 */
            let mn = row.codeId;
            /* 获取M天N次中的N值 和M值*/
            let m = row.codeId.substring(0,1);
            let u = row.codeId.substring(1,2);		// 1表示天，2表示周，3表示月，4表示年
            let n = row.codeId.substring(2,3);
            /* 巡检类型，获取巡检类型 日巡 or 夜巡 */
            // let instype = $('#instype').combobox('getValue');
            let instype = '01';
            /* 如果是天 */
            if( u == 1 ) {
                /* 如果m为1，则弹出选择时间界面，否则就不弹出 */
                if(m == 1){
                    /* 如果是巡检频次，弹出选择开始巡检时间和结束巡检时间 */
                    top.getDlg("select_point_time.html?original=save&count="+n+"&type=single"+"&instype="+instype+"&mn="+mn,"selectPointTime","选择关键点执行时间",800,300,false,true,true);
                } else {
                    /* 如果不是一天N巡，默认设置时间。*/
                    top.getDlg("select_point_time.html?original=save&count="+n+"&type=multiple"+"&instype="+instype+"&mn="+mn,"selectPointTime","选择关键点执行时间",800,300,false,true,true);
                }
            } else {
                /* 如果是周，月，年，就只设置一个时间就好了。  */
                top.getDlg("select_point_time.html?original=save&count="+n+"&type=multiple"+"&instype="+instype+"&mn="+mn,"selectPointTime","选择关键点执行时间",800,300,false,true,true);
            }

        },
        onSelect:function(data){
            /*if(insfreqValue != ''){
                $('#insfreq').combobox('setValue',insfreqValue);
            }else{
                $('#insfreq').combobox('clear');
            }*/

        }
    });
    setComboObjWidth("insfreq",0.271,'combobox');

    $('#taskTime').val('[{"startTime":"06:00:00","endTime":"20:00:00"}]');
    showTaskTime();
    /* 设置默认频次是一季度一巡。 */ /* 2020-03-26 需求变更，范传柏提出客户段长是半月一巡，区长是一周一巡.文档提出，并没提禅道。*/
    $('#insfreq').combobox('setValue','161');

    initLocaUser('inspectorid',user.ext_field2);
});

/* 初始化人员 */
function initLocaUser( inspectorId , unitId){
    /* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
    $('#'+inspectorId).combobox({
        panelHeight:150,
        editable:true,
        mode:'remote',
        url : rootPath+'/xncommon/getInspectorIdSelect.do?unitId='+unitId+'&sign=01',
        valueField : "codeid",
        textField : "codename",
        onSelect : function(row){
        }
    });
    setComboObjWidth(inspectorId,0.271,'combobox');
}

function updatePoint() {
    $('#previous').empty();
    /* 判断是否是起止位置null */
    if($('#beginlocation').val() == '' || $('#endlocation').val() == '' ) {
        $('#previous').empty();
    } else {
        getPoint();
    }
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

    /* 将选择的值赋值给下拉框 */
    /*$('#insfreq').combobox('setValue',insfreqValue);
    insfreqValue = mn;*/
}

/**
 * 获取到所有的任务关键点数据
 */
function getPoint() {
    /* 通过管线，起止里程获取到里面所有的关键点信息。 */
    $.get(rootPath+'/gpskeypoint/getInsRangeKeypoint.do?unitId='+$('#unitid').combotree('getValue')+'&lineloopoId='+$('#lineloopoid').combotree('getValue')+'&beginstation='+$('#beginstation').val()+'&endstation='+$('#endstation').val(), function (data) {
        if( data != null && data.length != 0 ) {
            /* 如果两个都有值，就查询到里程范围内的所有关键点并把他们展示出来，默认都为绿色状态。 */
            var pointElement = '';
            for(var i = 0 ; i < data.length; i ++ ) {
                pointElement = '<input class=\'tgl tgl-flip\' id=\''+data[i].oid+'\' checked = "true" type=\'checkbox\'>';
                pointElement += '<label class=\'tgl-btn\' data-tg-off=\''+data[i].pointname+'\' data-tg-on=\''+data[i].pointname+'\' for=\''+data[i].oid+'\'></label>';
                $('#previous').append(pointElement);
            }
        }
    });
}
function initKeyPoint(unitId,lineloopoId){
	$('#beginkeypoint,#endkeypoint').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/gpskeypoint/getGpsKeypointByUnitidAndLineloopoid.do?unitId='+unitId+"&lineloopoId="+lineloopoId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth('beginkeypoint',0.281,'combobox');
	setComboObjWidth('endkeypoint',0.281,'combobox');
}
var querySerialize={};	//查询条件
function initInsDataGrid(unitid){
    /* 清空人员 */
    $("#inspectorname").val("");
    $("#inspectorid").val("");

//    unitid =$('#unitid').combotree('getValue');
    if(unitid  == null || unitid == undefined || unitid == '') {
        querySerialize.unitid = user.ext_field2;
    } else {
        querySerialize.unitid = unitid;
    }
    /* 获取到人员名称输入框 */
    querySerialize.insname = $("#insname").val();
    querySerialize.pageSize = 1000;
    $('#gpsInspectordatagrid').datagrid('options').queryParams= querySerialize;
    $('#gpsInspectordatagrid').datagrid('load');
}

function onresize(){
	var containerWidth = $(window).width();
	var containerHeight = $(window).height() - $('#gpsInsrangeForm').height() - $('#button-area').height() - 48;
	$('#gpsInspectordatagrid').datagrid('resize', {
		width : containerWidth,
		height : containerHeight
	});
}

/**
 * @desc 获得巡检范围数据
 */
function getGpsSubinsById(uid,lid){
	$.ajax({
		url : rootPath+"/gpssubins/getSub.do",
		data :{
			"unitid" : uid,
			"looplineid":lid
		},
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
	unitLinebeginstation = jsondata.beginstation;//部门管线起始里程
	unitLineendstation = jsondata.endstation;//部门管线终止里程
	initKeyPoint(jsondata.unitid,jsondata.lineloopoid);
}

/**
 * 验证里程是否超出管理范围
 * @returns
 */
function validateStation(){
	var beginstation = $('#beginstation').val();
	var endstation = $('#endstation').val();
	if(beginstation < unitLinebeginstation || beginstation > unitLineendstation){
		top.showAlert("提示", '起始位置超出管理范围', 'info');
		return false;
	}else if(endstation < unitLinebeginstation || endstation > unitLineendstation){
		top.showAlert("提示", '终止位置超出管理范围', 'info');
		return false;
	}
	return true;
}


/**
 * @desc 添加数据-保存
 */
function saveGpsInsrange(){
	var bool=$("#gpsInsrangeForm").form('validate');
	if(bool==false){
		return bool;
	}
    var point = '';
	if(validateStation()){
		/* 获取到所有选中的关键点数据，将选中的关键点数据存到一个字段中。*/
        var selected =  $("input:checkbox").not("input:checked");
        if( selected == undefined || selected == null || selected.length == 0 ) {

		}else {
            for(var j = 0 ; j < selected.length ; j++ ) {
                point = point + selected[j].id+";";
            }
		}

        var formParam = $("#gpsInsrangeForm").serializeToJson();
        formParam.point = point;

        /* 获取岗位描述所有字段。 */
        var descriptionDetail = {};
        var totalInput = document.getElementById("description").getElementsByTagName("input");
        for( var u = 0 ; u < totalInput.length ; u++ ) {
            descriptionDetail[totalInput[u].id] = totalInput[u].value;
        }
        formParam.descriptionDetail = JSON.stringify(descriptionDetail);

		$.ajax({
			url : rootPath+"/gpsinsrange/save.do",
			type: "post",
			async: false,
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			data:JSON.stringify(formParam),
			success: function(data){
				if(data.status==1){
					top.showAlert("提示", "保存成功", 'info', function() {
						reloadData("query_gps_insrange.html","#gpsInsrangedatagrid");
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
	}
	

}

/**
 * @desc 重新加载数据
 * 
 * @param url 网格所在页面url
 * @param elementId 网格id
 */
function reloadData1(url, elementId) {
	if(elementId.indexOf("#")!=-1){
		elementId = elementId.substring(1);
	}
	var iframeArray = top.$("iframe");
	var browser = $.browser;
	for ( var i = 0; i < iframeArray.length; i++) {
		if ((iframeArray[i].src && iframeArray[i].src.indexOf(url) != -1)||(iframeArray[i].contentWindow.location.href && iframeArray[i].contentWindow.location.href.indexOf(url) != -1)) {
			if (browser.msie && (document.documentMode == '7')) {// 如果浏览器为ie
				// 且文档模式为ie7，则重新载入页面（因为刷新datagrid会导致datagrid显示不全）
				iframeArray[i].contentWindow.location.reload();
				break;
			} else {
				iframeArray[i].contentWindow.$("#" + elementId).datagrid("reload");
				break;
			}
		}
	}
	try {
		parent.$("#" + elementId).datagrid("reload");
	} catch (e) {

	}
}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsInsrange");
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
 * 设置巡检人员
 * @returns
 */
function selectIns(row){
	$('#inspectorid').val(row.oid);
	$('#inspectorname').val(row.insnamePlumber);
}
//清空人员
function clearIns(){
	$('#inspectorname').val('');
	$('#inspectorid').val('');
}

/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitRangeComboTree(unitid){
	/* 以下初始化查询面板 */
	/* 部门 */
	$('#'+unitid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName",
		onSelect:function(node){
			initLineLoopRangeComboTree('lineloopoid',node.id);
            initLocaUser('inspectorid',node.id);
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.ext_field2+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		
		$('#'+unitid).combotree('loadData', result.data);
	})
	setComboObjWidth(unitid,0.281,'combobox');
}
//初始化管线树数据
function initLineLoopRangeComboTree(lineloopoid,selectUnitid){
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
			selectLineid = node.id;
			selectLineName = node.text;
			//获取区段信息
			getGpsSubinsById(selectUnitid,node.id);
		},
		onLoadSuccess:function(node,data){
			$('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
		}
	});
	$.post(rootPath+'/gpslineloop/getLineLoopChildren.do?unitid='+selectUnitid,function(result){
		console.log(result);
        if(result.data.length == 1 && result.data[0].text == null ) {

        }else {
            $('#'+lineloopoid).combotree('loadData', result.data);
        }
	})
	setComboObjWidth(lineloopoid,0.272,'combobox');
}

//初始化下拉框
function initComboboxTree(){
	/* 以下初始化查询面板 */
	$('#lineloopoid').combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "id",
		textField : "text"
	});
	setComboObjWidth('lineloopoid',0.281,'combobox');
	$('#beginkeypoint,#endkeypoint').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth('beginkeypoint',0.281,'combobox');
	setComboObjWidth('endkeypoint',0.281,'combobox');
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
				}
			});
			setComboObjWidth(id,0.272,'combobox');
		}
	}
}