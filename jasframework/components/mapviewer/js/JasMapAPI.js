var mapServerHost =getMapServerHost(); 
//var mapServerUrl = mapServerHost+"/jasframework/mapviewer";
var mapServerUrl = "http://localhost/flexviewer";
	
/******************加载其他依赖js文件*******************************/

document.write('<script type="text/javascript" src="'+mapServerUrl+'/swfobject.js"></script>');
document.write('<script type="text/javascript" src="'+mapServerHost+'/js/json2.js"></script>');
document.write('<script type="text/javascript" src="'+mapServerHost+'/customConfig/customEvents/CustomButtonEvents.js"></script> ');
/**
* 
* 功能描述：获取地图服务所在应用系统的访问根路径
* 如果其他应用通过API进行地图服务组件的引用，则根据引用API javascript时的引用路径来获取，否则获取当前应用系统的根路径
*
* @returns 地图服务所在应用系统的访问根路径
*/
function getMapServerHost(){
	var mapViewerApi_javascriptTag = document.getElementById("mapViewerAPI");
	if(mapViewerApi_javascriptTag){
		mapviewerApiUrl = mapViewerApi_javascriptTag.src;
		if(mapviewerApiUrl!=""){
			mapServerHost = mapviewerApiUrl.substring(0,mapviewerApiUrl.indexOf("/jasframework/mapviewer"));
			return mapServerHost;
		}else{
			mapServerHost = getSystemRootPath();
			return mapServerHost;
		}
	}else{
		mapServerHost = getSystemRootPath();
		return mapServerHost;
	}
}

/**
* 功能描述：获取系统根路径
*/
function getSystemRootPath() {
	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	return (localhostPaht + projectName + "/");
}

//定义其它业务里回调函数
	var callbackFunction=null;    
	var defaultJsCallFunctionString="defaultJsCallFunction";
	
	function defaultJsCallFunction(obj){	
		if(callbackFunction!=null){
			callbackFunction(obj);
			callbackFunction=null;
		}		
	}
	var callbackFunctionGraphic=null;   //添加图形后的回调函数
	var defaultJsCallFunctionGraphicString="defaultJsCallFunctionGraphic";
	function defaultJsCallFunctionGraphic(obj)
	{	
		if(callbackFunctionGraphic!=null){
			callbackFunctionGraphic(obj);
		}
	}
	var itemClickFunction=null;
	var itemClickHandlerString = "itemClickHandlerFunction";
	function itemClickHandlerFunction(obj)
	{	
		if(itemClickFunction!=null){
			itemClickFunction(obj);
		}
	}
	
/****************地图加载事件函数变量声明*********************/
	var mapLoadedEventCallFunction;
	var mapLoadedEventBriage="mapLoadedEventBriageCallback";
	function mapLoadedEventBriageCallback(obj){
		if(mapLoadedEventCallFunction!=null){
			mapLoadedEventCallFunction(obj);
		}else{
			removeMapLoadedEventListener();
		}
	}
/****************地图缩放事件函数变量声明*********************/

	var zoomEventCallFunction;
	var zoomEventBriage="zoomEventBriageCallback";
	function zoomEventBriageCallback(obj){
		if(zoomEventCallFunction!=null){
			zoomEventCallFunction(obj);
		}else{
			removeZoomEventListener();
		}
	}
/****************地图范围事件函数变量声明*********************/
	var extentEventCallFunction;
	var extentEventBriage="extentEventBriageCallback";
	/**
	 * 
	 * 方法描述：地图范围回调函数
	 *
	 * @param obj	范围坐标值，xmin+xmax+ymin+ymax
	 *
	 */
	function extentEventBriageCallback(obj){
		if(extentEventCallFunction!=null){
			extentEventCallFunction(obj);
		}else{
			removeExtentEventListener();
		}
	}
	/*
	 * 方法描述：供地图获得当前登录用户
	 * @return {TypeName} 
	 */
	function getUser(){
		//return "admin";
		return top.userId;
	}


	/*
	 * 方法描述：获得当前语言
	 * @return {String} 
	 */
	function getLanguage(){
		return top.language="zh_CN";	//zh_CN,en_US
		//return top.language=="undefined"?"":top.language;
	}
	/*
	 * 方法描述：获得当前用户的权限图层(地图初始化时使用)
	 * @return {String} 
	 */
	function getVerifiedLayer(){
		//return "layerSetBasemaps,layerDlg,layerDom1,layerDom2";
		return top.verifiedLayer;
	}
(function($) {
	$.jasMap = function() {
		var _this = this;
		//地图初始化
		_this.initMap = function(containerId) {
			initMap(containerId);
		};
		/***************************************位置操作类接口   开始*********************************************/
		//地图居中显示
		_this.centerAt = function(mapX, mapY) {
			centerAt(mapX, mapY);
		};
		//地图向上平移，系统将地图向上平移1/4地图高度
		_this.panUp = function() {
			panUp();
		};
		//地图向下平移，系统将地图向下平移1/4地图高度
		_this.panDown = function() {
			//地图向下平移
			panDown();
		};
		//地图向左平移，系统将地图向左平移1/4地图宽度
		_this.panLeft = function() {
			panLeft();
		};
		//地图向右平移，系统将地图向右平移1/4地图宽度
		_this.panRight = function() {
			panRight();
		};
		/******************************************位置操作类接口   结束*********************************************/
		
		/******************************************图层操作类接口   开始*********************************************/
		//根据图层ID刷新图层
		_this.refreshLayerByID = function(layerId) {
			refreshLayerByID(layerId);
		};
		//根据图层名刷新图层，可刷新多个图层
		_this.refreshLayerByName = function(layerName) {
			refreshLayerByName(layerName);
		};
		//删除所有图层
		_this.removeAllLayers = function() {
			removeAllLayers();
		};
		//根据图层ID清空图层上的图形
		_this.clearGraphicsLayer = function(layerId) {
			clearGraphicsLayer(layerId);
		};
		//设置图层是否可见
		_this.layerVisibleSwitch = function(layerID,layerVisible) {
			
			layerVisibleSwitch(layerID,layerVisible);
		};
		//查看图层是否可见
		_this.getLayerVisible = function(layerID,callback) {	
			getLayerVisible(layerID,callback);
		};
		//根据图层ID及标记符号对象渲染点要素层
		_this.setPointLayerRenderer = function(layerId, markerSymbolObject) {
			setPointLayerRenderer(layerId, markerSymbolObject);
		};
		//根据图层ID及图片符号对象渲染点要素层
		_this.setPointLayerPictureRenderer = function(layerId, pictureSymbolObject) {
			setPointLayerPictureRenderer(layerId, pictureSymbolObject);
		};
		//根据图层ID及标记符号对象渲染线要素层
		_this.setLineLayerRenderer = function(layerId, lineSymbolObject) {
			setLineLayerRenderer(layerId, lineSymbolObject);
		};
		//根据图层ID及标记符号对象渲染面要素层
		_this.setPolygonLayerRenderer = function(layerId, fillSymbolObject) {
			//设置面层渲染
			setPolygonLayerRenderer(layerId, fillSymbolObject);
		};
		/******************************************图层操作类接口   结束*********************************************/
		
		/******************************************图形绘制类接口   开始*********************************************/
		//按时间动画箭头线
		_this.animateArrowLineInTime = function(polylineString, arrowLineSymbolObject, duration,layerId) {
			animateArrowLineInTime(polylineString, arrowLineSymbolObject, duration,layerId);
		};
		//按速度动画箭头线
		_this.animateArrowLineInSpeed = function(polylineString, arrowLineSymbolObject, speed, ratio) {
			animateArrowLineInSpeed(polylineString, arrowLineSymbolObject, speed, ratio);
		};
		//按时间动画线（线逐节点增长）
		_this.animatePolylineInTime = function(polylineString, lineSymbolObject, duration) {
			animatePolylineInTime(polylineString, lineSymbolObject, duration);
		};
		//按速度动画线（线逐节点增长
		_this.animatePolylineInSpeed = function(polylineString, lineSymbolObject, speed, ratio) {
			animatePolylineInSpeed(polylineString, lineSymbolObject, speed, ratio);
		};
		//在地图上添加点图形
		_this.addPointGraphics = function(pointsString, markerSymbolObject) {
			addPointGraphics(pointsString, markerSymbolObject);
		};
		//在地图上添加点图片图形
		_this.addPictureGraphics = function(pointsString, pictureSymbolObject) {
			addPictureGraphics(pointsString, pictureSymbolObject);
		};
		//在地图上添加线图形
		_this.addPolylineGraphics = function(polylineString, lineSymbolObject) {
			addPolylineGraphics(polylineString, lineSymbolObject);
		};
		//在地图上添加面图形
		_this.addPolygonGraphics = function(polygonString, fillSymbolObject) {
			addPolygonGraphics(polygonString, fillSymbolObject);
		};
		//在地图上添加圆
		_this.addCircle = function(center,radius,callback,centerMarkerSymbol,symbolObject,autoZoom,layerId) {
			//画圆 
			addCircle(center,radius,callback,centerMarkerSymbol,symbolObject,autoZoom,layerId);
		};
		//绘制图形统一接口 
		_this.addGraphic = function(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,
									tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration,effectRepeatCount,callback) {
			addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,
					tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration,effectRepeatCount,callback);
		};
		//绘制图形统一接口，可以绘制多个图形 
		_this.addGraphics = function(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,
									tipHeights,tipUrls,autoZoom,layerId,isEffect,duration,effectRepeatCount,callback) {
			addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,
					tipHeights,tipUrls,autoZoom,layerId,isEffect,duration,effectRepeatCount,callback);
		};
		//在地图上添加图形 <将被丢弃，请使用addGraphic>
		_this.addGraphicByErisGeoJson = function(grahpicID,drawType,geoJson) {
			addGraphicByErisGeoJson(grahpicID,drawType,geoJson);
		};
		//在地图上添加点图形和信息提示框
		_this.addPointInfoWindow = function(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoff,yoff,layerId) {
			addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoff,yoff,layerId);
		};
		//在地图上添加多边形及其信息窗
		_this.addPolygonGraphicInfoWindow = function(polygonString, fillSymbolObject, mode, title, simpleHtml, width, height) {
			addPolygonGraphicInfoWindow(polygonString, fillSymbolObject, mode, title, simpleHtml, width, height);
		};
		//鼠标绘制图形
		_this.drawGraphic = function(grahpicID,drawType,callback) {
			drawGraphic(grahpicID,drawType,callback);
		};
		//拖拽矩形框
		_this.drawExtent = function(callback) {
			drawExtent(callback);
		};
		//在地图上添加线图形并设置图形为可编辑状态 <将被丢弃，请使用editGraphic>
		_this.editPolyline = function(grahpicID,polylineJson) {
			editPolyline(grahpicID,polylineJson);
		};
		//在地图上添加面图形并设置图形为可编辑状态 <将被丢弃，请使用editGraphic>
		_this.editPolygon = function(grahpicID,polygonJson) {
			editPolygon(grahpicID,polygonJson);
		};
		//在地图上添加图形并设置图形为可编辑状态
		_this.editGraphic = function(grahpicID,geoJson) {
			editGraphic(grahpicID,geoJson);
		};
		//绘制点并进行闪烁
		_this.flashPoints = function(pointsString, delay, repeatCount, markerSymbolObject) {
			flashPoints(pointsString, delay, repeatCount, markerSymbolObject);
		};
		//绘制线并进行闪烁
		_this.flashPolyline = function(polylineString, delay, repeatCount, lineSymbolObject) {
			flashPolyline(polylineString, delay, repeatCount, lineSymbolObject);
		};
		//绘制面并进行闪烁
		_this.flashPolygon = function(polygonString, delay, repeatCount, fillSymbolObject) {
			flashPolygon(polygonString, delay, repeatCount, fillSymbolObject);
		};
		//闪烁标记，闪烁后支持鼠标交互行为
		_this.flashGraphic = function(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,
								tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration,effectRepeatCount,callback) {
			flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,
					tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration,effectRepeatCount,callback);
		};
		//闪烁标记，闪烁后支持鼠标交互行为，支持一次绘制多个标记  
		_this.flashGraphics = function(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,
								tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId,duration,effectRepeatCount,callback) {
			//闪烁标记，闪烁后支持鼠标交互行为，支持一次绘制多个标记 
			flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,
					tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId,duration,effectRepeatCount,callback);
		};
		//获取图形几何坐标 
		_this.getGraphic = function(id,callback) {
			getGraphic(id,callback);
		};
		//获取正在编辑的图形
		_this.getEditGraphic = function(callback) {
			getEditGraphic(callback);
		};
		//清空所有图形
		_this.clearAllGraphics = function() {
			clearAllGraphics();
		};
		//删除指定图层上的图形
		_this.removeGraphics = function(ids,layerId) {
			removeGraphics(ids,layerId);
		};
		//绘制路由 
		_this.drawRoute = function(grahpicID,callback) {
			drawRoute(grahpicID,callback);
		};
		//编辑路由
		_this.editRoute = function(grahpicID,routeObject,callback) {		
			editRoute(grahpicID,routeObject,callback);
		};
		//获取路由坐标
		_this.getRoute = function(grahpicID,callback) {
			getRoute(grahpicID,callback);
		};
		//定位路由
		_this.locateRoute = function(grahpicID,routeObject,callback) {
			locateRoute(grahpicID,routeObject,callback);
		};
		//获取站列坐标，解决中文乱码问题
		_this.locateRoute = function(grahpicID,callback) {
			getRouteCN(grahpicID,callback);
		};
		/******************************************图形绘制类接口   结束*********************************************/
		
		/******************************************地图缩放类接口   开始*********************************************/
		//设置地图到指定级别
		_this.setLevel = function(level) {
			setLevel(level);
		};
		//提升地图级别为更高一级
		_this.levelUp = function() {
			levelUp();
		};
		//降低当前地图级别为更低一级
		_this.levelDown = function() {
			levelDown();
		};
		//地图中心放大，提升当前地图级别为更高一级
		_this.zoomIn = function() {
			zoomIn();
		};
		//地图中心缩小，降低当前地图级别为更低一级
		_this.zoomOut = function() {
			zoomOut();
		};
		//地图以指定点为中心缩放到指定级别
		_this.zoomAt = function(level, x, y) {
			zoomAt(level, x, y);
		};
		//根据几何图形数组缩放地图
		_this.zoomGeometrys = function(geometryJsons) {
			zoomGeometrys(geometryJsons);
		};
		//地图缩放到指定范围
		_this.zoomExtent = function(xmin,ymin,xmax,ymax,callback) {
			zoomExtent(xmin,ymin,xmax,ymax,callback);
		};
		//获得当前地图级数 
		_this.getMapLevel = function(callback) {		
			getMapLevel(callback);
		};
		//获取地图最大级别
		_this.getMapMaxLevel = function(callback) {
			getMapMaxLevel(callback);
		};
		/******************************************地图缩放类接口   结束*********************************************/
		
		/******************************************地图坐标操作类接口   开始*********************************************/
		//获取地图上所选点的坐标
		_this.getXY = function(callback) {
			getXY(callback);
		};
		//获取地图中心点坐标
		_this.getMapCenter = function(callback) {
			getMapCenter(callback);
		};
		//获取地图范围坐标
		_this.getMapExtent = function(callback) {
			getMapExtent(callback);
		};
		//根据圆中心点坐标及半径得到圆的坐标串
		_this.getCircle = function(center,radius,pointSize,callback) {
			getCircle(center,radius,pointSize,callback);
		};
		//获得几何中心点坐标 
		_this.getCenterLocation = function(strGeo,callback) {
			getCenterLocation(strGeo,callback);
		};
		//获取图形矩形范围
		_this.getGeometrysExtent = function(geometryObjects,callback) {
			getGeometrysExtent(geometryObjects,callback);
		};
	/******************************************地图坐标操作类接口   结束*********************************************/
		
	/******************************************标绘操作类接口   开始*********************************************/
		//打开和关闭标绘工具条
		_this.openAndClosePlotToolbar = function() {
			openAndClosePlotToolbar();
		};
		//向地图中加载标绘图形
		_this.loadPlotGraphics = function(graphicID,graphicInfo,name,callback) {
			loadPlotGraphics(graphicID,graphicInfo,name,callback);
		};
	/******************************************标绘操作类接口   结束*********************************************/	
		
	/******************************************地图权限操作类接口   开始*********************************************/	
		
		_this.setVerifiedLayer = function(layIds) {
			//设置用户权限图层
			setVerifiedLayer(layIds);
		};
	/******************************************地图权限操作类接口   结束*********************************************/
		
	/******************************************地图监听类接口   开始*********************************************/
		//添加地图加载事件监听
		_this.addMapLoadedEventListener = function(callback) {
			addMapLoadedEventListener(callback);
		};
		//移除地图加载事件监听
		_this.removeMapLoadedEventListener = function() {
			removeMapLoadedEventListener();
		};
		//添加地图缩放事件监听
		_this.addZoomEventListener = function(callback) {
			addZoomEventListener(callback);
		};
		//移除地图缩放事件监听 
		_this.removeZoomEventListener = function() {	
			removeZoomEventListener();
		};
		//添加地图范围事件监听
		_this.addExtentEventListener = function(callback) {
			addExtentEventListener(callback);
		};
		//移除地图范围事件监听 
		_this.removeExtentEventListener = function() {
			removeExtentEventListener();
		};
	/******************************************地图监听类接口   结束*********************************************/
	
	/******************************************地图信息窗操作类接口   开始*********************************************/	
		//在地图上显示信息窗
		_this.showInfoWindow = function(x, y, title, simpleHtml, width, height) {
			showInfoWindow(x, y, title, simpleHtml, width, height);
		};
	/******************************************地图信息窗操作类接口   结束*********************************************/	
		
	/******************************************工具操作类接口   开始*********************************************/
		//根据传入的地图范围保存地图
		_this.mapDownload = function(xmin,ymin,xmax,ymax) {
			mapDownload(xmin,ymin,xmax,ymax);
		};
		//打印地图（当前地图范围）
		_this.printMap = function(title, subtitle) {
			printMap(title, subtitle);
		};
		//UTM投影法获取投影坐标
		_this.getUTMCoordinate = function(longitude, latitude,callback) {
			getUTMCoordinate(longitude, latitude,callback);
		};
		//创建菜单
		_this.createMenuList = function(id,x, y,attribute,flag,type,itemClickHandler) {
			createMenuList(id,x, y,attribute,flag,type,itemClickHandler);
		};
		//根据菜单ID移除菜单
		_this.removeMenuList = function(id) {
			removeMenuList(id);
		};
	/******************************************工具操作类接口   结束*********************************************/
	
	/******************************************Geoserver操作类接口   开始*********************************************/
		//访问geoserver服务，进行面查询
		_this.getGeometryAttributeByPolygon = function(url,typeName,outputFields,polygonStr,callbackFunc) {
			getGeometryAttributeByPolygon(url,typeName,outputFields,polygonStr,callbackFunc);
		};
		//访问geoserver服务，根据ID查询要素
		_this.getGeometryAttributeById = function(url,typeName,id,outputFields,callbackFunc) {
			getGeometryAttributeById(url,typeName,id,outputFields,callbackFunc);
		};
	/******************************************Geoserver操作类接口   结束*********************************************/
	
	/******************************************其他操作类接口   开始*********************************************/	
	/********************停气分析专题*******************************/
		//（目前供停气分析使用）
		_this.startGeoNetworkAnalysis = function(x,y,tolerance,elementType,callback) {
			startGeoNetworkAnalysis(x,y,tolerance,elementType,callback);
		};
		//从地图取点启动GeoNetwork 
		_this.startGeoNetworkAnalysisWithMap = function(callback) {
			startGeoNetworkAnalysisWithMap(callback);
		};
		//加载地名信息
		_this.loadPlaceName = function(placeName) {
			loadPlaceName(placeName);
		};
		//加载方案名称
		_this.loadSchemeName = function(schemeName) {	
			loadSchemeName(schemeName);
		};
		//加载地图书签
		_this.loadBookmark = function(bookmark) {
			loadBookmark(bookmark);
		};
		//显示地图书签列表
		_this.loadBookmarkList = function() {
			loadBookmarkList();
		};
	};
	
	
/***************************************************************************************************/
/***************************************公共方法接口   开始*********************************************/		
	/**
	 * 方法描述：初始化地图组件
	 *
	 * @param containerId 渲染地图组件所使用的页面容器ID(页面容器一般为html页面中的一个DIV)
	 */
	function initMap(containerId){
		$("#"+containerId).html(
			"<p>"+
	        	"To view this page ensure that Adobe Flash Player version 11.1.0 or greater is installed. "+
	        "</p>"+
	        "<a href=''><img src='" + document.location.protocol + "//' alt='Get Adobe Flash player' /></a>"
		);
		
		// For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
	    var swfVersionStr = "11.1.0";
	    // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
	    var xiSwfUrlStr = "playerProductInstall.swf";
	    var flashvars = {};
	    flashvars.localeChain = "zh_CN";	// 中文
	    var params = {};
	    params.quality = "high";
	    params.bgcolor = "#ffffff";
	    params.allowscriptaccess = "sameDomain";
	    params.allowfullscreen = "true";
	    params.wmode = "Opaque";	//解决flash遮挡div
	    var attributes = {};
	    attributes.id = "mapObject";
	    attributes.name = "mapObject";
	    attributes.align = "middle";
	    
	    swfobject.embedSWF(mapServerUrl+"/index.swf", containerId, "100%", "100%", swfVersionStr, xiSwfUrlStr, flashvars, params, attributes,embedswfCallback);
	    // JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
	    swfobject.createCSS("#"+containerId, "display:block;text-align:left;");
	}
	
	/**
	 * 方法描述：地图组件渲染完成后，注册鼠标滚轮事件监听等函数
	 *
	 * @param e
	 */
	function embedswfCallback(e){
		if(e.success == true){        		
			if (window.addEventListener){
		        /* DOMMouseScroll is for mozilla. */
		        window.addEventListener('DOMMouseScroll', wheel, false);
			}else{
				/* IE/Opera. */
				//window.onmousewheel = document.onmousewheel = wheel;
				document.onmousewheel = wheel;
			}
		}
	}
	/**
	 * 方法描述：鼠标滚轮事件监听处理函数
	 *
	 * @param event
	 */
	function wheel(event){
	    var delta = 0;		        
	    if (!event){
	    	/* For IE. */
	    	event = window.event;
	    } 
	    if (event.wheelDelta) {
	    	/* IE/Opera. */
	        delta = event.wheelDelta/120;
	    } else if (event.detail) { 
	    	/* ----------Mozilla case. ------------*/
	    	/* In Mozilla, sign of delta is different than in IE.Also, delta is multiple of 3.*/
	        delta = -event.detail/3;
	    }	    
	    
	    var eventObj = {	
			bubbles : event.bubbles,						
			buttonDown : event.buttonDown,						
			cancelable : event.cancelable,						
			altKey : event.altKey,						
			ctrlKey : event.ctrlKey,						
			localX : event.clientX,						
			localY : event.clientY,						
			shiftKey : event.shiftKey						
		};	
	    
	    eventObj.delta=delta;
	    
	    /** If delta is nonzero, handle it.
	     * Basically, delta is now positive if wheel was scrolled up,
	     * and negative, if wheel was scrolled down.
	     */
	   	if(delta!=0){
	   		var map=getMapApp();
	   	    map.onMousewheelHandler(eventObj);
	   	}
	    	
	    
	    /** Prevent default actions caused by mouse wheel.
	     * That might be ugly, but we handle scrolls somehow
	     * anyway, so don't bother here..
	     */
	    if (event.preventDefault){
	    	event.preventDefault();
	    }
		event.returnValue = false;
	}

	/**
	 * 方法描述：获取地图对象
	 * @returns
	 */
	function getMapApp(){
	  if (navigator.appName.indexOf ("Microsoft") !=-1){
	    return window["mapObject"];
	  } else{ 
	    return document["mapObject"];
	  }
	}

/***************************************************************************************************/
/***************************************公共方法接口   开始*********************************************/


/***************************************************************************************************/
/***************************************位置操作类接口   开始*********************************************/
	/**
	* 方法描述：地图居中显示
	* 
	* @param mapX 地图中心点X坐标
	* @param mapY 地图中心点Y坐标
	*/
	function centerAt(mapX, mapY){
		var map = getMapApp();
		map.centerAt(mapX, mapY);
	}

	/**
	* 方法描述：地图向上平移，系统将地图向上平移1/4地图高度
	*/
	function panUp(){
		var map = getMapApp();
		map.panUp();
	}

	/**
	* 方法描述：地图向下平移，系统将地图向下平移1/4地图高度
	*/
	function panDown(){
		var map = getMapApp();
		map.panDown();
	}

	/**
	* 方法描述：地图向左平移，系统将地图向左平移1/4地图宽度
	*/
	function panLeft(){
		var map = getMapApp();
		map.panLeft();
	}

	/**
	* 方法描述：地图向右平移，系统将地图向右平移1/4地图宽度
	*/
	function panRight(){
		var map = getMapApp();
		map.panRight();
	}
/******************************************位置操作类接口   结束*********************************************/
/*************************************************************************************************************/

/*************************************************************************************************************/
/******************************************图层操作类接口   开始*********************************************/

	/**
	* 方法描述：根据图层ID刷新图层
	* 
	* @param layerId 图层id，config.xml中的 layer 标签的 id 值
	*		 对于图形层，默认值：高亮层="HightlightLayer"，动画层="AnimationLayer"；
	*/
	function refreshLayerByID(layerId){
		var map = getMapApp();
		map.refreshLayerByID(layerId);
	}

	/**
	* 方法描述：根据图层名刷新图层，可刷新多个图层
	* 
	* @param layerName 图层名称，config.xml中的 layer 标签的 label 值。注意，ags 中并不限制图层重名，因此，本方法刷新所有同名图层。
	*		 对于图形层，默认值：高亮层="HightlightLayer"，动画层="AnimationLayer"；
	*/
	function refreshLayerByName(layerName){
		var map = getMapApp();
		map.refreshLayerByName(layerName);
	}

	/**
	* 方法描述：删除所有图层
	*/
	function removeAllLayers(){
		var map = getMapApp();
		map.removeAllLayers();
	}

	/**
	* 方法描述：根据图层ID清空图层上的图形
	* 
	* @param layerId 图层ID，高亮层="HightlightLayer"，动画层="AnimationLayer"；
	*/
	function clearGraphicsLayer(layerId){
		var map = getMapApp();
		map.clearGraphicsLayer(layerId);
	}  	
	/**
	 * 方法描述：设置图层是否可见
	 *
	 * @param	layerID	图层ID
	 * @param	layerVisible	图层是否可见：true为图层可见，false为图层不可见
	 *
	 */
	function layerVisibleSwitch(layerID,layerVisible)
	{
	 
		var map=getMapApp();
		map.layerVisibleSwitch(layerID,layerVisible);
	}

	/**
	 * 方法描述：查看图层是否可见
	 *
	 * @param layerid	图层id			
	 * @param callback	回调函数		
	 * 
	 */
	function getLayerVisible(layerid,callback)
	{
		var map=getMapApp();
		if(callback!=null)
		{
			callbackFunction=callback;					
			map.getLayerVisible(layerid,defaultJsCallFunctionString);	
		}
		else
		{
			map.getLayerVisible(layerid);
		}
	}
	/**
	* 方法描述：根据图层ID及标记符号对象渲染点要素层
	* 
	* @param layerId 点要素层id
	* @param markerSymbolObject 标记符号对象
	*	var markerSymbolObject={    //SimpleMarkerSymbol
	*			"style":"square",      //可选参数：circle|cross|diamond|square|triangle|x
	*			"size":15,
	*			"color":0x000000,
	*			"alpha":1,
	*			"xoffset":0,
	*			"yoffset":0,
	*			"angle":0,
	*			"outline":{   //SimpleLineSymbol
	*				"style":"solid",      //可选参数：solid|dash|dashdot|dashdotdot|dot|none
	*				"color":0x000000,
	*				"alpha":1,
	*				"width":1
	*			}}
	*/
	function setPointLayerRenderer(layerId, markerSymbolObject)
	{
		var map = getMapApp();
		map.setPointLayerRenderer(layerId, markerSymbolObject);
	}

	/**
	* 方法描述:根据图层ID及图片符号对象渲染点要素层
	* 
	* @param layerId 点要素层id
	* @param pictureMarkerSymbolObject 图片标记符号对象
	*	var pictureMarkerSymbolObject={   //PictureMarkerSymbol
	*		"width":
	*		"height":
	*		"source":
	*		"xoffset":0,
	*		"yoffset":0,
	*		"angle":0,
	*	}
	*/
	function setPointLayerPictureRenderer(layerId, pictureSymbolObject)
	{
		var map = getMapApp();
		map.setPointLayerPictureRenderer(layerId, pictureSymbolObject);
	}

	/**
	* 方法描述：根据图层ID及标记符号对象渲染线要素层
	* 
	* @param layerId 线要素层id
	* @param lineSymbolObject 线标记符号对象
	*	var lineSymbolObject={    //SimpleLineSymbol
	*		"style":"solid",      //可选参数：solid|dash|dashdot|dashdotdot|dot|none
	*		"color":0x000000,
	*		"alpha":1,
	*		"width":1
	*	}
	*/
	function setLineLayerRenderer(layerId, lineSymbolObject)
	{
		var map = getMapApp();
		map.setLineLayerRenderer(layerId, lineSymbolObject);
	}

	/**
	* 方法描述：根据图层ID及标记符号对象渲染面要素层
	* 
	* @param layerId 面要素层id
	* @param fillSymbolObject 面填充标记符号对象
	*	var fillSymbolObject={    //SimpleFillSymbol
	*			"style":"solid",      //可选参数：backwarddiagonal|diagonalcross|forwarddiagonal|horizontal|solid|vertical|none
	*			"color":0x000000,
	*			"alpha":1,
	*			"outline":{   //SimpleLineSymbol
	*				"style":"solid",      //可选参数：solid|dash|dashdot|dashdotdot|dot|none
	*				"color":0x000000,
	*				"alpha":1,
	*				"width":1
	*			}}
	*/
	function setPolygonLayerRenderer(layerId, fillSymbolObject)
	{
		var map = getMapApp();
		map.setPolygonLayerRenderer(layerId, fillSymbolObject);
	}
/******************************************图层操作类接口   结束*********************************************/
/*************************************************************************************************************/

/*************************************************************************************************************/
/******************************************图形绘制类接口   开始*********************************************/

	/**
	* 方法描述：按时间动画箭头线
	* 
	* @param polylineString 线字符串
	* @param arrowLineSymbolObject 脚本传入的箭头线符号对象（ArrowLineSymbol）
	*	var ArrowLineSymbol={
	*		"style":"solid",      //可选参数：solid|dash|dashdot|dashdotdot|dot|none
	*		"color":0x000000,
	*		"alpha":1,
	*		"width":1,
	*		"arrowLength":10,       //箭头长度
	*		"arrowWidth":1:		  //箭头宽度
	*	}
	* @param duration 持续时间（毫秒） 
	* @param layerId 在指定图层上标记，默认为“HightlightLayer”
	*/
	function animateArrowLineInTime(polylineString, arrowLineSymbolObject, duration,layerId)
	{
		var map = getMapApp();
		map.animateArrowLineInTime(polylineString, arrowLineSymbolObject,duration,layerId);
	}

	/**
	* 方法描述：按速度动画箭头线
	* 
	* @param polylineString 线字符串
	* @param arrowLineSymbolObject 脚本传入的箭头线符号对象（ArrowLineSymbol）
	* @param speed 时速（每小时移动多少地图长度）
	* @param ratio 真实动画比。实际1小时相当于多少毫秒动画时间
	*/
	function animateArrowLineInSpeed(polylineString, arrowLineSymbolObject, speed, ratio)
	{
		var map = getMapApp();
		map.animateArrowLineInSpeed(polylineString, arrowLineSymbolObject, speed, ratio);
	}

	
	/**
	* 方法描述：按时间动画线（线逐节点增长）
	* 
	* @param polylineString 线字符串
	* @param lineSymbolObject 脚本传入的线符号对象（SimpleLineSymbol）
	* @param duration 持续时间（毫秒）
	*/
	function animatePolylineInTime(polylineString, lineSymbolObject, duration)
	{
		var map = getMapApp();
		map.animatePolylineInTime(polylineString, lineSymbolObject, duration);
	}

	/**
	* 方法描述：按速度动画线（线逐节点增长）
	* 
	* @param polylineString 线字符串
	* @param lineSymbolObject 脚本传入的线符号对象（SimpleLineSymbol）
	* @param speed 时速（每小时移动多少地图长度）
	* @param ratio 真实动画比。实际1小时相当于多少毫秒动画时间
	*/
	function animatePolylineInSpeed(polylineString, lineSymbolObject, speed, ratio)
	{
		var map = getMapApp();
		map.animatePolylineInSpeed(polylineString, lineSymbolObject, speed, ratio);
	}

	
	/**
	* 方法描述：在地图上添加点图形
	* 
	* @param pointsString 点字符串（"103,35"）
	* @param markerSymbolObject 脚本传入的标记符号对象（SimpleMarkerSymbol）
	*/
	function addPointGraphics(pointsString, markerSymbolObject)
	{
		var map = getMapApp();
		map.addPointGraphics(pointsString, markerSymbolObject);
	}

	/**
	* 方法描述：在地图上添加点图片图形
	* 
	* @param pointsString 点字符串（105,30）
	* @param pictureSymbolObject 脚本传入的图片标记符号对象（PictureMarkerSymbol）
	*/
	function addPictureGraphics(pointsString, pictureSymbolObject)
	{
		var map = getMapApp();
		map.addPictureGraphics(pointsString, pictureSymbolObject);
	}

	/**
	* 方法描述：在地图上添加线图形
	* 
	* @param polylineString 线字符串（"103,35,108,42"）
	* @param lineSymbolObject 脚本传入的线标记符号对象（SimpleLineSymbol）
	*/
	function addPolylineGraphics(polylineString, lineSymbolObject)
	{
		var map = getMapApp();
		map.addPolylineGraphics(polylineString, lineSymbolObject);
	}

	/**
	* 方法描述：在地图上添加面图形
	* 
	* @param polygonString 面字符串（"103,35,108,42,109,34,103,35"）
	* @param fillSymbolObject 脚本传入的面填充标记符号对象（SimpleFillSymbol）
	*/
	function addPolygonGraphics(polygonString, fillSymbolObject)
	{
		var map = getMapApp();
		map.addPolygonGraphics(polygonString, fillSymbolObject); 
		
	}
	/**
	 * 方法描述：在地图上画圆 
	 * @param center 中心点GeoJson（{"x":105,"y":29}）
	 * @param radius	半径,为m
	 * @param callback	画圆后回调函数，返回PolygonJson,可为空
	 * @param centerMarkerSymbol 圆点标记SymbolJson，可为空
	 * @param symbolObject	图形样式Json对象,默认为空,格式参考Arcgis server Rest API之Symbol Objects
	 * @param autoZoom 是否自动缩放，默认为true
	 * @param layerId 在指定层上添加标记
	 * 
	 */
	function addCircle(center,radius,callback,centerMarkerSymbol,symbolObject,autoZoom,layerId)
	{
		var map=getMapApp();

		if(arguments.length==2)
		{
			map.addCircle(center,radius);
		}
		else if(arguments.length==3)
		{
			if(callback!=null&&callback!="")
			{
				callbackFunction=callback;
				map.addCircle(center,radius,defaultJsCallFunctionString);
			}
			else
			{
				map.addCircle(center,radius);
			}
		}else if(arguments.length==4){
			if(callback!=null&&callback!=""){
				callbackFunction=callback;
				map.addCircle(center,radius,defaultJsCallFunctionString,centerMarkerSymbol);
			}else
			{
				map.addCircle(center,radius,"",centerMarkerSymbol);
			}	
		}else if(arguments.length==5){
			if(callback!=null&&callback!=""){
				callbackFunction=callback;
				map.addCircle(center,radius,defaultJsCallFunctionString,centerMarkerSymbol,symbolObject);
			}else{
				map.addCircle(center,radius,"",centerMarkerSymbol,symbolObject);
			}	
		}else if(arguments.length==6){
			if(callback!=null&&callback!=""){
				callbackFunction=callback;
				map.addCircle(center,radius,defaultJsCallFunctionString,centerMarkerSymbol,symbolObject,autoZoom);
			}else
			{
				map.addCircle(center,radius,"",centerMarkerSymbol,symbolObject,autoZoom);
			}	
		}else if(arguments.length==7){
			if(callback!=null&&callback!=""){
				callbackFunction=callback;
				map.addCircle(center,radius,defaultJsCallFunctionString,centerMarkerSymbol,symbolObject,autoZoom,layerId);
			}else
			{
				map.addCircle(center,radius,"",centerMarkerSymbol,symbolObject,autoZoom,layerId);
			}	
		}
		
	}
	
	/**
	 * 方法描述：绘制图形统一接口 
	 * @param id	图形Id
	 * @param geometryObject 图形几何Json对象,格式参考Arcgis server Rest API之GeometryObject
	 * @param tipMode	tip显示模式，可为none\open\hover\click\doubleclick,默认为none
	 * @param attribute 属性Json对象,默认为空
	 * @param symbolObject	图形样式Json对象,默认为空,格式参考Arcgis server Rest API之Symbol Objects
	 * @param tipClass	tip类型,可为空 [值可为IFrame|None,默认为None]
	 * @param tipWidth	tip框宽度,默认为200，可为空
	 * @param tipHeight	tip框高度,默认为200，可为空		 
	 * @param tipUrl	当tipClass为IFrame时，IFrame地址,可为空
	 * @param autoZoom	是否自动缩放，默认为true
	 * @param layerId 在指定层上添加标记
	 * @param level 定位级别，只对点要素有效,默认定位到最高级别，且autoZoom=true
	 * @param isEffect 是否添加光晕特效，默认为false
	 * @param duration 光晕效果的持续时间，默认是3000毫秒
	 * @param effectRepeatCount 光晕效果的重复次数，默认是3次
	 * @param callback 回调函数，tipClass为"JsFunction"时有效
	 */
	function addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,
		tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration,effectRepeatCount,callback)
	{
		var map=getMapApp();

		if(arguments.length==2)
		{
			map.addGraphic(id,geometryObject);
		}
		else if(arguments.length==3)
		{
			map.addGraphic(id,geometryObject,tipMode);
		}
		else if(arguments.length==4)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute);
		}
		else if(arguments.length==5)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject);
		}
		else if(arguments.length==6)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass);
		}
		else if(arguments.length==7)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth);
		}
		else if(arguments.length==8)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight);
		}
		else if(arguments.length==9)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl);
		}
		else if(arguments.length==10)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom);
		}
		else if(arguments.length==11)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId);
		}
		else if(arguments.length==12)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level);
		}
		else if(arguments.length==13)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level,isEffect);
		}
		else if(arguments.length==14)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration);
		}
		else if(arguments.length==15)
		{
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration,effectRepeatCount);
		}
		else if(arguments.length==16)
		{
			callbackFunctionGraphic=callback;
			map.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration,effectRepeatCount,defaultJsCallFunctionGraphicString);
		}
	}
	/**
	 * 方法描述：绘制图形统一接口，可以绘制多个图形
	 * @param ids 图形Id数组 （长度必须与geometryObjects数组长度一致）
	 * @param geometryObjects 图形几何Json数组（长度必须与ids数组长度一致）
	 * @param tipModes	tip显示模式数组（可为空，长度可与ids数组长度一致，不一致时，其它值与第一个值一致）[单个值可为none\open\hover\click\doubleclick,默认为none]
	 * @param attributes 图形属性数组(可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致)
	 * @param symbolObjects 标记对象数组（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）
	 * @param tipClasses tip类型（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）[值可为IFrame|None]
	 * @param tipWidths tip的宽度（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）
	 * @param tipHeights	tip的高度（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）
	 * @param tipUrls	tipUrl（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）,当tipclass为IFrame时，该值不能为空
	 * @param autoZoom 是否根据图形范围自动缩放，默认为true
	 * @param layerId 在指定层上添加标记
	 * @param isEffect 是否添加光晕特效，默认为false
	 * @param duration 光晕效果的持续时间，默认是3000毫秒
	 * @param effectRepeatCount 光晕效果的重复次数，默认是3次
	 * @param callback 回调函数，tipClass为"JsFunction"时有效
	 */
	function addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,
		tipHeights,tipUrls,autoZoom,layerId,isEffect,duration,effectRepeatCount,callback){
		var map=getMapApp();
		if(arguments.length==2){
			map.addGraphics(ids,geometryObjects);
		}
		else if(arguments.length==3){
			map.addGraphics(ids,geometryObjects,tipModes);
		}else if(arguments.length==4)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes);
		}else if(arguments.length==5)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects);
		}else if(arguments.length==6)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses);
		}else if(arguments.length==7)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths);
		}else if(arguments.length==8)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights);
		}else if(arguments.length==9)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls);
		}else if(arguments.length==10)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom);
		}else if(arguments.length==11)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId);
		}else if(arguments.length==12)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId,isEffect);
		}else if(arguments.length==13)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId,isEffect,duration);
		}else if(arguments.length==14)
		{
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId,isEffect,duration,effectRepeatCount);
		}else if(arguments.length==15){
			callbackFunctionGraphic=callback;
			map.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId,isEffect,duration,effectRepeatCount,defaultJsCallFunctionGraphicString);
		}
		
	}
	/**
	* 方法描述：在地图上添加图形 <将被丢弃，请使用addGraphic>
	* @param grahpicID 图形ID
	* @param drawType 类型Point/Polyline/Polygon/Multipoint/Envelope
	* @param geoJson ArcGIS Json Geometry Objects 
	* @return 
	* 
	*/
	function addGraphicByErisGeoJson(grahpicID,drawType,geoJson){
		var map=getMapApp();
		map.addGraphicByErisGeoJson(grahpicID,drawType,geoJson);			
	}
	/**
	 * 方法描述：在地图上添加点图形和信息提示框
	 *  
	 * @param id 点图形ID
	 * @param x  x坐标
	 * @param y  y坐标
	 * @param markerSymbolObject  标记符号对象（SimpleMarkerSymbol）
	 * @param mode  tip显示模式，可为none\open\hover\click\doubleclick,默认为open
	 * @param title 提示框标题
	 * @param simpleHtml 提示文本，html
	 * @param tipwidth 提示框宽度
	 * @param tipheight 提示框高度
	 * @param xoff
	 * @param yoff
	 * @param layerId 添加标记的图层ID
	 * 
	 */			
	function addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoff,yoff,layerId){
		var map=getMapApp();	
		if(arguments.length==7){
			map.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml);
		}else if(arguments.length==8){
			map.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width);
		}else if(arguments.length==9){
			map.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height);
		}else if(arguments.length==10){
			map.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoff);
		}else if(arguments.length==11){
			map.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoff,yoff);
		}else if(arguments.length==12){
			map.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoff,yoff,layerId);
		}
	}
	/**
	* 方法描述：在地图上添加多边形及其信息窗
	* 
	* @param polygonString 面字符串
	* @param fillSymbolObject 脚本传入的线符号对象（SimpleLineSymbol）
	* @param mode tip显示模式，可为none\open\hover\click\doubleclick,默认为click  模式：click 单击打开模式，hover 悬停打开模式，默认为 click
	* @param title 信息窗的标题
	* @param simpleHtml 信息窗的内容（仅支持简单 HTML，即文本、图片、链接等）
	* @param width 信息窗的宽度，默认 300 像素
	* @param height 信息窗的高度，默认 200 像素
	*/
	function addPolygonGraphicInfoWindow(polygonString, fillSymbolObject, mode, title, simpleHtml, width, height)
	{
		var map = getMapApp();
		map.addPolygonGraphicInfoWindow(polygonString, fillSymbolObject, mode, title, simpleHtml, width, height);
	}
	/**
	* 方法描述：鼠标绘制图形
	* @param grahpicID 图形唯一ID
	* @param drawType 图形类型:freehandpolygon/freehandpolyline/polyline/polygon/extent/mappoint/circle
	* @param callback 回调函数，返回绘制的图形JSON字符串
	*/
	function drawGraphic(grahpicID,drawType,callback)
	{	
		try {
			var map=getMapApp();
			
			if(arguments.length==2){												
				map.drawGraphic(grahpicID,drawType); 
			}
			if(arguments.length==3){
				callbackFunction=callback;
				map.drawGraphic(grahpicID,drawType,defaultJsCallFunctionString); 
			}		
		}catch(exception){
			alert(exception);					
		}
	}

	/**
	 * 方法描述：拖拽矩形框
	 *
	 * @param callback	回调函数，返回图形JSON字符串		
	 * 
	 */
	function drawExtent(callback)
	{
		var map=getMapApp();
		if(callback!=null){
			callbackFunction=callback;					
			map.drawExtent(defaultJsCallFunctionString);	
		}else{
			map.drawExtent();
		}
	}
	
	
	/**
	* 方法描述：在地图上添加线图形并设置图形为可编辑状态 <将被丢弃，请使用editGraphic>
	* @param grahpicID 图形ID
	* @param polylineJson 线坐标对象，如:{"paths":[[[438489.08291525743,2557275.576483189],[485637.83291525743,2582993.076483189],[508974.08291525743,2568229.326483189],[517546.58291525743,2556799.326483189]]],"spatialReference":{"wkid":2383}};
	*/
	function editPolyline(grahpicID,polylineJson)
	{
		var map=getMapApp();	
		try {
			if(arguments.length==2){									
				map.editPolyline(grahpicID,polylineJson);	
			}	
		}catch(exception){
			alert(exception);					
		}
	}
	/**
	* 方法描述：在地图上添加面图形并设置图形为可编辑状态 <将被丢弃，请使用editGraphic>
	* @param grahpicID 图形ID
	* @param polygonJson 面坐标对象，如: {"rings":[[[468738.2648499999,2578778.4647500003],[514934.5148499999,2597828.4647500003],[529698.2648499999,2566395.9647500003],[510648.2648499999,2548298.4647500003],[468738.2648499999,2578778.4647500003]]],"spatialReference":{"wkid":2383}};
	*/
	function editPolygon(grahpicID,polygonJson)
	{
		var map=getMapApp();
		try {
			if(arguments.length==2){									
				map.editPolygon(grahpicID,polygonJson);	
			}	
		}catch(exception){
			alert(exception);					
		}
	}
	/**
	 * 方法描述：在地图上添加图形并设置图形为可编辑状态
	 * @param grahpicID 图形ID
	 * @param geoJson Polyline或Polygon Json对象
	 */
	function editGraphic(grahpicID,geoJson)
	{
		var map=getMapApp();		
		try {
			if(arguments.length==2){									
				map.editGraphic(grahpicID,geoJson);	
			}	
		}catch(exception){
			alert(exception);					
		}
	}
	

	
	/**
	* 方法描述：绘制点并进行闪烁
	* 
	* @param pointsString 点字符串（"103,35"）
	* @param delay 闪烁间隔（毫秒）
	* @param repeatCount 闪烁次数
	* @param markerSymbolObject 脚本传入的标记符号对象（SimpleMarkerSymbol）
	*/
	function flashPoints(pointsString, delay, repeatCount, markerSymbolObject){
		var map = getMapApp();
		map.flashPoints(pointsString, delay, repeatCount, markerSymbolObject);
	}

	/**
	* 方法描述：绘制线并进行闪烁
	* 
	* @param polylineString 线字符串（"103,35,108,42"）
	* @param delay 闪烁间隔（毫秒）
	* @param repeatCount 闪烁次数
	* @param markerSymbolObject 脚本传入的线标记符号对象（SimpleLineSymbol）
	*/
	function flashPolyline(polylineString, delay, repeatCount, lineSymbolObject){
		var map = getMapApp();
		map.flashPolyline(polylineString, delay, repeatCount, lineSymbolObject);
	}

	/**
	* 方法描述：绘制面并进行闪烁
	* 
	* @param polylineString 面字符串（"103,35,108,42,109,34,103,35"）
	* @param delay 闪烁间隔（毫秒）
	* @param repeatCount 闪烁次数
	* @param markerSymbolObject 脚本传入的面填充标记符号对象（SimpleFillSymbol）
	*/
	function flashPolygon(polygonString, delay, repeatCount, fillSymbolObject){
		var map = getMapApp();
		map.flashPolygon(polygonString, delay, repeatCount, fillSymbolObject);
	}
	/**
	 * 方法描述：闪烁标记，闪烁后支持鼠标交互行为
	 *  
	 * @param id 图形Id
	 * @param geometryObject 图形几何Json对象,格式参考Arcgis server Rest API之GeometryObject
	 * @param symbolObject 图形样式Json对象,默认为空,格式参考Arcgis server Rest API之Symbol Objects
	 * @param delay 闪烁间隔（毫秒）
	 * @param repeatCount 闪烁次数 
	 * @param tipMode tip显示模式，可为none\open\hover\click\doubleclick,默认为none
	 * @param attribute 属性Json对象,默认为空		
	 * @param tipClass tip类型,可为空 [值可为IFrame|None,默认为None]
	 * @param tipWidth tip框宽度,默认为200，可为空
	 * @param tipHeight tip框高度,默认为200，可为空		
	 * @param tipUrl 当tipClass为IFrame时，IFrame地址,可为空
	 * @param autoZoom 是否自动缩放,默认为true
	 * @param isEffect 是否添加光晕特效，默认为false
	 * @param level 定位级别，只对点要素有效,默认定位到最高级别
	 * @param layerId 在指定层上添加标记,默认为高亮层"HightlightLayer"
	 * @param duration 光晕效果的持续时间，默认是3000毫秒
	 * @param effectRepeatCount 光晕效果的重复次数，默认是3次
	 * @param callback 回调函数，tipClass为"JsFunction"时有效
	 */
	function flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,
	tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration,effectRepeatCount,callback)
	{
		var map=getMapApp();

		if(arguments.length==2){
			map.flashGraphic(id,geometryObject);
		}
		else if(arguments.length==3){
			map.flashGraphic(id,geometryObject,symbolObject);
		}
		else if(arguments.length==4){
			map.flashGraphic(id,geometryObject,symbolObject,delay);
		}
		else if(arguments.length==5){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount);
		}
		else if(arguments.length==6){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode);
		}
		else if(arguments.length==7){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute);
		}
		else if(arguments.length==8){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass);
		}
		else if(arguments.length==9){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth);
		}
		else if(arguments.length==10){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight);
		}
		else if(arguments.length==11){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl);
		}
		else if(arguments.length==12){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom);
		}
		else if(arguments.length==13){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect);
		}
		else if(arguments.length==14){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level);
		}
		else if(arguments.length==15){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level,layerId);
		}
		else if(arguments.length==16){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration);
		}
		else if(arguments.length==17){
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration,effectRepeatCount);
		}
		else if(arguments.length==18){
			callbackFunctionGraphic=callback;
			map.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration,effectRepeatCount,defaultJsCallFunctionGraphicString);
		}
	}

	/**
	 * 方法描述：闪烁标记，闪烁后支持鼠标交互行为，支持一次绘制多个标记  
	 * @param ids 图形Id数组 （长度必须与geometryObjects数组长度一致）
	 * @param geometryObjects 图形几何Json数组（长度必须与ids数组长度一致）
	 * @param symbolObjects 标记对象数组（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）
	 * @param delay 闪烁间隔（毫秒）
	 * @param repeatCount 闪烁次数 
	 * @param tipModes tip显示模式数组（可为空，长度可与ids数组长度一致，不一致时，其它值与第一个值一致）[单个值可为none\open\hover\click\doubleclick\doubleclick,默认为none]
	 * @param attributes 图形属性数组(可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致)		
	 * @param tipClasses tip类型（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）[值可为IFrame|None]
	 * @param tipWidths tip的宽度（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）
	 * @param tipHeights	tip的高度（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）	
	 * @param tipUrls	tipUrl（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）,当tipclass为IFrame时，该值不能为空
	 * @param autoZoom 是否自动缩放，默认是true
	 * @param isEffect 是否添加光晕特效，默认为false
	 * @param layerId 在指定层上添加标记,默认为高亮层"HightlightLayer"
	 * @param duration 光晕效果的持续时间，默认是3000毫秒
	 * @param effectRepeatCount 光晕效果的重复次数，默认是3次
	 * @param callback 回调函数，tipClass为"JsFunction"时有效
	 */
	function flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,
	tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId,duration,effectRepeatCount,callback)
	{
		var map=getMapApp();

		if(arguments.length==2)
		{
			map.flashGraphics(ids,geometryObjects);
		}
		else if(arguments.length==3)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects);
		}
		else if(arguments.length==4)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay);
		}
		else if(arguments.length==5)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount);
		}
		else if(arguments.length==6)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes);
		}
		else if(arguments.length==7)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes);
		}
		else if(arguments.length==8)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipMode,attributes,tipClasses);
		}
		else if(arguments.length==9)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths);
		}
		else if(arguments.length==10)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights);
		}
		else if(arguments.length==11)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls);
		}
		else if(arguments.length==12)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom);
		}
		else if(arguments.length==13)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect);
		}
		else if(arguments.length==14)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId);
		}
		else if(arguments.length==15)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId,duration);
		}
		else if(arguments.length==16)
		{
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId,duration,effectRepeatCount);
		}
		else if(arguments.length==17)
		{
			callbackFunctionGraphic=callback;
			map.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId,duration,effectRepeatCount,defaultJsCallFunctionGraphicString);
		}
	}
	
	/**
	 * 方法描述：获取图形几何坐标 
	 * @param id 图形ID
	 * @param callbackFunction 回调js函数，返回图形坐标JSON字符串
	 * 
	 */
	function getGraphic(id,callback){
		var map=getMapApp();
		if(callback!=null){
			callbackFunction=callback;					
			map.getGraphic(id,defaultJsCallFunctionString);	
		}
	}
    /**
	* 方法描述：获取正在编辑的图形
	* @param callback js回调函数对象，返回正在编辑图形的坐标JSON字符串
	*/
	function getEditGraphic(callback){	
		if(callback==null) {
			return;	
		}
		var map=getMapApp();
		callbackFunction=callback;											
		map.getEditGraphic(defaultJsCallFunctionString);	
	
	} 
	/**
	* 方法描述：清空所有图形
	*/
	function clearAllGraphics(){
		var map = getMapApp();
		map.clearAllGraphics();
	}
	/**
	 * 方法描述：删除指定图层上的图形
	 * 
	 * @param ids 图形Id集合字符串，以逗号隔开;或用*号表示删除指定图层上的全部图形标记
	 * @param layerId 标记图层ID，默认为"HightlightLayer"
	 * 
	 */		
	function removeGraphics(ids,layerId){
		var map=getMapApp();

		if(arguments.length==1){
			map.removeGraphics(ids);
		}
		else if(arguments.length==2){
			map.removeGraphics(ids,layerId);
		}
	}
	/**
	 * 方法描述：绘制路由 
	 * @param grahpicID 路由图形id
	 * @param callbackFunction 绘制完后回调函数，返回路由信息JSON字符串
	 * 
	 */
	function drawRoute(grahpicID,callback)
	{
		var map=getMapApp();
		if(callback!=null){
			callbackFunction=callback;					
			map.drawRoute(grahpicID,defaultJsCallFunctionString);	
		}else{
			map.drawRoute(grahpicID);
		}
	}

	/**
	 * 方法描述：编辑路由
	 * @param grahpicID 路由图形id
	 * @param routeObject 路由Json对象,格式参考对象Json说明之RouteObject
	 * @param callbackFunction 编辑完后回调函数,返回路由信息JSON字符串
	 * 
	 */
	function editRoute(grahpicID,routeObject,callback){
		var map=getMapApp();
		if(callback!=null){
			callbackFunction=callback;					
			map.editRoute(grahpicID,routeObject,defaultJsCallFunctionString);	
		}else{
			map.editRoute(grahpicID,routeObject);
		}
	}


	/**
	 * 方法描述：获取路由坐标
	 * @param grahpicID 路由图形id
	 * @param callbackFunction 回调函数 返回返回路由信息JSON字符串
	 * 
	 */
	function getRoute(grahpicID,callback){
		var map=getMapApp();
		if(callback!=null){
			callbackFunction=callback;	
			map.getRoute(grahpicID,defaultJsCallFunctionString);
		}
	}

	/**
	 * 方法描述：定位路由
	 * @param grahpicID 路由图形id
	 * @param routeObject 路由Json对象,格式参考对象Json说明之RouteObject
	 * @param callbackFunction 编辑完后回调函数,返回空值
	 * 
	 */
	function locateRoute(grahpicID,routeObject,callback){
		var map=getMapApp();
		if(callback!=null){
			callbackFunction=callback;					
			map.locateRoute(grahpicID,routeObject,defaultJsCallFunctionString);	
		}
		else{
			map.locateRoute(grahpicID,routeObject);
		}
	}
	/**
	 * 方法描述：获取站列坐标，解决中文乱码问题
	 * @param grahpicID 路由图形id
	 * @param callbackFunction 编辑完后回调函数 返回RouteObject
	 * 
	 */
	function getRouteCN(grahpicID,callback){
		var map=getMapApp();
		if(callback!=null){
			callbackFunction=callback;					
			map.getRouteCN(grahpicID,defaultJsCallFunctionString);	
		}
	}

/******************************************图形绘制类接口   结束*********************************************/
/*************************************************************************************************************/	


/*************************************************************************************************************/	
/******************************************地图缩放类接口   开始*********************************************/
	/**
	* 方法描述：设置地图到指定级别
	* 
	* @param level 地图级别
	*/
	function setLevel(level){
		var map = getMapApp();
		map.setLevel(level);
	}       

	/**
	* 方法描述：提升地图级别为更高一级
	*/
	function levelUp(){
		var map = getMapApp();
		map.levelUp();
	} 

	/**
	* 方法描述：降低当前地图级别为更低一级
	*/
	function levelDown(){
		var map = getMapApp();
		map.levelDown();
	} 

	/**
	* 方法描述：地图中心放大，提升当前地图级别为更高一级
	*/
	function zoomIn(){
		var map = getMapApp();
		map.zoomIn();
	} 

	/**
	* 方法描述：地图中心缩小，降低当前地图级别为更低一级
	*/
	function zoomOut(){
		var map = getMapApp();
		map.zoomOut();
	}
 	/**
	* 方法描述：地图以指定点为中心缩放到指定级别
	* @param level  地图级别
	* @param x 中心点x坐标
	* @param y 中心点y坐标
	*/
	function zoomAt(level, x, y){
		var map = getMapApp();
		map.zoomAt(level, x, y);
	}
	/**
	 * 方法描述：根据几何图形数组缩放地图
	 * @param geometryJsons	Json几何图形数组：Polyline|Polygon|Multipoint|Envelope|Point
	 * 
	 */
	function zoomGeometrys(geometryJsons){
		var map=getMapApp();
		map.zoomGeometrys(geometryJsons);
	}
	
	/**
	 * 方法描述：地图缩放到指定范围
	 * @param xmin 地图最小范围x坐标
	 * @param ymin 地图最小范围y坐标
	 * @param xmax 地图最大范围x坐标
	 * @param ymax 地图最大范围y坐标
	 * @param callback 回调函数，无返回值
	 */
	function zoomExtent(xmin,ymin,xmax,ymax,callback){
		var map=getMapApp();
		if(arguments.length==4){
			map.zoomExtent(xmin,ymin,xmax,ymax);
		}else if(arguments.length==5){
			callbackFunction=callback;
			map.zoomExtent(xmin,ymin,xmax,ymax,defaultJsCallFunctionString);
		}
	}
	/**
	 * 方法描述：获得当前地图级数 
	 * @param callback 回调函数，返回当前地图级别
	 * 
	 */
	function getMapLevel(callback){
		var map=getMapApp();
		if(callback!=null){
			callbackFunction=callback;					
			map.getMapLevel(defaultJsCallFunctionString);	
		}
	}
	/**
	* 方法描述：获取地图最大级别
	* @param callback 回调函数,返回地图最大级别	
	*/
	function getMapMaxLevel(callback){
	   var map=getMapApp();
	   var level =  map.getMapMaxLevel();
	   callback(level);
	}

	
/******************************************地图缩放类接口   结束*********************************************/
/*************************************************************************************************************/	

/*************************************************************************************************************/		
/******************************************地图坐标操作类接口   开始*********************************************/
	/**
	* 方法描述：获取地图上所选点的坐标
	* @param callback js回调函数，返回坐标字符串，坐标以逗号隔开，为"x,y"：104.6079117,44.0099340
	*/
	function getXY(callback){	
		try {		
			if(callback==null){
				return ;
			}			
			var map=getMapApp();
			callbackFunction=callback;					
			map.getXY(defaultJsCallFunctionString);			
		}catch(exception){
			alert(exception);		
		}					
	}
	/**
	  * 方法描述：获取地图中心点坐标
	  * @param callback js回调函数，返回地图中心点坐标{"y":30.304238653182985,"x":101.94291534423829}
	  *
	  */
	function getMapCenter(callback){
		var map=getMapApp();
		var point = map.getMapCenter();
		callback(point);
	}

	/**
	 * 方法描述：获取地图范围坐标
	 * @param callback js回调函数，返回地图范围坐标 {"xmax":193.12386108765463,"ymin":-5.863568635437275,"xmin":10.761969600821942,"ymax":66.47204594180324}
	 *
	 */
	function getMapExtent(callback){
		var map=getMapApp();
		var extent =  map.getMapExtent();
		callback(extent);
	}
	/**
	* 方法描述：根据圆中心点坐标及半径得到圆的坐标串
	* @param center 中心点坐标 JSON对象{"x":734109.673,"y":3506901.672}
	* @param radius 半径（米）
	* @param pointSize 点的个数
	* @param callback js回调函数，返回圆的坐标串{"rings":[[[734209.673,3506901.672],[734140.5746994375,3506806.56634837],[734028.7713005624,3506842.8934747707],[734028.7713005624,3506960.450525229],[734140.5746994375,3506996.7776516294],[734209.673,3506901.672]]]}	
	*/
	function getCircle(center,radius,pointSize,callback){
	   var map=getMapApp();
	   var circle = map.getCircle(center,radius,pointSize);
	   callback(circle);
	}
	/**
	 * 方法描述：获得几何中心点坐标 
	 * @param strGeo 几何对象JSON字符串{"rings":[[[103,35],[108,42],[109,34],[103,35]]],"spatialReference":{"wkid":2383}}
	 * @param callback js回调函数，返回中心点坐标字符串{"y":38,"x":106}
	 * 
	 */
	function getCenterLocation(strGeo,callback){
		var map=getMapApp();
		var center = map.getCenterLocation(strGeo);
		callback(center);	
	} 
	/**
	 * 方法描述：获取图形矩形范围
	 * @param geometryObjects 几何对象数组[{"rings":[[[103,35],[108,42],[109,34],[103,35]]],"spatialReference":{"wkid":2383}},{"x" : 103.1,"y" : 35.1}]
	 * @param callback js回调函数，返回范围坐标字符串{"ymax":43.1774681,"xmax":103.1,"xmin":88.95762588,"ymin":35.1}
	 * 
	 */
	function getGeometrysExtent(geometryObjects,callback){
		var map=getMapApp();
		var extent = map.getGeometrysExtent(geometryObjects);
		callback(extent);
	}
	
/******************************************地图坐标操作类接口   结束*********************************************/
/*************************************************************************************************************/		
	

/*************************************************************************************************************/	
/******************************************标绘操作类接口   开始*********************************************/
	/**
	 * 方法描述：打开和关闭标绘工具条
	 *
	 */
	function openAndClosePlotToolbar(){
		var map=getMapApp();
		map.openAndClosePlotToolbar();
	}
	/**
	 * 方法描述：向地图中加载标绘图形
	 *
	 * @param graphicID		所要添加的图形ID
	 * @param graphicInfo	所要添加的图形信息
	 * @param name	
	 * @param callback	回调函数，返回图形ID 
	 *		var graphicInfo={
	 *			"marker":{            //添加简单标记
	 *				"features":[
	 *					{
	 *						"attributes":
	 *						{
	 *							"alpha":1,
	 *							"style":"solid",
	 *							"size":12,
	 *							"color":0xFF0000
	 *						},
	 *						"geometry":{}
	 *					}
	 *				]
	 *			},
	 *			"text":{
	 *				
	 *			}
	 *		}
	 */
	function loadPlotGraphics(graphicID,graphicInfo,name,callback){
		var map=getMapApp();
		if(callback!=null){
			callbackFunction=callback;					
			map.loadPlotGraphics(graphicID,graphicInfo,name,defaultJsCallFunctionString);	
		}else if(name!=null){
			map.loadPlotGraphics(graphicID,graphicInfo,name);	
		}else{
			map.loadPlotGraphics(graphicID,graphicInfo);
		}
	}


/******************************************标绘操作类接口   结束*********************************************/
/*************************************************************************************************************/		



/*************************************************************************************************************/		
/******************************************地图权限操作类接口   开始*********************************************/

	/*
	 * 方法描述：设置用户权限图层
	 * @param layIds 图层id集合，用逗号隔开
	 */
	function setVerifiedLayer(layIds){
		var map=getMapApp();
		map.setVerifiedLayer(layIds);
	}

/******************************************地图权限操作类接口   结束*********************************************/
/*************************************************************************************************************/	


/*************************************************************************************************************/		
/******************************************地图监听类接口   开始*********************************************/

	/**
	 * 方法描述：添加地图缩放事件监听 
	 * @param callback JS回调函数
	 * 
	 */
	function addMapLoadedEventListener(callback){
		var map=getMapApp();
		if(callback!=null){
			mapLoadedEventCallFunction=callback;
			map.addMapLoadedEventListener(mapLoadedEventBriage);
		}
	}
	/**
	 * 方法描述：移除地图加载事件监听 
	 * 
	 */
	function removeMapLoadedEventListener(){
		var map=getMapApp();
		map.removeMapLoadedEventListener();
	}


	
	/**
	 * 方法描述：添加地图缩放事件监听 
	 * @param callback JS回调函数
	 * 
	 */
	function addZoomEventListener(callback){
		var map=getMapApp();
		if(callback!=null){
			zoomEventCallFunction=callback;
			map.addZoomEventListener(zoomEventBriage);
		}
	}

	/**
	 * 方法描述：移除地图缩放事件监听 
	 * 
	 */
	function removeZoomEventListener(){
		var map=getMapApp();
		map.removeZoomEventListener();
	}
	
	
	 /**
	  * 方法描述：添加地图范围事件监听
	  *
	  * @param callback	回调函数，返回地图范围坐标，坐标以逗号隔开，为"xmin,ymin,xmax,ymax"
	  *
	  */
	function addExtentEventListener(callback){
		var map=getMapApp();
		if(callback!=null){
			extentEventCallFunction=callback;
			map.addExtentEventListener(extentEventBriage);
		}
	}

	/**
	 * 方法描述：移除地图范围事件监听 
	 */
	function removeExtentEventListener(){
		var map=getMapApp();
		map.removeExtentEventListener();
	}

/******************************************地图监听类接口   结束*********************************************/
/*************************************************************************************************************/	



/*************************************************************************************************************/	
/******************************************地图信息窗操作类接口   开始*********************************************/
	/**
	* 方法描述：在地图上显示信息窗
	* 
	* @param x 显示位置的 x 坐标
	* @param y 显示位置的 y 坐标
	* @param title 信息窗的标题
	* @param simpleHtml 信息窗的内容（仅支持简单 HTML，即文本、图片、链接等）
	* @param width 信息窗的宽度，默认 300 像素
	* @param height 信息窗的高度，默认 200 像素
	*/
	function showInfoWindow(x, y, title, simpleHtml, width, height){
		var map = getMapApp();
		map.showInfoWindow(x, y, title, simpleHtml, width, height);
	}

/******************************************地图信息窗操作类接口   结束*********************************************/
/*************************************************************************************************************/	




/*************************************************************************************************************/	
/******************************************工具操作类接口   开始*********************************************/
	/**
	 * 方法描述：根据传入的地图范围保存地图
	 *
	 * @param xmin	地图最小范围x坐标	
	 * @param ymin	地图最小范围y坐标
	 * @param xmax	地图最大范围x坐标	
	 * @param ymax	地图最大范围y坐标
	 */
	function mapDownload(xmin,ymin,xmax,ymax){
		var map=getMapApp();
		map.mapDownload(xmin,ymin,xmax,ymax);
	}
	
	/**
	* 方法描述：打印地图（当前地图范围）
	* 
	* @param title 正标题
	* @param subtitle 副标题
	*/
	function printMap(title, subtitle){
		var map = getMapApp();
		map.printMap(title, subtitle);
	}
	
	/**
	* 方法描述：UTM投影法获取投影坐标
	* @param longitude 经度
	* @param latitude  纬度
	* @return 投影坐标字符串{"y":3601054.069829537,"x":489362.4879181923}
	*/
	function getUTMCoordinate(longitude, latitude,callback){
	   var map=getMapApp();
	   var coordinate =  map.getUTMCoordinate(longitude, latitude);
	   callback(coordinate);
	}

	/**
	* 方法描述：创建菜单
	* @param id 菜单id 
	* @param x  菜单显示位置x坐标
	* @param y  菜单显示位置y坐标
	* @param attribute  属性
	* @param flag  是否添加收缩按钮
	* @param type 菜单类型：list|tree
	* @param itemClickHandler 菜单项单击事件处理函数名称
	*/
	function createMenuList(id,x, y,attribute,flag,type,itemClickHandler){
	   var map=getMapApp();
	   if(arguments.length==4){
	      map.createMenuList(id,x, y,attribute);
	   }else if(arguments.length==5){
	   	  map.createMenuList(id,x, y,attribute,flag);
	   }else if(arguments.length==6){
	  	  map.createMenuList(id,x, y,attribute,flag,type);
	   }else if(arguments.length==7){
	  	  itemClickFunction = itemClickHandler;
	  	  map.createMenuList(id,x, y,attribute,flag,type,itemClickHandlerString);
	   }
	}

	/**
	* 方法描述：根据菜单ID移除菜单
	* @param id 菜单ID 
	*/
	function removeMenuList(id){
	   var map=getMapApp();
	   map.removeMenuList(id);
	}

/******************************************工具操作类接口   结束*********************************************/
/*************************************************************************************************************/	


/*************************************************************************************************************/	
/******************************************Geoserver操作类接口   开始*********************************************/
	/**
	* 方法描述：访问geoserver服务，进行面查询
	* @param url geoserver服务地址：形如(http://服务器名：端口号//geoserver/wfs)
	* @param typeName 图层名，形如（ChinaMap:Wellpos）
	* @param outputFields 输出字段，用逗号隔开的字符串，默认输出id+outputFields
	* @param polygonStr 面坐标串，形如（x1,y1 x2,y2 x3,y3 .....x1,y1）
	* @param callbackFunc 回调函数
	*/
	function getGeometryAttributeByPolygon(url,typeName,outputFields,polygonStr,callbackFunc){
		var outResult =  new Array();
		var filter;
		filter="<Filter><Intersects><PropertyName>the_geom</PropertyName>";
		filter+="<Polygon><outerBoundaryIs><LinearRing><coordinates>"+polygonStr;
		filter+="</coordinates></LinearRing></outerBoundaryIs></Polygon></Intersects></Filter>";
		//解决跨域ajax不能使用问题
		$.support.cors = true;
	    $.ajax({
	    	async: false,
			url:url+'?format_options=callback:getJson',
			type:"post",
			data:{"typeName":typeName,"version":"1.0.0","outputFormat":"text/javascript","filter":filter,"request":"getFeature","service":"wfs","propertyName":outputFields},
			dataType: 'jsonp',
			jsonp:"callback",
	    	jsonpCallback: 'getJson',
			success:function(result){
				var features = result.features;  //数组
				$.each(features, function (n, value) { 
					 var obj = new Object();
					 obj=value.properties;
		             var id = value.id.substr(value.id.lastIndexOf(".")+1);
		             obj.id=id;	
		             outResult[n]=obj;	
		          }); 
		          callbackFunc(outResult);
			},
			error:function(result){
				alert("查询失败");
			}
		});	
	}
	/**
	* 方法描述：访问geoserver服务，根据ID查询要素
	* @param url geoserver服务地址：形如(http://服务器名：端口号//geoserver/wfs)
	* @param typeName 图层名，形如（ChinaMap:Wellpos）
	* @param id 要素ID
	* @param outputFields 输出字段，用逗号隔开的字符串，默认输出id+outputFields
	* @param callbackFunc 回调函数
	*/
	function getGeometryAttributeById(url,typeName,id,outputFields,callbackFunc){
		var filter;
		queryId = typeName.split(":")[1]+"."+id;
		filter="<Filter><FeatureId fid='"+queryId+"'></FeatureId></Filter>";
		//解决跨域ajax不能使用问题
		$.support.cors = true;
		 $.ajax({
		 	async: false,
			url:url+'?format_options=callback:getJson',
			type:"post",
			data:{"typeName":typeName,"version":"1.0.0","outputFormat":"text/javascript","filter":filter,"request":"getFeature","service":"wfs","propertyName":outputFields},
			dataType: 'jsonp',
			jsonp:"callback",
	    	jsonpCallback: 'getJson',
			success:function(result){
				var features = result.features;  //数组
				if(features.length>0){
					outResult = features[0].properties;
				}
				outResult.id=id;
				callbackFunc(outResult);
			},
			error:function(result){
				alert("查询失败");
			}
		});
	}


/******************************************Geoserver操作类接口   结束*********************************************/
/*************************************************************************************************************/	


/*************************************************************************************************************/	
/******************************************其他操作类接口   开始*********************************************/
	/********************停气分析专题*******************************/
	/**
	* 方法描述：启动GeometryNetworkAnalysis（目前供停气分析使用） 
	* @param x 类型：Number
	* @param y 类型：Number
	* @param tolerance 类型：Number 容差,可为空
	* @param elementType 类型：String 容差,可为空 值为junction/edge/both
	* @param callback 回调JS函数,可为空
	*/
	function startGeoNetworkAnalysis(x,y,tolerance,elementType,callback){
		var map=getMapApp();
		if(arguments.length==2){
			map.startGeoNetworkAnalysis(x,y);
		}else if(arguments.length==3){
			map.startGeoNetworkAnalysis(x,y,tolerance,elementType);
		}else if(arguments.length==4){
			map.startGeoNetworkAnalysis(x,y,tolerance,elementType);
		}else if(arguments.length==5){
			if(callback!=null){
				callbackFunction=callback;
				map.startGeoNetworkAnalysis(x,y,tolerance,elementType,defaultJsCallFunctionString);
			}else{
				map.startGeoNetworkAnalysis(x,y,tolerance,elementType);
			}
		}
	}

	/**
	* 方法描述：从地图取点启动GeoNetwork 
	* @param callback 回调JS函数,可为空
	* 
	*/
	function startGeoNetworkAnalysisWithMap(callback){
		var map=getMapApp();
		if(arguments.length==0){
			map.startGeoNetworkAnalysisWithMap();
		}else if(arguments.length==1){
			if(callback!=null){
				callbackFunction=callback;
				map.startGeoNetworkAnalysisWithMap(defaultJsCallFunctionString);
			}else{
				map.startGeoNetworkAnalysisWithMap();
			}		
		}
	}
	
	/**
	 * 方法描述：加载地名信息
	 * @param placeName	地名信息，JSON格式
	 *
	 */
	function loadPlaceName(placeName){
		var map=getMapApp();
		map.loadPlaceName(placeName);
	}

	/**
	 * 方法描述：加载方案名称
	 * @param schemeName	方案名称
	 *
	 */
	function loadSchemeName(schemeName){
		var map=getMapApp();
		map.loadSchemeName(schemeName);
	}

	/**
	 * 方法描述：加载地图书签
	 * @param	bookmark	地图书签，JSON格式
	 *
	 */
	function loadBookmark(bookmark){
		var map=getMapApp();
		var bookmarkStr=JSON.stringify(bookmark);
		map.loadBookmark(JSON.parse(bookmarkStr));
	}
	/**
	 * 方法描述：显示地图书签列表
	 */
	function loadBookmarkList(){
		var map=getMapApp();
		map.loadBookmarkList();
	}


/******************************************其他操作类接口   结束*********************************************/
/*************************************************************************************************************/	

	/**
	 * 方法描述：加载大量图层性能测试
	 *
	 * @param	id				图层id
	 * @param	baseURL			图层url
	 * @param	displayLevels	图层显示级数
	 *
	 */
	function loadLayersPerformanceTest(id,baseURL,displayLevels)
	{
		var map=getMapApp();

		if(arguments.length==1)
		{
			map.loadLayersPerformanceTest(id);
		}
		else if(arguments.length==2)
		{
			map.loadLayersPerformanceTest(id,baseURL);
		}
		else if(arguments.length==3)
		{
			map.loadLayersPerformanceTest(id,baseURL,displayLevels);
		}
	}

})(jQuery);



