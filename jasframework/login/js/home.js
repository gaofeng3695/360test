/** 
 * @file
 * @author  zhanggf
 * @desc home页面初始化执行代码
 * @version 1.0
 * @date  2012-10-30 上午8:46:07
 * @last modified by lizz
 * @last modified time  2017-08-17
 */

//实例左边菜单树
var functionMenu = new $.jasframeworkFunctionMenu();
//实例tab页签
var tab = new $.jasframeworkTab();

//获得当前登录用户
var currentUser = getParamter('loginName');
var token = getParamter("token");
var userName = decodeURI(getParamter('userName'));
var userId = getParamter('userId');
var currentPageLayout = defaultPageLayout;
var currentLanguage = getParamter("i18n");
var projectOid = getParamter("projectOid");

if(currentLanguage){
	language=currentLanguage;
}
var clientIp = getParamter('clientIp');

$(document).ready(function () {
	$("#userName").html(userName);
	//初始化页面
	initPage();
	
	//获取地图权限
	/*loadMapPrivilege();*/

	//业务系统全局变量加载测试
	//loadScriptForOperationSystem('js/test.js');
	
	//tab页签右键监听
	initTabsBind();
	
	
	// 执行文字滚动
	var myvar=setInterval(Marquee,50);
	  $("#hintInfo").on('mouseout',function(){
		  myvar=setInterval(Marquee,50);
	  }).on("mouseover",function(){
		  clearInterval(myvar);
	  })


	// 执行指定时间发送请求获取系统消息
	var systemInfo = setInterval(function(){
		 initSystemInfo()
	},1000*60*5);

	// 首次执行
	 initSystemInfo();

	
	//在右下角弹出待办工作提示信息，及当前登录用户存在的信息
//	showToDoWorkInfo();
	
	//在右下角弹出当前登录用户的登录信息
	showUserLoginInfo();

	// 设置功能展示区域的宽高
	$("#outerCenter .center-content-area").each(function(index){
		
		var tabHeight = $(this).parent().height();
		var tabWidth = $(this).parent().width();
		
		var tabTitleHeight = $(this).parent().find('ul').height();
		var tabContentHeight = (tabHeight-tabTitleHeight) > 0 ? (tabHeight-tabTitleHeight-2) : 1;

		$(this).css('height',tabContentHeight);
		$(this).css('width',tabWidth);

	});

    // 头部工具栏的选中处理
	$(".top-toolbar .manage-toolbar").on("click","li",function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});
//	$(".top-toolbar .person-toolbar").on("click","li",function(){
//		$(this).siblings().removeClass("active");
//		$(this).addClass("active");
//	});

	// 关闭地图按钮
	$("#closeMap").click(function(){
//		innerLayout.close('north');
//		isHasOpen2d = false;
		tab.delMapTab('2d');
	});
	
	// 地图最大化和还原
	$("#maxMap").click(function(){
		openMaxMin2DMap();
	});
	
	//项目初始化
//	initProject();
//	var projectOid = getParamter("projectOid");
//	var projectName = getParamter("projectName");
//	changeProject(projectOid,projectName);
	
	//获取标段id
	getScopeIdList();
});

// 浏览器关闭或者页面跳转到其他网页是，退出系统，（通过给页面绑定beforeunload事件来解决）
$(window).bind("load", function(){
	$(window).bind("beforeunload", function(){
//		login_out();
	});
});

/**
 * 跳转到主页
 * @returns
 */
function changeToHome(){
	window.location = "../por/portal/portal.html?userName=" + currentUser+"&token="+ token+"&name="+encodeURI(userName)+"&userId="+userId;
}

/**
 * 跳转到工作桌面
 * @returns
 */
function changeToWork(){
	window.location = 'navigator.html?userName=' + currentUser+"&token="+ token+"&name="+encodeURI(userName)+"&userId="+userId+"&i18n="+currentLanguage;
}

/**
 * @desc  初始化页面
 */
function initPage(){
	//获取登录用户
	loginUser = localStorage.getItem("user");
	//1.创建布局
	createOuterLayout();
	//2.根据系统默认设置或者用户个性化设置判断是否显示地图区域、三维区域、及业务功能区域默认打开的tab页签
	if(hasUserPreferenceConfig){
		getUserPreferenceConfigHome();
	}else{
		createInnerLayout(defaultPageLayout);
		functionMenu.createMenu('0',top.defaultAppId);
		if(toShow2d){
			showmap2d();//显示二维地图
	 	}
	 	if(toShow3d){
	 		showmap3d();//显示三维地图
	 	}
	 	getDefaultOpenTab();
		/*for(var i=0; i < defaultOpenTabArray.length; i++){
			var defaultOpenTab = defaultOpenTabArray[i];
			var id = defaultOpenTab.id;
			var title = defaultOpenTab.title;
			//title = getLanguageValue(title);
			var url = defaultOpenTab.url;
			var closeable = defaultOpenTab.closeable;
			tab.openTabs(id,title,url,closeable);
		}*/
	}
}

/**
 * 获取默认打开的tab页
 * @returns
 */
function getDefaultOpenTab(){
//	var oid = getParamter('privilegeId');
//	$.ajax({
//		type: "POST",
//		url: rootPath+"jasframework/privilege/privilege/getDefaultOpenTab.do?oid="+oid,
//		dataType:"json",
//		success:function(res){
//			if(res.status == 1){
//				if(res.data){
//					var data = res.data;
//					tab.openTabs(data.id,data.name,rootPath+"/"+data.url,data.closeable);
//				}
//			}
//		},
//		error:function(e){
//			
//		}
//	});
	tab.openTabs("10210201","巡线工考核报表",rootPath+"/linePatrolManage/assessments/query_gps_unitscore.html",false,true);
}

/**
 * @desc  获取个性化设置信息
 */
function getUserPreferenceConfigHome(){
	$.ajax({
		type: "POST",
		async: false,
		url: rootPath+"jasframework/login/getUserPreferenceConfigHome.do",
		success: function(result){
			var userName = result.userName;
			var show2d_user = result.show2d;
			var show3d_user = result.show3d;
			var pagelayout = result.pagelayout;
			var homefunctionid = result.homefunctionid;
			var homefunctionname = result.homefunctionname;
			var homefunctionurl = result.homefunctionurl;
			var hasFunctionConfig = result.hasFunctionConfig;
			if(hasFunctionConfig==null){
				hasFunctionConfig="0";
			}
			createInnerLayout(pagelayout);
			var menuType = hasFunctionConfig;
			functionMenu.createMenu(menuType);
			if(show2d_user!=null && show2d_user=='1'){
				toShow2d=true;
			}
			if(show3d_user!=null && show3d_user=='1'){
				toShow3d=true;
			}
			if(toShow2d){
				showmap2d();//显示二维地图
		 	}
		 	if(toShow3d){
		 		showmap3d();//显示三维地图
		 	}
		 	if(homefunctionid!=null && homefunctionid!=''){
		 		tab.openTab(homefunctionid,homefunctionname,homefunctionurl);
			}else{
				/*for(var i=0; i < defaultOpenTabArray.length; i++){
					var defaultOpenTab = defaultOpenTabArray[i];
					var id = defaultOpenTab.id;
					var title = defaultOpenTab.title;
					//title = getLanguageValue(title);
					var url = defaultOpenTab.url;
					var closeable = defaultOpenTab.closeable;
					tab.openTab(id,title,url,closeable);
				}*/
				getDefaultOpenTab();
			}
		},
	   	dataType:"json"
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
//function showUserLoginInfo(){
//	var msg = "";
//	$.post(rootPath+"jasframework/log/login/getUserStatisticsInfo.do",function(result){
//		var data = result.data;
//		if(data!=null){
//			var userName =  data.userName;
//			var userLoginName =  data.loginName;
//			var loginNumber =  data.loginCount;
//			var totalLoginDate = data.totalLoginDate;
//			var clientIp = data.clientIp;
//			var lastLoginDateStr = data.lastLoginDate;
//			msg = "<span style=\"line-height:20px;\"><b><font color='red'>"+userName+"</font></b>,您好!您：<br/>"+
//			"登录次数：<font color='red'>"+loginNumber+"</font><br/>"+
//			"累计在线时长为：<font color='red'>"+totalLoginDate+"</font><br/>"+
//			"上次登录ip为：<font color='red'>"+clientIp+"</font><br/>"+
//			"上次登录时间为：<font color='red'>"+lastLoginDateStr+"</font><br/></span>";
//		}else{
//			msg = "<span style=\"line-height:20px;\"><b><font color='red'>"+"欢迎使用系统！"+"</font><br/></span>";
//		}
//	},'json');
//	msg += "<span style=\"line-height:20px;\">"
//	msg += "漏巡关键点数量：<font color='red'>"+567+"</font><br/>";
//	$.messager.show({
//		title:'系统提示',
//		width:300,
//		height:170,
//		msg:msg,
//		timeout:500000
//	});
//}


/**
 * @desc  获取用户的地图权限
 */
function loadMapPrivilege(){
	$.ajax({
		type: "POST",
		url: rootPath+"jasframework/privilege/privilege/getMapPrivilege.do",
		success: function(msg){
			top.verifiedLayer=msg.mapprivilegenumber;
		},
	   	dataType:"json"
	});
}


/**
 * @desc  加载js文件（主要针对具体业务系统的全局变量js文件）
 * @param url js文件路径
 * @param callback 回调函数
 */
function loadScriptForOperationSystem(url,callback){
	$.getScript(url, function(){
		if(!callback){
			callback;
		}
	});
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

/**
 * @desc  tab页面数据同步
 * @param functionNumber 菜单权限编号
 * @returns iframe
 */
function getTabIframeByid(functionNumber){
	functionNumber="frm"+functionNumber;
	return document.getElementById(functionNumber).contentWindow;
}

/**
 * @desc 获取登录用户的userBo对象
 * @returns Userbo的json对象
 */
function getLoginUser(){
	var LoginuserBo=null;
	$.ajax({
		url : getRootPath()+"jasframework/privilege/user/getLoginUser.do",
		dataType : "json",
		async : false,
		success : function(userBo) {
			LoginuserBo=userBo;
			
			top.loginUseInfo=userBo;
		}
	});
	return LoginuserBo;
}


/*****	文档管理系统修改-开始	*****/

/**
 * @desc 预览开启新的tab页
 */
function previewTab(id,title,url){
	functionMenu.openPage(id,title,url);
}

/**
 * @desc 新增文件夹添加节点
 */
function appendFolderNode(data){
	functionMenu.appendNode(data);
}

/**
 * @desc 回收站还原文件夹时调用重新加载menu
 */
function reloadMenu(){
	$('#left').empty();
	functionMenu.createMemu();//创建菜单
}

/*****	文档管理系统修改-结束	*****/
/**
 * @desc 绑定tab页监听
 */
function initTabsBind(){
	//关闭所有
	$("#m-closeall").click(function(){
		try{
			if(currentPageLayout ==1){
				innerLayout.sizePane('north',  $('#outerCenter').height());//关闭最后一个tab后让地图最大化
			}else if(currentPageLayout ==2){
				innerLayout.sizePane('east',  $('#outerCenter').width());
			}
		}catch(e){
			
		}
		var tabs=$('#centerTabtag').tabs('tabs');
		var length = tabs.length;
		for(var i = 0; i < length;i++) {
		    var onetab = tabs[i];
		    var title = onetab.panel('options').title;
		    $('#centerTabtag').tabs('close',title);
		    i--;
		}
	});    
	    
	//除当前之外关闭所有
	$("#m-closeother").click(function(){
		var tabs=$('#centerTabtag').tabs('tabs');
		var length = tabs.length;
		for(var i = 0; i < length;i++) {
			var onetab = tabs[i];
			var title = onetab.panel('options').title;
			if($('#m-closeother').attr("title")!=title){
			    $('#centerTabtag').tabs('close',title);
			    i--;
			}
		}
	});
	    
	//关闭当前
	$("#m-close").click(function(){
		var tabNum=$('#centerTabtag').tabs('tabs').length;
		if(tabNum==1){
			try{
				if(currentPageLayout ==1){
					innerLayout.sizePane('north',  $('#outerCenter').height());//关闭最后一个tab后让地图最大化
				}else if(currentPageLayout ==2){
					innerLayout.sizePane('east',  $('#outerCenter').width());
				}
			}catch(e){
				
			}
		}
		var title=$('#m-close').attr('title');
		$('#centerTabtag').tabs('close',title);
	});
}

/**
 * 初始化用户可以操作的项目
 * @returns
 */
function initProject(){
	//获取用户授权的项目
	$('#projectoid').combobox({
		valueField: 'OID',
		textField: 'NAME',
		editable:false,
		onLoadSuccess:function(data){
			if(data.length>0){
				$('#projectoid').combobox("setValue",data[0].OID)
			}
		},
		onSelect:function(row){
			changeProject(row.OID,row.NAME);
		}
	});
	
	$.ajax({
	   url: rootPath+"scobaseproject/getProjectByUnitoid.do",
	   type: "POST",
	   dataType:"json",
	   async:false,
	   success: function(data){
			if(data.status==1){
				var rows = data.rows;
				$('#projectoid').combobox("loadData",rows);
			}else{
				
			}
	   },
	});
}

/**
 * 切换项目
 * @param projectOid
 * @param projectName
 * @returns
 */
function changeProject(projectOid,projectName){
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
		   if(status == -1){
			   top.showAlert('项目切换失败', data.msg, 'info');
		   }else{
//			   functionMenu.createMenu('0');
			   
			   $("#m-closeall").trigger("click"); // 关闭全部tab页签
//			   tab.openTabs(id, title, url, closeable);  // 根据不同的项目，切换不同默认展开的tab页签 （参数传递）
//			   functionMenu.openPageByTab(); // 这个同上一句功能一样    参数传递参考 jasframework.functionMenu.js    210行

				getScopeIdList();
		   }
	   },
	   error : function(data) {
		   status = 0;
		}
	});
	return status;
}


/**
 * 获取标段id
 * @returns
 */
function getScopeIdList(){
	$.ajax({
	   url: rootPath+"/jasframework/privilege/projectorg/getScopeId.do?scopeType=101",
	   type: "post",
	   contentType: "application/json;charset=utf-8",
	   dataType: "json",
	   success: function(data){
		   if(data.status == 1){
			   var myStorage = window.localStorage;
			   myStorage.removeItem("scopeIds");
			   myStorage.setItem("scopeIds",JSON.stringify(data.rows));
		   }
	   },
	   error : function(data) {
		   status = 0;
		}
	});
}


/**
 * 获取系统提示信息
 * 根据当前登录用户获取所辖区域气象信息
 * @returns
 */
function initSystemInfo(){
	$.ajax({
//		   url: rootPath + "sysnews/getlatelynews.do",
		   url: rootPath + "meteorologicalinformation/getThroughCountiesByUnitId.do",
		   type: "get",
		   contentType: "application/json;charset=utf-8",
		   dataType: "json",
		   success: function(data){
			   if(data.status == 1){
				  if(data.data && !isNull(data.data)){
					 // var content  = data.data.content;
					 // $("#hintInfo1").html("&nbsp;&nbsp;" + content);
					 // $("#hintInfo2").html("&nbsp;&nbsp;" + content);
					  //XX县:今天小雨转多云,24～30℃;
					  var content = "";
					  if (data.data.length >0){
						  for (let i = 0; i < data.data.length; i++) {
							  content += data.data[i].siteCity;
							  content += ":";
							  content += data.data[i].weatherCondition;
							  content += ",";
							  content += data.data[i].temperatureSituation;
							  content += "℃; ";
						  }
					  }
					  $("#hintInfo1").html("&nbsp;&nbsp;" + content);
					  $("#hintInfo2").html("&nbsp;&nbsp;" + content);
						// 添加鼠标移入长信息的展示
						// $("#hintInfo .info-tip").tooltip({
						// //  trackMouse:true,
						// 	content:data.data.content,
						// 	onShow:function(){
						// 		$(this).tooltip('tip').css("boxShadow","1px 1px 3px #292929")
						// 	}
						// })
						
				  }else{
					  $("#hintInfo1").html("");
					  $("#hintInfo2").html("");
				  }
			   }
		   },
		   error : function(data) {
			   status = 0;
			}
		});
}

function Marquee(){
	var hintInfo = document.getElementById("hintInfo"),
		hintInfo1 = document.getElementById("hintInfo1"),
		hintInfo2 = document.getElementById("hintInfo2");
    if(hintInfo.scrollLeft-hintInfo2.offsetWidth>=0){
    	hintInfo.scrollLeft-=hintInfo1.offsetWidth;
    }else{
    	hintInfo.scrollLeft++;
    }
}




String.prototype.isPicture = function(){
    var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic";
    if(this.indexOf(".") > -1){
        var p = this.lastIndexOf(".");
        var strPostfix = this.substring(p,this.length) + "|";
        strPostfix = strPostfix.toLowerCase();
        if(strFilter.indexOf(strPostfix) > -1){
            return true;
        }
    }
    return false;
}
//显示图片
function showPic(divId,url,width,height,event){
    if(url.isPicture()==false) return;
    var evt = event || window.event;
    var x = evt.clientX;
    var y = evt.clientY;
    document.getElementById(divId).style.left = x + "px";
    document.getElementById(divId).style.top = y + "px";
    document.getElementById(divId).innerHTML = "<img src=\""+url+"\" width=\""+width+"\" height=\""+height+"\">";
    document.getElementById(divId).style.display = "block";
}
function hiddenPic(divId){
    document.getElementById(divId).innerHTML = "";
    document.getElementById(divId).style.display = "none";
}