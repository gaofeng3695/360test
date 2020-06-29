/**
 * 地图居中
 * 
 * @param mapX 地图中点 X 坐标
 * @param mapY 地图中点 Y 坐标
 */
function centerAt(mapX, mapY)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.centerAt || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().centerAt){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){centerAt.apply(null,args)},300);		
		return;
	}
	mapIFrame.centerAt(mapX, mapY);
}

/**
 * 地图向上平移
 */
function panUp()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.panUp || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().panUp){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){panUp.apply(null,args)},300);		
		return;
	}
	mapIFrame.panUp();
}

/**
 * 地图向下平移
 */
function panDown()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.panDown || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().panDown){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){panDown.apply(null,args)},300);		
		return;
	}
	mapIFrame.panDown();
}

/**
 * 地图向左平移
 */
function panLeft()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.panLeft || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().panLeft){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){panLeft.apply(null,args)},300);		
		return;
	}
	mapIFrame.panLeft();
}

/**
 * 地图向右平移
 */
function panRight()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.panRight || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().panRight){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){panRight.apply(null,args)},300);		
		return;
	}
	mapIFrame.panRight();
}

/**
 * 刷新图层
 * 
 * @param layerId 图层id。对于图形层，为图层的 name 属性，默认值：高亮层=“高亮层”，动画层=“动画层”；对于要素层，为服务中对应图层的名称，而非图层的 name 属性。
 */
function refreshLayerByID(layerId)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.refreshLayerByID || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().refreshLayerByID){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){refreshLayerByID.apply(null,args)},300);		
		return;
	}
	mapIFrame.refreshLayerByID(layerId);
}

/**
 * 刷新图层
 * 
 * @param layerName 图层名称，图层的 name 属性，config.xml中的 layer 标签的 label 值。注意，ags 中并不限制图层重名，因此，本方法刷新所有同名图层。
 */
function refreshLayerByName(layerName)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.refreshLayerByName || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().refreshLayerByName){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){refreshLayerByName.apply(null,args)},300);		
		return;
	}
	mapIFrame.refreshLayerByName(layerName);
}

/**
 * 删除所有图层
 */
function removeAllLayers()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.removeAllLayers || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().removeAllLayers){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){removeAllLayers.apply(null,args)},300);		
		return;
	}
	mapIFrame.removeAllLayers();
}

/**
 * 清空所有图形
 */
function clearAllGraphics()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.clearAllGraphics || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().clearAllGraphics){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){clearAllGraphics.apply(null,args)},300);		
		return;
	}
	mapIFrame.clearAllGraphics();
}

/**
 * 清空图形层
 * 
 * @param layerId 图层ID，高亮层=“高亮层”，动画层=“动画层”
 */
function clearGraphicsLayer(layerId)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.clearGraphicsLayer || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().clearGraphicsLayer){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){clearGraphicsLayer.apply(null,args)},300);		
		return;
	}
	mapIFrame.clearGraphicsLayer(layerId);
}  

/**
 * 交互打印地图
 * 
 * @param title 正标题
 * @param subtitle 副标题
 */
function printMap(title, subtitle)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.printMap || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().printMap){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){printMap.apply(null,args)},300);		
		return;
	}
	mapIFrame.printMap(title, subtitle);
}

/**
 * 闪烁点
 * 
 * @param pointsString 点字符串
 * @param delay 闪烁间隔（毫秒）
 * @param repeatCount 闪烁次数
 * @param markerSymbolObject 脚本传入的标记符号对象
 */
function flashPoints(pointsString, delay, repeatCount, markerSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.flashPoints || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().flashPoints){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){flashPoints.apply(null,args)},300);		
		return;
	}
	mapIFrame.flashPoints(pointsString, delay, repeatCount, markerSymbolObject);
}

/**
 * 闪烁线
 * 
 * @param polylineString 线字符串
 * @param delay 闪烁间隔（毫秒）
 * @param repeatCount 闪烁次数
 * @param markerSymbolObject 脚本传入的线符号对象
 */
function flashPolyline(polylineString, delay, repeatCount, lineSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.flashPolyline || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().flashPolyline){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){flashPolyline.apply(null,args)},300);		
		return;
	}
	mapIFrame.flashPolyline(polylineString, delay, repeatCount, lineSymbolObject);
}

/**
 * 闪烁面
 * 
 * @param polylineString 面字符串
 * @param delay 闪烁间隔（毫秒）
 * @param repeatCount 闪烁次数
 * @param markerSymbolObject 脚本传入的填充符号对象
 */
function flashPolygon(polygonString, delay, repeatCount, fillSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.flashPolygon || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().flashPolygon){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){flashPolygon.apply(null,args)},300);		
		return;
	}
	mapIFrame.flashPolygon(polygonString, delay, repeatCount, fillSymbolObject);
}

/**
 * 按时间动画线（线逐节点增长）
 * 
 * @param polylineString 线字符串
 * @param lineSymbolObject 脚本传入的线符号对象
 * @param duration 持续时间（毫秒）
 */
function animatePolylineInTime(polylineString, lineSymbolObject, duration)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.animatePolylineInTime || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().animatePolylineInTime){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){animatePolylineInTime.apply(null,args)},300);		
		return;
	}
	mapIFrame.animatePolylineInTime(polylineString, lineSymbolObject, duration);
}

/**
 * 按速度动画线（线逐节点增长）
 * 
 * @param polylineString 线字符串
 * @param lineSymbolObject 脚本传入的线符号对象
 * @param speed 时速（每小时移动多少地图长度）
 * @param ratio 真实动画比。实际1小时相当于多少毫秒动画时间
 */
function animatePolylineInSpeed(polylineString, lineSymbolObject, speed, ratio)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.animatePolylineInSpeed || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().animatePolylineInSpeed){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){animatePolylineInSpeed.apply(null,args)},300);		
		return;
	}
	mapIFrame.animatePolylineInSpeed(polylineString, lineSymbolObject, speed, ratio);
}

/**
 * 设置点层渲染
 * 
 * @param layerId 点要素层id
 * @param markerSymbolObject 脚本传入的标记符号对象
 */
function setPointLayerRenderer(layerId, markerSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.setPointLayerRenderer || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().setPointLayerRenderer){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){setPointLayerRenderer.apply(null,args)},300);		
		return;
	}
	mapIFrame.setPointLayerRenderer(layerId, markerSymbolObject);
}

/**
 * 设置点层图片渲染
 * 
 * @param layerId 线要素层id
 * @param pictureMarkerSymbolObject 脚本传入的图片标记符号对象
 */
function setPointLayerPictureRenderer(layerId, pictureSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.setPointLayerPictureRenderer || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().setPointLayerPictureRenderer){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){setPointLayerPictureRenderer.apply(null,args)},300);		
		return;
	}
	mapIFrame.setPointLayerPictureRenderer(layerId, pictureSymbolObject);
}

/**
 * 设置线层渲染
 * 
 * @param layerId 线要素层id
 * @param lineSymbolObject 脚本传入的线符号对象
 */
function setLineLayerRenderer(layerId, lineSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.setLineLayerRenderer || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().setLineLayerRenderer){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){setLineLayerRenderer.apply(null,args)},300);		
		return;
	}
	mapIFrame.setLineLayerRenderer(layerId, lineSymbolObject);
}

/**
 * 设置面层渲染
 * 
 * @param layerId 面要素层id
 * @param fillSymbolObject 脚本传入的填充符号对象
 */
function setPolygonLayerRenderer(layerId, fillSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.setPolygonLayerRenderer || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().setPolygonLayerRenderer){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){setPolygonLayerRenderer.apply(null,args)},300);		
		return;
	}
	mapIFrame.setPolygonLayerRenderer(layerId, fillSymbolObject);
}

/**
 * 添加点图形
 * 
 * @param pointsString 点字符串
 * @param markerSymbolObject 脚本传入的标记符号对象
 */
function addPointGraphics(pointsString, markerSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.addPointGraphics || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addPointGraphics){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){addPointGraphics.apply(null,args)},300);		
		return;
	}
	mapIFrame.addPointGraphics(pointsString, markerSymbolObject);
}

/**
 * 添加点图片图形
 * 
 * @param pointsString 点字符串
 * @param pictureSymbolObject 脚本传入的图片标记符号对象
 */
function addPictureGraphics(pointsString, pictureSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.addPictureGraphics || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addPictureGraphics){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){addPictureGraphics.apply(null,args)},300);		
		return;
	}
	mapIFrame.addPictureGraphics(pointsString, pictureSymbolObject)
}

/**
 * 添加线图形
 * 
 * @param polylineString 线字符串
 * @param lineSymbolObject 脚本传入的线符号对象
 */
function addPolylineGraphics(polylineString, lineSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.addPolylineGraphics || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addPolylineGraphics){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){addPolylineGraphics.apply(null,args)},300);		
		return;
	}
	mapIFrame.addPolylineGraphics(polylineString, lineSymbolObject)
}

/**
 * 添加面图形
 * 
 * @param polygonString 线字符串
 * @param fillSymbolObject 脚本传入的线符号对象
 */
function addPolygonGraphics(polygonString, fillSymbolObject)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.addPolygonGraphics || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addPolygonGraphics){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){addPolygonGraphics.apply(null,args)},300);		
		return;
	}
	mapIFrame.addPolygonGraphics(polygonString, fillSymbolObject)
}

/////////// 1.2 新增 ////////////////

/**
 * 设置地图切片级别
 * 
 * @param level 目标级别
 */
function setLevel(level)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.setLevel || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().setLevel){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){setLevel.apply(null,args)},300);		
		return;
	}
	mapIFrame.setLevel(level);
}       

/**
 * 提升切片级别（放大）
 */
function levelUp()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.levelUp || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().levelUp){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){levelUp.apply(null,args)},300);		
		return;
	}
	mapIFrame.levelUp();
} 

/**
 * 降低切片级别（缩小）
 */
function levelDown()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.levelDown || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().levelDown){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){levelDown.apply(null,args)},300);		
		return;
	}
	mapIFrame.levelDown();
} 

/**
 * 地图中心放大
 */
function zoomIn()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.zoomIn || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().zoomIn){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){zoomIn.apply(null,args)},300);		
		return;
	}
	mapIFrame.zoomIn();
} 

/**
 * 地图中心缩小
 */
function zoomOut()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.zoomOut || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().zoomOut){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){zoomOut.apply(null,args)},300);		
		return;
	}
	mapIFrame.zoomOut();
}

/**
 * 按时间动画箭头线
 * 
 * @param polylineString 线字符串
 * @param arrowLineSymbolObject 脚本传入的箭头线符号对象
 * @param duration 持续时间（毫秒） 
 */
function animateArrowLineInTime(polylineString, arrowLineSymbolObject, duration,layerId)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.animateArrowLineInTime || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().animateArrowLineInTime){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){animateArrowLineInTime.apply(null,args)},300);		
		return;
	}
	mapIFrame.animateArrowLineInTime(polylineString, arrowLineSymbolObject, duration,layerId);
}

/**
 * 按速度动画箭头线
 * 
 * @param polylineString 线字符串
 * @param arrowLineSymbolObject 脚本传入的箭头线符号对象
 * @param speed 时速（每小时移动多少地图长度）
 * @param ratio 真实动画比。实际1小时相当于多少毫秒动画时间
 */
function animateArrowLineInSpeed(polylineString, arrowLineSymbolObject, speed, ratio)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.animateArrowLineInSpeed || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().animateArrowLineInSpeed){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){animateArrowLineInSpeed.apply(null,args)},300);		
		return;
	}
	mapIFrame.animateArrowLineInSpeed(polylineString, arrowLineSymbolObject, speed, ratio);
}

/**
 * 显示信息窗
 * 
 * @param x 显示位置的 x 坐标
 * @param y 显示位置的 y 坐标
 * @param title 信息窗的标题
 * @param simpleHtml 信息窗的内容（仅支持简单 HTML，即文本、图片、链接等）
 * @param width 信息窗的宽度，默认 300 像素
 * @param height 信息窗的高度，默认 200 像素
 */
function showInfoWindow(x, y, title, simpleHtml, width, height)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.showInfoWindow || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().showInfoWindow){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){showInfoWindow.apply(null,args)},300);		
		return;
	}
	mapIFrame.showInfoWindow(x, y, title, simpleHtml, width, height)
}

/**
 * 添加多边形及其信息窗
 * 
 * @param polygonString 面字符串
 * @param fillSymbolObject 脚本传入的线符号对象
 * @param mode 模式：click 单击打开模式，hover 悬停打开模式，默认为 click
 * @param title 信息窗的标题
 * @param simpleHtml 信息窗的内容（仅支持简单 HTML，即文本、图片、链接等）
 * @param width 信息窗的宽度，默认 300 像素
 * @param height 信息窗的高度，默认 200 像素
 */
function addPolygonGraphicInfoWindow(polygonString, fillSymbolObject, mode, title, simpleHtml, width, height)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.addPolygonGraphicInfoWindow || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addPolygonGraphicInfoWindow){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){addPolygonGraphicInfoWindow.apply(null,args)},300);		
		return;
	}
	mapIFrame.addPolygonGraphicInfoWindow(polygonString, fillSymbolObject, mode, title, simpleHtml, width, height);
}

/////////////////// flex 事件处理函数（可修改函数体） ////////////////////
function onDrawEnd(polygonJSON)
{
	//console.log(polygonJSON);
}


 /////////// 1.3 新增 ////////////////
            
function zoomAt(level, x, y)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.zoomAt || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().zoomAt){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){zoomAt.apply(null,args)},300);		
		return;
	}
	mapIFrame.zoomAt(level, x, y);
}

/**
 * 地图范围变化处理函数
 */
function onMapExtentChange()
{
	//console.log("on map extent change");
}

function addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoffset,yoffset,layerId)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.addPointInfoWindow || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addPointInfoWindow){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){addPointInfoWindow.apply(null,args)},300);		
		return;
	}
	if(arguments.length==7){
		mapIFrame.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml);
	}else if(arguments.length==8){
		mapIFrame.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width);
	}else if(arguments.length==9){
		mapIFrame.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height);
	}else if(arguments.length==10){
		mapIFrame.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoff);
	}else if(arguments.length==11){
		mapIFrame.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoff,yoff);
	}else if(arguments.length==12){
		mapIFrame.addPointInfoWindow(id,x, y, markerSymbolObject, mode, title, simpleHtml, width, height,xoff,yoff,layerId);
	}
	
}


/**
 * 从地图获取坐标
 * 
 * @param callback js回调函数对象
 */
function getXY(callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getXY || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getXY){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getXY.apply(null,args)},300);		
		return;
	}
	mapIFrame.getXY(callback);								
}

function showGraphicInfo(){
	
}

/**
 * 编辑线
 * @param grahpicID 图形唯一ID
 * @param drawType 图形类型:freehandpolygon/freehandpolyline/polyline/polygon
 * @param callback 回调JS函数，可选
 */
function drawGraphic(grahpicID,drawType,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.drawGraphic || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().drawGraphic){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){drawGraphic.apply(null,args)},300);		
		return;
	}
	if(arguments.length==2)
	{
		mapIFrame.drawGraphic(grahpicID,drawType);
	}
	else if(arguments.length==3)
	{
		mapIFrame.drawGraphic(grahpicID,drawType,callback);
	}	
}

/**
 *编辑图形 
 * @param grahpicID 图形ID
 * @param geoJson Polyline或Polygon Json对象
 * 
 */
function editGraphic(grahpicID,geoJson)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.editGraphic || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().editGraphic){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){editGraphic.apply(null,args)},300);		
		return;
	}
	mapIFrame.editGraphic(grahpicID,geoJson);	
}

/**
 * 编辑线
 * @param grahpicID 图形ID
 * @param polylineJson 线串坐标对，如:{"paths":[[[438489.08291525743,2557275.576483189],[485637.83291525743,2582993.076483189],[508974.08291525743,2568229.326483189],[517546.58291525743,2556799.326483189]]],"spatialReference":{"wkid":2383}};
 */
function editPolyline(grahpicID,polylineJson)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.editPolyline || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().editPolyline){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){editPolyline.apply(null,args)},300);		
		return;
	}
	mapIFrame.editPolyline(grahpicID,polylineJson);
}


/**
 *  编辑面
 * @param grahpicID 图形ID
 * @param polygonJson 线串坐标对，如:{"rings":[[[468738.2648499999,2578778.4647500003],[514934.5148499999,2597828.4647500003],[529698.2648499999,2566395.9647500003],[510648.2648499999,2548298.4647500003],[468738.2648499999,2578778.4647500003]]],"spatialReference":{"wkid":2383}};
 */
function editPolygon(grahpicID,polygonJson)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.editPolygon || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().editPolygon){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){editPolygon.apply(null,args)},300);		
		return;
	}
	mapIFrame.editPolygon(grahpicID,polygonJson);
}

 /**
 *  编辑面
 * @param grahpicID 图形ID;
 * @param callback js回调函数对象
 */
function getEidtGraphic(grahpicID,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getEidtGraphic || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getEidtGraphic){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getEidtGraphic.apply(null,args)},300);		
		return;
	}
	mapIFrame.getEidtGraphic(grahpicID,callback);				          
}            

 /**
  * 
  * @param grahpicID 图形ID
  * @param drawType 类型Point/Polyline/Polygon/Multipoint/Envelope
  * @param geoJson ArcGIS Json Geometry Objects 
  * @return 
  * 
  */
function drawGraphicByErisGeoJson(grahpicID,drawType,geoJson)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.drawGraphicByErisGeoJson || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().drawGraphicByErisGeoJson){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){drawGraphicByErisGeoJson.apply(null,args)},300);		
		return;
	}
	mapIFrame.drawGraphicByErisGeoJson(grahpicID,drawType,geoJson);			
}

/**
*启动GeometryNetworkAnalysis（目前供停气分析使用） 
* @param x 类型：Number
* @param y ,类型：Number
* @param tolerance 类型：Number 容差,可为空
* @param elementType 类型：String 容差,可为空 值为junction/edge/both
* @param callback 回调JS函数,可为空
* 
*/
function startGeoNetworkAnalysis(x,y,tolerance,elementType,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.startGeoNetworkAnalysis || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().startGeoNetworkAnalysis){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){startGeoNetworkAnalysis.apply(null,args)},300);		
		return;
	}
	if(arguments.length==2)
	{
		mapIFrame.startGeoNetworkAnalysis(x,y);
	}
	else if(arguments.length==3)
	{
		mapIFrame.startGeoNetworkAnalysis(x,y,tolerance,elementType);
	}
	else if(arguments.length==4)
	{
		mapIFrame.startGeoNetworkAnalysis(x,y,tolerance,elementType);
	}	
	else if(arguments.length==5)
	{
		mapIFrame.startGeoNetworkAnalysis(x,y,tolerance,elementType,callback);
	}
}

/**
*从地图取点启动GeoNetwork 
* @param callback 回调JS函数,可为空
* 
*/
function startGeoNetworkAnalysisWithMap(callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.startGeoNetworkAnalysisWithMap || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().startGeoNetworkAnalysisWithMap){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){startGeoNetworkAnalysisWithMap.apply(null,args)},300);		
		return;
	}
	if(arguments.length==0)
	{
		mapIFrame.startGeoNetworkAnalysisWithMap();
	}
	else if(arguments.length==1)
	{		
		mapIFrame.startGeoNetworkAnalysisWithMap(callback);			
	}
}
			
/**
 *绘制图形统一接口 
 * @param id	图形Id
 * @param geometryObject 图形几何Json对象,格式参考Arcgis server Rest API之GeometryObject
 * @param tipMode	tip显示模式，可为none\open\hover\click,默认为none
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
	tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration,effectRepeatCount,callback){	
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.addGraphic || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addGraphic){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){addGraphic.apply(null,args)},300);		
		return;
	}
	
	if(arguments.length==2)
	{
		mapIFrame.addGraphic(id,geometryObject);
	}
	else if(arguments.length==3)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode);
	}
	else if(arguments.length==4)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute);
	}
	else if(arguments.length==5)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject);
	}
	else if(arguments.length==6)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass);
	}
	else if(arguments.length==7)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth);
	}
	else if(arguments.length==8)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight);
	}
	else if(arguments.length==9)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl);
	}
	else if(arguments.length==10)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom);
	}
	else if(arguments.length==11)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId);
	}
	else if(arguments.length==12)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level);
	}
	else if(arguments.length==13)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level,isEffect);
	}
	else if(arguments.length==14)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration);
	}
	else if(arguments.length==15)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration,effectRepeatCount);
	}
	else if(arguments.length==16)
	{
		mapIFrame.addGraphic(id,geometryObject,tipMode,attribute,symbolObject,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,layerId,level,isEffect,duration,effectRepeatCount,callback);
	}
}

/**
 *范围缩放 
 * @param xmin
 * @param ymin
 * @param xmax
 * @param ymax
 * 
 */
function zoomExtent(xmin,ymin,xmax,ymax,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.zoomExtent || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().zoomExtent){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){zoomExtent.apply(null,args)},300);		
		return;
	}
	if(arguments.length==4)
	{
		mapIFrame.zoomExtent(xmin,ymin,xmax,ymax);
	}
	else if(arguments.length==5)
	{
		mapIFrame.zoomExtent(xmin,ymin,xmax,ymax,callback);
	}
}

/**
 * 根据几何图形数组缩放地图
 * @param geometryJsons	Json几何图形数组
 * 
 */
function zoomGeometrys(geometryJsons)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.zoomGeometrys || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().zoomGeometrys){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){zoomGeometrys.apply(null,args)},300);		
		return;
	}
	mapIFrame.zoomGeometrys(geometryJsons);
}

/**
 *画圆 
 * @param center 中心点GeoJson
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
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.addCircle || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addCircle){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){addCircle.apply(null,args)},300);		
		return;
	}
	if(arguments.length==2){
		mapIFrame.addCircle(center,radius);
	}else if(arguments.length==3){
		mapIFrame.addCircle(center,radius,callback);
	}else if(arguments.length==4){
		mapIFrame.addCircle(center,radius,callback,centerMarkerSymbol);
	}else if(arguments.length==5){
		mapIFrame.addCircle(center,radius,callback,centerMarkerSymbol,symbolObject);
	}else if(arguments.length==6){
		mapIFrame.addCircle(center,radius,callback,centerMarkerSymbol,symbolObject,autoZoom);
	}else if(arguments.length==7){
		mapIFrame.addCircle(center,radius,callback,centerMarkerSymbol,symbolObject,autoZoom,layerId);
	}
	
}

/**
 *添加地图缩放事件监听 
 * @param callback JS回调函数
 * 
 */
function addZoomEventListener(callback)
{	
	if(callback!=null)
	{
		var mapIFrame = top.getMapIFrame();
		if(!mapIFrame || !mapIFrame.addZoomEventListener || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addZoomEventListener){
			var args = Array.prototype.slice.call(arguments,0);		
			setTimeout(function(){addZoomEventListener.apply(null,args)},300);		
			return;
		}
		mapIFrame.addZoomEventListener(callback);
	}
}

/**
 *移除地图缩放事件监听 
 * 
 */
function removeZoomEventListener()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.removeZoomEventListener || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().removeZoomEventListener){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){removeZoomEventListener.apply(null,args)},300);		
		return;
	}
	mapIFrame.removeZoomEventListener();
}

/**
 * 绘制图形统一接口，可以绘制多个图形
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
 * @param layerId 在指定层上添加标记,默认是“HightlightLayer”
 * @param isEffect 是否添加光晕特效，默认为false
 * @param duration 光晕效果的持续时间，默认是3000毫秒
 * @param effectRepeatCount 光晕效果的重复次数，默认是3次
 * @param callback 回调函数，tipClass为"JsFunction"时有效
 */
function addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,
	tipHeights,tipUrls,autoZoom,layerId,isEffect,duration,effectRepeatCount,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.addGraphics || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addGraphics){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){addGraphics.apply(null,args)},300);		
		return;
	}
	if(arguments.length==2)
	{
		mapIFrame.addGraphics(ids,geometryObjects);
	}
	else if(arguments.length==3)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes);
	}
	else if(arguments.length==4)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes);
	}
	else if(arguments.length==5)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects);
	}
	else if(arguments.length==6)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses);
	}
	else if(arguments.length==7)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths);
	}
	else if(arguments.length==8)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights);
	}
	else if(arguments.length==9)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls);
	}
	else if(arguments.length==10)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom);
	}
	else if(arguments.length==11)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId);
	}
	else if(arguments.length==12)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId,isEffect);
	}
	else if(arguments.length==13)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId,isEffect,duration);
	}
	else if(arguments.length==14)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId,isEffect,duration,effectRepeatCount);
	}
	else if(arguments.length==15)
	{
		mapIFrame.addGraphics(ids,geometryObjects,tipModes,attributes,symbolObjects,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,layerId,isEffect,duration,effectRepeatCount,callback);
	}
}

/**
 *获得当前地图级数 
 * @param callbackFunction
 * 
 */
function getMapLevel(callback)
{
	var mapIFrame = top.getMapIFrame();
//	alert(mapIFrame.window.getMapApp().getMapLevel);
	if(!mapIFrame || !mapIFrame.getMapLevel || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getMapLevel){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getMapLevel.apply(null,args)},300);		
		return;
	}
	
	if(callback!=null)
	{		
		top.getMapIFrame().getMapLevel(callback);
	}
}

/*
 * 设置用户权限图层
 * @param {String} layIds
 */
function setVerifiedLayer(layIds)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.setVerifiedLayer || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().setVerifiedLayer){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){setVerifiedLayer.apply(null,args)},300);		
		return;
	}
	
	mapIFrame.setVerifiedLayer(layIds);
}

/**
 * 删除图形 
 * 
 * @param ids 图形Id集合字符串，以逗号隔开;或用*号表示删除指定图层上的全部标记
 * @param layerId 标记图层ID，默认为“HightlightLayer”
 * 
 */		
function removeGraphics(ids,layerId)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.removeGraphics || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().removeGraphics){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){removeGraphics.apply(null,args)},300);		
		return;
	}

	if(arguments.length==1)
	{
		mapIFrame.removeGraphics(ids);
	}
	else if(arguments.length==2)
	{
		mapIFrame.removeGraphics(ids,layerId);
	}
}

/**
 *获得中心点坐标 
 * @param strGeo 几何对象JSON字符串
 * @return MapPoint JSONString
 * 
 */
function getCenterLocation(strGeo)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getCenterLocation || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getCenterLocation){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getCenterLocation.apply(null,args)},300);		
		return;
	}

	if(arguments.length==1)
	{
		return mapIFrame.getCenterLocation(strGeo);
	}	
}

/**
 *闪烁标记，闪烁后支持鼠标交互行为
 *  
 * @param id 图形Id
 * @param geometryObject 图形几何Json对象,格式参考Arcgis server Rest API之GeometryObject
 * @param symbolObject 图形样式Json对象,默认为空,格式参考Arcgis server Rest API之Symbol Objects
 * @param delay 闪烁间隔（毫秒）
 * @param repeatCount 闪烁次数 
 * @param tipMode tip显示模式，可为none\open\hover\click,默认为none
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
function flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,
	tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration,effectRepeatCount,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.flashGraphic || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().flashGraphic){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){flashGraphic.apply(null,args)},300);		
		return;
	}	
	
	if(arguments.length==2)
	{
		mapIFrame.flashGraphic(id,geometryObject);
	}
	else if(arguments.length==3)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject);
	}
	else if(arguments.length==4)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay);
	}
	else if(arguments.length==5)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount);
	}
	else if(arguments.length==6)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode);
	}
	else if(arguments.length==7)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute);
	}
	else if(arguments.length==8)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass);
	}
	else if(arguments.length==9)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth);
	}
	else if(arguments.length==10)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight);
	}
	else if(arguments.length==11)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl);
	}
	else if(arguments.length==12)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom);
	}
	else if(arguments.length==13)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect);
	}
	else if(arguments.length==14)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level);
	}
	else if(arguments.length==15)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level,layerId);
	}
	else if(arguments.length==16)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration);
	}
	else if(arguments.length==17)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration,effectRepeatCount);
	}
	else if(arguments.length==18)
	{
		mapIFrame.flashGraphic(id,geometryObject,symbolObject,delay, repeatCount,tipMode,attribute,tipClass,tipWidth,tipHeight,tipUrl,autoZoom,isEffect,level,layerId,duration,effectRepeatCount,callback);
	}
}

/**
 *闪烁标记，闪烁后支持鼠标交互行为，支持一次绘制多个标记  
 * @param ids 图形Id数组 （长度必须与geometryObjects数组长度一致）
 * @param geometryObjects 图形几何Json数组（长度必须与ids数组长度一致）
 * @param symbolObjects 标记对象数组（可为空,长度可与ids数组长度一致，不一致时，其它值与第一个值一致）
 * @param delay 闪烁间隔（毫秒）
 * @param repeatCount 闪烁次数 
 * @param tipModes tip显示模式数组（可为空，长度可与ids数组长度一致，不一致时，其它值与第一个值一致）[单个值可为none\open\hover\click\doubleclick,默认为none]
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
function flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,
	tipHeights,tipUrls,autoZoom,isEffect,layerId,duration,effectRepeatCount,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.flashGraphic || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().flashGraphic){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){flashGraphic.apply(null,args)},300);		
		return;
	}	

	if(arguments.length==2)
	{
		mapIFrame.flashGraphics(ids,geometryObjects);
	}
	else if(arguments.length==3)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects);
	}
	else if(arguments.length==4)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay);
	}
	else if(arguments.length==5)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount);
	}
	else if(arguments.length==6)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes);
	}
	else if(arguments.length==7)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes);
	}
	else if(arguments.length==8)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipMode,attributes,tipClasses);
	}
	else if(arguments.length==9)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths);
	}
	else if(arguments.length==10)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights);
	}
	else if(arguments.length==11)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls);
	}
	else if(arguments.length==12)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom);
	}
	else if(arguments.length==13)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect);
	}
	else if(arguments.length==14)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId);
	}
	else if(arguments.length==15)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId,duration);
	}
	else if(arguments.length==16)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId,duration,effectRepeatCount);
	}
	else if(arguments.length==17)
	{
		mapIFrame.flashGraphics(ids,geometryObjects,symbolObjects,delay, repeatCount,tipModes,attributes,tipClasses,tipWidths,tipHeights,tipUrls,autoZoom,isEffect,layerId,duration,effectRepeatCount,callback);
	}
}


/**
 *获取图形几何坐标 
 * @param id 图形唯一id
 * @param callbackFunction 回调js函数
 * 
 */
function getGraphic(id,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getGraphic || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getGraphic){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getGraphic.apply(null,args)},300);		
		return;
	}
	
	if(callback!=null)
	{		
		top.getMapIFrame().getGraphic(id,callback);
	}
}

/**
 *绘制路由 
 * @param grahpicID 路由图形id
 * @param callbackFunction 绘制完后回调函数，返回RouteObject
 * 
 */
function drawRoute(grahpicID,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.drawRoute || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().drawRoute){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){drawRoute.apply(null,args)},300);		
		return;
	}
	
	if(callback!=null)
	{
		mapIFrame.drawRoute(grahpicID,callback);	
	}else{
		mapIFrame.drawRoute(grahpicID);
	}
}

/**
 * 编辑路由
 * @param grahpicID 路由图形id
 * @param routeObject 路由Json对象,格式参考对象Json说明之RouteObject
 * @param callbackFunction 编辑完后回调函数,返回RouteObject
 * 
 */
function editRoute(grahpicID,routeObject,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.editRoute || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().editRoute){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){editRoute.apply(null,args)},300);		
		return;
	}
	
	if(callback!=null)
	{						
		mapIFrame.editRoute(grahpicID,routeObject,callback);	
	}
	else
	{
		mapIFrame.editRoute(grahpicID,routeObject);
	}
}


/**
 * 获取路由坐标
 * @param grahpicID 路由图形id
 * @param callbackFunction 编辑完后回调函数 返回RouteObject
 * 
 */
function getRoute(grahpicID,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getRoute || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getRoute){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getRoute.apply(null,args)},300);		
		return;
	}
	
	if(callback!=null)
	{		
		mapIFrame.getRoute(grahpicID,callback);	
	}
}


/**
 * 定位路由
 * @param grahpicID 路由图形id
 * @param routeObject 路由Json对象,格式参考对象Json说明之RouteObject
 * @param callbackFunction 编辑完后回调函数,返回空值
 * 
 */
function locateRoute(grahpicID,routeObject,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.locateRoute || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().locateRoute){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){locateRoute.apply(null,args)},300);		
		return;
	}
	
	if(callback!=null)
	{						
		mapIFrame.locateRoute(grahpicID,routeObject,callback);	
	}
	else
	{
		mapIFrame.locateRoute(grahpicID,routeObject);
	}
}

/**
 * 
 * 方法描述：定义图层是否可见
 *
 * @param layerID	图层ID
 * @param layerVisible	图层是否可见
 *
 */
/*function isLayerVisible(layerID,layerVisible){
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.isLayerVisible || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().isLayerVisible){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){isLayerVisible.apply(null,args)},300);		
		return;
	}
	mapIFrame.isLayerVisible(layerID,layerVisible);
}*/

/**
 * 方法描述：获取站列坐标，解决中文乱码问题
 * @param grahpicID 路由图形id
 * @param callbackFunction 编辑完后回调函数 返回RouteObject
 * 
 */
/*function getRouteCN(grahpicID,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getRouteCN || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getRouteCN){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getRouteCN.apply(null,args)},300);		
		return;
	}
	
	if(callback!=null)
	{						
		mapIFrame.getRouteCN(grahpicID,callback);	
	}
}*/

 /**
  * 
  * 方法描述：添加地图范围事件监听
  *
  * @param callback	回调函数，返回地图范围坐标，坐标以逗号隔开，为"xmin,ymin,xmax,ymax"
  *
  */
function addExtentEventListener(callback)
{	
	if(callback!=null)
	{
		var mapIFrame = top.getMapIFrame();
		if(!mapIFrame || !mapIFrame.addExtentEventListener || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addExtentEventListener){
			var args = Array.prototype.slice.call(arguments,0);		
			setTimeout(function(){addExtentEventListener.apply(null,args)},300);		
			return;
		}
		mapIFrame.addExtentEventListener(callback);
	}
}

/**
 * 
 * 方法描述：移除地图范围事件监听 
 *
 *
 */
function removeExtentEventListener()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.removeExtentEventListener || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().removeExtentEventListener){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){removeExtentEventListener.apply(null,args)},300);		
		return;
	}
	mapIFrame.removeExtentEventListener();
}

/**
 * 
 * 方法描述：获取地图中心点坐标
 *
 * @return 地图中心点坐标，坐标以逗号隔开，为"x,y"
 *
 */
function getMapCenter()
{	
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getMapCenter || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getMapCenter){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getMapCenter.apply(null,args)},300);		
		return;
	}
	return mapIFrame.getMapCenter();
}

/**
 * 
 * 方法描述：获取地图范围坐标
 *
 * @return	地图范围坐标，坐标以逗号隔开，为"xmin,ymin,xmax,ymax"
 *
 */
function getMapExtent()
{	
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getMapExtent || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getMapExtent){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getMapExtent.apply(null,args)},300);		
		return;
	}
	return mapIFrame.getMapExtent();
}

/****************地图标绘工具相关方法********************/
/**
 * 
 * 方法描述：打开和关闭标绘工具条
 *
 *
 */
function openAndClosePlotToolbar()
{	
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.openAndClosePlotToolbar || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().openAndClosePlotToolbar){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){openAndClosePlotToolbar.apply(null,args)},300);		
		return;
	}
	mapIFrame.openAndClosePlotToolbar();
}

/**
 * 
 * 方法描述：向地图中加载图形，对应标绘工具条的加载按钮
 *
 * @param graphicID		所要添加的图形ID
 * @param graphicInfo	所要添加的图形信息
 *
 */
function loadPlotToolbar(graphicID,graphicInfo,name,callback)
{	
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.loadPlotToolbar || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().loadPlotToolbar){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){loadPlotToolbar.apply(null,args)},300);		
		return;
	}
	if(callback!=null)
	{						
		mapIFrame.loadPlotToolbar(graphicID,graphicInfo,name,callback);	
	}else if(name!=null){
		mapIFrame.loadPlotToolbar(graphicID,graphicInfo,name);	
	}else{
		mapIFrame.loadPlotToolbar(graphicID,graphicInfo);
	}
}




/**
 * 
 * 方法描述：加载地名信息
 *
 * @param placeName	地名信息，JSON格式
 *
 */
function loadPlaceName(placeName)
{	
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.loadPlotToolbar || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().loadPlaceName){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){loadPlaceName.apply(null,args)},300);		
		return;
	}
	mapIFrame.loadPlaceName(placeName);
}

/**
 * 
 * 方法描述：加载地名信息
 *
 * @param schemeName	方案名称
 *
 */
function loadSchemeName(schemeName)
{	
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.loadSchemeName || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().loadSchemeName){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){loadSchemeName.apply(null,args)},300);		
		return;
	}
	mapIFrame.loadSchemeName(schemeName);
}

/****************地图书签相关方法********************/
/**
 * 
 * 方法描述：加载地图书签
 *
 * @param	bookmark	地图书签，JSON格式
 *
 */
function loadBookmark(bookmark)
{	
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.loadPlotToolbar || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().loadBookmark){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){loadBookmark.apply(null,args)},300);		
		return;
	}
	mapIFrame.loadBookmark(bookmark);
}

/**
 * 
 * 方法描述：显示地图书签列表
 *
 */
function loadBookmarkList()
{	
	var mapIFrame = top.getMapIFrame();
	/*if(!mapIFrame || !mapIFrame.loadPlotToolbar || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().showBookmark){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){showBookmark.apply(null,args)},300);		
		return;
	}*/
	mapIFrame.loadBookmarkList();
}

/**
 * 
 * 方法描述：加载大量图层性能测试
 *
 * @param	id				图层id
 * @param	baseURL			图层url
 * @param	displayLevels	图层显示级数
 *
 */
function loadLayersPerformanceTest(id,baseURL,displayLevels)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.flashGraphic || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().loadLayersPerformanceTest){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){loadLayersPerformanceTest.apply(null,args)},300);		
		return;
	}	
	
	if(arguments.length==1)
	{
		mapIFrame.loadLayersPerformanceTest(id);
	}
	else if(arguments.length==2)
	{
		mapIFrame.loadLayersPerformanceTest(id,baseURL);
	}
	else if(arguments.length==3)
	{
		mapIFrame.loadLayersPerformanceTest(id,baseURL,displayLevels);
	}
}

/**
 *添加地图缩放事件监听 
 * @param callback JS回调函数
 * 
 */
function addMapLoadedEventListener(callback)
{	
	if(callback!=null)
	{
		var mapIFrame = top.getMapIFrame();
		if(!mapIFrame || !mapIFrame.addMapLoadedEventListener || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addMapLoadedEventListener){
			var args = Array.prototype.slice.call(arguments,0);		
			setTimeout(function(){addMapLoadedEventListener.apply(null,args)},300);		
			return;
		}
		mapIFrame.addMapLoadedEventListener(callback);
	}
}

/**
  * 
  * 方法描述：添加地图范围事件监听
  *
  * @param callback	回调函数，返回地图范围坐标，坐标以逗号隔开，为"xmin,ymin,xmax,ymax"
  *
  */
function addMapLoadedEventListener(callback)
{	
	if(callback!=null)
	{
		var mapIFrame = top.getMapIFrame();
		if(!mapIFrame || !mapIFrame.addMapLoadedEventListener || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().addMapLoadedEventListener){
			var args = Array.prototype.slice.call(arguments,0);		
			setTimeout(function(){addMapLoadedEventListener.apply(null,args)},300);		
			return;
		}
		mapIFrame.addMapLoadedEventListener(callback);
	}
}

/**
 * 
 * 方法描述：移除地图范围事件监听 
 *
 */
function removeMapLoadedEventListener()
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.removeMapLoadedEventListener || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().removeMapLoadedEventListener){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){removeMapLoadedEventListener.apply(null,args)},300);		
		return;
	}
	mapIFrame.removeMapLoadedEventListener();	
}

/**
 * 
 * 方法描述：图层是否可见开关
 *
 * @param	layerID	图层ID
 * @param	layerVisible	图层是否可见：true为图层可见，false为图层不可见
 *
 */
function layerVisibleSwitch(layerID,layerVisible)
{	
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.layerVisibleSwitch || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().layerVisibleSwitch){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){layerVisibleSwitch.apply(null,args)},300);		
		return;
	}	
	mapIFrame.layerVisibleSwitch(layerID,layerVisible);
}

/**
 *
 * 方法描述：查看图层是否可见
 *
 * @param layerid	图层id			
 * @param callbackFunction	回调函数		
 * 
 */
function getLayerVisible(layerid,callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getLayerVisible || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getLayerVisible){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getLayerVisible.apply(null,args)},300);		
		return;
	}
	if(callback!=null)
	{				
		mapIFrame.getLayerVisible(layerid,callback);	
	}
	else
	{
		mapIFrame.getLayerVisible(layerid);
	}
}


/**
 * 
 * 方法描述：移除地图范围事件监听 
 *
 */
function mapDownload(xmin,ymin,xmax,ymax)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.mapDownload || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().mapDownload){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){mapDownload.apply(null,args)},300);		
		return;
	}
	mapIFrame.mapDownload(xmin,ymin,xmax,ymax);	
}


/**
 *
 * 方法描述：拖拽矩形框
 *
 * @param callback	回调函数		
 * 
 */
function drawExtent(callback)
{
	var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.drawExtent || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().drawExtent){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){drawExtent.apply(null,args)},300);		
		return;
	}
	if(callback!=null)
	{				
		mapIFrame.drawExtent(callback);	
	}
	else
	{
		mapIFrame.drawExtent();	
	}
	
}
/**
*
*方法描述：获取地图最大级别
*
**/
function getMapMaxLevel(){
    var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getMapMaxLevel || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getMapMaxLevel){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getMapMaxLevel.apply(null,args)},300);		
		return;
	}
	return mapIFrame.getMapMaxLevel();	
}

function getMapMaxLevelTip(title){
    var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getMapMaxLevelTip){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getMapMaxLevelTip.apply(null,args)},300);		
		return;
	}
	mapIFrame.getMapMaxLevelTip(title);
}


/**
* 方法描述：UTM投影法获取投影坐标
* @param longitude 经度
* @param latitude  纬度
* @return String x:..,y:..
*/
function getUTMCoordinate(longitude, latitude){
    var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getUTMCoordinate || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getUTMCoordinate){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getUTMCoordinate.apply(null,args)},300);		
		return;
	}
	return mapIFrame.getUTMCoordinate(longitude, latitude);	
}

/**
* 方法描述：创建菜单
* @param id 菜单id 
* @param x  x值
* @param y  y值
* @param attribute  属性
* @param type 菜单类型：list、tree
*/
function createMenuList(id,x,y,attribute,flag,type){
    var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.createMenuList || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().createMenuList){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){createMenuList.apply(null,args)},300);		
		return;
	}
	return mapIFrame.createMenuList(id,x,y,attribute,flag,type);	
}


/**
* 方法描述：移除菜单
* @param id 菜单id 
*/
function removeMenuList(id){
    var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.removeMenuList || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().removeMenuList){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){removeMenuList.apply(null,args)},300);		
		return;
	}
	return mapIFrame.removeMenuList(id);	
}
/**
* 方法描述：根据圆中心点坐标及半径得到圆的坐标串
* @param center 中心点坐标
* @param radius 半径
*/
function getCircle(center,radius,pointSize){
	 var mapIFrame = top.getMapIFrame();
	if(!mapIFrame || !mapIFrame.getCircle || !mapIFrame.window.getMapApp()||!mapIFrame.window.getMapApp().getCircle){
		var args = Array.prototype.slice.call(arguments,0);		
		setTimeout(function(){getCircle.apply(null,args)},300);		
		return;
	}
	return mapIFrame.getCircle(center,radius,pointSize);	
}

function getGeometrysExtent(geometryObjects){
	var mapIFrame = top.getMapIFrame();
	return mapIFrame.getGeometrysExtent(geometryObjects);	
}