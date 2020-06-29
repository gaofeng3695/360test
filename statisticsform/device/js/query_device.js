
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
	$('#120401').menubutton({menu:'#exportBars'}); 
	/*$('#unitId').combotree('setValue', user.unitId);*/
	
	/* 初始化 */
	initStack();
	
	/* 显示导航栏 */
	showNavigation( $('#queryDevice') );
	
	addNavigationClick( $('#queryDevice') );
	
	$('#gpsDeviceDatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/statisticsform/device/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		pagination:false,
        fitColumns: true,
        frozenColumns:[

			[
	           /* {field:'ck',checkbox:true},*/


		    ]
		],
		columns: 
		[
		    [
                {field:'s',title:"巡检设备统计",colspan:6,align:'center'},
            ],
            [
                {
                    field:"unitName",
                    title:"部门名称",
                    width:"200",
                    rowspan: 2,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span title = "'+row.unitName+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildren(\''+row.unitId+'\',\''+row.unitName+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitName+'</span>';
                    }
                },
                {
                    field:"total",
                    title:"总数",
                    width:"100",
                    rowspan: 2,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span title = "'+row.total+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewDevice(\''+row.unitId+'\',\'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.total+'</span>';
                    }

                },
                {field:'s',title:"未分配设备",colspan:2,width:400,align:'center'},
                {
                    field:"idn",
                    title:"巡线工设备数",
                    width:"200",
                    rowspan: 2,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span title = "'+row.idn+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewDevice(\''+row.unitId+'\',\'01\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.idn+'</span>';
                    }
                },
                {
                    field:"mnd",
                    title:"管道工设备数",
                    width:"200",
                    rowspan: 2,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span  title = "'+row.mnd+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewDevice(\''+row.unitId+'\',\'02\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.mnd+'</span>';
                    }
                }

            ],
			[

				{
					field:"nnd",
					title:"正常设备数",
					width:"200",
					resizable:true,
					sortable:false,
					align:'center',
					formatter: function(value,row,index){
						/* 得到部门id和字段名称  */
						return '<span title = "'+row.nnd+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewDevice(\''+row.unitId+'\',\'03\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.nnd+'</span>';
					}
				},
				{
					field:"nmd",
					title:"故障设备数",
					width:"200",
					resizable:true,
					sortable:false,
					align:'center',
					formatter: function(value,row,index){
						/* 得到部门id和字段名称  */
						return '<span title = "'+row.nmd+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewDevice(\''+row.unitId+'\',\'04\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.nmd+'</span>';
					}
				}
            ]
		],
		onLoadSuccess:function(data){
	    	$('#gpsDeviceDatagrid').datagrid('clearSelections'); //clear selected options
	    },
	});
	//页面自适应
	initDatagrigHeight('gpsDeviceDatagrid','queryDiv','100');
	
	//$('#gpsDeviceDatagrid').datagrid('insertRow',{index:0,row :{name:"巡检设备状态统计"}});
    initUnitComboTreeLocal('unitId');
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
 *@desc 导出选中
 */
function exportSelect(){
	// 找到所有被选中行
	var rows = $('#gpsDeviceDatagrid').datagrid('getSelections');
	var idArray = [];
	var url="";
	if(rows.length<1){
		$.messager.alert('提示','未选中数据','info');
		return;
	}
	// 遍历取得所有被选中记录的id
	$(rows).each(function(i,obj){
		idArray.push(obj.unitId);
	});
	if(!isNull(idArray)){
        var unitId = '';
        var unitid = $('#unitId').combobox('getValue');
		/* 如果unitid为null或者'' 或者undefined，赋值给unitId */
		if(unitid == '' || unitid ==null || unitid == undefined)
			unitId = user.unitId;
		else
			unitId = unitid;
		url=addTokenForUrl(rootPath+'/statisticsform/device/excelWriterSelect.do?oidList='+idArray+'&unitId='+unitId);
		$("#exprotExcelIframe").attr("src", url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery() {
	var unitId = '';
    var sign = 'select';
    var unitid = $('#unitId').combobox('getValue');
	/* 如果unitid为null或者'' 或者undefined，赋值给unitId */
	if(unitid == '' || unitid ==null || unitid == undefined)
		unitId = user.unitId;
	else
		unitId = unitid;
	url=addTokenForUrl(rootPath+'/statisticsform/device/excelWriter.do?unitId='+unitId+'&sign='+sign);
	$("#exprotExcelIframe").attr("src", url);
}

/**
 * 弹出设备框
 * @returns
 */
function viewDevice(unitId , type){
	top.getDlg("query_gps_device.html?stUnitId="+unitId+"&stType="+type,"queryGpsDeviceForThis","详细",800,600,false,true,true);
	
}

/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTreeLocal(unitid){
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
					showNavigation( $('#queryDevice') );
					$('#queryDevice').trigger('click');
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
	var target = $('#queryDevice');
    viewChildrenUnit( unitId ,unitName, target );
}
