var deptIds = getParamter("deptIds");//部门id
var roleIds = getParamter("roleIds");//角色id
var userIds = getParamter("userIds");//用户id
var deptNames = "";//部门名称
var roleNames = "";//角色名称
var userNames = "";//用户名称
var deptroleuserNames = getParamter("deptroleuserNames");

function setShareScope(){
	deptroleuserNames = "";
	if(deptNames != ""){
		deptroleuserNames += deptNames;
	}
	if(roleNames != ""){
		if(deptroleuserNames == ""){
			deptroleuserNames += roleNames;
		}else{
			deptroleuserNames += "," + roleNames;
		}
	}
	if(userNames != ""){
		if(deptroleuserNames == ""){
			deptroleuserNames += userNames;
		}else{
			deptroleuserNames += "," + userNames;
		}
	}
	$("#shareScope").val(deptroleuserNames);
}
//部门树
$(function(){
	var deptUrl = rootPath+"jasframework/privilege/unit/getLeftTree.do?r="+new Date().getTime();
		$('#unittree').tree( {
			url : deptUrl,
			checkbox:true,
			cascadeCheck:false,
			onClick:function(node){
				var url = rootPath+'jasframework/privilege/user/getAllUserByUnitid.do?unitEventid='+escape(node.id);
						$("#10060201").datagrid("options").url = url;
						$("#10060201").datagrid('reload'); 
			},
			onLoadSuccess:function(node,data) {
				initdatagrid($('#unittree').tree('getRoot').id);
				var arrdept = deptIds.split(",");
				for(var i = 0; i<arrdept.length; i++){
					var node1 = $("#unittree").tree('find',arrdept[i]);
					if(node1){
						$("#unittree").tree('check',node1.target);
					}
				}
			},
			onDblClick:function(e,node){
				$(this).tree('toggle', node.target);
			},
			onContextMenu: function(e, node){
				e.preventDefault();
				$('#unittree').tree('select', node.target);
			},
			onCheck : function(node, checked){
				var nodeDept = $('#unittree').tree('getChecked');
				deptNames = "";
				deptIds = "";
				for(var i = 0;i<nodeDept.length;i++){
					if(deptNames == null||deptNames ==""){
						deptNames += nodeDept[i].text;
						deptIds += nodeDept[i].id;
					}else{
						deptNames += "," + nodeDept[i].text;
						deptIds +=  "," + nodeDept[i].id;
					}
				}
				setShareScope();
			}
		});
		
		//角色树
		var roleUrl = rootPath+"jasframework/jasdoc/privilege/privilege/getAllRole.do?r="+new Date();
		$('#roletree').tree({
			url : roleUrl,
			checkbox:true,
			cascadeCheck:false,
			onClick:function(node){
				//var url = '../../privilege/user/getAllUserByRoleid.do?roleid='+escape(node.id);
				var url = rootPath+'jasframework/jasdoc/privilege/user/getAllUserByRoleid.do?roleid='+escape(node.id);
				$("#10060201").datagrid("options").url = url;
				$("#10060201").datagrid('reload'); 
			},
			onLoadSuccess:function(node,data) {
				var arrrole = roleIds.split(",");
				for(var i = 0; i<arrrole.length; i++){
					var node1 = $("#roletree").tree('find',arrrole[i]);
					if(node1){
						$("#roletree").tree('check',node1.target);
					}
				}
			},
			onCheck : function(node, checked){
				var nodeDept = $('#roletree').tree('getChecked');
				roleNames = "";
				roleIds = "";
				for(var i = 0;i<nodeDept.length;i++){
					if(roleNames == null||roleNames ==""){
						roleNames += nodeDept[i].text;
						roleIds += nodeDept[i].id;
					}else{
						roleNames += "," + nodeDept[i].text;
						roleIds +=  "," + nodeDept[i].id;
					}
				}
				setShareScope();
			}
		});	
	var width=$('#centerDiv').width()+5;
	var height=$('#west').height();
	var heigh2t=$('#queryDiv').height();
	$('#queryDiv').panel({
		onBeforeExpand : function() {
			$('#queryDiv').panel('resize',{width:width});
			$('#10060201').datagrid('resize', {
				width : width,
				height : height-heigh2t
			});
		},
		onCollapse : function() {
			$('#queryDiv').panel('resize',{
				width:width
			});
			$('#10060201').datagrid('resize', {
				width : width,
				height : height
			});
		}
	});
//	//回显所选的内容
//		$("#shareScope").val(deptroleuserNames);
});
//用户列表
function initdatagrid(id){
	var unitidList = getChildren();
	$("#10060201").datagrid({
		loadMsg : '数据装载中......',
		rownumbers:true,
		pagination:true,
		idField:"eventid",
		columns:[[ 
				  {field : 'ck',title : "",checkbox : true},
				  {field:'eventid',title:"编号",width:100,hidden:true}, 
				  {field:'loginName',title:"用户名",width:100}, 
				  {field:'name',title:"姓名",width:100} 
			]],
		 url:rootPath+"jasframework/privilege/user/getAllUserByUnitid.do?unitidList=" + unitidList,
		 title:"用户列表",
		 onSelect : function(index, row) {
			setUserNamesAndIds();
		},
		onUnselect : function(index, row) {
			 setUserNamesAndIds();
		},
		onSelectAll : function(index, row) {
			 setUserNamesAndIds();
		},
		onUnselectAll : function(index, row) {
			 setUserNamesAndIds();
		},
		onLoadSuccess : function(data){
			var arruser = userIds.split(",");
			for(var i = 0; i<arruser.length; i++){
				$('#10060201').datagrid('selectRecord',arruser[i]);
			}
		}
	});
}
function setUserNamesAndIds(){
	 var rows = $('#10060201').datagrid('getSelections');
			 userNames = "";
			 userIds = "";
			 for(var i = 0;i<rows.length;i++){
				 if(userNames == null||userNames ==""){
						userNames += rows[i].name;
						userIds += rows[i].eventid;
					}else{
						userNames += "," + rows[i].name;
						userIds +=  "," + rows[i].eventid;
					}
			 }
			 setShareScope();
}
var thispagelocation = window.document.location.href;
pagelocation = thispagelocation.substring(thispagelocation.indexOf('pagelocation')+13);

function getUserAndClose() {
	
		var flag = false;
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].contentWindow.location.href.indexOf(pagelocation) != -1) {
				fra[i].contentWindow.personchoose.setShare(deptroleuserNames,deptIds,roleIds,userIds);
				flag = true;
				break;
			}
		}
		if(!flag){
			var iframeA = parent.document.getElementById('iframeb').contentWindow.$("iframe");
			if(iframeA && iframeA.length>0){
				for(var i=0; i<iframeA.length;i++) {
					if(iframeA[i].contentWindow.location.href.indexOf(pagelocation) != -1) {
						iframeA[i].contentWindow.personchoose.setShare(deptroleuserNames,deptIds,roleIds,userIds);
						flag = true;
						break;
					}
				}
			}
		}
		if(!flag){
			parent.document.getElementById('iframeb').contentWindow.personchoose.setShare(deptroleuserNames,deptIds,roleIds,userIds);
		}
		top.closeDlg('dlga');
}
function getChildren(){
      var node = $('#unittree').tree('getRoot');
      if (node) {
          var children = $('#unittree').tree('getChildren', node.target);
      }
      else {
          var children = $('#unittree').tree('getChildren');
      }
      var s = "'";
      for (var i = 0; i < children.length; i++) {
          s += children[i].id + "','";
      }
      s+=node.id + "'";
      //alert(s);
      return s;
}
function queryUser(){
	var loginname = $("#loginname").val();	
	var name = $("#name").val();
	var userrange = "1";
	var query={"loginName":loginname,"name":name,"userrange":userrange};
	var url;
		if(userrange=="1"){
	 		var unitidList = getChildren();
			url = rootPath+"jasframework/privilege/user/getAllUserByUnitid.do?unitidList=" + unitidList;
		}else{
			url=rootPath+"jasframework/privilege/user/getAllUserByUnitid.do?unitEventid=" + row.id;
		}	
		$("#10060201").datagrid("options").url = url;
		$("#10060201").datagrid('options').queryParams=query;
		$("#10060201").datagrid('load');	
		$("#10060201").datagrid('options').queryParams=null;
		
}
function closePanol(){
	top.closeDlg('dlga');
}