/** 
 * @file
 * @author  zhangxz
 * @version 1.0 
 * @desc  项目案例js
 * @date  2017-08-10  
 * @last modified by zhangxz
 * @last modified time  2017-08-19
 */


/**
 * @desc 初始化
 */
$(function(){
  	$("#dg").datagrid({
  		url:rootPath+"project/getPage.do",
		nowrap : true,
		striped : true,
		pagination:true,
  		collapsible:true,
		rownumbers:true,
		autoRowHeight: false,
//		fitColumns:true,
		columns:[[{field:'ck',checkbox:true},   
			  {field:'projectName',title:'项目名称',align:"center",width:200},   
			  {field:'projectCode',title:'项目编码',align:"center",width:200}, 
			  {field:'operate',title:'操作',align:"center",width:150,
		    		formatter: function(value,row,index){
						var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="viewProject(\'' + row.oid+'\')">\
										<span class="fa fa-eye"></span>\
								   </a><a href="#" title = "修改" onclick="updateProject(\'' + row.oid+'\')">\
										<span class="fa fa-edit"></span>\
							   	   </a><a href="#" title = "删除" onclick="deleteProject(\'' + row.oid+'\')">\
										<span class="fa fa-minus"></span>\
							       </a></p>'
						return opt;
					}
		    	}
			]],
		onDblClickRow: function(index, row) {
			 $('#dg').datagrid('selectRow',index);  //指定行选中
			  top.getDlg("view_project.htm?oid="+row.oid,'viewiframe',"查看项目信息",700,600,false,true,true);
		},
		onLoadSuccess: function(data){
	    	$('#dg').datagrid('clearSelections'); //clear selected options
	    }
	});
  	
  	initDatagrigHeight('dg','queryDiv','64');
  	
})

/**
 * @desc 项目详情查看
 */
function viewProject(oid){
	var rows = $('#dg').datagrid('getSelections');
	var ID;
	if(!isNull(oid)){
		ID = oid;
	}else if(rows.length == 1){
		ID = rows[0].oid;
	} else {
		top.showAlert("提示","请选择一个用户",'info');
		return;
	}
	if(!isNull(ID)){
		top.getDlg("view_project.htm?oid="+ID,'viewiframe',"查看项目信息",700,500,false,true,true);
	}
}

/**
 * @desc 新增项目
 */
function addProject(){
	top.getDlg("save_project.htm",'saveiframe',"新增项目信息",700,600,false,true,true);
}

/**
 * @desc 更新项目
 */
function updateProject(oid){
	var rows = $('#dg').datagrid('getSelections');
	var ID;
	if(!isNull(oid)){
		ID = oid;
	}else if(rows.length == 1){
		ID = rows[0].oid;
	} else {
		top.showAlert("提示","请选择一个用户",'info');
		return;
	}
	if(!isNull(ID)){
		top.getDlg("update_project.htm?oid="+ID,'updateiframe',"修改项目信息",700,600,false,true,true);
	}
}

/**
 * @desc 查询项目
 */
function queryProject(){
	$("#dg").datagrid('clearSelections');
	var keywords = $("#keywords").val();
	var query={"keywords":keywords};
	var url=rootPath+"project/getPage.do";
	$("#dg").datagrid("options").url = url;
	$("#dg").datagrid('options').queryParams=query;
	$("#dg").datagrid('load');	
}

/**
 * @desc 删除项目
 */
function deleteProject(oid){
	var rows = $('#dg').datagrid('getSelections');
	var idArray=[];
	if(!isNull(oid)){
		idArray.push(oid);
	}else if (rows.length > 0){
		$(rows).each(function(i,obj){
			idArray.push(obj.oid);
		});
	}else{
		top.showAlert("提示","请选择记录",'info');
		return ;
	}
	if(!isNull(idArray)){
		$.messager.confirm("提示","您确定要删除该项目信息吗？",function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/project/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#dg').datagrid('reload');	
								$('#dg').datagrid('clearSelections'); 
							});
						}else{
							top.showAlert("提示","该管线已关联数据，请先删除关联数据","info");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '删除出错', 'info');
					}
				});
				
			}
		});
	}else{
		top.showAlert("提示","请至少选择一个用户",'info');
	}
}