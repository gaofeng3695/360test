
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
	$('#13020402').menubutton({menu:'#locationBars'});
	$('#13020404').menubutton({menu:'#exportBars'});
	$('#gpsEventdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpseventinfo/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {
		  		field:'locationXY',
		  		title:'定位',
		  		align:"center",
		  		width:"50",
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a class ="a13020402" href="#" title = "定位" onclick="locationSelect(\''+row.eventoid+'\', ' + row.lon+','+row.lat+')">\
								<span class="fa fa-thumb-tack"></span>\
					   			</a></p>';
					return opt;
				}
			},
            {
				field:"infoapprovestatusname",
	    		title:"审核状态",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
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
				field:"reportpersonname",
	    		title:"上报人",
	    		width:"90",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"occurrencetime",
	    		title:"事件发生日期",
	    		width:"100",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},

			{	
				field:"occurrencesite",
	    		title:"事件发生地点",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"eventtypeCodeName",
	    		title:"事件类型",
	    		width:"90",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			/*{	
				field:"constructionidname",
	    		title:"第三方施工项目名称",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},*/

			/*{	
				field:"lon",
	    		title:"位置经度",
	    		width:"120",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"lat",
	    		title:"位置纬度",
	    		width:"120",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},*/

			{	
				field:"keypointnamename",
	    		title:"临时关键点",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			/*{	
				field:"solution",
	    		title:"解决方案",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/

			{	
				field:"guardianname",
	    		title:"事件监护人",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"closestartpersonname",
	    		title:"关闭发起人",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"solvingdate",
	    		title:"问题解决日期",
	    		width:"100",
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
		  			var opt = '<p class="table-operate"><a class ="a13020401" href="#" title = "查看" onclick="view(\'' + row.eventoid+'\')">\
									<span class="fa fa-eye"></span></a>';
					opt += '</p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_info_gps_eventcanclose.html?eventoid="+indexData.eventoid,"viewInfoGpsEvent","详细",800,600,false,true,true);
		},
		onClickRow:function(index,indexData){
			var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
			if(rows.length > 1){
				disableButtion("13020401");
				disableButtion("13020403");
			}else{
				enableButtion("13020401");
				enableButtion("13020403");
			}
		},
		onLoadSuccess:function(data){
	    	$('#gpsEventdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsEventdatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='infoapprovestatus'+',';
	singleDomainName+='eventInfoStatus'+',';
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsEventdatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsEventdatagrid','queryDiv',64);
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
			setComboObjWidth(id,0.145,'combobox');
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
			setComboObjWidth(id,0.145,'combobox');
		}
	}
}

/**
 * @desc 查看
 * @param oid 数据ID 
 */
function view(eventoid){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(eventoid)){
		dataId = eventoid;
	}else if (rows.length == 1){
		dataId = rows[0].eventoid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_info_gps_eventcanclose.html?eventoid="+dataId,"viewInfoGpsEvent","详细",800,600,false,true,true);
}


/**
 * @desc 查看流程图
 */
function viewWorkflow(){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsEventdatagrid').datagrid('getSelected');
		var workflowName = "";
		var businessEventId="";
		var title = "";
		if(rows[0].closeapprovestatus){
			workflowName = "workflow_close_gpsevent";
			businessEventId = rows[0].closeoid;
			title = "巡检事件关闭流程图";
		}else if(rows[0].eventapprovestatus){
			workflowName = "workflow_gpsevent";
			businessEventId = rows[0].eventoid;
			title = "巡检事件上报流程图";
		}
		top.getDlg(workflow.page.workflowChart.url+"?"+'businessKey='+businessEventId+"&processKey="+workflowName, 
				workflow.page.workflowChart.id, title,
				workflow.page.workflowChart.w , workflow.page.workflowChart.h);
	}else{
		workflow.tipChooseRecored();
	}
}


/**
 *@desc 导出选中
 */
function exportSelect(){
	// 找到所有被选中行
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
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
		url=addTokenForUrl(rootPath+'/gpseventinfo/exportToExcelAction.do?oidList='+idArray);
		$("#exprotExcelIframe").attr("src", url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	url=addTokenForUrl(rootPath+'/gpseventinfo/exportToExcelAction.do?'+querySerialize);
	$("#exprotExcelIframe").attr("src", url);
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
    per.type = 'event';
    array.push( per );
    let option = {};
    option.layerId = "1";
    option.url = 'images/map_event.png';
    option.width = 24;
    option.height = 24;
    top.position.positionArray = JSON.stringify(array)+'&^'+JSON.stringify(option);

}


/**
 * 定位选中，在导航栏。
 */
function positionSelectOnTop( param ){

    let rows = $('#gpsEventdatagrid').datagrid('getSelections');
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
            coordinate.lon = obj.lon;
            coordinate.lat = obj.lat;
            coordinate.oid = obj.eventoid;
            coordinate.type = 'event';
            idArray.push(coordinate);
        });

        let option = {};
        option.layerId = "1";
        option.url = 'images/map_event.png';
        option.width = 24;
        option.height = 24;
        top.position.positionArray = JSON.stringify(idArray)+'&^'+JSON.stringify(option);

    } else {

        /* 打开地图 */
        top.map.show = true;

        /* 分页定位，首先获取到所有的数量。 */
        showLoadingMessage("正在获取所有坐标数据数量，请稍后...");
        $.get(rootPath+'/gpseventinfo/getPage.do', function( rs ) {
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
                        url: rootPath+'/gpseventinfo/getPage.do?pageNo=1&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                for( let k = 0 ; k < allPoint.length ; k++ ){
                                    allPoint[k].oid = allPoint[k].eventoid;
                                    allPoint[k].type = 'event';
								}
                                let option = {};
                                option.layerId = "1";
                                option.url = 'images/map_event.png';
                                option.width = 24;
                                option.height = 24;
                                top.position.positionArray = JSON.stringify(allPoint)+'&^'+JSON.stringify(option);

                                hiddenLoadingMessage();
                            }
                        }
                    })
                } else if ( i == pageNo) {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+result+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpseventinfo/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                let option = {};
                                option.layerId = "1";
                                option.url = 'images/map_event.png';
                                option.width = 24;
                                option.height = 24;
                                top.position.positionArray = JSON.stringify(allPoint)+'&^'+JSON.stringify(option);

                                for( let k = 0 ; k < allPoint.length ; k++ ){
                                    allPoint[k].oid = allPoint[k].eventoid;
                                    allPoint[k].type = 'event';
                                }
                                hiddenLoadingMessage();
                            }
                        }
                    })
                } else {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+100*i+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpseventinfo/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                for( let k = 0 ; k < allPoint.length ; k++ ){
                                    allPoint[k].oid = allPoint[k].eventoid;
                                    allPoint[k].type = 'event';
                                }
                                let option = {};
                                option.layerId = "1";
                                option.url = 'images/map_event.png';
                                option.width = 24;
                                option.height = 24;
                                top.position.positionArray = JSON.stringify(allPoint)+'&^'+JSON.stringify(option);
                            }
                        }
                    })
                }
            }
        });

    }

}

