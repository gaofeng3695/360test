
/**
 * @file
 * @author 作者
 * @desc 查看页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID
var businessId = "";
/**
 * @desc 初始化
 */
$(document).ready(function(){
	getGpsPatrolTimemanageById();
});

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
	$("#unitid").html(jsondata.unitName);
	/*$("#lineloopoid").html(jsondata.lineloopName);*/
	$("#inspectorid").html(jsondata.inspectorName);
	$("#planevoid").html(jsondata.planevName);
	$("#insfreq").html(jsondata.insfreq);
	
	$('#taskTime').val(jsondata.taskTime);
	createPlanElement(jsondata.planevoid);
	
	/* 获取人员巡检类型 */
	$.get( rootPath+'/gpsinspector/get.do?oid='+jsondata.inspectorid, function( result ){
		if(result.status == 1){
			$('#second').remove();
			createInspectionTypeNode(result.data.instypeCodeName);
		}
	} )
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsPatrolTimemanage");
}


/**
 * 创建计划节点
 * @returns
 */
function createPlanElement(oid){
	/* 根据巡检计划id获取巡检计划 */
	$.get(rootPath+"/gpspatroltimemanage/getPlanByOid.do?oid="+oid ,function( result ){
		/* 保存计划数据 */
		plan = result;
		for( let i = 0 ; i < result.length ; i++ ){
			let node = '<div class=\"table-content\">';
			node += '<h6 class=\"table-title\">计划'+(i+1)+'</h6>';
			node += '<table align=\"center\" class=\"detail-table\">';
			node += '<tr>';
			node += '<th width=\"15%\"><span>计划编号</span></th>';
			node += '<td width=\"35%\">';
			node += '<span>'+result[i].code+'</span>';
			node += '</td>';
			node += '<th width=\"15%\"><span>计划开始时间</span></th>';
			node += '<td width=\"35%\">';
			node += '<span>'+result[i].startTime+'</span>';
			node += '</td>';
			node += '</tr>';
			
			node += '<tr>';
			node += '<th width=\"15%\"><span>巡检频次</span></th>';
			node += '<td width=\"35%\">';
			node += '<span>'+result[i].insfreqName+'</span>';
			node += '</td>';
			node += '<th width=\"15%\"><span>巡检类型</span></td>';
			node += '<td width=\"35%\">';
			node += '<span>'+result[i].instype+'</span>';
			node += '</td>';
			node += '</tr>';
			
			if(result[i].gpsPlanLineInfo != null){
				for( let k =0 ; k < result[i].gpsPlanLineInfo.length ; k++ ){
					node += '<tr>';
					node += '<th width=\"15%\"><span>起始位置</span></th>';
					node += '<td width=\"35%\">';
					node += '<span>'+result[i].gpsPlanLineInfo[k].beginlocation+'</span>';
					node += '</td>';
					node += '<th width=\"15%\"><span>终止位置</span></th>';
					node += '<td width=\"35%\">';
					node += '<span>'+result[i].gpsPlanLineInfo[k].endlocation+'</span>';
					node += '</td>';
					node += '</tr>';
					node += '<tr>';
					node += '<th width=\"15%\"><span>起始里程</span></th>';
					node += '<td width=\"35%\">';
					node += '<span>'+result[i].gpsPlanLineInfo[k].beginstation+'</span>';
					node += '</td>';
					node += '<th width=\"15%\"><span>终止里程</span></th>';
					node += '<td width=\"35%\">';
					node += '<span>'+result[i].gpsPlanLineInfo[k].endstation+'</span>';
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
                    node += '<th width=\"15%\"><span>第'+(j+1)+'天巡检开始时间</span></td>';
                    node += '<td width=\"35%\">';
                    node += '<span>'+taskTimeData[j].startTime+'</span>';
                    node += '</td>';
                    node += '<th width=\"15%\"><span>第'+(j+1)+'天巡检结束时间</span></th>';
                    node += '<td width=\"35%\">';
                    node += '<span>'+taskTimeData[j].endTime+'</span>';
                    node += '</td>';
                    node += '</tr>';
                }
			}else{
				/* 如果m为1 */
				let number = parseInt(n);
				for( let j = 0 ; j < number ; j++ ){
					node += '<tr>';
					node += '<th width=\"15%\"><span>第'+(j+1)+'次巡检开始时间</span></td>';
					node += '<td width=\"35%\">';
					node += '<span>'+taskTimeData[j].startTime+'</span>';
					node += '</td>';
					node += '<th width=\"15%\"><span>第'+(j+1)+'次巡检结束时间</span></th>';
					node += '<td width=\"35%\">';
					node += '<span>'+taskTimeData[j].endTime+'</span>';
					node += '</td>';
					node += '</tr>';
				}
			}
			

			$('#timeNode').after(node);
		}
	})
}

/**
 * 创建人员巡检类型节点
 */
function createInspectionTypeNode( type ){
	let node = '<tr id = \"second\">';
	node += '<th width=\"15%\"><span>巡检类型</span></th>';
	node += '<td width=\"35%\" colspan=\"3\"><span>'+type+'</span></td>';
	node += '</tr>';
	$('#first').after(node);
}
