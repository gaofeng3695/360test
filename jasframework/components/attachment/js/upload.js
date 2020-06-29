
var swfu;
var eventid = new Array();

$(document).ready(function() {
//	uploadtable();
});

function sumbitbus() {
	var busine = $("#businessid").val();
	if (eventid.length > 0) {
		var postUrl = rootPath
				+ "/upload/saveattachmentbusinessrelation.do?eventid="
				+ eventid + "&businessid=" + businessid;
		$.ajax({
			url : postUrl,
			success : function(result) {
				eventid = new Array();
			},
			async : false,
			error : function(result) {
			},
			dataType : "text"
		});
	}
}

function seteventid(id) {
	eventid.push(id);
}

function initswfupload() {
	if ($("#content")) {
		var swfHTML = "<form id=\"form1\"  method=\"post\" enctype=\"multipart/form-data\"><div class=\"fieldset true\" id=\"fsUploadProgress\"><span class=\"legend\">文件上传</span></div><div id=\"divMovieContainer\"><span id=\"spanButtonPlaceHolder\"></span><input type=\"button\" value=\"Start Upload\" onclick=\"swfu.startUpload();\" style=\"margin-left: 2px; font-size: 8pt; height: 29px;\" /></div></form>";
		$("#content").html(swfHTML);
	}
}

// 绑定表单的ajax事件
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
//			var flag=checkFileSize();
//			alert(flag);
//			return flag;
		},
		dataType : "json", // 返回值类型
		async : false
	// 是否异步提交
	});
}
function checkFileSize(obj){
	var flag=false;
	alert(1);
		$("#uploadform").ajaxSubmit({
			url : rootPath + '/upload/checkFileSize.do', // 文件上传路径
			type : "POST", // 提交方式
			success : function(result) {
				if (result.success=="0") {
					alert(result.msg);
					flag=false;
				}else{
					flag=true;
				}
			},
			dataType : "json", // 返回值类型
			async : false
		});
		return flag;
}

