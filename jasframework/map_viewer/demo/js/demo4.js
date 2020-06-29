/**
 * @desc 页面初始化
 */
$(document).ready(function(){

	
	
	initDatagrid();
	initDatagrigHeight('datagrid','queryDiv','100');
	
	/* 以下初始化查询面板 */
	$('#unitid').combotree({
		panelHeight:150,
		width:"100%",
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName"
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		
		$('#unitid').combotree('loadData', result.data);
	})
});

function initDatagrid(){
	$('#datagrid').datagrid({
		url:"json/data4.json",
		collapsible:true,
		checkOnSelect:false,
		rownumbers:false,
		toolbar:undefined,
		pagination:false,
		
		columns:[[
			{	
				field:"personName",
				title:"人员",
				width:"40%"
			},
			{	
				field:"match",
				title:"匹配度",
				width:"30%",
				align:'center'
			},
			{	
				field:"grade",
				title:"成绩",
				width:"30%",
				align:'center'
			}
		]],
		view:detailview,
		detailFormatter: function(rowIndex, rowData){
			console.log(rowIndex)
			console.log(rowData)
			
			return 
		},
		onExpandRow:function(index,row){
			console.log(index)
			console.log(row)
		},
		onCollapseRow:function(index,row){
			console.log(index)
			console.log(row)
		},
		onLoadSuccess:function(data){
			
		}
	})
}
