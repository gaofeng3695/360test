
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
	$('#gpsSafetySharedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpssafetyshare/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitname",
	    		title:"部门名称",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"title",
	    		title:"标题",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"occurrencetime",
	    		title:"事件发生时间",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
		]],
		columns: 
		[[
			{	
				field:"describe",
	    		title:"经过简述",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"cause",
	    		title:"原因分析",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"result",
	    		title:"事件结果",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"experience",
	    		title:"经验及教训",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{
				field:"sharestatusName",
	    		title:"分享状态",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
			}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_safety_share.html?oid="+indexData.oid,"viewGpsSafetyShare","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsSafetySharedatagrid').datagrid('clearSelections'); //clear selected options
	    },
	    /*onClickRow:function(index,indexData){
	    	
	    	enableButtion("13030105");
	    	enableButtion("13030106");
	    	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
	    	for(var i=0;i<rows.length;i++){
	    		if(rows[i].sharestatus == 0){
	    			disableButtion("13030106");
	    		}else{
	    			disableButtion("13030105");
	    		}
	    	}
		},*/
	    onSelect:function(index,indexData){
	    	enableButtion("13030105");
	    	enableButtion("13030106");
	    	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
	    	for(var i=0;i<rows.length;i++){
	    		if(rows[i].sharestatus == 0){
	    			disableButtion("13030106");
	    		}else{
	    			disableButtion("13030105");
	    		}
	    	}
		},
		onUnselect:function(index,indexData){
			enableButtion("13030105");
	    	enableButtion("13030106");
	    	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
	    	for(var i=0;i<rows.length;i++){
	    		if(rows[i].sharestatus == 0){
	    			disableButtion("13030106");
	    		}else{
	    			disableButtion("13030105");
	    		}
	    	}
		},
		onSelectAll:function(){
			enableButtion("13030105");
	    	enableButtion("13030106");
	    	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
	    	for(var i=0;i<rows.length;i++){
	    		if(rows[i].sharestatus == 0){
	    			disableButtion("13030106");
	    		}else{
	    			disableButtion("13030105");
	    		}
	    	}
		},
		onUnselectAll:function(){
			enableButtion("13030105");
	    	enableButtion("13030106");
	    	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
	    	for(var i=0;i<rows.length;i++){
	    		if(rows[i].sharestatus == 0){
	    			disableButtion("13030106");
	    		}else{
	    			disableButtion("13030105");
	    		}
	    	}
		}
	});
	//页面自适应
	initDatagrigHeight('gpsSafetySharedatagrid','queryDiv','100');
	
	/* 以下初始化查询面板 */
	initUnitComboTree('unitid');
	
});

/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_safety_share.html","addGpsSafetyShare","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_safety_share.html?oid="+dataId,"updateGpsSafetyShare","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpssafetyshare/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsSafetySharedatagrid').datagrid('reload');	
								$('#gpsSafetySharedatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_safety_share.html?oid="+dataId,"viewGpsSafetyShare","详细",800,600,false,true,true);
}

/**
 * 安全经验分享
 * @returns
 */
function safetyShare(){
	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
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
		$.messager.confirm('提示', '您确定要分享这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/gpssafetyshare/safetyShare.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","分享成功","info",function(){
								$('#gpsSafetySharedatagrid').datagrid('reload');	
								$('#gpsSafetySharedatagrid').datagrid('clearSelections'); 
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "分享失败", 'error');
							enableButtion("saveButton");
						}else{
							top.showAlert("提示", data.msg, 'info');
							enableButtion("saveButton");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '分享出错', 'info');
					}
				});
			}
		});	
	}	
}

/**
 * 取消安全经验分享
 * @returns
 */
function unsafetyShare(){
	var rows = $('#gpsSafetySharedatagrid').datagrid('getSelections');
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
		$.messager.confirm('提示', '您确定要取消分享这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/gpssafetyshare/unsafetyShare.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","取消成功","info",function(){
								$('#gpsSafetySharedatagrid').datagrid('reload');	
								$('#gpsSafetySharedatagrid').datagrid('clearSelections'); 
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "取消失败", 'error');
							enableButtion("saveButton");
						}else{
							top.showAlert("提示", data.msg, 'info');
							enableButtion("saveButton");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '取消出错', 'info');
					}
				});
			}
		});	
	}	
}


