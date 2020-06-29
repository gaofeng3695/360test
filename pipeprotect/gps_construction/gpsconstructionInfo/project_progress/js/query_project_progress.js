
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件
var pkfield=getParamter("oid");	// 业务数据ID
/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#projectProgressdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/projectprogress/getPage.do?gpsConstructionOid="+pkfield,
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		sortName:'modifyDatetime',
		sortOrder:'desc',
		columns:
		[[
			{	
				field:"progressidName",
	    		title:"工程进展",
	    		width:150,
	    		resizable:true,
	    		align:'center',
				sortable:true
	    	},
			{
				field:"progressdes",
	    		title:"项目进度描述",
				width:180,
	    		resizable:true,
	    		align:'center',
				sortable:true
	    	},

			{	
				field:"modifyDatetime",
	    		title:"进度更新日期",
				width:150,
	    		resizable:true,
	    		align:'center',
				sortable:true
	    	},

			{
				field:"remarks",
	    		title:"备注",
				width:200,
	    		resizable:true,
	    		align:'center',
				sortable:true
	    	},
		  	// {
		  	// 	field:'operate',
		  	// 	title:'操作',
		  	// 	align:"center",
		  	// 	width:"150",
		  	// 	formatter: function(value,row,index){
			// 		var opt = '<p class="table-operate"><a href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
			// 						<span class="fa fa-eye"></span>\
			// 				   </a><a href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
			// 						<span class="fa fa-edit"></span>\
			// 			   	   </a><a href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
			// 						<span class="fa fa-minus"></span>\
			// 			       </a></p>';
			// 		return opt;
			// 	}
			// }
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_project_progress.html?oid="+indexData.oid,"viewProjectProgress","详细",800,550,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#projectProgressdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('projectProgressdatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='progressid'+',';
	singleDomainName='construnctionProgress'+',';;	// 单选值域
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	initDate();

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
					//	$('#'+id).combobox('setValue',data[0].codeId);
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
	top.getDlg("save_project_progress.html?gpsConstructionOid="+pkfield,"addProjectProgress","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#projectProgressdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_project_progress.html?oid="+dataId+"&gpsConstructionOid="+pkfield,"updateProjectProgress","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#projectProgressdatagrid').datagrid('getSelections');
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
				   url: rootPath+"/projectprogress/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#projectProgressdatagrid').datagrid('reload');	
								$('#projectProgressdatagrid').datagrid('clearSelections'); 
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
	var rows = $('#projectProgressdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_project_progress.html?oid="+dataId,"viewProjectProgress","详细",700,400,false,true,true);
}



function initDate(){
	//设置结束日期为当前日期
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var end = date.getFullYear() + seperator1 + month + seperator1 + strDate +" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	var end111 = date.getFullYear() + seperator1 + month + seperator1 + strDate;
	$("#EndTime").val(end);

	//设置开始日期为当前日期的前一个月
	date.setMonth(date.getMonth()-1);
	var begin = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()+
		" " + date.getHours() + seperator2 + date.getMinutes() +seperator2 + date.getSeconds();
	$("#modifyDatetime").val(end111);
	$("#modifyDatetimeQuery").val(end111);
}


