-/**
 * 扩展featurelayer类
 * Created by kc on 2017/7/12.
 * 功能描述 :
 *  1、具有默认的高亮样式和mouse-over事件；
 *  2、图形定位
 *  由于业务数据是通过featureLayer按照显示范围动态绘制的，当要定位时关联的图形不一定已在地图上绘制，所以有可能要查询一次rest api，默认根据objectid索引查询；
 *  3、动态图标
 *  对定位的目标图形进行动态显示
 *  4、延时加载优化
 *  LastUpdate on 2019/04/02 修改要素查询接口属性名称为小写的情况
 */
define([
    "dojo/_base/declare","dojo/_base/event",
    "dojo/_base/lang",'dojo/promise/all',"dojo/dom-construct",
    "esri/graphic","esri/graphicsUtils", "esri/tasks/query",
    "esri/layers/FeatureLayer",
    "esri/symbols/SimpleFillSymbol"
],function (declare,Event,lang,all,domConstruct,
            Graphic,graphicsUtils,Query ,FeatureLayer,SimpleFillSymbol) {

    return declare( "FlashFeatureLayer",FeatureLayer,{
        constructor :function(url,options,api){
            this._options = options;
            this._mapApi = api;//扩展属性
            this._flashSymbol = null;
            this._flashFilterFunc = null;
            this._highlightFilterFunc = null;
            this._hightlightSymbol = null;
            this.hightlightGraphicIdsObject = null;
            this._highlightLineColor = [ 255,0,255,255 ] ;
            this._highlightFillColor = [ 115,76,45,100 ];
            this._hightlightSymbols = {
                "simpleMarkerSymbol":{
                    "color": this._highlightLineColor,
                    "size": 10,
                    "angle": 0,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriSMS",
                    "style": "esriSMSCircle",
                    "outline": {
                        "color": this._highlightLineColor,
                        "width": 0,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    }
                },
                "pictureMarkerSymbol":{
                    "type" : "esriPMS",
                    "url" : "471E7E31",
                    "imageData" : "iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMNJREFUSIntlcENwyAMRZ+lSMyQFcI8rJA50jWyQuahKzCDT+6h0EuL1BA1iip8Qg/Ex99fYuCkGv5bKK0EcB40YgSE7bnTxsa58LeOnMd0QhwGXkxB3L0w0IDxPaMqpBFxjLMuaSVmRjurWIcRDHxaiWZuEbRcEhpZpSNhE9O81GiMN5E0ZRt2M0iVjshek8UkTQfZy8JqGHYP/rJhODD4T6wehtbB9zD0MPQwlOphaAxD/uPLK7Z8MB5gFet+WKcJPQDx29XkRhqr/AAAAABJRU5ErkJggg==",
                    "contentType" : "image/png",
                    "color" : null,
                    "width" : 19.5,
                    "height" : 19.5,
                    "angle" : 0,
                    "xoffset" : 0,
                    "yoffset" : 0
                },
                "simpleLineSymbol":{
                    "type": "esriSLS",
                    "style": "esriSLSSolid",
                    "color": this._highlightLineColor,
                    "width": 2
                },
                "simpleFillSymbol":{
                    "type": "esriSFS",
                    "style": "esriSFSSolid",
                    "color": this._highlightFillColor,
                    "outline": {
                        "type": "esriSLS",
                        "style": "esriSLSSolid",
                        "color": this._highlightLineColor,
                        "width": 2
                    }
                }
            };
            this.inherited(url,options);
            if(options.flash === true){
                this.onMouseOver = this._onMouseOver;
                this.onMouseOut = this._onMouseOut;
            }
        },
        onClick:function(e){
            var state = this._mapApi.getMapManager().currentMapState;
            if(state === "navigator"){
                this.inherited(arguments);
            }
        },
        onDblClick:function(e){
            var state = this._mapApi.getMapManager().currentMapState;
            if(state === "navigator"){
                this.inherited(arguments);
            }
        },
        _onMouseOver :function(e){
            this.inherited(arguments);
            this._showHighlightGraphic(e.graphic);
        },
        _onMouseOut :function(e){
            this.inherited(arguments);
            e.graphic.setSymbol(null);
            this._holdHighlightSymbol(e.graphic);
        },
        onUpdateEnd :function(e){
            this.inherited(arguments);
            this._flashFilterFunc && this._flashFilterFunc(e);
            //this._highlightFilterFunc && this._highlightFilterFunc(e);
            this._options && this._options.tips && this._mapApi.setLayerTips(this.id,this._options.tips);//设置图层提示
        },
        _holdHighlightSymbol:function(e){
            if(!this.hightlightGraphicIdsObject){
                return
            }
            var objectId = e.attributes["OBJECTID"];
            var f = this.hightlightGraphicIdsObject[objectId];
            if( f ){
                e._beforeSymbol = e.symbol ? e.symbol :null;
                e.setSymbol( this._hightlightSymbol );
            }
        },
        _getHighlightSymbol :function(){//
            return this._hightlightSymbol;
        },
        _setFlashSymbol :function(targets,symbol){
            for(var i = 0 ; i < targets.length ; i++){
                targets[i].setSymbol(symbol);
            }
        },
        _queryTargetGraphic :function(ids,call,fieldName){
            var featureSet = {
                features:[]
            };
            for(var idx = 0 ; idx < ids.length ;idx++ ){
                var t = ids[idx] ;
                if(t instanceof Graphic){
                    featureSet.features.push(t);
                }
            }
            if(featureSet.features.length === ids.length){
                call(featureSet);
                return;
            }
            var query = new Query();
            if(!fieldName || "OBJECTID"===fieldName){
                query.objectIds = ids ;
            }else{
                var where = "";
                for(var i = 0 ; i < ids.length ;i++){
                    where += "'" + ids[i] + "'";
                    if(i !== ids.length -1){
                        where += ",";
                    }
                }
                query.where = fieldName + " in (" + where +")";
            }
            query.outFields = ["*"];
            query.returnGeometry = true;
            this._task.execute(query,function (featureSet) {
                call && call(featureSet);
            },function(err){
                console.error(err);
            });
        },
        _showHighlightGraphic :function(gra) {
            var hSym;
            if (this.renderer.declaredClass === "esri.renderer.UniqueValueRenderer"
                || this.renderer.declaredClass === "esri.renderer.ClassBreaksRenderer"
                || this.renderer.declaredClass === "esri.renderer.SimpleRenderer") {
                //如果配图定义了渲染
                hSym = this._doHighlightSymbol( this.renderer.getSymbol(gra) );
            } else {
                hSym = this._getHighlightSymbol();
            }
            gra.setSymbol( hSym );
        },
        _doFlash : null,
        _doShine : null,
        _findGraphicByObjectIds : function(ids,fieldName){
            var bigField = fieldName || "OBJECTID";
            var littleField = bigField.toLowerCase();

            var targets = [];
            for(var i = 0 ; i < this.graphics.length ; i ++){
                var g = this.graphics[i];
                for(var j = 0 ; j < ids.length ; j++){
                    if(g.attributes[ bigField ] == ids[j] || g.attributes[ littleField ] == ids[j]){
                        targets.push(g);
                    }
                }
            }
            return targets;
        },
        setFlashSymbol : function(symbol){
            this._flashSymbol = symbol;
        },
        _setFitExtent : function(ext ,scale,expand){
            var _layer = this;
            var mapScale = _layer._map.getScale();
            if(ext.xmin === ext.xmax && ext.ymin === ext.ymax){
                var avgX = ext.xmin;
                var avgY = ext.ymin;
                if (_layer.minScale && _layer.maxScale && mapScale < _layer.minScale && mapScale > _layer.maxScale) {
                    avgX = (ext.xmin + ext.xmax ) /2;
                    avgY = (ext.ymin + ext.ymax ) /2;
                }else if (_layer.minScale && mapScale > _layer.minScale) {
                    avgX = (ext.xmin + ext.xmax ) /2;
                    avgY = (ext.ymin + ext.ymax ) /2;
                    _layer._map.setScale(_layer.minScale - 1);
                }else if (_layer.maxScale && mapScale < _layer.maxScale) {
                    avgX = (ext.xmin + ext.xmax ) /2;
                    avgY = (ext.ymin + ext.ymax ) /2;
                    _layer._map.setScale(_layer.maxScale + 1);
                }else{
                    _layer._map.setScale(scale);
                }

                _layer._mapApi.centerAt(avgX,avgY).then(function(){
                    if(_layer.mode === 0){
                        _layer.refresh();
                    }
                });
            }else{
                _layer._map.setExtent(ext.expand(expand)).then(function(){
                    if(_layer.mode === 0){
                        _layer.refresh();
                    }
                });
            }
        },
        _setMap :function( map,surface){
            var re = this.inherited(arguments);
            this._setLayerDefaultHightlightSymbol();
            return re;
        },
        _setLayerDefaultHightlightSymbol :function(){
            var _layer = this;
            var type = this.geometryType;
            var _defaultSymbol = null  ;
            if( this.renderer.defaultSymbol){
                _defaultSymbol = this.renderer.defaultSymbol;
            }else if(this.renderer.symbol){
                _defaultSymbol = this.renderer.symbol;
            }else{
                console.warn("图层" + _layer.id + "配图渲染规则没有设置默认样式，要素高亮和定位可能会出现样式问题！");
            }
            if(_defaultSymbol){
                _layer._hightlightSymbol = this._doHighlightSymbol(_defaultSymbol);
            }
        },
        _doHighlightSymbol :function( _defaultSymbol){
            var _hightSymbol = lang.clone(_defaultSymbol);
            switch(_defaultSymbol.type){
                case "simplemarkersymbol":
                    _hightSymbol.setSize(_defaultSymbol.size + 2);
                    break;
                case "picturemarkersymbol":
                    _hightSymbol.setHeight(_defaultSymbol.height * 1.5);
                    _hightSymbol.setWidth(_defaultSymbol.width * 1.5);
                    break;
                case "simplelinesymbol":
                    var obj = this._hightlightSymbols.simpleLineSymbol;
                    _hightSymbol.setWidth(_defaultSymbol.width + 3);// !
                    _hightSymbol.setColor(obj.color);// !
                    _hightSymbol.setStyle(obj.style);// !
                    break;
                case "picturefillsymbol":;
                case "simplefillsymbol":
                    _hightSymbol = new SimpleFillSymbol(this._hightlightSymbols.simpleFillSymbol);
                    _hightSymbol.outline.setWidth(_defaultSymbol.outline.width + 3);// !!!
                    break;
                default:;
            }
            return _hightSymbol;
        }
    });

});