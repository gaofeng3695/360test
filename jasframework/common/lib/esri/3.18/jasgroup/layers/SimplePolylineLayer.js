/**
 *
 */
define([
    "dojo/_base/declare","dojo/on", "dojo/_base/lang",
    "esri/SpatialReference","esri/InfoTemplate",
    "esri/tasks/query", "esri/tasks/QueryTask","esri/graphic",
    "esri/Color","esri/renderers/UniqueValueRenderer","esri/renderers/SimpleRenderer",
    "jasgroup/layers/SimpleLayer","esri/symbols/SimpleLineSymbol",
    "esri/geometry/Polyline"
],function (declare,on,lang,
            SpatialReference,InfoTemplate,Query,QueryTask,Graphic,
            Color,UniqueValueRenderer,SimpleRenderer,SimpleLayer,
            SimpleLineSymbol
) {
    return declare([SimpleLayer],{
        constructor:function(url,options,api){
            this.inherited(url,options,api);
        },
        optionsDefaults:{
            defaultHighlightSymbol:{
                "type": "esriSLS",
                "style": "esriSLSSolid",
                "color": [ 255,0,255,255 ],
                "width": 3
            },//*
            renderer:{
                "infoTemplate":false,
                "field":"NAME",
                "type":"simple",
                "defaultSymbol":{
                    "type": "esriSLS",
                    "style": "esriSLSSolid",
                    "color": [ 255,0,0,255 ],
                    "width": 3
                },//*
                "values":[] //*
            },
            query:{
                where:"1=1",
                outFields:["*"],
                returnGeometry:true
            }
        },
        createSimpleSymbol:function(symbolObj){
            //创建渲染样式
            return new SimpleLineSymbol(symbolObj);
        },
        createGeometry:function(geoObj){
            //*
            return new Polyline(geoObj);
        }

    });
});