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
    /* 通过巡线工OID获取到该人员的所有的轨迹线 */
    getPathByOid( pkfield );

});

/*************************************************获取人员轨迹线开始***********************************************************/

/**
 * 获取人员轨迹线
 * @param Oid 人员OID
 */
function getPathByOid( oid ) {
    $('#gpsInsrangedatagrid').datagrid({
        idField:'oid',
        url: rootPath+"/pathlinemain/getPage.do?inspectorid="+oid,
        collapsible:true,
        autoRowHeight: false,
        fitColumns: true,
        emptyMsg: '<span>无记录</span>',
        remoteSort:true,
        pagination: false,
        frozenColumns:[[
            {field:'ck',checkbox:true},
            {
                field:'location',
                title:'定位',
                align:"center",
                width:$(this).width() * 0.05,
                formatter: function(value,row,index){
                    var opt = '<p class="table-operate"><a href="#" title = "定位" onclick="locationLine(\'' + row.oid+'\')">\
							<span class="fa fa-thumb-tack"></span>\
							</a></p>';
                    return opt;
                }
            },
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
            }

        ]],
        columns:
            [[

                {
                    field:"beginlocation",
                    title:"起始位置",
                    width:$(this).width() * 0.14,
                    resizable:true,
                    align:'center'
                },

                /*{
                    field:"beginstation",
                    title:"起始里程（m）",
                    width:"100",
                    resizable:true,
                    align:'center'
                },*/

                {
                    field:"endlocation",
                    title:"终止位置",
                    width:$(this).width() * 0.14,
                    resizable:true,
                    align:'center'
                },

               /* {
                    field:"endstation",
                    title:"终止里程（m）",
                    width:"100",
                    resizable:true,
                    align:'center'
                },*/
                /*{
                    field:"insRangeLength",
                    title:"管理长度（m）",
                    width:"100",
                    resizable:true,
                    align:'center'
                },*/
                {
                    field:"inspectorName",
                    title:"巡检人员",
                    width:$(this).width() * 0.14,
                    resizable:true,
                    align:'center'
                },
                {
                    field:"bufferwidth",
                    title:"缓冲带宽度（m）",
                    width:$(this).width() * 0.14,
                    resizable:true,
                    align:'center'
                }
            ]],
        onDblClickRow:function(index,indexData){
            top.getDlg("showPath/view_show_path.html?oid="+indexData.oid,"viewShowPath","详细",900,500,false,true,true);
        },
        onLoadSuccess:function(data){
            $('#gpsInsrangedatagrid').datagrid('clearSelections'); //clear selected options
        }
    })
}

/**
 * 定位
 * @param oid
 * @returns
 */
function locationLine(oid){
    if(isNull(oid)){
        var rows = $('#gpsInsrangedatagrid').datagrid('getSelections');
        var oid = "";
        if (rows.length == 1){
            oid = rows[0].oid;
        }else{
            top.showAlert("提示","请选中一条记录",'info');
            return;
        }
    }

    /* 地图打开前，先把对话框隐藏掉 */
    top.hideDlg("viewAll");

    /* 创建一个最大框的图标 ，用于隐藏对话框后，可以点击还原 */
    let div=document.createElement("div");
    // div.innerText = "还原";
    top.document.body.appendChild(div);
    div.style.position = 'fixed';
    // div.style.backgroundColor = 'red';
    div.style.bottom='0px';
    div.style.height = '30px';
    div.style.width = '46px';
    div.id = 'min';
    div.style.cursor = 'pointer';

    /* 创建一个图标 */
    let img=document.createElement("img");
    img.src = '../../common/images/min.png';
    img.style.height = '30px';
    img.style.width = '88px';
    div.appendChild(img);

    /* 点击还原 */
    // div.onclick= (e)=>{
     div.onclick= function(e){
        e.preventDefault();
        top.showDlg("viewAll");
        let min = top.document.getElementById('min');
        min.parentNode.removeChild(min);

    }

    /* 打开地图 */
    top.map.show = true;

    var paramp = {
        "fieldName":"PATHLINEMAINOID"
    };

    var where = {
        "where":"PATHLINEMAINOID = '"+oid+"'",
        "show":true
    };

    top.updateLayer('gps_pathline',where, oid, "gps_pathline" ,paramp);

}

/*************************************************获取人员轨迹线结束***********************************************************/
