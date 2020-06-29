
/** 
 * @file
 * @author  zhanggf
 * @desc 加载主界面对应js
 * @version 1.0
 * @date   2012-11-16 上午8:46:07
 * @last modified by lizz
 * @last modified time  2017-08-17
 */


/*************************layout开始***************************************************************************/

/**
 * @desc 定义加载项属性
 */
//是否打开地图
var isHasOpen2d =false;
//是否打开三维
var isHasOpen3d =false;

/**
 * @desc 定义外部layout的属性
 */
//定义外部Layout
var outerLayout;
//log区域高度
//var outerNorthHeight=80;
var outerNorthHeight=60;
var outerSouthHeight=30;
var outerLayoutHeight=0;
var outerLayoutWidth=0;
//导航区域宽度
var outerWestWidth=200;
//var outerEastWidth=200;
var outerEastWidth=0;
//分隔栏高度/宽度
//打开按钮宽度
var outerLayoutSpacingSize = 2;
//关闭按钮宽度
var outerLayoutSpacingClose = 0;

/**
 * @desc 定义内部layout的属性
 */
//定义内部layout
var innerLayout;
//log区域高度
var innerLayoutHeight=0;
var innerLayoutWidth=0;
//var innerEastWidth =250;
var innerEastWidth =0;
//分隔栏高度/宽度
//打开按钮宽度
var innerLayoutSpacingSize = 2;
//关闭按钮宽度
var innerLayoutSpacingClose = 0;

//记录外部最大化时宽度
var outwidth;
//记录外部最大化时高度
var outheight;
//记录2d最大化时宽度
var width2d;
//记录3d最大化时高度
var height3d;
//记录2d最大化时高度
var height2d;
//记录3d最大化时宽度
var width3d;

/**
 * @desc 定义内部的内部layout的属性
 */
//定义内部的内部layout
var innerNorthLayout;
var innerEastLayout;


/**
 * 	 @desc 默认加载布局
 *   @param innernorth true为默认显示功能区上边区的左边区，false为不显示
 *   @param innerEast true为默认显示功能区下边区，false为不显示
 *   @param west true为默认显示右半边上边区，false为不显示
 *   @param north true为默认显示右半边上边区，false为不显示
 */
function createOuterLayout() {
	outerLayout=$('body').layout({
		spacing_open:outerLayoutSpacingSize,
		spacing_closed:outerLayoutSpacingClose,
		maskContents:true,
		debug: false,
		north: {
			resizable:false,
			spacing_open:0,
			size:outerNorthHeight,
			onclose:function(){
				if(currentPageLayout == 1){
					if(clickStatis || click3dStatis){
						innerLayout.sizePane('north',innerLayout.state.north.size+outerNorthHeight);
						if(click3dStatis){
							$('#innerNorth').children('.ui-layout-resizer').hide();
						}
					}
				}else if(currentPageLayout == 2){
					if(clickStatis || click3dStatis){
						$('#outerCenter').children('.ui-layout-resizer').hide();
					}
				}
			},
			onopen:function(){
				if(currentPageLayout == 1){
					if(clickStatis || click3dStatis){
						innerLayout.sizePane('north',innerLayout.state.north.size);
						if(click3dStatis){
							$('#innerNorth').children('.ui-layout-resizer').hide();
						}
					}
				}else if(currentPageLayout == 2){
					if(clickStatis || click3dStatis){
						$('#outerCenter').children('.ui-layout-resizer').hide();
					}
				}
			}
		},
		south:{
			resizable:false,
			spacing_open:0,
			szie:outerSouthHeight
		},
		east: {
			resizable:false,
			szie:outerEastWidth
		},
		west: {
			initHidden:((navigatorMenuType=='menuBar') ?true:false), 
			resizable:true,
			//minSize:120, // 拖拽的剩余最小宽度
			size:outerWestWidth,
			onresize:function(){
				leftResize();
			},
			onclose:function(){
				if(currentPageLayout == 2){
					outerWestWidth=0;
					if(isHasOpen2d && clickStatis){
						innerLayout.sizePane("east",document.body.clientWidth);
						$('#outerCenter').children('.ui-layout-resizer').hide();
						$('#innerEast').width($('#innerEast').width()+6);
					}
					if(isHasOpen3d && click3dStatis){
						innerLayout.sizePane("east",document.body.clientWidth);
						$('#outerCenter').children('.ui-layout-resizer').hide();
						$('#innerEast').width($('#innerEast').width()+6);
					}
				}else if(currentPageLayout == 1){
					if(isHasOpen2d){
						if(click3dStatis){
							innerNorthLayout.sizePane('east', document.body.clientWidth);
							$('#innerNorth').children('.ui-layout-resizer').hide();
							$('#innerNorthEast').width($('#innerNorthEast').parent().width()-3);
						}
					}else{
						if(isHasOpen3d){
							innerNorthLayout.sizePane('east', document.body.clientWidth);
							$('#innerNorth').children('.ui-layout-resizer').hide();
							$('#innerNorthEast').width($('#innerNorthEast').parent().width()-3);
						}
					}
				}
			},
			onopen:function(){
				if(currentPageLayout == 2){
					outerWestWidth=200;
					if(isHasOpen2d && clickStatis){
						innerLayout.sizePane("east",document.body.clientWidth-outerWestWidth);
						$('#outerCenter').children('.ui-layout-resizer').hide();
						$('#innerEast').width($('#innerEast').width()+6);
					}
					if(isHasOpen3d && click3dStatis){
						innerLayout.sizePane("east",document.body.clientWidth-outerWestWidth);
						$('#outerCenter').children('.ui-layout-resizer').hide();
						$('#innerEast').width($('#innerEast').width()+6);
					}
				}else if(currentPageLayout == 1){
					if(isHasOpen2d){
						if(click3dStatis){
							$('#innerNorth').children('.ui-layout-resizer').hide();
							$('#innerNorthEast').width($('#innerNorthEast').parent().width()-3);
						}
					}else{
						if(isHasOpen3d){
							$('#innerNorth').children('.ui-layout-resizer').hide();
							$('#innerNorthEast').width($('#innerNorthEast').parent().width()-3);
						}
					}
				}
			}
		}
	});	
	
	//获取外围layout尺寸
	outerLayoutHeight=document.body.clientHeight;
	outerLayoutWidth=document.body.clientWidth;	
	
	
	//获得内嵌layout尺寸	
	innerLayoutHeight=outerLayoutHeight-outerNorthHeight-outerSouthHeight;
	innerLayoutWidth=outerLayoutWidth-outerWestWidth;

	//调整外部layout位置,隐藏上、左、右面板
	outerLayout.hide("east");
	
//	$("#centerContentArea").height($("#centerTab").height()-$("#centerTabtag").height()-12+"px");
//	$("#centerContentArea").width(outerLayoutWidth-$("#left").width()-12+"px");
	
};

/**
 * @desc 创建内部layout对象(功能区布局)
 * @param {Object} containerSelector
 */
function createInnerLayout ( currentPageLayout ){
	var $Container = $('body > .ui-layout-center');
	if (!$Container.data("layoutContainer")){
		innerLayout = $Container.layout({
			name: 'innerLayout',
			useStateCookie:	false,
			spacing_open:innerLayoutSpacingSize,
			spacing_closed:innerLayoutSpacingClose,
			maskContents:true,
			maskIframesOnResize:true,
			north: {
				resizable:true,
				size: getInnerOriginSouthHeight(),
				onresize:function(){
					var panelDivObj = $('#innerNorth');
					var tabHeight = $(panelDivObj).height();
					var tabWidth = $(panelDivObj).width();
					var tabTitleHeight = $(panelDivObj).find('div>div>ul').height();
					var tabContentHeight = (tabHeight-tabTitleHeight) > 0 ? (tabHeight-tabTitleHeight-2) : 1;
					
					$(panelDivObj).find('>div>div>dl').css('height',tabContentHeight);
					$(panelDivObj).find('>div>div>dl').css('width',tabWidth);
				}
			},
			east:{
				resizable:true,
				size: getInnerOriginSouthWidth(),
				onresize:function(){
					var panelDivObj = $('#innerEast');
					var tabHeight = $(panelDivObj).height();
					var tabWidth = $(panelDivObj).width();
					var tabTitleHeight = $(panelDivObj).find('div>div>ul').height();
					var tabContentHeight = (tabHeight-tabTitleHeight) > 0 ? (tabHeight-tabTitleHeight) : 1;
					
					$(panelDivObj).find('>div>div>dl').css('height',tabContentHeight);
					$(panelDivObj).find('>div>div>dl').css('width',tabWidth);
				}
			},
			center:{
				onresize:function(){
//					console.log("9999");
					var panelDivObj = $('#innerCenter');
					var tabHeight = $(panelDivObj).height();
					var tabWidth = $(panelDivObj).width();

					var tabTitleHeight = $(panelDivObj).find('>div>ul').height();
					var tabContentHeight = (tabHeight-tabTitleHeight) > 0 ? (tabHeight-tabTitleHeight-2) : 1;
					
					$(panelDivObj).find('>div>dl').css('height',tabContentHeight);
					$(panelDivObj).find('>div>dl').css('width',tabWidth);
				}
			}
		});	
	}
	if(currentPageLayout==1){
		innerLayout.hide('east');
		if(!toShow2d && !toShow3d ){
			innerLayout.hide('north');
		}
	}else if(currentPageLayout==2){
		innerLayout.hide('north');
		if(!toShow2d && !toShow3d ){
			innerLayout.hide('east');
		}
	}
	
	var $Containers = $('body >.ui-layout-center> .ui-layout-north');
	innerNorthLayout=$Containers.layout({
		name: 'innerNorthLayout',
		useStateCookie:	false,
		spacing_open:innerLayoutSpacingSize,
		spacing_closed:innerLayoutSpacingClose,
		maskContents:true,
		maskIframesOnResize:true,
		east: {
			resizable:true,
			size: getInnerOriginSouthWidth(),
			onresize:function(){
				var panelDivObj = $('#innerNorthEast');
				var tabHeight = $(panelDivObj).height();
				var tabWidth = $(panelDivObj).width();
				var tabTitleHeight = $(panelDivObj).find('>div>ul').height();
				var tabContentHeight = (tabHeight-tabTitleHeight) > 0 ? (tabHeight-tabTitleHeight) : 1;
				
				$(panelDivObj).find('>div>dl').css('height',tabContentHeight);
				$(panelDivObj).find('>div>dl').css('width',tabWidth);
				
				if(!isHasOpen2d || min2dstatis || click3dStatis){
					$('#innerNorth').children('.ui-layout-resizer').hide();
					$(panelDivObj).width($(panelDivObj).parent().width()-3);
				}
			}
		},
		center: {
			onresize:function(){
//				console.log("djdfjffsss")
				var panelDivObj = $('#innerNorthCenter');
				var tabHeight = $(panelDivObj).height();
				var tabWidth = $(panelDivObj).width();
				var tabTitleHeight = $(panelDivObj).find('>div>ul').height();
				var tabContentHeight = (tabHeight-tabTitleHeight) > 0 ? (tabHeight-tabTitleHeight) : 0;
				
//				$(panelDivObj).find('>div>dl').css('height',tabContentHeight);
//				$(panelDivObj).find('>div>dl').css('width',tabWidth);
				
				$(panelDivObj).find('>div>ul').css('width',tabWidth);
				$(panelDivObj).find('>div>dl>dt.on').css('height',tabContentHeight);
				$(panelDivObj).find('>div>dl>dt.on').css('width',tabWidth);
				
			}
		}
	});	
	
	var $Containers = $('body >.ui-layout-center> .ui-layout-east');
	innerEastLayout=$Containers.layout({
		name: 'innerEastLayout',
		useStateCookie:	false,
		spacing_open:innerLayoutSpacingSize,
		spacing_closed:innerLayoutSpacingClose,
		maskContents:true,
		maskIframesOnResize:true,
		south: {
			resizable:true,
			size: getInnerOriginSouthHeight(),
			onresize:function(){
				var panelDivObj = $('#innerEastSouth');
				var tabHeight = $(panelDivObj).height();
				var tabWidth = $(panelDivObj).width();
				var tabTitleHeight = $(panelDivObj).find('>div>ul').height();
				var tabContentHeight = (tabHeight-tabTitleHeight) > 0 ? (tabHeight-tabTitleHeight) : 1;
				
				$(panelDivObj).find('>div>dl').css('height',tabContentHeight);
				$(panelDivObj).find('>div>dl').css('width',tabWidth);
				if(!isHasOpen2d || min2dstatis || click3dStatis){
					$(panelDivObj).height($('#innerEastSouth').parent().height()-2);
					$('#innerEast').children('.ui-layout-resizer').hide();
				}
			}
		},
		center:{
			onresize:function(){
				var panelDivObj = $('#innerEastCenter');
				var tabHeight = $(panelDivObj).height();
				var tabWidth = $(panelDivObj).width();
				var tabTitleHeight = $(panelDivObj).find('>div>ul').height();
				var tabContentHeight = (tabHeight-tabTitleHeight) > 0 ? (tabHeight-tabTitleHeight) : 1;
				
				$(panelDivObj).find('>div>dl').css('height',tabContentHeight);
				$(panelDivObj).find('>div>dl').css('width',tabWidth);
			}
		}
	});	
}

/**
 * @desc 计算宽度
 * @returns {Number}
 */	
function getInnerOriginSouthWidth(){
	var width=(document.body.clientWidth-outerWestWidth-innerLayoutSpacingSize*2)/2;
	return width;
}

/**
 * @desc 计算高度
 * @returns {Number}
 */
function getInnerOriginSouthHeight(){
	var iHeight=(document.body.clientHeight-outerNorthHeight-innerLayoutSpacingSize*2)/2;
	return iHeight;
}

/**
 * @desc 左侧菜单的resize处理函数
 */
function leftResize(){
		//调整页面布局时动态改变功能菜单的高度
	
		/*var headerHeight = $("#left").find("div").first().outerHeight(true);
		var menutreeheight = $("#left").height() 
			- headerHeight * ($("#left >div.accordion-header").length +$("#left >div.accordion-header-selected").length );
		if (menutreeheight < 200) {
			menutreeheight = 200;
		}
		$(".accordion-body-selected").height(menutreeheight-($(".accordion-body-selected").outerHeight(true) - $(".accordion-body-selected").height()) );
		*/
		/****************add by Shenjie 2016-3-21**************************/
		//调整页面布局时动态改变功能菜单的宽度
		//获取当前选中的面板索引
		var panel = $('#left-container').accordion('getSelected');
		var index = 0;
		if (panel){
			index = $('#left-container').accordion('getPanelIndex', panel);
		}
		//调整面板宽度
		$('#left-container').accordion({width:$("#left").width()});
		//设置选中面板
		$("#left-container").accordion("select",index);
}


var clickStatis=false;

/**
 * @desc 地图最大化和地图还原
 */
function openMaxMin2DMap(){
	
//	if($("#tab_map_max_2d").hasClass('tab_map_max') || $("#tab_map_max_2d").hasClass('tab_map_max_on')){
//		$("#tab_map_max_2d").attr('class','tab_map_restore');
//	}else{
//		$("#tab_map_max_2d").attr('class','tab_map_max');
//	}
	
	$("#maxMap").toggleClass("restore-map");
	
	if(!clickStatis){
		outwidth=$("#innerCenter").width();
		outheight=$("#innerCenter").height();
		height3d=$("#innerEastSouth").height();
		clickStatis =true;
		if(currentPageLayout ==1){
			innerLayout.sizePane('north',  $('#outerCenter').height());
			if(isHasOpen3d){
				innerNorthLayout.hide('east');
			}
			$('#outerCenter').children('.ui-layout-resizer').hide();
			$('#innerNorth').height($('#innerNorth').parent().height());
			$('#innerNorthCenter').height($('#innerNorthCenter').parent().height());
		}else if(currentPageLayout ==2){
			innerLayout.sizePane('east',  $('#outerCenter').width());
			innerEastLayout.hide('south');
			$('#outerCenter').children('.ui-layout-resizer').hide();
			$('#innerEast').width($('#innerEast').width()+6);
			$('#innerEastCenter').width($('#innerEastCenter').width()+6);
		}
	}else{
		clickStatis =false;
		if(currentPageLayout ==1){
			innerLayout.sizePane('north',$('#outerCenter').height()-outheight);
			if(isHasOpen3d && !min3dstatis){
				innerNorthLayout.open('east');
			}
		}else if(currentPageLayout ==2){
			if(isHasOpen3d && !min3dstatis){
				innerEastLayout.open('south');
				innerEastLayout.sizePane('south', height3d);
			}
			innerLayout.sizePane('east', $('#outerCenter').width()-outwidth);
		}
	}
}

var click3dStatis=false;

/**
 * @desc 三维最大化和三维还原
 */
function openMaxMin3DMap(){
	if($("#tab_map_max_3d").hasClass('tab_map_max') || $("#tab_map_max_3d").hasClass('tab_map_max_on')){
		$("#tab_map_max_3d").attr('class','tab_map_restore');
	}else{
		$("#tab_map_max_3d").attr('class','tab_map_max');
	}
	
	if(!click3dStatis){
		click3dStatis =true;
		outwidth=$("#innerCenter").width();
		outheight=$("#innerCenter").height();
		width2d=$("#innerNorthCenterTab").width();
		width3d=$("#innerEastSouth").width();
		height3d=$("#innerEastSouth").height();
		if(currentPageLayout== 1){
			innerLayout.sizePane('north',$('#outerCenter').width());
			if(isHasOpen2d){
				innerNorthLayout.sizePane('east', $('#outerCenter').width());
				$('#innerNorth').children('.ui-layout-resizer').hide();
			}else{
				$('#innerNorth').children('.ui-layout-resizer').hide();
			}
		}else if(currentPageLayout == 2){
			innerLayout.sizePane('east', $('#outerCenter').width()-1);
			$('#outerCenter').children('.ui-layout-resizer').hide();
			
			innerEastLayout.sizePane('south',$('#innerEast').height()-1);
			$('#innerEast').children('.ui-layout-resizer').hide();
			
			$('#innerEast').width($('#innerEast').width()+6);
		}
	}else{
		click3dStatis =false;
		if(currentPageLayout ==1){
			innerLayout.sizePane('north',$('#outerCenter').height()-outheight);
			if(isHasOpen2d && !min2dstatis){
				innerNorthLayout.sizePane('east',$('#outerCenter').width()-width2d);
			}else{
				$('#innerNorth').children('.ui-layout-resizer').hide();
			}
		}else if(currentPageLayout == 2){
			innerLayout.sizePane('east', $('#outerCenter').width()-outwidth);
			if(isHasOpen2d && !min2dstatis){
				innerEastLayout.sizePane('south',height3d);
			}else{
				$('#innerEast').children('.ui-layout-resizer').hide();
			}
		}
	}
}

var min2dstatis=false;
var min3dstatis=false;

/**
 * @desc 地图最小化
 */
function maxOrMin2DMap(){
	min2dstatis =true;
	clickStatis=false;
	if(currentPageLayout == 1){
		if(min3dstatis){
			innerLayout.hide('north');
		}else{	
			if(isHasOpen3d){
				innerNorthLayout.open('east');
				innerNorthLayout.sizePane('east',$('#outerCenter').width());
				$('#innerNorth').children('.ui-layout-resizer').hide();
			}else{
				innerLayout.hide('north');
			}
		}
	}else if(currentPageLayout ==2){
		if(min3dstatis){
			innerLayout.hide('east');
		}else{	
			if(isHasOpen3d){
				innerLayout.sizePane('east', $('#outerCenter').width()-outwidth);
				innerEastLayout.show('south');
				innerEastLayout.sizePane('south', $('#outerCenter').height());
				$('#innerEast').children('.ui-layout-resizer').hide();
			}else{
				innerLayout.hide('east');
			}
		}
	}
}

/**
 * @desc 三维最小化
 */
function maxOrMin3DMap(){
	min3dstatis =true;
	click3dStatis=false;
		if(currentPageLayout ==1){
			innerNorthLayout.hide('east');
			if(isHasOpen2d){
				if(min2dstatis){
					innerLayout.hide('north');
				}
			}else{
				innerLayout.hide('north');
			}
		}else if(currentPageLayout ==2){
			if(min2dstatis){
				innerLayout.hide('east');
			}else{	
				if(isHasOpen2d){
					innerLayout.sizePane('east', $('#outerCenter').width()-outwidth);
					innerEastLayout.hide('south');
				}else{
					innerLayout.hide('east');
				}
			}	
		}
}


/**
 * @desc 业务功能区的resize处理函数
 */
function resizeDiv(divObj){
	console.log(divObj);
//	 console.log("161616");
	var tabHeight = $(divObj).height();
	var tabWidth = $(divObj).width();
	var tabTitleHeight = $(divObj).children('ul').height();
	var tabContentHeight = (tabHeight-tabTitleHeight) > 0 ? (tabHeight-tabTitleHeight-2) : 1;
	
	$(divObj).children('dl').css('height',tabContentHeight);
	$(divObj).children('dl').css('width',tabWidth);
	
	var totalTabWidth = 0;
	var tabPanelWidth = $(divObj).outerWidth();
	var tab = $(divObj).find('>ul>li');
	if(tab.length>0){
		for(var i = 0; i < tab.length; i++){
			totalTabWidth +=$(tab[i]).outerWidth();
		}
		var diff = (tabPanelWidth - totalTabWidth)/tab.length;
		for(var i = 0; i < tab.length; i++){
			var ori = $(tab[i]).find(">a>span").width();
			$(tab[i]).find(">a>span").width(ori+diff);
			if($(tab[i]).find(">a>span").width()>100){
				$(tab[i]).find(">a>span").width(100);
			}
		}
	}
}

/**
 * @desc 隐藏top
 */
function hiddenTop(){
	var showtopDiv = document.getElementById('showtop');
	var hiddentopDiv = document.getElementById('hiddentop');
	
	showtopDiv.style.display='';
	hiddentopDiv.style.display='none';
	outerLayout.hide("north");
}

/**
 * @desc 显示top
 */
function showTop(){
	var showtopDiv = document.getElementById('showtop');
	var hiddentopDiv = document.getElementById('hiddentop');
	
	showtopDiv.style.display='none';
	hiddentopDiv.style.display='';
	outerLayout.show("north");
}


/**
 * @desc 隐藏Left
 */
function hiddenLeft(){
	var showleftDiv = document.getElementById('showleft');
	var hiddenleftDiv = document.getElementById('hiddenleft');
	
	showleftDiv.style.display='';
	hiddenleftDiv.style.display='none';
	outerLayout.hide("west");
}

/**
 * @desc 显示Left
 */
function showLeft(){
	var showleftDiv = document.getElementById('showleft');
	var hiddenleftDiv = document.getElementById('hiddenleft');
	
	showleftDiv.style.display='none';
	hiddenleftDiv.style.display='';
	outerLayout.show("west");
}
