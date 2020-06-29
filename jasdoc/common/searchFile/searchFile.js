(function($) {

	$.fn.searchFile = function(options, _67) { 

		if (typeof options == "string") {
			return $.fn.searchFile.methods[options](this, _67);
		}
		options = options || {};
		return this.each(function() {
			var data = $.data(this, "searchFile");
			var settings;
			if (data) {
				settings = $.extend(data.options, options);
				data.isLoaded = false;
			} else {
				settings = $.extend({}, $.fn.searchFile.defaults,$.fn.searchFile.parseOptions(this), options);
				data = $.data(this, "searchFile", {
					options : settings,
					searchFile : init(this,settings),
					isLoaded : false
				});
			}
			initEvent(this,settings);
		});
		
	};
	$.fn.searchFile.methods = {
		options : function(jq) {
			return $.data(jq[0], "searchFile").options;
		}
	};
	$.fn.searchFile.parseOptions = function(_7a) {
//		return $.extend(defaults, options);
	};
	$.fn.searchFile.defaults = {
		size : "12px",
		align : "left",
		width : "300",
		height: "300",
		onkeyupdd : function() {},
		onkeyupdds : function() {}
	};
	function init(_15,_16){
//		alert(JSON.stringify(_16));
		var cpTxt = 
		"<table id='searchFile_search' style='width:"+_16.width+"px;'>"
			+ "<tr>"
				+ "<td style='width: 81%;'>"
					+ "<input style='width:99%' id='searchstring' name='searchstring' maxlength='50' />"
					+ "</td>"
				+ "<td style='width: 5%' id='dddd'>"
					+ "<img id='imgid' src='../../common/images/minus.gif' style='cursor:pointer' />"
				+ "</td>"
				+ "<td style='width: 5%'>"
					+ "<img src='../../common/images/searchbox_button.png' style='cursor:pointer' onclick='searchFileBycontent()'/>"
				+ "</td>" 
			+ "</tr>" 
		+ "</table>";
		$(_15).append(cpTxt);
		var html = "<div id='searchbox'  style='position:absolute;left:-1000px;top:-100px;z-index:1000;width:"+_16.width+"px;background-color:#99CCFF;font-size:"+_16.size+"' >"
				+ "<form id='searchfile' method='post'>"
				+ "<input  id='fileclass' name='fileclass' type='hidden' value=''/>"
				+ "<input  id='userId' name='userId' type='hidden' value=''/>"
				+ "<input  id='language' name='language' type='hidden' value=''/>"
				+ "<table align='center' class='querytable' >"
				+ "<tr>"
				+ "<td width='35%'><span class='paltform-i18n'>文档名称：</span></td>"
				+ "<td width='65%'>"
				+ "<input type='text' id='filename' name='filename' validType='filename' class='easyui-validatebox  input_bg'  maxlength='25'/>"
				+ "</td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td width='35%'><span  class='paltform-i18n'>文档编号：</span></td>"
				+ "<td width='65%'>"
				+ "<input type='text' id='fileno' name='fileno' validType='fileno'  class='easyui-validatebox  input_bg' maxlength='50'/>"
				+ "</td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td width='35%'><span  class='paltform-i18n'>关键词：</span></td>"
				+ "<td width='65%'>"
				+ "<input type='text' id='keyword' name='keyword'  class='easyui-validatebox  input_bg'  maxlength='50'/>"
				+ "</td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td width='35%'><span  class='paltform-i18n'>摘要：</span></td>"
				+ "<td width='65%'>"
				+ "<input type='text' id='summary' name='summary'  class='easyui-validatebox input_bg'  maxlength='50'/>"
				+ "</td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td width='35%'><span  class='paltform-i18n'>上传时间：</span></td>"
				+ "<td width='65%'><input id='uploadtimeStart' name='uploadtimeStart' onclick='WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})' class='Wdate easyui-validatebox input_bg'  /></td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td width='35%'><span  class='paltform-i18n'>到：</span></td>"
				+ "<td width='65%'><input id='uploadtimeEnd' name='uploadtimeEnd'onclick='WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})' class='Wdate easyui-validatebox input_bg'  /></td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td width='35%'><span class='paltform-i18n'>文档分类：</span></td>"
				+ "<td width='65%'>"
				+ "<input type='text' id='fileclassify' name='fileclassify'  style='width: 200px'  multiple='true' panelHeight='80px'/>"
				+ "</td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td width='35%'><span  class='paltform-i18n'>备注：</span></td>"
				+ "<td width='65%'>"
				+ "<input type='text' id='remark' name='remark' class='easyui-validatebox input_bg' maxlength='50'/>"
				+ "</td>"
				+ "</tr>"
				+ "<tr>"
				+ "<td height='33' colspan='2' class='button_area' align='center'>"
				+ "<table  border='0' cellspacing='0' cellpadding='0'>"
				+ "<tr>"
				+ "<td style='width: 60px'>"
				+ "<a href='#' plain='true'  iconCls='icon-search' onclick='searchFile()'><span class='paltform-i18n'>搜索</span></a>"
				+ "</td>"
				+ "<td style='width: 60px'>"
				+ "<a href='#' plain='true'  iconCls='icon-clear' onclick='clean()'><span  class='paltform-i18n'>清空</span></a>"
				+ "</td>"
				+ "</tr>"
				+ "</table>"
				+ "</td>"
				+ "</tr>"
				+ "</table>" + "</form>" + "</div>";
		$("body").append(html);
	}
	function initEvent(_1d,_1e){
		$("#searchstring").bind('keyup', function() {
			var _1f = $.data(_1d, "searchFile");
			var _20 = _1f.options;
			_20.onkeyupdd.call(_1d);
			
		});
		$("#searchstring").bind('mouseup', function() {
			var _1f = $.data(_1d, "searchFile");
			var _20 = _1f.options;
			_20.onkeyupdds.call(_1d);
			
		});
		$("#imgid").bind('click',function(){
			showProvince(_1d,_1e);
		});
	}
	function showProvince(_19,_20){
		$("#searchbox").css("left",$($('#searchstring')).offset().left);
	    $("#searchbox").css("top",$($('#searchstring')).offset().top + $($('#searchstring')).outerHeight());
	   if(!$("#searchbox").is(":visible")){
	    	$("#searchbox").show();
	    	$(document).bind('mouseup',function(e){
	    		var p=$(e.target).closest("#searchbox");
	    		var isExpand=$("#searchbox").is(":visible");
	    		if(p.length==0 && isExpand){
	    			$("#searchbox").hide();
	    				$(document).unbind("mouseup");
	    		}
	    	});
			$("#fileclassify").combotree({
				url: "../classify/getDocClassifyTreeAsync.do",
				cascadeCheck:false,
				onBeforeExpand:function(node){
					url=rootPath+"/jasdoc/folder/classify/getChildrenClassify.do";
				 	$('#fileclassify').combotree("tree").tree("options").url= url+"?folderId="+node.id;
					node.iconCls= 'icon-tree-classify-node-open';
					$('#fileclassify').combotree("tree").tree('update', node);
				},onBeforeCollapse: function(node){
					node.iconCls= 'icon-tree-classify-node-close';
					$('#fileclassify').combotree("tree").tree('update', node);
				},onLoadSuccess:function(){
				}
			});
		}else{
			 $("#searchbox").hide();
		}
	}
})(jQuery);