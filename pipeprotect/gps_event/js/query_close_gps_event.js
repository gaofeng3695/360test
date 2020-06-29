
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
	$('#13020204').menubutton({menu:'#locationBars'});
//	$('#export').menubutton({menu:'#exportBars'}); 
	$('#gpsEventdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpseventclose/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {
		  		field:'locationXY',
		  		title:'定位',
		  		align:"center",
		  		width:"50",
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a class ="a13020204" href="#" title = "定位" onclick="locationSelect(\''+row.eventoid+'\', ' + row.lon+','+row.lat+')">\
								<span class="fa fa-thumb-tack"></span>\
					   			</a></p>';
					return opt;
				}
			},
            {
				field:"closeapprovestatusname",
	    		title:"审核状态（关闭）",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{	
				field:"unitidname",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"lineloopoidname",
	    		title:"管线名称",
	    		width:"150",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
			
			{	
				field:"reportpersonname",
	    		title:"上报人",
	    		width:"90",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"occurrencetime",
	    		title:"事件发生日期",
	    		width:"100",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{	
				field:"occurrencesite",
	    		title:"事件发生地点",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"eventtypeCodeName",
	    		title:"事件类型",
	    		width:"90",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			/*{	
				field:"constructionidname",
	    		title:"第三方施工项目名称",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},*/

			/*{	
				field:"lon",
	    		title:"位置经度",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"lat",
	    		title:"位置纬度",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},*/

			{	
				field:"keypointnamename",
	    		title:"临时关键点",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			/*{	
				field:"solution",
	    		title:"解决方案",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/

			{	
				field:"guardianname",
	    		title:"事件监护人",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"closestartpersonname",
	    		title:"关闭发起人",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"solvingdate",
	    		title:"问题解决日期",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"150",
		  		formatter: function(value,row,index){
		  			var opt = '<p class="table-operate"><a class = "a13020201" href="#" title = "查看" onclick="view(\'' + row.eventoid+'\')">\
									<span class="fa fa-eye"></span></a>';
					if(row.closeapprovestatus=='02' || row.closeapprovestatus=='04'){
						opt += '<a href="#" class = "a13020202" title = "修改" onclick="update(\'' + row.eventoid+'\')">\
									<span class="fa fa-edit"></span></a>';
					}
					opt += '</p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_close_gps_event.html?eventoid="+indexData.eventoid,"viewCloseGpsEvent","详细",800,600,false,true,true);
		},
		onSelect:function(index,indexData){
			var rows = $('#gpsEventdatagrid').datagrid('getSelections');
			if(rows.length > 1){
				disableButtion("13020202");
				disableButtion("13020201");
				disableButtion("13020205");
				disableButtion("13020206");
				disableButtion("13020203");
				disableButtion("harm");
				disableButtion("destroy");
			}else{
				enableButtion("13020201");
				if(rows.length == 0){
					enableButtion("13020206");
					enableButtion("13020202");
					enableButtion("13020205");
					enableButtion("13020201");
					enableButtion("13020203");
					enableButtion("harm");
					enableButtion("destroy");
				}else{
					if(rows[0].closeapprovestatus=='01'){//巡检事件上报已审批
						disableButtion("13020206");
						disableButtion("13020202");
//						enableButtion("del");
						disableButtion("13020205");
						enableButtion("13020203");
						disableButtion("harm");
						disableButtion("destroy");
					}else if(rows[0].closeapprovestatus=='02'){//巡检事件关闭未提交
						enableButtion("13020206");
						enableButtion("13020202");
//						enableButtion("del");
						enableButtion("13020205");
						disableButtion("13020203");
						enableButtion("harm");
						enableButtion("destroy");
					}else if(rows[0].closeapprovestatus=='04'){//巡检事件关闭已驳回
						enableButtion("13020206");
						enableButtion("13020202");
//						enableButtion("del");
						disableButtion("13020205");
						disableButtion("13020203");
						enableButtion("harm");
						enableButtion("destroy");
					}else if(rows[0].closeapprovestatus=='05'){//巡检事件关闭已审批
						enableButtion("13020206");
						disableButtion("13020202");
//						enableButtion("del");
						disableButtion("13020205");
						disableButtion("13020203");
						disableButtion("harm");
						disableButtion("destroy");
					}else if(rows[0].closeapprovestatus=='03'){//巡检事件关闭审批中
						enableButtion("13020206");
						disableButtion("13020202");
//						disableButtion("del");
						disableButtion("13020205");
						disableButtion("13020203");
						disableButtion("harm");
						disableButtion("destroy");
					}
				}
			}
		},
		onLoadSuccess:function(data){
	    	$('#gpsEventdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsEventdatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='closeapprovestatus'+',';
	singleDomainName+='eventCloseStatus'+',';
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsEventdatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsEventdatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	initUnitComboTree('unitid');
    setComboObjWidth('unitid',0.172,'combobox');
	//初始化管线
	initLineLoopCombobox('lineloopoid');
	setComboObjWidth('lineloopoid',0.215,'combobox');
	
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
//						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.145,'combobox');
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
			setComboObjWidth(id,0.145,'combobox');
		}
	}
}
/**
 * @desc 关闭
 */
function closeEvent(eventoid){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(eventoid)){
		dataId = eventoid;
	}else if (rows.length == 1){
		dataId = rows[0].eventoid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("close_gps_event.html?eventoid="+dataId,"closeGpsEvent","巡检事件关闭",800,600,false,true,true);
}

function harm(eventoid){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(eventoid)){
		dataId = eventoid;
	}else if (rows.length == 1){
		dataId = rows[0].eventoid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("gps_event_harm/query_harm_gps_event.html?eventoid="+dataId,"queryHarmGpsEvent","巡检事件伤害记录",800,600,false,true,true);
}

function destroy(eventoid){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(eventoid)){
		dataId = eventoid;
	}else if (rows.length == 1){
		dataId = rows[0].eventoid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("gps_event_destroy/query_destroy_gps_event.html?eventoid="+dataId,"queryDestroyGpsEvent","巡检事件破坏事件记录",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(eventoid){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(eventoid)){
		dataId = eventoid;
	}else if (rows.length == 1){
		dataId = rows[0].eventoid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_close_gps_event.html?eventoid="+dataId,"updateGpsEventClose","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(closeoid){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var idArray=[];
	if(!isNull(closeoid)){
		idArray.push(closeoid);
	}else if (rows.length > 0){
		$(rows).each(function(i,obj){
			idArray.push(obj.closeoid);
		});
	}else{
		top.showAlert("提示","请选择记录",'info');
		return ;
	}
	if(!isNull(idArray)){
		$.messager.confirm('删除', '您确定要删除这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/gpseventclose/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsEventdatagrid').datagrid('reload');	
								$('#gpsEventdatagrid').datagrid('clearSelections'); 
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
function view(eventoid){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(eventoid)){
		dataId = eventoid;
	}else if (rows.length == 1){
		dataId = rows[0].eventoid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_close_gps_event.html?eventoid="+dataId,"viewCloseGpsEvent","详细",800,600,false,true,true);
}

/**
 * @desc 工作流-提交
 */
function sumbit(){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsEventdatagrid').datagrid('getSelected');
		var pkfield = row.closeoid;
		$.messager.confirm('提示', '提交后不能修改，确定提交?', function(r) {
			if(r){

				$('#13020205').linkbutton('disable');//提交以后 提交按钮禁用
				//设置工作流参数
				var paraArr={
					"unitid": row.unitid,
					"entityClassName": "cn.jasgroup.jasframework.pipeprotect.gpsevent.entity.GpsEventClose"
				};
				var comment = "请求审批";
				var workflowName="gpseventclose";
				var subject=row.eventtypeCodeName+"/"+row.occurrencesite;
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
	$('#gpsEventdatagrid').datagrid('reload');
	$('#13020205').linkbutton('enable');
}

/**
 * @desc 回调函数，修改状态
 */
function callbackFun(result){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var pkfield = rows[0].closeoid;
	if (result.success){
		$.messager.alert('正确',result.successMessage,'ok',function(){
			$.ajax({
			    type: "POST",
				url:rootPath+"/gpseventclose/submitGpsEventClose.do",
				data: {"oid" : pkfield},
				async:false,
				dataType:"json",
				success:function(result){
					$('#gpseventdatagrid').datagrid('reload');
				},
				error : function(data) {
					top.showAlert('错误', '提交出错', 'info');
				}
			});
		});
	} else {
		$.messager.alert('提示',"已提交审核，不能重复提交",'info');
	}
}


/**
 * @desc 查看流程图
 */
function viewWorkflow(){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsEventdatagrid').datagrid('getSelected');
		var pkfield = row.closeoid;
		var workflowName = "gpseventclose";
		var businessEventId=pkfield;
		top.getDlg(workflow.page.workflowChart.url+"?"+'businessKey='+businessEventId+"&processKey="+workflowName, 
				workflow.page.workflowChart.id, '巡检事件关闭流程图',
				workflow.page.workflowChart.w , workflow.page.workflowChart.h);
	}else{
		workflow.tipChooseRecored();
	}
}


/**
 *@desc 导出选中
 */
function exportSelect(){
	var templateCode = "export_xxxx";//导出模板编号
	// 找到所有被选中行
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
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
 * 定位
 * @returns
 */
function locationSelect( oid, lon, lat ){
    /* 显示地图 地图打开中 */
    top.map.show = true;
    let array = [];
    let per = {};
    per.oid = oid;
    per.lon = lon;
    per.lat = lat;
    per.type = 'event';
    array.push( per );
    let option = {};
    option.layerId = "1";
    option.url = 'images/map_event.png';
    option.width = 24;
    option.height = 24;
    top.position.positionArray = JSON.stringify(array)+'&^'+JSON.stringify(option);

}


/**
 * 定位选中，在导航栏。
 */
function positionSelectOnTop( param ){

    let rows = $('#gpsEventdatagrid').datagrid('getSelections');
    var idArray = [];

    /* 定位所有 */
    if(param != 'all'){
        // 找到所有被选中行
        if(rows.length<1){
            $.messager.alert('提示','未选中数据','info');
            return;
        }

        /* 打开地图 */
        top.map.show = true;

        // 遍历取得所有被选中记录的id
        $(rows).each(function(i,obj){
            /* 创建经度纬度JSON */
            let coordinate = {};
            coordinate.lon = obj.lon;
            coordinate.lat = obj.lat;
            coordinate.oid = obj.eventoid;
            coordinate.type = 'event';
            idArray.push(coordinate);
        });

        let option = {};
        option.layerId = "1";
        option.url = 'images/map_event.png';
        option.width = 24;
        option.height = 24;
        top.position.positionArray = JSON.stringify(idArray)+'&^'+JSON.stringify(option);

    } else {

        /* 打开地图 */
        top.map.show = true;

        /* 分页定位，首先获取到所有的数量。 */
        showLoadingMessage("正在获取所有坐标数据数量，请稍后...");
        $.get(rootPath+'/gpseventclose/getPage.do', function( rs ) {
            count = rs.total;
            showLoadingMessage("所有的坐标数量为"+count+"条，数据正在渲染中，请稍后...");
            /* 每页大概传100条数据 */
            let pageSize = 100;
            let pageNo = Math.floor(count/100) + 1;
            for( let i = 1 ; i <= pageNo ; i++ ){
                if ( count <= 100 ) {
                    // showLoadingMessage("正在获取0到"+count+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpseventclose/getPage.do?pageNo=1&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                for( let k = 0 ; k < allPoint.length ; k++ ){
                                    allPoint[k].oid = allPoint[k].eventoid;
                                    allPoint[k].type = 'event';
								}
                                let option = {};
                                option.layerId = "1";
                                option.url = 'images/map_event.png';
                                option.width = 24;
                                option.height = 24;
                                top.position.positionArray = JSON.stringify(allPoint)+'&^'+JSON.stringify(option);

                                hiddenLoadingMessage();
                            }
                        }
                    })
                } else if ( i == pageNo) {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+result+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpseventclose/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                let option = {};
                                option.layerId = "1";
                                option.url = 'images/map_event.png';
                                option.width = 24;
                                option.height = 24;
                                top.position.positionArray = JSON.stringify(allPoint)+'&^'+JSON.stringify(option);
                                for( let k = 0 ; k < allPoint.length ; k++ ){
                                    allPoint[k].oid = allPoint[k].eventoid;
                                    allPoint[k].type = 'event';
                                }
                                hiddenLoadingMessage();
                            }
                        }
                    })
                } else {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+100*i+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpseventclose/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                for( let k = 0 ; k < allPoint.length ; k++ ){
                                    allPoint[k].oid = allPoint[k].eventoid;
                                    allPoint[k].type = 'event';
                                }
                                let option = {};
                                option.layerId = "1";
                                option.url = 'images/map_event.png';
                                option.width = 24;
                                option.height = 24;
                                top.position.positionArray = JSON.stringify(allPoint)+'&^'+JSON.stringify(option);
                            }
                        }
                    })
                }
            }
        });

    }

}
