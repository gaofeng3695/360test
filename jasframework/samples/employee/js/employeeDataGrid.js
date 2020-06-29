//获取部门ID
var unitid;
/**
 * 添加
 */
function add(){
	top.getDlg("employeeForm.htm?unitid="+unitid, "employeeAddOrUpdate", getLanguageValue('添加员工信息'), 600, 200);
}

/**
 * 删除
 */
function dele() {
	var rows = $('#employeeListTable').datagrid('getSelections');
	if(rows == ""){
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}else {
		var jsonIds = arrayTojson(rows);
		$.ajax({
			type : "post",
			url : "../../sample/deleteEmployee.do",
			data : {
				jsonIds : jsonIds
			},
			success : function(msg) {
				$('#employeeListTable').datagrid('reload');
			}
		});
	}
}

/**
 * id数组转换为json字符串
 */
function arrayTojson(arr) {
	var jsonIds = "[";
	for ( var i = 0; i < arr.length; i++) {
		if (i == arr.length - 1) {
			jsonIds += arr[i].eventid;
		} else {
			jsonIds += arr[i].eventid + ",";
		}
	}
	jsonIds += "]";

	return jsonIds; 
}

/**
 * 更新
 */
function update(){
	var rows = $('#employeeListTable').datagrid('getSelections');
	if(rows == ""){
		top.showAlert(getLanguageValue("tip"),getLanguageValue("请选择要更新的数据！"),'info');
	}else {
		var jsonIds = arrayTojson(rows);
		if(rows.length == 1){
			top.getDlg("employeeForm.htm?eventid="+rows[0].eventid+"&r="+new Date().getTime(),"employeeAddOrUpdate",getLanguageValue("修改员工信息"),700,220);
		}else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("一次只能更新一条数据！"),'info');
		}
	}
}

/**
 * 查看
 */
function see(){
	var rows = $('#employeeListTable').datagrid('getSelections');
	if(rows == ""){
		top.showAlert(getLanguageValue("tip"),getLanguageValue("请选择要查看的数据！"),'info');
	}else {
		var jsonIds = arrayTojson(rows);
		if(rows.length == 1){
			top.getDlg("employeeView.htm?eventid="+rows[0].eventid+"&r="+new Date().getTime(),"employeeView",getLanguageValue("员工详细信息"),700,220);
		}else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("一次只能查看一条数据！"),'info');
		}
	}
}

/**
 * 查询
 */
function queryEmployee(){
	var name = $("#name").val();
	var address = $("#address").val();
	var query={"name":name,"address":address}; //把查询条件拼接成JSON
	$("#employeeListTable").datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
	$("#employeeListTable").datagrid('load'); //重新加载
}
/**
 * 页面数据初始化
 */
$(function(){
	$('#tt').tree({		
		url: '../../privilege/unit/getLeftTree.do',
		onLoadSuccess:function(node,data) {
		 	var aa=$('#tt').tree('select',$('#tt').tree('getRoot').target);
			var url = "./getAllUserByUnitid.do?unitid="+$('#tt').tree('getRoot').id;
			//alert(url);
			getChildren();
			$("#employeeListTable").datagrid("options").url = url;
			$("#employeeListTable").datagrid('load'); 
		},
		onClick:function(node){
			$("#employeeListTable").datagrid('clearSelections'); // clear
			queryUser();
			if(node.attributes.type){
				//$("#toolbar").hide();
			}else{
				$("#toolbar").show();
			}
		}
	});
	  	/**
	  	 * 页面自适应
	  	 */
	  	tempWidth = $('#queryDiv').css('width');
		if(tempWidth.lastIndexOf('px')>0){
			tempWidth = parseInt(tempWidth.substring(0,tempWidth.length-2))+4;
		}
   		initDatagrigHeight('employeeListTable','queryDiv','65','right');
   		initResize();
		
	});
/**
 * 描述：页面自适应
 */

$(window).bind("resize",function(){
resizeLayout();
});


function resizeLayout(){
	try{
		clientWidth = document.documentElement.clientWidth;
		var div_left_width = $("#left").width()+11;
		$("#cc").layout("resize");
		$('#queryDiv').panel('resize',{width:clientWidth-div_left_width}); 
		$('#employeeListTable').datagrid('resize',{width:clientWidth-div_left_width});
	}catch(e){
		
	}
}

function getChildren(){
	var node = $('#tt').tree('getSelected');
    if (node) {
        var children = $('#tt').tree('getChildren', node.target);
    }
    else {
        var children = $('#tt').tree('getChildren');
    }
    var s = "'";
    for (var i = 0; i < children.length; i++) {
        s += children[i].id + "','";
    }
    s+=node.id + "'";
    return s;
}

/**
 * 描述：查询用户
 */
function queryUser(){
	$("#employeeListTable").datagrid('clearSelections'); // clear
//	var loginName = $("#loginName").val();		
	var name = $("#name").val();
	var address = $("#address").val();
//	var userrange = $('#userrange').combobox("getValue");
	//var userrange = $('#userrange').combotree('getValue');
	var query={"name":name,"address":address};
	var row = $('#tt').tree('getSelected');
	var url;
	if (row != null ){	
		unitid = row.id;
		url="../../sample/getAllByUnitID.do?eventid=" + row.id;
//		if(userrange==1){
//	 		var unitidList = getChildren();
//			url = "./getAllUserByUnitid.do?unitidList=" + unitidList;
//		}else{
//			url="./getAllUserByUnitid.do?unitid=" + row.id;
//		}	
		$("#employeeListTable").datagrid("options").url = url;
		$("#employeeListTable").datagrid('options').queryParams=query;
		$("#employeeListTable").datagrid('load');	
		$("#employeeListTable").datagrid('options').queryParams=null;
	 }else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		return;
	}
}

/**
 *自动适应页面大小 
 */
function initResize(){
	
	$(".layout-button-left").bind("click",function(){
		$('#userquery').panel('resize',{width:clientWidth-28});
		$('#employeeListTable').datagrid('resize',{width:clientWidth-28});
		$(".layout-button-right").bind("click",function(){
			$('#userquery').panel('resize',{width:tempWidth}); 
			$('#employeeListTable').datagrid('resize',{width:tempWidth});
		});
	});
}