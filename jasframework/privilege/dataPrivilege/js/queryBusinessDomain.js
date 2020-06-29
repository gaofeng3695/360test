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
 * 创建该业务分类下的表（视图）树
 * @param businessDomainId 业务域id
 */
function createRight(businessDomainId){
	$("#treeTable").tree({
//		url:rootPath+"/jasframework/privilege/dataprivilege/queryTableByBdId.do?id="+businessDomainId,
		url:rootPath+"/jasframework/privilege/dataprivilege/queryPrivilegeTable.do?domainId="+businessDomainId+"&appnumber="+APP_NUMBER,
		animate:true,
		onLoadSuccess:function(node,data){
			if(data.length>0){
				if(data[0].children.length>0){
					var firstNode=$("#treeTable").tree('find',data[0].children[0].id);
					$("#treeTable").tree('select',firstNode.target);
				}else{
					$('#field').attr('src',"");
				}
			}else{
				$('#field').attr('src',"");
			}
		},
		onSelect : function(node){
			if($("#treeTable").tree('isLeaf',node.target)){
				$('#field').attr('src',"queryTableField.htm?tableName="+node.text+"&isQuery="+true);
			}else{
				return false;
			}
		}
	});
}
