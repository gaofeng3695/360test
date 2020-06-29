
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
	$('#gpsSubinsdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpssubins/getPage.do",
		collapsible:true,
		autoRowHeight: false,
        fitColumns: true,
 		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
            	field:"unitid",
            	title:"部门名称",
            	width:$(this).width() * 0.1,
            	resizable:true,
            	sortable:true,
            	align:'center',
            	formatter: function(value,row,index){
	    			return '<span title="'+row.unitname+'"  class="tip tooltip-f">' +row.unitname+'</span>';
	    		}
            },
            
            {	
            	field:"lineloopoid",
            	title:"管线名称",
            	width:$(this).width() * 0.1,
            	resizable:true,
            	sortable:true,
            	align:'center',
            	formatter: function(value,row,index){
	    			return '<span title="'+row.lineloopoName+'"  class="tip tooltip-f">' +row.lineloopoName+'</span>';
	    		}
            }
		]],
		columns: 
		[[
	    	{	
				field:"beginlocation",
	    		title:"巡检起始位置",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{
				field:"endlocation",
	    		title:"巡检终止位置",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"lineLength",
	    		title:"管理长度（公里）",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{	
				field:"rangeNum",
	    		title:"巡线工划分区段数",
	    		width:$(this).width() * 0.11,
	    		resizable:true,
	    		align:'center'/*,
	    		formatter: function(value,row,index){
	    			if(value > 0){
	    				var opt = '<p class="table-operate"><a href="#" title = "巡线工划分区段数" onclick="viewRange(\'' + row.unitid+'\',\'' + row.lineloopoid+'\')">\
	    				<span>'+value+'</span>\
	    				</a></p>';
	    				return opt;
	    			}
	    			return value;
	    		}*/
	    	},
	    	{	
				field:"grangeNum",
	    		title:"管道工划分区段数",
	    		width:$(this).width() * 0.11,
	    		resizable:true,
	    		align:'center'/*,
	    		formatter: function(value,row,index){
	    			if(value > 0){
	    				var opt = '<p class="table-operate"><a href="#" title = "管道工划分区段数"  onclick="gviewRange(\'' + row.unitid+'\',\'' + row.lineloopoid+'\')">\
	    				<span>'+value+'</span>\
	    				</a></p>';
	    				return opt;
	    			}
	    			return value;
	    		}*/
	    	},
	    	{	
				field:"syncdate",
	    		title:"同步时间",
	    		width:$(this).width() * 0.14,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		
	    	},
	    	{	
				field:"isgentask",
	    		title:"是否生成任务",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		formatter: function(value,row,index){
	    			return '<span title="'+row.isGenTaskCodeName+'"  class="tip tooltip-f">' +row.isGenTaskCodeName+'</span>';
	    		}
	    	}/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:$(this).width() * 0.1,
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a href="#" class= "a10020101" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span>\
							   </a><a class= "a10020103" href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
									<span class="fa fa-edit"></span>\
						   	   </a><a class= "a10020104" href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
									<span class="fa fa-minus"></span>\
						       </a></p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_subins.html?oid="+indexData.oid,"viewGpsSubins","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsSubinsdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsSubinsdatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	comboxid+='isGenTask'+',';
	singleDomainName+='subins_isgentask'+",";
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
			initDatagrigHeight('gpsSubinsdatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsSubinsdatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	initUnitComboTree('unitid');
	initLineLoopCombobox('lineloopoid');
	showPan('beginlocation','endlocation','beginstation','endstation');
	
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
					//	$('#'+id).combobox('setValue',data[0].codeId);
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
					//	$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.07,'combobox');
		}
	}
}
/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_subins.html","addGpsSubins","添加",800,400,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsSubinsdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_subins.html?oid="+dataId,"updateGpsSubins","修改",800,400,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsSubinsdatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpssubins/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsSubinsdatagrid').datagrid('reload');	
								$('#gpsSubinsdatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsSubinsdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_subins.html?oid="+dataId,"viewGpsSubins","详细",800,400,false,true,true);
}

/**
 * 同步巡检范围
 * @returns
 */
function syncSubIns(){
	showLoadingMessage("正在同步巡检范围数据，请稍候。。。");
	$.ajax({
		url: rootPath+"/gpssubins/syncSubIns.do",
		contentType: 'application/json;charset=utf-8',
		type: "POST",
		dataType:"json",
		success: function(data){
			hiddenLoadingMessage();
			if(data.status==1){
				top.showAlert("提示","同步成功","info",function(){
					$('#gpsSubinsdatagrid').datagrid('reload');	
					$('#gpsSubinsdatagrid').datagrid('clearSelections'); 
				});
			}else if(data.code == "400") {
				top.showAlert("提示", "同步失败", 'error');
			}else{
				top.showAlert("提示", data.msg, 'info');
			}
		},
		error : function(data) {
			hiddenLoadingMessage();
			top.showAlert('错误', '同步出错', 'info');
		}
	});
}

/**
 * 查看巡线工区段
 * @param dataId
 * @returns
 */
function viewRange(vunitid,vlineloopoid){
	top.getDlg("../insrangeManage/view_query_gps_insrange.html?vunitid="+vunitid+"&vlineloopoid="+vlineloopoid,"insrange","巡检区段管理",800,600,false,true,true);
}

/**
 * 查看管道工区段
 * @param dataId
 * @returns
 */
function gviewRange(vunitid,vlineloopoid){
	top.getDlg("../ginsrangeManage/view_query_gps_insrange.html?vunitid="+vunitid+"&vlineloopoid="+vlineloopoid,"ginsrange","巡检区段管理",800,600,false,true,true);
}

