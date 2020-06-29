/**
 * 
 * 文件描述: 根据业务数据生成查看页面。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-12-30 上午17:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-01-10      修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */
var businessid;
//修改时的附件信息
var downloaddata="";
var html;
var htmlobject;
var fileeventid=new Array();
var exts;
var configuration;
/**
 * 方法描述：查看页面加载附件网格
 * @param configuration 网格列国际化信息
 * @param businessid 业务id
 */
function loadDataForDetail(configuration,businessid){
	var postUrl=rootPath+"/upload/downlist.do?bussid="+businessid+"&dataSourceName"+configuration.dataSourceName;
	$.ajax({
		url:postUrl,
		success:function(result){
			var table =$("<table id=\"downlisttable\" width=\"100%\" class=\"attmenttable\"></table>").appendTo($("#uploadanddownloadDIV"));
			var title="<tr><td width=\"33%\">"+configuration.i18related.filename+"</td><td width=\"33%\">"+configuration.i18related.fileexplain+"</td><td width=\"33%\">"+configuration.i18related.filefunction+"</td>";
			for(var i=0;i<result.length;i++){
				title+="<tr><td>"+result[i].filename+"</td><td>"+result[i].fileexplain+"</td><td><a name=\"filedownload\" iconCls=\"icon-download\" plain=\"true\" class=\"easyui-linkbutton\" href=\""+rootPath+"/upload/download.do?eventid="+result[i].eventid+"\"></a></td></td>";
			};
			table.html(title);
			$.parser.parse($("#uploadanddownloadDIV"));
		},
		async: false,
		dataType:"json",
		error:function(){
		}
	});
}
/**
 * 方法描述：根据业务id获得所有附件
 */
function loaddata(){
	if(businessid==""||businessid==null){
	 $.parser.parse($("#uploadanddownloadDIV"));
		return;
	}
	var postUrl=rootPath+"/upload/downlist.do?bussid="+businessid+"&dataSourceName"+configuration.dataSourceName;
	$.ajax({
		url:postUrl,
		success:function(result){
			downloaddata= result;
		},
		async: false,
		dataType:"json",
		error:function(){
		}
	});
}
/**
 * 方法描述：根据附件id删除附件
 * @param eventid 附件id
 */
function tabledeletefile(eventid){
	var postUrl = rootPath+"/upload/deletefile.do?eventids="+eventid+"&dataSourceName"+configuration.dataSourceName;
	$.messager.confirm('删除附件','您确定要删除选择的附件吗？\n\t',function(r){
	if (r){
		$.post(postUrl,function(result){
			if (result){
				top.showAlert('提示',"删除成功",'info');
				downloadtable(configuration);
			} else {
				top.showAlert('错误','删除失败','error');
				return;
			}
		});
	}});
}
/**
 * 方法描述：加载附件信息
 */
function downloadtable(){
	loaddata();
	var tableHTML="";
	var qianHTML="<tr><td width=\"33%\">"+configuration.i18related.filename+"</td><td width=\"33%\">"+configuration.i18related.fileexplain+"</td><td width=\"33%\">"+configuration.i18related.filefunction+"</td>";
	tableHTML+=qianHTML;
	var pinzhuang="</tr><tr>";
	for(var i=0;i<downloaddata.length;i++){
		tableHTML+=pinzhuang;
		tableHTML+="<td>"+downloaddata[i].filename+"</td><td>"+downloaddata[i].fileexplain+"</td><td><a name=\"filedownload\" class=\"easyui-linkbutton\" iconCls=\"icon-download\" plain=\"true\"  href=\""+rootPath+"/upload/download.do?eventid="+downloaddata[i].eventid+"\"></a>&nbsp;&nbsp;<a href=\"#\" id=\""+downloaddata[i].eventid+"\" class=\"easyui-linkbutton\" iconCls=\"icon-cancel\" plain=\"true\" onclick=\"tabledeletefile(this.id)\"></a></td>";
	};
	tableHTML+="</tr>";
	$("#downlisttable").html(tableHTML);
	$.parser.parse($("#uploadanddownloadDIV"));
}
var annex=1;
var upLoadTable ;
/**
 * 方法描述：新增一行附件
 */
function addTR(){
	if(upLoadTable==null){
		upLoadTable=$("#downlisttable");
	}
	var oRow1 =$("<tr></tr>");
	var oCell1_2 = $("<td class=\"td_element\"></td>");
	var oCell1_4 = $("<td class=\"td_element\" ></td>");
	var oCell1_5 = $("<td class=\"td_text\"></td>");
	oRow1.append(oCell1_2);
	oRow1.append(oCell1_4);
	oRow1.append(oCell1_5);
	upLoadTable.append(oRow1);
	oCell1_2.id = "tdFile" + annex;
	html= "<input id='file' type='file' name='file" + annex + "' class='fileInput' onChange='chkSize(this," + annex + ")' onKeyDown='return false'/>";
	htmlobject=$(html);
	$(oCell1_2).append(htmlobject);
	html="<input type='text' class='input_bg' readOnly='true' class='text' id='desinfo" + annex + "' name='file"+annex+"desc' require='false' dataType='Limit' max='250'  msg='附件描述必须在250个字之内'/>";
	htmlobject=$(html);
	$(oCell1_4).append(htmlobject);
	html="<a id=\"button"+annex+"\" href=\"#\" iconCls=\"icon-cancel\" plain=\"true\" class=\"easyui-linkbutton\" onclick=\"deleteTR(this)\"></a>";
	htmlobject=$(html);
	$(oCell1_5).append(htmlobject);
	 $.parser.parse($(oCell1_5));
	annex++;
}
function chkSize (obj,id) {
	var ext = obj.value;
	var ss = ext.split('.');
	var strs = ext.split('\\');
	if (exts.indexOf(ss[ss.length - 1].toLowerCase()) == -1) {
		$.messager.alert('提示', '您上传的文件不符合格式要求!', 'info');
		html= "<input type='file' class='input_bg' name='file" + id + "' onChange='chkSize(this," + id + ")' onKeyDown='return false'/>";
		$("#tdFile"+id).html(html);
		document.getElementById('desinfo' + id).readOnly = true; 
	}else if(strs[strs.length - 1].length > 50){
		parentIndex.showMessageBox("文件名不能超过50个字！", 2);
		document.getElementById('tdFile'+id).innerHTML="<input type='file' class='input_bg' name='file" + id + "' onChange='chkSize(this," + id + ")' onKeyDown='return false'/>";
		document.getElementById('desinfo' + id).readOnly = true; 
	}else {
		document.getElementById('desinfo' + id).readOnly = false; 
	}
}
/**
 * 方法描述：删除一行
 * @param obj
 */
function deleteTR(obj) {
	var rowIndex = $(obj).parent().parent();
	if (rowIndex){
		rowIndex.remove();
	}
}
function setNumber() {
	var num = 0;
	var table = upLoadTable;
}
/**
 * 方法描述：加载附件信息。
 * @param updateconfiguration
 */
function uploadanddownload(updateconfiguration){
	exts =$("#exts").val();
	var filediv=$("#uploadanddownloadDIV");
	if(filediv){
		var formAndTable="<div style=\"padding-right:20px;text-align: right;\"><a id=\"addfile\" href=\"#\" class=\"easyui-linkbutton\" iconCls=\"icon-ok\" onclick=\"addTR()\">"+updateconfiguration.i18related.attchmentName+"</a></div><table id=\"downlisttable\" class=\"attmenttable\"></table>";
		filediv.html(formAndTable);
		configuration=updateconfiguration;
		 downloadtable(updateconfiguration);
	}
}
