
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
	$('#statisticsdate').val(nowDate);
	
	//打开一级报表
	initOneDatagrid();
	
	//页面自适应
	initDatagrigHeight('gpsdayworkdatagrid','queryDiv','100');
	
	/* 以下初始化查询面板 */
	initUnitComboTree('unitid');
});

function clearQuery(){
	$('#startdate').val('');
	$('#enddate').val('');
}

//打开一级报表
function initOneDatagrid(){
	querySerialize={statisticsdate:$('#statisticsdate').val(),inspectortype:'01',unitid:unitid};
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
				align:'center',
				formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a href="#" title = "" onclick="nextLevel(\'' + row.inspectorid+'\')">\
					<span>'+value+'</span>\
					</a></p>';
					return opt;
				}
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
						colspan:2,
						align:'center'
					},{	
						field:"linelength",
						title:"巡线里程（KM）",
						width:"120",
						resizable:true,
						rowspan:2,
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
						align:'center'
					}
					],[
						{	
							field:"beginlocation",
							title:"起始位置",
							width:"120",
							resizable:true,
							align:'center'
						},{	
							field:"endlocation",
							title:"终止位置",
							width:"120",
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
							title:"轨迹线匹配度",
							width:"120",
							resizable:true,
							align:'center'
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

//返回上一级
function goback(){
	$('#inspectorid').val("")
	initOneDatagrid();
}

//导出
function exportQuery(){
	showLoadingMessage("正在导出数据，请稍后。。。");
	if(querySerialize != null){
		url=addTokenForUrl(rootPath+'/gpsinsdaywork/exportToExcelAction.do?inspectorid='+querySerialize.inspectorid+"&unitid="+querySerialize.unitid+"&statisticsdate="+querySerialize.statisticsdate+"&inspectortype="+querySerialize.inspectortype);
		$("#exprotExcelIframe").attr("src", url);
		hiddenLoadingMessage();
	}
}

//查看下一级
function nextLevel(inspectorid){
	$('#inspectorid').val(inspectorid)
	querySerialize={inspectorid:inspectorid,statisticsdate:$('#statisticsdate').val(),inspectortype:'01',unitid:$('#unitid').val()};
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
						colspan:2,
						align:'center'
					},{	
						field:"linelength",
						title:"巡线里程（KM）",
						width:"120",
						resizable:true,
						rowspan:2,
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
						align:'center'
					}
					],[
						{	
							field:"beginlocation",
							title:"起始位置",
							width:"120",
							resizable:true,
							align:'center'
						},{	
							field:"endlocation",
							title:"终止位置",
							width:"120",
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
							title:"轨迹线匹配度",
							width:"120",
							resizable:true,
							align:'center'
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
//清除
function clearQueryForm() {
	$('#statisticsdate').val(nowDate);
	$("#queryForm select").each(function() {
		try{
			$(this).combotree("clear");
		}catch(e){
			$(this).val("");
		}
	});
}


/**
 * 获取当前日期
 * @returns
 */
function getNowDate(){
	var myDate = new Date();
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	return year+'-'+p(month);
}

/**
 * 
 * 判断传入值是否小于10，小于10补0
 */
function p(s) {
    return s < 10 ? '0' + s: s;
}