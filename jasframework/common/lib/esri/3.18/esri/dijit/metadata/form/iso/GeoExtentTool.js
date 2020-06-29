// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/form/iso/GeoExtentTool","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/query dojo/has dijit/registry dojo/dom-construct ../tools/ClickableTool ../tools/GeoExtentDialog ../tools/GeoExtentView ../tools/geoExtentUtil ../../../../kernel".split(" "),function(c,m,w,n,p,q,r,s,t,u,g,v){c=c([s],{postCreate:function(){this.inherited(arguments)},startup:function(){if(!this._started){var a=this.findInputWidget();a&&a.parentXNode&&a.parentXNode.gxeDocument&&a.parentXNode.gxeDocument.isViewOnly&&
setTimeout(m.hitch(this,function(){this._handleRequest(a,!1)}),2E3)}},whenToolClicked:function(a,e){this._handleRequest(e,!0)},_findInputWgt:function(a,e){var b;if((b=n("[data-gxe-path\x3d'"+a+"']",e))&&1===b.length)if(b=q.byNode(b[0]))return b.inputWidget;return null},_findViewSection:function(a){return(a=n(".gxeGeoExtentSection .gxeGeoExtentViewSection",a))&&1===a.length?a[0]:null},_handleRequest:function(a,e){if(a&&a.parentXNode){var b=a.parentXNode.getParentElement();if(b&&(b=b.getParentElement())){var d=
b.gxePath,f=b.domNode,c=this._findInputWgt(d+"/gmd:westBoundLongitude/gco:Decimal",f),h=this._findInputWgt(d+"/gmd:eastBoundLongitude/gco:Decimal",f),k=this._findInputWgt(d+"/gmd:northBoundLatitude/gco:Decimal",f),l=this._findInputWgt(d+"/gmd:southBoundLatitude/gco:Decimal",f);c&&(h&&k&&l)&&(d=null,b.gxeDocument&&b.gxeDocument.isViewOnly?e||(d=this._findViewSection(f))&&new u({gxeDocument:b.gxeDocument,xmin:c.getInputValue(),ymin:l.getInputValue(),xmax:h.getInputValue(),ymax:k.getInputValue()},r.create("div",
{},d)):e&&(b=new t({gxeDocument:b.gxeDocument,xmin:c.getInputValue(),ymin:l.getInputValue(),xmax:h.getInputValue(),ymax:k.getInputValue(),onChange:m.hitch(this,function(a){c.setInputValue(g.formatCoordinate(a.xmin));h.setInputValue(g.formatCoordinate(a.xmax));k.setInputValue(g.formatCoordinate(a.ymax));l.setInputValue(g.formatCoordinate(a.ymin))})}),b.show()))}}}});p("extend-esri")&&m.setObject("dijit.metadata.form.iso.GeoExtentTool",c,v);return c});