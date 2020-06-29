
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
//当前登录用户
var user = JSON.parse(sessionStorage.user);
//获取当前日期
var nowDate = getNowDate();
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
var inspectortype="01";

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
    $('#statisticsdate').val(nowDate);
    //设置查询条件
    querySerialize={hlevel:hlevel,statisticsdate:nowDate,inspectortype:inspectortype,unitid:user.unitId};
    $('#statisticsUnit').html('<span>'+user.unitName+'</span>');
    /* 把箭头换成图标 */
    $('#statisticsUnit span').html($('#statisticsUnit span').text().split('-->').join('<img src=\'../../common/images/blue.png\' />'));
    //加载一级报表
    initOneDatagrid();
    //页面自适应
    // onresize();
    $(window).bind("resize", function () {
        // onresize();
    });
});

function initOneDatagrid(url){
    if( url == undefined || url == null || url == '' ) {
        url = rootPath+"/gpsunitscore/getPage.do";
    }

    $('#gpsUnitscoredatagrid').datagrid({
        idField:'oid',
        url: url,
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
                width:$(this).width() * 0.1,
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
                    {field:'s',title:"巡检统计",colspan:5,width:$(this).width() * 0.1,align:'center'}
                    ,{
                        field:"monthscore",
                        title:"本月评分",
                        width:$(this).width() * 0.1,
                        rowspan:2,
                        resizable:true,
                        align:'center',
                        formatter: function(value,row,index){
                            return '<span title="'+Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                        }
                    },
                    {
                        field:"increaserate",
                        title:"环比增长",
                        width:$(this).width() * 0.1,
                        rowspan:2,
                        resizable:true,
                        align:'center',
                        formatter: function(value,row,index){
                            return '<span title="' +Math.round(value*100)/100+'%"  class="tip tooltip-f">' +Math.round(value*100)/100+'%</span>';
                        }
                    }
                    ,
                    {
                        field:"yearscore",
                        title:"年度评分",
                        width:$(this).width() * 0.1,
                        rowspan:2,
                        resizable:true,
                        align:'center',
                        formatter: function(value,row,index){
                            return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' + Math.round(value*10000)/100+'</span>';
                        }
                    }
                ],
                [
                    {
                        field:"linelength",
                        title:"巡检范围长度（KM）",
                        width:$(this).width() * 0.11,
                        resizable:true,
                        align:'center',
                        formatter: function(value,row,index){
                            return '<span title="' +(value/1000).toFixed(2)+'"  class="tip tooltip-f">' + (value/1000).toFixed(2)+'</span>';
                        }
                    },
                    {
                        field:"plancoveragerate",
                        title:"巡检计划覆盖率",
                        width:$(this).width() * 0.1,
                        resizable:true,
                        align:'center',
                        formatter: function(value,row,index) {
                            if(value >= 0.996)
                                return '<span title="100%"  class="tip tooltip-f">100%</span>';
                            return '<span title="' +Math.round(value*1000)/10+'%"  class="tip tooltip-f">' +Math.round(value*1000)/10+'%</span>';
                        },
                        styler:function(value,row,index) {
                            if(value*100 < 99.6){
                                return 'color:red;';
                            }
                        }
                    },

                    {
                        field:"taskcoveragerate",
                        title:"巡检任务覆盖率",
                        width:$(this).width() * 0.1,
                        resizable:true,
                        align:'center',
                        formatter: function(value,row,index){
                            if(value >= 0.996)
                                return '<span title="100%"  class="tip tooltip-f">100%</span>';
                            return '<span title="' +Math.round(value*1000)/10+'%"  class="tip tooltip-f">' +Math.round(value*1000)/10+'%</span>';
                        },
                        styler:function(value,row,index){
                            if(value*100 < 99.6){
                                return 'color:red;';
                            }
                        }
                    },
                    {
                        field:"completionrate",
                        title:"巡检完成率",
                        width:$(this).width() * 0.1,
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
                            return '<span title="' +Math.round(value*10000)/100+'%"  class="tip tooltip-f">' + Math.round(value*10000)/100+'%</span>';
                        }
                    },
                    {
                        field:"assessscore",
                        title:"考核分数",
                        width:$(this).width() * 0.1,
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
                            return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' + Math.round(value*10000)/100+'</span>';
                        }
                    }/*,
                    {
                        field:"loginscore",
                        title:"每周登录分数",
                        width:$(this).width() * 0.1,
                        resizable:true,
                        align:'center',
                        formatter: function(value,row,index){
                            return '<span title="' +Math.round(value*100)/100+'"  class="tip tooltip-f">' + Math.round(value*100)/100+'</span>';
                        }
                    }*/
                ]],
        onDblClickRow:function(index,indexData){
        },
        onLoadSuccess:function(data){
            $('#gpsUnitscoredatagrid').datagrid('clearSelections'); //clear selected options
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
                content: '<span style="color:#fff">概念：巡检任务覆盖率是指部门的上级任务，下级任务和本级任务的并集与部门范围的交集，减去该部门本级和下级不巡检范围的并集与部门范围的交集，除以本部门的范围减去本部门本级和下级不巡检范围的并集与部门范围的交集。<br/>' +
                '公式：(上下本级所有任务并集与部门管理范围的交集 - 本级下级不巡检区段并集与部门范围的交集) / (部门范围并集 - 本级下级不巡检范围并集与部门范围的交集)</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
            $(".datagrid-header td[field='completionrate']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：该部门已经巡检的关键点数量除以应该巡检的关键点数量。<br/>' +
                '公式：该部门已经巡检的关键点数量 / 应该巡检的关键点数量<br/>' +
                    '巡检完成率不合格，考核分数满分情况为人员今天已请假，请移步每日巡检统计处查询。</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
            $(".datagrid-header td[field='loginscore']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：概念：1、登录预警阈值设置了每个部门的登录预警值。<br/>2、每位拥有管道工角色的用户每天的登录次数大于或者等于部门设置的预警值则为合格。</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
            $(".datagrid-header td[field='assessscore']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：两种分数的综合分数。<br/>' +
                '1、如果有日常任务和临时任务，则分数组成为 日常关键点分数*0.9 + 临时关键点*0.1 <br/>' +
                '2、如果只有日常任务，则分数组成为日常关键点分数<br/>' +
                '4、如果只有临时任务，则分数也就是临时任务的分数</span>',
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
            $(".datagrid-header td[field='yearscore']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：全年考核分数的平均分。<br/>' +
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
        + "1、分公司各站平均分数，得分四舍五入保留整数；<br>"
        + "2、红色警告：巡检完成率低于80%，需重点监察；<br>"
        + "3、蓝色警告：巡检完成率低于90%，需加强管理；<br>"
       /* + "4、巡检计划覆盖率是指部门的上级计划，下级计划和本级计划的并集与部门范围的交集，减去该部门本级和下级不巡检范围的并集与部门范围的交集，除以本部门的范围减去本部门本级和下级不巡检范围的并集与部门范围的交集。低于100%以红色展示；<br>"
        + "5、巡检任务覆盖率是指部门的上级任务，下级任务和本级任务的并集与部门范围的交集，减去该部门本级和下级不巡检范围的并集与部门范围的交集，除以本部门的范围减去本部门本级和下级不巡检范围的并集与部门范围的交集。低于100%以红色展示；<br>"
        + "6、管道线路巡检完成率=各分公司所辖站队总成绩/各分公司所辖巡检站队总数；<br>"
        + "7、登录分数：七天中所有管道工登录次数之和 / 7 * 部门下的管道工人数（注：每天登录次数最多算一次。）；<br>";*/
    $("#notediv").html(html);

    $("#notediv").css({"position":"relative","bottom":"4px"});
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
    $('#statisticForm').show();
    viewunitid=user.unitId;
    hlevel = 1;
    isinslevel = "1";
    nlevel="";
    querySerialize={hlevel:hlevel,statisticsdate:nowDate,unitid:user.unitId,inspectortype:inspectortype};
    //加载一级报表
    initOneDatagrid();
    querySerialize={hlevel:hlevel,statisticsdate:nowDate,unitid:user.unitId,inspectortype:inspectortype};
    //加载一级报表
    initOneDatagrid();
    $('#statisticsUnit').html('<span>'+user.unitName+'</span>');

    /* 把箭头换成图标 */
    $('#statisticsUnit span').html($('#statisticsUnit span').text().split('-->').join('<img src=\'../../common/images/blue.png\' />'));
}

/**
 * 打开二级报表
 */
function nextLevel(unitid,unitname){
    $('#statisticForm').show();
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
    querySerialize={hlevel:hlevel,unitid:unitid,statisticsdate:nowDate,nextLevel:nlevel,inspectortype:inspectortype};
    initOneDatagrid();
    $('#statisticsUnit').html('<a href="#" class = "easyui-linkbutton e-nav" onclick="nextLevelone()">'+user.unitName+'</a>'+'<mi>--></mi><span>'+unitname+'</span>');
    /* 把箭头换成图标 */
    $('#statisticsUnit span').html($('#statisticsUnit span').text().split('-->').join('<img src=\'../../common/images/blue.png\' />'));
    $('#statisticsUnit mi').html($('#statisticsUnit mi').text().split('-->').join('<img src=\'../../common/images/blue.png\' />'));
}

/**
 * 打开人员统计报表
 */
function viewIns(unitid,unitname){
    $('#statisticForm').hide();
    isinslevel="2";
    if(twoLevelUnitid != "" && twoLevelUnitname != null){
        $('#statisticsUnit').html('<a href="#" class = "easyui-linkbutton e-nav" onclick="nextLevelone()">'+user.unitName+'</a>  <mi>--></mi> <a href="#" class = "easyui-linkbutton e-nav" onclick="nextLevel(\'' + twoLevelUnitid+'\',\'' + twoLevelUnitname +'\')">'+twoLevelUnitname+'</a><img src=\'../../common/images/blue.png\' /><span>'+unitname+'</span>');
        /* 把箭头换成图标 */
        $('#statisticsUnit a').each(function(index,item) {
            $(this).html($(this).text().split('-->').join('<img src=\'../../common/images/blue.png\' />'));
        });
        $('#statisticsUnit mi').html($('#statisticsUnit mi').text().split('-->').join('<img src=\'../../common/images/blue.png\' />'));
    }else{

        $('#statisticsUnit').html('<a href="#" class = "easyui-linkbutton e-nav" onclick="nextLevelone()">'+user.unitName+'</a>  <mi>--></mi></span> <span>'+unitname+'</span>');
        /* 把箭头换成图标 */
        $('#statisticsUnit a').each(function(index,item) {
            $(this).html($(this).text().split('-->').join('<img src=\'../../common/images/blue.png\' />'));
        });
        $('#statisticsUnit mi').html($('#statisticsUnit mi').text().split('-->').join('<img src=\'../../common/images/blue.png\' />'));
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
        singleSelect:true,
        pagination:false,
        fitColumns: true,
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
                    if( value == null )
                        return '--';
                    return '<span title="' +value+'"  class="tip tooltip-f">' +value+'</span>';
                }
            }
        ]],
        columns:
            [[
                {field:'s',title:"巡检统计",colspan:2,width:200,align:'center'},
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
                    title:"区段长度（KM）",
                    width:"120",
                    resizable:true,
                    rowspan:2,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">' + Math.round((value/1000)*100)/100+'</span>';
                    }
                },{
                    field:"month",
                    title:"月度考核评分",
                    width:"600",
                    resizable:true,
                    colspan:12,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' + Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"increaserate",
                    title:"环比增长",
                    width:"80",
                    resizable:true,
                    rowspan:2,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*100)/100+'"  class="tip tooltip-f">' + Math.round(value*100)/100+'</span>';
                    }
                },{
                    field:"yearscore",
                    title:"年度评分",
                    width:"100",
                    resizable:true,
                    rowspan:2,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                    }
                }
            ],[
                {
                    field:"completionrate",
                    title:"巡检完成率",
                    width:"100",
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
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' + Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"assessscore",
                    title:"考核分数",
                    width:"100",
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
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' + Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"beginlocation",
                    title:"起止位置",
                    width:"200",
                    resizable:true,
                    align:'center'
                },{
                    field:"janscore",
                    title:"1月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' + Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"febscore",
                    title:"2月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' + Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"marscore",
                    title:"3月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' + Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"aprscore",
                    title:"4月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"mayscore",
                    title:"5月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"junscore",
                    title:"6月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"julscore",
                    title:"7月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"augscore",
                    title:"8月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"sepscore",
                    title:"9月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"octscore",
                    title:"10月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100+'</span>';
                    }
                },{
                    field:"novscore",
                    title:"11月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100 +'</span>';
                    }
                },{
                    field:"decscore",
                    title:"12月",
                    width:"50",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round(value*10000)/100+'"  class="tip tooltip-f">' +Math.round(value*10000)/100 +'</span>';
                    }
                }
            ]
            ],
        onDblClickRow:function(index,indexData){
        },
        onLoadSuccess:function(data){
            $('#gpsUnitscoredatagrid').datagrid('clearSelections'); //clear selected options
            $(".datagrid-header td[field='completionrate']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：该部门已经巡检的关键点数量除以应该巡检的关键点数量。<br/>' +
                '公式：该部门已经巡检的关键点数量 / 应该巡检的关键点数量<br/>' +
                    '巡检完成率不合格，考核分数满分情况为人员今天已请假，请移步每日巡检统计处查询。</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
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

            $(".datagrid-header td[field='beginlocation']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：巡检任务的线路起止位置。<br/>' +
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
    if(nowDate != null){
        var year = nowDate.split("-");
        $('div[class$="month"] :not(.datagrid-sort-icon)').html(year[0]+"年月度评分");
        $('div[class$="yearscore"] :not(.datagrid-sort-icon)').html(year[0]+"年度评分");
    }

    var html = "注: 综合评分计算说明：<br>"
        + "1、各站人员平均分数，得分四舍五入保留整数；<br>"
        + "2、红色警告：巡检完成率低于80%，需重点监察；<br>"
        + "3、蓝色警告：巡检完成率低于90%，需加强管理；<br>"
        + "4、管道线路巡检完成率=关键点完成率x90% +临时任务x10%";
    $("#notediv").css({"position":"relative","bottom":"5px"});
    $("#notediv").html(html);
}

/**
 * 设置表头
 * @param titleName
 * @returns
 */
function setTitle(titleName){
    $('div[class$="s"] :not(.datagrid-sort-icon)').html(titleName+"巡线考核");
}

/**
 * 前一天
 * @returns
 */
function upDay(){
    nowDate = dateCalculate(-1);
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
    nowDate = dateCalculate(1);
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
 * 打开统计图
 * @returns
 */
function openTable(){
    var ounitid = querySerialize.unitid;
    if(ounitid == undefined){
        ounitid=viewunitid;
    }
    top.getDlg("statistical_table.html?unitid="+ounitid+"&statisticsdate="+querySerialize.statisticsdate+"&nextLevel="+nlevel,"statistical_table","统计图",900,600,false,true,true);
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

