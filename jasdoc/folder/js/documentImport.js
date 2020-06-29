var foldertype = "1";
var folderId = "";
var tempNode;

//页面初始化
$(function() {
	folderId=getParamter("folderId");
	setZtreecss();
	initZtree();
	$(window).resize(function(){
		setTextboxWidth("foldrname",0.75);
		setPanelHeight();
	});
}); 
function initZtree(){
	$.ajax({
		url: rootPath+"jasdoc/folder/doccenter/queryDocCenterFolderForSync.do",
		dataType:"json",
		type:'post',
		success:function(result){
			$.fn.zTree.init($("#floderZtree"), {
				check: {
					enable: false
				},data: {
					simpleData: {
						enable: true,
						idKey: "id",
					}
				},callback: {
					beforeClick: zTreeBeforeClick,
					onExpand: zTreeOnExpand,
					onCollapse: zTreeOnCollapse
				}
			}, result);
			selectFoderNode();
		}
	});
}
function zTreeBeforeClick(treeId, treeNode, clickFlag){
//	alert(JSON.stringify(treeNode));
	var parentNode=treeNode.getParentNode();
	if(parentNode==null){
		$.messager.alert("提示","根节点不能存放文档","info");
	}else{
		$("#foldrname").textbox("setText",treeNode.name);
		$("#foldreeventid").val(treeNode.id);
		$("#floderZtreeDiv").panel("collapse");
		$(document).unbind("mouseup");
	}
}
function zTreeOnExpand(event,treeId, treeNode){
	setPanelHeight();
}
function zTreeOnCollapse(event,treeId, treeNode){
	setPanelHeight();
}
function setZtreecss(){
	$("#foldrname").textbox({
		icons: [{
			iconCls:'icon-combo',
			handler: function(e){
				$("#foldrname").textbox("textbox").focus();
			}
		}],
		onResize:function(width,height){
			$("#floderZtreeDiv").panel('resize', {
				width : width
			});
		}
	});
	var width=setTextboxWidth("foldrname",0.75);
//	$("#foldrname").textbox("button").css("background-color","#E0ECFF");
//	alert($("#foldrname").textbox("button").css("background"));
	$("#floderZtreeDiv").panel({
		collapsed:true,
		width:width,
		height:"auto",
		onBeforeExpand:function(){
			setPanelHeight();
		}
	});
	$("#foldrname").textbox("textbox").unbind().bind({
		focusin:function(){
			$("#floderZtreeDiv").panel("expand");
		},focusout:function(){
	    	$(document).bind('mouseup',function(e){
	    		var p=$(e.target).closest("#floderZtreeDiv");
	    		var isExpand=$("#floderZtreeDiv").is(":visible");
	    		if(p.length==0 && isExpand){
	    			$("#floderZtreeDiv").panel("collapse");
	    				$(document).unbind("mouseup");
	    		}
	    	});
		}
	});
}
function setPanelHeight(){
	var textboxObj=$("#foldrname").textbox("textbox");
	var offset=textboxObj.offset();
	var top=offset.top+$("#foldrname").outerHeight()-1;
	$("#floderZtreeDiv").css("top",top);
	$("#floderZtreeDiv").css("left",offset.left-1);
	
	var opts=$("#foldrname").textbox("textbox");
	var panelHeight=$("#floderZtreeDiv").panel("options").height;
	var treeHeight=$("#floderZtree").height();
	var maxHieght=$(window).outerHeight()+$(document).scrollTop()-opts.offset().top-opts.outerHeight()-$(".button_area_absolute").height();
	if(panelHeight=="auto" || typeof(panelHeiht)==undefined){
		if($("#floderZtreeDiv").offset().top>maxHieght){
			maxHieght=$("#floderZtreeDiv").offset().top;
		}
	}else if(treeHeight<maxHieght && treeHeight!=0){
		maxHieght=treeHeight+10;
	}
	$("#floderZtreeDiv").panel('resize', {
		height : maxHieght+5
	});
}
function selectFoderNode(){
	var treeObj = $.fn.zTree.getZTreeObj("floderZtree");
	var node = treeObj.getNodeByParam("id", folderId, null);
	$("#foldrname").textbox("setText",node.name);
	$("#foldreeventid").val(node.id);
	treeObj.selectNode(node);
}
function setTextboxWidth(textboxId,width,containerObjId){
	var containerObjWidth;
	if(containerObjId && containerObjId!=""){
		containerObjWidth=$("#"+containerObjId).width();
	}else{
		containerObjWidth=document.documentElement.clientWidth;
	}
	var textBoxWidth=containerObjWidth*width-3;
	$("#"+textboxId).textbox("resize",textBoxWidth);
	return textBoxWidth;
}
function initParam() {
	var menuUrl = this.location.search;
	if (menuUrl != null && "" != menuUrl) {
		var p = menuUrl.substr(1).split("&");
		$.each(p, function(i, item) {
			var d = item.split("=");
			if (d[0] == 'folderId') {
				folderId = d[1];
			}
		});
	}
}

/**
 * 取消操作
 */
function closeWindow(){
	parent.closeDlg("documentImport");
}

/**
 * 执行导入文档操作
 */
function documentImport(){
	showLoadingMessage("正在执行文档导入操作，请稍后！");
	$('#saveHistory').form('submit', {
		url : "../doccenter/documentImport.do?token="+localStorage.getItem("token"),
		dataType : "json",
		onSubmit : function() {
			if(!($(this).form('validate'))){
				hiddenLoadingMessage();
			}
			return $(this).form('validate');
		},
		success : function(result) {
			hiddenLoadingMessage();
			result = jQuery.parseJSON(result);
			if (result.success){
				parent.reloadDataTree(null,3);
				$.messager.alert("提示", result.msg, "info");
			} else {
				$.messager.alert('错误',result.msg,result.error);
			}
		}
	});
}



/**	
 * 方法描述：加载初始化树
 */
function queryTree(){
	folderId=getParamter("folderId");
	$('#foldrname').combotree({
		url:rootPath+"jasdoc/folder/doccenter/queryDocCenterFolder.do?token="+localStorage.getItem("token"),
		panelHeight:"auto",
		onBeforeExpand:function(node){
			var url=rootPath+"jasdoc/folder/doccenter/getChildren.do";
		 	$('#foldrname').combotree("tree").tree("options").url= url+"?folderId="+node.id;
			node.iconCls= 'icon-tree-center-node-open';
		 	$('#foldrname').combotree("tree").tree('update', node);
		},
		onClick:function(node){
			if( node.id == docCenterFolderId ){
				$.messager.alert('提示',"文档中心下不允许存放文档",'info');
				$('#foldrname').combotree("clear",node);
			}
		},onBeforeCollapse: function(node){
			node.iconCls= 'icon-tree-center-node-close';
			$('#foldrname').combotree("tree").tree('update', node);
		},onLoadSuccess:function(node, data){

		}
	}); 
}


function findTempNode(data){
	var children = JSON.stringify(data.children);
	if(children.length()>0){
		for (var i = 0; i < children.length(); i++) {
	        var node = children[i];
	        var id = node.id;
	        if(id==folderId){
	        	tempNode = node;
	        	break;
	        }else{
	        	findTempNode(node);
	        }
	    }
	}
}

//function browseFolder(path) {
//    try {
//        var Message = "\u8bf7\u9009\u62e9\u6587\u4ef6\u5939"; //选择框提示信息
//        var Shell = new ActiveXObject("Shell.Application");
//        var Folder = Shell.BrowseForFolder(0, Message, 64, 17); //起始目录为：我的电脑
//        //var Folder = Shell.BrowseForFolder(0, Message, 0); //起始目录为：桌面
//        if (Folder != null) {
//            Folder = Folder.items(); // 返回 FolderItems 对象
//            Folder = Folder.item(); // 返回 Folderitem 对象
//            Folder = Folder.Path; // 返回路径
//            if (Folder.charAt(Folder.length - 1) != "\\") {
//                Folder = Folder + "\\";
//            }
//            document.getElementById(path).value = Folder;
//            return Folder;
//        }
//    }
//    catch (e) {
//        alert(e.message);
//    }
//}
function changePirctureUrl(){
//	var fd=null;
//	try{
//		fd = new ActiveXObject("MSComDlg.CommonDialog.1");
//		fd.FilterIndex = 3;
//		fd.CancelError=true;
//		fd.Filter = "All Files (*.*)|*.*";
//		fd.MaxFileSize = 128;
////		fd.FileName = '你要保存的默认文件名';
//		fd.ShowSave();
//	}catch(e){
//		alert(e);
//		return ;
//	}
//	if(fd!=null){
//		var patch=fd.FileName;
//		alert(patch);
//		var int=patch.lastIndexOf("\\");
//		var url=patch.substring(0, int);
//		var pirctureName=patch.substring(int+1, patch.length);
//		$("#pirctureUrl").val(url);
//		$("#pictureName").val(pirctureName);
//	}
	 try {
	        var Message = "\u8bf7\u9009\u62e9\u6587\u4ef6\u5939"; //选择框提示信息
	        var Shell = new ActiveXObject("Shell.Application");
	        var Folder = Shell.BrowseForFolder(0, Message, 64, 17); //起始目录为：我的电脑
	        //var Folder = Shell.BrowseForFolder(0, Message, 0); //起始目录为：桌面
	        if (Folder != null) {
	            Folder = Folder.items(); // 返回 FolderItems 对象
	            Folder = Folder.item(); // 返回 Folderitem 对象
	            Folder = Folder.Path; // 返回路径
	            if (Folder.charAt(Folder.length - 1) != "\\") {
	                Folder = Folder + "\\";
	            }
//	            document.getElementById(path).value = Folder;
	            $("#localPath").attr("value",Folder);
	            return Folder;
	        }
	    }
	    catch (e) {
	        alert(e.message);
	    }
}