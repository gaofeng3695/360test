
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
	var user = JSON.parse(sessionStorage.user);
	$('#10030307').menubutton({menu:'#exportBars'});

    $('#10030305').menubutton({menu:'#locationBars'});
	$('#gpsMarkerBranddatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsmarkerbrand/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {
                field:'location',
                title:'定位',
                align:"center",
                width:"50",
                formatter: function(value,row,index){
                    var opt = '<p class="table-operate"><a class ="a10030305" href="#" title = "定位" onclick="locationSelect(\''+row.oid+'\',\'' + row.coordinateInfo+'\')">\
								<span class="fa fa-thumb-tack"></span>\
					   			</a></p>';
                    return opt;
                }
            },
            {
                field:"unitName",
                title:"部门名称",
                width:"200",
                resizable:true,
                sortable:true,
                align:'center'
            },

            {
                field:"lineloopoName",
                title:"管线名称",
                width:"200",
                resizable:true,
                sortable:true,
                align:'center'
            },

            {
                field:"brandTypeName",
                title:"类型",
                width:"100",
                resizable:true,
                sortable:true,
                align:'center'
            },
			{
                field:"inspectorName",
                title:"巡检人员",
                width:"150",
                resizable:true,
                sortable:true,
                align:'center'
            }
		]],
		columns: 
		[[
			/*{
				field:"coordinateInfo",
	    		title:"坐标信息",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},*/

			{
				field:"markerName",
	    		title:"信息编号",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
            {
                field:"markerStation",
                title:"里程",
                width:"150",
                resizable:true,
                sortable:true,
                align:'center'
            },
			{
                field:"geographicalPosition",
                title:"地理位置信息",
                width:"250",
                resizable:true,
                sortable:true,
                align:'center'
            },
			{
                field:"statisticsDate",
                title:"统计日期",
                width:"120",
                resizable:true,
                sortable:true,
                align:'center'
            },
			{
                field:"intackConditionName",
                title:"完好情况",
                width:"200",
                resizable:true,
                sortable:true,
                align:'center'
            }/*,

		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"150",
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a href="#" class = "a10030301" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span>\
							   </a><a class = "a10030303" href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
									<span class="fa fa-edit"></span>\
						   	   </a><a class = "a10030304" href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
									<span class="fa fa-minus"></span>\
						       </a></p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_marker_brand.html?oid="+indexData.oid,"viewGpsMarkerBrand","详细",900,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsMarkerBranddatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsMarkerBranddatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='brandType,intackCondition'+',';
	singleDomainName+='markerbrand,intack'+",";
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsMarkerBranddatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsMarkerBranddatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	/* 以下初始化查询面板 */
    /* 部门 */
    initUnitComboTreeLocal('unitid');
    setComboObjWidth('unitid',0.172,'combobox');
	//初始化管线
	initLineLoopCombobox('lineloopoid');
	//初始化起始位置、终止位置面板
	showPan('pointstationStart','pointstationEnd','beginStation','endStation');
	
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
						$('#'+id).combobox('setValue',data[0].codeId);
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
						//$('#'+id).combobox('setValue',data[0].codeId);
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
	top.getDlg("save_gps_marker_brand.html","addGpsMarkerBrand","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsMarkerBranddatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_marker_brand.html?oid="+dataId,"updateGpsMarkerBrand","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsMarkerBranddatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsmarkerbrand/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsMarkerBranddatagrid').datagrid('reload');
								$('#gpsMarkerBranddatagrid').datagrid('clearSelections');
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
	var rows = $('#gpsMarkerBranddatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_marker_brand.html?oid="+dataId,"viewGpsMarkerBrand","详细",900,400,false,true,true);
}

/**
 *@desc 导出选中
 */
function exportSelect(){
	var templateCode = "export_xxxx";//导出模板编号
	// 找到所有被选中行
	var rows = $('#gpsMarkerBranddatagrid').datagrid('getSelections');
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
        url=addTokenForUrl(rootPath+'/gpsmarkerbrand/exportToExcelAction.do?oidList='+idArray);
        $("#exprotExcelIframe").attr("src", url);
    }
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	var templateCode = "export_xxxx";//导出模板编号
	// querySerialize =$("#queryForm").serializeToJson();
	var url =addTokenForUrl(rootPath+'/gpsmarkerbrand/exportToExcelAction.do?'+$('#queryForm').serialize());
	$("#exprotExcelIframe").attr("src",url);
}

/**
 * @desc 导入
 */
function importData(){
    var funcName = "三桩一牌信息管理模板";	// 导入模板功能名称
    top.getDlg(rootPath+"jasframework/components/excel/importExcelData.htm?tableName=gps_marker_brand&callerPageUrl=query_gps_marker_brand.html&datagridElementId=gpsMarkerBranddatagrid&functionName="+encodeURI(encodeURI(funcName)),"importiframe","导入",700,410);
}

/**
 * @desc 下载导入模板
 */
function downloadExcel(){
    var funcName="三桩一牌信息管理模板";    // 导入模板功能名称
    var postUrl = addTokenForUrl(rootPath+'jasframework/excel/downloadExcelTemplate.do?functionName='+encodeURI(encodeURI(funcName)));
    $("#exprotExcelIframe").attr("src",postUrl);
}


/**
 * 定位
 * @returns
 */
function locationSelect( oid, coordinateInfo ){
    let coo = coordinateInfo.split(',');
	let lon = coo[0];
	let lat = coo[1];
    /* 显示地图 地图打开中 */
    top.map.show = true;
    let array = [];
    let per = {};
    per.oid = oid;
    per.lon = lon;
    per.lat = lat;
    array.push( per );
    top.position.positionArray = JSON.stringify(array);

}

/**
 * 定位选中，在导航栏。
 */
function positionSelectOnTop( param ){

    let rows = $('#gpsMarkerBranddatagrid').datagrid('getSelections');
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
            /* 创建经度纬度JSON */
            let coordinate = {};
            coordinate.lon = obj.coordinateInfo.split(',')[0];
            coordinate.lat = obj.coordinateInfo.split(',')[1];
            idArray.push(coordinate);
        });

        top.position.positionArray = JSON.stringify(idArray);

    } else {

        /* 打开地图 */
        top.map.show = true;

        /* 分页定位，首先获取到所有的数量。 */
        showLoadingMessage("正在获取所有坐标数据数量，请稍后...");
        $.get(rootPath+'/gpsmarkerbrand/getPage.do', function( rs ) {
        	let count = rs.total;
            showLoadingMessage("所有的坐标数量为"+count+"条，数据正在渲染中，请稍后...");
            /* 每页大概传100条数据 */
            let pageSize = 100;
            let pageNo = Math.floor(count/100) + 1;
            for( let i = 1 ; i <= pageNo ; i++ ){
                if ( count <= 100 ) {
                    // showLoadingMessage("正在获取0到"+count+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpsmarkerbrand/getPage.do?pageNo=1&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                let allPoint = [];
                                for (let g= 0 ; g < result.rows.length ; g++ ) {
                                	let point = {};
                                    point.lon = result.rows[g].coordinateInfo.split(',')[0];
                                    point.lat = result.rows[g].coordinateInfo.split(',')[1];
                                    point.oid = result.rows[g].oid;
                                    allPoint.push(point);
                                }

                                top.position.positionArray = JSON.stringify(allPoint);
                                hiddenLoadingMessage();
                            }
                        }
                    })
                } else if ( i == pageNo) {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+result+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpsmarkerbrand/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                let allPoint = [];
                                for (let g= 0 ; g < result.rows.length ; g++ ) {
                                    let point = {};
                                    point.lon = result.rows[g].coordinateInfo.split(',')[0];
                                    point.lat = result.rows[g].coordinateInfo.split(',')[1];
                                    point.oid = result.rows[g].oid;
                                    allPoint.push(point);
                                }
                                top.position.positionArray = JSON.stringify(allPoint);

                                hiddenLoadingMessage();
                            }
                        }
                    })
                } else {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+100*i+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpsmarkerbrand/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                let allPoint = [];
                                for (let g= 0 ; g < result.rows.length ; g++ ) {
                                    let point = {};
                                    point.lon = result.rows[g].coordinateInfo.split(',')[0];
                                    point.lat = result.rows[g].coordinateInfo.split(',')[1];
                                    point.oid = result.rows[g].oid;
                                    allPoint.push(point);
                                }
                                top.position.positionArray = JSON.stringify(allPoint);
                            }
                        }
                    })
                }
            }
        });

    }

}


/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTreeLocal(unitid){
    /* 以下初始化查询面板 */
    /* 部门 */
    $('#'+unitid).combotree({
        panelHeight:150,
        editable:true,
        mode:'remote',
        valueField : "oid",
        textField : "unitName",
        onLoadSuccess:function(node,data){
            /* 初始化部门 */
            $('#unitid').combotree('setValue',user.unitId);
         //   initInspection(user.unitId);
        },
        onSelect : function(row){
            /* 加载人员 */
            //initInspection(row.id);
        }
    });
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        console.log(result);

        $('#'+unitid).combotree('loadData', result.data);
    })
    setComboObjWidth(unitid,0.172,'combobox');
}

/**
 * 初始化巡检人员
 * @returns
 */
function initInspection(unitId){
    /* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
    $('#inspectorid').combobox({
        panelHeight:150,
        editable:true,
        mode:'remote',
        url : rootPath+'/xncommon/getUnitUserChildren.do?unitId='+unitId+'&inspectortype=01',
        valueField : "codeid",
        textField : "codename",
        onLoadSuccess:function(data){

        },
        onSelect : function(row){
        }
    });
    setComboObjWidth("inspectorid",0.145,'combobox');
}