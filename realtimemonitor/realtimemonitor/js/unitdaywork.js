
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
var unitid=getParamter("unitid");

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#startdate').val(nowDate);
	$('#enddate').val(nowDate);
	
	//打开一级报表
	query();
	
	//页面自适应
	initDatagrigHeight('gpsdayworkdatagrid','queryDiv','100');
	
	/* 以下初始化查询面板 */
//	initUnitComboTree('unitid');
});

function clearQuery(){
	$('#startdate').val('');
	$('#enddate').val('');
}

//打开一级报表
function query(){
	querySerialize={startdate:$('#startdate').val(),enddate:$('#enddate').val(),inspectortype:'01',unitid:unitid};
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
		frozenColumns:[[
			{
				field:"unitname",
				title:"部门名称",
				width:$(this).width() * 0.125,
				resizable:true,
				align:'center'
			},{
				field:"linelength",
				title:"巡检范围长度（KM）",
				width:$(this).width() * 0.125,
				resizable:true,
				align:'center',
                formatter: function(value,row,index){
                    if( value == 0 )
                        return '<span title="--">--</span>';
                    return '<span title="' +(value/1000).toFixed(2)+'"  class="tip tooltip-f">' +(value/1000).toFixed(2)+'</span>';
                }
			}
			]],
			columns: 
				[[
					{
						field:"keypoint",
						title:"关键点",
						width:$(this).width() * 0.625,
						resizable:true,
						colspan:5,
						align:'center'
					},{
						field:"assessscore",
						title:"巡检分数",
						width:$(this).width() * 0.125,
						resizable:true,
						rowspan:2,
						align:'center',
                        formatter: function(value,row,index){
                            return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                        }
					}
					],[
						{
							field:"ykeypointnum",
							title:"应巡关键点",
							width:$(this).width() * 0.125,
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
							width:$(this).width() * 0.125,
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
							width:$(this).width() * 0.125,
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
							width:$(this).width() * 0.125,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								if(row.ytemporarykeypointnum == 0 )
									return '<span title="--"  class="tip tooltip-f">--</span>';
								return value;
							}
						},{
							field:"pathlinerate",
							title:"轨迹线匹配度",
							width:$(this).width() * 0.125,
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
					getInspectordaywork(indexData.unitid, indexData.unitname);
				},
				onLoadSuccess:function(data){
					$('#gpsdayworkdatagrid').datagrid('clearSelections'); //clear selected options
				}
	});
}

/**
 * 
 * @param unitid
 * @param unitname
 * @returns
 */
function getInspectordaywork(unitid, unitname){
	parent.showDialog2('inspectordaywork',unitname+'工作统计', '../../realtimemonitor/realtimemonitor/inspectordaywork.html?unitid='+unitid, 1100, 600, true, 'unitdaywork');
}

//导出
function exportQuery(){
	showLoadingMessage("正在导出数据，请稍后。。。");
	if(querySerialize != null){
		url=addTokenForUrl(rootPath+'/gpsunitdaywork/exportToExcelAction.do?unitid='+querySerialize.unitid+"&startdate="+querySerialize.startdate+"&enddate="+querySerialize.enddate+"&inspectortype="+querySerialize.inspectortype);
		$("#exprotExcelIframe").attr("src", url);
		hiddenLoadingMessage();
	}
}

//清除
function clearQueryForm() {
	$('#startdate').val(nowDate);
	$('#enddate').val(nowDate);
	$("#queryForm select").each(function() {
		try{
			$(this).combotree("clear");
		}catch(e){
			$(this).val("");
		}
	});
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