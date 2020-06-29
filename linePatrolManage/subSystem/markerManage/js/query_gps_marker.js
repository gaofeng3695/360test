
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
	$('#10030205').menubutton({menu:'#exportBars'});
	$('#gpsMarkerdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsmarker/getPage.do",
		collapsible:true,
		autoRowHeight: false,
        fitColumns: true,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
            	field:"lineloopoName",
            	title:"所属管线",
            	width:$(this).width() * 0.13,
            	resizable:true,
	    		sortable:true,
            	align:'center'
            },
            {	
				field:"markername",
	    		title:"桩名称",
	    		width:$(this).width() * 0.13,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
			{	
				field:"markerstation",
	    		title:"桩里程（M）",
	    		width:$(this).width() * 0.13,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'/*,
                formatter: function(value,row,index){
                    return '<span title="'+Math.round((value/1000)*100)/100+'"  class="tip tooltip-f">' +Math.round((value/1000)*100)/100+'</span>';
				}*/
	    	},

			{	
				field:"markertypeCodeName",
	    		title:"桩类型",
	    		width:$(this).width() * 0.13,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},


			{
				field:"syncdate",
	    		title:"同步时间",
	    		width:$(this).width() * 0.13,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:$(this).width() * 0.13,
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a href="#" class = "a10030201" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span>\
							   </a><a class = "a10030203" href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
									<span class="fa fa-edit"></span>\
						   	   </a><a class = "a10030204" href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
									<span class="fa fa-minus"></span>\
						       </a></p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_marker.html?oid="+indexData.oid,"viewGpsMarker","详细",900,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsMarkerdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsMarkerdatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='markertype'+',';
	singleDomainName+='markertype'+","
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsMarkerdatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsMarkerdatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	/* 以下初始化查询面板 */
	//初始化部门
	initUnitComboTree('unitid');
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
			setComboObjWidth(id,0.29,'combobox');
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
				//		$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.09,'combobox');
		}
	}
}
/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_marker.html","addGpsMarker","添加",900,400,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsMarkerdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_marker.html?oid="+dataId,"updateGpsMarker","修改",900,400,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsMarkerdatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsmarker/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsMarkerdatagrid').datagrid('reload');	
								$('#gpsMarkerdatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsMarkerdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_marker.html?oid="+dataId,"viewGpsMarker","详细",900,400,false,true,true);
}

/**
 *@desc 导出选中
 */
function exportSelect(){
	var templateCode = "export_xxxx";//导出模板编号
	// 找到所有被选中行
	var rows = $('#gpsMarkerdatagrid').datagrid('getSelections');
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
		url=addTokenForUrl(rootPath+'/gpsmarker/exportToExcelAction.do?oidList='+idArray);
        $("#exprotExcelIframe").attr("src", url);
	}
}

/**
 * @desc 导出查询
 */
function exportQuery(){
	var templateCode = "export_xxxx";//导出模板编号
	var url =addTokenForUrl(rootPath+'/gpsmarker/exportToExcelAction.do?'+$('#queryForm').serialize());
	$("#exprotExcelIframe").attr("src",url);
}

/**
 * 同步桩
 */
function syncMarker(){
	showLoadingMessage("正在同步桩数据，请稍候。。。");
	$.ajax({
		url: rootPath+"/gpsmarker/syncMarker.do",
		contentType: 'application/json;charset=utf-8',
		type: "POST",
		dataType:"json",
		success: function(data){
			hiddenLoadingMessage();
			if(data.status==1){
				top.showAlert("提示","同步成功","info",function(){
					$('#gpsMarkerdatagrid').datagrid('reload');	
					$('#gpsMarkerdatagrid').datagrid('clearSelections'); 
				});
			}else if(data.code == "400") {
				top.showAlert("提示", "同步失败", 'error');
			}else{
				top.showAlert("提示", data.msg, 'info');
			}
		},
		error : function(data) {
			hiddenLoadingMessage();
			top.showAlert('错误', '同步出错', 'info');
		}
	});
}
