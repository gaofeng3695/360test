//定义变量
var endIndex;
var editIndex = undefined;
var addRowIndex = 0;    //标识添加行

//字段类型
var fieldType = [{id:"STRING",text:"字符"}, 
                 {id:"INT",text:"整形"}, 
                 {id:"DOUBLE",text:"双精度"}, 
                 {id:"DATE",text:"日期"}];


var columns = [
       [ {field:"ck",title:"全选",checkbox : true},
  	    	{field : 'columnName',title : '字段名',width : 150,
  	     		editor :{
  		    		type: 'text',
  		    		options:{
  		    			required:true
  		    		}
  	     		}
  	     	}, 
  	    	{field : 'columnType',title : '字段类型',width : 120,
  	     		editor :{
	  	     		 type : 'combobox',
		        		 options : {
		        			 valueField : 'id',
		        			 textField : 'text',
		        			 data : fieldType,
		        			 panelHeight : 100,
		        			 width : 100
		        		 }
  	     		}
  	     	}, 
//  	    	{field : 'tableColumnName',title : '列名',width : 100,
//  	     		editor :{
//  	     			type: 'text',
//  		    		options:{
//  		    			required:true
//  		    			
//  		    		}
//  	     		}
//  	     	}, 
  	    	{field : 'fieldLength',title : '字段长度',width : 100,
  	     		editor :{
  	     			type: 'numberbox',
  	     			options:{
  	     				
  	     			}
  	     		}
  	     	},
  	     	{field : 'comment',title : '字段描述',width : 200,
  	     		editor :{
  	     			type: 'text',
  	     			options:{
  	     				
  	     			}
  	     		}
  	     	}
  ]];


//工具栏
var toolbars = [ {
	id : "addColumnRow",
	text : "添加",
	iconCls : 'icon-add',
	handler : addColumnRow
},{
	id : "editColumnRow",
	text : "修改",
	iconCls : 'icon-edit',
	handler : editColumnRow
}, {
	id : "deleteColumnRow",
	text : "删除",
	iconCls : 'icon-remove',
	handler : deleteColumnRow
} ];

function onClickRow(index){
	if(!endEditing()){
		alert("请将正在编辑的信息填写完整");
		return;
	}
}

$(function(){
//	$('#dataSourceName').combobox({	//加载数据源名称的下拉列表信息
//		url:'../getDataSourceNamesList.do',
//		valueField:'id',  
//		textField:'text',
//		panelHeight:"auto",
//		onLoadSuccess:function(){
//			var data = $('#dataSourceName').combobox('getData'); 
//	    	if (data.length > 0) {
//	    		$('#dataSourceName').combobox('select',data[0].id);
//	    	}
//		}
//	});
	$("#primaryColumnType").combobox({
		 data:fieldType,
		 valueField : 'id',
		 textField : 'text',
		 onLoadSuccess:function(){
				var data = $('#primaryColumnType').combobox('getData'); 
		    	if (data.length > 0) {
		    		//$('#primaryColumnType').combobox('select',data[0].id);
		    	}
		 }
	});
	//setComboObjWidth('dataSourceName',0.15,'combobox');
	setComboObjWidth('primaryColumnType',0.15,'combobox');
	initColumnDatagrid();
});

/**
 * 编辑完成后对combobox进行处理
 * @returns {Boolean}
 */
function endEditing() {
	if (editIndex == undefined) {
		return true;
	}
	if ($('#columnDatagrid').datagrid('validateRow', editIndex)) {
		//字段名
		var columnName = $('#columnDatagrid').datagrid('getEditor', {
			index : editIndex,
			field : 'columnName'
		});
		if(!(/^[a-zA-Z][a-zA-Z0-9_]{0,25}$/i.test($(columnName.target).val()))){
			return "tabname";
		}
		if($(columnName.target).val()==""){
			return false;
		}
		$('#columnDatagrid').datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

function addColumnRow(){
	if(endEditing() == 'tabname'){
		$.messager.alert('提示', '字段名不合法（必须字母开头）', 'info');
		return;
	}
	if(!endEditing()){
		$.messager.alert('提示', '请将正在编辑的信息填写完整', 'info');
		return;
	}
	//每添加一行，则给改行手动指定eventId,以确保删除时可以删除多行
	//如果不指定，则每行的eventId为undefind,选择多行时系统默认选中1行
	addRowIndex++;
	$('#columnDatagrid').datagrid('appendRow',{
		eventId:"add"+addRowIndex,
		columnName:"",
		columnType:"STRING",
//		tableColumnName:"",
		fieldLength:"",
		comment:""
	});
	//获取当前页的所有行，并使最后一行成为编辑状态
	var rows = $('#columnDatagrid').datagrid("getRows");
	$('#columnDatagrid').datagrid('beginEdit', rows.length-1);
	$('#columnDatagrid').datagrid('endEdit', editIndex);
	editIndex = rows.length-1;
}
//删除选中行
function deleteColumnRow(){
	var rows = $('#columnDatagrid').datagrid('getSelections');
    if (rows.length>0) {  
		for(var i=rows.length-1;i>=0;i--){
			 var rowIndex = $("#columnDatagrid").datagrid('getRowIndex', rows[i]);  
		     $("#columnDatagrid").datagrid('deleteRow', rowIndex);  
		}
		editIndex = undefined;
    }else{
    	$.messager.alert('提示', '请选中一条记录！', 'info');
    }  
}

function editColumnRow(){
	if(endEditing() == 'tabname'){
		$.messager.alert('提示', '字段名不合法（必须字母开头）', 'info');
		return;
	}
	if(!endEditing()){
		$.messager.alert("提示","请将正在编辑的信息填写完整","info");
		return;
	}
	//选中一行，并将该行状态置为编辑
	var rows = $('#columnDatagrid').datagrid('getSelections');
	if(rows.length==1){
		var row = rows[0];
		var rowIndex = $("#columnDatagrid").datagrid("getRowIndex",row);
		$('#columnDatagrid').datagrid('beginEdit', rowIndex);
		$('#columnDatagrid').datagrid('endEdit', editIndex);
		editIndex = rowIndex;
		
	}else{
		$.messager.alert("提示","请选中一条记录！","info");
	}
}

/**
 * 方法描述：初始化发票列表布局
 */
function initColumnDatagrid(){
	$('#columnDatagrid').datagrid({
		idField : 'eventId',
		columns : columns,
//		title:"字段配置信息列表",
//		toolbar : toolbars,
		toolbar : "#toolbars",
		fitColumn:true,
		pagination : false,
		striped : true,
		autoRowHeight : true,
		rownumbers:true,
		nowrap: false,
		collapsible:false,
		onLoadSuccess : function(data) {
		
		},
		onClickRow:onClickRow
	});
}

function createTable(){
	var rows = $('#columnDatagrid').datagrid("getRows");
	var columnListStr = JSON.stringify(rows);
	$("#columnList").val(columnListStr);
	if($("#tableName").val()==""){
		$.messager.alert("提示", "表名不能为空", "info");
		return;
	}
	if(endEditing() == 'tabname'){
		$.messager.alert('提示', '字段名不合法（必须字母开头）', 'info');
		return;
	}
	if(!endEditing()){
		$.messager.alert("提示", "请将正在编辑的信息填写完整", "info");
		return;
	}
	
	if(rows.length<1){
		$.messager.alert("提示", "字段列表不能为空", "info");
		return;
	}
	
	$.ajax({
		type:"POST",
		async: false,
		url:rootPath+"jasframework/isExistTable.do?tableName="+$("#tableName").val(),
		success:function(result){
			var createFlag = false;
			if(result=="true"){
				//如果存在,询问用户是否继续
				if(confirm('数据库已经存在此表！此操作有可能导致配置的业务功能不可用，是否继续？')){
					createFlag = true;
				}else{
					createFlag = false;
				}
			}else{
				createFlag = true;
			}
			if(createFlag){
				$("#createTableForm").form('submit',{
					url:rootPath+"jasframework/createDBTableByConf.do",
					onSubmit : function(){
						if($(this).form('validate')){
							disableButtion("saveButton");
							return true;
						}else{
							return false;
						}
					},
					dataType : "json",
					success:function(result){
						result=jQuery.parseJSON(result);
						if(result.success==1){
							$.messager.alert("提示", result.message, "info", function() {
								closeIframe();
							});
						}else{
							$.messager.alert("提示", result.message, "info", function() {
								enableButtion("saveButton");
							});
						}
					},
					error: function(data){
						alert(data);
					}
				});
			}
			
		}
	});
	
	
}

function closeIframe(){
	top.closeDlg('tableadd');
}