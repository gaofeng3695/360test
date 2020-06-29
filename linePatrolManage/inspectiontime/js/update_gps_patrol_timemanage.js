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
/* 获取到的计划数据 */
var plan = '';

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
	
	initUnitComboTree('unitid');
	
	/*initLineLoopComboTree('lineloopoid',user.unitId);*/
	
	getGpsPatrolTimemanageById();
});

/**
 * @desc 修改数据-保存
 */
function updateGpsPatrolTimemanage(){
	disableButtion("saveButton");
	var bool=$('#gpsPatrolTimemanageForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	
	/* 将所有的巡检时间组成JSON数组，放入taskTime字段中 */
	let taskTimeArray = generateTaskTime();
	if(taskTimeArray == false){
		enableButtion("saveButton");
		return bool;
	}
	$('#taskTime').val(taskTimeArray);
	console.log(taskTimeArray);
	
	$.ajax({
		url : rootPath+"/gpspatroltimemanage/update.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsPatrolTimemanageForm').serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
				top.showAlert("提示", "更新成功", 'info', function() {
					reloadData("query_gps_patrol_timemanage.html","#gpsPatrolTimemanagedatagrid");
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
function getGpsPatrolTimemanageById(){
	$.ajax({
		url : rootPath+"/gpspatroltimemanage/get.do",
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
	$('#planevoid').val(jsondata.planevoid);
	$('#insfreqName').val(jsondata.insfreqName);
	$('#taskTime').val(jsondata.taskTime);
	
	initInspection(user.unitId, jsondata.inspectorid);
	
	createPlanElement(jsondata.planevoid);
	
	/* 获取人员巡检类型 */
	$.get( rootPath+'/gpsinspector/get.do?oid='+jsondata.inspectorid, function( result ){
		if(result.status == 1){
			$('#second').remove();
			createInspectionTypeNode(result.data.instypeCodeName);
			
			$(".input_bg.show").css('border', 'none');
		}
	} )
	
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
	top. closeDlg("updateGpsPatrolTimemanage");
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
			initLineLoopComboTree('lineloopoid' , node.id);
			
			initInspection(node.id);
		},
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		
		$('#'+unitid).combotree('loadData', result.data);
	})
	setComboObjWidth(unitid,0.281,'combobox');
}

function initLineLoopComboTree(lineloopoid,selectUnitid){
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
			
		},
		onLoadSuccess:function(node,data){
			$('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
		}
	});
	$.post(rootPath+'/gpslineloop/getLineLoopChildren.do?unitid='+selectUnitid,function(result){
		console.log(result);
		$('#'+lineloopoid).combotree('loadData', result.data);
	})
	setComboObjWidth(lineloopoid,0.281,'combobox');
}

/**
 * 初始化巡检人员
 * @returns
 */
function initInspection(unitId, inspectorid){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#inspectorid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getAllUnitUserChildren.do?unitId='+unitId+'&inspectorId='+inspectorid,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth("inspectorid",0.281,'combobox');
	
	$('#inspectorid').combobox('setValue', inspectorid);
}

/**
 * 创建计划节点
 * @returns
 */
function createPlanElement(oid){
	ajaxLoading();
	/* 根据巡检计划id获取巡检计划 */
	$.get(rootPath+"/gpspatroltimemanage/getPlanByOid.do?oid="+oid ,function( result ){
		ajaxLoadEnd();
		if(result!=null && result!=''){
			/* 保存计划数据 */
			plan = result;
			for( let i = 0 ; i < result.length ; i++ ){
				let node = '<div class=\"table-content\">';
				node += '<h6 class=\"table-title\">计划'+(i+1)+'</h6>';
				node += '<table align=\"center\" class=\"edit-table\">';
				node += '<tr>';
				node += '<td width=\"20%\"><span>计划编号：</span></td>';
				node += '<td width=\"30%\">';
				node += '<input readonly=\"readonly\" value=\"'+result[i].code+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
				node += '</td>';
				node += '<td width=\"20%\"><span>计划开始时间：</span></td>';
				node += '<td width=\"30%\">';
				node += '<input readonly=\"readonly\" value=\"'+result[i].startTime+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
				node += '</td>';
				node += '</tr>';
				
				node += '<tr>';
				node += '<td width=\"20%\"><span>巡检频次：</span></td>';
				node += '<td width=\"30%\">';
				node += '<input readonly=\"readonly\" value=\"'+result[i].insfreqName+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
				node += '</td>';
				node += '<td width=\"20%\"><span>巡检类型</span></td>';
				node += '<td width=\"30%\">';
				node += '<input readonly=\"readonly\" value=\"'+result[i].instype+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
				node += '</td>';
				node += '</tr>';
				
				if(result[i].gpsPlanLineInfo != null){
					for( let k =0 ; k < result[i].gpsPlanLineInfo.length ; k++ ){
						node += '<tr>';
						node += '<td width=\"20%\"><span>起始位置：</span></td>';
						node += '<td width=\"30%\">';
						node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].beginlocation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
						node += '</td>';
						node += '<td width=\"20%\"><span>终止位置：</span></td>';
						node += '<td width=\"30%\">';
						node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].endlocation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
						node += '</td>';
						node += '</tr>';
						
						node += '<tr>';
						node += '<td width=\"20%\"><span>起始里程：</span></td>';
						node += '<td width=\"30%\">';
						node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].beginstation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
						node += '</td>';
						node += '<td width=\"20%\"><span>终止里程：</span></td>';
						node += '<td width=\"30%\">';
						node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].endstation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
						node += '</td>';
						node += '</tr>';
						
						node += '<tr>';
						node += '<td width=\"20%\"><span>管线名称：</span></td>';
						node += '<td width=\"30%\">';
						node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].lineloopoidname+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
						node += '</td>';
						node += '<td width=\"20%\"><span></span></td>';
						node += '<td width=\"30%\">';
						node += '<input readonly=\"readonly\"  class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
						node += '</td>';
						node += '</tr>';
					}
					
				}
				
				/* 获取巡检时间 */
				let taskTimeResult = $('#taskTime').val();
				let taskTimeData = '';
				if(taskTimeResult != '' && taskTimeResult != null && taskTimeResult != 'null'){
					taskTimeResult = JSON.parse(taskTimeResult);
					taskTimeData = taskTimeResult.data;
				}
				/* 获取M天N次中的N值 和M值*/
				let m = result[i].insfreq.substring(0,1);
				let n = result[i].insfreq.substring(1,2);
				/* 获取单位 */
				let unit = result[i].insfreqUnit;
				/* 如果m不为1*/
				if( m != '1' || unit != '01' ){
                    let number = parseInt(m);
                    for( let j = 0 ; j < number ; j++ ){
                        node += '<tr>';
                        node += '<td width=\"20%\"><span style=\"color:red;vertical-align: bottom;margin-right:5px\">*</span><span>第'+(j+1)+'次巡检开始时间：</span></td>';
                        node += '<td width=\"30%\">';
                        node += '<input value = \"'+taskTimeData[j].startTime+'\" id=\"startTime'+(i+1)+''+(j+1)+'\" required = \"required\"  class=\"easyui-validatebox Wdate input_bg\" onclick = \"WdatePicker({dateFmt:\'HH:mm:ss\',minTime:\'06:00:00\',maxTime:\'20:00:00\'})\" />';
                        node += '</td>';
                        node += '<td width=\"20%\"><span style=\"color:red;vertical-align: bottom;margin-right:5px\">*</span><span>第'+(j+1)+'次巡检结束时间：</span></td>';
                        node += '<td width=\"30%\">';
                        node += '<input value = \"'+taskTimeData[j].endTime+'\" id=\"endTime'+(i+1)+''+(j+1)+'\" required = \"required\"  class=\"easyui-validatebox Wdate input_bg\" onclick = \"WdatePicker({dateFmt:\'HH:mm:ss\',minTime:\'06:00:00\',maxTime:\'20:00:00\'})\"  />';
                        node += '</td>';
                        node += '</tr>';
                    }
				}else{
					/* 如果m为1 */
					let number = parseInt(n);
					for( let j = 0 ; j < number ; j++ ){
						node += '<tr>';
						node += '<td width=\"20%\"><span style=\"color:red;vertical-align: bottom;margin-right:5px\">*</span><span>第'+(j+1)+'次巡检开始时间：</span></td>';
						node += '<td width=\"30%\">';
						node += '<input value = \"'+taskTimeData[j].startTime+'\" id=\"startTime'+(i+1)+''+(j+1)+'\" required = \"required\"  class=\"easyui-validatebox Wdate input_bg\" onclick = \"WdatePicker({dateFmt:\'HH:mm:ss\',minTime:\'06:00:00\',maxTime:\'20:00:00\'})\" />';
						node += '</td>';
						node += '<td width=\"20%\"><span style=\"color:red;vertical-align: bottom;margin-right:5px\">*</span><span>第'+(j+1)+'次巡检结束时间：</span></td>';
						node += '<td width=\"30%\">';
						node += '<input value = \"'+taskTimeData[j].endTime+'\" id=\"endTime'+(i+1)+''+(j+1)+'\" required = \"required\"  class=\"easyui-validatebox Wdate input_bg\" onclick = \"WdatePicker({dateFmt:\'HH:mm:ss\',minTime:\'06:00:00\',maxTime:\'20:00:00\'})\"  />';
						node += '</td>';
						node += '</tr>';
					}
				}
				
				$('#timeNode').after(node);
			}
			
			$(".input_bg.show").css('border', 'none');
		}else{
			top.showAlert("提示", "暂无计划。", 'info');
		}
	})
}

/**
 * 生成任务时间数组
 * @returns
 */
function generateTaskTime(){
	/* 任务时间的数组 */
	let taskTimeArray = '[';
	for( let i = 0 ; i < plan.length ; i++ ){
		let taskTimeObject = '{';
		taskTimeObject += '\"planevoid\":\"'+plan[i].pid+'\",';
		taskTimeObject += '\"insfreq\":\"'+plan[i].insfreq+'\",';
		taskTimeObject += '\"insfreqName\":\"'+plan[i].insfreqName+'\",';
		/* 获取M天N次中的N值 和M值*/
		let m = plan[i].insfreq.substring(0,1);
		let n = plan[i].insfreq.substring(1,2);
		/* 如果m不为1*/
		if( m != '1' ){
            let times = parseInt(m);
			let array = '[';
            for( let j = 0 ; j < times ; j++ ){
                /* 获取第i组的开始时间和结束时间 */
                let startTime = $('#startTime'+(i+1)+''+(j+1)+'').val();
                let endTime = $('#endTime'+(i+1)+''+(j+1)+'').val();
                /* 如果时间没值，提示必填 */
                if(startTime == '' || endTime == ''){
                    top.showAlert("提示", "第"+(i+1)+"次巡检计划的第"+(j+1)+"次巡检的时间不能为空！", 'info');
                    return false;
                }else{
                    let item = '{\"startTime\" : \"'+startTime+'\",\"endTime\": \"'+endTime+'\"}';
                    array += item;
                }

                /* 如果不是最后一个元素，在array后面加一个逗号 */
                if(j != (times-1)){
                    array += ',';
                }
            }
			
			array += ']';
			
			taskTimeObject += '\"data\":'+array;
			
		}else{
			/* 如果m为1 */
			let times = parseInt(n);
			/* 将所有的巡检时间组成JSON数组 */
			let array = '[';
			for( let j = 0 ; j < times ; j++ ){
				/* 获取第i组的开始时间和结束时间 */
				let startTime = $('#startTime'+(i+1)+''+(j+1)+'').val();
				let endTime = $('#endTime'+(i+1)+''+(j+1)+'').val();
				/* 如果时间没值，提示必填 */
				if(startTime == '' || endTime == ''){
					top.showAlert("提示", "第"+(i+1)+"次巡检计划的第"+(j+1)+"次巡检的时间不能为空！", 'info');
					return false;
				}else{
					let item = '{\"startTime\" : \"'+startTime+'\",\"endTime\": \"'+endTime+'\"}';
					array += item;
				}
				
				/* 如果不是最后一个元素，在array后面加一个逗号 */
				if(j != (times-1)){
					array += ',';
				}
			}
			
			array += ']';
			
			taskTimeObject += '\"data\":'+array;
		}
		
		taskTimeObject += '}';
		
		/* 如果不是最后一个元素，在array后面加一个逗号 */
		if(i != (plan.length-1)){
			taskTimeObject += ',';
		}
		
		taskTimeArray += taskTimeObject;
	}
	taskTimeArray += ']';
	return taskTimeArray;
}

/**
 * loading效果
 */
function ajaxLoading(){   
    $("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo("body");   
    $("<div class=\"datagrid-mask-msg\"></div>").html("正在查询计划数据，请稍候。。。").appendTo("body").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2});   
}
/**
 * 去除loading效果
 * @returns
 */
function ajaxLoadEnd(){   
    $(".datagrid-mask").remove();   
    $(".datagrid-mask-msg").remove();               
}

/**
 * 创建人员巡检类型节点
 */
function createInspectionTypeNode( type ){
	let node = '<tr id = \"second\">';
	node += '<td width=\"20%\"><span>巡检类型：</span></td>';
	node += '<td width=\"30%\">';
	node += '<input readonly=\"readonly\" class=\"easyui-validatebox input_bg show\" value = '+type+'  maxlength="20"/>';
	node += '</td>';
	node += '</tr>';
	$('#first').after(node);
}
