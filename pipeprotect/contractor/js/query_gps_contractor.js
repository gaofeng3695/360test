
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
    $('#130605').menubutton({menu:'#locationBars'});
    $('#130606').menubutton({menu:'#exportBars'});
    $('#gpsContractordatagrid').datagrid({
        idField:'oid',
        url: rootPath+"/contractor/getPage.do",
        collapsible:true,
        autoRowHeight: false,
        remoteSort:true,
        fitColumns: true,
        frozenColumns:[[
            {field:'ck',checkbox:true},
            {
                field:'locationXY',
                title:'定位',
                align:"center",
                width:"50",
                formatter: function(value,row,index){
                    var opt = '<p class="table-operate"><a class ="a130605" href="#" title = "定位" onclick="locationSelect(\''+row.oid+'\',' + row.lon+','+row.lat+')">\
								<span class="fa fa-thumb-tack"></span>\
					   			</a></p>';
                    return opt;
                }
            },
            {
                field:"unitidname",
                title:"部门名称",
                width:"100",
                resizable:true,
                sortable:true,
                align:'center'
            },

            {
                field:"lineloopoidname",
                title:"管线名称",
                width:"150",
                resizable:true,
                sortable:true,
                align:'center'
            }
        ]],
        columns:
            [[
                {
                    field:"projectname",
                    title:"承包商施工项目名称",
                    width:"150",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },
                {
                    field:"distanceline",
                    title:"距离管线长度(m)",
                    width:"130",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },

                {
                    field:"riskratingCodeName",
                    title:"风险等级",
                    width:"100",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },
                {
                    field:"constructreasonname",
                    title:"施工原因",
                    width:"150",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },
                {
                    field:"location",
                    title:"施工地点",
                    width:"150",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },

                {
                    field:"stakenumname",
                    title:"桩号",
                    width:"100",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },
                {
                    field:"offset",
                    title:"桩偏移量",
                    width:"100",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },
                {
                    field:"pointstation",
                    title:"施工地点里程值",
                    width:"120",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },
                {
                    field:"happenbegindate",
                    title:"施工开始日期",
                    width:"150",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },

                {
                    field:"inspectoroidname",
                    title:"现场监护人员",
                    width:"150",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },

                {
                    field:"inspectorphone",
                    title:"巡检人员联系方式",
                    width:"150",
                    resizable:true,
                    sortable:true,
                    align:'center'
                },{
                    field:"createUserName",
                    title:"上报人",
                    width:"150",
                    resizable:true,
                    sortable:true,
                    align:'center'
                }
            ]],
        onDblClickRow:function(index,indexData){
            top.getDlg("view_gps_contractor.html?oid="+indexData.oid,"viewGpsContractor","详细",800,600,false,true,true);
        },
        onClickRow:function(index,indexData){
        },
        onLoadSuccess:function(data){
            $('#gpsContractordatagrid').datagrid('clearSelections'); //clear selected options
        }
    });
    //页面自适应
    initDatagrigHeight('gpsContractordatagrid','queryDiv','100');
    var comboxid='';
    var singleDomainName='';	// 单选值域
    var morecomboxid='';
    var moreDomainName='';	// 多选值域
    comboxid+='riskrating'+',';
    singleDomainName+='construnctionRiskLevel'+',';
    comboxid+='approvestatus'+',';
    singleDomainName+='construnctionStatus'+',';
    loadQuerySelectData(comboxid,singleDomainName);
    loadMoreSelectData(morecomboxid,moreDomainName);

    //高级搜索
    $("#moreQuery").click(function(){
        $(this).toggleClass("active");
        $("#moreTable").toggleClass("active");
        var span = $(this).children().find(".l-btn-icon");
        if($(this).hasClass("active")){
            $(span).removeClass("accordion-expand").addClass("accordion-collapse");
            initDatagrigHeight('gpsContractordatagrid','queryDiv',226);
        }else{
            $(span).removeClass("accordion-collapse").addClass("accordion-expand");
            initDatagrigHeight('gpsContractordatagrid','queryDiv',64);
        }
    });

    // 高级搜索的查询条件选择
    $("#moreTable .more-conditions").on("click","a",function(){
        $(this).siblings().removeClass("selected");
        $(this).addClass("selected");
    });

    initUnitComboTree('unitid');
    setComboObjWidth('unitid',0.172,'combobox');
    //初始化管线
    initLineLoopCombobox('lineloopoid');
    setComboObjWidth('lineloopoid',0.215,'combobox');
});

/**
 * @desc 加载查询多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
    if(comboxid!='' && comboxid !=undefined){
        var select =comboxid.split(",");
        var moreDomainNameArr = moreDomainName.split(",");
        for(var i=0;i<select.length-1;i++){
            var id=select[i];
            $('#' + id).combobox({
                panelHeight:100,
                multiple:true,
                url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
                valueField : 'codeId',
                textField : 'codeName',
                onSelect : function(row){
                    //保存个性表单的值域value值
                    $('#'+id).val(row.codeId);
                    $('#'+id+'ID').val(row.codeName);
                },
                onLoadSuccess:function(data){
                    if(data.length>0){
//						$('#'+id).combobox('setValue',data[0].codeId);
                    }
                }
            });
            setComboObjWidth(id,0.22,'combobox');
        }
    }
}

/**
 * @desc 加载查询单选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param singleDomainName 值域名称，以逗号隔开
 */
function loadQuerySelectData(comboxid,singleDomainName){
    if(comboxid!='' && comboxid !=undefined){
        var select =comboxid.split(",");
        var singleDomainNameArr = singleDomainName.split(",");
        for(var i=0;i<select.length-1;i++){
            var id=select[i];
            $('#' + id).combobox({
                url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
                valueField : 'codeId',
                textField : 'codeName',
                onSelect : function(row){
                    //保存个性表单的值域value值
                    $('#'+id).val(row.codeId);
                    $('#'+id+'ID').val(row.codeName);
                },
                onLoadSuccess:function(data){
                    if(data.length>0){
//						$('#'+id).combobox('setValue',data[0].codeId);
                    }
                }
            });
            setComboObjWidth(id,0.22,'combobox');
        }
    }
}
/**
 * @desc 新增
 */
function add(){
    top.getDlg("save_gps_contractor.html","addGpsContractor","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
    var rows = $('#gpsContractordatagrid').datagrid('getSelections');
    var dataId = "";
    if(!isNull(oid)){
        dataId = oid;
    }else if (rows.length == 1){
        dataId = rows[0].oid;
    }else{
        top.showAlert("提示","请选中一条记录",'info');
        return;
    }
    top.getDlg("update_gps_contractor.html?oid="+dataId,"updateGpsContractor","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
    var rows = $('#gpsContractordatagrid').datagrid('getSelections');
    var idArray=[];
    if(!isNull(oid)){
        idArray.push(oid);
    }else if (rows.length > 0){
        $(rows).each(function(i,obj){
            idArray.push(obj.oid);
        });
    }else{
        top.showAlert("提示","请选择记录",'info');
        return ;
    }
    if(!isNull(idArray)){
        $.messager.confirm('删除', '您确定要删除这些信息吗？\n\t',function(r){
            if (r){
                $.ajax({
                    url: rootPath+"/contractor/delete.do",
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify({"idList" : idArray}),
                    type: "POST",
                    dataType:"json",
                    async:false,
                    success: function(data){
                        if(data.status==1){
                            top.showAlert("提示","删除成功","info",function(){
                                $('#gpsContractordatagrid').datagrid('reload');
                                $('#gpsContractordatagrid').datagrid('clearSelections');
                            });
                        }else if(data.code == "400") {
                            top.showAlert("提示", "删除失败", 'error');
                            enableButtion("saveButton");
                        }else{
                            top.showAlert("提示", data.msg, 'info');
                            enableButtion("saveButton");
                        }
                    },
                    error : function(data) {
                        top.showAlert('错误', '删除出错', 'info');
                    }
                });
            }
        });
    }
}

/**
 * @desc 查看
 * @param oid 数据ID
 */
function view(oid){
    var rows = $('#gpsContractordatagrid').datagrid('getSelections');
    var dataId = "";
    if(!isNull(oid)){
        dataId = oid;
    }else if (rows.length == 1){
        dataId = rows[0].oid;
    }else{
        top.showAlert("提示","请选中一条记录",'info');
        return;
    }
    top.getDlg("view_gps_contractor.html?oid="+dataId,"viewGpsContractor","详细",800,600,false,true,true);
}

/**
 * 定位
 * @returns
 */
function locationSelect( oid, lon, lat ){
    /* 显示地图 地图打开中 */
    top.map.show = true;
    let array = [];
    let per = {};
    per.oid = oid;
    per.lon = lon;
    per.lat = lat;
    per.type = "construction";
    array.push( per );

    let option = {};
    option.layerId = "1";
    option.url = 'images/map_contractor_construction.png';
    option.width = 24;
    option.height = 24;
    top.position.positionArray = JSON.stringify(array)+'&^'+JSON.stringify(option);

}


/**
 * 定位选中，在导航栏。
 */
function positionSelectOnTop( param ){

    let rows = $('#gpsContractordatagrid').datagrid('getSelections');
    var idArray = [];

    /* 定位所有 */
    if(param != 'all'){
        // 找到所有被选中行
        if(rows.length<1){
            $.messager.alert('提示','未选中数据','info');
            return;
        }

        /* 打开地图 */
        top.map.show = true;

        // 遍历取得所有被选中记录的id
        $(rows).each(function(i,obj){
            var idArray = [];
            /* 创建经度纬度JSON */
            let coordinate = {};
            coordinate.lon = obj.lon;
            coordinate.oid = obj.oid;
            coordinate.lat = obj.lat;
            coordinate.type = "construction";
            idArray.push(coordinate);
            let option = {};
            option.layerId = "1";
            option.url = 'images/map_contractor_construction.png';
            option.width = 24;
            option.height = 24;
            top.position.positionArray = JSON.stringify(idArray)+'&^'+JSON.stringify(option);
        });



    } else {

        /* 打开地图 */
        top.map.show = true;

        /* 分页定位，首先获取到所有的数量。 */
        showLoadingMessage("正在获取所有坐标数据数量，请稍后...");
        $.get(rootPath+'/contractor/getPage.do', function( rs ) {
            count = rs.total;
            showLoadingMessage("所有的坐标数量为"+count+"条，数据正在渲染中，请稍后...");
            /* 每页大概传100条数据 */
            let pageSize = 100;
            let pageNo = Math.floor(count/100) + 1;
            for( let i = 1 ; i <= pageNo ; i++ ){
                if ( count <= 100 ) {
                    // showLoadingMessage("正在获取0到"+count+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/contractor/getPage.do?pageNo=1&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;

                                $(allPoint).each(function(i,obj){
                                    var idArray = [];
                                    /* 创建经度纬度JSON */
                                    let coordinate = {};
                                    coordinate.lon = obj.lon;
                                    coordinate.lat = obj.lat;
                                    coordinate.oid = obj.oid;
                                    coordinate.type = "construction";
                                    idArray.push(coordinate);
                                    let option = {};
                                    option.layerId = "1";
                                    option.url = 'images/map_contractor_construction.png';

                                    option.width = 24;
                                    option.height = 24;
                                    top.position.positionArray = JSON.stringify(idArray)+'&^'+JSON.stringify(option);
                                });

                                hiddenLoadingMessage();
                            }
                        }
                    })
                } else if ( i == pageNo) {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+result+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/contractor/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                $(allPoint).each(function(i,obj){
                                    var idArray = [];
                                    /* 创建经度纬度JSON */
                                    let coordinate = {};
                                    coordinate.lon = obj.lon;
                                    coordinate.lat = obj.lat;
                                    coordinate.oid = obj.oid;
                                    coordinate.type = "construction";
                                    idArray.push(coordinate);
                                    let option = {};
                                    option.layerId = "1";
                                    option.url = 'images/map_contractor_construction.png';

                                    option.width = 24;
                                    option.height = 24;
                                    top.position.positionArray = JSON.stringify(idArray)+'&^'+JSON.stringify(option);
                                });

                                hiddenLoadingMessage();
                            }
                        }
                    })
                } else {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+100*i+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/contractor/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                $(allPoint).each(function(i,obj){
                                    var idArray = [];
                                    /* 创建经度纬度JSON */
                                    let coordinate = {};
                                    coordinate.lon = obj.lon;
                                    coordinate.lat = obj.lat;
                                    coordinate.oid = obj.oid;
                                    coordinate.type = "construction";
                                    idArray.push(coordinate);
                                    let option = {};
                                    option.layerId = "1";
                                    option.url = 'images/map_contractor_construction.png';

                                    option.width = 24;
                                    option.height = 24;
                                    top.position.positionArray = JSON.stringify(idArray)+'&^'+JSON.stringify(option);
                                });
                            }
                        }
                    })
                }
            }
        });
    }
}

/**
 *@desc 导出选中
 */
function exportSelect(){
    // 找到所有被选中行
    var rows = $('#gpsContractordatagrid').datagrid('getSelections');
    var idArray = [];
    var url="";
    if(rows.length<1){
        $.messager.alert('提示','未选中数据','info');
        return;
    }
    // 遍历取得所有被选中记录的id
    $(rows).each(function(i,obj){
        idArray.push(obj.oid);
    });
    if(!isNull(idArray)){
        url=addTokenForUrl(rootPath+'/contractor/exportToExcelAction.do?oidList='+idArray);
        $("#exprotExcelIframe").attr("src", url);
    }
}

/**
 * @desc 导出查询
 */
function exportQuery(){
    url=addTokenForUrl(rootPath+'/contractor/exportToExcelAction.do?'+querySerialize);
    $("#exprotExcelIframe").attr("src", url);
}
