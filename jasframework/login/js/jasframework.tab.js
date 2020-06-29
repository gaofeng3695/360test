/**
 * 类描述: 定义功能区tab页签。
 * @author Zhengguomin
 * @version 2.0 创建时间： 2015-06-26
 */
(function($) {

	/**
	 * 方法描述：定义功能区tab页类并定义类中的方法和属性
	 */
	$.jasframeworkTab = function() {
		this.openTabs = function(id, title, url, closeable, updateIfExist) {
			openTabs(id, title, url, closeable, updateIfExist);
		};
		this.isNewTabs=function isNewTabs(id){
			isNewTabs(id);
		};
		this.addNewTabs=function addNewTabs(id, title, url, closeable){
			addNewTabs(id, title, url, closeable);
		};
		this.activeTabs=function activeTabs(id){
			activeTabs(id);
		};
		this.updateTabs=function updateTabs(id, title, url){
			updateTabs(id, title, url);
		};
	    this.addMapTab = function(id, title, url, closeable) {
			addMapTab(id, title, url, closeable);
		};
		this.delMapTab = function(id) {
			delMapTab(id);
		};
	};
	
	/**
	 * 方法描述：打开指定id的tab页签，如果该tab页签不存在，则添加，如果已存在则激活,如果已经存在，且updateIfExist指定为true则激活并更新tab页签内容
	 * @param id 唯一标识id
	 * @param title 标题
	 * @param url 内容页面url
	 * @param closeable 是否允许关闭
	 * @param updateIfExist 如果tab页签已经打开，是否更新其内容
	 */
	function openTabs(id, title, url, closeable,updateIfExist){
		if(clickStatis){
			//如果二维地图已经最大化，则还原
			openMaxMin2DMap();
		}
		if(click3dStatis){
			//如果三维地图已经最大化，则 还原
			openMaxMin3DMap();
		}
		if($("#innerCenter").height() < 100){
			//如果业务数据区域大小小于100,则自动将业务数据区域大小调整为业务数据区和地图区总高度的1/2
			innerLayout.sizePane('north',  $('#outerCenter').height()/2);
		}
		if (isNewTabs(id)) {
			// 如果是id为给定id参数的tab标签没有打开，则新打开一个tab
			addNewTabs(id, title, url,closeable);
		} else if ( updateIfExist ) {
			// 不切换tab，强制更新页面的内容和标题
			updateTabs(id, title, url);
			activeTabs(id);
		} else {
			// 如果是id为给定id参数的tab标签已经打开，则直接激活到该tab（即显示该tab）
			activeTabs(id);
		}
	}
	/**
	 * 方法描述：打开指定id的tab页签，如果该tab页签不存在，则添加，如果已存在则激活,如果已经存在，且updateIfExist指定为true则激活并更新tab页签内容
	 * @param id 唯一标识id
	 * @return  如果是新的tab返回true，否则返回false
	 */
	function isNewTabs(id){
		var flag=true;
		try{
			//获取所有tab
			var tabs=$('#centerTabtag').tabs('tabs');
			var length=tabs.length;
			for(var i = 0; i < length;i++) {
				var tab = tabs[i];
				var tabId =tab.panel('options').id;
				if(id==tabId){
					flag=false;
					break;
				}
			}
		}catch(e){
			//获取所有tab页 ，在第一次所有tab都没有的时候出现获取异常
		}
		return flag;
	}
	/**
	 * 方法描述：添加指定id的tab页签
	 * @param id 唯一标识id
	 * @param title 标题
	 * @param url 内容页面url
	 * @param closeable 是否允许关闭
	 */
	function addNewTabs(id, title, url, closeable){
		$('#centerTabtag').tabs({
			plain:true,
			border:true,
			onLoad:function(data){
				
			},
			onUpdate:function(t){
				var content = document.getElementById("centerContentArea");
				var conNew = document.createElement("dt");
				conNew.className = "on";
				var iframe = document.createElement("iframe");
				iframe.setAttribute("frameBorder", "no");
				iframe.setAttribute("scrolling", "auto");
				iframe.setAttribute("width", "100%");
				iframe.setAttribute("height", "100%");
				iframe.setAttribute("id","frm" + id);
				iframe.src = url;
				conNew.appendChild(iframe);
				content.appendChild(conNew);
				$('#centerTab').find('dl').css("width",$('#centerTab').find('.tabs-header').width());
			},
			onSelect:function(t,index){
				$('#centerTab').find('dt').each(function(i,item){
					if(i==index){
						$('#centerTab').find('dt').eq(index).addClass('on');
					}else{
						$('#centerTab').find('dt').eq(i).removeClass('on');
					}
				});
			},
			onClose:function(t,index){
				var tabNum=$('#centerTab').find('dt').length;
				if(tabNum==1){
					try{
						if(currentPageLayout ==1){
							innerLayout.sizePane('north',  $('#outerCenter').height());//关闭最后一个tab后让地图最大化
						}else if(currentPageLayout ==2){
							innerLayout.sizePane('east',  $('#outerCenter').width());
						}
					}catch(e){
						
					}
				}
				$('#centerTab').find('dt').eq(index).remove();
			},
			onContextMenu:function(e,title){
				e.preventDefault();
				$('#tabsMenu').menu('show', {
					left: e.pageX,
					top: e.pageY
			    });
				$('#m-closeother').attr("title",title);
				$('#m-close').attr("title",title);
			}
			
		});
		$('#centerTabtag').tabs('add',{
			title:title,
			closable:closeable,
			plain:true,
			border:true,
			fit:true,
			id:id
		});
	}
	/**
	 * 方法描述：激活指定id的tab页签
	 * @param id 唯一标识id
	 */
	function activeTabs(id){
		var index=getTabIndexById(id);
		$('#centerTabtag').tabs('select',index);
	}
	/**
	 * 方法描述：更新指定id的tab页签
	 * @param id 唯一标识id
	 * @param title 标题
	 * @param url 内容页面url
	 */
	function updateTabs(id, title, url){
		var index=getTabIndexById(id);
		var tab=$('#centerTabtag').tabs('getTab',index);
		var oriTitle=tab.panel('options').title;
		if(oriTitle!=title){
			$('#centerTabtag').tabs('update',{
				tab:tab,
				options:{
					title:title
				}
			});
		}
		//替换iframe的url
		var iframe=$('#centerTab').find('dt').eq(index).find('iframe');
		var oriUrl=$(iframe).attr('src');
		if(oriUrl!=url){
			$(iframe).attr('src',url);
		}
	}
	/**
	 * 方法描述：激活指定tab的索引值index
	 * @param tab  页签对象
	 * @return 返回该tab的索引
	 */
	function getTabIndex(tab){
		var index=0;
		index=$('#centerTabtag').tabs('getTabIndex',tab);
		return index;
	}
	/**
	 * 方法描述：根据id值获取对应的tab页签的索引
	 * @param id 唯一标识
	 * @return 返回该tab的索引
	 */
	function getTabIndexById(id){
		var index=0;
		var tabs=$('#centerTabtag').tabs('tabs');
		var length=tabs.length;
		for(var i = 0; i < length;i++) {
			var tab = tabs[i];
			var tabId =tab.panel('options').id;
			if(id==tabId){
				index=getTabIndex(tab);
				break;
			}
		}
		return index;
	}
	/**
	 * 方法描述：添加地图tab页签
	 * 
	 * @param id
	 *            唯一标识id，取值为"2d"或者 "3d"
	 * @param title
	 *            标题
	 * @param url
	 *            内容页面url
	 * @param closeable
	 *            是否允许关闭
	 * @param maximizable
	 *            是否允许最大化
	 * @param minimizable
	 *            是否允许最小化
	 */
	function addMapTab(id, title, url, closeable, maximizable, minimizable) {
		if (closeable == null) {
			closeable = true;
		}
		if (maximizable == null) {
			maximizable = true;
		}
		if (minimizable == null) {
			minimizable = true;
		}

		var tabtag = "";
		var contentArea = "";
		if (currentPageLayout == 1) {
			if (id == '2d') {
				tabtag = 'innerNorthCenterTabtag';
				contentArea = 'innerNorthCenterContentArea';
			} else if (id == '3d') {
				tabtag = 'innerNorthEastTabtag';
				contentArea = 'innerNorthEastContentArea';
			}
		} else if (currentPageLayout == 2) {
			if (id == '2d') {
				tabtag = 'innerEastCenterTabtag';
				contentArea = 'innerEastCenterContentArea';
			} else if (id == '3d') {
				tabtag = 'innerEastSouthTabtag';
				contentArea = 'innerEastSouthContentArea';
			}
		}
		var tab = document.getElementById(tabtag);
		var tagNew = document.createElement("li");
		tagNew.className = "current";
		tagNew.setAttribute("id", id);
		tagNew.onmouseover = function() {
			if (tagNew.className != "current") {
				tagNew.className = "mouseover";
			}
		};
		tagNew.onmouseout = function() {
			if (tagNew.className != "current") {
				tagNew.className = "";
			}
		};
		
		 //添加标题
		var titleDiv = document.createElement("div");
		titleDiv.className = "map_tab_titleDiv";
		if (title.length > 20) {
			title = title.substr(0, 20) + "...";
		}
		titleTxt = document.createTextNode(title);
		titleDiv.appendChild(titleTxt);
//		tagNew.appendChild(titleDiv);

		// 创建操作按钮区域
		var toolsDiv = document.createElement("div");
		toolsDiv.className = "map_tab_toolsDiv";
//		tagNew.appendChild(toolsDiv);

		if (minimizable) {
			var mapMin = document.createElement("a");
			mapMin.id = "tab_map_min_" + id;
			mapMin.href = "#";
			mapMin.className = "tab_map_min";
			mapMin.onmouseover = function() {
				this.className = "tab_map_min_on";
			};
			mapMin.onmouseout = function() {
				this.className = "tab_map_min";

			};
			mapMin.onclick = function(event) {
				if (id == '2d') {
					maxOrMin2DMap();
				}
				if (id == '3d') {
					maxOrMin3DMap();
				}
				return false;
			};
			toolsDiv.appendChild(mapMin);
		}
		if (maximizable) {
			var mapMax = document.createElement("a");
			mapMax.id = "tab_map_max_" + id;
			mapMax.href = "#";
			mapMax.className = "tab_map_max";
			mapMax.onmouseover = function() {
				if (this.className.indexOf("tab_map_max") != -1) {
					this.className = "tab_map_max_on";
				} else {
					this.className = "tab_map_restore_on";
				}
			};
			mapMax.onmouseout = function() {
				if (this.className.indexOf("tab_map_max") != -1) {
					this.className = "tab_map_max";
				} else {
					this.className = "tab_map_restore";
				}

			};
			mapMax.onclick = function(event) {
				if (id == '2d') {
					openMaxMin2DMap();
				}
				if (id == '3d') {
					openMaxMin3DMap();
				}
				return false;
			};
			toolsDiv.appendChild(mapMax);
		}
		if (closeable) {
			var mapClose = document.createElement("a");
			mapClose.href = "#";
			mapClose.className = "tab_map_close";

			mapClose.onmouseover = function() {
				this.className = "tab_map_close_on";
			};
			mapClose.onmouseout = function() {
				this.className = "tab_map_close";
			};
			mapClose.onclick = function(event) {
				delMapTab(id);  // 关闭当前tab页签
				if (id == '2d') {
					maxOrMin2DMap();
				}
				if (id == '3d') {
					maxOrMin3DMap();
				}
				return false;
			};
			toolsDiv.appendChild(mapClose);
		}

//		tab.appendChild(tagNew);  // 添加地图模块的tab页签
	

		var content = document.getElementById(contentArea);
		var conNew = document.createElement("dt");
		conNew.className = "on";
		var iframe = document.createElement("iframe");
		iframe.setAttribute("frameBorder", "no");
		iframe.setAttribute("scrolling", "auto");
		iframe.setAttribute("width", "100%");
		iframe.setAttribute("height", "100%");
		iframe.setAttribute("id", "frm" + id);
		iframe.setAttribute("scrolling", "auto");
		iframe.setAttribute("allowFullScreen", "true");
		iframe.src = url;
		conNew.appendChild(iframe);
		content.appendChild(conNew);

		setMapContentWH()
		
	}
	
	/**
	 * 方法描述：设置地图区域块的初始宽高
	 * @param id
	 *  
	 */
	function setMapContentWH(){
		$("#innerNorthCenterContentArea dt.on").css({
			width:$("#innerNorthCenterContentArea").width(),
			height:$("#innerNorthCenterContentArea").height()
		})
	}

	/**
	 * 方法描述：删除指定id的地图Tab
	 * 
	 * @param id
	 *            地图tab的id 取值范围为"2d"或者"3d"
	 */
	function delMapTab(id) {
		if (id == '2d') {
			isHasOpen2d = false;
			clickStatis = false;
			if (currentPageLayout == 1) {
				if (isHasOpen3d == false) {
					innerLayout.hide('north');
				} else {
					if (min3dstatis == true) {
						innerLayout.hide('north');
					} else {
						innerNorthLayout.show('east');
						innerNorthLayout.sizePane('east', getInnerOriginSouthWidth() * 2);
						$('#innerNorth').children('.ui-layout-resizer').hide();
					}
				}
			} else if (currentPageLayout == 2) {
				if (isHasOpen3d == false) {
					innerLayout.hide('east');
				} else {
					if (min3dstatis == true) {
						innerLayout.hide('east');
					} else {
						innerEastLayout.show('south');
						innerEastLayout.sizePane('south', getInnerOriginSouthHeight() * 2);
						$('#innerEast').children('.ui-layout-resizer').hide();
					}
				}
			}

		}
		if (id == '3d') {
			isHasOpen3d = false;
			click3dStatis = false;
			if (currentPageLayout == 1) {
				if (isHasOpen2d == false) {
					innerLayout.hide('north');
				} else {
					if (min2dstatis == true) {
						innerLayout.hide('north');
					} else {
						innerNorthLayout.close('east');
					}
				}
			} else if (currentPageLayout == 2) {
				if (isHasOpen2d == false) {
					innerLayout.hide('east');
				} else {
					if (min2dstatis == true) {
						innerLayout.hide('east');
					} else {
						innerEastLayout.close('south');
					}
				}
			}

		}
		var tabtag = "";
		var contentArea = "";
		if (currentPageLayout == 1) {
			if (id == '2d') {
				tabtag = 'innerNorthCenterTabtag';
				contentArea = 'innerNorthCenterContentArea';
			} else if (id == '3d') {
				tabtag = 'innerNorthEastTabtag';
				contentArea = 'innerNorthEastContentArea';
			}
		} else if (currentPageLayout == 2) {
			if (id == '2d') {
				tabtag = 'innerEastCenterTabtag';
				contentArea = 'innerEastCenterContentArea';
			} else if (id == '3d') {
				tabtag = 'innerEastSouthTabtag';
				contentArea = 'innerEastSouthContentArea';
			}
		}
		var tag = document.getElementById(tabtag).getElementsByTagName("li");
		var cont = document.getElementById(contentArea).getElementsByTagName("dt");
		for ( var i = 0; i < tag.length; i++) {
			if (tag[i].id == id) {
				if (i != 0 && tag[i].className == "current") {
					tag[i - 1].className = "current";
					cont[i - 1].className = "on";
				}
				break;
			}
		}
		if (id == '2d') {
			$("#"+tabtag).empty();
			$("#"+contentArea).empty();
		}else{
			iframe = cont[i].firstChild;
			iframe.src = "about:blank";
			var browser = $.browser;
			if (browser.msie) {
				setTimeout("CollectGarbage()",20);
			}
			cont[i].removeChild(iframe);
			a = tag[i].firstChild;
			tag[i].removeChild(a);
			tabparent = tag[i].parentNode;
			contparent = cont[i].parentNode;
			tabparent.removeChild(tag[i]);
			contparent.removeChild(cont[i]);
			CollectGarbage();
		}
	}
})(jQuery);