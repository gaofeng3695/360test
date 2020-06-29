
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
//当前登陆用户
var user = JSON.parse(sessionStorage.user);
//获取当前日期
var nowDate = getNowDate();
 upDay();
//当前查看的报表级别
var hlevel=1;
//当前部门查看的部门id
var viewunitid=user.unitId;
//记录分公司级部门id
var twoLevelUnitid="";
//记录分公司级部门名称
var twoLevelUnitname="";
//记录是否点击下一级
var nlevel="";
//记录场站级别报表还是人员报表 1场站分公司、3人员
var isinslevel="1";
//巡检人员类型
var inspectortype="02";

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#statisticsdate').val(nowDate);
	//设置查询条件
	querySerialize={hlevel:hlevel,statisticsdate:nowDate,unitid:user.unitId,inspectortype:inspectortype};
	$('#statisticsUnit').html('<span>'+user.unitName+'</span>');
	//加载一级报表
	initOneDatagrid();
	//页面自适应
	onresize();
	$(window).bind("resize", function () {
		onresize();
     });
});

function initOneDatagrid(){
	$('#gpsUnitscoredatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsunitscore/getPage.do",
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
				width:$(this).width() * 0.2,
				resizable:true,
				align:'center',
                formatter: function(value,row,index){
                    if(value != null && row.nowUserUnitLevel < row.unitLevel){
                        if(row.unitLevel == 3){
                            var opt = '<p class="table-operate"><a href="#" title = "'+row.unitname+'" onclick="viewIns(\'' + row.unitid+'\',\'' + row.unitname+'\')">\
							<span>'+value+'</span>\
							</a></p>';
                            return opt;
                        }else{
                            var opt = '<p class="table-operate"><a href="#" title = "'+row.unitname+'" onclick="nextLevel(\'' + row.unitid+'\',\'' + row.unitname+'\')">\
							<span>'+value+'</span>\
							</a></p>';
                            return opt;
                        }
                        //普通业务部门
                    }else if(value != null && row.nowUserUnitLevel == row.unitLevel && row.unitid == user.unitId && row.unitLevel == 3){
                        var opt = '<p class="table-operate"><a href="#" title = "'+row.unitname+'" onclick="viewIns(\'' + row.unitid+'\',\'' + row.unitname+'\')">\
						<span>'+value+'</span>\
						</a></p>';
                        return opt;
                        //管道处管道科判断
                    }else if(value != null && row.nowUserUnitLevel == row.unitLevel && row.isPipeOffice == "1" && row.nowUserUnitPid == row.unitid){
                        var opt = '<p class="table-operate"><a href="#" title = "'+row.unitname+'" onclick="nextLevel(\'' + row.unitid+'\',\'' + row.unitname+'\')">\
						<span>'+value+'</span>\
						</a></p>';
                        return opt;
                    }else if(value != null && row.nowUserUnitLevel == row.unitLevel && user.unitId == row.unitid &&  row.unitLevel < 3 ){
                        var opt = '<p class="table-operate"><a href="#" title = "'+row.unitname+'" onclick="nextLevel(\'' + row.unitid+'\',\'' + row.unitname+'\')">\
						<span>'+value+'</span>\
						</a></p>';
                        return opt;
                    }
                    return "<span id=\"unit\">"+value+"</span>";
                }
			},
		]],
		columns: 
		[
		  [
				 {field:'s',title:"巡检统计",colspan:3,width:450,align:'center'}
				 ,{	
						field:"monthscore",
			    		title:"本月评分",
			    		width:$(this).width() * 0.2,
			    		rowspan:2,
			    		resizable:true,
			    		align:'center',
					    formatter: function(value,row,index){
						  return '<span title="'+Math.round((value)*10000)/100+'"  class="tip tooltip-f">'+Math.round((value)*10000)/100+'</span>';
					    }
			    	},
			    	{	
						field:"increaserate",
			    		title:"环比增长",
			    		width:$(this).width() * 0.2,
			    		rowspan:2,
			    		resizable:true,
			    		align:'center',
                        formatter: function(value,row,index){
                            return '<span title="' +Math.round(value*100)/100+'%"  class="tip tooltip-f">' +Math.round(value*100)/100+'%</span>';
                        }
			    	}
		  ],
		  [
			{	
				field:"linelength",
	    		title:"巡检范围长度（KM）",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center',
                formatter: function(value,row,index){
                    return '<span title="'+(value/1000).toFixed(2)+'"  class="tip tooltip-f">'+(value/1000).toFixed(2)+'</span>';
                }
	    	},
	    	{	
	    		field:"assessscore",
	    		title:"考核分数",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(value*100 < 80){
                        return 'color:red;';
                    }else if(value*100 < 90 && value*100 >= 80){
                        return 'color:blue;';
                    }
                },
                formatter: function(value,row,index){
                    return '<span title="'+Math.round((value)*10000)/100+'"  class="tip tooltip-f">'+Math.round((value)*10000)/100+'</span>';
                }
	    	},
	    	{	
				field:"loginscore",
	    		title:"每周登录分数",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		align:'center',
                formatter: function(value,row,index){
                    return '<span title="'+Math.round((value)*100)/100+'"  class="tip tooltip-f">'+Math.round((value)*100)/100+'</span>';
                }
	    	}
		]],
		onDblClickRow:function(index,indexData){
		},
		onLoadSuccess:function(data){
	    	$('#gpsUnitscoredatagrid').datagrid('clearSelections'); //clear selected options

            $(".datagrid-header td[field='assessscore']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：两种分数的综合分数。<br/>' +
                '1、如果有日常任务和临时任务，则分数组成为 日常关键点分数*0.9 + 临时关键点*0.1 <br/>' +
                '2、如果只有日常任务，则分数组成为日常关键点分数<br/>' +
                '3、如果只有临时任务，则分数也就是临时任务的分数</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
            $(".datagrid-header td[field='monthscore']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：本月所有考核分数的平均值。<br/>' +
                '</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
            $(".datagrid-header td[field='increaserate']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：考核分数相对于上月增长的百分比。<br/>' +
                '</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
            $(".datagrid-header td[field='loginscore']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：1、登录预警阈值设置了每个部门的登录预警值。<br/>2、每位拥有管道工角色的用户每天的登录次数大于或者等于部门设置的预警值则为合格。' +
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
	//设置表头
	setTitle(nowDate);
	
	var html = "注: 综合评分计算说明：<br>"
			 +	"1、分公司各站平均分数，得分四舍五入保留整数；<br>"
			 +	"2、红色警告：该人员巡检完成率低于80%，需重点监察；<br>"
			 +	"3、蓝色警告：该人员巡检完成率低于90%，需加强管理；<br>"
	$("#notediv").html(html);
}

function onresize(){
	var containerWidth = $(window).width();
	var containerHeight = $(window).height();
	$('#gpsUnitscoredatagrid').datagrid('resize', {
		width : containerWidth
	});
}
/**
 * 打开一级报表
 */
function nextLevelone(){
	viewunitid=user.unitId;
	hlevel = 1;
	isinslevel = "1";
	querySerialize={hlevel:hlevel,statisticsdate:nowDate,unitid:user.unitId,inspectortype:inspectortype};
	//加载一级报表
	initOneDatagrid();
	$('#statisticsUnit').html('<span>'+user.unitName+'</span>');
}

/**
 * 打开二级报表
 */
function nextLevel(unitid,unitname){
	isinslevel = "1";
	viewunitid=unitid;
	hlevel = 2;
	//记录分公司级部门id
	twoLevelUnitid=unitid;
	//记录分公司级部门名称
	twoLevelUnitname=unitname;
	nlevel = "1";
	querySerialize={hlevel:hlevel,unitid:unitid,statisticsdate:nowDate,nextLevel:nlevel,inspectortype:inspectortype};
	initOneDatagrid();
	$('#statisticsUnit').html('<a href="#" class = "easyui-linkbutton e-nav" onclick="nextLevelone()">'+user.unitName+'</a>'+' > <span>'+unitname+'</span>');
}

/**
 * 打开人员统计报表
 */
function viewIns(unitid,unitname){
	isinslevel="2";
	if(twoLevelUnitid != "" && twoLevelUnitname != null){
		$('#statisticsUnit').html('<a href="#" class = "easyui-linkbutton e-nav" onclick="nextLevelone()">'+user.unitName+'</a>  > <a class = "easyui-linkbutton e-nav" href="#" onclick="nextLevel(\'' + twoLevelUnitid+'\',\'' + twoLevelUnitname +'\')">'+twoLevelUnitname+'</a> > <span>'+unitname+'</span>');
	}else{
		$('#statisticsUnit').html('<a href="#" class = "easyui-linkbutton e-nav" onclick="nextLevelone()">'+user.unitName+'</a>  > <span>'+unitname+'</span>');
	}
	//记录分公司级部门id
	viewunitid=unitid;
	querySerialize={unitid:unitid,statisticsdate:nowDate,inspectortype:inspectortype};
	initInsDatagrid();
}

/**
 * 人员统计
 * @returns
 */
function initInsDatagrid(){
	$('#gpsUnitscoredatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinsscore/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        fitColumns: true,
		singleSelect:true,
		pagination:false,
		queryParams:querySerialize,
		frozenColumns:[[
			{	
				field:"unitname",
				title:"部门名称",
				width:$(this).width() * 0.1111,
				resizable:true,
				align:'center'
			},{	
				field:"inspectorName",
				title:"巡检人员",
				width:$(this).width() * 0.1111,
				resizable:true,
				align:'center'
			}
			]],
			columns: 
				[[
					{field:'assessscore',title:"考核分数",rowspan:2,width:$(this).width() * 0.1111,align:'center',
			    		styler:function(value,row,index){
						if(value*100 < 80){
							return 'color:red;';
			  			}else if(value*100 < 90 && value*100 >= 80){
			  				return 'color:blue;';
			  			}
					}},
					{	
						field:"devCode",
						title:"设备编号",
						width:$(this).width() * 0.1111,
						resizable:true,
						rowspan:2,
						align:'center'
					},
					{	
						field:"range",
						title:"巡检范围",
						width:$(this).width() * 0.1111,
						resizable:true,
						colspan:1,
						align:'center'
					},{	
						field:"linelength",
						title:"区段长度（KM）",
						width:$(this).width() * 0.1111,
						resizable:true,
						rowspan:2,
						align:'center'
					},{	
						field:"month",
						title:"本月评分",
						width:$(this).width() * 0.1111,
						resizable:true,
						rowspan:2,
						align:'center',
						formatter: function(value,row,index){
                            return '<span title="'+Math.round((getmonthScore(row))*10000)/100+'"  class="tip tooltip-f">'+Math.round((getmonthScore(row))*10000)/100+'</span>';
						}
					},{	
						field:"increaserate",
						title:"环比增长",
						width:$(this).width() * 0.1111,
						resizable:true,
						rowspan:2,
						align:'center'
					},{	
						field:"yearscore",
						title:"年度评分",
						width:$(this).width() * 0.1111,
						resizable:true,
						rowspan:2,
						align:'center',
                        formatter: function(value,row,index){
                            return '<span title="'+Math.round((value)*10000)/100+'"  class="tip tooltip-f">'+Math.round((value)*10000)/100+'</span>';
                        }
					}
					],[
						{	
							field:"beginlocation",
							title:"起止位置",
							width:$(this).width() * 0.1111,
							resizable:true,
							align:'center'
						}
						]
				],
				onDblClickRow:function(index,indexData){
				},
				onLoadSuccess:function(data){
					$('#gpsUnitscoredatagrid').datagrid('clearSelections'); //clear selected options
				}
	});
	
	//设置表头
	if(nowDate != null){
		var year = nowDate.split("-");
		$('div[class$="month"] :not(.datagrid-sort-icon)').html(year[0]+"年"+year[1]+"月评分");
		$('div[class$="yearscore"] :not(.datagrid-sort-icon)').html(year[0]+"年度评分");
		var dateArr = getMonDayAndSunDay(nowDate);
		if(dateArr.length > 1){
			$('div[class$="assessscore"] :not(.datagrid-sort-icon)').html(dateArr[0] + " 至 " + dateArr[1] + "考核分数");
		}
	}
	
	var html = "注: 综合评分计算说明：<br>"
		 +	"1、各站人员平均分数，得分四舍五入保留整数；<br>"
		 +	"2、红色警告：该人员巡检完成率低于80%，需重点监察；<br>"
		 +	"3、蓝色警告：该人员巡检完成率低于90%，需加强管理；";
$("#notediv").html(html);
}

/**
 * 设置表头
 * @param titleName
 * @returns
 */
function setTitle(titleName){
	var dateArr = getMonDayAndSunDay(nowDate);
	if(dateArr.length > 1){
		$('div[class$="s"] :not(.datagrid-sort-icon)').html(dateArr[0] + " - " + dateArr[1] + "巡线考核");
	}
}

/**
 * 前一天
 * @returns
 */
function upDay(){
	nowDate = dateCalculate(-7);
	$('#statisticsdate').val(nowDate);
	querySerialize={hlevel:hlevel,unitid:viewunitid,statisticsdate:nowDate,nextLevel:nlevel,inspectortype:inspectortype};
	//场站分公司
	if(isinslevel == "1"){
		initOneDatagrid();
	}else if(isinslevel == "2"){//人员
		initInsDatagrid();
	}
}

/**
 * 后一天
 * @returns
 */
function nextDay(){
	nowDate = dateCalculate(7);
	$('#statisticsdate').val(nowDate);
	querySerialize={hlevel:hlevel,unitid:viewunitid,statisticsdate:nowDate,nextLevel:nlevel,inspectortype:inspectortype};
	//场站分公司
	if(isinslevel == "1"){
		initOneDatagrid();
	}else if(isinslevel == "2"){//人员
		initInsDatagrid();
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	showLoadingMessage("正在导出数据，请稍后。。。");
	if(querySerialize != null){
		//场站分公司
		if(isinslevel == "1"){
			url=addTokenForUrl(rootPath+'/gpsunitscore/exportToExcelAction.do?hlevel='+querySerialize.hlevel+"&unitid="+querySerialize.unitid+"&statisticsdate="+querySerialize.statisticsdate+"&inspectortype="+inspectortype);
		}else if(isinslevel == "2"){//人员
			url=addTokenForUrl(rootPath+'/gpsinsscore/exportToExcelAction.do?hlevel='+querySerialize.hlevel+"&unitid="+querySerialize.unitid+"&statisticsdate="+querySerialize.statisticsdate+"&inspectortype="+inspectortype);
		}
		$("#exprotExcelIframe").attr("src", url);
		hiddenLoadingMessage();
	}
}

/**
 * 时间控件触发事件
 * @returns
 */
function dateOnChange(){
	nowDate = $("#statisticsdate").val();
	querySerialize={hlevel:hlevel,unitid:viewunitid,statisticsdate:nowDate,inspectortype:inspectortype};
	initOneDatagrid();
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
	//获取当前日
	var date=myDate.getDate();
	return year+'-'+p(month)+"-"+p(date);
}

/**
 * 日期计算
 * @returns
 */
function dateCalculate(day){
	var myDate = new Date(nowDate);
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
 * 
 * 判断传入值是否小于10，小于10补0
 */
function p(s) {
    return s < 10 ? '0' + s: s;
}

/**
 * 取当前月分数
 * @param row
 * @returns
 */
function getmonthScore(row){
	var yearMonth = nowDate.split("-");
	var month = yearMonth[1];
	var val = 0;
	switch(month)
	{
	case 1:
		val = row.janscore;
	  break;
	case 2:
		val = row.febscore;
	  break;
	case 3:
		val = row.marscore;
	  break;
	case 4:
		val = row.aprscore;
	  break;
	case 5:
		val = row.mayscore;
	  break;
	case 6:
		val = row.junscore;
	  break;
	case 7:
		val = row.julscore;
	  break;
	case 8:
		val = row.augscore;
	  break;
	case 9:
		val = row.sepscore;
	  break;
	case 10:
		val = row.octscore;
	  break;
	case 11:
		val = row.novscore;
	  break;
	case 12:
		val = row.decscore;
	  break;
	}
	return val;
}

/**
 * 获取传入日期所在周的周一和周日日期
 * @param datevalue
 * @returns
 */
function getMonDayAndSunDay(datevalue) {
    let dateValue = datevalue;
    let arr = dateValue.split("-");
    //月份-1 因为月份从0开始 构造一个Date对象
    let date = new Date(arr[0], arr[1] - 1, arr[2]);
    let dateOfWeek = date.getDay();//返回当前日期的在当前周的某一天（0～6--周日到周一）
    let dateOfWeekInt = parseInt(dateOfWeek, 10);//转换为整型
    if (dateOfWeekInt == 0) {//如果是周日
        dateOfWeekInt = 7;
    }
    let aa = 7 - dateOfWeekInt;//当前于周末相差的天数
    let temp2 = parseInt(arr[2], 10);//按10进制转换，以免遇到08和09的时候转换成0
    let sunDay = temp2 + aa;//当前日期的周日的日期
    let monDay = sunDay - 6;//当前日期的周一的日期
    let startDate = new Date(arr[0], arr[1] - 1, monDay);
    let endDate = new Date(arr[0], arr[1] - 1, sunDay);
    let sm = parseInt(startDate.getMonth()) + 1;//月份+1 因为月份从0开始
    let em = parseInt(endDate.getMonth()) + 1;
    let start = startDate.getFullYear() + "-" + p(sm) + "-" + p(startDate.getDate());
    let end = endDate.getFullYear() + "-" + p(em) + "-" + p(endDate.getDate());
    let result = [];
    result.push(start);
    result.push(end);

    return result;
}
