
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
/* 初始化栈底元素 */
var topElement = {};
/* 显示导航 */
var navigation = "";
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#120501').menubutton({menu:'#exportBars'}); 
	/*$('#unitId').combotree('setValue', user.unitId);*/
	
	/* 初始化 */
	initStack();
	
	/* 显示导航栏 */
	showNavigation();
	
	addNavigationClick();
	
	$('#gpsPatrolOfficerDatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/statisticsform/patrolofficer/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		pagination:false,
        fitColumns: true,
		frozenColumns:[
			[
		    ]
		],
		columns: 
		[
			[
                {field:'s',title:"管道巡护人员统计",colspan:4,align:'center'},
			],
			[
                {
                    field:"unitName",
                    title:"部门名称",
                    width:"271",
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span title = "'+row.unitName+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildrenUnit(\''+row.unitId+'\',\'\',\''+row.unitName+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitName+'</span>';
                    }
                },
                {
                    field:"total",
                    title:"人员总数",
                    width:"271",
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span title = "'+row.total+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewDevice(\''+row.unitId+'\',\'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.total+'</span>';
                    }

                },
                {
                    field:"normal",
                    title:"巡线工总数",
                    width:"271",
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span title = "'+row.normal+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewDevice(\''+row.unitId+'\',\'01\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.normal+'</span>';
                    }
                },
                {
                    field:"malfunction",
                    title:"管道工总数",
                    width:"300",
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span title = "'+row.malfunction+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewDevice(\''+row.unitId+'\',\'02\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.malfunction+'</span>';
                    }
                }
			]
		],
		onDblClickRow:function(index,indexData){
			// top.getDlg("view_gps_device.html?oid="+indexData.oid,"viewGpsDevice","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsPatrolOfficerDatagrid').datagrid('clearSelections'); //clear selected options
	    },
	    onSelect:function(index,indexData){
			// console.log(indexData.unitId)
		}
	});
	//页面自适应
	initDatagrigHeight('gpsPatrolOfficerDatagrid','queryDiv','100');
	
	
	//$('#gpsPatrolOfficerDatagrid').datagrid('insertRow',{index:0,row :{name:"巡检设备状态统计"}});
	/*initUnitComboTree('unitId');*/
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
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	/*var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_inspector.html?oid="+dataId,"viewGpsInspector","详细",700,500,false,true,true);*/
	
	/*$.post(rootPath+"/statisticsform/device.do",{"unitId":user.unitId},function(data){
		console.log(data);
	});*/
}

/**
 *@desc 导出选中
 */
function exportSelect(){
	// 找到所有被选中行
	var rows = $('#gpsPatrolOfficerDatagrid').datagrid('getSelections');
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
		let unitId = '';
		let unitid = $('#unitId').combobox('getValue');
		/* 如果unitid为null或者'' 或者undefined，赋值给unitId */
		if(unitid == '' || unitid ==null || unitid == undefined)
			unitId = user.unitId;
		else
			unitId = unitid;
		url=addTokenForUrl(rootPath+'/statisticsform/patrolofficer/excelWriterSelect.do?oidList='+idArray+'&unitId='+unitId);
		$("#exprotExcelIframe").attr("src", url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	let unitId = '';
	let sign = 'select';
	let unitid = $('#unitId').combobox('getValue');
	/* 如果unitid为null或者'' 或者undefined，赋值给unitId */
	if(unitid == '' || unitid ==null || unitid == undefined)
		unitId = user.unitId;
	else
		unitId = unitid;
	url=addTokenForUrl(rootPath+'/statisticsform/patrolofficer/excelWriter.do?unitId='+unitId+'&sign='+sign);
	$("#exprotExcelIframe").attr("src", url);
}

/**
 * 弹出人员信息
 * @returns
 */
function viewDevice(unitId , type){
	console.log(unitId+'---'+type);
	top.getDlg("query_gps_inspector.html?stUnitId="+unitId+"&stType="+type,"queryGpsInspectorForThis","详细",800,600,false,true,true);
	
}

/**
 * 显示下级部门统计列表《其实就是给部门标志赋值，然后触发查询事件》
 * @returns
 */
function viewChildrenUnit(unitId , type,unitName){
	/* 点击部门，部门名称和部门id入栈 */
	let element = {};
	element.unitId = unitId;
	element.unitName = '<span class = \'nav-unit\' id = \''+unitId+'\'>'+unitName+'</span>';
	addStack(topElement, element);
	/* 给部门标志赋值，触发查询 */
	$('#unitId').combotree('setValue', unitId);
	$('#queryDevice').trigger('click');
	
	showNavigation();
	
}

/**
 * 鼠标移入变绿色
 * @returns
 */
function changeColorGreen(target){
	target.style.color = 'green';
}
/**
 * 鼠标移入变黑色
 * @returns
 */
function changeColorBlack(target){
	target.style.color = '#1b9af7';
}

/**
 * 构建栈结构
 * @return 栈顶元素
 */
function initStack(){
	/* 部门id初始化为登陆人的部门id */
	topElement.unitId = user.unitId;
	topElement.unitName = '<span class = \'nav-unit\' id = \''+user.unitId+'\'>'+user.unitName+'</span>';
	/* 设置下方元素为null */
	topElement.bottom = null;
	/* 设置顶部元素为null */
	topElement.top = null;
	return topElement;
}

/**
 * 给栈中添加元素
 * @param top 栈顶元素
 * @param element 添加的元素
 * @returns 栈顶元素
 */
function addStack( top, element ){
	/* 如果新来的元素id和栈顶的元素id一样，对不起，不能加入 */
	if(element.unitId != top.unitId){
		top.top = element;
		element.top = null;
		element.bottom = top;
		topElement = element;
	}
	return element;
}

/**
 * 遍历栈中所有元素
 * @returns
 */
function queryStack(top){
    if(top!= null){
        if ( top.top == null ) {
            navigation = top.unitName ;
        } else {
            navigation ='<span class = \'easyui-linkbutton\' style=\'color:#1b9af7;\' > '+top.unitName+'</span>'+' > '+navigation;
        }
        queryStack(top.bottom);
    }
	
}

/**
 * 显示导航栏
 * @returns
 */
function showNavigation(){
	/* 清空 */
	navigation = '';
	/* 查询栈中元素 */
	queryStack(topElement );
	console.log('导航栏：'+navigation.substring(0,navigation.lastIndexOf('>')));
	$('#localHost').html(navigation);
	
	addNavigationClick();
}

/**
 * 删除元素
 * @param top 栈顶元素
 * @param elementId 需要删除的栈元素的id值
 */
function deleteStack(top ,elementId){
	if(top != null){
		if(top.unitId == elementId ){
			top.top = null;
			topElement = top ;
			return topElement;
		}else{
			deleteStack(top.bottom, elementId);
		}
			
	}else{
		console.log('error,需要删除的元素，在栈中并不存在.');
	}
	
}

function addNavigationClick(){
	/* 导航栏点击事件，删除栈内元素 */
	$('.nav-unit').on('click',function(){
		/* 获取导航中点击的id */
		let id = $(this).attr('id');
		
		/* 给部门标志赋值，触发查询 */
		$('#unitId').combotree('setValue', id);
		$('#queryDevice').trigger('click');
		
		deleteStack(topElement, id);
		/* 显示导航栏 */
		showNavigation();
		
		
	})
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
					showNavigation();
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

