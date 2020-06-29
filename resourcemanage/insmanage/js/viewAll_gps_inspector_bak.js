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
   // masterTableChildHeight();	// 计算标签内容高度

    /* 通过巡检人员ID获取此人所有的巡检计划 */
    createPlanElement( pkfield );

    /* 获取临时巡检任务基础数据 */
    getTemporaryTask();
    /* 获取临时任务巡检时间 */
    getGpsTemporaryTaskTimeByTaskId();

});

/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewAll");
}

/*************************************************巡检计划开始***********************************************************/

/**
 * 创建计划节点
 * @returns
 */
function createPlanElement(inspectionOid){
    showLoadingMessage();
    $.get(rootPath+"/gpspatroltimemanage/getGpsPlanInfoByInspectionOid.do?inspectionOid="+inspectionOid ,function( result ){
        hiddenLoadingMessage();
        if(result!=null && result!=''){
            /* 保存计划数据 */
            plan = result;
            for( let i = 0 ; i < result.length ; i++ ){
                let node = '<div class=\"box\"> <div class=\"table-content divNode\">';
                node += '<h6 class=\"table-title\">计划'+(i+1)+'</h6>';
                node += '<table align=\"center\" class=\"detail-table\">';
                node += '<tr>';
                node += '<th width=\"20%\"><span>计划编号：</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+result[i].code+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<th width=\"20%\"><span>计划开始时间：</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+result[i].startTime+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '</tr>';

                node += '<tr>';
                node += '<th width=\"20%\"><span>巡检频次：</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+result[i].insfreqName+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<th width=\"20%\"><span>巡检类型</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+result[i].instype+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '</tr>';

                if(result[i].gpsPlanLineInfo != null){
                    for( let k =0 ; k < result[i].gpsPlanLineInfo.length ; k++ ){
                        node += '<tr>';
                        node += '<th width=\"20%\"><span>起始位置：</span></th>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].beginlocation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '<th width=\"20%\"><span>终止位置：</span></th>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].endlocation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '</tr>';

                        node += '<tr>';
                        node += '<th width=\"20%\"><span>起始里程：</span></th>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].originalBeginstation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '<th width=\"20%\"><span>终止里程：</span></th>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].originalEndstation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '</tr>';

                        node += '<tr>';
                        node += '<th width=\"20%\"><span>管线名称：</span></th>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].lineloopoidname+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '<td width=\"20%\"><span></span></td>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\"  class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '</tr>';
                    }

                }

                node += '</div>';

                /* 在计划中获取计划所有的任务 */
                /* 获取计划OID */
                let planevoid = result[i].oid;
                /* 任务时间是当天 */
                let currentDate = new Date().format("yyyy-MM-dd");
                /* 通过计划编号和当前时间获取到此人的所有任务 */
                $.post(rootPath+'/gpsinstaskday/getPage.do', {"planevoid" : planevoid, "insdate" : currentDate},function ( taskData ){
                    if (taskData )
                    node += "<div class = \"box\"></div>";
                });
                node += '</div>';
                $('#timeNode').append(node);
            }

            $(".input_bg.show").css('border', 'none');
        }else{
            top.showAlert("提示", "暂无计划。", 'info');
        }

    })
}

/* 生成任务详细表单 */
function generateTaskDetailForm() {
    let node = '<div class=\"box\">';
    node += ' <div class=\"table-content\" id= \'tableTaskDetail\'> ';
    node += ' <h6 class=\"table-title\">任务</h6> ';
    node += ' <table align=\"center\" class=\"detail-table\" > ';
    node += ' <tr> ';
    node += ' <th width=\"15%\"><span>任务开始日期：</span></th> ';
    node += ' <td width=\"35%\"><span id=\"execUnitName\"></span></td> ';
    node += ' <th width="15%"><span>任务结束日期：</span></th> ';
    node += ' <td width="35%"><span  id="insfreqName"></span></td> ';
    node += ' </tr> ';
    node += ' </div>';
    node += ' </div>';
}
/*************************************************巡检计划结束***********************************************************/

/*************************************************日常任务开始***********************************************************/


/*************************************************日常任务结束***********************************************************/

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
        fit: false, //自动适屏功能
        frozenColumns:[[
            /*{field:'ck',checkbox:true},*/
            {
                field:"pointName",
                title:"临时关键点名称",
                width:"200",
                iconCls: 'icon-edit',
                resizable:true,
                align:'center',
                editor: 'text'
            },
            {
                field:"inspectorName",
                title:"巡检人员",
                width:"150",
                iconCls: 'icon-edit',
                resizable:true,
                align:'center',
                editor: 'text'
            }
        ]],
        columns:
            [[


                /*{
                    field:"insfreq",
                    title:"巡检频次",
                    width:"100",
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text',
                    formatter: function (value, rec, rowIndex) {
                        if(value=='0')
                            return "未关闭";
                        else
                            return "关闭";
                    }
                },*/
                {
                    field:"pointstatus",
                    title:"关键点状态",
                    width:"100",
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
                    width:"200",
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text'
                },
                {
                    field:"remaintime",
                    title:"停留时间",
                    width:"200",
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text'
                },
                {
                    field:"lon",
                    title:"关键点经度",
                    width:"100",
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text'
                },
                {
                    field:"lat",
                    title:"关键点纬度",
                    width:"100",
                    iconCls: 'icon-edit',
                    resizable:true,
                    align:'center',
                    editor: 'text'
                }/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"100",
		  		formatter: function(value,row,index){
		  			console.log(row.processType+"---"+row.processStatus);
		  				var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
		  							<span class="fa fa-eye"></span>\
		  							</a></p>';

					return opt;
				}
			}*/
            ]],
        onDblClickRow:function(index,indexData){
            top.getDlg("../temporarytaskpoint/view_gps_temporary_task_point.html?oid="+indexData.oid,"viewGpsTemporaryTaskPoint","详细",800,300,false,true,true);
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
        data :{"oid" : "22c6e1c3-65a8-4220-914b-b9a8889f1acf"},
        type : 'POST',
        async: false,
        dataType:"json",
        async:true,
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

function view(oid){
    var rows = $('#viewTemporarytaskpointdatagrid').datagrid('getSelections');
    var dataId = "";
    if(!isNull(oid)){
        dataId = oid;
    }else if (rows.length == 1){
        dataId = rows[0].oid;
    }else{
        top.showAlert("提示","请选中一条记录",'info');
        return;
    }
    top.getDlg("../temporarytaskpoint/view_gps_temporary_task_point.html?oid="+dataId,"viewGpsTemporaryTaskPoint","详细",800,300,false,true,true);
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
    node += '<table id=\"viewTemporarytaskpointdatagrid'+i+'\" class=\"easyui-datagrid\"></table>';
    node += '</div>';
    $('#tableDetail').after(node);
}

/*************************************************临时任务结束***********************************************************/