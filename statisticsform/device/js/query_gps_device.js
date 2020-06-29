
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
var user = JSON.parse(sessionStorage.user);
/* 获取页面显示的内容，declare 表示申报和驳回的数据还有未申报；review 审核表示只显示需要审核的数据；logout表示注销 */
var flag = getUrlParam('flag');
/* 得到部门 ID */
var stUnitId = getUrlParam('stUnitId');
/* 得到状态，总数/巡线工正常设备/巡线工故障设备/管道工正常设备/管道工故障设备/未分配设备数量/已分配设备数量 */
var stType = getUrlParam('stType');
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#export').menubutton({menu:'#exportBars'}); 
	var purl = '';
	if(stUnitId != '' && stUnitId!='null' && stUnitId!= null){
		purl = rootPath+"/gpsdevice/getPageForStaistics.do?flag="+flag+"&unitid="+stUnitId+"&status="+stType;
	}else{
		purl = rootPath+"/gpsdevice/getPageForStaistics.do?flag="+flag;
	}
	$('#gpsDevicedatagridForThis').datagrid({
		idField:'oid',
		url: purl,
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitName",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},
	    	{	
				field:"statusName",
	    		title:"设备状态",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center',
				styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},
	    	{	
	    		field:"approvalStatusName",
	    		title:"设备审批状态",
	    		width:"100",
	    		resizable:true,
	    		sortable:false,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},
	    	{	
				field:"conditionName",
	    		title:"设备的分配情况",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},
	    	{	
				field:"devname",
	    		title:"设备名称",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	}
		]],
		columns: 
		[[
			{	
				field:"devcode",
	    		title:"设备编号",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			{	
				field:"devtypeName",
	    		title:"设备类型",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			{	
				field:"sim",
	    		title:"SIM卡号",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			{	
				field:"releasedate",
	    		title:"投产日期",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			{	
				field:"ewarrantydate",
	    		title:"保修终止日期",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			{	
				field:"manufacturer",
	    		title:"生产厂家",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},
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
			}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_device.html?oid="+indexData.oid,"viewGpsDevice","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsDevicedatagridForThis').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsDevicedatagridForThis','queryDiv','100');
	
});




/**
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	var rows = $('#gpsDevicedatagridForThis').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_device.html?oid="+dataId,"viewGpsDevice","详细",800,600,false,true,true);
}



/**
 * 获取url中的参数
 * @param name
 * @returns
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}