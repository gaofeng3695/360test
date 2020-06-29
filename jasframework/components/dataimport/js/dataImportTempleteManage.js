/**
 * 
 * 文件描述: 导入模版信息
 * @author LiuDongya
 * @version 1.0 
 * 
 */


function addTemplete(){
	top.getDlg("addTempleteInfo.htm","addiframe",getLanguageValue("add"),500,560,false);
}
function updateTemplete(){
	var rows = $('#datatableid').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#datatableid').datagrid('getSelected');
		top.getDlg("updateTempleteInfo.htm?eventid="+row.eventid,"updateiframe",getLanguageValue("edit"),650,560,false);
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}
function deleteTemplete(){
	var rows = $('#datatableid').datagrid('getSelections');
	var length=rows.length;
	if(length<1){
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}else{
		var eventids=[];
		for(var i=0;i<length;i++){
			eventids.push(rows[i].eventid);
		}
		var postUrl =rootPath+"jasframework/importtempletemanage/deleteTempleteInfo.do?eventids="+eventids;
		$.messager.confirm(getLanguageValue("tip"),getLanguageValue("deleteconfirm"),function(r) {
			if (r) {
				$.post(postUrl,function(result){
					top.showAlert('提示', '删除成功！', 'info');
					$('#datatableid').datagrid('reload');
					reloadData('dataImportTempleteDownload.htm', '#datatableid');
				});
			}
		});
	}
}



//数据表格
var columns =[[
        {field:'eventid',title:'EVENTID',width:250,hidden:true},
        {field:'businessname',title:'业务名称',width:150},
		{field:'tablename',title:'数据表名',width:150},
		{field:'isspatialdata',title:'是否是空间数据表',width:100,formatter:function(value,rowData,rowIndex){
			  if(value=='0'){
				  return "否";
			  }else{
				  return "是";
			  }
		  }},
		{field:'spatialdatatype',title:'空间数据类型',width:100,formatter:function(value,rowData,rowIndex){
			  if(value=='1'){
				  return "点";
			  }else if(value=='2'){
				  return "线";
			  }else if(value=='3'){
				  return "面";
			  }else{
				  return "";
			  }
		  }},
		{field:'filename',title:'模版名称',width:250},
		{field:'downloadbutton',title:'文件下载',width:80,formatter:function(value,rowData,rowIndex){
			return "<img src='image/download.png' id='"+ rowData.eventid+ "' onclick='downloadOneTemplete(this)' />";
		  }}
	]];

/**
 * 初始化执行代码
 */
$(document).ready(function() {
	$("#tablename").combobox({
		url: rootPath+"jasframework/importtempletemanage/getAllTableInfoOfCurrentDbUser.do",
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
		url: rootPath+"jasframework/importtempletemanage/queryTempleteInfoList.do",
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
	if(tablename!="" && tablename.indexOf("全部")!=-1){
		tablename=null;
	}

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
 * 方法描述：下载一条模版数据，对应每行数据后面的下载按钮事件
 * 
 */
function downloadOneTemplete(obj){
		var postUrl =rootPath+"jasframework/importtempletemanage/downloadOneTemplete.do?eventid="+obj.id;
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
		$('#eventids').attr("value",ids);
		zipDownloadDocfrom.submit();
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}

/**
 * 
 * 方法描述：下载全部模版
 * 
 */
function downloadAllTemplete(){
	$.ajax({
    	url:rootPath+"jasframework/importtempletemanage/getAllTempleteEventId.do", 
    	dataType: "json", 
    	success: function(data){
    		console.log(data);
    		var allTempleteEventId = data.allTempleteEventId;
    		if(allTempleteEventId==""){
    			$.messager.alert('提示','没有任何模版！','info');
    		}else{
//    			alert(allTempleteEventId)
    			$('#eventids').attr("value",allTempleteEventId);
    			zipDownloadDocfrom.submit();
    		}
    	}
    });
}

/* 重新加载数据 */
function reloadData(url, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(url) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}