
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsDevOfflineWarningdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsdevofflinewarning/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		columns: 
		[[
			{	
				field:"unitname",
	    		title:"部门名称",
	    		width:"300",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{
				field:"deadlinetime",
	    		title:"截止时间",
	    		width:"300",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_dev_offline_warning.html?oid="+indexData.oid,"viewGpsDevOfflineWarning","详细",700,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsDevOfflineWarningdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsDevOfflineWarningdatagrid','queryDiv','100');
	initUnitComboTree('unitid');
	
});

/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_dev_offline_warning.html","addGpsDevOfflineWarning","添加",700,400,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsDevOfflineWarningdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_dev_offline_warning.html?oid="+dataId,"updateGpsDevOfflineWarning","修改",700,400,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsDevOfflineWarningdatagrid').datagrid('getSelections');
	var idArray=[];
	if(!isNull(oid)){
		idArray.push(oid);
	}else if (rows.length > 0){
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
				   url: rootPath+"/gpsdevofflinewarning/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsDevOfflineWarningdatagrid').datagrid('reload');	
								$('#gpsDevOfflineWarningdatagrid').datagrid('clearSelections'); 
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "删除失败", 'error');
							enableButtion("saveButton");
						}else{
							top.showAlert("提示", data.msg, 'info');
							enableButtion("saveButton");
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
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	var rows = $('#gpsDevOfflineWarningdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_dev_offline_warning.html?oid="+dataId,"viewGpsDevOfflineWarning","详细",700,400,false,true,true);
}




