
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
	$('#printBtn').on('click', function() {
		$('#changeinfo .table-content #description').printThis({
			header: "<h1 style='text-align: center'>段长岗位描述</h1>"
		});
	})
	getGpsInsrangeById();
	initKeyPoingData();

//	initPlanInfoData();
	
});
//初始化计划列表
function initPlanInfoData(){
	$('#gpsPlanInfodatagrid').datagrid({
		idField:'oid',
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
        fitColumns: true,
		frozenColumns:[[
		]],
		columns: 
		[[
			{	
				field:"code",
	    		title:"巡检计划编号",
	    		width:$(this).width() * 0.33,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"startTime",
	    		title:"计划开始时间",
	    		width:$(this).width() * 0.33,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"insedate",
	    		title:"计划结束时间",
	    		width:$(this).width() * 0.33,
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("../../gps_plan_info/view_gps_plan_info.html?oid="+indexData.oid,"viewGpsPlanInfo","计划详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsPlanInfodatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});


}

//初始化关键点列表
function initKeyPoingData(){
	$('#gpsKeypointdatagrid').datagrid({
		idField:'oid',
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
        fitColumns: true,
		frozenColumns:[[
		]],
		columns: 
		[[
			{	
				field:"pointname",
	    		title:"关键点名称",
	    		width:$(this).width() * 0.1667,
	    		resizable:true,
	    		align:'center'
	    	},
			{	
				field:"pointstation",
	    		title:"关键点里程（m）",
	    		width:$(this).width() * 0.1667,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"pointposition",
	    		title:"位置描述",
	    		width:$(this).width() * 0.1667,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"effectivebegindate",
	    		title:"有效起始日期",
	    		width:$(this).width() * 0.1667,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"effectiveenddate",
	    		title:"有效终止日期",
	    		width:$(this).width() * 0.1667,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"buffer",
	    		title:"缓冲范围",
	    		width:$(this).width() * 0.1667,
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("../../pathLine/keypoint/view_gps_keypoint.html?oid="+indexData.oid,"viewGpsKeypoint","关键点详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsKeypointdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
}

/**
 * @desc 获得数据
 */
function getGpsInsrangeById(){
	$.ajax({
		url : rootPath+"/gpsinsrange/get.do",
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

    var totalInput = $("#description input");
    $.each(totalInput, function( index, item ){
        $(this).on('input',function(){
            document.getElementById(item.id).style.width = (this.value.length*13)+ 'px';
        })
    })

	$("#beginstation").html(jsondata.beginstation);
	$("#endstation").html(jsondata.endstation);
	$("#lineloopoid").html(jsondata.lineloopoName);
	$("#beginlocation").html(jsondata.beginlocation);
	$("#endlocation").html(jsondata.endlocation);
	$("#unitid").html(jsondata.unitname);
	$("#inspectorid").html(jsondata.ginspectorName);
	$("#instypeCodeName").html(jsondata.instypeCodeName);

	$("#beginkeypoint").html(jsondata.beginkeypointName);
	$("#endkeypoint").html(jsondata.endkeypointName);
	$("#beginkeypointStation").html(jsondata.beginkeypointStation);
	$("#endkeypointStation").html(jsondata.endkeypointStation);

    $("#phone").html(jsondata.phone);
    $("#segmentcode").html(jsondata.segmentcode);
    $("#segmentBeginMarker").html(jsondata.segmentBeginMarker);
    $("#segmentEndMarker").html(jsondata.segmentEndMarker);
    $("#pipeDiameter").html(jsondata.pipeDiameter);
    $("#pipeMaterial").html(jsondata.pipeMaterial);
    $("#designPressure").html(jsondata.designPressure);
    $("#province").html((jsondata.province==null?'-':jsondata.province)+'省'+(jsondata.city==null?'-':jsondata.city) + '市' + (jsondata.area==null?'-':jsondata.area) + '区/县');
    $("#transmissionMedia").html(jsondata.transmissionMedia);

    $('#taskTimeNode').css('display','contents');
    $('#taskBeginAndEnd').css('display','table-row');
    $("#insbdate").html(jsondata.insbdate);
    $("#insedate").html(jsondata.insedate);
    $('#taskTime').val(jsondata.taskTime);
    $("#insfreqName").html(jsondata.insfreqName);
    /* 如果taskTime不为空，加载具体巡检时间  */
    if(jsondata.taskTime!= null&& jsondata.taskTime!= ''){
        showTaskTime();
    }

    /* 获取数据的时候把岗位数据填充上。 */
    var brief = jsondata.descriptionDetail;
    if( brief != null && brief != '' ) {
        brief = JSON.parse(brief);
        /* 获取岗位描述所有字段。 */
        for( var item in brief ) {
            document.getElementById(item).innerHTML = brief[item];
            /* 触发input事件。 */
            $('#'+item).trigger('input');
        }
    }

	queryKeyPoint(jsondata.unitid,jsondata.lineloopoid,jsondata.beginstation,jsondata.endstation,jsondata.inspectorid,jsondata.oid);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsInsrange");
}


function queryKeyPoint(unitId,lineloopoId,qbeginstation,qendstation,inspectorId,insrangeOid){
	$.ajax({
		url : rootPath+'/gpskeypoint/getInsRangeKeypoint.do'+"?rangeOid="+pkfield,
		data :{
			"unitId" : unitId,
			"lineloopoId":lineloopoId,
			"beginstation":qbeginstation,
			"endstation":qendstation,
			"date":new Date()
		},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			$('#gpsKeypointdatagrid').datagrid('loadData',{ 'total':data.length,'rows':data });
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
	
	$.get(rootPath+"/gpspatroltimemanage/getGpsPlanInfoByInspectionOid.do?inspectionOid="+inspectorId+"&insrangeOid="+insrangeOid ,function( result ){
		$('#gpsPlanInfodatagrid').datagrid('loadData',{ 'total':result.length,'rows':result });
	});
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
    let node = '<tr class=\"show-node\">';
    node += '<th width="15%"><span>第'+(i+1)+'次巡检开始时间</span></th>';
    node += '<td width="35%"><span>'+startTime+'</span></td>';
    node += '<th width="15%"><span>第'+(i+1)+'次巡检结束时间</span></th>';
    node += '<td width="35%"><span>'+endTime+'</span></td>';
    node += '</tr>';
    $('#taskTimeNode').after(node);
}