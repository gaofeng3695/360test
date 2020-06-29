//var businessid = getParamter("eventid");
var downloaddata;
/**
 * 
 */
//$(document).ready(function() {
//	filedownload(getParamter("eventid"));
//});


function loaddata(businessId) {
	if (businessId == "" || businessId == null) {
		return;
	}
	var postUrl = rootPath + "/attachment/getInfo.do?businessId=" + businessId + "&businessType=pic";
	$.ajax({
		url : postUrl,
		async : false,
		dataType : "json",
		success : function(result) {
			downloaddata = result;
		},
		error : function() {
		}
	});
}

function downloadtable(businessId) {
	loaddata(businessId);
	var tableHTML = "";
	var qianHTML = "<tr><td><span key='attatchment_filename' class='paltform-i18n'>文件名</span></td><td><span key='attatchment_fileexplain' class='paltform-i18n'>文件说明</span></td><td><span key='attatchment_fileoperate' class='paltform-i18n'>文件操作</span></td>";
	  tableHTML += qianHTML;
	var pinzhuang = "</tr><tr>";
//	alert(downloaddata)
	for ( var i = 0; i < downloaddata.length; i++) {
		tableHTML += pinzhuang;
		tableHTML += "<td>"
				+ downloaddata[i].filename
				+ "</td><td>"
				+ downloaddata[i].fileexplain
				+ "</td><td><a class=\"easyui-linkbutton\" iconCls=\"icon-download\" plain=\"true\" href=\""
				+ rootPath
				+ "/upload/download.do?oid="
				+ downloaddata[i].eventid
				+'&token='+localStorage.getItem("token")
				+ "\"></a>"
				+ "<a class=\"easyui-linkbutton\" iconCls=\"icon-view\" plain=\"true\" href=\"#\" onClick=\"Preview('"
				+ downloaddata[i].eventid + "')\"></a></td>";
	}
	tableHTML += "</tr>";
	$("#downlisttable").html(tableHTML);
	$.parser.parse($("#downloadDIV"));
}

function filedownload(businessId) {
	var filediv = $("#downloadDIV");
	if (filediv.length == 1) {
		var formAndTable = "<table id=\"downlisttable\" class=\"attmenttable\"> </table>";
		filediv.html(formAndTable);
		downloadtable(businessId);
	}
}

/**
 * 方法描述： 预览
 * 
 */
function Preview(eventid) {
	var url = rootPath + "common/lib/FlexPaper/index.html?eventid="
	+ eventid + "&r=" + new Date().getTime();
	top.getDlg(url, "viewiframe" + eventid, "预览", 800, 550);
}
