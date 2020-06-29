function loadData() {
	var param = this.location.search;
	if (param != null && "" != param) {
		var url = "../operateLog/queryCompareInfo.do" + param;
		$('#loginLogTable').datagrid({
			url : url,
			pagination:false
		});
	}
}
function formatNewValue(val, row) {
	if (row.newValue != row.oldValue) {
		return '<span style="color:red;">' + val + '</span>';
	} else {
		return val;
	}
}