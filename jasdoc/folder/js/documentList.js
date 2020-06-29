var eventids = "";
var	filenames = "";
var foldertype = "1";
var oldfolderid = "";
var url = "../doccenter/queryFolderComboTree.do";
var param = this.location.search;	
var favoriteNodeid;

/**
 * 页面初始化
 */
$(function() {
	//设置审核状态宽度
	setComboObjWidth('auditstate', '0.60', 'combobox'); 
	//初始化查询条件中的审核状态下拉选
	initAuditStateSelect();
	//初始化数据列表
	initDatagrid();
	//初始化数据列表的高度
	initDatagrigHeight('dg', 'searchpanel', $('#searchpanel').height());
	//查询树
	if (param != null && "" != param) {
		var p = param.substr(1).split("&");
		$.each(p,function(i,item){
			var d = item.split("=");
			if(d[0]=='eventids'){
				 eventids=d[1];
			}
			 if(d[0]=='filenames'){
				filenames=d[1];
				$("#fordername").text(filenames);
			}
			if(d[0]=='foldertype'){
				foldertype=d[1];
			}
			if(d[0]=='folderid'){
				oldfolderid=d[1];
			}
		});
	}
	queryTree();
});


/**
 * 描述：获得审核状态，初始化系统下拉选
 */
function initAuditStateSelect() {
	$.ajax({
		url : "../docaudit/getDocumentAuditstateList.do",
		type : "post",
		dataType : "json",
		success : function(result) {
			$('#auditstate').combobox({
				data : result.rows,
				valueField : 'auditstate',
				textField : 'auditstateName'
			});
		},
		error : function() {
		}
	});
}
/**
 * 描述：初始化列表信息
 */
function initDatagrid() {
	var queryDocUrl = "../docaudit/getDocumentList.do";
	var width = $('body').width();
	
	$('#dg').datagrid({
		width : '100%',
		nowrap : false,
		collapsible : false,
		singleSelect : true,
		url : queryDocUrl,
		remoteSort : true,
		idField : 'eventid',
		title : '文档审核列表',
		toolbar : "#toolbar",
		columns : [[
		            {field : 'ck',title : '全选',checkbox : true}, 
		            {field : 'filename',title : '文档名称',width : 0.18 * width}, 
		            {field : 'fileno',title : '文档编号',width : 0.07 * width,hidden:true},  
		            {field : 'author',title : '文档作者',width : 0.08 * width,hidden:true}, 
		            {field : 'createusername',title : '上传人',width : 0.08 * width}, 
		            {field : 'keyword',title : '关键词',width : 0.07 * width,hidden:true}, 
		            {field : 'filetype',title : '文档格式',width : 0.06 * width},
		            {field : 'filelocation',title : '文档位置',width : 0.195 * width}, 
		            {field : 'filesize',title : '文档大小(kb)',width : 0.09 * width},
		            {field : 'versionnumber',title : '版本号',width : 0.05 * width},
		            {field : 'auditstateName',title : '审核状态',width : 0.09 * width},
		            {field : 'audituser',title : '审核人',width : 0.09 * width},
		            {field : 'audittime',title : '审核时间',width : 0.11 * width},
					{field : 'eventid',hidden:true},
					{field : 'auditstate',title : '审核状态',width : 0.09 * width,hidden:true},
		            {field : 'versionid',title : '历史版本ID',width : 0.07 * width,hidden:true}
				]],
		onDblClickRow : function(index, rowData) {
			var eventid = rowData.eventid;
			if (rowData.preview == 1) {
//				Preview(eventid);
			} else {
//				$.messager.alert('提示', '对不起，您没有预览权限！', 'info');
			}
		},		
		onLoadSuccess : function(data) {
			
		}
	});
}

/**	
 * 方法描述：加载初始化树
 */
function queryTree(){
	$('#foldreeventid').combotree({
		url:rootPath+"jasdoc/folder/doccenter/queryDocCenterFolder.do?token="+localStorage.getItem("token"),  
		onBeforeExpand:function(node){
			var url=rootPath+"jasdoc/folder/doccenter/getChildren.do";
		 	$('#foldreeventid').combotree("tree").tree("options").url= url+"?folderId="+node.id;
			node.iconCls= 'icon-tree-center-node-open';
		 	$('#foldreeventid').combotree("tree").tree('update', node);
		},
		onClick:function(node){
//			if( node.id == docCenterFolderId ){
//				$.messager.alert('提示',"文档中心下不允许存放文档",'info');
//				$('#foldreeventid').combotree("clear",node);
//				return;
//			}
//			var role = node.attributes.role;
//			if(role < folderAllRoleValueAfter[folderAllRoleValueAfter.length - 2]){
//				//判断移动的目标文件夹是否有文档维护权限
//				$.messager.alert('提示',"对文件夹【"+node.text+"】无维护权限，不能移动到该文件夹下",'info');
//				$('#foldreeventid').combotree("clear",node);
//				return;
//			}
		},
		onBeforeCollapse: function(node){
			node.iconCls= 'icon-tree-center-node-close';
			$('#foldreeventid').combotree("tree").tree('update', node);
		},
		onLoadSuccess:function(node, data){
			
		}
	}); 
	}

/**
 * 根据条件查询数据
 */
function queryDocumentAudit() {
	var auditstate = $("#auditstate").combobox("getValue");
	var foldreeventid = $("#foldreeventid").combobox("getValue");
	var filename = $("#filename").val();
	var beginUploadTime = $("#beginUploadTime").val();
	var endUploadTime = $("#endUploadTime").val();
	if(beginUploadTime!=null&&beginUploadTime!=""&&endUploadTime!=null&&endUploadTime!=""){
		if(beginUploadTime>endUploadTime){
			$.messager.alert('提示','上传时间的范围填写不正确','info');
			return false;
		}
	}
	var query={"auditstate":auditstate,"beginUploadTime":beginUploadTime ,"endUploadTime":endUploadTime,"filename":filename,"foldreeventid":foldreeventid}; //把查询条件拼接成JSON
	$("#dg").datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
	$("#dg").datagrid('load'); //重新加载
}

/**
 * 重置查询条件
 */
function clearQueryCondition() {
	$("#beginUploadTime").val("");
	$("#endUploadTime").val("");
	$("#filename").val("");
	$("#auditstate").combobox("setValue", "");
	$("#foldreeventid").combotree("setValue", "");
}

/**
 * 审核
 */
function openAuditPage(){
	var selectRows = $("#dg").datagrid("getSelections");
	if(selectRows.length == 1) {
		if(selectRows[0].auditstate=="0"){
			top.getDlg("viewAudit.htm?eventid="+selectRows[0].eventid,'viewAudit',"审核",700,400);
		}
		else{
			$.messager.alert('错误',"请选择一条待审核的记录进行审核！");
		}
	} else {
		top.showAlert("提示","必须选择一条待审核记录",'info');
	}
}
/**
 * 修改审核
 */
function openEditAuditPage(){
	var selectRows = $("#dg").datagrid("getSelections");
	if(selectRows.length == 1) {
		if(selectRows[0].auditstate!="0"){
			top.getDlg("editAudit.htm?eventid="+selectRows[0].eventid,'editAudit',"修改审核",700,400);
		}
		else{
			$.messager.alert('错误',"请选择一条已经审核过的记录进行修改！");
		}
	} else {
		top.showAlert("提示","必须选择一条已经审核过的审核记录",'info');
	}
}
