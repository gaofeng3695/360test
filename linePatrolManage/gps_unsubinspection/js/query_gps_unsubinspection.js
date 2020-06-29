
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
	var user = JSON.parse(sessionStorage.user);
//	$('#10210605').menubutton({menu:'#exportBars'}); 
	$('#gpsUnsubinspectiondatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsunsubinspection/getPage.do",
		collapsible:true,
		autoRowHeight: false,
//        fitColumns: true,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitidname",
	    		title:"部门名称",
	    		width:"200",
	    		resizable:true,
    			sortable:true,
	    		align:'center',
/*	    		formatter: function(value,row,index){
	    			return row.unitidname
	    		}*/
	    	},

			{	
				field:"lineloopoidname",
	    		title:"管线名称",
	    		width:"200",
	    		resizable:true,
    			sortable:true,
	    		align:'center',
/*            	formatter: function(value,row,index){
	    			return row.lineloopoidname
	    		}*/
	    	}
		]],
		columns: 
		[[
			{	
				field:"beginlocation",
	    		title:"不巡检起始位置",
	    		width:"200",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{	
				field:"endlocation",
	    		title:"不巡检终止位置",
	    		width:"200",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
            {
                field:"len",
                title:"不巡检长度",
                width:"100",
                resizable:true,
                sortable:true,
                align:'center',
                formatter: function(value,row,index){
                    return '<span title="'+Math.round(((row.endstation - row.beginstation)/1000)*100)/100+'"  class="tip tooltip-f">' +Math.round(((row.endstation - row.beginstation)/1000)*100)/100+'</span>';
                }
            },
            
	    	{	
				field:"begindate",
	    		title:"有效开始日期",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		/*formatter: function(value,row,index){
	    			return '<span title="'+row.syncdate+'"  class="tip tooltip-f">' +row.syncdate+'</span>';
	    		}*/
	    	},
	    	{	
				field:"enddate",
	    		title:"有效结束日期",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		/*formatter: function(value,row,index){
	    			return '<span title="'+row.syncdate+'"  class="tip tooltip-f">' +row.syncdate+'</span>';
	    		}*/
	    	},
	    	/*{	
				field:"beginstation",
	    		title:"起始里程(m)",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"endstation",
	    		title:"终止里程(m)",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},
			{	
				field:"begindate",
	    		title:"有效期起始时间",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"enddate",
	    		title:"有效期结束时间",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"repealdate",
	    		title:"废除日期",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/

			{
				field:"description",
	    		title:"不巡检原因",
	    		width:"400",
	    		resizable:true,
	    		align:'center',
	    		sortable:true,
	    	},
	    	{	
				field:"isPis",
	    		title:"是否PIS同步",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		sortable:true,
	    		formatter:function(value,row,index){
	    			if(value == 1){
	    				return '<span title="是"  class="tip tooltip-f">' +"是"+'</span>';
	    			}else{
	    				return '<span title="否"  class="tip tooltip-f">' +"否"+'</span>';;
	    			}
	    		} 
	    	},
	    	{	
				field:"syncdate",
	    		title:"同步时间",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		/*formatter: function(value,row,index){
	    			return '<span title="'+row.syncdate+'"  class="tip tooltip-f">' +row.syncdate+'</span>';
	    		}*/
	    	}/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:$(this).width() * 0.125,
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a class = "a10020201" href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span></a>';
					if(row.isPis != 1){
						opt += '<a href="#" class = "a10020203" title = "修改" onclick="update(\'' + row.oid+'\')">\
									<span class="fa fa-edit"></span></a>\
						   	   <a href="#" class = "a10020204" title = "删除" onclick="dele(\'' + row.oid+'\')">\
									<span class="fa fa-minus"></span></a>';
					}
					opt += '</p>';
							   
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_unsubinspection.html?oid="+indexData.oid,"viewGpsUnsubinspection","详细",800,400,false,true,true);
		},
		onClickRow:function(index,indexData){
			var rows = $('#gpsUnsubinspectiondatagrid').datagrid('getSelections');
			for(var i=0;i<rows.length;i++){
				if(rows[i].isPis == '1'){
					$('#10210802').linkbutton('disable');
					$('#10210803').linkbutton('disable');
					return;
				}
			}
			$('#10210802').linkbutton('enable');
			$('#10210803').linkbutton('enable');
		},
		onLoadSuccess:function(data){
	    	$('#gpsUnsubinspectiondatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsUnsubinspectiondatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	comboxid+='ispis'+',';
	singleDomainName+='ispis'+",";
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
			initDatagrigHeight('gpsUnsubinspectiondatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsUnsubinspectiondatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	/* 以下初始化查询面板 */
	initUnitComboTree('unitid');
	initLineLoopCombobox('lineloopoid');
	showPan('beginlocation','endlocation','beginstation','endStation');
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
			setComboObjWidth(id,0.22,'combobox');
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
						//$('#'+id).combobox('setValue',data[0].codeId);
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
	top.getDlg("save_gps_unsubinspection.html","addGpsUnsubinspection","添加",800,400,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsUnsubinspectiondatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_unsubinspection.html?oid="+dataId,"updateGpsUnsubinspection","修改",800,400,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsUnsubinspectiondatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsunsubinspection/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsUnsubinspectiondatagrid').datagrid('reload');	
								$('#gpsUnsubinspectiondatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsUnsubinspectiondatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_unsubinspection.html?oid="+dataId,"viewGpsUnsubinspection","详细",800,400,false,true,true);
}

/**
 * 同步
 * @returns
 */
function sync(){
	showLoadingMessage("正在同步不巡检范围，请稍候。。。");
	$.ajax({
	   url: rootPath+"/gpsunsubinspection/sync.do",
	   contentType: 'application/json;charset=utf-8',
//	   data: JSON.stringify({"idList" : idArray}),
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
				hiddenLoadingMessage();
				top.showAlert("提示","同步成功","info",function(){
					$('#gpsUnsubinspectiondatagrid').datagrid('reload');	
					$('#gpsUnsubinspectiondatagrid').datagrid('clearSelections'); 
				});
			}else if(data.code == "400") {
				hiddenLoadingMessage();
				top.showAlert("提示", "同步失败", 'error');
			}else{
				hiddenLoadingMessage();
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
		   hiddenLoadingMessage();
		   top.showAlert('错误', '同步出错', 'info');
	   }
	});
}


