
/**
 * 方法描述
 */
function viewServiceInfo(){
	var rows = $('#serviceInfoDatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#serviceInfoDatagrid').datagrid('getSelected');
		window.open(row.serviceUrl);
	}else{
		top.showAlert("提示","请选择一条记录",'info');
	}
}
function addServiceInfo(){
	top.getDlg("addServiceInfo.html","addiframe","添加",500,300);
}
function updateServiceInfo(){
	var rows = $('#serviceInfoDatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#serviceInfoDatagrid').datagrid('getSelected');
		top.getDlg("updateServiceInfo.html?eventId="+row.eventId,"updateiframe","修改",500,300);
	}else{
		top.showAlert("提示","请选择一条记录",'info');
	}
}
function deleteServiceInfo(){
	var rows = $('#serviceInfoDatagrid').datagrid('getSelections');
	if (rows.length > 0){
		var eventIds="";
		$(rows).each(function(i,obj){
			if(i==0){
				eventIds=obj.eventId;
			}else{
				eventIds+=","+obj.eventId;
			}
		});
		$.messager.confirm("提示","确定要删除选中的记录？",function(r){
			if (r){
				$.ajax({
					   type: "POST",
					   url: rootPath+"/serviceInfo/deleteServiceInfo.do",
					   data: {"eventId" : eventIds},
					   dataType:"json",
					   success: function(data){
							if(data.success==1){
								top.showAlert("提示","删除成功");
								$('#serviceInfoDatagrid').datagrid('reload');	
								$('#serviceInfoDatagrid').datagrid('clearSelections'); 
							}else{
								top.showAlert("提示","删除失败");
							}
					   }
					});
			}
		});
	}else{
		top.showAlert("提示","请选择一条记录",'info');
	}
}

function queryServiceInfo(){
	$('#serviceInfoQueryForm').form('submit', {
		url : rootPath+"/serviceInfo/queryServiceInfoPage.do",//"",
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(data) {
			var data = eval('(' + data + ')');
			$("#serviceInfoDatagrid").datagrid("loadData",data);
		}
	});
}

/**
 * 页面初始化
 * 
 */
$(document).ready(function(){
	$('#serviceInfoDatagrid').datagrid({
		width:'100%',
		nowrap: false,
		striped: true,
		collapsible:false,
		url: rootPath+"/serviceInfo/queryServiceInfoPage.do",
		remoteSort: true,
		pagination:true,
		rownumbers:true,
		fitColumns:true,
		pageSize:15,
		columns:[[ 
		  		{field:'eventId',title:'eventId',width:100,hidden:true}, 
		  		{field:'serviceName',title:'服务名称',width:80},		
		  		{field:'serviceUrl',title:'服务地址',width:150},
		  		{field:'createdDate',title:'创建时间',width:100},		
		  		{field:'description',title:'服务描述',width:190}
		  		
		  			]],
		onDblClickRow:function(index,indexData){
//			top.getDlg("viewServiceInfo.htm?id="+indexData.eventId+"&r="+new Date().getTime(),'',"详细信息",450,220);			
		},
		onLoadSuccess:function(data){
	    	$('#serviceInfoDatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	initDatagrigHeight('serviceInfoDatagrid','queryDiv',66);
	//设置回车查询
	$('input,select,.querytable').keydown(function(e){ 
		if(e.keyCode==13){ 
			queryServiceInfo();
	} });
});
