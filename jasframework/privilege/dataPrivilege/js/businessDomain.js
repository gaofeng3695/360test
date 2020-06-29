var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;
var Alldata;
var nodeValue=null;
var privilegeObj=new Array();
var initObj=new Array();
var businessDomainId="";
/***页面载入时***/
$(document).ready(function(){
	/**初始化业务分类树**/
	$("#businessTree").tree({
		url:rootPath+"/jasframework/privilege/dataprivilege/queryBusinessDomain.do",
		animate:true,
		onLoadSuccess:function(node,data){
//			Alldata=data;
			var firstNode=$("#businessTree").tree('find',data[0].id);
			$("#businessTree").tree('select',firstNode.target);
		},
		onSelect : function(node){
			businessDomainId=node.id;
			createRight(node.id);
		}
	});
	var height=$("#searchDiv").height();
	document.getElementById("divtree").style.marginTop=height+'px';
});
/**
 * 新增业务域
 */
function addBusinessDomain(){
	getDlg('addBuisnessDomain.htm','addBuisnessDomain','新增业务域',460,160);
}
/***
 * 修改业务域
 */
function editBusinessDomain(){
	var node=$('#businessTree').tree('getSelected');
	getDlg('editBuisnessDomain.htm?id='+node.id,'editBuisnessDomain','修改业务域',460,160);
}
/***
 * 删除业务域
 */
function deleteBusinessDomain(){
	var node=$('#businessTree').tree('getSelected');
	$.messager.confirm("提示","您确定删除该业务分类？",function (t){
		if(t){
			$.ajax({
				url:rootPath+"/jasframework/privilege/dataprivilege/deleteBusinessDomainById.do",
				data:{"domainId":node.id},
				type:"POST",
				dataType:'json',
				success:function(data){
					if(data.success=="1"){
						showAlert("提示", "删除成功！", "info");
						reloadTree();
					}else{
						showAlert("警告",data.msg,"error");
					}
				}
			
			});
		}
	});
}
function closeWindow(id){
	closeDlg(id);
}
/**
 * 创建该业务分类下的表（视图）树
 * @param businessDomainId 业务域id
 */
function createRight(businessDomainId){
	$("#treeTable").tree({
		url:rootPath+"/jasframework/privilege/dataprivilege/queryTableByBdId.do?id="+businessDomainId,
		animate:true,
		onLoadSuccess:function(node,data){
			if(data.length>0){
				if(data[0].children.length>0){
					var firstNode=$("#treeTable").tree('find',data[0].children[0].id);
					$("#treeTable").tree('select',firstNode.target);
				}else{
					$('#field').attr('src',"");
				}
			}
		},
		onSelect : function(node){
			if($("#treeTable").tree('isLeaf',node.target)){
				$('#field').attr('src',"queryTableField.htm?tableName="+node.text);
			}else{
				return false;
			}
		}
	});
}
function addTable(){
	getDlg('addTableForDomain.htm?id='+businessDomainId,'addTableForDomain','新增业务域',500,500);
}
function reloadTree(flag){
	if(flag==1){
		$("#treeTable").tree('reload');
	}else{
		$("#businessTree").tree('reload');
	}
}