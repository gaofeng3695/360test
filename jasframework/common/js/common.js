/** 
 * @file
 * @author  zhanggf
 * @version 1.0 
 * @desc  系统中公有的js方法
 * @date  2012-08-30 上午17:46:07 
 * @last modified by lizz
 * @last modified time  2017-08-17
 */

// 系统根路径
var rootPath = getRootPath();


/**
 * @desc 页面加载完毕监听，处理某些问题
 */
$(window).bind("load", function() {
	// 解决easyui-combo对象与select对象Backspace导致页面回退问题
	comboBackspaceDisabled();

	setSelectObjWidth();

	// 给html元素添加获取焦点时的样式
	// setTimeout('addFocusCssToHtmlElement()', 200);
	// setTimeout('addFocusCssToHtmlElement()', 500);
	
	changeDatagridHeaderInputCheckedStyle();

	/* 所有的input禁用自动提示 */
	$('input').attr('autocomplete','off');
	
});
$(window).bind("resize", function() {
	setMain_areaHeight();// 设置页面contentArea区域高度
	masterTableChildHeight(); //设置主子表contentArea区域高度
});

/**
 * @desc 页面初始化处理
 */
$(document).ready(function() {
	createSpan();// 给增加了required属性的地方增加必填提示

	setMain_areaHeight();// 设置页面contentArea区域高度

	radiusCompatible();//圆角效果ie兼容性问题

	addFocusCssToHtmlElement();// 给html元素添加获取焦点时的样式

	loadBlankTextJs();// 加载输入框提示信息

	$.ajaxSetup({
		cache : false,
		type: 'POST',
		// 发送请求前触发
		beforeSend : function(xhr, params) {
			if(typeof this.ajaxBeforeSendCallback != 'undefined'){
				this.ajaxBeforeSendCallback();
			}
			if(localStorage.length > 0 && localStorage.getItem("user")){
				var roleId = getParamter("roleId");
				var dataFilterRegulationCode = getParamter("dataFilterRegulationCode");
				if (params.url.indexOf('?') == -1) {
					params.url = params.url + "?loginUserName=" + JSON.parse(localStorage.getItem("user")).loginName +"&token="+ localStorage.getItem("token");// +"&roleId="+roleId+"&dataFilterRegulationCode="+dataFilterRegulationCode;
				} else {
					params.url = params.url + "&loginUserName=" + JSON.parse(localStorage.getItem("user")).loginName +"&token="+ localStorage.getItem("token");// +"&roleId="+roleId+"&dataFilterRegulationCode="+dataFilterRegulationCode;
				}
				var data = params.data ;
				//设置排序字段
				var sort = getParamter("sort",data)||"";
				var order = getParamter("order",data)||"";
				if(sort||order||""){
					params.url = params.url + "&orderBy="+ sort + " "+order;
				}
				//设置分页条件
				var page = getParamter("page",data)||"";
				if(page){
					params.url = params.url + "&pageNo="+ page;
				}
				var rows = getParamter("rows",data)||"";
				if(rows){
					params.url = params.url + "&pageSize="+ rows;
				}
				return true;
			}
		},
        complete : function(xhr, params) {
            if(200 == xhr.status){
                var obj = JSON.parse(xhr.responseText);
                if('402' == obj.code){
                    top.$.messager.alert('提示', obj.msg, 'info',function(){
                        top.location.href= getRootPath()+ "jasframework/login/login.htm"
                    });
                }
            }
        }
	});


	/* 解决关闭按钮拖动卡屏问题 */
	/*$('.panel-tool-close').on('click', function(event){
        alert();
    });*/
});

/**
 * @desc 为非ajax请求url添加token
 * @param url
 * @returns
 */
function addTokenForUrl(url){
	if(localStorage.length == 0){
		return;
	}
	var roleId = getParamter("roleId");
	var dataFilterRegulationCode = getParamter("dataFilterRegulationCode");
	if (url.indexOf('?') == -1) {
		url = url + "?loginUserName=" + JSON.parse(localStorage.getItem("user")).loginName +"&token="+ localStorage.getItem("token") +"&roleId="+roleId+"&dataFilterRegulationCode="+dataFilterRegulationCode;
	} else {
		url = url + "&loginUserName=" + JSON.parse(localStorage.getItem("user")).loginName +"&token="+ localStorage.getItem("token") +"&roleId="+roleId+"&dataFilterRegulationCode="+dataFilterRegulationCode;
	}
	return url;
}

/**
 * linkbutton方法扩展
 * 解决linkbutton组件disable方法无法禁用jQuery绑定事件的问题
 * @param {Object} jq
 */
/*$.extend($.fn.linkbutton.methods, {
    *//**
     * 激活选项（覆盖重写）
     * @param {Object} jq
     *//*
    enable: function(jq){
        return jq.each(function(){
            var state = $.data(this, 'linkbutton');
            if ($(this).hasClass('l-btn-disabled')) {
                var itemData = state._eventsStore;
                //恢复超链接
                if (itemData.href) {
                    $(this).attr("href", itemData.href);
                }
                //回复点击事件
                if (itemData.onclicks) {
                    for (var j = 0; j < itemData.onclicks.length; j++) {
                        $(this).bind('click', itemData.onclicks[j]);
                    }
                }
                //设置target为null，清空存储的事件处理程序
                itemData.target = null;
                itemData.onclicks = [];
                $(this).removeClass('l-btn-disabled');
            }
        });
    },
    *//**
     * 禁用选项（覆盖重写）
     * @param {Object} jq
     *//*
    disable: function(jq){
        return jq.each(function(){
            var state = $.data(this, 'linkbutton');
            if (!state._eventsStore)
                state._eventsStore = {};
            if (!$(this).hasClass('l-btn-disabled')) {
                var eventsStore = {};
                eventsStore.target = this;
                eventsStore.onclicks = [];
                //处理超链接
                var strHref = $(this).attr("href");
                if (strHref) {
                    eventsStore.href = strHref;
                    $(this).attr("href", "javascript:void(0)");
                }
                //处理直接耦合绑定到onclick属性上的事件
                var onclickStr = $(this).attr("onclick");
                if (onclickStr && onclickStr != "") {
                    eventsStore.onclicks[eventsStore.onclicks.length] = new Function(onclickStr);
                    $(this).attr("onclick", "");
                }
                //处理使用jquery绑定的事件
                var eventDatas = $(this).data("events") || $._data(this, 'events');
                if (eventDatas["click"]) {
                    var eventData = eventDatas["click"];
                    for (var i = 0; i < eventData.length; i++) {
                        if (eventData[i].namespace != "menu") {
                            eventsStore.onclicks[eventsStore.onclicks.length] = eventData[i]["handler"];
                            $(this).unbind('click', eventData[i]["handler"]);
                            i--;
                        }
                    }
                }
                state._eventsStore = eventsStore;
                $(this).addClass('l-btn-disabled');
            }
        });
    }
});*/



/**
 * @desc 获取系统根路径
 */
function getRootPath() {
	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	return (localhostPaht + projectName + "/");
}

/**
 * @desc 解决easyui-combo对象与select对象Backspace导致页面回退问题
 */
function comboBackspaceDisabled() {
	jQuery.fn.ready(function() {
		// 解决easyui-combo对象Backspace导致页面回退问题
		$.each($(".combo-text"), function(i, item) {
			var combotextreadOnly = $(item).attr("readOnly");
			if (combotextreadOnly == "readonly") {
				$(item).bind('keydown', function() {
					if (8 == event.keyCode) {
						return false;
					}
				});
			}
		});
		// 解决普通select对象Backspace导致页面回退问题
		$.each($("select"), function(i, item) {
			$(item).bind('keydown', function() {
				if (8 == event.keyCode) {
					return false;
				}
			});
		});
	});
}

/**
 * @desc 圆角效果ie兼容性问题
 */
function radiusCompatible() {
	var browser = $.browser;
	var documentMode = checkDocumentMode();
	//if (browser.msie && documentMode == '9') {
		// 9.0 使用1.CSS
	//} else {
		// 动态添加一个.css 文件
		/*var path = rootPath + "common/css/radius_htc.css";
		loadjscssfile(path, "css");
		
		// 动态添加一个.js 文件
		var path1 = rootPath + "common/js/PIEv1.js";
		loadjscssfile(path1, "js");*/
	//}
}

/**
 * @desc 加载输入框提示信息
 */
function loadBlankTextJs() {
	var path = rootPath + "jasframework/common/lib/other/jquery.inputDefault.js";
	$.getScript(path, function() {
		$('[blankText]').inputDefault();
	});
}

/**
 * @desc 给html元素添加获取焦点时的样式
 */
function addFocusCssToHtmlElement() {
	$("input").not(":checkbox").each(function() {
		$(this).bind('focus', function() {
			// alert('focus');
			if ($(this).hasClass('combo-text')) {
				$(this).parent().addClass('input_bg_focus');
			} else if ($(this).hasClass('Wdate')) {
				$(this).addClass('Wdate_focus');
			} else {
				$(this).addClass('input_bg_focus');
			}
		});
		$(this).bind('blur', function() {
			if ($(this).hasClass('combo-text')) {
				$(this).parent().removeClass('input_bg_focus');
			} else if ($(this).hasClass('Wdate')) {
				$(this).removeClass('Wdate_focus');
			} else {
				$(this).removeClass('input_bg_focus');
			}
		});
	});

	$(" textarea").each(function() {
		$(this).bind('focus', function() {
			// alert('focus');
			$(this).addClass('input_bg_focus');
		});
		$(this).bind('blur', function() {
			// alert('blur');
			$(this).removeClass('input_bg_focus');
		});
	});

	$("select").each(function() {
		$(this).bind('focus', function() {
			// alert('focus');
			$(this).addClass('input_bg_focus');
		});
		$(this).bind('blur', function() {
			// alert('blur');
			$(this).removeClass('input_bg_focus');
		});
	});
}

/**
 * @desc 设置easyui Combo对象的宽度，解决宽度总小于其他input宽度问题
 * 
 * @param comboObjId easyui Combo组件对象id
 * @param width easyui Combo组件对象宽度，相对于页面的百分比宽度，用小数表示，例如0.35表示宽度为页面宽度的35%
 * @param comboObjType easyui Combo组件对象类型，（'combobox'||'combotree'||datetimebox）
 */
function setComboObjWidth(comboObjId, width, comboObjType, containerObjId) {

	setComboObjWidth_private(comboObjId, width, comboObjType, containerObjId);
	var _fn = function() {
		setComboObjWidth_private(comboObjId, width, comboObjType, containerObjId);
	};
	// $(window).bind('resize',_fn);//不能使用该方法
	onWindowResize.add(_fn);// 要使用该方法
}

/**
 * @desc 设置easyui Combo对象的宽度，解决宽度总小于其他input宽度问题， 仅供common.js内部调用，页面请使用setComboObjWidth(comboObjId,width,comboObjType)
 * 
 * @param comboObjId easyui Combo组件对象id
 * @param width easyui Combo组件对象宽度，相对于页面的百分比宽度，用小数表示，例如0.35表示宽度为页面宽度的35%
 * @param comboObjType easyui Combo组件对象类型，（'combobox'||'combotree'||datetimebox）
 * @param containerObjId easyui Combo组件所在容器id(div容器)
 */
function setComboObjWidth_private(comboObjId, width, comboObjType, containerObjId) {
	var containerObjWidth; // Combo对象所在容器的宽度(table)
	if (containerObjId && containerObjId != '') {
		containerObjWidth = $('#' + containerObjId).width();
	
	} else {
		containerObjWidth = document.documentElement.clientWidth;
	}
	var comboObjWidth = containerObjWidth * width;
	if (comboObjId && comboObjId != '') {
		comboObj = $('#' + comboObjId);
		if ('combobox' == comboObjType) {
			comboObj.combobox('resize', comboObjWidth);
		} else if ('combotree' == comboObjType) {
			comboObj.combo('resize', comboObjWidth);
		} else if ('datetimebox' == comboObjType) {
			comboObj.datetimebox('resize', comboObjWidth);
		} else {
			comboObj.combo('resize', comboObjWidth);
		}
//		comboObj.parent().css('padding-right', '3px');
	} else {
		$(".combo").each(function() {
			// $(this).parent().css('padding-right','3px');
		});
	}
}

/**
 * @desc 设置下拉选的宽度，解决下拉选与页面其他input元素不对其问题
 */
function setSelectObjWidth() {
	$("select").each(function() {
//		$(this).parent().css('padding-right', '3px');
	});
}

/**
 * @desc 通过脚本动态添加css和js 文件到页面
 * 
 * @param filename 文件名称（路径）
 * @param filetype 文件类型（css\js）
 */
function loadjscssfile(filename, filetype) {
	// 如果文件类型为 .js ,则创建 script 标签，并设置相应属性
	if (filetype == "js") {
		var fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename);
	}
	// 如果文件类型为 .css ,则创建 script 标签，并设置相应属性
	else if (filetype == "css") {
		var fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
	}
	if (typeof fileref != "undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref);
}

/**
 * @desc 设置页面contentArea区域高度
 */
function setMain_areaHeight() {
	if (document.getElementById('contentArea') != null) {
		var parentNodeInfo = document.getElementById("contentArea").parentNode.nodeName;
		if(parentNodeInfo == "BODY"){
			if($("html").find("div.button-area").length>0 && !$("html").find("div.button-area").is(":hidden")){
				$("#contentArea").css({
					height:document.documentElement.clientHeight-60
				});
			}else{
				$("#contentArea").css({
					height:document.documentElement.clientHeight-20
				});
			}
			}
		}
}
/**
 * @desc 清空表单
 * 
 * @author:zhanggf
 * @param formId 表单id
 * @param text true为清空文本框。false为不清空文本框
 * @param hidden true为清空隐藏域。false为不清空隐藏域
 * @param select true为清空下拉菜单。false为不清空下拉菜单
 * @param textarea true为清空大文本框。false为不清空大文本框
 * @param combotree true为清空下拉树。false为不清空下拉树
 * @param tableId 重新加载表格的id
 */

function clearQueryForm(formId, text, hidden, select, textarea,combotree,tableId) {
	if (typeof $("#" + formId) == undefined) {
		return;
	}
	if (text) {
		$("#" + formId + " input:text").each(function() {
			var isClear = $(this).attr("isClear");
			if (typeof isClear == 'undefined' || isClear == true) {
				$(this).val("");
			}
		});
	}
	if (hidden) {
		$("#" + formId + " input:hidden").each(function() {
			$(this).val("");
		});
	}
	if (select) {
		$("#" + formId + " select").each(function() {
			try{
				$(this).combobox("clear");
			}catch(e){
				$(this).val("");
			}
		});
	}
	if (textarea) {
		$("#" + formId + " textarea").each(function() {
			var isClear = $(this).attr("isClear");
			if (typeof isClear == 'undefined' || isClear == true) {
				$(this).html("");
			}
		});
	}
	
	if (combotree) {
		$("#" + formId + " select").each(function() {
			try{
				$(this).combotree("clear");
			}catch(e){
				$(this).val("");
			}
		});
	}
	
	if(tableId){
		$("#"+tableId).datagrid('options').queryParams=null;
		$("#"+tableId).datagrid('load'); 
	}
}

/**
 * @desc 为添加了required=true的地方添加span
 * 
 */
function createSpan() {
	$(":input").each(function() {
		var reSpan = "<span style='color:red;vertical-align: bottom;margin-right:5px'>&nbsp</span>";
		/*if ($(this).attr("required")) {
			var requiredSpan = "<span style='color:red;vertical-align: bottom;'>*</span>";
			if ($(this).parent().prev().find("span:last").html() != '*')
				$(this).parent().prev().find("span:first").after(requiredSpan);
		} else {
			$(this).parent().prev().find("span:first").after(reSpan);
		}*/
		if ($(this).attr("required")) {
			var requiredSpan = "<span style='color:red;vertical-align: bottom;margin-right:5px'>*</span>";
			if ($(this).parent().prev().find("span:first").html() != '*')
				$(this).parent().prev().find("span:first").before(requiredSpan);
		} else {
			$(this).parent().prev().find("span:first").before(reSpan);
		}
		
	});
}

/** ************************列表查询页面datagrid高度宽度自适应接口--开始********************************* */
var datagridId = '';
var queryPanelId = '';
var queryPanelHeight = 0;
var containerId = '';

/**
 * @desc 初始化datagrid的高度，datagrid高度自适应处理
 * 
 * @param datagridObjId datagrid的id
 * @param queryPanelObjId 查群面板的id 如果没有查询面板 则改id赋值为''
 * @param queryPanelH 查询区域的高度，如果没有查询区域，则改值赋值为'0'
 * @param containerDivId table的父html标签id
 */
function initDatagrigHeight(datagridObjId, queryPanelObjId, queryPanelH, containerDivId) {
	datagridId = datagridObjId;
	queryPanelId = queryPanelObjId;
	queryPanelHeight = parseInt(queryPanelH);
	containerId = containerDivId;
	try {
		var containerHeight = $(window).height();
		var containerWidth = $(window).width();
		
		if (containerId && containerId != '') {
			containerHeight = $("#" + containerId).height();
			containerWidth = $("#" + containerId).width();
		}
		
		if (queryPanelId && queryPanelId != '') {
			$('#' + queryPanelId).panel({
				onOpen:changeDatagrigHeight,
				onExpand : function() {
					changeDatagrigHeight();
				},
				onCollapse : function() {
					changeDatagrigHeight();
				}
			});
		} else {
			setTimeout(function(){
				$('#' + datagridId).datagrid('resize', {
					width : containerWidth,
					height : containerHeight
				});
			},500)
		}
	
		document.body.onresize = changeDatagrigHeight;// 只能用js原生的方法，不能使用jquery的resize方法：$('body').bind('resize',function(){})
	} catch (e) {
	}
}

/**
 * @desc 页面窗口大小改变等情况下的datagrid高度自适应处理函数，common.js内部调用函数。
 */
function changeDatagrigHeight() {
	try {
		var containerHeight = $(window).height();
		var containerWidth = $(window).width();
		
		if (containerId && containerId != '') {
			containerHeight = $("#" + containerId).height();
			containerWidth = $("#" + containerId).width();
		}
		var gridWidth = containerWidth;
		var gridHeight = containerHeight;
		
		if (queryPanelId && queryPanelId != '') {

			$('#' + queryPanelId).panel('resize', {
				width : containerWidth
			});
			gridHeight = containerHeight - $('#' + queryPanelId).panel('panel').height();
		}
		setTimeout(function(){
			$('#' + datagridId).datagrid('resize', {
				width : gridWidth,
				height : gridHeight
			});
		},500)
	} catch (e) {
		// alert(e);
	}
}

/** ************************列表查询页面datagrid高度宽度自适应接口--结束*********************************** */

/**
 * @desc 获取访问路径中某个参数
 * 
 * @param paramName 参数名
 * @param url 指定要截取参数的url（可以为空，如果为空url指向当前页面）
 */
function getParamter(paramName, url) {
	var seachUrl = window.location.search.replace("?", "");
	if (url != null) {
		var index = url.indexOf('?');
		url = url.substr(index + 1);
		seachUrl = url;
	}
	var ss = seachUrl.split("&");
	var paramNameStr = "";
	var paramNameIndex = -1;
	for ( var i = 0; i < ss.length; i++) {
		paramNameIndex = ss[i].indexOf("=");
		paramNameStr = ss[i].substring(0, paramNameIndex);
		if (paramNameStr == paramName) {
			var returnValue = ss[i].substring(paramNameIndex + 1, ss[i].length);
			if (typeof (returnValue) == "undefined") {
				returnValue = "";
			}
			return returnValue;
		}
	}
	return "";
}

/**
 * @desc  解决 lte ie8 & chrome 及其他可能会出现的 原生 window.resize 事件多次执行的 BUG. <methods> add: 添加事件句柄 remove: 删除事件句柄 </methods>
 */
var onWindowResize = function() {
	// 事件队列
	var queue = [], indexOf = Array.prototype.indexOf || function() {
		var i = 0, length = this.length;
		for (; i < length; i++) {
			if (this[i] === arguments[0]) {
				return i;
			}
		}
		return -1;
	};

	var isResizing = {}, // 标记可视区域尺寸状态， 用于消除 lte ie8 / chrome 中
	// window.onresize 事件多次执行的 bug
	lazy = true, // 懒执行标记
	listener = function(e) { // 事件监听器
		var h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight, w = window.innerWidth
				|| (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;

		if (h === isResizing.h && w === isResizing.w) {
			return;
		} else {
			e = e || window.event;
			var i = 0, len = queue.length;
			for (; i < len; i++) {
				queue[i].call(this, e);
			}
			isResizing.h = h, isResizing.w = w;
		}
	};
	return {
		add : function(fn) {
			if (typeof fn === 'function') {
				if (lazy) { // 懒执行
					if (window.addEventListener) {
						window.addEventListener('resize', listener, false);
					} else {
						window.attachEvent('onresize', listener);
					}
					lazy = false;
				}
				queue.push(fn);
			} else {
			}
			return this;
		},
		remove : function(fn) {
			if (typeof fn === 'undefined') {
				queue = [];
			} else if (typeof fn === 'function') {
				var i = indexOf.call(queue, fn);
				if (i > -1) {
					queue.splice(i, 1);
				}
			}
			return this;
		}
	};
}.call(this);

/**
 * @desc 重新加载数据
 * 
 * @param url 网格所在页面url
 * @param elementId 网格id
 */
function reloadData(url, elementId) {
	if(elementId.indexOf("#")!=-1){
		elementId = elementId.substring(1);
	}
	var iframeArray = top.$("iframe");
	var browser = $.browser;
	for ( var i = 0; i < iframeArray.length; i++) {
		if ((iframeArray[i].src && iframeArray[i].src.indexOf(url) != -1)||(iframeArray[i].contentWindow.location.href && iframeArray[i].contentWindow.location.href.indexOf(url) != -1)) {
			if (browser.msie && (document.documentMode == '7')) {// 如果浏览器为ie
				// 且文档模式为ie7，则重新载入页面（因为刷新datagrid会导致datagrid显示不全）
				iframeArray[i].contentWindow.location.reload();
				break;
			} else {
				iframeArray[i].contentWindow.$("#" + elementId).datagrid("reload");
				break;
			}
		}
	}
	try {
		parent.$("#" + elementId).datagrid("reload");
	} catch (e) {

	}
}

/**
 * @desc 查看页面赋值方法
 * 
 * @param url 查看页面加载数据请求路径 如：action.do?id=id
 * @param formid 查看页面表格表单id
 */
function businessView(url, formid) {
	$.getJSON(url + '&r=' + new Date().getTime(), function(item) {
		$("#" + formid + " td > span").each(function() {
			var spanid = $(this).attr("id");
			if (spanid != "undefined" && spanid != "") {
				var property = spanid;
				if (item["" + property + ""] != "undefined" && item["" + property + ""] != 'null') {
					$("#" + spanid).html(item[property]);
				}
			}
		});
	});
}

/**
 * @desc 将按钮状态置为可用
 * 
 * @param buttonid 按钮id
 */
function enableButtion(buttonid) {
	$('#' + buttonid).linkbutton('enable');
}

/**
 * @desc 将按钮状态置为不可用
 * 
 * @param buttonid 按钮id
 */
function disableButtion(buttonid) {
	$('#' + buttonid).linkbutton('disable');
}

/**
 * @desc 判断浏览器类型及版本
 * 
 * @return 浏览器类型和版本号，中间空格隔开，各浏览器命名成请参考方法内部返回值
 */
function checkBrowser() {
	var browser = $.browser;
	if (browser.msie) {
		// alert("这是一个IE浏览器" + browser.version);
		return "IE " + browser.version;
		// alert(document.documentMode);
	} else if (browser.opera) {
		// alert("这是一个opera浏览器");
		return "OPERA " + browser.version;
	} else if (browser.mozilla) {
		// alert("这是一个火狐浏览器");
		return "MOZILLA " + browser.version;
	} else if (browser.safari) {
		// alert("这是一safari浏览器");
		return "SAFARI " + browser.version;
	} else if (browser.chrome) {
		// alert("这是一chrome浏览器"+ browser.version);
		return "CHROME " + browser.version;
	} else {
		// alert("我不知道");
		return "UNKNOW";
	}
}

/**
 * @desc 判断文档模式，只对IE有效，其他浏览器不支持documentMode属性
 * 
 * @return 文档模式，5||6||7||8||9||10
 */
function checkDocumentMode() {
	return document.documentMode;
}

/** ----------------弹出窗口定义开始--------------------------* */

var biframe;// 窗口内容的iframe
var dlgNumber = 1; // 弹出窗口序号1到5
var isMove = false;

/**
 * @desc 页面弹出窗口方法 
 * 
 * param url 弹出窗口要显示的页面（相对路径） 
 * param dialogid 弹出窗口关闭时需要的id 
 * param title 窗口title 
 * param w 窗口宽度 
 * param h 窗口高度 
 * param modal是否为模式窗口，true为是，false为不是 
 * param closable 默认窗口是否处于关闭状态。true 为关闭 
 * 
 * 一般调用方式：parent.getDlg("url","iframeId","title",宽度,高度)
 */

function getDlg(url, dialogid, title, w, h, modal, closable,maximizable,resizable) {
	
	/*console.log(url, dialogid, title, w, h, modal, closable,maximizable,resizable);*/
	if (!modal) {
		modal = false;
	}
	if (closable == null) {
		closable = true;
	}
	if (maximizable == null) {
		maximizable = false;
	}
	if (resizable == null) {
		resizable = false;
	}
	
	if (dlgNumber > 5) {
		$.messager.alert('提示', '最多只能同时存在五个弹出窗口！', 'info');
		dlgNumber == 5;
		return;
	}

	h = h + 30;
	var clientHeight = document.documentElement.clientHeight;
	var clientWidth = document.documentElement.clientWidth;
	if (h > clientHeight) {
		h = clientHeight;
	}
	if (w > clientWidth) {
		w = clientWidth;
	}
	// 弹出窗口div的id
	var dlgid = 'dlgDiv_' + dialogid;
	var dlgDiv = $("#" + dlgid);
	var dlgIframe = $("#iframe_" + dialogid);
	var window_mask = $("#" + dlgid + "-mask");
	if (dlgDiv.length == 0) {
		dlgDiv = $("<div></div>").appendTo("body");
		dlgDiv.attr("id", dlgid);
		dlgDiv.attr("name", "dlgDiv");
		dlgIframe = $("<iframe width=\"100%\" height=\"100%\" src=\"\" frameborder=\"0\"></iframe>").appendTo(dlgDiv);
		dlgIframe.attr("id", "iframe_" + dialogid);
		// 在窗口下面添加一个遮罩层，解决窗口被activie控件遮挡问题
		window_mask = $("<div id=\""
				+ dlgid
				+ "-mask\" class=\"window-maskDiv\" style='position: absolute;top:0;left:0;width:100%;height:100%;background-color:white;opacity:0;'></div>");
//		window_mask.width(w);
//		window_mask.height(h);
		window_mask.appendTo("body");
		dlgNumber++;
	}
	
	// 初始化窗口
	$('#' + dlgid).dialog({
		title : title,
		height : h,
		width : w,
		modal : modal,
		shadow : false,
		closable : closable,
		maximizable:maximizable,
		resizable:resizable,
		onMove : function(left, top) {
			if ($(this).panel('options').reSizing) {
				return;
			}
			var parentObj = $(this).panel('panel').parent();
			var width = $(this).panel('options').width;
			var height = $(this).panel('options').height;
			var right = left + width;
			var buttom = top + height;
			var parentWidth = parentObj.width();
			var parentHeight = parentObj.height();

			if (left < 0) {
				left = 0;
				$(this).panel('move', {
					left : 0
				});
			}
			if (top < 0) {
				top = 0;
				$(this).panel('move', {
					top : 0
				});
			}

			if (parentObj.css("overflow") == "hidden") {
				var inline = $.data(this, "window").options.inline;
				if (inline == false) {
					parentObj = $(window);
				}
				if (left > parentObj.width() - width) {
					left = parentObj.width() - width;
					$(this).panel('move', {
						"left" : parentObj.width() - width
					});
				}
				if (top > parentObj.height() - height) {
					top = parentObj.height() - height;
					$(this).panel('move', {
						"top" : parentObj.height() - height
					});
				}
			}
//			window_mask.css('left', left);
//			window_mask.css('top', top);
		},
		onClose : function() {
			$('#' + dlgid).dialog('destroy');
			$('#' + dlgid).attr("closeFlag", "");
			window_mask.remove();
			dlgNumber = dlgNumber - 1;
		},
		onResize:function(width, height){
//			var left = $(this).panel('options').left;
//			var top = $(this).panel('options').top;
//			window_mask.css('left', left);
//			window_mask.css('top', top);
//			window_mask.css('width', width);
//			window_mask.css('height', height);
		},
		onMinimize : function() {
			window_mask.css('display', 'none');
		},
		onOpen : function() {
			window_mask.css('display', 'block');
			var window_z_index = $(this).panel("panel").css('z-index');
			window_mask.css('z-index', window_z_index - 1);
		}
	});
	// 为属性closeFlag赋值
	$('#' + dlgid).attr("closeFlag", dialogid);
	dlgIframe[0].contentWindow.location.href = url;
	//拖动时给内容块的iframe加遮罩层
	// var tempMask = $("<div style='position: absolute;top:0;left:0;width:100%;height:100%;background-color:white;opacity:0;'></div>");
	var tempMask = $("<div></div>");
	$( ".ui-draggable" ).on( "dragstart", function( event, ui ) {
		tempMask.appendTo(this);
	} ).on( "dragstop", function( event, ui ) {
		tempMask.remove();
	} );
}

/**
 * @desc 关闭弹出窗口 调用demo：parent.getDlg("iframeId");或者top.getDlg("iframeId");
 */
function closeDlg(dialogid) {
	var dlgid = 'dlgDiv_' + dialogid;
	var dlgDiv = $("#" + dlgid);
	if (dlgDiv.length != 0) {
		dlgDiv.dialog('close');
	}
}

/**
 * @desc 隐藏所有已弹出的窗口
 */
function hideDlg(dialogid) {
	if (dialogid) {
		var dlgid = 'dlgDiv_' + dialogid;
		var dlgDiv = $("#" + dlgid);
		if (dlgDiv.length != 0) {
			dlgDiv.dialog('minimize');
		}
	} else {
		var dlgDivArray = $("div[name='dlgDiv']");
		$.each(dlgDivArray, function(i) {
			if ($(this).attr("closeFlag") != '') {
				$(this).dialog('minimize');
			}
		});
	}

}

/**
 * @desc 显示所有存在但是未显示的窗口
 */
function showDlg(dialogid) {
	if (dialogid) {
		var dlgid = 'dlgDiv_' + dialogid;
		var dlgDiv = $("#" + dlgid);
		if (dlgDiv.length != 0) {
			dlgDiv.dialog('open');
		}
	} else {
		var dlgDivArray = $("div[name='dlgDiv']");
		$.each(dlgDivArray, function(i) {
			if ($(this).attr("closeFlag") != '') {
				$(this).dialog('open');
			}
		});
	}
}
/** ---------------------弹出窗口定义结束--------------------------- */

/**
 * @desc 提示信息窗口 
 * @param title 提示信息窗口标题 
 * @param msg 提示信息内容
 * @param type 提示窗口类型（error,info,question,warning），一般操作错误信息使用error，操作结果提示信息使用info，页面校验错误信息可以使用warning
 * @param callbackFn 提示窗口关闭时的回调函数。
 */
function showAlert(title, msg, type, callbackFn) {
	$.messager.alert(title, msg, type, callbackFn);
}



/**
 * @desc datagrid选择属性下拉菜单
 * 
 * @param datagrid datagrid的jquery对象
 */
function createColumnMenu(datagrid) {
	var menuid=datagrid[0].id+"_menu";
	var tmenu = $("<div id='"+menuid+"' style='width:100px;'></div>").appendTo('body');
	var fields = datagrid.datagrid('getColumnFields');
	for ( var i = 0; i < fields.length; i++) {
		if (fields[i] == "ck") {
			continue;
		}
		var text = $("td[field='" + fields[i] + "']").children(".datagrid-cell").children().first().html();
		if (!datagrid.datagrid('getColumnOption', fields[i]).hidden) {
			$('<div iconCls="icon-ok" id="1' + fields[i] + '"/>').html(text).appendTo(tmenu);
		} else {
			$('<div id="1' + fields[i] + '"/>').html(text).appendTo(tmenu);
		}
	}
	tmenu.menu({
		onClick : function(item) {
			if (item.iconCls == 'icon-ok') {
				datagrid.datagrid('hideColumn', item.id.substring(1));
				tmenu.menu('setIcon', {
					target : item.target,
					iconCls : 'icon-empty'
				});
			} else {
				datagrid.datagrid('showColumn', item.id.substring(1));
				tmenu.menu('setIcon', {
					target : item.target,
					iconCls : 'icon-ok'
				});
			}
		}
	});
}


/**
 * @desc 显示正在加载数据提示，页面要进行异步提交数据请求之前调用
 * 
 * @param message 提示信息内容，可以为空，如果为空则取默认值为“正在处理，请稍候。。。”
 */
function showLoadingMessage(message) {
	var msg = null;
	if (!document.getElementById("load-mask")) {
		$("<div id=\"load-mask\" class=\"datagrid-mask\"></div>").css({
			width : "100%",
			height : $(window).height()
		}).appendTo("body");
		msg = $("<div id=\"load-mask-msg\" class=\"datagrid-mask-msg\"></div>").appendTo("body");
	}
	if (message) {
		$('#load-mask-msg').html(message);
	}else{
		$('#load-mask-msg').html("正在处理，请稍候。。。");
	}
	if(isNull(msg)){
		msg = $(".datagrid-mask-msg");
	}
	msg.css("left",($(document.body).outerWidth()-msg._outerWidth())/2);
	$('#load-mask').css('display', 'block');
	$('#load-mask-msg').css('display', 'block');
}

/**
 * @desc 隐藏正在加载数据提示，页面进行异步提交数据得到返回值时调用
 */
function hiddenLoadingMessage() {
	$('#load-mask').css('display', 'none');
	$('#load-mask-msg').css('display', 'none');
}


/**
 * 主页面的查询方法，重载datagrid
 * @param {Object} queryformID 查询form表单的id
 * @param {Object} datagridID 需要重载的datagrid的id
 */

function queryDatagrid(queryformID,datagridID){
	querySerialize =$('#'+queryformID).serializeToJson();
	
	encodeURI(querySerialize);
	querySerialize.pageNumber = 1;
	$('#'+datagridID).datagrid('options').queryParams= querySerialize;
	$('#'+datagridID).datagrid('load');
}

/**
 * @desc 针对表单提交时，表单中数据字段过多，将from表单的字段与属性转化成json
 *  转化成json后，按照正常post数据提交。
 */

$.fn.serializeToJson = function () {  
    var o = {};  
    var a = this.serializeArray();  
    $.each(a, function () {  
        if (o[this.name]) {  
            if (!o[this.name].push) {  
                o[this.name] = [o[this.name]];  
            }  
            o[this.name].push(this.value.trim() || '');  
        } else {  
            o[this.name] = this.value.trim() || '';  
        }  
    });  
    return o;  
};


/**
 * @desc 获取主子表tab切换的内容元素高度
 */
function masterTableChildHeight(){
	
	if (document.getElementById('tabContainer') != null) {
		$("#tabContainer").tabs("resize",{
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		});
	
		var tabsPanelsHeight = $(".master-table .easyui-tabs").height()-$(".master-table .tabs-header").outerHeight(),
			tabsPanelsPaddingTop = parseInt($(".tabs-panels").css("padding-top")),
			tabsPanelsPaddingBottom = parseInt($(".tabs-panels").css("padding-bottom"));
		$(".tabs-panels").height(tabsPanelsHeight-tabsPanelsPaddingTop-tabsPanelsPaddingBottom);
		$("#contentArea").height($(".tabs-panels").height()-70);
		$(".tabs-panels .panel-body").height($(".tabs-panels").height());
	}
}


/**
 * @desc  判断是否非空
 * @param {String} param 
 */
function isNull(param) {
    if (param == "" || param == null || param == undefined) {
        return true;
    } else {
        return false;
    }
}

/**
 * @desc 获取url所在页面的对象
 * @param url 页面url
 */
function getDcumentObject(url) {
	var parentObj = "";
    var search = function (iframes) {
        for (var n = 0; n < iframes.length; n++) {
            if (iframes[n].frames.length > 0) {
                search(iframes[n].frames);
            }
            if ((iframes[n].frameElement.src && iframes[n].frameElement.src.indexOf(url) != -1)||(iframes[n].frameElement.contentWindow.location.href && iframes[n].frameElement.contentWindow.location.href.indexOf(url) != -1)) {
				parentObj = iframes[n];
				break;
		    }
        }
    };
    search(window.top.frames);
    return parentObj;
}

/**
 * @desc 获取地图frame对象
 * @param fId
 */
var getApiByIframeId = function(fId ,apiName){
    if(!apiName){
        apiName = "mapApi";
    }
    var ifrWindow = top.frames[fId].contentWindow;
    if(!ifrWindow){//for ie
        ifrWindow = top.frames[fId].window;
    }
    return ifrWindow[apiName];
};



/**
 * @desc JS日期格式化转换方法
 * @param fmt 日期时间的格式
 * 
 * 调用方法
 * 	  获取当前时间  var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");  console.log(time1);  // 2017-12-08  11:55:30
 *    将指定的日期转换为"年月日"的格式  
     		var oldTime = (new Date("2012/12/25 20:11:11")).getTime();
    		var curTime = new Date(oldTime).format("yyyy-MM-dd");
    		console.log(curTime);  // 2012-12-25
 *    将 "时间戳" 转换为 "年月日" 的格式	
 			var da = 1402233166999;
    			da = new Date(da);
    		var year = da.getFullYear()+'年';
    		var month = da.getMonth()+1+'月';
    		var date = da.getDate()+'日';
    		console.log([year,month,date].join('-'));  // 2014年-6月-8日
 * 详情参考  https://www.cnblogs.com/tugenhua0707/p/3776808.html
 */
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
};


/**
 * @desc  默认datagrid属性定义
 */

(function() {
	if($.fn.datagrid!=null){
		$.extend($.fn.datagrid.defaults, {
			pageSize : 10,
			pageList : [ 5, 10, 15, 20, 50 ],
			striped : true,
			pagination : true,
			rownumbers : true,
			singleSelect : false,
			nowrap : true,
			toolbar : "#toolbar",
			onLoadSuccess1 : function(data) {  // 为了防止单个页面与这里默认的权限处理相覆盖，这里调用onLoadSuccess1, 并扩展源代码 调用onLoadSuccess1
				$(this).datagrid('clearSelections'); // clear selected options
				if(typeof getDataPrivilege != 'undefined'){
					getDataPrivilege();
				}
				$(".tip").tooltip({
		    		onShow:function(){
		    			$(this).tooltip('tip').css("boxShadow","1px 1px 3px #292929")
		    		}
		    	})
			},
			onHeaderContextMenu : function(e, field) {
				e.preventDefault();
				var menuid=$(this)[0].id+"_menu";
				if (!$('#'+menuid).length) {
					
					createColumnMenu($(this));
				}
				$('#'+menuid).menu('show', {
					left : e.pageX,
					top : e.pageY
				});
			}
		});
	}
})(jQuery);




/**
 * @desc 参照input 设置easyui Combo对象的宽度
 * 
 * @param comboObjId easyui Combo组件对象id
 * @param referenceObjId 参照对象id
 * @param comboObjType easyui Combo组件对象类型，（'combobox'||'combotree'||datetimebox）
 */
function setComboObjReferenceInput(comboObjId, referenceObjId, comboObjType) {

	setComboObjReferenceInput_private(comboObjId, referenceObjId, comboObjType);
	var _fn = function() {
		setComboObjReferenceInput_private(comboObjId, referenceObjId, comboObjType);
	};
	// $(window).bind('resize',_fn);//不能使用该方法
	onWindowResize.add(_fn);// 要使用该方法
}

/**
 * @desc 参照input 设置easyui Combo对象的宽度
 * @param comboObjId easyui Combo组件对象id
 * @param referenceObjId 参照对象id
 * @param comboObjType easyui Combo组件对象类型，（'combobox'||'combotree'||datetimebox）
 */
function setComboObjReferenceInput_private(comboObjId, referenceObjId, comboObjType) {
	if (comboObjId && comboObjId != ''&&referenceObjId && referenceObjId != '') {
		var comboObjWidth=$("#"+referenceObjId).width();
		var comboObj = $('#' + comboObjId);
		if ('combobox' == comboObjType) {
			comboObj.combobox('resize', comboObjWidth);
		} else if ('combotree' == comboObjType) {
			comboObj.combo('resize', comboObjWidth);
		} else if ('datetimebox' == comboObjType) {
			comboObj.datetimebox('resize', comboObjWidth);
		} else {
			comboObj.combo('resize', comboObjWidth);
		}
	} else {
		$(".combo").each(function() {
			// $(this).parent().css('padding-right','3px');
		});
	}
}

/**
 * @desc 修改datagrid table 头部input全选的样式
 */
function changeDatagridHeaderInputCheckedStyle(){
	var datagridHeaderCheck = $(".datagrid .datagrid-view1 .datagrid-header .datagrid-header-inner").find(".datagrid-header-check input");
	if(datagridHeaderCheck.length==1){
		$(datagridHeaderCheck).on("click",function(){
			if($(this).is(":checked")){
				$(this).addClass("datagrid-header-check-check")
			}else{
				$(this).removeClass("datagrid-header-check-check")
			}
		})
		
	}
}


/**
 * @desc  地图定位
 */

function GPSMap(locationData){
	var data = locationData?locationData:"";
	if(typeof showmap2d != 'undefined'){
		showmap2dAndLocation(data);
	}else{
		top.showmap2dAndLocation(data);
	}
}

/**
 * 根据业务数据获取历史记录
 * @param businessid 业务数据ID
 * @param containerId 容器ID
 * @returns
 */
function addBusinessHistoryRecords(businessid,containerId){
	//$('<fieldset id="actionbox" class="actionbox"><legend style="font-size:14px;font-weight:bold;margin-bottom:0px;"><i class="icon-time"></i>历史记录</legend></fieldset>').appendTo($('#'+containerId));
	$('<fieldset id="actionbox" class="actionbox"></fieldset>').appendTo($('#'+containerId));
	var historyItems = [];
	$.ajax({
		url:rootPath+"log/business/getList.do?pageNo=-1",
		dataType:"json",
		data:{businessId:businessid},
		async:false,
		success:function(result){
			historyItems=result.rows;
		}
	});
	var content = '<ol id="historyItem">';
	for(var i=0;i<historyItems.length;i++){
		var item = historyItems[i];
		content+='<li value="'+(i+1)+'">';
		content+='<span class="item">'+item.createTime+', 由 <strong>'+item.createUserName+'</strong> '+item.optType+'。</span>';
		if(item.detail){
			content+='<span><a id="switchButton'+(i+1)+'" class="switch-btn btn-icon" onclick="switchChange('+(i+1)+')" href="javascript:;"><i class="icon- change-show"></i></a></span>';
			content+='<div class="changes alert" id="changeBox'+(i+1)+'" style="display: none;">';
			try{
				var detail = $.parseJSON(item.detail);
				for(var j=0;j<detail.length;j++){
					var detailItem = detail[j];
					content+='修改了 <strong><i>'+detailItem.dataItemName+'</i></strong>，旧值为 "'+(detailItem.oldValue||"")+'"，新值为 "'+(detailItem.newValue||"")+'"。<br>';
				}
				
			}catch(e){
				content+=item.detail;
			}
			content+='</div>';
		}
		if(item.remark){
			content+='<div class="history article-content"><p>'+item.remark+'</p></div>';
		}
		content+='</li>';
	}
	content+='</ol>';
	$(content).appendTo($('#actionbox'));
}
function switchChange(historyID)
{
    $swbtn = $('#switchButton' + historyID);
    $showTag = $swbtn.find('.change-show');
    if($showTag.length)
    {
        $swbtn.closest('li').addClass('show-changes');
        $showTag.removeClass('change-show').addClass('change-hide');
        $('#changeBox' + historyID).show();
        $('#changeBox' + historyID).prev('.changeDiff').show();
    }
    else
    {
        $swbtn.closest('li').removeClass('show-changes');
        $swbtn.find('.change-hide').removeClass('change-hide').addClass('change-show');
        $('#changeBox' + historyID).hide();
        $('#changeBox' + historyID).prev('.changeDiff').hide();
    }
}
/**
 * datagrid请求数据前置处理
 *    1.设置contentType为application/json
 *    2.将排序参数sort、order转换为orderBy
 *    3.将分页参数page、row转换为pageNo、pageSize
 */
function datagridBeforeSend(param, success, error,opts){
	//设置排序
	var sort = param.sort||"";
	var order = param.order||"";
	if(sort||order||""){
		param.orderBy =  sort + " "+order;
	}
	delete param.sort;
	delete param.order;
	//设置分页
	var pageNo = param.page||"";
	if(pageNo){
		param.pageNo = pageNo;
	}
	var pageSize = param.rows||"";
	if(pageSize){
		param.pageSize = pageSize;
	}
	delete param.page;
	delete param.rows;
    $.ajax({  
        type :opts.method,  
        url : opts.url,  
        dataType : 'json',  
        contentType : 'application/json;charset=utf-8', // 设置请求头信息  
        data : JSON.stringify(param),  
        success : function(result) {         
             success(result);                  
        }  
     });  
}

/**
 * 将时间字符串转换为毫秒数
 * @param datetimeString
 * @returns
 */
function datetimeToMillsConverter(datetimeString){
	datetimeString = datetimeString||"";
	if(datetimeString==""){
		return null;
	}
	var mills = new Date(datetimeString.replace(new RegExp(/-/gm) ,"/")).getTime();
	return mills;
}
/**
 * 将毫秒数转换成时分秒
 * @param mss
 * @returns
 */
function millsToHmsConverter(mills) {
	//parseInt   转换会丢失精度 ,改为  Math.round
	var days = Math.round(mills / (1000 * 60 * 60 * 24));
    var hours = Math.round((mills % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.round((mills % (1000 * 60 * 60)) / (1000 * 60));
    var seconds =  Math.round((mills % (1000 * 60)) / 1000);
    days = days!=0?days+ " 天 ":"";
    hours = hours!=0?hours+ " 小时 ":"";
    minutes = minutes!=0?minutes+ " 分钟 ":"";
    seconds = seconds!=0?seconds+ " 秒 ":"";
    return days + hours + minutes + seconds;
}

/**
 * @desc 公共导入调用入口
 * @param templateCode	{string} 导入模板编码
 * @param callerPageUrl	{string} 回调页面（业务数据网格页面 如：query.htm）
 * @param datagridElementId	{string} （业务数据网格Id 如：queryDatagrid）
 * @returns
 */
function commonImport(templateCode, callerPageUrl, datagridElementId){
	if(isNull(templateCode)){
		top.showAlert("提示", "导入模板编码为空", 'info');
		return;
	}
	if(isNull(callerPageUrl)){
		top.showAlert("提示", "回调页面为空", 'info');
		return;
	}
	if(isNull(datagridElementId)){
		top.showAlert("提示", "数据网格Id为空", 'info');
		return;
	}
	top.getDlg(rootPath + "jasframework/components/importexcel/import_excel.htm?templateCode=" + templateCode + 
			"&callerPageUrl=" + callerPageUrl +"&datagridElementId=" + datagridElementId, "importExcel",
			"导入", 700, 400, false, true, false);
}

/**
 * @desc 公共导出
 * @param templateCode	{string} 模板编码
 * @param functionCode	{string} 自定义表单功能编号
 * @param keywords	{object} 导出查询条件json对象
 * @returns	文件名
 */
function commonExport(templateCode, functionCode, keywords){
	var fileId ;
	$.ajax({
		url: rootPath + '/importExcelController/exportExcel.do',
		type: 'post',
		contentType: 'application/json;charset=utf-8',
		dataType:'json',
		async:false,
		data:JSON.stringify({
			"templateCode": templateCode,
			"functionCode": functionCode,
			"keywords": keywords,
		}),
		success: function(result){
			if(result.status == 1){
				fileId = result.data;//encodeURI(encodeURI(result.data));
			}else{
				top.showAlert("提示", result.msg, 'info');
			}
		}
	});
	return fileId;
}

/**
 * 显示地图
 * @returns
 */
var map = new Object( null );
Object.defineProperty(map , 'show', {
    set : function( value ){
        show = value;
        /* 如果是true 就打开地图,1 表示正在打开地图 */
        if( show == true ){
            showMap();
        }
    },
    get : function(){
        return show;
    }
});

function checkMap(){
    let param = $(".openMap").css("display");
    console.log(param);
}

function showMap(){
    showmap2d();
}

var position = new Object( null );
Object.defineProperty(position , 'positionArray', {
    set : function( value ){
        var result = value.split('&^');
        if( result.length == 1 ) {
            xyPosition( result[0] );
		} else if (result.length == 2 ) {
            xyPosition( result[0], result[1] );
		} else if (result.length == 3 ) {
            xyPosition( result[0], result[1], result[2] );
        }

    },
    get : function(){
        return positionArray;
    }
});

/* 默认地图没有加载完成 */
function timeCount(positionArray, optionParam, centerAt) {

    /* 获取地图页面实例 */
    let fra = parent.$("iframe");
    let otherJs = '';
    let jasMapApi = '';
    for ( let i = 0; i < fra.length; i++) {
        if (fra[i].id == 'frm2d') {
            otherJs = fra[i].contentWindow;
            jasMapApi = fra[i].contentWindow.jasMapApi;
        }
    }

    if(otherJs != '' && otherJs.mapLoadComplete == true ){
        otherJs.doPosition(JSON.parse(positionArray) , optionParam, centerAt);
        otherJs.flashPoint(JSON.parse(positionArray));
       // otherJs.jasMapApi.setLevel(4);
	} else {
        setTimeout('timeCount(\''+positionArray+'\',\''+optionParam+'\', \''+centerAt+'\')',300);
	}


}

function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;

}
/**
 * 定位
 */
function xyPosition(param, optionParam, centerAt){
    timeCount( param , optionParam, centerAt);
}

/**
 * 选点
 * @param getLocationCallBack 回调函数
 */
var commonCallback ;
function getXY( getLocationCallBack ){
    commonCallback = getLocationCallBack;
    let intervalOne = setInterval(function() {

        /* 获取地图页面实例 */
        let fra = parent.$("iframe");
        let otherJs = '';
        let jasMapApi = '';
        for ( let i = 0; i < fra.length; i++) {
            if (fra[i].id == 'frm2d') {
                otherJs = fra[i].contentWindow;
                jasMapApi = fra[i].contentWindow.jasMapApi;
            }
        }

        if( otherJs != '' && otherJs.mapLoadComplete == true){
            /* 地图加载完毕后，执行定位 */
            otherJs.getXY(commonCallback);
            clearInterval(intervalOne);
        }
	}, 300);
}


/**
 * 空间数据划线
 * @param getLocationCallBack 回调函数
 */
var layerLine ;
var layerWhere ;
var layerOid;
var layerGpsPolygon;
var layerP;
var buffer;
function updateLayer( layerLine, layerWhere , layerOid, layerGpsPolygon,layerP,buffer){	
	var query1 = {
			layerId : "gps_pathline", 
			where:"active =1 and PATHLINEMAINOID = '"+layerOid+"'",
			outFields:["*"] 
			};
	var queryArray = [query1]; 
    let intervalLine = setInterval(function() {

        /* 获取地图页面实例 */
        let fra = parent.$("iframe");
        let otherJs = '';
        let jasMapApi = '';
        for ( let i = 0; i < fra.length; i++) {
            if (fra[i].id == 'frm2d') {
                otherJs = fra[i].contentWindow;
                jasMapApi = fra[i].contentWindow.jasMapApi;
            }
        }

        if( otherJs != '' && otherJs.mapLoadComplete == true){
        	
        	/* 地图加载完毕后，执行定位 */
            otherJs.jasMapApi.updateLayer(layerLine, layerWhere);
            otherJs.jasMapApi.flashGraphic(layerOid, layerGpsPolygon,layerP);
            
        	
        	otherJs.jasMapApi.queryFeatures(queryArray,function(features){ 
        			otherJs.jasMapApi.queryBufferGraphic(features[0][0].geometry,buffer,{
        				layerId:"gps_pathline",
        				draw:true,
        				color:[37,232,65,120],
        				layerIndex:1
        			});
        	}) 
        	

            clearInterval(intervalLine);
        }
    }, 300);
    
    
}

/**
 * 登录密码强度
 */
String.prototype.txtEncryption = function () {
    var _str = this;
    var _strLength = _str.length;
    var _strTarget = "";
    for (var i = 0; i < _strLength; i++) {
        _strTarget += String.fromCharCode(_str.charCodeAt(i) + (_strLength - i));
    }
    return escape(_strTarget);
}


/**
 * 获取本周开始日期到本周结束日期
 * @param dateString
 * @returns {string}
 */
function getWeek(dateString) {
	//按周日为一周的最后一天计算
	var date = new Date(dateString);
	//今天是这周的第几天
	var today = date.getDay();
	// 如果今天是周日
	if (today == 0) {
		today = 7;
	}
	//上周日距离今天的天数（负数表示）
	var stepSunDay = -today + 1;

	// 周一距离今天的天数（负数表示）
	var stepMonday = 7 - today;
	var time = date.getTime();
	var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
	var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);
	//本周一的日期 （起始日期）
	var startDate = transferDate(monday); // 日期变换
	//本周日的日期 （结束日期）
	var endDate = transferDate(sunday); // 日期变换
	return '('+startDate + ' - ' + endDate+')';
}

function transferDate(date) {
	// 年
	var year = date.getFullYear();
	// 月
	var month = date.getMonth() + 1;
	// 日
	var day = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (day >= 0 && day <= 9) {
		day = "0" + day;
	}
	var dateString =  month + '/' + day;
	return dateString;
}

/**
 * 获取本月开始日期到本月结束日期
 * @returns {string}
 */
function getMonth(dateString) {
	// 获取当前月的第一天
	var start = new Date(dateString);
	start.setDate(1);
	// 获取当前月的最后一天
	var date = new Date(dateString);
	var currentMonth = date.getMonth();
	var nextMonth = ++currentMonth;
	var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
	var oneDay = 1000 * 60 * 60 * 24;
	var end = new Date(nextMonthFirstDay - oneDay);
	var startDate = transferDate(start); // 日期变换
	var endDate = transferDate(end); // 日期变换
	return '('+startDate + ' - ' + endDate+')';
}

function getHalfMonth(dateString) {
	// 获取当前月的第一天
	var start = new Date(dateString);
	var day = start.getDate();
	start.setDate(1);
	// 获取当前月的最后一天
	var date = new Date(dateString);
	var currentMonth = date.getMonth();
	var nextMonth = ++currentMonth;
	var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
	var oneDay = 1000 * 60 * 60 * 24;
	var end = new Date(nextMonthFirstDay - oneDay);
	var startDate = transferDate(start); // 日期变换
	var endDate = transferDate(end); // 日期变换
	if( day <= 15 )
		return '上半月'+'('+startDate + ' - ' + endDate.substring(0,3)+'15)';
	else
		return '下半月'+'('+startDate.substring(0,3) + '16 - ' + endDate+')';
}

/**
 * 获取本季度的时间段
 */
function getQuarter(dateString) {
	return '('+getQuarterStartDate(dateString) + ' - ' + getQuarterEndDate(dateString)+')';
}
// 获得本季度的开始日期
function getQuarterStartDate(dateString) {
	var nowMonth = new Date(dateString).getMonth();
	var nowYear = new Date(dateString).getFullYear();
	var quarterStartDate = new Date(nowYear, getQuarterStartMonth(nowMonth), 1);
	return formatDate(quarterStartDate);
}
// 获得本季度的结束日期
function getQuarterEndDate(dateString) {
	var nowMonth = new Date(dateString).getMonth();
	var nowYear = new Date(dateString).getFullYear();
	var quarterEndMonth = getQuarterStartMonth(nowMonth) + 2;
	var quarterStartDate = new Date(nowYear, quarterEndMonth,
		getMonthDays(nowYear,quarterEndMonth));
	return formatDate(quarterStartDate);
}

// 格式化日期：yyyy-MM-dd
function formatDate(date) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var myweekday = date.getDate();
	if (mymonth < 10) {
		mymonth = "0" + mymonth;
	}
	if (myweekday < 10) {
		myweekday = "0" + myweekday;
	}
	return (myyear + "/" + mymonth + "/" + myweekday);
}

//获得本季度的开始月份
function getQuarterStartMonth(nowMonth) {
	var quarterStartMonth = 0;
	if (nowMonth < 3) {
		quarterStartMonth = 0;
	}
	if (2 < nowMonth && nowMonth < 6) {
		quarterStartMonth = 3;
	}
	if (5 < nowMonth && nowMonth < 9) {
		quarterStartMonth = 6;
	}
	if (nowMonth > 8) {
		quarterStartMonth = 9;
	}
	return quarterStartMonth;
}

//获得某月的天数
function getMonthDays(nowYear,myMonth) {
	var monthStartDate = new Date(nowYear, myMonth, 1);
	var monthEndDate = new Date(nowYear, myMonth + 1, 1);
	var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
	return days;
}

function getYear( year ) {
	return '('+new Date(year).getFullYear()+')';
}

/**
 * 格式化秒
 * @param int  value 总秒数
 * @return string result 格式化后的字符串
 */
function formatSeconds(value) {
	var theTime = parseInt(value);// 需要转换的时间秒
	var theTime1 = 0;// 分
	var theTime2 = 0;// 小时
	var theTime3 = 0;// 天
	if(theTime > 60) {
		theTime1 = parseInt(theTime/60);
		theTime = parseInt(theTime%60);
		if(theTime1 > 60) {
			theTime2 = parseInt(theTime1/60);
			theTime1 = parseInt(theTime1%60);
			if(theTime2 > 24){
				//大于24小时
				theTime3 = parseInt(theTime2/24);
				theTime2 = parseInt(theTime2%24);
			}
		}
	}
	var result = '';
	if(theTime > 0){
		result = ""+parseInt(theTime)+"秒";
	}
	if(theTime1 > 0) {
		result = ""+parseInt(theTime1)+"分"+result;
	}
	if(theTime2 > 0) {
		result = ""+parseInt(theTime2)+"小时"+result;
	}
	if(theTime3 > 0) {
		result = ""+parseInt(theTime3)+"天"+result;
	}
	return result;
}