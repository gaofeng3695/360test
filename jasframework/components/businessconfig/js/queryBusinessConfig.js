var row ;
var enval ;
var aa;
//初始化页面，查询出所有数据
	$(document).ready(function(){
			$('#id1,#id2,#id3,#id4,#id5,#id6,#id7,#id8').linkbutton('disable');
	        $('#dg').datagrid({
			width:'100%',
			fit:true ,
			singleSelect:true,
			nowrap: false,
			striped: true,
			collapsible:false,
			url:rootPath+"jasframework/businessTable/getAllBusiness.do",
			remoteSort: true,
			idField:'eventid',
			pagination:true,
			rownumbers:true,
            onLoadSuccess:function(data){
                  $('#dg').datagrid('clearSelections'); //clear selected options
		    },
		    onClickRow:function(rowIndex, rowData) {
		        enval=rowData.eventid;
		    	$('#id1,#id2,#id3,#id4,#id5,#id6,#id7,#id8').linkbutton('enable');
		    	
		    	getAllQueryByID(enval);
		    	getAllDataByID(enval);
			},
			onSelect:function(rowIndex, rowData){
				enval=rowData.eventid;
				$('#id1,#id2,#id3,#id4,#id5,#id6,#id7,#id8').linkbutton('enable');
			//	queryid(en);
				getAllQueryByID(enval);
		    	getAllDataByID(enval);
				
			}

		 });
	   		//initDatagrigHeight('dg','queryDiv',66);
	});
//初始化页面
function getAllQueryByID(enval){
     $('#dg1').datagrid({
			width:'100%',
			fit:true ,
            nowrap: false,
			striped: true,
			collapsible:false,
			url:rootPath+'jasframework/queryConfig/getAllQueryByID.do?businessid='+enval,
			remoteSort: true,
			idField:'eventid',
			pagination:true,
			rownumbers:true,
            onLoadSuccess:function(data){
               $('#dg1').datagrid('clearSelections'); //clear selected options
		    }
	 });
}	
function newQuery(){
	row = $('#dg').datagrid('getSelected');
    if(enval!=null){
	      top.getDlg("addQueryConditionConfig.htm?eventid="+row.eventid+"&businesstablename="+row.businesstablename,"saveiframe",getLanguageValue("addqueryconfig"),750,340);
	  	 }
	else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooseonebusiness"),'info');
	}
}
//修改		
function editQuery(){
		var rows = $('#dg1').datagrid('getSelections');
		if (rows.length == 1){
			row = $('#dg1').datagrid('getSelected');
			row=row.eventid;
			top.getDlg("addQueryConditionConfig.htm?eventid1="+row,"saveiframe",getLanguageValue("editqueryconfig"),750,340);
		}else{ 
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		}
	}
//删除
function removeQuery(){
	var rows = $('#dg1').datagrid('getSelections');
	if (rows.length > 0){
		var busEventId="";
		for(var i=0;i<rows.length-1;i++){
			busEventId += rows[i].eventid+",";
		}
		busEventId += rows[rows.length-1].eventid;
		$.messager.confirm(getLanguageValue("deletequeryconfig"),getLanguageValue("deleteconfirm"),function(r){
			if (r){
					 var postUrl =rootPath+'jasframework/queryConfig/deleteQuery.do';
						$.post(postUrl,{"queryEventId":busEventId},function(result){
							if (result.success){
									top.showAlert(getLanguageValue("tip"),getLanguageValue("deletesuccess"),'ok',function(){
									//location.reload();
									$('#dg1').datagrid('reload');	// reload the user data
									$('#dg1').datagrid('clearSelections'); //clear selected options
								});
							} else {
								top.showAlert(getLanguageValue("error"),result.msg,'error');
							}
						},'json');
					}
				});
		}
	else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecords"),'info');
	}
}
function removeQuery1(){
	var rows = $('#dg1').datagrid('getRows');
	if (rows.length > 0){
		var busEventId="";
		for(var i=0;i<rows.length-1;i++){
			busEventId += rows[i].eventid+",";
		}
		busEventId += rows[rows.length-1].eventid;
	    var postUrl = rootPath+'jasframework/queryConfig/deleteQuery.do';
						$.post(postUrl,{"queryEventId":busEventId},function(result){
							if (result.success){
							    $('#dg1').datagrid('reload');	// reload the user data
								$('#dg1').datagrid('clearSelections'); //clear selected options
							} 
						},'json');
		}
}
//查看
function showQuery(){
	
	var rows = $("#dg1").datagrid("getSelections");
	if(rows.length == 1) {
		var rows=$("#dg1").datagrid("getSelected");
		var eventID=rows.eventid;
		top.getDlg("viewQueryConditionConfig.htm?id="+eventID,'view1',getLanguageValue("viewqueryconfig"),700,300);
	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}
//查询所有的数据列
function getAllDataByID(enval){
    $('#dg2').datagrid({
			width:'100%',
			fit:true ,
            nowrap: false,
			striped: true,
			collapsible:false,
			url:rootPath+'jasframework/dataColumn/getAllDataByID.do?businessid='+enval,
			remoteSort: true,
			idField:'eventid',
			pagination:true,
			rownumbers:true,
            onLoadSuccess:function(data){
		    	$('#dg2').datagrid('clearSelections'); //clear selected options
		    }
   });
}		
//新增	
function newDataColumn(){
   if(enval!=null){
		 row=$('#dg').datagrid('getSelected');
		 top.getDlg("addDataColumnConfig.htm?eventid="+row.eventid+"&businesstablename="+row.businesstablename,"saveiframe",getLanguageValue("adddatacolumnconfig"),650,250);
	}
	else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}	
//修改		
function editDataColumn(){
		var rows = $('#dg2').datagrid('getSelections');
		if (rows.length == 1){
			row = $('#dg2').datagrid('getSelected');
			row=row.eventid;
			top.getDlg("addDataColumnConfig.htm?eventid1="+row,"saveiframe",getLanguageValue("editdatacolumnconfig"),650,250);
		}else{ 
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		}
	}	
//删除		
function removeDataColumn(){
		var rows = $('#dg2').datagrid('getSelections');
		if (rows.length > 0){
			var busEventId="";
			for(var i=0;i<rows.length-1;i++){
				busEventId += rows[i].eventid+",";
			}
			busEventId += rows[rows.length-1].eventid;
			$.messager.confirm(getLanguageValue("deletedatacolumnconfig"),getLanguageValue("deleteconfirm"),function(r){
				if (r){
						 var postUrl = rootPath+'jasframework/dataColumn/deleteDataColumn.do';
							$.post(postUrl,{"dataColumnEventId":busEventId},function(result){
								if (result.success){
										top.showAlert(getLanguageValue("tip"),getLanguageValue("deletesuccess"),'ok',function(){
										$('#dg2').datagrid('reload');	// reload the user data
										$('#dg2').datagrid('clearSelections'); //clear selected options
									});
								} else {
									top.showAlert(getLanguageValue("error"),result.msg,'error');
								}
							},'json');
						}
					});
			}
		else{
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecords"),'info');
		}
	}	
function removeDataColumn1(){
	var rows = $('#dg2').datagrid('getRows');
	if (rows.length > 0){
		var busEventId="";
		for(var i=0;i<rows.length-1;i++){
			busEventId += rows[i].eventid+",";
		}
		busEventId += rows[rows.length-1].eventid;
		 var postUrl = rootPath+'jasframework/dataColumn/deleteDataColumn.do';
						$.post(postUrl,{"dataColumnEventId":busEventId},function(result){
							if (result.success){
									$('#dg2').datagrid('reload');	// reload the user data
									$('#dg2').datagrid('clearSelections'); //clear selected options								
							} 
						},'json');
	}
}
//查看
	function showDataColumn(){
		
		var rows = $("#dg2").datagrid("getSelections");
		if(rows.length == 1) {
			var rows=$("#dg2").datagrid("getSelected");
			var eventID=rows.eventid;
			top.getDlg("viewDataColumnConfig.htm?id="+eventID,'viewDataColumn',getLanguageValue("查看数据列配置"),650,250);
		} else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		}
	}
//按条件进行查询	
	function queryBusiness(){
		var roleName = $("#businessName").val();
     	var tablename=$('#businessTableName').val();
		var exp=$("#explanation").val();
		var query={"businessname":roleName,"businesstablename":tablename,"explanation":exp}; //把查询条件拼接成JSON
		$("#dg").datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
		$("#dg").datagrid('load'); //重新加载
	}
//查看详细
	function showInfo(){
		var rows = $("#dg").datagrid("getSelections");
		if(rows.length == 1) {
		var rows=$("#dg").datagrid("getSelected");
		var eventID=rows.eventid;
		top.getDlg("viewBusinessConfig.htm?id="+eventID,'view',getLanguageValue("viewbusiness"),700,250);
	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}
//新增
	function newBusiness(){
			top.getDlg("addBusinessConfig.htm?r="+new Date().getTime(),"saveiframe",getLanguageValue("addbusiness"),700,250)
}
//修改		
	function editBusiness(){
			var rows = $('#dg').datagrid('getSelections');
			if (rows.length == 1){
				row = $('#dg').datagrid('getSelected');
				row=row.eventid;
				top.getDlg("updateBusinessConfig.htm?eventid="+row+"&r="+new Date().getTime(),"saveiframe",getLanguageValue("editbusiness"),700,250);
			}else{ 
				top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
			}
		}
//删除		
    function removeBusiness(){
			var rows = $('#dg').datagrid('getSelections');
			if (rows.length > 0){
				var busEventId="";
				for(var i=0;i<rows.length-1;i++){
					busEventId += rows[i].eventid+",";
				}
				busEventId += rows[rows.length-1].eventid;
				
				$.messager.confirm(getLanguageValue("tip"),getLanguageValue("deletebusiness"),function(r){
					if (r){
						 var postUrl = rootPath+'jasframework/businessTable/deleteBusiness.do';
								$.post(postUrl,{"businessEventId":busEventId},function(result){
									if (result.success){
                                            top.showAlert(getLanguageValue("tip"),getLanguageValue("deletesuccess"),'ok',function(){
											removeQuery1();
											removeDataColumn1();
											$('#dg').datagrid('reload');	// reload the user data
											$('#dg').datagrid('clearSelections'); //clear selected options
										});
									} else {
										top.showAlert(getLanguageValue("error"),result.msg,'error');
									}
								},'json');
							}
						});
				}
			else{
				top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
			}
		}
		
		
		
		
		
		
		
		
		
		
