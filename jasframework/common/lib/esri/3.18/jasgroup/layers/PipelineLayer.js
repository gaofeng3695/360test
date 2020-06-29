/**
 * Created by kc on 2017/8/4.
 * 标绘类图层，点击要素会弹出要素样式编辑弹出框，
 * 支持SimpleMarkerSymbol、PictureMarkerSymbol、SimpleLineSymbol、SimpleFillSymbol、TextSymbol样式编辑
 */
define([
    "dojo/_base/declare","dojo/on", "dojo/_base/lang",
    "esri/geometry/Polyline","esri/SpatialReference","esri/InfoTemplate",
    "esri/layers/GraphicsLayer","esri/tasks/query", "esri/tasks/QueryTask","esri/graphic",
    "esri/Color","esri/renderers/UniqueValueRenderer","esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleLineSymbol"
],function (declare,on,lang,
            Polyline,SpatialReference,InfoTemplate,
            GraphicsLayer,Query,QueryTask,Graphic,
            Color,UniqueValueRenderer,SimpleRenderer,SimpleLineSymbol ) {

    return declare([GraphicsLayer],{
        constructor:function(url,options,api){
            this.options = options;
            this.url = url;
            this.mapApi = api;
            var defaultsRenderer = {
                "infoTemplate":true,
                "field":"Name",
                "type":"simple",
                "defaultSymbol":{
                    "type": "esriSLS",
                    "style": "esriSLSSolid",
                    "color": [255,0,0,255],
                    "width": 2
                },
                "values":[
                    {"value":"干线","color":[255, 0, 0, 1]},
                    {"value":"","color":[255, 0, 255, 1]}
                ]
            };
            var rendererConfig  = options.renderer;
            var params = lang.mixin({},defaultsRenderer,rendererConfig);
            this._defaultHightLineSymbol = new SimpleLineSymbol({
                "color": [ 255,0,255,255],
                "width": 3
            });
            if(params.infoTemplate){
                this.infoTemplate = new InfoTemplate("管线基本信息", "<label>线路：</label><label>${" + params.field + "}</label>");
            }
            var defaultSymbol = new SimpleLineSymbol(params.defaultSymbol);
            var renderer = null;
            switch(params.type){
                case "unique":
                    renderer = new UniqueValueRenderer(defaultSymbol, params.field);
                    for(var i = 0 ; i < params.values.length ; i++){
                        var re = params.values[i];
                        renderer.addValue(re.value, new SimpleLineSymbol({"width": 2}).setColor(new Color(re.color)));
                    }
                    break;
                default: renderer = new SimpleRenderer(defaultSymbol);//simple
            }
            this.renderer = renderer;
        },
        onGraphicAdd:function(e){

        },
        onMouseOver:function(e){
            var gra = e.graphic;
            gra.symbol = this._defaultHightLineSymbol;
            gra.draw();
        },
        onMouseOut:function(e){
            var gra = e.graphic;
            gra.symbol = null;
            gra.draw();
        },
        _requestData:function(){
            var _layer = this;
            var queryTask = new QueryTask(_layer.url);
            var query = new Query();
            query.returnGeometry = true;
            query.outFields = ['*'];
            query.where = '1=1';
            queryTask.execute(query,showResults,showErrors);
            function showResults (results) {
                var features = results.features;
                var resultCount = features.length;
                for (var i = 0; i < resultCount; i++) {
                    var feature = features[i];
                    var geo = new Polyline(feature.geometry);
                    var gra = new Graphic(geo);
                    gra.setAttributes(feature.attributes);
                    _layer.add(gra);
                }
            }
            function showErrors(err){
                console.error("加载管线数据出错！");
                console.error(err);
            }
        },
        _setMap:function(map, surface) {
            var re = this.inherited(arguments);
            this._requestData();
            return re ;
        }
    });
});