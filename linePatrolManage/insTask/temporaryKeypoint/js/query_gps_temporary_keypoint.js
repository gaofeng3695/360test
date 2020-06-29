
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
var user = JSON.parse(sessionStorage.user);
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
    /* 得到今天的格式化字符串 */
    var today = new Date().Format("yyyy-MM-dd");
	$('#10040206').menubutton({menu:'#exportBars'});
	$('#10040205').menubutton({menu:'#locationBars'});
	$('#gpsTemporaryKeypointdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpstemporarykeypoint/getPage.do",
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
					var opt = '<p class="table-operate"><a class ="a10040205" href="#" title = "定位" onclick="locationSelect(\''+row.oid+'\',' + row.lon+','+row.lat+')">\
								<span class="fa fa-thumb-tack"></span>\
					   			</a></p>';
					return opt;
				}
			},
            {	
				field:"unitname",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
	    	},
            {
                field:"lineloopoName",
                title:"管线名称",
                width:"100",
                resizable:true,
                sortable:true,
                align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
            },
	    	{	
				field:"pointname",
	    		title:"关键点名称",
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
	    	},
	    	{	
				field:"pointtypeName",
	    		title:"关键点类型",
	    		width:"100",
	    		resizable:true,
    			sortable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
            }
		]],
		columns: 
		[[
			{
	    		field:"insfreqName",
	    		title:"巡检频次",
	    		width:"60",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
	    	},
            /*{
                field:"lon",
                title:"经度",
                width:"150",
                resizable:true,
                sortable:true,
                align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
            },
            {
                field:"lat",
                title:"纬度",
                width:"150",
                resizable:true,
                sortable:true,
                align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
            }
            ,*/
			{	
				field:"effectivebegindate",
	    		title:"有效起始日期",
	    		width:"100",
	    		sortable:true,
	    		resizable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
	    	},

			{	
				field:"effectiveenddate",
	    		title:"有效终止日期",
	    		sortable:true,
	    		width:"100",
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
	    	},

			{
				field:"inspectorName",
	    		title:"巡检人员名称",
	    		width:"100",
	    		sortable:true,
	    		resizable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
	    	},
			{
				field:"buffer",
				title:"缓冲范围（m）",
				width:"100",
				sortable:true,
				resizable:true,
				align:'center',
				styler:function(value,row,index){
					if(row.effectiveenddate == today){
						return 'color:red;';
					}
				}
			},
            {
                field:"residentTime",
                title:"驻留时间",
                width:"60",
                sortable:true,
                resizable:true,
                align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
            },
	    	{
	    		field:"confirmorName",
	    		title:"制定人名称",
	    		width:"120",
	    		sortable:true,
	    		resizable:true,
	    		align:'center',
                styler:function(value,row,index){
                    if(row.effectiveenddate == today){
                        return 'color:red;';
                    }
                }
	    	},
			{
				field:"modifyDatetime",
				title:"最后修改时间",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{
				field:"createDatetime",
				title:"创建时间",
				width:"130",
				resizable:true,
				sortable:true,
				align:'center',
				styler:function(value,row,index){
					if(row.effectiveenddate == today){
						return 'color:red;';
					}
				}
			}
		  	/*{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"150",
		  		formatter: function(value,row,index){*/
		  			/* 如果不是本部门就只能查看 */
		  			/*if(row.unitid == user.unitId){
		  				var opt = '<p class="table-operate"><a  class ="a10040201" href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
										<span class="fa fa-eye"></span>\
								   </a><a class ="a10040203" href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
										<span class="fa fa-edit"></span>\
							   	   </a><a class ="a10040204" href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
										<span class="fa fa-minus"></span>\
							       </a></p>';
						return opt;
		  			}else{
		  				var opt = '<p class="table-operate"><a class ="a10040201" href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
										<span class="fa fa-eye"></span>\
								   </a></p>';
						return opt;
		  			}*/

                    /*var opt = '<p class="table-operate"><a  class ="a10040201" href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
										<span class="fa fa-eye"></span>\
								   </a><a class ="a10040203" href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
										<span class="fa fa-edit"></span>\
							   	   </a><a class ="a10040204" href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
										<span class="fa fa-minus"></span>\
							       </a></p>';
                    return opt;
					
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_temporary_keypoint.html?oid="+indexData.oid,"viewGpsTemporaryKeypoint","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsTemporaryKeypointdatagrid').datagrid('clearSelections'); //clear selected options
	    },
	    onSelect:function(index,indexData){
			check();
		},
		onUnselect:function(index,indexData){
			check();
		},
		onSelectAll:function(){
			check();
		},
		onUnselectAll:function(){
			check();
		}
	});
	//页面自适应
	initDatagrigHeight('gpsTemporaryKeypointdatagrid','queryDiv','100');
	var comboxid='pointtype,';
	var singleDomainName='temporarykeypointtype,';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	/* 清除关键点类型的值域 */
	
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsTemporaryKeypointdatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsTemporaryKeypointdatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	/* 下拉框值 */
	var userArray = [];
	var hierarchy = '';
	userArray.push(user);

	initUnitComboTree('unitid');
	initLineLoopCombobox('lineloopoid');
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
						//$('#'+id).combobox('setValue',data[0].codeId);
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
	top.getDlg("save_gps_temporary_keypoint.html","addGpsTemporaryKeypoint","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsTemporaryKeypointdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_temporary_keypoint.html?oid="+dataId,"updateGpsTemporaryKeypoint","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsTemporaryKeypointdatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpstemporarykeypoint/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsTemporaryKeypointdatagrid').datagrid('reload');	
								$('#gpsTemporaryKeypointdatagrid').datagrid('clearSelections'); 
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
 * @desc 生成任务
 * @param oid 数据ID
 */
function generateTemporaryTask(oid){
	var rows = $('#gpsTemporaryKeypointdatagrid').datagrid('getSelections');
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
		$.messager.confirm('提示', '您确定要生成任务吗？\n\t',function(r){
			if (r){
				$.ajax({
					url: rootPath+"/gpstemporarykeypoint/generateTemporaryTask.do",
					contentType: 'application/json;charset=utf-8',
					data: JSON.stringify({"idList" : idArray}),
					type: "POST",
					dataType:"json",
					async:false,
					success: function(data){
						if(data.status==1){
							top.showAlert("提示","生成任务成功","info",function(){
								$('#gpsTemporaryKeypointdatagrid').datagrid('reload');	
								$('#gpsTemporaryKeypointdatagrid').datagrid('clearSelections'); 
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "生成任务失败", 'error');
							enableButtion("saveButton");
						}else{
							top.showAlert("提示", data.msg, 'info');
							enableButtion("saveButton");
						}
					},
					error : function(data) {
						top.showAlert('错误', '生成任务出错', 'info');
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
	var rows = $('#gpsTemporaryKeypointdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_temporary_keypoint.html?oid="+dataId,"viewGpsTemporaryKeypoint","详细",800,600,false,true,true);
}



/**
 *@desc 导出选中
 */
function exportSelect(){
	// 找到所有被选中行
	var rows = $('#gpsTemporaryKeypointdatagrid').datagrid('getSelections');
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
		url=addTokenForUrl(rootPath+'/gpstemporarykeypoint/exportToExcelAction.do?oidList='+idArray);
		$("#exprotExcelIframe").attr("src", url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	url=addTokenForUrl(rootPath+'/gpstemporarykeypoint/exportToExcelAction.do?'+querySerialize);
	$("#exprotExcelIframe").attr("src", url);
}

/**
 * 禁用修改按钮
 * @returns
 */
function check(){
	var rows = $('#gpsTemporaryKeypointdatagrid').datagrid('getSelections');
	var bool = true;
	if (rows.length == 0){
		$("#10210402").linkbutton('enable');
		$("#10210403").linkbutton('enable');
	}else{
		for (var i=0;i<rows.length;i++){
			if(rows[i].unitid != user.unitId){
				bool = false;
			}
		}
	}
	if(bool){
		$("#10210402").linkbutton('enable');
		$("#10210403").linkbutton('enable');
	}else{
		$("#10210402").linkbutton('disable');
		$("#10210403").linkbutton('disable');
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
    per.type = "gps_temporary_keypoint";
    array.push( per );

    let option = {};
    option.layerId = "1";
    option.url = 'images/temp-key-point-1.png';
    option.width = 24;
    option.height = 24;
    top.position.positionArray = JSON.stringify(array)+'&^'+JSON.stringify(option);

}


/**
 * 定位选中，在导航栏。
 */
function positionSelectOnTop( param ){

    let rows = $('#gpsTemporaryKeypointdatagrid').datagrid('getSelections');
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
            coordinate.oid = obj.oid;
            coordinate.lon = obj.lon;
            coordinate.lat = obj.lat;
            coordinate.type = "gps_temporary_keypoint";
            console.log(coordinate)
            idArray.push(coordinate);
        });

        let option = {};
        option.layerId = "1";
        option.url = 'images/temp-key-point-1.png';
        option.width = 24;
        option.height = 24;
        top.position.positionArray = JSON.stringify(idArray)+'&^'+JSON.stringify(option);

    } else {

        /* 打开地图 */
        top.map.show = true;

        /* 分页定位，首先获取到所有的数量。 */
        showLoadingMessage("正在获取所有坐标数据数量，请稍后...");
        $.get(rootPath+'/gpstemporarykeypoint/getAllKeypointCount.do', function( count ) {
            showLoadingMessage("所有的坐标数量为"+count+"条，数据正在渲染中，请稍后...");
            /* 每页大概传100条数据 */
            let pageSize = 100;
            let pageNo = Math.floor(count/100) + 1;
            for( let i = 1 ; i <= pageNo ; i++ ){
                if ( count <= 100 ) {
                    // showLoadingMessage("正在获取0到"+count+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpstemporarykeypoint/getPage.do?pageNo=1&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                let option = {};
                                option.layerId = "1";
                                option.url = 'images/temp-key-point-1.png';
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
                        url: rootPath+'/gpstemporarykeypoint/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                let option = {};
                                option.layerId = "1";
                                option.url = 'images/temp-key-point-1.png';
                                option.width = 24;
                                option.height = 24;
                                top.position.positionArray = JSON.stringify(allPoint)+'&^'+JSON.stringify(option);

                                hiddenLoadingMessage();
                            }
                        }
                    })
                } else {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+100*i+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpstemporarykeypoint/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                let option = {};
                                option.layerId = "1";
                                option.url = 'images/temp-key-point-1.png';
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

/**
 * 时间格式化
 */
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}