/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=decodeURI(getParamter("oid"));	// 业务数据ID
var rowIndex = decodeURI(getParamter("rowIndex"));
var lineloopoid = decodeURI(getParamter("lineloopoid"));
var beginlocation = decodeURI(getParamter("beginlocation"));
var endlocation = decodeURI(getParamter("endlocation"));
var beginstation = decodeURI(getParamter("beginstation"));
var endstation = decodeURI(getParamter("endstation"));
var sendHtml = decodeURI(getParamter("sendHtml"));

var unitId = decodeURI(getParamter("unitId"));

var businessId = "";	// 用于附件判断业务ID

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	initLineLoopCombobox('lineloopoid',unitId);
	setComboObjWidth('lineloopoid',0.275,'combobox');
	showPan('beginlocation','endlocation','beginstation','endstation');
	
	$('#lineloopoid').combotree('setValue',lineloopoid);
	$('#oid').val(pkfield);
	$('#beginstation').val(beginstation);
	$('#endstation').val(endstation);
	$('#beginlocation').val(beginlocation);
	$('#endlocation').val(endlocation);
});

/**
 * @desc 修改数据-保存
 */
function updateGpsPlanInfo(){
	disableButtion("saveButton");
	var bool=$('#gpsPlanLineInfoForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	var data = {
			'rowIndex':rowIndex,
			'oid' : pkfield,
			'lineloopoid':$('#lineloopoid').combotree('getValue'),
        	'lineloopoidname':$('#lineloopoid').combotree('getText'),
        	'beginlocation':$('#beginlocation').val(),
        	'endlocation':$('#endlocation').val(),
        	'beginstation':$('#beginstation').val(),
        	'endstation':$('#endstation').val()
	}

    updatePreviousRow(sendHtml+'.html', JSON.stringify(data));
	enableButtion("saveButton");
	closePanel();
}

/**
 * @desc 重新加载数据
 * 
 * @param url 网格所在页面url
 * @param elementId 网格id
 */
function updatePreviousRow(url,data) {
	var iframeArray = top.$("iframe");
	var browser = $.browser;
	for ( var i = 0; i < iframeArray.length; i++) {
		//if ((iframeArray[i].src && iframeArray[i].src.indexOf(url) != -1)||(iframeArray[i].contentWindow.location.href && iframeArray[i].contentWindow.location.href.indexOf(url) != -1)) {
			if (browser.msie && (document.documentMode == '7')) {// 如果浏览器为ie
				// 且文档模式为ie7，则重新载入页面（因为刷新datagrid会导致datagrid显示不全）
				iframeArray[i].contentWindow.location.updateRow(data);
				break;
			} else {
				if(iframeArray[i].id == 'iframe_updateGpsPlanInfo' || iframeArray[i].id == 'iframe_addGpsPlanInfo' ) {
                    iframeArray[i].contentWindow.updateRow(data);
                    break;
				}

			}
		//}
	}
	try {
		parent.updateRow(data);
	} catch (e) {

	}
}


/**
 * @desc 获得数据
 */
function getGpsPlanInfoById(){
	$.ajax({
		url : rootPath+"/gpsplaninfo/get.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}


/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$('#oid').val(jsondata.oid);
	$('#planno').val(jsondata.planno);
	$('#instype').combobox('setValue',jsondata.instype);
	$('#execunitid').combobox('setValue',jsondata.execunitid);
	$('#inspectortype').combobox('setValue',jsondata.inspectortype);
	$('#insfreq').val(jsondata.insfreq);
	$('#insfrequnit').combobox('setValue',jsondata.insfrequnit);
	$('#insfrequnitval').val(jsondata.insfrequnitval);
	$('#insvehicle').combobox('setValue',jsondata.insvehicle);
	$('#insbdate').val(jsondata.insbdate);
	$('#insedate').val(jsondata.insedate);
	$('#determinant').val(jsondata.determinant);
	$('#planflag').combobox('setValue',jsondata.planflag);
	$('#unitid').combobox('setValue',jsondata.unitid);
	$('#beginWorkTime').val(jsondata.beginWorkTime);
	$('#endWorkTime').val(jsondata.endWorkTime);
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
			setComboObjWidth(id,0.29,'combobox');
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
			if(moreDomainNameArr[i]==''){
				continue;
			}
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
			setComboObjWidth(id,0.29,'combobox');
		}
	}
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
 * @desc 关闭修改页面
 */
function closePanel() {
	top. closeDlg("updateGpsPlanLineInfo");
}


