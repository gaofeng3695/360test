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
				selecthtm += "<option value=\""+result[i].oid+"\">"+result[i].appName+"</option>";
			}
			$("#appId").html(selecthtm);
			$('#appId1').combobox({   
				 data:result,
				 valueField:'oid',   
				 textField:'appName'  ,
				 onSelect:function(record){
					 initzTree(record.oid);
				 },
				 onLoadSuccess:function(){
					 var data=$(this).combobox("getData");
					 if(data.length>0){
						 $(this).combobox('select',data[0].oid);
					 }
				 }
			}); 
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
	//	selectappsystem();
		
	});
	function initzTree(appId){
		$.ajax({
			url: rootPath+'jasframework/privilege/privilege/getAllPrivilegeZTreebyappnumber.do',
			dataType:'json',
			type:'post',
			data:{"appId":appId},
			success:function(result){
				$.fn.zTree.init($("#tt"),{
					treeObj:null,
					check: {
						enable: true,
						autoCheckTrigger:true,
						display:true
					},data: {
						simpleData: {
							enable: true, 
							idKey: 'id'
						}
					},callback: {
						beforeExpand: zTreeBeforeExpand,
						beforeCollapse: zTreeBeforeCollapse,
						onClick: zTreeOnClick,
						onAsyncSuccess: zTreeOnAsyncSuccess,
						beforeDrag: zTreeBeforeDrag,
						beforeDrop: zTreeBeforeDrop,
						onDrop: zTreeOnDrop
					},async: {
						enable: true,
						url: rootPath+"jasframework/privilege/privilege/getChildrenPrivilegeByappId.do",
						type:"post",
						dataType:"json",
						autoParam: ['id'],
						otherParam: ["appId", appId]
					},edit: {
						enable: false,
						drag: {
							isCopy: false,
							isMove: true,
							prev: true,
							next: true,
							inner: false
						}
					}
				},result);
			}
			
		});
	}
	/**
	 * 展开节点之前
	 * @param treeId
	 * @param treeNode
	 */
	function zTreeBeforeExpand(treeId, treeNode){
		var treeObj = $.fn.zTree.getZTreeObj("tt");
		treeNode.icon = "icon-tree-folder-node-open";
		treeObj.selectNode(treeNode);
		treeObj.updateNode(treeNode);
	}
	/**
	 * 关闭节点之前
	 * @param treeId
	 * @param treeNode
	 */
	function zTreeBeforeCollapse(treeId, treeNode){
		var treeObj = $.fn.zTree.getZTreeObj("tt");
		treeNode.icon = "icon-tree-folder-node-close";
		treeObj.updateNode(treeNode);
	}
	/**
	 * 单击节点
	 * @param event
	 * @param treeId
	 * @param treeNode
	 * @param clickFlag
	 */
	function zTreeOnClick(event, treeId, treeNode,clickFlag){
		loadRight(treeNode.id);
		if(treeNode.getParentNode()==null || treeNode.getParentNode()==null){
			$("#P-PRI-0041").linkbutton("disable");
			$("#P-PRI-0042").linkbutton("disable");
		}else{
			$("#P-PRI-0041").linkbutton("enable");
			$("#P-PRI-0042").linkbutton("enable");
		}
	}
	/**
	 * 异步加载成功之后
	 * @param event
	 * @param treeId
	 * @param treeNode
	 * @param msg
	 */
	function zTreeOnAsyncSuccess(event,treeId,treeNode,msg){
//		alert(treeNode.name);
		loadRight(treeNode.id);
	}
	/***
	 * 节点拖动之前
	 * @param treeId
	 * @param treeNodes
	 * @returns {Boolean}
	 */
	function zTreeBeforeDrag(treeId, treeNodes) {
		if(treeNodes.length==1){
			return true;
		}else{
			return false;
		}
	};
	/**
	 * 拖动节点操作结束之前
	 * @param treeId
	 * @param treeNodes
	 * @param targetNode
	 * @param moveType
	 * @returns {Boolean}
	 */
	function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
		if(targetNode.pId==treeNodes[0].pId){
			return true;
		}else{
			return false;
		}
	};
	/***
	 * 拖动节点操作结束之后
	 * @param event
	 * @param treeId ztree的ID
	 * @param treeNodes 拖动的节点
	 * @param targetNode 目标节点
	 * @param moveType 拖动类型，next,prev和inner(这里没用到)
	 */
	function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
		if(moveType=="null"){
			return false;
		}
		var appNumber = $("#appId1").combobox("getValue");
		$.ajax({
			url:rootPath+"/jasframework/privilege/privilege/updateHierarchy.do",
			data:{"targetId":targetNode.id,"sourceId":treeNodes[0].id,"moveType":moveType,"appNumber":appNumber},
			dataType:"json",
			type:"post",
			async:false,
			success:function(result){
				
			}
		});
	};
	function inittree(appnumber){
		//初始化权限树
		$('#tt').tree( {
			url : rootPath+'jasframework/privilege/privilege/getAllPrivilegeByAppnumber.do?appnumber='+appnumber,
			checked:true,
			dnd:true,
			animate:true,
			closable:false,
			onLoadSuccess:function(node,data) {
				//clearQueryForm('right',true,true,true,true);
				var appnumber=$("#appId1").combobox("getValue");
				$("#appId").val(appnumber);
				//加载成功后选中第一个节点
				var rootTarget=$('#tt').tree('getRoot');
				if(rootTarget!=null){
				 	$('#tt').tree('select',rootTarget.target);
					loadRight(data[0].id);
				}
			},
			onClick : function(node) {
				loadRight(node.id);
				if ( isRootNode(node) ) {
//					$("#P-PRI-0042").attr("disabled", "disabled");
				} else {
					$("#P-PRI-0043").removeAttr("disabled");
					$("#P-PRI-0041").removeAttr("disabled");
					$("#P-PRI-0042").removeAttr("disabled");
				}
			},
			onDragEnter:function(targetNode, source){
//				var target = $(this).tree('getNode', targetNode);
//				if(target.state=="closed"){
//					$(this).tree("expand",targetNode);
//				}
				return true;
			},
			onDragOver:function(target, source){
				return true;
			},
			onBeforeDrop:function(target, source, point){
				var targetId = $(this).tree('getNode', target).id;
				var sourceId = source.id;
				//获取source的父节点,如果源节点的父节点和目标节点相同，则不允许移动
				var node=$("#tt").tree("find",sourceId);
				var parent = $("#tt").tree("getParent",node.target);
				if(parent!=null&&parent.id==targetId&&point=="append"){
					return false;
				}
				var appNumber = $("#appId1").combobox("getValue");
				//菜单允许拖拽，其他不允许拖拽
				var privilegeType = source.attributes.privilegeType;
				var isUpdate = false;
				if(privilegeType>1&&privilegeType<=4){
					return false;
				}
				$.ajax({
					url:rootPath+"jasframework/privilege/privilege/isUpdateHierarchy.do",
					data:{"targetId":targetId,
						"sourceId":sourceId,
						"appNumber":appNumber,"point":point},
					success:function(result){
						isUpdate = result;
						if(!result){
							top.showAlert(getLanguageValue("tip"),getLanguageValue("pri.isHierarchyAllowedMove"),"info");
						}
					},
					async:false,
					dataType:"json"
					});
				
				return isUpdate;
			},
			onDrop:function(targetNode, sourceNode, point){
				var target = $(this).tree('getNode', targetNode);
				var targetId = target.id;
				var sourceId = sourceNode.id;
				var appNumber = $("#appId1").combobox("getValue");
				//alert(JSON.stringify(target));
				//var source = $(this).tree("getNode",sourceNode);
				var url=rootPath+"jasframework/privilege/privilege/updatePrivilegeHierarchy.do";
				$.post(url, 
						{"targetId":targetId,
						"sourceId":sourceId,
						"appNumber":appNumber,"point":point},
						function(result) {
						}
				);
			}
		});
		
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
	function savePrivilege() {
		var appId=$("#appId1").combobox("getValue");
		var treeObj = $.fn.zTree.getZTreeObj("tt");
		var nodes = treeObj.getSelectedNodes();
		var parentId;
		if (nodes != "") {
			parentId = nodes[0].id;
			url = "addPrivilege.htm?appId="+appId+"&parentId=" + parentId;
			top.getDlg(url, "saveiframe", getLanguageValue("add"), 700, 420);
		} else {
			top.getDlg("addPrivilege.htm?appId="+appId, "saveiframe", getLanguageValue("add"), 700, 370);
		}
	
	}
	/**
	 * 描述：修改按钮事件
	 */
	function updatePrivilege() {
		var oid;
//		var row = $('#tt').tree('getSelected');
//		if (row != null) {
		var treeObj = $.fn.zTree.getZTreeObj("tt");
		var nodes = treeObj.getSelectedNodes();
		if (nodes != "") {
			oid = nodes[0].id;
			url = "updatePrivilege.htm?oid=" + oid;
			top.getDlg(url, "saveiframe",getLanguageValue("edit"), 700, 370);
		} else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), 'info');
			return;
		}
	}
	
	/**
	 * 描述：检查权限是否被分配
	 */
	function checkPrivilege(){
//		var row = $('#tt').tree('getSelected');
//		if (row != null) {
		var treeObj = $.fn.zTree.getZTreeObj("tt");
		var nodes = treeObj.getSelectedNodes();
		if (nodes != "") {
		var oid=nodes[0].id;
	  	$.getJSON(rootPath+"jasframework/privilege/privilege/checkPrivilegeByeventId.do?oid="+oid+"&random=" + new Date().getTime(),function(check) {
			if (check.success=='-1' ){
				$.messager.confirm(getLanguageValue("tip"), check.msg+getLanguageValue("pri.continueConfirm"), function(r){
					if(r){
						removeUnit();
					}
				});
			} else if(check.success=='-2'){
				top.showAlert(getLanguageValue("pri.deletepri"), check.msg, 'error');
			}else{
				removeUnit();
			}
		});
		} else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), 'info');
			return;
		}
	}
	/**
	 * 描述：删除权限
	 */
	function removeUnit() {
//		var appId = $("#appId").combobox("getValue");
//		var row = $('#tt').tree('getSelected');
//		if (row != null) {
		var treeObj = $.fn.zTree.getZTreeObj("tt");
		var nodes = treeObj.getSelectedNodes();
		if (nodes != "") {
			$.messager.confirm(getLanguageValue("pri.deletepri"), getLanguageValue("pri.deleteconfirm"), function(r) {
				if (r) {
					var url = rootPath+'jasframework/privilege/privilege/deletePrivilegeById.do?oid=' + nodes[0].id;
					$.post(url, function(result) {
						if (result.status == 1) {
							top.showAlert(getLanguageValue("pri.deletepri"), getLanguageValue("deletesuccess"), 'ok', function() {
							
//								var parent11=$('#tt').tree('getParent',$('#tt').tree('getSelected').target);
//							
//								$('#tt').tree('remove',$('#tt').tree('getSelected').target);
//								if(parent11!=null){
//									loadRight(parent11.id);
//								}
//								var rootnode=$('#tt').tree('getRoot');
//								if(rootnode!=null){
//									$('#tt').tree('select',rootnode.target);
//								}
								reloadZtreeNode(nodes[0].id);
							});
									 	
	
						} else {
							top.showAlert(getLanguageValue("pri.deletepri"),result.msg + '', 'error');
							return;
						}
					}, 'json');
	
				}
			});
		} else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), 'info');
			return;
		}
	}
	function reloadchildren(nodeid){
		var treeObj = $.fn.zTree.getZTreeObj("tt");
		var node = treeObj.getNodeByParam("id", nodeid, null);
		var flag = node.isParent;
		//若获取的节点是功能菜单或可视化图层，则flag为true
		if(node.id == 'c3d97737-c088-4539-94c6-49277e1b3748' || node.id == '4020a14c-dccc-4e03-99f1-ec8d299421cf'){
			flag = true;
		}
		if(flag){
//			node.isParent = true;
			treeObj.reAsyncChildNodes(node, "refresh");
		}else{
			var parentNode = node.getParentNode();
			treeObj.reAsyncChildNodes(parentNode, "refresh");
		}
	}
	function reloadZtreeNode(nodeid){
		var treeObj = $.fn.zTree.getZTreeObj("tt");
		var node = treeObj.getNodeByParam("id", nodeid, null);
		var parentNode=node.getParentNode();
		treeObj.reAsyncChildNodes(parentNode, "refresh");
	}
	
	function reloadZtree(){
		var treeObj = $.fn.zTree.getZTreeObj("tt");
		treeObj.refresh();
	}

	function selectappsystem(){
		var appId=$("#appId1").combobox("getValue");
//		$.getJSON("./getAllPrivilegeByAppnumber.do?appnumber="+appnumber+"&random=" + new Date().getTime(), function(data){
//			$('#tt').tree('loadData',data);
//			});
//		inittree(appnumber);
		initzTree(appId);
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
	function loadRight(id){
		var url = rootPath+'jasframework/privilege/privilege/findPrivilegeById.do?oid='+id;
		$.post(url, function(bo) {
			$('#right').form('load', bo);
		}, 'json');
	}
	
