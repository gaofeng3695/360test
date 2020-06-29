/**
 * 
 * 文件描述: 基本字段信息
 * 
 * @author LiuDongya
 * @modify //新增属性：[groupName][domainName] add by zhangyi 2017-7-19 15:37:52
 */

var updateData = [];
var editIndex = undefined;
var eventid = getParamter('eventid');
var fieldVerifyType = [];	//字段验证类型
var cascadefieldnameData;  //级联字段，表所有字段

var databasetype = getParamter('databasetype');	//数据库类型
var datasourcename = getParamter('datasourcename');	//数据源名称
var viewname = getParamter('viewname');	//视图表名称
var tablename=getParamter('tablename');	//数据表名称

// 字段类型
var fieldType = [{id:"STRING",text:"字符"}, 
                 {id:"INT",text:"整形"}, 
                 {id:"DOUBLE",text:"双精度"}, 
                 {id:"DATE",text:"日期"}];

// 查询UI类型
var uiType = [{id:"text",text:"文本输入框"}, 
              {id:"textarea",text:"大文本输入框"}, 
              {id:"number",text:"数字输入框"}, 
              {id:"numberfromto",text:"数字范围输入框"}, 
              {id:"combox",text:"下拉选择框"}, 
              {id:"mutiplecombox",text:"多选下拉选择框"}, 
              {id:"time",text:"时间选择框"}, 
              {id:"timerange",text:"时间范围选择框"}, 
              {id:"date",text:"日期选择框"}, 
              {id:"daterange",text:"日期范围选择框"}, 
              {id:"month",text:"年月选择框"},
              {id:"monthrange",text:"年月范围选择框"},
              {id:"year",text:"年选择框"}, 
              {id:"yearrange",text:"年范围选择框"}];
//表单UI类型
var formUiType = [{id:"text",text:"文本输入框"}, 
              {id:"textarea",text:"大文本输入框"}, 
              {id:"number",text:"数字输入框"}, 
              {id:"combox",text:"下拉选择框"}, 
              {id:"time",text:"时间选择框"},
              {id:"date",text:"日期选择框"}, 
              {id:"month",text:"年月选择框"},
              {id:"year",text:"年选择框"}
              ];

//字段取值规则类型
var valueRuleType=[{id:"input",text:"界面录入"},
                   {id:"system",text:"系统提供"}];
//系统提供的字段类型
var sysFiledType=[{id:"",text:"请选择"},
				  {id:"auto_userid",text:"用户ID"},
                  {id:"auto_userLoginName",text:"用户登录名"},
                  {id:"auto_userName",text:"用户姓名"},
                  {id:"auto_deptid",text:"部门ID"},
                  {id:"auto_systime",text:"系统时间"},
                  {id:"auto_active",text:"有效标识"},
                  {id:"auto_uuid",text:"数据ID"}];

//字段验证类型
var validatebox=$.fn.validatebox.defaults.rules;
var field={id:"",text:"请选择"};
fieldVerifyType.push(field);
for(var i in validatebox){
	var field={id:i,text:i};
	fieldVerifyType.push(field);
}

// 页面按钮
var frozenColumns = [[{title:"字段基本信息",colspan:4}], 
                    [{field:'fieldname',title:'字段名称',width:100}, // 原名：字段id
                     {field:'fieldalias',title:'字段别名',width:100,editor:'text'}, // 原名：字段名称
                     {field:'fieldtype',title:'字段类型',width:100,
                    	 editor:{
                    		 type : 'combobox',
                    		 options : {
                    			 valueField : 'id',
                    			 textField : 'text',
                    			 data : fieldType,
                    			 panelHeight : 'auto',
                    			 width : 100
                    		 }
                    	 }
                     }, // 原名：视图字段类型
                     {field:'fieldlength',title:'字段长度',	width:80,editor:'numberbox'}]];
//工具栏按钮
var toolbars = [ {
	id : "saveFieldInfo",
	text : "保存",
	iconCls : 'icon-save',
	handler : saveFieldInfo
}, {
	id : "resetFieldInfo",
	text : "重置",
	iconCls : 'icon-chongzhi',
	handler : resetFieldInfo
}, {
	id : "cancelFieldInfo",
	text : "取消",
	iconCls : 'icon-cancel',
	handler : closeFieldInfo
} ];


var columns;
/**
 * 
 * 方法描述：初始化页面
 * 
 */
$(document).ready(function(){
//	alert(databasetype);
	$.ajax({
		url:rootPath+'jasframework/getColumnAction.do',
		data :"&databasetype="+databasetype+"&datasourcename="+datasourcename+"&viewname="+viewname+"&tablename="+tablename,
		type:'post',
		success : function(data) {
			cascadefieldnameData=data;
			initColumns(data);
		},
		dataType:"json",
		error : function(data) {
			$.messager.alert('提示', '查询数据库中表或视图失败', 'error');	
		}
	});
});

function initColumns(cascadefieldnameData){
	columns = [[{title:'查询条件配置',colspan:3}, 
	                {title:'数据列表配置',colspan:4}, 
	                {title:'表单配置',colspan : 8}, 
	                {title : '下拉选及联动配置',colspan : 3},
	                {title:"字段值配置",colspan:3}
	               ],[
	                // 查询条件配置                
	                {field:'isqueryfield',title:'是否查询条件',width:100,
	                	editor:{type:'checkbox',options:{on:'1',off:'0'}}}, // 原名：基本过滤字段
	                {field:'queryuitype',title:'查询条件UI类型',width:120,
	                	 editor:{type:'combobox',
	                		 options:{
	                			 valueField : 'id',
	                			 textField : 'text',
	                			 panelHeight : 'auto',
	                			 data : uiType
	                			 }
	                 }}, // 原名：UI类型
	                 {field : 'queryorder',title : '查询条件排序',width : 100,editor : 'numberbox'},
	
	                 // 数据列表配置
	                 {field : 'isgridfield',title : '是否列表显示',width : 100,
	                	 editor : {type : 'checkbox',options : {on : '1',off : '0'}}}, // 原名：显示列
	                 {field : 'gridcolumnorder',title : '列表显示排序',width : 100,editor : 'numberbox'}, // 新增
	                 {field : 'gridcolumnwidth',title : '列表显示列宽',width : 100,editor : 'numberbox'}, // 原名：列宽
	                 {field : 'gridcolumnhide',title : '列表默认不显示',width : 100,
	                	 editor : {type : 'checkbox',options : {on : '1',off : '0'}}}, // 新增
	
	                 // 表单配置
	                 {field : 'isaddfield',	title : '是否添加字段',	width : 100,
	                		 editor : {	type : 'checkbox',	options : {	on : '1',	off : '0'}}}, // 原名：增加字段
	                 {field:'isupdtefield',title:'是否修改字段',width:100,
	                		 editor:{type : 'checkbox',	options : {on : '1',off : '0'}}}, // 原名：修改字段
	                 {field : 'isdetailfield',title : '是否详情字段',width : 100,
	                		 editor : {	type : 'checkbox',	options : {	on : '1',	off : '0'}	}}, // 原名：详情字段
	
	                 
	                 {	field : 'formuitype',	title : '表单UI类型',	width : 100,
	                		 editor : {	type : 'combobox',	
	                			 options : {
	                				 valueField : 'id',
	                				 textField : 'text',
	                				 panelHeight:'auto',
	                				 data : formUiType	
	                				 }
	                		 }
	                 }, // 原名：UI类型
	                 {field:'formorder',title:'表单排序',width:100,editor:'numberbox'}, 
	                 {field : 'groupName',title : '分组名称',width : 100,editor: 'text'},
	                 {field : 'isrequired',title : '是否必填',width : 100,	
	                	 editor : {	type : 'checkbox',	options : {	on : '1',off : '0'}}}, 
	                 {field:'validatetype',title:'字段验证类型',width:100,
	                		 editor:{
	                			 type : 'combobox',
								 options : {
										valueField : 'id',
										textField : 'text',
										data : fieldVerifyType,
										width : 100,
										panelHeight:'auto',
								 }
	                	     }
	                }, 
	             // 下拉选及联动配置
	                {field : 'domainsql',title : '值域SQL语句',width : 100,editor : 'text'}, 
	                {field : 'domainName',title : '值域名称',width : 100,editor : 'text'}, 
	                {field : 'cascadefieldname',title : '下拉联动字段',	width : 100,
	                	editor : {
	                		type : 'combobox',
							options : {
								valueField : 'COLUMN_NAME',
								textField : 'COLUMN_NAME',
								data : cascadefieldnameData,
								width : 230
							}
						}
					}, // 原名：下拉联动子控件ID
					//新增属性：add by Shenjie 2015-7-14 9:55
					{field:"isPkField",title:"是否主键字段",width:100,
						editor : {	type : 'checkbox',	options : {	on : '1',	off : '0'}	}
					},
					{field:"valueRuleType",title:"取值规则",width:100,
						editor:{
							type:"combobox",
							options:{
								valueField:"id",
								textField:"text",
								data:valueRuleType,
								width:230	
							}
					}},
					{field:"sysFieldType",title:"系统字段类型",width:100,
						editor:{
							type:"combobox",
							options:{
								valueField:"id",
								textField:"text",
								data:sysFiledType,
								width:230	
							}
					}}
	] ];


	// 判断是否已经配置字段信息
	$.ajax({
		url:rootPath+'jasframework/isExistTableNameAction.do?dataSourceName=defaultDataSource&eventid='+ eventid,
		type : 'POST',
		success : function(result) {
			initDatagrid();
			if (result) {
				loadUpdateDatagrid();
			} else {
				loadAddDatagrid();
			}
		},
		dataType : "json",
		error : function(result) {
			$.messager.alert('提示', '查询失败！', 'error');
		}
	});

}






function setEditing(rowIndex) {
	var editors = $('#datatableid').datagrid('getEditors', rowIndex);
	var priceEditor = editors[0];
	var amountEditor = editors[1];
	var costEditor = editors[2];
	priceEditor.target.bind('change', function() {
		calculate();
	});
	amountEditor.target.bind('change', function() {
		calculate();
	});
	function calculate() {
		var cost = priceEditor.target.val() * amountEditor.target.val();
		$(costEditor.target).numberbox('setValue', cost);
	}
}

var endIndex;
function onClickRow(index) {
	endIndex = index;
	if (editIndex != index) {
		if (endEditing()) {
			$('#datatableid').datagrid('endEdit', editIndex);
			$('#datatableid').datagrid('beginEdit', index);			
			editIndex = index;
		} else {
			$('#datatableid').datagrid('selectRow', editIndex);
		}
	}
}

function endEditing() {
	if (editIndex == undefined) {
		return true;
	}
	if ($('#datatableid').datagrid('validateRow', editIndex)) {
		//设置字段类型显示值
		var fieldtype = $('#datatableid').datagrid('getEditor', {
			index : editIndex,
			field : 'fieldtype'
		});
		var fieldtypeText = $(fieldtype.target).combobox('getText');
		$(fieldtype.target).combobox('setValue', fieldtypeText);

		//设置查询条件UI类型显示值
		var uitype = $('#datatableid').datagrid('getEditor', {
			index : editIndex,
			field : 'queryuitype'
		});
		var uitypeText = $(uitype.target).combobox('getText');
		$(uitype.target).combobox('setValue', uitypeText);

		//设置下拉联动字段显示值
		var dropdown = $('#datatableid').datagrid('getEditor', {
			index : editIndex,
			field : 'cascadefieldname'
		});
		var dropdownText = $(dropdown.target).combobox('getText');
		$(dropdown.target).combobox('setValue', dropdownText);

		//设置表单UI类型显示值
		var pageuitype = $('#datatableid').datagrid('getEditor', {
			index : editIndex,
			field : 'formuitype'
		});
		var pageuitypeText = $(pageuitype.target).combobox('getText');
		$(pageuitype.target).combobox('setValue', pageuitypeText);
		
		//设置字段取值方式
		var valueruletype = $('#datatableid').datagrid('getEditor', {
			index : editIndex,
			field : 'valueRuleType'
		});
		var valueruletypeText = $(valueruletype.target).combobox('getText');
			$(valueruletype.target).combobox('setValue', valueruletypeText);
		
		//设置系统字段显示值
		var sysfieldtype = $('#datatableid').datagrid('getEditor', {
			index : editIndex,
			field : 'sysFieldType'
		});
		var sysfieldtypeText = $(sysfieldtype.target).combobox('getText');
		if(sysfieldtypeText!="请选择"){
			$(sysfieldtype.target).combobox('setValue', sysfieldtypeText);
		}
	
		$('#datatableid').datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

/**
 * 
 * 方法描述：保存基本字段信息
 * 
 */
function saveFieldInfo() {
	$('#datatableid').datagrid('endEdit', editIndex);
	$.ajax({
		url : rootPath+"jasframework/addSysColumnInfo.do?viewname=" + viewname+"&tablename="+tablename,
		data : "datagridData=" + JSON.stringify(updateData),
		type : 'post',
		success : function(data) {
			$('#save1').linkbutton('disable');
			$.messager.alert('提示', '保存成功！', 'info', function() {
				reloadData('configurationHelpHtmL.htm', "configurationTable");
				top.closeDlg('tablecolumnadd');
			});
		},
		dataType : "json",
		error : function(data) {
			top.showAlert('提示', '保存失败', 'error');
		}
	});
}

/**
 * 
 * 方法描述：关闭基本字段信息
 * 
 */
function closeFieldInfo() {
	top.closeDlg('tablecolumnadd');
}

/**
 * 
 * 方法描述：添加详细字段信息时，加载datagrid
 * 
 */
function loadAddDatagrid() {
	$.ajax({
		url : rootPath+"jasframework/getColumnAction.do",
		data :"&databasetype="+databasetype+"&datasourcename="+datasourcename+"&viewname="+viewname+"&tablename="+tablename,
		type : 'post',
		success : function(data) {
			for ( var i = 0; i < data.length; i++) {
				var datatype = data[i].DATA_TYPE;
				if (datatype == "VARCHAR2" || datatype == "NVARCHAR2"
						|| datatype == "STRING") {
					data[i].DATA_TYPE = "字符";
				} else if (datatype == "NUMBER") {
					data[i].DATA_TYPE = "整形";
				} else if (datatype == "DATE") {
					data[i].DATA_TYPE = "日期";
				}
				//设置是否必填
				if(data[i].ISNULLABLE=="Y" || data[i].ISNULLABLE=="YES"){
					data[i].ISNULLABLE = "0";
				}else if(data[i].ISNULLABLE=="N" || data[i].ISNULLABLE=="NO"){
					data[i].ISNULLABLE = "1";
				}
				$('#datatableid').datagrid('insertRow',
						{index : i, // index start with 0
						 row : {
							fieldname : data[i].COLUMN_NAME,
							fieldalias : data[i].COMMENTS,
							fieldtype : data[i].DATA_TYPE,
							fieldlength:data[i].DATA_LENGTH,
							isrequired:data[i].ISNULLABLE
						 }
				});
			}
		},
		dataType : "json",
		error : function(data) {
			top.showAlert('提示', '查询视图字段失败', 'error');
		}
	});

	initDatagrigHeight('datatableid', '', 0);
}
var columnsData;
/**
 * 
 * 方法描述：修改详细字段信息时，加载datagrid
 * 
 */
function loadUpdateDatagrid(){
	$.ajax({
		url : rootPath+"jasframework/getColumnAction.do",
		data :"&databasetype="+databasetype+"&datasourcename="+datasourcename+"&viewname="+viewname+"&tablename="+tablename,
		type : 'post',
		success : function(result) {
			$.ajax({
				url : rootPath+'jasframework/getExitColumnAction.do?dataSourceName=defaultDataSource&viewname='+ viewname+"&tablename="+tablename,
				type : 'post',
				success : function(data) {
					// 给字段信息赋值
					for ( var i = 0; i < result.length; i++) {
						var j;
						for (j = 0; j < data.length; j++) {
							if (result[i].COLUMN_NAME == data[j].fieldname) {
								//字段类型
								data[j].fieldtype = converFieldTypeToText(data[j].fieldtype);
								//查询UI类型
								data[j].queryuitype = converUITypeToText(data[j].queryuitype);
								//表单UI类型
								data[j].formuitype = converUITypeToText(data[j].formuitype);								
								//取值规则类型
								data[j].valueRuleType = convertValueRuleTypeToText(data[j].valueRuleType);
								//系统字段类型
								data[j].sysFieldType = convertSysFieldToText(data[j].sysFieldType);
								var fieldalias=data[j].fieldalias;
								if(fieldalias=="" || fieldalias==null){
									fieldalias=result[i].COMMENTS;
								}
								$('#datatableid').datagrid('insertRow',
										{index : i, // index start with 0
										 row : {
											fieldname : data[j].fieldname,
											fieldalias : fieldalias,
											fieldtype : data[j].fieldtype,
											fieldlength : data[j].fieldlength,
											isqueryfield : data[j].isqueryfield,
											queryuitype : data[j].queryuitype,
											queryorder : data[j].queryorder,
											isgridfield : data[j].isgridfield,
											gridcolumnorder : data[j].gridcolumnorder,
											gridcolumnwidth : data[j].gridcolumnwidth,
											gridcolumnhide : data[j].gridcolumnhide,
											isaddfield : data[j].isaddfield,
											isupdtefield : data[j].isupdtefield,
											isdetailfield : data[j].isdetailfield,
											formuitype : data[j].formuitype,
											formorder : data[j].formorder,
											groupName : data[j].groupName,
											isrequired : data[j].isrequired,
											validatetype : data[j].validatetype,
											domainsql : data[j].domainsql,
											domainName : data[j].domainName,
											cascadefieldname : data[j].cascadefieldname,
											isPkField:data[j].isPkField,
											valueRuleType:data[j].valueRuleType,
											sysFieldType:data[j].sysFieldType,
											
										}
								});
							break;
						}
					}
					if (j == data.length) {
						//设置字段类型
						if (result[i].DATA_TYPE == "VARCHAR2"
								|| result[i].DATA_TYPE == "NVARCHAR2"
								|| result[i].DATA_TYPE == "STRING") {
							result[i].DATA_TYPE = "字符";
						} else if (result[i].DATA_TYPE == "NUMBER") {
							result[i].DATA_TYPE = "整形";
						} else if (result[i].DATA_TYPE == "DATE") {
							result[i].DATA_TYPE = "日期";
						}
						//设置是否为空
						if(result[i].ISNULLABLE=="Y" || result[i].ISNULLABLE=="YES"){
							result[i].ISNULLABLE = "1";
						}else if(result[i].ISNULLABLE=="N" || result[i].ISNULLABLE=="NO"){
							result[i].ISNULLABLE = "0";
						}
						$('#datatableid').datagrid('insertRow',
								{index : i, // index start with 0
								 row : {
									fieldname : result[i].COLUMN_NAME,
									fieldalias : result[i].COMMENTS,
									fieldtype : result[i].DATA_TYPE,
									fieldlength:result[i].DATA_LENGTH,
									isnullable:result[i].ISNULLABLE
								 }
						});
					}
					}
			},
			dataType : "json",
			error : function(data) {
				top.showAlert('提示', '查询视图字段失败', 'error');
			}
		});
	},
	dataType : "json",
	error : function(data) {
		top.showAlert('提示', '查询视图字段失败', 'error');
	}
	});
	
}

function initDatagrid() {
	$('#datatableid').datagrid({
		idField : 'eventid',
		frozenColumns : frozenColumns,
		columns : columns,
		fitColumns : false,
		pagination : false,
		striped : true,
		autoRowHeight : false,
		rownumbers:true,
		onLoadSuccess : function(data) {
			$(".datagrid-header-check input").attr("checked", false);
			$('#datatableid').datagrid('clearSelections');
		},
		onAfterEdit : function(rowIndex, rowData, changes) {
			//设置字段类型
			rowData.fieldtype = converFieldTypeToId(rowData.fieldtype);
			//设置查询UI类型
			rowData.queryuitype = converUITypeToId(rowData.queryuitype);
			//设置表单UI类型
			rowData.formuitype = converUITypeToId(rowData.formuitype);
			//设置取值规则类型
			rowData.valueRuleType = convertValueRuleTypeToId(rowData.valueRuleType);
			//设置系统字段类型
			rowData.sysFieldType = convertSysFieldToId(rowData.sysFieldType);
			var changeRow = {
				rowIndex : rowIndex,
				rowData : rowData
			};
			if (updateData.length != 0) {
				for ( var i = 0; i < updateData.length; i++) {
					var eachData = updateData[i];
					if (eachData.rowIndex == rowIndex) {
						updateData.splice(i, 1);
						break;
					}
				}
			}
			updateData.push(changeRow);
		},
		onClickRow : onClickRow
	});
	initDatagrigHeight('datatableid', '', 0);
}

/**
 * 
 * 方法描述：重置字段配置
 * 
 */
function resetFieldInfo() {
	$.messager.confirm('提示框', '是否重置字段配置?',function(r){
		if(r){
			$('#datatableid').datagrid('endEdit', editIndex);
			$.ajax({
				url : rootPath+"jasframework/deleteColumnAction.do?dataSourceName=defaultDataSource&eventid="+ eventid,
				type : 'post',
				success : function(data) {
					if(data){
						$.messager.alert('提示', '重置成功！', 'info');
					}
					
					$('#datatableid').datagrid('loadData', { "total": 0, "rows": [] });	//删除datagrid中所有数据
					loadAddDatagrid();
				},
				dataType : "json",
				error : function(data) {
					top.showAlert('提示', '重置字段失败！', 'error');
					}
			});
		}
	});
	
}

/**
 * 
 * 方法描述：将字段类型由id值转为text值
 * 
 * @param fieldtype
 *            字段类型id值
 * @returns 字段类型text值
 * 
 */
function converFieldTypeToText(fieldtype) {
	if (fieldtype == "STRING") {
		fieldtype = "字符";
	} else if (fieldtype == "INT") {
		fieldtype = "整形";
	}
	if (fieldtype == "DOUBLE") {
		fieldtype = "双精度";
	}
	if (fieldtype == "DATE") {
		fieldtype = "日期";
	}
	return fieldtype;
}

/**
 * 
 * 方法描述：将字段类型由text值转为id值
 * 
 * @param fieldtype
 *            字段类型text值
 * @returns 字段类型id值
 * 
 */
function converFieldTypeToId(fieldtype) {
	if (fieldtype == "字符") {
		fieldtype = "STRING";
	} else if (fieldtype == "整形") {
		fieldtype = "INT";
	}
	if (fieldtype == "双精度") {
		fieldtype = "DOUBLE";
	}
	if (fieldtype == "日期") {
		fieldtype = "DATE";
	}
	return fieldtype;
}
/**
 * 
 * 方法描述：将UI类型由id值转为text值
 * 
 * @param uitype
 *            UI类型id值
 * @returns UI类型text值
 * 
 */
function converUITypeToText(uitype) {
	if (uitype == "text") {
		uitype = "文本输入框";
	} else if (uitype == "textarea") {
		uitype = "大文本输入框";
	} else if (uitype == "number") {
		uitype = "数字输入框";
	} else if (uitype == "numberfromto") {
		uitype = "数字范围输入框";
	} else if (uitype == "combox") {
		uitype = "下拉选择框";
	} else if (uitype == "mutiplecombox") {
		uitype = "多选下拉选择框";
	} else if (uitype == "date") {
		uitype = "日期选择框";
	} else if (uitype == "daterange") {
		uitype = "日期范围选择框";
	} else if (uitype == "time") {
		uitype = "时间选择框";
	} else if (uitype == "timerange") {
		uitype = "时间范围选择框";
	} else if (uitype == "year") {
		uitype = "年选择框";
	}else if (uitype == "yearrange") {
		uitype = "年范围选择框";
	} else if (uitype == "month") {
		uitype = "年月选择框";
	}else if (uitype == "monthrange") {
		uitype = "年月范围选择框";
	}
	return uitype;
}

/**
 * 
 * 方法描述：将UI类型由text值转为id值
 * 
 * @param uitype
 *            UI类型text值
 * @returns UI类型id值
 * 
 */
function converUITypeToId(uitype) {
	if (uitype == "文本输入框") {
		uitype = "text";
	} else if (uitype == "大文本输入框") {
		uitype = "textarea";
	} else if (uitype == "数字输入框") {
		uitype = "number";
	} else if (uitype == "数字范围输入框") {
		uitype = "numberfromto";
	} else if (uitype == "下拉选择框") {
		uitype = "combox";
	} else if (uitype == "多选下拉选择框") {
		uitype = "mutiplecombox";
	} else if (uitype == "日期选择框") {
		uitype = "date";
	} else if (uitype == "日期范围选择框") {
		uitype = "daterange";
	} else if (uitype == "时间选择框") {
		uitype = "time";
	} else if (uitype == "时间范围选择框") {
		uitype = "timerange";
	} else if (uitype == "年选择框") {
		uitype = "year";
	}else if (uitype == "年范围选择框") {
		uitype = "yearrange";
	} else if (uitype == "年月选择框") {
		uitype = "month";
	}else if (uitype == "年月范围选择框") {
		uitype = "monthrange";
	}
	return uitype;
}

/**
 * 方法描述：转换系统字段类型值为ID
 * @param sysfieldType 系统字段类型text值
 * @returns 系统字段类型id值
 */
function convertSysFieldToId(sysfieldType){
	if(sysfieldType == "用户ID"){
		sysfieldType = "auto_userid";
	}else if(sysfieldType == "用户登录名"){
		sysfieldType = "auto_userLoginName";
	}else if(sysfieldType == "用户姓名"){
		sysfieldType = "auto_userName";
	}else if(sysfieldType == "部门ID"){
		sysfieldType = "auto_deptid";
	}else if(sysfieldType == "系统时间"){
		sysfieldType = "auto_systime";
	}else if(sysfieldType == "有效标识"){
		sysfieldType = "auto_active";
	}else if(sysfieldType == "数据ID"){
		sysfieldType = "auto_uuid";
	}
	return sysfieldType;
}

/**
 * 方法描述：转换系统字段类型ID为值
 * @param sysfieldType 系统字段类型id值
 * @returns 系统字段类型text值
 */
function convertSysFieldToText(sysfieldType){
	if(sysfieldType=="auto_userid"){
		sysfieldType = "用户ID";
	}else if(sysfieldType == "auto_userLoginName"){
		sysfieldType = "用户登录名";
	}else if(sysfieldType == "auto_userName"){
		sysfieldType = "用户姓名";
	}else if(sysfieldType=="auto_deptid"){
		sysfieldType = "部门ID";
	}else if(sysfieldType=="auto_systime"){
		sysfieldType = "系统时间";
	}else if(sysfieldType == "auto_active"){
		sysfieldType="有效标识";
	}else if(sysfieldType == "auto_uuid"){
		sysfieldType = "数据ID";
	}
	return sysfieldType;
}

/**
 * 方法描述：转换字段取值规则值为ID
 * @param valueruleType 字段取值规则类型text值
 * @returns 字段取值规则id值
 */
function convertValueRuleTypeToId(valueruleType){
	if(valueruleType=="界面录入"){
		valueruleType="input";
	}else if(valueruleType=="系统提供"){
		valueruleType="system";
	}
	return valueruleType;
}

/**
 * 方法描述：转换字段取值规则id为text
 * @param valueruleType 字段取值规则类型id值
 * @returns 字段取值规则text值
 */
function convertValueRuleTypeToText(valueruleType){
	if(valueruleType=="input"){
		valueruleType="界面录入";
	}else if(valueruleType=="system"){
		valueruleType="系统提供";
	}
	return valueruleType;
}