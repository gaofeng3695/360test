// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/metadata/types/fgdc/idinfo/templates/descript.html":'\x3cdiv data-dojo-attach-point\x3d"containerNode"\x3e\r\n\r\n  \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n    data-dojo-props\x3d"target:\'descript\',label:\'${i18nFgdc.idinfo.descript.caption}\'"\x3e\r\n              \r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n      data-dojo-props\x3d"target:\'abstract\',\r\n        label:\'${i18nFgdc.idinfo.descript.sAbstract}\'"\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/InputTextArea" data-dojo-props\x3d"large:true"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n      data-dojo-props\x3d"target:\'purpose\',\r\n        label:\'${i18nFgdc.idinfo.descript.purpose}\'"\x3e\r\n    \x3c/div\x3e\r\n    \r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n      data-dojo-props\x3d"target:\'supplinf\',minOccurs:0,\r\n        label:\'${i18nFgdc.idinfo.descript.supplinf}\'"\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/InputTextArea"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n          \r\n  \x3c/div\x3e\r\n    \r\n\x3c/div\x3e'}});
define("esri/dijit/metadata/types/fgdc/idinfo/descript","dojo/_base/declare dojo/_base/lang dojo/has ../../../base/Descriptor ../../../form/Element ../../../form/InputTextArea dojo/text!./templates/descript.html ../../../../../kernel".split(" "),function(a,b,c,d,g,h,e,f){a=a(d,{templateString:e});c("extend-esri")&&b.setObject("dijit.metadata.types.fgdc.idinfo.descript",a,f);return a});