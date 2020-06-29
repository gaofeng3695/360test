/**
 * @file
 * @author 作者
 * @desc 查看页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID
var inspectorType=getParamter("inspectorType");	// 管道工还是巡线工
var businessId = "";
/**
 * @desc 初始化
 */
$(document).ready(function(){

    /* 通过巡检人员ID获取此人所有的巡检计划 */
    createPlanElement( pkfield );

    /* 加载完成后做一些事情 */
    loadFinish();


});

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
            console.log(result)
            for( let i = 0 ; i < result.length ; i++ ){
                let node = ' <div class=\"table-content divNode\">';
                node += '<h6 class=\"table-title\">计划'+(i+1)+'</h6>';
                node += '<table align=\"center\" class=\"detail-table\">';
                node += '<tr>';
                node += '<th width=\"20%\"><span>计划编号</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].code == null ? '' : result[i].code)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<th width=\"20%\"><span>巡检类型</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].instype == null ? '' : result[i].instype)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '</tr>';
                node += '<tr>';
                node += '<th width=\"20%\"><span>执行单位</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].execunitidname == null ? '' : result[i].execunitidname)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<th width=\"20%\"><span>巡检人员类型</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].inspectortype == null ? '' : result[i].inspectortype)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<tr>';
                node += '<th width=\"20%\"><span>巡检频次</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].insfreq == null ? '' : result[i].insfreqName)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<th width=\"20%\"><span>制作依据</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].determinant == null ? '' : result[i].determinant)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\" style = \"text-overflow : ellipsis\"/>';
                node += '</td>';
                node += '</tr>';
                node += '<tr>';
                node += '<th width=\"20%\"><span>巡检方式</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].insvehicle == null ? '' : result[i].insvehicle)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<th width=\"20%\"><span>巡检速度设置(km/h)</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].speedmax == null ? '' : result[i].speedmax)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '</tr>';
                node += '<tr>';
                node += '<th width=\"20%\"><span>计划开始时间</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].startTime == null ? '' : result[i].startTime)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<th width=\"20%\"><span>计划结束时间</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].insedate == null ? '' : result[i].insedate)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '</tr>';
                node += '<tr>';
                node += '<th width=\"20%\"><span>计划废除日期</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].repealdate == null ? '' : result[i].repealdate ) +'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<th width=\"20%\"><span>计划执行状态</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].planflag == null ? '' : result[i].planflag)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '</tr>';
                node += '<tr>';
                node += '<th width=\"20%\"><span>制定部门</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].unitidname == null ? '' : result[i].unitidname)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '<th width=\"20%\"><span>同步时间</span></th>';
                node += '<td width=\"30%\">';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].syncdate == null ? '' : result[i].syncdate)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '</tr>';
                node += '<tr>';
                node += '<th width=\"20%\"><span>是否PIS同步</span></th>';
                node += '<td width=\"30%\" colspan=3 >';
                node += '<input readonly=\"readonly\" value=\"'+(result[i].isPis == null ? '' : result[i].isPis)+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                node += '</td>';
                node += '</tr>';
                /*if(result[i].gpsPlanLineInfo != null){
                    for( let k =0 ; k < result[i].gpsPlanLineInfo.length ; k++ ){
                        node += '<tr>';
                        node += '<th width=\"20%\"><span>起始位置</span></th>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].beginlocation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '<th width=\"20%\"><span>终止位置</span></th>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].endlocation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '</tr>';

                        node += '<tr>';
                        node += '<th width=\"20%\"><span>起始里程</span></th>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].originalBeginstation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '<th width=\"20%\"><span>终止里程</span></th>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].originalEndstation+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '</tr>';

                        node += '<tr>';
                        node += '<th width=\"20%\"><span>管线名称</span></th>';
                        node += '<td width=\"30%\" colspan=\"3\">';
                        node += '<input readonly=\"readonly\" value=\"'+result[i].gpsPlanLineInfo[k].lineloopoidname+'\" class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '<td width=\"20%\"><span></span></td>';
                        node += '<td width=\"30%\">';
                        node += '<input readonly=\"readonly\"  class=\"easyui-validatebox input_bg show\"  validType=\"\" maxlength=\"45\"/>';
                        node += '</td>';
                        node += '</tr>';
                    }

                }*/

                node += '</div>';
                node += '<table style=\"min-height:70px\" id=\"gpsInstaskDaydatagrid'+i+'\" class=\"easyui-datagrid\"></table>';


                $('#contentArea').append(node);

                /* 计划详情到此已经渲染到页面了 ，然后再里面加上任务 */

                /* 在计划中获取计划所有的任务 */
                /* 获取计划OID */
                let planevoid = result[i].pid;
                /* 任务时间是当天 */
                let currentDate = new Date().format("yyyy-MM-dd");
                /* 通过计划编号和当前时间获取到此人的所有任务 */
                generateDayTaskForm(planevoid, currentDate, inspectionOid, i);

            }

            $(".input_bg.show").css('border', 'none');
        }else{
            $('#contentArea').append("暂无计划。");
           // top.showAlert("提示", "暂无计划。", 'info');
        }

    })
}

/**
 * 生成日常任务表单
 * @param planevoid 巡检计划OID
 * @param insdate   巡检时间
 * @param inspectionOid 巡线员OID
 */
function generateDayTaskForm( planevoid , insdate , inspectionOid, i) {
    $('#gpsInstaskDaydatagrid'+i).datagrid({
        idField:'oid',
        url: rootPath+"/gpsinstaskday/getPage.do?planevoid="+planevoid+"&insedate="+insdate+"&inspectorid="+inspectionOid+"&inspectortype="+inspectorType+"&insedatequery=2099-01-01",
       // url: rootPath+"/gpsinstaskday/getPage.do?planevoid="+planevoid+"&inspectorid="+inspectionOid,
        collapsible:true,
        autoRowHeight: false,
        remoteSort:true,
        scrollbarSize: 0,
        fitColumns: true,
        emptyMsg: '<span style=\"margin-top: 1px;display: inline-block;\">暂无任务</span>',
        pagination: false,
        frozenColumns:[[
           /* {
                field:"planno",
                title:"巡检计划编号",
                width:$(this).width() * 0.142,
                resizable:true,
                align:'center'
            },*/
            {
                field:"execunitidname",
                title:"执行部门",
                width:$(this).width() * 0.142,
                resizable:true,
                align:'center'
            },
            {
                field:"inspectoridname",
                title:"巡检人员",
                width:$(this).width() * 0.142,
                resizable:true,
                align:'center'
            }
        ]],
        columns:
            [[
                {
                    field:"instypeCodeName",
                    title:"巡检类型",
                    width:$(this).width() * 0.142,
                    resizable:true,
                    align:'center'
                },

               /* {
                    field:"inspectortypeCodeName",
                    title:"巡检人员类型",
                    width:"100",
                    resizable:true,
                    align:'center'
                },*/
                {
                    field:"insfreqcont",
                    title:"巡检频次",
                    width:$(this).width() * 0.142,
                    resizable:true,
                    align:'center',
                    formatter: function(value,row,index){
                        var opt = row.insfrequnitval + (row.insfrequnit=='01'?'日':row.insfrequnitCodeName) + row.insfreq + '巡';
                        return opt;
                    }
                },

               /* {
                    field:"insvehicleCodeName",
                    title:"巡检工具",
                    width:"100",
                    resizable:true,
                    align:'center'
                },*/

                {
                    field:"insbdate",
                    title:"任务开始时间",
                    width:$(this).width() * 0.142,
                    resizable:true,
                    sortable:true,
                    align:'center'
                },

                {
                    field:"insedate",
                    title:"任务结束时间",
                    width:$(this).width() * 0.142,
                    resizable:true,
                    sortable:true,
                    align:'center'
                }
            ]],
        onDblClickRow:function(index,indexData){
            top.getDlg("gps_instask_day/view_gps_instask_day.html?oid="+indexData.oid,"viewGpsInstaskDay","详细",800,700,false,true,true);
        },
        onLoadSuccess:function(data){
            $('#gpsInstaskDaydatagrid').datagrid('clearSelections'); //clear selected options
        }
    });


}

function loadFinish() {
    let node = '<h6 class=\"table-title\">基础数据</h6>';
    $('.detail-table').after(node);
}
/*************************************************巡检计划结束***********************************************************/

