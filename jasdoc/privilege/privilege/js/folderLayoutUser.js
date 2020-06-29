/**
 * 方法描述： 加载左侧角色树形菜单
 */	
var folderUserValues = new Array();	//用户勾选的 文件夹权限数据
var initUserValues = new Array();	//该角色以拥有的文件夹权限数据
var parentValues = new Array();		//文件夹的父节点数据
var markNumber = 0;
var cascadeCheck=true;
var nodeValue=null;
var nodeUser=null;
var userId="";
var folderId = getParamter("folderId");
$(function(){
	/***begin 定位部门树面板的位置***/
	var offset=$("#search").offset();
	var doc=document.getElementById("unitTree");
	doc.style.top=offset.top+$("#search").height()+"px";
	doc.style.left=offset.left-4+"px";
	doc.style.width=$("#search").width()+"px";
	/***end 定位部门树面板的位置***/
	/***begin 获取部门树***/
	var deptUrl = "../../../jasdoc/privilege/privilege/getUnitAndChildrenTree.do?";
	$('#deptPrivilegeEventId').tree( {
		url : deptUrl,
		checkbox:true,
		cascadeCheck:false,
		onSelect:function(node){
			
		},onLoadSuccess:function(node,data){
			$('#deptPrivilegeEventId').tree('check',data[0].target);
		},onBeforeCheck:function(node,checked){
			setUnitInfo(node,checked);
		},onCheck:function(node,checked){
			crateUserTree();
		}
	});
	/***end 获取部门树***/
	/***begin 初始化部门树面板***/
	$("#unitTree").panel({
		collapsed:true
	});
	/***end 初始化部门树面板***/
	/***begin 部门树面板折叠与展开***/
	$(document).bind('mouseup',function(e){
		$("#unitTree").panel('expand');
		var p=$(e.target).closest("#search");
		var p2=$(e.target).closest("#unitTree");
		var isExpand=$("#unitTree").is(":visible");
		if(p.length==0 && p2.length==0 && isExpand){
			$('#unitTree').panel('collapse');
		}
	});
//	$("#search").focusin(function(e,a,b){
//		console.log(e,a,b)
//		$("#unitTree").panel('expand');
//	});
//	$("#search").focusout(function(e,a,b){
//		console.log(e,a,b)
//		$('#unitTree').panel('collapse');
//
//	});
		
	/***begin 部门树面板折叠与展开***/
	
	$('#searchUnit').bind('keyup', function(event) {
		search(event);
	});
	$('#user').searchbox({ 
		searcher:function(value,name){
			var data=$("#userPrivilegeEventId").tree("getRoots");
			positionUser(value,data);
		}
	});
});
var flag=false;
/******
 * 用户查询并定位
 * @param value
 */
function positionUser(value,data){
	flag=false;
	for(var j=0;j<data.length;j++){
		if(data[j].text.indexOf(value)!=-1){
			if(nodeUser==null){
				var node=$("#userPrivilegeEventId").tree('find',data[j].id);
				
				$("#userPrivilegeEventId").tree('scrollTo',node.target);
				$("#userPrivilegeEventId").tree('select',node.target);
				nodeUser=node.attributes;
				flag=true;
				break;
			}else{
				nextNodeName=nodeUser.nextName;
				nextNodeId=nodeUser.nextId;
				var node=$("#userPrivilegeEventId").tree('find',nextNodeId);
				if(nextNodeName.indexOf(value)!=-1){
					$("#userPrivilegeEventId").tree('scrollTo',node.target);
					$("#userPrivilegeEventId").tree('select',node.target);
					flag=true;
					if(node.attributes.nextId==null){
						nodeUser=null;
					}else{
						nodeUser=node.attributes;
					}
					break;
				}else{
					j=-1;
					if(node.attributes.nextId==null){
						nodeUser=null;
					}else{
						nodeUser=node.attributes;
					}
					continue;
				}
				
			}
		}
	}
}
function search(event){
	var myevent = event || window.event;
	var mykeyCode = myevent.keyCode;
	var trueorfalse = (mykeyCode >= 65 && mykeyCode <= 90) || mykeyCode == 8 || mykeyCode == 46 || mykeyCode == 32 ||(mykeyCode >= 48 && mykeyCode <= 57) || (mykeyCode >= 96 && mykeyCode <= 105);
	if(!trueorfalse){
//		alert(1);
	}else{
		var keyWord=$("#searchUnit").val();
		if(keyWord.indexOf(',')!=-1){
			return ;
		}else if(keyWord!=''){
			var data=$('#deptPrivilegeEventId').tree('getRoot');
			positionUnit(keyWord,"deptPrivilegeEventId",data);
		}
	}
	
}
/******
 * 部门的查询并定位
 * @param value
 */
function positionUnit(value,elementid,data){
	if(data.text.indexOf(value)==0){
		if(nodeValue!=null ){
			if(data.id!==nodeValue.id){
				var node=$("#"+elementid).tree('find',data.id);
				var parentNode=$("#"+elementid).tree('getParent',node.target);
				$("#"+elementid).tree("expand",parentNode.target);
				$("#"+elementid).tree('scrollTo',node.target);
				$("#"+elementid).tree('select',node.target);
				nodeValue=data;
				return true;
			}else{
				var children=data.children;
				if(children.length!=0){
					for(var i=0;i<children.length;i++){
						var flagUnit=position(value,elementid,children[i]);
						if(flagUnit==true){
							break ;
						}
					}
				}else{
					return;
				}
			}
		}else{
			var node=$("#"+elementid).tree('find',data.id);
			var parentNode=$("#"+elementid).tree('getParent',node.target);
			$("#"+elementid).tree("expand",parentNode.target);
			$("#"+elementid).tree('scrollTo',node.target);
			$("#"+elementid).tree('select',node.target);
			nodeValue=data;
			return true;
		}
	}else{
		var children=data.children;
		if(children.length!=0){
			for(var i=0;i<children.length;i++){
				var flagUnit=position(value,elementid,children[i]);
				if(flagUnit==true)
					break ;
			}
		}else{
			return;
		}
	}
	
	
	
}
/***
 * 关闭其他节点
 * @param i
 */
function toggleNode(i,elementid){
	for(var k=0;k<Alldata.length;k++){
		if(i!=k){
			var parentNode=$("#"+elementid).tree("find",Alldata[k].id);
			$("#"+elementid).tree("collapse",parentNode.target);
		}
	}
}
/***
 * 保存或移出选择的部门信息
 * @param node 选择的部门节点
 * @param checked 选中还是取消选中
 */
function setUnitInfo(node,checked){
	if(checked){
		var checkedNode=$('#deptPrivilegeEventId').tree('getChecked');
//		alert(checkedNode);
		var unitName="";
		if(checkedNode.length!=0){
			unitName=$("#searchUnit").val();
		}
		if(unitName!=""){
			unitName+=","+node.text;
		}else{
			unitName=node.text;
		}
		$("#searchUnit").attr('value',unitName);
		
		var unitId=$("#unitId").val();
		if(unitId!=""){
			unitId+=","+node.id;
		}else{
			unitId=node.id;
		}
		$("#unitId").attr('value',unitId);
	}else{
		var unitName=$("#searchUnit").val();
		var unitNames=unitName.split(',');
		var newUnitNames = [];
		unitNames.map(function (item) {
			if(item != node.text){
				return newUnitNames.push(item);
			}
		});
		$("#searchUnit").attr('value',newUnitNames.join(","));
		
		var unitId=$("#unitId").val();
		var unitIds=unitId.split(',');
		var newUnitIds = [];
		unitIds.map(function (item) {
			if(item != node.id){
				return newUnitIds.push(item);
			}
		});
		$("#unitId").attr('value',newUnitIds.join(","));
	}
}
/***
 * 初始化用户树
 */
function crateUserTree(){
	var unitId=$("#unitId").val();
	var roleUrl = "../../../jasdoc/privilege/privilege/getUserListByUnitId.do?unitIds="+unitId;
	$('#userPrivilegeEventId').tree({
		url : roleUrl,
		onLoadSuccess:function(node,data) {
			var node=$(this).tree('find',data[0].id);
			$(this).tree('select',node.target);
		},onSelect:function(node){
			getPrivilegeByUserIdAndFolderId(folderId,node.id);
		}
		
	});	
}


function getPrivilegeByUserIdAndFolderId(folderId,userId){
	$.ajax({
		type: "POST",
	   	url: 'getPrivilegeByUserIdAndFolderId.do',
   		data: {
   			    "folderId":folderId,
   			    "userId":userId
		  },
	   	success: function(data){
	   		$('#privelegetype div').each(function() {
				$(this).find(":checkbox").attr("checked",false); 
    		});
   			$("#folderUserRefId").val("");
	   		if(data!=null&&data.length>0){
	   			var result = data[0];
	   			var type=result.folderprivilegetype;
	     		$('#privelegetype div').each(function() {
	    			if (type >= $(this).attr('id')) {
	    				$(this).find(":checkbox").attr("checked",true); 
	    			}
	    		});
	     		$("#folderUserRefId").val(result.id);
	   		}
		},
	   	dataType:"json"
	});
}


function viewFolderById(folderId){
	$.ajax({
		type: "POST",
	   	url: rootPath+'jasdoc/folder/doccenter/viewFolderById.do',
   		data: {
   			    "folderId":folderId
   			  },
	   	success: function(data){
     		if(data!=null){
     			$("#foldername").html(data.foldername);
     			$("#folderlocation").html(data.folderlocation);
     			$("#createuser").html(data.createuser);
     			$("#createtime").html(data.createtime);
     			$("#description").html(data.description);
     		}
		},
	   	dataType:"json"
	});
}


/**
 * 方法描述；重新加载  dataGrid
 */
function loaderGrid(){
	var node=$('#userPrivilegeEventId').tree('find',userId);
	$('#userPrivilegeEventId').tree('select',node.target);
}


//保存方法
function saveFolderUser(){
	var userSelect = $('#userPrivilegeEventId').tree('getSelected');
	if(userSelect==null){
		$.messager.alert('tip',"请选择用户",'info');
		return;
	}
	var role = "";
	$('#privelegetype div').each(function() {
		if($(this).find(":checkbox").attr("checked")=="checked"){
			if (role <= $(this).attr('id')) {
				role = $(this).attr('id');
			}
		}
		});
	$("#role").val(role);
	$.ajax({
		type: "POST",
	   	url: 'saveSingleUserFolderPrivilege.do',
 		data: {
 			    "userId":userSelect.id,
 			    "folderId":folderId,
 			    "folderRole":role
 			  },
	   	success: function(check){
   		if (check.success=='1'){
   			$.messager.alert('提示',check.message,'ok',function(){
					getPrivilegeByUserIdAndFolderId(folderId,userSelect.id);
				});
				
			} else{
				$.messager.alert('错误',check.message,'error');
			}
		},
	   	dataType:"json"
	});
}
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
	
