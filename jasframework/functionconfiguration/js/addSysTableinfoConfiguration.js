/**
 * 
 * 文件描述: 功能模块基本信息新增js。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-12-19 下午04:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-10-16       修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */

//数据库类型列表
var databasetypelist=[{
	id:"oracle",
	text:"oracle",
	selected:true
},{
	id:"mysql",
	text:"mysql"
}];

/**
 * 
 * 方法描述：初始化页面
 * 
 */
$(document).ready(function() {
	var databasetype="oracle";	//数据库类型
	var datasourcename;	//数据源名称
	loadComboboxDataByData("databasetype",databasetypelist);	//加载数据库类型数据列表
	loadComboboxDataByData("hasattachment",isFieldData);
	loadComboboxDataByData("hasworkflow",isFieldData);
	loadComboboxDataByData("geometerytype",geometrytypeData);
	$('#datasourcename').combobox({	//加载数据源名称的下拉列表信息
		url:rootPath+'jasframework/getDataSourceNamesList.do',
		valueField:'id',  
		textField:'text',
		panelHeight:"auto",
		onLoadSuccess:function(){
			setComboObjWidth('datasourcename',0.3,'combobox');
			var data = $('#datasourcename').combobox('getData'); 
	    	if (data.length > 0) {
	    		datasourcename=data[0].id;
	    		$('#datasourcename').combobox('select',data[0].id);
	    	}
		},
		onSelect:function(record){
			datasourcename=record.id;
			loadViewAndTableNames(databasetype,datasourcename);
		}
	});
	
	$('#databasetype').combobox({ 
		onSelect:function(record){
			databasetype=record.id;
		}
	});
	
});

/**
 * 
 * 方法描述：加载视图表名称和数据表名称的下拉框列表
 * 
 * @param databasetype	数据库类型
 * @param datasourcename	数据源名称
 * 
 */
function loadViewAndTableNames(databasetype,datasourcename){
	var viewnameurl=rootPath+'jasframework/getViewNamesList.do?databasetype='+databasetype+"&datasourcename="+datasourcename;
	var tablenameurl=rootPath+'jasframework/getTableNamesList.do?databasetype='+databasetype+"&datasourcename="+datasourcename;
	loadComboboxDataByUrl('viewname',viewnameurl,'VIEW_NAME','VIEW_NAME');
	loadComboboxDataByUrl('tablename',tablenameurl,'TABLE_NAME','TABLE_NAME');
	/*$('#viewname').combobox({
		onSelect : function(record){	//加载视图表名称与表名称的联动信息
			var viewName=record.VIEW_NAME;	//获取视图表名称
			$('#tablename').combobox('setValue',viewName.substr(2));
		}
	});*/
}

/**
 * 
 * 方法描述：保存功能模块基本信息
 * 
 */
function saveSystableinfo(){
//	$('#saveSysTableInfoButton').linkbutton('disable');
	//表单验证
	if($('#saveSysTableinfo').form('validate')==false){
		return false;
	}else{
		//表单提交
		$.ajax({
			url : addTokenForUrl(rootPath+'jasframework/addSysTableinfoAction.do?dataSourceName=defaultDataSource'),
			type: 'post',
			dataType: 'json',
			data: $('#saveSysTableinfo').serializeToJson(),
			success : function(data) {
				if(data=='true' || data==true){
					$.messager.alert('提示', '新增成功！', 'info',function(){
						reloadData('configurationHelpHtmL.htm', "configurationTable");
						top.closeDlg('tableinfoadd');
					});
				}else{
					// 如果新增失败按钮可用
					$('#saveSysTableInfoButton').linkbutton('enable');
					alert(3)
					$.messager.alert('错误', '新增失败！', 'error');
				}
				
			},
			error: function(data){
				// 如果新增失败按钮可用
				$('#saveSysTableInfoButton').linkbutton('enable');
				$.messager.alert('错误', '新增失败！', 'error');
			}
		});
	}
}