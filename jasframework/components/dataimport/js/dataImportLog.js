	var url;
		
		/**
		 * 描述：查询所有的信息
		 */
		function queryAll(){
			var query={"importtable":$("#importtable").val(),"importuser":$("#importuser").val(),"importtime":$("#importtime").val()}; //把查询条件拼接成JSON
			$("#importlogList").datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
			$("#importlogList").datagrid('load'); //重新加载
		}
		
		/**
		 * 重置数据
		 */
		function clearQuery(){
			$("#importtable").attr('value',"");
			$("#importuser").attr('value',"");
			$("#importtime").attr('value',"");
		}
		
		//查看所有该角色的用户
		function viewUsersOfRole(){
			
			var rows = $('#importlogList').datagrid('getSelections');
			if (rows.length == 1){
				var id = rows[0].id;
				var postUrl =rootPath+"jasframework/viewUsersOfRole.do?id="+id+"&rd="+Math.random();
				$.post(postUrl,function(result){
					if (result.success){
						$('#dlg_user').dialog('open').dialog('setTitle',getLanguageValue("rolr.viewuser"));
						$("#viewUserSel").html("");
						var hasUserHtml= "";
						for(var i=0;i<result.hasUser.length;i++){
							var user = result.hasUser[i];
							hasUserHtml += "<option value=\""+user.id+"\">"+user.name+"</option>";
						}
						$("#viewUserSel").append(hasUserHtml);
					} else {
						top.showAlert(getLanguageValue("error"),result.msg,'error');
					}
				},'json');
			}else{
				top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
			}
		}
		
		//初始化部门树
		$(function(){
			$("#roleUnitid").combotree({
				url: rootPath+'/jasframework/privilege/unit/getLeftTree.do'
			});
			setComboObjWidth('roleUnitid',0.30,'combotree');
		});
		/**
		 * 描述：撤销导入
		 */
		function cancleImport(){
			var rows = $('#importlogList').datagrid('getSelections');
			if (rows.length == 1){
				var id = rows[0].eventid;
				alert(id);
				var postUrl =rootPath+"jasframework/importexceldata/cancelImport.do?id="+id+"&rd="+Math.random();
				$.post(postUrl,function(result){
						top.showAlert(getLanguageValue("tip"),result,'info');
				},'text');
			}else{
				top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
			}
		}
/**
 * 页面初始化，显示所有信息
 */
$(document).ready(function(){
	$('#importlogList').datagrid({
		/*title:"导入记录列表" ,*/
		width:'100%',
		nowrap : true,
		striped : true,
		collapsible:false,
		url:rootPath+'jasframework/importexceldata/queryImportLogList.do',
		remoteSort: true,
		idField:'eventid',
		pagination:true,
		singleSelect:true,
		rownumbers:true,
		fitColumns:true,
		columns:[[{field:'ck',checkbox:true},   
				  {field:'importtable',title:'导入表',width:100},   
				  {field:'importtime',title:'导入时间',width:100}, 
				  {field:'importcount',title:'导入条数',width:100}, 
				  {field:'iscanceled',title:'是否已经执行撤销操作',width:100,formatter:function(value,rowData,rowIndex){
					  if(value=='0'){
						  value="否";
					  }else{
						  value="是";
					  }
					  return value;
				  }},
				  {field:'hasoperatelog',title:'是否集成操作日志',width:150,formatter:function(value,rowData,rowIndex){
					  if(value=='0'){
						  value="否";
					  }else{
						  value="是";
					  }
					  return value;
				  }}				  
				]],
		onDblClickRow:function(index,indexData){
//			top.getDlg("viewRole.htm?hidden=&eventid="+indexData.eventid+"&r="+new Date().getTime(),'',getLanguageValue("role.viewRole"),700,160);			
		},
		onLoadSuccess:function(data){
//	    	$('#importlogList').datagrid('clearSelections'); //clear selected options
	    },
		onHeaderContextMenu: function(e, field){
			e.preventDefault();
			if (!$('#tmenu').length){
			}
			$('#tmenu').menu('show', {
				left:e.pageX,
				top:e.pageY
			});
		}
	});
	
	$('#roleType').combobox({   
		 valueField:'id',   
		 textField:'text'  
		});  
	setComboObjWidth('roleType',0.30,'combobox');
	//自适应
	initDatagrigHeight('importlogList','queryDiv',66);
});