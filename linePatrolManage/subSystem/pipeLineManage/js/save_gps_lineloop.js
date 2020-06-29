
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
    initLineLoopLocalComboTree('parentlineloopoid');
	setComboObjWidth('parentlineloopoid',0.281,'combobox');

    /**
     * @desc 添加数据-保存
     */
    $("#saveButton").on("click", function(event){
        event.preventDefault();
        disableButtion("saveButton");
        var bool=$("#gpsLineloopForm").form('validate');
        if(bool==false){
            enableButtion("saveButton");
            return bool;
        }
        $.ajax({
            url : rootPath+"/gpslineloop/save.do",
            type: "post",
            async: false,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data:JSON.stringify($("#gpsLineloopForm").serializeToJson()),
            success: function(data){
                if(data.status==1){
                    top.showAlert("提示", "保存成功", 'info', function() {
                        reloadData("query_gps_lineloop.html","#gpsLineloopdatagrid");
                        closePanel();
                    });
                }else if(data.code == "400") {
                    top.showAlert("提示", "保存失败", 'error');
                    enableButtion("saveButton");
                }else{
                    top.showAlert("提示", data.msg, 'info');
                    enableButtion("saveButton");
                }
            }
        });
        enableButtion("saveButton");
        return businessId;
    })
});





/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsLineloop");
}

/**
 * @desc 重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}


function initLineLoopLocalComboTree(lineloopoid){
    /* 以下初始化查询面板 */
    $('#'+lineloopoid).combotree({
        panelHeight:150,
        editable:true,
        mode:'remote',
        valueField : "id",
        textField : "text",
        onBeforeSelect: function (node) {
            if(node.children == null || node.children.length > 0){
               // return false;
            }
        },
        onSelect:function(node){
            if(beginStationNameid1 != ''){
                $('#'+beginStationNameid1).val('');
            }
            if(endStationNameid1 != ''){
                $('#'+endStationNameid1).val('');
            }
            if(beginStationid != ''){
                $('#'+beginStationid).val('');
            }
            if(endStationid != ''){
                $('#'+endStationid).val('');
            }
        },
        onLoadSuccess:function(node,data){
            $('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
        }
    });
    $.post(rootPath+'/gpslineloop/getAllLineLoopChildren.do',function(result){
        console.log(result);
        $('#'+lineloopoid).combotree('loadData', result.data);
    })
    setComboObjWidth(lineloopoid,0.205,'combobox');
}