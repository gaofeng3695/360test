/** 
 * @file
 * @author  lujingrui
 * @desc 通用选择页面
 * @date  2017-09-13
 * @last modified by lujingrui
 * @last modified time  2017-09-13
 */
/**
 * 树类型：
 *   需传递参数：showType treeViewCode rootDataOid [select] [parentURL] [executeMethod] [checked]
 * 左侧树右侧数据列表
 * 	 需传递参数：showType treeViewCode rootDataOid [select]	[parentURL] [executeMethod] [checked]
 * 数据列表：
 * 	需传递参数：showType treeNodeId oid	[parentURL] [executeMethod]
 * 
 */
var showType = "";//显示选择的类型 1树，2左侧树右侧tab页数据列表，3数据列表

var treeViewCode = "";//树显示的组织类型

var rootDataOid = "";//组织根节点s

var treeId = "";//不同显示类型的树的id

var select = "";//多选 multi(单选不用写)

var isFirstLoad = 0;//初次加载树

var parentURL = "";//父页面的地址（如aaa.html,则parentURL为aaa），主要用于获取改页面对象

var executeMethod = "";//执行保存操作的方法（如不传则只保存在localstorage里）

var datagridId = "";

var checked = "";

/**
 * @desc 初始化
 */
$(function(){

	var multiSelect = false;//是否多选
	
	showType = getParamter("showType");
	
	treeViewCode = getParamter("treeViewCode");
	
	rootDataOid = getParamter("rootDataOid");
	var oidList = [];
	if(rootDataOid){
		oidList = rootDataOid.split("_");
	}
	
	parentURL = getParamter("parentURL");
	
	executeMethod = getParamter("executeMethod");
	
	select = getParamter("select");
	if(select == "multi"){
		multiSelect = true;
	}
	
	checked = getParamter("checked");
	
	if(showType == 1){
		$("#secondType").hide();
		treeId = "firstTypeTree";
		$("#firstType").show();
		loadTree(treeId,treeViewCode,oidList,multiSelect);
	}else if(showType == 2){
		treeId = "secondTypeTree";
		datagridId = "secondDg";
		loadTree(treeId,treeViewCode,oidList,multiSelect,datagridId);
		$('#main').layout('resize');
		$(window).resize(function(){
			$('#contentArea').height($(window).height()-46);
			$('#main').layout('resize');
		});
	}else if(showType == 3){
		$('#beforeShow').hide();
		$("#secondType").hide();
		$("#thirdType").show();
		datagridId = "thirdDg";
		var treeNodeId = getParamter("treeNodeId");//组织机构类型id
		var oid = getParamter("oid");//该组织机构id
		loadDatagrid(oid,datagridId);
		$('#main').layout('resize');
		$(window).resize(function(){
			$('#contentArea').height($(window).height()-46);
			$('#main').layout('resize');
		});
	}
});

/**
 * 加载树
 * @param treeId
 * @param treeViewCode
 * @param oidList
 * @param multiSelect
 * @returns
 */
function loadTree(treeId,treeViewCode,oidList,multiSelect,datagridId){
	//加载树
	$('#'+treeId).tree({
	    url:rootPath+'treeView/getRootData.do',
	    queryParams:{
	    	"treeViewCode":treeViewCode,
	    	"oidList":oidList
	    },
	    checkbox:multiSelect,
	    onBeforeLoad:function(node,param){
			$('#beforeShow').dialog({
				title: '',
			    width: 400,
			    height: 150,
			    closed: false,
			    cache: false
			});
		},
	    onBeforeExpand:function(node,param){
	    	//重置请求参数
            $('#'+treeId).tree('options').queryParams = {
            	"parentTreeNodeId":node.attributes.treeNodeId,
            	"parentOid":node.id
            }
	    	//重置请求地址
            $('#'+treeId).tree('options').url = rootPath+'treeView/getChildData.do';
            return true;
	    },
	    onLoadSuccess:function(node,data){
	    	$('#beforeShow').dialog('close');
	    	if(checked){
	    		var myStorage = localStorage;
				var rows = JSON.parse(myStorage.getItem('treeCheckedData'));
	    		for(var i = 0 ;i<rows.length;i++){
					var node = $('#'+treeId).tree('find', rows[i].EVENTID);
					$('#'+treeId).tree('check', node.target);
				}
				myStorage.removeItem('treeCheckedData');
	    	}else{
	    		if(isFirstLoad == 0){
		    		//动态修改左侧树的title
		    		$('#main').layout('panel', 'west').panel({ title: data[0].attributes.treeNodeName});
		    		//加载成功后默认选中第一个节点
		    		$('#'+treeId).tree('select',$('#'+treeId).tree('getRoots')[0].target);
			    	isFirstLoad++;
		    	}
	    	}
	    },
	    onSelect:function(node){
	    	if(showType == 2){
	    		loadDatagrid(node.id,datagridId);
	    	}
	    },
	    loader:function(param,success,error){
	    	var opts = $('#'+treeId).tree('options');
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
 * 加载数据网格化列表
 * @returns
 */
function loadDatagrid(oid,datagridId){
	$.ajax({  
        type : 'get',  
//        url :rootPath+'treeView/getFieldList.do?treeNodeId='+treeNodeId,  
        url :rootPath+'/dataList/getFieldList.do?dataListCode=userListByUnit',  
        dataType : 'json',  
        contentType : 'application/json;charset=utf-8', 
        success : function(data) {
        	var rows = data.rows;
        	rows.unshift({field:'ck',checkbox:true});
        	$('#'+datagridId).datagrid({
        		fit: true, 
        		method:'post',
        	    url:rootPath+'/dataList/getListData.do',
        	    queryParams: {
        	    	dataListCode: "userListByUnit",
        	    	oid: oid
        		},
        	    columns:[rows],
        	    loader:function(param,success,error){
        	    	var opts = $('#'+datagridId).datagrid('options');
        	    	$.ajax({  
                        type : opts.method,  
                        url : opts.url,  
                        dataType : 'json',  
                        contentType : 'application/json;charset=utf-8', // 设置请求头信息  
                        data : JSON.stringify(param),  
                        success : function(data) {  
                            success(data);                  
                        }  
                    });  
        	    },
        	    onLoadSuccess:function(){
        	    	if(showType == 2){
        	    		initDatagrigHeight(datagridId,'','0',"dataTabs .tabs-panels > div");
        	    	}else if(showType == 3){
        	    		initDatagrigHeight(datagridId,'','0',"thirdType");
        	    	}
        	    }
        	});
        }  
    });  
}

/**
 * 点击保存执行操作
 * @returns
 */
function save(){
	var returnData = [];
	if(showType == 1){
		if(select == "multi"){
			var data = $('#'+treeId).tree('getChecked');
			for(var i=0;i<data.length;i++){
				returnData.push({"oid":data[i].id,"displayName":data[i].text});
			}
		}else{
			var data = $('#'+treeId).tree('getSelected');
			returnData.push({"oid":data.id,"displayName":data.text});
		}
	}else if(showType == 2 ){
		var data = $('#'+datagridId).datagrid("getChecked");
		for(var i=0;i<data.length;i++){
			returnData.push({"oid":data[i].oid,"displayName":data[i].name});
		}
	}else if(showType == 3){
		var data = $('#'+datagridId).datagrid("getChecked");
		for(var i=0;i<data.length;i++){
			returnData.push({"oid":data[i].oid,"displayName":data[i].name});
		}
	}
	if(returnData.length>0){
		var myStorage = localStorage;
		myStorage.setItem('commonSelectData', JSON.stringify(returnData));
		if(!isNull(executeMethod)){
			var parentObject = getDcumentObject(parentURL+".html");
			parentObject.commonSelectSave(executeMethod);
		}
		closePanel();
	}else{
		top.showAlert("提示", "请至少选择一条数据", 'info');
	}
}

/**
 * 关闭弹窗
 * @returns
 */
function closePanel() {
	top. closeDlg("commonSelectPanel");
}