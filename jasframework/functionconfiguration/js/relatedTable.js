var syssid;
var isRelated;
var subtablefieldid;
var subtableid;
var tableid =getParamter('tableid');
var tablename =getParamter('tablename');	//表名称
var pkfield =getParamter('pkfield');
var dsName=getParamter('dsName');
$(document).ready(function() {
	masterTableChildHeight();	// 计算标签内容高度
	var sid =getParamter('sid');
	$('#mastertabletext').text(tablename);
	$('#mastertableid').val(tablename);
	loadComboboxDataByUrl('mastertablefieldid',rootPath+"jasframework/getRelatedFieldNameList.do?tablename="+tablename);
	$('#mastertablefieldid').combobox('setValue','');
	$('#subtableid').combobox({
		url:rootPath+"jasframework/querySysTableidByTableidAction.do?dataSourceName=defaultDataSource&tablename="+tablename,
	    valueField:'id',  
	    textField:'text',
	    panelHeight:"auto",
		onLoadSuccess:function(){
			setComboObjWidth('subtableid',0.3,'combobox');
			loadComboboxDataByUrl('subtablefieldid',rootPath+'jasframework/getRelatedFieldNameList.do?dataSourceName=defaultDataSource&tablename='+$('#subtableid').combobox('getValue'));
			$('#subtablefieldid').combobox('setValue','');
		},
		onSelect: function(record){
			loadComboboxDataByUrl('subtablefieldid',rootPath+'jasframework/getRelatedFieldNameList.do?dataSourceName=defaultDataSource&tablename='+$('#subtableid').combobox('getValue'));
			$('#subtablefieldid').combobox('setValue','');
		}
	});
	$.ajax({
		url :rootPath+"jasframework/isHasRelatedAction.do?dataSourceName=defaultDataSource&tablename="+tablename,
		data:"eventid="+sid,
		type:'post',
		success : function(data) {
			if(data.flag){
				
				$('#eventid').val(data.related.eventid);
				$('#mastertableid').val(data.related.mastertableid);
				$('#mastertablefieldid').combobox('setValue',data.related.mastertablefieldid);
				$('#subtableid').combobox('setValue',data.related.subtableid);
//				alert(data.related.subtablefieldid);
//				setTimeout($('#subtablefieldid').combobox('setValue',data.related.subtablefieldid),100);
				$('#subtablefieldid').combobox('setValue',data.related.subtablefieldid);
				subtablefieldid =data.related.subtablefieldid;
				subtableid =data.related.subtableid;
			}
			isRelated =data.flag;
			
		},
		dataType:"json",
		error : function(data) {
			$.messager.alert('提示', '查询是否添加关联关系失败！', 'error');	
		}
	});  
	syssid=sid;
});

/**
 * 方法描述：根据主表tableid删除关联信息
 */
function deleteRelatedByTableId(){
	$.ajax({
		url :rootPath+"jasframework/deleteRelatedByTableId.do?dataSourceName=defaultDataSource&tablename="+tablename,
		success : function(data) {
			if(data){
				$.messager.alert('提示', '删除关联关系成功！', 'info');	
				top.closeDlg('tablecolumnadd');
			}else{
				$.messager.alert('提示', '删除关联关系失败！', 'error');
			}
		},
		dataType:"json",
		error : function(data) {
			$.messager.alert('提示', '删除关联关系失败！', 'error');	
		}
	});  
}

/**
 * 方法描述：添加功能模块父子模块关联关系
 */
function updateRelatedTable(){
	//表单验证
	if($('#updateRelated').form('validate')==false)
  		return false;
	if(isRelated){
		$.ajax({
			url: addTokenForUrl(rootPath+"jasframework/updateRelatedTableAction.do?dataSourceName=defaultDataSource"),
			type: 'post',
			dataType: 'json',
			data: $('#updateRelated').serializeToJson(),
	        success: function(data){
	        	if(data){
	        		$.messager.alert('提示', '修改成功！', 'info',function(){
		        		top.closeDlg('tablecolumnadd');
		        	});	
	        	}else{
	        		$.messager.alert('提示', '修改失败！', 'error');	
	        	}
	        },
	        dataType:"json",
	        error : function(data) {
	        	$.messager.alert('提示', '修改失败！', 'error');	
	        }
		});
	}else{
		$.ajax({
			url: addTokenForUrl(rootPath+"jasframework/addRelatedTableAction.do?dataSourceName=defaultDataSource"),
			type: 'post',
			dataType: 'json',
			data: $('#updateRelated').serializeToJson(),
	        success: function(data){
	        	if(data){
	        		$('#10120306').linkbutton('disable');
	        		$.messager.alert('提示', '保存成功！', 'info',function(){
		        		top.closeDlg('tablecolumnadd');
		        	});	
	        	}else{
	        		$.messager.alert('提示', '保存失败！', 'error');	
	        	}
	        },
	        dataType:"json",
	        error : function(data) {
	        	$.messager.alert('提示', '保存失败！', 'error');	
	        }
		});
	}
}

