
/* 初始化栈底元素 */
var topElement = {};
/* 显示导航 */
var navigation = "";
var user = JSON.parse(sessionStorage.user);
var nowDate = getNowDate();

$(document).ready(function(){
    $('#statisticDate').val(nowDate);
	initUnitComboTreeLocal('unitId');
	initdatagrid();
	query();
	$('#stationfstatisticDatagrid').unbind('mouseover');
	
	/* 初始化 */
	initStack();

	/* 显示导航栏 */
	showNavigation();
	
	addNavigationClick();
});

function initUnitComboTreeLocal(unitid){
	/* 以下初始化查询面板 */
	/* 部门 */
	$('#'+unitid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName"
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		
		$('#'+unitid).combotree('loadData', result.data);
	})
    setComboObjWidth(unitid,0.172,'combobox');
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

/**
 *  初始化表格
 */
function initdatagrid(){
	$('#stationfstatisticDatagrid').datagrid({
		idField:'unitid',
//		url: rootPath+"/gpsinspector/getPage.do?unitid="+stUnitId+"&inspectortype="+stType,
		collapsible:true,
		autoRowHeight: false,
        fitColumns: true,
		rownumbers:false,
		striped:false,
		nowrap:false,
		/*fitColumns: true,*/
		pagination:false,
		rowStyler: function (index, row) {
			return 'background-color:white;';
		},
		columns: [

		],
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
    showLoadingMessage("正在加载数据...");
//	var date = $('#statisticdate').val();
	var unitid = $('#unitId').combobox('getValue');
	var date =$('#statisticDate').val();
	$.ajax({
		url : rootPath+"statisticsform/patrolunitstatistic/getStatistic.do?unitid="+unitid+"&date="+date,
		type: "post",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		success: function(data){
            hiddenLoadingMessage();
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

function setDatagrid(data){
	if(data.data.flag == 1){ // 分公司
		$('#stationfstatisticDatagrid').datagrid({
			columns: [
				[{	
					field:"unitName",
		    		title:"部门名称",
		    		width:$(this).width() * 0.19,
		    		resizable:true,
	    			sortable:false,
	    			rowspan:2,
		    		align:'center',
		    		formatter: function(value,row,index){
	                    /* 得到部门id和字段名称  */
	                    return '<span title = "'+row.unitName+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildrenUnit(\''+row.unitId+'\',\'\',\''+row.unitName+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitName+'</span>';
	                }
		    	},
		    	{	
					field:"lineLoopLength",
		    		title:"管线长度（KM）",
		    		width:$(this).width() * 0.15,
		    		resizable:true,
		    		rowspan:2,
	    			sortable:false,
		    		align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">' +Math.round((value/1000)*100)/100+'</span>';
                    }
		    	},
		    	{	
		    		field:"unPatrolRangeLength",
		    		title:"不巡检范围长度（KM）",
		    		width:$(this).width() * 0.15,
		    		resizable:true,
		    		rowspan:2,
		    		sortable:false,
		    		align:'center',
                    formatter: function(value,row,index){
                    	return '<span title="' +Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">' +Math.round((value/1000)*100)/100+'</span>';
                    }
		    	},
		    	{	
		    		field:"planLength",
		    		title:"巡检计划长度（KM）",
		    		width:$(this).width() * 0.15,
		    		resizable:true,
		    		rowspan:2,
		    		sortable:false,
		    		align:'center',
                    formatter: function(value,row,index){
                    	return '<span title="' +Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">' +Math.round((value/1000)*100)/100+'</span>';
                    }
		    	},
		    	{	
		    		field:"taskLength",
		    		title:"巡检任务长度（KM）",
		    		width:$(this).width() * 0.15,
		    		resizable:true,
		    		rowspan:2,
		    		sortable:false,
		    		align:'center',
                    formatter: function(value,row,index){
                    	return '<span title="' +Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">' +Math.round((value/1000)*100)/100+'</span>';
                    }
		    	},
		    	{	
		    		field:"keypoint",
		    		title:"任务关键点数目",
		    		width:$(this).width() * 0.1,
		    		resizable:true,
		    		colspan:2,
		    		sortable:false,
		    		align:'center'
		    	}],
				[{	
					field:"keypointCount",
		    		title:"日常任务关键点",
		    		width:$(this).width() * 0.1,
		    		resizable:true,
	    			sortable:false,
		    		align:'center'
		    	},
		    	{	
					field:"tempKeypointCount",
		    		title:"临时任务关键点",
		    		width:$(this).width() * 0.1,
		    		resizable:true,
	    			sortable:false,
		    		align:'center'
		    	}]
			],
            onLoadSuccess:function(data){
                $(".datagrid-header td[field='lineLoopLength']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门所有管线的总长度。<br/>' +
                    '</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });

                $(".datagrid-header td[field='unPatrolRangeLength']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门以及下级部门所有不巡检范围并集的总长度。<br/>' +
                    '</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });

                $(".datagrid-header td[field='planLength']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门以及下级部门所有巡检计划并集的总长度。<br/>' +
                    '</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });

                $(".datagrid-header td[field='taskLength']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门以及下级部门所有巡检任务并集的总长度。<br/>' +
                    '</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });

                $(".datagrid-header td[field='keypointCount']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门以及下级部门所有巡检任务的所有任务关键点。<br/>' +
                    '注意点：如果是多天一巡，则是巡检的最后一天算关键点数量。</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });

                $(".datagrid-header td[field='tempKeypointCount']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门以及下级部门所有巡检临时任务的所有临时任务关键点。<br/>' +
                    '注意点：如果是多天一巡，则是巡检的最后一天算临时关键点数量。</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });

			}
		});
		if(data.data.data.length > 0){
			var list = data.data.data;
			$('#stationfstatisticDatagrid').datagrid('loadData', list);
		}
	}else if(data.data.flag == 0){//大站、小站
		$('#stationfstatisticDatagrid').datagrid({
			columns:
				[[
                    {
                        field:"unitName",
                        title:"部门名称",
                        width:$(this).width() * 0.14,
                        resizable:true,
                        sortable:false,
                        align:'center',
                        formatter: function(value,row,index){
                            /* 得到部门id和字段名称  */
                            return '<span title = "'+row.unitName+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildrenUnit(\''+row.unitId+'\',\'\',\''+row.unitName+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitName+'</span>';
                        }
                    },
					{
						field:"lineLoopName",
						title:"管线名称",
						width:$(this).width() * 0.125,
						resizable:true,
						sortable:false,
						align:'center'
					},
					{
						field:"lineLoopLength",
						title:"管线长度（KM）",
						width:$(this).width() * 0.125,
						resizable:true,
						sortable:false,
						align:'center',
						formatter: function(value,row,index){
							 return '<span title="' +Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">' +Math.round((value/1000)*100)/100+'</span>';
						}
					},
					{
						field:"unPatrolPosition",
						title:"不巡检起止位置",
						width:$(this).width() * 0.125,
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
						field:"planPosition",
						title:"计划起止位置",
						width:$(this).width() * 0.125,
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
						field:"taskPosition",
						title:"任务起止位置",
						width:$(this).width() * 0.125,
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
						field:"keypointCount",
						title:"日常任务关键点",
						width:$(this).width() * 0.125,
						resizable:true,
						sortable:false,
						align:'center'
					},
					{
						field:"tempKeypointCount",
						title:"临时任务关键点",
						width:$(this).width() * 0.125,
						resizable:true,
						sortable:false,
						align:'center'
					}
			]],
            onLoadSuccess:function(data){
                $(".datagrid-header td[field='lineLoopLength']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门以及下级部门所有管线的总长度。<br/>' +
                    '</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });

                $(".datagrid-header td[field='unPatrolPosition']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门以及下级部门所有不巡检范围并集。<br/>' +
                    '</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });

                $(".datagrid-header td[field='planPosition']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门以及下级部门所有巡检计划并集。<br/>' +
                    '</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });

                $(".datagrid-header td[field='taskPosition']").tooltip({
                    position: 'bottom',
                    content: '<span style="color:#fff">概念：本部门以及下级部门所有巡检任务并集。<br/>' +
                    '</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });


            }
		});
		
		if(data.data.data.length > 0){
			var list = data.data.data;

			$('#stationfstatisticDatagrid').datagrid('loadData', list);
			var colList = 'unitName';
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
    var PerTxt = -1;
    var CurTxt = -1;
    var alertStr = "";
    for (j = ColArray.length - 1; j >= 0; j--) {
        PerTxt = -1;
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
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 *
 * @param num1加数1 | num2加数2
 */
function numAdd(num1, num2) {
	 var baseNum, baseNum1, baseNum2;
	 try {
	  baseNum1 = num1.toString().split(".")[1].length;
	 } catch (e) {
	  baseNum1 = 0;
	 }
	 try {
	  baseNum2 = num2.toString().split(".")[1].length;
	 } catch (e) {
	  baseNum2 = 0;
	 }
	 baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	 return (num1 * baseNum + num2 * baseNum) / baseNum;
};
/**
 * 加法运算，避免数据相减小数点后产生多位数和计算精度损失。
 *
 * @param num1被减数  |  num2减数
 */
function numSub(num1, num2) {
	 var baseNum, baseNum1, baseNum2;
	 var precision;// 精度
	 try {
	  baseNum1 = num1.toString().split(".")[1].length;
	 } catch (e) {
	  baseNum1 = 0;
	 }
	 try {
	  baseNum2 = num2.toString().split(".")[1].length;
	 } catch (e) {
	  baseNum2 = 0;
	 }
	 baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	 precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
	 return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};

/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 *
 * @param num1被除数 | num2除数
 */
function numDiv(num1, num2) {
	 var baseNum1 = 0, baseNum2 = 0;
	 var baseNum3, baseNum4;
	 try {
	  baseNum1 = num1.toString().split(".")[1].length;
	 } catch (e) {
	  baseNum1 = 0;
	 }
	 try {
	  baseNum2 = num2.toString().split(".")[1].length;
	 } catch (e) {
	  baseNum2 = 0;
	 }
	 with (Math) {
	  baseNum3 = Number(num1.toString().replace(".", ""));
	  baseNum4 = Number(num2.toString().replace(".", ""));
//	  return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
	  return numMulti((baseNum3 / baseNum4), pow(10, baseNum2 - baseNum1));
	 }
};
/** 
* 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。 
* 
* @param num1被乘数 | num2乘数 
*/ 
function numMulti(num1, num2) { 
	var baseNum = 0; 
	try { 
	baseNum += num1.toString().split(".")[1].length; 
	} catch (e) { 
	} 
	try { 
	baseNum += num2.toString().split(".")[1].length; 
	} catch (e) { 
	} 
	return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum); 
}; 

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
 * @desc 导出查询
 */
function exportQuery(){
//	var date = $('#statisticdate').val();
    var unitid = $('#unitId').combobox('getValue');
    var date =$('#statisticDate').val();

    url = addTokenForUrl(rootPath+"statisticsform/patrolunitstatistic/excelWriterForStation.do?unitid="+unitid+"&date="+date);
    $("#exprotExcelIframe").attr("src", url);

}