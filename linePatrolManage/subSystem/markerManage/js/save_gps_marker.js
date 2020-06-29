
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
	var comboxid='';
	var singleDomainName='';	// 单选值域
	comboxid+='markertype'+',';
	singleDomainName+='markertype'+",";
	loadSelectData(comboxid,singleDomainName);
	//初始化管线
    initLineLoopRangeComboTree('lineloopoid');
	setComboObjWidth('lineloopoid',0.281,'combobox');

    /**
     * @desc 添加数据-保存
     */
    $("#saveButton").on("click", function(event){
        event.preventDefault();
        disableButtion("saveButton");
        var bool=$("#gpsMarkerForm").form('validate');
        if(bool==false){
            enableButtion("saveButton");
            return bool;
        }
        $.ajax({
            url : rootPath+"/gpsmarker/save.do",
            type: "post",
            async: false,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data:JSON.stringify($("#gpsMarkerForm").serializeToJson()),
            success: function(data){
                if(data.status==1){
                    top.showAlert("提示", "保存成功", 'info', function() {
                        reloadData("query_gps_marker.html","#gpsMarkerdatagrid");
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
    })
});





/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsMarker");
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


/**
 * @desc 加载新增，修改单选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param singleDomainName 值域名称，以逗号隔开
 */
function loadSelectData(comboxid,singleDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select = comboxid.split(",");
		var singleDomainNameArr = singleDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.281,'combobox');
		}
	}
}


