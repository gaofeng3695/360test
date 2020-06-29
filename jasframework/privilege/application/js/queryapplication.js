var url;
	/**
	 * 描述：新增按钮事件
	 */
function newApplication(){
	top.getDlg("addapplication.htm?r="+new Date().getTime(),"saveiframe", getLanguageValue("add"),750,300);
}
/**
 * 描述：修改按钮事件
 */
function editRole(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length == 1){
//				var row = $('#dg').datagrid('getSelected');
		top.getDlg("updateapplication.htm?oid="+rows[0].oid+"&r="+new Date().getTime(),"updateiframe", getLanguageValue("edit"),700,300);
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}
/**
 * 描述：删除按钮事件
 */
function removeRole(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#dg').datagrid('getSelected');
		top.$.messager.confirm(getLanguageValue("delete"),getLanguageValue("deleteconfirm"),function(r){
			if (r){
				$.getJSON(rootPath+"jasframework/privilege/application/IsInUse.do?oid="+row.oid,function(check) {
					if (check){
						top.showAlert(getLanguageValue("tip"),getLanguageValue("app.hasPrivilege"));
					} else{
					 	var postUrl = rootPath+"jasframework/privilege/application/delete.do?oid="+row.oid;
						$.post(postUrl,function(result){
							if (result){
								top.showAlert(getLanguageValue("success"),getLanguageValue("deletesuccess"),'ok',function(){
									$('#dg').datagrid('reload');	// reload the user data
									$('#dg').datagrid('clearSelections'); //clear selected options
									reloadDataTree('queryPrivilege.htm','#appnumber1');
								});
							} else {
								top.showAlert(getLanguageValue("error"),result.msg,'error');
							}
						},'json');
					}
				});
				
			}
		});
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}
	
function viewUsersOfRole(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length == 1){
		var id = rows[0].id;
		var postUrl = "./viewUsersOfRole.do?id="+id+"&rd="+Math.random();
		$.post(postUrl,function(result){
			if (result.success){
				$('#dlg_user').dialog('open').dialog('setTitle',getLanguageValue("role.viewUser"));
				$("#viewUserSel").html("");
				var hasUserHtml= "";
				for(var i=0;i<result.hasUser.length;i++){
					var user = result.hasUser[i];
					hasUserHtml += "<option value=\""+user.id+"\">"+user.name+"</option>";
				}
				$("#viewUserSel").append(hasUserHtml);
			} else {
				top.showAlert(getLanguageValue("error"),result.msg,'error');
			}
		},'json');
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}

/**
 * 描述：查看角色
 */
function showInfo(){
	var rows = $("#dg").datagrid("getSelections");
	if(rows.length == 1) {
		top.getDlg("viewapplication.htm?oid="+rows[0].oid+"&r="+new Date().getTime(),'view', getLanguageValue("view"),800,260);
	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}

/**
 * 页面初始化
 */
$(document).ready(function(){
	$('#dg').datagrid({
		width:'100%',
		nowrap: false,
		striped: true,
		collapsible:false,
		url:rootPath+'jasframework/privilege/application/getList.do',
		remoteSort: true,
		idField:'oid',
		pagination:true,
		singleSelect:true,
		fitColumns: true,
		columns : [ [ 
             {
            	 field : 'ck',
     		 	title : getLanguageValue('ck'),
     			checkbox : true
 		    },
		    {
				field : 'oid',
				title : getLanguageValue('app.appId'),
	    		width:$(this).width() * 0.27,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
		    },
		    {
				field : 'appName',
				title : getLanguageValue('app.appName'), 
				width:$(this).width() * 0.2,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
		   }, 
		   {
				field : 'roleName',
				title : getLanguageValue('app.roleName'),
				width:$(this).width() * 0.2,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
		   }, 
		   {
				field : 'appUrl',
				title : getLanguageValue('app.appUrl'),
				width:$(this).width() * 0.2,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
			}, 
			{
				field : 'description',
				title : getLanguageValue('app.description'),
				width:$(this).width() * 0.2,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
			}
		] ],
		rownumbers:true,
		onDblClickRow:function(index,indexData){
			showInfo();
		},
		onLoadSuccess:function(data){
	    	$('#dg').datagrid('clearSelections'); //clear selected options
	    },
		onHeaderContextMenu: function(e, field){
			e.preventDefault();
			if (!$('#tmenu').length){
			}
			$('#tmenu').menu('show', {
				left:e.pageX,
				top:e.pageY
			});
		}
	});
	//自适应
	initDatagrigHeight('dg','','0');
});
function reloadDataTree(shortUrl, elementId){
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			var iframe=fra[i].contentWindow;
			iframe.$(elementId).combobox("reload",rootPath+"/jasframework/appsystem/getUserAppsystem.do?random=" + new Date().getTime());
		}
	}
}