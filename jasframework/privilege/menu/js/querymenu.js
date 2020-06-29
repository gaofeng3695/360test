/**
 * 描述：获取应用系统并拼接成下拉列表
 */
function getappsystem(){
	$.ajax({
		url:rootPath+"jasframework/privilege/application/getUserAppsystem.do?",
		type:"post",
		success:function(result){
			var selecthtm="";
			for(var i=0;i<result.length;i++){
				selecthtm+="<option value=\""+result[i].oid+"\">"+result[i].appName+"</option>";
			}
			$("#appId").html(selecthtm);
			$('#appId1').combobox({   
				 data:result,
				 valueField:'oid',   
				 textField:'appName'  ,
				 onSelect:function(record){
					 selectappsystem(record.oid);	//选择应用，携带应用的oid
				 },onLoadSuccess:function(){
					 var data=$(this).combobox("getData");
					 if(data.length>0){
						 $(this).combobox('select',data[0].oid);
						 setComboObjWidth('appId1',1,'combobox','left');
					 }
				 }
				}); 
			
			if(result[0]){
				inittree(result[0].oid);
			}
		},
		dataType:"json",
		 	async: false,
		 	error:function(){
		}
	});
	
}

	//节点id
	var id="";
	/**
	 * 自适应
	 */
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	$(document).ready(function(){
		getappsystem();
		//左侧div宽度
	 	var div_left_width =$(".layout-panel-west").width();
		my_resize(div_left_width);
		onWindowResize.add(function(){
			clientHeight = document.documentElement.offsetHeight;
			clientWidth = document.documentElement.offsetWidth;
			div_left_width = $(".layout-panel-west").width();
			my_resize(div_left_width);
		});
		//自动适应页面大小
		function my_resize(panelWidth){
			$("#cc").css("width",clientWidth);
			$("#cc").css("height",clientHeight);
			//$("#cc").layout('resize',{height:clientHeight,width:clientWidth});
			$('#left').panel('resize',{height:clientHeight,width:div_left_width});
			$('#right').panel('resize',{height:clientHeight,width:clientWidth - panelWidth});
			
		}
	
		$(".layout-button-left").hide();
		$(".layout-button-left").bind("click",function(){
			my_resize(div_left_width-21);
			clientWidth = document.documentElement.clientWidth;
			$(".layout-button-right").bind("click",function(){
				var temp = 0-div_left_width+145;
				my_resize(temp);
				clientWidth = document.documentElement.clientWidth;
			});
		});
	});
	
	function clickmenu(oid){
		url =  rootPath+"/jasframework/privilege/menu/getById.do?oid="+oid;
		 jQuery.post(url, function(data){
			 $('#viewSiteForm').form('load', data);
		 },"json");
	}
	
	function inittree(appId){
		
		$.ajax({
			   url : rootPath+"jasframework/privilege/menu/getListByAppId.do?appId="+appId,
			   success: function(msg){
			     $('#tt').tree( {
			    	 checked:true,
			    	 data:msg,
			    	 onLoadSuccess:function(node,data) {
			    		 var rootTarget=$('#tt').tree('getRoot');
			    		 if(rootTarget!=null){
			    			 $('#tt').tree('select',rootTarget.target);
			    			 clickmenu(rootTarget.id);
			    		 }
			    	 },
			    	 onClick : function(node) {
			    		 clickmenu(node.id);
			    	 }
			     });
			     
			     $('#parentId').combotree( {
			    	 	data:msg,
						checked:true,
						disabled:true,
						onLoadSuccess:function(node,data) {
							var rootTarget=$('#tt').tree('getRoot');
							if(rootTarget!=null){
						 	$('#tt').tree('select',rootTarget.target);
							}
						},
						onClick : function(node) {
						}
					});
			     setComboObjWidth('parentId',0.615,'combotree');
			     
			   },
			   dataType:"JSON"
			});
		//初始化权限树
		
	}
	/**
	 * 描述：判断节点是否为根节点
	 * @param node 节点对象
	 * @returns boolean 根节点为true，否则为false
	 */
	function isRootNode(node){
		if ( node.attributes.isRoot != null && node.attributes.isRoot == "true") {
			return true;
		}
		return false;
	}
	/**
	 * 描述：新增按钮事件
	 */
	function addmenu() {
		var appId=$("#appId1").combobox("getValue");
		var row = $('#tt').tree('getSelected');
		var oid;
		if (row != null) {
			oid  = row.id;
			url = "addmenu.htm?appId="+appId+"&parentId=" + oid;
			top.getDlg(url, "saveiframe",getLanguageValue("add"), 700, 430);
		} else {
			top.getDlg("addmenu.htm?appId="+appId, "saveiframe",getLanguageValue("add"), 700, 430);
		}
	
	}
	/**
	 * 描述：修改按钮事件
	 */
	function updatemenu() {
		var oid;
		var parentId;
		var row = $('#tt').tree('getSelected');
		if (row != null) {
			var appId=$("#appId1").combobox("getValue");
			oid = row.id;
			var node = $('#tt').tree('find',oid);
			var parentNode=$('#tt').tree('getParent',node.target);
			if( parentNode == null){
				alert(getLanguageValue("menu.topMenuIsUneditable"));
				return;
			}
			parentId=parentNode.id;
			url = "updatemenu.htm?oid=" + oid+"&appId="+appId+"&parentId="+parentId;
			top.getDlg(url, "saveiframe",getLanguageValue("edit"), 700, 400);
		} else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), 'info');
			return;
		}
	}
	
	function reloadNote(nodeid){
		var node=$("#tt").tree("find",nodeid);
		$.getJSON(rootPath+"/jasframework/privilege/menu/getAllPrivilegeByAppnumber.do?appnumber="+appnumber+"&random=" + new Date().getTime(), function(data){
			$('#tt').tree('loadData',data);
			});
	}

	function selectappsystem(appId){
		var url = rootPath+"/jasframework/privilege/menu/getListByAppId.do?appId="+appId;
		$.getJSON(url, function(data){
			$('#tt').tree('loadData',data);
		});
	}
	/**
	 * 
	 * 描述：拖动改变布局大小的监听方法
	 */
	function resizeLayout(){
		try{
			clientWidth = document.documentElement.clientWidth;
			$('#appId1').combobox('resize', $('#left').width());
		}catch(e){
			
		}
	}
	
	function reloadchildren(nodeid){
			var node=$('#tt').tree("find",nodeid);
			var isLeaf = $('#tt').tree("isLeaf",node.target);
			if( isLeaf ){
				var parentNode = $('#tt').tree("getParent",node.target);
				nodeid = parentNode.id;
			}
			$("#tt").tree("options").url = $("#tt").tree("options").url= rootPath+"/jasframework/privilege/menu/getListByAppId.do?appId="+$("#appId1").combobox("getValue")+"&oid="+nodeid;
			$('#tt').tree("reload");
		
//		if(parentid=="null" || parentid==""){
//			$("#tt").tree("options").url= rootPath+"/jasframework/privilege/menu/getListByAppId.do?appId="+$("#appId1").combobox("getValue")+"&oid="+parentid;
//			$("#tt").tree("reload");
//		}else{
//			var node=$('#tt').tree("find",parentid);
//			/***begin tree 当叶子节点变为非叶子节点时，该节点不刷新的问题***/
//			var childrenNode=$('#tt').tree("getChildren",node.target);
//			if(childrenNode.length==0){
//				$('#tt').tree("append",{parent:node.target,data:[{id:"1",text:"dd"}]});
//			}
//			/***end***/
//			$("#tt").tree("options").url= rootPath+"/jasframework/privilege/menu/getChildrenMenuList.do?appId="+$("#appId1").combobox("getValue")+"&oid="+parentid;
//			$("#tt").tree("reload",node.target);
//			setTimeout(function(){
//				$("#tt").tree('select',node.target);
//			}, 100);
//		}
		
	}
	
	function deletemenu(){
		var row = $('#tt').tree('getSelected');
		if (row != null) {
			var checkurl=rootPath+"jasframework/privilege/menu/isMenuChildrenExist.do?parentId="+row.id;
			$.getJSON(checkurl,function(data){
				if(data.success==1){
					var url= rootPath+"jasframework/privilege/menu/deleteById.do?oid="+row.id;
					top.$.messager.confirm(getLanguageValue("delete"),getLanguageValue("deleteconfirm"),function(r){
						if(r){
							$.getJSON(url, function(data){
								if(data.status==1){
									top.showAlert(getLanguageValue("success"),getLanguageValue("deletesuccess"),'ok',function(){
										 $('#tt').tree('remove',row.target);
									});
								}else{
									top.showAlert(getLanguageValue("tip"),result.msg,'info');
								}
							});
						}
					});
				}else{
					top.showAlert(getLanguageValue("tip"), data.msg, 'error');
				}
			});
		}else{
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), 'info');
		}
	}
