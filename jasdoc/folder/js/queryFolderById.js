//var folderId = getParameter("folderId");
var folderId="1e6c6f4e-bd0b-47f7-8420-c2250956678c";
var folderLocationName = null;
var allOrOnlyDocFileValue = false;
/**
 * 页面初始化
 */
$(function(){
	var width = $('body').width();
	$('#tt').tree({		
		url: '../folder/getLeftFolderTree.do?folderId='+folderId,
		onLoadSuccess:function(node,data) {
		 	var aa=$('#tt').tree('select',$('#tt').tree('getRoot').target);
			var url = "../doccenter/getAllDoc.do?folderId=" + folderId;
			getChildren();
			$("#10060201").datagrid("options").url = url;
			$("#10060201").datagrid('load'); 
		},
		onClick:function(node){
			$("#10060201").datagrid('clearSelections'); // clear
			queryDocByConditions();
		}
	});
	
	var queryDocUrl = "../doccenter/getAllDoc.do?folderId=" + folderId;
	//datagrid初始化
  	$("#10060201").datagrid({
		nowrap : true,
		striped : true,
		pagination:true,
		rownumbers:true,
		autoRowHeight: false,
		fitColumns:true,
		columns:[[{field : 'ck',title : '全选',checkbox : true}, 
		            {field : 'filename',title : '文档名称',width : 0.18 * width}, 
		            {field : 'fileno',title : '文档编号',width : 0.07 * width},  
		            {field : 'author',title : '文档作者',width : 0.08 * width,hidden:true}, 
		            {field : 'createusername',title : '上传人',width : 0.08 * width}, 
		            {field : 'keyword',title : '关键词',width : 0.07 * width}, 
		            {field : 'filetype',title : '文档格式',width : 0.06 * width},
		            {field : 'docactualLocation',title : '文档位置',width : 0.18 * width}, 
		            {field : 'filesizeStr',title : '文档大小(kb)',width : 0.09 * width},
		            {field : 'versionnumber',title : '版本号',width : 0.05 * width},
		            {field : 'versionid',title : '历史版本ID',width : 0.07 * width,hidden:true},
					{field:  'createuser',title:'上传者id',width:0.07*width,hidden:true},
					{field : 'eventid',hidden:true}, 
					{field : 'hierarchyRole',hidden:true}, 
					{field : 'favoritefileid',hidden:true},
					{field : 'manager',title : '操作',width : 0.15 * width,formatter:function(value,rowData,rowIndex){
						return getManagerFieldButton(rowData,true);
					  }} 
					]],
			title:"文档列表",
		 	url:queryDocUrl,
			onDblClickRow : function(index, rowData) {
				var eventid = rowData.eventid;
				var fileType = rowData.filetype;
				if(fileType!=null&&fileType!=""){
					if(previewFileType.indexOf(fileType.toLocaleLowerCase())>-1){
						Preview(eventid);
					}else{
						$.messager.alert('提示', "暂时不支持这种类型文档的预览功能！", "info");
					}
				}
			},
			onLoadSuccess:function(data){
				if(folderLocationName==null){
					folderLocationName = data.folderLocationName;
				}
		    	$('#10060201').datagrid('clearSelections'); //clear selected options
		    }
		});
  	
	  	/**
	  	 * 页面自适应
	  	 */
	  	tempWidth = $('#userquery').css('width');
		if(tempWidth.lastIndexOf('px')>0){
			tempWidth = parseInt(tempWidth.substring(0,tempWidth.length-2))+4;
		}
   		initDatagrigHeight('10060201','userquery','65','right');
   		initResize();
		
	});
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	var div_left_width = 200;
	var tempWidth = 0;
 	/**
 	 * 描述：页面自适应
 	 */
	
	$(window).bind("resize",function(){
		resizeLayout();
	});
	
	
	function resizeLayout(){
		try{
			clientWidth = document.documentElement.clientWidth;
			var div_left_width = $("#left").width()+11;
			$("#cc").layout("resize");
			$('#userquery').panel('resize',{width:clientWidth-div_left_width}); 
			$('#10060201').datagrid('resize',{width:clientWidth-div_left_width});
			
			$('#userrange').combobox({
				width :  $('#right').width() * 0.35
			});
		}catch(e){
			
		}
	}
 	function initResize(){
 		//自动适应页面大小
		$(".layout-button-left").bind("click",function(){
			$('#userquery').panel('resize',{width:clientWidth-28});
			$('#10060201').datagrid('resize',{width:clientWidth-28});
			$(".layout-button-right").bind("click",function(){
				$('#userquery').panel('resize',{width:tempWidth}); 
				$('#10060201').datagrid('resize',{width:tempWidth});
			});
		});
 	}
 	
 	
/**
 * 描述：根据查询条件，查询文档信息
 */
function queryDocByConditions(){
	$("#10060201").datagrid('clearSelections'); // clear
	var filename = $("#filename").val();	
	var filetype = $("#filetype").val();
	var uploadtime_start = $("#uploadtime_start").val();
	var uploadtime_end = $("#uploadtime_end").val();
	var fileno = $("#fileno").val();
	var keyword = $("#keyword").val();
	var query={"filename":filename,"filetype":filetype,"uploadtimeStart":uploadtime_start,"uploadtimeEnd":uploadtime_end,"fileno":fileno,"keyword":keyword,"allOrOnlyDocFile":allOrOnlyDocFileValue};
	var row = $('#tt').tree('getSelected');
	var url;
	if (row != null ){	
		url="../doccenter/getAllDoc.do?folderId=" + row.id;
		$("#10060201").datagrid("options").url = url;
		$("#10060201").datagrid('options').queryParams=query;
		$("#10060201").datagrid('load');	
		$("#10060201").datagrid('options').queryParams=null;
	 }else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		return;
	}
}
/**
 * 描述：清空查询条件
 */
function clearQueryConditions(){
	$("#filename").val("");
	$("#filetype").val("");
	$("#uploadtime_start").val("");
	$("#uploadtime_end").val("");
	$("#fileno").val("");
	$("#keyword").val("");
}
 	

function getChildren(){
	var node = $('#tt').tree('getSelected');
    if (node) {
        var children = $('#tt').tree('getChildren', node.target);
    }
    else {
        var children = $('#tt').tree('getChildren');
    }
    var s = "'";
    for (var i = 0; i < children.length; i++) {
        s += children[i].id + "','";
    }
    s+=node.id + "'";
    //alert(s);
    return s;
}


/**
 * 方法描述：文档打包下载
 */
function zipDownloadDocByFolderId(){
	var rows = $('#10060201').datagrid('getSelections');
	if (rows.length > 0){
		var ids="";
		for(var i=0;i<rows.length;i++){
			ids += "'"+rows[i].eventid+"',";
		}
		ids=ids.substring(0, ids.lastIndexOf(","));
		var lastIndes = folderLocationName.lastIndexOf("/")+1;
		var folderName=folderLocationName.substring(lastIndes);
		$("<iframe id=\"zipDownloadDoc\" style=\"display: none;\"></iframe>").appendTo("body");
		var url="../doccenter/zipDownloadDoc.do?zipDownloadDoceventid="+ids+"&folderName="+folderName+"&token="+ localStorage.getItem("token");
		$("#zipDownloadDoc").attr("src",url);
	}else{
		$.messager.alert('提示','请选择记录！','info');
	}
	
}

/**
 * 方法描述：是否查看所有子文件夹的文档
 */
function getAllDocFileByFolderId(){
	if($('#checked').attr("checked")){
		allOrOnlyDocFileValue=true;
		$('#checked').removeAttr("checked");//
	}else{
		$('#checked').attr("checked",'true');//
		allOrOnlyDocFileValue=false;
	}
	if(allOrOnlyDocFileValue){
		allOrOnlyDocFileValue = false;
		$("#allOrOnlyDocInfo").text("显示当前文件夹中文档");
	}else{
		allOrOnlyDocFileValue = true;
		$("#allOrOnlyDocInfo").text("显示所有子文件夹中文档");
	}
	var query={"allOrOnlyDocFile":allOrOnlyDocFileValue}; 			//把查询条件拼接成JSON
	$("#10060201").datagrid('options').queryParams=query; 				//把查询条件赋值给datagrid内部变量
	$("#10060201").datagrid('load'); 										//重新加载 
}
function getAllDocFileDataByFolderId(){
	if($('#checked').attr("checked")){
		allOrOnlyDocFileValue = true;
		$("#allOrOnlyDocInfo").text("显示所有子文件夹中文档");
	}else{
		allOrOnlyDocFileValue = false;
		$("#allOrOnlyDocInfo").text("显示当前文件夹中文档");
	}
	var query={"allOrOnlyDocFile":allOrOnlyDocFileValue}; 			//把查询条件拼接成JSON
	$("#10060201").datagrid('options').queryParams=query; 				//把查询条件赋值给datagrid内部变量
	$("#10060201").datagrid('load'); 										//重新加载 
}

/**
 *	方法描述：获取【操作】字段对应按钮
 *	@param rowData	操作字段对应按钮所在行的数据
 *	@param isDocCenter	是否有【版本更新】和【文件关联】两个按钮
 *	@param isShare	是否有【共享详情】按钮
 */
function getManagerFieldButton(rowData,isDocCenter){
	var eventid=rowData.eventid;
	var role=rowData.hierarchyRole;
	var managerField="<img src='../../common/images/tip.png' title='查看'  style='cursor:hand' onclick='showInfo(\""+eventid + "\")'>	"; 
	if(role>=20){
		var fileType = rowData.filetype;
		if(fileType!=null&&fileType!=""){
			if(previewFileType.indexOf(fileType.toLocaleLowerCase())>-1){
				managerField+="<img src='../../common/images/preview.png' title='预览'style='cursor:hand' onclick='Preview(\""
					+ eventid
					+ "\")'>	";
			}else{
				managerField+="<img src='../../common/images/preview.png' title='预览'style='cursor:hand' onclick='previewFileTypeInfo()'>	";
			}
		}
	}
	if(role>=30){
		managerField+="<img src='../../common/images/download.png' title='下载'style='cursor:hand'  onclick='downloadDoc(\""
			+ eventid
			+ "\")'>	";
	}
	return managerField;
}

	
