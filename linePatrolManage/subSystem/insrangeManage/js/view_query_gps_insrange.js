
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var vlineloopoid=getParamter("vlineloopoid");	// 管线标识
var vunitid=getParamter("vunitid");	// 部门标识
var querySerialize=null;	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#export').menubutton({menu:'#exportBars'}); 
	$('#gpsInsrangedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinsrange/getViewPage.do?inspectorType=01&unitid="+vunitid+"&lineloopoid="+vlineloopoid,
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		columns: 
		[[
			{	
				field:"unitname",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"lineloopoName",
	    		title:"管线名称",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"beginlocation",
	    		title:"起始位置",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"endlocation",
	    		title:"终止位置",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{
				field:"inspectorName",
	    		title:"巡检人员",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_insrange.html?oid="+indexData.oid,"viewGpsInsrange","详细",900,510,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsInsrangedatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
//	initDatagrigHeight('gpsInsrangedatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	//页面自适应
	onresize();
	$(window).bind("resize", function () {
		onresize();
     });
	
});

function onresize(){
	var containerWidth = $(window).width();
	var containerHeight = $(window).height();
	$('#gpsInsrangedatagrid').datagrid('resize', {
		width : containerWidth,
		height : containerHeight
	});
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
	top.getDlg("save_gps_insrange.html?suboid="+suboid,"addGpsInsrange","添加",900,500,false,true,true);
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
	top.getDlg("update_gps_insrange.html?oid="+dataId+"&suboid="+suboid,"updateGpsInsrange","修改",900,500,false,true,true);
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
	top.getDlg("view_gps_insrange.html?oid="+dataId,"viewGpsInsrange","详细",900,510,false,true,true);
}


/**
 * @desc excel导入
 */
function importData(){
	var templateCode = "import_xxxx";// 导入模板编号
	commonImport(templateCode, "query_gps_insrange.html", "gpsInsrangedatagrid");
}

/**
 * @desc 下载导入模板
 */
function downloadExcel(){
	var templateCode = "import_xxxx";// 导入模板编号
	var url = addTokenForUrl(rootPath+'jasframework/excelTemplate/download.do?excelTemplateCode='+templateCode);
	$("#exprotExcelIframe").attr("src",url);
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
		var param={"oidList":idArray}
		var fileId = commonExport(templateCode,null,param);
		var url =addTokenForUrl(rootPath+'importExcelController/downloadExcel.do?fileId='+fileId);
		$("#exprotExcelIframe").attr("src",url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	var templateCode = "export_xxxx";//导出模板编号
	querySerialize =$("#queryForm").serializeToJson();
	var fileId = commonExport(templateCode,null,querySerialize);
	var url =addTokenForUrl(rootPath+'importExcelController/downloadExcel.do?fileId='+fileId);
	$("#exprotExcelIframe").attr("src",url);
}

