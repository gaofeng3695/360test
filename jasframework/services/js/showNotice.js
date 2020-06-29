
//OA更新动态公告
function queryTopNotice(){
	$("#notice").empty();
	$("#notice").append("<tr height='40px' valign='bottom'><td align='center' style='color:#1254a8;font-size: 20px;font-weight: bold;'>"+top.notice.title+"</td></tr>")
	.append("<tr><td align='right' style='margin-right:10px;color:#ff0000;'>"+top.notice.publishTime+"</td></tr>")
	.append("<tr height='40px'><td>"+top.notice.content+"</td></tr>");
	showCount();
}

//OA注意事项
function queryTopQuestion(){
	$.getJSON(rootPath+"/notice/queryNoticePage.do",{"page":1,"rows":1,"status":1},function(data){
		$("#notice").empty();
		$.each(data.rows,function(i,value){
			$("#notice").append("<tr height='40px'><td>"+value.content+"</td></tr>");
					
		});
	});
}

/**
 * 获取登录用户所有的公告（已读、未读）
 */
function queryAllNotice(){
	$.getJSON(rootPath+"/notice/getNoticeUserList.do",function(data){
		$("#notice").empty();
		$("#notice").append("<tr height='25px'><td width='75%' class='line' style='padding-left:10px;color:#e76a00;'>主题</td><td width='25%' class='line' style='color:#e76a00'>发布时间</td></tr>");
		$.each(data,function(i,value){
			//公告未阅读
			if(value.readStatus==0){
				$("#notice").append("<tr height='26px'><td align='left'><img id=img"+value.eventId+" alt='' src='../jasframework/common/image/unread.gif' width='20px' height='20px'>"+
						"<a href='#'  class='font' style='cursor:hand;font-weight:bold;' id="+value.eventId+" onclick='showDetail(this.id)'>"+value.title+"</a></td>"+
						"<td style='color:#ff0000'>"+value.publishTime+"</td></tr>");
			}else{
				$("#notice").append("<tr height='26px'><td align='left'><img  alt='' src='../jasframework/common/image/read.gif' width='20px' height='20px'>"+
						"<a href='#' class='font' style='cursor:hand;' id="+value.eventId+" onclick='showDetail(this.id)'>"+value.title+"</a></td>"+
						"<td style='color:#ff0000'>"+value.publishTime+"</td></tr>");
			}
		});
	});
}

function showDetail(eventId){
	var diag = new Dialog();
	diag.Width = 800;
	diag.Height = 600;
	diag.Title = "详细信息";
//	diag.CancelEvent=function(){alert("点击取消或关闭按钮时执行方法");diag.close();};
	diag.URL = "showDetail.html?eventId="+eventId;
	diag.show();
	$("#"+eventId).css("font-weight","normal");
	$("#img"+eventId).attr("src","../jasframework/common/image/read.gif");
	$.getJSON(rootPath+"/notice/updateNoticeUserRef.do",{"noticeId":eventId},function(result){
	});
}


//查看详细信息
function showDetailNotice(){
	var eventId=getParamter("eventId");
	$.getJSON(rootPath+"/notice/getNoticeById.do",{"eventId":eventId},function(data){
		$("#notice").empty();
			$("#notice").append("<tr height='40px' valign='bottom'><td align='center' style='color:#1254a8;font-size: 20px;font-weight: bold;'>"+data.title+"</td></tr>")
			.append("<tr><td align='right' style='margin-right:10px;color:#ff0000;'>"+data.publishTime+"</td></tr>")
			.append("<tr height='40px'><td>"+data.content+"</td></tr>");
	});
}
//onclick='addNewTab('oa','OA公告','../../notice/showAllNotice.html',true)'
function showCount(){
	$.getJSON(rootPath+"/notice/getUnreadCount.do",function(data){
		if(data>0){
			$("#showCount").append("<span style='color: #1f67c8;'>温馨提示：您还有"+(data)+"条未读通告</span>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='showAll()' class='red'>>>更多</a>");
		}
	});
}

function showAll(){
	top.tab.openTab('showAllNotice', "通知公告", "../../notice/showAllNotice.html", true,true);
	top.diag.close();
}
