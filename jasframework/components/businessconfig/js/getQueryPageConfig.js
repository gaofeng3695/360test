var businessConfig_Id;
var queryForm_Id="queryForm";
var datagrid_Id ="datagridId";
var queryField_Names="";
var queryField_Types="";
var query_Method="query";
var clear_Method="clearQueryForm";
/**
 * 
 * 功能描述：判断页面的隐藏域id="businessid" value的值的正确性
 *
 */
$(function(){
	businessConfig_Id=$("#businessid").val();
	var count=$('#businessid').length;
    if(businessConfig_Id==''){
      $.messager.alert('提示','请检查页面设置的隐藏域的value的正确性');   
       return;
    }
    if(count<=0){
	  $.messager.alert('提示','请检查页面是否存在id="businessid"的隐藏域');   
      return;
    }
});

/**
 * 
 * 功能描述：查询form渲染方法，根据配置的查询字段和UI类型，渲染查询条件form表单
 *
 * @param businessConfigId  业务配置ID，必填
 * @param queryFormId 查询form的ID 可选，默认值为：queryForm
 * @param datagridId 数据列表的ID  可选，默认值为：datagrid
 * @param queryMethod 查询方法名称,不带括号 可选，默认值为：query
 * @param clearMethod 清空方法名称,不带括号 可选，默认值为：clearQueryForm
 */
function renderQueryForm(queryFormId,datagridId,queryMethod,clearMethod){
	if(queryFormId!='' && "undefined" != typeof (queryFormId)){
		queryForm_Id=queryFormId;
	}
	if(datagridId!='' && "undefined"  != typeof (datagridId)){
		datagrid_Id=datagridId;
	}
	if(queryMethod!='' && "undefined" != typeof (queryMethod)){
		query_Method =queryMethod;
	}
	if(clearMethod!='' && "undefined" != typeof (clearMethod)){
		clear_Method=clearMethod;
	}
    var getQueryConfigUrl =rootPath+'/jasframework/queryConfig/getAllQueryByBusinessId.do';
	$.post(getQueryConfigUrl, {"businessid":businessConfig_Id}, function(data){
			var len=data.length;
			var innerhtml="<table class=\"query-table\" >" ;
			innerhtml +="<tr>";
			var queryFieldNames="";
			var queryFieldTypes="";
	 	    for(var i=0;i<len;i++){
	 	    	var queryFieldName = data[i].FIELDNAME;
	 	    	var queryFieldType = data[i].FIELDTYPE;
	        	innerhtml+="<td width=\"20%\">"+data[i].QUERYNAME+"\：</td>";
	        	innerhtml+="<td width=\"30%\">";
				if(queryFieldType==1){//文本框
					innerhtml+="<input type=\"text\"  id=\""+queryFieldName+"\" name=\""+queryFieldName+"\" class=\"easyui-validatebox input_bg\" />";	
				}else if(queryFieldType==5){//下拉选
					var dataSource = data[i].DATAURL;
					if(dataSource.indexOf('{')!=-1){
						innerhtml+="<input  id=\""+queryFieldName+"\"  name=\""+queryFieldName+"\" data-options=\"valueField:'"+data[i].VALUEFIELD+"',textField:'"+data[i].TEXTFIELD+"', data: "+ dataSource+"\" class=\"easyui-combobox input_bg\" />";
					}else{
						dataSource = rootPath+"/"+dataSource;
						innerhtml+="<input  id=\""+queryFieldName+"\"  name=\""+queryFieldName+"\" url=\""+dataSource+"\" valueField=\""+data[i].VALUEFIELD+"\" textField=\""+data[i].TEXTFIELD+"\" class=\"easyui-combobox input_bg\" />";
					}
				}else if(queryFieldType==13){//下拉树
					var dataSource = data[i].DATAURL;
					if(dataSource.indexOf('{')!=-1){
						innerhtml+="<input   id=\""+queryFieldName+"\" name=\""+queryFieldName+"\"  url=\""+data[i].DATAURL+"\"  class=\"easyui-combotree input_bg\"/>";
					}else{
						dataSource = rootPath+"/"+dataSource;
						innerhtml+="<input   id=\""+queryFieldName+"\" name=\""+queryFieldName+"\"  url=\""+dataSource+"\"  class=\"easyui-combotree input_bg\"/>";
					}
				}else if(queryFieldType==3){//数字框
					innerhtml+="<input type=\"text\"  id=\""+queryFieldName+"\" name=\""+queryFieldName+"\" class=\"easyui-numberbox input_bg\" missingmessage=\"填写数字\"/>";
				}else if(queryFieldType==4){//数字范围
					innerhtml+="<table  width=\"100%\"> <tr><td  width=\"50%\"><input type=\"text\" id=\""+queryFieldName+"_START\" name=\""+queryFieldName+"_START\" class=\"easyui-numberbox input_bg\" missingmessage=\"填写数字\"/> </td> <td width=\"50%\"> <input type=\"text\" id=\""+queryFieldName+"_END\" name=\""+queryFieldName+"_END\" class=\"easyui-numberbox input_bg\" missingmessage=\"填写数字\"/></td></tr></table>";
					queryFieldName=queryFieldName+"_START,"+queryFieldName+"_END";
					queryFieldType=queryFieldType+","+queryFieldType; 
			    }else if(queryFieldType==9){//日期框
					innerhtml+="<input type=\"text\"  id=\""+queryFieldName+"\" name=\""+queryFieldName+"\" onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate easyui-validatebox input_bg\"  />";
				}else if(queryFieldType==10){//日期范围
					innerhtml+=" <table  width=\"100%\"> <tr><td  width=\"50%\"><input type=\"text\"  id=\""+queryFieldName+"_START\" name=\""+queryFieldName+"_START\" onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate easyui-validatebox input_bg\" />  </td> <td width=\"50%\"> <input type=\"text\"  id=\""+queryFieldName+"_END\" name=\""+queryFieldName+"_END\" onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate easyui-validatebox input_bg\" /></td></tr></table>";
					queryFieldName=queryFieldName+"_START,"+queryFieldName+"_END";
					queryFieldType=queryFieldType+","+queryFieldType;
				}else if(queryFieldType==7){//时间框
					innerhtml+="<input type=\"text\"  id=\""+queryFieldName+"\" name=\""+queryFieldName+"\" onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})\" class=\"Wdate easyui-validatebox input_bg\"  />";
				}else if(queryFieldType==8){//时间范围
					innerhtml+=" <table  width=\"100%\"> <tr><td  width=\"50%\"><input type=\"text\"  id=\""+queryFieldName+"_START\" name=\""+queryFieldName+"_START\" onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})\" class=\"Wdate easyui-validatebox input_bg\" />  </td> <td width=\"50%\"> <input type=\"text\"  id=\""+queryFieldName+"_END\" name=\""+queryFieldName+"_END\" onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})\" class=\"Wdate easyui-validatebox input_bg\" /></td></tr></table>";
					queryFieldName=queryFieldName+"_START,"+queryFieldName+"_END";
					queryFieldType=queryFieldType+","+queryFieldType;
				}else{
					innerhtml+="<input type=\"text\"  id=\""+queryFieldName+"\" name=\""+queryFieldName+"\" class=\"easyui-validatebox input_bg\" />";
				}
	        	innerhtml+="</td>";
	        	if(i%2==1){//查询条件要是偶数的话就进行换行
	  					innerhtml+="</tr><tr>";
				}
				queryFieldNames +=queryFieldName+",";
				queryFieldTypes += queryFieldType+",";
			}
	 	   queryFieldNames= queryFieldNames.substring(0, queryFieldNames.length-1);
	 	   queryFieldTypes= queryFieldTypes.substring(0, queryFieldTypes.length-1);
	 	   queryField_Names=queryFieldNames;
	 	   queryField_Types=queryFieldTypes;
	 	   if(len%2==0){//按钮显示的位置
		       innerhtml+="<tr><td colspan=\"4\"><a href=\"#\"  class=\"easyui-linkbutton\" iconCls=\"icon-search\" onclick=\""+query_Method+"()\">查询</a><a href=\"#\" class=\"easyui-linkbutton\" iconCls=\"icon-clear\" onclick=\""+clear_Method+"()\">清空</a></td></tr>";
		  	}else{
		  	   innerhtml+="<td colspan=\"2\"><a href=\"#\"  class=\"easyui-linkbutton\" iconCls=\"icon-search\" onclick=\""+query_Method+"()\">查询</a><a href=\"#\" class=\"easyui-linkbutton\" iconCls=\"icon-clear\" onclick=\""+clear_Method+"()\">清空</a></td>";
		  	}
		 innerhtml +="</tr>";
		 innerhtml+="</table>";
         innerhtml +="<input type=\"hidden\" id=\"queryFieldNames\" name =\"queryFieldNames\" value=\""+queryFieldNames+"\">";
		 innerhtml +='<input type="hidden" id="queryFieldTypes" name ="queryFieldTypes" value="'+queryFieldTypes+'">';
		 $("#"+queryForm_Id).html(innerhtml);
	     $.parser.parse($("#"+queryForm_Id));
         //设置combobox的宽度
         var clientWidth=document.documentElement.clientWidth;
    	 $(".easyui-combobox").combobox("resize",clientWidth*0.3);
         //设置combotree的宽度
    	 $(".easyui-combotree").combobox("resize",clientWidth*0.3);
        },
	"json");
}
/**
 * 
 * 功能描述：从查询form中获取查询条件，封装成json格式
 * @retrun：查询条件json对象，属性为表单元素name属性，值为表单元素值
 */
function getQueryCondition(){
	var queryFieldNamesArray = queryField_Names.split(",");
	var queryFieldTypesArray = queryField_Types.split(",");
    var query={}; //把查询条件拼接成JSON
	for(var i =0; i<queryFieldNamesArray.length; i++){
		var queryFieldName=queryFieldNamesArray[i];
		var queryFieldType=queryFieldTypesArray[i];
		var queryFieldValue="";
		if(queryFieldType==5){
			queryFieldValue=$("#"+queryFieldName).combobox('getValue');
		}else if(queryFieldType==13){
			queryFieldValue=$("#"+queryFieldName).combotree('getValue');
		}
		else {
			queryFieldValue=$("#"+queryFieldName).val();
		}
		query[queryFieldName] = queryFieldValue;
	}
	query.queryFieldNames=queryField_Names;
	query.queryFieldTypes=queryField_Types;
	//alert(JSON.stringify(query));
	return query;
}
/**
 * 
 * 功能描述：查询按钮响应事件
 *
 */
function query(){
	var query = getQueryCondition();
    $("#"+datagrid_Id).datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
	$("#"+datagrid_Id).datagrid('load'); //重新加载
}
/**
 * 
 * 功能描述：清空按钮响应事件
 *
 */
function clearQueryForm(){
	//$('#'+queryForm_Id)[0].reset();
	$("input").val(""); 
}
/**
 * 
 * 功能描述：返回datagrid的column的属性
 *
 */
function getColumnConfig(){
    var columns = new Array();
    $.ajax({
     	url: rootPath+"/jasframework/dataColumn/getDataColumnByBussinessId.do?r="+new Date().getTime(), 
     	data:{"businessid" :businessConfig_Id},
     	dataType: "json", 
     	async:false,
     	success: function(resp){
           for(var i=0;i<resp.length;i++){
              	var column = {};
            	column.field=resp[i].TABLEFIELDNAME.toLowerCase();
            	column.title=resp[i].COLUMNNAME;
            	column.width=resp[i].COLUMNWIDTH;
            	if(resp[i].SORTABLE==1){
            		column.sortable=true;
            	}
            	if(resp[i].DISPLAY!=1){
            		column.hidden=true;
            	}
            	columns[i]=column;
           	}
     	},
     	error:function(){
     	}
     });
    return [columns];
}	
		
		
		
		
