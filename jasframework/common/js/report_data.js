
/**
 * 上报数据
 * @param className 对应entity的类名
 * @param datagrid datagrid的ID
 * @param oid 针对于单条数据的处理，可选
 * @returns
 */
function reportData(className,datagrid,oid){
	var rows = $('#'+datagrid).datagrid('getSelections');
	var idArray=[];
	if(!isNull(oid)){
		idArray.push(oid);
	}else if (rows.length > 0){
		$(rows).each(function(i,obj){
			if(obj.reportstatus == 1 || obj.reportstatus == 4 || obj.reportstatus == 6){
				idArray.push(obj.oid);
			}
		});
	}else{
		top.showAlert("提示","请选择记录",'info');
		return ;
	}
	if(!isNull(idArray)){
		$.messager.confirm('上报', '您确定要上报这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/consDcsCommon/reportData.do?className="+className,
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idArray" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","上报成功","info",function(){
								$('#'+datagrid).datagrid('reload');	
								$('#'+datagrid).datagrid('clearSelections'); 
							});
						}else{
							top.showAlert("错误","上报失败","error");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '上报出错', 'info');
					}
				});
			}
		});	
	}else{
		top.showAlert("提示","请选择未上报的数据",'info');
	}
}

/**
 * 撤销上报
 * @param className
 * @param datagrid
 * @param oid
 * @returns
 */
function cancelReportData(className,datagrid,oid){
	var rows = $('#'+datagrid).datagrid('getSelections');
	var idArray=[];
	if(!isNull(oid)){
		idArray.push(oid);
	}else if (rows.length > 0){
		$(rows).each(function(i,obj){
			if(obj.reportstatus == 2){
				idArray.push(obj.oid);
			}
		});
	}else{
		top.showAlert("提示","请选择记录",'info');
		return ;
	}
	if(!isNull(idArray)){
		$.messager.confirm('上报', '您确定要撤销上报这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/consDcsCommon/cancelReportData.do?className="+className,
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idArray" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","撤销成功","info",function(){
								$('#'+datagrid).datagrid('reload');	
								$('#'+datagrid).datagrid('clearSelections'); 
							});
						}else{
							top.showAlert("错误","撤销失败","error");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '撤销出错', 'info');
					}
				});
			}
		});	
	}else{
		top.showAlert("提示","请选择未审核的数据",'info');
	}
}

/**
 * 审核数据
 * @param pageName 审核页面名称
 * @param frameName 审核页面的窗口名称
 * @param datagrid datagrid的ID
 * @param oid 针对于单条数据的处理，可选
 * @returns
 */
function reviewData(pageName,frameName,datagrid,oid){
	var rows = $('#'+datagrid).datagrid('getSelections');
	var idArray=[];
	if(!isNull(oid)){
		idArray.push(oid);
	}else if (rows.length > 0){
		if(rows.length == 1){
			var obj = rows[0];
			if(obj.reportstatus == 2 || obj.reportstatus == 3 || obj.reportstatus == 5 ){
				idArray.push(rows[0].oid);
			}
		}else{
			$(rows).each(function(i,obj){
				if(obj.reportstatus == 2 || obj.reportstatus == 3 || obj.reportstatus == 5){
					idArray.push(obj.oid);
				}
			});
		}
	}else{
		top.showAlert("提示","请选择记录",'info');
		return ;
	}
	if(idArray.length > 50){
		top.showAlert("提示","一次审核最多不能超过50个记录",'info');
		return ;
	}
	if(!isNull(idArray)){
		top.getDlg(pageName+".html?idArray="+idArray.toString()+"&frameName="+frameName,frameName,"审核数据",800,600,false,true,true);
	}else{
		top.showAlert("提示","请选择未审核的数据",'info');
	}
}

/**
 * 抽查
 * @param pageName
 * @param frameName
 * @param datagrid
 * @param oid
 * @returns
 */
function randomReviewData(pageName,frameName,datagrid,oid){
	var rows = $('#'+datagrid).datagrid('getSelections');
	var idArray=[];
	if(!isNull(oid)){
		idArray.push(oid);
	}else if (rows.length > 0){
		$(rows).each(function(i,obj){
			if(obj.reportstatus == 3){
				idArray.push(obj.oid);
			}
		});
	}else{
		top.showAlert("提示","请选择记录",'info');
		return ;
	}
	if(idArray.length > 50){
		top.showAlert("提示","一次审核最多不能超过50个记录",'info');
		return ;
	}
	if(!isNull(idArray)){
		top.getDlg(pageName+".html?idArray="+idArray.toString()+"&frameName="+frameName,frameName,"抽检数据",800,600,false,true,true);
	}else{
		top.showAlert("提示","请选择审核通过的数据",'info');
	}
}

