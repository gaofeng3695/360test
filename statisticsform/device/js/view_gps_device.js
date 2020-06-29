
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
	getGpsDeviceById();
	
	$('#gpsDeviceBugdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsdevicebug/getPage.do?deviceoid="+pkfield+"&sort=createDatetime&order=DESC",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		height : 435,
		fit: false, //自动适屏功能
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"bugbegindata",
	    		title:"故障申报时间",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"bugendindata",
	    		title:"故障解决时间",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"bugphenomenonName",
	    		title:"故障现象",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
			{	
				field:"applyremarks",
	    		title:"故障描述",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"applypeopleName",
	    		title:"申报人",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"buggeasonName",
	    		title:"故障原因",
	    		width:"130",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"approvamarks",
	    		title:"故障审批意见",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{
				field:"approvapleName",
	    		title:"故障审批人",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	}/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"150",
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span>\
							   </a></p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_device_bug.html?oid="+indexData.oid,"viewGpsDeviceBug","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsDeviceBugdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	/*initDatagrigHeight('gpsDeviceBugdatagrid','','100');*/
	
	// 加载图片信息
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
});

/**
 * @desc 获得数据
 */
function getGpsDeviceById(){
	$.ajax({
		url : rootPath+"/gpsdevice/get.do",
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
	$("#status").html(jsondata.statusName);
	$("#condition").html(jsondata.conditionName);
	$("#devname").html(jsondata.devname);
	$("#devcode").html(jsondata.devcode);
	$("#devtype").html(jsondata.devtypeName);
	$("#sim").html(jsondata.sim);
	$("#releasedate").html(jsondata.releasedate);
	$("#ewarrantydate").html(jsondata.ewarrantydate);
	$("#manufacturer").html(jsondata.manufacturer);
	$("#description").html(jsondata.description);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsDevice");
}

/*function view(oid){
	let rows1 = $('#gpsDeviceBugdatagrid').datagrid('getSelections');
	let dataId1 = "";
	if(!isNull(oid)){
		dataId1 = oid;
	}else if (rows1.length == 1){
		dataId1 = rows1[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_device_bug.html?oid="+dataId1,"viewGpsDeviceBug	","详细",800,600,false,true,true);
}*/