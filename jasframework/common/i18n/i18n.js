/**
 * 
 * 文件描述: 国际化功能js。
 *
 * @author zhangcf
 * @version 1.0
 * 创建时间： 2012-08-30 上午17:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2013-10-12       修改人： yanght
 * 修改内容： 
 **********************************************************************
 */

var controller;
/**
 * 
 * 功能描述：国际化主调函数
 *
 */
function internationalize() {
	var functionnumber = $("#menuid").val();
	if (functionnumber == null || functionnumber.length < 0 || functionnumber == "") {
		functionnumber = getParamter("functionnumber");
	}
	var postUrl = rootPath + "jasframework/I18N/i18n.do?functionnumber=" + functionnumber;
	$.ajax({
		url : postUrl,
		async:false,
		success : function(result) {
			if (result.error) {
			} else if (result) {
				controller = new LanguageController(result.lang, result.titles);
				var palt = $(".paltform-i18n");
				try {
					for ( var i = 0; i < palt.length; i++) {
						var spankey = $(palt[i]).attr("key");
						if (spankey == null || spankey == "" || spankey == undefined) {
							continue;
						}
						var valuestr = controller.language.titles[spankey];
						if (valuestr != null || valuestr != "") {
							$(palt[i]).html(controller.language.titles[spankey]);
						}
					}
				} catch (e) {
				}
			}
		},
		dataType : "json",
		async : false,
		error : function() {
		}
	});
}

function LanguageController(lang, titless) {
	this.language = {
		lang : lang,
		titles : titless
	};
}

/**
 * 
 * 功能描述：根据国际化key 获取当前客户端所使用语言的页面元素text
 * 
 * @param key
 *            国际化key，即：页面元素标签中定义的key属性；
 * @returns
 */
function getLanguageValue(key,defaultval) {
	if (controller) {
		var value = controller.language.titles[key];
		if (value == null || value == "") {
			if(defaultval){
			  return defaultval;	
			}
			return key;
		}
		return value;

	} else {
		if(defaultval){
			  return defaultval;	
		}
		return key;
	}
}

/**
 * 
 * 功能描述：easyUI国际化函数,获取easyui国际化文件
 * 
 */
function easyUI_i18n() {
	var language = top.currentLanguage;
	var path = rootPath + "jasframework/common/lib/easyui/locale/easyui-lang-" + language + ".js";
	$.ajax({
		url : path,
		dataType : "script",
		async : false,
		success : function() {
		}
	});
}
easyUI_i18n();


$(document).ready(function() {
//	jQuery.fn.ready(internationalize);
	internationalize();
});
$(window).bind("load",function(){
	//internationalize();
});