/**
 * 
 * 文件描述: 公共变量和方法JS
 *
 * @author LiuDongya
 * @version 1.0
 * 
 */

//空间表类型
var geometrytypeData=[{
		id:"none",
		text:"属性表",
		selected:true  
	},{
		id:"Point",
		text:"点空间表"
	},{
		id:"Polyline",
		text:"线空间表"
	},{
		id:"Polygon",
		text:"面空间表"
	}];

//下拉框是否选择列表
var isFieldData=[{
	id:"0",
	text:"否",
	selected:true
},{
	id:"1",
	text:"是"
}];

/*****	加载下拉列表框数据	*****/

/**
 * 
 * 方法描述：根据url获取远程数据，加载combobox下拉列表数据
 * 
 * @param comboxId 下拉列表框id
 * @param comboxData 下拉列表框数据
 * @param valueField 下拉列表框数据id值，缺省条件下为id
 * @param textField 下拉列表框数据显示值，缺省条件下为text
 * @param isselect 是否存在默认选中数据：true为存在默认选中数据，false为不存在默认选中数据,缺省条件下为false
 * @param selectindex 默认选中数据下拉列表第几项，从0开始,缺省条件下为0
 * 
 */
function loadComboboxDataByData(comboxId,comboxData,valueField,textField,isselect,selectindex){
	valueField=typeof(valueField)=='undefined'?'id':valueField; 
	textField=typeof(textField)=='undefined'?'text':textField; 
	isselect=typeof(isselect)=='undefined'?false:isselect; 
	selectindex=typeof(selectindex)=='undefined'?0:selectindex; 
	$('#'+comboxId).combobox({ 
		valueField:valueField,  
		textField:textField,
		data:comboxData,
		panelHeight:"auto",
		onLoadSuccess:function(){
			setComboObjWidth(comboxId,0.3,'combobox');
			if(isselect==true){
		    	$('#'+comboxId).combobox('select',eval('(comboxData[selectindex]\.'+valueField+')'));
			}
		}
	}); 
}

/**
 * 
 * 方法描述：根据url获取远程数据，加载combobox下拉列表数据
 * 
 * @param comboxId 下拉列表框id，不可缺省
 * @param url 加载远程数据url，不可缺省
 * @param valueField 下拉列表框数据id值，缺省条件下为id
 * @param textField 下拉列表框数据显示值，缺省条件下为text
 * @param isselect 是否存在默认选中数据：true为存在默认选中数据，false为不存在默认选中数据,缺省条件下为false
 * @param selectindex 默认选中数据下拉列表第几项，从0开始,缺省条件下为0
 * 
 */
function loadComboboxDataByUrl(comboxId,url,valueField,textField,isselect,selectindex){
	valueField=typeof(valueField)=='undefined'?'id':valueField; 
	textField=typeof(textField)=='undefined'?'text':textField; 
	isselect=typeof(isselect)=='undefined'?false:isselect; 
	selectindex=typeof(selectindex)=='undefined'?0:selectindex; 
	$('#'+comboxId).combobox({ 
		url:url,
		valueField : valueField,
		textField : textField,
		panelHeight:"auto",
		onLoadSuccess:function(){
			setComboObjWidth(comboxId,0.3,'combobox');
			if(isselect==true){
				var data = $('#'+comboxId).combobox('getData'); 
		    	if (data.length > 0) {
		    		$('#'+comboxId).combobox('select',eval('(data[selectindex]\.'+valueField+')'));
		    	}
			}
		}
	}); 
}

/**
 * 
 * 方法描述：根据不同UI类型，加载不同表单填写框
 * 
 * @param uiNum 已加载UI输入框个数
 * @param uiType UI类型
 * @param fieldID 字段ID
 * @param fieldName 字段名称
 * @param fieldLength 字段长度
 * @param fieldRequired 字段是否为必填项
 * @param validatetype
 * @return	UI输入框
 * 
 */
function initUIForm(uiNum,uiType,fieldID,fieldName,fieldLength,fieldRequired,i18nTo,language,validatetype){
	//alert(uiType);
	var uiBox="";
	if (uiNum % 2 == 0) {
		uiBox += "<tr>";
	}
	language=typeof(language)=='undefined'?'zh_CN':language; 
	if(language=='zh_CN'){
		fieldName+="：";
	}else if(language=='en'){
		fieldName+=":";
	}
	
	switch (uiType) {
		//文本框
		case 'text':
			uiBox += "<td width =\"20%\"><span key=\""+fieldID+"\" class=\"paltform-i18n\">"
					+ fieldName
					+ "</span></td><td width=\"30%\"><input id=\""
					+ fieldID
					+ "\" name=\""
					+ fieldID
					+ "\" class=\"easyui-validatebox input_bg\" validType=\""+validatetype+"\""
			+ " maxlength=\""+fieldLength+"\"";
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			}
			uiBox +="/></td>";
			break;
		//大文本框
		case 'textarea':
			if(locationFlag % 2 != 0){
				locationFlag -=2;
				uiBox += "<td>&nbsp;</td><td>&nbsp;</td>";
			}else{
				locationFlag --;
			}
			uiBox +="</tr><tr>";
			uiBox += "<td width =\"20%\"><span>" + fieldName
				+ "</span></td><td width=\"70%\" colspan=\"3\"><textarea id=\""
				+ fieldID
				+ "\" name=\""
					+ fieldID
					+ "\" class=\"easyui-validatebox input_bg\" style=\"height:30px\" validType=\""+validatetype+"\" "
			 + " maxlength=\""+fieldLength+"\"";
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			}
			uiBox +="></textarea></td>";
			uiBox +="</tr><tr>";
			break;
		//数字框
		case 'number':
			uiBox += "<td width =\"20%\"><span key=\""+fieldID+"\" class=\"paltform-i18n\">" + fieldName
			+ "</span></td><td width=\"30%\"><input id=\""
			+ fieldID
			+ "\" name=\""
					+ fieldID
					+ "\"  class=\"easyui-validatebox input_bg\" validType=\"doubleNumber\" maxlength=\""+fieldLength+"\""			
				 + " validType=\""+validatetype+"\"";
			
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			}
			uiBox +="/></td>";
			break;
		//数字范围框
		case 'numberfromto':
			uiBox += "<td width =\"50%\" colspan=\"2\"><table width=\"100%\"><tr><td width=\"36%\"><span>"
				+ fieldName
				+ "</span></td><td width=\"23%\" style=\"padding-left:0em\"><input id=\""
				+ fieldID
				+ "\" name=\""
					+ fieldID
					+ "\"  class=\"easyui-validatebox input_bg\" validType=\"doubleNumber\" maxlength=\""+fieldLength+"\"/></td>" 
				 + " validType=\""+validatetype+"\""
			 + "<td width=\"14%\">"
				+ i18nTo
				+ "</td><td width=\"23%\" style=\"padding-right:0em\"><input id=\""
				+ fieldID+'1'
				+ "\" name=\""
					+ fieldID
					+ "1\"  class=\"easyui-validatebox input_bg\" validType=\"doubleNumber\" validType=\""+validatetype+"\" maxlength=\""+baseQuery[i].datalength+"\"/></td>" 
				+ "</tr></table></td>";
			break;
		//下拉框
		case 'combox':
			uiBox += "<td width =\"20%\"><span key=\""+fieldID+"\" class=\"paltform-i18n\">" + fieldName
			+ "</span></td><td width=\"30%\"><select id=\""
			+ fieldID
			+ "\" name=\""
					+ fieldID
					+ "\"  ";
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			}
			uiBox +="></select></td>";
			break;
		//多选下拉框
		case 'mutiplecombox':
			uiBox += "<td width =\"20%\"><span key=\""+fieldID+"\" class=\"paltform-i18n\">" + fieldName
			+ "</span></td><td width=\"30%\"><select id=\""
			+ fieldID
			+ "\" name=\""
					+ fieldID
					+ "\"  class=\"easyui-combobox\" data-options=\"multiple:true\" panelHeight=\"100px\"";
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			}
			uiBox +="></select></td>";
			break;	
		//时间框
		case 'time':
			uiBox += "<td width =\"20%\"><span key=\""+fieldID+"\" class=\"paltform-i18n\">"
					+ fieldName
					+ "</span></td><td width=\"30%\"><input id=\""
					+ fieldID
					+ "\" name=\""
					+ fieldID
					+ "\"  onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})\" class=\"easyui-validatebox Wdate input_bg\"";
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			 }
			 uiBox +="/></td>";
			break;
		//时间范围框
		case 'timerange':
			uiBox += "<td width =\"50%\" colspan=\"2\"><table width=\"100%\"><tr><td width=\"36%\"><span>"
					+ fieldName
					+ "</span></td><td width=\"23%\" style=\"padding-left:0em\"><input id=\""
					+ fieldID
					+ "\" name=\""
					+ fieldID
					+ "\"  onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})\" class=\"Wdate input_bg\"/></td>" 
					+ "<td width=\"14%\">"
					+ i18nTo
					+ "</td><td width=\"23%\" style=\"padding-right:0em\"><input id=\""
					+ fieldID+'1'
					+ "\" name=\""
					+ fieldID
					+"1\"  onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})\" class=\"Wdate input_bg\"/></td>" 
					+ "</tr></table></td>";
			break;
		//日期框
		case 'date':
			uiBox += "<td width =\"20%\"><span key=\""+fieldID+"\" class=\"paltform-i18n\">"
					+ fieldName
					+ "</span></td><td width=\"30%\"><input id=\""
					+ fieldID
					+ "\" name=\""
					+ fieldID
					+ "\"  onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"easyui-validatebox Wdate input_bg\"";
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			 }
			 uiBox +="/></td>";
			break;
		//日期范围框
		case 'daterange':
			uiBox += "<td width =\"50%\" colspan=\"2\"><table width=\"100%\"><tr><td width=\"36%\"><span>"
					+ fieldName
					+ "</span></td><td width=\"23%\" style=\"padding-left:0em\"><input id=\""
					+ fieldID
					+ "\" name=\""
					+ fieldID
					+ "\"  onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate input_bg\"/></td>" 
					+ "<td width=\"14%\">"
					+ i18nTo
					+ "</td><td width=\"23%\" style=\"padding-right:0em\"><input id=\""
					+ fieldID+'1'
					+ "\" name=\""
					+ fieldID
					+ "1\"  onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate input_bg\"/></td>" 
					+ "</tr></table></td>";
			break;
		//年月框
		case 'month':
			uiBox += "<td width =\"20%\"><span>"
				+ fieldName
				+ "</span></td><td width=\"30%\"><input id=\""
				+ fieldID
				+ "\" name=\""
					+ fieldID
					+ "\"  onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class=\"easyui-validatebox Wdate input_bg\"";
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			 }
			 uiBox +="/></td>";
			break;
			//年月范围选择框
		case 'monthrange':
			uiBox += "<td width =\"50%\" colspan=\"2\"><table width=\"100%\"><tr><td width=\"36%\"><span>"
				+ fieldName
				+ "</span></td><td width=\"23%\" style=\"padding-left:0em\"><input id=\""
				+ fieldID
				+ "\" name=\""
					+ fieldID
					+ "\"  onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class=\"Wdate input_bg\"/></td>" 
				+ "<td width=\"14%\">"
				+ i18nTo
				+ "</td><td width=\"23%\" style=\"padding-right:0em\"><input id=\""
				+ fieldID+'1'
				+ "\" name=\""
					+ fieldID
					+ "1\"  onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class=\"Wdate input_bg\"/></td>" 
				+ "</tr></table></td>";
			break;
		//年份框
		case 'year':
			uiBox += "<td width =\"20%\"><span>"
				+ fieldName
				+ "</span></td><td width=\"30%\"><input id=\""
				+ fieldID
				+ "\" name=\""
					+ fieldID
					+ "\"  onclick=\"WdatePicker({dateFmt:'yyyy'})\" class=\"easyui-validatebox Wdate input_bg\"";
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			 }
			 uiBox +="/></td>";
			break;
		//年份范围选择框
		case 'yearrange':
			uiBox += "<td width =\"50%\" colspan=\"2\"><table width=\"100%\"><tr><td width=\"36%\"><span>"
				+ fieldName
				+ "</span></td><td width=\"23%\" style=\"padding-left:0em\"><input id=\""
				+ fieldID
				+ "\" name=\""
					+ fieldID
					+ "\"  onclick=\"WdatePicker({dateFmt:'yyyy'})\" class=\"Wdate input_bg\"/></td>" 
				+ "<td width=\"14%\">"
				+ i18nTo
				+ "</td><td width=\"23%\" style=\"padding-right:0em\"><input id=\""
				+ fieldID+'1'
				+ "\" name=\""
					+ fieldID
					+ "1\"  onclick=\"WdatePicker({dateFmt:'yyyy'})\" class=\"Wdate input_bg\"/></td>" 
				+ "</tr></table></td>";
			break;
		//默认为text
		default:
			uiBox += "<td width =\"20%\"><span key=\""+fieldID+"\" class=\"paltform-i18n\">"
			+ fieldName
			+ "</span></td><td width=\"30%\"><input id=\""
			+ fieldID
			+ "\" name=\""
			+ fieldID
			+ "\" class=\"easyui-validatebox input_bg\" validType=\""+validatetype+"\""
			+ " maxlength=\""+fieldLength+"\"";
			if(fieldRequired==1){
				uiBox +=" required=\"true\"";
			}
			uiBox +="/></td>";
			break;
	}
	if (uiNum%2 != 0) {
		uiBox += "</tr>";
	}
	return uiBox;
}

/**
 * 
 * 方法描述：重新加载数据
 * 
 * @param url 网格所在页面url
 * @param elementId 网格id
 * 
 */
function reloadData(url, elementId){
    var fra= top.$("iframe");
    for(var i=0; i<fra.length;i++) {
	    if(fra[i].src.indexOf(url) != -1) {
		    fra[i].contentWindow.$('#'+elementId).datagrid("reload");
		    fra[i].contentWindow.$('#'+elementId).datagrid("clearSelections");
	    }
    }
}