
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
var user = JSON.parse(localStorage.getItem("user"));
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#13020105').menubutton({menu:'#locationBars'});
//	$('#export').menubutton({menu:'#exportBars'}); 
	$('#gpsEventdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsevent/getPage.do",
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
					var opt = '<p class="table-operate"><a class ="a13020105" href="#" title = "定位" onclick="locationSelect(\''+row.oid+'\', ' + row.lon+','+row.lat+')">\
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
	    		width:"100",
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
	    		width:"80",
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
	    		width:"100",
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

			{	
				field:"constructionidname",
	    		title:"第三方施工项目名称",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

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
	    		width:"180",
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
		  			var opt = '<p class="table-operate"><a class = "a13020101" href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span></a>';
					if(row.approvestatus=='01' || row.approvestatus=='03'){
						opt += '<a class = "a13020103" href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
									<span class="fa fa-edit"></span></a>';
						if(row.approvestatus=='01'){
							opt += '<a class = "a13020104" href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
										<span class="fa fa-minus"></span></a>';
						}
					}
					opt += '</p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_event.html?oid="+indexData.oid,"viewGpsEvent","详细",800,600,false,true,true);
		},
		onSelect:function(index,indexData){
			var rows = $('#gpsEventdatagrid').datagrid('getSelections');
			if(rows.length > 1){
				disableButtion("13020103");
				disableButtion("13020101");
				disableButtion("13020106");
				disableButtion("13020107");
				var flag = false;
				for(var i=0;i<rows.length;i++){
					if(rows[i].approvestatus!='01'){
						flag = true;
						break;
					}
				}
				if(flag){
					disableButtion("13020104");
				}else{
					enableButtion("13020104");
				}
			}else{
				enableButtion("13020101");
				if(rows.length == 0){
					enableButtion("13020107");
					enableButtion("13020103");
					enableButtion("13020104");
					enableButtion("13020106");
					enableButtion("13020101");
				}else{
					if(rows[0].approvestatus=='01'){
						enableButtion("13020107");
						enableButtion("13020103");
						enableButtion("13020104");
						enableButtion("13020106");
					}else if(rows[0].approvestatus=='03'){
						enableButtion("13020107");
						enableButtion("13020103");
						disableButtion("13020104");
						disableButtion("13020106");
					}else{
						enableButtion("13020107");
						disableButtion("13020103");
						disableButtion("13020104");
						disableButtion("13020106");
					}
				}
			}

			/* 如果创建人的ID与登录用户ID不一致，就禁用提交流程按钮。 */
			if( rows[0].createUserId != user.oid) {
				disableButtion("13020106");
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
	comboxid+='approvestatus'+',';
	singleDomainName+='eventStatus'+',';
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
			setComboObjWidth(id,0.15,'combobox');
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
			setComboObjWidth(id,0.15,'combobox');
		}
	}
}
/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_event.html","addGpsEvent","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_event.html?oid="+dataId,"updateGpsEvent","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsevent/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsEventdatagrid').datagrid('reload');	
								$('#gpsEventdatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_event.html?oid="+dataId,"viewGpsEvent","详细",800,600,false,true,true);
}

/**
 * @desc 工作流-提交
 */
function sumbit(){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsEventdatagrid').datagrid('getSelected');
		var pkfield = row.oid;
		$.messager.confirm('提示', '提交后不能修改，确定提交?', function(r) {
			if(r){
				$('#13020106').linkbutton('disable');//提交以后 提交按钮禁用	
				//设置工作流参数
				var paraArr={
					"unitid": row.unitid,
					"entityClassName": "cn.jasgroup.jasframework.pipeprotect.gpsevent.entity.GpsEvent"
				};
				var comment = "请求审批";
				var workflowName="gpsevent";
				var subject=row.eventtypeCodeName+"/"+row.occurrencesite;
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
	$('#gpsEventdatagrid').datagrid('reload');
	$('#sub').linkbutton('enable');
}

/**
 * @desc 回调函数，修改状态
 */
function callbackFun(result){
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	var pkfield = rows[0].oid;
	if (result.success){
		$.messager.alert('正确',result.successMessage,'ok',function(){
			$.ajax({
			    type: "POST",
				url:rootPath+"/gpsevent/submitGpsEvent.do",
				data: {"oid" : pkfield},
				async:false,
				dataType:"json",
				success:function(result){
					$('#gpseventdatagrid').datagrid('reload');
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
	var rows = $('#gpsEventdatagrid').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#gpsEventdatagrid').datagrid('getSelected');
		var pkfield = row.oid;
		var workflowName = "gpsevent";
		var businessEventId=pkfield;
		top.getDlg(workflow.page.workflowChart.url+"?"+'businessKey='+businessEventId+"&processKey="+workflowName, 
				workflow.page.workflowChart.id, '巡检事件上报流程图',
				workflow.page.workflowChart.w , workflow.page.workflowChart.h);
	}else{
		workflow.tipChooseRecored();
	}
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
            coordinate.oid = obj.oid;
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
        $.get(rootPath+'/gpsevent/getPage.do', function( rs ) {
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
                        url: rootPath+'/gpsevent/getPage.do?pageNo=1&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                for( let k = 0 ; k < allPoint.length ; k++ ){
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
                        url: rootPath+'/gpsevent/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
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
                        url: rootPath+'/gpsevent/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                for( let k = 0 ; k < allPoint.length ; k++ ){
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

