
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
	querySerialize={inspectortype:'01',recordtype:'01'}
	$('#gpsinsrecorddatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinsrecord/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		queryParams:querySerialize,
        fitColumns: true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
            	field:"unitname",
            	title:"部门名称",
            	width:$(this).width() * 0.125,
            	resizable:true,
            	sortable:true,
            	align:'center'
            },
            
            {	
            	field:"inspectoridname",
            	title:"巡检人员",
            	width:$(this).width() * 0.125,
            	resizable:true,
            	sortable:true,
            	align:'center'
            },
            {	
            	field:"instypename",
            	title:"巡线类别",
            	width:$(this).width() * 0.125,
            	resizable:true,
            	sortable:true,
            	align:'center'
            },
		]],
		columns: 
		[[

			{
				field:"begindatetime",
	    		title:"出发时间",
	    		width:$(this).width() * 0.125,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"enddatetime",
	    		title:"返回时间",
	    		width:$(this).width() * 0.125,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"completionrate",
	    		title:"巡检合格率",
	    		width:$(this).width() * 0.125,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"uploaderName",
	    		title:"同步状态",
	    		width:$(this).width() * 0.125,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"insfreq",
	    		title:"巡检频次",
	    		width:$(this).width() * 0.125,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_insrecord.html?oid="+indexData.oid,"viewGpsInsrecord","详细",900,500,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsinsrecorddatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsinsrecorddatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	comboxid+='instype'+',';
	singleDomainName+='insType'+","
	comboxid+='uploader'+',';
	singleDomainName+='record_uploader'+","
	loadQuerySelectData(comboxid,singleDomainName);
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsinsrecorddatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsinsrecorddatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
	
	initUnitComboTree('unitid');
});


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
				}
			});
			setComboObjWidth(id,0.09,'combobox');
		}
	}
}

/**
 * @desc 查看
 * @param oid 数据ID 
 */
function view(oid){
	var rows = $('#gpsinsrecorddatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_insrecord.html?oid="+dataId,"viewGpsInsrecord","详细",900,500,false,true,true);
}

/**
 * 同步巡检范围
 * @returns
 */
function syncInsrecord(){
	showLoadingMessage("正在上传巡检记录数据，请稍候。。。");
	$.ajax({
		url: rootPath+"/gpsinsrecord/uploadInspectionRecord.do?recordtype=01",
		contentType: 'application/json;charset=utf-8',
		type: "POST",
		dataType:"json",
		success: function(data){
			hiddenLoadingMessage();
			if(data.status==1){
				top.showAlert("提示","上传成功","info",function(){
					$('#gpsinsrecorddatagrid').datagrid('reload');	
					$('#gpsinsrecorddatagrid').datagrid('clearSelections'); 
				});
			}else if(data.code == "400") {
				top.showAlert("提示", "上传失败", 'error');
			}else{
				top.showAlert("提示", data.msg, 'info');
			}
		},
		error : function(data) {
			hiddenLoadingMessage();
			top.showAlert('错误', '上传出错', 'info');
		}
	});
}