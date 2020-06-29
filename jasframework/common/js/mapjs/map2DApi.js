/**
 * Created by Kong.Chao. on 2017/6/27.
 * Description:基于arcgis for js 3.18 地图api
 * Version:V-1.1.0
 * MainUpdateDate :2019.06.26 增加要素图层与底图坐标系不一致不能定位的bug,需要更新FeatureLayer.js;
 * LastUpdateDate :2019.07.04 增加addCircleGraphic接口方法;
 * LastUpdateDate :2019.07.25 增加addCircleGraphic接口方法;
 */
var Constants = {
    "events":{
        // 可以在项目中调用api的subscribe方法添加下列事件的监听
        "ErrorEvent":"ErrorEvent",//
        "MapInitEvent":"MapInitEvent",
        "MapLoadedEvent":"MapLoadedEvent",
        "MapCreateEvent":"MapCreateEvent",
        "ConfigLoadedEvent":"ConfigLoadedEvent",
        "InfoWindowShowEvent":"InfoWindowShowEvent",
        "InfoWindowHideEvent":"InfoWindowHideEvent",
        "BaseMapLayersLoadedEvent":"BaseMapLayersLoadedEvent",
        "OptionalLayersLoadedEvent":"OptionalLayersLoadedEvent",
        "OptionalLayerAddedEvent":"OptionalLayerAddedEvent",
        "OptionalLayersChangedEvent":"OptionalLayersChangedEvent",
        "LayerSetVisibleChangedEvent":"LayerSetVisibleChangedEvent",
        "ModuleStateChangedEvent":"ModuleStateChangedEvent",
        "ModulesLoadedEvent": "ModulesLoadedEvent",
        "ModuleStartupEvent": "ModuleStartupEvent",
        "MapResizedEvent": "MapResizedEvent",
        "MapStateChangedEvent": "MapStateChangedEvent",
        "MapGraphicsClearEvent": "MapGraphicsClearEvent"
    },
    "strings":{
        "dependenceLoading":"加载地图相关依赖资源",
        "apiLoading": "api初始化",
        "mapLoading": "地图初始化",
        "modulesLoading":"加载模块",
        "configLoading": "加载地图配置参数",
        "resourceLoaded": "地图资源加载完成",
        "appNameConfigError": "appName配置错误",
        "mapDivIdNotExitsError": "地图div配置错误,id不存在！",
        "parseConfigError": "地图配置解析失败,请检查配置数据格式是否正确！",
        "parseLayerConfigError": "图层配置解析出错,请检查相关图层配置是否正确！",
        "configUrlError": "js脚本标签没有配置data-config属性",
        "moduleClassNotFoundError": "该地图控件类没有定义",
        "moduleConfigError": "地图控件配置出错",
        "moduleReferError": "地图控件依赖文件modules.js没有加载",
        "moduleCreateError": "地图控件创建出错",
        "moduleNotFound": "地图控件没有找到",
        "moduleLoaded": "地图控件加载成功",
        "createLayerError": "图层创建失败，请检查配置！",
        "layerIdRepeatError": "图层创建失败，id已经存在！",
        "mapStyleNameRepeatError": "地图样式模版名称已经存在！",
        "mapStyleConfigError": "地图样式配置错误！",
        "hasNoLayerTypeError": "无法创建的图层类型",
        "layerTypeError": "图层类型错误",
        "layerNotLoaded": "该图层未加载",
        "layerUrlNotNull": "该类型图层url不能为空",
        "layerLoadError": "图层加载出现错误，请检查网络！",
        "layerListenerConfigError": "图层监听配置出错！",
        "eventNotRegister": "事件没有注册，回调函数无法执行",
        "eventNameRepeatError": "事件名称已经存在！",
        "graphicCreateError": "图形创建出错 ，请检查数据结构！",
        "getDistanceError": "计算距离出错！",
        "getAreaError": "计算面积出错！",
        "invalidFlashData": "没有找到要定位闪烁的图形，请检查定位条件！",
        "featureNotFound": "没有查询到目标要素，请检查查询条件！",
        "geometryNotFound": "没有查询到空间坐标数据！",
        "queryError": "查询出错！",
        "layerSetNotFound": "没有找到对应的layerSet",
        "repeatIdError": "重复ID",
        "hasNoIdError": "ID不存在",
        "hasNoLabelPropertyError": "图层没有包含标注所需要的属性字段，请检查图层的outFields配置",
        "hasNoStyleError": "样式不存在",
        "hasNoProj4js": "自定义投影需要引入proj4.js",
        "requireJqueryJS": "需要引入jquery依赖",
        "hasNoJqueryEasyUILib": "需要引入jquery easyUI依赖",
        "hasNoConfigDataError":"配置不存在",
        "callbackConfigNeeded":"需要配置callback参数",
        "exportResourceNeeded":"地图导出功能需要引入FileSaver.js",
        "mapRealExtent":"地图实际范围",
        "mapMaxExtent":"地图最大允许范围",
        "layerRenderError":"图层渲染出错，请检查图层渲染设置！",
        "measureLengthResultPrefixLabel":"",
        "measureLengthUnitMeter":"米",
        "measureLengthUnitKilometer":"千米",
        "measureAreaResultPrefixLabel":"",
        "measureAreaUnitSquareMeter":"平方米",
        "measureAreaUnitSquareKilometer":"平方千米",
        "blankContentTip":"",
        "browserDoesNotSupport":"浏览器不支持",
        "svgDoesNotSupport":"浏览器不支持svg，发光特效不能使用，建议使用ie9以上或chrome浏览器访问系统",
        "clearThisLengthMeasure":"清除本次测距",
        "queryNearestPointError":"获取线上距线外某点最近的点计算出错，请检查参数或几何服务是否可用！",
        "sridNotEqualsWithBasemap":"要素图层坐标系参考与底图不一致，位置定位可能出现偏差！",
        "geometryMissing":"几何对象缺失，要素不能被绘制。",
        "geometryUndefined":"几何对象类型不支持。",
        "unsupportedEventType":"事件类型不支持！",
        "requireMoreCoordinates":"坐标数量太少！",
        "routeParamOrDataError":"轨迹回放参数错误或数据错误！",
        "rendererFunctionError":"rendererFunction方法必须返回几何对象所要绘制的参数对象，参数结构参考addPictureGraphic、addPointGraphic、addPolylineGraphic、addPolygonGraphic等接口的options参数！"
    }
};
/**
 * arcgis 特有配置
 * @type {null}
 */
var dojoConfig = null;
/**
 * 地图api类
 */
var M = JasMap = null;
//加载平台依赖的类库和配置文件、浏览器兼容问题处理
(function(global){
    var root = location.pathname.replace(/\/[^/]*$/, '') ;
    var mapApiScriptId = "mapApi";
    ///-------------浏览器兼容扩展函数--->>>>>>>>>>
    //ie8 兼容 Array.indexOf
    if (!Array.prototype.indexOf){
        Array.prototype.indexOf = function(elt /*, from*/){
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++){
                if (from in this && this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    if (!Array.isArray ||!Array.prototype.isArray ){
        Array.isArray = Array.prototype.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }
    if (!Array.prototype.forEach ) {
        Array.prototype.forEach = function forEach(callback, thisArg) {
            var T, k;
            if (this == null) {
                throw new TypeError("this is null or not defined");
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callback !== "function") {
                throw new TypeError(callback + " is not a function");
            }
            if (arguments.length > 1) {
                T = thisArg;
            }
            k = 0;
            while (k < len) {
                var kValue;
                if (k in O) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        };
    }
    if (!String.prototype.trim){
        String.prototype.trim = function (){
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
    }
    if (!Function.prototype.bind) {
        Function.prototype.bind = function () {
            var self = this,                        // 保存原函数
                context = [].shift.call(arguments), // 保存需要绑定的this上下文
                args = [].slice.call(arguments);    // 剩余的参数转为数组
            return function () {                    // 返回一个新函数
                self.apply(context, [].concat.call(args, [].slice.call(arguments)));
            }
        }
    }
    if (!document.getElementsByClassName){
        document.getElementsByClassName = function (searchClass, node,tag) {
            var result = [] ;
            node = node || document;
            tag = tag || "*";
            var classes = searchClass.split(" "),
                elements = (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag),
                patterns = [],
                current,
                match;
            var i = classes.length;
            while(--i >= 0){
                patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
            }
            var j = elements.length;
            while(--j >= 0){
                current = elements[j];
                match = false;
                for(var k=0, kl=patterns.length; k<kl; k++){
                    match = patterns[k].test(current.className);
                    if (!match)  break;
                }
                if (match)  result.push(current);
            }
            return result;

        }
    }
    //
    M = JasMap = function(options) {
        var _this = this;
        var basePath = "";
        var apiDefaults = {
            mapDivId:"jasMap",
            appScriptId:"mapApi",
            highlightGraphicLayerId:"drawlayer_highlight",
            flashExpend: 1.5,
            appName: "",
            appConfig:"config.json",
            defaultZoomLevel: 3,
            featureLayerMode:6,//FeatureLayer.MODE_AUTO,
            defaultSymbolColor: [255, 0, 0, 255],
            defaultSymbolFillColor: [115, 76, 45, 100],
            defaultHighlightColor: [0, 0, 255, 255],
            defaultHighlightFillColor: [255, 0, 255, .8],
            geometryService: "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
            printService: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
            onConfigLoaded:function(e){

            },
            onMapLoaded:function(e){

            },
            onMapInit:function(e){

            },
            onBaseMapLayersLoaded:function(e){

            },
            onOptionalLayersLoaded:function(e){

            },
            onLayerAdded:function(e){

            },
            onError:function(){

            },
            onModulesLoaded:function(e){

            },
            onModuleStartup:function(e){

            },
            onMapResized:function(e){

            }
        };
        _this.startup = function () {
            return _this;
        };
        require([
            'dojo/_base/lang', 'dojo/_base/array', 'dojo/Deferred', 'dojo/promise/all', "dojo/_base/event", "dojo/dom-construct", "dojo/topic",
            "esri/units","esri/urlUtils", "esri/tasks/GeometryService",
            "esri/tasks/LengthsParameters", "esri/tasks/AreasAndLengthsParameters","esri/tasks/BufferParameters","esri/tasks/DistanceParameters",
            "esri/basemaps", "esri/map", "esri/SpatialReference","esri/geometry/Extent", "esri/geometry/Point", "esri/geometry/Circle","esri/geometry/Polyline",
            "esri/InfoTemplate", "esri/graphic", "esri/graphicsUtils", "esri/geometry/Geometry" ,"esri/geometry/ScreenPoint",
            "esri/geometry/screenUtils", "esri/geometry/webMercatorUtils",
            "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/layers/VectorTileLayer",
            "esri/symbols/Symbol", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
            "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/Color",
            "esri/geometry/jsonUtils", "esri/toolbars/navigation", "esri/toolbars/draw", "esri/toolbars/edit", "esri/geometry/geometryEngine",
            "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/dijit/Scalebar", "esri/dijit/Popup","esri/tasks/query","esri/tasks/QueryTask",
            "jasgroup/layers/FlashFeatureLayer", "jasgroup/layers/DrawLayer", "jasgroup/layers/TiandituLayer", "jasgroup/layers/PipelineLayer",
            "jasgroup/layers/GaodeLayer","jasgroup/layers/BaiduLayer","jasgroup/layers/EsriTiledLayer",
            "dojo/domReady!"
        ], function (lang, array, Deferred, all, Event, domConstruct, topic, units ,urlUtils,
                     GeometryService, LengthsParameters, AreasAndLengthsParameters, BufferParameters,DistanceParameters,
                     esriBasemaps, Map, SpatialReference,Extent, Point, Circle, Polyline,
                     InfoTemplate, Graphic, graphicsUtils, Geometry , ScreenPoint, screenUtils, webMercatorUtils,
                     ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, FeatureLayer, GraphicsLayer, VectorTileLayer,
                     Symbol,SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, PictureMarkerSymbol, SimpleFillSymbol, TextSymbol, Font, Color,
                     jsonUtils, Navigation, Draw, Edit, geometryEngine,
                     PrintTask, PrintParameters, Scalebar, Popup, Query ,QueryTask ,
                     FlashLayer, DrawLayer, TiandituLayer, PipelineLayer,GaodeLayer,BaiduLayer,EsriTiledLayer) {

            apiDefaults = lang.mixin({}, apiDefaults, options);

            var eventManager = new EventManager();
            var layerManager = new LayerManager();//
            var mapManager = new MapManager();
            var moduleManager = new ModuleManager();
            var styleManager = new StyleManager();
            var configManager = new ConfigManager(apiDefaults);
            var commonUtil = new CommonUtil();
            var geometryUtil = new GeometryUtil();
            //------------私有方法和属性------------
            var domId = apiDefaults.mapDivId;
            _this.apiConfig = null;//
            _this.domainMap = {};//新增阈值处理
            _this.Events = null;
            _this.Strings = null;
            _this.Keys = null;
            _this.map = null;
            _this.mapDialog = {};
            _this.domFactory = new SimpleDomFactory();
            _this.getEventManager = function(){
                return eventManager;
            };
            _this.getMapManager = function(){
                return mapManager;
            };
            _this.getLayerManager = function(){
                return layerManager;
            };
            //------------私有方法和属性------------
            var startup = function () {
                _this.Events = Constants.events;
                _this.Strings = Constants.strings;
                _this.Keys = Constants.keys;
                _this.commonUtil = commonUtil;
                _this.geometryUtil = geometryUtil;

                _this.subscribe( _this.Events .ConfigLoadedEvent ,apiDefaults.onConfigLoaded);
                //_this.subscribe( _this.Events .MapInitEvent ,apiDefaults.onMapInit);
                _this.subscribe( _this.Events .MapLoadedEvent ,apiDefaults.onMapLoaded);
                _this.subscribe( _this.Events .ErrorEvent ,apiDefaults.onError);
                _this.subscribe( _this.Events .ModulesLoadedEvent ,apiDefaults.onModulesLoaded);
                _this.subscribe( _this.Events .ModuleStartupEvent ,apiDefaults.onModuleStartup);
                _this.subscribe( _this.Events .OptionalLayerAddedEvent ,apiDefaults.onLayerAdded);
                _this.subscribe( _this.Events .OptionalLayersLoadedEvent ,apiDefaults.onOptionalLayersLoaded);
                _this.subscribe( _this.Events .BaseMapLayersLoadedEvent ,apiDefaults.onBaseMapLayersLoaded);
                _this.subscribe( _this.Events .MapResizedEvent ,apiDefaults.onMapResized);
                //
                eventManager.startup();
                layerManager.startup();
                mapManager.startup();
                moduleManager.startup();
                styleManager.startup();
                configManager.startup();
            };

            //------------------地图操作类----------------------
            _this.startPanMode = function () {
                mapManager.activate(MapManager.NAVIGATOR, [Navigation.PAN]);
                _this.map.setMapCursor("default");
                _this.hideZoomSlider(false);
                //地图状态改变
                var state = {
                    type: MapManager.NAVIGATOR,
                    target:"startPanMode"
                };
                eventManager.publishEvent(_this.Events.MapStateChangedEvent,state);
            };
            _this.panLeft = function(){
                return _this.map.panLeft();
            };
            _this.panRight = function(){
                return _this.map.panRight();
            };
            _this.panUp = function(){
                return _this.map.panUp();
            };
            _this.panDown = function(){
                return _this.map.panDown();
            };
            _this.fullscreen = function(){
                var full = null;
                var context = window ;
                var target = configManager.context.fullscreenTarget;
                if(!target || target==='map'){
                    full = _this.map.container;
                }else if(target==='parent'){
                    full = _this.map.container.parentNode;
                }else if(target==='body'){
                    full = window.document.body;
                }else if(target.indexOf('#') === 0){
                    full = window.document.getElementById(target.substr(1));
                }else if(target.indexOf('root') === 0){
                    var index = target.indexOf('#') + 1;
                    context = window.parent;
                    full = context.document.getElementById(target.substr(index));
                }
                if(commonUtil.isFullscreen(context)){
                    commonUtil.exitFullscreen(context);
                }else{
                    full.style.backgroundColor = "white";
                    commonUtil.launchIntoFullscreen(full,context);
                }
            };
            _this.centerAt = function (x, y) {
                x = parseFloat(x);
                y = parseFloat(y);//
                return _this.map.centerAt(new Point(x, y, _this.map.spatialReference));
            };
            _this.setLevel = function (level) {
                return _this.map.setLevel(level);
            };
            _this.levelUp = function () {
                var level = _this.map.getLevel();
                return _this.map.setLevel(++level);
            };
            _this.levelDown = function () {
                var level = _this.map.getLevel();
                return _this.map.setLevel(--level);
            };
            _this.zoomIn = function () {
                _this.map.setMapCursor("crosshair");
                mapManager.activate(MapManager.NAVIGATOR, [Navigation.ZOOM_IN]);
                eventManager.publishEvent(_this.Events.MapStateChangedEvent,{
                    type: MapManager.NAVIGATOR,
                    target:"zoomIn"
                });
            };
            _this.zoomHome = function(){
                var ext = configManager.getMapOption("extent");
                _this.zoomExtent(ext.xmin ,ext.ymin ,ext.xmax ,ext.ymax);
            };
            _this.zoomOut = function () {
                _this.map.setMapCursor("crosshair");
                mapManager.activate(MapManager.NAVIGATOR, [Navigation.ZOOM_OUT]);
                eventManager.publishEvent(_this.Events.MapStateChangedEvent,{
                    type: MapManager.NAVIGATOR,
                    target:"zoomOut"
                });
            };
            _this.zoomAt = function (level, x, y) {
                x = parseFloat(x);
                y = parseFloat(y);
                return _this.map.centerAndZoom(new Point(x, y, _this.map), level ? level : apiDefaults.level);
            };
            _this.zoomGeometrys = function (geoJsons, level) {
                var g = jsonUtils.fromJson(geoJsons);
                var c = _this.getCenter(g);
                return _this.map.centerAndZoom(c, level ? level : apiDefaults.level);
            };
            _this.zoomLayer = function (layerId) {
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    if (layer.minScale) {
                        return _this.map.setScale(layer.minScale);
                    } else {
                        var extent = graphicsUtils.graphicsExtent(layer.graphics);
                        return _this.map.setExtent(extent);
                    }
                }
            };
            _this.zoomExtent = function (xmin, ymin, xmax, ymax) {
                var ext = new Extent(xmin, ymin, xmax, ymax, _this.map.spatialReference);
                return _this.map.setExtent(ext);
            };
            _this.hideZoomSlider = function (flg) {
                if (flg) {
                    _this.map.hideZoomSlider();
                } else {
                    _this.map.showZoomSlider();
                }
            };
            _this.addGraphicsLayer = function(id ,options){
                var op = options;
                if(!op){
                    op = {};
                }
                op.id = id ;
                return _this.addLayer(op);
            };
            _this.addLayer = function (options) {
                var defaults = {
                    "id": "",
                    "type": "graphic",
                    "index":null
                };
                defaults = lang.mixin({}, defaults, options);
                var layer = layerManager.createLayer(defaults);
                _this.map.addLayer(layer,defaults.index );
                return layer;
            };
            _this.createGraphicLayer = function (id, layerOpts) {
                var options = layerOpts ? layerOpts : {};
                options.id = id;
                options.type = "graphic";
                var layer = layerManager.createLayer(options);
                _this.map.addLayer(layer ,options.index);
                return layer;
            };
            _this.removeGraphics = function (options) {
                var defaults = {
                    layerId: null,
                    attributes: null
                };
                var params = lang.mixin({}, defaults, options);
                var layer;
                var targetGraphics = [];
                if (params.layerId == null)
                    layer = _this.map.graphics;
                else
                    layer = _this.getLayerById(params.layerId);
                if (!params.attributes) {
                    return;
                }
                for (var i = 0; i < layer.graphics.length; i++) {
                    var gra = layer.graphics[i];
                    var graAttr = gra.attributes;
                    var ifTarget = true;
                    if (graAttr && typeof graAttr === "object") {
                        for (var key in params.attributes) {
                            var attrValue = params.attributes[key];
                            var graAttrValue = graAttr[key];
                            if (graAttrValue != attrValue) {
                                ifTarget = false;
                                break;
                            }
                        }
                        ifTarget && targetGraphics.push(gra);
                    }
                }
                for (var j = 0; j < targetGraphics.length; j++) {
                    layer.remove(targetGraphics[j]);
                }
                mapManager.refreshLayerTipDom();
            };
            _this.removeGraphicById = function(id ,layerId){
                var params = {
                    layerId : layerId,
                    attributes:{
                        id:id
                    }
                };
                _this.removeGraphics(params );
            };
            _this.removeLayerByIds = function (layerIds) {
                array.forEach(layerIds, function (id) {
                    var layer = _this.getLayerById(id);
                    if (layer) {
                        _this.map.removeLayer(layer);
                    }
                });
                mapManager.refreshLayerTipDom();
            };
            _this.refreshLayerById = function (layerId ) {
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    layer.redraw();
                    //

                    //
                }
                mapManager.refreshLayerTipDom();
            };
            _this.removeAllLayers = function () {//慎用
                _this.map.removeAllLayers();
                mapManager.refreshLayerTipDom();
            };
            _this.layerVisibleSwitch = function (layerId, visible) {
                var groupId = layerManager.groupedLayers[layerId];
                if(groupId){
                    for(var key in layerManager.groupedLayers){
                        var gId = layerManager.groupedLayers[key] ;
                        var ly = _this.getLayerById(key);
                        if(gId === groupId && ly){
                            ly.setVisibility(visible);
                        }
                    }
                    _this.publish(_this.Events.LayerSetVisibleChangedEvent,{
                        id:groupId,
                        visible:visible
                    })
                }else{
                    var layer = _this.getLayerById(layerId);
                    if (layer) {
                        layer.setVisibility(visible);
                        return layer;
                    }
                    eventManager.log(_this.Strings["layerNotLoaded"] + layerId);
                }
            };
            _this.clearGraphicsLayer = function (layerId) {
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    layer.clear();
                }
                mapManager.refreshLayerTipDom();
            };
            _this.clearMapGraphics = function () {
                var layer = _this.map.graphics;
                if (layer) {
                    layer.clear();
                }
            };
            _this.clearHighlightGraphics = function(){
                for(var layerId in  mapManager.currentHighlightLayers){
                    _this.clearHighlightGraphic(layerId ) ;
                }
            };
            _this.clearHighlightGraphic = function(layerId){
                layerId = layerId ? layerId :_this.map.graphics.id ;
                var flg = mapManager.currentHighlightLayers[layerId];
                if(flg){
                    var layer = null;
                    if(layerId === _this.map.graphics.id){
                        layer = _this.map.graphics;
                    }else{
                        layer = _this.getLayerById(layerId);
                    }
                    if( apiDefaults.highlightGraphicLayerId.toUpperCase() === layerId){
                        _this.clearGraphicsLayer(layerId);
                    }else{
                        for(var i = 0 ; i < layer.graphics.length ;i++){
                            var gra = layer.graphics[i];
                            if(gra._beforeSymbol && gra._highlight === true){
                                gra.setSymbol(gra._beforeSymbol);
                            }
                        }
                    }
                    layer.hightlightGraphicIdsObject = null;
                    delete mapManager.currentHighlightLayers[layerId];
                }
            };
            _this.setPointLayerRenderer = function (layerId, symbolObject) {
                var defaults = {
                    "color": [255, 255, 255, 64],
                    "size": 12,
                    "angle": -30,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriSMS",
                    "style": "esriSMSCircle",
                    "outline": {
                        "color": [0, 0, 0, 255],
                        "width": 1,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    }
                };
                var options = lang.mixin(defaults, symbolObject);
                var layer = _this.getLayerById(layerId);
                var symbol = new SimpleMarkerSymbol(options);
                var renderer = new SimpleRenderer(symbol);
                layer.setRenderer(renderer);
            };
            _this.setPointLayerPictureRenderer = function (layerId, symbolObject) {
                var defaults = {
                    "url": "images/point.png",
                    "height": 20,
                    "width": 20,
                    "type": "esriPMS",
                    "angle": 0
                };
                var options = lang.mixin(defaults, symbolObject);
                var layer = _this.getLayerById(layerId);
                var symbol = new PictureMarkerSymbol(options);
                var renderer = new SimpleRenderer(symbol);
                layer.setRenderer(renderer);
            };
            _this.setLineLayerRenderer = function (layerId, symbolObject) {
                var defaults = {
                    "type": "esriSLS",
                    "style": "esriSLSDot",
                    "color": [115, 76, 0, 255],
                    "width": 1
                };
                var options = lang.mixin(defaults, symbolObject);
                var layer = _this.getLayerById(layerId);
                var symbol = new SimpleLineSymbol(options);
                var renderer = new SimpleRenderer(symbol);
                layer.setRenderer(renderer);
            };
            _this.setPolygonLayerRenderer = function (layerId, symbolObject) {
                var defaults = {
                    "type": "esriSFS",
                    "style": "esriSFSSolid",
                    "color": [115, 76, 0, 255],
                    "outline": {
                        "type": "esriSLS",
                        "style": "esriSLSSolid",
                        "color": [110, 110, 110, 255],
                        "width": 1
                    }
                };
                var options = lang.mixin(defaults, symbolObject);
                var layer = _this.getLayerById(layerId);
                var symbol = new SimpleFillSymbol(options);
                var renderer = new SimpleRenderer(symbol);
                layer.setRenderer(renderer);
            };
            _this.setLayerOpacity = function (layerId, opacity) {
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    layer.setOpacity(opacity);
                }
            };
            _this.setLayerTips = function (layerId, fieldName, options) {
                var defaults = {
                    "domIndex": 99999999,
                    "fontSize": "10px",
                    "fontStyle": "STYLE_NORMAL",
                    "fontFamily": "Serif",
                    "template": "${0}",
                    "filterFunc":null
                };
                defaults = lang.mixin({}, defaults, options);
                var layer = _this.getLayerById(layerId);
                var parseTemplate = function (attributes, template, names) {
                    var fieldNames = [];
                    if (names.indexOf(",") >= 0)
                        fieldNames = names.split(",");
                    else
                        fieldNames.push(names);
                    if (fieldNames.length > 1 && template === "${0}") {
                        for (var idx = 1; idx < fieldNames.length; idx++) {
                            template = template + "<br>" + "${" + idx + "}";
                        }
                    }
                    var result = template;
                    for (var i = 0; i < fieldNames.length; i++) {
                        var ss = "${" + i + "}";
                        var attr = attributes[fieldNames[i]];
                        if (result.indexOf(ss) >= 0 ) {
                            result = result.replace(ss, attr ? attr : _this.Strings.blankContentTip);
                        }
                    }
                    return template === result ? "" : result;
                };
                var showLayerTips = function (flag, event) {
                    if (!layer)  return;
                    mapManager.refreshLayerTipDom();
                    if (flag) {
                        var graphic = event.graphic;
                        var point = null;
                        if (graphic) {
                            if (graphic.geometry.type !== "point") {
                                point = graphic.geometry.getExtent().getCenter();
                            } else {
                                point = graphic.geometry;
                            }
                        } else {
                            return;
                        }
                        _this.map.setMapCursor("pointer");
                        if (layer._domain) {
                            var gra = graphic;
                            var attr = gra.attributes;
                            var domain = layer._domain;
                            for (var f in domain) {
                                var domainName = domain[f];
                                var codeId = attr[f];
                                if (codeId !== null) {
                                    var codeName = _this.domainMap[domainName + codeId];
                                    var domainFieldName = f + "DOMAIN";
                                    attr[domainFieldName] = codeName;
                                }
                            }
                            gra.setAttributes(attr);
                        }
                        var scrPt = _this.map.toScreen(point);
                        var textDiv = domConstruct.create("div");
                        dojo.attr(textDiv, {
                            "id": "text"
                        });
                        dojo.style(textDiv, {
                            "left": scrPt.x + 10 + "px",
                            "top": scrPt.y + 10 + "px",
                            "position": "absolute",
                            "z-index": defaults.domIndex,
                            "background-color": "#fcffd1",
                            "font-family":defaults.fontFamily,
                            "font-size": defaults.fontSize,
                            "font-style":  Font[defaults.fontStyle],
                            "border": "1px solid #0096ff",
                            "padding": "0.1em 0.3em 0.1em",
                            "border-radius": "3px",
                            "box-shadow": "0 0 0.75em #777777"
                        });
                        var attrs = graphic.attributes;
                        if(defaults.filterFunc && typeof defaults.filterFunc === "function" ){
                            attrs = defaults.filterFunc(attrs);
                        }
                        var context = parseTemplate( attrs, defaults.template, fieldName);
                        if (context) {
                            textDiv.innerHTML = context;
                            mapManager.refreshLayerTipDom(textDiv);
                        }
                    } else {
                        _this.map.setMapCursor("default");
                    }
                };
                if (layer) {
                    //layer.tipsDom = null;
                    if (layer.tipsOnMouseOverEventHandler) {
                        eventManager.destroyEventHandler(layer.tipsOnMouseOverEventHandler);
                    }
                    if (layer.tipsOnMouseOutEventHandler) {
                        eventManager.destroyEventHandler(layer.tipsOnMouseOutEventHandler);
                    }
                    layer.tipsOnMouseOverEventHandler = layer.on("mouse-over", function (e) {
                        showLayerTips(true, e);
                    });
                    layer.tipsOnMouseOutEventHandler = layer.on("mouse-out", function (e) {
                        showLayerTips(false);
                    });
                }
            };
            _this.addLayerTips = function(layer ,template ,options){
                var defaults = {
                    "position": "absolute",
                    "z-index": 99999999,
                    "background": "#fcffd1",
                    "font-family":"arial",
                    "font-size": "10px",
                    "font-style": "",
                    "border": "1px solid #0096ff",
                    "padding": "0.1em 0.3em 0.1em",
                    "border-radius": "3px",
                    "box-shadow": "0 0 0.75em #777777",
                    "filterFunc":null
                };
                var params = lang.mixin(defaults, options);
                if( !layer) return ;
                if (!layer.tipsOnMouseOverEventHandler) {
                    layer.tipsOnMouseOverEventHandler = layer.on("mouse-over", function (e) {
                        mapManager.showGraphicTip(true, e.graphic ,template ,params);
                    });
                }
                if (!layer.tipsOnMouseOutEventHandler) {
                    layer.tipsOnMouseOutEventHandler = layer.on("mouse-out", function (e) {
                        mapManager.showGraphicTip(false );
                    });
                }
                layer._tip = true ;

            };
            _this.getSymbolByObject = function (symbolObject) {
                var symbol = null;
                switch (symbolObject.type) {
                    case "esriSMS" :
                        symbol = new SimpleMarkerSymbol(symbolObject);
                        break;
                    case "esriSLS" :
                        symbol = new SimpleLineSymbol(symbolObject);
                        break;
                    case "esriSFS" :
                        symbol = new SimpleFillSymbol(symbolObject);
                        break;
                    case "esriPMS" :
                        symbol = new PictureMarkerSymbol(symbolObject);
                        break;
                    case "esriTS" :
                        symbol = new TextSymbol(symbolObject);
                        break;
                    default:
                        ;
                }
                return symbol;
            };
            _this.flashLayer = function (layerId, options) {
                var defaults = {
                    repeatCount: 5,//
                    layerOpacity: 0.5,
                    center: true,
                    delay: 500//ms
                };
                defaults = lang.mixin({}, defaults, options);
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    var preOpacity = layer.opacity;
                    var count = defaults.repeatCount;
                    var flash = true;
                    var doFlash = function () {
                        var flashTimer = setInterval(function (e) {
                            if (count == 0) {
                                clearInterval(flashTimer);
                                layer.setOpacity(preOpacity);
                                return;
                            }
                            if (flash) {
                                layer.setOpacity(defaults.layerOpacity);
                                count--;
                            } else {
                                layer.setOpacity(preOpacity);
                            }
                            flash = !flash;
                        }, defaults.delay);
                    };
                    if (defaults.center && layer.initialExtent) {
                        _this.map.setExtent(layer.initialExtent).then(function () {
                            doFlash();
                        });
                    } else {
                        doFlash();
                    }
                } else {
                    eventManager.log("图层没有加载，layerId=" + layerId);
                }
            };
            _this.setLayerInfoWindow = function (layerId, title, content) {
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    layer.infoTemplate = new InfoTemplate(title, content);
                }
            };
            _this.getExtent = function(graphics){
                return graphicsUtils.graphicsExtent(graphics) ;
            };
            _this.getLayerVisible = function (layerId) {
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    return layer.visible;
                }
                return false;
            };
            _this.getMapLevel = function () {
                return _this.map.getLevel();
            };
            _this.getMapMaxLevel = function () {
                return _this.map.getMaxZoom();
            };
            _this.getXY = function (callback) {
                if (typeof callback === "function") {
                    var beforeCursor = _this.map.cursor;
                    if (beforeCursor !== "crosshair") {
                        _this.map.setMapCursor("crosshair");
                    }
                    var _onMapClickHandler = _this.map.on("click", function (e) {
                        _onMapClickHandler.remove();
                        _this.map.setMapCursor(beforeCursor);
                        callback(e.mapPoint.x + "," + e.mapPoint.y);
                    });
                }
            };
            _this.getLayerById = function (id) {
                if(_this.map.graphics && id===_this.map.graphics.id)
                    return _this.map.graphics;
                var layerId = id && id.toUpperCase();
                return _this.map.getLayer(layerId);
            };
            _this.getLayerByName = function(name){

            };
            _this.getMapCenter = function () {
                return _this.map.extent.getCenter();
            };
            _this.getMapExtent = function () {
                return _this.map.extent;
            };
            _this.getCircle = function (center, radius, pointSize) {
                var c = new Circle(center, {"radius": radius});
                var points = [];
                var ringNum = c.rings.length;
                for (var ringIndex = 0; ringIndex < ringNum.length; ringIndex++) {
                    for (var pointIndex = 0; pointIndex < pointSize; pointIndex++) {
                        points.push(c.getPoint(ringIndex, pointIndex));
                    }
                }
                return points;
            };
            _this.getCenterLocation = function (strGeo) {
                var g = jsonUtils.fromJson(strGeo);
                var center = _this.getCenter(g);
                return center;
            };
            _this.getCenter = function (g) {//new
                var center = null;
                switch (g.type) {//point | multipoint | polyline | polygon | extent
                    case "point":
                        center = g;
                        break;
                    case "mutilpoint":
                        ;
                    case "polyline":
                        ;
                    case "polygon" :
                        center = g.getExtent().getCenter();
                        break;
                    case "extent" :
                        center = g.getCenter();
                        break;
                    default :
                }
                return center;
            };
            _this.addMapEvent = function (type, callback) {
                return _this.map.on(type, callback);
            };
            _this.addMapLoadedEventListener = function (callBack) {
                return _this.addMapEvent("load", callBack);
            };
            _this.addZoomEventListener = function ( callBack) {
                return _this.addMapEvent("zoom", callBack);
            };
            _this.addExtentEventListener = function (callBack) {
                return _this.addMapEvent("extent-change", callBack);
            };
            _this.addMouseMoveEventListener = function ( callBack) {
                return _this.addMapEvent("mouse-move", callBack);
            };
            _this.addLayerClickEventListener = function ( layerId, callBack) {
                if(!layerId || "default" === layerId){
                    return _this.map.graphics.on("click", callBack);
                };
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    return layer.on("click", callBack);
                } else {
                    return null;
                }
            };
            _this.addLayerVisibilityChangeEventListener = function ( layerId, callBack) {
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    return layer.on("visibility-change", callBack);
                }
                eventManager.publishInfo(_this.Strings["layerNotLoaded"] + layerId);
            };
            _this.removeEventListener = function (listener) {
                return eventManager.destroyEventHandler(listener);
            };
            _this.addFeatures = function(layerId,features,rendererFunction){
                var renderer = function(attr ,geom){
                    var options = null ;
                    if(rendererFunction && typeof rendererFunction === 'function'){
                        options = rendererFunction(attr ,geom);
                    }
                    if(options === undefined){
                        eventManager.publishError( _this.Strings.rendererFunctionError);
                    }
                    return options ? options:{};
                };
                var graphics = [];
                for(var i = 0 ; i < features.length ; i++){
                    var graphic = null;
                    var feature = features[i] ;
                    var attr = feature.attributes ;
                    var geom = feature.geometry ;
                    if(!geom){
                        eventManager.publishWarn(_this.Strings.geometryMissing + " ,i=" + i);
                        continue ;
                    }
                    var options = renderer(attr,geom);
                    options.layerId = layerId;
                    if(geom.paths){
                        graphic = _this.addPolylineGraphic(geom.paths ,options );
                    }else if(geom.rings){
                        graphic = _this.addPolygonGraphic(geom.rings ,options );
                    }else if(geom.x && geom.y){
                        if(options.url){
                            graphic = _this.addPictureGraphic(geom.x ,geom.y ,options);
                        }else{
                            graphic = _this.addPointGraphic(geom.x ,geom.y ,options);
                        }
                    }else{
                        eventManager.publishWarn(_this.Strings.geometryUndefined+ " ,i=" + i);
                    }
                    if(graphic){
                        graphics.push(graphic) ;
                    }
                }
                return graphics ;
            };
            _this.addGraphics = function (layerId, graphicObjects, center, flash ,layerOps ) {
                try {
                    var layer = layerManager.getOrCreateLayer(layerId ,layerOps);
                    var graphics = [];
                    for (var i = 0; i < graphicObjects.length; i++) {
                        var geoObj = graphicObjects[i];
                        var gra = new Graphic(geoObj);
                        layer.add(gra);
                        graphics.push(gra);
                    }
                } catch (e) {
                    eventManager.publishError(_this.Strings["graphicCreateError"], e);
                }
                if (center === true) {
                    _this.flashGraphic(graphics ,layerId,{
                        flash:flash === false ? false :true
                    });
                }
                return graphics;
            };
            _this.addPictureGraphic = function ( x, y, options) {
                var defaults = {
                    center: false,
                    flash: true,
                    angle: 0,
                    url: "images/location.png",
                    width: 24,
                    height: 24,
                    xoffset:0,
                    yoffset:0,
                    attributes: null,
                    layerId: null
                };
                var params = lang.mixin({}, defaults, options);
                var pictureMarkerSymbol = {
                    angle:params.angle,
                    url: params.url,
                    width: params.width,
                    height: params.height,
                    xoffset:params.xoffset,
                    yoffset:params.yoffset,
                    type: "esriPMS"
                };
                var geometry = {
                    "x": parseFloat(x),
                    "y": parseFloat(y),
                    "spatialReference": {
                        "wkid": _this.map.spatialReference.wkid
                    }
                };
                var attributes = params.attributes;
                var graphicObject = {
                    geometry: geometry,
                    attributes: attributes,
                    symbol: pictureMarkerSymbol
                };
                return _this.addGraphics(params.layerId, [graphicObject], params.center , params.flash)[0];
            };
            _this.addPointGraphic = function ( x, y, options) {
                var defaults = {
                    "layerId": "",
                    "layerIndex":null,
                    "attributes": null,
                    "center": false,
                    flash: true,
                    "color": [255, 255, 255, 255],
                    "size": 12,
                    "angle": 0,
                    "xoffset": 0,
                    "yoffset": 0,
                    "style": "circle",
                    "outlineColor": [0, 0, 0, 255],
                    "outlineWidth": 1,
                    "outlineStyle": "solid"
                };
                var params = lang.mixin(defaults, options);
                var shapeStyle = styleManager.getPointSymbolType(params.style);
                var outlineStyle = styleManager.getPolylineSymbolType(params.outlineStyle);
                var simpleMarkerSymbolObj = {
                    "color": params.color,
                    "size": params.size,
                    "angle": params.angle,
                    "xoffset": params.xoffset,
                    "yoffset": params.yoffset,
                    "type": "esriSMS",
                    "style": "esriSMS" + shapeStyle,
                    "outline": {
                        "color": params.outlineColor,
                        "width": params.outlineWidth,
                        "type": "esriSLS",
                        "style": "esriSLS" + outlineStyle
                    }
                };
                var geometryObj = {
                    "x": parseFloat(x),
                    "y": parseFloat(y),
                    "spatialReference": {
                        "wkid": _this.map.spatialReference.wkid
                    }
                };
                var attributes = params.attributes;
                var graphicObject = {
                    geometry: geometryObj,
                    attributes: attributes,
                    symbol: simpleMarkerSymbolObj
                };
                var ops = {
                    index:params.layerIndex
                };
                return _this.addGraphics(params.layerId, [graphicObject], params.center, params.flash,ops)[0];
            };
            _this.addPolylineGraphic = function ( paths, options) {
                var defaults = {
                    "layerId": "",
                    "layerIndex":null,
                    "attributes": null,
                    "center": false,
                    "flash": true,
                    "width": 1,
                    "color": [0, 0, 0, 255],
                    "style": "solid"
                };
                var params = lang.mixin(defaults, options);
                var shapeStyle = styleManager.getPolylineSymbolType(params.style);
                var symbolObj = {
                    "width": params.width,
                    "color": params.color,
                    "style": "esriSLS" + shapeStyle,
                    "type": "esriSLS"
                };
                var geometryObj = {
                    "hasZ": false,
                    "hasM": false,
                    "paths": paths,
                    "spatialReference": {
                        "wkid": _this.map.spatialReference.wkid
                    }
                };
                var attributes = params.attributes;
                var graphicObject = {
                    geometry: geometryObj,
                    attributes: attributes,
                    symbol: symbolObj
                };
                var ops = {
                    index:params.layerIndex
                };
                return _this.addGraphics(params.layerId, [graphicObject], params.center, params.flash,ops)[0];
            };
            _this.addPolygonGraphic = function ( rings, options) {
                var defaults = {
                    "layerId": "",
                    "attributes": null,
                    "center": false,
                    "flash": true,
                    "color": [255, 255, 255, 255],//填充色
                    "style": "solid",
                    "outlineColor": [0, 0, 0, 255],
                    "outlineWidth": 1,
                    "outlineStyle": "solid"
                };
                var params = lang.mixin(defaults, options);
                var shapeStyle = styleManager.getPolygonSymbolType(params.style);
                var outlineStyle = styleManager.getPolygonSymbolType(params.outlineStyle);
                var symbolObj = {
                    "color": params.color,
                    "style": "esriSFS" + shapeStyle,
                    "type": "esriSFS",
                    "outline": {
                        "color": params.outlineColor,
                        "width": params.outlineWidth,
                        "type": "esriSLS",
                        "style": "esriSLS" + outlineStyle
                    }
                };
                var geometryObj = {
                    "hasZ": false,
                    "hasM": false,
                    "rings": rings,
                    "spatialReference": {
                        "wkid": _this.map.spatialReference.wkid
                    }
                };
                var attributes = params.attributes;
                var graphicObject = {
                    geometry: geometryObj,
                    attributes: attributes,
                    symbol: symbolObj
                };
                return _this.addGraphics(params.layerId, [graphicObject], params.center, params.flash)[0];
            };
            _this.addCircleGraphic = function(x ,y ,radius ,options){
                var defaults = {
                    "layerId": "",
                    "flash":false,
                    "color": [255, 0, 0, 105],
                    "outlineWidth": 2,
                    "outlineColor": [255, 0, 0, 255]
                };
                var params = lang.mixin(defaults,options);
                var x0 = parseFloat(x) ;
                var y0 = parseFloat(y) ;
                var r0 = parseFloat(radius) ;
                var sp = new SpatialReference(_this.map.spatialReference.toJson());
                var center = new Point(x0,y0,sp);
                var circle = new Circle(center,{
                    radius:r0,
                    geodesic:false,
                    radiusUnits:units.METERS
                });

                return _this.addPolygonGraphic(circle.rings ,params);
            };
            _this.addTextGraphic = function( x ,y ,text,options){
                var defaults = {
                    layerId:"",
                    layerIndex:null,
                    fontSize:10 ,
                    fontFamily:"Arial",
                    haloColor:[0,255,0,255],
                    haloSize:2,
                    color :[78,78,78,255],
                    backgroundColor:[222,222,222,255],
                    angle:0,
                    "xOffset": 0,
                    "yOffset": 0,
                    "flash": true,
                    "center": false
                };
                var params = lang.mixin({} ,defaults ,options);
                var symbolObj = {
                    "type": "esriTS",
                    "color": params.color,
                    "backgroundColor": params.backgroundColor,
                    "borderLineSize": 2,
                    "borderLineColor": [255,0,255,255],
                    "haloSize":  params.haloSize,
                    "haloColor": params.haloColor,
                    "verticalAlignment": "bottom",
                    "horizontalAlignment": "left",
                    "rightToLeft": false,
                    "angle": params.angle,
                    "xoffset": params.xOffset,
                    "yoffset": params.yOffset,
                    "kerning": true,
                    "font": {
                        "family":  params.fontFamily,
                        "size":  params.fontSize,
                        "style": "normal",
                        "weight": "bold",
                        "decoration": "none"
                    },
                    "font-decoration": "none",
                    "text":text
                };
                var geometryObj = {
                    "x": parseFloat(x),
                    "y": parseFloat(y),
                    "spatialReference": {
                        "wkid": _this.map.spatialReference.wkid
                    }
                };
                var graphicObject = {
                    geometry: geometryObj,
                    attributes: null,
                    symbol: new TextSymbol(symbolObj).toJson()
                };
                var ops = {
                    index:params.layerIndex
                };
                return _this.addGraphics(params.layerId, [graphicObject], params.center, params.flash ,ops)[0];

            };
            _this.flashGraphic = function (target, layerId, options) {
                var defaults = {
                    "repeatCount": 5,
                    "delay": 500,//ms
                    "fieldName": "OBJECTID",
                    "center": true,//是否剧中
                    "flash": true,//是否闪烁
                    "scale": 10000,
                    "defaultHighlightColor": null,
                    "defaultHighlightFillColor": null,
                    "autoClearHighlight": configManager.context.autoClearHighlight === false ? false : true ,// 新增
                    "shineWithHighlight": configManager.context.shineWithHighlight === true ? true : false ,// 新增
                    "relativeLayerId":null,
                    "relativeLayerIndex":null,
                    "expand": 1.5,
                    "effect": configManager.context.defaultFlashEffect,//flash/shine
                    "shineCurve": function (v) {
                        return 0.001 * v * v * v * v;
                    }
                };
                var params = lang.mixin({}, defaults, options);
                var fieldName = params.fieldName ;
                var deferred = new Deferred() ;
                // if( effect === "shine" ){ //默认false
                //     params.shineWithHighlight = configManager.context.shineWithHighlight === true? true : false ;
                // }
                var targetGraphics = [];
                layerId = layerId && layerId.toUpperCase();
                var layer = null;
                if( layerId ){
                    layer = _this.getLayerById(layerId);
                    if(!layer){
                        eventManager.publishError(_this.Strings.layerNotLoaded);
                        return;
                    }
                }else{
                    layer = _this.map.graphics;
                    layerId = _this.map.graphics.id;
                }
                if(params .autoClearHighlight === false){
                    if(params.relativeLayerId !== null  ){
                        //设置相对图层叠加顺序
                        var relativeLayerId =  params .relativeLayerId .toUpperCase();
                        var relativeIndex = params.relativeLayerIndex ;
                        if(!isNaN(relativeIndex)){
                            var targetIndex = _this.map.graphicsLayerIds.length - 1;
                            for(var i = 0 ; _this.map.graphicsLayerIds.length ; i++){
                                if(relativeLayerId === _this.map.graphicsLayerIds[i] ){
                                    targetIndex  = i;
                                    break ;
                                }
                            }
                            _this.map.reorderLayer(layerManager.highlightlayer,targetIndex + relativeIndex);
                        }
                    }else{
                        //设置最高图层叠加顺序
                        var topIndex = _this.map.graphicsLayerIds.length - 1 ;
                        _this.map.reorderLayer(layerManager.highlightlayer,topIndex);
                    }
                }
                if ( layer && layer.visible === false ) {
                    _this.layerVisibleSwitch(layerId ,true);
                }
                var storeHighlightGraphicIds = function( highlightGraphics ,layer){
                    layer.hightlightGraphicIdsObject = {};
                    for(var i=0;i<highlightGraphics.length; i++){
                        var attr = highlightGraphics[i].attributes;
                        if(attr){
                            var id= attr["OBJECTID"];
                            layer.hightlightGraphicIdsObject[id] =1;
                        }
                    }
                    mapManager.currentHighlightLayers[layer.id] = 1;
                };
                var setGraphicSymbol = function ( targets, highlight ) {
                    for (var i = 0; i < targets.length; i++) {
                        var gr = targets[i];
                        if (gr._beforeSymbol === undefined)
                            gr._beforeSymbol = gr.symbol ? gr.symbol:null;
                        if (gr._highlightSymbol === undefined ) {
                            gr._highlightSymbol = styleManager.getDefaultHighlightSymbol(gr,layer,params);
                        }
                        gr.setSymbol(highlight ? gr._highlightSymbol : gr._beforeSymbol);
                    }
                    return targets;
                };
                var doShine = function( graphics, options ,onEnd ) {
                    if(mapManager._effectTimer){
                        clearInterval( mapManager._effectTimer);
                        mapManager._effectTimer = null;
                        mapManager.removeSvgFilters();
                    }
                    if(!graphics){
                        return
                    }
                    var currentLayer = this;
                    var autoClearHighlight = options ? options.autoClearHighlight : true   ;
                    var current = 3;
                    var count = 5;
                    var blurI = 0;
                    var blurFilterId = "map_line_blur";
                    var radialFilterId = "map_point_blur";
                    var gsId = "map_blur_gs";
                    var gs = document.getElementById(gsId);
                    var stopEffectFilter = function (t) {
                        blurI = 0;
                        if (!t) {

                        } else if (Array.isArray(t)) {
                            for (var i = 0; i < t.length; i++) {
                                if (t[i].getShape() && t[i].getShape().rawNode) {
                                    t[i].getShape().rawNode.removeAttribute("filter");
                                }
                            }
                        } else {
                            if (t.getShape() && t.getShape().rawNode) {
                                t.getShape().rawNode.removeAttribute("filter");
                            }
                        }
                    };
                    var beginEffectFilter = function (t) {
                        var gsArray = [gs];
                        if (Array.isArray(t)) {
                            for ( var j = 0; j < t.length; j++ ) {
                                var suf = "";
                                if ( t[j].getShape() ) {
                                    var blurId = blurFilterId + suf;
                                    t[j].getShape().rawNode.setAttribute("filter", "url(#" + blurId + ")");
                                }
                            }
                        } else {
                            if ( t.getShape() ) {
                                t.getShape().rawNode.setAttribute("filter", "url(#" + blurFilterId + ")");
                            }
                        }
                        if(params.shineWithHighlight){// 设置高亮
                            var highlightGraphics = setGraphicSymbol(t ,true);
                            storeHighlightGraphicIds(highlightGraphics,currentLayer);
                        }
                        mapManager._effectTimer = setInterval(function () {
                            if (blurI < count) {
                                flash(gsArray, 1, 11, 1);
                            } else {
                                stopEffectFilter(t);
                                if(!autoClearHighlight){
                                    //维持高亮 ，手动清除高亮
                                    var gras = setGraphicSymbol(t ,true);
                                    storeHighlightGraphicIds( gras,currentLayer );
                                }else{
                                    setGraphicSymbol(t, false);//
                                }
                                onEnd && onEnd();
                            }
                        }, 80);
                    };
                    var flash = function ( domArray, step, max, min) {
                        var value = 0;
                        if (current < max) {
                            current = current + step;
                        } else {
                            current = min;
                            blurI++;
                        }
                        value = options.shineCurve(current);
                        domArray.forEach(function(dom ,idx){
                            dom.setAttribute("stdDeviation", value);//滤镜参数
                        });
                    };
                    stopEffectFilter();
                    beginEffectFilter(graphics);
                };
                var doFlash = function( graphics ,options, onEnd ) {
                    var currentLayer = this ;
                    if( mapManager._effectTimer ){
                        clearInterval( mapManager._effectTimer ) ;
                        mapManager._effectTimer = null;
                    }
                    if(!graphics){
                        return
                    }

                    var inFlash = true;
                    var autoClearHighlight = options ? options.autoClearHighlight:true;
                    var count = options && options.repeatCount ? options.repeatCount :5;
                    var delay = options && options.delay ? options.delay : 500;

                    setGraphicSymbol(graphics, false);
                    mapManager._effectTimer = setInterval(function () {
                        if (count > 0) {
                            if (inFlash) {
                                count--;
                                setGraphicSymbol(graphics, true);
                            } else {
                                setGraphicSymbol(graphics, false);
                            }
                            inFlash = !inFlash;
                        } else {
                            clearInterval( mapManager._effectTimer);
                            if(!autoClearHighlight){
                                var highlightGraphics = setGraphicSymbol(graphics ,true);
                                storeHighlightGraphicIds( highlightGraphics,currentLayer );
                            }else{
                                setGraphicSymbol(graphics, false);
                            }
                            if(onEnd && typeof onEnd === "function"){
                                onEnd();
                            }
                        }
                    }, delay );
                };
                var doCenter = function() {
                    var extent = graphicsUtils.graphicsExtent(targetGraphics);
                    if (extent.xmax === extent.xmin && extent.ymax === extent.ymin && params.scale) {
                        _this.map.setScale(params.scale);
                        return _this.centerAt(extent.xmax, extent.ymax);
                    } else {
                        if(extent.spatialReference.wkid !== _this.map.spatialReference.wkid){
                            eventManager.publishWarn(_this.Strings.sridNotEqualsWithBasemap);
                            extent.spatialReference.wkid = _this.map.spatialReference.wkid;
                        }
                        return _this.map.setExtent(extent.expand(params.expand));
                    }
                };
                var stopEffect = function() {
                    doFlash();
                    doShine();
                    var currentTarget = mapManager.flashTarget;
                    if( currentTarget && params.autoClearHighlight){
                        setGraphicSymbol( currentTarget ,false);
                    }
                    currentTarget = null;
                };
                var applyEffect = function ( onEnd  ,flashLayer) {
                    if(params.flash !== true){
                        return
                    }
                    var currentLayer = flashLayer ? flashLayer :layer;
                    if(mapManager.svgSupportedFlag===false){
                        params.effect = "flash";
                    }
                    if(params.effect === "shine") {
                        doShine.call(currentLayer, targetGraphics, params ,onEnd);//光影效果
                    }else{
                        doFlash.call(currentLayer, targetGraphics ,params ,onEnd); //闪烁效果
                    }
                    mapManager.flashTarget = targetGraphics;
                };
                var findGraphicTargets = function( onResult ){
                    if(layer._queryTargetGraphic){
                        layer._flashFilterFunc = null;
                        target = dojo.isArray(target) ? [].concat(target) : [target];
                        layer._queryTargetGraphic(target, function ( featureSet ) {
                            var features = featureSet.features;
                            if (features && features.length > 0) {
                                onResult(features) ;
                            } else {
                                eventManager.publishInfo( _this.Strings.featureNotFound + fieldName + "=" + target );
                            }
                        },fieldName );
                    }else{

                        if ( Array.isArray(target)) {
                            for (var i = 0; i < target.length; i++) {
                                var item = target[i];
                                if (typeof item === "object" && item.geometry) {
                                    targetGraphics.push(item);
                                } else if ( typeof item !== "object" && params.fieldName !== "") {
                                    var obj = {};
                                    obj[ params.fieldName ] = item;
                                    var findArr = commonUtil.findGraphicsByAttributes(layer.graphics, obj);
                                    targetGraphics = targetGraphics.concat(findArr);
                                }
                            }
                        } else {
                            if (typeof target === "object" && target.geometry) {
                                targetGraphics.push(target);
                            } else if ( typeof target !== "object" && params.fieldName !== "" ) {
                                var obj = {};
                                obj[params.fieldName] = target;
                                var findArr = commonUtil.findGraphicsByAttributes(layer.graphics, obj);
                                targetGraphics = targetGraphics.concat(findArr);
                            }
                        }
                        onResult();
                    }
                };
                var rendererHighlightGraphics = function(features){
                    if(params.autoClearHighlight === true){//自动清除高亮
                        if( features ){
                            //1、设置图层渲染过滤函数,刷新图层定位要素
                            layer._flashFilterFunc = function () {
                                var graphics = layer._findGraphicByObjectIds(target,fieldName);
                                if( graphics.length === 0){
                                    return ;
                                }
                                var onEnd = function(){
                                    layer._flashFilterFunc = null;
                                };
                                targetGraphics = graphics ;
                                applyEffect( onEnd );
                            };
                            var ext = graphicsUtils.graphicsExtent(features);
                            layer._setFitExtent( ext, params.scale ,params.expand).then(function(e){
                                deferred.resolve("success");
                            });
                        }else{
                            if (targetGraphics.length > 0 ) {
                                if ( params.center === true) {
                                    doCenter().then(function () {
                                        applyEffect();
                                        deferred.resolve("success");
                                    });
                                } else {
                                    applyEffect();
                                    deferred.resolve("success");

                                }
                            } else {
                                eventManager.publishInfo(_this.Strings["invalidFlashData"]);
                            }
                        }
                    }else{
                        //需要绘制并定位高亮图形
                        if( features ){
                            targetGraphics =  features ;
                            for(var i = 0 ; i < features.length ; i++){
                                var feature = targetGraphics[i];
                                var renderer = layer.renderer;
                                feature.setSymbol( renderer.getSymbol(feature) );
                            }
                        }else{
                            //targetGraphics = lang.clone(targetGraphics);
                            var newTargetGraphics = [] ;
                            for(var k = 0 ; k < targetGraphics.length ; k++){
                                var json = targetGraphics[k].toJson();
                                var g = new Graphic(json);
                                newTargetGraphics.push(g);
                            }
                            targetGraphics = [].concat(newTargetGraphics);
                        }
                        if(params.flash === true){
                            for(var j = 0 ; j < targetGraphics.length ;j++){
                                var gra = targetGraphics[j];
                                gra._highlight = true ;
                                gra._targetLayerId = layerId;
                                gra._targetGraphic = features ? features[j] : null;
                                layerManager.highlightlayer.add(gra);
                            }
                        }
                        if ( params.center === true ) {
                            doCenter().then(function () {
                                applyEffect( null ,layerManager.highlightlayer);
                                deferred.resolve("success");
                            });
                        } else {
                            applyEffect( null,layerManager.highlightlayer);
                            deferred.resolve("success");
                        }
                    }
                };
                stopEffect();
                findGraphicTargets(function(features){
                    rendererHighlightGraphics(features);
                });
                return deferred.promise;
            };
            _this.drawGraphic = function (drawType, options) {
                var defaults = {
                    "drawOnMap": true,
                    "layerId": "drawLayerId",
                    "symbolObject": null,
                    "symbol": null,
                    "attributes": null,
                    "onDrawEnd": null,
                    "onDrawStart": null
                };
                var params = lang.mixin({}, defaults, options);
                if(params.drawLayerId){
                    params.layerId = params.drawLayerId;
                }
                mapManager.onDrawStart = function(e,params){
                };
                mapManager.onDrawEnd = function (e) {
                    mapManager.deactivate(MapManager.DRAW);
                    _this.map.showZoomSlider();
                    _this.map.setMapCursor("default");
                    eventManager.fireEventHandler(params.onDrawEnd, e);
                    if (params.drawOnMap) {
                        var symbol = null ;
                        if(params.symbol ){
                            if(params.symbol instanceof Symbol){
                                symbol = params.symbol;
                            }else{
                                symbol = styleManager.getSymbolByObject(params.symbol);
                            }
                        }else if(params.symbolObject){
                            symbol = styleManager.getSymbolByObject(params.symbolObject);
                        }else {
                            symbol = styleManager.getDefaultSymbolByGeoType(e.geometry.type);
                        }
                        var graphicObjects = {
                            geometry:e.geometry.toJson(),
                            symbol:symbol.toJson(),
                            attributes:params.attributes
                        };

                        _this.addGraphics(params.layerId ,[graphicObjects]);
                    }
                };
                mapManager.activate(MapManager.DRAW, [drawType]);
                _this.map.hideZoomSlider();
                _this.map.setMapCursor("crosshair");
            };
            _this.drawCircle = function (options) {
                _this.drawGraphic(Draw.CIRCLE, options);
                var op = {
                    type: MapManager.DRAW,
                    target:"drawCircle"
                };
                eventManager.publishEvent(_this.Events.MapStateChangedEvent,op);
            };
            _this.drawLine = function (options) {
                _this.drawGraphic(Draw.LINE, options);
                var op = {
                    type: MapManager.DRAW,
                    target:"drawLine"
                };
                eventManager.publishEvent(_this.Events.MapStateChangedEvent,op);
            };
            _this.drawPolygon = function (options) {
                _this.drawGraphic(Draw.POLYGON, options);
                var op = {
                    type: MapManager.DRAW,
                    target:"drawPolygon"
                };
                eventManager.publishEvent(_this.Events.MapStateChangedEvent,op);
            };
            _this.drawPolyline = function (options) {
                _this.drawGraphic(Draw.POLYLINE, options);
                eventManager.publishEvent(_this.Events.MapStateChangedEvent,{
                    type: MapManager.DRAW,
                    target:"drawPolyline"
                });
            };
            _this.drawPictureGraphic = function(options) {
                var defaults = {
                    attributes:null,
                    url:"",
                    onDrawEnd:null
                };
                var params = lang.mixin(defaults ,options);

                _this.drawGraphic(Draw.POINT, params );
            };
            _this.drawTextGraphic = function(options) {
                var defaults = {
                    attributes:null,
                    symbolObject:null
                };
                var defs = lang.mixin(defaults ,options) ;
                _this.drawGraphic(Draw.POINT,defs);
            };
            _this.drawLineAndGetLength = function ( options) {
                var defaults = {
                    "labelOffsetX":10,
                    "labelOffsetY":-10,
                    "fontSize": "16px",//标注字体大小
                    "haloSize": 2,//
                    "symbol":null,
                    "haloColor": [255, 200, 0],//标注颜色
                    "drawOptions": null,//
                    "labelStyleFunc": function (length) {
                        var label = _this.Strings.measureLengthResultPrefixLabel ;
                        var unit = "";
                        if ( length < 1000 ){
                            unit = _this.Strings.measureLengthUnitMeter;
                            unit = unit ? unit : " m";
                            label = label + length.toFixed(1) + unit;
                        }else{
                            unit = _this.Strings.measureLengthUnitKilometer;
                            unit = unit ? unit : " km";
                            label = label + (length / 1000).toFixed(3) + unit;
                        }
                        return label;
                    },
                    "lengthFormat": function (length) {
                        var unit = "";
                        var value = "";
                        if ( length < 1000 ){
                            unit = _this.Strings.measureLengthUnitMeter;
                            unit = unit ? unit : " m";
                            value = length.toFixed(1);
                        }else{
                            unit = _this.Strings.measureLengthUnitKilometer;
                            unit = unit ? unit : " km";
                            value = ( length / 1000 ).toFixed(3);
                        }
                        return {
                            value: value ,
                            unit: unit
                        };
                    },
                    "serialLengthMeasureEnable":configManager.context.serialLengthMeasureEnable === true ? true : false ,
                    "callback":null
                };
                var params = lang.mixin({}, defaults, options);
                var measureStart = function(){
                    var segementIndex = 0 ;
                    mapManager.totalMeasureLength = 0 ;
                    mapManager.lengthMeasurePoints = [];
                    mapManager.lengthMeasureResults = [];
                    var segementMeasure = function(line ,screenPoint,point){
                        var p = new LengthsParameters();
                        p.polylines = [line];
                        p.lengthUnit = GeometryService.UNIT_METER;
                        p.geodesic = true;
                        var onResult = function(result){
                            var length = result.lengths[0];
                            onMeasureResult( length ,screenPoint,point) ;
                        };
                        var onError = function(e){
                            eventManager.publishError(_this.Strings["getDistanceError"], e);
                            onMeasureResult(0,screenPoint,point) ;
                        };
                        mapManager.geometryService.lengths(p, onResult, onError);
                    };
                    var onMeasureResult = function( re ,screenPoint,point){
                        mapManager.totalMeasureLength += re ;
                        var textLabel = params.labelStyleFunc( mapManager.totalMeasureLength );
                        var label = textLabel.replace(_this.Strings.measureLengthResultPrefixLabel ,"");
                        mapManager.addMeasureLabel(label, screenPoint.x ,screenPoint.y,0,point.x ,point.y);
                    };
                    var onMeasureMouseMove = function(e){
                        var index = mapManager.lengthMeasurePoints.length;
                        var left = e.x ;
                        var top = e.y ;
                        mapManager.measureTipLabel.style.left = left + mapManager.measureLabelOffsetX + "px";
                        mapManager.measureTipLabel.style.top = top  + mapManager.measureLabelOffsetY + "px";
                        if(index === 0){
                            mapManager.measureTipLabel .innerHTML = "单击鼠标确定起点";
                            return true;
                        }
                        var total = mapManager.totalMeasureLength;
                        var lastPoint = mapManager.lengthMeasurePoints[index - 1].mapPoint;
                        var point = e.mapPoint ;
                        total += geometryUtil.distance(point.x ,point.y,lastPoint.x,lastPoint.y);
                        total = Math.round(total) ;
                        var label = "";
                        if(total >= 1000){
                            label = "<label class='jasmap_label_stress'>" + (total/1000).toFixed(1) + "</label>公里";
                        }else{
                            label = "<label class='jasmap_label_stress'>" + Math.floor(total) + "</label>米";
                        }
                        mapManager.measureTipLabel .innerHTML = "总长度："+ label +"<br>单击确定地点，双击结束";

                    };
                    var onMeasureMapClick = function(e){
                        var point = e.mapPoint ;
                        var screenPoint = e.screenPoint;
                        var index = mapManager.lengthMeasurePoints.length;
                        if( index > 0){
                            var lastPoint = mapManager.lengthMeasurePoints[index - 1].mapPoint;
                            if(lastPoint.x === point.x && lastPoint.y === point.y){
                                return //ie浏览器双击事件会触发两次单击事件
                            }
                        }
                        //加入点击事件对象，包含测量点坐标mapPoint、屏幕坐标screenPoint
                        mapManager.lengthMeasurePoints.push(e);
                        if( index === 0 ) {
                            //设置起点标注
                            mapManager.addMeasureLabel("起点",screenPoint.x  , screenPoint.y,0 ,point.x,point.y );
                            return ;
                        }
                        //创建线段，测量线段长度
                        segementIndex = index - 1 ;
                        var startPoint = mapManager.lengthMeasurePoints[segementIndex].mapPoint;
                        var endPoint = mapManager.lengthMeasurePoints[index].mapPoint;
                        var segement = new Polyline(_this.map.spatialReference);
                        segement.addPath([startPoint,endPoint]);
                        segementMeasure(segement ,screenPoint,point) ;
                    };
                    var onMeasurePanning = function(e){
                        var anchor = e.delta;
                        mapManager.refreshMeasureLabelScreenXY(e.delta.x ,e.delta.y);
                    };
                    var onMeasurePanEnd = function(e){
                        mapManager.refreshMeasureLabelScreenXY(e.delta.x ,e.delta.y ,true);
                    };
                    var onMeasureZooming = function(e){
                        var zoomFactor = e.zoomFactor;
                        var anchor = e.anchor;
                        mapManager.refreshMeasureLabelScreenXYByFactor(anchor,zoomFactor);
                    };
                    var onMeasureZoomEnd = function(e){
                        var zoomFactor = e.zoomFactor;
                        var anchor = e.anchor;
                        var ext = e.extent;
                        //console.info("zoom end =>  x:" + anchor.x + " , y:" + anchor.y + " ,zoom:" + zoomFactor + ",ext:" + JSON.stringify(e.extent));
                        mapManager.refreshMeasureLabelScreenXYByFactor( anchor,zoomFactor,true ,ext);
                    };
                    var options = {
                        measureLabelOffsetX:params.labelOffsetX,
                        measureLabelOffsetY:params.labelOffsetY,
                        onMeasurePanning: onMeasurePanning,
                        onMeasurePanEnd: onMeasurePanEnd,
                        onMeasureZooming: onMeasureZooming,
                        onMeasureZoomEnd: onMeasureZoomEnd,
                        onMeasureClick: onMeasureMapClick,
                        onMeasureMouseMoving: onMeasureMouseMove
                    };
                    return mapManager.beforeMeasureStart("drawLineAndGetLength",options);
                };
                var onDrawEnd = function(e){
                    var length = mapManager.totalMeasureLength ;
                    var lengthObj = params.lengthFormat(length);
                    var lengthValue = lengthObj.value;
                    var lengthUnit = lengthObj.unit;
                    var label = "总长度：<label class='jasmap_label_stress'>" + lengthValue + "</label>"+ lengthUnit;
                    mapManager.addTotalMeasureLabel(label);
                    mapManager.deactivateMeasureState();
                    if(params.serialLengthMeasureEnable){
                        _this.drawLineAndGetLength(options);
                    }else{
                        _this.startPanMode();
                    }
                };
                var measureId = measureStart();
                _this.drawGraphic(Draw.POLYLINE, {
                    layerId:null,
                    attributes:{
                        "MEASUREID":measureId
                    },
                    "symbol":params.symbol,
                    onDrawEnd: onDrawEnd
                });
                eventManager.publishEvent(_this.Events.MapStateChangedEvent,{
                    type: MapManager.DRAW,
                    target:"drawLineAndGetLength"
                });
            };
            _this.drawPolygonAndGetArea = function (options) {
                var defaults = {
                    "fontSize": "16px",
                    "haloSize": 2,
                    "haloColor": [255, 200, 0],
                    "labelStyleFunc": function (area) {
                        var label = _this.Strings.measureAreaResultPrefixLabel;
                        var unit = "";
                        if (area >= 0.01) { // km2
                            unit  = _this.Strings.measureAreaUnitSquareKilometer ;
                            unit = unit ? unit : " km²";
                            label = label + area.toFixed(3) +  unit ;
                        } else {
                            unit = _this.Strings.measureAreaUnitSquareMeter ;
                            unit = unit ? unit : " m²";
                            label = label + (area * 1000 * 1000).toFixed(1) + unit;
                        }
                        return label ;
                    },
                    "serialAreaMeasureEnable":configManager.context.serialAreaMeasureEnable === true ? true : false ,
                    "callback":null
                };
                var params = lang.mixin(defaults,options);
                var onDrawEnd = function(e){
                    mapManager.deactivateMeasureState();
                    var geo = e.geometry;
                    if (geo) {
                        var p = new AreasAndLengthsParameters();
                        p.lengthUnit = GeometryService.UNIT_KILOMETER;
                        p.areaUnit = GeometryService.UNIT_SQUARE_KILOMETERS;
                        p.polygons = [geo];
                        p.calculationType  = "geodesic";
                        mapManager.geometryService.areasAndLengths(p, function (result) {
                            var area = parseFloat(result.areas[0]);
                            var textLabel = params.labelStyleFunc(area);
                            if (params.callback && typeof params.callback === "function") {
                                params.callback(area);
                            }
                            var point = geo.getExtent().getCenter();
                            var font = new Font( params.fontSize, Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER );
                            var symbol = new TextSymbol(textLabel, font);
                            symbol.setHaloColor(new Color(params.haloColor));
                            symbol.setHaloSize(params.haloSize);
                            var graphic = new Graphic(point, symbol);
                            _this.map.graphics.add(graphic);
                            //
                            if(params.serialAreaMeasureEnable){
                                _this.drawPolygonAndGetArea(options);
                            }else{
                                _this.startPanMode();
                            }
                        }, function (e) {
                            eventManager.publishError(_this.Strings["getAreaError"], e)
                        });
                    }
                };
                var measureStart = function(){
                    var options = {
                        onMeasurePanning: null,
                        onMeasurePanEnd: null,
                        onMeasureZooming: null,
                        onMeasureZoomEnd: null,
                        onMeasureClick: null,
                        onMeasureMouseMoving: null
                    };
                    return mapManager.beforeMeasureStart("drawPolygonAndGetArea",options);
                };
                var measureId = measureStart();
                _this.drawGraphic(Draw.POLYGON,{
                    layerId:null,
                    attributes:{
                        "MEASUREID":measureId
                    },
                    "onDrawEnd": onDrawEnd
                });
                eventManager.publishEvent(_this.Events.MapStateChangedEvent,{
                    type: MapManager.DRAW,
                    target:"drawPolygonAndGetArea"
                });
            };
            _this.editGraphic = function(){

            };
            _this.startDrawAndEditMode = function (tool, options) {
                mapManager.drawToolActivate(tool ,options);
            };
            _this.clearAllGraphics = function () {
                _this.clearMapGraphics();
                var graphicLayers = _this.map.graphicsLayerIds;
                for (var i = 0; i < graphicLayers.length; i++) {
                    var layerId = graphicLayers[i].toUpperCase();
                    if (layerId.indexOf("DRAWLAYER") == 0) {
                        _this.clearGraphicsLayer(layerId);
                    }
                }
                eventManager.publishEvent(_this.Events.MapGraphicsClearEvent);
            };
            _this.print = function (onSuccess, onFailed) {
                mapManager.printMap(function (result) {
                    var a = document.createElement("a");
                    a.target = "_blank";
                    a.href = result.url;
                    a.click();
                }, onFailed);
            };
            _this.switchBaseMap = function (layerId) {
                if (layerManager.basemapsLayersConfig && layerManager.basemapsLayersConfig.length > 0) {
                    var visible = false;
                    array.forEach(layerManager.basemapsLayersConfig, function (v, i) {
                        visible = (v.id === layerId);
                        if (v.layerSet) {
                            array.forEach(v.layerSet, function (l, j) {
                                _this.layerVisibleSwitch(l.id, visible);
                            });
                        } else {
                            _this.layerVisibleSwitch(v.id, visible);
                        }
                    }, this);

                }
            };
            _this.updateLayer = function( layerId , options){
                var defaults = {
                    show:true ,
                    where:""
                };
                var params = lang.mixin({},defaults ,options) ;
                var layer = _this.getLayerById(layerId);
                if(!layer ) return ;
                if( params.where ){
                    layer.setDefinitionExpression(params.where);
                }
                _this.layerVisibleSwitch(layerId ,params.show);
                layer.refresh();
            };
            _this.updateDynamicLayer = function(layerId ,options){
                var defaults = {
                    layerDefs:null ,
                    visibleLayers:null
                };
                var params = lang.mixin(defaults ,options);
                var dynamicLayer = _this.map.getLayer(layerId);
                if(dynamicLayer instanceof  ArcGISDynamicMapServiceLayer){
                    if(params.layerDefs){
                        dynamicLayer.setLayerDefinitions(params.layerDefs);
                    }
                    if(params.visibleLayers){
                        dynamicLayer.setVisibleLayers(params.visibleLayers);
                    }
                }else{
                    debugger ;
                    eventManager.publishError(_this.String.layerTypeError);
                }

            };
            /**
             * @param route 轨迹坐标点数组
             * 每个轨迹点结构：
             * {
             *      coordinate:[x,y],
             *      datetime:long,
             *      attributes:{
             *          name:""
             *      }
             * }
             * 如果坐标数据没有时间维度，则根据speed或
             * @param options
             */
            _this.animateRoute = function( route ,options ){
                var RoutePlayer = function(r , op){
                    var defaults = {
                        times:1,//播放倍速
                        frames:30,//帧频
                        speed:null,//前进速度 km/h
                        during:null,//播放时间 s秒
                        startTime:new Date().getTime(),
                        headSymbolType:"arrow",//"picture"
                        headRotateEnabled:true,//
                        routeArrowEnabled:true,//
                        layerId:"routeReplayLayer",
                        arrowSpace: 100 ,//箭头间隔，单位米
                        arrowSizeRate: 0.8 ,//
                        center:false ,
                        onMoving:function(gra){

                        },
                        onPlayEnd:function(){

                        },
                        onClick:function(gra){

                        },
                        defaultRouteSymbol:{
                            "type": "esriSLS",
                            "style": "esriSLSSolid",
                            "color": [0,0,255,255],
                            "width": 2
                        } ,
                        defaultPictureSymbol:{
                            angle:0,
                            url: "images/location.png",
                            width: 20,
                            height: 20,
                            xoffset:0,
                            yoffset:0,
                            type: "esriPMS"
                        } ,
                        defaultArrowSymbol:{
                            type: "esriSMS",
                            style: "esriSMSPath",
                            angle:0,
                            size: 20,
                            xoffset:0,
                            yoffset:0,
                            "color": [0,0,255,0],
                            path:"M 0 10 L 10 0 L 20 10",
                            "outline" : {
                                "color" : [0,255,0,255],
                                "width" :2
                            }
                        }
                    };
                    var _class = this ;
                    var route = r ;

                    var params = $.extend(defaults ,op);
                    var currentPathIndex = 0 ;
                    var sumArrowSpaceLength = 0 ;
                    var playTimer = null ;
                    var frameTime = 1000 / params.frames;
                    var CONST_PI = 180 / Math.PI;

                    var start = null,end = null ;
                    var headerGraphic = null ;
                    var routeGraphic = null ;
                    var routeLayer = null ;

                    var routeArrowSymbolObj = lang.clone(params.defaultArrowSymbol);
                    routeArrowSymbolObj.size = parseInt((params.defaultArrowSymbol.size * params.arrowSizeRate).toFixed(0));

                    var locatePointByTime = function(){
                        var deltTime = end.datetime - start.datetime ;
                        var point = {};
                        var during = frameTime * params.times ;
                        if(deltTime > during){
                            var x1 = start.coordinate[0];
                            var y1 = start.coordinate[1];
                            var x2 = end.coordinate[0];
                            var y2 = end.coordinate[1];
                            var k = during / deltTime ;
                            point.coordinate = locatePoint(x1 ,y1 ,x2 ,y2 ,k);
                            point.datetime = start.datetime + during;
                        }else{
                            point = lang.clone(end);
                            currentPathIndex++ ;
                            if(currentPathIndex === route.length - 1){
                                destroyPlay();
                            }else{
                                end = route[currentPathIndex + 1];
                            }
                        }
                        return point ;
                    };
                    var locatePoint = function(x1,y1 ,x2,y2 ,k){
                        var x = k * ( x2 - x1 ) + x1 ;
                        var y = k * ( y2 - y1 ) + y1 ;
                        return [x ,y];
                    };
                    var prepareRouteCoordinates = function(){
                        var timeFlg = true ;
                        if(route.length < 2){
                            eventManager.publishError(_this.String.requireMoreCoordinates);
                            return ;
                        }
                        for(var i = 0 ; i < route.length; i++){
                            if(!route[0].datetime){
                                timeFlg = false ;
                                break ;
                            }
                        }
                        if(timeFlg){
                            return
                        }
                        var totalLength = 0 ;
                        var last = route[0] ;
                        var segments = [];
                        for(var i = 1 ; i < route.length ; i++){
                            var current = route[i];
                            var startX = last.coordinate[0];
                            var startY = last.coordinate[1];
                            var endX = current.coordinate[0];
                            var endY = current.coordinate[1];
                            var length = geometryUtil.distance(startX ,startY, endX ,endY);
                            var segment = {
                                start: [ startX,startY],
                                end:[endX,endY],
                                length:length
                            };
                            totalLength += length ;
                            last = current ;
                            segments.push(segment);
                        }
                        if(params.speed){
                            var totalTime = totalLength/ params.speed * 3600 ;// s
                            var startTime = params.startTime ;
                            var endTime = startTime + totalTime ;
                            interCoordinateTime(startTime ,endTime ,totalLength,segments);
                        }else if(params.during){
                            var startTime = params.startTime ;
                            var endTime = startTime + params.during * 1000 ;
                            interCoordinateTime(startTime ,endTime ,totalLength,segments);
                        }else{
                            eventManager.publishError(_this.Strings.routeParamOrDataError);
                            return ;
                        }
                    };
                    var interCoordinateTime = function(startTime ,endTime ,totalLength ,segments){
                        route[0].datetime = startTime;
                        var totalDeltaTime = endTime - startTime ;
                        for(var i = 0 ; i < segments .length ; i++){
                            var len = segments[i] .length ;
                            var deltaTime = parseInt((len / totalLength * totalDeltaTime).toFixed(0));
                            route[i + 1].datetime = route[i].datetime + deltaTime;
                        }
                    };
                    var createSimpleGraphic = function(coor ,symbolObj ){
                        var sp = _this.map.spatialReference;
                        var symbol = _this.getSymbolByObject(symbolObj);
                        var geometry = new Point( coor,sp);
                        var graphic = new Graphic(geometry,symbol ) ;
                        return graphic;
                    };
                    var prepareLayerAndGraphic = function(){
                        start = route[0] ;
                        end = route[1] ;
                        currentPathIndex = 0 ;
                        sumArrowSpaceLength = 0 ;
                        var sp = _this.map.spatialReference;
                        routeLayer = _this.getLayerById(params.layerId);
                        if(!routeLayer){
                            routeLayer = _this.createGraphicLayer(params.layerId);
                        };
                        routeLayer.on("click",params.onClick);
                        var routeSymbol = _this.getSymbolByObject(params.defaultRouteSymbol);
                        if(params.headSymbolType === "arrow"){
                            headerGraphic = createSimpleGraphic( start.coordinate,params.defaultArrowSymbol ) ;
                        }else{//params.headSymbolType === "picture"
                            headerGraphic = createSimpleGraphic( start.coordinate,params.defaultPictureSymbol ) ;
                        }
                        var routeGeometry = new Polyline(sp);
                        routeGeometry.addPath([headerGraphic.geometry ,headerGraphic.geometry]);
                        routeGraphic = new Graphic(routeGeometry,routeSymbol ) ;
                        routeLayer.add(headerGraphic);
                        routeLayer.add(routeGraphic);
                        headerGraphic.hide();
                        routeGraphic.hide();
                    };
                    var calculateRotateAngle = function(lastX, lastY, nextX ,nextY){
                        var vec = [ nextX - lastX ,nextY - lastY] ;
                        var vecLen = Math.sqrt(Math.pow(vec[0] ,2) + Math.pow(vec[1],2));
                        var angle = Math.acos(vec[1] / vecLen) * CONST_PI ;
                        if(vec[0] < 0 ){
                            angle = 360 - angle ;
                        }
                        angle = parseInt(angle.toFixed(0));
                        return angle ;
                    };
                    var prepareEventListener = function(){
                        _this.subscribe( _this.Events .MapGraphicsClearEvent ,function(){
                            _class.stop();
                            routeLayer && routeLayer.clear();
                        });
                    };
                    var prepareRoutePlayer = function(){
                        headerGraphic.show();
                        routeGraphic.show();
                        _this.flashGraphic(headerGraphic,params.layerId ,{
                            flash:false
                        }).then(function(){
                            playTimer = setInterval(function(){
                                start = locatePointByTime();
                                params.onMoving(lang.clone(start));
                                updateHeader(start);
                                updateRoute(start);
                            },frameTime);
                        });
                    };
                    var updateRouteArrow = function(lastX,lastY ,nextX ,nextY ,angle){
                        if(angle === null ){
                            angle = calculateRotateAngle(lastX,lastY,nextX ,nextY);
                        }
                        var segmentLength = geometryUtil.distance(lastX,lastY ,nextX ,nextY);
                        sumArrowSpaceLength += segmentLength;
                        if(sumArrowSpaceLength > params.arrowSpace ){
                            var deltLenth  = sumArrowSpaceLength - params.arrowSpace;
                            var k = deltLenth / segmentLength;
                            var locate = locatePoint(lastX,lastY ,nextX ,nextY ,k);
                            var gra = createSimpleGraphic(locate,routeArrowSymbolObj);
                            gra.symbol.setAngle(angle);
                            routeLayer.add(gra) ;
                            sumArrowSpaceLength = 0 ;
                        }
                    };
                    var updateHeader = function(locate){
                        var nextX = locate.coordinate[0];
                        var nextY = locate.coordinate[1];
                        var lastLocation = headerGraphic.geometry.toJson();
                        var lastX = lastLocation.x ;
                        var lastY = lastLocation.y ;

                        var angle = null ;
                        if(params.headRotateEnabled === true){
                            angle = calculateRotateAngle(lastX,lastY,nextX ,nextY);
                            headerGraphic.symbol.setAngle(angle);
                        }
                        headerGraphic.geometry.update(nextX ,nextY);
                        headerGraphic.draw();
                        if(params.routeArrowEnabled === true){
                            updateRouteArrow(lastX,lastY ,nextX ,nextY ,angle);
                        }
                        if(params.center===true){
                            _this.centerAt(nextX ,nextY);
                        }
                    };
                    var updateRoute = function(locate){
                        var sp = _this.map.spatialReference;
                        var point = new Point(locate.coordinate ,sp);
                        var route = routeGraphic.geometry;
                        route.insertPoint(0,0,point);
                        routeGraphic.setGeometry(route);
                    };
                    var destroyPlay = function(){
                        clearInterval(playTimer);
                        params.onPlayEnd();
                    };

                    _class.init = function(){
                        prepareRouteCoordinates();//检查坐标
                        prepareEventListener();//监听地图清除事件
                        prepareLayerAndGraphic() ;//图层和图形
                        //prepareRoutePlayer();//定义计时器
                        return _class ;
                    };
                    _class.play = function(){
                        prepareRoutePlayer();//定义计时器并播放
                        return _class;
                    };
                    _class.pause = function(){
                        destroyPlay();
                    };
                    _class.stop = function(){
                        destroyPlay();
                        prepareLayerAndGraphic();
                    };
                    _class.speedUp = function(){
                        return ++params.times;
                    };
                    _class.speedDown = function(){
                        if(params.times > 1){
                            --params.times;
                        }
                        return params.times;
                    };
                    _class.forward = function(){

                    };
                    _class.backward = function(){

                    };
                    _class.clear = function(){
                        routeLayer && routeLayer.clear();
                    };
                    _class.setTimes = function(times){
                        params.times = times;
                    };
                };
                var routePlayer = new RoutePlayer(route,options);
                return routePlayer.init().play();
            };

            _this.coorsToXY = function (lng, lat) {
                var arrs;
                var wkid = _this.map.spatialReference.wkid;
                switch (wkid) {//先判断web墨卡托投影
                    case 102100:
                        ;
                    case 3857:
                        arrs = webMercatorUtils.lngLatToXY(lng, lat);
                        break;
                    default:
                        arrs = [lng, lat];
                }
                return arrs;
            };
            _this.reloadOptionalLayerConfig = function (title) {
                var config = null;
                for (var i = 0; i < layerManager.optionallayers.length; i++) {
                    var con = optionallayers[i];
                    if (con.label === title) {
                        config = con;
                        break;
                    }
                }
                config && createOptionalLayers(config);
            };
            _this.subscribe = function (eventString, listenerFunc) {
                if (_this.Events[eventString]) {
                    topic.subscribe(_this.Events[eventString], listenerFunc);
                    return
                }
                eventManager.publishError(_this.Strings["eventNotRegister"] + " ,type= " + eventString);
            };
            _this.publish = function () {
                topic.publish.apply(this, arguments);
            };
            _this.registerEventType = function(type,name){
                if(_this.Events[type]){
                    eventManager.publishError(_this.Strings.eventNameRepeatError);
                    return
                }
                _this.Events[type] = name;
            };
            _this.getEventManager = function () {
                return eventManager;
            };
            _this.layerSetVisibleSwitch = function ( layerSetId, visible) {
                var targetLayerSets = [];
                array.forEach(layerManager.optionallayers, function (v, i) {
                    layerManager.processOptionallayerOptions(v, function (conf, parent) {
                        if (conf.layerSet && conf.id === layerSetId) {
                            targetLayerSets.push(conf);
                            return;
                        }
                    });
                });
                var targetLayerIds = [];
                switch (targetLayerSets.length) {
                    case 0 :
                        eventManager.publishInfo(_this.Strings.layerSetNotFound);
                        return;
                    case 1 :
                        array.forEach(targetLayerSets, function (v, i) {
                            layerManager.processOptionallayerOptions(v, function (conf, parent) {
                                if (!conf.layerSet) {
                                    targetLayerIds.push(conf.id);
                                }
                            });
                        });
                        break;
                    default:
                        eventManager.publishInfo(_this.Strings.repeatIdError);
                        return;
                }
                array.forEach(targetLayerIds, function (id, i) {
                    var currentVisible = _this.getLayerVisible(id);
                    if (currentVisible !== visible) {
                        _this.layerVisibleSwitch(id, visible);
                    }
                });
            };
            _this.getModuleById = function ( moduleId) {
                var module = null;
                if (moduleManager && moduleId) {
                    module = moduleManager.getModuleById(moduleId);
                    if (!module) {
                        eventManager.publishInfo(_this.Strings.moduleNotFound + " id=" + moduleId);
                    }
                }
                return module;
            };
            _this.queryFeatures = function ( queryParams , callback ) {
                var defaultsQueryParam = {
                    featureId : "" ,
                    layerId : "" , //
                    url : "" , // 如果没有指定layerId需要传入该图层服务的查询地址
                    where : "",
                    geometry : "",
                    spatialRel : "esriSpatialRelIntersects",//esriSpatialRelIntersects | esriSpatialRelContains | esriSpatialRelCrosses | esriSpatialRelEnvelopeIntersects | esriSpatialRelIndexIntersects | esriSpatialRelOverlaps | esriSpatialRelTouches | esriSpatialRelWithin
                    outFields:["*"]
                };
                var deferredArray = [];
                for(var i = 0 ; i < queryParams .length ; i ++){
                    var q = lang.mixin( {},defaultsQueryParam ,queryParams[i] ) ;
                    var layerId = q.layerId;
                    var query = new Query();
                    var geometry = q.geometry ;
                    if(geometry && typeof geometry === "string"){
                        //如果为EsriJson格式转成对象
                        geometry = jsonUtils.fromJson(geometry);
                    }
                    query.geometry = geometry ;
                    query.spatialRel = q.spatialRel;

                    if( layerId ){
                        var layer = _this.getLayerById(layerId);
                        query.where = q.where ? q.where : "1=1";
                        query.objectIds = typeof q.featureId !== "string" ?  [ q.featureId ] : q.featureId.split(",");
                        deferredArray.push(layer.queryFeatures(query));
                    }else{
                        var url = q.url ;
                        var task = new QueryTask(url) ;
                        query.where = q.where ? q.where : "1=1";
                        query.objectIds = typeof q.featureId !== "string" ? [ q.featureId ] : q.featureId.split(",");
                        query.returnGeometry = true;
                        query.outFields = q.outFields;
                        deferredArray.push(task.execute(query));
                    }
                }
                all(deferredArray).then(function(results){
                    var result = {};
                    if(typeof callback === "function"){
                        for(var i = 0 ; i < results.length ; i ++){
                            result[i] = results[i].features ;
                        }
                        callback(result);
                    }
                });
            };
            _this.bufferGraphic = function(graphic ,distance, options){
                _this.queryBufferGraphic(graphic.geometry.toJson() ,distance, options);
            };
            _this.queryBufferGraphic = function( geomJson ,distance, options){
                var defaults = {
                    "unitType":"m" ,//或"km"
                    "draw":true,
                    "layerId":"",
                    "layerIndex":null,
                    "attributes":null,
                    "width": 1,
                    "color": [255, 255, 0, 150],
                    "style": "solid",
                    "outlineColor": [ 0, 0, 0, 255],
                    "outlineWidth": 1,
                    "outlineStyle": "solid",
                    "callback":null
                };
                var params = lang.mixin(defaults , options);
                var unitType = params.unitType === "m" ? 9001 : 9036; // m : km
                var layer = null;
                if(params.draw  ) {
                    var layerId = params.layerId;
                    layer = _this.getLayerById(layerId);
                    if (layerId && !layer) {
                        var layerOps = {
                            "id": layerId,
                            "type": "graphic",
                            "index": params.layerIndex
                        };
                        layer = _this.addLayer(layerOps);
                    } else if (!layerId)
                        layer = _this.map.graphics;
                }
                /*
                var geometry  = jsonUtils.fromJson(geomObj);
                var result = geometryEngine.buffer([geometry], [distance], unitType, true);
                */
                var geometry = jsonUtils.fromJson(geomJson);
                var bufferResult = function(bufferedGeometries){
                    if(params.draw && layer  ){
                        var shapeStyle = styleManager.getPolygonSymbolType(params.style);
                        var outlineStyle = styleManager.getPolygonSymbolType(params.outlineStyle);
                        var symbolObj = {
                            "width": params.width,
                            "color": params.color,
                            "style": "esriSFS" + shapeStyle,
                            "type": "esriSFS",
                            "outline": {
                                "color": params.outlineColor,
                                "width": params.outlineWidth,
                                "type": "esriSLS",
                                "style": "esriSLS" + outlineStyle
                            }
                        };
                        array.forEach(bufferedGeometries, function(geom) {
                            //var graphic = new Graphic(geometry, symbolObj);
                            var symbol = new SimpleFillSymbol(symbolObj);
                            var graphic = new Graphic(geom,symbol);
                            layer.add(graphic);
                        });
                    }
                    if(params.callback && typeof params.callback === "function"){
                        params.callback(bufferedGeometries);
                    }
                };
                var geometryService = mapManager.geometryService ;
                var bufferParams = new BufferParameters();
                bufferParams.distances = [distance];
                bufferParams.outSpatialReference = _this.map.spatialReference;
                bufferParams.unit = unitType ;
                bufferParams.geometries = [geometry];
                bufferParams.geodesic = true;
                geometryService.buffer(bufferParams ,bufferResult);

            };
            _this.dialog = function ( options ) {
                if(!$ ){
                    eventManager.publishError(_this.Strings.hasNoJqueryEasyUILib);
                }
                var defaults = {
                    title : "信息窗口" ,
                    width :  550 ,
                    height : 500 ,
                    left: null,
                    top: null,
                    modal :true ,
                    draggable :true ,
                    inline: false ,
                    resizable :true ,
                    collapsible :true ,//可折叠的
                    constrain :true,
                    href : "",
                    iframe : false,
                    $dom :null,
                    container :"body", //inline :true 条件下可配置"map"|"body"|"#divid"
                    onClose: function () {//弹出层关闭事件
                        $(this).dialog('destroy');
                    },
                    onLoad: function () {//弹出层加载事件

                    }
                };
                var container = options.container ;
                var $dom = options.$dom;
                $dom && delete options.$dom;
                var params = commonUtil.extend(defaults , options);

                if($dom){
                    return $dom.dialog(params);
                }
                if(mapManager.$mapDialog){
                    mapManager.$mapDialog.remove();
                    mapManager.$mapDialog = null ;
                }

                var inline = options.inline;
                var $dialog = null;
                if(container instanceof Element){
                    $(container).append('<div id="map-dialog"/>');
                    $dialog = $("#map-dialog",container);
                }else if(inline && container === "map"){
                    $(_this.map.container).append('<div id="map-dialog"/>');
                    $dialog = $("#map-dialog",_this.map.container);
                }else{
                    $(container).append('<div id="map-dialog"/>');
                    $dialog = $("#map-dialog",container);
                }
                delete params.container;
                delete params.$dom;

                if(params .iframe === true){
                    var ifr = "<iframe style='height:100%;width:100%;overflow: hidden;' src='" + params.href + "' frameborder='0'   />";
                    params.content = ifr;
                    delete params.href ;
                }
                delete params .iframe;
                mapManager.$mapDialog = $dialog;
                return  $dialog.dialog(params);
            };
            _this.moduleDialog = function ( $dom, parent ,options ) {
                options.resizable = true;
                options.modal = false;
                options.collapsible = true;
                options.constrain = true;
                options.inline = true;
                if(options.right){
                    options.left = parent.offsetWidth - options.width - options.right;
                }
                if(options.bottom){
                    options.top = parent.offsetHeight - options.height  - options.bottom;
                }
                options.container = parent;
                options.$dom = $dom;
                return _this.dialog(options );
            };
            _this.showInfoWindow = function ( x, y, title, content, options ) {
                var defaults = {
                    width:200,
                    height:150
                };
                var params = lang.mixin(defaults,options);
                var point = new Point(x,y, _this.map.spatialReference);
                var infoWindow = mapManager.infoWindow;
                infoWindow.resize(params.width ,params.height) ;
                infoWindow.setMap(_this.map);
                infoWindow.setTitle(title);
                infoWindow.setContent(content);
                infoWindow.show(point);
            };
            _this.ajax = function(options){
                return commonUtil.simpleAjaxLoader(options);
            };
            /**
             * @param pointOutLine
             * @param line
             * @param callbackfunc
            _this.getLineNearPoint = function (pointOutLine,line,callbackfunc){
                var param = new DistanceParameters();
                param.distancePara = 9001;
                param.geodesic = false;//欧式距离   如果为true的话是球面距离
                param.geometry1 =  jsonUtils.fromJson(pointOutLine);
                param.geometry2 =  jsonUtils.fromJson(line);

                var onError = function(e){
                    eventManager.publishError(_this.Strings.queryNearestPointError,e);
                    callbackfunc(null);
                };
                //获取最小距离后的回调
                var afterGetDistance = function(distance){
                    //根据最小距离获取线外点
                    _this.queryBufferGraphic(pointOutLine,distance,{draw:false,callback:afterGetBuffer});
                };
                var afterGetBuffer = function(geometryArry){
                    mapManager.geometryService.intersect(geometryArry,para.geometry2,afterintersect,onError);
                };
                var afterintersect = function(geometryArry){
                    if(geometryArry.length > 0){
                        //对结果进行评估，如果结果是线，则取一个点
                        if(geometryArry[0].type == "polyline"){
                            callbackfunc( geometryArry[0].getPoint(0,0));
                        }else{
                            callbackfunc( geometryArry[0]);
                        }
                    }else{//防止误差导致相交分析没有结果
                        _this.queryBufferGraphic(pointOutLine,distance+0.001,{draw:false,callback:afterGetBuffer});
                    }
                };
                //获取点到线的最小距离
                mapManager.geometryService.distance(param,afterGetDistance,onError)
            };
             */
            function EventManager() {
                var _class = this;
                _class.log = function (msg) {
                    console.log(msg);
                };
                _class.publishInfo = function (msg) {
                    if (msg) {
                        console.log(msg);
                    }
                    _this.publish(_this.Events.ErrorEvent, {message: msg, type: "info"});
                };
                _class.publishError = function (msg, e) {
                    if (msg) {
                        console.error(msg);
                    }
                    if (e) {
                        console.error(e);
                    }
                    if (apiDefaults.onError && typeof apiDefaults === "function") {
                        apiDefaults.onError({message: msg, type: "error"});
                    }
                    _this.publish(_this.Events.ErrorEvent, {message: msg, type: "error"});
                };
                _class.publishWarn = function (msg, e) {
                    if (msg) {
                        console.warn(msg);
                    }
                    if (e) {
                        console.warn(e);
                    }
                    if (apiDefaults.onError && typeof apiDefaults === "function") {
                        apiDefaults.onError({message: msg, type: "warn"});
                    }
                    _this.publish(_this.Events.ErrorEvent, {message: msg, type: "warn"});
                };
                _class.publishEvent = function () {
                    var args = arguments;
                    setTimeout(function(){
                        _this.publish.apply(_this, args);
                    },10);
                };
                _class.destroyEventHandler = function (handler) {
                    if (Array.isArray(handler)) {
                        array.forEach(handler, function (v, i) {
                            if (v) {
                                v.remove();
                                v = null;
                            }
                        });
                    }
                    else if (handler) {
                        handler.remove();
                        handler = null;
                    }
                    return null;
                };
                _class.time = function(msg){
                    console.time(msg);
                };
                _class.timeEnd = function(msg){
                    console.timeEnd(msg);
                };
                _class.startup = function(){

                };
                _class.fireEventHandler = function (onFunc, target) {
                    if (onFunc && typeof onFunc === "function") {
                        onFunc(target);
                    }
                };
            }
            function LayerManager() {
                var _class = this;
                _class.basemapsLayersConfig = [];
                _class.optionallayersConfig = [];
                _class.baseGeodataLayersConfig = [];
                _class.basemaps = null;
                _class.optionallayers = null;
                _class.highlightlayer = null ;
                _class.groupedLayers = {} ;

                var layerListenersConfig = {
                    //格式说明
                    //layerId_1:{
                    //  layer:layer1,
                    //  listener:{}
                    // },
                    //layerId_2:{
                    //  layer:layer2,
                    //  listener:{}
                    // }
                } ;
                var addLayerLoadErrorListener = function (layer) {
                    // layer.on("error", function (e) {
                    //     var errorMessage = _this.Strings["layerLoadError"] + " layerId=" + layer.id + ",url=" + layer.url;
                    //     eventManager.publishWarn(errorMessage, e);
                    // });
                };
                var onConfigLoaded = function(jsonConfig){
                    try {
                        var mapConf = jsonConfig.map;
                        _class.basemaps = mapConf.basemaps;// 地图基础底图
                        _class.optionallayers = mapConf.optionallayers; //业务图层!
                    } catch (e) {
                        eventManager.publishError(_this.Strings.parseConfigError, e)
                    }
                };
                var onMapLoaded = function(){

                };
                var onModuleLoaded = function(){
                    var basemaps = _class.basemaps;
                    var optionallayers = _class.optionallayers;
                    if (basemaps && basemaps.baseMapLayers && basemaps.baseMapLayers.length > 0) {
                        createBaseMapLayers(basemaps.baseMapLayers);
                        eventManager.publishEvent(_this.Events.BaseMapLayersLoadedEvent, basemaps.baseMapLayers);
                    }
                    if (optionallayers && optionallayers.length > 0) {
                        createOptionalLayers(optionallayers);
                        eventManager.publishEvent(_this.Events.OptionalLayersLoadedEvent, optionallayers);
                    }
                    if(configManager.context.autoClearHighlight === false){
                        layerManager.highlightlayer = _this.createGraphicLayer(apiDefaults.highlightGraphicLayerId);
                        //事件关联
                        layerManager.highlightlayer.on("click",function(e){
                            fireTargetLayerEvent(e ,"click");
                        });
                        layerManager.highlightlayer.on("dbl-click",function(e){
                            fireTargetLayerEvent(e,"dbl-click");
                        });
                        layerManager.highlightlayer.on("mouse-out",function(e){
                            fireTargetLayerEvent(e,"mouse-out");
                        });
                        layerManager.highlightlayer.on("mouse-over",function(e){
                            fireTargetLayerEvent(e,"mouse-over");
                        });
                    }
                    eventManager.timeEnd(_this.Strings["mapLoading"]);
                };
                var onMapGraphicsClearEvent = function(){

                };
                var onOptionalLayerCreatedEvent = function(e){
                    for(var key in layerListenersConfig){
                        var conf = layerListenersConfig[key];
                        _class.parseLayerListenerConfig(conf.layer ,conf.listener);
                    }
                };
                var fireTargetLayerEvent = function(e ,eType){
                    if(e.graphic._highlight){
                        var hg = e.graphic._targetGraphic ? e.graphic._targetGraphic:e.graphic;
                        var layerId = e.graphic._targetLayerId;
                        var layer = _this.getLayerById(layerId);
                        layer && layer.emit( eType ,{ graphic:hg });
                    }
                };

                var parseBasemapLayerOptions = function (layerConfig) {
                    return {
                        id: layerConfig.id,
                        url: layerConfig.url,
                        index: layerConfig.index ? layerConfig.index : 0,
                        label: layerConfig.label,
                        type: layerConfig.type,
                        spatialReference: layerConfig.spatialReference,
                        visible: (layerConfig.visible === undefined || layerConfig.visible !== false) ? true : false,
                        attributes: {
                            baseLayer: true
                        },
                        options: layerConfig.options
                    }
                };

                var findOptionalLayerConfigs = function (conf, layerId) {
                    var result = null;
                    if (conf.id === layerId) {
                        result = conf;
                    }
                    else if (conf.layerSet) {
                        for (var i = 0; i < conf.layerSet.length; i++) {
                            var c = conf.layerSet[i];
                            result = findOptionalLayerConfigs(c, layerId);
                            if (result)
                                break;
                        }
                    }
                    return result;
                };
                var createBaseMapLayers = function (configs) {
                    var visibleLayers = [];
                    var unVisibleLayers = [];
                    var layerLength = configs.length;
                    if (layerLength === 0) return;
                    for (var i = 0; i < layerLength; i++) {
                        var option = configs[i];
                        var layerOption = null;
                        if (option.layerSet) {
                            var layerSetVisible = option.visible === true ? true :false;
                            for (var j = 0; j < option.layerSet.length; j++) {
                                var op = option.layerSet[j];
                                layerOption = parseBasemapLayerOptions(op);
                                if (layerSetVisible===false) {
                                    unVisibleLayers.push(layerOption);
                                } else {
                                    visibleLayers.push(layerOption);
                                }
                            }
                            _class.basemapsLayersConfig.push(option);
                        } else {
                            layerOption = parseBasemapLayerOptions(option);
                            if (layerOption.visible !== true) {
                                unVisibleLayers.push(layerOption);
                            } else {
                                visibleLayers.push(layerOption);
                            }
                            _class.basemapsLayersConfig.push(layerOption);
                        }
                    }
                    var showLayerCount = _class.basemapsLayersConfig[0].layerSet ? _class.basemapsLayersConfig[0].layerSet.length : 1;
                    var vLength = visibleLayers.length;
                    if (vLength === 0) {
                        unVisibleLayers[0].visible = true;
                    }
                    if (vLength > showLayerCount) {
                        for (i = showLayerCount; i < vLength; i++) {
                            visibleLayers[i].visible = false;
                        }
                    }
                    var layers = [].concat(visibleLayers, unVisibleLayers);
                    array.forEach(layers, function (baseMap, i) {
                        var layer = _class.createLayer(baseMap);
                        _this.map.addLayer(layer );
                    });
                };
                var createOptionalLayers = function (configs) {
                    array.forEach(configs, function (v, i) {
                        _class.processOptionallayerOptions(v, function (conf, parent) {
                            if (!conf.layerSet) {
                                if (parent && parent.visible === false) {
                                    conf.visible = false;
                                }
                                if (parent && parent.type === "GeoBaseData") {
                                    _class.baseGeodataLayersConfig.push(conf);
                                }
                                _class.optionallayersConfig.push(conf);
                                return ;
                            }
                            if(conf.leaf === true ){
                                for(var idx = 0 ; idx < conf.layerSet .length ; idx++){
                                    var layerId = conf.layerSet[idx].id
                                    _class.groupedLayers[layerId] = conf.id ;
                                }
                            }
                            if (parent) {
                                if (parent.type !== undefined)
                                    conf.type = parent.type;
                                if (parent.visible === false)
                                    conf.visible = false;
                            }
                            parent = conf;
                        });
                    });
                    var layers = [].concat(_class.optionallayersConfig, _class.baseGeodataLayersConfig);
                    array.forEach(layers, function (v, i) {
                        if (v.index == undefined) {
                            v.index = 30;
                        }
                    });
                    layers.sort(function (a, b) {
                        return a.index - b.index
                    });
                    array.forEach(layers, function (conf) {
                        _class.createOptionalLayer(conf);
                    });
                    eventManager.publishEvent(_this.Events.OptionalLayersChangedEvent, layers, configs);//
                };

                _class. processOptionallayerOptions = function (conf, mapFunction, parent) {// 遍历
                    if (mapFunction && typeof mapFunction === "function") {
                        mapFunction(conf, parent);
                    }
                    if (conf.layerSet && conf.layerSet.length > 0) {
                        var layerSet = conf.layerSet;
                        for (var i = 0; i < layerSet.length; i++) {
                            var c = layerSet[i];
                            _class.processOptionallayerOptions(c, mapFunction, conf);
                        }
                    }
                };
                _class.createOptionalLayer = function (conf) {
                    var layerConfig = {
                        outFields: ["*"],
                        mode: apiDefaults.featureLayerMode,
                        showLabels: true,
                        listener:null,
                        renderer:null,
                        domain:null
                    };
                    layerConfig = lang.mixin({}, layerConfig, conf);
                    var l = _class.createLayer(layerConfig);
                    if (l) {
                        _this.map.addLayer(l);
                    }
                    if (l && layerConfig.domain && _this.domainMap) {
                        l._domain = layerConfig.domain;
                    }
                    if(l && layerConfig.listener){
                        var id = l.id ;
                        layerListenersConfig[id] = {
                            layer:l ,
                            listener:layerConfig.listener
                        };
                    }
                };
                _class.createLayer = function (conf) {
                    var layerConfig = _class.parseLayerConfig(conf);
                    var layer = null;
                    var type = layerConfig.type;
                    var url = layerConfig.url;
                    var options = layerConfig.options;
                    var uri = layerConfig.uri;
                    try {
                        if (uri) {
                            require([uri], function (LayerClass) {
                                layer = new LayerClass(url, options, _this);
                                addLayerLoadErrorListener(layer);
                            });
                            return
                        }
                        if ((!url || "" === url ) && (type === 'tile' || type === 'feature' || type === 'flash' || type === 'dynamic'  )) {
                            eventManager.log(_this.Strings["layerUrlNotNull"] + layerConfig.id);
                            return;
                        }
                        switch (type) {
                            case 'tile':
                                layer = new ArcGISTiledMapServiceLayer(url, options);
                                break;
                            case 'feature':
                                options.flash = conf.flash === true ? true :false ;
                                layer = new FlashLayer(url, options, _this);
                                if (layerConfig.where) {
                                    layer.setDefinitionExpression(layerConfig.where);
                                }
                                break;
                            case 'flash':
                                options.flash = true ;
                                layer = new FlashLayer(url, options, _this);
                                if (layerConfig.where) {
                                    layer.setDefinitionExpression(layerConfig.where);
                                }
                                break;
                            case 'dynamic':
                                layer = new ArcGISDynamicMapServiceLayer(url, options);
                                if(options.options && options.options .visibleLayers ){
                                    layer.setVisibleLayers(options.options .visibleLayers);
                                }
                                break;
                            case 'graphic':
                                layer = new GraphicsLayer(options);
                                break;
                            case 'draw':
                                layer = new DrawLayer(options);
                                break;
                            case "tdt-vec"://全球矢量图
                            case "tdt-cva"://全球矢量图标注
                            case "tdt-ter"://全球地形图
                            case "tdt-cta"://全球地形图标注
                            case "tdt-img"://全球影像图
                            case "tdt-cia"://全球影像图标注
                                options.type = type;
                                options.key = (configManager.context  && configManager.context["tdt-key"]) ? configManager.context["tdt-key"]:"";
                                layer = new TiandituLayer(url, options);
                                break;
                            case "gaode-label":
                            case "gaode-road":
                            case "gaode-st":
                            case "gaode-img":
                                layer = new GaodeLayer(url, options);
                                break;
                            case "baidu-img":
                            case "baidu-vec":
                            case "baidu-ano":
                                layer = new BaiduLayer(url, options);
                                break;
                            case "vector-tile"://矢量切片
                                layer = new VectorTileLayer(url, options);
                                break;
                            case "esritiled":
                                layer = new EsriTiledLayer(url, options ,_this.map);
                                break;
                            default:
                                var string = _this.Strings["hasNoLayerTypeError"] + " type=" + type;
                                eventManager.log(string);
                        }
                        addLayerLoadErrorListener(layer);

                    } catch (e) {
                        eventManager.publishError(_this.Strings["createLayerError"] + " layerId=" + options.id, e);
                    }
                    if(layerConfig.options && layerConfig.options.label && layer){
                        layer._name = layerConfig.options.label ;
                    }
                    return layer;
                };
                _class.parseLayerConfig = function (options) {
                    var layerConfig = lang.clone(options);
                    if (layerConfig.id) {
                        layerConfig.id = layerConfig.id.toUpperCase();
                    }
                    var type = layerConfig.type;
                    var url = layerConfig.url ? layerConfig.url.trim() : null;
                    var uri = layerConfig.uri ? layerConfig.uri.trim() : null;
                    delete layerConfig.type;
                    delete layerConfig.url;
                    delete layerConfig.uri;

                    if ((!url || "" === url ) && (type === 'tile' || type === 'feature' || type === 'flash' || type === 'dynamic'  )) {
                        eventManager.log(_this.Strings["layerUrlNotNull"] + " layerId = " + layerConfig.id);
                        return;
                    }
                    var result = {
                        type: type,
                        url: url,
                        uri: uri,
                        options: layerConfig
                    };
                    if (layerConfig.where && (type === 'feature' || type === 'flash')) {
                        result.where = layerConfig.where
                    }
                    return result
                };
                _class.parseLayerListenerConfig = function(layer ,conf){
                    for(var key in conf){
                        if(key === "onHover"){
                            layer.on("mouse-over",function(e){
                                var id = layer.id ;
                                var reps = layerListenersConfig[id].listener;
                                var rep = reps["onHover"];
                                _class.parseListenerResponse(rep ,e);
                            });
                        }else if(key === "onClick"){
                            layer.on("click",function(e){
                                var id = e.graphic._layer.id ;
                                var reps = layerListenersConfig[id].listener;
                                var rep = reps["onClick"];
                                _class.parseListenerResponse(rep ,e);
                            });
                        }else if(key === "onDbClick"){
                            layer.on("dbl-click",function(e){
                                var id = e.graphic._layer.id ;
                                var reps = layerListenersConfig[id].listener;
                                var rep = reps["onDbClick"];
                                _class.parseListenerResponse(rep ,e);
                                Event.stop(e);
                            });
                        }else{
                            eventManager.publishWarn(_this.Strings.unsupportedEventType + "layerId=" + layer.id + ",eventType=" + key);
                        }
                    }
                };
                _class.parseListenerResponse = function(response,e){
                    var type = response.responseType.toLowerCase() ;
                    var graphic = e.graphic;
                    var attributes =  commonUtil.clone( graphic.attributes );
                    try {
                        if (type === "dialog") {
                            var ops = {
                                height: 450,
                                width: 550,
                                title: "弹出窗口",
                                iframe:false ,
                                href: null,
                                modal: true,
                                closed: false,
                                container: "map",
                                inline: true
                            };
                            if(response.url){
                                response.href = response.url;
                                delete response.url;
                            }
                            var defs = lang.mixin(ops, response);
                            if(defs.href){
                                var href = defs.href;
                                defs.href = commonUtil.parseTemplate(href,attributes);
                            }
                            _this.mapDialog.queryParams = attributes;
                            _this.dialog(defs);

                        } else if (type === "infowindow") {
                            var ops = {
                                height: 150,
                                width: 250,
                                title: null,
                                content: null
                            };
                            var defs = lang.mixin(ops, response);
                            var content = commonUtil.parseTemplate(defs.content, attributes);
                            var title = defs.title;
                            _this.showInfoWindow(e.mapPoint.x, e.mapPoint.y, title, content, {
                                width: defs.width,
                                height: defs.height
                            });
                        } else if (type === "function") {
                            var functionName = response.callback;
                            if (functionName) {
                                var func = eval(functionName);
                                func(attributes);
                            } else {
                                throw (_this.Strings.callbackConfigNeeded);
                            }
                        }else if("tip"){
                            var layer = graphic._layer ;
                            var hasAdded = layer._tip;
                            if(!hasAdded){
                                _this.addLayerTips(layer, response.template);
                                mapManager.showGraphicTip(true, graphic ,response.template);
                            }
                        }
                    }catch (e){
                        eventManager.publishError(_this.Strings.layerListenerConfigError,e);
                    }
                };
                _class.getOrCreateLayer = function(layerId,options){
                    var layer = null ;
                    if (layerId) {
                        layerId = layerId.toUpperCase();
                        layer = _this.getLayerById(layerId);
                        if (!layer) {
                            layer = _this.addGraphicsLayer(layerId ,options);
                        }
                    } else{
                        layer = _this.map.graphics;
                    }
                    return layer ;
                };
                _class.startup = function(){
                    eventManager.time(_this.Strings["mapLoading"]);
                    _this.subscribe( _this.Events .ConfigLoadedEvent ,onConfigLoaded);
                    _this.subscribe( _this.Events .MapLoadedEvent ,onMapLoaded);
                    _this.subscribe( _this.Events .ModulesLoadedEvent ,onModuleLoaded);
                    _this.subscribe( _this.Events .MapGraphicsClearEvent ,onMapGraphicsClearEvent);
                    _this.subscribe( _this.Events .OptionalLayersLoadedEvent ,onOptionalLayerCreatedEvent);
                };
            }
            function MapManager() {
                var _class = this;
                var mapConfig = null;
                var maxExtent = null;
                var navigator = null;
                var draw = null;
                var editor = null;
                var defaultFilterId = "map_line_blur";

                MapManager.NAVIGATOR = "navigator";
                MapManager.DRAW = "draw";
                MapManager.EDITOR = "editor";

                _class.$mapDialog = null ;
                _class.currentMapState = MapManager.NAVIGATOR;
                _class.geometryService = null;
                _class.printTask = null;
                _class.flashTarget = null;
                _class.currentHighlightLayers = {};
                _class.container = null;
                _class.tipsDom = null;
                _class.svgSupportedFlag = true ;

                _class.removeSvgFilters = function(){
                    if(_class.svgSupportedFlag ===false){
                        return ;
                    }
                    var mapDom = document.getElementById(domId);
                    var svg = mapDom.getElementsByTagName("svg")[0];
                    var defs = svg.getElementsByTagName("defs")[0];
                    var filters = defs.getElementsByTagName("filter");
                    for(var i = 1 ; i < filters.length ; i ++){
                        defs.removeChild(filters[i]);
                    }
                };
                _class.startup = function () {
                    _this.subscribe( _this.Events .ConfigLoadedEvent ,onConfigLoaded);
                    _this.subscribe( _this.Events .MapLoadedEvent ,onMapLoaded);
                    _this.subscribe( _this.Events .MapStateChangedEvent ,onMapStateChangedEvent);
                    _this.subscribe( _this.Events .MapGraphicsClearEvent ,onMapGraphicsClearEvent);
                };
                _class.activate = function ( code, params, exclusive) {
                    if (exclusive === undefined || exclusive === true) {
                        _class.deactivate();
                    }
                    var obj = _getStatusObject(code);
                    obj.activate.apply(obj, params);
                    return obj;
                };
                _class.deactivate = function ( code) {
                    if (code) {
                        var obj = _getStatusObject(code);
                        obj.deactivate();
                    } else {
                        navigator.deactivate();
                        draw.deactivate();
                        editor.deactivate();
                    }
                };
                _class.onDrawEnd = function ( e) {

                };
                _class.onDrawLayerDeleteClick = null;
                _class.refreshLayerTipDom = function(dom){
                    if(_class.tipsDom){
                        _this.map.container.removeChild(_class.tipsDom);
                        _class.tipsDom = null;
                    }
                    if(dom){
                        _this.map.container.appendChild(dom);
                        _class.tipsDom = dom;
                    }
                };
                _class.drawToolActivate = function(tool, options){
                    var drawType = tool.toLowerCase();
                    var defaults = {
                        drawLayerId:"",
                        onDrawEnd:null
                    };
                    var params = lang.mixin({},defaults,options);
                    var drawLayer = _this.getLayerById(params.layerId);
                    if( params.layerId && !drawLayer){
                        drawLayer = layerManager.createLayer({
                            id:params.layerId,
                            type:"draw",
                            index:100
                        });
                        _this.map.addLayer(drawLayer);
                    }else{
                        drawLayer = _this.map.graphics
                    }

                    //绘制完成
                    switch(drawType){
                        case 'delete':
                            activateDeleteTool(drawLayer);
                            break;
                        case 'text':
                            _this.drawTextGraphic(params);
                            break;
                        case 'picture':
                            _this.drawPictureGraphic(params);
                            break;
                        default:
                            remoteDeleteListener();
                            _this.drawGraphic(tool.toLowerCase(),params);
                    }
                };
                var remoteDeleteListener = function(){
                    if(_class.onDrawLayerDeleteClick){
                        _class.onDrawLayerDeleteClick = eventManager.destroyEventHandler(_class.onDrawLayerDeleteClick);
                    }
                };
                var activateDeleteTool = function(targetLayer){
                    _class.onDrawEnd = null;
                    if(_class.onDrawLayerDeleteClick  == null){
                        _class.onDrawLayerDeleteClick = targetLayer.on('click', function (e) {
                            targetLayer.remove(e.graphic);
                            Event.stop(e);
                        });
                    }
                };
                var _getStatusObject = function (code) {
                    switch (code) {
                        case MapManager.NAVIGATOR :
                            return navigator;
                        case MapManager.DRAW:
                            return draw;
                        case MapManager.EDITOR:
                            return editor;
                        default:
                            return navigator;
                    }
                };
                var createSvgBlurFilter = function (idx) {
                    var filterId = idx === 0 ? defaultFilterId : defaultFilterId + idx;
                    var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                    filter.setAttribute("id", filterId);
                    filter.setAttribute("x", "-5.0");
                    filter.setAttribute("y", "-5.0");
                    filter.setAttribute("width", "1000%");
                    filter.setAttribute("height", "1000%");
                    //
                    var feOffset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
                    feOffset.setAttribute("result", "offOut");
                    feOffset.setAttribute("in", "SourceGraphic");//SourceAlpha
                    feOffset.setAttribute("dx", "0");
                    feOffset.setAttribute("dy", "0");
                    filter.appendChild(feOffset);
                    //<feColorMatrix result="matrixOut" in="offOut" type="matrix"
                    //values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0" />
                    var colorMatrix = "0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 1 0";
                    if (configManager.context.feColorMatrixValue) {
                        colorMatrix = configManager.context.feColorMatrixValue;
                    }
                    var feColorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
                    feColorMatrix.setAttribute("result", "matrixOut");
                    feColorMatrix.setAttribute("in", "offOut");
                    feColorMatrix.setAttribute("type", "matrix");
                    feColorMatrix.setAttribute("values", colorMatrix);
                    filter.appendChild(feColorMatrix);

                    var feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
                    feGaussianBlur.setAttribute("id", "map_blur_gs");
                    feGaussianBlur.setAttribute("result", "blurOut");
                    feGaussianBlur.setAttribute("in", "matrixOut");
                    feGaussianBlur.setAttribute("stdDeviation", "10");
                    filter.appendChild(feGaussianBlur);

                    var feBlend = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
                    feBlend.setAttribute("id", "map_blend");
                    feBlend.setAttribute("in", "SourceGraphic");
                    feBlend.setAttribute("in2", "blurOut");
                    feBlend.setAttribute("mode", "normal");
                    filter.appendChild(feBlend);
                    return filter;
                };
                var _createSvgRadialFilter = function () {
                    var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                    filter.setAttribute("id", "map_point_blur");
                    var stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop1.setAttribute("offset", "0");
                    stop1.setAttribute("stop-color", "#0868BB");
                    var stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop2.setAttribute("offset", "0.25");
                    stop2.setAttribute("stop-color", "#0075D8");
                    filter.appendChild(stop2);
                    var stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop3.setAttribute("offset", "0.35");
                    stop3.setAttribute("stop-color", "#0868BB");
                    filter.appendChild(stop3);
                    var stop4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop4.setAttribute("offset", "0.50");
                    stop4.setAttribute("stop-color", "#0075D8");
                    filter.appendChild(stop4);
                    var stop5 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop5.setAttribute("offset", "0.60");
                    stop5.setAttribute("stop-color", "#0868BB");
                    filter.appendChild(stop5);
                    var stop6 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop6.setAttribute("offset", "0.85");
                    stop6.setAttribute("stop-color", "#0075D8");
                    filter.appendChild(stop6);
                    var stop7 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop7.setAttribute("offset", "1");
                    stop7.setAttribute("stop-color", "#0868BB");
                    filter.appendChild(stop7);
                    return filter;
                };
                var setInfoWindow = function(){
                    var infoWindow = new Popup({

                    },domConstruct.create("div", null, _this.map.container));
                    infoWindow.startup();
                    _class.infoWindow = infoWindow;
                };
                var setMaxExtent = function() {
                    if (maxExtent) {
                        _this.addExtentEventListener(function (e) {
                            var ext = e.extent;
                            var outFlag = false;
                            var xmin = ext.xmin, ymin = ext.ymin, xmax = ext.xmax, ymax = ext.ymax;
                            //完全相离或包含
                            if(ext.xmax < maxExtent.xmin ||  ext.ymax < maxExtent.ymin ||  ext.xmin > maxExtent.xmax ||  ext.ymin > maxExtent.ymax || (ext.xmin < maxExtent.xmin && ext.xmax > maxExtent.xmax && ext.ymax > maxExtent.ymax && ext.ymin < maxExtent.ymin)){
                                xmin = maxExtent.xmin;
                                xmax = maxExtent.xmax;
                                ymax = maxExtent.ymax;
                                ymin = maxExtent.ymin;
                                outFlag = true;
                            } else {
                                //相交
                                if (ext.xmin < maxExtent.xmin) {
                                    xmin = maxExtent.xmin;
                                    xmax = ext.xmax + maxExtent.xmin - ext.xmin;
                                    outFlag = true;
                                }
                                if (ext.xmax > maxExtent.xmax) {
                                    xmax = maxExtent.xmax;
                                    xmin = ext.xmin + maxExtent.xmax - ext.xmax;
                                    outFlag = true;
                                }
                                if (ext.ymax > maxExtent.ymax) {
                                    ymax = maxExtent.ymax;
                                    ymin = ext.ymin + maxExtent.ymax - ext.ymax;
                                    outFlag = true;
                                }
                                if (ext.ymin < maxExtent.ymin) {
                                    ymin = maxExtent.ymin;
                                    ymax = ext.ymax + maxExtent.ymin - ext.ymin;
                                    outFlag = true;
                                }
                            }
                            if (outFlag === true ) {
                                outFlag = false;
                                //eventManager.publishInfo(_this.Strings.mapRealExtent + " : "+ JSON.stringify(ext));
                                //eventManager.publishInfo(_this.Strings.mapMaxExtent + " : " + JSON.stringify(maxExtent));
                                _this.zoomExtent(xmin, ymin, xmax, ymax);
                            }
                        });
                    }
                };
                var onConfigLoaded = function(config){
                    _this.apiConfig = config ;

                    mapConfig = config.map ;
                    var mapOptions = mapConfig.mapOptions; // 地图初始化配置
                    var geometryService = config.services.geometryService;
                    var printService = config.services.printService;
                    _class.geometryService = new GeometryService( geometryService ? geometryService : apiDefaults.geometryService );
                    _class.printTask = new PrintTask( printService ? printService : apiDefaults.printService );
                    var options = {
                        "sliderStyle": "large",
                        "logo": false,
                        "showAttribution": false,
                        "showLabels": true
                    };
                    var params = lang.mixin({}, options, mapOptions);
                    if (params.extent) {
                        params.extent = new Extent(params.extent);
                    }
                    if(params.maxExtent){
                        maxExtent = params.maxExtent;
                    }
                    if(params.lods){
                        params.lods = params.lods ;
                    }
                    if (!_this.map) {
                        _this.map = new Map(domId, params);
                    }
                    var map = _this.map;
                    navigator = new Navigation(map);
                    draw = new Draw(map,{
                        showTooltips:true
                    });
                    editor = new Edit(map);

                    draw.on("draw-complete", function (e) {
                        _class.onDrawEnd(e);
                    });
                    _this.map.on("layer-add", function (e) {
                        var layer = e.layer;
                        if (layer._attrs && !layer._attrs.baseLayer) {
                            eventManager.publishEvent(_this.Events.OptionalLayerAddedEvent, e);
                        }
                    });
                    _this.map.on("load",function(e){

                        eventManager.publishEvent(_this.Events.MapLoadedEvent);
                    });
                    //
                    eventManager.publishEvent(_this.Events.MapCreateEvent);

                    //----------?不起作用? ------------
                    _this.map.infoWindow.on("selection-change", function (e) {
                        eventManager.publishEvent(_this.Events.InfoWindowShow, e);
                    });
                    _this.map.infoWindow.on("hide", function (e) {
                        eventManager.publishEvent(_this.Events.InfoWindowHide, e);
                    });
                    // ----------------------------------
                    parseDomainData();
                };
                var onMapLoaded = function(){
                    _class.container = _this.map.container ;
                    appendSvgFilters();
                    setMaxExtent();
                    setInfoWindow();
                    setMaskDiv();
                };
                var currentMapStateTarget = "";
                var onMapStateChangedEvent = function(e){
                    _class.currentMapState = e.type ;
                    var target = e.target ;
                    if(target ===currentMapStateTarget) return;
                    var flg1 = currentMapStateTarget === "drawLineAndGetLength" || currentMapStateTarget === "drawPolygonAndGetArea";
                    var flg2 = target === "drawLineAndGetLength" || target === "drawPolygonAndGetArea";
                    if( target && flg1 && !flg2 ){
                        _class.cancelMeasureState(target);
                    }
                    currentMapStateTarget = target ;

                };
                var onMapGraphicsClearEvent = function(e){
                    _class.refreshLayerTipDom();
                    _class.clearMeasureLabels();
                };
                var appendSvgFilters = function (size) {
                    var count = size ? size : 0;
                    var mapDom = document.getElementById(domId);
                    var svg = mapDom.getElementsByTagName("svg")[0];
                    if(!svg){ // ie8不支持svg
                        _class.svgSupportedFlag = false ;
                        eventManager.publishWarn(_this.Strings.svgDoesNotSupport);
                        return ;
                    }
                    var defs = svg.getElementsByTagName("defs")[0];
                    if(count === 0){
                        var blurFilter = createSvgBlurFilter(0);
                        defs.appendChild(blurFilter);
                    }else{
                        for(var i = 1 ; i <= count ;i++){
                            var blurFilter = createSvgBlurFilter(i);
                            defs.appendChild(blurFilter);
                        }
                    }
                };
                var parseDomainData = function () {
                    var context = _this.apiConfig.context ? _this.apiConfig.context : {};
                    var domainDataFunc = context.domainData;
                    if (domainDataFunc) {
                        try {
                            var domainDataListFunc = eval(domainDataFunc);
                            if (typeof domainDataListFunc !== "function") {
                                throw("domainData配置解析出错！");
                            }
                            var domainDataList = domainDataListFunc();
                            for (var i = 0; domainDataList && i < domainDataList.length; i++) {
                                var item = domainDataList[i];
                                item.DOMAINNAME = item.DOMAINNAME ? item.DOMAINNAME : "";
                                item.CODEID = item.CODEID ? item.CODEID : "";
                                item.CODENAME = item.CODENAME ? item.CODENAME : "";
                                var key = item.DOMAINNAME + item.CODEID;
                                if (!_this.domainMap[key]) {
                                    _this.domainMap[key] = item.CODENAME;
                                } else {
                                    eventManager.publishWarn("阈值键 " + key + "重复,已存在值：" + _this.domainMap[key] + ",新值为：" + item.CODENAME);
                                }
                            }
                        } catch (e) {
                            eventManager.publishWarn("domainData配置错误，不能获取阈值。");
                        }
                    }
                };
                var paningListener = null ;
                var panEndListener = null ;
                var zoomingListener = null ;
                var zoomEndListener = null ;
                var measureClickListener = null ;
                var mouseMovingListener = null ;
                // jasMap_container 下创建图层覆盖物div ，id='jasmap_mask' ，
                // 覆盖物分成三个子div ,分别存放为隐藏标注span 和显式标注span ,class='jasmap_label'
                // 以及图形标注 ,class='jasmap_icon'
                // 图形标注需要监听鼠标拖动事件和缩放事件，动态计算屏幕坐标位置 ，；
                // 显式标注根据图形标注位置动态调整屏幕相对坐标位置；
                // 隐式标注在鼠标拖动事件和缩放事件结束后根据图形标注调整屏幕相对坐标位置；
                var setMaskDiv = function(){
                    var esriMapContainer = document.getElementsByClassName("esriMapContainer")[1];
                    var jasmapMask = document.createElement("div");
                    var jasmapShowLabel = document.createElement("div");
                    var jasmapHideLabel = document.createElement("div");
                    var jasmapGraphicLabel = document.createElement("div");

                    jasmapMask.id = "jasmap_mask";
                    jasmapMask.className = "jasmap_mask_container";
                    jasmapShowLabel.className = "jasmap_mask_show_container";
                    jasmapHideLabel.className = "jasmap_mask_hide_container";
                    jasmapGraphicLabel.className = "jasmap_mask_graphic_container";

                    jasmapMask.appendChild(jasmapHideLabel);
                    jasmapMask.appendChild(jasmapGraphicLabel);
                    jasmapMask.appendChild(jasmapShowLabel);

                    //commonUtil.prependChild(esriMapContainer,jasmapMask);
                    esriMapContainer.appendChild(jasmapMask);
                    _class.showMaskContainer = jasmapShowLabel;
                    _class.hideMaskContainer = jasmapHideLabel;
                    _class.graphicMaskContainer = jasmapGraphicLabel;
                    //
                };
                var setTotalLabelOffset = function(type ,marginX ,marginY){
                    var size = _class.lengthMeasurePoints.length;
                    var point1 = _class.lengthMeasurePoints[size - 2].mapPoint;
                    var point2 = _class.lengthMeasurePoints[size - 1].mapPoint;
                    var deltyX = point2.x - point1.x ;
                    var deltyY = point2.y - point1.y ;

                    if( deltyX === 0 && deltyY === 0 ){
                        point1 = _class.lengthMeasurePoints[size - 3].mapPoint;
                        deltyX = point2.x - point1.x ;
                        deltyY = point2.y - point1.y ;
                    }
                    var offset = {
                        offsetX: 0,
                        offsetY: 0
                    };
                    if(type === "label"){
                        if( deltyY < 0 ){
                            offset.offsetY = Math.abs( _class.measureLabelOffsetY );
                        }else {
                            offset.offsetY = -2 - marginY - 2 * Math.abs( _class.measureLabelOffsetY );
                        }
                    }
                    if(type === "icon"){
                        if( deltyX < 0 ){
                            offset.offsetX = -marginX - Math.abs( _class.measureLabelOffsetX);
                        }else {
                            offset.offsetX = marginX + Math.abs( _class.measureLabelOffsetX);
                        }
                    }
                    return offset ;
                };
                var createMeasureElement = function(eleName){
                    var node = document.createElement(eleName);
                    node["data-measure-id"] = _class.currentMeasureId;
                    return node;
                };
                var lastMeasureOptions = null;
                //当前测量id
                _class.currentMeasureId = null;
                _class.currentMeasureTarget = null;
                _class.showMaskContainer = null ;
                _class.hideMaskContainer = null ;
                _class.graphicMaskContainer = null ;
                _class.measureTipLabel = null ;
                _class.lengthMeasurePoints = [];
                _class.lengthMeasureResults = [];
                _class.totalMeasureLength = 0;
                _class.measureLabelOffsetX  = 0 ;
                _class.measureLabelOffsetY  = 0 ;
                /**
                 * 生成量测的id，注册鼠标的 平移、缩放事件 ，
                 * @param obj
                 * @returns {*}
                 */
                _class.beforeMeasureStart = function(target,p){
                    var options = {
                        measureLabelOffsetX:0,
                        measureLabelOffsetY:0,
                        onMeasurePanning:null,
                        onMeasurePanEnd:null,
                        onMeasureZooming:null,
                        onMeasureZoomEnd:null,
                        onMeasureClick:null,
                        onMeasureMouseMoving:null
                    };
                    var params = p ? lang.mixin( options,p ) : lastMeasureOptions;
                    lastMeasureOptions = params ;
                    _class.cancelMeasureState();

                    _class.measureLabelOffsetX = params.measureLabelOffsetX;
                    _class.measureLabelOffsetY = params.measureLabelOffsetY;
                    _class.currentMeasureId = new Date().getTime();
                    _class.currentMeasureTarget = target;
                    if(!paningListener && params.onMeasurePanning && params.onMeasurePanEnd){
                        paningListener = _this.map.on("pan",params.onMeasurePanning);
                        panEndListener = _this.map.on("pan-end",params.onMeasurePanEnd);
                    }
                    if(!zoomingListener && params.onMeasureZooming && params.onMeasureZoomEnd){
                        zoomingListener = _this.map.on("zoom",params.onMeasureZooming);
                        zoomEndListener = _this.map.on("zoom-end",params.onMeasureZoomEnd);
                    }
                    if(!measureClickListener && params.onMeasureClick){
                        measureClickListener = _this.map.on("click",params.onMeasureClick);
                    }
                    if(!mouseMovingListener && params.onMeasureMouseMoving){
                        mouseMovingListener = _this.map.on("mouse-move",params.onMeasureMouseMoving);
                    }
                    if(_class.hideMaskContainer){
                        var label = createMeasureElement("span");
                        label.id = _class.currentMeasureId + "_tip";
                        label.className = "jasmap_label";
                        label.style.position = "absolute" ;
                        _class.measureTipLabel = label;
                        _class.hideMaskContainer.appendChild(label);
                    }
                    return _class.currentMeasureId;
                };
                //取消量测，删除当前量测图标和标注
                _class.cancelMeasureState = function(){
                    _class.clearCurrentMeasureLabels();
                    _class.deactivateMeasureState();
                };
                /**
                 * 结束绘制状态，保留已经创建的平移和缩放相关的监听
                 */
                _class.deactivateMeasureState = function(){
                    _class.totalMeasureLength = 0;
                    _class.lengthMeasurePoints = [];
                    _class.lengthMeasureResults = [];
                    measureClickListener = _this.removeEventListener(measureClickListener);
                    mouseMovingListener = _this.removeEventListener(mouseMovingListener);
                    if( _class.measureTipLabel){
                        _class.measureTipLabel.style.display = "none" ;
                    }
                    _class.currentMeasureId = null;
                };
                _class.clearCurrentMeasureLabels = function(e){
                    var id ,measureId;
                    if(e && e.target ){
                        id = e.target.id;
                        measureId = id.split("_delete_")[0];
                        Event.stop(e);
                    }else{
                        measureId = _class.currentMeasureId;
                    }
                    if(!measureId){
                        return ;
                    }
                    commonUtil.removeChildren(_class.showMaskContainer,measureId ,"data-measure-id");
                    commonUtil.removeChildren(_class.hideMaskContainer,measureId,"data-measure-id");
                    commonUtil.removeChildren(_class.graphicMaskContainer,measureId,"data-measure-id");
                    _this.removeGraphics({
                        attributes:{
                            "MEASUREID":measureId
                        }
                    });
                };
                _class.clearMeasureLabels = function(){
                    commonUtil.removeChildren(_class.showMaskContainer );
                    commonUtil.removeChildren(_class.hideMaskContainer );
                    commonUtil.removeChildren(_class.graphicMaskContainer );
                    // if(configManager.context.activeNavigatorAfterMapClear === true){
                    //     _this.startPanMode();
                    // }else{
                    //     if(_class.currentMeasureTarget === "drawLineAndGetLength"){
                    //         _this.drawLineAndGetLength();
                    //     }else if(_class.currentMeasureTarget === "drawPolygonAndGetArea"){
                    //         _this.drawPolygonAndGetArea();
                    //     }
                    // }
                };
                _class.addMeasureLabel = function(content ,screenX ,screenY, type ,lon ,lat){
                    var idx = _class.lengthMeasurePoints.length ;
                    // 普通距离标注和总计标注
                    var span = createMeasureElement("span");
                    span.className = "jasmap_label";
                    span.innerHTML = content ;
                    span.style.position = "absolute" ;
                    var top = isNaN(screenY)? screenY.replace("px","") :screenY;
                    var left = isNaN(screenX)? screenX.replace("px","") :screenX ;

                    top = parseInt(top);
                    left = parseInt(left);

                    span.attributes.lastY = top;
                    span.attributes.lastX = left;

                    if(!type ){
                        //
                        span.id = _class.currentMeasureId + "_label_" + idx;
                        top += _class.measureLabelOffsetY;
                        left += _class.measureLabelOffsetX;
                        span.attributes.offsetX = _class.measureLabelOffsetX ;//把偏移量记录下来
                        span.attributes.offsetY = _class.measureLabelOffsetY;
                        //地图图标
                        var label = createMeasureElement("label");
                        label.id = _class.currentMeasureId + "_point_" + idx;
                        label.className = "jasmap_icon jasmap_icon_point";
                        label.style.position = "absolute" ;
                        var top2 = isNaN(screenY) ? screenY.replace("px","") :screenY;
                        var left2 = isNaN(screenX) ? screenX.replace("px","") :screenX ;
                        label.style.top = top2 +"px" ;
                        label.style.left = left2 +"px" ;
                        label.attributes.lastY = top2;
                        label.attributes.lastX = left2;
                        label.attributes.lastZoomY = top2;
                        label.attributes.lastZoomX = left2;
                        label.attributes.originLon = lon ;
                        label.attributes.originLat = lat ;
                        _class.graphicMaskContainer.appendChild(label);
                    } else if( type === 1){
                        //取最后两个点计算方向向量，设置标签 偏移位置 ，删除按钮和总长度偏移量构成直角
                        var offset = setTotalLabelOffset("label", 10 , 10);
                        top += offset.offsetY ;
                        left += offset.offsetX ;
                        span.attributes.offsetX = offset.offsetX ;//把偏移量记录下来
                        span.attributes.offsetY = offset.offsetY;
                        span.id = _class.currentMeasureId + "_ttalo_" + idx;

                        //删除按钮图标
                        var label = createMeasureElement("label");
                        label.id = _class.currentMeasureId + "_delete_" + idx;
                        label.title = _this.Strings.clearThisLengthMeasure;
                        label.className = "jasmap_label jasmap_icon_delete";
                        label.style.position = "absolute" ;
                        var top3 = isNaN(screenY) ? screenY.replace("px","") :screenY;
                        var left3 = isNaN(screenX) ? screenX.replace("px","") :screenX ;
                        var totalOffset = setTotalLabelOffset("icon" , 7, 7);

                        label.attributes.lastY = top3;
                        label.attributes.lastX = left3;

                        top3 = top3 + totalOffset.offsetY  ;
                        left3 = left3 + totalOffset.offsetX ;
                        label.style.top = top3 +"px" ;   // top 包含偏移
                        label.style.left = left3 +"px" ;
                        label.style.cursor = "pointer" ;

                        label.attributes.offsetX = totalOffset.offsetX;
                        label.attributes.offsetY = totalOffset.offsetY;
                        label.attributes.originLon = lon ;
                        label.attributes.originLat = lat ;

                        label.onclick = _class.clearCurrentMeasureLabels;
                        label.onmousemove = function(e){
                            Event.stop(e);
                        };
                        _class.showMaskContainer.appendChild(label);
                    }
                    span.attributes.originLon = lon ;
                    span.attributes.originLat = lat ;
                    span.style.top = top +"px" ;
                    span.style.left = left +"px" ;
                    _class.showMaskContainer.appendChild(span);
                };
                _class.addTotalMeasureLabel = function( content){
                    var screenX = 0 ;
                    var screenY = 0 ;
                    var pointX = 0 ;
                    var pointY = 0 ;
                    var size = _class.lengthMeasurePoints.length ;
                    if( _class.showMaskContainer && _class.showMaskContainer.childNodes){
                        var id = _class.currentMeasureId + "_label_"+ size;
                        var removeMeasureLabelInterval = null ;
                        var deleteLastLabel = function(){
                            var targets = commonUtil.queryChildren(_class.showMaskContainer ,id );
                            if(targets.length !== 0){
                                clearInterval(removeMeasureLabelInterval);
                                _class.showMaskContainer.removeChild(targets[0]);
                            }else{
                                removeMeasureLabelInterval = setInterval( deleteLastLabel,50);
                            }
                        };
                        deleteLastLabel();
                    }
                    var point = _class.lengthMeasurePoints[size - 1];
                    var lastMapPoint = point.mapPoint ;
                    var lastScreenPoint = point.screenPoint ;
                    pointX = lastMapPoint.x ;
                    pointY = lastMapPoint.y ;
                    screenX = lastScreenPoint.x ;
                    screenY = lastScreenPoint.y ;
                    if(screenX && screenY){
                        _class.addMeasureLabel.call(_class, content ,screenX ,screenY ,1 ,pointX ,pointY );
                    }
                    if(_class.measureTipLabel){
                        _class.measureTipLabel.style.display = 'none';
                    }
                };
                _class.refreshMeasureLabelScreenXY = function( moveX , moveY ,ifEnd){
                    if( !_class.graphicMaskContainer ){
                        return ;
                    }
                    var labelNodes = _class.graphicMaskContainer.getElementsByClassName("jasmap_icon");
                    var labelNodes2 = _class.showMaskContainer.getElementsByClassName("jasmap_label");
                    var labelNode = null,top= 0,left= 0,newTop= 0,newLeft= 0,offsetX=0,offsetY=0,i=0;
                    if( !ifEnd ){
                        //更新图形标注屏幕坐标
                        for(i = 0 ; i < labelNodes.length ;i++){
                            labelNode = labelNodes[i];
                            top = labelNode.attributes.lastY ;
                            left = labelNode.attributes.lastX ;
                            newTop = top + moveY ;
                            newLeft = left + moveX ;
                            labelNode.style.top = newTop + "px";
                            labelNode.style.left = newLeft + "px";
                        }
                        //更新屏幕相对坐标
                        for(i = 0 ; i < labelNodes2.length  ;i++){
                            labelNode = labelNodes2[i];
                            top = labelNode.attributes.lastY ;
                            left = labelNode.attributes.lastX ;
                            offsetX = labelNode.attributes.offsetX ;
                            offsetY = labelNode.attributes.offsetY ;
                            newTop = top + offsetY + moveY;
                            newLeft = left + offsetX + moveX;
                            labelNode.style.top = newTop + "px";
                            labelNode.style.left = newLeft + "px";
                        }
                    }else{
                        for(i = 0 ; i < labelNodes.length  ;i++){
                            labelNode = labelNodes[i];
                            top = labelNode.attributes.lastY ;
                            left = labelNode.attributes.lastX ;
                            newTop = top + moveY ;
                            newLeft = left + moveX ;
                            labelNode.attributes.lastY = newTop  ;
                            labelNode.attributes.lastX = newLeft  ;

                        }
                        for(i = 0 ; i < labelNodes2.length  ;i++){
                            labelNode = labelNodes2[i];
                            top = labelNode.attributes.lastY ;
                            left = labelNode.attributes.lastX ;
                            newTop = top + moveY ;
                            newLeft = left + moveX ;
                            labelNode.attributes.lastY = newTop  ;
                            labelNode.attributes.lastX = newLeft  ;
                        }
                    }
                };
                _class.refreshMeasureLabelScreenXYByFactor = function( anchor ,factor ,ifEnd,ext ){
                    if( !_class.graphicMaskContainer ){
                        return ;
                    }
                    var labelNodes = _class.graphicMaskContainer.getElementsByClassName("jasmap_icon");
                    var labelNodes2 = _class.showMaskContainer.getElementsByClassName("jasmap_label");
                    var labelNode = null,top = 0,left = 0 ,newTop = 0 ,newLeft = 0 ,i = 0 ,offsetX = 0 ,offsetY = 0;
                    var top0 = anchor.y ;
                    var left0 = anchor.x ;
                    if( !ifEnd ){
                        for(i = 0 ; i < labelNodes.length ;i++){
                            labelNode = labelNodes[i];
                            top = labelNode.attributes.lastY ;
                            left = labelNode.attributes.lastX ;
                            newTop = top0 -  (top0 - top ) * factor ;
                            newLeft = left0 - (left0 - left ) * factor ;
                            labelNode.style.top = newTop + "px"; // y
                            labelNode.style.left = newLeft + "px";// x
                        }
                        for(i = 0 ; i < labelNodes2.length ;i++){
                            labelNode = labelNodes2[i];
                            top = labelNode.attributes.lastY  ;
                            left = labelNode.attributes.lastX  ;
                            newTop = top0 - (top0 - top ) * factor  ;
                            newLeft = left0 - (left0 - left ) * factor ;

                            offsetX = labelNode.attributes.offsetX ;
                            offsetY = labelNode.attributes.offsetY ;

                            labelNode.style.top = parseInt( newTop + offsetY) + "px"; // y
                            labelNode.style.left = parseInt( newLeft + offsetX) + "px";// x
                        }
                    }else{
                        //缩放结束后，由原始坐标转化成屏幕坐标
                        var width = _this.map.width ;
                        var height = _this.map.height ;
                        var sp = _this.map.spatialReference;
                        for(i = 0 ; i < labelNodes.length ;i++){
                            labelNode = labelNodes[i];
                            var attributes = labelNode.attributes;
                            var lon = attributes.originLon;
                            var lat = attributes.originLat;
                            var mapPoint = new Point(lon,lat,sp);
                            var screenPoint = screenUtils.toScreenPoint( ext, width, height, mapPoint);
                            newTop = screenPoint.y ;
                            newLeft = screenPoint.x ;
                            labelNode.attributes.lastY = newTop  ;
                            labelNode.attributes.lastX = newLeft  ;
                            labelNode.style.top = parseInt(newTop) + "px"; // y
                            labelNode.style.left = parseInt(newLeft) + "px";// x
                        };
                        for(i = 0 ; i < labelNodes2.length ;i++){
                            labelNode = labelNodes2[i];
                            var attributes = labelNode.attributes;
                            var lon = attributes.originLon;
                            var lat = attributes.originLat;
                            var mapPoint = new Point(lon,lat,sp);
                            var screenPoint = screenUtils.toScreenPoint( ext, width, height, mapPoint);
                            newTop = screenPoint.y ;
                            newLeft = screenPoint.x ;
                            labelNode.attributes.lastY = newTop  ;
                            labelNode.attributes.lastX = newLeft  ;
                            var offsetX = attributes.offsetX;
                            var offsetY = attributes.offsetY;
                            labelNode.style.top = parseInt(newTop + offsetY) + "px"; // y
                            labelNode.style.left = parseInt(newLeft + offsetX) + "px";// x
                        }
                    }
                };
                _class.showGraphicTip = function(flag ,graphic,template ,options){
                    var defaults = {
                        "position": "absolute",
                        "z-index": 99999999,
                        "background": "#fcffd1",
                        "font-family":"Serif",
                        "font-size": "10px",
                        "font-style":  Font["STYLE_NORMAL"],
                        "border": "1px solid #0096ff",
                        "padding": "0.1em 0.3em 0.1em",
                        "border-radius": "3px",
                        "box-shadow": "0 0 0.75em #777777",
                        "filterFunc":null
                    };
                    var params = lang.mixin( defaults ,options);

                    _class.refreshLayerTipDom();
                    if( !flag || !graphic){
                        _this.map.setMapCursor("default");
                        return ;
                    }
                    var layer = graphic._layer ;
                    var point = null;
                    if (graphic.geometry.type !== "point") {
                        point = graphic.geometry.getExtent().getCenter();
                    } else {
                        point = graphic.geometry;
                    }
                    _this.map.setMapCursor("pointer");
                    if (layer._domain && graphic.attributes) {
                        var attr = graphic.attributes;
                        var domain = layer._domain;
                        for (var f in domain) {
                            var domainName = domain[f];
                            var codeId = attr[f];
                            if (codeId !== null) {
                                var codeName = _this.domainMap[domainName + codeId];
                                var domainFieldName = f + "DOMAIN";
                                attr[domainFieldName] = codeName;
                            }
                        }
                        graphic.setAttributes(attr);
                    }
                    var scrPt = _this.map.toScreen(point);
                    var textDiv = domConstruct.create("div");
                    dojo.attr(textDiv, { "id": "text"});
                    params.left = scrPt.x + 10 + "px";
                    params.top = scrPt.y + 10 + "px";
                    dojo.style(textDiv, params);

                    var attrs = graphic.attributes;
                    if(params.filterFunc && typeof params.filterFunc === "function" ){
                        attrs = params.filterFunc(attrs);
                    }
                    var temp = template ? template :layer._tipTemplate ;
                    if(temp && !layer._tipTemplate){
                        layer._tipTemplate = temp;
                    }
                    var context = commonUtil.parseTemplate( temp,attrs );
                    if (context) {
                        textDiv.innerHTML = context;
                        _class.refreshLayerTipDom(textDiv);
                    }
                };
                _class.printMap = function (onSuccess, onFailed) {
                    var params = new PrintParameters();
                    params.map = _this.map;
                    _class.printTask.execute(params, onSuccess, onFailed);
                };
            }
            function ModuleManager() {
                var _class = this;
                var baseModuleClassName = "baseMapModule";
                var config = null;
                var modulesConfig = [];//controller 与普通的module通过两个数组存储
                var controllerModulesConfig = [];
                _class.modules = [];
                _class.loadedModules = [];
                //地图初始化之前先创建module ,初始化后再startup
                var onMapLoaded = function () {
                    if(configManager.getMapOption("scaleBar") !== false){
                        var scalebar = new Scalebar({
                            map: _this.map,
                            scalebarUnit: "dual"
                        });
                    }
                    loadModules();
                    eventManager.publishEvent(_this.Events.ModulesLoadedEvent ,_class.modules);
                };
                var getModuleConfigById = function (id) {
                    for (var i = 0; i < modulesConfig.length; i++) {
                        if (id === modulesConfig[i].id) {
                            return modulesConfig[i];
                        }
                    }
                    return null;
                };
                var parseConfigs = function () {
                    //解析相关配置
                    var checkResult = checkModuleConfigs();
                    try {
                        if (!checkResult) {
                            throw("module配置有错误!");
                        }
                        //解析module配置
                        for (var i = 0; i < config.length; i++) {
                            var obj = config[i];
                            var conf = parseModuleConfig(obj);
                            _class.modules.push(conf);
                        }
                    } catch (e) {
                        eventManager.publishError(_this.Strings.moduleConfigError, e);
                    }
                };
                var checkModuleConfigs = function () {
                    var modulesIds = [];
                    var controlModules = [];
                    for (var i = 0; i < config.length; i++) {
                        var obj = config[i];
                        if (obj.id) {
                            var idExist = array.some(modulesIds, function (item) {
                                return item === obj.id;
                            });
                            if (idExist) {
                                eventManager.publishError(_this.Strings.repeatIdError + " id=" + obj.id);
                                return false
                            }
                            obj.type || ( obj.type="module" );
                            if (obj.controller === true) {
                                obj.moduleSet || ( obj.moduleSet = [] );
                                controlModules.push(obj);
                            } else {
                                modulesIds.push(obj.id);
                            }
                        } else {
                            eventManager.publishError(_this.Strings.moduleConfigError);
                            return false
                        }
                    }
                    for (i = 0; i < controlModules.length; i++) {
                        var controller = controlModules[i];
                        for (var j = 0; j < controller.moduleSet.length; j++) {
                            var m = controller.moduleSet[j];
                            if (m.type === "module") {
                                idExist = false;
                                idExist = array.some(modulesIds, function (item) {
                                    return item === m.target;
                                });
                                if (!idExist && !m.api) {
                                    eventManager.publishError(_this.Strings.hasNoIdError + ",id=" + m.target);
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                };
                var setModuleContainer = function (container) {
                    if (container === "map") {
                        return _this.map.container;
                    } else if (container === "html") {
                        return document.body;
                    } else if (container.indexOf("#") >= 0) {
                        var domId = container.substring(1);
                        return document.getElementById(domId);
                    }
                    return null;
                };
                var parseModuleConfig = function (conf) {
                    var defaults = {
                        "id": "",
                        "label": "",
                        "class": "",
                        "url": "",
                        "icon": "",
                        "container": "map",
                        "style": null,
                        "options": null,
                        "controller": false,
                        "moduleSet":[]
                    };
                    lang.mixin(defaults, conf);
                    defaults.container = setModuleContainer(defaults.container);
                    return defaults;
                };
                //base module class
                var BaseModule = function () {
                    var _class = this;
                    _class.mapApi = null;
                    _class.map = null;
                    _class.state = "closed";
                    _class.container = "map";
                    _class.dom = null;
                    _class.startup = function () {

                    };
                    _class.domCreate = function () {

                    };
                    _class.close = function () {

                    };
                    _class.open = function () {

                    };
                };
                var loadModules = function () {
                    try {
                        //先加载普通module
                        for( var i = 0 ; i < _class.modules.length ; i++ ){
                            var m = _class.modules[i];
                            if(m.type==="module" && m.controller!==true){
                                _class.loadModule(_class.modules[i]);
                            }
                        }
                        //再加载controller
                        for( i = 0 ; i < _class.modules.length ; i++){
                            m = _class.modules[i];
                            if(m.type==="module" && m.controller===true){
                                _class.loadModule(_class.modules[i]);
                            }
                        }
                        for( i = 0 ; i < _class.loadedModules.length ; i++){
                            var mo = _class.loadedModules[i];
                            mo.startup();
                        }
                    } catch (e) {
                        eventManager.publishError(_this.Strings.moduleCreateError, e);
                    }
                };
                var onConfigLoaded = function(jsonConfig){
                    config = jsonConfig.modules ? jsonConfig.modules:[];
                    parseConfigs();
                };


                _class.loadModule = function (conf) {
                    //var deferred = new Deferred();
                    var module = null;
                    var _cls =  conf["class"] ;
                    if (_cls) {
                        var Module = eval(_cls);
                        module = new Module(conf.options);
                        module.id = conf.id;
                        module.map = _this.map;
                        module.container = conf.container;
                        conf.label && ( module.label = conf.label );
                        conf.icon && ( module.icon = conf.icon );
                        module.mapApi = _this;
                        if (conf.controller) {
                            module.moduleSet = conf.moduleSet;
                        }
                    } else if (conf.url) {
                        //开发中 ...

                    }
                    if (module && conf.enable!==false ) {
                        module.domCreate();
                        _class.loadedModules.push(module);
                    }
                    //return deferred.promise();
                };
                _class.startup = function () {
                    //订阅地图创建完成事件
                    _this.subscribe(_this.Events.ConfigLoadedEvent, onConfigLoaded);
                    //_this.subscribe(_this.Events.MapLoadedEvent, onMapLoaded);
                    _this.subscribe(_this.Events.MapCreateEvent, onMapLoaded);
                };
                _class.getModuleById = function (id) {
                    for (var i = 0; i < _class.loadedModules.length; i++) {
                        if (_class.loadedModules[i].id === id) {
                            return _class.loadedModules[i];
                        }
                    }
                    return null;
                }
            }
            function ConfigManager(apiOptions) {
                var _class = this;
                var apiScript = null;
                var _config = null;
                var _mapOptions = null ;
                var dataOptions = null;
                var parseConfig = function () {
                    var appName = _config.appName;
                    if (appName) {
                        document.title = appName;
                    }
                    if(_config.context){
                        _class.context = _config.context;
                        if(!_class.context.defaultFlashEffect){
                            _class.context.defaultFlashEffect = "flash";
                        }
                        if(navigator.appName == "Microsoft Internet Explorer") {
                            var version = navigator.appVersion.match(/MSIE\s\d/i);
                            version = version[0].replace("MSIE " ,"");
                            if(version <= "9" ){
                                _class.context.defaultFlashEffect="flash";
                            }
                        }
                    }
                    if(apiOptions.context){
                        _class.context = lang.mixin(_class.context ,apiOptions.context);
                    }
                };

                _class.config = apiOptions;
                _class.context = {};
                _class.startup = function () {
                    apiScript = document.getElementById(apiOptions.appScriptId);
                    basePath = getBasePath();
                    dataOptions = getMapOptions();
                    _class.config = lang.mixin(_class.config ,dataOptions);
                    var configPath = getMapConfigPath();//读取data-config
                    if (configPath) {  //加载配置
                        loadConfig(configPath, function (conf) {
                            var resources = conf.resources;
                            if (resources && resources.length > 0) {
                                eventManager.time(_this.Strings.dependenceLoading);
                                //load map style.css
                                if (conf.mapStyle) {
                                    var styleUrl = "basepath:styles/" + conf.mapStyle + "/style.css";
                                    var styleCss = { "type": "css", "url": styleUrl };
                                    resources.push(styleCss);
                                }
                                loadResources(resources, function (type,id) {

                                }, function () {
                                    console.info(_this.Strings.resourceLoaded+":",arguments[0]);
                                }, function () {
                                    eventManager.publishEvent(_this.Events.ConfigLoadedEvent, conf);
                                    eventManager.timeEnd(_this.Strings.dependenceLoading);
                                });
                            }else{
                                eventManager.publishEvent(_this.Events.ConfigLoadedEvent, conf);
                            }
                            _config = conf;
                            _mapOptions = conf.map ? conf.map.mapOptions : {};
                            parseConfig();
                        });
                    } else {
                        eventManager.publishError(_this.Strings.configUrlError);
                    }
                };
                _class.getMapOption = function(name){
                    // if(dataOptions){
                    //     return dataOptions[name];
                    // }
                    if(_mapOptions){
                        return _mapOptions[name];
                    }
                    return null;
                };

                function loadConfig(url, onSuccess, onError) {
                    eventManager.time(_this.Strings.configLoading);
                    commonUtil.simpleAjaxLoader({
                        url: url,
                        method: 'get',
                        onSuccess: function (responseText) {
                            eventManager.timeEnd(_this.Strings.configLoading);
                            var conf = {};
                            try {
                                var result = JSON.parse(responseText);
                                if (apiOptions && apiOptions.appName) { //多个app配置
                                    conf = result[apiOptions.appName];
                                } else
                                    conf = result;
                                if (apiOptions["mapStyle"] !== "default") {
                                    conf["mapStyle"] = apiOptions["mapStyle"];
                                } else {
                                    if (!conf["mapStyle"]) {
                                        conf["mapStyle"] = apiOptions["mapStyle"];
                                    }
                                }
                                if (conf.dojoConfig) { // loadResources之前定义
                                    global.dojoConfig = conf.dojoConfig;
                                }
                                if (onSuccess && typeof onSuccess === "function") {
                                    onSuccess(conf);
                                }
                            } catch (e) {
                                eventManager.timeEnd(_this.Strings.configLoading);
                                eventManager.publishError(_this.Strings.parseConfigError, e);
                            }
                        },
                        onError: function (err) {
                            eventManager.timeEnd(_this.Strings.configLoading);
                        }
                    });
                }
                function loadResources(ress, onOneBeginLoad, onOneLoad, onLoad) {
                    var loaded = [];
                    var relys = {};
                    function _onOneLoad(url, id) {
                        if (loaded.indexOf(url) > -1) {
                            return;
                        }
                        loaded.push(url);
                        if (onOneLoad) {
                            onOneLoad(url, loaded.length);
                        }
                        if (relys[id]) {
                            var arrs = relys[id];
                            for (var i = 0; i < arrs.length; i++) {
                                if (arrs[i].url) {
                                    loadResource(arrs[i].type, arrs[i].url, onOneBeginLoad, _onOneLoad, arrs[i].id);
                                }
                            }
                        }
                        if (loaded.length === ress.length) {
                            if (onLoad) {
                                onLoad();
                            }
                        }
                    }
                    for (var i = 0; i < ress.length; i++) {
                        var re = ress[i];
                        //如果配置了依赖，先加入数组，不加载
                        if (re.relyOn) {
                            if (!relys[re.relyOn]) {
                                relys[re.relyOn] = [];
                            }
                            relys[re.relyOn].push(re);
                        } else if (re.url) {
                            //被依赖的必须要有Id
                            loadResource(re.type, re.url, onOneBeginLoad, _onOneLoad, re.id);
                        }
                    }
                }
                function loadResource(type, url, onBeginLoad, onLoad, id) {
                    url = commonUtil.getApiRootPath(url);
                    if (onBeginLoad) {
                        onBeginLoad(type,id);
                    }
                    if (type === 'css') {
                        loadCss(url);
                        //}else if(type==="js"){
                    } else {
                        loadJs(url);
                    }
                    function createElement(config) {
                        var e = document.createElement(config.element);
                        for (var i in config) {
                            if (i !== 'element' && i !== 'appendTo') {
                                e[i] = config[i];
                            }
                        }
                        var root = document.getElementsByTagName(config.appendTo)[0];
                        return (typeof root.appendChild(e) === 'object');
                    }
                    function loadCss(url) {
                        var result = createElement({
                            element: 'link',
                            rel: 'stylesheet',
                            type: 'text/css',
                            href: url,
                            onload: elementLoaded.bind(this, url),
                            appendTo: 'head'
                        });
                        return (result);
                    }
                    function loadJs(url) {
                        var result = createElement({
                            element: 'script',
                            type: 'text/javascript',
                            onload: elementLoaded.bind(this, url),
                            onreadystatechange: elementReadyStateChanged.bind(this, url),
                            src: url,
                            appendTo: 'body'
                        });
                        return (result);
                    }
                    function elementLoaded(url) {
                        if (onLoad) {
                            onLoad(url, id);
                        }
                    }
                    function elementReadyStateChanged(url) {
                        if (this.readyState === 'loaded' || this.readyState === 'complete') {
                            elementLoaded(url);
                        }
                    }
                }
                function getMapConfigPath() {
                    var configPath ="";
                    if(apiScript){
                        configPath = apiScript.getAttribute("data-config");
                    }
                    if(!configPath){
                        configPath = apiDefaults.appConfig
                    }
                    return commonUtil.getApiRootPath(configPath);
                }
                function getBasePath() {
                    if (apiScript) {
                        var path = apiScript.getAttribute("src");
                        var base = document.location.pathname;
                        var lastIndex = base.lastIndexOf("/");
                        base = base.substring(0, lastIndex);
                        path = commonUtil.subUrl(base, path);
                        var lastSpritIndex = path.lastIndexOf("/");
                        //var index = path.indexOf("mapjs4ol.js");
                        if (lastSpritIndex >= 0) {
                            return path.substring(0, lastSpritIndex);
                        }
                        return path;
                    }
                }
                function getMapOptions() {
                    var options = null;
                    if (apiScript) {
                        try {
                            options = JSON.parse(apiScript.getAttribute("data-options"));
                        } catch (e) {
                            console.error(e);
                            console.error("解析data-options出错！");
                        }
                    }
                    return options;
                }
            }
            function StyleManager() {
                var _class = this;
                _class.getDefaultSymbolByGeoType = function (geoType, options) {
                    var defaults = {
                        lineColor: apiDefaults.defaultSymbolColor,
                        lineWidth: 2,
                        pointSize: 10,
                        xOffset: 0,
                        yOffset: 0,
                        fillColor: apiDefaults.defaultSymbolFillColor
                    };
                    defaults = lang.mixin({}, defaults, options);
                    var obj = null;
                    switch (geoType) {//point | multipoint | polyline | polygon
                        case "point":
                        case "multipoint":
                            obj = {
                                "color": defaults.lineColor,
                                "size": defaults.pointSize,
                                "angle": 0,
                                "xoffset": defaults.xOffset,
                                "yoffset": defaults.yOffset,
                                "type": "esriSMS",
                                "style": "esriSMSCircle",
                                "outline": {
                                    "color": defaults.lineColor,
                                    "width": defaults.lineWidth,
                                    "type": "esriSLS",
                                    "style": "esriSLSSolid"
                                }
                            };
                            break;
                        case "polyline":
                            obj = {
                                "type": "esriSLS",
                                "style": "esriSLSSolid",
                                "color": defaults.lineColor,
                                "width": 2
                            };
                            break;
                        case "polygon":
                            obj = {
                                "type": "esriSFS",
                                "style": "esriSFSSolid",
                                "color": defaults.fillColor,
                                "outline": {
                                    "type": "esriSLS",
                                    "style": "esriSLSSolid",
                                    "color": defaults.lineColor,
                                    "width": defaults.lineWidth
                                }
                            };
                            break;
                        default:
                            ;
                    }
                    return _this.getSymbolByObject(obj);
                };
                _class.getSymbolByRender = function (render ,graphic) {
                    var symbol =  render.getSymbol(graphic);
                    if(!symbol){
                        eventManager.publishError(_this.Strings.layerRenderError);
                        return;
                    }
                    return symbol;
                };
                _class.getDefaultHighlightSymbol = function (graphic, layerId ,options) {
                    var defaultHighlightColor = options .defaultHighlightColor ? options .defaultHighlightColor :apiDefaults.defaultHighlightColor;
                    var defaultHighlightFillColor = options .defaultHighlightFillColor ?options .defaultHighlightFillColor:apiDefaults.defaultHighlightFillColor;
                    var type = graphic.geometry.type;
                    var layer = typeof  layerId === "string" ? _this.getLayerById(layerId) : layerId;
                    // if(layer._hightlightSymbol){
                    //     return layer._hightlightSymbol;
                    // }
                    var defaultSymbol = graphic.symbol;
                    if(!defaultSymbol && layer ){
                        var renderer = layer.renderer ;
                        if(renderer) {
                            defaultSymbol = styleManager.getSymbolByRender(renderer,graphic);
                        }else{
                            defaultSymbol = styleManager.getDefaultSymbolByGeoType(type);
                        }
                    }
                    var hightSymbol = lang.clone(defaultSymbol);
                    switch (defaultSymbol.type) {
                        case "simplemarkersymbol":
                            hightSymbol.setSize(defaultSymbol.size * apiDefaults.flashExpend);
                            break;
                        case "picturemarkersymbol":
                            hightSymbol.setHeight(defaultSymbol.height * apiDefaults.flashExpend);
                            hightSymbol.setWidth(defaultSymbol.width * apiDefaults.flashExpend);
                            break;
                        case "simplelinesymbol":
                            hightSymbol.setWidth(defaultSymbol.width + 3);// !
                            hightSymbol.setColor(defaultHighlightColor);// !
                            hightSymbol.setStyle(defaultSymbol.style);// !
                            break;
                        case "picturefillsymbol":
                            ;
                        case "simplefillsymbol":
                            //hightSymbol = new SimpleFillSymbol(this._hightlightSymbols.simpleFillSymbol);
                            hightSymbol.outline.setWidth(defaultSymbol.outline.width + 3);//
                            hightSymbol.outline.setColor(defaultHighlightColor);// !
                            hightSymbol.setColor(defaultHighlightFillColor);// !
                            hightSymbol.setStyle(defaultSymbol.style);// !
                            break;
                        default:
                            ;
                    }
                    return hightSymbol;
                };
                _class.getPointSymbolType = function (type) {
                    var shapeType = "";//符号样式
                    switch (type) {
                        case "circle":
                            shapeType = SimpleMarkerSymbol.STYLE_CIRCLE;
                            break;
                        case "cross":
                            shapeType = SimpleMarkerSymbol.STYLE_CROSS;
                            break;
                        case "diamond":
                            shapeType = SimpleMarkerSymbol.STYLE_DIAMOND;
                            break;
                        case "path":
                            shapeType = SimpleMarkerSymbol.STYLE_PATH;
                            break;
                        case "square":
                            shapeType = SimpleMarkerSymbol.STYLE_SQUARE;
                            break;
                        case "x":
                            shapeType = SimpleMarkerSymbol.STYLE_X;
                            break;
                        default:
                            shapeType = SimpleMarkerSymbol.STYLE_CIRCLE;
                    }
                    return shapeType.slice(0, 1).toUpperCase() + shapeType.slice(1);
                };
                _class.getPolylineSymbolType = function (type) {
                    var shapeType = null;
                    switch (type) {
                        case "dash":
                            shapeType = SimpleLineSymbol.STYLE_DASH;
                            break;
                        case "dashdot":
                            //shapeType = SimpleLineSymbol.STYLE_DASHDOT;
                            shapeType = "DashDot";
                            break;
                        case "dashdotdot":
                            //shapeType = SimpleLineSymbol.STYLE_DASHDOTDOT;
                            shapeType = "DashDotDot";
                            break;
                        case "dot":
                            shapeType = SimpleLineSymbol.STYLE_DOT;
                            break;
                        case "longdash":
                            //shapeType = SimpleLineSymbol.STYLE_LONGDASH;
                            shapeType = "LongDash";
                            break;
                        case "longdashdot":
                            //shapeType = SimpleLineSymbol.STYLE_LONGDASHDOT;
                            shapeType = "LongDashDot";
                            break;
                        case "null":
                            shapeType = SimpleLineSymbol.STYLE_NULL;
                            break;
                        case "shortdash":
                            shapeType = SimpleLineSymbol.STYLE_SHORTDASH;
                            shapeType = "ShortDash";
                            break;
                        case "shortdashdot":
                            //shapeType = SimpleLineSymbol.STYLE_SHORTDASHDOT;
                            shapeType = "ShortDashDot";
                            break;
                        case "shortdashdotdot":
                            //shapeType = SimpleLineSymbol.STYLE_SHORTDASHDOTDOT;
                            shapeType = "ShortDashDotDot";
                            break;
                        case "shortdot":
                            //shapeType = SimpleLineSymbol.STYLE_SHORTDOT;
                            shapeType = "ShortDot";
                            break;
                        case "solid":
                            shapeType = SimpleLineSymbol.STYLE_SOLID;
                            break;
                        default:
                            shapeType = SimpleLineSymbol.STYLE_SOLID;

                    }
                    return shapeType.slice(0, 1).toUpperCase() + shapeType.slice(1);
                };
                _class.getPolygonSymbolType = function (type) {
                    var shapeType = null;
                    switch (type) {
                        case "backward_diagonal":
                            shapeType = "BackwardDiagonal";
                            break;
                        case "cross":
                            shapeType = SimpleFillSymbol.STYLE_CROSS;
                            break;
                        case "diagonal_cross":
                            shapeType = "DiagonalCross";
                            break;
                        case "forward_diagonal":
                            //shapeType = SimpleFillSymbol.STYLE_FORWARD_DIAGONAL;
                            shapeType = "ForwardDiagonal";
                            break;
                        case "horizontal":
                            shapeType = SimpleFillSymbol.STYLE_HORIZONTAL;
                            break;
                        case "null":
                            shapeType = SimpleFillSymbol.STYLE_NULL;
                            break;
                        case "solid":
                            shapeType = SimpleFillSymbol.STYLE_SOLID;
                            break;
                        case "vertical":
                            shapeType = SimpleFillSymbol.STYLE_VERTICAL;
                            break;
                        default:
                            shapeType = SimpleFillSymbol.STYLE_SOLID;
                    }
                    return shapeType.slice(0, 1).toUpperCase() + shapeType.slice(1);
                };
                _class.getSymbolByObject = function(obj){
                    switch (obj.type){
                        case 'esriSLS': return new SimpleLineSymbol(obj);
                        case 'esriSFS': return new SimpleFillSymbol(obj);
                        case 'esriSMS': return new SimpleMarkerSymbol(obj);
                        case 'esriPMS': return new PictureMarkerSymbol(obj);
                        case 'esriTS': return new TextSymbol(obj);
                    }
                    return null ;
                };
                _class.startup = function(){

                }
            }
            function CommonUtil(){
                var _class = this;//常用工具
                _class.findGraphicsByAttributes = function (graphics, attributes) {
                    var results = [];
                    for (var i = 0; i < graphics.length; i++) {
                        var graphic = graphics[i];
                        var graphicAttr = graphic.attributes;
                        if (!graphicAttr) continue;
                        var ifTarget = true;
                        for (var key in attributes) {
                            if (attributes[key] !== graphicAttr[key]) {
                                ifTarget = false;
                                break;
                            }
                        }
                        if (ifTarget) {
                            results.push(graphic);
                        }
                    }
                    return results;
                };
                _class.append = function (el, htmlString) {
                    var divTemp = document.createElement("div"), nodes = null
                        // 文档片段，一次性append，提高性能
                        , fragment = document.createDocumentFragment();
                    divTemp.innerHTML = htmlString;
                    nodes = divTemp.childNodes;
                    for (var i = 0, length = nodes.length; i < length; i += 1) {
                        fragment.appendChild(nodes[i].cloneNode(true));
                    }
                    el.appendChild(fragment);
                    nodes = null;
                    fragment = null;
                };
                _class.mapLayerSetData  = function(conf,mapFunc,parent){// 遍历
                    if(mapFunc && typeof mapFunc==="function"){
                        mapFunc(conf,parent);
                    }
                    if(conf.layerSet && conf.layerSet.length > 0){
                        var layerSet = conf.layerSet ;
                        for(var i = 0 ; i < layerSet.length ; i++){
                            var c = layerSet[i];
                            _class.mapLayerSetData( c ,mapFunc ,conf);
                        }
                    }
                };
                _class.extend = function() {
                    if(typeof $ !== "undefined" && $.extend){
                        return $.extend.apply(this,arguments);
                    }
                    //var destination = JSON.parse(JSON.stringify(target));
                    var isObjFunc = function(name) {
                        var toString = Object.prototype.toString;
                        return function() {
                            return toString.call(arguments[0]) === '[object ' + name + ']'
                        }
                    };
                    var isObject = isObjFunc('Object'),
                        isArray = isObjFunc('Array');
                    var obj,copy,i;
                    for(i = arguments.length - 1;i > 0;i--) {
                        var destination = arguments[i - 1];
                        var source = arguments[i];
                        if(isObject(source) || isArray(source)) {
                            for(var property in source) {
                                if(property === "prototype"){
                                    continue ;
                                }
                                obj = source[property];
                                if(  isObject(obj) || isArray(obj)  ) {
                                    copy = isObject(obj) ? {} : [];
                                    var extended = _class.extend({} ,copy,obj);
                                    destination[property] = extended;
                                }else if(source[property]!= null || source[property] != undefined){
                                    destination[property] = source[property]
                                }
                            }
                        } else if(source) {
                            destination = source;
                        }
                    }
                    return destination

                };
                _class.getApiRootPath = function(url){
                    var result = url;
                    if(url.indexOf("basepath:") === 0){
                        url = url.replace("basepath:","").trim();
                        result = commonUtil.subUrl(basePath, url);
                    }else if(url.indexOf("stylepath:") === 0 ){
                        var mapStyle = _this.apiConfig.mapStyle ;
                        url = url.replace("stylepath:","").trim();
                        result = commonUtil.subUrl(basePath + "/styles/" + mapStyle +"/" , url);
                    }
                    return result.trim();
                };
                _class.subUrl =function(path ,url){
                    if(path.lastIndexOf("/")=== path.length - 1){
                        path = path.substring(0,path.lastIndexOf("/"));
                    }
                    while(url.indexOf("../") === 0){
                        url = url.substring(3);
                        path = path.substring(0,path.lastIndexOf("/"));
                    }
                    return path + "/" + url;
                };
                _class.simpleAjaxLoader = function(op){
                    var options = {
                        url:"",
                        data:null,
                        method:"post",
                        async:true,
                        onSuccess:function(){

                        },
                        onError:function(){
                            eventManager.publishError(arguments[0]);
                        }
                    };
                    options = _class.extend(options,op);
                    var xmlHttp = null;
                    if (window.XMLHttpRequest) {// IE7+, Firefox, Chrome, Opera, Safari 代码
                        xmlHttp = new XMLHttpRequest();
                    }else{// IE6, IE5 代码
                        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    var url = options.url;
                    var formData = options.data;
                    var method = options.method ;
                    var onSuccess = options.onSuccess ;
                    var onError = options.onError ;
                    var async = options.async ;
                    xmlHttp.onreadystatechange = function(){
                        if(arguments[0] && arguments[0].target){
                            xmlHttp = arguments[0].target;
                        }else{//ie 8
                            //xmlHttp = arguments.caller;
                        }
                        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                            onSuccess(xmlHttp.responseText);
                        }
                        if(xmlHttp.readyState === 4 && xmlHttp.status !== 200){
                            onError(xmlHttp.responseText);
                        }
                    };
                    xmlHttp.open(method,url,async);
                    //xmlHttp.setRequestHeader("Content-type","application/json");
                    //xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlHttp.send(formData ? formData : null);
                };
                _class.appendUrl = function(url, fieldName , fieldValue){
                    if(url.indexOf("?")<0){
                        url += "?";
                    }
                    if(url.lastIndexOf("&")!== url.length-1 && url.substring(url.length-1) !== "?" ){
                        url += "&";
                    }
                    url += (fieldName + "=" + fieldValue);
                    return url ;
                };
                _class.getDefaultLayerQueryUrl = function(layerId){
                    var projectPath = apiDefaults.projectPathName;
                    if(!projectPath){
                        var pathname = document.location.pathname;
                        if(pathname.lastIndexOf("/") === 0){
                            projectPath = "";//路径没有项目名称
                        }else{
                            pathname = pathname.substring(1);
                            projectPath = pathname.substring(0,pathname.indexOf("/"));
                        }
                    }
                    return  document.location.origin + "/" + projectPath + "/jasgis/" + layerId +"/query.do";
                };
                _class.getDefaultMapQueryUrl = function(){
                    var projectPath = apiDefaults.projectPathName;
                    if(!projectPath){
                        var pathname = document.location.pathname;
                        if(pathname.lastIndexOf("/") === 0){
                            projectPath = "";//路径没有项目名称
                        }else{
                            pathname = pathname.substring(1);
                            projectPath = pathname.substring(0,pathname.indexOf("/"));
                        }
                    }
                    return  document.location.origin + "/" + projectPath + "/jasgis/query.do";
                };
                _class.hasValue = function(target,obj){
                    for(var key in obj){
                        var value = obj[key];
                        if(value === target){
                            return true;
                        }
                    }
                    return false;
                };
                _class.buildCircleGeometry = function(centerX ,centerY ,radius ){
                    return "CIRCLE(" + centerX + "," + centerY + "," + radius + ")";
                };
                _class.dataURLtoBlob = function(dataurl) {
                    var arr = dataurl.split(','),
                        mime = arr[0].match(/:(.*?);/)[1],
                        bstr = atob(arr[1]),
                        n = bstr.length, u8arr = new Uint8Array(n);
                    while(n--){
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    return new Blob([u8arr], {type:mime});
                };
                _class.changeUrlArg = function(url, arg, val){
                    var pattern = arg+'=([^&]*)';
                    var replaceText = arg+'='+val;
                    return url.match(pattern) ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url+'&'+replaceText : url+'?'+replaceText);
                };
                _class.launchIntoFullscreen = function(element,context) {
                    var doc = context ?context.document :document;
                    var into = element.requestFullscreen ||
                        element.mozRequestFullScreen ||
                        element.webkitRequestFullscreen ||
                        element.webkitRequestFullscreen ||
                        element.msRequestFullscreen ;
                    if(into){
                        into.call(element);
                    }else if(typeof context.ActiveXObject != "undefined") {
                        try {
                            var wscript = new context.ActiveXObject("WScript.Shell");
                            if(wscript != null) {
                                wscript.SendKeys("{F11}");
                                doc.isFullScreen = true ;
                            }
                        }catch(e){
                            var mes = e.message + "!";
                            mes += "请在浏览器“Internet选项”安全面板里面设置允许运行ActiveX程序，重启浏览器后使用该功能！";
                            eventManager.publishError(mes);
                        }
                    }else{
                        eventManager.publishError(_this.Strings.browserDoesNotSupport);
                    }
                };
                _class.exitFullscreen = function(context) {
                    var doc = context ?context .document:document ;

                    var ext = doc.exitFullscreen ||
                        doc.mozCancelFullScreen ||
                        doc.webkitExitFullscreen ||
                        doc.msExitFullscreen ;
                    if(ext) {
                        ext.call(doc) ;
                    } else if(typeof context.ActiveXObject != "undefined"){
                        try{
                            var wscript = new context.ActiveXObject("WScript.Shell");
                            if(wscript != null) {
                                wscript.SendKeys("{F11}");
                                doc.isFullScreen = false ;
                            }
                        }catch(e){
                            var mes = e.message + "!";
                            mes += "请在浏览器“Internet选项”安全面板里面设置允许运行ActiveX程序，重启浏览器后使用该功能！";
                            eventManager.publishError(mes);
                        }
                    }else{
                        eventManager.publishError(_this.Strings.browserDoesNotSupport);
                    }
                };
                _class.isFullscreen = function(context){
                    var doc = context ? context.document :document ;
                    return doc.fullscreenElement    ||
                        doc.msFullscreenElement  ||
                        doc.mozFullScreenElement ||
                        doc.webkitFullscreenElement ||
                        doc.isFullScreen || false;
                };
                _class.queryChildren = function(parent ,fieldValue ,fieldName){
                    var result = [];
                    fieldName =  ( fieldName ? fieldName : "id" );
                    for (var i = parent.childElementCount - 1;i >=0;i--) {
                        var node = parent.childNodes[i];
                        if( node[fieldName] == fieldValue ){
                            result.push(node) ;
                        }
                    }
                    return result;
                };
                _class.removeChildren = function(parent ,fieldValue ,fieldName ){
                    if(!fieldValue && !fieldName){// remove all
                        for (var i = parent.childElementCount - 1;i >=0;i--) {
                            parent.removeChild(parent.childNodes[i]);
                        }
                        return
                    }
                    if(fieldValue ){
                        var targets = _class.queryChildren(parent ,fieldValue ,fieldName);
                        // for (var i = parent.childElementCount - 1;i >=0;i--) {
                        //     var node = parent.childNodes[i];
                        //     if( node[fieldName] == fieldValue ){
                        //         parent.removeChild(node) ;
                        //     }
                        // }
                        for(var i = 0 ; i < targets.length ;i++){
                            parent.removeChild(targets[i]) ;
                        }
                        return
                    }
                };
                _class.removeChild = function(parent ,index){
                    var size = parent.childElementCount;
                    var node = null ;
                    if(index >= 0 && index < size ){
                        node = parent.childNodes[index];
                        parent.removeChild(node);
                    }else if(index < 0 && size + index > 0){
                        node = parent.childNodes[size + index];
                        parent.removeChild(node);
                    }
                    return node ;
                };
                _class.prependChild = function(parentNode,newChild){
                    if(parentNode.firstChild){
                        parentNode.insertBefore(newChild,parentNode.firstChild);
                    } else {
                        parentNode.appendChild(newChild);
                    }
                    return parentNode;
                };
                _class.parseTemplate = function(template,attribute){
                    var result = template;
                    var fieldNames = template.match(/\${(.*?)}/g);
                    if(fieldNames === null){
                        return null;
                    }
                    var fieldsArray = ( typeof fieldNames === "string" ? fieldNames.split(","):fieldNames );
                    for(var i = 0 ; i < fieldsArray.length;i++){
                        var name = fieldsArray[i];
                        var formatArr = name.match(/#?\.[#]*/);
                        var fieldName = name.match(/[\w]+/ig)[0];
                        var value = attribute[fieldName];
                        if(formatArr ){//判断有没有数字格式化字符
                            var format = formatArr[0];
                            value = _class.formatNumber(value,format);
                        }
                        result = result.replace(new RegExp( "\\" + name,"gm"),value ? value :"");
                    }
                    return result;
                };
                //format : #.##### 或 .#####
                _class.formatNumber = function(value ,format){
                    var dotIndex = format.indexOf(".");
                    var count = format.length - dotIndex - 1;
                    if(count > 0){
                        value = parseFloat(value).toFixed(count) ;
                    }
                    return value ;
                };
                _class.clone = function(pros){
                    return lang.clone(pros);
                };
                _class.rgbaToArray = function(str){
                    if(Array.isArray(str)){
                        return str ;
                    }
                    var preIndex = str.indexOf("#");
                    if( preIndex>= 0){
                        var value = str.substring(preIndex + 1);
                        var r,g,b ;
                        var color = [];
                        if(value.length === 3){
                            r = value.substr(0,1);
                            g = value.substr(1,1);
                            b = value.substr(2,1);
                            r += r;
                            g += g;
                            b += b;
                        }else if(value.length === 6){
                            r = value.substr(0,2);
                            g = value.substr(2,2);
                            b = value.substr(4,2);
                        }else{
                            return color ;
                        }
                        color.push(parseInt(parseInt(r,16).toString(10)));
                        color.push(parseInt(parseInt(g,16).toString(10)));
                        color.push(parseInt(parseInt(b,16).toString(10)));
                        color.push(255);
                        return color ;
                    }
                    var idx1 = str.indexOf("(") + 1 ;
                    var idx2 = str.indexOf(")") ;
                    var colorArray = str.substring(idx1 ,idx2).split(",") ;
                    colorArray.map(function(v){
                        return parseFloat(v) ;
                    });
                    if(colorArray.length === 3){
                        colorArray.push(255);
                    }
                    return colorArray;
                };
            }
            function GeometryUtil(){
                var _class = this ;
                //2000坐标系椭球参数
                var e = 1/298.257222101;
                var l = 6378137;
                var avgR = 6371004;
                _class.scaleToResolution = function(scale){
                    var espg = _this.map.getView().getProjection().getCode();
                    if(espg==="EPSG:4490" || espg==="EPSG:4326"){
                        return   ( scale * 360 * 0.0254 ) /( 96 * 2 * Math.PI * l);
                    }else {
                        return  scale * 0.0254 / apiDefaults.dpi;
                    }
                };
                _class.resolutionToScale = function(reso){
                    var espg = _this.map.getView().getProjection().getCode();
                    if(espg==="EPSG:4490" || espg==="EPSG:4326"){
                        return  reso * apiDefaults.dpi * 2 * Math.PI *  l/(360 * 0.0254);
                    }else {
                        return  reso * apiDefaults.dpi / 0.0254;
                    }
                };
                _class.toRadian = function(d) {
                    return d * Math.PI / 180.0;
                };
                /**
                 * 求椭球面距离,单位m
                 * 东经为正，西经为负；北纬为正，南纬为负。
                 * @param xA
                 * @param yA
                 * @param xB
                 * @param yB
                 */
                _class.distance = function(xA ,yA ,xB ,yB){
                    var distance = 0;
                    var wkid  = _this.map.spatialReference.wkid;
                    if(wkid===4490 || wkid=== 4326 || wkid === 4610 || wkid === 4214){
                        var radLat1 = _class.toRadian (yA);
                        var radLat2 = _class.toRadian (yB);
                        var radLon1 = _class.toRadian (xA);
                        var radLon2 = _class.toRadian (xB);
                        if (radLat1 < 0)
                            radLat1 = Math.PI / 2 + Math.abs(radLat1);// south
                        if (radLat1 > 0)
                            radLat1 = Math.PI / 2 - Math.abs(radLat1);// north
                        if (radLon1 < 0)
                            radLon1 = Math.PI * 2 - Math.abs(radLon1);// west
                        if (radLat2 < 0)
                            radLat2 = Math.PI / 2 + Math.abs(radLat2);// south
                        if (radLat2 > 0)
                            radLat2 = Math.PI / 2 - Math.abs(radLat2);// north
                        if (radLon2 < 0)
                            radLon2 = Math.PI * 2 - Math.abs(radLon2);// west
                        var x1 = avgR * Math.cos(radLon1) * Math.sin(radLat1);
                        var y1 = avgR * Math.sin(radLon1) * Math.sin(radLat1);
                        var z1 = avgR * Math.cos(radLat1);

                        var x2 = avgR * Math.cos(radLon2) * Math.sin(radLat2);
                        var y2 = avgR * Math.sin(radLon2) * Math.sin(radLat2);
                        var z2 = avgR * Math.cos(radLat2);

                        var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)+ (z1 - z2) * (z1 - z2));
                        //余弦定理求夹角
                        var theta = Math.acos((avgR * avgR + avgR * avgR - d * d) / (2 * avgR * avgR));
                        var dist = theta * avgR;
                        return dist;
                    }else{
                        distance = Math.sqrt(Math.pow(xB - xA,2) + Math.pow(yB - yA,2));
                    }
                    return distance;
                };
            }
            function SimpleDomFactory(){
                var _class = this ;

                var parseEasyUIClass = function(className ,options){
                    var easyuiClasses = className.match(/easyui-[\w]+/);
                    if(easyuiClasses.length > 0){
                        var _cls = easyuiClasses[0] ;
                        var subIndex = _cls.indexOf("-") + 1;
                        var func = _cls.substr(subIndex) ;
                        return $(_cls)[func](options);
                    }
                    return null ;
                };

                _class.parseTemplate = function(template ,options){
                    var $template = typeof template ==="string" ? $(template) : template;
                    var children = $template.children();
                    for(var i = 0;i < children.size ;i++){
                        var child = children.eq(i) ;
                        var name = child.attr("name");
                        var opts = null ;
                        if(name){
                            opts = options[name + "-options"];
                        }
                        if(child.children().length > 0){
                            child = _class.parseTemplate(child, opts);
                        }else{
                            _class.build(child,opts);
                        }
                    }
                    return $template[0];
                };

                _class.build = function(dom,options){
                    var $dom = $(dom);
                    var parent = dom.parentNode ;
                    var dataOptionsString = $dom.attr("data-options") ;
                    var className = $dom.attr("class");
                    var JasgisClass = null ;
                    if(className){
                        var jasgisClasses = className.match(/jasgis-[\w]+/);
                        if(jasgisClasses.length > 0){
                            var subIndex = jasgisClasses[0].indexOf("-") + 1;
                            var jasgisClass = jasgisClasses[0].substr(subIndex);
                            JasgisClass = document[jasgisClass];
                        }
                    }
                    if(dataOptionsString){
                        var params = JSON.parse(dataOptionsString);
                        //配置参数效力大于data-options配置
                        options = $.extend(params ,options);
                    }
                    if(JasgisClass && typeof JasgisClass === "function"){
                        var jasCls = new JasgisClass(options);
                        parent.replaceChild(jasCls.dom,dom);
                    }
                    if(className.indexOf("easyui-") >= 0){
                        var $class = parseEasyUIClass(className ,options);

                    }
                    //input

                    return null ;
                }
            }

            startup();
        });
    }

})(window);



