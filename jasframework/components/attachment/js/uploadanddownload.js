var businessid = getParamter("eventid");
var downloaddata = "";
var html;
var htmlobject;
var fileamount = 0;
var fileeventid = new Array();
var callback1;
/*
 * 初始化显示 添加附件 按钮
 */
$(document).ready(function() {
	uploadanddownload();
});

function loaddata() {
	if (businessid == "" || businessid == null) {
		$.parser.parse($("#uploadanddownloadDIV"));
		return;
	}
	var postUrl = rootPath + "/attachment/getInfo.do?bussid=" + businessid;
	$.ajax({
		url : postUrl,
		success : function(result) {
			downloaddata = result;
		},
		async : false,
		dataType : "json",
		error : function() {
		}
	});
}
function tabledeletefile(eventid) {
	var postUrl = rootPath + "/upload/deletefile.do?eventids=" + eventid+"&iShiftDelFile="+isShiftDeleteAttachementFile;
	$.messager.confirm('删除附件', '您确定要删除选择的附件吗？\n\t', function(r) {
		if (r) {
			$.post(postUrl, function(result) {
				if (result) {
					alert("删除成功");
					$("#" + eventid).parent().parent().remove();
					fileamount--;
					if ("undefined" != typeof (fileoCount)) {
						if (fileamount < fileoCount) {
							$("#addfile").linkbutton('enable');
						}
					}
				} else {
					$.messager.alert('错误', '删除失败', 'error');
					return;
				}
			});
		}
	});
}

function downloadtable() {
	loaddata();
	var tableHTML = "";
	var qianHTML = "<tr><td><span key='attatchment_filename' class='paltform-i18n'>文件名</span></td><td><span key='attatchment_fileexplain' class='paltform-i18n'>文件说明</span></td><td><span key='attatchment_fileoperate' class='paltform-i18n'>文件操作</span></td>";
	tableHTML += qianHTML;
	var pinzhuang = "</tr><tr>";
	for ( var i = 0; i < downloaddata.length; i++) {
		tableHTML += pinzhuang;
		tableHTML += "<td>"
				+ downloaddata[i].filename
				+ "</td><td>"
				+ downloaddata[i].fileexplain
				+ "</td><td><a name=\"filedownload\" class=\"easyui-linkbutton\" iconCls=\"icon-download\" plain=\"true\" onclick=\"downloadFile('"+downloaddata[i].eventid+"')\"></a>&nbsp;&nbsp;<a href=\"#\" id=\""
				+ downloaddata[i].eventid
				+ "\" class=\"easyui-linkbutton\" iconCls=\"icon-cancel\" plain=\"true\" onclick=\"tabledeletefile(this.id)\" ></a>&nbsp;&nbsp;<a class=\"easyui-linkbutton\" iconCls=\"icon-view\" plain=\"true\" href=\"#\" onClick=\"Preview('"
				+ downloaddata[i].eventid + "')\"></a></td>";
	}
	;
	tableHTML += "</tr>";
	$("#downlisttable").html(tableHTML);
	$.parser.parse($("#uploadanddownloadDIV"));
	fileamount = downloaddata.length;
}

var annex = 1;

var upLoadTable;
function addTR() {
	if (upLoadTable == null) {
		upLoadTable = $("#downlisttable");
	}
	var length = upLoadTable.length;
	var oRow1 = $("<tr></tr>");
	var oCell1_2 = $("<td ></td>");
	var oCell1_4 = $("<td class=\"td_element\" ></td>");
	var oCell1_5 = $("<td class=\"td_text\"></td>");
	oRow1.append(oCell1_2);
	oRow1.append(oCell1_4);
	oRow1.append(oCell1_5);
	upLoadTable.append(oRow1);
	oCell1_2.id = "tdFile" + annex;
	html = "<input id='file"+annex+"' type='file' name='file" + annex
			+ "' class='fileInput' onChange='chkSize(this," + annex
			+ ")' onKeyDown='return false'  /> " ;
	htmlobject = $(html);
	$(oCell1_2).append(htmlobject);
	html = "<input type='text' class='input_bg' readOnly='true' class='text' id='desinfo"
			+ annex
			+ "' name='file"
			+ annex
			+ "desc' require='false' dataType='Limit' maxlength='200'  msg='附件描述必须在200个字之内'/>";
	htmlobject = $(html);
	$(oCell1_4).append(htmlobject);
	html = "<a id=\"button"
			+ annex
			+ "\" href=\"#\" iconCls=\"icon-cancel\" plain=\"true\" class=\"easyui-linkbutton\" onclick=\"deleteTR(this)\"></a>";
	htmlobject = $(html);
	$(oCell1_5).append(htmlobject);
	$.parser.parse($(oCell1_5));
	annex++;
	fileamount++;
	if ("undefined" != typeof (fileoCount)) {
		if (fileamount >= fileoCount) {
			$("#addfile").linkbutton('disable');
			$("#addfile").linkbutton('disable');// 解决linkbutton置灰还可以出发事件的bug
		}
	}
}

function chkSize(obj, id) {
	var ext = $(obj).val();
	if(ext.indexOf("*")!=-1){
		return;
	}
	var ss = ext.split('.');
	var strs = ext.split('\\');
	var exts = $("#exts").val();
	if (exts.indexOf(ss[ss.length - 1].toLowerCase()) == -1) {
		alert("您上传的文件不符合格式要求!");
		html = "<input type='file' class='input_bg' class='fileInput' name='file"
				+ id
				+ "' onChange='chkSize(this,"
				+ id
				+ ")' onKeyDown='return false'/>";
		$(obj).parent().html(html);
		$('#desinfo' + id).attr("readonly", "readonly");
	} else if (strs[strs.length - 1].length > 50) {
		alert("文件名不能超过50个字！", 2);
		html = "<input type='file' class='input_bg' name='file" + id
				+ "' onChange='chkSize(this," + id
				+ ")' onKeyDown='return false'/>";
		$(obj).parent().html(html);
		$('#desinfo' + id).attr("readonly", "readonly");
	} else {
		$('#desinfo' + id).removeAttr("readonly");
//		$('#uploadform').form('submit', {
//			url : rootPath + '/upload/checkFileSize.do', // 文件上传路径
//			onSubmit : function() {
//				return $(this).form('validate');
//			},
//			success : function(data) {
//				var result = eval('(' + data + ')');
//				if (result.success=="0") {
//					$("#10060106").linkbutton('disable');
//					alert(result.msg);
//				}else{
//					$("#10060106").linkbutton('enable');
//				}
//			}
//		});
		checkFileSize(id);
	}
}
function checkFileSize(id){
	var url=rootPath + 'upload/checkFileSize.do';
	$('#uploadform').ajaxSubmit({
		url :url, // 文件上传路径
		type : "POST", // 提交方式
		success : function(result) {
			if (result.success=="0") {
				$("#10060106").linkbutton('disable');
				alert(result.msg);
			}else{
				$("#10060106").linkbutton('enable');
			}
		},error:function(result){
			alert(2);
			alert(result.msg);
		},
		dataType : "json", // 返回值类型
		async : false
	// 是否异步提交
	});
}

function deleteTR(obj) {
	var rowIndex = $(obj).parent().parent();
	if (rowIndex) {
		rowIndex.remove();
		fileamount--;
		if ("undefined" != typeof (fileoCount)) {
			if (fileamount < fileoCount) {
				$("#addfile").linkbutton('enable');
			}
		}
	}
}

function uploadfile(callback) {
//	alert(callback)
//	callback1=callback;
//	 top.getDlg(getRootPath()+"/jasframework/components/attachment/uploadstatic.htm?r="+new Date().getTime(),"saveiframe","上传进度",700,220,true);
//	diplayUploadStatic(callback);
//     $('#uploadform').ajaxSubmit({

        $('#uploadform').form("submit",{
		url : rootPath + "/attachment/upload.do?businessId="+businessid,
		type : "POST", // 提交方式
		success : function(id) {
//			top.$.messager.progress("close");
//			id = eval(id);
//			fileeventid.push(id);
//			sumbitbus();
			if (callback) {
				callback();
			}
		}
	});
}


function sumbitbus() {
	if (fileeventid.length > 0) {
		var postUrl = rootPath
				+ "/upload/saveattachmentbusinessrelation.do?eventid="
				+ fileeventid + "&businessid=" + businessid;
		$.ajax({
			url : postUrl,
			success : function(result) {
				fileeventid = new Array();
				downloadtable();
			},
			async : false,
			error : function() {
			},
			dataType : "text"
		});
	}
}

function uploadanddownload() {
	var filediv = $("#uploadanddownloadDIV");
	if (filediv.length == 1) {
		var formAndTable = "<a id=\"addfile\" href=\"#\" class=\"easyui-linkbutton\" iconCls=\"icon-ok\" onclick=\"addTR()\"><span key='attatchment_addfile' class='paltform-i18n'>添加附件</span></a> <form class=\"uploadform\" id=\"uploadform\" enctype=\"MULTIPART/FORM-DATA\" method=\"post\"> <table id=\"downlisttable\" style=\"text-align:center;\" class=\"attmenttable\"> </table> </form>";
		filediv.html(formAndTable);
		downloadtable();
	}
}

/**
 * 方法描述： 预览
 * 
 */
function Preview(eventid) {
				var url = rootPath
				+ "/jasframework/common/thirdparty/FlexPaper/index.html?eventid="
				+ eventid + "&r=" + new Date().getTime();
				top.getDlg(url, "viewiframe" + eventid, "预览", 800, 550);
}
var timer;
function diplayUploadStatic(callback){
//	top.$.messager.progress();
	top.$.messager.progress({
		title:"上传中。。。",
		msg:"请等待",
		interval:0
	});
	timer=setInterval(function(){
		getUploadStatic(callback);
	},500);
}

function getUploadStatic(callback){
	   $.ajax({ 
	    	url: rootPath+"/upload/getuploadStatic.do", 
	    	dataType: "json", 
	    	async:true,
	    	success: function(data){
	    		var uploadstatic=data.uploadstatic; 
	    		var topbar=top.$.messager.progress("bar");
	    		topbar.progressbar('setValue', uploadstatic.percentage); 
	    		if(uploadstatic.percentage==100){
	    			clearInterval(timer);
	    			top.$.messager.progress("close");
//	    			showLoadingMessage("请等待");
	    			callback();
	    		}
	    	}
	    });
}
function uploadtable() {
	$('#uploadform').ajaxForm({
		url : rootPath + '/upload/fileupload.do', // 文件上传路径
		type : "POST", // 提交方式
		success : function(result) {
//			eventid.push(id);
////			sumbitbus();
//			// 获取上传后的文件eventid
//			alert("上传成功");
//			parent.$('#dlg').dialog('close');
			if (result.success=="0") {
//				$("#10060106").linkbutton('disable');
				alert(result.msg);
			}else{
//				$("#10060106").linkbutton('enable');
			}
		},beforeSubmit:function(){
			var flag=checkFileSize();
			alert(flag);
			return flag;
		},
		dataType : "json", // 返回值类型
		async : false
	// 是否异步提交
	});
}
function downloadFile(id){
	alert(id);
	var url=rootPath+"/upload/download.do?oid="+id+'&token='+localStorage.getItem("token");
	$("<iframe id=\"fileDownload\" style=\"display: none;\"></iframe>").appendTo("body");
//	var url="../doccenter/downloadDoc.do?docId="+docId;
	$("#fileDownload").attr("src",url);
}
