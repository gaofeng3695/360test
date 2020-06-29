/**
 *
 */
define([
    "dojo/_base/declare","dojo/on", "dojo/_base/lang",
    "esri/SpatialReference","esri/InfoTemplate","esri/layers/GraphicsLayer",
    "esri/tasks/query", "esri/tasks/QueryTask","esri/graphic",
    "esri/Color","esri/renderers/UniqueValueRenderer","esri/renderers/SimpleRenderer"
],function (declare,on,lang,
            SpatialReference,InfoTemplate,
            GraphicsLayer,Query,QueryTask,Graphic,
            Color,UniqueValueRenderer,SimpleRenderer
) {
    return declare([GraphicsLayer],{
        constructor:function(url,options,api){
            this.options = lang.mixin({},this.optionsDefaults,options);
            this.url = url;
            this.mapApi = api;
            this.renderer = null;
            this.defaultSymbol = null;

            var rendererConfig  = options.renderer;//
            this.defaultSymbol  = this.createSimpleSymbol(rendererConfig.defaultSymbol);
            this.defaultHighlightSymbol = this.createSimpleSymbol(this.options.defaultHighlightSymbol);
            this.createLayerRenderer(rendererConfig);
        },
        optionsDefaults:{
            defaultHighlightSymbol:null,//*
            renderer:{//*
                "infoTemplate":false,
                "field":"Name",
                "type":"simple",
                "defaultSymbol":null,//*
                "values":[]//*
            },
            query:{
                where:"1=1",
                outFields:["*"],
                returnGeometry:true
            }
        },
        createLayerRenderer:function(params){
            var renderer = null;
            switch(params.type){
                case "unique":
                    renderer = new UniqueValueRenderer(this.defaultSymbol, params.field);
                    for(var i = 0 ; i < params.values.length ; i++){
                        var re = params.values[i];
                        var sym = this.createSimpleSymbol(re.symbol);
                        renderer.addValue(re.value, sym);
                    }
                    break;
                default: renderer = new SimpleRenderer(this.defaultSymbol);//simple
            }
            this.renderer = renderer;
        },
        createSimpleSymbol:function(symbolObj){
            //创建渲染样式*

        },
        createGeometry:function(geoObj){
            //*
            return null;
        },
        onGraphicAdd:function(e){

        },
        onMouseOver:function(e){
            var gra = e.graphic;
            gra.symbol = this.defaultHighlightSymbol;
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
            query = lang.mixin({},query,this.options.query);
            queryTask.execute(query,showResults,showErrors);
            function showResults (results) {
                var features = results.features;
                var resultCount = features.length;
                for (var i = 0; i < resultCount; i++) {
                    var feature = features[i];
                    var geo = this.createGeometry(feature.geometry);
                    if(!geo) break;
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