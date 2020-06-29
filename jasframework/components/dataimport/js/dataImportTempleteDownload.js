/**
 * 
 * 文件描述: 导入模版信息
 * @author LiuDongya
 * @version 1.0 
 * 
 */

//数据表格
var columns =[[
        {field:'eventid',title:'EVENTID',width:250,hidden:true},
        {field:'businessname',title:'业务名称',width:150},
		{field:'tablename',title:'数据表名',width:150},
		{field:'filename',title:'模版名称',width:250},
		{field:'downloadbutton',title:'文件下载',width:100,formatter:function(value,rowData,rowIndex){
			return "<img src='image/download.png' id='"+ rowData.eventid+ "' onclick='downloadOneTemplete(this)' />";
		  }}
	]];

/**
 * 初始化执行代码
 */
$(document).ready(function() {
	$("#tablename").combobox({
		url:rootPath+"jasframework/importtempletemanage/getAllTableInfoOfCurrentDbUser.do",
		valueField:"TABLE_NAME",
		textField:"TABLE_NAME",
		onSelect:function(){
			$("#tablename").combobox("getValue");
		}
	});
//	$('#tablename').combobox('select', '全部');
	setComboObjWidth('tablename',0.3,'combobox');
	$('#datatableid').datagrid({
		/*title:"模版文件",*/
		idField:'eventid',
		frozenColumns:[[
		                {field:'ck',checkbox:true}
		    		]],
		columns:columns,
		url:rootPath+"jasframework/importtempletemanage/queryTempleteInfoList.do",
		toolbar:"#toolbar",
		fitColumns:false,
		pagination:true,
		striped: true,
		autoRowHeight: false,
		onLoadSuccess:function(data){
			$(".datagrid-header-check input").attr("checked",false);
	    	$('#datatableid').datagrid('clearSelections'); 
	    }
	});
	
	initDatagrigHeight('datatableid', 'queryDiv', $('#queryDiv').height());

	
	$('#zipDownloadDocfrom').form('submit', {
		 method:"post",
		 url: rootPath+"jasframework/importtempletemanage/downloadTempletes.do",
	     success: function(){
		
	    }
	});
});



/**
 * 
 * 方法描述：查询符合条件的模版信息
 * 
 */
function queryTempleteInfo(){
	var businessname = $("#businessname").val();
	var tablename = $("#tablename").combobox("getValue");
	var filename = $("#filename").val();
//	if(tablename!="" && tablename.indexOf("全部")!=-1){
//		tablename=null;
//	}

	var query={"businessname":businessname,"tablename":tablename,"filename":filename}; //把查询条件拼接成JSON
	$("#datatableid").datagrid("options").url = "../../importtempletemanage/queryTempleteInfoList.do?";
	$("#datatableid").datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
	$("#datatableid").datagrid('reload'); //重新加载
}

/**
 * 
 * 方法描述：清空输入的查询条件
 * 
 */
function clearAll(){
	$('#businessname').val('');
	$('#tablename').combobox('clear');
//	$('#tablename').combobox('setValue', '全部');
	$('#filename').val('');
}

/**
 * 
 * 方法描述：下载单一模版，对应每行数据后面的下载按钮事件
 * 
 */
function downloadOneTemplete(obj){
		var postUrl = rootPath+"jasframework/importtempletemanage/downloadOneTemplete.do?eventid="+obj.id;
		window.location.href=postUrl;
}

/**
 * 
 * 方法描述：下载选中模版
 * 
 */
function downloadSelectedTemplete(){
	var rows = $('#datatableid').datagrid('getSelections');
	if (rows.length > 0){
		var ids="";
		for(var i=0;i<rows.length-1;i++){
			ids += rows[i].eventid+",";
		}
		ids += rows[rows.length-1].eventid;
		var folderName="";
		var str= new Array();   
		folderName = "模板文件";
		$('#eventids').attr("value",ids);
		$('#folderName').attr("value",folderName);
		zipDownloadDocfrom.submit();
	}else{
		$.messager.alert('提示','请选择需要下载的模版！','info');
	}
}

/**
 * 
 * 方法描述：下载全部模版
 * 
 */
function downloadAllTemplete(){
	$.ajax({
    	url: rootPath+"jasframework/importtempletemanage/getAllTempleteEventId.do", 
    	dataType: "json", 
    	success: function(data){
    		var allTempleteEventId = data.allTempleteEventId;
    		if(allTempleteEventId==""){
    			$.messager.alert('提示','没有任何模版！','info');
    		}else{
    			$('#eventids').attr("value",allTempleteEventId);
    			folderName = "模板文件";
    			$('#folderName').attr("value",folderName);
    			zipDownloadDocfrom.submit();
    		}
    	}
    });
}