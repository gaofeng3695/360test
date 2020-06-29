
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
	$('#13010304').menubutton({menu:'#locationBars'});
	$('#gpsConstructiondatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsconstructionclose/getPage.do",
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
					var opt = '<p class="table-operate"><a class ="a13010304" href="#" title = "定位" onclick="locationSelect(\''+row.coid+'\',' + row.lon+','+row.lat+','+row.riskrating+')">\
								<span class="fa fa-thumb-tack"></span>\
					   			</a></p>';
					return opt;
				}
			},
            {	
				field:"approvestatusname",
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
	    		sortable:true,
	    		resizable:true,
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
		  			var opt = '<p class="table-operate"><a class = "a13010301" href="#" title = "查看" onclick="view(\'' + row.coid+'\')">\
					<span class="fa fa-eye"></span></a>';
					if(row.approvestatus=='02' || row.approvestatus=='04'){
						opt += '<a class = "a13010302" href="#" title = "修改" onclick="update(\'' + row.coid+'\')">\
									<span class="fa fa-edit"></span></a>';
					}
					opt += '</p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_close_gps_construction.html?oid="+indexData.coid,"viewCloseGpsConstruction","详细",800,600,false,true,true);
		},
		onSelect:function(index,indexData){
			var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
			if(rows.length > 1){
				disableButtion("13010302");
				disableButtion("13010301");
				disableButtion("13010305");
				disableButtion("13010306");
				disableButtion("13010303");
				/*var flag = false;
				for(var i=0;i<rows.length;i++){
					if(rows[i].approvestatus!='03'){
						flag = true;
						break;
					}
				}
				if(flag){
					disableButtion("del");
				}else{
					enableButtion("del");
				}*/
			}else{
				enableButtion("13010301");
				if(rows.length == 0){
					enableButtion("13010306");
					enableButtion("13010302");
//					enableButtion("del");
					enableButtion("13010305");
					enableButtion("13010303");
				}else{
					if(rows[0].approvestatus=='01'){//施工上报未关闭
						disableButtion("13010306");
						enableButtion("13010303");//关闭
//						enableButtion("del");
						disableButtion("13010305");
						disableButtion("13010302");//修改
					}else if(rows[0].approvestatus=='02'){//施工上报关闭未提交
						disableButtion("13010306");
						enableButtion("13010302");
//						enableButtion("del");
						enableButtion("13010305");
						disableButtion("13010303");
					}else if(rows[0].approvestatus=='04'){//施工上报关闭已驳回
						enableButtion("13010306");
						disableButtion("13010302");
//						enableButtion("del");
						disableButtion("13010305");
						disableButtion("13010303");
					}else if(rows[0].approvestatus=='05'){//施工上报关闭已审批
						enableButtion("13010306");
						disableButtion("13010302");
//						enableButtion("del");
						disableButtion("13010305");
						disableButtion("13010303");
					}else if(rows[0].approvestatus=='03'){//施工上报关闭审批中
						enableButtion("13010306");
						disableButtion("13010302");
//						disableButtion("del");
						disableButtion("13010305");
						disableButtion("13010303");
					}
				}
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
	comboxid+='approvestatus'+',';
	singleDomainName+='construnctionCloseStatus'+',';
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
 * 风险等级变更
 * @param oid
 * @returns
 */
function constructclose(coid){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(coid)){
		dataId = coid;
	}else if (rows.length == 1){
		dataId = rows[0].coid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	var rsriskrating = rows[0].changeriskrating==null ? rows[0].riskrating : rows[0].changeriskrating;
	top.getDlg("close_gps_construction.html?oid="+dataId+'&rsriskrating='+rsriskrating,
			"closeGpsConstruction","施工关闭",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
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
	top.getDlg("update_close_gps_construction.html?oid="+dataId,"updateCloseGpsConstruction","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsconstruction/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsConstructiondatagrid').datagrid('reload');	
								$('#gpsConstructiondatagrid').datagrid('clearSelections'); 
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
	top.getDlg("view_close_gps_construction.html?oid="+dataId,"viewCloseGpsConstruction","详细",800,600,false,true,true);
}

/**
 * @desc 工作流-提交
 */
function sumbit(){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsConstructiondatagrid').datagrid('getSelected');
		var pkfield = row.oid;
		$.messager.confirm('提示', '提交后不能修改，确定提交?', function(r) {
			if(r){
				$('#13010305').linkbutton('disable');//提交以后 提交按钮禁用
				//设置工作流参数
				var paraArr={
						"unitid": row.closeuserunitid,
						"entityClassName": "cn.jasgroup.jasframework.pipeprotect.construction.entity.GpsConstructionClose"
				};
				var comment = "请求审批";
				var workflowName = "gpsconstructionclose";
				var subject = row.riskratingrealCodeName+"/"+row.projectname;
				var businessEventId=pkfield;
				//开启工作流
				workflow.startWorkflow(businessEventId, workflowName,subject,true,comment,startWorkflowCallback,paraArr);
			}
		});
	}else{
		$.messager.alert('提示','请选中一条记录','info');
	}
}


//流程回调函数
function startWorkflowCallback(result){
	if(result.status==-1){
		top.showAlert('error', "发起流程失败:"+result.msg, 'error');
		return;
	}
	top.showAlert("提示", "发起流程成功!", 'info');
	$('#gpsConstructiondatagrid').datagrid('reload');
	//$('#13010305').linkbutton('enable');
}

/**
 * @desc 回调函数，修改状态
 */
function callbackFun(result){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
	var pkfield = rows[0].oid;
	if (result.success){
		$.messager.alert('正确',result.successMessage,'ok',function(){
			$.ajax({
			    type: "POST",
				url:rootPath+"/gpsconstruction/submitGpsConstruction.do",
				data: {"oid" : pkfield, "approveStatus":"02"},
				async:false,
				dataType:"json",
				success:function(result){
					$('#gpsconstructiondatagrid').datagrid('reload');
				},
				error : function(data) {
					top.showAlert('错误', '提交出错', 'info');
				}
			});
		});
	} else {
		$.messager.alert('提示',"已提交审核，不能重复提交",'info');
	}
}

/**
 * @desc 查看流程图
 */
function viewWorkflow(){
	var rows = $('#gpsConstructiondatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsConstructiondatagrid').datagrid('getSelected');
		var pkfield = row.oid;
		var workflowName = "gpsconstructionclose";
		var businessEventId=pkfield;
		top.getDlg(workflow.page.workflowChart.url+"?"+'businessKey='+businessEventId+"&processKey="+workflowName, 
				workflow.page.workflowChart.id, '第三方施工关闭流程图',
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
        $.get(rootPath+'/gpsconstructionclose/getPage.do', function( rs ) {
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
                        url: rootPath+'/gpsconstructionclose/getPage.do?pageNo=1&&pageSize='+pageSize,
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
                        url: rootPath+'/gpsconstructionclose/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
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
                        url: rootPath+'/gpsconstructionclose/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
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
