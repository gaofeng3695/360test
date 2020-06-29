var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;
var Alldata;
var nodeValue=null;
//var privilegeObj=new Array();
var initObj=new Array();
var domianId="";
var noTableData;
var hsTableData;
/***页面载入时***/
$(document).ready(function(){
	domianId=getParamter("id");
	$.ajax({
		type: "POST",
	   	url: rootPath+"/jasframework/privilege/dataprivilege/getNoTable.do",
   		data: {"id":domianId},
   		dataType:"json",
	   	success: function(result){
	   		noTableData=result.noItem;
	   		hsTableData=result.hsItem;
	   		init();
	   		button();
	   	}
	});
});
function init(){
	/**初始化左侧树**/
	$("#notabletree").tree({
//		url:rootPath+"/jasframework/privilege/dataprivilege/getNoTable.do",
		data:noTableData,
		animate:true,
		checkbox:true,
		cascadeCheck:false,
		onlyLeafCheck:true,
		onLoadSuccess:function(node,data){
			Alldata=data;
			if(data.length>0){
				if(data[0].children.length>0){
					var firstNode=$("#notabletree").tree('find',Alldata[0].children[0].id);
					$("#notabletree").tree('select',firstNode.target);
				}
			}
		},onDblClick:function(node){
			$("#notabletree").tree('check',node.target);
			var selectNodes=$('#notabletree').tree('getChecked');
			addTable(selectNodes);
		}
	});
	$("#hstabletree").tree({
//		url:rootPath+"/jasframework/privilege/dataprivilege/getHsTable.do",
		data:hsTableData,
		animate:true,
		checkbox:true,
		cascadeCheck:false,
		onlyLeafCheck:true,
		onLoadSuccess:function(node,data){
			Alldata=data;
			if(data.length>0){
//				if(data[0].children.length>0){
//					var firstNode=$("#hstabletree").tree('find',Alldata[0].children[0].id);
//					$("#hstabletree").tree('select',firstNode.target);
//				}
			}
		},onDblClick:function(node){
			$("#hstabletree").tree('check',node.target);
			var selectNodes=$('#hstabletree').tree('getChecked');
			removeTable(selectNodes);
		}
	});
	search();
}
var flag=false;
/**搜索框**/
var oldKeyWord="";
function search(){
	$("#noSearch").keyup(function(event) {
		var myevent = event || window.event;
		var mykeyCode = myevent.keyCode;
		var trueorfalse =(mykeyCode==13) || (mykeyCode >= 65 && mykeyCode <= 90) || mykeyCode == 8 || mykeyCode == 46 || mykeyCode == 32 ||(mykeyCode >= 48 && mykeyCode <= 57) || (mykeyCode >= 96 && mykeyCode <= 105);
		if(trueorfalse){
			var keyWord=$('#noSearch').val();
			if(keyWord!="" && keyWord.length>oldKeyWord.length){
				oldKeyWord=keyWord;
				noposition(keyWord.toLowerCase());
			}if(keyWord!="" ){
				oldKeyWord="";
			}
		}
	});
	$("#hsSearch").keyup(function(event) {
		var myevent = event || window.event;
		var mykeyCode = myevent.keyCode;
		var trueorfalse =(mykeyCode==13) || (mykeyCode >= 65 && mykeyCode <= 90) || mykeyCode == 8 || mykeyCode == 46 || mykeyCode == 32 ||(mykeyCode >= 48 && mykeyCode <= 57) || (mykeyCode >= 96 && mykeyCode <= 105);
		if(trueorfalse){
			var keyWord=$('#hsSearch').val();
			if(keyWord!="" && keyWord.length>oldKeyWord.length){
				oldKeyWord=keyWord;
				hsposition(keyWord.toLowerCase());
			}if(keyWord!="" ){
				oldKeyWord="";
			}
		}
	});
}
/******
 * 查询并定位
 * @param value
 */
function noposition(value){
	flag=false;
	for(var i=0;i<Alldata.length;i++){
		var data=Alldata[i].children;
		for(var j=0;j<data.length;j++){
			if(data[j].id.toLowerCase().indexOf(value)==0){
				if(nodeValue==null){
					var node=$("#notabletree").tree('find',data[j].id);
					/***打开当前节点***/
					var parentNode=$("#notabletree").tree('getParent',node.target);
					$("#notabletree").tree("expand",parentNode.target);
					noToggleNode(i);//关不其他节点
					$("#notabletree").tree('scrollTo',node.target);
					$("#notabletree").tree('select',node.target);
					nodeValue=node;
					flag=true;
					break;
				}else{
					nextNodeId=nodeValue.attributes.nextNodeId;
					if(nextNodeId.toLowerCase().indexOf(value)!=-1){
						var node=$("#notabletree").tree('find',nextNodeId);
						var parentNode=$("#notabletree").tree('getParent',node.target);
						$("#notabletree").tree("expand",parentNode.target);
						noToggleNode(i);
						$("#notabletree").tree('scrollTo',node.target);
						$("#notabletree").tree('select',node.target);
						nodeValue=node;
						flag=true;
						break;
					}else{
						nodeValue=null;
						j=-1;
						continue;
					}
				}
			}
		}
		if(flag){
			break;
		}
	}
}
/******
 * 查询并定位
 * @param value
 */
function hsposition(value){
	flag=false;
	for(var i=0;i<Alldata.length;i++){
		var data=Alldata[i].children;
		for(var j=0;j<data.length;j++){
			if(data[j].id.toLowerCase().indexOf(value)==0){
				if(nodeValue==null){
					var node=$("#hstabletree").tree('find',data[j].id);
					/***打开当前节点***/
					var parentNode=$("#hstabletree").tree('getParent',node.target);
					$("#hstabletree").tree("expand",parentNode.target);
					hsToggleNode(i);//关不其他节点
					$("#hstabletree").tree('scrollTo',node.target);
					$("#hstabletree").tree('select',node.target);
					nodeValue=node;
					flag=true;
					break;
				}else{
					nextNodeId=nodeValue.attributes.nextNodeId;
					if(nextNodeId.toLowerCase().indexOf(value)!=-1){
						var node=$("#hstabletree").tree('find',nextNodeId);
						var parentNode=$("#hstabletree").tree('getParent',node.target);
						$("#hstabletree").tree("expand",parentNode.target);
						hsToggleNode(i);
						$("#hstabletree").tree('scrollTo',node.target);
						$("#hstabletree").tree('select',node.target);
						nodeValue=node;
						flag=true;
						break;
					}else{
						nodeValue=null;
						j=-1;
						continue;
					}
				}
			}
		}
		if(flag){
			break;
		}
	}
}
/***
 * 关闭其他节点
 * @param i
 */
function noToggleNode(i){
	for(var k=0;k<Alldata.length;k++){
		if(i!=k){
			var parentNode=$("#notabletree").tree("find",Alldata[k].id);
			$("#notabletree").tree("collapse",parentNode.target);
		}
	}
}
function hsToggleNode(i){
	for(var k=0;k<Alldata.length;k++){
		if(i!=k){
			var parentNode=$("#notabletree").tree("find",Alldata[k].id);
			$("#notabletree").tree("collapse",parentNode.target);
		}
	}
}
function closeWindow(){
	parent.closeWindow('addTableForDomain');
}
function button(){
	//移到右边
	$('#add').click(function() {
		//获取选中的选项，删除并追加给对方
		var selectNodes=$('#notabletree').tree('getChecked');
		addTable(selectNodes);
	});
	//移到左边
	$('#remove').click(function() {
		var selectNodes=$('#hstabletree').tree('getChecked');
		removeTable(selectNodes);
	});
	//全部移到右边
	$('#add_all').click(function() {
		//获取全部的选项,删除并追加给对方
		$.messager.confirm('提示','您确定添加所有的表吗？',function (t){
			if(t){
				addAllTable();
			}
		});
	});
	//全部移到左边
	$('#remove_all').click(function() {
		$.messager.confirm('提示','您确定移除所有的表吗？',function (t){
			if(t){
				removeAllTable();
			}
		});
	});
}
function addTable(selectNodes){
//	var selectNodes=$('#notabletree').tree('getChecked');
	for(var i=0;i<selectNodes.length;i++){
		$('#notabletree').tree('remove',selectNodes[i].target);
		selectNodes[i].checked=false;
		var parentNode=$('#hstabletree').tree('find',selectNodes[i].attributes.parentEventid);
		if(parentNode==null){
			$('#hstabletree').tree('append', {
				parent: "",
				data: [{
					id: selectNodes[i].attributes.parentEventid,
					text: selectNodes[i].attributes.parentEventid
				}]
			});
		}
		var parentNode=$('#hstabletree').tree('find',selectNodes[i].attributes.parentEventid);
		$('#hstabletree').tree('append', {
			parent:parentNode.target,
			data:selectNodes[i]
		});
	}
	var dataNodes=$('#notabletree').tree('getRoots');
	for(var i=0;i<dataNodes.length;i++){
		if(dataNodes[i].children.length==0){
			$('#notabletree').tree('remove',dataNodes[i].target);
		}
	}
}
function addAllTable(){
	var hsRootNodes=$('#hstabletree').tree('getRoots');
	var noRootNodes=$('#notabletree').tree('getRoots');
	if(hsRootNodes.length>0){
		for(var i=0;i<noRootNodes.length;i++){
			addTable(noRootNodes[i].children);
		}
	}else{
		for(var i=0;i<noRootNodes.length;i++){
			$('#hstabletree').tree('append', {
				parent: "",
				data: noRootNodes[i]
			});
		}
	}
	$('#notabletree').tree('loadData',[]);
}
function removeTable(selectNodes){
	for(var i=0;i<selectNodes.length;i++){
		$('#hstabletree').tree('remove',selectNodes[i].target);
		selectNodes[i].checked=false;
		var parentNode=$('#notabletree').tree('find',selectNodes[i].attributes.parentEventid);
		if(parentNode==null){
			$('#notabletree').tree('append', {
				parent: "",
				data: [{
					id: selectNodes[i].attributes.parentEventid,
					text: selectNodes[i].attributes.parentEventid
				}]
			});
		}
		var parentNode=$('#notabletree').tree('find',selectNodes[i].attributes.parentEventid);
		$('#notabletree').tree('append', {
			parent:parentNode.target,
			data:selectNodes[i]
		});
	}
	var dataNodes=$('#hstabletree').tree('getRoots');
	for(var i=0;i<dataNodes.length;i++){
		if(dataNodes[i].children.length==0){
			$('#hstabletree').tree('remove',dataNodes[i].target);
		}
	}
}
function removeAllTable(){
	var hsRootNodes=$('#hstabletree').tree('getRoots');
	var noRootNodes=$('#notabletree').tree('getRoots');
	if(noRootNodes.length>0){
		for(var i=0;i<hsRootNodes.length;i++){
			removeTable(hsRootNodes[i].children);
		}
	}else{
		for(var i=0;i<hsRootNodes.length;i++){
			$('#notabletree').tree('append', {
				parent: "",
				data: hsRootNodes[i]
			});
		}
	}
	$('#hstabletree').tree('loadData',[]);
}
function saveInfo(){
	var privilegeObj=new Array();
	var dataNodes=$('#hstabletree').tree('getRoots');
	var tableType=1;
	for(var i=0;i<dataNodes.length;i++){
		if(dataNodes[i].id=='视图'){
			tableType==2;
		}
		var childrenNode=dataNodes[i].children;
		for(var j=0;j<childrenNode.length;j++){
			var node=childrenNode[j];
			var Obj = {'tablename' : node.id , 'tabledesc' : node.comments,'domainid':domianId,"tabletype":tableType};
			privilegeObj.push(Obj);
		}
	}
	var strObj=JSON.stringify(privilegeObj);
	$.ajax({
		type: "POST",
	   	url: rootPath+"/jasframework/privilege/dataprivilege/saveDataBdRelation.do",
   		data: {"strObj":strObj,"domianId":domianId},
   		dataType:"json",
   		success:function(result){
   			if(result.success=="1"){
   				showAlert("提示","保存成功", "info");
   				parent.reloadTree(1);
   				closeWindow();
   			}else{
   				showAlert("错误",result.msg,"error");
   			}
   		}
	});
}