
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
 * @desc 查询
 */
function querygpsAppLayer(){
	querySerialize =$('#queryForm').serialize();
	encodeURI(querySerialize);
	querySerialize = decodeURI(querySerialize);
	var paramArr = querySerialize.toString().split("&");
	var query = "{";
	for(var i=0;i<paramArr.length;i++){
		var params = paramArr[i].split("=");
		query+="'"+params[0]+"':'"+params[1]+"',";
	}
	query+="'pageNumber':1}";
	$('#gpsAppLayerdatagrid').datagrid('options').queryParams= eval("("+query+")");
	$('#gpsAppLayerdatagrid').datagrid('load');
}

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsAppLayerdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/gpsAppLayer/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        fitColumns: true,
	/*	sortName:'createDatetime',
		sortOrder:'desc',*/
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
				field:"layerName",
				title:"地图名称",
				width:$(this).width() * 0.2,
				resizable:true,
				sortable:true,
				align:'center'
			},
			{	
				field:"layerSize",
				title:"地图大小",
				width:$(this).width() * 0.1,
				resizable:true,
				sortable:true,
				align:'center'
			},
		]],
		columns: 
		[[
            {	
            	field:"layerAddress",
            	title:"下载地址",
            	width:$(this).width() * 0.3,
            	resizable:true,
            	sortable:false,
            	align:'center'
            }/*,
		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:$(this).width() * 0.15,
		  		formatter: function(value,row,index){

					var opt = '<p class="table-operate"><a class = "a11040101" href="#" title = "查看" onclick="view(\'' + row.oid+'\')">\
									<span class="fa fa-eye"></span>\
							   </a><a class = "a11040103" href="#" title = "修改" onclick="update(\'' + row.oid+'\')">\
									<span class="fa fa-edit"></span>\
						   	   </a><a class = "a11040104" href="#" title = "删除" onclick="dele(\'' + row.oid+'\')">\
									<span class="fa fa-remove"></span>\
						       </a></p>';
					return opt;
				}
			}*/
		]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_app_layer.html?oid="+indexData.oid,"viewGpsAppLayer","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsAppLayerdatagrid').datagrid('clearSelections'); //clear selected options
	    },
	});
	//页面自适应
	initDatagrigHeight('gpsAppLayerdatagrid','queryDiv','100');
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadQuerySelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	initUnitComboTree('unitid');

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
				url : rootPath+"/jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						$('#' + id).combobox('setValue',data[0].codeId);
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
				url : rootPath+"/jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					//$('#'+id).val(row.codeid);
					//$('#'+id+'ID').val(row.codename);
				}				
			});
			setComboObjWidth(id,0.22,'combobox');
		}
	}
}

/**
 * @desc 新增
 */
function add(){
	top.getDlg("save_gps_app_layer.html","addGpsAppLayer","添加",800,600,false,true,true);
}

/**
 * @desc 修改
 * @param oid 数据ID
 */
function update(oid){
	var rows = $('#gpsAppLayerdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("update_gps_app_layer.html?oid="+dataId,"updateGpsAppLayer","修改",800,600,false,true,true);
}

/**
 * @desc 删除
 * @param oid 数据ID
 */
function dele(oid){
	var rows = $('#gpsAppLayerdatagrid').datagrid('getSelections');
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
				   url: rootPath+"/gpsAppLayer/delete.do",
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idList" : idArray}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert("提示","删除成功","info",function(){
								$('#gpsAppLayerdatagrid').datagrid('reload');	
								$('#gpsAppLayerdatagrid').datagrid('clearSelections'); 
							});
						}else{
							top.showAlert("错误","删除失败","error");
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
	var rows = $('#gpsAppLayerdatagrid').datagrid('getSelections');
	var dataId = "";
	if(!isNull(oid)){
		dataId = oid;
	}else if (rows.length == 1){
		dataId = rows[0].oid;
	}else{
		top.showAlert("提示","请选中一条记录",'info');
		return;
	}
	top.getDlg("view_gps_app_layer.html?oid="+dataId,"viewGpsAppLayer","详细",800,600,false,true,true);
}
