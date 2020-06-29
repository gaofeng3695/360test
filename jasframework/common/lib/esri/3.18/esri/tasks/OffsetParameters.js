// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/tasks/OffsetParameters","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/has ../kernel ../geometry/jsonUtils".split(" "),function(a,c,e,d,f,g,h){a=a(null,{declaredClass:"esri.tasks.OffsetParameters",geometries:null,bevelRatio:null,offsetDistance:null,offsetHow:null,offsetUnit:null,toJson:function(){var a=e.map(this.geometries,function(a){return a.toJson()}),b={};this.geometries&&0<this.geometries.length&&(b.geometries=d.toJson({geometryType:h.getJsonType(this.geometries[0]),
geometries:a}),b.sr=d.toJson(this.geometries[0].spatialReference.toJson()));this.bevelRatio&&(b.bevelRatio=this.bevelRatio);this.offsetDistance&&(b.offsetDistance=this.offsetDistance);this.offsetHow&&(b.offsetHow=this.offsetHow);this.offsetUnit&&(b.offsetUnit=this.offsetUnit);return b}});c.mixin(a,{OFFSET_BEVELLED:"esriGeometryOffsetBevelled",OFFSET_MITERED:"esriGeometryOffsetMitered",OFFSET_ROUNDED:"esriGeometryOffsetRounded"});f("extend-esri")&&c.setObject("tasks.OffsetParameters",a,g);return a});