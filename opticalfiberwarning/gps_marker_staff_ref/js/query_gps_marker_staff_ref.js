
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
//当前登陆用户
var user = JSON.parse(sessionStorage.user);
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsMarkerStaffRefdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsmarkerstaffref/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
			{
				field:"unitname",
				title:"部门名称",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{
				field:"lineloopName",
				title:"管线名称",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{
				field:"fiberSystemId",
				title:"光纤系统名称",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{
				field:"opticalFiberLineloop",
				title:"光纤系统管线",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{
				field:"opticalFiberStation",
				title:"光纤系统所属站",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},

		]],
		columns: 
		[[
			{
				field:"startMarkeroid",
	    		title:"起始桩",
				width:$(this).width() * 0.1,
	    		resizable:true,
				sortable:true,
	    		align:'center'
	    	},

			{	
				field:"endMarkeroid",
	    		title:"终止桩",
				width:$(this).width() * 0.1,
	    		resizable:true,
				sortable:true,
	    		align:'center'
	    	},
			{
				field:"startMileage",
	    		title:"起始里程(m)",
				width:$(this).width() * 0.1,
	    		resizable:true,
				sortable:true,
	    		align:'center'
	    	},

			{	
				field:"endMileage",
	    		title:"终止里程(m)",
				width:$(this).width() * 0.1,
	    		resizable:true,
				sortable:true,
	    		align:'center'
	    	},

			{	
				field:"stationMasterName",
	    		title:"站长/区长",
				width:$(this).width() * 0.1,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{	
				field:"stationMasterTel",
	    		title:"站长/区长电话",
				width:$(this).width() * 0.1,
	    		resizable:true,
				sortable:true,
	    		align:'center'
	    	},

			{	
				field:"sectionLeaderName",
	    		title:"区间技术负责人",
				width:$(this).width() * 0.1,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{	
				field:"sectionLeaderTel",
	    		title:"区间技术负责人电话",
				width:$(this).width() * 0.1,
	    		resizable:true,
				sortable:true,
	    		align:'center'
	    	},

			{	
				field:"segmentName",
	    		title:"段长",
				width:$(this).width() * 0.1,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{	
				field:"segmentTel",
	    		title:"段长电话",
				width:$(this).width() * 0.1,
	    		resizable:true,
				sortable:true,
	    		align:'center'
	    	},

			{	
				field:"inspectorName",
	    		title:"巡线工",
				width:$(this).width() * 0.1,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{
				field:"inspectorTel",
	    		title:"巡线工电话",
				width:$(this).width() * 0.1,
	    		resizable:true,
				sortable:true,
	    		align:'center'
			}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_marker_staff_ref.html?oid="+indexData.oid,"viewGpsMarkerStaffRef","详细",700,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsMarkerStaffRefdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsMarkerStaffRefdatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
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
			initDatagrigHeight('gpsMarkerStaffRefdatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsMarkerStaffRefdatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});


	//初始化部门
	initUnit('unitid')
	//初始化管线
	initLineLoopComboTree('lineloopoid');
	//    站长/区长
	initLocaUser('stationMaster',user.unitId,'01');
	//   区间技术负责人
	initPatrolTechnician('sectionLeader',user.unitId);
	//    段长
	initLocaUser('segment',user.unitId,'02');
	//    巡线工
	initInspector('inspector',user.unitId);

	setComboObjWidth('unitid',0.152,'combobox');
	setComboObjWidth('lineloopoid',0.192,'combobox');
	setComboObjWidth('stationMaster',0.172,'combobox');
	setComboObjWidth('sectionLeader',0.172,'combobox');
	setComboObjWidth('segment',0.172,'combobox');
	setComboObjWidth('inspector',0.122,'combobox');

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
	top.getDlg("save_gps_marker_staff_ref.html","addGpsMarkerStaffRef","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsMarkerStaffRefdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_marker_staff_ref.html?oid="+dataId,"updateGpsMarkerStaffRef","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsMarkerStaffRefdatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsmarkerstaffref/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsMarkerStaffRefdatagrid').datagrid('reload');	
								$('#gpsMarkerStaffRefdatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsMarkerStaffRefdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_marker_staff_ref.html?oid="+dataId,"viewGpsMarkerStaffRef","详细",800,600,false,true,true);
}


/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnit(unitid){
	/* 以下初始化查询面板 */
	/* 部门 */
	$('#'+unitid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName",
		onSelect:function(node) {
			$('#lineloopoid').combotree("clear");
			$('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+node.id);
			//    站长/区长
			initLocaUser('stationMaster',node.id,'01');
			//   区间技术负责人
			initPatrolTechnician('sectionLeader',node.id);
			//    段长
			initLocaUser('segment',node.id,'02');
			//    巡线工
			initInspector('inspector',node.id,);
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		$('#'+unitid).combotree('loadData', result.data);
	})
	setComboObjWidth(unitid,0.152,'combobox');
}


/* 初始化人员 段长  区长 */
function initLocaUser( inspectorId , unitId, sign){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#'+inspectorId).combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getInspectorIdSelect.do?unitId='+unitId+'&sign='+sign,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth(inspectorId,0.172,'combobox');
}

/* 初始化人员 */
function initInspector( inspectorId , unitId){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#'+inspectorId).combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getAllUnitUserChildrens.do?unitId='+unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth(inspectorId,0.122,'combobox');
}

/* 巡检技术员    区间技术负责人  */
function initPatrolTechnician( inspectorId , unitId){
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#'+inspectorId).combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getAllPatrolTechnicianChildrens.do?unitId='+unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth(inspectorId,0.172,'combobox');
}
