
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
//获取当前日期
var nowDate = getNowDate();
var querySerialize=null;	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#statisticsdate').val(nowDate);
	$('#statisticsdatequery').val(nowDate);

	//打开一级报表
	initOneDatagrid();
	
	//页面自适应
	initDatagrigHeight('gpsdayworkdatagrid','queryDiv','100');
	
	/* 以下初始化查询面板 */
	initUnitComboTree('unitid');
	initLocaUser('inspectors');
});

//打开一级报表
function initOneDatagrid(){
	querySerialize={statisticsdate:$('#statisticsdate').val(),inspectortype:'01',unitid:$('#unitid').val()};
	$('#gpsdayworkdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinsdaywork/getPerPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		singleSelect:true,
		pagination:false,
		queryParams:querySerialize,
		frozenColumns:[[
			{	
				field:"unitname",
				title:"部门名称",
				width:$(this).width() * 0.1,
				resizable:true,
				align:'center'
			},{	
				field:"inspectorName",
				title:"巡检人员",
				width:$(this).width() * 0.08,
				resizable:true,
				align:'center',
				/*formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a href="#" title = "" onclick="nextLevel(\'' + row.inspectorid+'\')">\
					<span>'+value+'</span>\
					</a></p>';
					return value;
				}*/
			},{	
				field:"statisticsdate",
				title:"统计日期",
				width:$(this).width() * 0.05,
				resizable:true,
				align:'center'
			},{
				field:"vacation",
				title:"是否请假",
				width:$(this).width() * 0.05,
				resizable:true,
				align:'center'
			},{
				field:"exception",
				title:"是否例外",
				width:$(this).width() * 0.05,
				resizable:true,
				align:'center'
			}
			]],
			columns: 
				[[
					{	
						field:"devCode",
						title:"设备编号",
						width:$(this).width() * 0.06,
						resizable:true,
						rowspan:2,
						align:'center'
					},
					{	
						field:"range",
						title:"巡检范围",
						width:$(this).width() * 0.07,
						resizable:true,
						colspan:1,
						align:'center',
						formatter: function(value,row,index){
							if(value == null || value == "" ) {
			    				return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			    			}else{
			    				return '<span title="'+value.replace(/;/g, ';<br>')+'"  class="tip tooltip-f">' +value.replace(/;/g, ';<br>')+'</span>';
			    			}
						}
					},{	
						field:"linelength",
						title:"巡线里程（KM）",
						width:$(this).width() * 0.08,
						resizable:true,
						rowspan:2,
						align:'center',
                        formatter: function(value,row,index){
                            return '<span title="'+Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">'+Math.round((value/1000)*100)/100+'</span>'; 
                        }
					},{
						field:"inspectionTime",
						title:"巡检用时",
						width:$(this).width() * 0.05,
						resizable:true,
						rowspan:2,
						align:'center',
						formatter: function(value,row,index){
							if( value == null )
								return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
							return '<span title="'+formatSeconds(value)+'"  class="tip tooltip-f">'+formatSeconds(value)+'</span>';
						}
					},{
						field:"assessscore",
						title:"巡检分数",
						width:$(this).width() * 0.05,
						resizable:true,
						rowspan:2,
						align:'center',
						formatter: function(value,row,index){
							/* 2.0 表示标准轨迹线为NULL*/
							if( value == null )
								return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
							return '<span title="'+Math.round(value*10000)/100+'"  class="tip tooltip-f">'+Math.round(value*10000)/100+'</span>';
						}
					},{
						field:"keypoint",
						title:"关键点",
						width:$(this).width() * 0.2,
						resizable:true,
						colspan:5,
						align:'center'
					}
					],[
						{	
							field:"beginlocation",
							title:"起止位置",
							width:$(this).width() * 0.08,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								if(value == null || value == "" ) {
				    				return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
				    			}else{
				    				return '<span title="'+value.replace(/;/g, ';<br>')+'"  class="tip tooltip-f">' +value.replace(/;/g, ';<br>')+'</span>';
				    			}
							}
						},{
							field:"ykeypointnum",
							title:"应巡关键点",
							width:$(this).width() * 0.05,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								if(row.ykeypointnum == 0)
									return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
								else
									return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
							}
						},{	
							field:"skeypointnum",
							title:"实巡关键点",
							width:$(this).width() * 0.05,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								if(row.ykeypointnum == 0)
									return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
								else
									return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
							}
						},{	
							field:"ytemporarykeypointnum",
							title:"应巡临时关键点",
							width:$(this).width() * 0.06,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								if(row.ytemporarykeypointnum == 0)
									return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
								else
									return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
							}
						},{	
							field:"stemporarykeypointnum",
							title:"实巡临时关键点",
							width:$(this).width() * 0.06,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								if(row.ytemporarykeypointnum == 0)
									return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
								else
									return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
							}
						},{	
							field:"pathlinerate",
							title:"轨迹线匹配度（%）",
							width:$(this).width() * 0.1,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								/* 2.0 表示标准轨迹线为NULL*/
								if( value == null )
									return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
								return '<span title="'+value*100+'"  class="tip tooltip-f">'+Math.round(value*10000)/100+'</span>';
							}
						}
						]
				],
				onDblClickRow:function(index,indexData){
				},
				onLoadSuccess:function(data){
					$('#gpsdayworkdatagrid').datagrid('clearSelections'); //clear selected options，

                    $(".datagrid-header td[field='ykeypointnum']").tooltip({
                        position: 'bottom',
                        content: '<span style="color:#fff">注意点：如果是多天一巡，则只有最后一天才算关键点数量。<br/>' +
                        '</span>',
                        onShow: function(){
                            $(this).tooltip('tip').css({
                                backgroundColor: '#666',
                                borderColor: '#666'
                            });
                        }
                    });

                    $(".datagrid-header td[field='ytemporarykeypointnum']").tooltip({
                        position: 'bottom',
                        content: '<span style="color:#fff">注意点：如果是多天一巡，则只有最后一天才算关键点数量。<br/>' +
                        '</span>',
                        onShow: function(){
                            $(this).tooltip('tip').css({
                                backgroundColor: '#666',
                                borderColor: '#666'
                            });
                        }
                    });

                    $(".datagrid-header td[field='assessscore']").tooltip({
                        position: 'bottom',
                        content: '<span style="color:#fff">概念：三种分数的综合分数。<br/>' +
                        '1、如果有日常任务和临时任务以及标准轨迹线，则分数组成为 日常关键点分数*0.9 + 临时关键点*0.1 <br/>' +
                        '2、如果只有日常任务和标准轨迹线，则分数组成为日常关键点分数<br/>' +
                        '3、如果只有日常任务，则分数即是日常任务的分数<br/>' +
                        '4、如果只有临时任务，则分数也就是临时任务的分数</span>',
                        onShow: function(){
                            $(this).tooltip('tip').css({
                                backgroundColor: '#666',
                                borderColor: '#666'
                            });
                        }
                    });

				}
	});
}

//返回上一级
function goback(){
	$('#inspectorid').val("")
	initOneDatagrid();
}

//导出
function exportQuery(){
    querySerialize={inspectorid:inspectorid,statisticsdate:$('#statisticsdate').val(),inspectortype:'01',unitid:$('#unitid').val(),statisticsdatequery:$('#statisticsdatequery').val()};
	showLoadingMessage("正在导出数据，请稍后。。。");
	var inspectorid = '';
	var unitid = '';
	if(querySerialize.inspectorid != null && querySerialize.inspectorid != undefined && querySerialize.inspectorid  != '') {
        inspectorid = querySerialize.inspectorid;
	}
	if(querySerialize.unitid != null && querySerialize.unitid != undefined && querySerialize.unitid  != '') {
        unitid = querySerialize.unitid;
	}
	if(querySerialize != null){
		url=addTokenForUrl(rootPath+'/gpsinsdaywork/exportToExcelActionPer.do?inspectorid='+inspectorid+"&unitid="+unitid+"&statisticsdate="+querySerialize.statisticsdate+"&inspectortype="+querySerialize.inspectortype+"&statisticsdatequery="+querySerialize.statisticsdatequery);
		$("#exprotExcelIframe").attr("src", url);
		hiddenLoadingMessage();
	}
}

//查看下一级
function nextLevel(inspectorid){
	$('#inspectorid').val(inspectorid)
	querySerialize={inspectorid:inspectorid,statisticsdate:$('#statisticsdate').val(),inspectortype:'01',unitid:$('#unitid').val(),statisticsdatequery:$('#statisticsdatequery').val()};
	$('#gpsdayworkdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinsdaywork/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		singleSelect:true,
		pagination:false,
		queryParams:querySerialize,
		frozenColumns:[[
			{	
				field:"unitname",
				title:"部门名称",
				width:"100",
				resizable:true,
				align:'center'
			},{	
				field:"inspectorName",
				title:"巡检人员",
				width:"100",
				resizable:true,
				align:'center'
			},{	
				field:"statisticsdate",
				title:"巡检日期",
				width:"100",
				resizable:true,
				align:'center'
			}
			]],
			columns: 
				[[
					{	
						field:"devCode",
						title:"设备编号",
						width:"150",
						resizable:true,
						rowspan:2,
						align:'center'
					},
					{	
						field:"range",
						title:"巡检范围",
						width:"200",
						resizable:true,
						colspan:1,
						align:'center'
					},{	
						field:"linelength",
						title:"巡线里程（KM）",
						width:"120",
						resizable:true,
						rowspan:1,
						align:'center'
					},{	
						field:"keypoint",
						title:"关键点",
						width:"250",
						resizable:true,
						colspan:5,
						align:'center'
					},{
						field:"assessscore",
						title:"巡检分数",
						width:"100",
						resizable:true,
						rowspan:2,
						align:'center',
                        formatter: function(value,row,index){
                            /* 2.0 表示标准轨迹线为NULL*/
                            if( value == null )
                                return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
                            return '<span title="'+value*100+'"  class="tip tooltip-f">'+value*100+'</span>';
                        }
					}
					],[
						{	
							field:"beginlocation",
							title:"起止位置",
							width:"200",
							resizable:true,
							align:'center'
						},{
							field:"ykeypointnum",
							title:"应巡关键点",
							width:"120",
							resizable:true,
							align:'center'
						},{	
							field:"skeypointnum",
							title:"实巡关键点",
							width:"120",
							resizable:true,
							align:'center'
						},{	
							field:"ytemporarykeypointnum",
							title:"应巡临时关键点",
							width:"120",
							resizable:true,
							align:'center'
						},{	
							field:"stemporarykeypointnum",
							title:"实巡临时关键点",
							width:"120",
							resizable:true,
							align:'center'
						},{	
							field:"pathlinerate",
							title:"轨迹线匹配度（%）",
							width:"120",
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								/* 2.0 表示标准轨迹线为NULL*/
								if( value == null )
									return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
								return '<span title="'+value*100+'"  class="tip tooltip-f">'+value*100+'</span>';
							}
						}
						]
				],
				onDblClickRow:function(index,indexData){
				},
				onLoadSuccess:function(data){
					$('#gpsdayworkdatagrid').datagrid('clearSelections'); //clear selected options
				}
	});
}

function queryInspdayDatagrid(queryformID){
	querySerialize =$('#queryForm').serializeToJson();
	if(querySerialize.inspectors != "" && querySerialize.inspectors !=null && querySerialize.inspectors != "undefined"   && querySerialize.inspectors != undefined){
		querySerialize.inspectors = querySerialize.inspectors.toString();
	}
	encodeURI(querySerialize);
	querySerialize.pageNumber = 1;
	$('#gpsdayworkdatagrid').datagrid('options').queryParams= querySerialize;
	$('#gpsdayworkdatagrid').datagrid('load');
}
//清除
function clearQueryForm() {
	// $('#statisticsdate').val(nowDate);
	$('#statisticsdatequery').val("");
	$('#statisticsdate').val("");
	$('#inspectors').combobox('setValue',"");
	$("#queryForm select").each(function() {
		try{
			$(this).combotree("clear");
		}catch(e){
			$(this).val("");
		}
	});
}
/* 初始化人员 */
function initLocaUser( inspectors ){
    /* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
    $('#'+inspectors).combobox({
        panelHeight:150,
        editable:true,
        mode:'remote',
        multiple:true,
        url : rootPath+'/xncommon/getAllUnitInspector.do?unitId='+user.unitId,
        valueField : "codeid",
        textField : "codename",
        onSelect : function(row){
        }
    });
    setComboObjWidth(inspectors,0.145,'combobox');
}



/**
 * 获取当前日期
 * @returns
 */
function getNowDate(){
    var today=new Date();
    var t=today.getTime()-1000*60*60*24;
    var yesterday=new Date(t);
	return yesterday.format("yyyy-MM-dd");
}

/**
 * 
 * 判断传入值是否小于10，小于10补0
 */
function p(s) {
    return s < 10 ? '0' + s: s;
}