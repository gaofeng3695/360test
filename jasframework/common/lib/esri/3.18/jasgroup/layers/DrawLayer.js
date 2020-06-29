/**
 * Created by kc on 2017/8/4.
 * 标绘类图层，点击要素会弹出要素样式编辑弹出框，
 * 支持SimpleMarkerSymbol、PictureMarkerSymbol、SimpleLineSymbol、SimpleFillSymbol、TextSymbol样式编辑
 */
define([
    "dojo/_base/declare","dojo/parser","dijit/registry","dojo/on",
    "dojo/_base/lang",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "esri/graphicsUtils","dojo/dom-construct","dojo/dom",
    "esri/layers/GraphicsLayer",
    "esri/InfoTemplate","jasgroup/InfoWindow","esri/Color",
    "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/PictureMarkerSymbol","esri/symbols/TextSymbol"
],function (declare,parser,registry,on,lang,
            TabContainer,ContentPane,
            graphicsUtils,domConstruct,dom,GraphicsLayer,InfoTemplate,InfoWindow,Color,
            SimpleFillSymbol , SimpleMarkerSymbol ,SimpleLineSymbol,PictureMarkerSymbol,TextSymbol ) {

    var _dataTemplate =
        '<div data-dojo-type="dijit/layout/ContentPane" title="数据" data-dojo-props="selected:true">' +
        '<table>' +
        '<tr>' +
        '<td><label for="dataName">名称:</label></td>' +
        '<td>' +
        '<input id="dataName" data-dojo-attach-point="dataNameNode" data-dojo-type="dijit/form/TextBox">' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><label for="dataInfo">信息:</label></td>' +
        '<td>' +
        '<textarea id="dataInfo" rows="4" cols="25" data-dojo-type="dijit/form/SimpleTextarea" ></textarea>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><label for="dataRemark">备注:</label></td>' +
        '<td>' +
        '<textarea id="dataRemark" rows="4" cols="25" data-dojo-type="dijit/form/SimpleTextarea" ></textarea>' +
        '</td>' +
        '</tr>' +
        '</table>'+
        '</div>';
    return declare([GraphicsLayer],{
        constructor:function(){
            //定义symbol infoTemplate类型
            this.symbolInfoTemplates = {
                "":""
            };
            this.dataName = "ok";

        },
        _pictureMarkerTemplate:
        '<div class="myInfoWindow">' +
            '<div data-dojo-type="dijit/layout/TabContainer" style="width: 290px;height: 220px;" >'+
                _dataTemplate +
                '<div data-dojo-type="dijit/layout/ContentPane" title="样式" data-dojo-props="">' +
                    '<table>' +
                        '<tr>' +
                            '<td><label for="picture">图标:</label></td>' +
                            '<td>' +
                                '<select id="picture" data-dojo-type="dijit/form/ComboBox" >' +
                                    '<option value="images/plot/pic_government.png" selected>政府</option>' +
                                    '<option value="images/plot/pic_school.png">学校</option>' +
                                    '<option value="images/plot/pic_vehicle.png">车辆</option>' +
                                '</select>' +
                            '</td>' +
                        '</tr>' +
                    '</table>'+
                '</div>'+
            '</div>' +
        '</div>' ,
        _simpleMarkerTemplate:
        '<div class="myInfoWindow">' +
            '<div data-dojo-type="dijit/layout/TabContainer" style="width: 290px;height: 220px;" >'+
                _dataTemplate +
                '<div data-dojo-type="dijit/layout/ContentPane" title="样式" data-dojo-props="">' +
                    '<table>' +
                        '<tr>' +
                            '<td><label for="markerColor">标记颜色:</label></td>' +
                            '<td>' +
                                '<span id="markerColor" data-dojo-attach-point="markerColor" data-dojo-props="" data-dojo-type="dijit/ColorPalette">' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="opacity">透明度:</label></td>' +
                            '<td>' +
                                '<input id="opacity"  data-dojo-type="dijit/form/NumberTextBox" value="1" data-dojo-props="smallDelta:0.1, constraints:{min:0,max:1,places:0}" >' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="size">大小:</label></td>' +
                            '<td>' +
                                '<input id="size" data-dojo-type="dijit/form/NumberSpinner" value="12" data-dojo-props="smallDelta:1, constraints:{min:1,max:100,places:0}" >' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="style">样式:</label></td>' +
                            '<td>' +
                                '<select id="style" data-dojo-type="dijit/form/ComboBox" >' +
                                    '<option value="circle" selected>圆</option>' +
                                    '<option value="cross">十字</option>' +
                                    '<option value="diamond">钻石</option>' +
                                    '<option value="path">路径</option>' +
                                    '<option value="square">方块</option>' +
                                    '<option value="x">X</option>' +
                                '</select>' +
                            '</td>' +
                        '</tr>' +
                    '</table>'+
                '</div>'+
            '</div>' +
        '</div>' ,
        _simpleLineTemplate:
        '<div class="myInfoWindow">' +
            '<div data-dojo-type="dijit/layout/TabContainer" style="width: 290px;height: 220px;" >'+
                _dataTemplate +
               '<div data-dojo-type="dijit/layout/ContentPane" title="样式" data-dojo-props="">' +
                    '<table>' +
                        '<tr>' +
                            '<td><label for="lineColor">线颜色:</label></td>' +
                            '<td>' +
                                '<span id="lineColor" data-dojo-attach-point="lineColor" data-dojo-props="" data-dojo-type="dijit/ColorPalette">' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="opacity">透明度:</label></td>' +
                            '<td>' +
                                '<input id="opacity"  data-dojo-type="dijit/form/NumberTextBox" value="1" data-dojo-props="smallDelta:0.1, constraints:{min:0,max:1,places:0}" >' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="width">线宽:</label></td>' +
                            '<td>' +
                                '<input id="width" data-dojo-type="dijit/form/NumberSpinner" value="12" data-dojo-props="smallDelta:1, constraints:{min:1,max:100,places:0}" >' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="style">线样式:</label></td>' +
                            '<td>' +
                                '<select id="style" data-dojo-type="dijit/form/ComboBox" data-dojo-props="hiddenValue :\'value\'" >' +
                                    '<option value="solid" selected>实线</option>' +
                                    '<option value="dash">虚线</option>' +
                                    '<option value="dashdot">单点虚线</option>' +
                                    '<option value="dashdotdot">双点虚线</option>' +
                                    '<option value="dot">点虚线</option>' +
                                    '<option value="longdash">长虚线</option>' +
                                    '<option value="longdashdot">长点虚线</option>' +
                                    '<option value="null">空</option>' +
                                    '<option value="shortdash">短虚线</option>' +
                                    '<option value="shortdashdot">短点虚线</option>' +
                                    '<option value="shortdashdotdot">短双点虚线</option>' +
                                    '<option value="shortdot">短点</option>' +
                                '</select>' +
                            '</td>' +
                        '</tr>' +
                    '</table>'+
                '</div>'+
            '</div>' +
        '</div>',
        _simpleFillTemplate:
        '<div class="myInfoWindow">' +
            '<div data-dojo-type="dijit/layout/TabContainer" style="width: 290px;height: 220px;" >'+
                _dataTemplate +
                '<div data-dojo-type="dijit/layout/ContentPane" title="样式" data-dojo-props="">' +
                    '<table>' +
                        '<tr>' +
                            '<td><label for="fillColor">填充颜色:</label></td>' +
                            '<td>' +
                            '<span id="fillColor" data-dojo-attach-point="fillColor" data-dojo-props="" data-dojo-type="dijit/ColorPalette">' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="fillOpacity">透明度:</label></td>' +
                            '<td>' +
                            '<input id="fillOpacity"  data-dojo-type="dijit/form/NumberTextBox" value="1" data-dojo-props="smallDelta:0.1, constraints:{min:0,max:1,places:0}" >' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="fillType">填充样式:</label></td>' +
                            '<td>' +
                                '<select id="fillType" data-dojo-type="dijit/form/ComboBox" data-dojo-props="hiddenValue :\'value\'" >' +
                                    '<option value="solid" selected>填充颜色</option>' +
                                    '<option value="null">无填充</option>' +
                                    '<option value="cross">十字</option>' +
                                    '<option value="vertical">？？</option>' +
                                '</select>' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="lineColor">颜色:</label></td>' +
                            '<td>' +
                            '<span id="lineColor" data-dojo-attach-point="lineColor" data-dojo-props="" data-dojo-type="dijit/ColorPalette">' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="opacity">透明度:</label></td>' +
                            '<td>' +
                            '<input id="opacity"  data-dojo-type="dijit/form/NumberTextBox" value="1" data-dojo-props="smallDelta:0.1, constraints:{min:0,max:1,places:0}" >' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="width">线宽:</label></td>' +
                            '<td>' +
                            '<input id="width" data-dojo-type="dijit/form/NumberSpinner" value="12" data-dojo-props="smallDelta:1, constraints:{min:1,max:100,places:0}" >' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td><label for="style">线样式:</label></td>' +
                            '<td>' +
                            '<select id="style" data-dojo-type="dijit/form/ComboBox" data-dojo-props="hiddenValue :\'value\'" >' +
                                '<option value="solid" selected>实线</option>' +
                                '<option value="dash">虚线</option>' +
                                '<option value="dashdot">单点虚线</option>' +
                                '<option value="dashdotdot">双点虚线</option>' +
                                '<option value="dot">点虚线</option>' +
                                '<option value="longdash">长虚线</option>' +
                                '<option value="longdashdot">长点虚线</option>' +
                                '<option value="null">空</option>' +
                                '<option value="shortdash">短虚线</option>' +
                                '<option value="shortdashdot">短点虚线</option>' +
                                '<option value="shortdashdotdot">短双点虚线</option>' +
                                '<option value="shortdot">短点</option>' +
                            '</select>' +
                            '</td>' +
                        '</tr>' +
                    '</table>'+
                '</div>'+
            '</div>' +
        '</div>',
        _textTemplate:
        '<div class="myInfoWindow">' +
        '<div data-dojo-type="dijit/layout/TabContainer" style="width: 290px;height: 220px;" >'+
        _dataTemplate +
        '<div data-dojo-type="dijit/layout/ContentPane" title="样式" data-dojo-props="">' +
        '<table>' +
        '<tr>' +
        '<td><label for="text">文本:</label></td>' +
        '<td>' +
        '<textarea id="text" rows="4" cols="25" data-dojo-type="dijit/form/SimpleTextarea" ></textarea>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><label for="color">颜色:</label></td>' +
        '<td>' +
        '<span id="color" data-dojo-attach-point="color" data-dojo-props="" data-dojo-type="dijit/ColorPalette">' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><label for="size">大小:</label></td>' +
        '<td>' +
        '<input id="size" data-dojo-type="dijit/form/NumberSpinner" value="12" data-dojo-props="smallDelta:1, constraints:{min:1,max:100,places:0}" >' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><label for="style">线样式:</label></td>' +
        '<td>' +
        '<select id="style" data-dojo-type="dijit/form/ComboBox" data-dojo-props="hiddenValue :\'value\'" >' +
        '<option value="solid" selected>实线</option>' +
        '<option value="dash">虚线</option>' +
        '<option value="dashdot">单点虚线</option>' +
        '<option value="dashdotdot">双点虚线</option>' +
        '<option value="dot">点虚线</option>' +
        '<option value="longdash">长虚线</option>' +
        '<option value="longdashdot">长点虚线</option>' +
        '<option value="null">空</option>' +
        '<option value="shortdash">短虚线</option>' +
        '<option value="shortdashdot">短点虚线</option>' +
        '<option value="shortdashdotdot">短双点虚线</option>' +
        '<option value="shortdot">短点</option>' +
        '</select>' +
        '</td>' +
        '</tr>' +
        '</table>'+
        '</div>'+
        '</div>' +
        '</div>',
        // 重构esri/layers/GraphicsLayer方法
        _setMap: function(map, surface) {
            // GraphicsLayer will add its own listener here
            var re = this.inherited(arguments);
            return re ;
        },
        _unsetMap: function() {
            this.inherited(arguments);
        },
        _draw:function(graphic){
            if (!this._map) {
                return;
            }
            this.inherited(arguments);
        },
        onMouseOver :function(e){//
            this.inherited(arguments);//
        },
        onMouseOut :function(e){//
            this.inherited(arguments);//
        },
        onUpdateEnd:function(e) {//
            this.inherited(arguments);
        },
        onClick:function(e){//
            var _layer = this;
            var gra = e.graphic;
            if(!e.graphic.attributes)
                e.graphic.attributes = {};

            var attrs = e.graphic.attributes;
            this._map.infoWindow.onShow = function(e){
                // hide node
                var _infoWind = this;
                var rootNode = _infoWind.domNode;
                var _initDijitValueAndBindEvents = function(){
                    var dataName =  registry.byId("dataName",rootNode);
                    var dataInfo =  registry.byId("dataInfo",rootNode);
                    var dataRemark =  registry.byId("dataRemark",rootNode);
                    if(attrs.name){
                        dataName.setValue(attrs.name);
                    }
                    if(attrs.info){
                        dataInfo.setValue(attrs.info);
                    }
                    if(attrs.remark){
                        dataRemark.setValue(attrs.remark);
                    }
                    on( dataName,"change",function(e){
                        attrs.name = e;
                    });
                    on( dataInfo,"change",function(e){
                        attrs.info = e;
                    });
                    on( dataRemark,"change",function(e){
                        attrs.remark = e;
                    });
                    if(gra.symbol instanceof SimpleMarkerSymbol){
                        var markerColor =  dijit.byId("markerColor",rootNode);
                        var opacity =  dijit.byId("opacity",rootNode);
                        var size =  dijit.byId("size",rootNode);
                        var style =  dijit.byId("style",rootNode);
                        if(gra.symbol.color){

                        }
                        if(gra.symbol.size){
                            size.setValue(gra.symbol.size);
                        }
                        if(gra.symbol.color[3]){
                            opacity.setValue(gra.symbol.color[3]);
                        }
                        if(gra.symbol.style){
                            //style.setValue(gra.symbol.style);
                        }
                        on( markerColor,"change",function(e){
                            gra.symbol.setColor(Color.fromHex(e));
                            _layer.redraw();
                        });
                        on( opacity,"change",function(e){
                            var color = gra.symbol.color;
                            color[3] = e;
                            gra.symbol.setColor(color);
                            _layer.redraw();
                        });
                        on( size,"change",function(e){
                            gra.symbol.setSize(e);
                            _layer.redraw();
                        });
                        on( style,"change",function(e){
                            gra.symbol.setStyle(this.item.value);
                            _layer.redraw();
                        });
                    }
                    else if(gra.symbol instanceof PictureMarkerSymbol){
                        //infoTemplate.setContent(this._simpleMarkerTemplate);
                        var picture =  dijit.byId("picture",rootNode);
                        if(gra.symbol.url){

                        }
                        on( picture ,"change",function(e){
                            gra.symbol.setUrl(this.item.value);
                            _layer.redraw();
                        });
                    }
                    else if(gra.symbol instanceof SimpleLineSymbol){
                        var lineColor =  dijit.byId("lineColor",rootNode);
                        var opacity =  dijit.byId("opacity",rootNode);
                        var width =  dijit.byId("width",rootNode);
                        var style =  dijit.byId("style",rootNode);
                        // init
                        if(gra.symbol.color){

                        }
                        if(gra.symbol.width){
                            width.setValue(gra.symbol.width);
                        }
                        on(lineColor,"change",function(e){
                            gra.symbol.setColor(Color.fromHex(e));
                            _layer.redraw();
                        });
                        on( opacity,"change",function(e){
                            var color = gra.symbol.color;
                            color[3] = e;
                            gra.symbol.setColor(color);
                            _layer.redraw();
                        });
                        on( width,"change",function(e){
                            gra.symbol.setWidth(e);
                            _layer.redraw();
                        });
                        on( style,"change",function(e){
                            gra.symbol.setStyle(this.item.value);
                            _layer.redraw();
                        });
                    }
                    else if(gra.symbol instanceof SimpleFillSymbol){
                        //infoTemplate.setContent(this._simpleMarkerTemplate);
                        var fillColor = dijit.byId("fillColor",rootNode);
                        var fillOpacity = dijit.byId("fillOpacity",rootNode);
                        var fillStyle = dijit.byId("fillStyle",rootNode);
                        var lineColor =  dijit.byId("lineColor",rootNode);
                        var opacity =  dijit.byId("opacity",rootNode);
                        var width =  dijit.byId("width",rootNode);
                        var style =  dijit.byId("style",rootNode);
                        //
                        if(gra.symbol.color){

                        }
                        if(gra.symbol.color[3]){
                            fillOpacity.setValue(gra.symbol.color[3]);
                        }
                        if(gra.symbol.style){

                        }

                        if(gra.symbol.outline.color){

                        }
                        if(gra.symbol.outline.style){

                        }
                        if(gra.symbol.outline.width){
                            width.setValue(gra.symbol.outline.width);
                        }
                        if(gra.symbol.outline.color[3]){
                            opacity.setValue(gra.symbol.outline.color[3]);
                        }



                        on(lineColor,"change",function(e){
                            gra.symbol.outline.setColor(Color.fromHex(e));
                            _layer.redraw();
                        });
                        on( opacity,"change",function(e){
                            var color = gra.symbol.outline.color;
                            color[3] = e;
                            gra.symbol.outline.setColor(color);
                            _layer.redraw();
                        });
                        on( width,"change",function(e){
                            gra.symbol.outline.setWidth(e);
                            _layer.redraw();
                        });
                        on( style,"change",function(e){
                            gra.symbol.outline.setStyle(this.item.value);
                            _layer.redraw();
                        });
                    }
                    else if(gra.symbol instanceof TextSymbol){
                        //infoTemplate.setContent(this._simpleMarkerTemplate);
                        var color =  dijit.byId("color",rootNode);
                        var text =  dijit.byId("text",rootNode);
                        var size =  dijit.byId("size",rootNode);
                        var style =  dijit.byId("style",rootNode);
                        // init
                        if(gra.symbol.color){

                        }
                        if(gra.symbol.font.size){
                            size.setValue(gra.symbol.font.size);
                        }
                        if(gra.symbol.text){
                            text.setValue(gra.symbol.text);
                        }
                        if(gra.symbol.font.style){

                        }
                        on(color,"change",function(e){
                            gra.symbol.setColor(Color.fromHex(e));
                            _layer.redraw();
                        });
                        on( size,"change",function(e){
                            gra.symbol.font.setSize(e);
                            _layer.redraw();
                        });
                        on( text,"change",function(e){
                            gra.symbol.setText(e);
                            _layer.redraw();
                        });
                        on( style,"change",function(e){
                            gra.symbol.font.setStyle(this.item.value);
                            _layer.redraw();
                        });
                    }
                };
                parser.parse(_infoWind.domNode).then(function(instances){
                    //根据 attrs 初始化模板
                    //show node
                    //console.info(_infoWind.dataNameNode);
                    _initDijitValueAndBindEvents();
                });
            };
            this._map.infoWindow.resize(320 ,220);
            this.inherited(arguments);
        },
        onGraphicAdd:function(e){//
            //根据geometry symbolType设置不同的infoTemplate模板
            var infoTemplate = new InfoTemplate();
            infoTemplate.setTitle("标绘设置");
            if(e.symbol instanceof SimpleMarkerSymbol){
                infoTemplate.setContent(this._simpleMarkerTemplate);
            }
            else if(e.symbol instanceof PictureMarkerSymbol){
                infoTemplate.setContent(this._pictureMarkerTemplate);
            }
            else if(e.symbol instanceof SimpleLineSymbol){
                infoTemplate.setContent(this._simpleLineTemplate);
            }
            else if(e.symbol instanceof SimpleFillSymbol){
                infoTemplate.setContent(this._simpleFillTemplate);
            }
            else if(e.symbol instanceof TextSymbol){
                infoTemplate.setContent(this._textTemplate);
            }
            e.setInfoTemplate(infoTemplate);
            this.inherited(arguments);
        }

    });
});