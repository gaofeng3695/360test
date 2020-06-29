
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
		url : rootPath+"/gpsinsrecord/get.do",
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
		url: rootPath+"/gpsinsrecord/getInsrecordLine.do",
		queryParams :{"recordoid" : pkfield},
		collapsible:true,
		autoRowHeight: false,
		pagination:false,
        fitColumns: true,
		columns: 
		[[
			{
				field:"lineloopoidname",
	    		title:"管线",
                width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"beginlocation",
	    		title:"巡检起始位置",
                width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	},

	    	{	
				field:"endlocation",
	    		title:"巡检终止位置",
                width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"slength",
	    		title:"应巡管线长度（KM）",
                width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center',
                formatter: function(value,row,index){
                    return '<span title="' +Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">' + Math.round((value/1000)*100)/100+'</span>';
                }
	    	},
	    	{	
				field:"skeypoint",
	    		title:"应巡关键点数",
                width:$(this).width() * 0.167,
	    		resizable:true,
	    		align:'center'
	    	},
			{	
				field:"rkeypoint",
	    		title:"实巡关键点数",
                width:$(this).width() * 0.167,
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
	$("#unitname").html(jsondata.unitname);
	$("#inspectoridname").html(jsondata.inspectoridname);
	$("#begindatetime").html(jsondata.begindatetime);
	$("#enddatetime").html(jsondata.enddatetime);
	$("#instypename").html(jsondata.instypename);
	$("#insfreq").html(jsondata.insfreq);
	$("#insvehicle").html(jsondata.insvehicleCodeName);
	$("#completionrate").html(jsondata.completionrate);
	$('#insdevice').html(jsondata.insdevice);
	$('#avgspeed').html(jsondata.avgspeed);
	$('#uploader').html(jsondata.uploaderName);
	$('#notreason').html(jsondata.notreason);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsInsrecord");
}

