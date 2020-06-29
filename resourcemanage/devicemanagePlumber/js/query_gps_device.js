
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
var user = JSON.parse(sessionStorage.user);
/* 获取页面显示的内容，declare 表示申报和驳回的数据还有未申报；review 审核表示只显示需要审核的数据；logout表示注销 */
var flag = getUrlParam('flag');
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#export').menubutton({menu:'#exportBars'}); 
	$('#gpsDevicedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsdevice/getPage.do?flag="+flag+"&inspectorType=02",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitName",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},
	    	{	
				field:"statusName",
	    		title:"设备状态",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center',
				styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},
	    	{	
	    		field:"approvalStatusName",
	    		title:"设备审批状态",
	    		width:"100",
	    		resizable:true,
	    		sortable:false,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},
	    	{	
				field:"conditionName",
	    		title:"设备的分配情况",
	    		width:"100",
	    		resizable:true,
    			sortable:false,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	}/*,
	    	{	
				field:"devname",
	    		title:"设备名称",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	}*/
		]],
		columns: 
		[[
			{	
				field:"devcode",
	    		title:"设备编号",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			{	
				field:"devtypeName",
	    		title:"设备类型",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			{	
				field:"sim",
	    		title:"SIM卡号",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			/*{	
				field:"releasedate",
	    		title:"投产日期",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			{	
				field:"ewarrantydate",
	    		title:"保修终止日期",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},

			{	
				field:"manufacturer",
	    		title:"生产厂家",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.status == '02'){
						return 'color:red;';
		  			}
				}
	    	},*/
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"150",
		  		formatter: function(value,row,index){
		  			/* 如果不是本部门就只能查看 */
		  			if(row.unitid == user.unitId){
		  				var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
										<span class="fa fa-eye"></span>\
								   </a><a href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
										<span class="fa fa-edit"></span>\
							   	   </a><a href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
										<span class="fa fa-minus"></span>\
							       </a></p>';
						return opt;
		  			}else{
		  				var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
										<span class="fa fa-eye"></span>\
								   </a></p>';
						return opt;
		  			}
				}
			}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_device.html?oid="+indexData.oid,"viewGpsDevice","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsDevicedatagrid').datagrid('clearSelections'); //clear selected options
	    },
	    onSelect:function(index,indexData){
			check();
		},
		onUnselect:function(index,indexData){
			check();
		},
		onSelectAll:function(){
			check();
		},
		onUnselectAll:function(){
			check();
		}
	});
	//页面自适应
	initDatagrigHeight('gpsDevicedatagrid','queryDiv','100');
	var comboxid='status,condition,devtype,';
	var singleDomainName='devicestatus,devicecondition,devicetype,';	// 单选值域
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
			initDatagrigHeight('gpsDevicedatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsDevicedatagrid','queryDiv',64);
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
						/*$('#'+id).combobox('setValue',data[0].codeId);*/
					}
				}
			});
			setComboObjWidth(id,0.145,'combobox');
		}
	}
}
/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_device.html","addGpsDevice","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsDevicedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_device.html?oid="+dataId,"updateGpsDevice","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsDevicedatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsdevice/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsDevicedatagrid').datagrid('reload');	
								$('#gpsDevicedatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsDevicedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_device.html?oid="+dataId,"viewGpsDevice","详细",800,600,false,true,true);
}


/**
 * @desc excel导入
 */
function importData(){
	var templateCode = "import_xxxx";// 导入模板编号
	commonImport(templateCode, "query_gps_device.html", "gpsDevicedatagrid");
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
	var rows = $('#gpsDevicedatagrid').datagrid('getSelections');
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

/**
 * 禁用修改按钮
 * @returns
 */
function check(){
	var rows = $('#gpsDevicedatagrid').datagrid('getSelections');
	var bool = true;
	if (rows.length == 0){
		$("#10220202").linkbutton('enable');
		$("#10220203").linkbutton('enable');
		$("#10220206").linkbutton('enable');
	}else{
		/*for (var i=0;i<rows.length;i++){
			if(rows[i].unitid != user.unitId){
				bool = false;
			}
		}*/
	}
	if(bool){
		$("#10220202").linkbutton('enable');
		$("#10220203").linkbutton('enable');
		$("#10220206").linkbutton('enable');
	}else{
		$("#10220202").linkbutton('disable');
		$("#10220203").linkbutton('disable');
		$("#10220206").linkbutton('disable');
	}
}

/**
 * 故障申报
 * @returns
 */
function declare(oid){
	var rows = $('#gpsDevicedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	/* 如果该设备不是正常，就不能申报了。*/
	if(rows[0].status == '01'){
		top.getDlg("../devicebugmanage/save_gps_device_bug.html?oid="+dataId,"saveGpsDeviceBug","故障申报",800,600,false,true,true);
	}else if(rows[0].approvalStatus=='03'){
		top.getDlg("../devicebugmanage/update_gps_device_bug_reject.html?oid="+dataId,"saveGpsDeviceBugReject","故障申报",800,600,false,true,true);
	}else{
		top.showAlert("提示","该设备已故障，请处理完成后申报！",'info');
		return;
	}
	
	
}

/**
 * 故障审核
 * @returns
 */
function review(oid){
	var rows = $('#gpsDevicedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	/* 如果该设备已经审批，就不能再次审批了。*/
	if(rows[0].approvalStatus == '01'){
		top.getDlg("../devicebugmanage/update_gps_device_bug.html?oid="+dataId,"updateGpsDeviceBug","故障审核",800,600,false,true,true);
	}else if(rows[0].approvalStatus == '02'){
		top.showAlert("提示","该设备已审批，不能再次审批！",'info');
		return;
	}else if(rows[0].approvalStatus == '04'){
		top.showAlert("提示","请重新申报！",'info');
		return;
	}else if(rows[0].approvalStatus == '03'){
		top.showAlert("提示","该设备已驳回，请重新申报！",'info');
		return;
	}else{
		top.showAlert("提示","该设备还未申报！",'info');
		return;
	}
	
}

/**
 * 故障注销
 * @returns
 */
function logout(oid){
	var rows = $('#gpsDevicedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	if(rows[0].approvalStatus == '02'|| rows[0].approvalStatus == '03'){
		top.getDlg("../devicebugmanage/update_gps_device_bug_logout.html?oid="+dataId,"updateGpsDeviceBugForLogout","故障注销",800,600,false,true,true);
		return;
	}else if(rows[0].approvalStatus == '01'){
		top.showAlert("提示","该设备还未审批，无法注销！",'info');
		return;
	}else if(rows[0].approvalStatus == '04'){
		top.showAlert("提示","该设备已注销！",'info');
		return;
	}else{
		top.showAlert("提示","该设备未上报！",'info');
		return;
	}
}

/**
 * 故障注销(旧)
 * @returns
 */
function logoutOld(oid){
	var rows = $('#gpsDevicedatagrid').datagrid('getSelections');
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
		$.messager.confirm('注销', '确认注销故障设备？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/gpsdevicebug/logout.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","故障设备注销成功","info",function(){
								$('#gpsDevicedatagrid').datagrid('reload');	
								$('#gpsDevicedatagrid').datagrid('clearSelections'); 
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "注销失败", 'error');
							enableButtion("saveButton");
						}else{
							top.showAlert("提示", data.msg, 'info');
							enableButtion("saveButton");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '注销出错', 'info');
					}
				});
			}
		});	
	}	
}

/**
 * 获取url中的参数
 * @param name
 * @returns
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}