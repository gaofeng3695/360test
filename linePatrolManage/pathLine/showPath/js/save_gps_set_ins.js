
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var pkfield=getParamter("oid");	// 业务数据ID
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	getGpsInsrangeById();
});

/**
 * @desc 获得数据
 */
function getGpsInsrangeById(){
	$.ajax({
		url : rootPath+"/pathlinemain/get.do",
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
	$('#unitname').html(jsondata.unitname);
	$('#lineloopname').html(jsondata.lineloopoName);
	initInsDataGrid(jsondata.unitid);
}

function onresize(){
	var containerWidth = $(window).width();
	var containerHeight = $(window).height() - $('#addFrom').height() - $('#button-area').height() - 48;
	$('#gpsInspectordatagrid').datagrid('resize', {
		width : containerWidth,
		height : containerHeight
	});
}

var querySerialize={};	//查询条件
function initInsDataGrid(unitid){
	querySerialize.unitid = unitid;
	querySerialize.inspectortype = "01";
	$('#gpsInspectordatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinspector/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		queryParams:querySerialize,
		singleSelect:true,
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		columns: 
		[[
			{	
				field:"unitname",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"insname",
	    		title:"姓名",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			selectIns(indexData);
		},
		onLoadSuccess:function(data){
	    	$('#gpsInspectordatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	
	//页面自适应
	onresize();
	$(window).bind("resize", function () {
		onresize();
     });
	
	
}

/**
 * 设置巡检人员
 * @returns
 */
function selectIns(row){
	$('#inspectorid').val(row.oid);
	$('#inspectorname').val(row.insname);
}
//清空人员
function clearIns(){
	$('#inspectorname').val('');
	$('#inspectorid').val('');
}

/**
 * @desc 添加数据-保存
 */
function updateIns(){
	disableButtion("saveButton");
	var bool=$("#addFrom").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	
	$.ajax({
		url : rootPath+"/pathlinemain/setIns.do",
        type: "POST",
        async: false,
        data:{
        	oid:pkfield,
        	inspectorid:$('#inspectorid').val()
        },
        cache:false,
        dataType: "json",
        success: function(data){
        	if(data.status==1){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("query_show_path.html","#gpsInsrangedatagrid");
					closePanel();
				});
			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
         }
       });
	
//	$.ajax({
//		url : rootPath+"/showpath/setIns.do",
//		type: "post",
//		async: false,
//		contentType: "application/json;charset=utf-8",
//		dataType: "json",
//		data:JSON.stringify($("#addFrom").serializeToJson()),
//		success: function(data){
//			if(data.status==1){
//				top.showAlert("提示", "保存成功", 'info', function() {
//					reloadData("query_show_path.html","#gpsInsrangedatagrid");
//					closePanel();
//				});
//			}else if(data.code == "400") {
//				top.showAlert("提示", "保存失败", 'error');
//				enableButtion("saveButton");
//			}else{
//				top.showAlert("提示", data.msg, 'info');
//				enableButtion("saveButton");
//			}
//		}
//	});
	enableButtion("saveButton");
	

}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("set_ins");
}

/**
 * @desc 重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}


