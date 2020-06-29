	/**
	 * 方法描述：获取地图对象
	 * @returns
	 */
	function getMapApp(){
	  if (navigator.appName.indexOf ("Microsoft") !=-1){
	    return window["index"];
	  } else{ 
	    return document["index"];
	  }
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
	function getLanguage()
	{
		return top.language="zh_CN";	//zh_CN,en_US
		//return top.language=="undefined"?"":top.language;
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
	 * 
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
	 *
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
	 *方法描述：在地图上画圆 
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
	 *方法描述：绘制图形统一接口 
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
		}else if(arguments.length==14){
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
	 *方法描述：在地图上添加点图形和信息提示框
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
	 *
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
	 *方法描述：在地图上添加图形并设置图形为可编辑状态
	 * @param grahpicID 图形ID
	 * @param geoJson Polyline或Polygon Json对象
	 * @param callback 回调函数，返回编辑后的图形JSON字符串
	 */
	function editGraphic(grahpicID,geoJson,callback)
	{
		var map=getMapApp();		
		try {
			if(arguments.length==2){									
				map.editGraphic(grahpicID,geoJson);	
			}else if(arguments.length==3){				
				callbackFunction=callback;				
				map.editGraphic(grahpicID,geoJson,defaultJsCallFunctionString);	
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
	 *方法描述：闪烁标记，闪烁后支持鼠标交互行为
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
	 *方法描述：闪烁标记，闪烁后支持鼠标交互行为，支持一次绘制多个标记  
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
	 *方法描述：获取图形几何坐标 
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
	*  方法描述：获取正在编辑的图形
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
	 *方法描述：地图缩放到指定范围
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
	 *方法描述：获得当前地图级数 
	 *@param callback 回调函数，返回当前地图级别
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
	*方法描述：获取地图最大级别
	*@return 地图最大级别
	*/
	function getMapMaxLevel(){
	   var map=getMapApp();
	   return map.getMapMaxLevel();
	}

	
/******************************************地图缩放类接口   结束*********************************************/
/*************************************************************************************************************/	

/*************************************************************************************************************/		
/******************************************地图坐标操作类接口   开始*********************************************/
	/**
	* 方法描述：获取地图上所选点的坐标
	* 
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
	  * 
	  * 方法描述：获取地图中心点坐标
	  *
	  * @return 地图中心点坐标{"y":30.304238653182985,"x":101.94291534423829}
	  *
	  */
	function getMapCenter(){
		var map=getMapApp();
		return map.getMapCenter();
	}

	/**
	 * 
	 * 方法描述：获取地图范围坐标
	 *
	 * @return	地图范围坐标 {"xmax":193.12386108765463,"ymin":-5.863568635437275,"xmin":10.761969600821942,"ymax":66.47204594180324}
	 *
	 */
	function getMapExtent(){
		var map=getMapApp();
		return map.getMapExtent();
	}
	/**
	* 方法描述：根据圆中心点坐标及半径得到圆的坐标串
	* @param center 中心点坐标 JSON对象{"x":734109.673,"y":3506901.672}
	* @param radius 半径（米）
	* @param pointSize 点的个数
	* @return 圆的坐标串{"rings":[[[734209.673,3506901.672],[734140.5746994375,3506806.56634837],[734028.7713005624,3506842.8934747707],[734028.7713005624,3506960.450525229],[734140.5746994375,3506996.7776516294],[734209.673,3506901.672]]]}
	*/
	function getCircle(center,radius,pointSize){
	   var map=getMapApp();
	   return map.getCircle(center,radius,pointSize);
	}
	/**
	 *方法描述：获得几何中心点坐标 
	 * @param strGeo 几何对象JSON字符串{"rings":[[[103,35],[108,42],[109,34],[103,35]]],"spatialReference":{"wkid":2383}}
	 * @return  中心点坐标字符串{"y":38,"x":106}
	 * 
	 */
	function getCenterLocation(strGeo){
		var map=getMapApp();
		if(arguments.length==1){
			return map.getCenterLocation(strGeo);
		}	
	} 
	
	function getGeometrysExtent(geometryObjects){
		var map=getMapApp();
		return map.getGeometrysExtent(geometryObjects);	
	}
/******************************************地图坐标操作类接口   结束*********************************************/
/*************************************************************************************************************/		
	

/*************************************************************************************************************/	
/******************************************标绘操作类接口   开始*********************************************/
	/**
	 * 
	 * 方法描述：打开和关闭标绘工具条
	 *
	 */
	function openAndClosePlotToolbar(){
		var map=getMapApp();
		map.openAndClosePlotToolbar();
	}
	/**
	 * 
	 * 方法描述：向地图中加载标绘图形
	 *
	 * @param graphicID		所要添加的图形ID
	 * @param graphicInfo	所要添加的图形信息
	 * @param name	
	 * @param callback	回调函数，返回图形ID 
			var graphicInfo={
				"marker":{            //添加简单标记
					"features":[
						{
							"attributes":
							{
								"alpha":1,
								"style":"solid",
								"size":12,
								"color":0xFF0000
							},
							"geometry":{}
						}
					]
				},
				"text":{
					
				}
			}
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
	 * 方法描述：获得当前用户的权限图层(地图初始化时使用)
	 * @return {String} 
	 */
	function getVerifiedLayer(){
		//return "layerSetBasemaps,layerDlg,layerDom1,layerDom2";
		return top.verifiedLayer;
	}

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
	 *方法描述：移除地图加载事件监听 
	 * 
	 */
	function removeMapLoadedEventListener(){
		var map=getMapApp();
		map.removeMapLoadedEventListener();
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
	 *方法描述：移除地图缩放事件监听 
	 * 
	 */
	function removeZoomEventListener(){
		var map=getMapApp();
		map.removeZoomEventListener();
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
	 /**
	  * 
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
	 * 
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
	 *
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
	function getUTMCoordinate(longitude, latitude){
	   var map=getMapApp();
	   return map.getUTMCoordinate(longitude, latitude);
	}

	/**
	* 方法描述：创建菜单
	* @param id 菜单id 
	* @param x  菜单显示位置x坐标
	* @param y  菜单显示位置y坐标
	* @param attribute  属性
	* @param flag  是否添加收缩按钮
	* @param type 菜单类型：list|tree
	*/
	function createMenuList(id,x, y,attribute,flag,type){
	   var map=getMapApp();
	   if(arguments.length==4){
	     return map.createMenuList(id,x, y,attribute);
	   }else if(arguments.length==5){
	   	 return map.createMenuList(id,x, y,attribute,flag);
	   }else if(arguments.length==6){
	  	 return map.createMenuList(id,x, y,attribute,flag,type);
	   }
	}

	/**
	* 方法描述：根据菜单ID移除菜单
	* @param id 菜单ID 
	*/
	function removeMenuList(id){
	   var map=getMapApp();
	   return map.removeMenuList(id);
	}

/******************************************工具操作类接口   结束*********************************************/
/*************************************************************************************************************/	


/*************************************************************************************************************/	
/******************************************Geoserver操作类接口   开始*********************************************/
	/**
	* 方法描述：访问geoserver服务，进行面查询
	* @param url:geoserver服务地址：形如(http://服务器名：端口号//geoserver/wfs)
	* @param typeName:图层名，形如（ChinaMap:Wellpos）
	* @param outputFields:输出字段，用逗号隔开的字符串，默认输出id+outputFields
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
	* @param url:geoserver服务地址：形如(http://服务器名：端口号//geoserver/wfs)
	* @param typeName:图层名，形如（ChinaMap:Wellpos）
	* @param id:id，要素ID
	* @param outputFields:输出字段，用逗号隔开的字符串，默认输出id+outputFields
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
	* @param y ,类型：Number
	* @param tolerance 类型：Number 容差,可为空
	* @param elementType 类型：String 容差,可为空 值为junction/edge/both
	* @param callback 回调JS函数,可为空
	* 
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
	 * 
	 * 方法描述：加载地名信息
	 *
	 * @param placeName	地名信息，JSON格式
	 *
	 */
	function loadPlaceName(placeName){
		var map=getMapApp();
		map.loadPlaceName(placeName);
	}

	/**
	 * 
	 * 方法描述：加载方案名称
	 *
	 * @param schemeName	方案名称
	 *
	 */
	function loadSchemeName(schemeName){
		var map=getMapApp();
		map.loadSchemeName(schemeName);
	}

	/**
	 * 
	 * 方法描述：加载地图书签
	 *
	 * @param	bookmark	地图书签，JSON格式
	 *
	 */
	function loadBookmark(bookmark){
		var map=getMapApp();
		var bookmarkStr=JSON.stringify(bookmark);
		map.loadBookmark(JSON.parse(bookmarkStr));
	}
	/**
	 * 
	 * 方法描述：显示地图书签列表
	 *
	 */
	function loadBookmarkList(){
		var map=getMapApp();
		map.loadBookmarkList();
	}


/******************************************其他操作类接口   结束*********************************************/
/*************************************************************************************************************/	