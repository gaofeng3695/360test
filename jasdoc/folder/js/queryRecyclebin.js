/**
 * 
 * 方法描述：初始化数据
 * 
 */
$(function(){
	var menuUrl = this.location.search;
	if( menuUrl != null && "" != menuUrl ){
		var menuUrlGroup = menuUrl.substr(1).split("&");
		if( menuUrlGroup.length >= 3 ){
			folderId = menuUrlGroup[0].split("=")[1];
			hierarchy = menuUrlGroup[1].split("=")[1];
			foldertype = menuUrlGroup[2].split("=")[1];
		}
	}
	var width=$('body').width();
	$('#dg').datagrid({
		width:'100%',
		nowrap: false,
		striped: true,
		collapsible:false,
		url:'../recyclebin/queryListRecycleBin.do',
		remoteSort: true,
		idField:'eventid',
		pagination:true,
		rownumbers:true,
		toolbar:'#toolbar',
	 	columns:[[
	           {field:'ck',title:'全选',checkbox:true}, 
	           {field:'recycleobjname',title:'删除对象名称',width:0.25*width}, 
	           {field:'oldlocation',title:'原位置',width:0.3*width} ,
	           {field:'recycledate',title:'删除时间',width:0.18*width},
	           {field:'filesize',title:'文档大小(kb)',width:0.1*width},
	           {field:'filetype',title:'文档格式',width:0.1*width},
	           {field:'recycleobjid',title:'文档格式',width:0.1*width,hidden:true}
	       ]],
		onLoadSuccess:function(data){
			if(data.msg){
				$.messager.alert('错误', data.msg, data.error);
			}
	    	$('#dg').datagrid('clearSelections'); //clear selected options
	    }
	});	
	initDatagrigHeight('dg', 'searchpanel', $('#searchpanel').height());
});
			
		
		
function createColumnMenu(){
	var tmenu = $('<div id="tmenu" style="width:100px;"></div>').appendTo('body');
	var fields = $('#dg').datagrid('getColumnFields');
	for(var i=0; i<fields.length; i++){
		$('<div iconCls="icon-ok"/>').html(fields[i]).appendTo(tmenu);
	}
	tmenu.menu({
		onClick: function(item){
			if (item.iconCls=='icon-ok'){
				$('#dg').datagrid('hideColumn', item.text);
				tmenu.menu('setIcon', {
					target: item.target,
					iconCls: 'icon-empty'
				});
			} else {
				$('#dg').datagrid('showColumn', item.text);
				tmenu.menu('setIcon', {
					target: item.target,
					iconCls: 'icon-ok'
				});
			}
		}
	});
}

/**
 * 方法描述：删除文档  根据回收站中文档id=删除批次 对同批次的数据执行删除操作
 */
function deleteRecycleObj(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length > 0){
		var recycleObjIds= "" ;
		var recycleObjTypes = "";
		var eventIds = "";
		for(var i=0;i<rows.length-1;i++){
			eventIds += rows[i].eventid+",";
			recycleObjTypes += rows[i].recycleobjtype+","; 
			recycleObjIds+=rows[i].recycleobjid+",";
		}
		eventIds += rows[rows.length-1].eventid;
		recycleObjTypes += rows[rows.length-1].recycleobjtype;
		recycleObjIds+=rows[rows.length-1].recycleobjid
		$.messager.confirm('删除文档', '确定要彻底删除勾选文件吗？', function(r){
			if (r){
				$.ajax({
					type: "POST",
				   	url: "../recyclebin/deleteRecycleObj.do?random=" + new Date().getTime(),
			   		data: {"eventId":eventIds,"recycleObjType":recycleObjTypes,"recycleObjIds":recycleObjIds},
				   	success: function(jso){
				   		$('#dg').datagrid('reload');	// reload the user data
						//reloaddate();		
						$('#dg').datagrid('clearSelections'); 	//clear selected options
				   	},
				   	error:function(){
				   		$.messager.alert('错误','删除文档失败！','error');
				   	}
			   	});
			   }
			});
	}else{
		$.messager.alert('提示','请勾选删除记录！','info');
	}
}

/**  
 * 方法描述：清空回收站 、根据回收站中用户id 、删除回收站数据及同批次下的文档及文件夹,及关联关系
 */
function clearRecycleBin(){
	$.messager.confirm('清空回收站', '确定要清空回收站吗？', function(r){
			if (r){
				$.ajax({
				type: "POST",
			   	url: "../recyclebin/clearRecycleBin.do?random=" + new Date().getTime(),
		   		data: {},
			   	success: function(jso){
			   		$('#dg').datagrid('reload');	// reload the user data
					$('#dg').datagrid('clearSelections'); 	//clear selected options
			   	},
			   	error:function(){
			   		$.messager.alert('错误','清空回收站失败！','error');
			   	}
	  	 	});	
			}
		});
	}

var al = 0 ;
var p = 0;
var docNum = 1;		//文档编号 		1标识是文档
var folNum = 2;		//文件编号 		2标识是文件夹
var skipHierarchy = ""; 	//用来记录点击跳过编号
var promptstr = "";			//记录提示信息
var repeatlist;

/**
 * 方法描述：还原信息
 */
function restoreRecycleObj(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length > 0){
		var recycleObjTypes = "";
		var recycleObjIds = "";
		var eventIds = "";
		for(var i=0;i<rows.length-1;i++){
			eventIds += rows[i].eventid+",";
			recycleObjTypes += rows[i].recycleobjtype+","; 
			recycleObjIds += rows[i].recycleobjid+",";
		}
		eventIds += rows[rows.length-1].eventid;
		recycleObjTypes += rows[rows.length-1].recycleobjtype;
		recycleObjIds += rows[rows.length-1].recycleobjid;
		$.ajax({
			type: "POST",
		   	url: "../recyclebin/queryRepeatNameData.do?random=" + new Date().getTime(),
	   		data: {"eventId":eventIds,"recycleObjType":recycleObjTypes,"recycleObjId":recycleObjIds},
		   	success: function(result){
				if (result.success) {
					repeatlist = result.success;
					if( repeatlist != null && repeatlist.length > 0 ){
						folderAndDocRepeatName(repeatlist);
//						alert(JSON.stringify(repeatlist));
					}else{
						$('#dg').datagrid('reload');	// reload the user data
						$('#dg').datagrid('clearSelections'); 	//clear selected options
					}
				}else if(result.error){
					$.messager.alert('提示',result.msg,'error');
				}
				$('#left').empty();

		   	},
		   	error:function(){
		   		$.messager.alert('提示','操作发生异常！','error');
		   	}
	   	});
		
	}else{
		$.messager.alert('提示','请选择记录！','info');
	}
}
//$(':input:radio:checked')
var objectList= new Object();
function folderAndDocRepeatName(objList){
	objectList=objList;
	var url=rootPath+"/jasdoc/folder/recyclebin/chooseRestoreMode.htm";
	getDlg(url,'chooseRestoreMode',"提示信息",430,450);
}
function closeWindow(id){
	closeDlg(id);
}function getObjectList(){
	return objectList;
}
function reloadDataGrid(){
	$('#dg').datagrid('reload');	
	$('#dg').datagrid('clearSelections'); 	
}
/**
 * 方法描述：重置数据  目的： 避免 点击还原后  不刷新页面 又点击 还原 
 */
function resetValue(){
	recycleObjIds = recycleObjIds.substr(0,recycleObjIds.length-1);
	pageMotions = pageMotions.substr(0,pageMotions.length-1);
	hierarchys = hierarchys.substr(0,hierarchys.length-1);
	$.ajax({
		type: "POST",
	   	url: "../recyclebin/restoreRecycleObj.do?random=" + new Date().getTime(),
   		data: { "recycleObjIds":recycleObjIds ,"pageMotions":pageMotions ,"hierarchys":hierarchys },
	   	success: function(jso){
	   		$('#dg').datagrid('reload');	// reload the user data
			$('#dg').datagrid('clearSelections'); 	//clear selected options
	   	},
	   	error:function(){
	   		alert("error");
	   	}
   	});
	promptstr = "";
	skipHierarchy = "";
	al = 0;
	repeatlist = null;
	
	recycleObjIds = "";
	pageMotions = "";
	hierarchys = "";
}

/**
 * 方法描述：文档重名提示
 * @param promptstr
 */
function docPrompt( promptstr ){
	
}

/**
 * 方法描述：文件夹重名提示
 * 
 * @param promptstr
 */
function folPrompt(promptstr){
	
}

/**
 * 方法描述：回收站查询
 * 
 * @returns {Boolean}
 */
function queryRecyclebin(){
	var deleteObjName = $("#deleteObjName").val();
	var beginDeleteObjTime = $("#beginDeleteObjTime").val();
	var endDeleteObjTime = $("#endDeleteObjTime").val();
	if(beginDeleteObjTime!=null&&beginDeleteObjTime!=""&&endDeleteObjTime!=null&&endDeleteObjTime!=""){
		if(beginDeleteObjTime>endDeleteObjTime){
			$.messager.alert('提示','前面删除时间不能大于后面删除时间','info');
			return false;
		}
	}
	var query={"deleteObjName":deleteObjName,"beginDeleteObjTime":beginDeleteObjTime ,"endDeleteObjTime":endDeleteObjTime}; //把查询条件拼接成JSON
	$("#dg").datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
	$("#dg").datagrid('load'); //重新加载
}

function loadDatagrid(){
	initDatagrigHeight('dg','searchpanel',$('#searchpanel').height());
}