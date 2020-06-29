
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
	$('#gpsPatrolTimemanagedatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpspatroltimemanage/getPage.do",
		collapsible:true,
		autoRowHeight: false,
        fitColumns: true,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
            	field:"unitName",
            	title:"部门名称",
            	width:$(this).width() * 0.167,
            	resizable:true,
            	sortable:true,
            	align:'center'
            },
            /*{	
				field:"lineloopName",
	    		title:"管线名称",
	    		width:"100",
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},*/
            {	
            	field:"inspectorName",
            	title:"巡检人员",
            	width:$(this).width() * 0.167,
            	resizable:true,
            	sortable:true,
            	align:'center'
            }, {
            	field:"instype",
            	title:"巡检类型",
            	width:$(this).width() * 0.167,
            	resizable:true,
            	sortable:true,
            	align:'center'
            }
		]],
		columns: 
		[[

			{	
				field:"planevoName",
	    		title:"巡检计划",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{
				field:"insfreqName",
	    		title:"巡检频次",
	    		width:$(this).width() * 0.167,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	}/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:$(this).width() * 0.167,
		  		formatter: function(value,row,index){
					var opt = '<p class="table-operate"><a class = "a10050201" href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span>\
							   </a><a class = "a10050203" href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
									<span class="fa fa-edit"></span>\
						   	   </a><a class = "a10050204" href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
									<span class="fa fa-minus"></span>\
						       </a></p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_patrol_timemanage.html?oid="+indexData.oid,"viewGpsPatrolTimemanage","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsPatrolTimemanagedatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsPatrolTimemanagedatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	/* 下拉框值 */
	var userArray = [];
	var hierarchy = '';
	userArray.push(user);
	
	initUnitComboTree('unitid');
	initLineLoopCombobox('lineloopoid');
	
	/* 巡检人员，根据当前用户所在的部门获取到本部门和下级部门所有的巡检人员，支持模糊搜索  */
	$('#inspectorid').combobox({
		panelHeight:150,
		editable:true,
		mode:'remote',
		url : rootPath+'/xncommon/getAllUnitUserChildren.do?unitId='+user.unitId,
		valueField : "codeid",
		textField : "codename",
		onSelect : function(row){
		}
	});
	setComboObjWidth("inspectorid",0.145,'combobox');
	
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
						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.30,'combobox');
		}
	}
}
/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_patrol_timemanage.html","addGpsPatrolTimemanage","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsPatrolTimemanagedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_patrol_timemanage.html?oid="+dataId,"updateGpsPatrolTimemanage","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsPatrolTimemanagedatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpspatroltimemanage/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsPatrolTimemanagedatagrid').datagrid('reload');	
								$('#gpsPatrolTimemanagedatagrid').datagrid('clearSelections'); 
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
	var rows = $('#gpsPatrolTimemanagedatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_patrol_timemanage.html?oid="+dataId,"viewGpsPatrolTimemanage","详细",800,600,false,true,true);
}




