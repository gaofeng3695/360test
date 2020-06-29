
function getNowDate(){
    var today=new Date();
    return today.format("yyyy-MM-dd");
}
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
		$('#14010201').menubutton({menu:'#exportBars'});
	   initUnitComboTreeLocalPer('unitId');
		initdatagrid();
		$('#gpsomitmissrecorddatagrid').unbind('mouseover');
		query();
		$('#createdate').val(getNowDate());
	    /* 初始化 */
	    initStack();

	    /* 显示导航栏 */
	    showNavigation( $('#queryCoverage') );

	    addNavigationClick( $('#queryCoverage') );
});

function initdatagrid(){
	$('#gpsomitmissrecorddatagrid').datagrid({
		idField:'unitid',
		//url: rootPath+"/gpsunitpointcount/getStationstatistic.do?unitid="+unitid,
		collapsible:true,
		autoRowHeight: false,
		rownumbers:false,
		striped:false,
		nowrap:true,
		fitColumns: true,
		pagination:false,
		rowStyler: function (index, row) {
			return 'background-color:white;';
		},
		columns:[[
			{	
				field:"unitName",
				title:"部门名称",
				width:$(this).width() * 0.2,
				resizable:true,
				sortable:true,
				align:'center',
				formatter: function(value,row,index){
					return '<span title="'+row.unitName+'"  onclick=\"viewChildren(\''+row.unitid+'\',\''+row.unitName+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitName+'</span>';
				}
			},
			{	
				field:"inspUnCompNum",
				title:"预警人数",
				width:$(this).width() * 0.2,
				resizable:true,
				align:'center',
			},{	
				field:"ykeypointnum",
				title:"关键点总数量",
				width:$(this).width() * 0.2,
				resizable:true,
				align:'center'
			},{	
				field:"skeypointnum",
				title:"实巡关键点数量",
				width:$(this).width() * 0.2,
				resizable:true,
				align:'center'
			},{	
				field:"wkeypointnum",
				title:"未巡关键点数量",
				width:$(this).width() * 0.2,
				resizable:true,
				align:'center'
			}
		]],
		onDblClickRow:function(index,indexData){
		},
		onLoadSuccess:function(data){
	    	var s= $("#gpsomitmissrecorddatagrid").datagrid('getPanel');
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
	initDatagrigHeight('gpsomitmissrecorddatagrid','queryDiv',100);  
}

function setDatagrid(data){
	if(data.data.flag == 1){
		$('#gpsomitmissrecorddatagrid').datagrid(
			{columns:[[
				{	
					field:"unitName",
					title:"部门名称",
					width:$(this).width() * 0.2,
					resizable:true,
					sortable:true,
					align:'center',
					formatter: function(value,row,index){
							var opt = '<p class="table-operate"><a href="#" title = "" onclick="viewChildren(\'' + row.unitid+'\',\'' + row.unitName+'\')">\
							<span>'+value+'</span>\
							</a></p>';
							return opt;
					}
				},
				{	
					field:"inspUnCompNum",
					title:"预警人数",
					width:$(this).width() * 0.2,
					resizable:true,
					align:'center',
				},{	
					field:"ykeypointnum",
					title:"关键点总数量",
					width:$(this).width() * 0.2,
					resizable:true,
					align:'center'
				},{	
					field:"skeypointnum",
					title:"实巡关键点数量",
					width:$(this).width() * 0.2,
					resizable:true,
					align:'center'
				},{	
					field:"wkeypointnum",
					title:"未巡关键点数量",
					width:$(this).width() * 0.2,
					resizable:true,
					align:'center'
				}
			]]
			}
		);
		$('#gpsomitmissrecorddatagrid').datagrid('loadData', data.data.data); 
	}else if(data.data.flag == 0){
		$('#gpsomitmissrecorddatagrid').datagrid(
			{
				columns : [
					[{
						field:"unitname",
			    		title:"部门名称",
			    		width:$(this).width() * 0.15,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
					},{
						field:"inspectorname",
			    		title:"巡检人",
			    		width:$(this).width() * 0.1,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
					},{
						field:"insbdate",
			    		title:"任务开始日期",
			    		width:$(this).width() * 0.1,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
					},{
						field:"insedate",
			    		title:"任务结束日期",
			    		width:$(this).width() * 0.1,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
					},{
						field:"warntime",
			    		title:"预警设置时间",
			    		width:$(this).width() * 0.12,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
					},{
						field:"warnstatusName",
			    		title:"预警状态",
			    		width:$(this).width() * 0.08,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
					},
					{
						field:"warncontent",
			    		title:"预警内容",
			    		width:$(this).width() * 0.12,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
				    		if( value == null ){
			                    return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
							}else{
								return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
							}
			    		}
					},{
						field:"warnsendtime",
			    		title:"预警发送时间",
			    		width:$(this).width() * 0.12,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
			    		formatter: function(value,row,index){
				    		if( value == null ){
			                    return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
							}else{
								return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
							}
			    		}
					},{
						field:"pointnum",
			    		title:"未巡关键点预警值",
			    		width:$(this).width() * 0.08,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
					},{
						field:"wpointnum",
			    		title:"未巡关键点实际值",
			    		width:$(this).width() * 0.08,
			    		resizable:true,
		    			sortable:false,
			    		align:'center',
					}]
					
				],
			}	
		);
		$('#gpsomitmissrecorddatagrid').datagrid('loadData', data.data.data);
	}
}
function query(){

	var unitid = $('#unitId').combobox('getValue');
	var createdate = $('#createdate').val();
	$.ajax({
		url: rootPath+"/gpsunitpointcount/getStationstatistic.do?unitid="+unitid+"&createdate="+createdate,
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		success: function(data){
			if(data.status==1){
				/*if(data.data.data == null || data.data.data.length == 0){
					$('#gpsomitmissrecorddatagrid').datagrid('loadData', { total: 0, rows: [] });
				}else{
					setDatagrid(data);
				}*/
				setDatagrid(data);
				initDatagrigHeight('gpsomitmissrecorddatagrid','queryDiv',100);  
			}else if(data.code == "400") {
				top.showAlert("提示", "查询出错", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
}

function clearLocalQuery() {
	$("#createdate").val('');

    $("#queryForm select").each(function() {
        try{
            $(this).combotree("clear");
        }catch(e){
            $(this).val("");
        }
    });
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
    var unitid = $('#unitId').combobox('getValue');
    var createdate = $('#createdate').val();

    var sign = 'select';
    /* 如果unitid为null或者'' 或者undefined，赋值给unitId */
    if(unitid == '' || unitid ==null || unitid == undefined){
        unitId = user.unitId;
    }else{
        unitId = unitid;
    }
    url = addTokenForUrl(rootPath+"/gpsunitpointcount/excelWriterForStation.do?unitid="+unitid+"&createdate="+createdate);
    $("#exprotExcelIframe").attr("src", url);
}
