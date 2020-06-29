
var parentObj = self.parent;
var roleforShare = "";
var eventidforShare = "";
var createuserforShare = "";
var folderid="";
/**
 * 方法描述：查看
 * @param sid
 */	
function showInfo(versionid){
	top.getDlg("viewFile.htm?hidden=&versionid="+versionid+"&r="+new Date().getTime(),'viewfile',"文档详细",700,290);
}

/**
 * 方法描述：设置当前版本
 * 
 */
function setVersion(versionid){
	$.ajax({
		url : '../../version/setVersion.do',
 		type : 'POST',
 		data:"versionid="+versionid,
 			success : function(data) {
 				$('#dg').datagrid('reload');	// reload the user data
 				$('#dg').datagrid('clearSelections'); 	//clear selected options
 				var frm=top.document.getElementById("frm"+folderid);
 				if(frm){
 					var obj=frm.contentWindow;
 					obj.$('#dg').datagrid("reload");
 				}
			},
 			dataType:"json",
 			error : function(data) {
 					
 			}
 	});	
}
function reloaddata(){
	$('#dg').datagrid('reload');	// reload the user data
	$('#dg').datagrid('clearSelections'); 	//clear selected options
}

function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}
/**
 * 方法描述：删除共享
 * 
 */
function deleteShare(){
	var rows = $('#dg').datagrid('getSelections');
if (rows.length > 0){
	var ids="";
	for(var i=0;i<rows.length-1;i++){
		ids += rows[i].id+",";
	}
	ids += rows[rows.length-1].id;
	$.messager.confirm("删除文档分享","您确定要删除选择的分享记录吗？\n\t",function(r){
		if (r){
			$.post("../../share/deleteFileShareById.do",
				{"ids":ids,"rd":Math.random()},
				function(result){
				if (result.success){
						$('#dg').datagrid('reload');	// reload the user data
						$('#dg').datagrid('clearSelections'); 	//clear selected options
				} else {
					$.messager.alert('错误',result.msg,result.error);
				}
			},'json');
		}
	});
}else{
	$.messager.alert('提示','请选择记录','info');
	}
}

$(document).ready(function(){ 
	initMessage();
}); 

/**
 * 方法描述：加载文档列表
 */
function initMessage(){
	fileid = getParamter("fileid");
	folderid = getParamter("folderId");
	var datagridTitle='历史版本列表';
	var width=$('body').width();
	$('#dg').datagrid({
		width:'100%',
		nowrap: false,
		collapsible:false,
		url:"../../version/getfilehistory.do?fileid="+fileid,
		remoteSort: true,
		idField:'id',
		title:'历史版本列表',
	 	columns : [[
	 	       {field : 'ck',title : '全选',checkbox : true},  
	 	            {
			field : 'filename',
			title : '文档名称',
			width : 0.25 * width
		}, {
			field : 'fileno',
			title : '文档编号',
			width : 0.1 * width
		},  {
			field : 'author',
			title : '文档作者',
			width : 0.08 * width,
			hidden:true
		}, {field:'createusername',title:'上传者',width:0.07*width},
		{
			field : 'keyword',
			title : '关键词',
			width : 0.07 * width
		}, {
			field : 'filetype',
			title : '文档格式',
			width : 0.06 * width
		}, {
			field : 'docactualLocation',
			title : '文档位置',
			width : 0.18 * width,
			hidden:true
		},{
			field : 'filesizeStr',
			title : '文档大小(kb)',
			width : 0.07 * width
		},{
			field : 'versionnumber',
			title : '版本号',
			width : 0.07 * width
		},
		{field : 'versionid',title : '历史版本ID',width : 0.07 * width,hidden:true},
		{field:'createuser',title:'上传者id',width:0.07*width,hidden:true},
		{field : 'manager',title : '操作',width : 0.1 * width,formatter:function(value,rowData,rowIndex){
			var managerField="<img src='../../common/images/tip.png' title='查看'  style='cursor:hand' onclick='showInfo(\""
				+rowData.versionid + "\")'>	"; 
			managerField+="<img src='../../common/images/preview.png' title='预览'style='cursor:hand' onclick='previewHistory(\""
					+ rowData.versionid+ "\")'>	";
			if(top.loginUser.eventid==rowData.createuser){
				managerField+="<img src='../../common/images/version.png' title='设置当前版本'style='cursor:hand' onclick='setVersion(\""
				+ rowData.versionid+ "\")'>      "	
			}
			return managerField;
		}} ] ],
		  
		onDblClickRow:function(index,rowData){
			var versionid = rowData.versionid;
			if (rowData.preview == 1) {
				Preview(versionid);
			} else {
				$.messager.alert('提示', '对不起，您没有预览权限！', 'info');
			}
		},
		onRowContextMenu:function(e, rowIndex, rowData){
			e.preventDefault();
					$('#managerdiv').menu('show', {
						left: e.pageX,
						top: e.pageY
					});
					$('#managerdiv').menu({
		                onClick:function(item){
		                	 if( item.name == '001' ){
		                		 showInfo(rowData.versionid);
		                	 }else if( item.name == '002' ){
		                		 previewHistory(rowData.versionid);
		                	 }else if( item.name == '003' ){
		                		 setVersion(rowData.versionid);
		                	 }
		                 }
					});
					$('#10').attr('disabled',false);
					$('#9999').attr('disabled',true);
					var role=rowData.hierarchyRole;
					$('#managerdiv div').each(function(){
						if( role >= $(this).attr('id')){
							$(this).attr('disabled',false);
						}
					});
					if(rowData.createuser == top.loginUser.eventid){
						$('#9999').attr('disabled',false);
					}
		}
	});	
	initDatagrigHeight('dg','',0);
}

