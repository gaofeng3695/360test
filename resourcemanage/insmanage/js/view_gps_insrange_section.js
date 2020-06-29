/**
 * @file
 * @author 作者
 * @desc 查看页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield =getParamter("oid");	// 业务数据ID
var inspectorType =getParamter("inspectorType");	// 业务数据ID
var sign =getParamter("sign");	// 业务数据ID
var businessId = "";
/**
 * @desc 初始化
 */
$(document).ready(function(){
    /* 生成人员巡检区段 */
     generateInsrangeSection();

});

/*************************************************获取人员区段开始***********************************************************/

/**
 * 生成人员区段列表
 */
function generateInsrangeSection() {
    $('#gpsInsrangeSectiondatagrid').datagrid({
        idField:'oid',
        url: rootPath+"/gpsinsrange/getPage.do?inspectorid="+pkfield+"&inspectorType="+inspectorType+"&sign="+sign,
        collapsible:true,
        autoRowHeight: false,
        fitColumns: true,
        remoteSort:true,
        pagination: false,
        emptyMsg: '<span>无记录</span>',
        frozenColumns:[[
            {field:'ck',checkbox:true},
            {
                field:"unitname",
                title:"部门名称",
                width:$(this).width() * 0.14,
                resizable:true,
                align:'center'
            },

            {
                field:"lineloopoName",
                title:"管线名称",
                width:$(this).width() * 0.14,
                resizable:true,
                align:'center'
            },

            {
                field:"segmentcode",
                title:"管段/高后果区编号",
                width:$(this).width() * 0.14,
                hidden:(inspectorType == '01'),
                resizable:true,
                align:'center'
            }
        ]],
        columns:
            [[


                {
                    field:"beginlocation",
                    title:"起始位置",
                    width:$(this).width() * 0.14,
                    resizable:true,
                    sortable:true,
                    align:'center'
                },

                {
                    field:"beginstation",
                    title:"起始里程（m）",
                    width:$(this).width() * 0.14,
                    resizable:true,
                    sortable:true,
                    align:'center'
                },

                {
                    field:"endlocation",
                    title:"终止位置",
                    width:$(this).width() * 0.14,
                    resizable:true,
                    sortable:true,
                    align:'center'
                },

                {
                    field:"endstation",
                    title:"终止里程（m）",
                    width:$(this).width() * 0.14,
                    resizable:true,
                    sortable:true,
                    align:'center'
                },

                {
                    field:"insRangeLength",
                    title:"管理长度（m）",
                    width:$(this).width() * 0.14,
                    resizable:true,
                    align:'center'
                }/*,

                {
                    field:"ginspectorName",
                    title:"巡检人员",
                    width:"100",
                    resizable:true,
                    align:'center'
                }*/
            ]],
        onDblClickRow:function(index,indexData){
            top.getDlg("../../linePatrolManage/subSystem/insrangeManage/view_gps_insrange.html?oid="+indexData.oid,"viewGpsInsrange","详细",900,550,false,true,true);
        },
        onLoadSuccess:function(data){
            $('#gpsInsrangeSectiondatagrid').datagrid('clearSelections'); //clear selected options
        }
    })
}

/*************************************************获取人员区段结束***********************************************************/
