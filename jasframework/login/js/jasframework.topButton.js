/**
 * 
 * 类描述: home页面top区域按钮处理函数。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-10-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */

	
/** 
 * 功能描述：打开地图
 */
function showmap2d(){
//	innerLayout.toggle("north");
	
	if(isHasOpen2d&&clickStatis){
		return;
	}
	if(min2dstatis){
		min2dstatis=false;
	}

	if(currentPageLayout==1){
		innerLayout.open("north");
		innerNorthLayout.hide('east');
		if(!isHasOpen2d){
			isHasOpen2d=true;
//			tab.addMapTab('2d','地图','http://120.192.58.115:18080/#/locate/',true);
			tab.addMapTab('2d','地图','../map_viewer/map.html',true);
		}
		if(isHasOpen3d){
			if(click3dStatis==true){//如果3d已经最大化，先还原
				openMaxMin3DMap();
			}
			if(min3dstatis==true){
				
			}else{
				innerNorthLayout.open('east');
				innerNorthLayout.sizePane('east',  getInnerOriginSouthWidth());
			}
		}
	}else if(currentPageLayout==2){
		innerLayout.open("east");
		innerEastLayout.hide('south');
		if(!isHasOpen2d){
			isHasOpen2d=true;
			tab.addMapTab('2d','地图','http://120.192.58.115:18080/#/locate/',true);
			/*tab.addMapTab('2d','地图','../map_viewer/map.html',true);*/
		}
		if(isHasOpen3d){
			if(click3dStatis==true){//如果3d已经最大化，先还原
				openMaxMin3DMap();
			}
			if(min3dstatis==true){
				
			}else{
				innerEastLayout.open('south');
				innerEastLayout.sizePane('south',  getInnerOriginSouthHeight());
			}
		}
	}
}

function showmap2dAndLocation(locationData){
	var location_encode = encodeURIComponent(locationData);
	if(isHasOpen2d || clickStatis || min2dstatis){
//		tab.updateTabs("2d","newOpen",'http://120.192.58.115:18080/#/locate/'+ location_encode);
		var iframeArray = top.$("iframe");
		for ( var i = 0; i < iframeArray.length; i++) {
			if ($(iframeArray[i]).prop("id") == 'frm2d'){
				$(iframeArray[i]).attr('src','http://120.192.58.115:18080/#/locate/'+ location_encode);
//				iframeArray[i].contentWindow.location.src = 'http://120.192.58.115:18080/#/locate/'+ location_encode;
			}
		}
	}else{
		if(currentPageLayout==1){
			innerLayout.open("north");
			innerNorthLayout.hide('east');
			if(!isHasOpen2d){
				isHasOpen2d=true;
				tab.addMapTab('2d','地图','http://120.192.58.115:18080/#/locate/'+ location_encode ,true);
				/*tab.addMapTab('2d','地图','../map_viewer/map.html',true);*/
			}
			if(isHasOpen3d){
				if(click3dStatis==true){//如果3d已经最大化，先还原
					openMaxMin3DMap();
				}
				if(min3dstatis==true){
					
				}else{
					innerNorthLayout.open('east');
					innerNorthLayout.sizePane('east',  getInnerOriginSouthWidth());
				}
			}
		}else if(currentPageLayout==2){
			innerLayout.open("east");
			innerEastLayout.hide('south');
			if(!isHasOpen2d){
				isHasOpen2d=true;
				tab.addMapTab('2d','地图','http://120.192.58.115:18080/#/locate/'+ location_encode ,true);
				/*tab.addMapTab('2d','地图','../map_viewer/map.html',true);*/
			}
			if(isHasOpen3d){
				if(click3dStatis==true){//如果3d已经最大化，先还原
					openMaxMin3DMap();
				}
				if(min3dstatis==true){
					
				}else{
					innerEastLayout.open('south');
					innerEastLayout.sizePane('south',  getInnerOriginSouthHeight());
				}
			}
		}
	}
}


/** 
 * 功能描述：打开三维地图
 */
function showmap3d(){
	if(isHasOpen2d&&click3dStatis){
		return;
	}
	if(min3dstatis){
		min3dstatis=false;
	}
	var superEarthPageUrl = "../../superEarth/SuperEarth.htm";
	if(currentPageLayout==1){
		innerLayout.open("north");
		if(!isHasOpen3d){
			isHasOpen3d=true;
			tab.addMapTab('3d','三维',superEarthPageUrl,true);
		}
		if(!isHasOpen2d){//如果二维地图未打开，则打开三维地图，并将三维地图区域大小设置为地区区域总大小
			innerNorthLayout.open('east');
			innerNorthLayout.sizePane('east', getInnerOriginSouthWidth()*2);
			$('#innerNorth').children('.ui-layout-resizer').hide();
			$('#innerNorthEast').width($('#innerNorthEast').parent().width()-3);
		}else{//如果二维地图已经打开，则判断二维地图的状态
			if(clickStatis==true){//如果已经最大化，先还原
				openMaxMin2DMap();
			}
			innerNorthLayout.open('east');
			if(min2dstatis==true){
				innerNorthLayout.sizePane('east', getInnerOriginSouthWidth()*2);
				$('#innerNorth').children('.ui-layout-resizer').hide();
				$('#innerNorthEast').width($('#innerNorthEast').parent().width()-3);
			}else{
				//innerNorthLayout.sizePane('east', getInnerOriginSouthWidth());
			}
		}
	}else if(currentPageLayout==2){
		innerLayout.open("east");
		if(!isHasOpen3d){
			isHasOpen3d=true;
			tab.addMapTab('3d','三维',superEarthPageUrl,true);
		}
		if(!isHasOpen2d){//如果二维地图未打开，则打开三维地图，并将三维地图区域大小设置为地区区域总大小
			innerEastLayout.open('south');
			innerEastLayout.sizePane('south', getInnerOriginSouthHeight()*2);
			$('#innerEast').children('.ui-layout-resizer').hide();
			$('#innerEastSouth').height($('#innerEastSouth').parent().height()-2);
		}else{//如果二维地图已经打开，则判断二维地图的状态
			if(clickStatis==true){//如果已经最大化，先还原
				openMaxMin2DMap();
			}
			innerEastLayout.open('south');
			if(min2dstatis==true){
				innerEastLayout.sizePane('south', getInnerOriginSouthHeight()*2);
				$('#innerEast').children('.ui-layout-resizer').hide();
				$('#innerEastSouth').height($('#innerEastSouth').parent().height()-3);
			}else{
				innerEastLayout.sizePane('south', getInnerOriginSouthHeight());
			}
		}
	}
}

/**
 * 功能描述：切换布局
 * param layout 1.先上下后左右，2.先左右后上下。
 */
function changeLayout(layout){
	if(layout!=currentPageLayout){
		show2BeforeChange = false;
		show3BeforeChange = false;
		if(currentPageLayout==1){
			if(isHasOpen3d){
				tab.delMapTab('3d');
				show3BeforeChange=true;
			}
			if(isHasOpen2d){
				tab.delMapTab('2d');
				show2BeforeChange=true;
			}
		}else if(currentPageLayout==2){
			if(isHasOpen2d){
				tab.delMapTab('2d');
				show2BeforeChange=true;
			}
			if(isHasOpen3d){
				tab.delMapTab('3d');
				show3BeforeChange=true;
			}
		}
		
		currentPageLayout=layout;
		if(show2BeforeChange){
			showmap2d();
		}
		if(show3BeforeChange){
			showmap3d();
		}
	}
}

/** 
 * 功能描述：修改密码
 */
function updatePassward(){
	getDlg(rootPath+"jasframework/privilege/user/updateUserPass.htm","updateUserPass","密码修改",400,250);
}

/**
 *  功能描述：退出系统
 */
function login_out(){
	document.body.onbeforeunload=function(){};
	$.messager.confirm({
		title:'系统提示',
		ok:"确定",
		cancel:"取消",
		msg:"您确定要退出系统吗？",
		fn:function(r){
			if(r){
				$.ajax({
					url : rootPath+"jasframework/login/logout.do",
					type : "POST",
					data : {
						userName : window.username, t:new Date().getTime()
					},
					async : false,
					dataType : "json",
					success : function(response) {
//						alert('系统已安全退出');
						window.location ='./login.htm';
					}
				});
			}
		}
	});
	
}

/** 
 * 功能描述：弹出个性化设置窗口
 */
function showpreference(){
	top.getDlg("SysUserconfig.htm","saveiframe","个性化",880,500);
}

/**
 * 功能描述：展示用户的详细信息
 */
function showInformation(){
		getDlg("userInfo.htm","userInfo","用户信息",550,400);
}

/**
 * 功能描述：弹出个性化设置窗口
 */
function showExtranet(){
    top.getDlg("extranet.htm","extranetiframe","管道工",350,350);
}



/**
 * 功能描述：弹出县/区天气详情界面
 */
function showWeatherInfo(){
	top.getDlg("../meteorological/view_meteorological.html","weatherinfoiframe","气象信息",600,400);
}


/**
 * 功能描述：弹出个性化设置窗口
 */
function showIntranet(){
    top.getDlg("intranet.htm","intranetiframe","巡线工",350,350);
}

/**
 * 解析IP地址，得到下载链接
 */
function appDownload(){
    var rootPath = getRootPath()+"/xn_dlg.zip";
    window.location.href = rootPath;
	/*$("#appDownloadFile").prop("href",rootPath);
    $("#appDownloadFile").trigger("click");*/
   // window.open(rootPath);

}

/**
 * 
 * 功能描述：帮助文档下载
 *
 * @param type
 */
function downloadFile(type) {
	var ids = "";
	var baseUrl = "/xncommon/downloadFile.do?";
	if (type == 1) {
		// ids = "help//" + encodeURI(encodeURI("巡检系统用户使用手册V1.1.pdf"));
		ids = "sourcePathFileName="+decodeURI("西南管道GPS智能巡检系统用户手册")+"&downloadFileName="+decodeURI("西南管道GPS智能巡检系统用户手册&suffix=pdf");
	} else if (type == 2) {
        ids = "sourcePathFileName="+decodeURI("系统巡线工APP培训文档")+"&downloadFileName="+decodeURI("系统巡线工APP培训文档&suffix=pptx");
	} else if (type == 3) {
        ids = "sourcePathFileName="+decodeURI("系统管道工APP培训文档")+"&downloadFileName="+decodeURI("系统管道工APP培训文档&suffix=pptx");
	} else if (type == 4) {
        ids = "sourcePathFileName="+decodeURI("西南管道GPS智能巡检系统培训文档")+"&downloadFileName="+decodeURI("西南管道GPS智能巡检系统培训文档&suffix=pptx");
	}
	// var postUrl = rootPath+'downloadDocument/downloadHelp.do?ids=' + ids;
	var postUrl =addTokenForUrl(rootPath+baseUrl+ ids) ;
	var downloadIframe = document.getElementById("downloadIframe");
	if(!downloadIframe){
		$("<iframe id=\"downloadIframe\" style=\"display: none;\"></iframe>").appendTo($('body'));
	}
	 //$("#downloadIframe").attr("src", postUrl);
	 window.location.href = postUrl;

  /*  $("#appDownloadFile").prop("href",postUrl);
    $("#appDownloadFile").trigger("click");*/
}

/**
 * 投屏
 */
function throwingScreen() {
    window.open( rootPath+"/screen/index.html" ) ;
}

/**
 * 消息
 */
function showMessages() {
    window.open( rootPath+"/chat/msgview.html" ) ;
}

/**
 * 
 * 功能描述：站内搜索框弹出窗口
 *
 * @param value 搜索框中填写的关键字
 */
function itemSearch( value ){
	//top.getDlg("http://192.168.10.5:6666/jasoa/jasframework/privilege/role/queryRole.htm","searchIframe","站内搜索",730,450);
	top.getDlg("../ise/search/search.htm?keyword="+value,"searchIframe","站内搜索",730,450);
}

/*---------------------------语言切换功能代码 开始----------------------------*/
var languageMenuDivId = "languagemenu";//转到功能菜单的页面元素ID
function showLanguageMenu(){
	var languagemenu = document.getElementById(languageMenuDivId);
	if(!languagemenu){
		var languageMenuDiv=$("<div id=\""+languageMenuDivId+"\"></div>").appendTo("body");
		$('#'+languageMenuDivId).css('width',80);
		if(currentLanguage=='zh_CN'){
			$("<div id=\"zh_CN\">中文</div>").appendTo($('#'+languageMenuDivId));
			$("<div id=\"en\">英文</div>").appendTo($('#'+languageMenuDivId));
			$("<div id=\"ru\">俄文</div>").appendTo($('#'+languageMenuDivId));
		}else if(currentLanguage=='en'){
			$("<div id=\"zh_CN\">Chinese</div>").appendTo($('#'+languageMenuDivId));
			$("<div id=\"en\">English</div>").appendTo($('#'+languageMenuDivId));
			$("<div id=\"ru\">Russian</div>").appendTo($('#'+languageMenuDivId));
		}else if(currentLanguage=='ru'){
			$("<div id=\"zh_CN\">中文</div>").appendTo($('#'+languageMenuDivId));
			$("<div id=\"en\">英文</div>").appendTo($('#'+languageMenuDivId));
			$("<div id=\"ru\">俄文</div>").appendTo($('#'+languageMenuDivId));
		}
		$('#'+languageMenuDivId).menu({
			onClick:function(item){
				document.body.onbeforeunload=function(){};
				var path = rootPath + "/jasframework/I18N//setlocale.do?language="+item.id;
				$.ajax({
					url : path,
					async : false,
					success : function() {
					}
				});
				window.location.href=window.location.href.replace('i18n='+language,'i18n='+item.id);
			}
		});
		
	}
	$('#'+languageMenuDivId).menu('show', {
		left: $("#languagebutton").offset().left,
		top: $("#languagebutton").offset().top+$("#languagebutton").outerHeight()
	});
}

/*---------------------------语言切换功能代码 结束----------------------------*/


/*---------------------------转到功能代码 开始----------------------------*/
$(function(){
//	setTimeout('createNavigatorMenu()',2000);//页面加载n秒钟之后再进行转到菜单创建
});

var navigatormenuDivId = "navigatormenu";//转到功能菜单的页面元素ID

/**
 * 
 * 功能描述：显示转到菜单
 *
 */
function showNavigatorMenu(){
	var navigatormenu = document.getElementById(navigatormenuDivId);
	if(!navigatormenu){
	}else{
		$('#'+navigatormenuDivId).menu('show', {
			left: $("#navigatorbutton").offset().left,
			top: $("#navigatorbutton").offset().top+$("#navigatorbutton").outerHeight()
		});
	}
}

/**
 * 
 * 功能描述：创建转到菜单
 *
 */
function createNavigatorMenu(){
	$("<div id=\""+navigatormenuDivId+"\"></div>").appendTo("body");
	$("#"+navigatormenuDivId).css('width',120);
	var url="";
	if(isIntegrationExist){
		url=rootPath+'/jasframework/privilege/menu/getIntegrationMenu.do?menutype=0&language='+language;
	}else{
		url=rootPath+'/jasframework/privilege/privilege/menu2main.do?menutype=0&language='+language;
	}
	$.getJSON(url, function(nodeData){
		createfisrtmenu(nodeData);
	});
}

var nodeLength;
var index = 0;

/**
 * 
 * 功能描述：创建一级菜单
 *
 * @param nodeData
 */
function createfisrtmenu(nodeData){
	nodeLength = nodeData.length;
	var root = $("#"+navigatormenuDivId);
	for(var i=0; i<nodeData.length;i++){
		var divDom = $("<div></div>");
		divDom.attr('id',nodeData[i].id);
		var spanDom = $("<span></span>");
		spanDom.text(nodeData[i].node_t);
		spanDom.appendTo(divDom);
		divDom.appendTo(root);
		getchildmenu(nodeData[i].id,divDom);
	}
	
}

/**
 * 
 * 功能描述：获取下级菜单节点数据，并调用创建下级菜单方法创建下级菜单
 *
 * @param nodeid
 * @param nodeDom
 */
function getchildmenu(nodeid,nodeDom){
	var url="";
	if(isIntegrationExist){
		url=rootPath+'/jasframework/privilege/menu/menus.do?id='+nodeid+'&language='+language;
	}else{
		url=rootPath+'/jasframework/privilege/privilege/menus.do?id='+nodeid+'&language='+language;
	}
	$.getJSON(url, function(nodes){
		createchildmenu(nodes,nodeid,nodeDom);
		index ++;
		if(index==nodeLength){
			$('#'+navigatormenuDivId).menu({
				onClick:function(item){
				    var url = $("#"+item.id).attr("url");
				    if(url){
				    	var username = getParamter('userName');
						if(url.indexOf('?')!=-1){
							url = url + "&userId="+username+"&language="+language;
						}else{
							url = url + "?userId="+username+"&language="+language;
						}
						functionMenu.openPage(item.id,item.text,url);
				    }
				}
			});
		}
	});
}


/**
 * 
 * 功能描述：递归创建下级菜单
 *
 * @param nodes
 * @param nodeid
 * @param nodeDom
 */
function createchildmenu(nodes,nodeid,nodeDom){
	var divDom = $("<div></div>");
	divDom.css("width","120px");
	for(var i=0;i<nodes.length;i++){
		var node = nodes[i];
		var div2 = $("<div></div>");
		div2.attr('id',node.id);
		div2.text(node.text);
		div2.appendTo(divDom);
		divDom.appendTo(nodeDom);
		
		if(node.attributes){
			if(node.attributes.URL){
				var url = node.attributes.URL;
				div2.attr('url',url);
			}
		}
		if(node.children!=null){
			createchildmenu(node.children,node.id,div2);
		}
	}
}
/*---------------------------转到功能代码 结束 ----------------------------*/

