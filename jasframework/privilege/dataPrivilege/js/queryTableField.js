var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;
var Alldata;
var nodeValue=null;
var privilegeObj=new Array();
var initObj=new Array();
var tableName=getParamter('tableName');
var isQuery=getParamter("isQuery");
/***页面载入时***/
$(document).ready(function(){
	/**初始化"应用系统"下拉列表**/
	$("#appnumber").combobox({
		url:rootPath+"/jasframework/appsystem/getUserAppsystem.do",
		valueField:'appnumber',   
		textField:'name'  ,
		onSelect:function(record){
			createRight();
		},onLoadSuccess:function(){
			var data=$(this).combobox("getData");
			 if(data.length>0){
				 $(this).combobox('setValue',data[0].appnumber);
			 }
			 setComboObjWidth('appnumber',0.35,'combobox','system');
			 if(isQuery){
					$("#InputDetailBar").hide();
					$("#appnumber").combobox("setValue",APP_NUMBER);
					$("#appnumber").combobox("disable");
				}
			 createRight();
		}
	});
});

/***
 * 创建右侧treegird
 * @param node 左侧选中节点
 */
function createRight(){
	var title="可分配权限"
	if(isQuery){
		title="已有权限";
	}
	var appnumber=$("#appnumber").combobox("getValue");
	var url=rootPath+"/jasframework/privilege/dataprivilege/getFieldByTableName.do?tableName="+tableName+"&appnumber="+appnumber;
	var width=$('#main').width();
	$("#treegrid").treegrid({
		url:url,    
	    idField:'name',    
	    treeField:'name',
	    pagination:false,
	    title:'字段权限列表',
		iconCls:'icon-save',
		nowrap: false,
		rownumbers: true,
	    columns:[[
	        {field:'eventid',hidden : true},
	        {field:'name',title:'字段名',width:0.2*width},    
	        {field:'comments',title:'注释',width:0.3*width},    
	        {field:'privilege',title:title,width:0.2*width,formatter:function(value,name){
	        	var str="";
	        	var id1="query_"+name.name;
	        	var id2="allPrivilege_"+name.name;
	        	if(value==null){
	        		if(isQuery){
	        			str="&nbsp;&nbsp;<input type=\"checkbox\" disabled=\"true\"  class=\"query\" id=\""+id1+"\" onclick=\"setParivilege('"+name.name+"','query','"+id1+"')\" />查看&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"checkbox\" disabled=\"true\" id=\""+id2+"\" class=\"allPrivilege\" onclick=\"setParivilege('"+name.name+"','allPrivilege','"+id2+"')\"/>全部";
	        		}else{
	        			str="&nbsp;&nbsp;<input type=\"checkbox\"  class=\"query\" id=\""+id1+"\" onclick=\"setParivilege('"+name.name+"','query','"+id1+"')\" />查看&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"checkbox\"  id=\""+id2+"\" class=\"allPrivilege\" onclick=\"setParivilege('"+name.name+"','allPrivilege','"+id2+"')\"/>全部";
	        		}
	        	}else if(value=="query"){
	        		if(isQuery){
	        			str="&nbsp;&nbsp;<input type=\"checkbox\" disabled=\"true\" class=\"query\" checked=\"checked\" id=\""+id1+"\" onclick=\"setParivilege('"+name.name+"','query','"+id1+"')\" />查看&nbsp;&nbsp;&nbsp;&nbsp;<input disabled=\"true\" type=\"checkbox\" id=\""+id2+"\" class=\"allPrivilege\" onclick=\"setParivilege('"+name.name+"','allPrivilege','"+id2+"')\"/>全部";
	        		}else{
	        			str="&nbsp;&nbsp;<input type=\"checkbox\" class=\"query\" checked=\"checked\" id=\""+id1+"\" onclick=\"setParivilege('"+name.name+"','query','"+id1+"')\" />查看&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"checkbox\" id=\""+id2+"\" class=\"allPrivilege\" onclick=\"setParivilege('"+name.name+"','allPrivilege','"+id2+"')\"/>全部";
	        		}
	        		initPivilegeObjArray(name.name,value);
	        	}else if(value=="allPrivilege"){
	        		if(isQuery){
	        			str="&nbsp;&nbsp;<input type=\"checkbox\" disabled=\"true\" class=\"query\" checked=\"checked\" id=\""+id1+"\" onclick=\"setParivilege('"+name.name+"','query','"+id1+"')\" />查看&nbsp;&nbsp;&nbsp;&nbsp;<input disabled=\"true\" type=\"checkbox\" id=\""+id2+"\" class=\"allPrivilege\" checked=\"checked\" onclick=\"setParivilege('"+name.name+"','allPrivilege','"+id2+"')\"/>全部";
	        		}else{
	        			str="&nbsp;&nbsp;<input type=\"checkbox\"  class=\"query\" checked=\"checked\" id=\""+id1+"\" onclick=\"setParivilege('"+name.name+"','query','"+id1+"')\" />查看&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"checkbox\" id=\""+id2+"\" class=\"allPrivilege\" checked=\"checked\" onclick=\"setParivilege('"+name.name+"','allPrivilege','"+id2+"')\"/>全部";
	        		}
	        		initPivilegeObjArray(name.name,value);
	        		initPivilegeObjArray(name.name,"query");
	        	}
	        	return str;
	        }}    
	        
	    ]],onLoadSuccess:function(row,data){
	    	initObjArray(data.rows);
	    }
	});
	var height=$("#InputDetailBar").height();
	initDatagrigHeight('treegrid','system',height,'right');
}
/***
 * 初始化权限对象数组
 * @param value 字段值
 * @param privlege 权限值
 */
function initPivilegeObjArray(value,privilege){
	var Obj = {'fieldname' : value , 'privilege' : privilege};
	privilegeObj.push(Obj);
}
/***
 * 添加后删除权限
 * @param value 字段值
 * @param privilege 权限值
 * @param id 复选框id
 */
function setParivilege(value,privilege,id){
	//当勾选时
	if($("#"+id).attr('checked')=='checked'){
		//当选择‘全选’是默认勾选‘查看’
		initPivilegeObjArray(value,privilege);
		if(privilege=="allPrivilege"){
			if($("#query_"+value).attr('checked')!="checked"){
				$("#query_"+value).attr('checked','checked');
				initPivilegeObjArray(value,"query");
			}
		}
	}else{
		//取消勾选时
		if(privilegeObj!=null){
			for(var i=0;i<privilegeObj.length;i++){
				var obj=privilegeObj[i];
				if(obj.fieldname==value && obj.privilege==privilege){
					privilegeObj.splice(i, 1);//从指定为位置删除一个元素
					break;
				}
			}
		}
	}
}
/***
 * 保存事件
 * 将数据保存到数据库中
 */
function save(){
	if(privilegeObj.length<=0 && initObj.length<=0){
		showAlert("提示", "请勾选需保存字段的权限","info");
	}else{
		var newObj=checkPrivilegeObjArray();
		var isChange=checkSaveInfo(newObj,initObj);
		if(isChange){
			var objStr=JSON.stringify(newObj);
//			alert(objStr+"==="+JSON.stringify(privilegeObj));
			var appnumber=$('#appnumber').combobox('getValue');
			var url=rootPath+"/jasframework/privilege/dataprivilege/save.do";
			$.ajax({
				url:url,
				data:{"appnumber":appnumber,
					  "tableName":tableName,
					  "privilege":objStr
					  },
				type:"POST",
				dataType:'json',
				success:function(result){
					if(result.success==1){
						alert("保存成功");
						privilegeObj.splice(0,privilegeObj.length);
						initObj.splice(0,initObj.length);
						$('#treegrid').treegrid('reload');
					}else{
						alert("保存失败");
					}
				}
			});
		}else{
			showAlert("提示", "字段的权限没有改变，不需要保存！","info");
		}
	}
}
/***
 * 检测权限对象数据
 * 描述：当对象数组中同一字段，同时存在'query'和'allPrivilege'权限是移除'query'权限
 * @returns {Array} 返回对象数组
 */
function checkPrivilegeObjArray(){
	var newObj=new Array();
	if(privilegeObj!=null){
		newObj=privilegeObj.concat();
		for(var i=0;i<privilegeObj.length;i++){
			var obj1=privilegeObj[i];
			for(var j=0;j<newObj.length;j++){
				var obj2=newObj[j];
				if(obj1.field==obj2.field && obj1.privilege!=obj2.privilege){
					if(obj2.privilege=='query'){
						newObj.splice(j,1);
					}
				}
			}
		}
	}
	return newObj;
}

function initDatagrigHeight(datagridObjId, queryPanelObjId, queryPanelH, containerDivId) {
	datagridId = datagridObjId;
	queryPanelId = queryPanelObjId;
	queryPanelHeight = parseInt(queryPanelH);
	containerId = containerDivId;
	try {
		var containerHeight = $(window).height();
		var containerWidth = $(window).width();
		if (containerId && containerId != '') {
			containerHeight = $("#" + containerId).height()-68;
			containerWidth = $("#" + containerId).width()-20;
		}
		if (queryPanelId && queryPanelId != '') {
			$('#' + queryPanelId).panel({
				onOpen:changeDatagrigHeight,
				onExpand : function() {
					changeDatagrigHeight();
				},
				onCollapse : function() {
					changeDatagrigHeight();
				}
			});
		} else {
			$('#' + datagridId).datagrid('resize', {
				width : containerWidth,
				height : containerHeight
			});
		}
		document.body.onresize = changeDatagrigHeight;// 只能用js原生的方法，不能使用jquery的resize方法：$('body').bind('resize',function(){})
	} catch (e) {
	}
}

/**
 * 功能描述：页面窗口大小改变等情况下的datagrid高度自适应处理函数，common.js内部调用函数。
 */
function changeDatagrigHeight() {
	try {
		var containerHeight = $(window).height();
		var containerWidth = $(window).width();
		if (containerId && containerId != '') {
			containerHeight = $("#" + containerId).height()-68;
			containerWidth = $("#" + containerId).width()-20;
		}
		var gridWidth = containerWidth;
		var gridHeight = containerHeight;
		if (queryPanelId && queryPanelId != '') {
			$('#' + queryPanelId).panel('resize', {
				width : containerWidth
			});
			gridHeight = containerHeight - $('#' + queryPanelId).panel('panel').height();
		}
		$('#' + datagridId).datagrid('resize', {
			width : gridWidth,
			height : gridHeight
		});
	} catch (e) {
		// alert(e);
	}
}
function initObjArray(data){
	for(var i=0;i<data.length;i++){
		var obj=data[i];
		if(obj.privilege!=null){
			initObj.push(obj);
		}
	}
}
function checkSaveInfo(newObj,initObj){
	var flag=0;
	for(var i=0;i<newObj.length;i++){
		var obj=newObj[i];
		for(var j=0;j<initObj.length;j++){
			var obj1=initObj[j];
			if(obj.field==obj1.name && obj.privilege==obj1.privilege){
				flag++;
				break;
			}
		}
	}
	if(flag==newObj.length && newObj.length==initObj.length){
		return false;
	}else{
		return true;
	}
}