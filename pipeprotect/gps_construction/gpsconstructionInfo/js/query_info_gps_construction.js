
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
	$('#13010502').menubutton({menu:'#locationBars'});
	$('#13010504').menubutton({menu:'#exportBars'});
	$('#gpsConstructiondatagrid').datagrid({
		idField:'coid',
		url: rootPath+"/gpsconstructioninfo/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		//设置行样式 （datagrid的属性）
		rowStyler: function (index, row) {
			var arr = [0,1,2,3,4,5,6,7];
			if(arr.indexOf(row.infoapprovestatus) > -1 && row.projectProgressStatus == '1' ){//则包含该元素}
				return 'color:red;';
			}
		},
		frozenColumns:[[
            {field:'ck',checkbox:true},
			{
				field:"oid",
				hidden:true
			},
            {
		  		field:'locationXY',
		  		title:'定位',
		  		align:"center",
		  		width:"50",
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a class ="a13010502" href="#" title = "定位" onclick="locationSelect(\''+row.coid+'\', ' + row.lon+','+row.lat+','+row.riskrating+')">\
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
				field:"projectname",
	    		title:"第三方施工项目名称",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{
				field:"progressidCodeName",
	    		title:"工程进展",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{
				field:"distanceline",
	    		title:"距离管线长度(m)",
	    		width:"60",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"riskratingCodeName",
	    		title:"风险等级",
	    		width:"60",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"changedistanceline",
	    		title:"距离管线长度(变更)",
	    		width:"60",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"changeriskratingCodeName",
	    		title:"风险等级(变更)",
	    		width:"60",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
			{
				field:"progressidModifyDatetime",
				title:"施工进度更新日期",
				width:"150",
				resizable:true,
				sortable:true,
				align:'center',
				formatter:function (value,row,index) {
					if (value == null){
						return "";
					}else{
						return value;
					}

				}
			},
	    	{	
				field:"constructreasonname",
	    		title:"施工原因",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			/*{
				field:"location",
	    		title:"施工地点",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"stakenumname",
	    		title:"桩号",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"lon",
	    		title:"位置经度",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"lat",
	    		title:"位置纬度",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/

			{	
				field:"happenbegindate",
	    		title:"施工开始日期",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"closedate",
	    		title:"施工关闭日期",
	    		width:"150",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			/*{	
				field:"constructunit",
	    		title:"建设（施工）单位名称",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"constructunituser",
	    		title:"建设（施工）单位联系人及联系方式",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},

	    	{	
				field:"temporarykeypointoidname",
	    		title:"临时关键点",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},
	    	
			{	
				field:"progressidCodeName",
	    		title:"工程进展",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	},*/

			{	
				field:"stationuser",
	    		title:"输油站现场负责人及其电话",
	    		width:"200",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"inspectoroidname",
	    		title:"现场监护人员",
	    		width:"200",
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
	    	}/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"150",
		  		formatter: function(value,row,index){
		  			var opt = '<p class="table-operate"><a class = "a13010501" href="#" title = "查看" onclick="view(\'' + row.coid+'\')"><span class="fa fa-eye"></span></a>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_info_gps_constructioncanclose.html?oid="+indexData.coid,"viewInfoGpsConstruction","详细",800,600,false,true,true);
		},
		onClickRow:function(index,indexData){
			var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
			if(rows.length > 1){
				disableButtion("13010501");
				disableButtion("13010503");
			}else{
				enableButtion("13010501");
				enableButtion("13010503");
			}
		},
		onLoadSuccess:function(data){
	    	$('#gpsConstructiondatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsConstructiondatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='changeriskrating'+',';
	singleDomainName+='construnctionRiskLevel'+',';
	comboxid+='riskrating'+',';
	singleDomainName+='construnctionRiskLevel'+',';
	comboxid+='infoapprovestatus'+',';
	singleDomainName+='construnctionInfoStatus'+',';
	comboxid+='progressid'+',';
	singleDomainName+='construnctionProgress'+',';
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsConstructiondatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsConstructiondatagrid','queryDiv',64);
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
	setComboObjWidth('lineloopoid',0.20,'combobox');
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
			if (id == 'progressid'){
				setComboObjWidth(id,0.122,'combobox');
			}else {
				setComboObjWidth(id,0.22,'combobox');
			}
		}
	}
}

/**
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].coid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_info_gps_constructioncanclose.html?oid="+dataId,"viewInfoGpsConstruction","详细",800,600,false,true,true);
}

/**
 * @desc 查看流程图
 */
function viewWorkflow(){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsConstructiondatagrid').datagrid('getSelected');
		var pkfield = '';
		var workflowName = '';
		var name = ''
		var rsriskrating = '';
		if(row.changeriskrating){
			rsriskrating = row.changeriskrating;
		}else if(row.riskrating){
			rsriskrating = row.riskrating;
		}
		
		if(row.closeapprovestatus){
			pkfield = row.closeoid;
			name = '第三方施工关闭流程图';
			if(rsriskrating == '01'){
				workflowName="workflow_close_gpsconstruction_red";
			}else{
				workflowName="workflow_close_gpsconstruction";
			}
		}else{
			if(row.changeapprovestatus){
				pkfield = row.changeoid;
				name = '第三方施工风险等级变更流程图';
				if(rsriskrating == '01'){
					workflowName="workflow_change_gpsconstruction_red";
				}else{
					workflowName="workflow_change_gpsconstruction";
				}
			}else if(row.submitapprovestatus){
				pkfield = row.coid;
				name = '第三方施工上报流程图';
				if(rsriskrating == '01'){
					workflowName="workflow_gpsconstruction_red";
				}else{
					workflowName="workflow_gpsconstruction";
				}
			}
		}
		
		
		var businessEventId=pkfield;
		top.getDlg(workflow.page.workflowChart.url+"?"+'businessKey='+businessEventId+"&processKey="+workflowName, 
				workflow.page.workflowChart.id, name,
				workflow.page.workflowChart.w , workflow.page.workflowChart.h);
	}else{
		workflow.tipChooseRecored();
	}
}

/**
 * 定位
 * @returns
 */
function locationSelect( oid, lon, lat, riskrating ){
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
    if(riskrating == '1') {
        option.url = 'images/map_rwarn.png';
    } else if( riskrating == '2') {
        option.url = 'images/map_ywarn.png';
    } else if( riskrating == '3') {
        option.url = 'images/map_bwarn.png';
    } else {
        option.url = 'images/map_rwarn.png';
    }

    option.width = 24;
    option.height = 24;
    top.position.positionArray = JSON.stringify(array)+'&^'+JSON.stringify(option);

}


/**
 * 定位选中，在导航栏。
 */
function positionSelectOnTop( param ){

    let rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
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
            idArray = [];
            /* 创建经度纬度JSON */
            let coordinate = {};
            coordinate.lon = obj.lon;
            coordinate.oid = obj.coid;
            coordinate.lat = obj.lat;
            coordinate.type = "construction";
            idArray.push(coordinate);
            let option = {};
            option.layerId = "1";
            if(obj.riskrating == '01') {
                option.url = 'images/map_rwarn.png';
            } else if( obj.riskrating == '02') {
                option.url = 'images/map_ywarn.png';
            } else if( obj.riskrating == '03') {
                option.url = 'images/map_bwarn.png';
            } else {
                option.url = 'images/map_rwarn.png';
            }

            option.width = 24;
            option.height = 24;
            top.position.positionArray = JSON.stringify(idArray)+'&^'+JSON.stringify(option);
        });

    } else {

        /* 打开地图 */
        top.map.show = true;

        /* 分页定位，首先获取到所有的数量。 */
        showLoadingMessage("正在获取所有坐标数据数量，请稍后...");
        $.get(rootPath+'/gpsconstructioninfo/getPage.do', function( rs ) {
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
                        url: rootPath+'/gpsconstructioninfo/getPage.do?pageNo=1&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                for( let k = 0 ; k < allPoint.length ; k++ ){
                                    allPoint[k].oid = allPoint[k].coid;
								}
                                $(allPoint).each(function(i,obj){
                                    var idArray = [];
                                    /* 创建经度纬度JSON */
                                    let coordinate = {};
                                    coordinate.lon = obj.lon;
                                    coordinate.lat = obj.lat;
                                    coordinate.oid = obj.coid;
                                    coordinate.type = "construction";
                                    idArray.push(coordinate);
                                    let option = {};
                                    option.layerId = "1";
                                    if(obj.riskrating == '01') {
                                        option.url = 'images/map_rwarn.png';
                                    } else if( obj.riskrating == '02') {
                                        option.url = 'images/map_ywarn.png';
                                    } else if( obj.riskrating == '03') {
                                        option.url = 'images/map_bwarn.png';
                                    } else {
                                        option.url = 'images/map_rwarn.png';
                                    }

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
                        url: rootPath+'/gpsconstructioninfo/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;

                                for( let k = 0 ; k < allPoint.length ; k++ ){
                                    allPoint[k].oid = allPoint[k].coid;
                                }

                                $(allPoint).each(function(i,obj){
                                    var idArray = [];
                                    /* 创建经度纬度JSON */
                                    let coordinate = {};
                                    coordinate.lon = obj.lon;
                                    coordinate.lat = obj.lat;
                                    coordinate.oid = obj.coid;
                                    coordinate.type = "construction";
                                    idArray.push(coordinate);
                                    let option = {};
                                    option.layerId = "1";
                                    if(obj.riskrating == '01') {
                                        option.url = 'images/map_rwarn.png';
                                    } else if( obj.riskrating == '02') {
                                        option.url = 'images/map_ywarn.png';
                                    } else if( obj.riskrating == '03') {
                                        option.url = 'images/map_bwarn.png';
                                    } else {
                                        option.url = 'images/map_rwarn.png';
                                    }

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
                        url: rootPath+'/gpsconstructioninfo/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                for( let k = 0 ; k < allPoint.length ; k++ ){
                                    allPoint[k].oid = allPoint[k].coid;
                                }
                                $(allPoint).each(function(i,obj){
                                    var idArray = [];
                                    /* 创建经度纬度JSON */
                                    let coordinate = {};
                                    coordinate.lon = obj.lon;
                                    coordinate.lat = obj.lat;
                                    coordinate.oid = obj.coid;
                                    coordinate.type = "construction";
                                    idArray.push(coordinate);
                                    let option = {};
                                    option.layerId = "1";
                                    if(obj.riskrating == '01') {
                                        option.url = 'images/map_rwarn.png';
                                    } else if( obj.riskrating == '02') {
                                        option.url = 'images/map_ywarn.png';
                                    } else if( obj.riskrating == '03') {
                                        option.url = 'images/map_bwarn.png';
                                    } else {
                                        option.url = 'images/map_rwarn.png';
                                    }

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
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
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
		url=addTokenForUrl(rootPath+'/gpsconstructioninfo/exportToExcelAction.do?oidList='+idArray);
		$("#exprotExcelIframe").attr("src", url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	url=addTokenForUrl(rootPath+'/gpsconstructioninfo/exportToExcelAction.do?'+querySerialize);
	$("#exprotExcelIframe").attr("src", url);
}


/**
 *updateProjectProgress  更新项目进度界面
 */
function updateProjectProgress(){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
	if (rows.length != 1){
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg(encodeURI("project_progress/query_project_progress.html?oid="+rows[0].oid),"queryProjectProgress","项目进度",800,600,false,true,true);
}
