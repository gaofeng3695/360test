/** 
 * @file
 * @author  xxx
 * @version 1.0 
 * @desc  查询页面js
 * @date  2012-08-30 上午17:46:07 
 * @last modified by lizz
 * @last modified time  2017-08-17
 */


var url;

/**
 * @desc 新增按钮事件
 */
function newRole(){
	top.getDlg(rootPath+"jasframework/privilege/role/addRole.htm?r="+new Date().getTime(),"saveiframe",getLanguageValue("add"),700,300,false,true,true);
}

/**
 * @desc 修改按钮事件
 */
function editRole(oid){
	var rows = $("#dg").datagrid("getSelections");
	var eventID;
	if(!isNull(oid)){
		eventID = oid;
	}else if(rows.length == 1){
		eventID = rows[0].oid;
	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		return;
	}
	if(!isNull(eventID)){
		top.getDlg(rootPath+"jasframework/privilege/role/addRole.htm?oid="+eventID+"&r="+new Date().getTime(),"saveiframe",getLanguageValue("edit"),700,300,false,true,true);
	}
}


/**
 * @desc 删除按钮事件
 */
function removeRole(oids){
	var rows = $("#dg").datagrid("getSelections");
	if(isNull(oids)){
		if(rows.length > 0){
			oids ="";
			for(var i = 0;i<rows.length;i++){
				oids += rows[i].oid+",";
			}
			oids.substring(0,oids.length-1);
		}else{
			top.showAlert( getLanguageValue("tip"),getLanguageValue("chooserecord"),"info");
			return;
		}
	}
	$.messager.confirm(getLanguageValue("delete"),getLanguageValue("deleteconfirm"),function(r){
		if(r){
			$.ajax({
				url : rootPath+"jasframework/privilege/role/deleteRole.do",
				data :{"oids" : oids},
				type : 'POST',
				dataType:"json",
				success : function(data) {
					if(data.status == 1){
						top.showAlert(getLanguageValue("tip"),getLanguageValue("deletesuccess"),'ok',function(){
							$('#dg').datagrid('reload');	// reload the user data
							$('#dg').datagrid('clearSelections'); //clear selected options
						});
					}else if(data.status == 2){
						top.showAlert(getLanguageValue("tip"),getLanguageValue("role.inUse"), 'info');
					}else{
						top.showAlert(getLanguageValue("tip"), getLanguageValue("deleteFailed"), 'info');
					}
				}
			});
		}
	})
	
}

/**
 * @desc 查询角色
 */
function queryRole(){
	var roleName = $("#roleName").val();
	var query={"roleName":"%"+roleName+"%","unitId":$("#roleUnitid").combotree("getValue"),"roleType":$("#roleType").combobox("getValue")}; //把查询条件拼接成JSON
	$("#dg").datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
	$("#dg").datagrid('load'); //重新加载
}


/**
 * @desc 查看所有该角色的用户
 */
function viewUsersOfRole(){
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length == 1){
		var id = rows[0].id;
		var postUrl = rootPath+"jasframework/privilege/role/viewUsersOfRole.do?id="+id+"&rd="+Math.random();
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



/**
 * @desc 查看角色
 */
function showInfo(evtID){
	var rows = $("#dg").datagrid("getSelections");
	var eventID;
	if(!isNull(evtID)){
		eventID = evtID;
	}else if(rows.length == 1){
		eventID = rows[0].oid;
	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		return;
	}
	if(!isNull(eventID)){
		top.getDlg(rootPath+"jasframework/privilege/role/viewRole.htm?oid="+ eventID +"&r="+new Date().getTime(),'view',getLanguageValue("role.viewRole"),700,250,false,true,true);
	}
}

/**
 * @desc 生成随机数
 */
function GetRandomNum(Min,Max){   
	var Range = Max - Min;   
	var Rand = Math.random();   
	return(Min + Math.round(Rand * Range));   
}   

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#dg').datagrid({
		width:'100%',
		nowrap: false,
		striped: true,
		collapsible:false,
		url:rootPath+"jasframework/privilege/role/getPage.do",
		remoteSort: true,
		idField:'oid',
		fitColumns: true,
		nowrap:true,
		columns:[[{field:'ck',title:getLanguageValue('ck'),checkbox:true},   
			  /*{field:'roleName',title:getLanguageValue('role.roleName'),align:"center",width:$(this).width() * 0.25,resizable:true,sortable:true},   
			  {field:'unitName',title:getLanguageValue('role.unitName'),align:"center",width:$(this).width() * 0.25,resizable:true,sortable:true}, 
			  {field:'roleType',title:getLanguageValue('role.roleType'),align:"center",width:$(this).width() * 0.25,resizable:true,sortable:true,*/
			  {field:'roleName',title:getLanguageValue('角色'),align:"center",width:300},   
			  {field:'unitName',title:getLanguageValue('所属部门'),align:"center",width:300}, 
			  {field:'roleType',title:getLanguageValue('角色类型'),align:"center",width:250,
					formatter: function(value,row,index){
						if (value == "2"){
							return "protect";
						}if (value == "1"){
							return "private";
						} else {
							return "-";
						}
					}},
			  {field:'description',title:getLanguageValue('role.description'),align:"center",width:$(this).width() * 0.25,resizable:true,sortable:true}
//					,
//			  {field:'operate',title:getLanguageValue('role.operation'),align:"center",width:150,formatter: function(value,row,index){
//					var opt = '<p class="table-operate"><a href="#" title ='+getLanguageValue('role.viewBtn')+' onclick="showInfo(\'' + row.oid+'\')">\
//									<span class="fa fa-eye"></span>\
//							   </a><a href="#" title ='+getLanguageValue('role.updateBtn')+' onclick="editRole(\'' + row.oid+'\')">\
//									<span class="fa fa-edit"></span>\
//						   	   </a><a href="#" title ='+getLanguageValue('role.deleteBtn')+' onclick="removeRole(\'' + row.oid+'\')">\
//									<span class="fa fa-minus"></span>\
//						       </a></p>'
//					return opt;
//				}}
			]],
		onDblClickRow:function(index,indexData){
			top.getDlg("viewRole.htm?hidden=&oid="+indexData.oid+"&r="+new Date().getTime(),'view',getLanguageValue("view"),700,240,false,true,true);			
		},
		onCheck:function(rowIndex,rowData){
		},
		onSelect:function(rowIndex,rowData){
		}
	});
	
	
	$('#roleType').combobox({   
		 valueField:'id',   
		 textField:'text'  
	});  
	$("#roleUnitid").combotree({
		url: rootPath+'/jasframework/privilege/unit/getLeftTree.do'
	});
	
	//设置组合框的宽度
	setComboObjWidth('roleType',0.30,'combobox');
	setComboObjWidth('roleUnitid',0.30,'combotree');
	
	//自适应数据网格高度
	initDatagrigHeight('dg','queryDiv',64);
	
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('dg','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('dg','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	})
});