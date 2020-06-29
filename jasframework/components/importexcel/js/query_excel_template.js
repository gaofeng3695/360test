/**
 * @file
 * @desc excel模板网格查询
 * @author zhangyi
 * @date 2018-08-16
 * @last modified by
 * @last modified time
 */

$(function () {
    initTable();
    //页面自适应
	initDatagrigHeight('queryDatagrid','queryDiv','100');
})

/**
 * @desc 初始化网格
 */
function initTable() {
    $('#queryDatagrid').datagrid({
        idField: 'oid',
        url: rootPath + "/jasframework/excelTemplate/getPage.do",
        queryParams: {
        	"excelTemplateCode": $('#excelTemplateCode').val(),
        	"excelTemplateName": $('#excelTemplateName').val()
        },
        loader: function(param, success, error){
        	var opts = $('#queryDatagrid').datagrid('options');
        	$.ajax({
        		url: opts.url,
        		type: opts.method,
        		dataType:'json',
        		contentType:'application/json;charset=utf-8',
        		data: JSON.stringify(param),
        		success: function(result){
        			success(result);
        		}
        	});
        },
        singleSelect: true,
        method: 'post',
        contentType : 'application/json;charset=utf-8',
        collapsible: true,
        autoRowHeight: false,
        remoteSort: true,
        frozenColumns: [
            [{
                field: 'ck',
                checkbox: true
            }]
        ],
        columns: [
            [{
                field: "excelTemplateName",
                title: "模板名称",
                width: "250",
                resizable: true,
                align: 'center'
            }, {
                field: "excelTemplateCode",
                title: "模板编码",
                width: "250",
                resizable: true,
                align: 'center'
            }, {
            	field: "excelTemplateType",
            	title: "模板类型",
            	width: "250",
            	resizable: true,
            	align: 'center',
            	formatter: function (value, row, index){
            		if(isNull(value) || value =="1"){
            			value = "导入模板";
            		}else{
            			value = "导出模板";
            		}
            		return value;
            	}
            }, {
                field: "excelTemplatePath",
                title: "模板存储路径",
                width: "250",
                resizable: true,
                align: 'center'
            }, {
                field: "remark",
                title: "备注",
                width: "250",
                resizable: true,
                align: 'center'
            }, {
                field: 'operate',
                title: '操作',
                align: "center",
                width: "100",
                formatter: function (value, row, index) {
                    var opt = '<p class="table-operate"><a href="#" title = "删除" onclick="dele(\'' + row.oid + '\')">\
									<span class="fa fa-minus"></span>\
						       </a><a href="#" title = "下载导入模板" onclick="downLoadFile(\'' + row.excelTemplateCode + '\')">\
                               <span class="fa fa-download"></span>\
                          </a></p>';
                    return opt;
                }
            }]
        ],
        onLoadSuccess: function (data) {
            $('#queryDatagrid').datagrid('clearSelections'); //clear selected options
        }
    });
}

/**
 * @desc 删除
 * @param {string} dataId 
 */
function dele(dataId) {
    $.messager.confirm('删除', '您确定要删除这些信息吗？\n\t', function (r) {
        if (r) {
            $.ajax({
                url: addTokenForUrl(rootPath + "/jasframework/excelTemplate/delete.do"),
                dataType: 'json',
                data: {
                    'oid': dataId
                },
                success: function (result) {
                    if (result.status == 1) {
                        top.showAlert("提示", "删除成功", "info", function () {
                            $('#queryDatagrid').datagrid('reload');
                            $('#queryDatagrid').datagrid('clearSelections');
                        });
                    } else {
                        tog.showAlert('提示', "删除失败！", "error");
                    }
                },
                error: function (data) {
                    top.showAlert('错误', '删除出错', 'info');
                }
            });
        }
    });
}

/**
 * @desc 修改
 */
function update() {
     var rows = $('#queryDatagrid').datagrid('getSelections');
    if (rows.length == 1) {
        dataId = rows[0].oid;
    } else {
        top.showAlert("提示", "请选中一条记录", 'info');
        return;
    }
    var excelTemplateName = encodeURI(rows[0].excelTemplateName);
    var excelTemplateCode = encodeURI(rows[0].excelTemplateCode); 
    var remark = encodeURI(rows[0].remark); 
    var excelTemplateType = encodeURI(rows[0].excelTemplateType); 
    top.getDlg("update_excel_template.htm?oid=" + dataId, "updateExcelTemplate", "修改", 700, 500, false, true, false);
}

/**
 * @desc 新增
 */
function add() {
    top.getDlg("add_excel_template.htm", "addExcelTemplate", "添加", 700, 500, false, true, false);
}

/**
 * @desc 查看
 */
function view() {
    var rows = $('#queryDatagrid').datagrid('getSelections');
    if (rows.length == 1) {
        dataId = rows[0].oid;
    } else {
        top.showAlert("提示", "请选中一条记录", 'info');
        return;
    }
    var excelTemplateName = encodeURI(rows[0].excelTemplateName);
    var excelTemplateCode = encodeURI(rows[0].excelTemplateCode); 
    var remark = encodeURI(rows[0].remark); 
    top.getDlg("view_excel_template.htm?oid=" + dataId, "viewExcelTemplate", "查看", 700, 500, false, true, true);
}

/**
 * @desc 下载模板
 */
function downLoadFile(excelTemplateCode) {
    var src = addTokenForUrl(rootPath + "jasframework/excelTemplate/download.do?excelTemplateCode=" + encodeURI(encodeURI(excelTemplateCode)));
	$('#downloadExcelIframe').attr('src', src);
}

/**
 * @desc 业务数据导入
 */
function importExcel() {
    var rows = $('#queryDatagrid').datagrid('getSelections');
    if (rows.length == 1) {
        dataId = rows[0].oid;
    } else {
        top.showAlert("提示", "请选中一条记录", 'info');
		return;
	}
	var templateCode = encodeURI(encodeURI(rows[0].excelTemplateCode));
	top.getDlg("import_excel.htm?templateCode=" + templateCode, "importExcel",
			"导入", 700, 400, false, true, false);
}
