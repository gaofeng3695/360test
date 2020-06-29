/**
 * 地图上显示覆盖率统计
 * @since 2019-03-12
 */

/* 获取部门ID */
var unitId=getParamter("unitid");
var nowDate = getNowDate();

$(document).ready(function(){
	$('#begindate').val(nowDate);
    initdatagrid();
    $('#stationfstatisticDatagrid').unbind('mouseover');
    query();
});

function initdatagrid(){
    $('#stationfstatisticDatagrid').datagrid({
        idField:'unitid',
//		url: rootPath+"/gpsinspector/getPage.do?unitid="+stUnitId+"&inspectortype="+stType,
        collapsible:true,
        autoRowHeight: false,
        rownumbers:false,
        striped:false,
        nowrap:false,
        fitColumns: true,
        pagination:false,
        rowStyler: function (index, row) {
            return 'background-color:white;';
        },
        columns:
            [[
                {
                    field:"unitidname",
                    title:"巡检部门",
                    width:$(this).width() * 0.33,
                    resizable:true,
                    sortable:false,
                    align:'center'
                },
                {
                    field:"plancoveragerate",
                    title:"计划覆盖率",
                    width:$(this).width() * 0.33,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="'+Math.round(value*100)/100+"%"+'"  class="tip tooltip-f">' +Math.round(value*100)/100+"%"+'</span>';
                    },
                    styler:function(value,row,index){
                        if(value*100 != 100){
                            return 'color:red;';
                        }
                    }
                },
                {
                    field:"taskcoveragerate",
                    title:"任务覆盖率",
                    width:$(this).width() * 0.33,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        return '<span title="'+Math.round(value*100)/100+"%"+'"  class="tip tooltip-f">' +Math.round(value*100)/100+"%"+'</span>';
                    },
                    styler:function(value,row,index){
                        if(value < 100){
                            return 'color:red;';
                        }
                    }
                }
            ]],
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
//清空
function clearQuery(){
	$('#begindate').val('');
}
function query(){
    var begindate = $('#begindate').val();
    var enddate = $('#enddate').val();
   /* if(begindate != null && begindate != '' && enddate != null && enddate != '' ){
        if(begindate > enddate){
            top.showAlert("提示", "查询开始日期不能大于截止日期！", 'info');
            return;
        }
    }*/
    $.ajax({
        url : rootPath+"statisticsform/stationfstatistic/getStationfstatistic.do?unitid="+unitId+"&begindate="+begindate+"&enddate="+enddate,
        type: "post",
        async: false,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function(data){
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
    if(data.data.flag == 1){
        $('#stationfstatisticDatagrid').datagrid(
            {columns : [[
                {
                    field:"unitidname",
                    title:"巡检部门",
                    width:$(this).width() * 0.33,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        // return '<span onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildren(\''+row.unitid+'\',\''+row.unitidname+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitidname+'</span>';
                        return value;
                    }
                },
                {
                    field:"plancoveragerate",
                    title:"计划覆盖率",
                    width:$(this).width() * 0.33,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        return Math.round(value*100)/100+"%";
                    }
                },
                {
                    field:"taskcoveragerate",
                    title:"任务覆盖率",
                    width:$(this).width() * 0.33,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        return Math.round(value*100)/100+"%";
                    }
                }
            ]]}
        );
        $('#stationfstatisticDatagrid').datagrid('loadData', data.data.data);
    }else if(data.data.flag == 0){
        $('#stationfstatisticDatagrid').datagrid(
            {columns : [
                [{
                    field:"unitidname",
                    title:"巡检部门",
                    rowspan:2,
                    width:$(this).width() * 0.10,
                    resizable:true,
                    sortable:false,
                    align:'center',
                    formatter: function(value,row,index){
                        /* 得到部门id和字段名称  */
                        return '<span onmouseout =\"changeColorBlack(this);\" onmouseover = \"changeColorGreen(this);\" onclick=\"viewChildren(\''+row.unitid+'\',\''+row.unitidname+'\')\" style = \"cursor:pointer;color:#1b9af7;\">'+row.unitidname+'</span>';
                    }
                },
                    {
                        field:"lineloopoidname",
                        title:"管线",
                        rowspan:2,
                        width:$(this).width() * 0.10,
                        resizable:true,
                        sortable:false,
                        align:'center'
                    },
                    {
                        title:"部门管理范围",
                        colspan:1,
                        width:$(this).width() * 0.10,
                        resizable:true,
                        sortable:false,
                        align:'center'
                    },
                    {
                        field:"unbeginlocation",
                        title:"不巡检范围",
                        rowspan:2,
                        width:$(this).width() * 0.20,
                        resizable:true,
                        sortable:false,
                        align:'center'
                    },
                    {
                        title:"计划",
                        colspan:1,
                        width:$(this).width() * 0.10,
                        resizable:true,
                        sortable:false,
                        align:'center'
                    },
                    {
                        field:"plancoveragerate",
                        title:"计划覆盖率",
                        rowspan:2,
                        width:$(this).width() * 0.10,
                        resizable:true,
                        sortable:false,
                        align:'center',
                        formatter: function(value,row,index){
                            return Math.round(value*100)/100+"%";
                        }
                    },
                    {
                        field:"taskbeginlocation",
                        title:"任务",
                        rowspan:2,
                        width:$(this).width() * 0.20,
                        resizable:true,
                        sortable:false,
                        align:'center'
                    },
                    {
                        field:"taskcoveragerate",
                        title:"任务覆盖率",
                        rowspan:2,
                        width:$(this).width() * 0.10,
                        resizable:true,
                        sortable:false,
                        align:'center',
                        formatter: function(value,row,index){
                            return Math.round(value*100)/100+"%";
                        }
                    }],
                [{
                    field:"subbeginlocation",
                    title:"起始位置（里程）",
                    width:$(this).width() * 0.20,
                    resizable:true,
                    sortable:false,
                    align:'center'
                },{
                    field:"planbeginlocation",
                    title:"起始位置（里程）",
                    width:$(this).width() * 0.20,
                    resizable:true,
                    sortable:false,
                    align:'center'
                }]
            ]}
        );

        if(data.data.data.length > 0){
            var list = data.data.data;
            var unindex = 0;
            var taskindex = 0;
            var lineloopoid = list[0].lineloopoid;
            var unitid = list[0].unitid;
            var unlocation = '';
            var tasklocation = '';


            $('#stationfstatisticDatagrid').datagrid('loadData', list);
            var colList = 'unitidname,plancoveragerate,taskcoveragerate';
            mergeCellsByField('stationfstatisticDatagrid', colList);
        }
    }
}

//定时保存巡检覆盖率统计数据测试
function saveStationfstatistic(){
    $.ajax({
        url : rootPath+"statisticsform/stationfstatistic/saveStationfstatistic.do",
        type: "post",
        async: false,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function(data){
            if(data.status==1){
                top.showAlert("提示", "保存成功", 'info');
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
    var PerTxt = "";
    var CurTxt = "";
    var alertStr = "";
    for (j = ColArray.length - 1; j >= 0; j--) {
        PerTxt = "";
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