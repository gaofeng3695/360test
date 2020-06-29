
function loadDatagrid(){
	initDatagrigHeight('dg','searchpanel',0);
}	

/**
 * 方法描述：加载文档列表
 */
$(function(){
	var width = $('body').width();
	$('#dg').datagrid({
		width:'100%',
		nowrap: false,
		striped: true,
		collapsible:false,
		url: "../search/queryUntreatedDocs.do",
		remoteSort: true,
		idField:'eventid',
		pagination:true,
		rownumbers:true,
		columns : [[{field : 'ck',title : '全选',checkbox : true}, 		        					
		            {field : 'filename',title : '文档名称',width : 0.18 * width}, 
		            {field : 'filelocation',title : '文档位置',width : 0.18 * width}, 
		            {field : 'author',title : '文档作者',width : 0.08 * width,hidden:true}, 
		            {field : 'keyword',title : '关键词',width : 0.07 * width}, 
		            {field : 'filetype',title : '文档格式',width : 0.07 * width},
		            {field : 'filesizeStr',title : '文档大小(kb)',width : 0.1 * width},
		            {field : 'createusername',title : '上传人',width : 0.08 * width}, 
		            {field : 'iscreateindex',title : '是否创建索引',width : 0.08 * width,formatter:function(value,rowData,rowIndex){
		            	var iscreateindex = rowData.iscreateindex;
		            	if(iscreateindex==1){
		            		return "是";
		            	}else{
		            		return "否";
		            	}
		            }}, 
		            {field : 'ispreviewconversion',title : '是否预览转换',width : 0.08 * width,formatter:function(value,rowData,rowIndex){
		            	var ispreviewconversion = rowData.ispreviewconversion;
		            	if(ispreviewconversion==1){
		            		return "是";
		            	}else{
		            		return "否";
		            	}
		            }}, 
		            {field : 'isaddwatermark',title : '是否添加水印',width : 0.08 * width,formatter:function(value,rowData,rowIndex){
		            	var isaddwatermark = rowData.isaddwatermark;
		            	if(isaddwatermark==1){
		            		return "是";
		            	}else{
		            		return "否";
		            	}
		            }}, 
					{field : 'eventid',hidden:true}
					 ] ],
		onClickCell:function(rowIndex, field, value){
		},
		onLoadSuccess:function(data){
			//debugger
			if(data.msg){
				$.messager.alert('错误', data.msg, data.error);
			}
	    	$('#dg').datagrid('clearSelections'); //clear selected options
	    }
	
	});	
	setComboObjWidth('createIndex',0.35,'combobox');
	setComboObjWidth('createSwf',0.35,'combobox');
	setComboObjWidth('addWaterMark',0.35,'combobox');
	initDatagrigHeight('dg','userquery',0);
});


		
		
/**
 * 方法描述：创建选中文件索引
 */
function createSelectedFileIndex(){
	var eventids= "" ;
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length > 0){
		for(var i=0;i<rows.length-1;i++){
			eventids += rows[i].eventid+",";
		}
		eventids += rows[rows.length-1].eventid;
	}
	$.ajax({
		url : '../search/addCreateIndex.do',
		type : 'POST',
		data : "docIds=" + eventids,
		dataType : "json",
		success : function(data) {
			if(data.error){
				$.messager.alert('提示', data.msg, 'info');	
			}else {
				$('#dg').datagrid('reload');	// reload the user data
			}
		},
		error : function(data) {
			
		}
	});
}
/**
 * 方法描述：创建选中文件预览所需的swf文件
 */
function createSelectedFileSwf(){
	var eventids= "" ;
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length > 0){
		for(var i=0;i<rows.length-1;i++){
			eventids += rows[i].eventid+",";
		}
		eventids += rows[rows.length-1].eventid;
	}
	showLoadingMessage("正在生成预览文件...");
	$.ajax({
		url : '../search/createSwf.do',
		type : 'POST',
		data : "docIds=" + eventids,
		dataType : "json",
		success : function(data) {
			hiddenLoadingMessage();
			if(data.success!=0){
				$.messager.alert('提示', "文档转化失败！", 'info');	
			}else {
				$.messager.alert('提示', "文档转化成功！", 'info');	
				$('#dg').datagrid('reload');	// reload the user data
			}
		},
		error : function(data) {
			
		}
	});
}
/**
 * 方法描述：给选中文件添加水印
 */
function createSelectedFileWaterMark(){
	var eventids= "" ;
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length > 0){
		for(var i=0;i<rows.length-1;i++){
			eventids += rows[i].eventid+",";
		}
		eventids += rows[rows.length-1].eventid;
	}
	$.ajax({
		url : '../search/createWaterMark.do',
		type : 'POST',
		data : "docIds=" + eventids,
		dataType : "json",
		success : function(data) {
			if(data.success!=0){
				$.messager.alert('提示', "添加水印失败！", 'info');	
			}else {
				$.messager.alert('提示', "添加水印成功！", 'info');	
				$('#dg').datagrid('reload');	// reload the user data
			}
		},
		error : function(data) {
			
		}
	});
}

function queryDocByConditions(){
	$("#dg").datagrid('clearSelections'); // clear
	var isCreateIndex = $("#createIndex").combobox("getValue");
	var isCreateSwf = $("#createSwf").combobox("getValue");
	var isAddWaterMark = $("#addWaterMark").combobox("getValue");
	var query = {"isCreateIndex":isCreateIndex,"isCreateSwf":isCreateSwf,"isAddWaterMark":isAddWaterMark};
	var url=  "../search/queryUntreatedDocs.do";
	$("#dg").datagrid("options").url = url;
	$("#dg").datagrid('options').queryParams=query;
	$("#dg").datagrid('load');	
	$("#dg").datagrid('options').queryParams=null;
}

function clearQueryConditions(){
	 $("#createIndex").combobox("setValue","");
	 $("#createSwf").combobox("setValue","");
	 $("#addWaterMark").combobox("setValue","");
}
