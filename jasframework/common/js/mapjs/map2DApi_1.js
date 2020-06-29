/**
 * Created by K.C. on 2017/6/27.
 * Description:基于arcgis for js 3.18 地图api
 * Version:V-318-1.0.0
 * LastUpdateDate :2018.11.12
 */
var Constants = {
    "events":{
        // 可以在项目中调用api的subscribe方法添加下列事件的监听
        "ErrorEvent":"ErrorEvent",//
        "MapInitEvent":"MapInitEvent",
        "MapLoadedEvent":"MapLoadedEvent",
        "MapCreateEvent":"MapCreateEvent",
        "ConfigLoadedEvent":"ConfigLoadedEvent",
        //"DrawEndEvent":"DrawEndEvent",
        //"EditEndEvent":"EditEndEvent",
        "InfoWindowShowEvent":"InfoWindowShowEvent",
        "InfoWindowHideEvent":"InfoWindowHideEvent",

        "BaseMapLayersLoadedEvent":"BaseMapLayersLoadedEvent",
        "OptionalLayersLoadedEvent":"OptionalLayersLoadedEvent",
        "OptionalLayerAddedEvent":"OptionalLayerAddedEvent",
        "OptionalLayersChangedEvent":"OptionalLayersChangedEvent",
        "ModuleStateChangedEvent":"ModuleStateChangedEvent",
        "ModulesLoadedEvent": "ModulesLoadedEvent",
        "ModuleStartupEvent": "ModuleStartupEvent",
        "MapResizedEvent": "MapResizedEvent"

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
        "layerNotLoaded": "该图层未加载",
        "layerUrlNotNull": "该类型图层url不能为空",
        "layerLoadError": "图层加载出现错误，请检查网络！",
        "layerListenerConfigError": "图层监听配置出错！",
        "eventNotRegister": "事件没有注册，回调函数无法执行",
        "eventNameRepeatError": "事件名称已经存在！",
        "graphicCreateError": "图形创建出错 ，请检查数据结构！",
        "getDistanceError": "计算距离出错！",
        "getAreaError": "计算面积出错！",
        "invalidFlashData": "无效的闪烁规则！",
        "featureNotFound": "没有查询到目标要素，请检查查询条件！",
        "geometryNotFound": "没有查询到空间坐标数据！",
        "queryError": "查询出错！",
        "layerSetNotFound": "没有找到对应的layerSet",
        "repeatIdError": "重复ID",
        "hasNoIdError": "ID不存在",
        "hasNoLabelPropertyError": "图层没有包含标注所需要的属性字段，请检查图层的outFields配置",
        "hasNoStyleError": "样式不存在",
        "hasNoProj4js": "自定义投影需要引入proj4.js",
        "hasNoJqueryEasyUILib": "需要引入jquery easyUI依赖",
        "hasNoConfigDataError":"配置不存在",
        "callbackConfigNeeded":"需要配置callback参数",
        "exportResourceNeeded":"地图导出功能需要引入FileSaver.js",
        "mapRealExtent":"地图实际范围",
        "mapMaxExtent":"地图最大允许范围",
        "layerRenderError":"图层渲染出错，请检查图层渲染设置！",
        "measureLengthResultPrefixLabel":"",
        "measureLengthUnitMeter":"m",
        "measureLengthUnitKilometer":"km",
        "measureAreaResultPrefixLabel":"",
        "measureAreaUnitSquareMeter":"㎡",
        "measureAreaUnitSquareKilometer":"k㎡",
        "blankContentTip":"",
        "clearThisLengthMeasure":"清除本次测距"
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
    //ie8
    if(!String.prototype.trim){
        String.prototype.trim = function (){
            return this.replace(/(^\s*)|(\s*$)/g, "");
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
            "esri/urlUtils",
            "esri/tasks/GeometryService", "esri/tasks/LengthsParameters", "esri/tasks/AreasAndLengthsParameters","esri/tasks/BufferParameters",
            "esri/basemaps", "esri/map", "esri/SpatialReference","esri/geometry/Extent", "esri/geometry/Point", "esri/geometry/Circle","esri/geometry/Polyline",
            "esri/InfoTemplate", "esri/graphic", "esri/graphicsUtils", "esri/geometry/screenUtils", "esri/geometry/webMercatorUtils",
            "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer",
            "esri/layers/VectorTileLayer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
            "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol", "esri/symbols/Font", "esri/Color",
            "esri/geometry/jsonUtils", "esri/toolbars/navigation", "esri/toolbars/draw", "esri/toolbars/edit", "esri/geometry/geometryEngine",
            "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/dijit/Scalebar", "esri/dijit/Popup","esri/tasks/query","esri/tasks/QueryTask",
            "jasgroup/layers/FlashFeatureLayer", "jasgroup/layers/DrawLayer", "jasgroup/layers/TiandituLayer", "jasgroup/layers/PipelineLayer","jasgroup/layers/GaodeLayer","jasgroup/layers/BaiduLayer",
            "dojo/domReady!"
        ], function (lang, array, Deferred, all, Event, domConstruct, topic,urlUtils,
                     GeometryService, LengthsParameters, AreasAndLengthsParameters, BufferParameters,
                     esriBasemaps, Map, SpatialReference,Extent, Point, Circle, Polyline,
                     InfoTemplate, Graphic, graphicsUtils, screenUtils, webMercatorUtils,
                     ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, FeatureLayer, GraphicsLayer, VectorTileLayer,
                     SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, PictureMarkerSymbol, SimpleFillSymbol, TextSymbol, Font, Color,
                     jsonUtils, Navigation, Draw, Edit, geometryEngine,
                     PrintTask, PrintParameters, Scalebar, Popup, Query ,QueryTask ,
                     FlashLayer, DrawLayer, TiandituLayer, PipelineLayer,GaodeLayer,BaiduLayer) {

            apiDefaults = lang.mixin({}, apiDefaults, options);

            var eventManager = new EventManager();
            var layerManager = new LayerManager();//
            var mapManager = new MapManager();
            var moduleManager = new ModuleManager();
            var styleManager = new StyleManager();
            var configManager = new ConfigManager(apiDefaults);
            var commonUtil = new CommonUtil();

            //------------私有方法和属性------------
            var domId = apiDefaults.mapDivId;
            var optionallayers = null;

            _this.apiConfig = null;//
            _this.domainMap = {};//新增阈值处理
            _this.Events = null;
            _this.Strings = null;
            _this.Keys = null;
            _this.map = null;
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
                layerManager.startup();//
                mapManager.startup();
                moduleManager.startup();
                styleManager.startup();
                configManager.startup();
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
            var processOptionallayerOptions = function (conf, mapFunction, parent) {// 遍历
                if (mapFunction && typeof mapFunction === "function") {
                    mapFunction(conf, parent);
                }
                if (conf.layerSet && conf.layerSet.length > 0) {
                    var layerSet = conf.layerSet;
                    for (var i = 0; i < layerSet.length; i++) {
                        var c = layerSet[i];
                        processOptionallayerOptions(c, mapFunction, conf);
                    }
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
            //隐藏的图层也加载
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
                        layerManager.basemapsLayersConfig.push(option);
                    } else {
                        layerOption = parseBasemapLayerOptions(option);
                        if (layerOption.visible !== true) {
                            unVisibleLayers.push(layerOption);
                        } else {
                            visibleLayers.push(layerOption);
                        }
                        layerManager.basemapsLayersConfig.push(layerOption);
                    }
                }
                var showLayerCount = layerManager.basemapsLayersConfig[0].layerSet ? layerManager.basemapsLayersConfig[0].layerSet.length : 1;
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
                    var layer = layerManager.createLayer(baseMap);
                    _this.map.addLayer(layer, baseMap.index);
                });
            };
            var createOptionalLayers = function (configs) {
                array.forEach(configs, function (v, i) {
                    processOptionallayerOptions(v, function (conf, parent) {
                        if (!conf.layerSet) {
                            if (parent && parent.visible === false) {
                                conf.visible = false;
                            }
                            if (parent && parent.type === "GeoBaseData") {
                                layerManager.baseGeodataLayersConfig.push(conf);
                            }
                            layerManager.optionallayersConfig.push(conf);
                        } else {
                            if (parent) {
                                if (parent.type !== undefined)
                                    conf.type = parent.type;
                                if (parent.visible === false)
                                    conf.visible = false;
                            }
                            parent = conf;
                        }

                    });
                });
                var layers = [].concat(layerManager.optionallayersConfig, layerManager.baseGeodataLayersConfig);
                // 排序 check
                array.forEach(layers, function (v, i) {
                    if (v.index == undefined) {
                        v.index = 30;
                    }
                });
                layers.sort(function (a, b) {
                    return a.index - b.index
                });
                //
                array.forEach(layers, function (conf) {
                    layerManager.createOptionalLayer(conf);
                });
                eventManager.publishEvent(_this.Events.OptionalLayersChangedEvent, layers, configs);//
            };
            var applyProxy = function (url) {
                var proxyUrl = _this.apiConfig.httpProxy ? _this.apiConfig.httpProxy.trim() : "";
                if (proxyUrl !== "") {
                    if (proxyUrl.substr(proxyUrl.length - 1, 1) !== "?") {
                        proxyUrl += "?";
                    }
                    return proxyUrl + url;
                }
                return url;
            };
            var printMap = function (onSuccess, onFailed) {
                var params = new PrintParameters();
                params.map = _this.map;
                mapManager.printTask.execute(params, onSuccess, onFailed);
                //
            };
            var _fireEventHandler = function (onFunc, target) {
                if (onFunc && typeof onFunc === "function") {
                    onFunc(target);
                }
            };
            var _checkAppConfig = function () {
                var apiOpts = {
                    "appName": ""
                };
                if (apiDefaults.appName !== "") {//如果js文件在引入的时候没有指定appName，且配置文件为数组，则在api对象创建的时候需要指定appName
                    if (!conf[apiDefaults.appName]) {
                        eventManager.publishError(_this.Strings.appNameConfigError);
                        return false;
                    } else {
                        conf = conf[apiDefaults.appName];
                    }
                } else {

                }
                conf.apiOptions = lang.mixin({}, apiOpts, conf.apiOptions);
                return true;
            };
            //------------------地图操作类----------------------
            /**
             * 启用地图pan模式，鼠标形状变成手型
             */
            _this.startPanMode = function () {
                mapManager.deactivate();
                mapManager.activate(MapManager.NAVIGATOR, [Navigation.PAN]);
                _this.map.setMapCursor("pointer");
            };
            _this.fullscreen = function(){
                if(commonUtil.isFullscreen()){
                    commonUtil.exitFullscreen();
                }else{
                    var full = _this.map.container;
                    full.style.backgroundColor = "white";
                    commonUtil.launchIntoFullscreen(full);
                }
            };
            /**
             * 地图居中
             * @param x
             * @param y
             */
            _this.centerAt = function (x, y) {
                x = parseFloat(x);
                y = parseFloat(y);//
                return _this.map.centerAt(new Point(x, y, _this.map.spatialReference));
            };
            /**
             * 设置图层缩放级别
             * @param level
             */
            _this.setLevel = function (level) {
                return _this.map.setLevel(level);
            };
            /**
             * 放大
             */
            _this.levelUp = function () {
                var level = _this.map.getLevel();
                return _this.map.setLevel(++level);
            };
            _this.levelDown = function () {
                var level = _this.map.getLevel();
                return _this.map.setLevel(--level);
            };
            _this.zoomIn = function () {
                mapManager.deactivate();
                _this.map.setMapCursor("default");
                mapManager.activate(MapManager.NAVIGATOR, [Navigation.ZOOM_IN]);
            };
            _this.zoomHome = function(){
                var ext = configManager.getMapOption("extent");
                _this.zoomExtent(ext.xmin ,ext.ymin ,ext.xmax ,ext.ymax);
            };
            _this.zoomOut = function () {
                mapManager.deactivate();
                _this.map.setMapCursor("default");
                mapManager.activate(MapManager.NAVIGATOR, [Navigation.ZOOM_OUT]);
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
            _this.addLayer = function (options) {
                var defaults = {
                    "id": "",
                    "type": "graphic"
                };
                defaults = lang.mixin({}, defaults, options);
                var layer = layerManager.createLayer(defaults);
                _this.map.addLayer(layer);
                return layer;
            };
            _this.createGraphicLayer = function (id, layerOpts) {
                var options = layerOpts ? layerOpts : {};
                options.id = id;
                options.type = "graphic";
                var layer = layerManager.createLayer(options);
                _this.map.addLayer(layer);
                return layer;
            };
            /**
             * 根据属性值删除GraphicsLayer图层内的图形
             * @param options
             *  layerId :图层id , 如果传入空值图层为map.graphics
             *  attributes :属性对象，可以传入多个属性
             */
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
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    layer.setVisibility(visible);
                    return layer;
                }
                eventManager.log(_this.Strings["layerNotLoaded"] + layerId);
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
                mapManager.refreshLayerTipDom();
                mapManager.clearMapLabels();
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
                    "template": "${0}"
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
                            "background": "#fcffd1",
                            "font-family":defaults.fontFamily,
                            "font": {
                                "size": defaults.fontSize,
                                "style":  Font[defaults.fontStyle]
                            },
                            "border": "1px solid #0096ff",
                            "padding": "0.1em 0.3em 0.1em",
                            "border-radius": "3px",
                            "box-shadow": "0 0 0.75em #777777"
                        });
                        var context = parseTemplate(graphic.attributes, defaults.template, fieldName);
                        if (context) {
                            textDiv.innerHTML = context;
                            mapManager.refreshLayerTipDom(textDiv);
                        }
                    } else {
                        _this.map.setMapCursor("default");
                        //_this.map.container.removeChild(mapManager.tipsDom);
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
            //------------------获取地图信息类------------------
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
            /**
             * 返回地图上点击点的坐标
             * @param callback
             */
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
                if(id===_this.map.graphics.id)
                    return _this.map.graphics;
                var layerId = id && id.toUpperCase();
                var layer = _this.map.getLayer(layerId);
                if (layer) {
                    return layer;
                }
                //eventManager.log(Strings["layerNotLoaded"] + layerId);
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
            /**
             * 监听地图加载事件
             * @param callBack
             * @return 返回监听对象
             */
            _this.addMapLoadedEventListener = function (callBack) {
                return _this.addMapEvent("load", callBack);
            };
            /**
             * 监听地图缩放事件
             * @param callBack
             * @return 返回监听对象
             */
            _this.addZoomEventListener = function ( callBack) {
                return _this.addMapEvent("zoom", callBack);
            };
            /**
             * 监听地图显示范围变化事件
             * @param callBack
             * @return 返回监听对象
             */
            _this.addExtentEventListener = function (callBack) {
                return _this.addMapEvent("extent-change", callBack);
            };
            /**
             * 监听鼠标移动事件
             * @param callBack
             * @return 返回监听对象
             */
            _this.addMouseMoveEventListener = function ( callBack) {
                return _this.addMapEvent("mouse-move", callBack);
            };
            /**
             * 添加地图点击事件
             * @param layerId
             * @param callBack
             */
            _this.addLayerClickEventListener = function ( layerId, callBack) {
                if(!layerId || "default" === layerId){
                    return _this.map.graphics.on("click", callBack);
                };
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    return layer.on("click", callBack);
                } else {
                    //eventManager.publishError(_this.Strings["layerNotLoaded"] + layerId);
                }
            };
            /** 添加地图图层显示和隐藏事件监听 **/
            _this.addLayerVisibilityChangeEventListener = function ( layerId, callBack) {
                var layer = _this.getLayerById(layerId);
                if (layer) {
                    return layer.on("visibility-change", callBack);
                }
                eventManager.publishInfo(_this.Strings["layerNotLoaded"] + layerId);
            };
            /**
             * 销毁监听对象
             * @param listener
             */
            _this.removeEventListener = function (listener) {
                return eventManager.destroyEventHandler(listener);
            };
            /**
             *
             * @param layerId
             * @param geoJsonObjArr
             * @param center 是否定位
             */
            _this.addGraphics = function (layerId, geoJsonObjArr, center, flash) {
                var layer = null;
                try {
                    if (layerId) {
                        layerId = layerId.toUpperCase();
                        layer = _this.getLayerById(layerId);
                        if (!layer) {
                            layer = layerManager.createLayer({"id": layerId, "type": "graphic"});
                            _this.map.addLayer(layer);
                        }
                    } else
                        layer = _this.map.graphics;
                    var graphics = [];
                    for (var i = 0; i < geoJsonObjArr.length; i++) {
                        var geoObj = geoJsonObjArr[i];
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
            /**
             * 标绘图片标注
             * @param x
             * @param y
             * @param options
             *  {
             *      url:图标地址，
             *      width:图标显示宽度，
             *      height:图标显示高度，
             *      attributes:图标属性，
             *      layerId:标绘的图层id，为空则默认使用地图graphics图层，不存在则新建该id图层
             *  }
             */
            _this.addPictureGraphic = function ( x, y, options) {
                var defaults = {
                    center: false,
                    flash: true,
                    url: "images/location.png",
                    width: 24,
                    height: 24,
                    attributes: null,
                    layerId: null
                };
                var params = lang.mixin({}, defaults, options);
                var pictureMarkerSymbol = {
                    url: params.url,
                    width: params.width,
                    height: params.height,
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
                var geoJsonObj = {
                    geometry: geometry,
                    attributes: attributes,
                    symbol: pictureMarkerSymbol
                };
                return _this.addGraphics(params.layerId, [geoJsonObj], params.center , params.flash)[0];

            };
            _this.addPointGraphic = function ( x, y, options) {
                var defaults = {
                    "layerId": "",
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
                var geoJsonObj = {
                    geometry: geometryObj,
                    attributes: attributes,
                    symbol: simpleMarkerSymbolObj
                };
                return _this.addGraphics(params.layerId, [geoJsonObj], params.center, params.flash)[0];
            };
            _this.addPolylineGraphic = function ( paths, options) {
                var defaults = {
                    "layerId": "",
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
                var geoJsonObj = {
                    geometry: geometryObj,
                    attributes: attributes,
                    symbol: symbolObj
                };
                return _this.addGraphics(params.layerId, [geoJsonObj], params.center, params.flash)[0];
            };
            _this.addPolygonGraphic = function ( rings, options) {
                var defaults = {
                    "layerId": "",
                    "attributes": null,
                    "center": false,
                    "flash": true,
                    "width": 1,
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
                var geometryObj = {
                    "hasZ": false,
                    "hasM": false,
                    "rings": rings,
                    "spatialReference": {
                        "wkid": _this.map.spatialReference.wkid
                    }
                };
                var attributes = params.attributes;
                var geoJsonObj = {
                    geometry: geometryObj,
                    attributes: attributes,
                    symbol: symbolObj
                };
                return _this.addGraphics(params.layerId, [geoJsonObj], params.center, params.flash);
            };
            _this.addTextGraphic = function( x ,y ,text,options){
                var defaults = {
                    layerId:"",
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
                        "family": params.fontFamily,
                        "size": params.fontSize,
                        "style": "normal",
                        "weight": "bold",
                        "decoration": "none"
                    },
                    "text":text
                };
                var geometryObj = {
                    "x": parseFloat(x),
                    "y": parseFloat(y),
                    "spatialReference": {
                        "wkid": _this.map.spatialReference.wkid
                    }
                };
                var geoJsonObj = {
                    geometry: geometryObj,
                    attributes: null,
                    symbol: symbolObj
                };
                return _this.addGraphics(params.layerId, [geoJsonObj], params.center, params.flash)[0];

            };
            /**
             * 闪动某个对象
             * @param target
             * Graphic对象或是Graphic对象数组，也可以是graphic的属性值，当为属性值的时候options参数必须指定属性名称fieldName
             *
             * @param layerId
             * @param options
             * 默认结构{
                    "repeatCount":5,
                    "delay":500,//ms
                    "fieldName":"OBJECTID",
                    "center":true
                }
             */
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
                    layer.setVisibility(true);
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
                        clearInterval( mapManager._effectTimer);
                        mapManager.removeSvgFilters();
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
                    graphics && beginEffectFilter(graphics);
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
                    if(params.autoClearHighlight === true){
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
                            layer._setFitExtent( ext, params.scale ,params.expand);
                        }else{
                            if (targetGraphics.length > 0 ) {
                                if ( params.center === true) {
                                    doCenter().then(function () {
                                        applyEffect();
                                    });
                                } else {
                                    applyEffect();
                                }
                            } else {
                                eventManager.publishInfo(_this.Strings["invalidFlashData"]);
                            }
                        }
                    }else{
                        //需要绘制并定位高亮图形
                        if( features ){
                            targetGraphics = lang.clone(features);
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
                        for(var j = 0 ; j < targetGraphics.length ;j++){
                            var gra = targetGraphics[j];
                            gra._highlight = true ;
                            gra._targetLayerId = layerId;
                            gra._targetGraphic = features ? features[j] : null;
                            layerManager.highlightlayer.add(gra);
                            //事件处理？
                        }
                        if ( params.center === true ) {
                            doCenter().then(function () {
                                applyEffect( null ,layerManager.highlightlayer);
                            });
                        } else {
                            applyEffect( null,layerManager.highlightlayer);
                        }
                    }
                };
                stopEffect();
                findGraphicTargets(function(features){
                    rendererHighlightGraphics(features);
                });
            };
            /**
             * 根据Draw对象画图形
             * @param drawType
             * @param options
             */
            _this.drawGraphic = function (drawType, options) {
                var defaults = {
                    "drawOnMap": true,
                    "drawLayerId": "drawLayerId",
                    "symbolObject": null,
                    "symbol": null,
                    "attributes": null,
                    "onDrawEnd": null
                };
                defaults = lang.mixin({}, defaults, options);
                mapManager.onDrawEnd = function (e) {
                    mapManager.deactivate(MapManager.DRAW);
                    _this.map.showZoomSlider();
                    _this.map.setMapCursor("default");
                    if (defaults.drawOnMap) {
                        var symbol = defaults.symbol ? defaults.symbol : styleManager.getDefaultSymbolByGeoType(e.geometry.type, defaults.symbolObject);
                        var graphic = new Graphic(e.geometry, symbol);
                        graphic.attributes = defaults.attributes;
                        var layer = _this.getLayerById(defaults.drawLayerId);
                        if (!layer) {
                            layer = _this.map.graphics;
                        }
                        layer.add(graphic);
                    }
                    _fireEventHandler(defaults.onDrawEnd, e);
                };
                mapManager.activate(MapManager.DRAW, [drawType]);
                _this.map.hideZoomSlider();
                _this.map.setMapCursor("crosshair");
            };
            /**
             * 画一个圆
             * @param options
             */
            _this.drawCircle = function (options) {
                _this.drawGraphic(Draw.CIRCLE, options);
            };
            /**
             * 画一条直线
             * @param options
             */
            _this.drawLine = function (options) {
                _this.drawGraphic(Draw.LINE, options);
            };
            /**
             * 画一个面
             * @param options
             */
            _this.drawPolygon = function (options) {
                _this.drawGraphic(Draw.POLYGON, options);
            };
            /**
             * 画一条折线
             * @param options
             */
            _this.drawPolyline = function (options) {
                _this.drawGraphic(Draw.POLYLINE, options);
            };
            /**
             * 测量一条直线的长度
             *
             */
            _this.drawLineAndGetLength = function (callback, options) {
                var defaults = {
                    "labelOffsetX":10,
                    "labelOffsetY":-10,
                    "fontSize": "16px",//标注字体大小
                    "haloSize": 2,//
                    "haloColor": [255, 200, 0],//标注颜色
                    "drawOptions": null,//
                    "labelStyleFunc": function (length) {
                        var label = _this.Strings.measureLengthResultPrefixLabel ;
                        var unit = "";
                        if ( length < 1000 ){
                            unit = _this.Strings.measureLengthUnitMeter;
                            unit = unit ? unit : "m";
                            label = label + length.toFixed(1) + unit;
                        }else{
                            unit = _this.Strings.measureLengthUnitKilometer;
                            unit = unit ? unit : "km";
                            label = label + (length / 1000).toFixed(3) + unit;
                        }
                        return label;
                    },
                    "lengthFormat": function (length) {
                        var unit = "";
                        var value = "";
                        if ( length < 1000 ){
                            unit = _this.Strings.measureLengthUnitMeter;
                            unit = unit ? unit : "m";
                            value = length.toFixed(1);
                        }else{
                            unit = _this.Strings.measureLengthUnitKilometer;
                            unit = unit ? unit : "km";
                            value = (length / 1000).toFixed(3);
                        }
                        return {
                            value: value ,
                            unit: unit
                        };
                    }
                };
                defaults = lang.mixin({}, defaults, options);
                //增加点击监听，计算分段长度
                var measureClickListener = null;
                var measureMouseMoveListener = null;
                var measureEnd = function(){
                    measureClickListener = _this.removeEventListener(measureClickListener);
                    measureMouseMoveListener = _this.removeEventListener(measureMouseMoveListener);
                };
                var measureStart = function(){
                    var segementIndex = 0 ;
                    mapManager.totalMeasureLength = 0 ;
                    mapManager.lengthMeasurePoints = [];
                    mapManager.lengthMeasureResults = [];
                    mapManager.measureLabelOffsetX = defaults.labelOffsetX;
                    mapManager.measureLabelOffsetY = defaults.labelOffsetY;
                    var segementMeasure = function(line ,screentPoint){
                        var p = new LengthsParameters();
                        p.polylines = [line];
                        p.lengthUnit = GeometryService.UNIT_METER;
                        p.geodesic = true;
                        var onResult = function(result){
                            var length = result.lengths[0];
                            onMeasureResult(length ,screentPoint) ;
                        };
                        var onError = function(e){
                            eventManager.publishError(_this.Strings["getDistanceError"], e);
                            onMeasureResult(0,screentPoint) ;
                        };
                        mapManager.geometryService.lengths(p, onResult, onError);
                    };
                    var onMeasureResult = function( re ,screentPoint){
                        mapManager.totalMeasureLength += re ;
                        var textLabel = defaults.labelStyleFunc(mapManager.totalMeasureLength);
                        var label = textLabel.replace(_this.Strings.measureLengthResultPrefixLabel ,"");
                        mapManager.addMeasureLabel(label, screentPoint.x ,screentPoint.y);

                    };
                    var onMeasureMouseMove = function(e){
                        //console.info(e);
                        //设置鼠标跟随标签
                        if(true){

                        }
                    };
                    var onMeasureMapClick = function(e){
                        var point = e.mapPoint ;
                        var screentPoint = e.screenPoint;
                        var index = mapManager.lengthMeasurePoints.length;
                        if( index > 0){
                            var lastPoint =  mapManager.lengthMeasurePoints[index - 1];
                            if(lastPoint.x === point.x && lastPoint.y === point.y){
                                //ie浏览器双击事件会触发两次单击事件
                                return
                            }
                        }
                        mapManager.lengthMeasurePoints.push(point); // 加入测量点

                        if( index=== 0 ) {
                            //设置起点标注
                            mapManager.addMeasureLabel("起点",screentPoint.x  , screentPoint.y );
                            //监听鼠标移动事件，增加鼠标提示标注
                            measureMouseMoveListener = _this.map.on("mouse-move",onMeasureMouseMove);
                            return ;
                        }
                        //创建线段，测量线段长度
                        segementIndex = index - 1 ;
                        var startPoint = mapManager.lengthMeasurePoints[segementIndex];
                        var endPoint = mapManager.lengthMeasurePoints[index];
                        var segement = new Polyline(_this.map.spatialReference);
                        segement.addPath([startPoint,endPoint]);
                        segementMeasure(segement ,screentPoint ) ;
                    };
                    measureClickListener = _this.map.on("click",onMeasureMapClick);
                    return mapManager.beforeMeasureStart();
                };
                var showMeasureResultLabel = function(e){
                    var length = mapManager.totalMeasureLength ;
                    var lengthObj = defaults.lengthFormat(length);
                    var lengthValue = lengthObj.value;
                    var lengthUnit = lengthObj.unit;
                    var label = "总长度：<label class='jasmap_label_stress'>" + lengthValue + "</label>"+ lengthUnit;
                    mapManager.addTotalMeasureLabel(label);
                    //console.info("绘制结束");
                    return
                    // if (geo) {
                    //     var p = new LengthsParameters();
                    //     p.polylines = [geo];
                    //     p.lengthUnit = GeometryService.UNIT_METER;
                    //     p.geodesic = true;
                    //     mapManager.geometryService.lengths(p, function (result) {//绘制结束之后添加长度标签
                    //         _fireEventHandler(callback, result.lengths[0]);
                    //         var path = geo.paths[0];
                    //         var xy = path[path.length - 1];
                    //         var coors = _this.coorsToXY(xy[0], xy[1]);
                    //         var point = new Point(coors[0], coors[1], _this.map.spatialReference);
                    //         var length = result.lengths[0];
                    //         var textLabel = defaults.labelStyleFunc(length);
                    //         var font = new Font(defaults.fontSize, Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
                    //         var symbol = new TextSymbol(textLabel, font);
                    //         symbol.setHaloColor(new Color(defaults.haloColor));
                    //         symbol.setHaloSize(defaults.haloSize);
                    //         var graphic = new Graphic(point, symbol);
                    //         _this.map.graphics.add(graphic);
                    //     }, function (e) {
                    //         eventManager.publishError(Strings["getDistanceError"], e)
                    //     });
                    // }
                };
                var onDrawEnd = function(e){
                    measureEnd();
                    showMeasureResultLabel(e);
                };
                var measureId = measureStart();
                _this.drawPolyline({
                    attributes:{
                        "MEASUREID":measureId
                    },
                    onDrawEnd: onDrawEnd
                });
            };
            /**
             * 测量一个面的面积
             * @param graphicID
             * @param callback
             */
            _this.drawPolygonAndGetArea = function (graphicID, callback) {
                var defaults = {
                    "fontSize": "16px",
                    "haloSize": 2,
                    "haloColor": [255, 200, 0],
                    "labelStyleFunc": function (area) {
                        var label = _this.Strings.measureAreaResultPrefixLabel;
                        var unit = "";
                        if (area >= 0.01) { // km2
                            unit  = _this.Strings.measureAreaUnitSquareKilometer ;
                            unit = unit ? unit : "km²";
                            label = label + area.toFixed(3) +  unit ;
                        } else {
                            unit = _this.Strings.measureAreaUnitSquareMeter ;
                            unit = unit ? unit : "m²";
                            label = label + (area * 1000 * 1000).toFixed(1) + unit;
                        }
                        return label ;
                    }
                };
                _this.drawPolygon({
                    "onDrawEnd": function (e) {
                        var geo = e.geometry;
                        if (geo) {
                            var p = new AreasAndLengthsParameters();
                            p.lengthUnit = GeometryService.UNIT_KILOMETER;
                            p.areaUnit = GeometryService.UNIT_SQUARE_KILOMETERS;
                            p.polygons = [geo];
                            p.calculationType  = "geodesic";
                            mapManager.geometryService.areasAndLengths(p, function (result) {
                                var area = parseFloat(result.areas[0]);
                                var textLabel = defaults.labelStyleFunc(area);
                                if (callback && typeof callback == "function") {
                                    callback(area);
                                }
                                var point = geo.getExtent().getCenter();
                                var font = new Font(defaults.fontSize, Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
                                var symbol = new TextSymbol(textLabel, font);
                                symbol.setHaloColor(new Color(defaults.haloColor));
                                symbol.setHaloSize(defaults.haloSize);
                                var graphic = new Graphic(point, symbol);
                                _this.map.graphics.add(graphic);
                            }, function (e) {
                                eventManager.publishError(_this.Strings["getAreaError"], e)
                            });
                        }
                    }
                });
            };
            _this.startDrawAndEdit = function (tool, options) {//new
                alert("调试中...");
                //var defaults = {
                //    layerId:"drawAndEditLayerId",
                //    onDrawEnd:function(gra){
                //
                //    },
                //    onDrawGraphicClick : function(e){
                //
                //    },
                //    onDrawGraphicDbClick : function(e){
                //
                //    }
                //};
                //var params = lang.mixin({},defaults,options);
                //draw = new Draw(_this.map);
                //_resetDrawAndEditor();
                ////drawLayer = _this.map.graphics;// 画到这个图层上
                //drawLayer = _this.getLayerById(params.layerId);
                //if(!drawLayer){
                //    drawLayer = layerManager.createLayer({id:params.layerId,type:"draw",index:100});
                //    _this.map.addLayer(drawLayer);
                //}
                ////绘制完成
                //onDrawEndHandler = draw.on("draw-end", function(evt){
                //    draw.deactivate();
                //    draw = null;
                //    drawState = false;
                //    _this.map.showZoomSlider();
                //    var symbol;
                //    switch (evt.geometry.type) {
                //        case "point":
                //            if(drawType === "PICTURE"){
                //                if(!currentPictureSymbol)
                //                    currentPictureSymbol = _this.getSymbolByObject({
                //                        "type":"esriPMS",
                //                        "url":"images/plot/pic_government.png",
                //                        "contentType" : "image/png",
                //                        "color" : null,
                //                        "width" : 19.5,
                //                        "height" : 19.5,
                //                        "angle" : 0,
                //                        "xoffset" : 0,
                //                        "yoffset" : 0});
                //                symbol = currentPictureSymbol;
                //            }else if(drawType === "TEXT"){
                //                if(!currentTextSymbol)
                //                    currentTextSymbol = _this.getSymbolByObject({"type":"esriTS","text":"文字"});
                //                symbol = currentTextSymbol;
                //            }else{
                //                symbol = new SimpleMarkerSymbol();
                //            }
                //            break;
                //        case "multipoint":
                //            symbol = new SimpleMarkerSymbol();
                //            break;
                //        case "polyline":
                //            symbol = new SimpleLineSymbol();
                //            break;
                //        default:
                //            symbol = new SimpleFillSymbol();
                //            break;
                //    }
                //    var graphic = new Graphic(evt.geometry,symbol);
                //    _fireEventHandler(params.onDrawEnd,graphic);
                //    drawLayer.add(graphic);
                //    _addEditorEventHandler(drawLayer,params);
                //});
                //drawType = tool;
                //switch(tool){
                //    case 'DELETE':
                //        onDeleteDrawGraphicHander = drawLayer.on('click', function (e) {
                //            drawLayer.remove(e.graphic);
                //            Event.stop(e);
                //        });
                //        break;
                //    case 'PICTURE':
                //    case 'TEXT':
                //        tool = "POINT";
                //    default:
                //        onDeleteDrawGraphicHander =  eventManager.destroyEventHandler (onDeleteDrawGraphicHander);// !
                //        draw.activate(Draw[tool]);drawState = true;
                //}
                //_this.map.hideZoomSlider();
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
            };
            _this.print = function (onSuccess, onFailed) {
                printMap(function (result) {
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
                for (var i = 0; i < optionallayers.length; i++) {
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
                array.forEach(optionallayers, function (v, i) {
                    processOptionallayerOptions(v, function (conf, parent) {
                        if (conf.layerSet && conf.id === layerSetId) {
                            targetLayerSets.push(conf);
                            return;
                        }
                    });
                });
                var targetLayerIds = [];
                switch (targetLayerSets.length) {
                    case 0 :
                        eventManager.publishInfo(Strings.layerSetNotFound);
                        return;
                    case 1 :
                        array.forEach(targetLayerSets, function (v, i) {
                            processOptionallayerOptions(v, function (conf, parent) {
                                if (!conf.layerSet) {
                                    targetLayerIds.push(conf.id);
                                }
                            });
                        });
                        break;
                    default:
                        eventManager.publishInfo(Strings.repeatIdError);
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
                    outFields:["*"]
                };
                var deferredArray = [];
                for(var i = 0 ; i < queryParams .length ; i ++){
                    var q = lang.mixin( {},defaultsQueryParam ,queryParams[i] ) ;
                    var layerId = q.layerId;
                    if( layerId ){
                        var layer = _this.getLayerById(layerId);
                        var query = new Query();
                        query.where = q.where ? q.where : "1=1";
                        query.objectIds = typeof q.featureId !== "string" ?  [ q.featureId ] : q.featureId.split(",");
                        deferredArray.push(layer.queryFeatures(query));
                    }else{
                        var url = q.url ;
                        var task = new QueryTask(url) ;
                        var query = new Query();
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
            _this.queryBufferGraphic = function( geomJson ,distance, options){
                var defaults = {
                    "unitType":"m" ,//或"km"
                    "draw":false,//是否将结果绘制到图层上
                    "layerId":"",//绘制到图层id
                    "layerIndex":10,
                    "attributes":null,
                    //绘制的样式
                    "width": 1,
                    "color": [255, 255, 0, 150],//填充色
                    "style": "solid",
                    "outlineColor": [ 0, 0, 0, 255],
                    "outlineWidth": 1,
                    "outlineStyle": "solid",
                    "callback":null
                };
                var params = lang.mixin(defaults , options);
                var unitType = params.unitType === "m" ? 9001 : 9036; // m : km
                /*
                var geometry  = jsonUtils.fromJson(geomObj);
                var result = geometryEngine.buffer([geometry], [distance], unitType, true);
                */
                var geometry = jsonUtils.fromJson(geomJson);
                var bufferResult = function(bufferedGeometries){
                    if(params.draw !== ""){
                        var layerId = params.layerId;
                        var layer = _this.getLayerById(layerId);
                        if (layerId && !layer) {
                            layer = layerManager.createLayer({"id": layerId, "type": "graphic","index":params.layerIndex });
                            _this.map.addLayer(layer);
                        } else if(!layerId)
                            layer = _this.map.graphics;

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
                container && delete options.container;
                $dom && delete options.$dom;
                var params = commonUtil.extend(defaults , options);
                if($dom){
                    return $dom.dialog(params);
                }
                var inline = options.inline;
                var $dialog = null;
                if(container instanceof Node){
                    $dialog =  $('<div id="map-dialog"/>',container);
                }else if(inline && container === "map"){
                    $dialog =  $('<div id="map-dialog"/>',_this.map.container);
                }else{
                    $dialog = $('<div id="map-dialog"/>');
                }
                return $dialog.dialog(params);
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
            //
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

                }
            };
            function LayerManager() {
                var _class = this;
                _class.basemapsLayersConfig = [];//
                _class.optionallayersConfig = [];
                _class.baseGeodataLayersConfig = [];
                _class.basemaps = null;
                _class.optionallayers = null;
                _class.highlightlayer = null ;//高亮图层
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
                var fireTargetLayerEvent = function(e ,eType){

                    if(e.graphic._highlight){
                        var hg = e.graphic._targetGraphic ? e.graphic._targetGraphic:e.graphic;
                        var layerId = e.graphic._targetLayerId;
                        var layer = _this.getLayerById(layerId);
                        layer && layer.emit( eType ,{ graphic:hg });
                    }
                };
                _class.createOptionalLayer = function (conf) {
                    var layerConfig = {
                        outFields: ["*"],
                        mode: apiDefaults.featureLayerMode,
                        showLabels: true
                    };
                    layerConfig = lang.mixin({}, layerConfig, conf);
                    //
                    if (conf.renderer) {
                        layerConfig.renderer = conf.renderer;
                    }
                    var l = _class.createLayer(layerConfig);
                    if (l) {
                        _this.map.addLayer(l);
                    }
                    if (l && layerConfig.domain && _this.domainMap) {
                        l._domain = layerConfig.domain;
                        // l._onFeatureAdded = function(e){
                        //     var gra = e.graphic;
                        //     var attr = gra.attributes;
                        //     var domain = layerConfig.domain;
                        //     for(var fieldName in domain){
                        //         var domainName = domain[fieldName];
                        //         var codeId = attr[fieldName];
                        //         if(codeId != null){
                        //             var codeName = _this.domainMap[domainName+codeId];
                        //             var domainFieldName = fieldName + "VALUE";
                        //             attr[domainFieldName] = codeName;
                        //         }
                        //     }
                        //     gra.setAttributes(attr);
                        // };
                        // l.on("load",l._onFeatureAdded);
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
                        } else {
                            if ((!url || "" === url ) && (type === 'tile' || type === 'feature' || type === 'flash' || type === 'dynamic'  )) {
                                eventManager.log(Strings["layerUrlNotNull"] + layerConfig.id);
                                return;
                            }
                            switch (type) {
                                case 'tile':
                                    layer = new ArcGISTiledMapServiceLayer(url, options);
                                    break;
                                case 'feature':
                                    layer = new FeatureLayer(url, options);
                                    if (layerConfig.where) {
                                        layer.setDefinitionExpression(layerConfig.where);
                                    }
                                    break;
                                case 'flash':
                                    layer = new FlashLayer(url, options, _this);
                                    if (layerConfig.where) {
                                        layer.setDefinitionExpression(layerConfig.where);
                                    }
                                    break;
                                case 'dynamic':
                                    //
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
                                case "pipeline":
                                    layer = new PipelineLayer({
                                        id: options.id,
                                        visible: options.visible,
                                        url: url,
                                        renderer: options.renderer
                                    });
                                    break;
                                default:
                                    var string = _this.Strings["hasNoLayerTypeError"] + " type=" + type;
                                    eventManager.log(string);
                            }
                            addLayerLoadErrorListener(layer);
                        }
                    } catch (e) {
                        eventManager.publishError(_this.Strings["createLayerError"] + " layerId=" + options.id, e);
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
                _class.startup = function(){
                    eventManager.time(_this.Strings["mapLoading"]);
                    _this.subscribe( _this.Events .ConfigLoadedEvent ,onConfigLoaded);
                    _this.subscribe( _this.Events .MapLoadedEvent ,onMapLoaded);
                    _this.subscribe( _this.Events .ModulesLoadedEvent ,onModuleLoaded);
                };
                //
            };
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
                //
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
                var _createSvgBlurFilter = function (idx) {
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
                _class.geometryService = null;
                _class.printTask = null;
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
                    draw = new Draw(map);
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
                        mapManager.appendSvgFilters();
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
                    setMaxExtent();
                    setInfoWindow();
                    setMaskDiv();
                };
                _class.container = null;
                _class.startup = function () {
                    _this.subscribe( _this.Events .ConfigLoadedEvent ,onConfigLoaded);
                    _this.subscribe( _this.Events .MapLoadedEvent ,onMapLoaded);
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
                _class.tipsDom = null;
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
                _class.appendSvgFilters = function (size) {
                    var count = size ? size : 0;
                    var mapDom = document.getElementById(domId);
                    var svg = mapDom.getElementsByTagName("svg")[0];
                    var defs = svg.getElementsByTagName("defs")[0];
                    if(count === 0){
                        var blurFilter = _createSvgBlurFilter(0);
                        defs.appendChild(blurFilter);
                    }else{
                        for(var i = 1 ; i <= count ;i++){
                            var blurFilter = _createSvgBlurFilter(i);
                            defs.appendChild(blurFilter);
                        }
                    }
                };
                //根据索引号删除filter节点 ，
                _class.removeSvgFilters = function(){
                    var mapDom = document.getElementById(domId);
                    var svg = mapDom.getElementsByTagName("svg")[0];
                    var defs = svg.getElementsByTagName("defs")[0];

                    var filters = defs.getElementsByTagName("filter");
                    for(var i = 1 ; i < filters.length ; i ++){
                        defs.removeChild(filters[i]);
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
                _class.flashTarget = null;
                _class.currentHighlightLayers = {};
                // ---------量测---------
                //var extentChangedListener = null ;
                var paningListener = null ;
                var panEndListener = null ;
                var zoomingListener = null ;
                var zoomEndListener = null ;
                var currentMeasureId = null;
                // jasMap_container 下创建图层覆盖物div ，id='jasmap_mask' ，
                // 覆盖物分成三个子div ,分别存放为隐式标注span 和显式标注span ,class='jasmap_label'
                // 以及图形标注 ,class='jasmap_icon'
                // 图形标注需要监听鼠标拖动事件和缩放事件，动态调整屏幕坐标位置 ，；
                // 显式标注根据图形标注位置动态调整屏幕相对坐标位置；
                // 隐式标注在鼠标拖动事件和缩放事件结束后根据图形标注调整屏幕相对坐标位置；
                var setMaskDiv = function(){
                    var esriMapContainer = document.getElementById("jasMap_container");
                    var jasmapMask = document.createElement("div");
                    var jasmapShowLabel = document.createElement("div");
                    var jasmapHideLabel = document.createElement("div");
                    var jasmapGraphicLabel = document.createElement("div");

                    jasmapMask.id = "jasmap_mask";
                    jasmapMask.className = "jasmap_mask_container";
                    jasmapShowLabel.className = "jasmap_mask_container";
                    jasmapHideLabel.className = "jasmap_mask_container";
                    jasmapGraphicLabel.className = "jasmap_mask_container";

                    jasmapMask.appendChild(jasmapHideLabel);
                    jasmapMask.appendChild(jasmapGraphicLabel);
                    jasmapMask.appendChild(jasmapShowLabel);
                    commonUtil.prependChild(esriMapContainer,jasmapMask);
                    _class.showMaskContainer = jasmapShowLabel;
                    _class.hideMaskContainer = jasmapHideLabel;
                    _class.graphicMaskContainer = jasmapGraphicLabel;
                    //
                };
                var setTotalLabelOffset = function(type ,marginX ,marginY){
                    var size = _class.lengthMeasurePoints.length;
                    var point1 = _class.lengthMeasurePoints[size - 2];
                    var point2 = _class.lengthMeasurePoints[size - 1];
                    var deltyX = point2.x - point1.x ;
                    var deltyY = point2.y - point1.y ;

                    if( deltyX ===0 && deltyY === 0 ){
                        point1 = _class.lengthMeasurePoints[size - 3];
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
                            offset.offsetY = -2 - marginY - 2* Math.abs( _class.measureLabelOffsetY );
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
                    node.id = currentMeasureId;
                    return node;
                };
                var deleteMeatureMasks = function(e){
                    var id = e.target.id;
                    commonUtil.removeChildren(_class.showMaskContainer,id ,"id");
                    commonUtil.removeChildren(_class.hideMaskContainer,id,"id");
                    commonUtil.removeChildren(_class.graphicMaskContainer,id,"id");
                    _this.removeGraphics({
                        attributes:{
                            "MEASUREID":id
                        }
                    })
                };
                _class.showMaskContainer = null ;
                _class.showMaskContainer = null ;
                _class.graphicMaskContainer = null ;
                _class.lengthMeasurePoints = [];
                _class.lengthMeasureResults = [];
                _class.totalMeasureLength = 0;
                _class.measureLabelOffsetX  = 0 ;
                _class.measureLabelOffsetY  = 0 ;
                _class.getMeasureId = function(){
                    return currentMeasureId;
                };
                _class.beforeMeasureStart = function(obj){
                    currentMeasureId = new Date().getTime();
                    if(!paningListener){
                        paningListener = _this.map.on("pan",function(e){
                            _class.refreshMeasureLabelScreenXY(e.delta.x ,e.delta.y);
                        });
                        panEndListener = _this.map.on("pan-end",function(e){
                            //更新标注拖动前位置
                            _class.refreshMeasureLabelScreenXY(e.delta.x ,e.delta.y ,true);
                        });
                    }
                    if(!zoomingListener){
                        zoomingListener = _this.map.on("zoom",function(e){
                            var zoomFactor = e.zoomFactor;
                            var anchor = e.anchor;
                            _class.refreshMeasureLabelScreenXYByFactor(anchor,zoomFactor);

                        });
                        zoomEndListener = _this.map.on("zoom-end",function(e){
                            var zoomFactor = e.zoomFactor;
                            var anchor = e.anchor;
                            _class.refreshMeasureLabelScreenXYByFactor(anchor,zoomFactor,true);
                        });
                    }
                    return currentMeasureId;
                };
                _class.clearMapLabels = function(){
                    if( _class.showMaskContainer){
                        commonUtil.removeChildren(_class.showMaskContainer) ;
                    }
                    if( _class.hideMaskContainer){
                        commonUtil.removeChildren(_class.hideMaskContainer) ;
                    }
                    if( _class.graphicMaskContainer){
                        commonUtil.removeChildren(_class.graphicMaskContainer) ;
                    }
                    zoomEndListener = _this.removeEventListener(zoomEndListener);
                    paningListener = _this.removeEventListener(paningListener);
                    panEndListener = _this.removeEventListener(panEndListener);
                    zoomingListener = _this.removeEventListener(zoomingListener);
                };
                //type == 1 为添加总计删除图标和标注
                _class.addMeasureLabel = function( content ,screenX ,screenY, type ){
                    if(!type ){ //地图图标
                        var label = createMeasureElement("label");
                        label.className = "jasmap_icon jasmap_icon_point";
                        label.style.position = "absolute" ;
                        var top2 = isNaN(screenY)? screenY.replace("px","") :screenY;
                        var left2 = isNaN(screenX)? screenX.replace("px","") :screenX ;
                        label.style.top = top2 +"px" ;
                        label.style.left = left2 +"px" ;
                        label.attributes.lastTop = top2;
                        label.attributes.lastLeft = left2;
                        _class.graphicMaskContainer.appendChild(label);

                    }

                    if(!type || type === 1){ // 普通标注和总计标注
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

                        if(type === 1){
                            //取最后两个点计算方向向量，设置标签 偏移位置 ，删除按钮和总长度偏移量构成直角
                            var offset = setTotalLabelOffset("label", 10 , 10);
                            top += offset.offsetY ;
                            left += offset.offsetX ;
                            span.attributes.offsetX = offset.offsetX ;//把偏移量记录下来
                            span.attributes.offsetY = offset.offsetY;
                        }else{
                            top += _class.measureLabelOffsetY;
                            left += _class.measureLabelOffsetX;
                            span.attributes.offsetX = _class.measureLabelOffsetX ;//把偏移量记录下来
                            span.attributes.offsetY = _class.measureLabelOffsetY;
                        }
                        span.style.top = top +"px" ;
                        span.style.left = left +"px" ;
                        _class.showMaskContainer.appendChild(span);
                    }

                    if( type === 1 ){ //删除图标
                        var label = createMeasureElement("label");
                        label.title = _this.Strings.clearThisLengthMeasure;
                        label.className = "jasmap_label jasmap_icon_delete";
                        label.style.position = "absolute" ;
                        var top3 = isNaN(screenY) ? screenY.replace("px","") :screenY;
                        var left3 = isNaN(screenX) ? screenX.replace("px","") :screenX ;

                        label.attributes.lastY = top3;
                        label.attributes.lastX = left3;

                        var offset = setTotalLabelOffset("icon" , 7, 7);
                        top3 = top3 + offset.offsetY  ;
                        left3 = left3 + offset.offsetX ;
                        label.style.top = top3 +"px" ;
                        label.style.left = left3 +"px" ;
                        label.attributes.offsetX = offset.offsetX;
                        label.attributes.offsetY = offset.offsetY;
                        label.onclick = deleteMeatureMasks;
                        _class.showMaskContainer.appendChild(label);
                    }
                };
                _class.addTotalMeasureLabel = function( content){
                    var screenX = 0 ;
                    var screenY = 0 ;
                    if( _class.showMaskContainer && _class.showMaskContainer.childNodes){
                        var node = commonUtil.removeChild( _class.showMaskContainer,-1 );
                        node && node.attributes && (screenX += node.attributes.lastX) ;
                        node && node.attributes && (screenY += node.attributes.lastY );
                        //console.info(node.attributes.lastX + "--" +node.attributes.lastY)
                    }
                    if(screenX && screenY){
                        _class.addMeasureLabel.call(_class, content ,screenX ,screenY ,1 );
                    }
                };
                //平移
                _class.refreshMeasureLabelScreenXY = function( moveX , moveY ,ifEnd){
                    if( !_class.graphicMaskContainer ){
                        return ;
                    }
                    var labelNodes = _class.graphicMaskContainer.getElementsByClassName("jasmap_icon");
                    var labelNodes2 = _class.showMaskContainer.getElementsByClassName("jasmap_label");
                    var labelNode = null,graphicNode = null,top= 0,left= 0,newTop= 0,newLeft= 0,offsetX=0,offsetY=0,i=0;
                    if( !ifEnd ){
                        //更新图形标注屏幕坐标
                        for(i = 0 ; i < labelNodes.length ;i++){
                            labelNode = labelNodes[i];
                            top = labelNode.attributes.lastTop ;
                            left = labelNode.attributes.lastLeft ;
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
                            top = labelNode.attributes.lastTop ;
                            left = labelNode.attributes.lastLeft ;
                            newTop = top + moveY ;
                            newLeft = left + moveX ;
                            labelNode.attributes.lastTop = newTop  ;
                            labelNode.attributes.lastLeft = newLeft  ;
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
                //缩放
                _class.refreshMeasureLabelScreenXYByFactor = function( anchor ,factor ,ifEnd ){
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
                            top = labelNode.attributes.lastTop ;
                            left = labelNode.attributes.lastLeft ;
                            newTop = top0 -  (top0 - top ) * factor ;
                            newLeft = left0 - (left0 - left ) * factor ;
                            //labelNode.attributes.top = newTop;
                            //labelNode.attributes.left = newLeft;
                            labelNode.style.top = newTop + "px"; // y
                            labelNode.style.left = newLeft + "px";// x
                        }
                        for(i = 0 ; i < labelNodes2.length ;i++){
                            labelNode = labelNodes2[i];
                            top = labelNode.attributes.lastY  ;
                            left = labelNode.attributes.lastX  ;
                            offsetX = labelNode.attributes.offsetX ;
                            offsetY = labelNode.attributes.offsetY ;
                            newTop = top0 -  (top0 - top ) * factor ;
                            newLeft = left0 - (left0 - left ) * factor;
                            labelNode.style.top = parseInt(newTop + offsetY) + "px"; // y
                            labelNode.style.left = parseInt(newLeft + offsetX) + "px";// x
                        }
                    }else{
                        for(i = 0 ; i < labelNodes.length ;i++){
                            labelNode = labelNodes[i];
                            top = labelNode.attributes.lastTop ;
                            left = labelNode.attributes.lastLeft ;
                            newTop = top0 -  (top0 - top ) * factor ;
                            newLeft = left0 - (left0 - left ) * factor ;
                            labelNode.attributes.lastTop = newTop  ;
                            labelNode.attributes.lastLeft = newLeft  ;
                        }
                        for(i = 0 ; i < labelNodes2.length ;i++){
                            labelNode = labelNodes2[i];
                            top = labelNode.attributes.lastY  ;
                            left = labelNode.attributes.lastX  ;
                            offsetX = labelNode.attributes.offsetX ;
                            offsetY = labelNode.attributes.offsetY ;
                            newTop = top0 -  (top0 - top ) * factor ;
                            newLeft = left0 - (left0 - left ) * factor ;
                            labelNode.attributes.lastY = newTop ; // y
                            labelNode.attributes.lastX = newLeft ;// x
                        }
                    }
                };


            };
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
                    //
                    if(configManager.getMapOption("scaleBar") !== false){
                        var scalebar = new Scalebar({
                            map: _this.map,
                            scalebarUnit: "dual"
                        });
                    }

                    //初始化modules
                    loadModules();
                    //modules startup
                    // for (var i = 0; i < modules.length; i++) {
                    //     modules[i].startup();
                    // }
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
                            // if (obj.controller === true) {
                            //     controllerModulesConfig.push(conf);
                            // } else {
                            //     modulesConfig.push(conf);
                            // }
                            _class.modules.push(conf);
                        }
                        //解析controller里的moduleSet
                        // for (i = 0; i < controllerModulesConfig.length; i++) {
                        //     var module = controllerModulesConfig[i];
                        //     for (var j = 0; j < module.moduleSet.length; j++) {
                        //         var mConf = module.moduleSet[j];
                        //         if (mConf.type === "module") {
                        //             var m = getModuleConfigById(mConf.target);
                        //             mConf = lang.mixin(m, mConf);//!
                        //             module.moduleSet[j] = mConf;
                        //         }
                        //     }
                        // }
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
                        //var arr = [].concat(controllerModulesConfig, modulesConfig);
                        // for (var i = 0; i < arr.length; i++) {
                        //     _class.loadModule(arr[i]);
                        // }
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
                    if (conf.class) {
                        var Module = eval(conf.class);
                        Module.prototype = new BaseModule();//
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
            };
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
                                //
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
                        var ti = setInterval(function () {
                            var styles = document.styleSheets;
                            for (var i = 0; i < styles.length; i++) {
                                if (styles[i].href && styles[i].href.substr(styles[i].href.indexOf(url), styles[i].href.length) === url) {
                                    clearInterval(ti);
                                    elementLoaded(url);
                                }
                            }
                        }, 500);
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

            };
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
                _class.startup = function(){

                }
            };
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
                                obj = source[property];
                                if(  isObject(obj) || isArray(obj)  ) {
                                    copy = isObject(obj) ? {} : [];
                                    var extended = _class.extend(copy,obj);
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
                            xmlHttp = arguments.caller;
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
                    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlHttp.send(formData ? formData : null);
                };
                _class.scaleToResolution = function(scale){
                    var espg = _this.map.getView().getProjection().getCode();
                    if(espg==="EPSG:4490" || espg==="EPSG:4326"){
                        return   ( scale * 360 * 0.0254 ) /( 96 * 2 * Math.PI * 6378137);
                    }else {
                        //(espg==="EPSG:3857")
                        //1:scale = 1 : (96 * Resolution / 0.0254)
                        return  scale * 0.0254 / apiDefaults.dpi;
                    }
                };
                _class.resolutionToScale = function(reso){
                    var espg = _this.map.getView().getProjection().getCode();
                    if(espg==="EPSG:4490" || espg==="EPSG:4326"){
                        return  reso * apiDefaults.dpi * 2 * Math.PI * 6378137/(360 * 0.0254);
                    }else {
                        //(espg==="EPSG:3857")
                        //1:scale = 1 : (96 * Resolution / 0.0254)
                        return  reso * apiDefaults.dpi / 0.0254;
                    }
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
                }
                _class.changeUrlArg = function(url, arg, val){
                    var pattern = arg+'=([^&]*)';
                    var replaceText = arg+'='+val;
                    return url.match(pattern) ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url+'&'+replaceText : url+'?'+replaceText);
                };
                _class.launchIntoFullscreen = function(element) {
                    if(element.requestFullscreen){
                        element.requestFullscreen();
                    }
                    else if(element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    }
                    else if(element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    }
                    else if(element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                };
                _class.exitFullscreen = function() {
                    if(document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if(document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if(document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if(document.msExitFullscreen){
                        document.msExitFullscreen();
                    }
                };
                _class.isFullscreen = function(){
                    return document.fullscreenElement    ||
                        document.msFullscreenElement  ||
                        document.mozFullScreenElement ||
                        document.webkitFullscreenElement || false;
                };
                _class.removeChildren = function(parent ,fieldValue ,fieldName ){
                    if(!fieldValue && !fieldName){
                        for (var i = parent.childElementCount - 1;i >=0;i--) {
                            parent.removeChild(parent.childNodes[i]);
                        }
                        return
                    }
                    if(fieldValue ){
                        fieldName =  ( fieldName ? fieldName : "id" );
                        for (var i = parent.childElementCount - 1;i >=0;i--) {
                            var node = parent.childNodes[i];
                            if( node[fieldName] === fieldValue ){
                                parent.removeChild(node) ;
                            }
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
                }
            };

            startup();
        });
    }

})(window);
try{
    eval("mapApiLoaded()");
}catch(e){
    //console.warn(e);
}


