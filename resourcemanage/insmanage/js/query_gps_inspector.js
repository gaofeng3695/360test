
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
	$('#11010106').menubutton({menu:'#exportBars'});
	$('#gpsInspectordatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinspector/getPage.do?inspectortype=01",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        fitColumns: true,
        sortName: 'workStatus',
		sortOrder : 'asc',
		//remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitname",
	    		title:"部门名称",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"insname",
	    		title:"姓名",
	    		width:$(this).width() * 0.15,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
				formatter: function(value,row,index){
					if(row.workStatus == '02') {
						return '<span title="（离职）' +value+'"  class="tip tooltip-f">（离职）' + value +'</span>';
					} else {
						return '<span title="（在职）' +value+'"  class="tip tooltip-f">（在职）' + value +'</span>';
					}
				}
	    	},

			{	
				field:"phone",
	    		title:"联系电话",
	    		width:$(this).width() * 0.125,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

		]],
		columns: 
		[[
			{	
				field:"sim",
				title:"SIM卡号",
				width:$(this).width() * 0.125,
				resizable:true,
				sortable:true,
				align:'center'
			},
            {
                field:"description",
                title:"描述",
                width:$(this).width() * 0.15,
                resizable:true,
                sortable:true,
                align:'center'
            },
            {
                field:"createDatetime",
                title:"创建时间",
                width:$(this).width() * 0.15,
                resizable:true,
                sortable:true,
                align:'center'
            },
            {
                field:"createUserName",
                title:"创建人",
                width:$(this).width() * 0.15,
                resizable:true,
                sortable:true,
                align:'center'
            },
            {
                field:"modifyDatetime",
                title:"修改时间",
                width:$(this).width() * 0.15,
                resizable:true,
                sortable:true,
                align:'center'
            },
            {
                field:"modifyUserName",
                title:"修改人",
                width:$(this).width() * 0.15,
                resizable:true,
                sortable:true,
                align:'center'
            }

		]],
		onDblClickRow:function(index,indexData){
            top.getDlg("viewAll_gps_inspector.html?oid="+indexData.oid,"viewAll","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsInspectordatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsInspectordatagrid','queryDiv','100');
	//高级搜索
	/*$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsInspectordatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsInspectordatagrid','queryDiv',64);
		}
	});*/
	
	// 高级搜索的查询条件选择
	/*$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});*/
	initUnitComboTree('unitid');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='instype'+',';
	singleDomainName+='worktype'+","
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
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
			setComboObjWidth(id,0.281,'combobox');
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
				panelHeight:100,
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
			setComboObjWidth(id,0.29,'combobox');
		}
	}
}
/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_inspector.html","addGpsInspector","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_inspector.html?oid="+dataId+"&unitid="+rows[0].unitid,"updateGpsInspector","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsinspector/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.data == "" || data.data == undefined){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsInspectordatagrid').datagrid('reload');	
								$('#gpsInspectordatagrid').datagrid('clearSelections'); 
							});
						}else if(data.data != "" || data.data == undefined) {
							top.showAlert("提示", data.data.warning, 'error');
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
/*function view(oid){
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_inspector.html?oid="+dataId,"viewGpsInspector","详细",700,500,false,true,true);
}*/

/**
 * @desc 查看所有信息，包括计划，任务，区段等等。
 * @param oid 数据ID
 */
function view(oid){
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("viewAll_gps_inspector.html?oid="+dataId,"viewAll","详细",800,600,false,true,true);
}


/**
 * @desc 导入
 */
function importData(){
	 var funcName = "巡线工管理";	// 导入模板功能名称
	 top.getDlg(rootPath+"jasframework/components/excel/importExcelData.htm?tableName=gps_inspector&callerPageUrl=query_gps_inspector.html&datagridElementId=gpsInspectordatagrid&functionName="+encodeURI(encodeURI(funcName)),"importiframe","导入",700,410);
}

/**
 * @desc 下载导入模板
 */
function downloadExcel(){	
    var funcName="巡线工管理";    // 导入模板功能名称
    var postUrl = addTokenForUrl(rootPath+'jasframework/excel/downloadExcelTemplate.do?functionName='+encodeURI(encodeURI(funcName)));
    $("#exprotExcelIframe").attr("src",postUrl);
}

/**
 *@desc 导出选中
 */
function exportSelect(){
	// 找到所有被选中行
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
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
		url=addTokenForUrl(rootPath+'/gpsinspector/exportInspToExcelAction.do?oidList='+idArray);
		$("#exprotExcelIframe").attr("src", url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	url=addTokenForUrl(rootPath+'/gpsinspector/exportInspToExcelAction.do?inspectortype=01&'+$('#queryForm').serialize());;
	$("#exprotExcelIframe").attr("src", url);
}

/**
 * 解除人员与设备绑定
 */
function freeDevice(oid){
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
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
		$.messager.confirm('解除', '您确定要解除人员绑定信息吗？\n\t',function(r){
			if (r){
				$.ajax({
					url: rootPath+"/gpsinspector/freeDevice.do",
					contentType: 'application/json;charset=utf-8',
					data: JSON.stringify({"idList" : idArray}),
					type: "POST",
					dataType:"json",
					async:false,
					success: function(data){
						top.showAlert("提示","解除成功","info",function(){
							$('#gpsInspectordatagrid').datagrid('reload');
							$('#gpsInspectordatagrid').datagrid('clearSelections');
						});

					},
					error : function(data) {
						top.showAlert('错误', '解除出错', 'info');
					}
				});
			}
		});
	}
}

/**
 * 人员离职
 */
function personLeave(oid){
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
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
		$.messager.confirm('离职', '确定离职吗？\n\t',function(r){
			if (r){
				$.ajax({
					url: rootPath+"/gpsinspector/personLeave.do",
					contentType: 'application/json;charset=utf-8',
					data: JSON.stringify({"idList" : idArray}),
					type: "POST",
					dataType:"json",
					async:false,
					success: function(data){
						top.showAlert("提示","离职成功","info",function(){
							$('#gpsInspectordatagrid').datagrid('reload');
							$('#gpsInspectordatagrid').datagrid('clearSelections');
						});

					},
					error : function(data) {
						top.showAlert('错误', '离职出错', 'info');
					}
				});
			}
		});
	}
}

/**
 * 例外巡检是生成分数后重新计算分数，请假是生成分数前计算分数
 */
function otherPatrol(oid) {
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
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
	top.getDlg("save_gps_inspector_exception.html?idArray="+idArray,"saveGpsInspectorException","例外巡检",800,450,false,true,true);
}
