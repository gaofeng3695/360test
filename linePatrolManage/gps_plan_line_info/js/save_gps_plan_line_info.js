
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var sendHtml = getParamter("sendHtml");
var unitId = getParamter("unitId");

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	initLineLoopCombobox('lineloopoid', unitId);

	setComboObjWidth('lineloopoid',0.281,'combobox');
	showPan('beginlocation','endlocation','beginstation','endstation');
	
});


/**
 * @desc 添加数据-保存
 */
function saveGpsPlanInfo(){
	disableButtion("saveButton");
	var bool=$("#gpsPlanLineInfoForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	var data = {
			'lineloopoid':$('#lineloopoid').combotree('getValue'),
        	'lineloopoidname':$('#lineloopoid').combotree('getText'),
        	'beginlocation':$('#beginlocation').val(),
        	'endlocation':$('#endlocation').val(),
        	'beginstation':$('#beginstation').val(),
        	'endstation':$('#endstation').val()
	}
	
	insertRow(sendHtml+'.html', JSON.stringify(data));
	enableButtion("saveButton");
	closePanel();
}

/**
 * @desc 重新加载数据
 * 
 * @param url 网格所在页面url
 * @param elementId 网格id
 */
function insertRow(url,data) {
	var iframeArray = top.$("iframe");
	var browser = $.browser;
	for ( var i = 0; i < iframeArray.length; i++) {
		if ((iframeArray[i].src && iframeArray[i].src.indexOf(url) != -1)||(iframeArray[i].contentWindow.location.href && iframeArray[i].contentWindow.location.href.indexOf(url) != -1)) {
			if (browser.msie && (document.documentMode == '7')) {// 如果浏览器为ie
				// 且文档模式为ie7，则重新载入页面（因为刷新datagrid会导致datagrid显示不全）
				iframeArray[i].contentWindow.location.insertRow(data);
				break;
			} else {
				//iframeArray[i].contentWindow.insertRow(data);
				break;
			}
		}
	}
	try {
		parent.insertRow(data);
	} catch (e) {

	}
}

function compareDate(){
	var startdate = $("#insbdate").val();
	var enddate =   $("#insedate").val();
	startdate=Date.parse(new Date(startdate.replace(/-/g, "/")));
	enddate=Date.parse(new Date(enddate.replace(/-/g, "/")));
	var millTime=enddate-startdate;  //时间差的毫秒数
	return millTime;
}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("saveGpsPlanLineInfo");
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
			if(singleDomainNameArr[i]==''){
				continue;
			}
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

/**
 * @desc 加载新增，修改多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select = comboxid.split(",");
		var moreDomainNameArr = moreDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				multiple:true,
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
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
			setComboObjWidth(id,0.281,'combobox');
		}
	}
}

