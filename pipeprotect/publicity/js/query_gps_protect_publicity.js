
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
	$('#gpsProtectPublicitydatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsprotectpublicity/getPage.do",
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
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"title",
	    		title:"活动名称",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
		]],
		columns: 
		[[
			{	
				field:"startdate",
	    		title:"开始时间",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"enddate",
	    		title:"结束时间",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"publicityTypeName",
	    		title:"宣传类型",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{
				field:"site",
	    		title:"活动地点",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"participant",
	    		title:"参加人员",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"describe",
	    		title:"活动内容简述",
	    		width:"300",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"reportperson",
	    		title:"上报人",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"sharestatusName",
	    		title:"分享状态 ",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_protect_publicity.html?oid="+indexData.oid,"viewGpsProtectPublicity","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsProtectPublicitydatagrid').datagrid('clearSelections'); //clear selected options
	    },
		onSelect:function(index,indexData){
			enableButtion("13050105");
	    	enableButtion("13050106");
	    	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
	    	for(var i=0;i<rows.length;i++){
	    		if(rows[i].sharestatus == 0){
	    			disableButtion("13050106");
	    		}else{
	    			disableButtion("13050105");
	    		}
	    	}
		},
		onUnselect:function(index,indexData){
			enableButtion("13050105");
	    	enableButtion("13050106");
	    	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
	    	for(var i=0;i<rows.length;i++){
	    		if(rows[i].sharestatus == 0){
	    			disableButtion("13050106");
	    		}else{
	    			disableButtion("13050105");
	    		}
	    	}
		},
		onSelectAll:function(){
			enableButtion("13050105");
	    	enableButtion("13050106");
	    	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
	    	for(var i=0;i<rows.length;i++){
	    		if(rows[i].sharestatus == 0){
	    			disableButtion("13050106");
	    		}else{
	    			disableButtion("13050105");
	    		}
	    	}
		},
		onUnselectAll:function(){
			enableButtion("13050105");
	    	enableButtion("13050106");
	    	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
	    	for(var i=0;i<rows.length;i++){
	    		if(rows[i].sharestatus == 0){
	    			disableButtion("13050106");
	    		}else{
	    			disableButtion("13050105");
	    		}
	    	}
		}
	});
	//页面自适应
	initDatagrigHeight('gpsProtectPublicitydatagrid','queryDiv','100');
	
	/* 以下初始化查询面板 */
	initUnitComboTree('unitid');
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsProtectPublicitydatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsProtectPublicitydatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	
});

/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_protect_publicity.html","addGpsProtectPublicity","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_protect_publicity.html?oid="+dataId,"updateGpsProtectPublicity","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsprotectpublicity/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsProtectPublicitydatagrid').datagrid('reload');	
								$('#gpsProtectPublicitydatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_protect_publicity.html?oid="+dataId,"viewGpsProtectPublicity","详细",800,600,false,true,true);
}

/**
 * 管道保护记录分享
 * @returns
 */
function publictityShare(){
	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
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
		$.messager.confirm('删除', '您确定要分享这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/gpsprotectpublicity/publictityShare.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","分享成功","info",function(){
								$('#gpsProtectPublicitydatagrid').datagrid('reload');	
								$('#gpsProtectPublicitydatagrid').datagrid('clearSelections'); 
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
 * 取消保护记录分享
 * @returns
 */
function unpublictityShare(){
	var rows = $('#gpsProtectPublicitydatagrid').datagrid('getSelections');
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
		$.messager.confirm('删除', '您确定要取消分享这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/gpsprotectpublicity/unpublictityShare.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","取消成功","info",function(){
								$('#gpsProtectPublicitydatagrid').datagrid('reload');	
								$('#gpsProtectPublicitydatagrid').datagrid('clearSelections'); 
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





