var eventid = getParamter('eventid');
function loadData() {	
	var url = rootPath + "jasframework/excel/table/getExcelTableInfoBoById.do?eventid="+eventid;
	$.getJSON(url,function(result) {
		$('#tableName').html(result.tableName);
		$('#tableAlias').html(result.tableAlias);
		$('#formType').html(result.formType);
		$('#geometryType').html(result.geometryType);
		$('#isMainTable').html(result.isMainTable);
		$('#sheetIndex').html(result.sheetIndex);
		$('#remark').html(result.remark);
	});
}