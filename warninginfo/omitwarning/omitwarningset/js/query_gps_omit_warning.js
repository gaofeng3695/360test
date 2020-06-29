
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
	$('#gpsOmitWarningdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsomitwarning/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		fitColumns: true,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		columns: 
		[[
			{	
				field:"unitname",
	    		title:"部门名称",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'

			},
			{
				field:"pointnum",
	    		title:"漏巡最小关键点数",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
			},
			{	
				field:"daytime",
				title:"预警提前时间(分钟)",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{
				field:"createUserName",
				title:"创建人",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{
				field:"createDatetime",
				title:"创建时间",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{
				field:"modifyUserName",
				title:"修改人",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{
				field:"modifyDatetime",
				title:"修改时间",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_omit_warning.html?oid="+indexData.oid,"viewgpsOmitWarning","详细",700,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsOmitWarningdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsOmitWarningdatagrid','queryDiv','100');
	initUnitComboTree('unitid');
});

/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_omit_warning.html","addgpsOmitWarning","添加",800,400,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsOmitWarningdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_omit_warning.html?oid="+dataId,"updategpsOmitWarning","修改",800,400,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsOmitWarningdatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsomitwarning/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsOmitWarningdatagrid').datagrid('reload');	
								$('#gpsOmitWarningdatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsOmitWarningdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_omit_warning.html?oid="+dataId,"viewgpsOmitWarning","详细",800,400,false,true,true);
}




