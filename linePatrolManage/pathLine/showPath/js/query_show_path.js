
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var suboid=getParamter("suboid");	// 巡检范围标识
var querySerialize=null;	//查询条件

var jasMapApi = null;

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsInsrangedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/pathlinemain/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {
            	field:'location',
            	title:'定位',
            	align:"center",
            	width:"50",
            	formatter: function(value,row,index){
            		var opt = '<p class="table-operate"><a class = "a100702" href="#" title = "定位" onclick="locationLine(\'' + row.oid+'\',\'' + row.bufferwidth+'\')">\
            		<span class="fa fa-thumb-tack"></span>\
            		</a></p>';
            		return opt;
            	}
            },
            {	
            	field:"unitname",
            	title:"部门名称",
            	width:"200",
            	resizable:true,
            	sortable:true,
            	align:'center'
            },
            
            {	
            	field:"lineloopoName",
            	title:"管线名称",
            	width:"200",
            	resizable:true,
            	sortable:true,
            	align:'center'
            },
			{
				field:"createUserName",
				title:"创建人",
				width:"100",
				resizable:true,
				sortable:true,
				align:'center'
			}
		]],
		columns: 
		[[

			{	
				field:"beginlocation",
	    		title:"起始位置",
	    		width:"180",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	
	    	{	
				field:"beginstation",
	    		title:"起始里程（m）",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"endlocation",
	    		title:"终止位置",
	    		width:"180",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	
	    	{	
				field:"endstation",
	    		title:"终止里程（m）",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{
				field:"insRangeLength",
	    		title:"管理长度（m）",
	    		width:"120",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{
				field:"inspectorName",
	    		title:"巡检人员",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{
	    		field:"collectBeginTime",
	    		title:"采集开始时间",
	    		width:"180",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{
	    		field:"collectEndTime",
	    		title:"采集结束时间",
	    		width:"180",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{
				field:"bufferwidth",
	    		title:"缓冲带宽度（m）",
	    		width:"150",
	    		resizable:true,
	    		align:'center'
			}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_show_path.html?oid="+indexData.oid,"viewShowPath","详细",900,500,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsInsrangedatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsInsrangedatagrid','queryDiv','100');
	
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsInsrangedatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsInsrangedatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	initUnitComboTree('unitid');
	initLineLoopCombobox('lineloopoid');
	showPan('beginlocation','endlocation','beginstation','endstation');
	
});

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(){
	var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
	var idArray=[];
	if (rows.length > 0){
		$(rows).each(function(i,obj){
//			idArray.push(obj.inspectorid+","+obj.lineloopoid);
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
				   url: rootPath+"/pathlinemain/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsInsrangedatagrid').datagrid('reload');	
								$('#gpsInsrangedatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_show_path.html?oid="+dataId,"viewShowPath","详细",900,500,false,true,true);
}

/**
 * 设置巡检人员
 * @returns
 */
function setIns(){
	var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
	var dataId = "";
	if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("save_gps_set_ins.html?oid="+dataId,"set_ins","设置巡检人员",900,500,false,true,true);
}

function bufferwidth(){
	top.getDlg("../bufferwidth/query_gps_buffer_width.html","bufferWidth","缓冲带宽度设置",900,500,false,true,true);
}

/**
 * 定位
 * @param oid
 * @returns
 */
function locationLine(oid,bufferwidth){
	if(isNull(oid)){
		var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
		var oid = "";
		var bufferwidth = "";
		if (rows.length == 1){
			oid = rows[0].oid;
			bufferwidth = rows[0].bufferwidth;
		}else{
			top.showAlert("提示","请选中一条记录",'info');
			return;
		}
	}
	
	/* 打开地图 */
    top.map.show = true;
	
	var paramp = {
			"fieldName":"objectid"
	};
	
	var where = {
			"where":"active =1 and PATHLINEMAINOID = '"+oid+"'",
			"show":true
	};

	/* 因为公用的js中没办法加入多个条件。所以只能通过唯一标志objectID来查询了。通过主表OID和active 得到空间表中的objectId。 */
	$.post(rootPath+"/app/synbase/getPathlineByMainOid.do",{"oid":oid}, function( result ) {
		if(result != null && result.status ==1 ) {
			top.updateLayer('gps_pathline',where, result.data[0].objectId, "gps_pathline" ,paramp,bufferwidth);
		}

	})

}

function addPolyginGraphic(jasMapApi,features){
	var option = {
			'center' : true,
			'width' : 2,
			'color' : [0,0,0,255],
			'style' : 'solid'
	};
	for(var i=0;i<features[0].length;i++){
		var feature = features[0][i];
		if(feature.geometry != null){
			var gra = jasMapApi.addPolylineGraphic(feature.geometry.paths,option);
			jasMapApi.flashGraphic(gra);
		}
	}
}

function convertPathlinePoint(){
	var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
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
		$.messager.confirm('提示', '您确定要将这些标准轨迹线转为空间数据吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/pathlinepoint/convertPathlinePoint.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","转为空间数据成功","info",function(){
								$('#gpsInsrangedatagrid').datagrid('reload');	
								$('#gpsInsrangedatagrid').datagrid('clearSelections'); 
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "转为空间数据失败", 'error');
						}else{
							top.showAlert("提示", data.msg, 'info');
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '转为空间数据失败', 'info');
					}
				});
			}
		});	
	}
}

