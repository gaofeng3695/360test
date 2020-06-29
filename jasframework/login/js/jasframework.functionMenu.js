
/** 
 * @file
 * @author  Zhengguomin
 * @desc 加载主界面对应js
 * @version 2.0
 * @date   2015-6-29 上午10:32:07
 * @last modified by lizz
 * @last modified time  2017-08-17
 */

(function($) {
	//0为用户的所有有权限的菜单，1为用户个性化配置的菜单
	var menuType ='0';
	var appId = "";
	//用户自定义的菜单权限id数组
	var customIds=[];
	$.jasframeworkFunctionMenu = function(customHandleMenuIdArray) {
		if(customHandleMenuIdArray){
			customIds=customHandleMenuIdArray;
		};
		this.createMenu = function(type,appid) {
			menuType = type;
			appId = appid;
			createMenu();
		};
		this.openPage = function(id, title, url,closeable,updateIfExist){
			openPageByTab(id, title, url,closeable,updateIfExist);
		};
		this.addCustomHandleMenuIdArray=function(customHandleMenuIdArray){
			customIds=customHandleMenuIdArray;
		};
	};
	
	/**
	 * @desc 创建系统功能菜单
	 * @param menuType 菜单类型，0为用户的所有有权限的菜单，1为用户个性化配置的菜单
	 */
	function createMenu(){
		$('#left').empty();
		if (typeof menuType == 'undefined') {
			menuType ='0';
		}
		//判断appConfig文件中的菜单显示配置,accordion:手风琴;menuBar:横向菜单
		if(navigatorMenuType=="accordion"){
			//创建手风琴菜单
			getMainMenuData(menuType, language, createAccordionMenu);
		}else{
			//创建横向菜单
			getMainMenuData(menuType, language, createNavigatorMenuBar);
		}
	}
	/**
	 * @desc 创建系统功能菜单
	 */
	/*function createMenu(){
		$('#left').empty();
		if (typeof menuType == 'undefined') {
			menuType ='0';
		}
		//判断appConfig文件中的菜单显示配置,accordion:手风琴;menuBar:横向菜单
		if(navigatorMenuType=="accordion"){
			//创建手风琴菜单
			getFirstMenuData(privilegeId,menuType, language, createAccordionMenu);
		}else{
			//创建横向菜单
			getFirstMenuData(privilegeId,menuType, language, createNavigatorMenuBar);
		}
	}*/
	
	/**
	 * 获取系统的一级功能模块数据（新气项目）
	 * @returns
	 */
	function getFirstMenuData(menuId,menuType, language, callBack){
		var url="";
		if(isIntegrationExist){
			url =rootPath + 'jasframework/privilege/menu/menus.do';
		}else{
			url =rootPath + 'jasframework/privilege/privilege/getChildrenMenuList.do';
		}
		$.ajax({
			url:url,
			type:"POST",
			data:{
				"id":menuId,
				"menutype":menuType,
				"language":language
			},
			async:false,
			cache:false,
			dataType:"json",
			success:function(data){
				/*var nodes = [];
				for(var i=0;i<data.length;i++){
					var node={
							"id":data[i].attributes.functionid,
							"node_id":"node"+data[i].attributes.functionid,
							"node_number":data[i].id,
							"node_t":data[i].text
					};
					nodes.push(node);
				}*/
				callBack(data);
			}
		});
	}
	
	/**
	 * @desc 获取系统的一级功能模块数据
	 * @param menuType 菜单类型，0为用户的所有有权限的菜单，1为用户个性化配置的菜单
	 * @param language 客户端语言
	 * @param callBack 回调函数，可进行获取菜单数据之后的页面渲染
	 */
	function getMainMenuData(menuType, language,callBack) {
		var url="";
		if(isIntegrationExist){
			url=rootPath + '/jasframework/privilege/menu/getIntegrationMenu.do';
		}else{
			url=rootPath + '/jasframework/privilege/privilege/menu2main.do';		
		}
		$.ajax({
			url:url,
			type:"POST",
			data:{
				"menutype":menuType,
				"appId":appId,
				"language":language
			},
			async:false,
			cache:true,
			dataType:"json",
			success:function(data){
				if(data.msg=="undefined" || data.msg==undefined){
					callBack(data);
				}else{
					showAlert("提示", data.msg, "info");
				}
			}
		});
	}
	
	/**
	 * @desc 创建左侧手风琴菜单
	 * @param nodes 菜单节点数据
	 */
	function createAccordionMenu(nodes) {
		//清除左侧区域
		$('#left').empty();
		//左侧菜单容器标签
		var leftContainer='<div id="left-container"></div>';
		//添加左侧菜单容器
		$('#left').append(leftContainer);
		//创建菜单列表
		createMenuList(nodes);
		$('#left-container').accordion({
			fit:false
		});
	}
	
	/**
	 * @desc 创建菜单列表
	 * @param nodes 菜单节点数据
	 */
	function createMenuList(nodes){
		var firstClick = 0;
		$('#left-container').accordion({
			animate:false,
			onSelect:function(title,index){
				var accordion=$('#left-container').accordion('getPanel',index);
				var menuId=accordion.panel('options').id;
				//根据父级菜单id获取子节点数据创建树
				var node_number=$('#left-container').find('.panel').eq(index).find('ul').attr('node_num');
				//检查父菜单下子菜单渲染方式是否有自定义，如果有，调用自定义的渲染方式
				for(var j=0;j<customIds.length;j++){
					if(node_number==customIds[j]){
						//用户自定义渲染菜单
						customHandler(node_number,menuId);
						return;
					}
				}
				var item=$('#item'+menuId).html();
				if(item==""){
					//父级菜单添加事件触发的时候添加子菜单节点
					getMenuData(menuId,node_number,menuType,language,createMenuItem);
				}
				clickMenuHandler(nodes[index]);
				firstClick++;
			},
			onUnselect:function(title,index){
				if(firstClick>1){
					clickMenuHandler(nodes[index]);
				}
			}
		});
		var len=nodes.length;
		for(var i=0;i<len;i++){
			var id=nodes[i].attributes.functionid;
			var title=nodes[i].text;
			var node_number=nodes[i].id;
			//添加父菜单项
			$('#left-container').accordion('add',{
				title:title,
				//添加ul作为子节点的容器
				content:'<ul id='+'item'+id+' node_num='+node_number+'></ul>',
				selected:false,
				id:id,
				iconCls:'fa fa-ge'
			});
		}
	}
	/**
	 * @desc 创建子节点菜单树
	 * @param menuId 菜单id
	 * @param node_number 父菜单权限id
	 * @param data 子节点数据
	 */
	function createMenuItem(menuId,node_number,data){
		$('#item'+menuId).tree({
			animate:true,
			data:data,
			onClick:function(node){
				clickMenuHandler(node);
			}
		});

		/* 展开所有节点 */
        $('#item'+menuId).tree("expandAll");
	}
	/**
	 * @desc 点击子菜单处理函数
	 * @param node点击的节点
	 */
	function clickMenuHandler(node){
	
		var id=node.id;
		var text=node.text;
		var rootUrl=node.attributes.URL;
		var openType="";
		var url="";
		var pathName = window.document.location.pathname;
		var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
		if(!isNull(rootUrl)){
			if(rootUrl.indexOf("http://") > -1){
				// 对外网的页面进行处理
				url = rootUrl;
			}else{
				url = projectName +"/"+rootUrl;
			}
		}
		try{
			openType=node.attributes.openType;
		}catch(e){
			openPageByTab(id,text, url,true,false);
		}
		if(openType=="3"){
			getDlg(url,id,text,550,450);
		}else if(openType=="2"){
			window.open(url,text,"");
		}else{
			//var functionId=node.attributes.functionid;
			openPageByTab(id,text, url,true,false);
		}
	}
	
	/**
	 * @desc 点击树弹出对应tab页面 
	 * @param id 菜单权限编号 
	 * @param title tab标题 
	 * @param url 页面路径
	 * @param targetTabId 指定页面所在的标签ID,如果指定了该参数，则要在已经打开且ID为targetTabId的tab页签中打开该页面。
	 * @param closeable 是否可以关闭，取值范围为true||false，如果不指定默认为可关闭
	 */
	function openPageByTab(id, title, url, closeable,updateIfExist) {
		if(typeof(closeable)=='undefined'){
			closeable=true;
		}
		if(typeof(url)!='undefined' && ""!=url){
			tab.openTabs(id, title, url, closeable, updateIfExist);
		}
	}
	
	/**
	 * @desc 根据功能菜单id获取该菜单下级菜单数据
	 * @param menuId 菜单id
	 * @param menuType 菜单类型，0为用户的所有有权限的菜单，1为用户个性化配置的菜单
	 * @param language 客户端语言
	 * @param callBack 回调函数，可进行获取菜单数据之后的页面渲染
	 */
	function getMenuData(menuId,node_number,menuType,language,callBack) {
		var url="";
		if(isIntegrationExist){
			url =rootPath + 'jasframework/privilege/menu/getMenus.do';
		}else{
			url =rootPath + 'jasframework/privilege/privilege/getChildrenMenuList.do';
		}
		$.ajax({
			url:url,
			type:"POST",
			data:{
				"id":menuId,
				"appId":appId,
				"menutype":menuType,
				"language":language
			},
			async:false,
			cache:false,
			dataType:"json",
			success:function(data){
				callBack(menuId,node_number,data);
			}
		});
	}
	
	/**
	 * @desc 用户自定义渲染菜单方式,如果有多个自定义渲染，通过判断不同的id进行不同的界面渲染处理
	 * @param node_number 父级菜单权限id
	 */
	function customHandler(node_number,menuId){
		if(node_number=='2010'){
			var iframe=document.createElement('iframe');
			var url=rootPath + '/jasframework/quickLocation/quickLocation.html';
			$(iframe).attr('src',url);
			$(iframe).attr('height','484px');
			$(iframe).attr('width','225px');
			$(iframe).attr('id','frm'+menuId);
			if($('#frm'+menuId).html()!=""){
				$('#'+menuId)[0].appendChild(iframe);
			}
		}
	}
})(jQuery);
