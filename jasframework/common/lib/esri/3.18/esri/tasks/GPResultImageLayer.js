// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/tasks/GPResultImageLayer","dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has dojo/io-query ../kernel ../layers/ArcGISDynamicMapServiceLayer".split(" "),function(a,c,g,d,h,e,k){a=a(k,{declaredClass:"esri.tasks._GPResultImageLayer",constructor:function(a,b){b&&(b.imageParameters&&b.imageParameters.extent)&&(this.initialExtent=this.fullExtent=b.imageParameters.extent,this.spatialReference=this.initialExtent.spatialReference);this.getImageUrl=c.hitch(this,this.getImageUrl);this.loaded=
!0;this.onLoad(this)},getImageUrl:function(a,b,d,e){var f=a.spatialReference.wkid;e(this._url.path+"?"+h.objectToQuery(c.mixin(this._params,{f:"image",bbox:g.toJson(a.toJson()),bboxSR:f,imageSR:f,size:b+","+d})))}});d("extend-esri")&&c.setObject("tasks._GPResultImageLayer",a,e);return a});