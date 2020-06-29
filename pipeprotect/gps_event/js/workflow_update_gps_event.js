/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID

var businessId = "";	// 用于附件判断业务ID

var constructionid = "";
var constructionidname = "";
var user = JSON.parse(sessionStorage.user);

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='eventtype'+',';
	singleDomainName+='eventType'+","
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	showMap();
	initGuardian();
	
	//初始化部门
	initUnitComboTree('unitid');
	setComboObjWidth('unitid',0.270,'combobox');
	
	getFileListInfo(pkfield, "update", {
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:2,  // 上传文件的个数 不传默认值为200
	},"1"); // 获取文件信息
	getPicListInfo(pkfield, "update", "", {
		//url : rootPath+"/attachment/upload.do",
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:2,  // 上传文件的个数 不传默认值为200
		extensions:"png", // 默认"gif,jpg,jpeg,bmp,png"
	},"2");  
});

/**
 * 控制第三方施工标签显隐
 * @param eventtype
 * @returns
 */
function initConstructionHTML(eventtype){
	if(eventtype == '06'){
		var rs = '<td id="constructionTdname" width="20%">\
			<span style="color:red;vertical-align: bottom;margin-right:5px">*</span>\
			<span>第三方施工上报：</span>\
		</td>\
		<td id="constructionTd" width="30%">\
			<input id="constructionidname" name="constructionidname" onclick="selectConstruct()" class="easyui-validatebox input_bg" required="true" ></input>\
		</td>';
		$('#constructionTr').append(rs);
		$('#constructionidname').validatebox();
		$('#constructionid').val(constructionid);
		$('#constructionidname').val(constructionidname);
//		$("#constructionidname").rules("add",{required:true});
	}else{
		$('#constructionid').val('');
		$('#constructionidname').val('');
		$('#constructionTdname').remove();
		$('#constructionTd').remove();
	}
}

function initGuardian(){
	$('#guardian').combobox({
		panelHeight:150,
		editable:true,
		valueField : "codeid",
		textField : "codename"
	});
	setComboObjWidth('guardian',0.270,'combobox');
}

function getGuardian(unitid){
	$('#guardian').combobox({
		panelHeight:100,
		url : rootPath+'/gpsconstruction/getInspectorByUnit.do?unitid='+unitid+'&inspectortype=01',
		valueField : "oid",
		textField : "insname"
	});
	setComboObjWidth('guardian',0.270,'combobox');
}


/**
 * 选择第三方施工上报信息
 * @returns
 */
function selectConstruct(){
	top.getDlg("../gps_construction/selectconstruction/select_gps_construction.html?unitid="+user.unitId+"&constructionid="+$('#constructionid').val(),
			"selectGpsConstruction","选择第三方施工上报信息",900,650,false,true,true);
}

/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTree(unitid){
	/* 以下初始化查询面板 */
	/* 部门 */
	$('#'+unitid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName",
		onSelect:function(node){
			getGuardian(node.id);
		},
		onLoadSuccess:function(data){
//			$('#'+unitid).combotree('setValue', user.unitId);
			getGuardian(user.unitId);
			//初始化管线
			initLineLoopComboTree('lineloopoid');
			setComboObjWidth('lineloopoid',0.270,'combobox');
		}
	});
	$.ajaxSettings.async = false;
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		$('#'+unitid).combotree('loadData', result.data);
	})
    setComboObjWidth(unitid,0.172,'combobox');
}

function initLineLoopComboTree(lineloopoid){
	/* 以下初始化查询面板 */
	$('#'+lineloopoid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "id",
		textField : "text",
		onBeforeSelect: function (node) {
			if(node.children == null || node.children.length > 0){
					return false;
			}
		},
		onSelect:function(node){
		},
		onLoadSuccess:function(data){
			$('.tree').find('.tree-folder-open').closest('div.tree-node').css("color","#808080");
			getGpsEventById();
		}
	});
	$.post(rootPath+'/gpslineloop/getLineLoopChildren.do',function(result){
		console.log(result);
		$('#'+lineloopoid).combotree('loadData', result.data);
	})
}

/**
 * @desc 上传图片执行成功之后上传附件
 */
function updatePicSuccessFun(){
	updateFileFun(updateSuccessFun);
}

/**
 * @desc 上传附件执行成功之后上传图片
 */
function  updateFileSuccessFun(){
	updatePicFun(updateSuccessFun);
}

/**
 * @desc 修改成功之后执行的函数
 */
function updateSuccessFun(){
	parent.approve();
}

function saveAndApprove(){
	updateGpsEvent();
}

/**
 * @desc 修改数据-保存
 */
function updateGpsEvent(){
	disableButtion("saveButton");
	var bool=$('#gpsEventForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpsevent/update.do",
		type: "post",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsEventForm').serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
	    		updateFileFun(updateFileSuccessFun);  // 先上传附件 后上传图片
			}else if(data.code == "400") {
				top.showAlert("提示", "更新失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
}


/**
 * @desc 获得数据
 */
function getGpsEventById(){
	$.ajax({
		url : rootPath+"/gpsevent/getInfo.do",
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
	$('#unitid').combotree('setValue',jsondata.unitid);
	$('#lineloopoid').combotree('setValue',jsondata.lineloopoid);
	$('#occurrencetime').val(jsondata.occurrencetime);
	$('#occurrencesite').val(jsondata.occurrencesite);
	$('#lon').val(jsondata.lon);
	$('#lat').val(jsondata.lat);
	$('#keypointname').val(jsondata.keypointname);
	$('#keypointnamename').val(jsondata.keypointnamename);
	$('#describe').val(jsondata.describe);
//	$('#solution').val(jsondata.solution);
	$('#guardian').combobox('setValue',jsondata.guardian);
	$('#reportperson').val(user.oid);
	$('#reportpersonname').val(user.userName);
	constructionid = jsondata.constructionid;
	constructionidname = jsondata.constructionidname;
	$('#eventtype').combobox('setValue',jsondata.eventtype);
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
					initConstructionHTML(row.codeId);
					$(".validatebox-readonly").css("background-color","#f3f3ef");
				},
				onLoadSuccess:function(data){
					if(data.length>0){
//						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.270,'combobox');
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
//						$('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.270,'combobox');
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
	top. closeDlg("updateGpsEvent");
}



/**
 * 选择第三方事件回调
 * @param dataId
 * @param projectname
 * @param happenbegindate
 * @returns
 */
function selectconstructcallback(dataId, projectname, happenbegindate){
	$('#constructionid').val(dataId);
	if(dataId == null || dataId == ''){
		$('#constructionidname').val('');
	}else{
		$('#constructionidname').val(projectname+' ('+happenbegindate+')');
	}
}

function temporarykeypoint(){
	if($('#unitid').combotree('getValue') == null || $('#unitid').combotree('getValue') == ''){
		top.showAlert("提示", "请先选择部门！", 'info');
		return;
	}
	if($('#guardian').combobox('getValue') == null || $('#guardian').combobox('getValue') == ''){
		top.showAlert("提示", "请先选择事件监护人员！", 'info');
		return;
	}
	if($('#lon').val() == null || $('#lon').val() == '' || $('#lat').val() == null || $('#lat').val() == ''){
		top.showAlert("提示", "请先选择坐标！", 'info');
		return;
	}
	if($('#keypointname').val() == null || $('#keypointname').val() == ''){
		top.getDlg("../../linePatrolManage/insTask/temporaryKeypoint/save_gps_temporary_keypoint_construct.html?lon="+$('#lon').val()+"&lat="+$('#lat').val()
				+"&inspectoroid="+$('#guardian').combobox('getValue')+"&unitid="+$('#unitid').combotree('getValue')+"&consDialogname=updateGpsEvent"
				+"&temporarykeypointtype=02",
				"addGpsTemporaryKeypointconstruct","添加临时关键点",800,600,false,true,true);
	}else{
		top.getDlg("../../linePatrolManage/insTask/temporaryKeypoint/update_gps_temporary_keypoint_construct.html?oid="+$('#keypointname').val()
				+"&consDialogname=updateGpsEvent&temporarykeypointtype=02","updateGpsTemporaryKeypointconstruct","修改临时关键点",800,600,false,true,true);
	}
}

function temporarykeypointcallback(temporarykeypointoid, temporarykeypointoidname){
	$('#keypointname').val(temporarykeypointoid);
	$('#keypointnamename').val(temporarykeypointoidname);
}

function showMap(){
	$('#locationXY').on('click',function(){
		addLocation();
	})
}

//弹出加载层
function load(message) {  
    $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");  
    $("<div class=\"datagrid-mask-msg\"></div>").html(message).appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });  
}
//取消加载层  
function disLoad() {  
    $(".datagrid-mask").remove();  
    $(".datagrid-mask-msg").remove();  
}

function showCursor(){
	disLoad();
	top.hideDlg('updateGpsConstruction');
	
	let fra = parent.$("iframe");
	for ( let i = 0; i < fra.length; i++) {
		if (fra[i].id == 'frm2d') {
			fra[i].contentWindow.getXY(getLocationCallBack);
		}
	}
	
	
}

/* 添加位置坐标 */
function addLocation(){
	/* 打开地图 */ 
	if(!top.toShow2d){
		/* 显示二维地图 */
		if(typeof showmap2d != 'undefined'){
			showmap2d();
		}else{
			top.showmap2d();
		}
		
		load("正在加载地图，请稍后...");
		setTimeout('showCursor()',4000);
	}else{
		showCursor();
	}
	
}

function getLocationCallBack(obj){
		console.log('坐标是'+obj)
		let xy = obj.split(',');
		let x = xy[0];
		let y = xy[1];
		/* 给input赋值 */
		$('#lon').val(x);
		$('#lat').val(y);
	    top.showDlg("updateGpsConstruction");
	    
	   top.tab.delMapTab('2d');
}
