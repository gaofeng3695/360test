personchoose = {
	showPersonWindow : function() {
	var deptIds = $("#deptIds").val();
	var roleIds = $("#roleIds").val();
	var userIds = $("#userIds").val();
	var deptroleuserNames = $("#sharescope").val();
		top.getDlg(rootPath + "/jasframework/privilege/page/personfordoc.htm?deptIds="+deptIds+"&roleIds="+roleIds+"&userIds="+userIds+"&deptroleuserNames="+deptroleuserNames+"&r="+new Date().getTime()+"&pagelocation="
				+ window.document.location.href, "dlga", "选人", 700, 500, true);
	},
	setShare : function(deptroleuserNames,deptIds,roleIds,userIds) {
		$("#sharescope").val(deptroleuserNames);
		$("#deptIds").val(deptIds);
		$("#roleIds").val(roleIds);
		$("#userIds").val(userIds);
	}
};

//选中下面的权限自动选中上面的权限
function clickBox(type){
	if($("#"+type).find(":checkbox").attr('checked')){
		$('#privelegetype div').each(function() {
			if (type >= $(this).attr('id')) {
				$(this).find(":checkbox").attr("checked",true); 
			}
		});
	}else{
		$('#privelegetype div').each(function() {
			if (type <= $(this).attr('id')) {
				$(this).find(":checkbox").attr("checked",false); 
			}
		});
	}
}
function saveAssociated(){
	if(selectedfileidAndrole==null||selectedfileidAndrole==""){
		$.messager.alert("提示","请选择关联的文档。","info");
	}else if($("#description").val()==null||$("#description").val()==""){
		$.messager.alert("提示","请填写关联描述。","info");
	}else{
		$('#fileAssociated').form('submit',{
			url: "../../folder/associated/saveAssociated.do?token="+localStorage.getItem("token"),
			onSubmit: function(){
				return $(this).form('validate');
			},
			dataType:"json",
			success: function(result){
			var result=	eval('('+result+')');
				if(result.success==1){
					$.messager.alert("提示",result.ok,"info",function(){reloadData('queryAssociatedFiles.htm', '#AssociatedDocument'),closePanol()});
							
				}else{
					$.messager.alert("提示",result.ok,"info",function(){});
				}
			}
		});
	}
}
var allOrOnlyDocFile = true;
var eventid ="";
$(document).ready(function(){
	eventid = getParamter("eventid");
	$("#eventid").val(eventid);
	$("#associateduserid").val(top.loginUser.eventid);
	
	var url = "../../../jasdoc/folder/folder/getMenu.do?id="+top.docCenterRootFolderHierarchy+"&r="+new Date().getTime();
	$('#folderlist').tree( {
		url : url,
//		checkbox:true,
//		cascadeCheck:false,
		onClick:function(node){
			var queryDocUrl = "../../../jasdoc/folder/doccenter/getAllDocforAssociated.do?folderid=" + node.id
			+ "&hierarchy=" + node.attributes.hierarchy+"&allOrOnlyDocFile=" + allOrOnlyDocFile+"&fileid=" + eventid;
			$("#filetable").datagrid("options").url = queryDocUrl;
			$("#filetable").datagrid('reload'); 
		},
		onLoadSuccess:function(node,data) {
			var rootnode = $('#folderlist').tree('getRoot');
			initdatagrid(rootnode.id,rootnode.attributes.hierarchy);
		},
		onContextMenu: function(e, node){
			e.preventDefault();
			$('#folderlist').tree('select', node.target);
		},onBeforeExpand: function(node){
				var url2;
				var foldertype=node.attributes.foldertype;
				var hierarchyid=node.attributes.hierarchy;
				url2="../../../jasdoc/folder/folder/getChildren.do";
				$('#folderlist').tree('options').url = url2+"?id="+node.id+"&hierarchy="+hierarchyid;// 
				if(foldertype==top.FOLDERTYPE_DOCCENTER){
					node.iconCls= 'icon-tree-center-node-open';
				}
				 $('#folderlist').tree('update', node);
		},onBeforeCollapse: function(node){
				var foldertype=node.attributes.foldertype;
				if(foldertype==top.FOLDERTYPE_DOCCENTER){
					node.iconCls= 'icon-tree-center-node-close';
				}
				 $('#folderlist').tree('update', node);
		}
	});
	
});
function initdatagrid(id,hierarchy){
	var querydocurl = "../../../jasdoc/folder/doccenter/getAllDocforAssociated.do?folderid=" +id + "&hierarchy=" + hierarchy+"&allOrOnlyDocFile=" + allOrOnlyDocFile+"&fileid=" + eventid;
	$("#filetable").datagrid({
		loadMsg : '数据装载中......',
		rownumbers:true,
		pagination:true,
		height:379,
		idField:"eventid",
		columns:[[ 
				  {field : 'ck',title : "",checkbox : true},
				  {field:'eventid',title:"fileid",width:100,hidden:true}, 
				  {field : 'filename',title : '文档名称',width : 300}, 
				  {field:'createusername',title:"上传人",width:100} 
			]],
		 url:querydocurl,
		 title:"文档列表",
		 onSelect : function(index, row) {
			 setSelectFiles();
		},
		onUnselect : function(index, row) {
			setSelectFiles();
		},
		onSelectAll : function(index, row) {
			setSelectFiles();
		},
		onUnselectAll : function(index, row) {
			setSelectFiles();
		},
		onLoadSuccess : function(data){
//			var arruser = userIds.split(",");
//			for(var i = 0; i<arruser.length; i++){
//				$('#10060201').datagrid('selectRecord',arruser[i]);
//			}
		}
	});
}
var selectedfileidAndrole = "";
function setSelectFiles(){
	selectedfileidAndrole = "";
	 var rows = $('#filetable').datagrid('getSelections');
	 for(var i = 0;i<rows.length;i++){
		 if(selectedfileidAndrole == null||selectedfileidAndrole ==""){
			 selectedfileidAndrole += rows[i].eventid+";"+rows[i].hierarchyRole;
			}else{
				selectedfileidAndrole += "," + rows[i].eventid+";"+rows[i].hierarchyRole;
			}
	 }
	 $("#selectedfileidAndrole").val(selectedfileidAndrole);
}
function reloadData(shortUrl, elementId) {
		var fra = parent.$("iframe");
		for ( var i = 0; i < fra.length; i++) {
			if (fra[i].src.indexOf(shortUrl) != -1) {
				fra[i].contentWindow.$(elementId).datagrid("reload");
			}
		}
	}	
//修改时，显示原有信息
function getMessageById(shareid){
	$.ajax({ 
		url: "../../share/getMessageById.do?id="+shareid,
		success: function(result){
        	var data = jQuery.parseJSON( result ); 
        	$("#deptIds").val(data.sharescropMap.deptIds);
        	$("#roleIds").val(data.sharescropMap.roleIds);
        	$("#userIds").val(data.sharescropMap.userIds);
        	$("#userIds").val(data.sharescropMap.userIds);
        	$("#sharescope").val(data.sharescrop);
        	$("#shareRemark").val(data.remark);
        	$("#endDate").val(data.overdate);
        	if(data.shareprivilegetype == 10){
        		$("#"+data.shareprivilegetype).find(":checkbox").attr("checked","true");
        	}else if(data.shareprivilegetype == 20){
        		$("#"+10).find(":checkbox").attr("checked","true");
        		$("#"+data.shareprivilegetype).find(":checkbox").attr("checked","true");
        	}else if(data.shareprivilegetype == 30){
        		$("#"+10).find(":checkbox").attr("checked","true");
        		$("#"+20).find(":checkbox").attr("checked","true");
        		$("#"+data.shareprivilegetype).find(":checkbox").attr("checked","true");
        	}
     	}
	});

}
function closePanol(){
	top.closeDlg('share');
}