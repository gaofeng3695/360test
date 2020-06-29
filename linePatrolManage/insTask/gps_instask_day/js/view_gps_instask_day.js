
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
	getGpsInstaskDayById();
});

/**
 * @desc 获得数据
 */
function getGpsInstaskDayById(){
	$.ajax({
		url : rootPath+"/gpsinstaskday/get.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
				loadgpslinedatagrid();
				loadgpslinetimedatagrid(data.data.insfreq);
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
 * 加载巡检任务线路子表
 * @returns
 */
function loadgpslinedatagrid(){
	$('#gpslinedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinstaskday/getInstaskLine.do",
		queryParams :{"planoid" : pkfield},
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
		fitColumns: true,
		columns: 
		[[
			{
				field:"lineloopoidname",
	    		title:"管线",
	    		width:"150",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"beginlocation",
	    		title:"巡检起始位置",
	    		width:"140",
	    		resizable:true,
	    		align:'center'
	    	},

	    	{	
				field:"endlocation",
	    		title:"巡检终止位置",
	    		width:"140",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"beginstation",
	    		title:"起始里程(m)",
	    		width:"120",
	    		resizable:true,
	    		align:'center'
	    	},
			{	
				field:"endstation",
	    		title:"终止里程(m)",
	    		width:"120",
	    		resizable:true,
//    			sortable:true,
	    		align:'center'
	    	}
		]]
	});
}


/**
 * 加载巡检任务线路工作时间子表
 * @returns
 */
function loadgpslinetimedatagrid(insfreq){
	$.ajax({
		url : rootPath+"/gpsinstaskday/getInstaskLineTime.do",
		data :{"planoid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data){
				for(var i=0; i<data.length; i++){
					var boarddiv = "<div><h6>开始时间点: "+data[i].bdatetime+"&nbsp;&nbsp;&nbsp;结束时间点: "+data[i].edatetime+"</h6></div>";
					boarddiv += "<div id=\"toolbar"+i+"\" class=\"datagrid-toolbar\"><a id=\""+i+"\" href=\"#\" class=\"easyui-linkbutton fa fa-minus l-btn l-btn-small l-btn-plain\" plain=\"true\" onclick=\"deleteTaskPoint("+i+")\"><label><span>删除</span></label></a></div>";
					var datagrid = "<table id='gpslineTimedatagrid"+i+"' class='easyui-datagrid'></table>";
					if(i != data.length-1){
						datagrid += "<br/>";
					}
					$("#gpslineTime").append(boarddiv);
					var rs = $(datagrid).appendTo("#gpslineTime");
					$.parser.parse(rs);
					loadgpskeypointdatagrid(insfreq, "gpslineTimedatagrid"+i, data[i].oid,data[i].bdatetime, data[i].edatetime);
				}
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
 * @desc 删除任务关键点
 * @param oid 数据ID  pointid
 */
function deleteTaskPoint(i){
	/* 先要知道是需要删除的datagraid */
	var rows = $('#gpslineTimedatagrid'+i).datagrid('getSelections');
	var idArray=[];
	if (rows.length > 0){
		$(rows).each(function(i,obj){
			idArray.push(obj.oid);
		});
	}else{
		top.showAlert("提示","请选择记录",'info');
		return ;
	}
	if(!isNull(idArray)){
		$.messager.confirm('删除', '您确定要删除这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
					url: rootPath+"/gpsinstaskday/deleteTaskPoint.do?taskId="+pkfield,
					contentType: 'application/json;charset=utf-8',
					data: JSON.stringify({"idList" : idArray}),
					type: "POST",
					dataType:"json",
					async:false,
					success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpslineTimedatagrid'+i).datagrid('reload');
								$('#gpslineTimedatagrid'+i).datagrid('clearSelections');
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "删除失败", 'error');
						}else{
							top.showAlert("提示", data.msg, 'info');
						}
					},
					error : function(data) {
						top.showAlert('错误', '删除出错', 'info');
					}
				});
			}
		});
	}
}

/**
 * 加载巡检任务关键点子表
 * @returns
 */
function loadgpskeypointdatagrid(insfreq, dgname,instasktimeoid,bdatetime, edatetime){
	$('#'+dgname).datagrid({
		idField:'oid',
		url: rootPath+"/gpsinstaskday/getInstaskkeypoint.do",
		queryParams :{
			"planoid" : pkfield, 
			"insfreq" : insfreq, 
			"instasktimeoid" : instasktimeoid,
			"bdatetime" : bdatetime,
			"edatetime" : edatetime
		},
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
		fitColumns: true,
		frozenColumns:[[
			{
				field:"lineloopoidname",
	    		title:"管线",
	    		width:"150",
	    		resizable:true,
	    		align:'center'
	    	},
	    	{
				field:"pointidname",
	    		title:"关键点",
	    		width:"180",
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
	    	{	
				field:"arrivaltime",
	    		title:"到达时间",
	    		width:"120",
	    		resizable:true,
	    		align:'center'
	    	},
            {
                field:"modifyDatetime",
                title:"上传时间",
                width:"120",
                resizable:true,
                align:'center',
                formatter: function(value,row,index){
                    if(row.pointstatusname == '已巡检') {
						return '<span>'+value+'</span>'
					}
                }
            },
			{	
				field:"pointstatusname",
	    		title:"状态",
	    		width:"150",
	    		resizable:true,
	    		align:'center'
	    	}
		]]
	});
}

/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$("#instypeCodeName").html(jsondata.instypeCodeName);
	$("#insvehicleCodeName").html(jsondata.insvehicleCodeName);
	$("#inspectoridname").html(jsondata.inspectoridname);
	$("#insbdate").html(jsondata.insbdate);
	$("#insedate").html(jsondata.insedate);
	$("#execunitidname").html(jsondata.execunitidname);
	$("#planno").html(jsondata.planno);
	if( jsondata.insfrequnit == '06' || jsondata.insfrequnit == '07') {
		$('#insfreqcont').html( (jsondata.insfrequnit=='01'?'日':jsondata.insfrequnitCodeName) + jsondata.insfreq + '巡');
	} else {
		$('#insfreqcont').html(jsondata.insfrequnitval + (jsondata.insfrequnit=='01'?'日':jsondata.insfrequnitCodeName) + jsondata.insfreq + '巡');
	}


	$.get(rootPath+'/gpsinspector/getByInsname.do?oid='+jsondata.inspectorid, function( result ) {
		if( result != null && result.data != null ) {
			if(result.data.patrolObject != null ) {
				if( result.data.patrolObject.includes('01') && result.data.patrolObject.includes('02') ) {
					$("#inspectortypeCodeName").html('段长/区长');
				} else if( result.data.patrolObject.includes('01') ) {
					$("#inspectortypeCodeName").html('段长');
				} else {
					$("#inspectortypeCodeName").html('区长');
				}
			}
		}

		if(jsondata.inspectortype == '01') {
			$("#inspectortypeCodeName").html('巡线工');
		} else if( jsondata.inspectortype == '02') {
			$("#planno").html('无计划');
			$("#insvehicleCodeName").html('无');
			/* 将隐藏的显示 */
			$('#segment').show();
			if(jsondata.completeSign == '1')
				$("#completeSign").html('已完成');
			else
				$("#completeSign").html('未完成');
			if(jsondata.whetherChild == '1')
				$("#whetherChild").html('是');
			else
				$("#whetherChild").html('否');
		} else if( jsondata.inspectortype == '03') {
			$("#planno").html('无计划');
			$("#insvehicleCodeName").html('无');
			$("#inspectortypeCodeName").html('其他人员巡检');
		}
	})

}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsInstaskDay");
}

