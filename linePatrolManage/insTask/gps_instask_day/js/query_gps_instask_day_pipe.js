
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
var inspectortype = "02";

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsInstaskDaydatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinstaskday/getPage.do?inspectortype="+inspectortype,
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        fitColumns: true,
		frozenColumns:[[
//            {field:'ck',checkbox:true},
            /*{
				field:"planno",
	    		title:"巡检计划编号",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		
	    	},*/
	    	{	
				field:"execunitidname",
	    		title:"执行部门",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"inspectoridname",
	    		title:"巡检人员",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
			{	
				field:"instypeCodeName",
	    		title:"巡检类型",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
			{	
				field:"inspectortypeCodeName",
	    		title:"巡检人员类型",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
                formatter: function(value,row,index){
					if(row.patrolObject != null )
						if( row.patrolObject.includes('01') && row.patrolObject.includes('02') )
							return '<span title="value" class="tip tooltip-f">段长/区长</span>';
						else if(row.patrolObject.includes('01'))
							return '<span title="value" class="tip tooltip-f">段长</span>';
						else if( row.patrolObject.includes('02') )
							return '<span title="value" class="tip tooltip-f">区长</span>';
						else
							return '<span title="value" class="tip tooltip-f">'+value+'</span>';
					else
                        return '<span title="value" class="tip tooltip-f">'+value+'</span>';
                }
	    	},
			{
				field:"rangeType",
				title:"区段类型",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center',
				formatter: function(value,row,index){
					if( value == '01' ) {
						return '管段';
					} else {
						return '高后果区';
					}
				}
			},
			{
				field:"code",
				title:"管段编号/高后果区编号",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center',
			},
	    	{	
				field:"insfreqcont",
	    		title:"巡检频次",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		formatter: function(value,row,index){
					if( row.insfrequnit == '06' || row.insfrequnit == '07') {
						var opt = '<span title="'+(row.insfrequnit=='01'?'日':row.insfrequnitCodeName) + row.insfreq + '巡'+'"  class="tip tooltip-f">'+ (row.insfrequnit=='01'?'日':row.insfrequnitCodeName) + row.insfreq + '巡'+'</span>';
					} else {
						var opt = '<span title="'+ row.insfrequnitval + (row.insfrequnit=='01'?'日':row.insfrequnitCodeName) + row.insfreq + '巡'+'"  class="tip tooltip-f">'+ row.insfrequnitval + (row.insfrequnit=='01'?'日':row.insfrequnitCodeName) + row.insfreq + '巡'+'</span>';
					}

					return opt;
	    		}
	    	},
	    	/*{	
				field:"insfrequnitval",
	    		title:"巡检频次单位值",
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
				field:"insfreq",
	    		title:"巡检频次值",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/
			/*{
				field:"insvehicleCodeName",
	    		title:"巡检工具",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},*/

			{	
				field:"insbdate",
	    		title:"任务开始日期",
	    		width:$(this).width() * 0.14,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
			{	
				field:"insedate",
	    		title:"任务结束日期",
	    		width:$(this).width() * 0.14,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
			{
				field:"completeSign",
				title:"任务完成情况",
				width:$(this).width() * 0.14,
				resizable:true,
				sortable:true,
				align:'center',
				formatter: function(value,row,index){
					if(value == '1')
						return '已完成';
					else
						return '未完成';
				}
			},
			{
				field:"whetherChild",
				title:"是否是子任务",
				width:$(this).width() * 0.14,
				resizable:true,
				sortable:true,
				align:'center',
				formatter: function(value,row,index){
					if(value == '1')
						return '是';
					else
						return '否'
				}
			}

	    	/*,

		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:$(this).width() * 0.1,
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span>\
							   </a><a href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
									<span class="fa fa-edit"></span>\
						   	   </a><a href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
									<span class="fa fa-minus"></span>\
						       </a></p>';
		  			var opt = '<p class="table-operate"><a class = "a10060201" href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span></a></p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_instask_day.html?oid="+indexData.oid,"viewGpsInstaskDay","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsInstaskDaydatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsInstaskDaydatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='instype'+',';
	singleDomainName+='insType'+","
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsInstaskDaydatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsInstaskDaydatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});

    initUnitComboLocalTree('execunitid');
  //  initLocaUser('inspectorid');

	$('#rangeType').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "id",
		textField : "text",
	});
	setComboObjWidth("rangeType",0.145,'combobox');
	$('#rangeType').combobox("loadData",[{"id":"01","text":"管段"},{"id":"02","text":"高后果区"}])

	$('#completeSign').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "id",
		textField : "text",
	});
	setComboObjWidth("completeSign",0.145,'combobox');
	$('#completeSign').combobox("loadData",[{"id":"0","text":"未完成"},{"id":"1","text":"已完成"}])

	$('#whetherChild').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "id",
		textField : "text",
	});
	setComboObjWidth("whetherChild",0.145,'combobox');
	$('#whetherChild').combobox("loadData",[{"id":"0","text":"否"},{"id":"1","text":"是"}])
});

/* 初始化人员 */
function initLocaUser( inspectorId ){
    /* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
    $('#'+inspectorId).combobox({
        panelHeight:150,
        editable:true,
        mode:'remote',
        url : rootPath+'/xncommon/getAllUnitUserChildrenForPriUser.do?unitId='+user.unitId,
        valueField : "codeid",
        textField : "codename",
        onSelect : function(row){
        }
    });
    setComboObjWidth(inspectorId,0.145,'combobox');
}

/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboLocalTree(unitid){
    /* 以下初始化查询面板 */
    /* 部门 */
    $('#'+unitid).combotree({
        panelHeight:150,
        editable:true,
        mode:'remote',
        valueField : "oid",
        textField : "unitName",
        onSelect:function(node) {
            // $('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+node.id);
            //$("#inspectorid").combobox("reload", rootPath+'/xncommon/getAllUnitUserChildrenForPriUser.do?unitId='+node.id);
            //setComboObjWidth(lineloopoid,0.145,'combobox');
        }
    });
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        console.log(result);

        $('#'+unitid).combotree('loadData', result.data);

    })
    setComboObjWidth(unitid,0.172,'combobox');
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
//						$('#'+id).combobox('setValue',data[0].codeId);
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
	top.getDlg("save_gps_instask_day.html","addGpsInstaskDay","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsInstaskDaydatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_instask_day.html?oid="+dataId,"updateGpsInstaskDay","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsInstaskDaydatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsinstaskday/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsInstaskDaydatagrid').datagrid('reload');	
								$('#gpsInstaskDaydatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsInstaskDaydatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_instask_day.html?oid="+dataId,"viewGpsInstaskDay","详细",800,600,false,true,true);
}


/**
 * 同步
 * @returns
 */
function doInstask(){
	showLoadingMessage("正在生成管道工巡检任务，请稍候。。。");
	$.ajax({
	   url: rootPath+"/gpsinstaskday/doInstask.do",
	   data :{"inspectortype" : inspectortype},
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
				hiddenLoadingMessage();
				top.showAlert("提示","生成巡检任务完成","info",function(){
					$('#gpsInstaskDaydatagrid').datagrid('reload');	
					$('#gpsInstaskDaydatagrid').datagrid('clearSelections'); 
				});
			}else if(data.code == "400") {
				hiddenLoadingMessage();
				top.showAlert("错误", "生成巡检任务失败", 'error');
			}else{
				hiddenLoadingMessage();
				top.showAlert("错误", data.msg, 'error');
			}
	   },
	   error : function(data) {
		   hiddenLoadingMessage();
		   top.showAlert('错误', '生成巡检任务出错', 'error');
	   }
	});
}


