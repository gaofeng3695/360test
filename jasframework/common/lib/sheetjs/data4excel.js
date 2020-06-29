
//obj：excel文件，resultDataType：返回数据结构(json,csv,html,formulae),默认json
function readExcelData(files, resultDataType,callback) {
	var fileReader = new FileReader();
	var messages = [];// 存储获取到的数据
	fileReader.onload = function(ev) {
		try {
			var data = ev.target.result;
			var workbook = XLSX.read(data, {
				type : 'binary'
			}); // 以二进制流方式读取得到整份excel表格对象
		} catch (e) {
			console.log(e);
			top.showAlert("提示",'请检查文件类型。','');
			return;
		}

		// 表格的表格范围，可用于判断表头是否数量是否正确
		var fromTo = '';
		// 遍历每张表读取
		for ( var sheet in workbook.Sheets) {
			if (workbook.Sheets.hasOwnProperty(sheet)) {
				// fromTo = workbook.Sheets[sheet]['!ref'];
				if (resultDataType == 'json') {
					messages = messages.concat(XLSX.utils
							.sheet_to_json(workbook.Sheets[sheet]));
				} else if (resultDataType == 'html') {
					messages = messages.concat(XLSX.utils
							.sheet_to_html(workbook.Sheets[sheet]));
				} else if (resultDataType == 'formulae') {
					messages = messages.concat(XLSX.utils
							.sheet_to_formulae(workbook.Sheets[sheet]));
				} else if (resultDataType == 'csv') {
					messages = messages.concat(XLSX.utils
							.sheet_to_csv(workbook.Sheets[sheet]));
				} else {
					messages = messages.concat(XLSX.utils
							.sheet_to_json(workbook.Sheets[sheet]));
				}
				break;
			} else {
				console.log('无效sheet。');
			}
		}
		callback(messages);
	};
	// 以二进制方式打开文件
	fileReader.readAsBinaryString(files[0]);
}
