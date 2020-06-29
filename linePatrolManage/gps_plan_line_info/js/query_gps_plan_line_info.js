
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
	initDatagrid();
	//页面自适应
	initDatagrigHeight('gpsPlanInfodatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	comboxid+='inspectortype'+',';
	singleDomainName+='workusertype'+","
	comboxid+='insvehicle'+',';
	singleDomainName+='insTool'+","
	comboxid+='instype'+',';
	singleDomainName+='insType'+","
	comboxid+='ispis'+',';
	singleDomainName+='ispis'+",";
	var morecomboxid='';
	var moreDomainName='';	// 多选值域

	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	/* 以下初始化查询面板 */
	initUnitComboTree('execunitid');
	initUnitComboTree('unitid');
	initLineLoopCombobox('lineloopoid');
//	showPan('beginlocation','endlocation','beginstation','endStation');
	
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

        /* 高级搜索新增监听事件，如果展开就缩小高度。避免底部无法看见。*/
        /* 获取当前高度 */

        /*setTimeout(function(){*/
            var currentHeight = $(".datagrid-view").css("height");
            var currentBodyHeight = $(".datagrid-body").css("height");
            currentHeight = currentHeight.substring(0, currentHeight.lastIndexOf("px"));
            if( $("#moreTable").css("display") == "none") {
                $(".datagrid-view").css("height", (parseInt(currentHeight) + 130)+"px");
                $(".datagrid-body").css("height", (parseInt(currentBodyHeight) + 140)+"px");
            } else {
                $(".datagrid-view").css("height", (parseInt(currentHeight) - 130)+"px");
                $(".datagrid-body").css("height", (parseInt(currentBodyHeight) - 140)+"px");
            }
       /* },1000)*/

	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});

});



function initDatagrid(){
	$('#gpsPlanInfodatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsplaninfo/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
			{field:'ck',checkbox:true},
			{	
				field:"planno",
	    		title:"巡检计划编号",
	    		width:"150",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
	    	/*{	
				field:"syncdate",
	    		title:"同步时间",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/
	    	{	
				field:"instypeCodeName",
	    		title:"巡检类型",
	    		width:"130",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
			{	
				field:"execunitidname",
	    		title:"执行单位",
	    		width:"200",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
			{	
				field:"unitidname",
	    		title:"制定单位",
	    		width:"200",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
			{	
				field:"inspectortypeCodeName",
	    		title:"巡检人员类型",
	    		width:"120",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

	    	{	
				field:"insfreqcont",
	    		title:"巡检频次",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		formatter: function(value,row,index){
					var opt = row.insfrequnitval + (row.insfrequnit=='01'?'日':row.insfrequnitCodeName) + row.insfreq + '巡';
					return opt;
	    		}
	    	},
			/*{	
				field:"insfreq",
	    		title:"巡检频次值",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"insfrequnitCodeName",
	    		title:"巡检频次单位",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"insfrequnitval",
	    		title:"巡检频次单位值",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/

			{	
				field:"insvehicleCodeName",
	    		title:"巡检方式",
	    		width:"120",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"insbdate",
	    		title:"计划开始时间",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"insedate",
	    		title:"计划结束时间",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			/*{	
				field:"determinant",
	    		title:"制作依据",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"repealdate",
	    		title:"计划废除日期",
	    		width:"90",
	    		resizable:true,
	    		align:'center'
	    	},*/

			{	
				field:"planflagCodeName",
	    		title:"计划执行状态",
	    		width:"120",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

	    	{
				field:"isPis",
	    		title:"是否PIS同步",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		formatter: function(value,row,index){
					if(value == '1'){
						return '是';
					}else{
						return '否';
					}
				}
	    	},
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"130",
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span></a>';
					if(row.isPis != '1'){
						opt += '<a href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
									<span class="fa fa-edit"></span></a>\
						   	   <a href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
									<span class="fa fa-minus"></span>\
						       </a>';
					}
					
					opt += '</p>';
					return opt;
				}
			}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_plan_info.html?oid="+indexData.oid,"viewGpsPlanInfo","详细",800,600,false,true,true);
		},
		onClickRow:function(index,indexData){
			var rows = $('#gpsPlanInfodatagrid').datagrid('getSelections');
			for(var i=0;i<rows.length;i++){
				if(rows[i].isPis == '1'){
					//$('#10210702').linkbutton('disable');
					$('#10210703').linkbutton('disable');
					return;
				}
			}
			//$('#10210702').linkbutton('enable');
			$('#10210703').linkbutton('enable');
		},
		onLoadSuccess:function(data){
	    	$('#gpsPlanInfodatagrid').datagrid('clearSelections'); //clear selected options
	    }
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
			setComboObjWidth(id,0.22,'combobox');
		}
	}
}
/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_plan_info.html","addGpsPlanInfo","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsPlanInfodatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	if(rows[0].isPis == '0'){
		top.getDlg("update_gps_plan_info.html?oid="+dataId,"updateGpsPlanInfo","修改",800,600,false,true,true);
	}else{
		top.getDlg("update_gps_plan_info_ispis.html?oid="+dataId,"updateGpsPlanInfo","修改",800,600,false,true,true);
		
	}
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsPlanInfodatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsplaninfo/deleteplanandline.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsPlanInfodatagrid').datagrid('reload');	
								$('#gpsPlanInfodatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsPlanInfodatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_plan_info.html?oid="+dataId,"viewGpsPlanInfo","详细",800,600,false,true,true);
}

/**
 * 同步
 * @returns
 */
function sync(){
	showLoadingMessage("正在同步巡检计划及巡检路线，请稍候。。。");
	$.ajax({
	   url: rootPath+"/gpsplaninfo/sync.do",
	   contentType: 'application/json;charset=utf-8',
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
				hiddenLoadingMessage();
				top.showAlert("提示","同步成功","info",function(){
					$('#gpsPlanInfodatagrid').datagrid('reload');	
					$('#gpsPlanInfodatagrid').datagrid('clearSelections'); 
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

/**
 * 保存GPS坐标测试
 * @returns
 */
function savePatrolxy(){
	showLoadingMessage("正在保存GPS数据，请稍候。。。");
	$.ajax({
	   url: rootPath+"/patrolxy/savePatrolxytest.do",
	   contentType: 'application/json;charset=utf-8',
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
				hiddenLoadingMessage();
				top.showAlert("提示","保存成功","info");
			}else if(data.code == "400") {
				hiddenLoadingMessage();
				top.showAlert("提示", "保存失败", 'error');
			}else{
				hiddenLoadingMessage();
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
		   hiddenLoadingMessage();
		   top.showAlert('错误', '保存出错', 'info');
	   }
	});
}

/**
 * 保存GPS线空间数据测试
 * @returns
 */
function savePatrolxyLine(){
	showLoadingMessage("保存GPS线空间数据，请稍候。。。");
	$.ajax({
	   url: rootPath+"/patrolxy/savePatrolxyLine.do?date=2018-09-29",
	   contentType: 'application/json;charset=utf-8',
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
				hiddenLoadingMessage();
				top.showAlert("提示","保存成功","info");
			}else if(data.code == "400") {
				hiddenLoadingMessage();
				top.showAlert("提示", "保存失败", 'error');
			}else{
				hiddenLoadingMessage();
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
		   hiddenLoadingMessage();
		   top.showAlert('错误', '保存出错', 'info');
	   }
	});
}


