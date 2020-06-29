
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
// 当前登录用户
var originalUser = JSON.parse(sessionStorage.user);     // 保留原始用户信息
var user = JSON.parse(sessionStorage.user);             // 如果是管道科，此用户会有所改变。
/* 当前登录用户的父亲 */
var parentUser = null;
// 获取当前日期
var nowDate = getNowDate();

/* 当前展示界面 */
var currentShowInterface = '';  // segmentHead 或者 unit

/* 当前部门信息 */
var currentUnit = {};

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
    /* 如果是管道科，直接把管道科改成上级部门 */
    if( user.ext_field4 == '1' ) {  // 表示他是管道工
        user.unitId = user.ext_field2;
        user.hierarchy = user.ext_field3;
    }

    currentUnit.unitId = user.unitId;
    currentUnit.hierarchy = user.hierarchy;
    currentUnit.unitName = user.unitName;

    /* 获取父亲部门。 */
    if( user.ext_field5 == null ) {
        /* 登录部门为最高级,父亲就是自己。 */
        parentUser = user;
        init( parentUser.unitId, parentUser.hierarchy, parentUser.unitName );
    } else {
        $.get(rootPath+'/app/synbase/getUnitByOid.do?unitId='+user.ext_field5, function( result ) {     // 这里获取的是部门，不是用户。
            parentUser = result.data;
            init( parentUser.oid, parentUser.hierarchy, parentUser.unitName );
        })
    }

});

/**
 * 初始化
 */
function init( unitId, hierarchy, unitName) {
    $('#statisticsdate').val(nowDate);
    $('#statisticsUnit').html('<span>'+user.unitName+'</span>');
    operatorStack( unitId, hierarchy, unitName);
    enterContent( unitId, hierarchy, unitName );
}
/**
 * 操作栈中元素。
 */
function operatorStack( unitId, hierarchy, unitName ) {
    /* 初始化 */
    initHandleStack( unitId, hierarchy, unitName );
    showHost();
}

/**
 * 舍弃通用类初始化类，改用自身的初始化
 */
function initHandleStack( unitId, hierarchy, unitName ) {
    /* 部门id初始化为登陆人的部门id */
    topElement.unitId = unitId;
    topElement.hierarchy = hierarchy;
    topElement.unitName = '<span class = \'nav-unit\' hierarchy = \''+hierarchy+'\' id = \''+unitId+'\'>'+unitName+'</span>';
    /* 设置下方元素为null */
    topElement.bottom = null;
    /* 设置顶部元素为null */
    topElement.top = null;
}

function addHostListener() {
    /* 导航栏点击事件，删除栈内元素 */
    $('.nav-unit').unbind('click');
    $('.nav-unit').on('click',function(){
        /* 获取导航中点击的id */
        let id = $(this).attr('id');
        let hierarchy = $(this).attr('hierarchy');
        let unitName = $(this).attr('name');
        deleteStack(topElement, id);
        /* 显示导航栏 */
        showHost();
        /* 显示本级所有部门 */
        enterContent( id, hierarchy, unitName );
    })
}
function showHost() {
    /* 清空 */
    navigation = '';
    /* 查询栈中元素 */
    queryStack(topElement );
    $('#localHost').html(navigation);
    addHostListener();
}

/**
 * 初始化部门
 * @param url
 */
function initOneDatagrid(url, hierarchy){
    if( url == undefined || url == null || url == '' ) {
        url = rootPath+"/segment/unit/getPage.do?parentId="+user.unitId+"&statisticsDate="+$('#statisticsdate').val();
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
                field:"unitName",
                title:"部门名称",
                width:"140",
                resizable:true,
                align:'center',
                formatter: function(value,row,index){       // 层级位数相同不能点击
                    if( value != null && (row.hierarchy == user.hierarchy || row.hierarchy.split('.').length > user.hierarchy.split('.').length) ){
                        var opt = '<p class="table-operate"><a href="#" title = "'+row.unitName+'" onclick="enterContent(\'' + row.unitId+'\',\'' + row.hierarchy+'\', \'' + row.unitName+'\')">\
                        <span>'+value+'</span>\
                        </a></p>';
                        return opt;
                    }
                    return "<span>"+value+"</span>";
                }
            },{
                field:"mileage",
                title:"线路段里程（KM）",
                width:"130",
                resizable:true,
                align:'center',
                formatter: function(value,row,index){
                    return '<span title="' +(value/1000).toFixed(3)+'"  class="tip tooltip-f">' + (value/1000).toFixed(3)+'</span>';
                }
            }
        ]],
        columns:
            [[
                {
                    field:"week",
                    title:"本周",
                    width:"150",
                    resizable:true,
                    colspan:1,
                    align:'center'
                },
                {
                    field:"half",
                    title:"半月",
                    width:"350",
                    resizable:true,
                    colspan:3,
                    align:'center'
                },
                {
                    field:"month",
                    title:"本月",
                    width:"150",
                    resizable:true,
                    colspan:1,
                    align:'center'
                },{
                    field:"quarter",
                    title:"本季度",
                    width:"300",
                    colspan:3,
                    resizable:true,
                    align:'center'
                }
            ],[
                {
                    field:"weekScore",
                    title:"巡线考核分",
                    width:"150",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +Math.round((value)*100)/100+'"  class="tip tooltip-f">' + Math.round((value)*100)/100+'</span>';
                    }
                },{
                    field:"quarterKeyPointCount",
                    title:"任务考核分",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( row.quarterMustKeyPointCount == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +Math.round((row.quarterRealKeyPointCount/row.quarterMustKeyPointCount)*10000)/100+'"  class="tip tooltip-f">' + Math.round((row.quarterRealKeyPointCount/row.quarterMustKeyPointCount)*10000)/100 +'</span>';
                    }
                },{
                    field:"quarterMustKeyPointCount",
                    title:"应巡关键点数",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                },{
                    field:"quarterRealKeyPointCount",
                    title:"实际巡检关键点数",
                    width:"150",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                },{
                    field:"monthPropagateScore",
                    title:"入户宣传考核分",
                    width:"150",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +Math.round((value)*100)/100+'"  class="tip tooltip-f">' + Math.round((value)*100)/100 +'</span>';
                    }
                },{
                    field:"quarterHomePropagateCount",
                    title:"入户宣传次数",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                },{
                    field:"quarterConcentrateCount",
                    title:"集中宣传次数",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                },{
                    field:"quarterConcentrateScore",
                    title:"季度宣传评分",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +Math.round((value)*100)/100+'"  class="tip tooltip-f">' + Math.round((value)*100)/100+'</span>';
                    }
                }
            ]
            ],
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

            $(".datagrid-header td[field='quarterConcentrateScore']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：季度宣传评分：总分100分，集中宣传40分或者0分；入户宣传3次60分，少一次扣20分。</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
        }
    });
    /* 设置表头 */
    $('div[class$="week"] :not(.datagrid-sort-icon)').html("本周"+getWeek( $('#statisticsdate').val() ));
    $('div[class$="month"] :not(.datagrid-sort-icon)').html("本月"+getMonth( $('#statisticsdate').val() ));
    $('div[class$="half"] :not(.datagrid-sort-icon)').html(getHalfMonth( $('#statisticsdate').val() ));
    $('div[class$="quarter"] :not(.datagrid-sort-icon)').html("本季度" + getQuarter( $('#statisticsdate').val() ));

    var html = "注: 段长考核说明：<br>"
        + "1、每周至少与属地巡线工开展一次徒步巡检工作，每半月完成所辖管段的徒步巡线工作；<br>"
        + "2、每月至少开展一次入户宣传，每季度组织一次所辖管段沿线的集中宣传，每年完成所辖管段的入户宣传。<br>"
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
 * 点击部门按钮进入下一级别内容
 */
function enterContent( unitId, hierarchy, unitName ) {
    // 因为存在多级，但是人员级别和部门级别的展示又不一样，所有我们部门就最多显示2级。
    if(hierarchy.split('.').length <= 3) {
        url = rootPath+"/segment/unit/getPage.do?parentId="+unitId+"&statisticsDate="+$('#statisticsdate').val();
        initOneDatagrid( url, hierarchy );
        /* 修改展示界面 */
        currentShowInterface = "unit";
    } else {
        /* 根据部门查询是否有子部门，如果没有子部门，就显示段长列表。 */
        url = rootPath+"/segment/getPage.do?unitid="+unitId+"&statisticsDate="+$('#statisticsdate').val();
        initInsDatagrid( url );
        currentShowInterface = "segmentHead";
    }
    /* 点击部门，入栈。 */
    let element = {};
    element.unitId = unitId;
    element.hierarchy = hierarchy;
    element.unitName = '<span class = \'nav-unit\' hierarchy = \''+hierarchy+'\'  id = \''+unitId+'\'>'+unitName+'</span>';
    addStack(topElement, element);
    showHost();

    currentUnit.unitId = unitId;
    currentUnit.hierarchy = hierarchy;
    currentUnit.unitName = unitName;
}

/**
 * 初始化时，要显示所有平级部门，并且还需要判断是否是管道科，如果是管道科还要使用上级部门ID。
 * 关于管道科的判断具体参考XnLoginStrategy类中的getUser方法
 * @param id
 * @param hierarchy
 * @param unitName
 */
function showContent(){
    if( user.ext_field5 != null ) {  // 判断父亲是否为NULL ，如果不为null，直接获取父亲的相关信息。
        $.get(rootPath+'/app/synbase/getUnitByOid.do?unitId='+user.ext_field5, function( result ) {
            enterContent( result.data.oid , result.data.hierarchy , result.data.unitName );
        })
    } else {    // 如果为null，则直接使用本尊。
        enterContent( user.ext_field2 , user.ext_field3 , user.unitName );
    }
}
























/**
 * 段长统计
 * @returns
 */
function initInsDatagrid( url ){

    if( url == undefined || url == null || url == '' ) {
        url = rootPath+"/segment/getPage.do?unitid="+user.unitId+"&statisticsDate="+$('#statisticsdate').val();
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
                field:"unitName",
                title:"部门名称",
                width:"100",
                resizable:true,
                align:'center'
            },{
                field:"segmentHead",
                title:"段长",
                width:"100",
                resizable:true,
                align:'center',
                formatter: function(value,row,index){
                    if( value == null )
                        return '--';
                    return '<span title="' +value+'"  class="tip tooltip-f">' +value+'</span>';
                }
            },{
                field:"mileage",
                title:"线路段里程（KM）",
                width:"150",
                resizable:true,
                align:'center',
                formatter: function(value,row,index){
                    if( value == null )
                        return '--';
                    return '<span title="' +(value/1000).toFixed(3)+'"  class="tip tooltip-f">' + (value/1000).toFixed(3)+'</span>';
                }
            }
        ]],
        columns:
            [[
                {
                    field:"week",
                    title:"本周",
                    width:"150",
                    resizable:true,
                    colspan:1,
                    align:'center'
                },
                {
                    field:"half",
                    title:"上半月",
                    width:"450",
                    resizable:true,
                    colspan:4,
                    align:'center'
                },
                {
                    field:"month",
                    title:"本月",
                    width:"400",
                    resizable:true,
                    colspan:2,
                    align:'center'
                },{
                    field:"quarter",
                    title:"本季度",
                    width:"500",
                    colspan:3,
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="' +Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">' + Math.round((value/1000)*100)/100+'</span>';
                    }
                }
            ],[
                {
                    field:"weekScore",
                    title:"巡线评分",
                    width:"150",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( row.quarterMustKeyPointCount == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                },{
                    field:"quarterKeyPointCount",
                    title:"任务考核分",
                    width:"150",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( row.quarterMustKeyPointCount == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +Math.round((row.quarterRealKeyPointCount/row.quarterMustKeyPointCount)*10000)/100+'"  class="tip tooltip-f">' + Math.round((row.quarterRealKeyPointCount/row.quarterMustKeyPointCount)*10000)/100 +'</span>';
                    }
                },{
                    field:"quarterMustKeyPointCount",
                    title:"应巡检关键点数",
                    width:"150",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                },{
                    field:"quarterRealKeyPointCount",
                    title:"实际巡检关键点数",
                    width:"150",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                },{
                    field:"complete",
                    title:"完成情况",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else if (value == 0 )
                            return '<span title="未完成"  class="tip tooltip-f">未完成</span>';
                        else
                            return '<span title="已完成"  class="tip tooltip-f">已完成</span>';
                    },
                    styler:function(value,row,index){
                        if(value == 1){
                            return 'background-color:#00FF00;';
                        } else if(value == 0 ) {
                            return 'background-color:#FF6347;';
                        }
                    }
                },{
                    field:"monthHomePropagateCount",
                    title:"入户宣传次数",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                },{
                    field:"monthPropagateScore",
                    title:"入户宣传评分",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value.toFixed(2)+'"  class="tip tooltip-f">' + value.toFixed(2)+'</span>';
                    }
                },{
                    field:"quarterConcentrateScore",
                    title:"季度宣传评分",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value.toFixed(2)+'"  class="tip tooltip-f">' + value.toFixed(2)+'</span>';
                    }
                },{
                    field:"quarterHomePropagateCount",
                    title:"入户宣传次数",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                },{
                    field:"quarterConcentrateCount",
                    title:"集中宣传次数",
                    width:"100",
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        if( value == null )
                            return '<span title="--"  class="tip tooltip-f">--</span>';
                        else
                            return '<span title="' +value+'"  class="tip tooltip-f">' + value +'</span>';
                    }
                }
            ]
            ],
        onDblClickRow:function(index,indexData){
        },
        onLoadSuccess:function(data){

            $(".datagrid-header td[field='quarterConcentrateScore']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：季度宣传评分：总分100分，集中宣传40分或者0分；入户宣传3次60分，少一次扣20分。</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
        }
    });
    /* 设置表头 */
    $('div[class$="week"] :not(.datagrid-sort-icon)').html("本周"+getWeek( $('#statisticsdate').val() ));
    $('div[class$="month"] :not(.datagrid-sort-icon)').html("本月"+getMonth( $('#statisticsdate').val() ));
    $('div[class$="half"] :not(.datagrid-sort-icon)').html(getHalfMonth( $('#statisticsdate').val() ));
    $('div[class$="quarter"] :not(.datagrid-sort-icon)').html("本季度" + getQuarter( $('#statisticsdate').val() ));

    var html = "注: 段长考核说明：<br>"
        + "1、每周至少与属地巡线工开展一次徒步巡检工作，每半月完成所辖管段的徒步巡线工作；<br>"
        + "2、每月至少开展一次入户宣传，每季度组织一次所辖管段沿线的集中宣传，每年完成所辖管段的入户宣传。<br>"
    $("#notediv").css({"position":"relative","bottom":"5px"});
    $("#notediv").html(html);
}


/**
 * 前一天
 * @returns
 */
function upDay(){
    nowDate = dateCalculate(-1);
    $('#statisticsdate').val(nowDate);
    enterContent( currentUnit.unitId, currentUnit.hierarchy, currentUnit.unitName );
}

/**
 * 后一天
 * @returns
 */
function nextDay(){
    nowDate = dateCalculate(1);
    $('#statisticsdate').val(nowDate);
    enterContent( currentUnit.unitId, currentUnit.hierarchy, currentUnit.unitName );
}

/**
 * 时间控件触发事件
 * @returns
 */
function dateOnChange(){
    nowDate = $("#statisticsdate").val();
    enterContent( currentUnit.unitId, currentUnit.hierarchy, currentUnit.unitName );
}

/**
 * @desc 导出查询
 */
function exportQuery(){
    showLoadingMessage("正在导出数据，请稍后。。。");
    if(currentShowInterface == "segmentHead"){
        url=addTokenForUrl(rootPath+'/segment/exportToExcelAction.do?unitid='+currentUnit.unitId+'&statisticsDate='+$('#statisticsdate').val());
    }else if(currentShowInterface == "unit"){
        url=addTokenForUrl(rootPath+'/segment/unit/exportToExcelAction.do?parentId='+currentUnit.unitId+'&statisticsDate='+$('#statisticsdate').val());
    }
    $("#exprotExcelIframe").attr("src", url);
    hiddenLoadingMessage();
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

