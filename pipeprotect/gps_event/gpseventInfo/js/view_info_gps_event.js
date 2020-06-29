
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var businessId = '';    // 附件上传业务ID
var pkfield=getParamter("eventoid");	// 业务数据ID
//当前登陆用户
var user = JSON.parse(sessionStorage.user);

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	businessId = pkfield;
	
	getGpsEventById();
	
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
	masterTableChildHeight();	// 计算标签内容高度
	masterTableChildHeight1('changeinfo');	// 计算标签内容高度
	
	
});

/**
 * @desc 获得数据
 */
function getGpsEventById(){
	$.ajax({
		url : rootPath+"/gpsevent/getInfo.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:false,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
				getGpsCloseEventById();
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
	$("#unitid").html(jsondata.unitidname);
	$("#reportperson").html(jsondata.reportpersonname);
	$("#lineloopoid").html(jsondata.lineloopoidname);
	$("#occurrencetime").html(jsondata.occurrencetime);
	$("#occurrencesite").html(jsondata.occurrencesite);
	$("#eventtypeCodeName").html(jsondata.eventtypeCodeName);
	$("#lon").html(jsondata.lon);
	$("#lat").html(jsondata.lat);
	$("#keypointname").html(jsondata.keypointnamename);
	$("#describe").html(jsondata.describe);
	$("#solution").html(jsondata.solution);
	$("#guardian").html(jsondata.guardianname);
	if(jsondata.eventtype == '06'){
		var rs = '<th width="15%"><span>第三方施工项目名称</span></th>\
			<td width="35%"><span id="constructionid"></span></td>';
		$('#constructionTr').append(rs);
		$("#constructionid").html(jsondata.constructionidname);
	}else{
		var rs = '<td width="15%"></td><td width="35%"></td>';
		$('#constructionTr').append(rs);
	}
}

/**
 * 关闭信息
 */
function getGpsCloseEventById(){
	$.ajax({
		url : rootPath+"/gpseventclose/getInfoByEventoid.do",
		data :{"eventoid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:false,
		success : function(data) {
			if(data.status==1){
				var jsondata = data.data;
				if(jsondata == null){
					return;
				}
				var rs = '<div icon="icon-reload"><div id="contentArea" class="content-area"><div class="content-area-main">\
					<div class="table-content">\
					<h6 class="table-title" id="addchangetitle">关闭信息</h6>\
					<table align="center" class="detail-table" >\
						<tr>\
							<th width="15%"><span>关闭发起人</span></th>\
							<td width="35%"><span id="closestartpersonname"></span></td>\
							<th width="15%"><span>问题解决日期</span></th>\
							<td width="35%"><span id="solvingdate"></span></td>\
						</tr>\
						<tr>\
							<th width="15%"><span>问题解决情况描述（100字以内）</span></th>\
							<td width="85%" colspan="3" style="height:50px"><span id="solvingdescribe"></span></td>\
						</tr>\
					</table></div>\
					</div></div></div>';
				$('#tabContainer').tabs('add',{
					title:'巡检事件关闭信息',
					content:rs,
					selected:false
				});
				
				$('#closestartpersonname').html(user.userName);
				$('#solvingdate').html(jsondata.solvingdate);
				$('#solvingdescribe').html(jsondata.solvingdescribe);
				
				getGpsHarmEventById();
				getGpsDestroyEventById();
				
				if(jsondata.oid==null || jsondata.oid=='' || jsondata.approvestatus==null || jsondata.approvestatus<='02'){
					return;
				}
				rs = '<table id="dg"></table>';
				$('#tabContainer').tabs('add',{
					title:'审批记录',
					content:rs,
					selected:false
				});
				workflow.getWorkflowComments(jsondata.oid,null,function(result){
					if(result.status==-1){
						top.showAlert('警告', '加载审批记录出错，请联系系统管理员！', 'error');
						return;
					}
					var data = result.rows;
					$("#dg").datagrid({
						rownumbers : true,
						pagination : false,
						nowrap:false,
						height : $("#businessInfo").height(),
						columns : [ [ {
							field : 'taskName',
							title : '节点名称',
							width : 120
						}, {
							field : 'approveUserName',
							title : '审批人',
							width : 80,
							align:"center"
						}, {
							field : 'approveTime',
							title : '审批时间',
							width : 200,
							align:"center"
						}, {
							field : 'auditContent',
							title : '审批意见',
							width : 250
						} ] ]
					});
					$("#dg").datagrid("loadData",data);
			 	});
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
 * 伤害记录
 * @returns
 */
function getGpsHarmEventById(){
	$.ajax({
		url : rootPath+"/gpseventharm/getInfoByEventoid.do",
		data :{"eventoid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:false,
		success : function(data) {
			if(data.status==1){
				var jsondata = data.data;
				if(jsondata != null && jsondata.length != 0){
					var rs = '<div id="contentArea" class="content-area"><div class="content-area-main">';
					var j = jsondata.length;
					for(var i=0; i<jsondata.length;i++){
						rs  += '<div class="table-content">\
						    <h6 class="table-title">第'+j+'次伤害记录</h6>\
							<table align="center" class="event-detail-table" >\
								<tr>\
									<th width="15%"><span>时间</span></th>\
									<td width="35%"><span>'+(jsondata[i].harmdate==null?'':jsondata[i].harmdate)+'</span></td>\
								</tr>\
								<tr>\
									<th width="15%"><span>事件描述</span></th>\
									<td width="85%" style="height:50px"><span>'+(jsondata[i].harmdescribe==null?'':jsondata[i].harmdescribe)+'</span></td>\
								</tr>\
								<tr>\
									<th width="15%"><span>原因分析</span></th>\
									<td width="85%" style="height:50px"><span>'+(jsondata[i].reasondescr==null?'':jsondata[i].reasondescr)+'</span></td>\
								</tr>\
								<tr>\
									<th width="15%"><span>处理记录</span></th>\
									<td width="85%" style="height:50px"><span>'+(jsondata[i].solvingrecord==null?'':jsondata[i].solvingrecord)+'</span></td>\
								</tr>\
							</table></div>';
						j--;
					}
					
					rs += '</div></div>';
					$('#tabContainer').tabs('add',{
						title:'巡检事件伤害记录',
						content:rs,
						selected:false
					});
					
				}
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
 * 破坏事件
 * @returns
 */
function getGpsDestroyEventById(){
	$.ajax({
		url : rootPath+"/gpseventdestroy/getInfoByEventoid.do",
		data :{"eventoid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:false,
		success : function(data) {
			if(data.status==1){
				var jsondata = data.data;
				if(jsondata != null && jsondata.length != 0){
					var rs = '<div id="contentArea" class="content-area"><div class="content-area-main">';
					var j = jsondata.length;
					for(var i=0; i<jsondata.length;i++){
						rs  += '<div class="table-content">\
						    <h6 class="table-title">第'+j+'次破坏事件</h6>\
						    <table align="center" class="event-detail-table" >\
								<tr>\
									<th width="15%"><span>时间</span></th>\
									<td width="85%"><span>'+(jsondata[i].destroydate==null?'':jsondata[i].destroydate)+'</span></td>\
								</tr>\
								<tr>\
									<th width="15%"><span>造成损失简述</span></th>\
									<td width="85%" style="height:50px"><span>'+(jsondata[i].destroydescribe==null?'':jsondata[i].destroydescribe)+'</span></td>\
								</tr>\
								<tr>\
									<th width="15%"><span>原因分析</span></th>\
									<td width="85%" style="height:50px"><span>'+(jsondata[i].reasondescr==null?'':jsondata[i].reasondescr)+'</span></td>\
								</tr>\
								<tr>\
									<th width="15%"><span>采取措施</span></th>\
									<td width="85%" style="height:50px"><span>'+(jsondata[i].measures==null?'':jsondata[i].measures)+'</span></td>\
								</tr>\
							</table></div>';
						j--;
					}
					
					rs += '</div></div>';
					$('#tabContainer').tabs('add',{
						title:'巡检事件破坏事件',
						content:rs,
						selected:false
					});
				}
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
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("viewInfoGpsEvent");
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
 * @desc 获取主子表tab切换的内容元素高度
 */
function masterTableChildHeight1(contentArea){
	if (document.getElementById('tabContainer') != null) {
		/*$("#tabContainer").tabs("resize",{
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		});*/
	
		var tabsPanelsHeight = $(".master-table .easyui-tabs").height()-$(".master-table .tabs-header").outerHeight(),
			tabsPanelsPaddingTop = parseInt($(".tabs-panels").css("padding-top")),
			tabsPanelsPaddingBottom = parseInt($(".tabs-panels").css("padding-bottom"));
		$(".tabs-panels").height(tabsPanelsHeight-tabsPanelsPaddingTop-tabsPanelsPaddingBottom-40);
		$("#"+contentArea).height($(".tabs-panels").height()-70);
		$(".tabs-panels .panel-body").height($(".tabs-panels").height());
	}
}

