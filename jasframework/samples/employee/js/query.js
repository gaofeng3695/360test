$(function() {
	//搜索栏选择框内容
	$('#sexrange').combobox({
		data : [
		{
			"id":"",
			"text":"不搜索性别"
			
		},{
			"id":"男",
			"text":"男"
		},{
			"id":"女",
			"text":"女"
		}],
		valueField : 'id',
		textField : 'text'
	});
});


//清空搜索栏
function clearselectform(){
	$("#queryname").val("");
	$("#sexrange").combobox("setValue","");		
}

function viewUser(){
	var rows = $('#showEmplorye').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#showEmplorye').datagrid('getSelected');
		var eventID =row.eventid;
        top.getDlg("view.htm?random="+new Date().getTime()+"&id=" + eventID,"viewiframe","员工信息",710,80);
        // 地址，类型，框标题，长宽
	}else{
		$.messager.alert('提示', '请选中一条记录', 'info');
		//$.调用jquery自己的内置对象
	}
}

function add(){
	top.getDlg("add.htm","saveiframe","添加员工信息",700,150);
}

function dele(){
	var rows = $('#showEmplorye').datagrid('getSelections');
	if (rows.length > 0){
		var ids="";
		for(var i=0;i<rows.length;i++){
			ids += ","+rows[i].eventid;
		}
		if(ids.length > 0)ids = ids.substring(1);
		$.messager.confirm("删除","确定删除？",function(r){
			if (r){
				var postUrl = '../../emploryTest/deleteEmplorye.do';
				$.post(postUrl,{"ids":ids},function(result){
					if (result.error!='-1'){
						top.showAlert("成功","数据已删除",'info');
						reloadData('employee.htm','#showEmplorye');
					} else {
						top.showAlert("错误","删除失败",'error');
						return;
					}
				},'json');
			}
		});
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("pleasechoose"),'info');
		return;
	}
}

function update(){
	var rows = $('#showEmplorye').datagrid('getSelections');
	if(rows.length == 1){
		top.getDlg("add.htm?eventid="+rows.eventid,"saveiframe","添加员工信息",700,150);
	}else{
		$.message.alert('提示','请选择一条记录','info');
	}
}

function queryUser(){
	var name = $("#queryname").val();
	var sexrange = $('#sexrange').combobox("getValue");
	$("#showEmplorye").datagrid("load",{isSearch:true,"name":name,"sex":sexrange});
}
