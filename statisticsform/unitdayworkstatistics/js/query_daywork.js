
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

    /* 初始化 */
    initStack();

    /* 显示导航栏 */
    showNavigation( $('#queryUnit') );

    addNavigationClick( $('#queryUnit') );

	$('#startdate').val(nowDate);
	$('#enddate').val(nowDate);

	//打开一级报表
	initOneDatagrid();
	
	//页面自适应
	initDatagrigHeight('gpsdayworkdatagrid','queryDiv','100');
	
	/* 以下初始化查询面板 */
    initUnitComboTreeLocal('unitId');
});

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
                    showNavigation( $('#queryUnit') );
                    $('#queryUnit').trigger('click');
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
    var target = $('#queryUnit');
    viewChildrenUnit( unitId ,unitName, target );
}

//打开一级报表
function initOneDatagrid(){
	querySerialize={startdate:$('#startdate').val(),inspectortype:'01'};
	$('#gpsdayworkdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsunitdaywork/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		singleSelect:true,
		pagination:false,
        fitColumns: true,
		queryParams:querySerialize,
		frozenColumns:[

			],
			columns: 
				[
                    [
                        {field:'s',title:"部门工作统计（巡线工）",colspan:9,align:'center'},
                    ],
                    [
                        {
                            field:"statisticsdate",
                            title:"统计日期",
                            width:$(this).width() * 0.1,
                            rowspan: 2,
                            resizable:true,
                            align:'center'
                        },
                        {
                            field:"unitname",
                            title:"部门名称",
                            width:$(this).width() * 0.1,
                            rowspan: 2,
                            resizable:true,
                            align:'center',
                            formatter: function(value,row,index){
                                /* 如果栈顶元素与部门名称相同，那就说明到底了。 */
                                var top = getTop();
                                if(top.unitName.includes(value)) {
                                    return '<span title = "'+row.unitname+'" >'+row.unitname+'</span>';
                                }
                                /* 得到部门id和字段名称  */
                                return '<span title = "'+row.unitname+'" onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildren(\''+row.unitid+'\',\''+row.unitname+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitname+'</span>';
                            }
                        },{
                        field:"linelength",
                        title:"巡检范围长度（KM）",
                        width:$(this).width() * 0.1,
                        rowspan: 2,
                        resizable:true,
                        align:'center',
                        formatter: function(value,row,index){
                            if( value == 0 )
                                return '<span title="--">--</span>';
                            return '<span title="' +(value/1000).toFixed(2)+'"  class="tip tooltip-f">' +(value/1000).toFixed(2)+'</span>';
                        }
                    },
                        {
                            field:"keypoint",
                            title:"关键点",
                            width:$(this).width() * 0.5,
                            resizable:true,
                            colspan:5,
                            align:'center'
                        },
                        {
                            field:"assessscore",
                            title:"巡检分数",
                            width:$(this).width() * 0.1,
                            resizable:true,
                            rowspan:2,
                            align:'center',
                            formatter: function(value,row,index){
                                return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                            }
                        }
                    ],

					[
						{	
							field:"ykeypointnum",
							title:"应巡关键点",
							width:$(this).width() * 0.1,
							resizable:true,
							align:'center',
                            formatter: function(value,row,index){
							    if(row.ykeypointnum == 0 )
                                    return '<span title="--"  class="tip tooltip-f">--</span>';
							    return value;
                            }
						},{	
							field:"skeypointnum",
							title:"实巡关键点",
							width:$(this).width() * 0.1,
							resizable:true,
							align:'center',
                            formatter: function(value,row,index){
                                if(row.ykeypointnum == 0 )
                                    return '<span title="--"  class="tip tooltip-f">--</span>';
                                return value;
                            }
						},{	
							field:"ytemporarykeypointnum",
							title:"应巡临时关键点",
							width:$(this).width() * 0.1,
							resizable:true,
							align:'center',
                            formatter: function(value,row,index){
                                if(row.ytemporarykeypointnum == 0 )
                                    return '<span title="--"  class="tip tooltip-f">--</span>';
                                return value;
                            }
						},{	
							field:"stemporarykeypointnum",
							title:"实巡临时关键点",
							width:$(this).width() * 0.1,
							resizable:true,
							align:'center',
                            formatter: function(value,row,index){
                                if(row.ytemporarykeypointnum == 0 )
                                    return '<span title="--"  class="tip tooltip-f">--</span>';
                                return value;
                            }
						},{	
							field:"pathlinerate",
							title:"轨迹线匹配度（%）",
							width:$(this).width() * 0.1,
							resizable:true,
							align:'center',
                            formatter: function(value,row,index){
                                if(row.ykeypointnum == 0 )
                                    return '<span title="--"  class="tip tooltip-f">--</span>';
                                return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                            }
						}
						]
				],
				onDblClickRow:function(index,indexData){
				},
				onLoadSuccess:function(data){
					$('#gpsdayworkdatagrid').datagrid('clearSelections'); //clear selected options

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
                        '1、如果有日常任务和临时任务以及标准轨迹线，则分数组成为 日常关键点分数*0.8 + 临时关键点*0.1 + 标准轨迹线*0.1 <br/>' +
                        '2、如果只有日常任务和标准轨迹线，则分数组成为日常关键点分数*0.9 + 标准轨迹线*0.1<br/>' +
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

//导出
function exportQuery(){
	showLoadingMessage("正在导出数据，请稍后。。。");
    querySerialize.unitid = $('#unitId').combotree('getValue');
	if(querySerialize != null){
		url=addTokenForUrl(rootPath+'/gpsunitdaywork/exportToExcelAction.do?unitid='+querySerialize.unitid+"&startdate="+querySerialize.startdate+"&inspectortype="+querySerialize.inspectortype);
		$("#exprotExcelIframe").attr("src", url);
		hiddenLoadingMessage();
	}
}

//清除
function clearQueryForm() {
	//$('#startdate').val(nowDate);
	$("#queryForm select").each(function() {
		try{
			$(this).combotree("clear");
		}catch(e){
			$(this).val("");
		}
	});

    $('#startdate').val("");
}

/**
 * 日期计算
 * date 日期yyyy-MM-dd
 * day 正整数或负整数
 * @returns
 */
function dateCalculate(date,day){
	var myDate = new Date(date);
	//获取新时间
	myDate.setDate(myDate.getDate()+day); 
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	//获取当前日
	var date=myDate.getDate(); 
	return year+'-'+p(month)+"-"+p(date);
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