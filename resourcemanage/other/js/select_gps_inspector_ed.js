
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var insOid = getParamter("oid");
var unitid = getParamter("unitid");
var querySerialize={"insname":"","sim":""};	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsInspectordatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsinspector/getHasBind.do?unitid="+unitid+"&insOid="+insOid,
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        fitColumns: true,
		sortname: 'create_datetime',
		sortOrder : 'desc',
		//remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true},
            {	
				field:"unitname",
	    		title:"部门名称",
	    		width:$(this).width() * 0.2,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"insname",
	    		title:"姓名",
	    		width:$(this).width() * 0.15,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

			{	
				field:"phone",
	    		title:"联系电话",
	    		width:$(this).width() * 0.125,
	    		resizable:true,
	    		sortable:true,
	    		align:'center'
	    	},

		]],
		columns: 
		[[
			{	
				field:"sim",
				title:"SIM卡号",
				width:$(this).width() * 0.125,
				resizable:true,
				sortable:true,
				align:'center'
			},
	    	{	
	    		field:"instype",
	    		title:"巡线类型",
	    		width:$(this).width() * 0.15,
	    		resizable:true,
	    		sortable:true,
	    		align:'center',
	    		formatter:function(value,row,index){
	    			if(value == '01'){
	    				return "日巡";
	    			}else if(value == '02'){
	    				return "夜巡";
	    			}
	    		}
	    	}
		]],
		onDblClickRow:function(index,indexData){
            top.getDlg("../insmanage/viewAll_gps_inspector.html?oid="+indexData.oid,"viewAll","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsInspectordatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsInspectordatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='instype'+',';
	singleDomainName+='worktype'+","
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
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
					//	$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.281,'combobox');
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
				panelHeight:100,
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
			setComboObjWidth(id,0.29,'combobox');
		}
	}
}

/**
 * @desc 解除绑定
 * @param oid 数据ID
 */
function relieve(oid){
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
	var idArray=[];
	var insOidArray = [insOid];
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
//		$.messager.confirm('绑定', '您确定要绑定这些信息吗？\n\t',function(r){
//			if (r){
				$.ajax({
				   url: rootPath+"/gpsinspector/deleHasBind.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"managerOid":insOidArray,"patrolOids" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","解绑成功","info",function(){
								$('#gpsInspectordatagrid').datagrid('reload');	
								$('#gpsInspectordatagrid').datagrid('clearSelections'); 
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "解绑失败", 'error');
							enableButtion("saveButton");
						}else{
							top.showAlert("提示", data.msg, 'info');
							enableButtion("saveButton");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '解绑出错', 'info');
					}
				});
//			}
//		});	
	}	
}


/**
 * @desc 查看所有信息，包括计划，任务，区段等等。
 * @param oid 数据ID
 */
function view(oid){
	var rows = $('#gpsInspectordatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("../insmanage/viewAll_gps_inspector.html?oid="+dataId,"viewAll","详细",800,600,false,true,true);
}
