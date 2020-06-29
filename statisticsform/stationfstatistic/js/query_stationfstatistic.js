/**
 * 覆盖率统计
 */
var nowDate = getNowDate();
$(document).ready(function(){
	$('#begindate').val(nowDate);
    $('#120101').menubutton({menu:'#exportBars'});
    initUnitComboTreeLocalPer('unitId');
	initdatagrid();
	$('#stationfstatisticDatagrid').unbind('mouseover');
	query();

    /* 初始化 */
    initStack();

    /* 显示导航栏 */
    showNavigation( $('#queryCoverage') );

    addNavigationClick( $('#queryCoverage') );

});
/**
 * 获取当前日期
 * @returns
 */
function getNowDate(){
    var today=new Date();
    // var t=today.getTime()-1000*60*60*24;
    var t=today.getTime();
    var yesterday=new Date(t);
    return yesterday.format("yyyy-MM-dd");
}

function initdatagrid(){
	$('#stationfstatisticDatagrid').datagrid({
		idField:'unitid',
//		url: rootPath+"/gpsinspector/getPage.do?unitid="+stUnitId+"&inspectortype="+stType,
		collapsible:true,
		autoRowHeight: false,
		rownumbers:false,
		striped:false,
		nowrap:false,
		fitColumns: true,
		pagination:false,
		rowStyler: function (index, row) {
			return 'background-color:white;';
		},
		columns: 
		[[
			{	
				field:"unitidname",
	    		title:"巡检部门",
	    		width:$(this).width() * 0.33,
	    		resizable:true,
    			sortable:false,
	    		align:'center',
                formatter: function(value,row,index){
                    /* 得到部门id和字段名称  */
                    return '<span title="'+row.unitidname+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildren(\''+row.unitid+'\',\''+row.unitidname+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitidname+'</span>';
                }
	    	},
	    	{	
				field:"plancoveragerate",
	    		title:"计划覆盖率",
	    		width:$(this).width() * 0.33,
	    		resizable:true,
    			sortable:false,
	    		align:'center',
	    		formatter: function(value,row,index){
					return '<span title="'+Math.round(value*100)/100+"%"+'"  class="tip tooltip-f">' +Math.round(value*100)/100+"%"+'</span>';
				},
				styler:function(value,row,index){
                    if(Math.round(value*100)/100 < 100){
                        return 'color:red;';
                    }
                }
	    	},
	    	{	
	    		field:"taskcoveragerate",
	    		title:"任务覆盖率",
	    		width:$(this).width() * 0.33,
	    		resizable:true,
	    		sortable:false,
	    		align:'center',
	    		formatter: function(value,row,index){
					if(value >= 99.6)
						return '<span title="100%"  class="tip tooltip-f">100%</span>';
					return '<span title="'+Math.round(value*10)/10+"%"+'"  class="tip tooltip-f">' +Math.round(value*10)/10+"%"+'</span>';
				},
				styler:function(value,row,index){
                    if(Math.round(value*10)/10 < 99.6){
                        return 'color:red;';
                    }
                }
	    	}
		]],
		onLoadSuccess:function(data){
	    	var s= $("#stationfstatisticDatagrid").datagrid('getPanel');
	    	var rows = s.find('tr.datagrid-row');
	    	var rows1 = s.find('tr.datagrid-row td[field!=ck]');
	    	rows1.unbind('click').bind('click',function(e){
	    		return false;
	    	});
	    	rows.unbind('mouseover').bind('mouseover',function(e){
	    		return false;
	    	});
	    }
	});
	//页面自适应
	initDatagrigHeight('stationfstatisticDatagrid','queryDiv',100);  
}

function query(){
	var begindate = $('#begindate').val();
	var enddate = $('#enddate').val();
	var unitid = $('#unitId').combobox('getValue');
	// if(begindate != null && begindate != '' && enddate != null && enddate != '' ){
	// 	if(begindate > enddate){
	// 		top.showAlert("提示", "查询开始日期不能大于截止日期！", 'info');
	// 		return;
	// 	}
	// }
	$.ajax({
		url : rootPath+"statisticsform/stationfstatistic/getStationfstatistic.do?unitid="+unitid+"&begindate="+begindate+"&enddate="+enddate,
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		success: function(data){
			if(data.status==1){
				if(data.data.data == null || data.data.data.length == 0){
					$('#stationfstatisticDatagrid').datagrid('loadData', { total: 0, rows: [] });
				}else{
					setDatagrid(data);
				}
				initDatagrigHeight('stationfstatisticDatagrid','queryDiv',100);  
			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
}

/**
 * 清空
 */
function clearLocalQuery() {
	$("#begindate").val('');

    $("#queryForm select").each(function() {
        try{
            $(this).combotree("clear");
        }catch(e){
            $(this).val("");
        }
    });
}

function setDatagrid(data){
	if(data.data.flag == 1){
		$('#stationfstatisticDatagrid').datagrid(
			{columns : [[
				{	
					field:"unitidname",
		    		title:"巡检部门",
		    		width:$(this).width() * 0.33,
		    		resizable:true,
	    			sortable:false,
		    		align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span title="'+row.unitidname+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildren(\''+row.unitid+'\',\''+row.unitidname+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitidname+'</span>';
                    }
		    	},
		    	{	
					field:"plancoveragerate",
		    		title:"计划覆盖率",
		    		width:$(this).width() * 0.33,
		    		resizable:true,
	    			sortable:false,
		    		align:'center',
		    		formatter: function(value,row,index){
		    			return '<span style = "font-size: 18px;" title="'+Math.round(value*100)/100+"%"+'"  class="tip tooltip-f">' +Math.round(value*100)/100+"%"+'</span>';
					},
					styler:function(value,row,index){
                        if(Math.round(value*100)/100 < 100){
                            return 'color:red;';
                        }
                    }
		    	},
		    	{	
		    		field:"taskcoveragerate",
		    		title:"任务覆盖率",
		    		width:$(this).width() * 0.33,
		    		resizable:true,
		    		sortable:false,
		    		align:'center',
		    		formatter: function(value,row,index){
						if(value >= 99.6)
							return '<span title="100%"  class="tip tooltip-f">100%</span>';
						return '<span style = "font-size: 18px;" title="'+Math.round(value*10)/10+"%"+'"  class="tip tooltip-f">' +Math.round(value*10)/10+"%"+'</span>';
					},
					styler:function(value,row,index){
                        if(value < 99.6){
                            return 'color:red;';
                        }
                    }
		    	}
		    ]],
			onLoadSuccess:function(data){
                $(".datagrid-header td[field='plancoveragerate']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：巡检计划覆盖率是指部门的上级计划，下级计划和本级计划的并集与部门范围的交集，减去该部门本级和下级不巡检范围的并集与部门范围的交集，除以本部门的范围减去本部门本级和下级不巡检范围的并集与部门范围的交集。<br/>' +
                    '公式：(上下本级所有计划并集与部门管理范围的交集 - 本级下级不巡检区段并集与部门范围的交集) / (部门范围并集 - 本级下级不巡检范围并集与部门范围的交集)</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });
                $(".datagrid-header td[field='taskcoveragerate']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：巡检任务覆盖率是指部门的上级计划，下级计划和本级任务的并集与部门范围的交集，减去该部门本级和下级不巡检范围的并集与部门范围的交集，除以本部门的范围减去本部门本级和下级不巡检范围的并集与部门范围的交集。<br/>' +
                    '公式：(上下本级所有任务并集与部门管理范围的交集 - 本级下级不巡检区段并集与部门范围的交集) / (部门范围并集 - 本级下级不巡检范围并集与部门范围的交集)</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });
			}
			}
		);
		$('#stationfstatisticDatagrid').datagrid('loadData', data.data.data); 
	}else if(data.data.flag == 0){
		$('#stationfstatisticDatagrid').datagrid(
				{columns : [
					[{	
						field:"unitidname",
			    		title:"巡检部门",
			    		rowspan:2,
			    		width:'150',
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
                        formatter: function(value,row,index){
                            /* 得到部门id和字段名称  */
                            return '<span title="'+row.unitidname+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildren(\''+row.unitid+'\',\''+row.unitidname+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitidname+'</span>';
                        }
			    	},
			    	{	
						field:"lineloopoidname",
			    		title:"管线",
			    		rowspan:2,
			    		width:'150',
			    		resizable:true,
		    			sortable:false,
			    		align:'center'
			    	},
			    	{	
			    		title:"部门管理范围",
			    		colspan:1,
			    		width:'400',
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
			    			if(value == null || value == "" ) {
			    				return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			    			}else{
			    				return '<span title="'+value.replace(/;/g, ';<br>')+'"  class="tip tooltip-f">' +value.replace(/;/g, ';<br>')+'</span>';
			    			}
						}
			    		
			    	},
			    	{	
			    		field:"unbeginlocation",
			    		title:"不巡检范围",
			    		rowspan:2,
			    		width:'400',
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
			    			if(value == null || value == "" ) {
			    				return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			    			}else{
			    				return '<span title="'+value.replace(/;/g, ';<br>')+'"  class="tip tooltip-f">' +value.replace(/;/g, ';<br>')+'</span>';
			    			}
						}
			    	},
			    	{	
			    		title:"计划",
			    		colspan:1,
			    		width:'400',
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
			    			if(value == null || value == "" ) {
			    				return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			    			}else{
			    				return '<span title="'+value.replace(/;/g, ';<br>')+'"  class="tip tooltip-f">' +value.replace(/;/g, ';<br>')+'</span>';
			    			}
						}
			    	},
			    	{	
						field:"plancoveragerate",
			    		title:"计划覆盖率",
			    		rowspan:2,
			    		width:'90',
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
			    			return '<span style = "font-size: 18px;" title="'+Math.round(value*100)/100+"%"+'"  class="tip tooltip-f">' +Math.round(value*100)/100+"%"+'</span>';
						},
						styler:function(value,row,index){
	                        if(Math.round(value*100)/100 < 100){
	                            return 'color:red;';
	                        }
	                    }
			    	},
			    	{	
						field:"taskbeginlocation",
			    		title:"任务",
			    		rowspan:2,
			    		width:'400',
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
			    			if(value == null || value == "" ) {
			    				return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			    			}else{
			    				return '<span title="'+value.replace(/;/g, ';<br>')+'"  class="tip tooltip-f">' +value.replace(/;/g, ';<br>')+'</span>';
			    			}
						}
			    	},
			    	{	
			    		field:"taskcoveragerate",
			    		title:"任务覆盖率",
			    		rowspan:2,
			    		width:'90',
			    		resizable:true,
			    		sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
							if(value >= 99.6)
								return '<span title="100%"  class="tip tooltip-f">100%</span>';
			    			return '<span style = "font-size: 18px;" title="'+Math.round(value*10)/10+"%"+'"  class="tip tooltip-f">' +Math.round(value*10)/10+"%"+'</span>';
						},
						styler:function(value,row,index){
	                        if(Math.round(value*10)/10 < 99.6){
	                            return 'color:red;';
	                        }
	                    }
			    	}],
			    	[{	
						field:"subbeginlocation",
			    		title:"起止位置（里程）",
			    		width:'400',
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
			    			if(value == null || value == "" ) {
			    				return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			    			}else{
			    				return '<span title="'+value.replace(/;/g, ';<br>')+'"  class="tip tooltip-f">' +value.replace(/;/g, ';<br>')+'</span>';
			    			}
						}
			    	},{
						field:"planbeginlocation",
			    		title:"起止位置（里程）",
			    		width:'400',
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
			    			if(value == null || value == "" ) {
			    				return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			    			}else{
			    				return '<span title="'+value.replace(/;/g, ';<br>')+'"  class="tip tooltip-f">' +value.replace(/;/g, ';<br>')+'</span>';
			    			}
						}
			    	}]
				],
				onLoadSuccess:function(data){
					$(".datagrid-header td[field='plancoveragerate']").tooltip({
						position: 'bottom',
						content: '<span style="color:#fff">概念：巡检计划覆盖率是指部门的上级计划，下级计划和本级计划的并集与部门范围的交集，减去该部门本级和下级不巡检范围的并集与部门范围的交集，除以本部门的范围减去本部门本级和下级不巡检范围的并集与部门范围的交集。<br/>' +
						'公式：(上下本级所有计划并集与部门管理范围的交集 - 本级下级不巡检区段并集与部门范围的交集) / (部门范围并集 - 本级下级不巡检范围并集与部门范围的交集)</span>',
						onShow: function(){
							$(this).tooltip('tip').css({
								backgroundColor: '#666',
								borderColor: '#666'
							});
						}
					});
					$(".datagrid-header td[field='taskcoveragerate']").tooltip({
						position: 'bottom',
						content: '<span style="color:#fff">概念：巡检任务覆盖率是指部门的上级计划，下级计划和本级任务的并集与部门范围的交集，减去该部门本级和下级不巡检范围的并集与部门范围的交集，除以本部门的范围减去本部门本级和下级不巡检范围的并集与部门范围的交集。<br/>' +
						'公式：(上下本级所有任务并集与部门管理范围的交集 - 本级下级不巡检区段并集与部门范围的交集) / (部门范围并集 - 本级下级不巡检范围并集与部门范围的交集)</span>',
						onShow: function(){
							$(this).tooltip('tip').css({
								backgroundColor: '#666',
								borderColor: '#666'
							});
						}
					});

                    $(".datagrid-header td[field='unbeginlocation']").tooltip({
                        position: 'bottom',
                        content: '<span style="color:#fff">概念：本部门与下级部门的所有不巡检范围的并集与部门管理范围的交集。<br/>' +
                        '</span>',
                        onShow: function(){
                            $(this).tooltip('tip').css({
                                backgroundColor: '#666',
                                borderColor: '#666'
                            });
                        }
                    });

                    $(".datagrid-header td[field='planbeginlocation']").tooltip({
                        position: 'bottom',
                        content: '<span style="color:#fff">概念：上级部门与本部门与下级部门的所有计划的并集减去本部门与下级部门的不巡检范围与部门管理范围的交集。<br/>' +
                        '</span>',
                        onShow: function(){
                            $(this).tooltip('tip').css({
                                backgroundColor: '#666',
                                borderColor: '#666'
                            });
                        }
                    });

                    $(".datagrid-header td[field='taskbeginlocation']").tooltip({
                        position: 'bottom',
                        content: '<span style="color:#fff">概念：上级部门与本部门与下级部门的所有任务的并集减去本部门与下级部门的不巡检范围与部门管理范围的交集。<br/>' +
                        '</span>',
                        onShow: function(){
                            $(this).tooltip('tip').css({
                                backgroundColor: '#666',
                                borderColor: '#666'
                            });
                        }
                    });


				}

				}
		);
		
		if(data.data.data.length > 0){
			var list = data.data.data;
			var unindex = 0;
			var taskindex = 0;
			var lineloopoid = list[0].lineloopoid;
			var unitid = list[0].unitid;
			var unlocation = '';
			var tasklocation = '';
			

			$('#stationfstatisticDatagrid').datagrid('loadData', list);
			var colList = 'unitidname,plancoveragerate,taskcoveragerate';
			mergeCellsByField('stationfstatisticDatagrid', colList);
		}
	}
}

/**
* EasyUI DataGrid根据字段动态合并单元格
* 参数 tableID 要合并table的id
* 参数 colList 要合并的列,用逗号分隔(例如："name,department,office");
*/
function mergeCellsByField(tableID, colList) {
    var ColArray = colList.split(",");
    var tTable = $("#" + tableID);
    var TableRowCnts = tTable.datagrid("getRows").length;
    var tmpA;
    var tmpB;
    var PerTxt = "";
    var CurTxt = "";
    var alertStr = "";
    for (j = ColArray.length - 1; j >= 0; j--) {
        PerTxt = "";
        tmpA = 1;
        tmpB = 0;

        for (i = 0; i <= TableRowCnts; i++) {
            if (i == TableRowCnts) {
                CurTxt = "";
            }
            else {
                CurTxt = tTable.datagrid("getRows")[i][ColArray[j]];
            }
            if (PerTxt == CurTxt) {
                tmpA += 1;
            }
            else {
                tmpB += tmpA;
                
                tTable.datagrid("mergeCells", {
                    index: i - tmpA,
                    field: ColArray[j],　　//合并字段
                    rowspan: tmpA,
                    colspan: null
                });
                tTable.datagrid("mergeCells", { //根据ColArray[j]进行合并
                    index: i - tmpA,
                    field: "unitid",
                    rowspan: tmpA,
                    colspan: null
                });
               
                tmpA = 1;
            }
            PerTxt = CurTxt;
        }
    }
}


/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTreeLocalPer(unitid){
    /* 以下初始化查询面板 */
    /* 部门 */
    $('#'+unitid).combotree({
        panelHeight:150,
        editable:true,
        mode:'remote',
        valueField : "oid",
        textField : "unitName",
        onSelect : function(row){
            /*console.log(row);*/
            $.post(rootPath+'/statisticsform/device/getNavigation.do?parentId='+user.unitId+'&unitId='+row.id,{}, function(result){
                if(result.status = 1){
                    initStack();
                    let data = result.data;
                    for( let i = data.length-1 ; i>= 0 ; i--){
                        let element = {};
                        element.unitId = data[i].oid;
                        element.unitName = '<span class = \'nav-unit\' id = \''+data[i].oid+'\'>'+data[i].unitname+'</span>';
                        addStack(topElement, element);
                    }

                    /* 显示导航栏 */
                    showNavigation( $('#queryCoverage') );
                    $('#queryCoverage').trigger('click');
                }
            })
        }
    });
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        console.log(result);

        $('#'+unitid).combotree('loadData', result.data);
    })
    setComboObjWidth(unitid,0.172,'combobox');
}


/**
 * 显示下级部门统计列表《其实就是给部门标志赋值，然后触发查询事件》
 * @returns
 */
function viewChildren(unitId ,unitName ) {
    /* 得到查询按钮对象 */
    var target = $('#queryCoverage');
    viewChildrenUnit( unitId ,unitName, target );
}

/**
 * @desc 导出查询
 */
function exportQuery(){
    var begindate = $('#begindate').val();
    var unitid = $('#unitId').combobox('getValue');

    var sign = 'select';
    /* 如果unitid为null或者'' 或者undefined，赋值给unitId */
    if(unitid == '' || unitid ==null || unitid == undefined)
        unitId = user.unitId;
    else
        unitId = unitid;
    url = addTokenForUrl(rootPath+"/statisticsform/stationfstatistic/excelWriterForStation.do?unitid="+unitid+"&begindate="+begindate);
    $("#exprotExcelIframe").attr("src", url);
}