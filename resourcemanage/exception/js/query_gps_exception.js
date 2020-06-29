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
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
    /* 得到今天的格式化字符串 */
    var today = new Date().Format("yyyy-MM-dd");
	$('#gpsExceptiondatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinspector/exception/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		fitColumns: true,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitName",
	    		title:"部门名称",
	    		width:$(this).width() * 0.12,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	/*{
				field:"approvestatusname",
	    		title:"审核状态",
				width:$(this).width() * 0.12,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},*/
	    	{	
				field:"inspectorName",
	    		title:"巡检人员",
				width:$(this).width() * 0.12,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
            },
            {
                field:"extField1",
                title:"SIM卡号",
				width:$(this).width() * 0.12,
                resizable:true,
                sortable:true,
                align:'center'
            }
		]],
		columns: 
		[[
			{
	    		field:"beginDate",
	    		title:"例外开始日期",
				width:$(this).width() * 0.12,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{	
				field:"endDate",
	    		title:"例外结束日期",
				width:$(this).width() * 0.12,
	    		sortable:true,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"reason",
	    		title:"例外原因",
	    		sortable:true,
				width:$(this).width() * 0.12,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			/*{
				field:"safeName",
	    		title:"是否确认管道安全",
				width:$(this).width() * 0.12,
	    		sortable:true,
	    		resizable:true,
	    		align:'center'
	    	},*/
            {
                field:"remarks",
                title:"备注",
				width:$(this).width() * 0.12,
                sortable:true,
                resizable:true,
                align:'center'
            }
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_exception.html?oid="+indexData.oid,"viewGpsException","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsExceptiondatagrid').datagrid('clearSelections'); //clear selected options
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
	initDatagrigHeight('gpsExceptiondatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);

	/* 下拉框值 */
	var userArray = [];
	var hierarchy = '';
	userArray.push(user);

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
						//$('#'+id).combobox('setValue',data[0].codeId);
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
	top.getDlg("save_gps_exception.html","addGpsException","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsExceptiondatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_exception.html?oid="+dataId,"updateGpsException","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsExceptiondatagrid').datagrid('getSelections');
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
				   url: rootPath+"/inspector/exception/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsExceptiondatagrid').datagrid('reload');
								$('#gpsExceptiondatagrid').datagrid('clearSelections');
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
	var rows = $('#gpsExceptiondatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_exception.html?oid="+dataId,"viewGpsException","详细",800,600,false,true,true);
}

/**
 * 禁用修改按钮
 * @returns
 */
function check(){
	var rows = $('#gpsExceptiondatagrid').datagrid('getSelections');
	var bool = true;
	if (rows.length == 0){
		$("#11010402").linkbutton('enable');
		$("#11010403").linkbutton('enable');
	}else{
		for (var i=0;i<rows.length;i++){
			if(rows[i].unitId != user.unitId){
				bool = false;
			}

			/* 只有状态为01的时候才可以修改和删除 */
			if(rows[i].approvestatus != '01') {
				bool = false;
			}
		}

	}
	if(bool){
		$("#11010403").linkbutton('enable');
		$("#11010404").linkbutton('enable');
		$("#11010405").linkbutton('enable');
	}else{
		$("#11010403").linkbutton('disable');
		$("#11010404").linkbutton('disable');
		$("#11010405").linkbutton('disable');
	}



}

/**
 * 时间格式化
 */
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * @desc 工作流-提交
 */
function sumbit(){
	var rows = $('#gpsExceptiondatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsExceptiondatagrid').datagrid('getSelected');
		var pkfield = row.oid;
		$.messager.confirm('提示', '提交后不能修改，确定提交?', function(r) {
			if(r){
				$('#11010405').linkbutton('disable');//提交以后 提交按钮禁用
				//设置工作流参数
				var paraArr={
					"unitid": row.unitId,
					"entityClassName": "cn.jasgroup.jasframework.resourcemanage.insmanage.entity.GpsInspectorException"
				};
				var comment = "请求审批";
				var workflowName = "exception";
				var subject = "原因："+row.reason;
				var businessEventId=pkfield;
				//开启工作流
				workflow.startWorkflow(businessEventId, workflowName,subject,true,comment,startWorkflowCallback,paraArr);
			}
		});
	}else{
		$.messager.alert('提示','请选中一条记录','info');
	}
}

//流程回调函数
function startWorkflowCallback(result){
	if(result.status==-1){
		top.showAlert('error', "发起流程失败:"+result.msg, 'error');
		return;
	}
	top.showAlert("提示", "发起流程成功!", 'info');
	$('#gpsExceptiondatagrid').datagrid('reload');
	$('#11010405').linkbutton('enable');
}

/**
 * @desc 查看流程图
 */
function viewWorkflow(){
	var rows = $('#gpsExceptiondatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsExceptiondatagrid').datagrid('getSelected');
		var pkfield = row.oid;
		var workflowName = "exception";
		var businessEventId=pkfield;
		top.getDlg(workflow.page.workflowChart.url+"?"+'businessKey='+businessEventId+"&processKey="+workflowName,
			workflow.page.workflowChart.id, '例外流程图',
			workflow.page.workflowChart.w , workflow.page.workflowChart.h);
	}else{
		workflow.tipChooseRecored();
	}
}