
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
	$('#130405').menubutton({menu:'#exportBars'});
	$('#gpsSecurityStandarddatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpssecuritystandard/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		fitColumns: true,
		columns: 
		[[
			
			{field:'ck',checkbox:true},
			{	
				field:"unitname",
	    		title:"部门名称",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"title",
	    		title:"标题",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{	
				field:"type",
	    		title:"类型",
	    		width:$(this).width() * 0.08,
	    		resizable:true,
    			sortable:true,
	    		align:'center',
	    		formatter:function(value,row,index){
                    if(value==0){
                        return '国家标准';
                    }else if(value==1){
                    	return '行业标准';
                    }else if(value==2){
                    	return '企业标准';
                    }else if(value==3){
                    	return '规范性文件';
                    }else if(value==4){
                    	return '其他文件';
                    }
                    
                }
	    	},

			{	
				field:"uploadTime",
	    		title:"上传时间",
	    		width:$(this).width() * 0.14,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{	
				field:"uploadingStaff",
	    		title:"上传人员",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}/*,

			{	
				field:"fileSize",
	    		title:"上传文件大小(KB)",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}*/,

			{
				field:"content",
	    		title:"内容概述",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_security_standard.html?oid="+indexData.oid,"viewGpsSecurityStandard","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsSecurityStandarddatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsSecurityStandarddatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='standard_type'+',';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='type'+',';
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsSecurityStandarddatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsSecurityStandarddatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	initUnitComboTree('unitid');
});

/**
 * 导出选中
 * @returns
 */
function exportSelect(){
	// 找到所有被选中行
	var rows = $('#gpsSecurityStandarddatagrid').datagrid('getSelections');
	var idArray = [];
	var url="";
	if(rows.length<1){
		$.messager.alert('提示','未选中数据','info');
		return;
	}
	// 遍历取得所有被选中记录的id
	$(rows).each(function(i,obj){
		idArray.push(obj.oid);
	});
	if(!isNull(idArray)){
		url=addTokenForUrl(rootPath+'/gpssecuritystandard/exportToExcelAction.do?oidList='+idArray);
		$("#exprotExcelIframe").attr("src", url);
	}
}

/**
 * 导出查询
 * @returns
 */
function exportQuery(){
	url=addTokenForUrl(rootPath+'/gpssecuritystandard/exportToExcelAction.do?'+$('#queryForm').serialize());
	$("#exprotExcelIframe").attr("src", url);
}
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
			setComboObjWidth(id,0.29,'combobox');
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
//						$('#'+id).combobox('setValue',data[0].codeId);
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
	top.getDlg("save_gps_security_standard.html","addGpsSecurityStandard","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsSecurityStandarddatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_security_standard.html?oid="+dataId,"updateGpsSecurityStandard","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsSecurityStandarddatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpssecuritystandard/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsSecurityStandarddatagrid').datagrid('reload');	
								$('#gpsSecurityStandarddatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsSecurityStandarddatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_security_standard.html?oid="+dataId,"viewGpsSecurityStandard","详细",800,600,false,true,true);
}




