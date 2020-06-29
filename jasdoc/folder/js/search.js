//可以打包为js文件
var state;
$(document).ready(function(){
	var width=$("#platformlocalcon").width();
	$("#searchbox").panel({
		collapsed:true,
		width:width
	});
	$("#searchstring").keyup(function(event){
		var myevent = event || window.event;
		var mykeyCode= myevent.keyCode;
		var keyword=$("#searchstring").val();
		if(mykeyCode==13 && keyword!=""){
			searchFileBycontent();
		}
	});
});

/**
 * 方法描述：属性搜索
 * 
 * @returns {Boolean}
 */
function searchFile(){
	var uploadtimeStart=$("#uploadtimeStart").val();
	var uploadtimeEnd=$("#uploadtimeEnd").val();
	var filename=$("#filename").val();	
	var fileno=$("#fileno").val();
	var summary=$("#summary").val();
	var remark=$("#remark").val();
	var keyword=$("#keyword").val();	
	var filepath=$("#filepath").val();	
	if(uploadtimeStart!=null&&uploadtimeStart!=""&&uploadtimeEnd!=null&&uploadtimeEnd!=""){
		if(uploadtimeStart>uploadtimeEnd){
			$.messager.alert('提示','前面上传时间不能大于后面上传时间','info');
			return false;
		}
	}
	var fileclassify=$('#fileclassify').combotree('getValues');
	var fileclassifys="";
	if(fileclassify.length>0){
		for(var j=0;j<fileclassify.length-1;j++){
			fileclassifys+=fileclassify[j]+",";
		}
		fileclassifys+= fileclassify[fileclassify.length-1];
	}
	else{
		fileclassifys="";
	}
//	tab.openTab('ca60e123-d25e-4e93-8274-7be9912048ec','文档中心',"../../jasdoc/folder/docCenter/queryDocCenter.htm?folderId="+docCenterFolderId+"&foldertype=4"+
//		 	"&filename="+encodeURI(encodeURI(filename))+"&fileno="+encodeURI(encodeURI(fileno))+"&keyword="+encodeURI(encodeURI(keyword))+"&summary="+encodeURI(encodeURI(summary))+"&remark="+encodeURI(encodeURI(remark))+"&fileclassifys="+fileclassifys+"&uploadtimeStart="+uploadtimeStart+""+
//			"&uploadtimeEnd="+uploadtimeEnd+"&filepath="+encodeURI(encodeURI(filepath))+"",true,true);
	initMessage("selectType=4"+
		 	"&filename="+encodeURI(encodeURI(filename))+"&fileno="+encodeURI(encodeURI(fileno))+"&keyword="+encodeURI(encodeURI(keyword))+"&summary="+encodeURI(encodeURI(summary))+"&remark="+encodeURI(encodeURI(remark))+"&fileclassifys="+fileclassifys+"&uploadtimeStart="+uploadtimeStart+""+
			"&uploadtimeEnd="+uploadtimeEnd+"&filepath="+encodeURI(encodeURI(filepath))+"");
	 $("#searchbox").panel('collapse');
	
}

/**
 * 方法描述:清空
 * 
 */
function clean(){
	$("#filename").val('');
	$("#fileno").val('');
	$("#keyword").val('');
	$("#summary").val('');
	$('#fileclassify').combotree('setValues','');
	$("#uploadtimeStart").val('');
	$("#uploadtimeEnd").val('');
	$("#remark").val('');
}
function trim(str)
{
     return str.replace(/(^\s*)(\s*$)/g,"");
}
//全局变量，获得焦点的ID
var onFocusID = "";

//显示搜索页面
function showProvince(obj){
    //jQuery的方法
    $("#searchbox").css("left",$($('#searchstring')).offset().left);
    $("#searchbox").css("top",$($('#searchstring')).offset().top + $($('#searchstring')).outerHeight());
   if(!$("#searchbox").is(":visible")){
    	$("#searchbox").panel('expand');    
    	$(document).bind('mouseup',function(e){
    		var p=$(e.target).closest("#searchbox");
    		var p2=$(e.target).closest(".combo-p");
    		var isExpand=$("#searchbox").is(":visible");
//    		alert(p.length+ "," +isExpand);
    		if(p.length==0&&p2.length==0 && isExpand){
    			$("#searchbox").panel("collapse");
    				$(document).unbind("mouseup");
    		}
    	});
		$("#fileclassify").combotree({
			 url: rootPath+"jasdoc/folder/classify/getDocClassifyTreeAsync.do",
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
		 $("#searchbox").panel("collapse");
	}
}

/**
 * 方法描述：全文搜索
 * 
 * @returns {Boolean}
 */
function searchFileBycontent(){
	var searchstring=trim($("#searchstring").val());
	var a= /^[\u4e00-\u9fa5_a-zA-Z0-9\-\.\:\：]+$/.test(searchstring);
	if(searchstring==""||searchstring==null){
		return false;
	}if(a==false){
		$.messager.alert('提示','输入值不能为空和包含其他非法字符','info');
		return false;
	}else{
//		tab.openTab('ca60e123-d25e-4e93-8274-7be9912048ec','文档搜索',"../../jasdoc/folder/docCenter/queryDocCenter.htm?folderId=ca60e123-d25e-4e93-8274-7be9912048ec&foldertype=5"+
//				"&searchstring="+searchstring+"",true,true);
		initMessage("selectType=5"+
				"&searchstring="+searchstring+"");
	}
}