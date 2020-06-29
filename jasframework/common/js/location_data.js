/**
 * 定位选中的数据
 * @param datagrid 
 * @param layer
 * @param oid
 * @returns
 */
function locationSelect(datagrid,layer,oid){
	var ids = '';
	if(!isNull(oid)){
		ids +=',"'+oid+'"';
	}else{
		var rows = $('#'+datagrid).datagrid('getSelections');
		for ( var i = 0; i < rows.length; i++) {
			ids +=',"'+rows[i].oid+'"';
		}
	}
	if(ids == ''){
		$.messager.alert('提示','未选中数据','info');		
		return;
	}
	ids =ids.substring(1);
	var location = '{"LAYER":"'+layer+'","OID":['+ids+']}';
	console.log(location);
	GPSMap(location);
}

function locationAll(url,queryForm,layer){
	var queryData =$('#'+queryForm).serialize();
	encodeURI(queryData);
	queryData = decodeURI(queryData);
	var ids = '';
	$.ajax({
		url : rootPath+url,
		data :queryData,
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					ids +=',"'+data[i]+'"';
				}
			}
			if(ids == ''){
				$.messager.alert('提示','未选中数据','info');		
				return;
			}
			ids =ids.substring(1);
			var location = '{"LAYER":"'+layer+'","OID":['+ids+']}';
			console.log(location);
			GPSMap(location);
			
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}