/** 
 * @file
 * @author  lujingrui
 * @desc 左侧树右侧tab页通用页面
 * @date  2017-09-12
 * @last modified by lujingrui
 * @last modified time  2017-09-12
 */
var isFirstLoad = 0;//是否是第一次加载树
var treeViewCode ="";//树类型
var rootDataOid = "";//根节点
var oidList =[];//根节点
var isReload = false;//是不是重新加载树
var currentSelectNode = "";//当前选择的树的节点

var currentJsList = [];//存放上一次添加的js

$(function(){
	setHeight();
	
	treeViewCode = getParamter("treeViewCode");
	rootDataOid = getParamter("rootDataOid");
	if(!isNull(rootDataOid)){
		oidList = rootDataOid.split("_");
	}
	
	loadTree(treeViewCode,oidList);
	
	$(window).resize(function(){
		setHeight();
	});
	
});

/**
 * layout自适应
 * @returns
 */
function setHeight(){
	var c = $('#main');
	var p = c.layout('panel','center');	// get the center panel
	var oldHeight = p.panel('panel').outerHeight();
	p.panel('resize', {height:'auto'});
	var newHeight = p.panel('panel').outerHeight();
	c.layout('resize',{
		height: (c.height() + newHeight - oldHeight)
	});
	var height = $("#right").height()-$("#toolbar").height()-13;
	var tab = $('#dataTabs').tabs('getSelected');
	var index = $('#dataTabs').tabs('getTabIndex',tab);
	$('#dataTabs').tabs({
		"height":height
	});
	$("#dataTabs").tabs("select",index);
}

/**
 * 加载左侧树
 * @param treeViewCode
 * @param oidList
 * @returns
 */
function loadTree(treeViewCode,oidList){
	var params = {"treeViewCode":treeViewCode};
	if(!isNull(oidList)){
		params.oidList = oidList;
	}
	//加载树
	$('#dataTree').tree({
	    url:rootPath+'treeView/getRootData.do',
	    queryParams:params,
	    onBeforeExpand:function(node,param){
	    	//重置请求参数
            $('#dataTree').tree('options').queryParams = {
            	"parentTreeNodeId":node.attributes.treeNodeId,
            	"parentOid":node.id
            }
	    	//重置请求地址
            $('#dataTree').tree('options').url = rootPath+'treeView/getChildData.do';
            return true;
	    },
	    onLoadSuccess:function(node,data){
	    	if(isFirstLoad == 0){
	    		//动态修改左侧树的title
	    		$('#main').layout('panel', 'west').panel({ title: data[0].attributes.treeNodeName});
	    		//加载成功后默认选中第一个节点
		    	$('#dataTree').tree('select', $('#dataTree').tree('getRoots')[0].target);
		    	isFirstLoad++;
	    	}
	    	if(isReload == true){
	    		$('#dataTree').tree('select', $('#dataTree').tree('getRoots')[0].target);
	    		isReload = false;
	    	}
	    	//$('#dataTree').tree('expandAll');
	    },
	    onSelect:function(node){
	    	currentSelectNode = node.id;
	    	loadJsList(node.attributes.treeNodeId);
	    	loadButtons(node.attributes.treeNodeId);
	    	loadTabs(node.attributes.treeNodeId,node.id);
	    },
	    loader:function(param,success,error){
	    	var opts = $('#dataTree').tree('options');
	    	$.ajax({  
                type : opts.method,  
                url : opts.url,  
                dataType : 'json',  
                contentType : 'application/json;charset=utf-8', // 设置请求头信息  
                data : JSON.stringify(param),  
                success : function(data) { 
                    success(data.rows);                  
                }  
            });  
	    }
	});
}

/**
 * 刷新整个树
 * @returns
 */
function reloadTree(){
	isReload = true;
	$("#dataTree").tree("options").url=rootPath+'treeView/getRootData.do';
	$('#dataTree').tree('options').queryParams = {
		"treeViewCode":treeViewCode,
	    "oidList":oidList
     }
    $("#dataTree").tree("reload");
}

/**
 * 刷新单个节点
 * @param nodeId
 * @param isReloadParent
 * @returns
 */
function reloadNode(nodeId,isReloadParent){
	if(isReloadParent){
		var node = $('#dataTree').tree('find', nodeId);
		var parentNode = $('#dataTree').tree('getParent', node.target);
		$('#dataTree').tree('reload', parentNode.target);
		$('#dataTree').tree('select', parentNode.target);
	}else{
		var node = $('#dataTree').tree('find', nodeId);
		$('#dataTree').tree('reload', node.target);
		$('#dataTree').tree('select', node.target);
	}
}

function addNewNode(parentNodeId,nodeId,nodeText){
	var node = $('#dataTree').tree('find', parentNodeId);
	$('#dataTree').tree('append', {
		parent: node.target,
		data: [{
			id: nodeId,
			text: nodeText
		}]
	});
}

/**
 * 获取tab页数据列表，并创建tab页
 * @param treeNodeId
 * @returns
 */
function loadTabs(treeNodeId,oid){
	$.ajax({  
        type : 'get',  
        url :rootPath+'treeView/getTabList.do?treeNodeId='+treeNodeId,  
        dataType : 'json',  
        contentType : 'application/json;charset=utf-8', 
        success : function(data) {  
        	creatTabs(data.rows,oid,treeNodeId);                 
        }  
    });  
}

/**
 * 创建tab页
 * @param tabsList
 * @returns
 */
function creatTabs(tabsList,oid,treeNodeId){
	setHeight();
	//关闭已经存在的tab页
	var count = $('#dataTabs').tabs('tabs').length;
	for(var i=count-1; i>=0; i--){
		$('#dataTabs').tabs('close',i);
	}
	//循环tab列表，动态创建tab页
	for(var i=0;i<tabsList.length;i++){
		// 添加一个新的标签页面板（tab panel）
		$('#dataTabs').tabs('add',{
		    title:tabsList[i].name,
		    fit:true,
		    selected: false,
		    content:'<iframe style="width:100%;height:100%" id ="iframeTabs_'+i+'"></iframe>'
		});
	}
	//tab页添加点击事件，点击再加载tab页的内容
	$('#dataTabs').tabs({
		onSelect:function(title,index){
			if(isNull($("#iframeTabs_"+index).attr("src"))){
				$("#iframeTabs_"+index).attr("src",rootPath+tabsList[index].url+'?oid='+oid+'&treeNodeId='+treeNodeId);
			}
		}
	})
	//默认选中第一个选项卡
	$('#dataTabs').tabs('select',0);
}

/**
 * 加载并创建按钮
 * @returns
 */
function loadButtons(treeNodeId){
	$("#toolbar").empty();
	$.getJSON(rootPath+"/treeView/getButtonList.do",{"treeNodeId":treeNodeId}).done(function(res){
		var data= res.rows;
		var htmlStr = "";
		for(var i=0;i<data.length;i++){
			htmlStr +='<a href="#" class="'+data[i].icon+' easyui-linkbutton" onclick='+data[i].action+'><span>'+data[i].name+'</span></a>';
		}
		$("#toolbar").html(htmlStr);
	});
}

/**
 * 动态循环添加js脚本
 * @param treeNodeId
 * @returns
 */
function loadJsList(treeNodeId){
	$.getJSON(rootPath+"/treeView/getJsList.do",{"treeNodeId":treeNodeId}).done(function(res){
		var data= res.rows;
		for(var i=0;i<data.length;i++){
			if(currentJsList.indexOf(data[i]) == -1){
				addScript(rootPath+"/"+data[i]);
				currentJsList.push(data[i]);
			}
		}
	});
}

/**
 * 添加js脚本
 * @param src
 * @returns
 */
function addScript( src ) {
	var s = document.createElement( 'script' );
	s.setAttribute( 'src', src );
	document.body.appendChild( s );
}