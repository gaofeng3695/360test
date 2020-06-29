/** 
 * @file
 * @author  lujingrui
 * @desc home页面初始化执行代码
 * @version 1.0
 * @date  2017-10-30 上午8:46:07
 * @last modified by lujingrui
 * @last modified time  2017-08-17
 */


//获得当前登录用户
var currentUser="",
userName = "",
userId = "",
token = "",
clientIp = "",
currentLanguage = "";

$(document).ready(function () {
	currentUser=getParamter('userName');
	userName = decodeURI(getParamter('name'));
	userId = getParamter('userId');
	token = getParamter("token");
	clientIp = getParamter('clientIp');
	currentLanguage = getParamter("i18n");
	$("#userName").html(userName);
	
	//获取项目子权限
	getUserPrivilege();
	
	//在右下角弹出待办工作提示信息，及当前登录用户存在的信息
//	showToDoWorkInfo();
	
	//在右下角弹出当前登录用户的登录信息
//	showUserLoginInfo();

	addEvents();
	
});

function addEvents(){
	$(window).resize(function(){
	/*	$(".pipeline").height($(".section").height()>$("#outerCenter").height()-20?$(".section").height():$("#outerCenter").height()-20);*/
		if($("#shield")){
			$("#shield").width($("#outerCenter").width());
			$("#shield").height($("#outerCenter").height());
			$(".pipeline-cus").height($(".section-cus").height()>$("#outerCenter").height()-20?$(".section-cus").height():$("#outerCenter").height()-20);
		}
	});
	
	// 头部工具栏的选中处理
	$(".top-toolbar .manage-toolbar").on("click","li",function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});
	//点击项目子节点，跳转节点权限
	$("#systemSection").on("click",".btn",function(){
		var obj = $(this).parent();
		var projectOid = obj.data("value");
		var projectName=obj.find(".title").html();
		var privilegeId = $(this).data("value");
		changeProject(privilegeId,projectOid,projectName);
	});
}

/**
 * 切换项目
 * @param projectOid
 * @param projectName
 * @returns
 */
function changeProject(privilegeId,projectOid,projectName){
	var status;
	var json = JSON.stringify({"projectOid":projectOid,"projectName":projectName});
	$.ajax({
	   url: rootPath+"/jasframework/login/changeProject.do",
	   type: "post",
	   contentType: "application/json;charset=utf-8",
	   dataType: "json",
	   data:json,//获取表单中的json,
	   success: function(data){
		   status = data.status;
		   if(status == 1){
//			   location.assign();
			   var user = JSON.parse(localStorage.getItem("user"));
			   user.projectOid = projectOid;
			   user.projectName = projectName;
			   if(data.data){
				   user.proOrgOid = data.data.proOrgOid;
				   user.proOrgName = data.data.proOrgName;
				   user.proOrgTypeCode = data.data.proOrgTypeCode;
				   user.proOrgTypeName = data.data.proOrgTypeName;
			   }
			   
			   localStorage.setItem("user",JSON.stringify(user));
			   sessionStorage.setItem("user",JSON.stringify(user));
			   window.location.href = './home.htm?privilegeId='+privilegeId+'&userName=' + currentUser + "&token="+ token+"&name="+getParamter('name')+"&projectOid="+projectOid+"&projectName="+encodeURI(projectName)+"&i18n="+currentLanguage;
		   }else{
			   top.showAlert('项目切换失败', data.msg, 'info');
		   }
	   },
	   error : function(data) {
		   status = 0;
		}
	});
	return status;
}

/**
 * 保存个性化定制
 * @param data
 * @returns
 */
function saveCustom(data){
	$.ajax({
		url : rootPath+"jasframework/privilege/privilege/addCustom.do",
		method : "POST",
		contentType: "application/json;charset=utf-8",
		data : JSON.stringify({
			userOid : userId, 
			customList : data
		}),
		dataType : "json",
		success : function(res) {
			if(res.status == 1){
				getUserPrivilege();
				showAlert('提示','保存成功' , 'info',function(){
					$("#shield").remove();
					$(".manage-toolbar li").removeClass("active");
				});
			}else{
				$("#saveButton").attr('disabled',false);
				showAlert('提示','保存失败' , 'error');
			}
		}
	});
}

/**
 * @desc 获取用户的项目
 * @returns Userbo的json对象
 */
function getUserPrivilege(){
	$.ajax({
	   url: rootPath+"jasframework/privilege/unit/getProject.do?appnumber=1",
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
				var str ='';
				var rows = data.data;
				var imgName = "1017";
				for(var i=0;i<rows.length;i++){
					var childrenList = rows[i].children;
					if(childrenList.length>0){
						str+=' <fieldset data-value='+rows[i].OID+'><legend class="title">'+ rows[i].NAME +'</legend>';
						for(var j=0;j<childrenList.length;j++){
							imgName = childrenList[j].privilegeNumber ? childrenList[j].privilegeNumber : imgName;
							str += '<dl class="btn" data-value='+childrenList[j].eventid+'><dt><img src="./image/navigator/'+ imgName +'.png"></dt><dd>'+childrenList[j].name+'</dd></dl>';
						}
						str +='</fieldset>';
					}
				}
				$("#systemSection").html(str);
			}else{
				
			}
	   },
	});
}

/**
 * 点击自定义桌面触发事件
 * @returns
 */
function customMenu(obj){
	if(!$(obj).parent().hasClass("active")){
		createMask();
		getUserPrivilegeForChose();
	}
}

/**
 * 切换到home页面
 * @returns
 */
function changeToHome(){
	window.location.href = "../por/portal/portal.html?userName=" + currentUser+"&token="+ token+"&name="+encodeURI(userName)+"&userId="+userId+"&i18n="+currentLanguage;
}

/**
 * @desc 获取用户所有的项目（用于选择）
 * @returns Userbo的json对象
 */
function getUserPrivilegeForChose(){
	$.ajax({
	   url: rootPath+"jasframework/privilege/unit/getProject.do?appnumber=1&queryType=1",
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
				var str ='';
				var rows = data.data;
				var hasMenuObj = {};
				var imgName = "1017";
				$("#systemSection").find(".title").each(function(){
					var hasMenu = "";
					$(this).parent().find(".btn").each(function(){
						hasMenu += $(this).data("value")+",";
					});
					hasMenuObj[$(this).parent().data("value")] = hasMenu;
				});
				var checkValue = "checked";
				for(var i=0;i<rows.length;i++){
					var childrenList = rows[i].children;
					if(childrenList.length>0){
						var hasMenuStr = hasMenuObj[rows[i].OID];
						str+=' <fieldset data-value='+rows[i].OID+'><legend class="title">'+ rows[i].NAME +'</legend>';
						for(var j=0;j<childrenList.length;j++){
							imgName = childrenList[j].privilegeNumber ? childrenList[j].privilegeNumber : imgName;
							if(hasMenuStr && hasMenuStr.indexOf(childrenList[j].eventid) > -1){
								str += '<dl class="btn menu-position checked" data-value='+childrenList[j].eventid+'><dt><img src="./image/navigator/'+ imgName +'.png"></dt><dd>'+childrenList[j].name+'</dd></dl>';
							}else{
								str += '<dl class="btn menu-position" data-value='+childrenList[j].eventid+'><dt><img src="./image/navigator/'+ imgName +'.png"></dt><dd>'+childrenList[j].name+'</dd></dl>';
							}
						}
						str +='</fieldset>';
					}
				}
				$("#sectionCustom").html(str);
				
				/*$(".pipeline-cus").height($(".section-cus").height()>$("#outerCenter").height()-20?$(".section-cus").height()-32:$("#outerCenter").height()-20-32);*/
				
				//点击保存
				$("#saveButton").off("click");
				$("#saveButton").click(function(){
					$("#saveButton").attr('disabled',true);
					var retuenData = [];
					$(".section-cus").find(".title").each(function(index){
						var projectOid = $(this).parent().data("value");
						$(this).parent().find(".btn.checked").each(function(index){
							var entity = {"userOid":userId,"projectOid":projectOid,"privilegeOid":$(this).data("value")}
							retuenData.push(entity);
						});
					});
					if(retuenData.length == 0){
						showAlert("提示", "您未选择任何数据", 'info');
						$("#saveButton").attr('disabled',false);
						return;
					}
					saveCustom(retuenData);
					
				});
				//点击取消
				$("#cancelButton").off("click");
				$("#cancelButton").click(function(){
					$("#shield").remove();
					$(".manage-toolbar li").removeClass("active");
				});
			}
	   },
	});
}

/**
 * 为自定义桌面添加遮罩层
 * @returns
 */
function createMask() {
   /* //创建背景 
    var domStr = '<div id="shield" class="shield"> ' +
					'<div class="save-area">'+
						'<button id="cancelButton" class="custom-btn">取消</button>'+
						'<button id="saveButton" class="custom-btn">保存</button>'+
				    '</div>'+
				 '</div>';
						
    $(domStr).appendTo($("#outerCenter"));

	//点击项目子节点,切换选中状态
	$("#systemSection").on("click",".btn",function(e){
		e.stopPropagation();
		$(this).toggleClass("checked");
	});*/
	
	 //创建背景 
    var shieldStyle = "width:" + $("#outerCenter").css("width")+ ";height:" + $("#outerCenter").css("height") + ";";
    var domStr = '<div id="shield" class="system-section shield" style=\"' + shieldStyle + '\">'+
					'<div class="section section-cus" id="sectionCustom">'+
					'</div>'+
					'<div class="save-area">'+
						'<button id="saveButton" class="custom-btn save-btn">保存</button>'+
						'<button id="cancelButton" class="custom-btn cancel-btn">取消</button>'+
				    '</div>'+
				 '</div>';
						
    $(domStr).appendTo("body");
    
  //点击项目子节点,切换选中状态
	$("#sectionCustom").on("click",".btn",function(e){
		$(this).toggleClass("checked");
	});

}

/**
 * @desc  在右下角弹出待办工作提示信息
 */
function showToDoWorkInfo(){
	//弹出待办工作提示框
	$.post(rootPath+"jasframework/workflow/workTotal.do",function(result){
			var data=result.total;
			$.messager.show({
				title:'系统提示',
				msg:"<b>"+currentUser+"</b>,你好!"+"您有<font color='red'><b>"+data+"</b></font>个待办工作",
				timeout:5000
			});		
	},'json');
}

/**
 * @desc  获取用户的登陆信息
 */
function showUserLoginInfo(){
	$.post(rootPath+"jasframework/loginLog/getStatisticsInfoByUserId.do",function(result){
		var msg = "";
		if(result!=null){
			var userName =  result.userName;
			var userLoginName =  result.loginName;
			var loginNumber =  result.loginNumber;
			var totalLoginDate = result.totalLoginDate;
			var clientIp = result.clientIp;
			var lastLoginDateStr = result.lastLoginDateStr;
			msg = "<span style=\"line-height:20px;\"><b><font color='red'>"+userName+"</font></b>,您好!您：<br/>"+
			"登录次数：<font color='red'>"+loginNumber+"</font><br/>"+
			"累计在线时长为：<font color='red'>"+totalLoginDate+"</font><br/>"+
			"上次登录ip为：<font color='red'>"+clientIp+"</font><br/>"+
			"上次登录时间为：<font color='red'>"+lastLoginDateStr+"</font><br/></span>";
		}else{
			msg = "<span style=\"line-height:20px;\"><b><font color='red'>"+"欢迎使用系统！"+"</font><br/></span>";
		}
		$.messager.show({
			title:'系统提示',
			width:300,
			height:170,
			msg:msg,
			timeout:500000
		});
	},'json');
}

/** 
 *  @desc 弹出信息
 *  @param title 弹出信息窗口title
 *  @param msg 弹出信息
 *  @param showType 弹出窗口类型（show,slide,fade）
 *  @param timeout 延迟弹出的时间(不带时间参数默认为60秒)
 */
function showMessage(title,msg,showType,timeout){
	if(typeof timeout == 'undefined'){
		timeout =600000;
	}
	$.messager.show({
		title:title,
		msg:msg,
		timeout:timeout,
		showType:showType
	});
}

