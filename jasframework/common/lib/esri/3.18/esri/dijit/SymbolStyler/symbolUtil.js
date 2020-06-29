// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/dijit/SymbolStyler/symbolUtil",["../../symbol","dojo/Deferred","dojo/dom-construct","dojo/on","dojox/gfx"],function(g,m,h,k,n){var f={_pureOutlineStyles:"x,cross",isPoint:function(a){return f.isType(a,"marker")},isType:function(a,b){return a&&-1<a.type.indexOf(b+"symbol")},isLine:function(a){return f.isType(a,"line")},isPolygon:function(a){return f.isType(a,"fill")},hasPureOutlineStyle:function(a){return a&&-1<f._pureOutlineStyles.indexOf(a.style)},getOutline:function(a){return"simplelinesymbol"===
a.type||"cartographiclinesymbol"===a.type?a:a.outline},cloneSymbol:function(a){return g.jsonUtils.fromJson(a.toJson())},setOutlineWidth:function(a,b){!isNaN(b)&&a&&f.getOutline(a).setWidth(b)},setOutlineStyle:function(a,b){if(b&&a){var c=f.getOutline(a);b=c.color?b:g.SimpleLineSymbol.STYLE_NULL;c.setStyle(b)}},setSize:function(a,b){if(a&&!isNaN(b)){var c=a.width,d=b,e;if(c!=d)if("picturemarkersymbol"===a.type){if(e=a.url,b=f.preserveAspectRatio({dimensions:a,targetDimension:"width",targetSize:d}),
a.setHeight(b.height),a.setWidth(b.width),e&&!("http://"===e||-1===e.indexOf("http://")&&-1===e.indexOf("data:")))if(a.xoffset||a.yoffset)d=a.width,c=d/c,a.setOffset(Math.round(a.xoffset*c),Math.round(a.yoffset*c))}else a.setSize(d)}},getMarkerLength:function(a){return isNaN(a.width)?a.size:a.width},hasColor:function(a){return a&&a.color},setFillColor:function(a,b){a.setColor(b)},setOutlineColor:function(a,b){f.getOutline(a).setColor(b)},renderOnSurface:function(a,b){if(a){var c=80,d=30,e=f.isLine(a),
l=a.outline?1.5*a.outline.width:1;if(e)c=190,d=20;else if("simplemarkersymbol"===a.type)d=c=a.size;else if("picturemarkersymbol"===a.type){if(!a.url||"http://"===a.url||-1===a.url.indexOf("http://")&&-1===a.url.indexOf("https://")&&-1===a.url.indexOf("data:"))return;c=a.width;d=a.height}c=n.createSurface(b,c+l,d+l);d=g.jsonUtils.getShapeDescriptors(a);e&&(d.defaultShape.path="M -90,0 L 90,0 E");e=c.createShape(d.defaultShape).setFill(d.fill).setStroke(d.stroke);d=c.getDimensions();e.applyTransform({dx:0.5*
d.width,dy:0.5*d.height});return c}},preserveAspectRatio:function(a){var b=a.dimensions,c=a.targetSize;return"height"===("height"===a.targetDimension?"height":"width")?{height:c,width:b.width/b.height*c}:{height:b.height/b.width*c,width:c}},toFullLineStyle:function(a){switch(a){case "dot":a=g.SimpleLineSymbol.STYLE_DOT;break;case "dash":a=g.SimpleLineSymbol.STYLE_DASH;break;case "dashdot":a=g.SimpleLineSymbol.STYLE_DASHDOT;break;case "dashdotdot":a=g.SimpleLineSymbol.STYLE_DASHDOTDOT;break;default:a=
g.SimpleLineSymbol.STYLE_SOLID}return a},testImageUrl:function(a){var b=new m,c=h.create("img"),d,e;d=k(c,"load",function(){0===c.width&&0===c.height?b.reject("image has both width and height of 0"):b.resolve({width:c.width,height:c.height})});e=k(c,"error",function(a){b.reject("error ocurred while loading image",a)});c.src=a;b.promise.always(function(){d.remove();e.remove();h.destroy(c)});return b.promise}};return f});