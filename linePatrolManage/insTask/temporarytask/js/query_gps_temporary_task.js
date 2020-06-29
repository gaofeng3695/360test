
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
	$('#gpsTemporaryTaskdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpstemporarytask/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        fitColumns: true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"execUnitName",
	    		title:"执行部门名称",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"inspectorName",
	    		title:"巡检人员",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"insfreqName",
	    		title:"巡检频次名称",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	}
		]],
		columns: 
		[[
			
		
			{	
				field:"insbDate",
	    		title:"任务开始日期",
	    		width:$(this).width() * 0.167,
	    		sortable:true,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"inseDate",
	    		title:"任务结束日期",
	    		width:$(this).width() * 0.167,
	    		sortable:true,
	    		resizable:true,
	    		align:'center'
	    	}/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:$(this).width() * 0.167,
		  		formatter: function(value,row,index){
		  				var opt = '<p class="table-operate"><a class = "a10060301" href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
										<span class="fa fa-eye"></span>\
								   </a></p>';
						return opt;
					
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_temporary_task.html?oid="+indexData.oid,"viewGpsTemporaryTask","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsTemporaryTaskdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsTemporaryTaskdatagrid','queryDiv','100');
	var comboxid='insfreq,';
	var singleDomainName='temporarykeypointtime,';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	/* 清除关键点类型的值域 */
	
	/* 下拉框值 */
	var userArray = [];
	var hierarchy = '';
	userArray.push(user);
    initUnitComboLocalTree('unitid');
	//initUser('inspectorId');
	
	//高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('gpsTemporaryTaskdatagrid','queryDiv',226);
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('gpsTemporaryTaskdatagrid','queryDiv',64);
		}
	});
	
	// 高级搜索的查询条件选择
	$("#moreTable .more-conditions").on("click","a",function(){
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
	});
});

/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboLocalTree(unitid){
    /* 以下初始化查询面板 */
    /* 部门 */
    $('#'+unitid).combotree({
        panelHeight:150,
        editable:true,
        mode:'remote',
        valueField : "oid",
        textField : "unitName",
        onSelect:function(node) {
            // $('#lineloopoid').combotree('reload', rootPath+'/gpslineloop/getLineLoopChildrenReload.do?unitid='+node.id);
           // $("#inspectorId").combobox("reload", rootPath+'/xncommon/getAllUnitUserChildrens.do?unitId='+node.id);
            //setComboObjWidth(lineloopoid,0.145,'combobox');
        }
    });
    $.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
        console.log(result);

        $('#'+unitid).combotree('loadData', result.data);

    })
    setComboObjWidth(unitid,0.172,'combobox');
}

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
function view(oid){
	var rows = $('#gpsTemporaryTaskdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_temporary_task.html?oid="+dataId,"viewGpsTemporaryTask","详细",800,600,false,true,true);
}

/**
 * 点击取消
 */
function closePanel(){
	/* 设置计算里程弹出框的display为none */
	$('#calculationMileage').css('display','none');
}

/**
 * 生成任务
 * @returns
 */
function generateTemporaryTask(){
	ajaxLoading();
	$.post(rootPath+'/gpstemporarytask/generateTemporaryTask.do',{},function(data){
		ajaxLoadEnd();
		if(data.status==1){
			/*console.log(result);*/
			top.showAlert("提示", "任务生成完毕", 'info');
			$('#gpsTemporaryTaskdatagrid').datagrid("reload");
		}else{
			top.showAlert('错误', '任务生成失败。', 'info');
		}
	})
}

/**
 * loading效果
 */
function ajaxLoading(){   
    $("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo("body");   
    $("<div class=\"datagrid-mask-msg\"></div>").html("正在生成任务，请稍候。。。").appendTo("body").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2});   
}
/**
 * 去除loading效果
 * @returns
 */
function ajaxLoadEnd(){   
    $(".datagrid-mask").remove();   
    $(".datagrid-mask-msg").remove();               
}