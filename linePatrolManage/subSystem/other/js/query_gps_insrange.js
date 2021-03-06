
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var suboid=getParamter("suboid");	// 巡检范围标识
var querySerialize=null;	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#10021005').menubutton({menu:'#exportBars'});
	$('#gpsInsrangedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinsrange/getPage.do?inspectorType=03&subsytemeventid="+suboid,
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        /*fitColumns: true,*/
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
            	field:"unitname",
            	title:"部门名称",
            	width:$(this).width() * 0.07,
            	resizable:true,
            	sortable:true,
            	align:'center'
            },
            
            {	
            	field:"lineloopoName",
            	title:"管线名称",
            	width:$(this).width() * 0.1,
            	resizable:true,
            	sortable:true,
            	align:'center'
            },
		]],
		columns: 
		[[

			{
				field:"ginspectorName",
	    		title:"人员名称",
	    		width:$(this).width() * 0.05,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"insRangeLength",
	    		title:"管理长度（m）",
	    		width:$(this).width() * 0.07,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{
				field:"pointCount",
				title:"关键点数量",
				width:$(this).width() * 0.05,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{	
				field:"beginlocation",
	    		title:"起始位置",
	    		width:$(this).width() * 0.09,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"beginstation",
	    		title:"起始里程（m）",
	    		width:$(this).width() * 0.07,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{	
				field:"endlocation",
	    		title:"终止位置",
	    		width:$(this).width() * 0.09,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"endstation",
	    		title:"终止里程（m）",
	    		width:$(this).width() * 0.07,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},{
				field:"patrolRoleName",
				title:"巡检角色",
				width:$(this).width() * 0.06,
				resizable:true,
				sortable:true,
				align:'center'
			},
            {
                field:"createDatetime",
                title:"创建时间",
                width:$(this).width() * 0.1,
                resizable:true,
                sortable:true,
                align:'center'
            },{
				field:"modifyDatetime",
				title:"修改时间",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},{
				field:"insbdate",
				title:"任务开始时间",
				width:$(this).width() * 0.07,
				resizable:true,
				sortable:true,
				align:'center'
			},{
				field:"insedate",
				title:"任务结束时间",
				width:$(this).width() * 0.07,
				resizable:true,
				sortable:true,
				align:'center'
			}

		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_insrange.html?oid="+indexData.oid,"viewGpsInsrange","详细",900,700,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsInsrangedatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsInsrangedatagrid','queryDiv','100');
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsInsrangedatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsInsrangedatagrid','queryDiv',64);
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
						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.30,'combobox');
		}
	}
}
/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_insrange.html","addGpsInsrange","添加",900,700,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_insrange.html?oid="+dataId,"updateGpsInsrange","修改",900,700,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsinsrange/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsInsrangedatagrid').datagrid('reload');	
								$('#gpsInsrangedatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_insrange.html?oid="+dataId,"viewGpsInsrange","详细",900,700,false,true,true);
}


/**
 * @desc 导入
 */
function importData(){
    var funcName = "段长区段导入模板";	// 导入模板功能名称
    top.getDlg(rootPath+"jasframework/components/excel/importExcelData.htm?tableName=gps_insrange&callerPageUrl=query_gps_insrange.html&datagridElementId=gpsInsrangedatagrid&functionName="+encodeURI(encodeURI(funcName)),"importiframe","导入",700,410);
}


/**
 * @desc 下载导入模板
 */
function downloadExcel(){
    var funcName="段长区段导入模板";    // 导入模板功能名称
    var postUrl = addTokenForUrl(rootPath+'jasframework/excel/downloadExcelTemplate.do?functionName='+encodeURI(encodeURI(funcName)));
    $("#exprotExcelIframe").attr("src",postUrl);
}

/**
 *@desc 导出选中
 */
function exportSelect(){
	var templateCode = "export_xxxx";//导出模板编号
	// 找到所有被选中行
	var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
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
		url=addTokenForUrl(rootPath+'/gpsinsrange/exportToExcelAction.do?inspectorType=02&oidList='+idArray);
		$("#exprotExcelIframe").attr("src",url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	var templateCode = "export_xxxx";//导出模板编号
	// querySerialize =$("#queryForm").serializeToJson();
	var url =addTokenForUrl(rootPath+'/gpsinsrange/exportToExcelAction.do?inspectorType=02&'+$('#queryForm').serialize());
	$("#exprotExcelIframe").attr("src",url);
}

