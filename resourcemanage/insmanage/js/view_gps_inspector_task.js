/**
 * @file
 * @author 作者
 * @desc 查看页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID
var businessId = "";
/**
 * @desc 初始化
 */
$(document).ready(function(){
    /* 获取临时巡检任务基础数据 */
   // getTemporaryTask();

    /* 获取临时任务巡检时间 */
   // getGpsTemporaryTaskTimeByTaskId();

    generateTemporaryTaskList();

});

/*************************************************临时任务开始***********************************************************/

function generateDatagraid( id, taskTimeOid){
    $('#'+id).datagrid({
        idField:'oid',
        url: rootPath+"/gpstemporarytaskpoint/getPage.do?taskTimeOid="+taskTimeOid+"&sort=insbDate&order=DESC",
        collapsible:true,
        autoRowHeight: false,
        remoteSort:true,
        pagination : false,
        //height : 435,
        fit: false, // 自动适屏功能
        fitColumns: true,
        emptyMsg: '<span>无记录</span>',
        frozenColumns:[[
            /*{field:'ck',checkbox:true},*/
            {
                field:"pointName",
                title:"临时关键点名称",
                width:$(this).width() * 0.167,
                iconCls: 'icon-edit',
                resizable:true,
                align:'center',
                editor: 'text'
            },
            {
                field:"inspectorName",
                title:"巡检人员",
                width:$(this).width() * 0.167,
                iconCls: 'icon-edit',
                resizable:true,
                align:'center',
                editor: 'text'
            }
        ]],
        columns:
            [[
                {
                    field:"pointstatus",
                    title:"关键点状态",
                    width:$(this).width() * 0.167,
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text',
                    formatter: function (value, rec, rowIndex) {
                        if(value=='0'){
                            return "未巡检";
                        }else if(value=='1'){
                            return "已巡检";
                        }else{
                            return "异常";
                        }
                    }
                },
                {
                    field:"arrivaltime",
                    title:"到达时间",
                    width:$(this).width() * 0.167,
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text'
                },
                {
                    field:"remaintime",
                    title:"停留时间",
                    width:$(this).width() * 0.167,
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text'
                },
                {
                    field:"lon",
                    title:"关键点经度",
                    width:$(this).width() * 0.167,
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text'
                },
                {
                    field:"lat",
                    title:"关键点纬度",
                    width:$(this).width() * 0.167,
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text'
                }
            ]],
        onDblClickRow:function(index,indexData){
            top.getDlg("temporarytaskpoint/view_gps_temporary_task_point.html?oid="+indexData.oid,"viewGpsTemporaryTaskPoint","详细",800,300,false,true,true);
        },
        onLoadSuccess:function(data){
            $('#viewTemporarytaskpointdatagrid').datagrid('clearSelections'); //clear selected options
        }
    });
    //页面自适应
    //initDatagrigHeight(id,'','100');
}
/**
 * @desc 获得多条任务，pkfield为人员ID
 */
function getTemporaryTask(){
    $.ajax({
        url : rootPath+"/gpstemporarytask/get.do",
        data :{"oid" : pkfield},
        type : 'POST',
        /* async: false,*/
        dataType:"json",
        success : function(data) {
            if(data.status==1){
                loadData(data.data);
            }else{
                top.showAlert('错误', '查询出错', 'info');
            }
        },
        error : function(result) {
            top.showAlert('错误', '查询出错', 'info');
        }
    });
}
/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
    $("#execUnitName").html(jsondata.execUnitName);
    $("#insfreqName").html(jsondata.insfreqName);
    $("#insbDate").html(jsondata.insbDate);
    $("#inseDate").html(jsondata.inseDate);
    $("#inspectorName").html(jsondata.inspectorName);

}

/**
 * 根据任务ID获取巡检时间
 * @returns
 */
function getGpsTemporaryTaskTimeByTaskId(){
    $.post(rootPath+"/gpstemporarytask/getGpsTemporaryTaskTimeByTaskId.do",{'taskId':'22c6e1c3-65a8-4220-914b-b9a8889f1acf'}, function( result ){
        if( result.status = 1 ){
            for( let i = 0 ; i < result.data.length ; i++ ){
                createTemporaryTaskKeypointNode( result.data[i], i );
                /* 给巡检时间赋值 */
                $("#time"+i).html(' ( '+result.data[i].begintime+' 至 '+result.data[i].endtime+' ) ');
                /* 初始化datagraid */
                generateDatagraid("viewTemporarytaskpointdatagrid"+i, result.data[i].oid);
            }
        }else{
            top.showAlert("错误","获取巡检时间出错",'error');
        }
    } )
}

/**
 * 创建临时任务关键点节点
 */
function createTemporaryTaskKeypointNode( time, i ){
    let node = '<div class=\"table-content\">';
    node += '<h6 class=\"table-title\">巡检时间 <span id=\"time'+i+'\"></span></h6>';
    node += '<table  style=\"min-height:70px\" id=\"viewTemporarytaskpointdatagrid'+i+'\" class=\"easyui-datagrid\"></table>';
    node += '</div>';
    $('#tableDetail').after(node);
}

/*************************************************临时任务结束***********************************************************/

/**
 * 生成临时任务列表
 */
function generateTemporaryTaskList() {
    $('#gpsTemporaryTaskdatagrid').datagrid({
        idField:'oid',
        url: rootPath+"/gpstemporarytask/getPage.do?inspectorId="+pkfield,
        collapsible:true,
        autoRowHeight: false,
        fitColumns: true,
        emptyMsg: '<span>无记录</span>',
        remoteSort:true,
        pagination: false,
        frozenColumns:[[
            {field:'ck',checkbox:true},
            {
                field:"execUnitName",
                title:"执行部门名称",
                width:$(this).width() * 0.167,
                resizable:true,
                align:'center'
            },
            {
                field:"inspectorName",
                title:"巡检人员",
                width:$(this).width() * 0.167,
                resizable:true,
                align:'center'
            },
            {
                field:"insfreqName",
                title:"巡检频次名称",
                width:$(this).width() * 0.167,
                resizable:true,
                sortable:false,
                align:'center'
            }
        ]],
        columns:
            [[


                {
                    field:"insbDate",
                    title:"任务开始日期",
                    width:$(this).width() * 0.167,
                    sortable:true,
                    resizable:true,
                    align:'center'
                },

                {
                    field:"inseDate",
                    title:"任务结束日期",
                    width:$(this).width() * 0.167,
                    sortable:true,
                    resizable:true,
                    align:'center'
                },
                {
                    field:'operate',
                    title:'操作',
                    align:"center",
                    width:$(this).width() * 0.167,
                    formatter: function(value,row,index){
                        var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
										<span class="fa fa-eye"></span>\
								   </a></p>';
                        return opt;

                    }
                }
            ]],
        onDblClickRow:function(index,indexData){
            top.getDlg("../../linePatrolManage/insTask/temporarytask/view_gps_temporary_task.html?oid="+indexData.oid,"viewGpsTemporaryTask","详细",800,600,false,true,true);
        },
        onLoadSuccess:function(data){
            $('#gpsTemporaryTaskdatagrid').datagrid('clearSelections'); //clear selected options
        }
    });
}