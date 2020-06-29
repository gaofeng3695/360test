
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
	masterTableChildHeight();	// 计算标签内容高度
	getGpsKeypointById();
	
	getGpsTemporaryTaskTimeByTaskId();
	
});


function generateDatagraid( id, taskTimeOid){
	$('#'+id).datagrid({
		idField:'oid',
		url: rootPath+"/gpstemporarytaskpoint/getPage.do?taskTimeOid="+taskTimeOid+"&sort=insbDate&order=DESC",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		pagination : false,
		//height : 435,
		fit: false, //自动适屏功能
		frozenColumns:[[
            /*{field:'ck',checkbox:true},*/
            {	
	    		field:"name",
	    		title:"临时关键点名称",
	    		width:"200",
	    		iconCls: 'icon-edit',
	    		resizable:true,
	    		align:'center',
	    		editor: 'text' 
	    	},
	    	{	
	    		field:"inspectorName",
	    		title:"巡检人员",
	    		width:"150",
	    		iconCls: 'icon-edit',
	    		resizable:true,
	    		align:'center',
	    		editor: 'text' 
	    	}
		]],
		columns: 
		[[
	    	
	    	
	    	/*{	
	    		field:"insfreq",
	    		title:"巡检频次",
	    		width:"100",
	    		iconCls: 'icon-edit',
	    		resizable:true,
	    		align:'center',
	    		editor: 'text',
	    		formatter: function (value, rec, rowIndex) {  
	    			if(value=='0')
	    				return "未关闭";
	    			else
	    				return "关闭";
	    		} 
	    	},*/
			{	
	    		field:"pointstatus",
	    		title:"关键点状态",
	    		width:"100",
	    		iconCls: 'icon-edit',
	    		resizable:true,
	    		align:'center',
	    		editor: 'text',
	    		formatter: function (value, rec, rowIndex) {  
	    			if(value=='0'){
	    				return "未巡检";
	    			}else if(value=='1'){
	    				return "已巡检";
	    			}else{
	    				return "异常";
	    			}
	    		} 
	    	},
	    	{	
	    		field:"arrivaltime",
	    		title:"到达时间",
	    		width:"200",
	    		iconCls: 'icon-edit',
	    		resizable:true,
	    		align:'center',
	    		editor: 'text' 
	    	},{
				field:"modifyDatetime",
				title:"上传时间",
				width:"200",
				iconCls: 'icon-edit',
				resizable:true,
				align:'center',
				editor: 'text',
				formatter: function(value,row,index){
					if(row.pointstatus == '1') {
						return '<span>'+value+'</span>'
					}
				}
			},
	    	{	
	    		field:"remaintime",
	    		title:"停留时间",
	    		width:"200",
	    		iconCls: 'icon-edit',
	    		resizable:true,
	    		align:'center',
	    		editor: 'text' 
	    	},
	    	{	
	    		field:"lon",
	    		title:"关键点经度",
	    		width:"100",
	    		iconCls: 'icon-edit',
	    		resizable:true,
	    		align:'center',
	    		editor: 'text' 
	    	},
	    	{	
	    		field:"lat",
	    		title:"关键点纬度",
	    		width:"100",
	    		iconCls: 'icon-edit',
	    		resizable:true,
	    		align:'center',
	    		editor: 'text' 
	    	}/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"100",
		  		formatter: function(value,row,index){
		  			console.log(row.processType+"---"+row.processStatus);
		  				var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
		  							<span class="fa fa-eye"></span>\
		  							</a></p>';
					
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("../temporarytaskpoint/view_gps_temporary_task_point.html?oid="+indexData.oid,"viewGpsTemporaryTaskPoint","详细",800,300,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#viewTemporarytaskpointdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	//initDatagrigHeight(id,'','100');
}
/**
 * @desc 获得数据
 */
function getGpsKeypointById(){
	$.ajax({
		url : rootPath+"/gpstemporarytask/get.do",
		data :{"oid" : pkfield},
		type : 'POST',
		async: false,
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
	$("#execUnitName").html(jsondata.execUnitName);
	$("#insfreqName").html(jsondata.insfreqName);
	$("#insbDate").html(jsondata.insbDate);
	$("#inseDate").html(jsondata.inseDate);
	$("#inspectorName").html(jsondata.inspectorName);
	
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsTemporaryTask");
}

function view(oid){
	
}

function view(oid){
	var rows = $('#viewTemporarytaskpointdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("../temporarytaskpoint/view_gps_temporary_task_point.html?oid="+dataId,"viewGpsTemporaryTaskPoint","详细",800,300,false,true,true);
}

/**
 * 根据任务ID获取巡检时间
 * @returns
 */
function getGpsTemporaryTaskTimeByTaskId(){
	$.post(rootPath+"/gpstemporarytask/getGpsTemporaryTaskTimeByTaskId.do",{'taskId':pkfield}, function( result ){
		if( result.status = 1 ){
			for( let i = 0 ; i < result.data.length ; i++ ){
				createTemporaryTaskKeypointNode( result.data[i], i );
				/* 给巡检时间赋值 */
				$("#time"+i).html(' ( '+result.data[i].begintime+' 至 '+result.data[i].endtime+' ) ');
				/* 初始化datagraid */
				generateDatagraid("viewTemporarytaskpointdatagrid"+i, result.data[i].oid);
			}
		}else{
			top.showAlert("错误","获取巡检时间出错",'error');
		}
	} )
}

/**
 * 创建临时任务关键点节点
 */
function createTemporaryTaskKeypointNode( time, i ){
	let node = '<div class=\"table-content\">';
	node += '<h6 class=\"table-title\">巡检时间 <span id=\"time'+i+'\"></span></h6>';
	node += "<div id=\"toolbar"+i+"\" class=\"datagrid-toolbar\"><a id=\""+i+"\" href=\"#\" class=\"easyui-linkbutton fa fa-minus l-btn l-btn-small l-btn-plain\" plain=\"true\" onclick=\"deleteTaskPoint("+i+")\"><label><span>删除</span></label></a></div>";
	node += '<table id=\"viewTemporarytaskpointdatagrid'+i+'\" class=\"easyui-datagrid\"></table>';
	node += '</div>';
	$('#tableDetail').after(node);
}

/**
 * @desc 删除临时任务关键点
 * @param oid 数据ID  pointid
 */
function deleteTaskPoint(i){
	/* 先要知道是需要删除的datagraid */
	var rows = $('#viewTemporarytaskpointdatagrid'+i).datagrid('getSelections');
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
					url: rootPath+"/gpsinstaskday/deleteTempTaskPoint.do?taskId="+pkfield,
					contentType: 'application/json;charset=utf-8',
					data: JSON.stringify({"idList" : idArray}),
					type: "POST",
					dataType:"json",
					async:false,
					success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#viewTemporarytaskpointdatagrid'+i).datagrid('reload');
								$('#viewTemporarytaskpointdatagrid'+i).datagrid('clearSelections');
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