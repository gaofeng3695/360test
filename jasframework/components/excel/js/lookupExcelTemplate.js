var eventid = getParamter('eventid');
function loadData() {	
	var url = rootPath + "jasframework/excel/template/getExcelTemplateInfoBoById.do?eventid="+eventid;
	$.getJSON(url,function(result) {
		$('#templateName').html(result.templateName);
		$('#templateType').html(result.templateType);
		$('#dataSourceName').html(result.dataSourceName);
		$('#remark').html(result.remark);
	});
}