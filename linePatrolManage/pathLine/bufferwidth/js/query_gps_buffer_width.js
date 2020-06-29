
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
	$('#gpsBufferWidthdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsbufferwidth/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        fitColumns: true,
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		columns: 
		[[
			{	
				field:"execunitName",
	    		title:"执行单位",
	    		width:$(this).width() * 0.25,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"bufferwidth",
	    		title:"缓冲带宽度（m）",
	    		width:$(this).width() * 0.25,
	    		resizable:true,
	    		align:'center'
	    	},
			{
				field:"description",
	    		title:"描述",
	    		width:$(this).width() * 0.25,
	    		resizable:true,
	    		align:'center'
	    	},

			{
				field:"createDatetime",
				title:"创建时间",
				width:$(this).width() * 0.25,
				resizable:true,
				align:'center'
			},
			{
				field:"createUserName",
				title:"创建人",
				width:$(this).width() * 0.25,
				resizable:true,
				align:'center'
			},
			{
				field:"modifyDatetime",
				title:"修改时间",
				width:$(this).width() * 0.25,
				resizable:true,
				align:'center'
			},
			{
				field:"modifyUserName",
				title:"修改人",
				width:$(this).width() * 0.25,
				resizable:true,
				align:'center'
			}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_buffer_width.html?oid="+indexData.oid,"viewGpsBufferWidth","详细",700,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsBufferWidthdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsBufferWidthdatagrid','queryDiv','100');
	
	//初始化部门下拉框
	initUnitComboTree('execunitid');
	setComboObjWidth('execunitid',0.15,'combobox');
	
});


/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_buffer_width.html","addGpsBufferWidth","添加",700,400,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsBufferWidthdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_buffer_width.html?oid="+dataId,"updateGpsBufferWidth","修改",700,400,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsBufferWidthdatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsbufferwidth/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsBufferWidthdatagrid').datagrid('reload');	
								$('#gpsBufferWidthdatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsBufferWidthdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_buffer_width.html?oid="+dataId,"viewGpsBufferWidth","详细",700,400,false,true,true);
}




