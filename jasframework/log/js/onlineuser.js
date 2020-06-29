$(document).ready(function() {	
	initDatagrigHeight('dg','searchpanel',66);
	loadData();	 
});
function loadData() {		
	$.getJSON(rootPath+'/jasframework/privilege/unit/getLeftTree.do', function(jso) {
		$("#unitEventid").combotree({
			panelHeight:150,
			data : jso
		});	
		setComboObjWidth('unitEventid',0.3,'combotree');
	});
}
function queryOnLineUser(){	
	queryParams={			
			'loginname' : $("#loginname").val(),			
			'unitEventid':$("#unitEventid").combotree('getValue'),
			'logindate_start':$("#logindate_start").val(),
			'logindate_end':$("#logindate_end").val(),
     	};    	
		$("#dg").datagrid('options').queryParams=queryParams; 
		$("#dg").datagrid('load'); 
	}