
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
var allPoint = [];

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	
	/* 得到今天的格式化字符串 */
	var today = new Date().Format("yyyy-MM-dd");
	$('#export').menubutton({menu:'#exportBars'}); 
	$('#102101005').menubutton({menu:'#locationBars'});
	$('#gpsKeypointdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/mapkeypoint/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		singleSelect: true,
		width:300,
		frozenColumns:[[
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:"60",
		  		formatter: function(value,row,index){
		  				var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\',' + row.type+')">\
										<span class="fa fa-eye"></span>\
								   </a><a class ="a1022100506" href="#" title = "定位" onclick="locationSelect(\''+row.oid+'\',' + row.lon+','+row.lat+')">\
									<span class="fa fa-thumb-tack"></span>\
						   			</a></p>';
						return opt;
		  			}
			},
	    	{	
				field:"pointname",
	    		title:"关键点名称",
	    		width:"120",
	    		resizable:true,
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
				field:"unitname",
	    		title:"部门名称",
	    		width:"100",
	    		resizable:true,
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
    			sortable:false,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.effectiveenddate == today){
						return 'color:red;';
		  			}
				}
	    	},
			{	
				field:"effectivebegindate",
	    		title:"有效起始日期",
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
				field:"effectiveenddate",
	    		title:"有效终止日期", 
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
				field:"buffer",
	    		title:"缓冲范围",
	    		width:"100",
	    		resizable:true,
	    		align:'center',
	    		styler:function(value,row,index){
					if(row.effectiveenddate == today){
						return 'color:red;';
		  			}
				}
	    	}
		]],
		onDblClickRow:function(index,indexData){
			if(indexData.type == 1){
				top.getDlg("view_gps_keypoint.html?oid="+indexData.oid,"viewGpsKeypoint","详细",700,400,false,true,true);
			}else if(indexData.type == 2){
				top.getDlg("../../insTask/temporaryKeypoint/view_gps_temporary_keypoint.html?oid="+indexData.oid,"viewGpsTemporaryKeypoint","详细",700,400,false,true,true);
			}
		},
		onLoadSuccess:function(data){
	    	$('#gpsKeypointdatagrid').datagrid('clearSelections'); //clear selected options
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
	initDatagrigHeight('gpsKeypointdatagrid','queryDiv','100');
	var comboxid='pointtype,';
	var singleDomainName='keypointtype,';	// 单选值域
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
			initDatagrigHeight('gpsKeypointdatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsKeypointdatagrid','queryDiv',64);
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
	setComboObjWidth('unitid',0.5,'combobox');
	initLineLoopCombobox('lineloopoid');
	setComboObjWidth('lineloopoid',0.5,'combobox');

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
						//$('#'+id).combobox('setValue',data[0].codeId);
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
function view(oid,type){
	var rows = $('#gpsKeypointdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	if(type == 1){
		top.getDlg("view_gps_keypoint.html?oid="+dataId,"viewGpsKeypoint","详细",800,600,false,true,true);
	}else if(type == 2){
		top.getDlg("../../insTask/temporaryKeypoint/view_gps_temporary_keypoint.html?oid="+indexData.oid,"viewGpsTemporaryKeypoint","详细",700,400,false,true,true);
	}
}



/**
 *@desc 导出选中
 */
function exportSelect(){
	// 找到所有被选中行
	var rows = $('#gpsKeypointdatagrid').datagrid('getSelections');
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
		url=addTokenForUrl(rootPath+'/gpskeypoint/exportToExcelAction.do?oidList='+idArray);
		$("#exprotExcelIframe").attr("src", url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	url=addTokenForUrl(rootPath+'/gpskeypoint/exportToExcelAction.do?'+querySerialize);
	$("#exprotExcelIframe").attr("src", url);
}

/**
 * 禁用修改按钮
 * @returns
 */
function check(){
	var rows = $('#gpsKeypointdatagrid').datagrid('getSelections');
	var bool = true;
	if (rows.length == 0){
		$("#102101002").linkbutton('enable');
		$("#102101003").linkbutton('enable');
	}else{
		for (var i=0;i<rows.length;i++){
			if(rows[i].unitid != user.unitId){
				bool = false;
			}
		}
	}
	if(bool){
		$("#102101002").linkbutton('enable');
		$("#102101003").linkbutton('enable');
	}else{
		$("#102101002").linkbutton('disable');
		$("#102101003").linkbutton('disable');
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
    array.push( per );
    top.position.positionArray = JSON.stringify(array);

}


/**
 * 定位选中，在导航栏。
 */
function positionSelectOnTop( param ){

    let rows = $('#gpsKeypointdatagrid').datagrid('getSelections');
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
            idArray.push(coordinate);
        });

        top.position.positionArray = JSON.stringify(idArray);

    } else {

        /* 打开地图 */
        top.map.show = true;

    	/* 分页定位，首先获取到所有的数量。 */
		showLoadingMessage("正在获取所有坐标数据数量，请稍后...");
        $.get(rootPath+'/gpskeypoint/getAllKeypointCount.do', function( count ) {
            showLoadingMessage("所有的坐标数量为"+count+"条，数据正在渲染中，请稍后...");
            /* 每页大概传100条数据 */
            let pageSize = 100;
            let pageNo = Math.floor(count/100) + 1;
            for( let i = 1 ; i <= pageNo ; i++ ){
            	if ( count <= 100 ) {
                    // showLoadingMessage("正在获取0到"+count+"条数据");
					$.ajax({
						type: "get",
						url: rootPath+'/gpskeypoint/getPage.do?pageNo=1&&pageSize='+pageSize,
                        async : true,
						success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                top.position.positionArray = JSON.stringify(allPoint);
                                hiddenLoadingMessage();
                            }
                        }
                    })
				} else if ( i == pageNo) {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+result+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpskeypoint/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                top.position.positionArray = JSON.stringify(allPoint);

                                hiddenLoadingMessage();
                            }
                        }
                    })
				} else {
                    // showLoadingMessage("正在获取"+ 100*(i-1) +"到"+100*i+"条数据");
                    $.ajax({
                        type: "get",
                        url: rootPath+'/gpskeypoint/getPage.do?pageNo='+i+'&&pageSize='+pageSize,
                        async : true,
                        success : function( result ) {
                            if(result.status == 1){
                                console.log(result.rows);
                                allPoint = result.rows;
                                top.position.positionArray = JSON.stringify(allPoint);
                            }
                        }
                    })
				}
			}
		});

    }

}