var tableId = getParamter("eventid");
var templateId = getParamter("templateId");
var formType = getParamter("formType");

var gridData_left = null;
var gridData_right = null;
var foreignFieldList = null;
var editIndex = undefined;
var endIndex;
var associateFieldList ;
var lastRowIndex = -1;

/**
 * 
 * 方法描述：初始化页面数据
 * 
 */
$(document).ready(function() {	
	$("#beginColumn").keyup(function(){
		$("#endColumn").val($("#beginColumn").val());
		if(formType=="2"){
			$("#endColumn").attr("disabled","disabled");
		}else{
			$("#endColumn").removeArr("disabled");
		}
	});
	//加载是否外键选择列表下拉框
	$('#isForeignField').combobox({
		data:isForeignFieldList,
		valueField : 'id',
		textField : 'text',
		panelHeight: 50,
		onSelect:function(record){
			var value = record.id;
			if(value=="1"){
				//如果是外键字段，则其他信息不需要输入
				/*$(".input_type .input_bg").attr("disabled","disabled");
				$(".input_type textarea").attr("disabled","disabled");
				$(".foreign_type .input_bg").attr("disabled","disabled");
				$(".input_type .easyui-combobox").combobox("disable");
				$(".foreign_type .easyui-combobox").combobox("disable");*/
				$("#foreignField").combobox("enable");
				$("#associateField").combobox("enable");
				/*$("#associateValue").removeAttr("disabled");*/
			}else{
				$(".input_type .input_bg").removeAttr("disabled");
				$(".input_type .easyui-combobox").combobox("enable");
				$(".input_type textarea").removeAttr("disabled");
				$(".foreign_type .input_bg").removeAttr("disabled");
				$(".foreign_type .easyui-combobox").combobox("enable");
				$("#foreignField").combobox("disable");
				$("#associateField").combobox("disable");
				/*$("#associateValue").attr("disabled","disabled");*/

				
			}
		}
	});

	//初始化外键字段：模板中其他主表且类型为表格的表中配置的字段
	$.ajax({
		url:rootPath + 'jasframework/excel/getForeignFieldData.do?templateId='+templateId,
		type:"POST",
		success:function(result){
			foreignFieldList = result;
		},
		dataType:"json",
		async:false,
		error:function(result){
			$.messager.alert('错误', '请求数据失败！', 'info');
		}
	});	
	//加载外键字段选择列表下拉框
	$('#foreignField').combobox({
		data:foreignFieldList,
		valueField:'id',
		textField:'idtext',
		panelHeight:100
	});
	
	// 查询其他关联字段选择列表下拉框
	$.ajax({
		url:rootPath + 'jasframework/excel/getAllColumnFieldSelcet.do',
		type:"POST",
		data:{"tableId":tableId},
		success:function(result){
			associateFieldList = result.allFieldList;
		},
		dataType:"json",
		async:false,
		error:function(result){
			$.messager.alert('错误', '请求数据失败！', 'info');
		}
	});
	
	//加载其他关联字段选择列表下拉框
	$('#associateField').combobox({
		data:associateFieldList,
		multiple:true,
		valueField:'id',
		textField:'idtext',
		panelHeight:100
	});
		
	//加载输入类型选择列表下拉框
	$('#inputType').combobox({
		data:inputTypeList,
		groupField:'group',
		valueField:'id',
		textField:'text',
		panelHeight:120,
		groupFormatter: function(group){
			return '<span style="color:red">' + group + '</span>';
		},
		onSelect:function(record){
			var value = record.id;
			if(value=="select"){
				//如果是或select
				$("#dataSource").removeAttr("disabled");
				$(".input_type .input_bg").removeAttr("disabled");
				$(".input_type .easyui-combobox").combobox("enable");
				$(".input_type textarea").removeAttr("disabled");
			}else if(value == "auto_sysadd"){
				$("#dataSource").removeAttr("disabled");
				$(".input_type .input_bg").attr("disabled","disabled");
				$(".input_type .easyui-combobox").combobox("disable");
				$(".input_type textarea").attr("disabled","disabled");
			}else{
				$("#dataSource").attr("disabled","disabled");
				if(value=="input"){
					$(".input_type .input_bg").removeAttr("disabled");
					$(".input_type .easyui-combobox").combobox("enable");
					$(".input_type textarea").removeAttr("disabled");
				}else{
					$(".input_type .input_bg").attr("disabled","disabled");
					$(".input_type .easyui-combobox").combobox("disable");
					$(".input_type textarea").attr("disabled","disabled");
				}
			}
		}
	});
	//加载验证类型选择列表下拉框
	$('#validateType').combobox({
		data:validateTypeList,
		valueField:'id',
		textField:'text',
		panelHeight:82,
		width:255,
		onSelect:function(record){		
			onDataValidation();
		}
	});
	//加载excel运算符选择列表下拉框
	$('#excelOperator').combobox({
		data:excelOperatorList,
		valueField:'id',
		textField:'text',
		panelHeight:100,
		width:255,
		onSelect:function(record){
			onDataValidation();
		}
	});
	//加载excel出错模式选择列表下拉框
	$('#excelErrorMode').combobox({
		data:excelErrorModeList,
		valueField:'id',
		textField:'text',
		panelHeight:62,
		width:200
	});

	//获取网格数据
	$.ajax({
		url:rootPath + 'jasframework/excel/getExcelColumnInfoList.do',
		type:"POST",
		data:{"tableId":tableId},
		success:function(result){
			gridData_left = result.notInDB;
			gridData_right = result.inDB;
		},
		dataType:"json",
		async:false,
		error:function(result){
			$.messager.alert('错误', '请求数据失败！', 'info');
		}
	});
	//加载左网格数据字段列表
	$("#grid_left").datagrid({
		title:"未配置字段",
		idField:'fieldName',
		data: gridData_left,
		rownumbers:true,
		fitColumns:true,
		columns:[[
		          	{field:'fieldName',title:'字段名称',width:130},
		          	{field:'fieldAlias',title:'字段别名',width:150},
		          	{field:'isMandatory',title:'是否必填',width:70,
		          		formatter: function(value,row,index){
		          			if(row.isMandatory){
		          				if(row.isMandatory==1){
		          					return "是";
		          				}else{
		          					return "否";
		          				}
		          			}else{
		          				row.isMandatory=0;
		          				return "否";
		          			}
		          		}
		          	},
	            ]],
		pagination: false,
		striped: true,
		autoRowHeight: true,
		onLoadSuccess:function(data){
	    	$('#grid_left').datagrid('clearSelections');
	    }
	});
	//加载右网格数据字段列表
	$("#grid_right").datagrid({
		title:"已配置字段",
		idField:'fieldName',
		data: gridData_right,
		rownumbers:true,
		singleSelect:true,
		fitColumns:true,
		columns:[[
		          	{field:'fieldName',title:'字段名称',width:100},
		          	{field:'fieldAlias',title:'字段别名',width:150},
		          	{field:'isMandatory',title:'是否必填',width:63,
		          		formatter: function(value,row,index){
		          			if(row.isMandatory){
		          				if(row.isMandatory==1){
		          					return "是";
		          				}else{
		          					return "否";
		          				}
		          			}else{
		          				row.isMandatory=0;
		          				return "否";
		          			}
		          		},
		          		editor: {
		          			type: 'combobox',
		          			options: {
		          				data: [{"id": 1, "text": "是"},
		          	            	{"id":0,"text":"否"}],
		          				valueField: 'id',
		          				textField: 'text',
		          				panelHeight: 'auto',
		          				editable: false
		          			}
		          		}
		          	}
	            ]],
		pagination: false,
		striped: true,
		autoRowHeight: true,
		/******** datagrid 下拉选 *************/
  		onSelect: function(rowIndex, rowData) {  
            if (lastRowIndex != -1 && lastRowIndex != rowIndex) {
            	$('#grid_right').datagrid('endEdit', lastRowIndex).datagrid('refreshRow', lastRowIndex);
            }
            lastRowIndex = rowIndex;  
  		},
		onLoadSuccess:function(data){
	    	$('#grid_right').datagrid('clearSelections');
	    },
	    onBeginEdit: function(rowIndex, rowData){
	    	//给div中各输入框赋值
	    	$("#fieldName").val(rowData.fieldName);
	    	$("#fieldAlias").val(rowData.fieldAlias);
	    
	    	$("#groupName").val(rowData.groupName);
	    	$("#dataSource").val(rowData.dataSource);
	    	$("#beginRow").val(rowData.beginRow);
	    	$("#beginColumn").val(rowData.beginColumn);
	    	$("#endColumn").val(rowData.endColumn);
	    	$("#remark").val(rowData.remark);
	    	//设置数据有效性
	    	$("#validateType").combobox("select",rowData.validateType);
	    	$("#excelOperator").combobox("select",rowData.excelOperator);
	    	$("#validateBeginValue").val(rowData.validateBeginValue);
	    	$("#validateEndValue").val(rowData.validateEndValue);
	    	//输入提示信息
	    	$("#excelInputMsg").val(rowData.excelInputMsg);
	    	//出错提示信息
	    	$("#excelErrorMode").combobox("setValue",rowData.excelErrorMode);
	    	$("#excelErrorMsg").val(rowData.excelErrorMsg);
	    	$("#excelDataType").val(rowData.excelDataType);
	    	
	    	//设置输入类型
	    	$("#inputType").combobox("select",rowData.inputType);
	    	$("#inputType").combobox("setValue",rowData.inputType);
	    	
	    	//设置是否外键字段
	    	$("#isForeignField").combobox("select",rowData.isForeignField);
	    	//$("#isForeignField").combobox("setValue",rowData.isForeignField);
	    	$("#foreignField").combobox("setValue",rowData.foreignField);
	    	$("#foreignField").combobox("setText",rowData.foreignField);
	    	$("#associateField").combobox("setValue",rowData.associateField);
	    	$("#associateValue").val(rowData.associateValue);	    	
	    },
	    onClickRow : onClickRow
	});
	if(gridData_right.length>0){
		$("#grid_right").datagrid("selectRow",0);
		editIndex=0;
		$("#grid_right").datagrid("beginEdit",0);
	}
});

function onClickRow(index) {
	if (editIndex != index) {
		if (endEditing()) {
			$('#grid_right').datagrid('beginEdit', index);
			$('#grid_right').datagrid('endEdit', editIndex);
			editIndex = index;
		} else {
			$('#grid_right').datagrid('selectRow', editIndex);
		}
	}
}
/**
 * 方法描述：datagrid退出编辑之前的验证
 * @returns {Boolean}
 */
function endEditing() {
	if (editIndex == undefined) {
		return true;
	}
	if ($('#grid_right').datagrid('validateRow', editIndex)) {
		//表单验证
		if($('#fieldForm').form('validate')==false){
			return false;
		}
		var isForeignFieldValue = $("#isForeignField").combobox("getValue");
		
		var inputTypeValue = $("#inputType").combobox("getValue");
		var isInput = $("#beginRow").val()=="" && $("#beginColumn").val()==""&& $("#endColumn").val()=="";
		if("input,select".indexOf(inputTypeValue)!=-1&&isForeignFieldValue=="0"&&!isInput){
			if ($("#beginRow").val() < 1  || $("#beginColumn").val() < 1 || $("#endColumn").val() < 1) {
				$.messager.alert("提示","起始行、起始列、终止列必须都大于0!","info");
				return false;
			}
			if (formType == "列表") {
				//如果为列表，则起始列必须等于终止列
				$("#endColumn").val($("#beginColumn").val());
			}		
			if (parseInt($("#endColumn").val()) < parseInt($("#beginColumn").val())) {
				$.messager.alert("提示","终止列必须大于起始列!","info");
				return false;
			}
		}
		
		//取值
		var associateFieldValue = $("#associateField").combobox("getValues").join(",");	// 数组转字符串
		var associateValue = $("#associateValue").val();
//		var foreignFieldValue = $("#foreignField").combobox("getValue");
		var foreignFieldValue = $("#foreignField").combobox("getText");
		var validateTypeValue = $("#validateType").combobox("getValue");
		var excelOperatorValue = $("#excelOperator").combobox("getValue");
		var excelErrorModeValue = $("#excelErrorMode").combobox("getValue");
		var dataSource = $("#dataSource").val();
		if(dataSource==""){
			dataSource=" ";
		}
		$('#grid_right').datagrid('endEdit', editIndex).datagrid('refreshRow', editIndex);
		$('#grid_right').datagrid('updateRow',{
			index: editIndex,
			row: {
				fieldAlias: $("#fieldAlias").val(),
				isForeignField: isForeignFieldValue,
				foreignField: foreignFieldValue,
				associateField: associateFieldValue,
				associateValue: associateValue,				
				groupName: $("#groupName").val(),
				inputType: inputTypeValue,
				dataSource: dataSource,
				beginRow: $("#beginRow").val(),
				beginColumn: $("#beginColumn").val(),
				endRow: $("#beginRow").val(),
				endColumn: $("#endColumn").val(),
				remark: $("#remark").val(),
				validateType: validateTypeValue,
				excelOperator: excelOperatorValue,
				validateBeginValue: $("#validateBeginValue").val(),
				validateEndValue: $("#validateEndValue").val(),
				excelInputMsg: $("#excelInputMsg").val(),
				excelErrorMode: excelErrorModeValue,
				excelErrorMsg: $("#excelErrorMsg").val()
			}
		});
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

/**
 * 保存excel字段信息
 */
function saveExcelFieldInfo(){
	endEditing();
	$('#datatableid').datagrid('endEdit', editIndex);
	var data = $("#grid_right").datagrid("getRows");
	$.ajax({
		url:rootPath + 'jasframework/excel/saveColumnInfoList.do',
		type:"POST",
		data:{"tableId": tableId, "data": JSON.stringify(data)},
		success:function(result){
			$('#saveExcelFieldInfoButton').linkbutton('disable');
			if (result.success == "1") {
				$.messager.alert("提示", result.message, 'info',function(){
					closePanel();
				});
			} else {
				$('#saveExcelTableInfoButton').linkbutton('enable');
				$.messager.alert('错误', result.message, 'info');
			}
		},
		dataType:"json",
		async:false,
		error:function(result){
			$.messager.alert('错误', result.message, 'info');
		}
	});
}
/**
 * 添加字段数据（从左边数据网格往右边中移动）
 */
function adds(){
	endEditing();
	$('#datatableid').datagrid('endEdit', editIndex);
	var items = $("#grid_left").datagrid("getSelections");
	if (items) { 
		for (var i = items.length-1; i >= 0; i--) { 
			items[i].tableId = tableId;
			$('#grid_right').datagrid('appendRow', items[i]);
			var index = $('#grid_left').datagrid('getRowIndex', items[i]); 
			$('#grid_left').datagrid('deleteRow', index);
		}
		$('#grid_left').datagrid('clearSelections');
	}
}
/**
 * 移除字段数据（从右边数据网格往左边中移动）
 */
function removes(){
	$('#datatableid').datagrid('endEdit', editIndex);
	editIndex = undefined;
	var items = $("#grid_right").datagrid("getSelections");
	var flag = false;
	if (items) { 
		for (var i = items.length-1; i >= 0; i--) {
			if (items[i].isMandatory == 1){
				flag = true;
				break;
			}
			$('#grid_left').datagrid('appendRow', items[i]);
			var index = $('#grid_right').datagrid('getRowIndex', items[i]); 
			$('#grid_right').datagrid('deleteRow', index);
			lastRowIndex = -1; 
		}
	}
	if (flag){
		$.messager.alert('错误', '必填字段不可移动！', 'info');
		return;
	}	
	$('#grid_right').datagrid('clearSelections');
}
/**
 * 关闭窗口
 */
function closePanel(){
	top.closeDlg('fieldInfoConfig');
}



//数据有效性的输入框显示
function onDataValidation(){
	$("#validateType").combobox("readonly",true);
	var validateTypeValue = $("#validateType").combobox("getValue");
	if(validateTypeValue==""){
		validateTypeValue="0";
		$("#validateType").combobox("setValue","0");
	}
	var validateTypeText = $("#validateType").combobox("getText");
	if (validateTypeValue == "0"){
		//任何值
		$(".num").hide();
		$("#operator").hide();
		$("#validateBeginValue").attr("disabled","disabled");
		$("#validateEndValue").attr("disabled","disabled");
		$("#excelOperator").combobox("disable");
		return;
	}else{
		//整数、小数、日期
		$("#operator").show();
		$(".num").hide();
		$("#validateBeginValue").removeAttr("disabled");
		$("#validateEndValue").removeAttr("disabled");
		$("#excelOperator").combobox("enable");
	}
	var operatorValue = $("#excelOperator").combobox("getValue");
	if(operatorValue==""){
		$(".num").hide();
		return;
	}
	if(operatorValue=="0" || operatorValue=="1"){
		//运算符为介于或未介于
		$(".num").show();
		text(2,validateTypeText,operatorValue);
	}else{
		$(".num").hide();
		if("2,3".indexOf(operatorValue) != -1){
			$("#beginNum").show();
		}else if("4,6".indexOf(operatorValue) != -1){
			$("#beginNum").show();
		}else{
			$("#endNum").show();
		}
		//其他运算符
		text(1,validateTypeText,operatorValue);
	}
}
/**
 * 方法描述：设置数据有效性值
 * @param num
 * @param verifyText
 * @param operatorValue
 */
function text(num,verifyText,operatorValue){
	if(verifyText.indexOf("数") != -1){	
		$("#validateBeginValue").parent().remove();
		var vbegin = "<td><input id='validateBeginValue' name='validateBeginValue'  class='easyui-validatebox input_bg' /></td>";
		$("#beginNum").append(vbegin);
		$("#validateEndValue").parent().remove();
		var vend = "<td><input id='validateEndValue' name='validateEndValue'  class='easyui-validatebox input_bg' /></td>";
		$("#endNum").append(vend);
		if (num == 2){
			$(".beginNumClass").html("最小值：");
			var validateBeginValue = $("#validateBeginValue").val();
			if(validateBeginValue.length==0){
				$("#validateBeginValue").val("-4294967296");
			}
			$(".endNumClass").html("最大值：");
			var validateEndValue = $("#validateEndValue").val();
			if(validateEndValue.length==0){
				$("#validateEndValue").val("4294967296");
			}
		}else{
			if("2,3".indexOf(operatorValue) != -1){
				//等于不等于
				$(".beginNumClass").html("数值：");
				var validateBeginValue = $("#validateBeginValue").val();
				if(validateBeginValue.length==0){
					$("#validateBeginValue").val("0");
				}
			}else if ("4,6".indexOf(operatorValue) != -1){
				//大于、大于或等于
				$(".beginNumClass").html("最小值：");
				var validateBeginValue = $("#validateBeginValue").val();
				if(validateBeginValue.length==0){
					$("#validateBeginValue").val("-4294967296");
				}
			}else{
				//小于，小于或等于
				$(".beginNumClass").html("最大值：");
				$(".endNumClass").html("最大值：");
				var validateEndValue = $("#validateEndValue").val();
				if(validateEndValue.length==0){
					$("#validateEndValue").val("4294967296");
				}
			}
		}
	}else if (verifyText.indexOf("日期") != -1){
		$("#validateBeginValue").addClass("Wdate");
		$("#validateEndValue").addClass("Wdate");
		$("#validateBeginValue").attr("onfocus","WdatePicker({dateFmt:'yyyy-MM-dd'})");
		$("#validateEndValue").attr("onfocus","WdatePicker({dateFmt:'yyyy-MM-dd'})");
		if (num == 2){
			$(".beginNumClass").html("开始日期：");
			$(".endNumClass").html("结束日期：");
			$(".beginNumClass").html("最小值：");
			
			var validateBeginValue = $("#validateBeginValue").val();
			if(validateBeginValue.length==0){
				$("#validateBeginValue").val("1900-01-01");
			}
			$(".endNumClass").html("最大值：");
			var validateEndValue = $("#validateEndValue").val();
			if(validateEndValue.length==0){
				$("#validateEndValue").val("9999-08-08");
			}
		}else{
			if("2,3".indexOf(operatorValue) != -1){
				$(".beginNumClass").html("日期：");
				var validateBeginValue = $("#validateBeginValue").val();
				if(validateBeginValue.length==0){
					$("#validateBeginValue").val("2000-01-01");
				}
			}else if ("4,6".indexOf(operatorValue) != -1){
				$(".beginNumClass").html("开始日期：");
				var validateBeginValue = $("#validateBeginValue").val();
				if(validateBeginValue.length==0){
					$("#validateBeginValue").val("1900-01-01");
				}
			}else{
				$(".beginNumClass").html("开始日期：");
				$(".endNumClass").html("结束日期：");
				var validateEndValue = $("#validateEndValue").val();
				if(validateEndValue.length==0){
					$("#validateEndValue").val("9999-08-08");
				}
			}
		}
	}
}


