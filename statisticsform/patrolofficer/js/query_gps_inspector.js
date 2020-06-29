
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件

/* 得到部门 ID */
var stUnitId = getUrlParam('stUnitId');
/* 得到状态，总人数/巡线工人数/管道工人数 */
var stType = getUrlParam('stType');

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsInspectordatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinspector/getPage.do?unitid="+stUnitId+"&inspectortype="+stType,
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitname",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center'
	    	},
	    	{	
				field:"insnamePlumber",
	    		title:"姓名",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center',
                formatter: function(value,row,index){
                    /* 得到部门id和字段名称  */
                    if(row.inspectortype == '01')
                    	return row.insname;
                    else
                    	return row.insnamePlumber;
                }
	    	},
	    	{	
	    		field:"sexName",
	    		title:"性别",
	    		width:"100",
	    		resizable:true,
	    		sortable:false,
	    		align:'center'
	    	},

			{	
				field:"phone",
	    		title:"联系电话",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center'
	    	},

			{	
				field:"deviceCode",
	    		title:"设备编号",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
	    	{	
	    		field:"insfreqName",
	    		title:"巡检频次",
	    		width:"100",
	    		resizable:true,
	    		sortable:false,
	    		align:'center'
	    	},
	    	{	
	    		field:"instypeCodeName",
	    		title:"巡线类型",
	    		width:"100",
	    		resizable:true,
	    		sortable:false,
	    		align:'center'
	    	},
	    	{	
	    		field:"adddate",
	    		title:"入职时间",
	    		width:"100",
	    		resizable:true,
	    		sortable:false,
	    		align:'center'
	    	},
	    	{	
	    		field:"identitycard",
	    		title:"身份证号码",
	    		width:"100",
	    		resizable:true,
	    		sortable:false,
	    		align:'center'
	    	},
	    	{	
	    		field:"homeaddress",
	    		title:"家庭地址",
	    		width:"100",
	    		resizable:true,
	    		sortable:false,
	    		align:'center'
	    	},

			/*{
				field:"description",
	    		title:"描述",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/
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
			top.getDlg("../../resourcemanage/insmanage/view_gps_inspector_detail.html?oid="+indexData.oid,"viewGpsInspector","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsInspectordatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsInspectordatagrid');
	

});



/**
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("../../resourcemanage/insmanage/view_gps_inspector_detail.html?oid="+dataId,"viewGpsInspector","详细",700,500,false,true,true);
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
