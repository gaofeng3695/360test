
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsSyncRecorddatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpssyncrecord/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        fitColumns: true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
            	field:"syncdate",
            	title:"同步时间",
            	width:$(this).width() * 0.2,
            	resizable:true,
            	sortable:true,
            	align:'center',
                styler:function(value,row,index){
                    if(row.issucceed == '同步失败'){
                        return 'color:red;';
                    }
                }
            },
            
            {	
            	field:"executionmethod",
            	title:"同步对象",
            	width:$(this).width() * 0.2,
            	resizable:true,
            	sortable:true,
            	align:'center',
                styler:function(value,row,index){
                    if(row.issucceed == '同步失败'){
                        return 'color:red;';
                    }
                }
            }
		]],
		columns: 
		[[

			{	
				field:"issucceed",
	    		title:"同步是否成功",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.issucceed == '同步失败'){
                        return 'color:red;';
                    }
                }
	    	},

			{	
				field:"isupload",
	    		title:"上传下载",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.issucceed == '同步失败'){
                        return 'color:red;';
                    }
                }
	    	},

			{
				field:"executionuserName",
	    		title:"操作人",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.issucceed == '同步失败'){
                        return 'color:red;';
                    }
                }
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_sync_record.html?oid="+indexData.oid,"viewGpsSyncRecord","详细",700,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsSyncRecorddatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsSyncRecorddatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	comboxid+='isupload'+',';
	singleDomainName+='sync_isupload'+","
	comboxid+='issucceed'+',';
	singleDomainName+='sync_issucceed'+","
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsSyncRecorddatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsSyncRecorddatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
});

/**
 * @desc 加载查询多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select =comboxid.split(",");
		var moreDomainNameArr = moreDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				multiple:true,
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.15,'combobox');
		}
	}
}

/**
 * @desc 加载查询单选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param singleDomainName 值域名称，以逗号隔开
 */
function loadQuerySelectData(comboxid,singleDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select =comboxid.split(",");
		var singleDomainNameArr = singleDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			var id=select[i];
			$('#' + id).combobox({
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
				//		$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.15,'combobox');
		}
	}
}
/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_sync_record.html","addGpsSyncRecord","添加",700,400,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsSyncRecorddatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_sync_record.html?oid="+dataId,"updateGpsSyncRecord","修改",700,400,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsSyncRecorddatagrid').datagrid('getSelections');
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
		$.messager.confirm('删除', '您确定要删除这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/gpssyncrecord/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsSyncRecorddatagrid').datagrid('reload');	
								$('#gpsSyncRecorddatagrid').datagrid('clearSelections'); 
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "删除失败", 'error');
							enableButtion("saveButton");
						}else{
							top.showAlert("提示", data.msg, 'info');
							enableButtion("saveButton");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '删除出错', 'info');
					}
				});
			}
		});	
	}	
}

/**
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	var rows = $('#gpsSyncRecorddatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_sync_record.html?oid="+dataId,"viewGpsSyncRecord","详细",700,400,false,true,true);
}




